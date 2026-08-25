const { GoogleGenAI } = require('@google/genai')
const { application } = require('express')

require('dotenv').config()

const AI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

async function generateInterviewQuestions(
    company,
    position,
    jobDescription
    
    ){
    if(!jobDescription){
        return []
    }

    const response = await AI.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: `
                You are a senior tech interviewer. 
                
                Company:${company}
                Position:${position}
                Description:${jobDescription}
                
                Read the following job description and Generate exactly 5 high-quality technical interview questions.

                Each question must:
                1. Directly test a skill, technology, responsibility, or concept found in the job description.
                2. Require the candidate to demonstrate reasoning or practical experience.
                3. Be appropriate for the candidate's position and seniority.
                4. Be specific enough that a strong candidate can demonstrate depth.
                5. Avoid trivia and questions that can be answered by simply reciting definitions.
                6. Avoid generic behavioral questions.
                7. Avoid duplicate concepts across the 5 questions.
                
                Prioritize questions in this order:
                - Real-world problem solving
                - Architecture/design decisions
                - Debugging and troubleshooting
                - Technology-specific expertise
                - Trade-offs and best practices
                
                The questions should resemble questions asked by an experienced
                technical interviewer, not questions generated from a generic interview-question list.`,
        config: {
            temperature:0.7,
            responseMimeType: 'application/json',
            responseSchema: {
                type: "ARRAY",
                items: {
                    type: "OBJECT",
                    properties: {
                        question: {
                            type: "STRING"
                        }
                    },
                    required: ["question"]
                }
            }
        }
        
    })
    return JSON.parse(response.text)
}

async function evaluateInterviewAnswer({
    company,
    position,
    question,
    recentHistory,
    userAnswer
}){
    const formattedHistory = recentHistory && recentHistory.length > 0 
        ? recentHistory.map((m) => `${m.role.toUpperCase()}: ${m.text}`).join('\n')
        : 'No previous messages'

    const prompt = `
    You're a tech interviewer for ${position} role at ${company}.
    
    Target Question: "${question}"
    
    Thread Context:
    ${formattedHistory}
    
    Candidate's Latest Answer: "${userAnswer}"
    
    INSTRUCTIONS:
    1. Provide 1 brief sentence evaluating their answer (highlight strengths or missing technical concept).
    2. Ask 1 relevant technical counter-question to dive deeper.
    3. STRICT LIMIT: Keep total output under 50 words.
    4. Dont include greetings/fluff/introductory pleasantries.
        `.trim()

    const response = await AI.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: prompt,
        config: {
            temperature: 0.5
        }
    })
    
    return response.text
}

module.exports = {
    generateInterviewQuestions,
    evaluateInterviewAnswer
}