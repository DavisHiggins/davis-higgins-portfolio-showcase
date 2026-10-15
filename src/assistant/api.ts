// Client for /api/chat. The browser sends only conversation messages and optional
// page context; the server owns the instructions and the knowledge.

export interface ChatTurn {
  role: 'user' | 'assistant'
  content: string
}

export interface PageContext {
  kind: 'project' | 'note'
  slug: string
}

export type ChatErrorKind = 'rate_limited' | 'unavailable' | 'timeout' | 'network' | 'invalid' | 'malformed'

export class ChatError extends Error {
  readonly kind: ChatErrorKind
  readonly retryAfter: number | null
  constructor(kind: ChatErrorKind, retryAfter: number | null = null) {
    super(kind)
    this.kind = kind
    this.retryAfter = retryAfter
  }
  get retryable(): boolean {
    return this.kind !== 'invalid'
  }
}

export const MAX_MESSAGE_LENGTH = 1000
const MAX_HISTORY = 10
const CLIENT_TIMEOUT_MS = 35_000

export async function requestReply(history: ChatTurn[], page: PageContext | null, signal?: AbortSignal): Promise<string> {
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), CLIENT_TIMEOUT_MS)
  const onAbort = () => controller.abort()
  signal?.addEventListener('abort', onAbort)

  let response: Response
  try {
    response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: history.slice(-MAX_HISTORY), ...(page ? { page } : {}) }),
      signal: controller.signal,
    })
  } catch {
    throw new ChatError(controller.signal.aborted && !signal?.aborted ? 'timeout' : 'network')
  } finally {
    window.clearTimeout(timer)
    signal?.removeEventListener('abort', onAbort)
  }

  if (!response.ok) {
    const retryAfter = Number(response.headers.get('Retry-After')) || null
    if (response.status === 429) throw new ChatError('rate_limited', retryAfter)
    if (response.status === 504) throw new ChatError('timeout')
    if (response.status === 400 || response.status === 413) throw new ChatError('invalid')
    throw new ChatError('unavailable')
  }

  let data: unknown
  try {
    data = await response.json()
  } catch {
    throw new ChatError('malformed')
  }
  const reply = (data as { reply?: unknown } | null)?.reply
  if (typeof reply !== 'string' || !reply.trim()) throw new ChatError('malformed')
  return reply.trim()
}

export function errorMessage(error: ChatError): string {
  switch (error.kind) {
    case 'rate_limited':
      return `That's a lot of questions in a short time. Please wait ${error.retryAfter ? `${error.retryAfter} seconds` : 'a minute'} and try again.`
    case 'timeout':
      return 'That took too long to answer. Please try again.'
    case 'network':
      return "I couldn't reach the server. Check your connection and try again."
    case 'invalid':
      return 'That message could not be sent. Try a shorter question.'
    case 'malformed':
    case 'unavailable':
    default:
      return 'Davis Intelligence is unavailable right now. You can try again, or browse Projects and Experience directly.'
  }
}
