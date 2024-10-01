const express = requre('express');
const bcrypt = require('bcrypt');
const router = express.router();

const User = require('../models/user');


exports.login = async(req,res) => {
    try {
        
    } catch(err) {

    }
}

exports.register = async(req,res) => {
    const { username, password, firstName, lastName } = req.body;
    try {
        //username has to be unique
        const user = await User.findOne({ username });
        if (user) {
            res.status(400).json({ message: "Username already in use."});
        }
        //password requirements?
        if (password.length < 8){
            res.status(400).json({ message: "Password must be at least 8 characters."});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser  = new User({
            username,
            hashedPassword,
            firstName,
            lastName
        });

        await newUser.save();
    } catch(err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
}