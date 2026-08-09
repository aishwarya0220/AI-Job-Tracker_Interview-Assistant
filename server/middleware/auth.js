const express = require('express')

require('dotenv').config()

const jwt = require('jsonwebtoken')

const authenticationToken = ((req, res, next) => {
    try{
    const request = req.headers.authorization.split(" ")
    
    const token = request[1]

    if(!token){
        res.status(401).json({message: 'Access denied: No token provided'})
    }

    const decodedPayload = jwt.verify(token, process.env.JWT_SECRET)

    req.user = decodedPayload
    
    next()
    
    } catch(err) {
        res.status(401).json("Unauthorized")
    }
})

module.exports = authenticationToken