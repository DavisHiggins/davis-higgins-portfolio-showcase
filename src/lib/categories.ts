import categoryList from '../generated/categories.json'
import type { Category, CategoryId, ProjectIndexItem } from './types'

export const CATEGORIES = categoryList as Category[]
const IDS = new Set<string>(CATEGORIES.map((c) => c.id))

/** URL state is the source of truth; unknown or missing values fall back to All. */
export function parseCategory(value: string | null): CategoryId | null {
  return value && IDS.has(value) ? (value as CategoryId) : null
}

export function categoryLabel(id: CategoryId): string {
  return CATEGORIES.find((c) => c.id === id)?.label ?? id
}

export function filterProjects(projects: ProjectIndexItem[], category: CategoryId | null): ProjectIndexItem[] {
  const list = category ? projects.filter((p) => p.categories.includes(category)) : projects
  return [...list].sort((a, b) => a.sortOrder - b.sortOrder)
}

export function categoryCounts(projects: ProjectIndexItem[]): Record<CategoryId | 'all', number> {
  const counts = { all: projects.length } as Record<CategoryId | 'all', number>
  for (const c of CATEGORIES) counts[c.id] = projects.filter((p) => p.categories.includes(c.id)).length
  return counts
}

export const NOTE_CATEGORIES = ['Projects', 'Data & AI', 'Business', 'Personal'] as const

/** Gold tag styles from the Curated Notes source (lib/tags.ts), used only inside the reader. */
export const NOTE_TAG_STYLES: Record<string, { bg: string; text: string }> = {
  Projects: { bg: 'rgba(201,168,76,0.12)', text: '#C9A84C' },
  'Data & AI': { bg: 'rgba(228,192,110,0.12)', text: '#E4C06E' },
  Business: { bg: 'rgba(160,120,48,0.16)', text: '#C9A84C' },
  Personal: { bg: 'rgba(212,184,122,0.12)', text: '#D4B87A' },
}
