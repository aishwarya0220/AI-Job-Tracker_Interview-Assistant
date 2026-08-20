const express = require('express')

const router = express.Router()

require('dotenv').config()

const logOut = router.post('/', (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: false,
        path: '/'
        // sameSite: 'lax'
    })

    res.status(200).json({
        message: 'Logged out successfully'
    })
})

module.exports = logOut