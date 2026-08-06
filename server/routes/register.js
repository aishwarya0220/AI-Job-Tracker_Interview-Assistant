const express = require('express')

const router = express.Router()

router.post('/', (req,res) => {
    res.send("Route working")
})

module.exports = router