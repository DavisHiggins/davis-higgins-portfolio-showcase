#!/usr/bin/env node
// Validates the content registries and generates everything derived from them:
//
//   src/generated/projects-index.json      light gallery index (shipped with /projects)
//   src/generated/projects/<slug>.json     one case study per file (loaded by route)
//   src/generated/notes-index.json         the 16 included notes' original metadata
//   src/generated/notes/<slug>.html        validated, verbatim note bodies (loaded by route)
//   src/generated/profile.json             public profile for Home/Experience/Education/Contact
//   src/generated/routes.json              every public route with its metadata (prerender)
//   server/knowledge.generated.js          server-only assistant knowledge
//   public/sitemap.xml, public/robots.txt
//
// The build fails on any validation error. Internal fields (sources, provenance,
// assistant notes) never reach the client projections.

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SITE_URL = 'https://portfolio.davishiggins.com'
const NOTES_SITE = 'https://notes.davishiggins.com'
const allowMissingMedia = process.env.ALLOW_MISSING_MEDIA === '1'

const read = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'))
const write = (file, value) => {
  const target = path.join(root, file)
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.writeFileSync(target, typeof value === 'string' ? value : JSON.stringify(value, null, 2) + '\n')
}

const errors = []
const fail = (message) => errors.push(message)

