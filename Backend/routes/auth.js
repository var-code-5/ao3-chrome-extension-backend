import express from "express";
import * as func from "../controllers/auth.js";
import { hashPassword } from "../middelware/auth_middleware.js";

const router = express.Router();

//login routes
// router.get("/login", func.get_login); //use this when using the register file with backend
router.post("/login", func.post_login);
router.post("/register", hashPassword ,func.post_register);
router.get("/token/:token", func.get_token);


export default router;
