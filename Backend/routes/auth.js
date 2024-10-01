import express from "express";
import * as func from "../controllers/auth.js";
import { hashPassword } from "../middelware/auth_middleware.js";
import bodyParser from 'body-parser';
import {verify_token} from "../middelware/api_middleware.js";
import cors from "cors";

const router = express.Router();
router.use(bodyParser.urlencoded({extended: true}));

var whitelist = [
    "https://ao3-chrome-extension-website.vercel.app/",
    "chrome-extension://nnmmeljlhmhpnfphcpifdahblfmhlilm",
    "http://localhost:5173",
    "http://localhost:5174",
    "*"
  ];
  var corsOptions = {
    origin: function (origin, callback) {
      console.log("Request Origin:", origin);
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  };

//login routes
// router.get("/login", func.get_login); //use this when using the register file with backend
router.post("/login", cors(corsOptions),func.post_login);
router.post("/register", hashPassword,cors(corsOptions) ,func.post_register);
router.get("/token/:token",func.get_token);
router.get("/validate",cors(corsOptions), verify_token,func.get_verify);

export default router;
