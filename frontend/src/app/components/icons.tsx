// Small inline SVG icons (no extra dependency needed)
import type { SVGProps } from "react"

const base = {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
}

export const BriefcaseIcon = (p: SVGProps<SVGSVGElement>) => (
    <svg {...base} {...p}><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /></svg>
)
export const PlusIcon = (p: SVGProps<SVGSVGElement>) => (
    <svg {...base} {...p}><path d="M12 5v14M5 12h14" /></svg>
)
export const XIcon = (p: SVGProps<SVGSVGElement>) => (
    <svg {...base} {...p}><path d="M18 6 6 18M6 6l12 12" /></svg>
)
export const TrashIcon = (p: SVGProps<SVGSVGElement>) => (
    <svg {...base} {...p}><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6" /></svg>
)
export const SparklesIcon = (p: SVGProps<SVGSVGElement>) => (
    <svg {...base} {...p}><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" /><path d="M19 17v4M17 19h4" /></svg>
)
export const LogoutIcon = (p: SVGProps<SVGSVGElement>) => (
    <svg {...base} {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" /></svg>
)

export function Spinner({ className = "" }: { className?: string }) {
    return (
        <span
            className={`inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent ${className}`}
            aria-hidden="true"
        />
    )
}
