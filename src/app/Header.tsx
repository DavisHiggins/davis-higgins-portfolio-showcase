import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, m } from 'framer-motion'
import { FileText, X } from 'lucide-react'
import { NAV_ITEMS, RESUME_HREF, activeNavItem } from '../lib/site'
import { DH_MARK } from '../lib/logos'
import { preloadAssistant, useAssistant } from '../assistant/AssistantContext'
import { ResumeLink } from './ResumeLink'

function ChatGlyph({ size = 16, fill = 'rgba(125,211,252,0.9)' }: { size?: number; fill?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill={fill} aria-hidden="true">
      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
    </svg>
  )
}

export function Header() {
  const { pathname } = useLocation()
  const { isOpen: assistantOpen, toggle } = useAssistant()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const active = activeNavItem(pathname)

  // Close the menu after any navigation.
  useEffect(() => setMenuOpen(false), [pathname])

  // Menu keyboard behavior: focus the first item, Escape closes and restores focus.
  useEffect(() => {
    if (!menuOpen) return
    const first = menuRef.current?.querySelector<HTMLElement>('a, button')
    first?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        menuButtonRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [menuOpen])

  const launcherProps = {
    'aria-expanded': assistantOpen,
    'aria-controls': 'davis-intelligence',
    onPointerEnter: preloadAssistant,
    onFocus: preloadAssistant,
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#08111f]/85 backdrop-blur-xl">
        <div className="mx-auto grid w-full max-w-[1600px] grid-cols-[auto_1fr_auto] items-center gap-3 px-3 py-4 sm:px-5 lg:px-6">
          {/* Left: identity card */}
          <Link to="/" className="flex items-center justify-self-start rounded-2xl" aria-label="Davis Higgins, home">
            <span className="hidden items-center gap-3.5 sm:flex">
              <span className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white">
                <img src={DH_MARK} alt="" width={48} height={48} className="h-12 w-12 object-contain" />
              </span>
              <span className="leading-none">
                <span className="block text-sm font-semibold uppercase tracking-[0.24em] text-sky-300">DAVIS HIGGINS</span>
                <span className="block whitespace-nowrap text-sm text-slate-400">Data Analyst | Data Science &amp; AI |</span>
                <span className="block whitespace-nowrap text-sm text-slate-400">Web Developer | Digital Creator</span>
              </span>
            </span>
            <span className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white sm:hidden">
              <img src={DH_MARK} alt="" width={40} height={40} className="h-10 w-10 object-contain" />
            </span>
          </Link>

          {/* Center: primary navigation */}
          <nav aria-label="Primary" className="hidden flex-shrink-0 items-center gap-1.5 justify-self-center rounded-full border border-white/10 bg-white/5 px-4 py-2.5 shadow-glow xl:flex">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon
              const isActive = active?.to === item.to
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  aria-current={isActive ? 'page' : undefined}
                  className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium transition ${
                    isActive ? 'bg-white text-slate-950' : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {item.label}
                </NavLink>
              )
            })}
          </nav>

          {/* Right: resume document and assistant */}
          <div className="flex items-center gap-2 justify-self-end sm:gap-2.5">
            <ResumeLink className="hidden xl:inline-flex" />
            <button
              type="button"
              onClick={(event) => toggle(event.currentTarget)}
              {...launcherProps}
              className="hidden items-center gap-2.5 whitespace-nowrap rounded-full border-2 border-white/75 bg-[#0A1628] px-6 py-3 text-base font-bold text-white transition hover:border-white hover:shadow-[0_0_20px_rgba(56,189,248,0.25)] xl:inline-flex"
            >
              <ChatGlyph />
              <span>Ask Davis AI</span>
            </button>

            {/* Below xl: active section, resume, assistant, menu */}
            <span className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 sm:inline xl:hidden">
              {active?.label ?? 'Menu'}
            </span>
            <ResumeLink compact className="xl:hidden" />
            <button
              type="button"
              onClick={(event) => toggle(event.currentTarget)}
              {...launcherProps}
              aria-label="Ask Davis AI, the portfolio assistant"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sky-300 transition hover:bg-white/10 hover:text-sky-200 xl:hidden"
            >
              <ChatGlyph size={17} fill="currentColor" />
            </button>
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white xl:hidden"
              aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              {menuOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <m.div
            id="mobile-menu"
            ref={menuRef}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-x-0 top-[92px] z-40 max-h-[calc(100dvh-100px)] overflow-y-auto xl:hidden"
          >
            <nav aria-label="Mobile" className="mx-4 overflow-hidden rounded-[1.5rem] border border-sky-300/20 bg-[#0a1322]/95 shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-xl">
              <div className="p-3">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon
                  const isActive = active?.to === item.to
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      aria-current={isActive ? 'page' : undefined}
                      className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                        isActive ? 'bg-white/10 text-white ring-1 ring-sky-300/30' : 'text-slate-300 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-sky-300' : 'text-slate-400'}`} aria-hidden="true" />
                      {item.label}
                      {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-sky-400" aria-hidden="true" />}
                    </NavLink>
                  )
                })}
                <a
                  href={RESUME_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
                >
                  <FileText className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
                  Resume (PDF)
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </div>
              <div className="border-t border-white/5 px-3 pb-3">
                <Link
                  to="/contact"
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-sky-300/10 px-4 py-3 text-sm font-semibold text-sky-200 transition hover:bg-sky-300/20"
                >
                  Contact Me
                </Link>
              </div>
            </nav>
          </m.div>
        )}
      </AnimatePresence>
    </>
  )
}
