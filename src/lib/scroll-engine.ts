import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

// The site's one scroll system: Lenis smooths the native window scroll on GSAP's
// ticker, and ScrollTrigger reads that same scroll position for reveals. Loaded
// after first paint (see scroll.ts), so it never delays the initial render.
// Lenis honors prefers-reduced-motion on its own (1:1 scrolling, instant jumps).

gsap.registerPlugin(ScrollTrigger)

let lenis: Lenis | null = null
const raf = (time: number) => lenis?.raf(time * 1000)

export function start(): void {
  if (lenis) return
  lenis = new Lenis({ lerp: 0.1, allowNestedScroll: true, stopInertiaOnNavigate: true })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add(raf)
  gsap.ticker.lagSmoothing(0)
}

export function scrollTo(target: number | HTMLElement, options: { offset?: number; immediate?: boolean; onComplete?: () => void } = {}): void {
  if (!lenis) return
  lenis.scrollTo(target, {
    offset: options.offset ?? 0,
    immediate: options.immediate ?? false,
    force: true,
    onComplete: options.onComplete ? () => options.onComplete?.() : undefined,
  })
}

// Text reveal. Pages mark single elements with `data-reveal`, or a container with
// `data-reveal-children` to reveal each of its children in sequence. A child that is
// itself a `data-reveal-children` container is skipped so effects never stack.
const TARGETS = '[data-reveal], [data-reveal-children] > :not([data-reveal-children])'

/** Reveals marked text below the fold as it scrolls into view. Content above the fold
 *  is never hidden, so nothing visible flashes on load. Returns a disposer that
 *  restores every element to its natural state. */
export function reveal(root: HTMLElement): () => void {
  const mm = gsap.matchMedia()
  let refreshTimer = 0
  const observer = new ResizeObserver(() => {
    window.clearTimeout(refreshTimer)
    refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 150)
  })

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const fold = window.innerHeight * 0.92
    const items = Array.from(root.querySelectorAll<HTMLElement>(TARGETS)).filter((el) => el.getBoundingClientRect().top > fold)
    if (!items.length) return

    gsap.set(items, { opacity: 0, y: 24 })
    const show = (batch: Element[]) =>
      gsap.to(batch, { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out', stagger: 0.07, overwrite: true, clearProps: 'transform' })
    // onLeave covers fast jumps (e.g. the "On this page" rail) that skip past a block.
    ScrollTrigger.batch(items, { start: 'top 92%', onEnter: show, onLeave: show })
    observer.observe(root)
  })

  return () => {
    observer.disconnect()
    window.clearTimeout(refreshTimer)
    mm.revert()
  }
}
