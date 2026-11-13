const express = require('express')

require('dotenv').config()

const jwt = require('jsonwebtoken')

const authenticationToken = ((req, res, next) => {
    try{
    
    const token = req.cookies.token

    console.log('Auth debug:', {
        origin: req.headers.origin,
        cookieReceived: !!req.cookies?.token,
        userAgent: req.headers['user-agent']
    })

    if(!token){
        return res.status(401).json({message: 'Access denied: No token provided'})
    }

    const decodedPayload = jwt.verify(token, process.env.JWT_SECRET)

    req.user = decodedPayload
    
    next()
    
    } catch(err) {
        res.status(401).json("Unauthorized")
    }
})

module.exports = authenticationToken