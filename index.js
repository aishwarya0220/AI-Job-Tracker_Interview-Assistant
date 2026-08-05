const express = require('express')          // import express module

const app = express()

const PORT = 8000

app.get('/',(req,res) => {
    res.send("This is the homepage")
})

app.listen(
    PORT,
    () => console.log(`server running on localhost:${PORT}`)
)