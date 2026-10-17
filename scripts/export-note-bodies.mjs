#!/usr/bin/env node
// Extracts the rendered reader body (.reader-prose innerHTML) from every
// prerendered note page in dist/writing/ into .verify/note-bodies/<slug>.body.html,
// so scripts/verify_notes.py can compare what visitors receive with the source text.

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dir = path.join(root, 'dist/writing')
const out = path.join(root, '.verify/note-bodies')
fs.rmSync(out, { recursive: true, force: true })
fs.mkdirSync(out, { recursive: true })

// The reader body opens with <div class="reader-prose" ...attributes>.
const OPEN = /<div class="reader-prose"[^>]*>/
let count = 0
for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.html'))) {
  const html = fs.readFileSync(path.join(dir, file), 'utf8')
  const open = OPEN.exec(html)
  if (!open) throw new Error(`${file}: reader body not found`)
  const start = open.index + open[0].length
  // The body contains no nested <div>, so the first closing tag ends it.
  const end = html.indexOf('</div>', start)
  fs.writeFileSync(path.join(out, file.replace(/\.html$/, '.body.html')), html.slice(start, end))
  count++
}
console.log(`exported ${count} rendered note bodies to ${path.relative(root, out)}`)
