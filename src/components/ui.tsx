import { Sparkles } from 'lucide-react'
import type { ReactNode } from 'react'

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  as = 'h1',
  children,
}: {
  eyebrow: string
  title: string
  subtitle?: ReactNode
  as?: 'h1' | 'h2'
  children?: ReactNode
}) {
  const Heading = as
  return (
    <div className="mb-10 max-w-4xl">
      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.22em] text-sky-300">
        <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
        {eyebrow}
      </div>
      <Heading tabIndex={-1} data-page-heading className="text-3xl font-semibold tracking-tight text-white outline-none sm:text-4xl">
        {title}
      </Heading>
      {subtitle ? <p className="mt-4 text-base leading-7 text-slate-300 sm:text-lg">{subtitle}</p> : null}
      {children}
    </div>
  )
}

export function Pill({ children }: { children: ReactNode }) {
  return <span className="chip">{children}</span>
}

// `reserveRail` yields ground to the fixed table-of-contents rail only on
// viewports too narrow to host it in the gutter (see .rail-reserve in index.css).
export function PageShell({ children, reserveRail = false, className = '' }: { children: ReactNode; reserveRail?: boolean; className?: string }) {
  const shell = <div className={`section-shell py-10 sm:py-14 ${className}`}>{children}</div>
  return reserveRail ? <div className="rail-reserve">{shell}</div> : shell
}

export function Bullet({ children }: { children: ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="mt-[0.7rem] h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300" aria-hidden="true" />
      <span>{children}</span>
    </li>
  )
}
