const express = require('express')          // import express module

const mongoose = require('mongoose')

const app = express()

const registerRouter = require('./server/routes/register')

const authenticationRouter = require('./server/routes/auth')

const profile = require('./server/routes/profile')

const PORT = 8000

mongoose.connect("mongodb://127.0.0.1:27017/mydatabase")
    .then(() => console.log("Connected"))
    .catch(err => console.log(err))

app.get('/',(req,res) => {
    res.send("This is the homepage")
})

app.use(express.json())

app.use("/register", registerRouter)

app.use('/authentication',authenticationRouter)

app.use('/profile', profile)

app.listen(
    PORT,
    () => console.log(`server running on localhost:${PORT}`)
)