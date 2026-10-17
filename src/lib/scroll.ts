// Synchronous front for the lazily loaded scroll engine (Lenis + GSAP ScrollTrigger).
// Callers can scroll before the engine arrives; native scrolling is the fallback.

import type * as ScrollEngineModule from './scroll-engine'

type ScrollEngine = typeof ScrollEngineModule

let engine: ScrollEngine | null = null
let pending: Promise<ScrollEngine> | null = null

export function loadScrollEngine(): Promise<ScrollEngine> {
  pending ??= import('./scroll-engine').then((mod) => {
    mod.start()
    engine = mod
    return mod
  })
  return pending
}

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Land at the very top of the page immediately, stopping any smooth-scroll inertia. */
export function scrollToTop(): void {
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  engine?.scrollTo(0, { immediate: true })
}

/** Smooth-scroll an element to `offset` px below the top of the viewport. */
export function scrollToElement(el: HTMLElement, offset: number, onComplete?: () => void): boolean {
  if (engine) {
    engine.scrollTo(el, { offset: -offset, onComplete })
    return true
  }
  window.scrollTo({
    top: Math.max(0, el.getBoundingClientRect().top + window.scrollY - offset),
    // 'instant', not 'auto', so a stylesheet scroll-behavior can never interfere.
    behavior: prefersReducedMotion() ? 'instant' : 'smooth',
  })
  return false
}
