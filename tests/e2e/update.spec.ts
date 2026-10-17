import { expect, test } from './fixtures'

test.describe('October 17 update', () => {
  test('home shows the restored hero and live updates', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Data Analyst Intern at Kewaunee Scientific Corporation')).toBeVisible()
    await expect(page.getByText('Current Role', { exact: true })).toBeVisible()
    const updates = page.locator('h3').filter({ hasText: /GitHub Activity|Latest Writing|Live Products/ })
    await expect(updates).toHaveText(['GitHub Activity', 'Latest Writing', 'Live Products'])
    await expect(page.getByText('Last commit: 3 hours ago on portfolio')).toBeVisible()
    await expect(page.getByText('2 commits in the last 30 days')).toBeVisible()
  })

  test('header links to LinkedIn and GitHub, and the resume has no hover text', async ({ page, isMobile }) => {
    await page.goto('/projects')
    const banner = page.getByRole('banner')
    const linkedin = banner.getByRole('link', { name: /LinkedIn/ }).locator('visible=true')
    const github = banner.getByRole('link', { name: /GitHub/ }).locator('visible=true')
    await expect(linkedin).toHaveAttribute('href', 'https://www.linkedin.com/in/davishiggins')
    await expect(github).toHaveAttribute('href', 'https://github.com/DavisHiggins')
    const resume = banner.getByRole('link', { name: /resume PDF/ }).locator('visible=true')
    const [l, g, r] = await Promise.all([linkedin.boundingBox(), github.boundingBox(), resume.boundingBox()])
    expect(l!.x).toBeLessThan(g!.x)
    expect(g!.x).toBeLessThan(r!.x)
    await expect(page.locator('.resume-link__tip')).toHaveCount(0)
    if (!isMobile) {
      await github.hover()
      await expect(banner.getByRole('tooltip')).toHaveCount(0)
    }
  })

  test('contact fits on one screen with every link', async ({ page }) => {
    await page.goto('/contact')
    const links = page.getByRole('main').getByRole('link')
    await expect(links).toHaveCount(8)
    const overflow = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight)
    expect(overflow).toBeLessThanOrEqual(0)
    await expect(page.getByRole('main').getByRole('link', { name: /LinkedIn/ })).toHaveAttribute('href', 'https://www.linkedin.com/in/davishiggins')
  })

  test('note reader uses the site accent, not the Curated Notes gold', async ({ page }) => {
    await page.goto('/writing/contender-breakdown')
    await expect(page.locator('.reader-title')).toHaveText('Building Contender: Architecture, Failures, and What It Took')
    await expect(page.locator('.reader-prose')).not.toContainText('Propify')
    await expect(page.locator('.reader-related a')).toHaveAttribute('href', 'https://contender.davishiggins.com')
    const colors = await page.evaluate(() => {
      const css = (sel: string, prop: string) => getComputedStyle(document.querySelector(sel)!).getPropertyValue(prop)
      return [css('.reader-progress', 'background-image'), css('.reader-nav__label', 'color'), css('.note-nav-btn', 'border-color')].join(' ')
    })
    expect(colors).not.toMatch(/201, 168, 76|228, 192, 110/)
    expect(colors).toMatch(/56, 189, 248|125, 211, 252/)
  })

  test('every link navigation lands at the top of the new page', async ({ page }) => {
    await page.goto('/experience')
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
    await page.waitForTimeout(300)
    await page.getByRole('navigation', { name: 'Primary' }).or(page.getByRole('button', { name: 'Open navigation menu' })).first().isVisible()
    await page.goto('/writing/building-cade')
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(400)
    await page.getByRole('link', { name: /Next Note/ }).click()
    await expect(page).toHaveURL(/\/writing\/(?!building-cade)/)
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)
  })

  test('removed projects are gone and the chapter link is charlottephidelt.com', async ({ page, request }) => {
    for (const slug of ['y-not', 'chaplain-platform', 'touch-up-solutions', 'wy-not-pics', 'dh-portfolio', 'one-chaptr']) {
      expect((await request.get(`/projects/${slug}`)).status(), slug).toBe(404)
    }
    await page.goto('/projects')
    await expect(page.getByRole('main')).not.toContainText(/Y NOT\?|wy_not_pics|Touch Up Solutions|Chaplain Platform|DH Portfolio|One Chaptr Platform/)
    await page.goto('/experience')
    await expect(page.locator('a[href*="chaplain"]')).toHaveCount(0)
    await expect(page.getByRole('link', { name: 'Chapter Website' })).toHaveAttribute('href', 'https://charlottephidelt.com')
  })

  test('scroll reveals finish visible, and reduced motion never hides text', async ({ page, browser }) => {
    await page.goto('/projects/flowcast')
    await page.locator('#more').scrollIntoViewIfNeeded()
    await expect.poll(() => page.locator('#more h2').evaluate((el) => getComputedStyle(el).opacity)).toBe('1')
    const reduced = await browser.newContext({ reducedMotion: 'reduce' })
    const p = await reduced.newPage()
    await p.goto('/projects/flowcast')
    await p.waitForTimeout(800)
    const hidden = await p.evaluate(() => [...document.querySelectorAll('main *')].filter((el) => getComputedStyle(el).opacity === '0').length)
    expect(hidden).toBe(0)
    await reduced.close()
  })
})
