import { m } from 'framer-motion'
import { Clock, ExternalLink, Github, Globe, Instagram, Linkedin, Mail, Phone, Sparkles } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useEntrancesEnabled, usePageEntrance } from '../lib/motion'
import { PageShell, SectionHeader } from '../components/ui'

interface ContactLink {
  label: string
  value: string
  href: string
  icon: LucideIcon
  glow: string
  external?: boolean
}

const CONTACT_LINKS: ContactLink[] = [
  { label: 'Email', value: 'davishiggins@icloud.com', href: 'mailto:davishiggins@icloud.com', icon: Mail, glow: 'from-sky-500/25 to-cyan-400/10' },
  { label: 'LinkedIn', value: 'linkedin.com/in/davishiggins', href: 'https://www.linkedin.com/in/davishiggins', icon: Linkedin, glow: 'from-blue-500/25 to-sky-400/10', external: true },
  { label: 'Phone', value: '+1 (828) 578-0262', href: 'tel:+18285780262', icon: Phone, glow: 'from-violet-500/25 to-fuchsia-400/10' },
  { label: 'Instagram', value: 'instagram.com/daviscoded', href: 'https://instagram.com/daviscoded', icon: Instagram, glow: 'from-emerald-500/25 to-teal-400/10', external: true },
  { label: 'GitHub', value: 'github.com/davishiggins', href: 'https://github.com/davishiggins', icon: Github, glow: 'from-slate-400/25 to-slate-200/10', external: true },
  { label: 'Website', value: 'davishiggins.com', href: 'https://davishiggins.com', icon: Globe, glow: 'from-cyan-500/25 to-sky-400/10', external: true },
]

export function Component() {
  const entrance = usePageEntrance()
  const animate = useEntrancesEnabled()
  return (
    <m.div {...entrance}>
      <PageShell>
        <SectionHeader eyebrow="CONNECTION → OPPORTUNITY" title="Contact" subtitle="Direct ways to reach me for opportunities, collaboration, or professional conversations." />

        <div className="mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.28)] sm:p-8">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/50 to-transparent" aria-hidden="true" />
            <div className="absolute inset-0 bg-gradient-to-br from-sky-500/12 via-transparent to-indigo-500/10" aria-hidden="true" />
            <div className="absolute -right-20 top-0 h-56 w-56 rounded-full bg-sky-400/10 blur-3xl" aria-hidden="true" />
            <div className="absolute -left-16 bottom-0 h-52 w-52 rounded-full bg-violet-500/10 blur-3xl" aria-hidden="true" />

            <div className="relative">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-sky-300">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                Let's Connect
              </div>
              <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Direct Links</h2>
              <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
                I am actively looking for opportunities to apply my skills, continue developing professionally, and keep building meaningful analytics and product-oriented work.
              </p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/5 px-3.5 py-1.5 text-xs font-medium text-emerald-200">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                Usually responds within 24 hours
              </div>

              <ul className="mt-8 grid gap-4 md:grid-cols-3">
                {CONTACT_LINKS.map((item, index) => {
                  const Icon = item.icon
                  return (
                    <m.li key={item.label} initial={animate ? { opacity: 0, y: 10 } : false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.24, delay: index * 0.035 }}>
                      <a
                        href={item.href}
                        target={item.external ? '_blank' : undefined}
                        rel={item.external ? 'noopener noreferrer' : undefined}
                        className="group relative block h-full overflow-hidden rounded-[1.6rem] border border-white/10 bg-[#0f172a]/70 p-5 transition duration-300 hover:-translate-y-1 hover:border-sky-300/30 hover:bg-[#13203a]/85 hover:shadow-[0_15px_40px_rgba(56,189,248,0.15)] motion-reduce:hover:translate-y-0"
                      >
                        <div className={`absolute inset-0 bg-gradient-to-br ${item.glow} opacity-0 transition duration-300 group-hover:opacity-100`} aria-hidden="true" />
                        <div className="relative">
                          <div className="flex items-center justify-between">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-sky-300 transition duration-300 group-hover:bg-white/10">
                              <Icon className="h-5 w-5" aria-hidden="true" />
                            </div>
                            {item.external ? <ExternalLink className="h-4 w-4 text-slate-500 transition duration-300 group-hover:text-sky-300" aria-hidden="true" /> : null}
                          </div>
                          <div className="mt-5 text-sm uppercase tracking-[0.22em] text-slate-400">{item.label}</div>
                          <div className="mt-2 break-words text-lg font-semibold text-white">{item.value}</div>
                          {item.external ? <span className="sr-only">(opens in a new tab)</span> : null}
                        </div>
                      </a>
                    </m.li>
                  )
                })}
              </ul>
            </div>
          </div>
        </div>
      </PageShell>
    </m.div>
  )
}
