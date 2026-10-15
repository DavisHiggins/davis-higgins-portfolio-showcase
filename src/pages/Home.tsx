import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { m } from 'framer-motion'
import { ArrowRight, ExternalLink, Github, Globe, LineChart, NotebookPen } from 'lucide-react'
import headshot from '../assets/opt/headshot.webp'
import { DH_MARK, EMPLOYER_LOGOS } from '../lib/logos'
import { usePageEntrance } from '../lib/motion'
import { PageShell } from '../components/ui'
import notesIndex from '../generated/notes-index.json'

const STATS = [
  { value: '3.9', label: 'UNCC GPA' },
  { value: '20+', label: 'Executive Dashboards' },
  { value: '10+', label: 'Production Products Shipped' },
  { value: '1+ yr', label: 'Professional Analytics Experience' },
]

const CURRENT_ROLES = [
  { logo: EMPLOYER_LOGOS['one-chaptr'], title: 'Software Engineer', company: 'One Chaptr Group', to: '/projects/one-chaptr' },
  { logo: EMPLOYER_LOGOS.kewaunee, title: 'Data Analyst', company: 'Kewaunee Scientific Corporation', to: '/projects/kewaunee-analytics' },
]

const FEATURED_SITES = [
  { name: 'Flowcast', href: 'https://flowcastweb.vercel.app', caseStudy: '/projects/flowcast' },
  { name: 'Contender', href: 'https://contender.davishiggins.com', caseStudy: '/projects/contender' },
  { name: 'Higgins Digital', href: 'https://higginsd.com', caseStudy: '/projects/higgins-digital' },
]

const tagClass =
  'rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-300 sm:px-4 sm:py-2 sm:text-[11px] sm:tracking-[0.2em]'

interface Activity {
  lastPush: string | null
  lastRepo: string | null
  recentRepos: number
}
type ActivityState = { status: 'loading' } | { status: 'ready'; data: Activity } | { status: 'error' }

const CACHE_KEY = 'gh-activity-v3'
const CACHE_MS = 15 * 60 * 1000

// GitHub activity loads after the page renders, never blocks it, is bounded to a
// few seconds, and is cached for the session. Failures say so plainly.
function useGitHubActivity(): ActivityState {
  const [state, setState] = useState<ActivityState>({ status: 'loading' })

  useEffect(() => {
    try {
      const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) ?? 'null') as { at: number; data: Activity } | null
      if (cached && Date.now() - cached.at < CACHE_MS) {
        setState({ status: 'ready', data: cached.data })
        return
      }
    } catch {
      // Storage unavailable; fetch normally.
    }

    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 6000)
    const user = 'DavisHiggins'
    const headers = { Accept: 'application/vnd.github+json' }

    async function load() {
      const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      // One request per visitor (cached for the session) keeps well inside GitHub's
      // unauthenticated rate limit.
      const reposRes = await fetch(`https://api.github.com/users/${user}/repos?per_page=100&sort=pushed&direction=desc`, { signal: controller.signal, headers })
      if (!reposRes.ok) throw new Error('repos')
      const repos = (await reposRes.json()) as { name: string; pushed_at: string; fork?: boolean }[]
      const own = Array.isArray(repos) ? repos.filter((r) => !r.fork) : []
      const latest = own[0] ?? null
      const recentCount = own.filter((r) => new Date(r.pushed_at) >= since).length
      const data: Activity = { lastPush: latest?.pushed_at ?? null, lastRepo: latest?.name ?? null, recentRepos: recentCount }
      try {
        sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data }))
      } catch {
        // Ignore storage failures.
      }
      setState({ status: 'ready', data })
    }

    load()
      .catch(() => {
        if (!controller.signal.aborted || controller.signal.reason !== 'unmount') setState({ status: 'error' })
      })
      .finally(() => window.clearTimeout(timeout))
    return () => {
      window.clearTimeout(timeout)
      controller.abort('unmount')
    }
  }, [])

  return state
}

