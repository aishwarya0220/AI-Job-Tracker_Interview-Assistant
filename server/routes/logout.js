const express = require('express')

const router = express.Router()

require('dotenv').config()

const logOut = router.get('/', (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    })

    res.status(200).json({
        message: 'Logged out successfully'
    })
})

module.exports = logOut