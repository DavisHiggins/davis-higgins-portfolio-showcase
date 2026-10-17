// Davis Intelligence request handling, independent of the hosting runtime so it can
// be unit-tested. api/chat.js is a thin Vercel adapter around handleChat().

import { buildPolicy } from './policy.js'

/**
 * @typedef {{ role: 'user' | 'assistant', content: string }} ChatTurn
 * @typedef {{ kind: 'project' | 'note', slug: string }} PageContext
 * @typedef {{ id: string, title: string, text: string, keywords: string[], links: { label: string, href: string }[], always?: boolean, slug?: string }} KnowledgeChunk
 * @typedef {{ reviewedAt: string, siteUrl: string, projectSlugs: string[], noteSlugs: string[], chunks: KnowledgeChunk[] }} Knowledge
 * @typedef {{ status: number, body: Record<string, unknown>, headers?: Record<string, string> }} ChatResult
 * @typedef {(request: { system: string, messages: ChatTurn[], signal: AbortSignal }) => Promise<string>} Provider
 */

export const LIMITS = {
  maxMessages: 12,
  maxUserChars: 1000,
  maxAssistantChars: 4000,
  maxTotalChars: 12000,
  providerTimeoutMs: 25000,
  maxOutputTokens: 700,
  maxRetrievedChunks: 6,
}

/**
 * Validates the public request contract: { messages: ChatTurn[], page?: PageContext }.
 * A client-supplied `system` field and any other unknown fields are ignored; they
 * can never reach the provider. System-role messages are rejected.
 * @param {unknown} body
 * @param {Knowledge} knowledge
 * @returns {{ ok: true, messages: ChatTurn[], page: PageContext | null } | { ok: false, status: number, error: string }}
 */
export function validateRequest(body, knowledge) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return { ok: false, status: 400, error: 'invalid_request' }
  const { messages, page } = /** @type {{ messages?: unknown, page?: unknown }} */ (body)
  if (!Array.isArray(messages) || messages.length === 0) return { ok: false, status: 400, error: 'messages_required' }
  if (messages.length > 40) return { ok: false, status: 413, error: 'too_many_messages' }

  /** @type {ChatTurn[]} */
  const turns = []
  let total = 0
  for (const message of messages) {
    if (!message || typeof message !== 'object') return { ok: false, status: 400, error: 'invalid_message' }
    const { role, content } = /** @type {{ role?: unknown, content?: unknown }} */ (message)
    if (role !== 'user' && role !== 'assistant') return { ok: false, status: 400, error: 'invalid_role' }
    if (typeof content !== 'string') return { ok: false, status: 400, error: 'invalid_message' }
    const text = content.trim()
    if (!text) return { ok: false, status: 400, error: 'empty_message' }
    const limit = role === 'user' ? LIMITS.maxUserChars : LIMITS.maxAssistantChars
    if (text.length > limit) return { ok: false, status: 413, error: 'message_too_long' }
    total += text.length
    turns.push({ role, content: text })
  }
  if (total > LIMITS.maxTotalChars * 3) return { ok: false, status: 413, error: 'conversation_too_long' }
  if (turns[turns.length - 1].role !== 'user') return { ok: false, status: 400, error: 'last_message_must_be_user' }

  // Keep the most recent turns within budget, starting on a user turn and
  // alternating roles as the provider requires.
  let recent = turns.slice(-LIMITS.maxMessages)
  while (recent.reduce((sum, t) => sum + t.content.length, 0) > LIMITS.maxTotalChars && recent.length > 1) recent = recent.slice(1)
  while (recent.length && recent[0].role !== 'user') recent = recent.slice(1)
  /** @type {ChatTurn[]} */
  const normalized = []
  for (const turn of recent) {
    const last = normalized[normalized.length - 1]
    if (last && last.role === turn.role) last.content = `${last.content}\n\n${turn.content}`
    else normalized.push({ ...turn })
  }

  /** @type {PageContext | null} */
  let pageContext = null
  if (page && typeof page === 'object') {
    const { kind, slug } = /** @type {{ kind?: unknown, slug?: unknown }} */ (page)
    if (kind === 'project' && typeof slug === 'string' && knowledge.projectSlugs.includes(slug)) pageContext = { kind, slug }
    if (kind === 'note' && typeof slug === 'string' && knowledge.noteSlugs.includes(slug)) pageContext = { kind, slug }
  }
  return { ok: true, messages: normalized, page: pageContext }
}

