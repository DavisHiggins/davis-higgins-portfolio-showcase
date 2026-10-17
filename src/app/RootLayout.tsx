import { Suspense, lazy, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Outlet, ScrollRestoration, useLocation, useNavigate, useNavigationType } from 'react-router-dom'
import { LazyMotion, MotionConfig } from 'framer-motion'
import { Header } from './Header'
import { AssistantProvider, useAssistant } from '../assistant/AssistantContext'
import { EntranceProvider } from '../lib/motion'
import { applyMetaToDocument, metaForPath } from '../lib/meta'
import { loadScrollEngine, scrollToTop } from '../lib/scroll'

// Layout effects cannot run during prerendering; fall back to useEffect there.
const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

const AssistantPanel = lazy(() => import('../assistant/AssistantPanel'))
const loadMotionFeatures = () => import('../lib/motion-features').then((mod) => mod.default)

// Pages that show the decorative accent glow behind their content.
const ACCENT_PATHS = new Set(['/education', '/contact', '/writing'])

function AccentBackdrop() {
  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        background: [
          'radial-gradient(ellipse 60% 50% at -5% 15%, rgba(56,189,248,0.13) 0%, transparent 70%)',
          'radial-gradient(ellipse 55% 55% at 105% 40%, rgba(34,211,238,0.09) 0%, transparent 70%)',
          'radial-gradient(ellipse 50% 45% at 42% 110%, rgba(99,102,241,0.11) 0%, transparent 70%)',
        ].join(', '),
      }}
    />
  )
}

/** Title/meta sync, focus management, and a polite route announcement. */
function RouteEffects() {
  const location = useLocation()
  const navigationType = useNavigationType()
  const navigate = useNavigate()
  const [announcement, setAnnouncement] = useState('')
  const firstRender = useRef(true)
  const previousPath = useRef(location.pathname)

  // Map old in-page anchors (e.g. #proj-cade) from the single-page version once.
  useEffect(() => {
    if (location.pathname !== '/' || !/^#(proj|exp|edu|impact|skills)-/.test(location.hash)) return
    void import('./legacy').then(({ legacyHashTarget }) => {
      const target = legacyHashTarget(location.pathname, location.hash)
      if (target) navigate(target, { replace: true })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const meta = metaForPath(location.pathname)
    applyMetaToDocument(meta)
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    // Filter changes only alter the query string: keep focus on the filter.
    if (previousPath.current === location.pathname) return
    previousPath.current = location.pathname
    setAnnouncement(meta.title.split(' | ')[0])
    if (navigationType === 'POP') return
    const frame = window.requestAnimationFrame(() => {
      const heading = document.querySelector<HTMLElement>('[data-page-heading]')
      heading?.focus({ preventScroll: true })
    })
    return () => window.cancelAnimationFrame(frame)
  }, [location.pathname, location.search, navigationType])

  return (
    <div className="sr-only" aria-live="polite" aria-atomic="true">
      {announcement}
    </div>
  )
}

/** Every link navigation to another page lands at the top of that page, before it
 *  paints, even mid smooth-scroll. Back/Forward keep the browser's restored position
 *  (ScrollRestoration), and hash links keep their target. Also starts the smooth
 *  scroll engine and (re)binds scroll-triggered text reveals for each page. */
function ScrollManager() {
  const location = useLocation()
  const navigationType = useNavigationType()
  const previousPath = useRef(location.pathname)

  useIsomorphicLayoutEffect(() => {
    if (previousPath.current === location.pathname) return
    previousPath.current = location.pathname
    if (navigationType !== 'POP' && !location.hash) scrollToTop()
  }, [location.pathname, location.hash, navigationType])

  useEffect(() => {
    const main = document.getElementById('main')
    if (!main) return
    let dispose: (() => void) | undefined
    let cancelled = false
    void loadScrollEngine().then((engine) => {
      if (!cancelled) dispose = engine.reveal(main)
    })
    return () => {
      cancelled = true
      dispose?.()
    }
  }, [location.pathname])

  return null
}

function AssistantMount() {
  const { hasOpened } = useAssistant()
  if (!hasOpened) return null
  return (
    <Suspense fallback={null}>
      <AssistantPanel />
    </Suspense>
  )
}

export function RootLayout() {
  const { pathname } = useLocation()
  const accent = ACCENT_PATHS.has(pathname)

  return (
    <LazyMotion features={loadMotionFeatures} strict>
    <MotionConfig reducedMotion="user">
      <EntranceProvider>
        <AssistantProvider>
          <div className="min-h-screen bg-ink text-slate-100">
            <a href="#main" className="skip-link">
              Skip to content
            </a>
            <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
              <div className="absolute inset-0 bg-grid bg-[size:52px_52px] opacity-[0.04]" />
              <div className="absolute left-1/2 top-0 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-sky-500/20 blur-3xl" />
              <div className="absolute right-0 top-40 h-[28rem] w-[28rem] rounded-full bg-indigo-500/15 blur-3xl" />
              <div className="absolute bottom-0 left-0 h-[24rem] w-[24rem] rounded-full bg-cyan-400/10 blur-3xl" />
              <div className={`absolute inset-0 transition-opacity duration-500 ${accent ? 'opacity-100' : 'opacity-0'}`}>
                <AccentBackdrop />
              </div>
            </div>

            <Header />
            <main id="main" tabIndex={-1} className="outline-none">
              <Outlet />
            </main>
            <AssistantMount />
            <RouteEffects />
            <ScrollRestoration getKey={(location) => (location.pathname === '/projects' || location.pathname === '/writing' ? location.pathname + location.search : location.key)} />
            <ScrollManager />
          </div>
        </AssistantProvider>
      </EntranceProvider>
    </MotionConfig>
    </LazyMotion>
  )
}
