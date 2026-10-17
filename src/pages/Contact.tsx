import { m } from 'framer-motion'
import { ArrowUpRight, Building2, FileText, Github, Globe, Instagram, Linkedin, Mail, Phone, Sparkles } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useEntrancesEnabled, usePageEntrance } from '../lib/motion'
import { GITHUB_URL, LINKEDIN_URL, RESUME_HREF } from '../lib/site'

interface ContactLink {
  label: string
  value: string
  href: string
  icon: LucideIcon
  external?: boolean
}

const CONTACT_LINKS: ContactLink[] = [
  { label: 'Email', value: 'davishiggins@icloud.com', href: 'mailto:davishiggins@icloud.com', icon: Mail },
  { label: 'Phone', value: '(828) 578-0262', href: 'tel:+18285780262', icon: Phone },
  { label: 'LinkedIn', value: 'in/davishiggins', href: LINKEDIN_URL, icon: Linkedin, external: true },
  { label: 'GitHub', value: 'DavisHiggins', href: GITHUB_URL, icon: Github, external: true },
  { label: 'Instagram', value: '@daviscoded', href: 'https://instagram.com/daviscoded', icon: Instagram, external: true },
  { label: 'Website', value: 'davishiggins.com', href: 'https://davishiggins.com', icon: Globe, external: true },
  { label: 'Higgins Digital', value: 'higginsd.com', href: 'https://higginsd.com', icon: Building2, external: true },
  { label: 'Resume', value: 'PDF', href: RESUME_HREF, icon: FileText, external: true },
]

/** Lets a long address wrap only after its "@" on narrow phones. */
function breakable(value: string) {
  const at = value.indexOf('@')
  if (at <= 0) return value
  return (
    <>
      {value.slice(0, at + 1)}
      <wbr />
      {value.slice(at + 1)}
    </>
  )
}

// One screen, no scrolling: a short heading and every direct link in a single grid.
// 94px is the header's height at its tallest (desktop, with the resume label).
export function Component() {
  const entrance = usePageEntrance()
  const animate = useEntrancesEnabled()
  return (
    <m.div {...entrance}>
      <div className="section-shell flex min-h-[calc(100dvh-94px)] flex-col justify-center py-5 sm:py-8">
        <div className="mx-auto w-full max-w-5xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.22em] text-sky-300">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            CONNECTION → OPPORTUNITY
          </div>
          <h1 tabIndex={-1} data-page-heading className="text-3xl font-semibold tracking-tight text-white outline-none sm:text-4xl">
            Contact
          </h1>
          <p className="mt-2 text-base text-slate-300 sm:mt-3 sm:text-lg">The fastest ways to reach me.</p>

          <ul className="mt-5 grid grid-cols-2 gap-2.5 sm:mt-8 sm:gap-4 lg:grid-cols-4">
            {CONTACT_LINKS.map((item, index) => {
              const Icon = item.icon
              return (
                <m.li key={item.label} initial={animate ? { opacity: 0, y: 10 } : false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.26, delay: 0.04 + index * 0.035 }}>
                  <a
                    href={item.href}
                    target={item.external ? '_blank' : undefined}
                    rel={item.external ? 'noopener noreferrer' : undefined}
                    className="group relative flex h-full flex-col justify-center overflow-hidden rounded-[1.25rem] border border-white/10 bg-[#0f172a]/70 p-3.5 transition duration-300 hover:-translate-y-1 hover:border-sky-300/35 hover:bg-[#13203a]/85 hover:shadow-[0_15px_40px_rgba(56,189,248,0.15)] motion-reduce:hover:translate-y-0 sm:flex-row sm:items-center sm:justify-start sm:gap-4 sm:p-4 lg:flex-col lg:items-start lg:gap-0 lg:rounded-[1.4rem] lg:p-5"
                  >
                    <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-sky-500/20 to-cyan-400/5 opacity-0 transition duration-300 group-hover:opacity-100" aria-hidden="true" />
                    <span className="relative hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-sky-300 transition duration-300 group-hover:bg-white/10 sm:flex">
                      <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                    </span>
                    <ArrowUpRight className="absolute right-5 top-5 hidden h-4 w-4 text-slate-500 transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-sky-300 lg:block" aria-hidden="true" />
                    <span className="relative min-w-0 lg:mt-4">
                      <span className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400 sm:text-[11px] sm:tracking-[0.2em]">
                        <Icon className="h-3.5 w-3.5 shrink-0 text-sky-300 sm:hidden" aria-hidden="true" />
                        {item.label}
                      </span>
                      <span className="mt-1 block break-words text-sm font-semibold leading-snug text-white lg:text-[15px]">{breakable(item.value)}</span>
                    </span>
                    {item.external ? <span className="sr-only">(opens in a new tab)</span> : null}
                  </a>
                </m.li>
              )
            })}
          </ul>
        </div>
      </div>
    </m.div>
  )
}
