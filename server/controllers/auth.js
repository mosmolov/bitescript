import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";


export const login = async(req,res) => {
    const { username, password } = req.body;
    try {
        //are we implementing login via username or email?
        const user = await User.findOne({ username });
        const isMatch = await bcrypt.compare(password, user.password);
        if(!user || !isMatch) {
            res.status(400).json({ message: "Incorrect username or password."});
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1h" //we can change this later
        });

        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict', // Prevent CSRF attacks
            maxAge: 1 * 60 * 60 * 1000, // 1 hour
        });

        res.status(201).json({
            message: "User authenticated successfully",
            token,
            user,
        })

    } catch(err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
}

export const register = async(req,res) => {
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
        });

        await newUser.save();
        res.status(201).json({
            message: "User created successfully",
            user: {
                id: newUser._id,
                email: newUser.email,
                username: newUser.username,
                firstName: newUser.firstName,
                lastName: newUser.lastName
            },
        })
    } catch(err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
}