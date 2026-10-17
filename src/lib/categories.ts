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

/** Reader tag styles: the Curated Notes tag shapes (lib/tags.ts) in this site's sky/cyan palette. */
export const NOTE_TAG_STYLES: Record<string, { bg: string; text: string }> = {
  Projects: { bg: 'rgba(56,189,248,0.12)', text: '#7DD3FC' },
  'Data & AI': { bg: 'rgba(103,232,249,0.12)', text: '#67E8F9' },
  Business: { bg: 'rgba(14,165,233,0.16)', text: '#7DD3FC' },
  Personal: { bg: 'rgba(186,230,253,0.12)', text: '#BAE6FD' },
}
