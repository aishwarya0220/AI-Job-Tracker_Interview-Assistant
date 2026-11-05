'use client'

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import AuthShell from "@/components/AuthShell"
import { Spinner } from "@/components/icons"
import apiRequest from "@/utils/api"

export default function RegisterPage() {
    const router = useRouter()

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault()
        setError(null)

        if (username.trim().length < 3) {
            setError('Username must be at least 3 characters long.')
            return
        }

        if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
            setError('Please enter a valid email address.')
            return
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long.')
            return
        }

        setLoading(true)

        try {
            await apiRequest('/register', 'POST', {
                username: username.trim(),
                email: email.trim(),
                password
            })
        } catch (err: any) {
            setError(err.message || 'Failed to register account.')
            setLoading(false)
            return
        }

        // Registration does not log the user in, so sign in right away
        try {
            await apiRequest('/login', 'POST', { login: email.trim(), password })
            router.push('/dashboard')
        } catch {
            router.push('/login')
        }
    }

    return (
        <AuthShell title="Create your account" subtitle="Start tracking your job search in minutes.">
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {error && (
                    <div role="alert" className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">
                        {error}
                    </div>
                )}

                <div className="space-y-1.5">
                    <label htmlFor="username" className="text-sm font-medium text-slate-300">Username</label>
                    <Input
                        id="username"
                        type="text"
                        autoComplete="username"
                        placeholder="Choose a username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <div className="space-y-1.5">
                    <label htmlFor="email" className="text-sm font-medium text-slate-300">Email</label>
                    <Input
                        id="email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="space-y-1.5">
                    <label htmlFor="password" className="text-sm font-medium text-slate-300">Password</label>
                    <Input
                        id="password"
                        type="password"
                        autoComplete="new-password"
                        placeholder="At least 6 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <Button type="submit" disabled={loading} className="h-10 w-full">
                    {loading ? <><Spinner /> Creating account...</> : 'Sign up'}
                </Button>

                <p className="text-center text-sm text-slate-400">
                    Already have an account?{' '}
                    <Link href="/login" className="font-medium text-blue-400 hover:underline">Sign in</Link>
                </p>
            </form>
        </AuthShell>
    )
}
