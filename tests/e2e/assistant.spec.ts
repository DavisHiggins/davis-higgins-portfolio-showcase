import { expect, test } from './fixtures'
import type { Page } from '@playwright/test'

// UI behavior with a mocked /api/chat. Real provider behavior is verified separately
// against a deployment that has ANTHROPIC_API_KEY (see docs/IMPLEMENTATION_REPORT.md).

async function openAssistant(page: Page, isMobile: boolean) {
  const launcher = isMobile ? page.getByRole('button', { name: 'Ask Davis AI, the portfolio assistant' }) : page.getByRole('button', { name: 'Ask Davis AI' })
  await launcher.click()
  const panel = page.getByRole('dialog', { name: 'Davis Intelligence' })
  await expect(panel).toBeVisible()
  return { launcher, panel }
}

test.describe('Davis Intelligence', () => {
  test('opens with focus in the input, offers suggestions, and Escape returns focus', async ({ page, isMobile }) => {
    await page.goto('/')
    const { launcher, panel } = await openAssistant(page, isMobile)
    await expect(panel.getByLabel('Ask a question about Davis')).toBeFocused()
    await expect(panel.getByRole('button', { name: 'What has Davis built with machine learning?' })).toBeVisible()
    await expect(panel).toContainText('Portfolio knowledge updated October 15, 2026')
    await page.keyboard.press('Escape')
    await expect(panel).toBeHidden()
    await expect(launcher).toBeFocused()
  })

  test('sends only messages and page context, renders safe links, and navigates', async ({ page, isMobile }) => {
    const bodies: unknown[] = []
    await page.route('**/api/chat', async (route) => {
      bodies.push(route.request().postDataJSON())
      await route.fulfill({
        json: {
          reply: 'Davis built Flowcast solo. See the [Flowcast case study](/projects/flowcast) or the [model card](https://flowcastweb.vercel.app/model). Not this: [bad](javascript:alert(1)) <img src=x onerror=alert(1)>',
        },
      })
    })
    await page.goto('/projects/contender')
    const { panel } = await openAssistant(page, isMobile)
    const input = panel.getByLabel('Ask a question about Davis')
    await input.fill('What has Davis built with machine learning?')
    await input.press('Enter')
    await expect(panel.getByRole('link', { name: 'Flowcast case study' })).toBeVisible()
    await expect(panel.getByRole('link', { name: 'model card' })).toHaveAttribute('target', '_blank')
    await expect(panel.locator('a[href^="javascript"]')).toHaveCount(0)
    await expect(panel.locator('img')).toHaveCount(0)
    const sent = bodies[0] as Record<string, unknown>
    expect(Object.keys(sent).sort()).toEqual(['messages', 'page'])
    expect(sent.page).toEqual({ kind: 'project', slug: 'contender' })
    expect(JSON.stringify(sent)).not.toContain('system')
    await panel.getByRole('link', { name: 'Flowcast case study' }).click()
    await expect(page).toHaveURL(/\/projects\/flowcast$/)
  })

  test('Shift+Enter adds a line and rapid sends only fire one request', async ({ page, isMobile }) => {
    let requests = 0
    await page.route('**/api/chat', async (route) => {
      requests++
      await new Promise((r) => setTimeout(r, 400))
      await route.fulfill({ json: { reply: 'Answer.' } })
    })
    await page.goto('/')
    const { panel } = await openAssistant(page, isMobile)
    const input = panel.getByLabel('Ask a question about Davis')
    await input.fill('First line')
    await input.press('Shift+Enter')
    await input.type('second line')
    await expect(input).toHaveValue('First line\nsecond line')
    await input.press('Enter')
    await input.fill('again')
    await input.press('Enter')
    await panel.getByRole('button', { name: 'Send message' }).click({ force: true }).catch(() => {})
    await expect(panel.getByText('Answer.')).toBeVisible()
    expect(requests).toBe(1)
  })

  test('shows rate-limit, server, and network errors with a working retry', async ({ page, isMobile }) => {
    let call = 0
    await page.route('**/api/chat', async (route) => {
      call++
      if (call === 1) return route.fulfill({ status: 429, headers: { 'Retry-After': '30' }, json: { error: 'rate_limited' } })
      if (call === 2) return route.fulfill({ status: 502, json: { error: 'assistant_error' } })
      if (call === 3) return route.abort('internetdisconnected')
      if (call === 4) return route.fulfill({ status: 200, body: 'not json' })
      return route.fulfill({ json: { reply: 'Recovered answer.' } })
    })
    await page.goto('/')
    const { panel } = await openAssistant(page, isMobile)
    await panel.getByRole('button', { name: 'What does Davis do at Kewaunee?' }).click()
    await expect(panel.getByRole('alert')).toContainText('wait 30 seconds')
    await panel.getByRole('button', { name: 'Try again' }).click()
    await expect(panel.getByRole('alert')).toContainText('unavailable right now')
    await panel.getByRole('button', { name: 'Try again' }).click()
    await expect(panel.getByRole('alert')).toContainText("couldn't reach the server")
    await panel.getByRole('button', { name: 'Try again' }).click()
    await expect(panel.getByRole('alert')).toContainText('unavailable right now')
    await panel.getByRole('button', { name: 'Try again' }).click()
    await expect(panel.getByText('Recovered answer.')).toBeVisible()
    await expect(panel.getByRole('alert')).toHaveCount(0)
    // The question appears once even after four retries.
    await expect(panel.getByText('What does Davis do at Kewaunee?', { exact: true })).toHaveCount(1)
  })

  test('conversation persists across client-side navigation', async ({ page, isMobile }) => {
    test.skip(isMobile, 'panel covers the page on phones')
    await page.route('**/api/chat', (route) => route.fulfill({ json: { reply: 'Kept answer.' } }))
    await page.goto('/')
    const { panel } = await openAssistant(page, isMobile)
    await panel.getByRole('button', { name: 'What is his role at One Chaptr?' }).click()
    await expect(panel.getByText('Kept answer.')).toBeVisible()
    await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Writing' }).click()
    await expect(page.locator('h1')).toHaveText('Writing')
    await expect(panel.getByText('Kept answer.')).toBeVisible()
  })
})
