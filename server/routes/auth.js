const express = require("express");
const router = express.Router();

const { login, register } = require("../controllers/auth");
router.route("/register").post(register);       //routes to the login controller
router.route("/login").post(login);             //routes to the login controller

module.exports = router;