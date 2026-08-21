'use client'

import { useEffect, useState } from "react"

import { Job } from "@/types"

import AddJobModal from "@/components/jobModal"

import JobCard from "@/components/JobCard"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar"

import apiRequest from "@/utils/api"

import { Button } from "@/components/ui/button"

import { useRouter } from "next/navigation"

export default function Dashboard(){
    const router = useRouter()

    const [jobs, setJobs] = useState<Job[]>([])

    const [isAddModalOpen, setIsAddModalOpen] = useState(false)

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchJobs()
    },[])

    const fetchJobs = async () => {
        try{
            setLoading(true)
            console.log('fetching jobs..')
            const data = await apiRequest<Job[]>('http://localhost:8000/jobs')
            console.log('jobs received', data)
            setJobs(data)
        } catch(err){
            console.error('Failed to fetch jobs', err)
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        try{
            await apiRequest('http://localhost:8000/logout', 'POST')

            router.push('/login')
        } catch(err){
            console.error('Logout failed', err)
        }
    }

    const [username, setUsername] = useState('')

    useEffect(() => {

        const getUser = async () => {

            try{
                const data = await apiRequest('http://localhost:8000/user/me')
                setUsername(data.username)
            } catch(err){
                console.log('Failed to get user')
            }
        }
        getUser()

    },[])
    return (
        <div className="min-h-screen">
        <nav className="justify-between flex bg-blue-950 h-11 items-center">
            <div>
                <h1 className="ml-4 text-2xl text-amber-100">Your Applications</h1>
            </div>

            <div className="gap-3 mr-4 flex justify-end">
            <div>
            <Avatar>
            <AvatarImage
                src="https://github.com/shadcn.png"
                alt="user-svg-img"
                className="grayscale"
            />
            <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            </div>

            <p className="text-[19px] text-amber-100">{username}</p>

            <div>
                <Button type="button" className="bg-blue-900 border-amber-100 " onClick={handleLogout}>Logout</Button>
            </div>
            </div>


        </nav>

        {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold">Track status and generate interview questions</h2>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 font-semibold rounded-lg shadow-lg shadow-blue-600/20 transition text-sm"
          >
            + Add New Job
          </button>
        </div>

            {/* Loading / Empty States */}
        {loading ? (
                <div className="text-center py-20 text-slate-500">Loading your applications...</div>
                ) : jobs.length === 0 ? (
                <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-slate-800">
                    <p className="text-slate-400 mb-4">No jobs added yet.</p>
                    <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="text-blue-400 hover:underline font-semibold text-sm"
                    >
                    Add your first job application
                    </button>
                </div>
                ) : (
                /* Job Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobs.map((job) => (
                    <JobCard key={job._id} job={job} onJobUpdated={fetchJobs} />
                    ))}
                </div>
                )}
            </main>

            {/* Add Job Modal */}
            {isAddModalOpen && (
                <AddJobModal
                onClose={() => setIsAddModalOpen(false)}
                onJobAdded={() => {
                    setIsAddModalOpen(false);
                    fetchJobs();
                }}
                />
            )} 
            </div>
        );
        }