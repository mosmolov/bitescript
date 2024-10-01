const express = require("express");
const router = express.Router();

const { regsiter, register } = require("../controllers/auth");
router.route("/register").post(register);

module.exports = router;