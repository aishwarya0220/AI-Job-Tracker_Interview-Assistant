'use client'

import { useState, SubmitEvent } from "react"

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

    const[loading, setLoading] = useState(false)

    const[generating,setGenerating] = useState(false)

    const handleStartPrep = async () => {
        setGenerating(true)

        try{
            const data = await apiRequest<{question: string[]}>(`http://localhost:8000/${job._id}/interview-prep`, 'POST')

            const initialThread: Thread[] = data.question.map((q) => ({
                question: q,
                history: [{ role: 'assistant', text: q}]
            }))

            setThreads(initialThread)
        } catch(err) {
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
            const res = await apiRequest(`http://localhost:8000/${job._id}/interview-feedback`, 'POST',
                {
                    question: currentThread.question,
                    conversationalHistory: updatedHistory,
                    userAnswer: textToSend
                }
            )

            updatedThreads[activeThreadIndex].history.push({
                role: 'assistant',
                text: res.feedback          // api configurations
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
                    <span>✨ AI Mock Interviewer</span>
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
            </div>
        </div>
    )
}
