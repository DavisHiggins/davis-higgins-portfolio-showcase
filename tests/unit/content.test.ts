import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import projectsIndex from '../../src/generated/projects-index.json'
import notesIndex from '../../src/generated/notes-index.json'
import routes from '../../src/generated/routes.json'
import manifest from '../../content/notes/manifest.json'
import media from '../../content/media.json'
import derivatives from '../../content/media-derivatives.json'

const root = path.resolve(__dirname, '../..')
const projectFiles = fs.readdirSync(path.join(root, 'content/projects')).filter((f) => f.endsWith('.json'))
const projects = projectFiles.map((f) => JSON.parse(fs.readFileSync(path.join(root, 'content/projects', f), 'utf8')))

describe('project registry', () => {
  const UNPUBLISHED = ['y-not', 'chaplain-platform', 'touch-up-solutions', 'wy-not-pics', 'dh-portfolio', 'one-chaptr']

  it('keeps 24 candidates, publishes 18, and includes the original 15 under their current names', () => {
    expect(projects).toHaveLength(24)
    expect(projects.filter((p) => p.published === false).map((p) => p.slug).sort()).toEqual([...UNPUBLISHED].sort())
    const titles = projects.map((p) => p.title)
    const original15 = ['Cade', 'Contender', 'Flowcast', 'DHLM', 'Lakeside Sport Club', 'Executive Sales & Bidding Analytics Suite', 'Higgins Digital', 'CrownCode AI', 'Higgins Building Group', 'AI Workflow System', 'ProspectIQ', 'davishiggins.com', 'Curated Notes', 'NYPD Crime Data Analysis', 'Census Data Analysis']
    for (const title of original15) expect(titles).toContain(title)
    expect(titles).not.toContain('Davis Intelligence')
  })

  it('gives every project a cover, a hero, and a distinct secondary image with derivatives', () => {
    for (const p of projects) {
      expect(p.media.detail, p.slug).not.toBe(p.media.cover)
      expect(p.media.detail, p.slug).not.toBe(p.media.hero)
      for (const id of [p.media.cover, p.media.hero, p.media.detail]) {
        expect(media.media, `${p.slug}: ${id}`).toHaveProperty(id)
      }
      const d = derivatives as Record<string, Record<string, unknown>>
      expect(d[p.media.cover]?.card, p.slug).toBeTruthy()
      expect(d[p.media.hero]?.hero, p.slug).toBeTruthy()
      expect(d[p.media.detail]?.detail, p.slug).toBeTruthy()
      for (const id of [p.media.hero, p.media.detail]) {
        expect((media.media as Record<string, { alt: string }>)[id].alt.length, id).toBeGreaterThan(10)
      }
      expect((media.media as Record<string, { caption?: string }>)[p.media.detail].caption, p.slug).toBeTruthy()
    }
  })

  it('labels public repositories as showcases and never ships placeholder links', () => {
    for (const p of projects) {
      for (const link of p.links) {
        expect(link.href, p.slug).not.toBe('#')
        expect(link.href, p.slug).toMatch(/^(https:\/\/|\/)/)
        if (link.href.includes('github.com')) expect(link.label).toBe('GitHub showcase')
      }
    }
    const urls = projects.flatMap((p) => p.links.map((l: { href: string }) => l.href))
    expect(urls).not.toContain('https://github.com/davishiggins/prospectiq')
    expect(urls).not.toContain('https://github.com/DavisHiggins/HateCrimeDataAnalysis')
    expect(urls.some((u) => u.includes('ynotbrand.co'))).toBe(false)
  })

  it('keeps team attribution explicit', () => {
    const second = projects.find((p) => p.slug === 'secondchance')
    expect(second.team).toMatch(/Bennett Shearin.*Seth Sumter.*Hunter Pace/)
    expect(second.contribution.join(' ')).toMatch(/research and modeling were shared/i)
    const census = projects.find((p) => p.slug === 'census-data-analysis')
    expect(census.team).toMatch(/Chris Loor-Luna/)
    const wnp = projects.find((p) => p.slug === 'wy-not-pics')
    expect(wnp.role).toMatch(/Wyatt Bullock/)
  })

  it('leaves unpublished projects out of every generated output', () => {
    const published = new Set(projectsIndex.map((p) => p.slug))
    for (const slug of UNPUBLISHED) {
      expect(published.has(slug), slug).toBe(false)
      expect(fs.existsSync(path.join(root, 'src/generated/projects', `${slug}.json`)), slug).toBe(false)
      expect(routes.some((r) => r.path === `/projects/${slug}`), slug).toBe(false)
    }
    for (const p of projects.filter((x) => x.published !== false)) {
      for (const slug of p.related) expect(published.has(slug), `${p.slug} -> ${slug}`).toBe(true)
    }
    const knowledge = fs.readFileSync(path.join(root, 'server/knowledge.generated.js'), 'utf8')
    for (const slug of UNPUBLISHED) expect(knowledge, slug).not.toContain(`/projects/${slug}`)
  })

  it('projects a light index without case-study bodies or internal fields', () => {
    expect(projectsIndex).toHaveLength(18)
    const keys = Object.keys(projectsIndex[0]).sort()
    expect(keys).toEqual(['categories', 'cover', 'slug', 'sortOrder', 'status', 'summary', 'title'])
    const generated = fs.readFileSync(path.join(root, 'src/generated/projects/flowcast.json'), 'utf8')
    expect(generated).not.toContain('"sources"')
    expect(generated).not.toContain('provenance')
  })
})

