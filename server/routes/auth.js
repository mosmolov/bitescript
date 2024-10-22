import express from "express";
import { login, register } from "../controllers/auth.js";

const router = express.Router();

router.route("/register").post(register);       //routes to the login controller
router.route("/login").post(login);             //routes to the login controller

export default router;