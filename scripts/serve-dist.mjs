#!/usr/bin/env node
// Local production-preview server that mirrors the parts of Vercel routing this
// site relies on: vercel.json redirects, `cleanUrls` (/projects -> projects.html),
// directory indexes, a real 404 status with 404.html, compressed text responses,
// and /api/* serverless functions with Vercel-style `req.body` / `res.status()`.
//
// It is a review and test harness, not a production server. Deployed routing is
// still verified separately on a Vercel preview.
//
//   node scripts/serve-dist.mjs [--dir dist] [--port 4173] [--no-api]

import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'
import { fileURLToPath } from 'node:url'
import { runApiFunction } from './lib/node-api-adapter.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const args = process.argv.slice(2)
const argValue = (name, fallback) => {
  const index = args.indexOf(name)
  return index >= 0 && args[index + 1] ? args[index + 1] : fallback
}

const dir = path.resolve(root, argValue('--dir', 'dist'))
const port = Number(argValue('--port', process.env.PORT ?? '4173'))
const apiEnabled = !args.includes('--no-api')

const vercelConfigPath = path.join(root, 'vercel.json')
const vercelConfig = fs.existsSync(vercelConfigPath)
  ? JSON.parse(fs.readFileSync(vercelConfigPath, 'utf8'))
  : {}
const redirects = vercelConfig.redirects ?? []
const headerRules = vercelConfig.headers ?? []

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
}
const COMPRESSIBLE = new Set(['.html', '.js', '.mjs', '.css', '.json', '.svg', '.txt', '.xml'])

// Vercel `source` patterns used here are literal paths or `:param*` tails.
function matchSource(source, pathname) {
  const pattern = '^' + source
    .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
    .replace(/\/:(\w+)\*/g, '(?:/(?<$1>.*))?')
    .replace(/:(\w+)/g, '(?<$1>[^/]+)') + '/?$'
  const match = new RegExp(pattern).exec(pathname)
  return match ? match.groups ?? {} : null
}

function fileIfExists(candidate) {
  try {
    const stat = fs.statSync(candidate)
    return stat.isFile() ? candidate : null
  } catch {
    return null
  }
}

function resolveStatic(pathname) {
  const clean = decodeURIComponent(pathname)
  const target = path.normalize(path.join(dir, clean))
  if (!target.startsWith(dir)) return null
  if (clean.endsWith('/')) return fileIfExists(path.join(target, 'index.html'))
  return (
    fileIfExists(target) ??
    fileIfExists(`${target}.html`) ??
    fileIfExists(path.join(target, 'index.html'))
  )
}

function applyHeaderRules(pathname, res) {
  for (const rule of headerRules) {
    if (matchSource(rule.source, pathname)) {
      for (const { key, value } of rule.headers) res.setHeader(key, value)
    }
  }
}

function send(req, res, file, status = 200) {
  const ext = path.extname(file).toLowerCase()
  res.statusCode = status
  res.setHeader('Content-Type', TYPES[ext] ?? 'application/octet-stream')
  const body = fs.readFileSync(file)
  const accepts = String(req.headers['accept-encoding'] ?? '')
  if (COMPRESSIBLE.has(ext) && body.length > 1024 && accepts.includes('br')) {
    res.setHeader('Content-Encoding', 'br')
    res.setHeader('Vary', 'Accept-Encoding')
    res.end(zlib.brotliCompressSync(body))
    return
  }
  if (COMPRESSIBLE.has(ext) && body.length > 1024 && accepts.includes('gzip')) {
    res.setHeader('Content-Encoding', 'gzip')
    res.setHeader('Vary', 'Accept-Encoding')
    res.end(zlib.gzipSync(body))
    return
  }
  res.setHeader('Content-Length', body.length)
  res.end(req.method === 'HEAD' ? undefined : body)
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`)
    const { pathname } = url

    for (const rule of redirects) {
      const params = matchSource(rule.source, pathname)
      if (!params) continue
      let destination = rule.destination
      for (const [key, value] of Object.entries(params)) {
        destination = destination.replace(`:${key}*`, value ?? '').replace(`:${key}`, value ?? '')
      }
      res.statusCode = rule.permanent ? 308 : 307
      res.setHeader('Location', destination + (url.search && !destination.includes('?') ? url.search : ''))
      res.end()
      return
    }

    if (pathname.startsWith('/api/')) {
      if (apiEnabled && (await runApiFunction(root, pathname, req, res))) return
      res.statusCode = 404
      res.end('Not found')
      return
    }

    // cleanUrls: /page.html permanently redirects to /page.
    if (vercelConfig.cleanUrls && pathname.endsWith('.html')) {
      const target = pathname.replace(/(index)?\.html$/, '') || '/'
      res.statusCode = 308
      res.setHeader('Location', target + url.search)
      res.end()
      return
    }

    const file = resolveStatic(pathname)
    applyHeaderRules(pathname, res)
    if (file) {
      send(req, res, file)
      return
    }
    const notFound = fileIfExists(path.join(dir, '404.html'))
    if (notFound) {
      send(req, res, notFound, 404)
      return
    }
    res.statusCode = 404
    res.end('Not found')
  } catch (error) {
    console.error(error)
    res.statusCode = 500
    res.end('Server error')
  }
})

server.listen(port, () => {
  console.log(`Serving ${path.relative(root, dir) || dir} at http://localhost:${port}${apiEnabled ? ' (api enabled)' : ''}`)
})
