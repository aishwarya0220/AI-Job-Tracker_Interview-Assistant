const express = require('express')          // import express module

const mongoose = require('mongoose')

const app = express()

const cors = require('cors')

const registerRouter = require('./server/routes/register')

const authenticationRouter = require('./server/routes/auth')

const jobsRouter = require('./server/routes/jobs')

const PORT = 8000

const cookieParser = require('cookie-parser')

mongoose.connect("mongodb://127.0.0.1:27017/mydatabase")
    .then(() => console.log("Connected"))
    .catch(err => console.log(err))

app.get('/',(req,res) => {
    res.send("This is the homepage")
})

app.use(express.json())

app.use(cookieParser())

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))

app.use("/register", registerRouter)

app.use('/authentication',authenticationRouter)

app.use('/jobs', jobsRouter)

app.listen(
    PORT,
    () => console.log(`server running on localhost:${PORT}`)
)