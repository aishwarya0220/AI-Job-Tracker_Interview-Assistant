import type { ReactNode } from "react"
import { BriefcaseIcon } from "@/components/icons"

const features = [
    'Track every application in one place',
    'Practice with AI-generated mock interviews',
    'Plan your prep on a drag-and-drop task board',
]

// Shared layout for the login and register pages
export default function AuthShell({ title, subtitle, children }: {
    title: string
    subtitle: string
    children: ReactNode
}) {
    return (
        <main className="grid min-h-screen lg:grid-cols-2">
            <section className="flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-sm">
                    <div className="mb-8 flex items-center gap-2 font-semibold text-slate-100">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                            <BriefcaseIcon />
                        </span>
                        JobTrack AI
                    </div>
                    <h1 className="text-2xl font-bold text-slate-100">{title}</h1>
                    <p className="mb-6 mt-1 text-sm text-slate-400">{subtitle}</p>
                    {children}
                </div>
            </section>

            <section className="hidden items-center justify-center bg-gradient-to-br from-blue-700 via-blue-900 to-slate-900 p-12 lg:flex">
                <div className="max-w-md text-white">
                    <h2 className="text-3xl font-bold leading-tight">
                        Land your next role with less chaos.
                    </h2>
                    <ul className="mt-8 space-y-4">
                        {features.map((f) => (
                            <li key={f} className="flex items-start gap-3 text-blue-100">
                                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/15 text-xs">✓</span>
                                {f}
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
        </main>
    )
}
