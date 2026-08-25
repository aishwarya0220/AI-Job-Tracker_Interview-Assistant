'use client'

import { useState, SubmitEvent, useEffect } from "react"

import { Job } from "@/types"

import apiRequest from "@/utils/api"

interface Message {
    role: 'assistant' | 'user',
    text: string
}

interface Thread {
    question: string,
    history: Message[]
}

interface InterviewModalProps {
    job: Job,
    onClose: () => void
}

export default function interviewModal({job, onClose}: InterviewModalProps){
    const [threads, setThreads] = useState<Thread[]>([])

    const [activeThreadIndex, setActiveThreadIndex] = useState<number>(0)

    const [userReply, setUserReply] = useState('')

    const [loading, setLoading] = useState(false)

    const [generating,setGenerating] = useState(false)

    const [savedQuestions, setSavedQuestions] = useState<{ question: string}[]>([])

    useEffect(() => {
        const loadQuestions = async () => {
            setGenerating(true)
    
            try{
                const saved = await apiRequest<{ question: {question: string}[]}>(`http://localhost:8000/jobs/${job._id}/interview-prep`, 'GET')

                setSavedQuestions(saved?.question ?? [])

                } catch(err) {
                    console.error('Failed to generate interview questions:', err)
                } finally{
                    setGenerating(false)
                }
        }
        loadQuestions()
    },[job._id])

    const handleStartPrep = async () => {
        setGenerating(true)

        try{
            if(savedQuestions.length > 0){
                const initialThread: Thread[] = savedQuestions.map((item) => ({
                    question: item.question,
                    history: [{role: 'assistant', text:item.question}]
                }))

                setThreads(initialThread)
            } else {
                const data = await apiRequest<{ question: {question: string}[]}>(`http://localhost:8000/jobs/${job._id}/interview-prep`, 'POST')
                    
                if(!data?.question?.length){
                    console.log('No questions generated')
                    return
                }
                const initialThread: Thread[] = data.question.map((q) => ({
                    question: q.question,
                    history: [{ role: 'assistant', text: q.question}]
                }))
        
                setThreads(initialThread)

                setSavedQuestions(data.question)

            }

        } catch(err){
            console.error('Failed to generate interview questions:', err)
        } finally{
            setGenerating(false)
        }

    }


    const handleSendReply = async (e: SubmitEvent) => {
        e.preventDefault()
        if(!userReply.trim() || loading) return

        const currentThread = threads[activeThreadIndex]

        const updatedHistory: Message[] = [
            ...currentThread.history,
            { role: 'user', text: userReply }
        ]

        const updatedThreads = [...threads]

        updatedThreads[activeThreadIndex].history = updatedHistory

        setThreads(updatedThreads)

        const textToSend = userReply

        setUserReply('')

        setLoading(true)

        try{
            const res = await apiRequest(`http://localhost:8000/jobs/${job._id}/interview-feedback`, 'POST',
                {
                    question: currentThread.question,
                    conversationHistory: updatedHistory,
                    userAnswer: textToSend
                }
            )

            updatedThreads[activeThreadIndex].history.push({
                role: 'assistant',
                text: res.feedback          
                })

            setThreads(updatedThreads)
        } catch(err){
            console.error('Failed to generate interview feedback:', err)
        } finally{
            setLoading(false)
        }
    }

    return (
        <div className="z-50 fixed inset-0 bg-slate-950/80 p-4 backdrop-blur-sm flex items-center justify-center">
            <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col max-h-[85vh]">
                <div className="flex justify-between items-center p-6 border-b border-slate-800">
                <div>
                    <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                    <span>Mock Interviewer</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                    {job.company} — <span className="text-blue-400">{job.position}</span>
                    </p>
                </div>
                <button
                onClick={onClose}
                className="text-slate-400 hover:text-white p-2 rounded-lg border border-slate-800 transition"
                >
                ✕
                </button>
                </div>

                {threads.length == 0 ? (
                    <div className="p-12 text-center space-y-4">
                        <p className="text-slate-300 text-sm max-w-md mx-auto">
                            Generate job specific questions
                        </p>
                        <button
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold rounded-lg shadow-blue-600/20 transition"
                            onClick={handleStartPrep}
                            disabled={generating}
                        >
                            {generating ? 'Generating Questions..' : 'Start Mock Interview'}
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-1 overflow-hidden">
                        <div className="w-1/3 border-r border-slate-800 p-3 space-y-2 overflow-y-auto">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2">
                                Questions
                            </span>
                            {threads.map((t, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveThreadIndex(idx)}
                                    className={`w-full text-left p-3 rounded-lg text-xs transition flex flex-col gap-1 ${activeThreadIndex == idx 
                                        ? 'bg-blue-600/20 border border-blue-500/40 text-blue-300'
                                        : 'bg-slate-950 border border-slate-800/60 text-slate-400 hover:bg-slate-800'
                                    }`}
                                >
                                    <span className="font-semibold text-slate-200">Question {idx + 1}</span>
                                    <span className="line-clamp-2 text-slate-400">{t.question}</span>
                                </button>
                            ))}
                        </div>

                        <div className="w-2/3 flex flex-col justify-between p-4 bg-slate-950/40">
                            <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4">
                                {threads[activeThreadIndex]?.history.map((msg, mIdx) => (
                                    <div
                                        key={mIdx}
                                        className={`flex ${msg.role == 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[85%] p-3.5 rounded-xl text-xs leading-relaxed ${
                                                msg.role === 'user'
                                                  ? 'bg-blue-600 text-white rounded-br-none'
                                                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
                                              }`}
                                        >
                                            <span className="block text-[10px] font-bold uppercase mb-1 opacity-60">
                                                {msg.role === 'user' ? 'You' : '🤖 AI Interviewer'}
                                            </span>
                                            {msg.text}   
                                        </div>
                                    </div>
                                ))}
                                {loading && (
                                <div className="text-xs text-slate-500 italic animate-pulse">
                                    Evaluating response and formulating follow-up...
                                </div>
                                )}
                            </div>

                            <form onSubmit={handleSendReply} className="flex gap-2">
                                <input
                                    type="text"
                                    maxLength={200}
                                    placeholder="Type your response (Max 200 characters)"
                                    onChange={(e) => setUserReply(e.target.value)}
                                    value={userReply}
                                    className="flex-1 px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                                <button
                                    type="submit"
                                    disabled={loading || !userReply.trim()}
                                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition"
                                >
                                    Send Response
                                </button>
                                
                            </form>
                        </div>        
                    </div>
                )}
            </div>
        </div>
    )
}