const STOP = new Set('a an and are as at be but by can could did do does for from had has have he him his how i if in into is it its me my of on or our she so than that the their them then there these they this to was we were what when where which who why will with would you your about tell davis higgins'.split(' '))

/** @param {string} text */
export function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[’']/g, '')
    .split(/[^a-z0-9&+.#]+/)
    .map((t) => t.replace(/^\.+|\.+$/g, ''))
    .filter((t) => t.length > 1 && !STOP.has(t))
}

/**
 * Deterministic keyword retrieval over the reviewed knowledge chunks. The latest
 * question weighs most; earlier user turns keep follow-ups ("what about his
 * school?") on topic; the current page boosts its own chunk.
 * @param {Knowledge} knowledge
 * @param {ChatTurn[]} messages
 * @param {PageContext | null} page
 * @returns {KnowledgeChunk[]}
 */
export function retrieve(knowledge, messages, page) {
  const userTurns = messages.filter((m) => m.role === 'user').map((m) => m.content)
  const weighted = userTurns
    .slice(-3)
    .reverse()
    .map((text, i) => ({ tokens: tokenize(text), weight: i === 0 ? 1 : 0.45 / i }))
  const lastAssistant = [...messages].reverse().find((m) => m.role === 'assistant')
  if (lastAssistant) weighted.push({ tokens: tokenize(lastAssistant.content).slice(0, 60), weight: 0.2 })

  const scored = knowledge.chunks
    .filter((chunk) => !chunk.always)
    .map((chunk) => {
      const keywords = new Set(chunk.keywords)
      const titleTokens = new Set(tokenize(chunk.title))
      const bodyTokens = new Set(tokenize(chunk.text))
      let score = 0
      for (const { tokens, weight } of weighted) {
        for (const token of tokens) {
          if (titleTokens.has(token)) score += 3 * weight
          else if (keywords.has(token)) score += 2 * weight
          else if (bodyTokens.has(token)) score += 0.5 * weight
        }
      }
      if (page && chunk.id === `${page.kind}-${page.slug}`) score += 2.5
      return { chunk, score }
    })
    .filter((entry) => entry.score > 0.9)
    .sort((a, b) => b.score - a.score)
    .slice(0, LIMITS.maxRetrievedChunks)
    .map((entry) => entry.chunk)

  return [...knowledge.chunks.filter((chunk) => chunk.always), ...scored]
}

/** @param {KnowledgeChunk} chunk */
function formatChunk(chunk) {
  const links = chunk.links.map((l) => `[${l.label}](${l.href})`).join(' · ')
  return `### ${chunk.title}\n${chunk.text}${links ? `\nLinks: ${links}` : ''}`
}

/**
 * @param {Knowledge} knowledge
 * @param {KnowledgeChunk[]} chunks
 * @param {PageContext | null} page
 */
export function buildSystemPrompt(knowledge, chunks, page) {
  const pageLine = page ? `\nThe visitor is currently viewing ${page.kind === 'project' ? `/projects/${page.slug}` : `/writing/${page.slug}`}.` : ''
  return `${buildPolicy(knowledge.reviewedAt)}${pageLine}\n\nPORTFOLIO KNOWLEDGE\n\n${chunks.map(formatChunk).join('\n\n')}`
}

/** Removes markup the client would never render and caps length. @param {string} text */
export function sanitizeReply(text) {
  return text
    .replace(/<\/?[a-z][^>]*>/gi, '')
    .replace(/\]\(\s*(?:javascript|data|vbscript):[^)]*\)/gi, ']')
    .trim()
    .slice(0, 4000)
}

