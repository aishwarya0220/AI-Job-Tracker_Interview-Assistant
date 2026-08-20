import { useState, useEffect } from "react";

import { Job } from "@/types";

import apiRequest from "@/utils/api";

interface JobCardProps {
    job: Job,
    onJobUpdated?: () => void,
    onPrepareForInterview?: (job:Job) => void
}

export default function JobCard({ job, onJobUpdated, onPrepareForInterview}: JobCardProps){
    const [isUpdating, setIsUpdating] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    // Status badge styling
    const statusStyles: Record<Job['status'], string> = {
        Applied: 'bg-slate-800 text-slate-300 border-slate-700',
        Interviewing: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        Offered: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        Rejected: 'bg-rose-500/10 text-rose-400 border-rose-500/30'
    }

    const handleStatusChange = async (newStatus: Job['status']) => {
        setIsUpdating(true)
        try{
            await apiRequest(`http://localhost:8000/jobs/${job._id}`, 'PUT', {status: newStatus})
            if(onJobUpdated) onJobUpdated()
        }catch(err){
            console.log('Failed to update status', err)
        }finally{
            setIsUpdating(false)
        }
    }

    const handleDelete = async () => {
        if(!confirm(`Are you sure you want to delete ${job.company}?`)) return

        setIsDeleting(true)
        try{
            await apiRequest(`http://localhost:8000/jobs/${job._id}`, 'DELELTE')
            if(onJobUpdated) onJobUpdated()
        }catch(err){
            console.log('Failed to delete job', err)
        }finally{
            setIsDeleting(false)
        }
    }

    return (
        <div className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 flex flex-col justify-between shadow-lg transition duration-200">
            <div>
        {/* Header: Company Name & Delete Button */}
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-bold text-slate-100 leading-snug">{job.company}</h3>
            <p className="text-sm font-medium text-slate-400">{job.position}</p>
          </div>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-slate-500 hover:text-rose-400 p-1 rounded transition text-xs"
            title="Delete application"
          >
            {isDeleting ? '...' : '✕'}
          </button>
        </div>
        </div>
        </div>
    )
}