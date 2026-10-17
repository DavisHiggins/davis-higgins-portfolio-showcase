import { expect, test } from './fixtures'
import { notesIndex } from './data'
import { projectsIndex } from './data'

const PAGES: [string, string][] = [
  ['/', "Hi, I'm Davis Higgins"],
  ['/experience', 'Experience'],
  ['/projects', 'Projects'],
  ['/education', 'Education'],
  ['/writing', 'Writing'],
  ['/contact', 'Contact'],
]

test.describe('routes', () => {
  for (const [path, heading] of PAGES) {
    test(`direct load ${path}`, async ({ page }) => {
      const errors: string[] = []
      page.on('pageerror', (e) => errors.push(e.message))
      page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
      const response = await page.goto(path)
      expect(response?.status()).toBe(200)
      await expect(page.locator('h1')).toHaveCount(1)
      await expect(page.locator('h1')).toHaveText(heading)
      await page.waitForLoadState('networkidle')
      expect(errors).toEqual([])
    })
  }

  test('every project and note route is prerendered with its own metadata', async ({ request }) => {
    test.setTimeout(240_000)
    for (const project of projectsIndex) {
      const res = await request.get(`/projects/${project.slug}`)
      expect(res.status(), project.slug).toBe(200)
      const html = await res.text()
      expect(html).toContain(`<title>${project.title.replace(/&/g, '&amp;')} | Projects | Davis Higgins</title>`)
      expect(html).toContain(`<link rel="canonical" href="https://portfolio.davishiggins.com/projects/${project.slug}" />`)
      expect(html).toContain(`/media/`)
      expect(html).toMatch(new RegExp(`<h1[^>]*>${project.title.replace(/[?&.]/g, (c) => (c === '&' ? '&amp;' : `\\${c}`))}</h1>`))
    }
    for (const note of notesIndex) {
      const res = await request.get(`/writing/${note.slug}`)
      expect(res.status(), note.slug).toBe(200)
      const html = await res.text()
      expect(html).toContain(`<link rel="canonical" href="${note.sourceUrl}" />`)
      expect(html).toContain('class="reader-prose"')
    }
  })

  test('unknown project and note slugs show a useful not-found page with 404 status', async ({ page }) => {
    let response = await page.goto('/projects/not-a-real-project')
    expect(response?.status()).toBe(404)
    await expect(page.locator('h1')).toHaveText('That project could not be found')
    await expect(page.getByRole('link', { name: 'Browse all projects' })).toBeVisible()
    response = await page.goto('/writing/not-a-real-note')
    expect(response?.status()).toBe(404)
    await expect(page.locator('h1')).toHaveText('That note could not be found')
  })

  test('retired pages redirect permanently', async ({ request }) => {
    for (const [from, to] of [
      ['/impact', '/writing'],
      ['/skills-proof', '/writing'],
      ['/skills', '/experience'],
      ['/resume', '/davis-resume.pdf'],
      ['/docs/davis-resume.pdf', '/davis-resume.pdf'],
      ['/writing/propify-breakdown', '/writing/contender-breakdown'],
    ]) {
      const res = await request.get(from, { maxRedirects: 0 })
      expect(res.status(), from).toBe(308)
      expect(res.headers().location).toBe(to)
    }
  })

  test('resume is the unchanged PDF and static/API routes are not swallowed', async ({ request }) => {
    const pdf = await request.get('/davis-resume.pdf')
    expect(pdf.status()).toBe(200)
    expect(pdf.headers()['content-type']).toContain('application/pdf')
    const body = await pdf.body()
    expect(body.subarray(0, 5).toString()).toBe('%PDF-')
    expect(body.length).toBe(138733)
    expect((await request.get('/api/chat')).status()).toBe(405)
    expect((await request.get('/sitemap.xml')).headers()['content-type']).toContain('xml')
    expect((await request.get('/robots.txt')).status()).toBe(200)
    expect((await request.get('/assets/does-not-exist.js')).status()).toBe(404)
  })

  test('back and forward move between real pages', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'See Projects' }).click()
    await expect(page).toHaveURL(/\/projects$/)
    await page.getByRole('link', { name: /Flowcast/ }).first().click()
    await expect(page).toHaveURL(/\/projects\/flowcast$/)
    await expect(page.locator('h1')).toHaveText('Flowcast')
    await page.goBack()
    await expect(page).toHaveURL(/\/projects$/)
    await page.goBack()
    await expect(page.locator('h1')).toHaveText("Hi, I'm Davis Higgins")
    await page.goForward()
    await expect(page.locator('h1')).toHaveText('Projects')
  })

  test('legacy single-page anchors map to the new routes', async ({ page }) => {
    await page.goto('/#proj-cade')
    await expect(page).toHaveURL(/\/projects\/cade$/)
    await expect(page.locator('h1')).toHaveText('Cade')
  })
})
