// Adapts a plain Node request/response pair to the Vercel Node function shape
// (`req.body`, `res.status()`, `res.json()`), so api/*.js runs unchanged in the
// Vite dev server, the local preview server, and tests.

import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const MAX_BODY = 64 * 1024

export async function readBody(req) {
  const chunks = []
  let size = 0
  for await (const chunk of req) {
    size += chunk.length
    if (size > MAX_BODY) throw Object.assign(new Error('Payload too large'), { status: 413 })
    chunks.push(chunk)
  }
  const raw = Buffer.concat(chunks).toString('utf8')
  if (!raw) return undefined
  if (!String(req.headers['content-type'] ?? '').includes('application/json')) return raw
  try {
    return JSON.parse(raw)
  } catch {
    throw Object.assign(new Error('Invalid JSON'), { status: 400 })
  }
}

function decorate(res) {
  res.status = (code) => {
    res.statusCode = code
    return res
  }
  res.json = (value) => {
    if (!res.getHeader('Content-Type')) res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.end(JSON.stringify(value))
    return res
  }
  res.send = (value) => {
    res.end(typeof value === 'string' ? value : JSON.stringify(value))
    return res
  }
  return res
}

/** Runs api/<name>.js for a request. Returns false when no such function exists. */
export async function runApiFunction(root, pathname, req, res) {
  const name = pathname.replace(/^\/api\//, '').replace(/\/$/, '')
  if (!/^[a-z0-9-]+$/.test(name)) return false
  const file = path.join(root, 'api', `${name}.js`)
  if (!fs.existsSync(file)) return false

  decorate(res)
  try {
    req.body = await readBody(req)
  } catch (error) {
    res.status(error.status ?? 400).json({ error: error.status === 413 ? 'payload_too_large' : 'invalid_json' })
    return true
  }
  const mod = await import(`${pathToFileURL(file).href}?t=${fs.statSync(file).mtimeMs}`)
  await mod.default(req, res)
  return true
}
