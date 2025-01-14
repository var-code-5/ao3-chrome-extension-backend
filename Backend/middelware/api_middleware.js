import jwt from "jsonwebtoken";
import env from "dotenv";

env.config();

function generateAccessToken(id, username) {
    return jwt.sign({ "id": id, "username": username }, process.env.ACESS_TOKEN_SECRET, {
        expiresIn: "1h",
    });
}

export const verify_token = async (req, res, next) => {
    if (!req.headers.tokens) {
        return res.status(401).json({ error: 'No credentials sent!' });
    }

    try {
        // console.log(req.headers.tokens);
        let token = req.headers.tokens
        if (typeof token === 'object') {
            token = JSON.stringify(token);
          }
        const tokens = JSON.parse(req.headers.tokens);
        const { accessToken, refreshToken } = tokens;

        jwt.verify(accessToken, process.env.ACESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (refreshErr, refreshDecoded) => {
                    if (refreshErr) {
                        return res.status(403).json({ message: "Token is not valid" });
                    }
                    else{
                        const newAccessToken = generateAccessToken(refreshDecoded.id, refreshDecoded.username);
                        res.status(200).json({ accessToken: newAccessToken,refreshToken: refreshToken});
                        req.body.ao3_user = refreshDecoded.username;
                        req.body.id = refreshDecoded.id;
                    }
                });
            } else {
                req.body.ao3_user = decoded.username;
                req.body.id = decoded.id;
                next();
            }
        });
    } catch (err) {
        console.error(err);
        res.status(403).json({ message: "Token is not provided or invalid. Please login." });
    }
};