const express = requre('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');


exports.login = async(req,res) => {
    const { usernam, password } = req.body;
    try {
        //are we implementing login via username or email?
        const user = await User.findOne({ username });
        if(!user) {
            res.status(400).json({ message: "Incorrect username or password."});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: "Incorrect username or password."});
        }
        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1h" //we can change this later
        });

    } catch(err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
}

exports.register = async(req,res) => {
    const { email, username, password, firstName, lastName } = req.body;
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
        //validtate email
        const newUser  = new User({
            email,
            username,
            password: hashedPassword,
            firstName: firstName || '',
            lastName: lastName || '',
            picture: '', // set to a default picture?
            following: [],
            followers: [],
            createdTimestamp: Date.now()
        });

        await newUser.save();
    } catch(err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
}