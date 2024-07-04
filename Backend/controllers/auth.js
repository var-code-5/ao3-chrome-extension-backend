import path from "path";
import { fileURLToPath } from "url";
import db from "../models/pgsql.js";
import bcrypt from "bcrypt";

const saltRounds = 10;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const views_path = path.join(__dirname, "..", "views");

export const get_login = (req, res) => {
  res.sendFile(path.join(views_path, "register.html"));
};

export const post_login = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  db.query("SELECT * FROM login WHERE email = $1", [email], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Server error");
      return;
    }
    if (result.rows.length === 0) {
      res.status(401).send("Invalid credentials");
      return;
    }
    const user = result.rows[0];
    if (!bcrypt.compare(password, result.rows[0].password)) {
      res.status(401).send("Invalid credentials");
      return;
    }
    //auth sucess
    //add jwt token logic here
    res.send("authSuccess");
    res.redirect("/dashboard");
  });
};

export const post_register = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;

  // Check if user exists
  db.query("SELECT * FROM login WHERE email = $1", [email], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Server error");
      return; 
    }
    else if (result.rowCount !== 0) {
      res.status(409).send("Email already exists");
      return;
    }
    // if he dosen't Store in database
    else{
      bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
      if (err) {
        console.error(err);
        res.status(500).send("Server error");
        return;
      }
      db.query(
        "INSERT INTO login (username,email,password) VALUES($1,$2,$3)",
        [username, email, hashedPassword],
        (err, result) => {
          if (err) {
            console.error(err);
            res.status(500).send("Server error");
            return;
          }

          res.send("Registration successful");
          // Node mailer will send mail to the user
        }
        );
      });
    }
  });
}