import { Job } from "@/types"

import apiRequest from "@/utils/api"

import { useState, SubmitEvent } from "react"

interface AddJobModalProps {
    onClose: () => void
    onJobAdded: () => void
}

export default function AddJobModal({onClose, onJobAdded}: AddJobModalProps){
    const [company, setCompany] = useState('')
    const [position, setPosition] = useState('')
    const [status, setStatus] = useState('')
    const [jobDescription, setJobDescription] = useState('')

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSumbit = async (e: SubmitEvent) => {
        e.preventDefault()
        setError(null)

        if(!company.trim() || !position.trim()){
            setError('Company name and position title are required.')
            return
        }

        setLoading(true)

        try{
            await apiRequest('http://localhost:8000/jobs', 'POST', {
                company,
                position,
                status,
                jobDescription
            })
            onJobAdded()
        } catch(err){
            setError(err.message || 'Failed to add job application.')
        } finally{
            setLoading(false)
        }
    }

    return (
        <div className="z-50 fixed inset-0 bg-slate-950/80 p-4 backdrop-blur-sm flex items-center justify-center">
            <div className="relative max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2>Add New Job Applications</h2>
                    </div>
                    <button 
                        className="text-slate-200 hover:text-slate-400 p-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 transition text-sm"
                        onClick={onClose}
                    >
                        ✕
                    </button>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-xs">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSumbit} className="space-y-4">
                    <div>
                    <label className="block text-xs font-semibold uppercase mb-1 text-slate-400 ">
                        Company name
                    </label>
                    <input
                        type="text"
                        required
                        value={company}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setCompany(e.target.value)}
                    />
                    </div>

                    <div>
                    <label className="block text-xs font-semibold uppercase mb-1 text-slate-400 ">
                        Position title
                    </label>
                    <input
                        type="text"
                        required
                        value={position}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setPosition(e.target.value)}
                    />
                    </div>

                    <div>
                    <label className="block text-xs font-semibold uppercase mb-1 text-slate-400 ">
                        Status
                    </label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as Job['status'])}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="Applied">Applied</option>
                        <option value="Interviewing">Applied</option>
                        <option value="Offered">Applied</option>
                        <option value="Rejected">Applied</option>
                    </select>
                    </div>

                    <div>
                    <label className="block text-xs font-semibold uppercase mb-1 text-slate-400 ">
                        Job Description
                    </label>
                    <textarea
                        rows={4}
                        value={jobDescription}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        onChange={(e) => setJobDescription(e.target.value)}
                    />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-lg text-xs transition"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold rounded-lg text-xs transition shadow-lg shadow-blue-600/20"
                        >
                            {loading ? 'Saving...' : 'Save Application'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}