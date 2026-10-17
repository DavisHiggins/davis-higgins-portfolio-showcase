#!/usr/bin/env node
// Captures dated screenshots of public project destinations into media-src/screens/.
// These are the "verified public product screen" secondary visuals for case studies.
// Re-run when a product changes, review the PNGs, then run `npm run media`.
//
//   node scripts/capture-screens.mjs [id ...]

/* global window -- used inside Playwright page callbacks */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from '@playwright/test'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outDir = path.join(root, 'media-src', 'screens')
fs.mkdirSync(outDir, { recursive: true })

const TARGETS = [
  { id: 'flowcast-dashboard', url: 'https://flowcastweb.vercel.app/dashboard', wait: 7000 },
  { id: 'contender-home', url: 'https://contender.davishiggins.com', wait: 5000 },
  { id: 'dhlm-home', url: 'https://dhlm.davishiggins.com', wait: 5000 },
  { id: 'secondchance-queue', url: 'https://secondc.vercel.app/queue', wait: 6000 },
  { id: 'secondchance-home', url: 'https://secondc.vercel.app', wait: 6000 },
  { id: 'lakeside-shop', url: 'https://lakesidesportclub.com/shop', wait: 5000 },
  { id: 'higgins-digital-home', url: 'https://higginsd.com/', wait: 9000, motion: 'no-preference', waitUntil: 'load' },
  { id: 'higgins-digital-services', url: 'https://higginsd.com/services', wait: 9000, motion: 'no-preference', waitUntil: 'load' },
  { id: 'hbg-home', url: 'https://www.higginsbuildinggroup.com', wait: 7000, waitUntil: 'load' },
  { id: 'ynot-home', url: 'https://ynot.lifestyle', wait: 5000 },
  { id: 'ynot-product', url: 'https://www.ynot.lifestyle/products/flame-script-hoodie', wait: 5000 },
  { id: 'crowncode-builder', url: 'https://crowncode.higginsd.com/builder', wait: 9000, motion: 'no-preference', waitUntil: 'load' },
  { id: 'crowncode-home', url: 'https://crowncode.higginsd.com', wait: 5000 },
  { id: 'ai-workflow-home', url: 'https://ai.davishiggins.com', wait: 5000 },
  { id: 'pdt-home', url: 'https://charlottephidelt.com', wait: 6000 },
  { id: 'chaplain-home', url: 'https://chaplain.davishiggins.com', wait: 5000 },
  { id: 'notes-home', url: 'https://notes.davishiggins.com', wait: 5000 },
  { id: 'dhcom-home', url: 'https://davishiggins.com', wait: 8000 },
  { id: 'tus-wood', url: 'https://touchupsolutions.vercel.app/wood-repair.html', wait: 4000 },
  { id: 'tus-howto', url: 'https://touchupsolutions.vercel.app/howto.html', wait: 4000 },
  { id: 'wnp-home', url: 'https://wynotpics.vercel.app', wait: 5000 },
  { id: 'wnp-portfolio', url: 'https://wynotpics.vercel.app/portfolio', wait: 5000 },
  { id: 'photos-home', url: 'https://photos.davishiggins.com', wait: 6000 },
  { id: 'cade-home', url: 'https://cade.davishiggins.com', wait: 6000 },
]

const only = new Set(process.argv.slice(2))
const targets = only.size ? TARGETS.filter((t) => only.has(t.id)) : TARGETS
const log = []

const browser = await chromium.launch({ channel: 'chrome' })
for (const target of targets) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    reducedMotion: target.motion ?? 'reduce',
  })
  const page = await context.newPage()
  const entry = { id: target.id, url: target.url, capturedAt: new Date().toISOString() }
  try {
    const response = await page.goto(target.url, { waitUntil: target.waitUntil ?? 'networkidle', timeout: 45000 })
    entry.status = response?.status() ?? null
    entry.finalUrl = page.url()
    await page.waitForTimeout(target.wait)
    // Nudge lazy content, then return to the top for a consistent first-viewport frame.
    await page.mouse.wheel(0, 600)
    await page.waitForTimeout(600)
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(1200)
    await page.screenshot({ path: path.join(outDir, `${target.id}.png`) })
    entry.file = `media-src/screens/${target.id}.png`
    console.log(`ok   ${target.id} ${entry.status} ${entry.finalUrl}`)
  } catch (error) {
    entry.error = String(error.message ?? error).split('\n')[0]
    console.log(`fail ${target.id} ${entry.error}`)
  }
  log.push(entry)
  await context.close()
}
await browser.close()

const logPath = path.join(outDir, 'capture-log.json')
const previous = fs.existsSync(logPath) ? JSON.parse(fs.readFileSync(logPath, 'utf8')) : []
const merged = [...previous.filter((p) => !log.some((l) => l.id === p.id)), ...log]
fs.writeFileSync(logPath, JSON.stringify(merged, null, 2) + '\n')
