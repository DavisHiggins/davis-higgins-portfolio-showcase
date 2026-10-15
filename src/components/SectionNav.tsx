import { Fragment, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

// Layout effects cannot run during prerendering; fall back to useEffect there.
const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect
import { m, useReducedMotion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { useAssistant } from '../assistant/AssistantContext'

// ---------------------------------------------------------------------------
// Table of contents rail: fixed right sidebar with scrollspy (>=1280px).
//
// Rendered beside the page content, never inside an animated wrapper, so `fixed`
// has an untransformed containing block. Pages that show it opt into
// `.rail-reserve` (index.css), which yields ground only on narrower viewports.
// ---------------------------------------------------------------------------

export interface TocSection {
  id: string
  label: string
  meta?: string
  children?: TocSection[]
}

// One number, three places: the rail's `top-28`, every target's `scroll-mt-28`,
// and the programmatic scroll landing point.
const SCROLL_OFFSET = 112
// The "you are here" line sits below the landing point so sub-pixel rounding after
// a click cannot resolve the previous section and flick the highlight backwards.
const SPY_TRIGGER = 136

const spyIds = (sections: TocSection[]) =>
  sections.flatMap((section) => [section.id, ...(section.children ?? []).map((child) => child.id)])

function useScrollSpy(ids: string[]) {
  const [activeId, setActiveId] = useState<string | null>(ids[0] ?? null)
  const lockRef = useRef(false)
  const idsKey = ids.join('|')

  // Held in a ref so the observer and listeners always call the latest closure.
  const resolve = useRef<() => void>(() => {})
  resolve.current = () => {
    if (lockRef.current) return
    // Short trailing sections can never reach the trigger line, so the page bottom
    // selects the last entry.
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4) {
      setActiveId(ids[ids.length - 1] ?? null)
      return
    }
    // "The last section whose top has crossed the line": height-agnostic.
    let next = ids[0] ?? null
    for (const id of ids) {
      const el = document.getElementById(id)
      if (!el) continue
      if (el.getBoundingClientRect().top <= SPY_TRIGGER) next = id
      else break
    }
    setActiveId((prev) => (prev === next ? prev : next))
  }

  useEffect(() => {
    if (ids.length === 0) return
    const run = () => resolve.current()
    const observer = new IntersectionObserver(run, { rootMargin: `-${SPY_TRIGGER}px 0px -40% 0px`, threshold: [0, 1] })
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        run()
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    run()
    const settle = window.setTimeout(run, 400)
    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
      window.clearTimeout(settle)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey])

  const goTo = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    lockRef.current = true
    setActiveId(id)
    window.scrollTo({
      top: Math.max(0, el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET),
      // 'instant', not 'auto': `auto` defers to html { scroll-behavior: smooth }.
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    })
    if (history.replaceState) history.replaceState(history.state, '', `#${id}`)
    el.setAttribute('tabindex', '-1')
    el.focus({ preventScroll: true })

    let idle = 0
    let hardStop = 0
    const onTick = () => {
      window.clearTimeout(idle)
      idle = window.setTimeout(release, 130)
    }
    function release() {
      lockRef.current = false
      window.clearTimeout(idle)
      window.clearTimeout(hardStop)
      window.removeEventListener('scrollend', release)
      window.removeEventListener('scroll', onTick)
      resolve.current()
    }
    if ('onscrollend' in window) window.addEventListener('scrollend', release, { once: true })
    window.addEventListener('scroll', onTick, { passive: true })
    idle = window.setTimeout(release, 130)
    hardStop = window.setTimeout(release, 1400)
  }, [])

  return { activeId, goTo }
}

function SectionNavItem({ item, depth, isActive, onNavigate }: { item: TocSection; depth: number; isActive: boolean; onNavigate: (id: string) => void }) {
  return (
    <li data-toc={item.id}>
      <a
        href={`#${item.id}`}
        onClick={(event) => {
          event.preventDefault()
          onNavigate(item.id)
        }}
        aria-current={isActive ? 'location' : undefined}
        className={`block rounded-r-lg py-[6px] pr-1 transition-colors duration-200 ${depth === 0 ? 'pl-3' : 'pl-6'} ${
          isActive ? 'text-sky-300' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <span className={`block line-clamp-2 leading-snug ${depth === 0 ? 'text-[12px] font-medium' : 'text-[11px]'}`}>{item.label}</span>
        {item.meta ? (
          <span className={`mt-0.5 block truncate text-[10px] transition-colors duration-200 ${isActive ? 'text-sky-300/60' : 'text-slate-500'}`}>{item.meta}</span>
        ) : null}
      </a>
    </li>
  )
}

export function SectionNav({ sections }: { sections: TocSection[] }) {
  const reduceMotion = useReducedMotion()
  const ids = useMemo(() => spyIds(sections), [sections])
  const { activeId, goTo } = useScrollSpy(ids)
  const { isOpen: assistantOpen } = useAssistant()
  const listRef = useRef<HTMLOListElement>(null)
  const [indicator, setIndicator] = useState<{ top: number; height: number } | null>(null)

  // One measured indicator element (no per-item layoutId, which leaked presence
  // registrations in framer-motion 11 and blanked pages on navigation).
  useIsomorphicLayoutEffect(() => {
    const measure = () => {
      const el = activeId ? listRef.current?.querySelector<HTMLElement>(`[data-toc="${CSS.escape(activeId)}"]`) : null
      setIndicator(el ? { top: el.offsetTop, height: el.offsetHeight } : null)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [activeId, sections])

  if (sections.length === 0) return null

  return (
    <aside className="hidden xl:block">
      <nav
        aria-label="On this page"
        className={`glass fixed right-4 top-28 z-30 max-h-[calc(100vh-8.5rem)] w-40 overflow-y-auto overscroll-contain rounded-[1.25rem] p-4 shadow-soft transition-opacity duration-200 ${
          assistantOpen ? 'pointer-events-none opacity-0' : 'opacity-100'
        }`}
      >
        <div className="mb-3 flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-sky-300">
          <Sparkles className="h-3 w-3 shrink-0" aria-hidden="true" />
          On this page
        </div>
        <ol ref={listRef} className="relative space-y-0.5 border-l border-white/10">
          {indicator ? (
            <m.span
              aria-hidden
              initial={false}
              animate={{ y: indicator.top, height: indicator.height }}
              transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 34, mass: 0.7 }}
              className="absolute left-0 top-0 w-[2px] rounded-full bg-gradient-to-b from-sky-400 to-cyan-300 shadow-[0_0_10px_rgba(56,189,248,0.55)]"
            />
          ) : null}
          {sections.map((section) => (
            <Fragment key={section.id}>
              <SectionNavItem item={section} depth={0} isActive={activeId === section.id} onNavigate={goTo} />
              {(section.children ?? []).map((child) => (
                <SectionNavItem key={child.id} item={child} depth={1} isActive={activeId === child.id} onNavigate={goTo} />
              ))}
            </Fragment>
          ))}
        </ol>
      </nav>
    </aside>
  )
}

export const slugify = (value: string) =>
  String(value)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
