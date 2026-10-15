import { Link, useLoaderData, useSearchParams } from 'react-router-dom'
import type { LoaderFunctionArgs } from 'react-router-dom'
import { m, useScroll, useSpring } from 'framer-motion'
import notesIndex from '../generated/notes-index.json'
import { NOTE_CATEGORIES, NOTE_TAG_STYLES } from '../lib/categories'
import { useEntrancesEnabled } from '../lib/motion'
import type { NoteIndexItem } from '../lib/types'

const NOTES = notesIndex as NoteIndexItem[]
const bodies = import.meta.glob<string>('../generated/notes/*.html', { query: '?raw', import: 'default' })

interface NoteData {
  note: NoteIndexItem
  html: string
}

// Bodies are reviewed static HTML validated against a tag/attribute allowlist at
// build time (scripts/build-content.mjs); nothing is fetched from a remote source.
export async function loader({ params }: LoaderFunctionArgs): Promise<NoteData> {
  const slug = params.slug ?? ''
  const note = NOTES.find((n) => n.slug === slug)
  const load = note ? bodies[`../generated/notes/${slug}.html`] : undefined
  if (!note || !load) throw new Response('Note not found', { status: 404 })
  return { note, html: await load() }
}

/** Reading progress bar from the Curated Notes source (components/ReadingProgress). */
function ReadingProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })
  return <m.div className="reader-progress" style={{ scaleX }} aria-hidden="true" />
}

/** Previous/next within the section the reader came from, as in the source NoteNav. */
function NoteNav({ slug, from }: { slug: string; from: string }) {
  let list = from === 'all' ? NOTES : NOTES.filter((n) => n.category === from)
  let idx = list.findIndex((n) => n.slug === slug)
  if (idx === -1) {
    list = NOTES
    idx = NOTES.findIndex((n) => n.slug === slug)
  }
  const prev = idx > 0 ? list[idx - 1] : null
  const next = idx >= 0 && idx < list.length - 1 ? list[idx + 1] : null
  const fromQ = `?from=${encodeURIComponent(from)}`
  const stack = Boolean(prev && next)

  return (
    <nav className={`reader-nav ${stack ? 'reader-nav--stack' : ''}`} aria-label="Note navigation">
      <div className="reader-nav__slot">
        {prev ? (
          <Link to={`/writing/${prev.slug}${fromQ}`} className={`note-nav-btn ${stack ? 'note-nav-btn--stacked' : ''}`}>
            <span aria-hidden="true" className="reader-nav__arrow reader-nav__arrow--left">
              ←
            </span>
            <span className="flex min-w-0 flex-col text-left">
              <span className="reader-nav__label">Previous</span>
              <span className="reader-nav__title">{prev.title}</span>
            </span>
          </Link>
        ) : null}
      </div>
      <div className="reader-nav__slot reader-nav__slot--end">
        {next ? (
          <Link to={`/writing/${next.slug}${fromQ}`} className={`note-nav-btn ${stack ? 'note-nav-btn--stacked' : ''}`}>
            <span className="flex min-w-0 flex-col text-right">
              <span className="reader-nav__label">Next Note</span>
              <span className="reader-nav__title">{next.title}</span>
            </span>
            <span aria-hidden="true" className="reader-nav__arrow reader-nav__arrow--right">
              →
            </span>
          </Link>
        ) : (
          <Link to={`/writing${from !== 'all' ? `?category=${encodeURIComponent(from)}` : ''}`} className="note-nav-btn">
            <span className="reader-nav__label reader-nav__label--return">Return</span>
            <span aria-hidden="true" className="reader-nav__arrow reader-nav__arrow--up">
              ↑
            </span>
          </Link>
        )}
      </div>
    </nav>
  )
}

export function Component() {
  const { note, html } = useLoaderData() as NoteData
  const [params] = useSearchParams()
  const fromParam = params.get('from')
  const from = fromParam && (NOTE_CATEGORIES as readonly string[]).includes(fromParam) ? fromParam : 'all'
  const animate = useEntrancesEnabled()
  const tag = NOTE_TAG_STYLES[note.category] ?? NOTE_TAG_STYLES.Projects
  const backTo = `/writing${from !== 'all' ? `?category=${encodeURIComponent(from)}` : ''}`

  return (
    <div className="reader-shell">
      <ReadingProgress />
      <m.article
        key={note.slug}
        className="note-reader"
        initial={animate ? { opacity: 0, y: 14 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="reader-back-row">
          <Link to={backTo} className="reader-back group">
            <span aria-hidden="true" className="reader-back__arrow">
              ←
            </span>
            <span className="reader-back__text">Back</span>
            <span className="sr-only"> to Writing</span>
          </Link>
        </div>

        <div>
          <div className="reader-meta">
            <span className="reader-category" style={{ color: tag.text, background: tag.bg }}>
              {note.category}
            </span>
            <span>{note.dateLabel}</span>
            <span className="reader-meta__dot" aria-hidden="true">
              ·
            </span>
            <span>{note.readTime}</span>
          </div>
          <h1 tabIndex={-1} data-page-heading className="reader-title">
            {note.title}
          </h1>
          <hr className="reader-divider" />
        </div>

        <div>
          <div className="reader-prose" dangerouslySetInnerHTML={{ __html: html }} />

          {note.relatedProject ? (
            <div className="reader-related">
              <p className="reader-related__label">Related Project</p>
              <a href={note.relatedProject.href} target="_blank" rel="noopener noreferrer" className="reader-related__link">
                <span>{note.relatedProject.label}</span>
                <span aria-hidden="true" className="reader-related__arrow">
                  →
                </span>
              </a>
            </div>
          ) : null}
        </div>

        <NoteNav slug={note.slug} from={from} />
      </m.article>
    </div>
  )
}
