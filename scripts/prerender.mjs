#!/usr/bin/env node
// Build-time prerender. Renders every public route with the SSR bundle
// (dist-ssr/entry-server.js) into static HTML so each URL ships its own title,
// description, canonical, social image, and readable content before JavaScript.
// The client then hydrates the same tree (src/main.tsx).
//
// Output follows Vercel `cleanUrls`: / -> index.html, /projects -> projects.html,
// /projects/flowcast -> projects/flowcast.html, unknown paths -> 404.html (404).

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
// Keep the pristine Vite template so the prerender can be re-run safely.
const templateCopy = path.join(dist, '.vite/index.template.html')
if (!fs.existsSync(templateCopy)) fs.copyFileSync(path.join(dist, 'index.html'), templateCopy)
const template = fs.readFileSync(templateCopy, 'utf8')
const manifest = JSON.parse(fs.readFileSync(path.join(dist, '.vite/manifest.json'), 'utf8'))
const { render, PRERENDER_PATHS } = await import(pathToFileURL(path.join(root, 'dist-ssr/entry-server.js')).href)

if (!template.includes('<!--app-head-->') || !template.includes('<!--app-html-->')) {
  throw new Error('dist/index.html is missing the prerender placeholders')
}

const entry = Object.values(manifest).find((chunk) => chunk.isEntry)
const entryFiles = new Set([entry.file, ...(entry.imports ?? []).map((key) => manifest[key].file)])

/** A manifest chunk plus its static imports, minus what the entry already loads. */
function chunkFiles(key, seen = new Set()) {
  const chunk = manifest[key]
  if (!chunk || seen.has(key)) return []
  seen.add(key)
  const files = entryFiles.has(chunk.file) ? [] : [chunk.file]
  for (const dep of chunk.imports ?? []) files.push(...chunkFiles(dep, seen))
  return files
}

const PAGE_MODULES = [
  [/^\/$/, 'src/pages/Home.tsx'],
  [/^\/experience$/, 'src/pages/Experience.tsx'],
  [/^\/projects$/, 'src/pages/ProjectsIndex.tsx'],
  [/^\/projects\/[a-z0-9-]+$/, 'src/pages/ProjectDetail.tsx'],
  [/^\/education$/, 'src/pages/Education.tsx'],
  [/^\/writing$/, 'src/pages/WritingIndex.tsx'],
  [/^\/writing\/[a-z0-9-]+$/, 'src/pages/NoteReader.tsx'],
  [/^\/contact$/, 'src/pages/Contact.tsx'],
]

function preloadsFor(pathname) {
  const keys = []
  const page = PAGE_MODULES.find(([pattern]) => pattern.test(pathname))
  if (page) keys.push(page[1])
  const project = /^\/projects\/([a-z0-9-]+)$/.exec(pathname)
  if (project) keys.push(`src/generated/projects/${project[1]}.json`)
  const note = /^\/writing\/([a-z0-9-]+)$/.exec(pathname)
  if (note) keys.push(Object.keys(manifest).find((k) => k.startsWith(`src/generated/notes/${note[1]}.html`)))
  const files = new Set(keys.filter(Boolean).flatMap((key) => chunkFiles(key)))
  return [...files].map((file) => `<link rel="modulepreload" crossorigin href="/${file}" />`).join('\n    ')
}

function outputFile(pathname) {
  if (pathname === '/') return path.join(dist, 'index.html')
  if (pathname === '/__404') return path.join(dist, '404.html')
  return path.join(dist, `${pathname.slice(1)}.html`)
}

let count = 0
for (const pathname of [...PRERENDER_PATHS, '/__404']) {
  const { html, head, status } = await render(pathname)
  if (pathname !== '/__404' && status !== 200) throw new Error(`${pathname} rendered with status ${status}`)
  const document = template
    .replace('<!--app-head-->', `${head}\n    ${preloadsFor(pathname)}`)
    .replace('<div id="root"><!--app-html--></div>', `<div id="root" data-prerender-path="${pathname}">${html}</div>`)
  const file = outputFile(pathname)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, document)
  count++
}
console.log(`prerendered ${count} routes (including 404.html)`)
