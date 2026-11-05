'use client'

import { useState, useEffect, type SubmitEvent } from "react"
import { Job } from "@/types"
import apiRequest from "@/utils/api"
import { XIcon } from "@/components/icons"

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

export default function InterviewModal({ job, onClose }: InterviewModalProps) {
    const [threads, setThreads] = useState<Thread[]>([])
    const [activeThreadIndex, setActiveThreadIndex] = useState<number>(0)
    const [userReply, setUserReply] = useState('')
    const [loading, setLoading] = useState(false)
    const [generating, setGenerating] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [savedQuestions, setSavedQuestions] = useState<{ question: string }[]>([])

    // Load questions that were generated earlier for this job
    useEffect(() => {
        const loadQuestions = async () => {
            try {
                const saved = await apiRequest<{ question: string }[]>(`/jobs/${job._id}/interview-prep`, 'GET')
                setSavedQuestions(Array.isArray(saved) ? saved : [])
            } catch (err) {
                console.error('Failed to load saved questions:', err)
            }
        }
        loadQuestions()
    }, [job._id])

    const toThreads = (questions: { question: string }[]): Thread[] =>
        questions.map((item) => ({
            question: item.question,
            history: [{ role: 'assistant', text: item.question }]
        }))

    const handleStartPrep = async () => {
        setGenerating(true)
        setError(null)

        try {
            if (savedQuestions.length > 0) {
                setThreads(toThreads(savedQuestions))
            } else {
                const data = await apiRequest<{ question: { question: string }[] }>(`/jobs/${job._id}/interview-prep`, 'POST')

                if (!data?.question?.length) {
                    setError('No questions could be generated. Make sure this job has a description.')
                    return
                }

                setThreads(toThreads(data.question))
                setSavedQuestions(data.question)
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to generate interview questions.')
        } finally {
            setGenerating(false)
        }
    }

    const handleSendReply = async (e: SubmitEvent) => {
        e.preventDefault()
        if (!userReply.trim() || loading) return

        const index = activeThreadIndex
        const currentThread = threads[index]
        const textToSend = userReply.trim()

        const updatedHistory: Message[] = [...currentThread.history, { role: 'user', text: textToSend }]

        const setHistory = (history: Message[]) =>
            setThreads((prev) => prev.map((t, i) => (i === index ? { ...t, history } : t)))

        setHistory(updatedHistory)
        setUserReply('')
        setError(null)
        setLoading(true)

        try {
            const res = await apiRequest<{ feedback: string }>(`/jobs/${job._id}/interview-feedback`, 'POST', {
                question: currentThread.question,
                conversationHistory: updatedHistory,
                userAnswer: textToSend
            })

            setHistory([...updatedHistory, { role: 'assistant', text: res.feedback }])
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to get feedback. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
            <div className="relative flex max-h-[85vh] w-full max-w-3xl flex-col rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-800 p-5">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-100">Mock interview</h2>
                        <p className="mt-0.5 text-xs text-slate-400">
                            {job.company} · <span className="text-blue-400">{job.position}</span>
                        </p>
                    </div>
                    <button
                        type="button"
                        aria-label="Close"
                        onClick={onClose}
                        className="rounded-lg border border-slate-800 p-2 text-slate-300 transition hover:bg-slate-800 hover:text-white"
                    >
                        <XIcon />
                    </button>
                </div>

                {threads.length === 0 ? (
                    <div className="space-y-4 p-12 text-center">
                        <p className="mx-auto max-w-md text-sm text-slate-300">
                            {savedQuestions.length > 0
                                ? 'Your questions for this role are ready. Pick up where you left off.'
                                : 'Generate role-specific questions from the job description, then answer them and get AI feedback.'}
                        </p>
                        {error && <p role="alert" className="text-sm text-rose-400">{error}</p>}
                        <button
                            className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:opacity-50"
                            onClick={handleStartPrep}
                            disabled={generating}
                        >
                            {generating ? 'Generating questions...' : 'Start mock interview'}
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-1 flex-col overflow-hidden sm:flex-row">
                        <div className="max-h-40 space-y-2 overflow-y-auto border-b border-slate-800 p-3 sm:max-h-none sm:w-1/3 sm:border-b-0 sm:border-r">
                            <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                Questions
                            </span>
                            {threads.map((t, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveThreadIndex(idx)}
                                    className={`flex w-full flex-col gap-1 rounded-lg p-3 text-left text-xs transition ${
                                        activeThreadIndex === idx
                                            ? 'border border-blue-500/40 bg-blue-600/20 text-blue-300'
                                            : 'border border-slate-800 bg-slate-950 text-slate-400 hover:bg-slate-800'
                                    }`}
                                >
                                    <span className="font-semibold text-slate-200">Question {idx + 1}</span>
                                    <span className="line-clamp-2 text-slate-400">{t.question}</span>
                                </button>
                            ))}
                        </div>

                        <div className="flex min-h-0 flex-1 flex-col justify-between bg-slate-950/40 p-4">
                            <div className="mb-4 flex-1 space-y-4 overflow-y-auto pr-2">
                                {threads[activeThreadIndex]?.history.map((msg, mIdx) => (
                                    <div
                                        key={mIdx}
                                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[85%] rounded-xl p-3.5 text-xs leading-relaxed ${
                                                msg.role === 'user'
                                                    ? 'rounded-br-none bg-blue-600 text-white'
                                                    : 'rounded-bl-none border border-slate-800 bg-slate-900 text-slate-200'
                                            }`}
                                        >
                                            <span className="mb-1 block text-[10px] font-bold uppercase opacity-60">
                                                {msg.role === 'user' ? 'You' : 'AI interviewer'}
                                            </span>
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}
                                {loading && (
                                    <div className="animate-pulse text-xs italic text-slate-500">
                                        Evaluating your answer...
                                    </div>
                                )}
                                {error && <p role="alert" className="text-xs text-rose-400">{error}</p>}
                            </div>

                            <form onSubmit={handleSendReply} className="flex gap-2">
                                <input
                                    type="text"
                                    maxLength={200}
                                    placeholder="Type your answer (max 200 characters)"
                                    onChange={(e) => setUserReply(e.target.value)}
                                    value={userReply}
                                    className="flex-1 rounded-lg border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                                <button
                                    type="submit"
                                    disabled={loading || !userReply.trim()}
                                    className="rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-500 disabled:opacity-50"
                                >
                                    Send
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
