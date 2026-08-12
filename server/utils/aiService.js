const { GoogleGenAI } = require('@google/genai')
const { application } = require('express')

require('dotenv').config()

const AI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

async function generateInterviewQuestions(jobDescription){
    if(!jobDescription){
        return []
    }

    const response = await AI.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: 'You are a senior tech interviewer. Read the following job description and return exactly 5 relevant interview questions as per the job market in India',
        config: {
            temperature:0.7,
            // responseMimeType: 'application/json'         // comment for testing purpose
        }
    })
    return response.text
}

module.exports = { generateInterviewQuestions }