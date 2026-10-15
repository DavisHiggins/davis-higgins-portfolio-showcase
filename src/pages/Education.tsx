import { m } from 'framer-motion'
import { ExternalLink, Medal } from 'lucide-react'
import profileData from '../generated/profile.json'
import anthropologyAward from '../assets/anthropologycert.png'
import thecreek from '../assets/thecreek.png'
import { CVCC_LOGO, UNCC_LOGO } from '../lib/logos'
import { usePageEntrance } from '../lib/motion'
import { PageShell, Pill, SectionHeader } from '../components/ui'
import { SectionNav } from '../components/SectionNav'
import type { Profile } from '../lib/types'

const profile = profileData as Profile
const [uncc, cvcc] = profile.education
const award = profile.awards[0]

const SECTIONS = [
  { id: 'edu-academic-background', label: 'Academic Background', meta: 'UNC Charlotte · Catawba Valley' },
  { id: 'edu-honors', label: 'Honors', meta: 'Public Anthropology Award' },
]

export function Component() {
  const entrance = usePageEntrance()
  return (
    <>
      <m.div {...entrance}>
        <PageShell reserveRail>
          <SectionHeader eyebrow="FOUNDATION → TECHNICAL DEVELOPMENT" title="Education" subtitle="Classroom efficiency, technical development, and the foundation behind my skill set." />

          <div className="space-y-10">
            <section aria-labelledby="edu-academic-background">
              <h2 id="edu-academic-background" className="scroll-mt-28 text-2xl font-semibold text-white">
                Academic Background
              </h2>
              <div className="mt-6 space-y-6">
                <div className="glass rounded-[2rem] px-4 py-6 shadow-soft transition-colors duration-300 hover:border-sky-300/20 sm:px-5 sm:py-7">
                  <div className="flex items-start gap-3 sm:gap-2.5">
                    <div className="flex h-[70px] w-[70px] shrink-0 items-start justify-center sm:h-[84px] sm:w-[86px]">
                      <img
                        src={UNCC_LOGO}
                        alt="UNC Charlotte logo"
                        width={85}
                        height={55}
                        className="mt-0 h-[48px] w-[70px] object-contain sm:h-[55px] sm:w-[85px]"
                        style={{ filter: 'brightness(0) saturate(100%) invert(74%) sepia(22%) saturate(1185%) hue-rotate(180deg) brightness(101%) contrast(101%)' }}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="break-words text-xl font-semibold leading-tight text-white sm:text-2xl">{uncc.institution}</h3>
                      <p className="mt-3 text-sm text-slate-400">
                        {uncc.degree} • Minor in {uncc.minor} • {uncc.period}
                      </p>
                      <div className="mt-6 flex flex-wrap gap-2">
                        <Pill>GPA: {uncc.gpaDisplay}</Pill>
                        {uncc.honors.map((h) => (
                          <Pill key={h}>{h}</Pill>
                        ))}
                      </div>
                      <p className="mt-6 text-sm leading-7 text-slate-300">{uncc.description}</p>
                    </div>
                  </div>
                </div>

                <div className="glass rounded-[2rem] px-4 py-6 shadow-soft transition-colors duration-300 hover:border-sky-300/20 sm:px-5 sm:py-7">
                  <div className="flex items-start gap-3 sm:gap-2">
                    <div className="flex h-[60px] w-[70px] shrink-0 items-start justify-center sm:h-[70px] sm:w-[84px]">
                      <img
                        src={CVCC_LOGO}
                        alt="Catawba Valley Community College logo"
                        width={55}
                        height={56}
                        loading="lazy"
                        className="mt-0 h-[48px] w-[48px] object-contain sm:h-[56px] sm:w-[55px]"
                        style={{ filter: 'hue-rotate(192deg) saturate(135%) brightness(1.18) contrast(1.08) drop-shadow(0 0 2px rgba(125, 211, 252, 0.12))' }}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="break-words text-lg font-semibold leading-tight text-white sm:text-xl">{cvcc.institution}</h3>
                      <p className="mt-3 text-sm text-slate-400">{cvcc.period}</p>
                      <div className="mt-5 flex flex-wrap gap-2">
                        <Pill>GPA: {cvcc.gpaDisplay}</Pill>
                        {cvcc.honors.map((h) => (
                          <Pill key={h}>{h}</Pill>
                        ))}
                      </div>
                      <p className="mt-6 text-sm leading-7 text-slate-300">{cvcc.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section aria-labelledby="edu-honors">
              <h2 id="edu-honors" className="mt-16 scroll-mt-28 text-2xl font-semibold text-white">
                Honors
              </h2>
              <div className="mt-6 space-y-5">
                <div className="glass rounded-[2rem] p-5 shadow-soft sm:p-7">
                  <div className="flex items-start gap-4 sm:gap-7">
                    <div className="shrink-0 rounded-2xl border border-sky-300/20 bg-sky-400/10 p-3 text-sky-300 shadow-[0_0_15px_rgba(56,189,248,0.1)]" aria-hidden="true">
                      <Medal className="h-6 w-6 sm:h-8 sm:w-7" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="break-words text-lg font-semibold leading-tight text-white sm:text-xl">{award.name}</h3>
                      <p className="mt-2 text-sm text-slate-400">
                        {award.organization} • {award.date}
                      </p>
                      <div className="mt-5 flex flex-wrap gap-2">
                        <Pill>Published Work</Pill>
                        <Pill>Storytelling</Pill>
                      </div>
                      <p className="mt-6 text-sm leading-7 text-slate-300">{award.description}</p>
                      <div className="mt-6 flex flex-wrap gap-2">
                        <a href={anthropologyAward} target="_blank" rel="noopener noreferrer" className="secondary-btn">
                          View Certification
                          <ExternalLink className="h-4 w-4" aria-hidden="true" />
                        </a>
                        <a href={thecreek} target="_blank" rel="noopener noreferrer" className="secondary-btn">
                          Publication
                          <ExternalLink className="h-4 w-4" aria-hidden="true" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </PageShell>
      </m.div>
      <SectionNav sections={SECTIONS} />
    </>
  )
}
