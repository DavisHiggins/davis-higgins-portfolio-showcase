#!/usr/bin/env node
// Runs the Davis Intelligence evaluation cases (tests/ai/evaluation-cases.json)
// against a real /api/chat and saves transcripts to .verify/ai-eval.json for review.
// Answers are judged by meaning and source fidelity, not exact strings; the
// automatic checks here only flag transport failures, missing links, and
// forbidden content.
//
//   node scripts/eval-assistant.mjs --base http://localhost:5173
//   node scripts/eval-assistant.mjs --deployment https://<preview>.vercel.app   (uses `vercel curl` for protected previews)

import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const args = process.argv.slice(2)
const arg = (name) => (args.includes(name) ? args[args.indexOf(name) + 1] : null)
const base = arg('--base')
const deployment = arg('--deployment')
const only = arg('--only')?.split(',')
const pauseMs = Number(arg('--pause') ?? 7000)
if (!base && !deployment) throw new Error('Pass --base <url> or --deployment <preview url>')

const { cases } = JSON.parse(fs.readFileSync(path.join(root, 'tests/ai/evaluation-cases.json'), 'utf8'))

// Multi-turn cases need an earlier exchange first.
const PRIMERS = {
  'AI-33': 'Tell me about Flowcast.',
  'AI-34': 'Where does Davis work right now?',
}
const FORBIDDEN = [/<script/i, /javascript:/i, /sk-ant-/i, /ANTHROPIC_API_KEY/, /senior engineer with 10/i, /graduated from MIT/i]

async function post(body) {
  const json = JSON.stringify(body)
  if (base) {
    const res = await fetch(`${base}/api/chat`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: json })
    return { status: res.status, body: await res.json().catch(() => null) }
  }
  const tmp = path.join(root, '.verify/eval-body.json')
  fs.mkdirSync(path.dirname(tmp), { recursive: true })
  fs.writeFileSync(tmp, json)
  const out = execFileSync(
    'vercel',
    // Space-free arguments: on Windows `vercel` is a .cmd shim that runs through a shell.
    ['curl', '/api/chat', '--deployment', deployment, '--', '-s', '-X', 'POST', '-H', 'Content-Type:application/json', '--data-binary', '@.verify/eval-body.json', '-w', 'HTTPSTATUS:%{http_code}'],
    { cwd: root, encoding: 'utf8', shell: process.platform === 'win32', env: { ...process.env, MSYS_NO_PATHCONV: '1' }, stdio: ['ignore', 'pipe', 'ignore'] },
  )
  const [raw, code] = out.trim().split('HTTPSTATUS:')
  const status = Number(code)
  let parsed = null
  try {
    parsed = JSON.parse(raw)
  } catch {
    parsed = { raw: raw.slice(0, 300) }
  }
  return { status, body: parsed }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const results = []
for (const c of cases) {
  if (only && !only.includes(c.id)) continue
  const messages = []
  if (PRIMERS[c.id]) {
    messages.push({ role: 'user', content: PRIMERS[c.id] })
    const primed = await post({ messages })
    messages.push({ role: 'assistant', content: primed.body?.reply ?? '' })
    await sleep(pauseMs)
  }
  messages.push({ role: 'user', content: c.question })
  const started = Date.now()
  const res = await post({ messages })
  const reply = res.body?.reply ?? ''
  const flags = []
  if (res.status !== 200) flags.push(`status ${res.status}`)
  if (c.usefulLink && !reply.includes(c.usefulLink)) flags.push(`no ${c.usefulLink}`)
  for (const pattern of FORBIDDEN) if (pattern.test(reply)) flags.push(`forbidden ${pattern}`)
  results.push({ id: c.id, question: c.question, expected: c.expected, usefulLink: c.usefulLink, status: res.status, ms: Date.now() - started, reply, flags })
  console.log(`${c.id} ${res.status} ${flags.length ? `FLAGS: ${flags.join('; ')}` : 'ok'}`)
  await sleep(pauseMs)
}
fs.mkdirSync(path.join(root, '.verify'), { recursive: true })
fs.writeFileSync(path.join(root, '.verify/ai-eval.json'), JSON.stringify({ ranAt: new Date().toISOString(), target: base ?? deployment, results }, null, 2))
console.log(`saved ${results.length} transcripts to .verify/ai-eval.json`)
