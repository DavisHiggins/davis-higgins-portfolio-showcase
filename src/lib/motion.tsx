import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'

// Content must be visible without JavaScript, so the first render (prerendered
// HTML and the hydration pass) never starts from opacity 0. Entrance animations
// switch on only after the app has mounted, i.e. for client-side navigations.
const EntranceContext = createContext(false)

export function EntranceProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false)
  useEffect(() => setEnabled(true), [])
  return <EntranceContext.Provider value={enabled}>{children}</EntranceContext.Provider>
}

export function useEntrancesEnabled(): boolean {
  return useContext(EntranceContext)
}

export const EASE = [0.22, 1, 0.36, 1] as const

/** Restrained page entrance: opacity + 12px, ~280ms. MotionConfig removes the
 *  transform for visitors who prefer reduced motion. */
export function usePageEntrance() {
  const enabled = useEntrancesEnabled()
  return {
    initial: enabled ? { opacity: 0, y: 12 } : false,
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.28, ease: EASE },
  } as const
}
