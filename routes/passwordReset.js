const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { authUser, authRole } = require("../middleware/check-auth")
const { nanoid } = require("nanoid");
const sendEmail = require("../middleware/email")


const User = require("../models/user");
const Token = require("../models/token")

const router = express.Router();

router.get("/sendCode/:email", (req, res, next) => {
    let email = req.params.email
    User.findOne({ email: email }).then((user) => {
        console.error(user)
        if (!user) {
            return res.status(402).json({
                error: 'error',
                title: 'Error',
                message: " No User with that email address",
            });
        }
        function betweenRandomNumber() {
            return Math.floor(
                Math.random() * (9999 - 1000 + 1) + 1000
            ).toString()
        }
        let code = betweenRandomNumber()
        console.error('code:', code)

        //   let id = nanoid()

        let token = new Token({
            userId: user._id,
            token: code,
        })
        token.save().then((result) => {

            const message = code;
            sendEmail(user.email, "Verify Email", message)
            res.status(201).json({
                message: 'An email was sent to you to you with a verification code'
            })

        }).catch((err) => {
            console.error('token error', err)
        })
    })
})

router.get("/verify/:code", (req, res, next) => {
    console.error(req.params.code)
    Token.findOne({ token: req.params.code }).then((token) => {
        if (!token) {
            return res.status(401).json({
                error: 'error',
                title: 'Unable to Verify',
                message: 'You entered an invalid verification code'
            })
        } else {
            Token.findByIdAndDelete(token._id).then(deleted => {
                console.error('deleted:', deleted)
                return res.status(201).json({
                    userId: token.userId,
                    message: 'Code correct, enter a new Password'
                })
            })
        }
    })
})

router.put("/passwordReset/:id", (req, res, next) => {
    console.error(req.body)
    let password = req.body.password
    console.error('password:', password)
    bcrypt.hash(password, 10).then((hash) => {
        const user = new User({
            password: hash
        })
        User.findByIdAndUpdate(req.params.id, {$set:{password: hash}}).then((user) => {
            if (!user) {
                return res.status(401).json({
                    error: 'error',
                    title: 'No User',
                    message: 'No User Found'
                })
            } else {
                return res.status(201).json({
                    message: 'Password Updated! '
                })
            }
        })

    })

})

module.exports = router;