/**
 * @param {{ apiKey: string, model: string, fetchImpl?: typeof fetch }} options
 * @returns {Provider}
 */
export function anthropicProvider({ apiKey, model, fetchImpl = fetch }) {
  return async ({ system, messages, signal }) => {
    const response = await fetchImpl('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model, max_tokens: LIMITS.maxOutputTokens, temperature: 0.3, system, messages }),
      signal,
    })
    if (!response.ok) {
      throw Object.assign(new Error(`provider_status_${response.status}`), { providerStatus: response.status })
    }
    const data = /** @type {{ content?: { type?: string, text?: string }[] }} */ (await response.json())
    const text = (data.content ?? [])
      .filter((part) => part.type === 'text' && typeof part.text === 'string')
      .map((part) => part.text)
      .join('\n')
      .trim()
    if (!text) throw Object.assign(new Error('provider_empty'), { providerStatus: 502 })
    return text
  }
}

// Best-effort, per-instance limiter. Serverless instances do not share memory,
// so this bounds bursts from one client on one instance; it is not a durable
// distributed quota.
/** @type {Map<string, number[]>} */
const hits = new Map()
let inFlight = 0
const WINDOW_MS = 60_000
const PER_WINDOW = 10
const MAX_IN_FLIGHT = 8

/** @param {string} key @param {number} now */
export function rateLimit(key, now = Date.now()) {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS)
  if (recent.length >= PER_WINDOW) {
    hits.set(key, recent)
    return { allowed: false, retryAfter: Math.max(1, Math.ceil((WINDOW_MS - (now - recent[0])) / 1000)) }
  }
  recent.push(now)
  hits.set(key, recent)
  if (hits.size > 5000) hits.clear()
  return { allowed: true, retryAfter: 0 }
}

export function resetRateLimits() {
  hits.clear()
  inFlight = 0
}

/**
 * @param {{ body: unknown, clientKey: string, knowledge: Knowledge, provider: Provider | null, timeoutMs?: number }} input
 * @returns {Promise<ChatResult>}
 */
export async function handleChat({ body, clientKey, knowledge, provider, timeoutMs = LIMITS.providerTimeoutMs }) {
  const limit = rateLimit(clientKey)
  if (!limit.allowed) return { status: 429, body: { error: 'rate_limited' }, headers: { 'Retry-After': String(limit.retryAfter) } }

  const parsed = validateRequest(body, knowledge)
  if (!parsed.ok) return { status: parsed.status, body: { error: parsed.error } }
  if (!provider) return { status: 503, body: { error: 'assistant_unavailable' } }
  if (inFlight >= MAX_IN_FLIGHT) return { status: 503, body: { error: 'busy' }, headers: { 'Retry-After': '5' } }

  const chunks = retrieve(knowledge, parsed.messages, parsed.page)
  const system = buildSystemPrompt(knowledge, chunks, parsed.page)
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  inFlight++
  try {
    const text = await provider({ system, messages: parsed.messages, signal: controller.signal })
    return { status: 200, body: { reply: sanitizeReply(text), knowledgeReviewedAt: knowledge.reviewedAt } }
  } catch (error) {
    if (controller.signal.aborted) return { status: 504, body: { error: 'timeout' } }
    const providerStatus = /** @type {{ providerStatus?: number }} */ (error).providerStatus
    if (providerStatus === 429 || providerStatus === 529) return { status: 503, body: { error: 'busy' }, headers: { 'Retry-After': '20' } }
    return { status: 502, body: { error: 'assistant_error' } }
  } finally {
    clearTimeout(timer)
    inFlight--
  }
}
