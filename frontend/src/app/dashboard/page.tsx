'use client'

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Job } from "@/types"
import Navbar from "@/components/Navbar"
import AddJobModal from "@/components/JobModal"
import JobCard from "@/components/JobCard"
import InterviewModal from "@/components/InterviewModal"
import { PlusIcon } from "@/components/icons"
import apiRequest, { ApiError } from "@/utils/api"

const stats: { status: Job['status'] | 'All', dot: string }[] = [
    { status: 'All', dot: 'bg-slate-400' },
    { status: 'Applied', dot: 'bg-blue-400' },
    { status: 'Interviewing', dot: 'bg-amber-400' },
    { status: 'Offered', dot: 'bg-emerald-400' },
    { status: 'Rejected', dot: 'bg-rose-400' },
]

export default function Dashboard() {
    const router = useRouter()

    const [jobs, setJobs] = useState<Job[]>([])
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedJobForInterview, setSelectedJobForInterview] = useState<Job | null>(null)

    const fetchJobs = useCallback(async () => {
        try {
            setError(null)
            const data = await apiRequest<Job[]>('/jobs')
            setJobs(data)
        } catch (err) {
            if (err instanceof ApiError && err.status === 401) {
                router.replace('/login')
                return
            }
            setError(err instanceof Error ? err.message : 'Failed to load applications.')
        } finally {
            setLoading(false)
        }
    }, [router])

    useEffect(() => {
        fetchJobs()
    }, [fetchJobs])

    const countFor = (status: Job['status'] | 'All') =>
        status === 'All' ? jobs.length : jobs.filter((j) => j.status === status).length

    return (
        <div className="min-h-screen">
            <Navbar />

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-100">Your applications</h1>
                        <p className="mt-1 text-sm text-slate-400">
                            Track status and practice with AI-generated interview questions.
                        </p>
                    </div>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
                    >
                        <PlusIcon /> Add job
                    </button>
                </div>

                {/* Summary counts */}
                {jobs.length > 0 && (
                    <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-5">
                        {stats.map(({ status, dot }) => (
                            <div key={status} className="rounded-xl border border-slate-800 bg-slate-900 p-4">
                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                    <span className={`h-2 w-2 rounded-full ${dot}`} />
                                    {status === 'All' ? 'Total' : status}
                                </div>
                                <p className="mt-1 text-2xl font-bold text-slate-100">{countFor(status)}</p>
                            </div>
                        ))}
                    </div>
                )}

                {error && (
                    <div role="alert" className="mb-6 flex items-center justify-between rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">
                        <span>{error}</span>
                        <button onClick={fetchJobs} className="font-semibold underline">Retry</button>
                    </div>
                )}

                {loading ? (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {[0, 1, 2].map((i) => (
                            <div key={i} className="h-44 animate-pulse rounded-xl border border-slate-800 bg-slate-900" />
                        ))}
                    </div>
                ) : jobs.length === 0 && !error ? (
                    <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 py-20 text-center">
                        <p className="mb-1 font-medium text-slate-200">No applications yet</p>
                        <p className="mb-5 text-sm text-slate-400">Add a job to start tracking and generate interview questions.</p>
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
                        >
                            Add your first job
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {jobs.map((job) => (
                            <JobCard
                                key={job._id}
                                job={job}
                                onJobUpdated={fetchJobs}
                                onPrepareForInterview={() => setSelectedJobForInterview(job)}
                            />
                        ))}
                    </div>
                )}
            </main>

            {selectedJobForInterview && (
                <InterviewModal
                    job={selectedJobForInterview}
                    onClose={() => setSelectedJobForInterview(null)}
                />
            )}

            {isAddModalOpen && (
                <AddJobModal
                    onClose={() => setIsAddModalOpen(false)}
                    onJobAdded={() => {
                        setIsAddModalOpen(false)
                        fetchJobs()
                    }}
                />
            )}
        </div>
    )
}
