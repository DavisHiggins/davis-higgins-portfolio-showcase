import { Briefcase, Code2, GraduationCap, Home, Mail, NotebookPen } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { reviewedAt } from '../generated/site-meta.json'

export const SITE_URL = 'https://portfolio.davishiggins.com'
export const NOTES_SITE = 'https://notes.davishiggins.com'
export const RESUME_HREF = '/davis-resume.pdf'
export const KNOWLEDGE_REVIEWED_AT: string = reviewedAt

export interface NavItem {
  label: string
  to: string
  icon: LucideIcon
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', to: '/', icon: Home },
  { label: 'Experience', to: '/experience', icon: Briefcase },
  { label: 'Projects', to: '/projects', icon: Code2 },
  { label: 'Education', to: '/education', icon: GraduationCap },
  { label: 'Writing', to: '/writing', icon: NotebookPen },
  { label: 'Contact', to: '/contact', icon: Mail },
]

/** The nav item a pathname belongs to, so detail routes keep their section active. */
export function activeNavItem(pathname: string): NavItem | undefined {
  if (pathname === '/') return NAV_ITEMS[0]
  return NAV_ITEMS.find((item) => item.to !== '/' && (pathname === item.to || pathname.startsWith(`${item.to}/`)))
}

export function formatReviewedDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  })
}
