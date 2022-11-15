const express = require('express')
const route = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../models/userModel')
const authMiddleware = require('../middlewares/authMiddleWare')


route.post("/login", async(req, res) => {
    try {

        const user = await User.findOne({ email: req.body.email })

        if (!user) {
            return res.status(200).send({ message: 'User not found, Please register', success: false })
        }

        const isMatch = await bcrypt.compare(req.body.password, user.password)

        if (!isMatch) {
            return res.status(200).send({ message: "Password is incorrect", success: false })
        } else {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                expiresIn: '1d'
            })

            return res.status(200).send({ message: "login Successful", success: true, data: token })
        }


    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error logging in", success: false, error });
    }
})

route.post("/register", async(req, res) => {
    try {
        console.log(req.body)
        const userExists = await User.findOne({ email: req.body.email });
        if (userExists) {
            return res
                .status(200)
                .send({ message: "User already exists", success: false });
        }
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        req.body.password = hashedPassword;
        const newuser = new User(req.body);
        await newuser.save();
        res
            .status(200)
            .send({ message: "User created successfully", success: true });
    } catch (error) {
        console.log(error);
        res
            .status(500)
            .send({ message: error.message, success: false, error });
    }
});

route.post("/get-user-info-by-id", authMiddleware, async(req, res) => {
    try {
        const user = await User.findOne({ _id: req.body.userId });
        user.password = undefined;
        if (!user) {
            return res
                .status(200)
                .send({ message: "User does not exist", success: false });
        } else {
            res.status(200).send({
                success: true,
                data: user,
            });
        }
    } catch (error) {
        res
            .status(500)
            .send({ message: "Error getting user info", success: false, error });
    }
});

module.exports = route