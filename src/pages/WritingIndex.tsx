import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { m } from 'framer-motion'
import { ArrowRight, ExternalLink } from 'lucide-react'
import notesIndex from '../generated/notes-index.json'
import { NOTE_CATEGORIES } from '../lib/categories'
import { NOTES_SITE } from '../lib/site'
import { useEntrancesEnabled, usePageEntrance } from '../lib/motion'
import { PageShell, SectionHeader } from '../components/ui'
import type { NoteIndexItem } from '../lib/types'

const NOTES = notesIndex as NoteIndexItem[]

function parseNoteCategory(value: string | null): string | null {
  return value && (NOTE_CATEGORIES as readonly string[]).includes(value) ? value : null
}

export function Component() {
  const entrance = usePageEntrance()
  const animate = useEntrancesEnabled()
  const [params, setParams] = useSearchParams()
  const category = parseNoteCategory(params.get('category'))
  const visible = useMemo(() => (category ? NOTES.filter((n) => n.category === category) : NOTES), [category])
  const from = encodeURIComponent(category ?? 'all')

  return (
    <m.div {...entrance}>
      <PageShell className="!pt-8 sm:!pt-10">
        <SectionHeader eyebrow="NOTES → PERSPECTIVE" title="Writing" subtitle="Notes on building products, working with data, and growing through the work.">
          <p className="mt-3 text-sm leading-7 text-slate-400 sm:text-base">
            More notes on projects, life, and faith are available at{' '}
            <a href={NOTES_SITE} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-sky-300 underline-offset-4 transition hover:text-sky-200 hover:underline">
              Curated Notes
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
            .
          </p>
        </SectionHeader>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div role="group" aria-label="Filter writing by category" className="flex flex-wrap gap-2">
            {[null, ...NOTE_CATEGORIES].map((c) => {
              const pressed = category === c
              const count = c ? NOTES.filter((n) => n.category === c).length : NOTES.length
              return (
                <button
                  key={c ?? 'all'}
                  type="button"
                  aria-pressed={pressed}
                  onClick={() => setParams(c ? { category: c } : {}, { preventScrollReset: true })}
                  className={`inline-flex min-h-[44px] items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
                    pressed ? 'border-white bg-white text-slate-950' : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {c ?? 'All'}
                  <span className={`text-xs tabular-nums ${pressed ? 'text-slate-600' : 'text-slate-400'}`}>{count}</span>
                </button>
              )
            })}
          </div>
          <p className="shrink-0 text-sm text-slate-400" aria-live="polite" aria-atomic="true">
            {visible.length} {visible.length === 1 ? 'note' : 'notes'}
          </p>
        </div>

        <m.ul
          key={category ?? 'all'}
          initial={animate ? { opacity: 0, y: 6 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.16, ease: 'easeOut' }}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {visible.map((note) => (
            <li key={note.slug}>
              <Link
                to={`/writing/${note.slug}?from=${from}`}
                className="glass group flex h-full flex-col rounded-[1.6rem] p-5 shadow-soft transition duration-200 hover:-translate-y-0.5 hover:border-sky-300/30 motion-reduce:hover:translate-y-0 sm:p-6"
              >
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-400">
                  <span className="rounded-full border border-sky-300/20 bg-sky-400/10 px-2.5 py-0.5 font-semibold uppercase tracking-[0.14em] text-sky-200">{note.category}</span>
                  <span>{note.dateLabel}</span>
                  <span aria-hidden="true">·</span>
                  <span>{note.readTime}</span>
                </div>
                <h2 className="mt-4 text-lg font-semibold leading-snug text-white transition-colors group-hover:text-sky-200">{note.title}</h2>
                <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-slate-400">{note.excerpt}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-sky-300">
                  Read note
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden="true" />
                </span>
              </Link>
            </li>
          ))}
        </m.ul>
      </PageShell>
    </m.div>
  )
}
