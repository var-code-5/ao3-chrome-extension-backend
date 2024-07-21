import jwt from "jsonwebtoken";

function generateAcessToken(id,username) {
    const token = jwt.sign({ "id": id , "username":username}, process.env.ACESS_TOKEN_SECRET, {
      expiresIn: "1h",
    });
    return token;
}

export const verify_token = async(req,res,next) => {
    try{
        const token = req.cookies.token;
        jwt.verify(token,process.env.ACESS_TOKEN_SECRET, (err, decoded) => {
            if(err){
                jwt.verify(req.cookies.refreshToken,process.env.ACESS_TOKEN_SECRET, (err, dec)=>{
                    if(err){
                        res.status(403).send("Token is not valid");
                        return;
                    }
                    const newToken = generateAcessToken(decoded.id,decoded.username)
                    res.cookie("token", newToken, {httpOnly: true});
                    req.body.ao3_user = dec.username;
                    next();
                })
            }
            req.body.ao3_user = decoded.username;
            next();
        })
    }
    catch(err){
        res.status(403).send("Token is not provided login");
        return;
    }
}