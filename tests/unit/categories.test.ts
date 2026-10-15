import { describe, expect, it } from 'vitest'
import projectsIndex from '../../src/generated/projects-index.json'
import { categoryCounts, filterProjects, parseCategory } from '../../src/lib/categories'
import type { ProjectIndexItem } from '../../src/lib/types'
import { legacyHashTarget } from '../../src/app/legacy'

const projects = projectsIndex as ProjectIndexItem[]

describe('project filters', () => {
  it('falls back to All for unknown or missing categories', () => {
    expect(parseCategory(null)).toBeNull()
    expect(parseCategory('not-a-category')).toBeNull()
    expect(parseCategory('data-ml')).toBe('data-ml')
  })

  it('keeps curated order and returns each project once per result set', () => {
    const all = filterProjects(projects, null)
    expect(all.map((p) => p.slug).slice(0, 6)).toEqual(['flowcast', 'contender', 'cade', 'dhlm', 'secondchance', 'kewaunee-analytics'])
    const data = filterProjects(projects, 'data-ml')
    expect(new Set(data.map((p) => p.slug)).size).toBe(data.length)
    expect(data.every((p) => p.categories.includes('data-ml'))).toBe(true)
  })

  it('counts All as unique projects even with multi-category membership', () => {
    const counts = categoryCounts(projects)
    expect(counts.all).toBe(24)
    const sum = counts['data-ml'] + counts['ai-automation'] + counts['web-commerce'] + counts['software-tools'] + counts['research-community']
    expect(sum).toBeGreaterThan(counts.all)
  })
})

describe('legacy anchors', () => {
  it('maps old single-page hashes to the new routes', () => {
    expect(legacyHashTarget('/', '#proj-cade')).toBe('/projects/cade')
    expect(legacyHashTarget('/', '#proj-davis-intelligence')).toBe('/projects/ai-workflow-system')
    expect(legacyHashTarget('/', '#proj-executive-sales-bidding-analytics-suite')).toBe('/projects/kewaunee-analytics')
    expect(legacyHashTarget('/', '#impact-perseverance-through-adversity')).toBe('/writing')
    expect(legacyHashTarget('/', '#exp-kewaunee-scientific-corporation')).toBe('/experience#exp-kewaunee-scientific-corporation')
    expect(legacyHashTarget('/', '#something-else')).toBeNull()
    expect(legacyHashTarget('/projects', '#proj-cade')).toBeNull()
  })
})
