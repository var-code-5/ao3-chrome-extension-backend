import path from "path";
import { fileURLToPath } from "url";
import db from "../models/pgsql.js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import env from "dotenv";
import jwt from "jsonwebtoken";

env.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const views_path = path.join(__dirname, "..", "views");

var transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.MAIL_ADDRESS,
    pass: process.env.MAIL_PASSWORD,
  },
});

function generateAcessToken(id,username) {
  const token = jwt.sign({ "id": id , "username":username}, process.env.ACESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });
  return token;
}

function generateRefreshToken(email,name,id) {
  const refreshToken = jwt.sign(
    { "email": email ,
      "username" : name ,
      "id" : id 
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "15d" }
  );
  return refreshToken;
}

async function verifyMail(email, token) {
  // send mail with defined above transport object
  const link = "https://ao3-chrome-extension-backend.onrender.com/auth/token/" + token;
  const info = await transporter.sendMail({
    from: '"AO3" <ao3gdsc@gmail.com>', // sender address
    to: email, // user email address
    subject: "Conform Your Mail Account", // Subject line
    html: `to activate your account please follow the link <a href="${link} >HERE</a> you will be redirected to AO3 website after this </br> <b>Note : this link will expire in one hour</b>`, // html body
  });
}

export const get_login = (req, res) => {
  res.sendFile(path.join(views_path, "register.html"));
};

export const post_login = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  
  try {
    // Query the database for the user
    const result = await db.query("SELECT * FROM login WHERE email = $1", [email]);
    
    if (result.rows.length === 0) {
      res.status(401).json({meassage:"User does not exist"});
      return;
    }
    
    const user = result.rows[0];
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({meassage:"Invalid credentials"});
      return;
    }
    
    // Check if user is verified
    if (user.verified === 'false') {
      res.status(403).json({message:"Please verify your mail address"});
      verifyMail(email, jwt.sign({ "email": email }, process.env.ACESS_TOKEN_SECRET, { expiresIn: "1h" }));
      return;
    }
    
    // Auth success
    const token = generateAcessToken(user.id, user.username);
    const refreshToken = generateRefreshToken(email, user.username, user.id);
    
    // res.cookie("refreshToken", refreshToken, {path: '/', httpOnly: false,sameSite: 'lax',maxAge:30 * 24 * 60 * 60 * 1000 , secure:false });
    // res.cookie("token", token, { path: '/',httpOnly: false,sameSite: 'lax',maxAge:30 * 24 * 60 * 60 * 1000 , secure:false });
    
    // res.cookie("refreshToken", refreshToken, {path: '/dashboard', httpOnly: false,sameSite: 'lax',maxAge:30 * 24 * 60 * 60 * 1000 , secure:false });
    // res.cookie("token", token, { path: '/dashboard',httpOnly: false,sameSite: 'lax',maxAge:30 * 24 * 60 * 60 * 1000 , secure:false });

    res.status(200).json({ accessToken: token,refreshToken: refreshToken });
    // res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    res.status(500).json({message:"Server error"});
  }
};


export const post_register = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  // Check if user exists
  db.query("SELECT * FROM login WHERE email = $1", [email], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({message:"Server error"});
      return;
    } else if (result.rowCount !== 0) {
      res.status(409).json({message:"Email already exists"});
      return;
    }
    // if user dosen't exist
    else {
      db.query(
        "INSERT INTO login (username,email,password) VALUES($1,$2,$3)",
        [username, email, password],
        (err, result) => {
          if (err) {
            console.error(err);
            res.status(500).json({message:"Server error"});
            return;
          }
          res.status(200).json({"sucess":"true",
            "msg":"Check your email"
          });
          // Node mailer will send mail to the user
          verifyMail(
            email,
            jwt.sign({ "email": email }, process.env.ACESS_TOKEN_SECRET, {
              expiresIn: "1h",
            })
          );
        }
      );
    }
  });
};

export const get_token = (req, res) => {
  const token = req.params.token;
  jwt.verify(token, process.env.ACESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      res.status(403).json({message:"Token is not valid"});
      return;
    } else {
      db.query("UPDATE login SET verified = true WHERE email = $1;", [
        decoded.email,
      ]);
      //sucessful verification of email
      res.status(200).json({message:"verified email"});
      //add refresh token logic
    }
  });
};


export const get_verify = (req, res) => {
  res.json({message:"success"});
};

export const patch_change_username = (req, res) => {
  const id = req.body.id;
  const new_username = req.body.new_username;

  db.query("UPDATE login SET username = $1 WHERE id = $2;", [new_username, id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({message:"Server error"});
      return;
    } else if (result.rowCount === 0) {
      res.status(404).json({message:"User not found"});
      return;
    } else {
      res.status(200).json({message:"Username changed successfully"});
    }
  });
}

export const get_username = (req, res) => {
  const id = req.body.id;

  db.query("SELECT * FROM login WHERE id = $1;", [id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({message:"Server error"});
      return;
    } else if (result.rowCount === 0) {
      res.status(404).json({message:"User not found"});
      return;
    } else {
      res.status(200).json({username: result.rows[0].username, email: result.rows[0].email});
    }
  });
}