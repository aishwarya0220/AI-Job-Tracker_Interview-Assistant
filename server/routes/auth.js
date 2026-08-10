require('dotenv').config()

const express = require('express')

const router = express.Router()

const jwt = require('jsonwebtoken')
const User = require('../models/user')

const jwtSecret = process.env.JWT_SECRET

const bcrypt = require('bcryptjs')

const login = router.post('/', async (req, res) => {
    try {
    const { login, password } = req.body

    const user = await User.findOne({
        $or: [
            {email: login},
            {username: login}
        ]
    })

    if(!user){
        return res.status(401).json({
            message: 'Invalid credentials'
        })
    }

    const validPassword = await bcrypt.compare(
        password, user.password
    )

    if(!validPassword){
        return res.status(401).json({
            message: 'Invalid credentials'
        })
    }

    if(validPassword){
        const token = jwt.sign(
            {
                id: user._id,
                username: user.username,
            },
            jwtSecret,
            {expiresIn: '7d'}
        )
        res.status(200).json( {token} )
    }


} catch(err){
    res.status(500).json({error: err.message})
}
})

module.exports = login