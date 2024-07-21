import express from "express";
import {get_recommendations} from '../controllers/aiml.js';
import {verify_token} from '../middelware/api_middleware.js';
import cookieParser from "cookie-parser";
import bodyParser from 'body-parser';

const router = express.Router();
router.use(cookieParser());
router.use(bodyParser.urlencoded({ extended: true }));

// api routes
router.get('/recom', verify_token, get_recommendations);
// router.get("/test",(req,res)=>{res.send({"status":"ok"})});

export default router;