// POST /api/chat: Davis Intelligence.
//
// The request body is only { messages, page? }. The system prompt and every fact
// come from the server (server/policy.js and the generated knowledge built from
// content/). A client-supplied `system` field is ignored. ANTHROPIC_API_KEY stays
// server-side; provider errors are never returned to the browser.

import knowledge from '../server/knowledge.generated.js'
import { anthropicProvider, handleChat } from '../server/chat-core.js'

// Unchanged from the previous deployment; no provider or model migration.
const MODEL = 'claude-sonnet-4-6'

/** @param {import('node:http').IncomingMessage & { body?: unknown }} req */
function clientKey(req) {
  const forwarded = req.headers['x-forwarded-for']
  const first = Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(',')[0]
  return (first ?? req.socket?.remoteAddress ?? 'unknown').trim()
}

/**
 * @param {import('node:http').IncomingMessage & { body?: unknown }} req
 * @param {import('node:http').ServerResponse} res
 */
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  res.setHeader('X-Content-Type-Options', 'nosniff')

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    res.statusCode = 405
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: 'method_not_allowed' }))
    return
  }
  if (!String(req.headers['content-type'] ?? '').includes('application/json')) {
    res.statusCode = 415
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: 'unsupported_media_type' }))
    return
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  const provider = apiKey ? anthropicProvider({ apiKey, model: MODEL }) : null

  let result
  try {
    result = await handleChat({ body: req.body, clientKey: clientKey(req), knowledge, provider })
  } catch (error) {
    console.error('chat handler failure', error instanceof Error ? error.message : 'unknown')
    result = { status: 500, body: { error: 'assistant_error' } }
  }
  if (result.status >= 500) console.warn('chat error', result.status, result.body.error)

  res.statusCode = result.status
  for (const [key, value] of Object.entries(result.headers ?? {})) res.setHeader(key, value)
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(result.body))
}
