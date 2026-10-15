import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

// Renders model output as plain React text with a small, safe vocabulary:
// paragraphs, "- " lists, **bold**, and links. Links render only when the
// destination is a known local route or an allowlisted https host; anything else
// (javascript:, data:, unknown hosts, raw HTML) is shown as inert text.

const LOCAL_ROUTE = /^\/(?:$|projects(?:\/[a-z0-9-]+)?$|writing(?:\/[a-z0-9-]+)?$|experience$|education$|contact$|davis-resume\.pdf$|docs\/Census_Data_Analysis_Paper\.pdf$)/
const ALLOWED_HOSTS = [
  'davishiggins.com',
  'higginsd.com',
  'flowcastweb.vercel.app',
  'secondc.vercel.app',
  'cltphidelt.vercel.app',
  'touchupsolutions.vercel.app',
  'wynotpics.vercel.app',
  'ynot.lifestyle',
  'lakesidesportclub.com',
  'higginsbuildinggroup.com',
  'kewaunee.com',
  'github.com',
  'linkedin.com',
]

export type SafeLink = { kind: 'internal'; to: string } | { kind: 'external'; href: string }

export function classifyLink(raw: string): SafeLink | null {
  const href = raw.trim().replace(/[.,;:!?)]+$/, '')
  if (href.startsWith('/')) {
    const path = href.split(/[?#]/)[0]
    return LOCAL_ROUTE.test(path) ? { kind: 'internal', to: href } : null
  }
  let url: URL
  try {
    url = new URL(href.startsWith('http') ? href : `https://${href}`)
  } catch {
    return null
  }
  if (url.protocol !== 'https:') return null
  const host = url.hostname.replace(/^www\./, '')
  const allowed = ALLOWED_HOSTS.some((h) => host === h || host.endsWith(`.${h}`))
  if (!allowed) return null
  if (host === 'github.com' && !/^\/davishiggins(\/|$)/i.test(url.pathname)) return null
  if (host === 'linkedin.com' && !/^\/in\/davishiggins\/?$/i.test(url.pathname)) return null
  if (host === 'portfolio.davishiggins.com') {
    return LOCAL_ROUTE.test(url.pathname) ? { kind: 'internal', to: url.pathname } : null
  }
  return { kind: 'external', href: url.toString() }
}

// [label](url) | bare https URL | bare domain we allow | local path | **bold**
const TOKEN = /\[([^\]]{1,120})\]\(([^)\s]{1,300})\)|(https?:\/\/[^\s<>()]+)|\b((?:[a-z0-9-]+\.)*(?:davishiggins\.com|higginsd\.com|ynot\.lifestyle|lakesidesportclub\.com|flowcastweb\.vercel\.app|secondc\.vercel\.app)(?:\/[^\s<>()]*)?)|(?<![\w/])(\/(?:projects|writing)\/[a-z0-9-]+|\/(?:projects|writing|experience|education|contact)\b|\/davis-resume\.pdf)|\*\*([^*]{1,200})\*\*/gi

function renderInline(text: string, onNavigate?: () => void): ReactNode[] {
  const out: ReactNode[] = []
  let last = 0
  let key = 0
  for (const match of text.matchAll(TOKEN)) {
    const index = match.index ?? 0
    if (index > last) out.push(text.slice(last, index))
    last = index + match[0].length
    const [, mdLabel, mdHref, bareUrl, bareDomain, localPath, bold] = match
    if (bold) {
      out.push(<strong key={key++}>{bold}</strong>)
      continue
    }
    const target = mdHref ?? bareUrl ?? bareDomain ?? localPath ?? ''
    const trailing = (bareUrl ?? bareDomain ?? '').match(/[.,;:!?)]+$/)?.[0] ?? ''
    const label = mdLabel ?? target.replace(/[.,;:!?)]+$/, '')
    const link = classifyLink(target)
    if (!link) {
      out.push(mdLabel ?? match[0])
      continue
    }
    if (link.kind === 'internal') {
      out.push(
        <Link key={key++} to={link.to} onClick={onNavigate} className="di-link">
          {label}
        </Link>,
      )
    } else {
      out.push(
        <a key={key++} href={link.href} target="_blank" rel="noopener noreferrer" className="di-link">
          {label}
        </a>,
      )
    }
    if (trailing) out.push(trailing)
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

export function renderReply(text: string, onNavigate?: () => void): ReactNode {
  // Strip any HTML-looking tags the model might emit; they are never rendered.
  const clean = text.replace(/<\/?[a-z][^>]*>/gi, '').replace(/^#{1,6}\s+/gm, '')
  const blocks = clean.split(/\n{2,}/).map((b) => b.trim()).filter(Boolean)
  return blocks.map((block, i) => {
    const lines = block.split('\n')
    if (lines.every((line) => /^\s*(?:[-*•]|\d+[.)])\s+/.test(line))) {
      return (
        <ul key={i} className="di-list">
          {lines.map((line, j) => (
            <li key={j}>{renderInline(line.replace(/^\s*(?:[-*•]|\d+[.)])\s+/, ''), onNavigate)}</li>
          ))}
        </ul>
      )
    }
    return <p key={i}>{renderInline(lines.join(' '), onNavigate)}</p>
  })
}
