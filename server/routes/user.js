const express = require('express')

const router = express.Router()

const User = require('../models/user')

const jwt = require('jsonwebtoken')

const session = require('express-session')

require('dotenv').config()

const username = router.get('/me', async (req, res) => {
    try{
        const token = req.cookies.token

        if(!token){
            return res.status(401).json({
                message: 'Not logged in'
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)



        const user = await User.findById(decoded.id)
            .select('username')

        if(!user){
            return res.status(401).json({
                message: 'User not found'
            })
        }

        res.json({
            username: user.username
        })
    } catch(err) {
        res.status(401).json({
            message: 'Invalid or expired token'
        })
    }
})

module.exports = username