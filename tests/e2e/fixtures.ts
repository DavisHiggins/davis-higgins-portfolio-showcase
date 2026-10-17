import { test as base } from '@playwright/test'

// Third-party calls (GitHub activity on Home) are mocked so tests never depend on
// the network or GitHub's unauthenticated rate limit.
export const test = base.extend({
  page: async ({ page }, provide) => {
    const pushed = new Date(Date.now() - 3 * 3600_000).toISOString()
    await page.route('https://api.github.com/**', (route) => {
      const url = route.request().url()
      if (url.includes('/commits')) {
        return route.fulfill({ json: [{ commit: { author: { date: pushed } } }, { commit: { author: { date: pushed } } }] })
      }
      return route.fulfill({ json: [{ name: 'portfolio', full_name: 'DavisHiggins/portfolio', pushed_at: pushed, fork: false }] })
    })
    await provide(page)
  },
})
export { expect } from '@playwright/test'
