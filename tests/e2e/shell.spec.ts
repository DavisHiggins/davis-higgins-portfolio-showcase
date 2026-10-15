import { expect, test } from './fixtures'

const WIDTHS = [320, 375, 390, 768, 1024, 1280, 1440]
const PATHS = ['/', '/projects', '/projects/flowcast', '/writing', '/writing/building-cade', '/experience', '/education', '/contact']

test.describe('header and navigation', () => {
  test('desktop nav has six destinations, a resume document link, and the assistant', async ({ page, isMobile }) => {
    test.skip(isMobile, 'desktop header')
    await page.goto('/projects/flowcast')
    const nav = page.getByRole('navigation', { name: 'Primary' })
    await expect(nav.getByRole('link')).toHaveText(['Home', 'Experience', 'Projects', 'Education', 'Writing', 'Contact'])
    await expect(nav.getByRole('link', { name: 'Projects' })).toHaveAttribute('aria-current', 'page')
    const resume = page.getByRole('link', { name: 'Open resume PDF (opens in a new tab)' }).first()
    await expect(resume).toHaveAttribute('href', '/davis-resume.pdf')
    await expect(resume).toHaveAttribute('target', '_blank')
    await expect(resume).toHaveAttribute('rel', 'noopener noreferrer')
    const box = await resume.boundingBox()
    expect(box!.width).toBeGreaterThanOrEqual(44)
    expect(box!.height).toBeGreaterThanOrEqual(44)
    await expect(page.getByRole('button', { name: 'Ask Davis AI' })).toBeVisible()
    await expect(page.getByText(/^(Skills|Impact|Resume)$/, { exact: true }).locator('visible=true')).toHaveCount(1) // only the RESUME glyph label
  })

  test('mobile menu opens, closes with Escape, restores focus, and closes after navigation', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'mobile header')
    await page.goto('/')
    const toggle = page.getByRole('button', { name: 'Open navigation menu' })
    await toggle.click()
    const menu = page.getByRole('navigation', { name: 'Mobile' })
    await expect(menu).toBeVisible()
    await expect(menu.getByRole('link', { name: 'Resume (PDF) (opens in a new tab)' })).toHaveAttribute('href', '/davis-resume.pdf')
    await page.keyboard.press('Escape')
    await expect(menu).toBeHidden()
    await expect(page.getByRole('button', { name: 'Open navigation menu' })).toBeFocused()
    await page.getByRole('button', { name: 'Open navigation menu' }).click()
    await menu.getByRole('link', { name: 'Writing' }).click()
    await expect(page).toHaveURL(/\/writing$/)
    await expect(menu).toBeHidden()
    await expect(page.getByRole('link', { name: 'Open resume PDF (opens in a new tab)' })).toBeVisible()
  })

  test('skip link moves focus to main content', async ({ page, isMobile }) => {
    test.skip(isMobile, 'keyboard')
    await page.goto('/projects')
    await page.keyboard.press('Tab')
    const skip = page.getByRole('link', { name: 'Skip to content' })
    await expect(skip).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/#main$/)
  })

  test('route changes move focus to the new page heading', async ({ page, isMobile }) => {
    test.skip(isMobile, 'keyboard')
    await page.goto('/projects')
    await page.getByRole('link', { name: /^Cade/ }).click()
    await expect(page.locator('h1')).toBeFocused()
  })
})

test.describe('responsive layout', () => {
  test('no horizontal overflow or clipped header at common widths', async ({ page, isMobile }) => {
    test.skip(isMobile, 'width sweep runs once')
    test.setTimeout(240_000)
    for (const width of WIDTHS) {
      await page.setViewportSize({ width, height: 900 })
      for (const path of PATHS) {
        await page.goto(path)
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
        expect(overflow, `${path} at ${width}px`).toBeLessThanOrEqual(0)
        const headerOverflow = await page.getByRole('banner').evaluate((el) => el.scrollWidth - el.clientWidth)
        expect(headerOverflow, `header at ${width}px`).toBeLessThanOrEqual(0)
      }
    }
  })

  test('200% zoom equivalent (720px at 1440) keeps navigation usable', async ({ page, isMobile }) => {
    test.skip(isMobile, 'zoom')
    await page.setViewportSize({ width: 720, height: 450 })
    await page.goto('/projects/contender')
    await expect(page.getByRole('button', { name: 'Open navigation menu' })).toBeVisible()
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
    expect(overflow).toBeLessThanOrEqual(0)
  })

  test('every page has one h1 and every image has an alt attribute', async ({ page }) => {
    test.setTimeout(240_000)
    for (const path of PATHS) {
      await page.goto(path)
      await expect(page.locator('h1'), path).toHaveCount(1)
      const missing = await page.locator('img:not([alt])').count()
      expect(missing, path).toBe(0)
      await expect(page.locator('main'), path).toHaveCount(1)
    }
  })
})

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' })
  test('content is visible immediately and client navigation does not translate pages', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'See Projects' }).click()
    await expect(page.locator('h1')).toHaveText('Projects')
    const transform = await page.locator('main > div').first().evaluate((el) => getComputedStyle(el).transform)
    expect(transform === 'none' || transform === 'matrix(1, 0, 0, 1, 0, 0)').toBe(true)
    const opacity = await page.locator('main > div').first().evaluate((el) => getComputedStyle(el).opacity)
    expect(Number(opacity)).toBeGreaterThan(0.5)
  })
})
