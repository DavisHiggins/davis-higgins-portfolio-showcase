import { expect, test } from './fixtures'

test.describe('projects gallery', () => {
  test('filters by category through the URL and keeps keyboard focus', async ({ page }) => {
    await page.goto('/projects')
    await expect(page.locator('main ul > li')).toHaveCount(24)
    const data = page.getByRole('button', { name: /^Data & ML/ })
    await data.focus()
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/\/projects\?category=data-ml$/)
    await expect(data).toHaveAttribute('aria-pressed', 'true')
    await expect(page.getByRole('button', { name: /^All/ })).toHaveAttribute('aria-pressed', 'false')
    await expect(page.locator('main ul > li')).toHaveCount(7)
    await expect(page.getByText('7 of 24 projects in Data & ML')).toBeVisible()
    await expect(data).toBeFocused()
  })

  test('a filtered URL loads directly and survives reload', async ({ page }) => {
    await page.goto('/projects?category=ai-automation')
    await expect(page.getByRole('button', { name: /^AI & Automation/ })).toHaveAttribute('aria-pressed', 'true')
    const count = await page.locator('main ul > li').count()
    expect(count).toBeGreaterThan(0)
    expect(count).toBeLessThan(24)
    await page.reload()
    await expect(page.locator('main ul > li')).toHaveCount(count)
  })

  test('unknown categories fall back to All', async ({ page }) => {
    await page.goto('/projects?category=nonsense')
    await expect(page.getByRole('button', { name: /^All/ })).toHaveAttribute('aria-pressed', 'true')
    await expect(page.locator('main ul > li')).toHaveCount(24)
  })

  test('back from a case study restores the filter and scroll position', async ({ page }) => {
    await page.goto('/projects')
    await page.getByRole('button', { name: /^Websites & Commerce/ }).click()
    await expect(page).toHaveURL(/category=web-commerce/)
    const card = page.getByRole('link', { name: /Touch Up Solutions/ })
    await card.scrollIntoViewIfNeeded()
    const before = await page.evaluate(() => window.scrollY)
    expect(before).toBeGreaterThan(200)
    await card.click()
    await expect(page.locator('h1')).toHaveText('Touch Up Solutions')
    await page.getByRole('navigation', { name: 'Breadcrumb' }).getByRole('link', { name: 'Projects' }).click()
    await expect(page).toHaveURL(/\/projects\?category=web-commerce$/)
    await expect(page.getByRole('button', { name: /^Websites & Commerce/ })).toHaveAttribute('aria-pressed', 'true')
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(before - 80)
  })

  test('browser Back steps through filter history', async ({ page }) => {
    await page.goto('/projects')
    await page.getByRole('button', { name: /^Data & ML/ }).click()
    await page.getByRole('button', { name: /^Research & Community/ }).click()
    await expect(page).toHaveURL(/research-community/)
    await page.goBack()
    await expect(page).toHaveURL(/category=data-ml/)
    await expect(page.getByRole('button', { name: /^Data & ML/ })).toHaveAttribute('aria-pressed', 'true')
  })

  test('each card is one link named by its project, and covers are sized responsively', async ({ page }) => {
    await page.goto('/projects')
    const first = page.locator('main ul > li').first()
    await expect(first.getByRole('link')).toHaveCount(1)
    await expect(first.getByRole('link')).toHaveAccessibleName(/^Flowcast/)
    const img = first.locator('img')
    await expect(img).toHaveAttribute('width', /\d+/)
    await expect(img).toHaveAttribute('height', /\d+/)
    await expect(img).toHaveAttribute('alt', '')
    const lazy = page.locator('main ul > li').nth(10).locator('img')
    await expect(lazy).toHaveAttribute('loading', 'lazy')
  })

  test('case study pages show distinct secondary visuals and correct links', async ({ page }) => {
    await page.goto('/projects/secondchance')
    await expect(page.getByText(/Bennett Shearin, Seth Sumter, and Hunter Pace/)).toBeVisible()
    await expect(page.getByRole('link', { name: /GitHub showcase/ })).toHaveAttribute('href', 'https://github.com/DavisHiggins/SecondChance')
    const figure = page.locator('figure').nth(1)
    await expect(figure.locator('figcaption')).toContainText('support queue')
    await page.goto('/projects/prospectiq')
    await expect(page.getByRole('link', { name: /GitHub/ })).toHaveCount(0)
  })
})
