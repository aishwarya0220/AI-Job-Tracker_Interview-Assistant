const express = require('express')          // import express module

const mongoose = require('mongoose')

const app = express()

const registerRouter = require('./routes/register')

const PORT = 8000

mongoose.connect("mongodb://127.0.0.1:27017/mydatabase")
    .then(() => console.log("Connected"))
    .catch(err => console.log(err))

app.get('/',(req,res) => {
    res.send("This is the homepage")
})

app.use("/register", registerRouter)

app.listen(
    PORT,
    () => console.log(`server running on localhost:${PORT}`)
)