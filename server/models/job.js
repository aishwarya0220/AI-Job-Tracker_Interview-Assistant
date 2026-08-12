const mongoose = require('mongoose')

const User = require('./user')

const jobsSchema = new mongoose.Schema({
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
        default: "",
        required: [true, 'Required for AI based learning features']
    },

    notes: {
        type: String
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    interviewQuestions: [
        {
            question: {
                type: String,
                required: true
            },
            userAnswers: {
                type: String,
                default: ''
            }
        }
    ]
}, {
        timestamps: true
})

const Job = mongoose.model('Job', jobsSchema)

module.exports = Job
