import { Link } from 'react-router-dom'
import { m } from 'framer-motion'
import { ArrowRight, Briefcase, ExternalLink } from 'lucide-react'
import profileData from '../generated/profile.json'
import { EMPLOYER_LOGOS } from '../lib/logos'
import { useEntrancesEnabled, usePageEntrance } from '../lib/motion'
import { Bullet, PageShell, SectionHeader } from '../components/ui'
import { SectionNav, slugify } from '../components/SectionNav'
import type { Profile, Role } from '../lib/types'

const profile = profileData as Profile

const SECTIONS = profile.experience.map((employer) => ({
  id: `exp-${slugify(employer.company)}`,
  label: employer.company,
  meta: employer.subtitle,
}))

function RoleBlock({ role }: { role: Role }) {
  const internal = role.link?.href.startsWith('/')
  return (
    <div data-reveal-children>
      <div className="text-xs font-medium uppercase tracking-[0.18em] text-sky-300 sm:text-sm">{role.period}</div>
      <h3 className="mt-2 break-words text-xl font-semibold leading-tight text-white sm:mt-3 sm:text-2xl">{role.title}</h3>
      {role.detail ? <div className="mt-1 text-xs text-slate-400 sm:text-sm">{role.detail}</div> : null}
      <ul data-reveal-children className="mt-5 space-y-3 text-sm leading-7 text-slate-300 sm:mt-6">
        {role.bullets.map((bullet) => (
          <Bullet key={bullet}>{bullet}</Bullet>
        ))}
      </ul>
      {role.link ? (
        <div className="mt-6">
          {internal ? (
            <Link to={role.link.href} className="secondary-btn">
              {role.link.label}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          ) : (
            <a href={role.link.href} target="_blank" rel="noopener noreferrer" className="secondary-btn">
              {role.link.label}
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          )}
        </div>
      ) : null}
    </div>
  )
}

export function Component() {
  const entrance = usePageEntrance()
  const animate = useEntrancesEnabled()
  return (
    <>
      <m.div {...entrance}>
        <PageShell reserveRail>
          <SectionHeader eyebrow="EXECUTION → BUSINESS IMPACT" title="Experience" subtitle="Hands-on experience across analytics, software, operations, and business-facing execution." />

          <div className="relative space-y-6 before:absolute before:left-[1.1rem] before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-white/10 sm:before:left-6">
            {profile.experience.map((employer, index) => (
              <m.section
                key={employer.id}
                id={`exp-${slugify(employer.company)}`}
                aria-labelledby={`exp-title-${employer.id}`}
                initial={animate && index < 3 ? { opacity: 0, y: 10 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.26, delay: index * 0.035 }}
                className="relative scroll-mt-28 pl-12 sm:pl-16"
              >
                <div className="absolute left-0 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-sky-400/30 bg-sky-400/10 text-sky-300 sm:left-1.5" aria-hidden="true">
                  <Briefcase className="h-4 w-4" />
                </div>
                <div className="glass relative overflow-hidden rounded-[2rem] p-5 shadow-soft sm:p-6">
                  <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${employer.accent ?? 'from-white/5 via-white/[0.02] to-transparent'}`} aria-hidden="true" />
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(8,17,31,0.18),rgba(8,17,31,0.88))]" aria-hidden="true" />
                  <div className="relative">
                    <div className="relative flex min-h-[3.5rem] items-start justify-between gap-4">
                      <div data-reveal-children className="min-w-0 flex-1 pr-24 sm:pr-28">
                        <h2 id={`exp-title-${employer.id}`} className="break-words text-xl font-semibold leading-tight text-white sm:text-2xl">
                          {employer.website ? (
                            <a href={employer.website} target="_blank" rel="noopener noreferrer" className="transition hover:text-sky-300">
                              {employer.company}
                            </a>
                          ) : (
                            employer.company
                          )}
                        </h2>
                        {employer.subtitle ? <div className="mt-1 text-sm text-slate-400">{employer.subtitle}</div> : null}
                      </div>
                      {EMPLOYER_LOGOS[employer.logo] ? (
                        <img
                          src={EMPLOYER_LOGOS[employer.logo]}
                          alt={`${employer.company} logo`}
                          width={96}
                          height={96}
                          loading={index < 2 ? 'eager' : 'lazy'}
                          className={`pointer-events-none absolute right-0 top-0 shrink-0 bg-transparent object-contain ${
                            employer.logo === 'kewaunee' ? 'h-11 w-11 sm:h-14 sm:w-14' : 'h-20 w-20 sm:h-24 sm:w-24'
                          }`}
                        />
                      ) : null}
                    </div>
                    {employer.roles.length > 1 ? (
                      <div className="relative mt-6 space-y-7 pl-7">
                        {employer.roles.map((role, ri) => (
                          <div key={role.title} className="relative">
                            {ri < employer.roles.length - 1 ? <span className="absolute -bottom-[2.45rem] -left-[1.4375rem] top-[0.6875rem] w-px bg-white/15" aria-hidden="true" /> : null}
                            <span className="absolute -left-[1.75rem] top-1.5 h-2.5 w-2.5 rounded-full border border-sky-300/50 bg-sky-400/40 shadow-[0_0_0_3px_rgba(8,17,31,0.65)]" aria-hidden="true" />
                            <RoleBlock role={role} />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-5">
                        <RoleBlock role={employer.roles[0]} />
                      </div>
                    )}
                  </div>
                </div>
              </m.section>
            ))}
          </div>
        </PageShell>
      </m.div>
      <SectionNav sections={SECTIONS} />
    </>
  )
}
