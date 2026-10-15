import { test as base } from '@playwright/test'

// Third-party calls (GitHub activity on Home) are mocked so tests never depend on
// the network or GitHub's unauthenticated rate limit.
export const test = base.extend({
  page: async ({ page }, provide) => {
    await page.route('https://api.github.com/**', (route) =>
      route.fulfill({ json: [{ name: 'portfolio', pushed_at: new Date(Date.now() - 3 * 3600_000).toISOString(), fork: false }] }),
    )
    await provide(page)
  },
})
export { expect } from '@playwright/test'
