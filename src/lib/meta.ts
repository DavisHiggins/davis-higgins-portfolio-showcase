import routes from '../generated/routes.json'
import { SITE_URL } from './site'
import type { RouteMetaRecord } from './types'

const ROUTES = routes as RouteMetaRecord[]
const BY_PATH = new Map(ROUTES.map((r) => [r.path, r]))

export const NOT_FOUND_META: RouteMetaRecord = {
  path: '/404',
  kind: 'page',
  title: 'Page not found | Davis Higgins',
  description: 'This page does not exist. Browse projects, writing, or experience instead.',
  canonical: SITE_URL,
  image: '/og-default.jpg',
  type: 'website',
}

export function metaForPath(pathname: string): RouteMetaRecord {
  const clean = pathname !== '/' ? pathname.replace(/\/+$/, '') : pathname
  return BY_PATH.get(clean) ?? NOT_FOUND_META
}

export const PRERENDER_PATHS: string[] = ROUTES.map((r) => r.path)

function absolute(url: string): string {
  return /^https?:\/\//.test(url) ? url : `${SITE_URL}${url}`
}

function escapeAttr(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

/** Head tags for a route, used by the prerenderer. */
export function renderHeadTags(meta: RouteMetaRecord, { noindex = false } = {}): string {
  const tags = [
    `<title>${escapeAttr(meta.title)}</title>`,
    `<meta name="description" content="${escapeAttr(meta.description)}" />`,
    `<link rel="canonical" href="${escapeAttr(meta.canonical)}" />`,
    `<meta property="og:site_name" content="Davis Higgins" />`,
    `<meta property="og:type" content="${escapeAttr(meta.type)}" />`,
    `<meta property="og:title" content="${escapeAttr(meta.title)}" />`,
    `<meta property="og:description" content="${escapeAttr(meta.description)}" />`,
    `<meta property="og:url" content="${escapeAttr(meta.canonical)}" />`,
    `<meta property="og:image" content="${escapeAttr(absolute(meta.image))}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeAttr(meta.title)}" />`,
    `<meta name="twitter:description" content="${escapeAttr(meta.description)}" />`,
    `<meta name="twitter:image" content="${escapeAttr(absolute(meta.image))}" />`,
  ]
  if (noindex) tags.push('<meta name="robots" content="noindex" />')
  return tags.join('\n    ')
}

function setMeta(selector: string, attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

/** Keeps the document head in sync after client-side navigation. */
export function applyMetaToDocument(meta: RouteMetaRecord): void {
  document.title = meta.title
  setMeta('meta[name="description"]', 'name', 'description', meta.description)
  setMeta('meta[property="og:title"]', 'property', 'og:title', meta.title)
  setMeta('meta[property="og:description"]', 'property', 'og:description', meta.description)
  setMeta('meta[property="og:url"]', 'property', 'og:url', meta.canonical)
  setMeta('meta[property="og:image"]', 'property', 'og:image', absolute(meta.image))
  setMeta('meta[property="og:type"]', 'property', 'og:type', meta.type)
  setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', meta.title)
  setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', meta.description)
  setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', absolute(meta.image))
  let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!canonical) {
    canonical = document.createElement('link')
    canonical.rel = 'canonical'
    document.head.appendChild(canonical)
  }
  canonical.href = meta.canonical
  const robots = document.head.querySelector('meta[name="robots"]')
  if (meta === NOT_FOUND_META) setMeta('meta[name="robots"]', 'name', 'robots', 'noindex')
  else robots?.remove()
}
