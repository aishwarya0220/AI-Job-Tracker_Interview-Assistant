const express = require('express')

const bcrypt = require('bcryptjs')

const User = require('../models/user')

const router = express.Router()

const register = router.post('/', async (req,res) => {
    try{
        const { username, email, password } = req.body

        const hashedPassword = await bcrypt.hash(password, 10)

        const existingUser = await User.findOne({
            $or: [
                {username: username},
                {email: email}
            ]
        })

        if(existingUser){
            return res.status(409).json('User already exists')
        }

        const user = await User.create({
            username,
            email,
            password: hashedPassword
        })

        res.status(201).json({
            message: "Registration successful",
            user
        })
    } catch(err) {
    res.status(500).json({ error: err.message})
    }
})

module.exports = register