function timeAgo(iso: string): string {
  const hours = Math.floor((Date.now() - new Date(iso).getTime()) / 3_600_000)
  if (hours < 1) return 'less than an hour ago'
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
  const days = Math.floor(hours / 24)
  return `${days} day${days === 1 ? '' : 's'} ago`
}

function GitHubActivityCard() {
  const state = useGitHubActivity()
  const ready = state.status === 'ready' && state.data.lastPush
  return (
    <div className="glass rounded-[1.75rem] p-5 shadow-soft">
      <div className="flex items-start gap-4">
        <div className="shrink-0 rounded-2xl bg-white/5 p-3 text-sky-300">
          <Github className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-white">GitHub Activity</h3>
            {ready ? <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 motion-safe:animate-pulse" aria-hidden="true" /> : null}
          </div>
          <p className="mt-2 min-h-[1.25rem] text-sm text-slate-300" aria-live="polite">
            {state.status === 'loading'
              ? 'Loading recent activity…'
              : state.status === 'ready' && state.data.lastPush
                ? `Last public push ${timeAgo(state.data.lastPush)}${state.data.lastRepo ? ` to ${state.data.lastRepo}` : ''}`
                : state.status === 'ready'
                  ? 'No recent public activity'
                  : 'Activity is unavailable right now'}
          </p>
          <p className="mt-1 min-h-[1rem] text-xs text-slate-400">
            {state.status === 'ready' ? `${state.data.recentRepos} public ${state.data.recentRepos === 1 ? 'repository' : 'repositories'} updated in the last 30 days` : 'Public repositories only'}
          </p>
          <a href="https://github.com/DavisHiggins" target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-sky-300 transition hover:text-sky-200">
            View profile <ExternalLink className="h-3 w-3" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  )
}

function LatestWritingCard() {
  const latest = notesIndex[0]
  return (
    <div className="glass rounded-[1.75rem] p-5 shadow-soft">
      <div className="flex items-start gap-4">
        <div className="shrink-0 rounded-2xl bg-white/5 p-3 text-sky-300">
          <NotebookPen className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold text-white">Latest Writing</h3>
          <p className="mt-2 text-xs uppercase tracking-[0.16em] text-slate-400">
            {latest.category} · {latest.dateLabel}
          </p>
          <Link to={`/writing/${latest.slug}`} className="mt-1 block text-sm font-medium leading-6 text-slate-200 transition hover:text-sky-200">
            {latest.title}
          </Link>
          <Link to="/writing" className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-sky-300 transition hover:text-sky-200">
            All writing <ArrowRight className="h-3 w-3" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  )
}

function LiveSitesCard() {
  return (
    <div className="glass rounded-[1.75rem] p-5 shadow-soft">
      <div className="flex items-start gap-4">
        <div className="shrink-0 rounded-2xl bg-white/5 p-3 text-sky-300">
          <Globe className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold text-white">Live Products</h3>
          <ul className="mt-3 space-y-2">
            {FEATURED_SITES.map((site) => (
              <li key={site.name} className="flex items-center justify-between gap-3 text-sm">
                <Link to={site.caseStudy} className="text-slate-200 transition hover:text-sky-200">
                  {site.name}
                </Link>
                <a href={site.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-slate-400 transition hover:text-sky-200">
                  Visit <ExternalLink className="h-3 w-3" aria-hidden="true" />
                  <span className="sr-only">{site.name} (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export function Component() {
  const entrance = usePageEntrance()
  return (
    <m.div {...entrance}>
      <PageShell>
        <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.03] px-4 py-7 sm:rounded-[2.5rem] sm:px-8 sm:py-8 lg:px-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(125,211,252,0.12),transparent_32%),radial-gradient(circle_at_top_right,rgba(99,102,241,0.12),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))]" aria-hidden="true" />
          <div className="absolute -left-12 top-10 h-44 w-44 rounded-full bg-sky-400/10 blur-3xl" aria-hidden="true" />
          <div className="absolute right-0 top-0 h-52 w-52 rounded-full bg-indigo-500/10 blur-3xl" aria-hidden="true" />
          <div className="absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" aria-hidden="true" />

          <div className="relative grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <div className="min-w-0">
              <div className="mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-2 text-xs font-medium text-sky-200 sm:px-4 sm:text-sm">
                <LineChart className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="break-words">Data Science • Artificial Intelligence • Charlotte, NC</span>
              </div>

              <h1 tabIndex={-1} data-page-heading className="max-w-4xl break-words text-4xl font-semibold tracking-tight text-white outline-none sm:text-6xl lg:text-7xl">
                Hi, I'm <span className="bg-gradient-to-r from-sky-300 to-cyan-200 bg-clip-text text-transparent">Davis Higgins</span>
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:mt-6 sm:text-xl sm:leading-8">
                Data Science student at UNC Charlotte building dashboards, reporting systems, and product-oriented tools that make information clearer, faster, and more useful.
              </p>

              <div className="mt-6 flex flex-wrap gap-2 sm:gap-3">
                <div className={tagClass}>REAL-WORLD DATA EXPERIENCE</div>
                <div className={tagClass}>END-TO-END SYSTEM CREATION</div>
                <div className={tagClass}>BUSINESS-DRIVEN INSIGHTS</div>
                <div className={tagClass}>DECISION-FOCUSED MODELING</div>
              </div>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base sm:leading-8">
                Through coursework, personal projects, and internship experience, I have developed skills in data analytics, data cleaning and preprocessing, statistical modeling, machine learning, data visualization, and data governance.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/projects" className="primary-btn">
                  See Projects
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link to="/experience" className="secondary-btn">
                  Professional Experience
                </Link>
              </div>

              <dl className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {STATS.map((item) => (
                  <div key={item.label} className="glass flex flex-col-reverse rounded-3xl p-5 shadow-soft">
                    <dt className="mt-1 text-sm text-slate-400">{item.label}</dt>
                    <dd className="text-2xl font-bold text-white">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="mx-auto w-full max-w-md">
              <div className="rounded-[2rem] border border-white/10 bg-[#5f7ea4]/95 p-5 shadow-glow">
                <div className="overflow-hidden rounded-[1.6rem] border border-white/10 bg-[#a8b9d5]">
                  <div className="aspect-[4/5] bg-[#a8b9d5]">
                    <img src={headshot} alt="Professional headshot of Davis Higgins" width={800} height={1056} className="h-full w-full object-cover" />
                  </div>
                </div>

                <div className="mt-5 rounded-[1.5rem] border border-white/10 bg-[#12203b] p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white">
                      <img src={DH_MARK} alt="" width={48} height={48} className="h-12 w-12 object-contain" />
                    </div>
                    <div>
                      <div className="text-sm uppercase tracking-[0.35em] text-sky-300">Focus</div>
                      <div className="mt-2 text-base leading-7 text-slate-300">
                        Motivated student looking for opportunities to apply my skills, develop professionally, grow personally, and learn as much as possible.
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 rounded-[1.5rem] border border-white/10 bg-white/[0.05] p-5">
                    <div className="text-sm text-slate-400">Current Roles</div>
                    <ul className="mt-3 space-y-4">
                      {CURRENT_ROLES.map((role) => (
                        <li key={role.company}>
                          <Link to={role.to} className="group flex items-center gap-4">
                            <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl">
                              <img src={role.logo} alt="" width={44} height={44} className="h-11 w-11 object-contain" />
                            </span>
                            <span className="min-w-0">
                              <span className="block break-words text-lg font-semibold leading-snug text-white transition group-hover:text-sky-200">{role.title}</span>
                              <span className="block text-sm text-slate-300">{role.company}</span>
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-8" aria-labelledby="live-updates">
          <div className="mb-4 flex items-center gap-2">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 motion-safe:animate-pulse" aria-hidden="true" />
            <h2 id="live-updates" className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-300">
              Live Updates
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <GitHubActivityCard />
            <LatestWritingCard />
            <LiveSitesCard />
          </div>
        </section>
      </PageShell>
    </m.div>
  )
}
