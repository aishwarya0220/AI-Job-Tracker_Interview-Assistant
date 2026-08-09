const mongoose = require('mongoose')

const User = require('./user')

const jobsSchema = new mongoose.model({
    company: {
        type: String,
        required: true,
        trim: true
    },

    position: {
        type: String,
        required: true,
        trim: true
    },

    status: {
        type: String,
        enum: ['Applied', 'Interviewing', 'Rejected', 'Offered'],
    },

    jobDescription: {
        type: String,
        default: ""
    },

    notes: {
        type: String
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
},{
        timestamps: true
})

const Job = mongoose.model('Job', jobsSchema)

module.exports = Job
