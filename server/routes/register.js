const express = require('express')

const bcrypt = require('bcryptjs')

const User = require('../models/user')

const router = express.Router()

const register = router.post('/', async (req,res) => {
    try{
        const { username, email, password } = req.body

        const hashedPassword = await bcrypt.hash(password, 10)

        await User.create({
            username,
            email,
            password: hashedPassword
        })

        await User.save()

        res.status(210).json({
            message: "User registered successfully"
        })
    } catch(err) {
    res.status(500).json({ error: err.message})
    }
})

module.exports = register