const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'username is required'],
        trim: true
    }, 

    email: {
        type: String,
        unique: [true, 'email is required'],
        lowercase: true,
        trim: true,
        match: [[/^\S+@\S+\.\S+$/, 'Please enter a valid email address']]
    },

    birthdate: {
        type: Date
    },

    password: {
        type: String,
        required: true,
        trim: true
    }
 }, {
        timestamps: true
})

const User = mongoose.model('User', userSchema)

export default User