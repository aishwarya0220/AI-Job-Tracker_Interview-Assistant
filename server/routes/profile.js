const express = require('express')

const authenticationToken = require('../middleware/auth')

const router = express.Router()

const profile = router.get('/', authenticationToken, (req, res) => {
    res.json('Authenticated User')
})

module.exports = profile