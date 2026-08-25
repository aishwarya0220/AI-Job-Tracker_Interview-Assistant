const mongoose = require('mongoose')

const TaskSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User', 
            required: true, 
            index: true
        },
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            default: ''
        },
        category: {
            type: String,
            enum: ['dev', 'leetcode', 'admin', 'learning', 'personal'],
            default: 'dev'
        },
        status: {
            type: string,
            enum: ['backlog', 'scheduled', 'in_progress', 'revision', 'completed'],
            default: 'backlog'
        }
})