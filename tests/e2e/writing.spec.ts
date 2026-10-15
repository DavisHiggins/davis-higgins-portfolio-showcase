import { expect, test } from './fixtures'
import { notesIndex } from './data'

test.describe('writing', () => {
  test('index lists the 16 notes with original metadata and links to Curated Notes', async ({ page }) => {
    await page.goto('/writing')
    await expect(page.locator('main ul > li')).toHaveCount(16)
    const curated = page.getByRole('link', { name: /Curated Notes/ })
    await expect(curated).toHaveAttribute('href', 'https://notes.davishiggins.com')
    const first = notesIndex[0]
    const card = page.locator('main ul > li').first()
    await expect(card).toContainText(first.title)
    await expect(card).toContainText(first.dateLabel)
    await expect(card).toContainText(first.readTime)
  })

  test('reader reproduces the source structure and metadata for every note', async ({ page }) => {
    test.setTimeout(240_000)
    for (const note of notesIndex) {
      await page.goto(`/writing/${note.slug}`)
      await expect(page.locator('.note-reader h1')).toHaveText(note.title)
      const meta = page.locator('.reader-meta')
      await expect(meta).toContainText(note.category)
      await expect(meta).toContainText(note.dateLabel)
      await expect(meta).toContainText(note.readTime)
      await expect(page.locator('.reader-prose > p').first()).toBeVisible()
      if (note.relatedProject) await expect(page.locator('.reader-related a')).toHaveAttribute('href', note.relatedProject.href)
    }
  })

  test('reader typography matches the source measurements', async ({ page, isMobile }) => {
    await page.goto('/writing/confidence')
    const article = await page.locator('.note-reader').boundingBox()
    if (!isMobile) expect(article?.width).toBe(680)
    const title = await page.locator('.reader-title').evaluate((el) => {
      const s = getComputedStyle(el)
      return { family: s.fontFamily, weight: s.fontWeight, lineHeight: s.lineHeight, size: parseFloat(s.fontSize) }
    })
    expect(title.family).toContain('Syne')
    expect(title.weight).toBe('800')
    const body = await page.locator('.reader-prose p').first().evaluate((el) => {
      const s = getComputedStyle(el)
      return { family: s.fontFamily, size: s.fontSize, lineHeight: s.lineHeight, color: s.color, opacity: s.opacity }
    })
    expect(body.family).toContain('Lora')
    expect(body.size).toBe('17px')
    expect(parseFloat(body.lineHeight)).toBeCloseTo(30.26, 1)
    expect(body.color).toBe('rgba(242, 239, 233, 0.8)')
    expect(body.opacity).toBe('1')
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
    expect(overflow).toBe(0)
  })

  test('previous and next follow the source order and the end returns to Writing', async ({ page }) => {
    await page.goto(`/writing/${notesIndex[1].slug}`)
    await expect(page.getByRole('link', { name: /Previous/ })).toContainText(notesIndex[0].title)
    await page.getByRole('link', { name: /Next Note/ }).click()
    await expect(page.locator('.note-reader h1')).toHaveText(notesIndex[2].title)
    await page.goto(`/writing/${notesIndex[notesIndex.length - 1].slug}`)
    await page.getByRole('link', { name: /Return/ }).click()
    await expect(page).toHaveURL(/\/writing$/)
  })

  test('category filter is URL state and the reader keeps it for navigation', async ({ page }) => {
    await page.goto('/writing')
    await page.getByRole('button', { name: /^Business/ }).click()
    await expect(page).toHaveURL(/\/writing\?category=Business$/)
    const count = await page.locator('main ul > li').count()
    expect(count).toBeGreaterThan(1)
    await page.locator('main ul > li a').first().click()
    await expect(page).toHaveURL(/from=Business/)
    await page.getByRole('link', { name: /Back/ }).click()
    await expect(page).toHaveURL(/\/writing\?category=Business$/)
  })
})
