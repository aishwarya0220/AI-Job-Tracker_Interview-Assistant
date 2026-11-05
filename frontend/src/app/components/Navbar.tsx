'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import apiRequest, { ApiError } from "@/utils/api"
import { BriefcaseIcon, LogoutIcon } from "@/components/icons"

const links = [
    { href: '/dashboard', label: 'Applications' },
    { href: '/kanban', label: 'Task Tracker' },
]

// Shared top bar. It also acts as the login check for protected pages:
// if /user/me returns 401 the user is sent back to the login page.
export default function Navbar() {
    const router = useRouter()
    const pathname = usePathname()
    const [username, setUsername] = useState('')

    useEffect(() => {
        const getUser = async () => {
            try {
                const data = await apiRequest<{ username: string }>('/user/me')
                setUsername(data.username)
            } catch (err) {
                if (err instanceof ApiError && err.status === 401) {
                    router.replace('/login')
                }
            }
        }
        getUser()
    }, [router])

    const handleLogout = async () => {
        try {
            await apiRequest('/logout', 'POST')
        } catch (err) {
            console.error('Logout failed', err)
        } finally {
            router.push('/login')
        }
    }

    return (
        <nav className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
            <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
                <div className="flex items-center gap-6">
                    <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-slate-100">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white">
                            <BriefcaseIcon width={15} height={15} />
                        </span>
                        <span className="hidden sm:inline">JobTrack AI</span>
                    </Link>
                    <div className="flex items-center gap-1">
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`rounded-md px-3 py-1.5 text-sm transition ${
                                    pathname === link.href
                                        ? 'bg-slate-800 text-slate-100'
                                        : 'text-slate-400 hover:text-slate-100'
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {username && (
                        <div className="flex items-center gap-2">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-sm font-semibold uppercase text-slate-200">
                                {username.charAt(0)}
                            </span>
                            <span className="hidden text-sm text-slate-300 sm:inline">{username}</span>
                        </div>
                    )}
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="flex items-center gap-1.5 rounded-md border border-slate-800 px-3 py-1.5 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
                    >
                        <LogoutIcon width={14} height={14} />
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    )
}
