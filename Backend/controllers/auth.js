import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const views_path = path.join(__dirname,'..','views');

export const get_login = (req,res)=>{
    res.sendFile(path.join(views_path,'register.html'));
}

export const post_login = (req,res)=>{
    res.send(req.body);
};

export const post_register = (req,res)=>{
    res.send(req.body);
};