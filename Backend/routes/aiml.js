import express from "express";
import {get_recommendations} from '../controllers/aiml.js';
import {verify_token} from '../middelware/api_middleware.js';
import cookieParser from "cookie-parser";
import bodyParser from 'body-parser';
import cors from "cors";

const router = express.Router();
router.use(cookieParser());
router.use(bodyParser.urlencoded({ extended: true }));

var whitelist = [
    "https://ao3-chrome-extension-website.vercel.app/",
    "chrome-extension://nnmmeljlhmhpnfphcpifdahblfmhlilm",
    "http://localhost:5173",
    "http://localhost:5174"
  ];
  var corsOptions = {
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  };

// api routes
router.get('/recom', cors(corsOptions),verify_token, get_recommendations);
// router.get("/test",(req,res)=>{res.send({"status":"ok"})});

export default router;