describe('notes', () => {
  const included = manifest.notes.filter((n) => n.included)

  it('accounts for all 19 source notes and includes exactly 16', () => {
    expect(manifest.notes).toHaveLength(19)
    expect(included).toHaveLength(16)
    expect(notesIndex).toHaveLength(16)
  })

  it('keeps original title, category, date, read time, excerpt, and order', () => {
    const ordered = [...included].sort((a, b) => a.sourceOrder - b.sourceOrder)
    notesIndex.forEach((note, i) => {
      const source = ordered[i]
      expect(note.slug).toBe(source.slug)
      expect(note.title).toBe(source.title)
      expect(note.category).toBe(source.category)
      expect(note.dateLabel).toBe(source.dateLabel)
      expect(note.readTime).toBe(source.readTime)
      expect(note.excerpt).toBe(source.excerpt)
      expect(note.sourceUrl).toBe(source.sourceUrl)
    })
  })

  it('serves note bodies byte-identical to the versioned sources', () => {
    for (const note of included) {
      const source = fs.readFileSync(path.join(root, 'content/notes/bodies', `${note.slug}.html`))
      const generated = fs.readFileSync(path.join(root, 'src/generated/notes', `${note.slug}.html`))
      expect(generated.equals(source), note.slug).toBe(true)
    }
  })

  it('points duplicated note pages at the original canonical and keeps them out of the sitemap', () => {
    const sitemap = fs.readFileSync(path.join(root, 'public/sitemap.xml'), 'utf8')
    for (const note of notesIndex) {
      const route = routes.find((r) => r.path === `/writing/${note.slug}`)
      expect(route?.canonical).toBe(note.sourceUrl)
      expect(note.sourceUrl).toMatch(/^https:\/\/notes\.davishiggins\.com\/notes\/[a-z0-9-]+$/)
      expect(sitemap).not.toContain(`/writing/${note.slug}`)
    }
    expect(sitemap).toContain('https://portfolio.davishiggins.com/projects/flowcast')
    expect(sitemap).not.toMatch(/resume|skills|impact/)
  })
})

describe('profile facts', () => {
  const profile = JSON.parse(fs.readFileSync(path.join(root, 'content/profile.json'), 'utf8'))

  it('uses the supplied resume as authority', () => {
    expect(profile.education[0].gpaDisplay).toBe('3.9')
    expect(profile.education[0].expectedGraduation).toBe('May 2027')
    const oneChaptr = profile.experience.find((e: { id: string }) => e.id === 'one-chaptr')
    expect(oneChaptr.company).toBe('One Chaptr Group')
    expect(oneChaptr.roles[0].period).toMatch(/^Aug 2026/)
    const kewaunee = profile.experience.find((e: { id: string }) => e.id === 'kewaunee')
    expect(kewaunee.roles[0].title).toBe('Data Analyst')
  })

  it('does not present the philanthropy office as current', () => {
    const pdt = profile.experience.find((e: { id: string }) => e.id === 'phi-delta-theta')
    const vp = pdt.roles.find((r: { title: string }) => r.title.includes('Philanthropy'))
    expect(vp.period).not.toMatch(/Present/)
    expect(pdt.roles[0].title).toBe('Chaplain')
  })

  it('serves the supplied resume unchanged', () => {
    const pdf = fs.readFileSync(path.join(root, 'public/davis-resume.pdf'))
    expect(pdf.subarray(0, 5).toString()).toBe('%PDF-')
    expect(pdf.length).toBe(138733)
  })
})
