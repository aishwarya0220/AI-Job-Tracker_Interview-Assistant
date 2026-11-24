'use client'

import { useState, useEffect, type SubmitEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import AuthShell from "@/components/AuthShell"
import { Spinner } from "@/components/icons"
import apiRequest, { wakeServer } from "@/utils/api"

export default function LoginPage() {
    const router = useRouter()

    const [login, setLogin] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [notice, setNotice] = useState<string | null>(null)

    useEffect(() => {
        wakeServer()
    }, [])

    const handleSubmit = async (event: SubmitEvent) => {
        event.preventDefault()
        setError(null)

        if (!login.trim() || !password) {
            setError('Please enter your username or email and your password.')
            return
        }

        setLoading(true)

        const awake = await wakeServer(() => setNotice('Waking up the server (free hosting). This can take up to a minute...'))

        if(!awake){
            setError('The server is taking too long to start. Please try again in a minute.')
            setLoading(false)
            return
        }

        try {
            await apiRequest('/login', 'POST', { login: login.trim(), password })
            router.push('/dashboard')
        } catch (err: any) {
            setError(err.message || 'Login failed. Please try again.')
            setLoading(false)
        }
    }

    return (
        <AuthShell title="Welcome back" subtitle="Sign in to manage your applications.">
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {error && (
                    <div role="alert" className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">
                        {error}
                    </div>
                )}

                <div className="space-y-1.5">
                    <label htmlFor="login" className="text-sm font-medium text-slate-300">Username or email</label>
                    <Input
                        id="login"
                        type="text"
                        autoComplete="username"
                        placeholder="you@example.com"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                    />
                </div>

                <div className="space-y-1.5">
                    <label htmlFor="password" className="text-sm font-medium text-slate-300">Password</label>
                    <Input
                        id="password"
                        type="password"
                        autoComplete="current-password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                {notice && (
                    <p role="status" className="text-center text-sm text-slate-400">{notice}</p>
                )}

                <Button type="submit" disabled={loading} className="h-10 w-full">
                    {loading ? <><Spinner /> Signing in...</> : 'Sign in'}
                </Button>

                <p className="text-center text-sm text-slate-400">
                    Don&apos;t have an account?{' '}
                    <Link href="/" className="font-medium text-blue-400 hover:underline">Sign up</Link>
                </p>
            </form>
        </AuthShell>
    )
}
