import jwt from "jsonwebtoken";

function generateAcessToken(id) {
    const token = jwt.sign({ id: id }, process.env.ACESS_TOKEN_SECRET, {
      expiresIn: "1h",
    });
    return token;
}

const verify_token = async(req,res,next) => {
    jwt.verify(req.cookies.token,process.env.ACESS_TOKEN_SECRET, (err, decoded) => {
        if(err){
            jwt.verify(req.cookies.refreshToken,process.env.ACESS_TOKEN_SECRET, (err, dec)=>{
                if(err){
                    res.status(403).send("Token is not valid");
                    return;
                }
                const newToken = generateAcessToken(decoded.id)
                res.cookie("token", newToken, {httpOnly: true});
                next();
            })
        }
        next();
    })
}