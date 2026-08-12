const { generateInterviewQuestions } = require('./utils/aiService')

async function test(){
    const sampleText = "Looking for a React developer with Node.js, Express, and MongoDB experience."
    const questions = await generateInterviewQuestions(sampleText)
    console.log("AI Output", questions)
}

test()