// ---------------------------------------------------------------------------
// Taxonomy
// ---------------------------------------------------------------------------
const CATEGORIES = [
  { id: 'data-ml', label: 'Data & ML' },
  { id: 'ai-automation', label: 'AI & Automation' },
  { id: 'web-commerce', label: 'Websites & Commerce' },
  { id: 'software-tools', label: 'Software & Tools' },
  { id: 'research-community', label: 'Research & Community' },
]
const CATEGORY_IDS = new Set(CATEGORIES.map((c) => c.id))
const LINK_KINDS = new Set(['website', 'showcase', 'source', 'paper', 'employer', 'model-card', 'dashboard', 'preview', 'methodology', 'internal'])
const FORBIDDEN_COPY = [/\bTBD\b/, /\bTODO\b/i, /for Claude/i, /publication notes/i, /\bresolved\b": false/]

// ---------------------------------------------------------------------------
// Media
// ---------------------------------------------------------------------------
const { media } = read('content/media.json')
const derivatives = fs.existsSync(path.join(root, 'content/media-derivatives.json'))
  ? read('content/media-derivatives.json')
  : {}

function resolveImage(id, variant, context) {
  const entry = media[id]
  const data = derivatives[id]?.[variant]
  if (!entry || !data) {
    if (allowMissingMedia) return null
    fail(`${context}: media "${id}" has no ${variant} derivatives (run npm run media)`)
    return null
  }
  const srcset = (list) => list.map((item) => `${item.src} ${item.w}w`).join(', ')
  const fallback = data.webp.find((item) => item.w >= 700) ?? data.webp[data.webp.length - 1]
  return {
    src: fallback.src,
    avif: srcset(data.avif),
    webp: srcset(data.webp),
    width: data.width,
    height: data.height,
    alt: entry.alt,
    caption: entry.caption ?? null,
    credit: entry.credit ?? null,
    position: entry.position ?? '50% 50%',
    kind: entry.kind,
  }
}

// ---------------------------------------------------------------------------
// Notes
// ---------------------------------------------------------------------------
const noteManifest = read('content/notes/manifest.json')
const relatedProjectBlocks = read('content/notes/related-projects.json')
if (noteManifest.notes.length !== noteManifest.totalSourceNotes) fail('notes manifest: total count mismatch')
const includedNotes = noteManifest.notes.filter((n) => n.included).sort((a, b) => a.sourceOrder - b.sourceOrder)
if (includedNotes.length !== 16) fail(`notes: expected 16 included notes, found ${includedNotes.length}`)

const ALLOWED_TAGS = new Set(['p', 'strong', 'em', 'b', 'i', 'a', 'code', 'ul', 'ol', 'li', 'blockquote', 'h2', 'h3', 'br', 'hr', 'pre'])
const ALLOWED_ATTRS = { a: new Set(['href', 'target', 'rel', 'data-cursor']) }

function validateNoteHtml(slug, html) {
  const tagPattern = /<\/?([a-zA-Z][a-zA-Z0-9]*)([^>]*)>/g
  let match
  while ((match = tagPattern.exec(html))) {
    const tag = match[1].toLowerCase()
    if (!ALLOWED_TAGS.has(tag)) fail(`note ${slug}: disallowed tag <${tag}>`)
    const attrs = [...match[2].matchAll(/([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*=\s*("([^"]*)"|'([^']*)')/g)]
    for (const attr of attrs) {
      const name = attr[1].toLowerCase()
      const value = attr[3] ?? attr[4] ?? ''
      if (!ALLOWED_ATTRS[tag]?.has(name)) fail(`note ${slug}: disallowed attribute ${name} on <${tag}>`)
      if (name === 'href' && !/^(https:\/\/|\/(?!\/)|#|mailto:)/i.test(value.trim())) fail(`note ${slug}: unsafe href ${value}`)
    }
  }
  if (/<!--|<!\[CDATA|&#x?0*(?:58|3a);/i.test(html)) fail(`note ${slug}: unexpected comment or encoded protocol`)
}

const notesIndex = includedNotes.map((note) => {
  const bodyFile = `content/notes/bodies/${note.slug}.html`
  if (!fs.existsSync(path.join(root, bodyFile))) {
    fail(`note ${note.slug}: missing body`)
    return null
  }
  const html = fs.readFileSync(path.join(root, bodyFile), 'utf8')
  validateNoteHtml(note.slug, html)
  write(`src/generated/notes/${note.slug}.html`, html)
  if (note.sourceUrl !== `${NOTES_SITE}/notes/${note.slug}`) fail(`note ${note.slug}: unexpected source URL`)
  return {
    slug: note.slug,
    title: note.title,
    category: note.category,
    dateLabel: note.dateLabel,
    readTime: note.readTime,
    excerpt: note.excerpt,
    sourceUrl: note.sourceUrl,
    relatedProject: relatedProjectBlocks[note.slug] ?? null,
  }
}).filter(Boolean)
const noteBySlug = new Map(notesIndex.map((n) => [n.slug, n]))

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------
const projectFiles = fs.readdirSync(path.join(root, 'content/projects')).filter((f) => f.endsWith('.json'))
const projects = projectFiles.map((file) => ({ file, ...read(`content/projects/${file}`) }))
const slugs = new Set()
const orders = new Set()

const REQUIRED = ['slug', 'title', 'sortOrder', 'categories', 'status', 'summary', 'tagline', 'role', 'stack', 'links', 'problem', 'contribution', 'solution', 'architecture', 'decisions', 'outcomes', 'lessons', 'related', 'media']
for (const project of projects) {
  const ctx = `project ${project.file}`
  for (const key of REQUIRED) if (project[key] === undefined) fail(`${ctx}: missing ${key}`)
  if (`${project.slug}.json` !== project.file) fail(`${ctx}: slug does not match file name`)
  if (!/^[a-z0-9-]+$/.test(project.slug)) fail(`${ctx}: invalid slug`)
  if (slugs.has(project.slug)) fail(`${ctx}: duplicate slug`)
  slugs.add(project.slug)
  if (orders.has(project.sortOrder)) fail(`${ctx}: duplicate sortOrder`)
  orders.add(project.sortOrder)
  if (!project.categories?.length || project.categories.some((c) => !CATEGORY_IDS.has(c))) fail(`${ctx}: invalid categories`)
  for (const link of project.links ?? []) {
    if (!LINK_KINDS.has(link.kind)) fail(`${ctx}: unknown link kind ${link.kind}`)
    if (!/^(https:\/\/|\/)/.test(link.href) || link.href === '#') fail(`${ctx}: invalid link ${link.href}`)
    if (link.kind === 'showcase' && link.label !== 'GitHub showcase') fail(`${ctx}: showcase links must be labeled "GitHub showcase"`)
  }
  if (!project.decisions?.length) fail(`${ctx}: needs key decisions`)
  for (const slug of project.relatedNotes ?? []) if (!noteBySlug.has(slug)) fail(`${ctx}: unknown related note ${slug}`)
  if (project.media?.cover === project.media?.detail) fail(`${ctx}: detail image must differ from the cover`)
  if (project.media?.hero === project.media?.detail) fail(`${ctx}: detail image must differ from the hero`)
  const copy = JSON.stringify({ ...project, sources: undefined })
  for (const pattern of FORBIDDEN_COPY) if (pattern.test(copy)) fail(`${ctx}: copy matches forbidden pattern ${pattern}`)
}
for (const project of projects) {
  for (const slug of project.related ?? []) {
    if (!slugs.has(slug) || slug === project.slug) fail(`project ${project.slug}: invalid related project ${slug}`)
  }
}
if (projects.length !== 24) fail(`projects: expected 24 published projects, found ${projects.length}`)
projects.sort((a, b) => a.sortOrder - b.sortOrder)
const bySlug = new Map(projects.map((p) => [p.slug, p]))

const projectsIndex = projects.map((project) => ({
  slug: project.slug,
  title: project.title,
  summary: project.summary,
  categories: project.categories,
  status: project.status,
  sortOrder: project.sortOrder,
  cover: resolveImage(project.media.cover, 'card', project.slug),
}))

for (const project of projects) {
  const detail = {
    slug: project.slug,
    title: project.title,
    categories: project.categories,
    status: project.status,
    period: project.period ?? null,
    summary: project.summary,
    tagline: project.tagline,
    role: project.role,
    team: project.team ?? null,
    stack: project.stack,
    links: project.links,
    metrics: project.metrics ?? [],
    problem: project.problem,
    contribution: project.contribution,
    solution: project.solution,
    solutionPoints: project.solutionPoints ?? [],
    architecture: project.architecture,
    decisions: project.decisions,
    tradeoffs: project.tradeoffs ?? [],
    outcomes: project.outcomes,
    limits: project.limits ?? [],
    lessons: project.lessons,
    hero: resolveImage(project.media.hero, 'hero', project.slug),
    detailImage: resolveImage(project.media.detail, 'detail', project.slug),
    ogImage: derivatives[project.media.cover]?.og ?? null,
    relatedNotes: (project.relatedNotes ?? []).map((slug) => {
      const note = noteBySlug.get(slug)
      return { slug, title: note.title, category: note.category, dateLabel: note.dateLabel, readTime: note.readTime }
    }),
    related: project.related.map((slug) => {
      const other = bySlug.get(slug)
      return { slug, title: other.title, summary: other.summary, status: other.status, cover: resolveImage(other.media.cover, 'card', slug) }
    }),
  }
  write(`src/generated/projects/${project.slug}.json`, detail)
}

// Remove generated files for projects or notes that no longer exist.
for (const [dir, valid] of [['src/generated/projects', slugs], ['src/generated/notes', new Set(noteBySlug.keys())]]) {
  const full = path.join(root, dir)
  if (!fs.existsSync(full)) continue
  for (const file of fs.readdirSync(full)) {
    if (!valid.has(file.replace(/\.(json|html)$/, ''))) fs.rmSync(path.join(full, file))
  }
}

// ---------------------------------------------------------------------------
// Profile
// ---------------------------------------------------------------------------
const profile = read('content/profile.json')
const publicProfile = {
  reviewedAt: profile.reviewedAt,
  identity: { name: profile.identity.name, location: profile.identity.location, headline: profile.identity.headline },
  education: profile.education,
  awards: profile.awards,
  experience: profile.experience.map((employer) => {
    const copy = { ...employer }
    delete copy.assistantNote
    return copy
  }),
  contact: profile.contact,
}

// ---------------------------------------------------------------------------
// Routes and metadata
// ---------------------------------------------------------------------------
const DEFAULT_IMAGE = '/og-default.jpg'
const routes = [
  { path: '/', kind: 'page', title: 'Davis Higgins | Data, AI, and Software Portfolio', description: 'Davis Higgins builds analytics dashboards, machine-learning products, AI systems, and websites. Data Science at UNC Charlotte, Software Engineer at One Chaptr Group, Data Analyst at Kewaunee Scientific.' },
  { path: '/experience', kind: 'page', title: 'Experience | Davis Higgins', description: 'Software engineering at One Chaptr Group, data analytics at Kewaunee Scientific, and founding Higgins Digital, plus earlier roles and leadership.' },
  { path: '/projects', kind: 'page', title: 'Projects | Davis Higgins', description: 'Selected work across data, AI, software, and the web: 24 projects with individual case studies.' },
  { path: '/education', kind: 'page', title: 'Education | Davis Higgins', description: 'B.S. in Data Science with a minor in Artificial Intelligence at UNC Charlotte, expected May 2027, plus honors and awards.' },
  { path: '/writing', kind: 'page', title: 'Writing | Davis Higgins', description: 'Notes on building products, working with data, and growing through the work.' },
  { path: '/contact', kind: 'page', title: 'Contact | Davis Higgins', description: 'Email, LinkedIn, GitHub, and other direct ways to reach Davis Higgins.' },
  ...projects.map((project) => ({
    path: `/projects/${project.slug}`,
    kind: 'project',
    title: `${project.title} | Projects | Davis Higgins`,
    description: project.tagline.length > 180 ? project.summary : project.tagline,
    image: derivatives[project.media.cover]?.og ?? DEFAULT_IMAGE,
  })),
  ...notesIndex.map((note) => ({
    path: `/writing/${note.slug}`,
    kind: 'note',
    title: `${note.title} | Writing | Davis Higgins`,
    description: note.excerpt.length > 200 ? `${note.excerpt.slice(0, 197).trimEnd()}…` : note.excerpt,
    canonical: note.sourceUrl,
    type: 'article',
  })),
].map((route) => ({
  canonical: `${SITE_URL}${route.path === '/' ? '' : route.path}`,
  image: DEFAULT_IMAGE,
  type: 'website',
  ...route,
}))

// ---------------------------------------------------------------------------
// Sitemap and robots: published portfolio pages only. Note pages are excluded
// because their canonical URL is the original Curated Notes article.
// ---------------------------------------------------------------------------
const sitemapRoutes = routes.filter((r) => r.kind !== 'note')
write(
  'public/sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapRoutes
    .map((r) => `  <url><loc>${r.canonical}</loc><lastmod>${profile.reviewedAt}</lastmod></url>`)
    .join('\n')}\n</urlset>\n`,
)
write('public/robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`)

// ---------------------------------------------------------------------------
// Assistant knowledge (server only)
// ---------------------------------------------------------------------------
const label = (id) => CATEGORIES.find((c) => c.id === id)?.label ?? id
const sentence = (items) => (items ?? []).filter(Boolean).join(' ')
const chunks = []

chunks.push({
  id: 'profile-core',
  always: true,
  title: 'Davis Higgins: current profile',
  keywords: ['davis', 'who', 'about', 'background', 'current', 'role', 'job', 'work'],
  text: [
    `${profile.identity.summary} Based in ${profile.identity.location}.`,
    profile.identity.seniority,
    `Current roles: ${profile.experience.filter((e) => e.current).map((e) => `${e.roles[0].title} at ${e.company} (${e.roles[0].period})`).join('; ')}.`,
    `Education: ${profile.education[0].degree}, minor in ${profile.education[0].minor}, ${profile.education[0].institution}, expected graduation ${profile.education[0].expectedGraduation}, GPA ${profile.education[0].gpaDisplay} as displayed on the current resume.`,
    `Career direction: ${profile.careerDirection.summary} Target roles: ${profile.careerDirection.targets.join(', ')}.`,
  ].join(' '),
  links: [
    { label: 'Experience', href: '/experience' },
    { label: 'Resume (PDF)', href: '/davis-resume.pdf' },
  ],
})

chunks.push({
  id: 'site-guide',
  always: true,
  title: 'Portfolio site guide',
  keywords: ['resume', 'cv', 'skills', 'impact', 'writing', 'notes', 'page', 'where', 'find', 'site', 'portfolio'],
  text: profile.siteGuide.map((g) => `${g.label} (${g.href}): ${g.about}`).join(' '),
  links: profile.siteGuide.map((g) => ({ label: g.label, href: g.href })),
})

chunks.push({
  id: 'aliases',
  always: true,
  title: 'Names and aliases',
  keywords: ['propify', 'davis intelligence', 'dh portfolio', 'repository', 'repo', 'name', 'called', 'renamed'],
  text: profile.aliases.map((a) => `${a.name}: ${a.meaning}`).join(' '),
  links: [{ label: 'Contender case study', href: '/projects/contender' }],
})

for (const employer of profile.experience) {
  chunks.push({
    id: `experience-${employer.id}`,
    title: `${employer.company} (experience)`,
    keywords: [employer.company, employer.id, ...employer.roles.map((r) => r.title), employer.subtitle ?? ''].join(' ').toLowerCase().split(/[^a-z0-9&+.]+/).filter(Boolean),
    text: [
      `${employer.company}${employer.subtitle ? ` (${employer.subtitle})` : ''}.`,
      ...employer.roles.map((r) => `${r.title}, ${r.period}: ${r.bullets.join(' ')}`),
      employer.assistantNote ?? '',
    ].join(' '),
    links: [
      { label: 'Experience', href: '/experience' },
      ...employer.roles.filter((r) => r.link).map((r) => ({ label: r.link.label, href: r.link.href })),
    ],
  })
}

for (const guide of profile.assistantGuides ?? []) {
  chunks.push({ id: `guide-${guide.id}`, title: `Guide: ${guide.id.replace(/-/g, ' ')}`, keywords: guide.keywords, text: guide.text, links: [{ label: 'Projects', href: '/projects' }] })
}

chunks.push({
  id: 'education',
  title: 'Education and awards',
  keywords: ['education', 'school', 'college', 'university', 'uncc', 'unc', 'charlotte', 'gpa', 'graduate', 'graduation', 'degree', 'major', 'minor', 'junior', 'senior', 'class', 'year', 'cvcc', 'catawba', 'award', 'honors', 'masters', 'master', 'mit'],
  text: [
    ...profile.education.map((e) => `${e.institution}: ${[e.degree, e.minor ? `minor in ${e.minor}` : null, e.period, `GPA ${e.gpaDisplay}`, e.honors.join(', ')].filter(Boolean).join(', ')}. ${e.description}`),
    ...profile.awards.map((a) => `${a.name}, ${a.organization}, ${a.date}.`),
    'No graduate degree has been earned; graduate study is a stated future goal. Do not infer current class standing or age from dated writing; refer to the expected graduation date instead.',
  ].join(' '),
  links: [{ label: 'Education', href: '/education' }],
})

chunks.push({
  id: 'skills',
  title: 'Technical skills (resume)',
  keywords: ['skills', 'stack', 'tools', 'languages', 'python', 'sql', 'typescript', 'javascript', 'r', 'java', 'power', 'bi', 'dax', 'aws', 'react', 'next', 'technologies', 'tech'],
  text: `${profile.skills.rule} Programming: ${profile.skills.programming.join(', ')}. Data and ML: ${profile.skills.dataAndML.join(', ')}. Analytics and BI: ${profile.skills.analytics.join(', ')}. AI: ${profile.skills.ai.join(', ')}. Web: ${profile.skills.web.join(', ')}. Cloud and data: ${profile.skills.cloudAndData.join(', ')}. Tools: ${profile.skills.tools.join(', ')}.`,
  links: [{ label: 'Projects', href: '/projects' }],
})

chunks.push({
  id: 'contact',
  title: 'Contact',
  keywords: ['contact', 'email', 'reach', 'hire', 'hiring', 'linkedin', 'github', 'connect', 'message', 'talk', 'recruit', 'interview'],
  text: `Email ${profile.contact.email}; LinkedIn ${profile.contact.linkedin}; GitHub ${profile.contact.github}; website ${profile.contact.website}. The assistant cannot send messages, schedule meetings, or make commitments on Davis's behalf.`,
  links: [
    { label: 'Contact', href: '/contact' },
    { label: 'LinkedIn', href: profile.contact.linkedin },
  ],
})

for (const project of projects) {
  const links = [{ label: `${project.title} case study`, href: `/projects/${project.slug}` }, ...project.links.filter((l) => l.kind !== 'internal').map((l) => ({ label: `${project.title}: ${l.label}`, href: l.href }))]
  chunks.push({
    id: `project-${project.slug}`,
    title: `${project.title} (project)`,
    slug: project.slug,
    keywords: [project.title, project.slug, ...project.categories.map(label), ...project.stack, project.status, project.assistantNote ?? ''].join(' ').toLowerCase().split(/[^a-z0-9&+.#]+/).filter(Boolean),
    text: [
      `${project.title} [${project.categories.map(label).join(', ')}; ${project.status}${project.period ? `; ${project.period}` : ''}]: ${project.tagline}`,
      `Davis's role: ${project.role}${project.team ? ` Team: ${project.team}` : ''}`,
      `Problem: ${sentence(project.problem)}`,
      `What was built: ${sentence(project.solution)} ${sentence(project.solutionPoints)}`,
      `Architecture: ${project.architecture.summary} Flow: ${project.architecture.flow.join(' → ')}.`,
      `Key decisions: ${project.decisions.map((d) => `${d.title} ${d.text}`).join(' ')}`,
      project.metrics?.length ? `Evidence: ${project.metrics.map((m) => `${m.label}: ${m.value}${m.context ? ` (${m.context})` : ''}`).join('; ')}.` : '',
      `Outcomes: ${sentence(project.outcomes)}`,
      project.limits?.length ? `Scope and limits: ${sentence(project.limits)}` : '',
      `Technology: ${project.stack.join(', ')}.`,
      project.links.some((l) => l.kind === 'showcase') ? 'The GitHub link is a public showcase repository, not necessarily the full application source.' : '',
      project.assistantNote ?? '',
    ].filter(Boolean).join(' '),
    links,
  })
}

for (const note of notesIndex) {
  chunks.push({
    id: `note-${note.slug}`,
    title: `${note.title} (professional note)`,
    keywords: [note.title, note.slug, note.category, 'note', 'notes', 'writing', 'article', 'read', 'wrote'].join(' ').toLowerCase().split(/[^a-z0-9&+.]+/).filter(Boolean),
    text: `Professional note "${note.title}" (${note.category}, ${note.dateLabel}, ${note.readTime}). Excerpt: ${note.excerpt} Read it on this portfolio at /writing/${note.slug}; the original is at ${note.sourceUrl}. Notes are dated writing; their historical details (such as the Propify name, class standing, or age) are not the current profile.`,
    links: [{ label: note.title, href: `/writing/${note.slug}` }],
  })
}

const excluded = noteManifest.notes.filter((n) => !n.included).map((n) => n.title)
chunks.push({
  id: 'writing-overview',
  title: 'Writing section',
  keywords: ['writing', 'notes', 'articles', 'blog', 'read', 'curated', 'professional', 'essays'],
  text: `The Writing section reproduces 16 of the 19 notes published on Curated Notes (${NOTES_SITE}), chosen for professional, technical, business, and career relevance. Three personal notes (${excluded.join('; ')}) remain on the original site.`,
  links: [
    { label: 'Writing', href: '/writing' },
    { label: 'Curated Notes', href: NOTES_SITE },
  ],
})

const knowledge = {
  reviewedAt: profile.reviewedAt,
  siteUrl: SITE_URL,
  projectSlugs: [...slugs],
  noteSlugs: [...noteBySlug.keys()],
  chunks,
}
write(
  'server/knowledge.generated.js',
  `// Generated by scripts/build-content.mjs from content/. Do not edit by hand.\n// Server-only: imported by api/chat.js, never by the client bundle.\n/* eslint-disable */\nexport default ${JSON.stringify(knowledge, null, 2)}\n`,
)

write('src/generated/projects-index.json', projectsIndex)
write('src/generated/notes-index.json', notesIndex)
write('src/generated/profile.json', publicProfile)
write('src/generated/routes.json', routes)
write('src/generated/categories.json', CATEGORIES)
write('src/generated/site-meta.json', { reviewedAt: profile.reviewedAt })

if (errors.length) {
  console.error(`Content validation failed (${errors.length}):\n- ${errors.join('\n- ')}`)
  process.exit(1)
}
console.log(`content: ${projects.length} projects, ${notesIndex.length} notes, ${routes.length} routes, ${chunks.length} knowledge chunks`)
