import express from "express";
import * as func from "../controllers/auth.js";

const router = express.Router();

//login routes
router.get("/login", func.get_login);
router.post("/login", func.post_login);
router.post("/register", func.post_register);
router.get("/token/:token", func.get_token);

export default router;
