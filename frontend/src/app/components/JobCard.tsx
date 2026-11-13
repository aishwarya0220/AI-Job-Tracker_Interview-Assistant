import { useState } from "react";
import { Job } from "@/types";
import apiRequest from "@/utils/api";
import { SparklesIcon, TrashIcon } from "@/components/icons";

interface JobCardProps {
    job: Job,
    onJobUpdated?: () => void,
    onPrepareForInterview?: () => void
}

// Status badge styling
const statusStyles: Record<Job['status'], string> = {
    Applied: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
    Interviewing: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    Offered: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    Rejected: 'bg-rose-500/10 text-rose-300 border-rose-500/30'
}

export default function JobCard({ job, onJobUpdated, onPrepareForInterview }: JobCardProps) {
    const [isUpdating, setIsUpdating] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleStatusChange = async (newStatus: Job['status']) => {
        setIsUpdating(true)
        setError(null)
        try {
            await apiRequest(`/jobs/${job._id}`, 'PUT', { status: newStatus })
            if (onJobUpdated) onJobUpdated()
        } catch (err: any) {
            setError(err.message || 'Failed to update status')
        } finally {
            setIsUpdating(false)
        }
    }

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete ${job.company}?`)) return

        setIsDeleting(true)
        setError(null)
        try {
            await apiRequest(`/jobs/${job._id}`, 'DELETE')
            if (onJobUpdated) onJobUpdated()
        } catch (err: any) {
            setError(err.message || 'Failed to delete job')
            setIsDeleting(false)
        }
    }

    const added = job.createdAt
        ? new Date(job.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
        : null

    return (
        <div className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900 p-5 transition hover:border-slate-600">
            <div>
                <div className="mb-3 flex items-start justify-between gap-2">
                    <div className="min-w-0">
                        <h3 className="truncate text-lg font-semibold leading-snug text-slate-100">{job.company}</h3>
                        <p className="truncate text-sm text-slate-400">{job.position}</p>
                    </div>
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="rounded p-1.5 text-slate-500 transition hover:bg-slate-800 hover:text-rose-400"
                        title="Delete application"
                        aria-label={`Delete ${job.company}`}
                    >
                        <TrashIcon />
                    </button>
                </div>

                <div className="mb-3 flex items-center gap-3">
                    <select
                        value={job.status}
                        disabled={isUpdating}
                        onChange={(e) => handleStatusChange(e.target.value as Job['status'])}
                        aria-label="Application status"
                        className={`${statusStyles[job.status]} cursor-pointer rounded-full border px-2.5 py-1 text-xs font-semibold outline-none transition`}
                    >
                        <option className="bg-slate-900 text-slate-100" value="Applied">Applied</option>
                        <option className="bg-slate-900 text-slate-100" value="Interviewing">Interviewing</option>
                        <option className="bg-slate-900 text-slate-100" value="Offered">Offered</option>
                        <option className="bg-slate-900 text-slate-100" value="Rejected">Rejected</option>
                    </select>
                    {added && <span className="text-xs text-slate-500">Added {added}</span>}
                </div>

                {job.jobDescription && (
                    <p className="mb-4 line-clamp-3 rounded-lg border border-slate-800 bg-slate-950/60 p-2.5 text-xs leading-relaxed text-slate-400">
                        {job.jobDescription}
                    </p>
                )}

                {error && <p role="alert" className="mb-3 text-xs text-rose-400">{error}</p>}
            </div>

            <button
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-blue-500/30 bg-blue-500/10 py-2 text-sm font-medium text-blue-300 transition hover:bg-blue-500/20"
                onClick={onPrepareForInterview}
            >
                <SparklesIcon /> Mock interview
            </button>
        </div>
    )
}
