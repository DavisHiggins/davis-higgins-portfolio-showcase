import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { m } from 'framer-motion'
import projectsIndex from '../generated/projects-index.json'
import { CATEGORIES, categoryCounts, categoryLabel, filterProjects, parseCategory } from '../lib/categories'
import { useEntrancesEnabled, usePageEntrance } from '../lib/motion'
import { PageShell, SectionHeader } from '../components/ui'
import { ResponsiveImage } from '../components/ResponsiveImage'
import type { CategoryId, ProjectIndexItem } from '../lib/types'

const PROJECTS = projectsIndex as ProjectIndexItem[]
const COUNTS = categoryCounts(PROJECTS)
const CARD_SIZES = '(min-width: 1280px) 384px, (min-width: 1024px) calc((100vw - 144px) / 3), (min-width: 640px) calc((100vw - 88px) / 2), calc(100vw - 32px)'

function FilterButton({ label, count, pressed, onSelect }: { label: string; count: number; pressed: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onSelect}
      className={`inline-flex min-h-[44px] items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
        pressed ? 'border-white bg-white text-slate-950' : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/10 hover:text-white'
      }`}
    >
      {label}
      <span className={`text-xs tabular-nums ${pressed ? 'text-slate-600' : 'text-slate-400'}`}>{count}</span>
    </button>
  )
}

function ProjectCard({ project, index, search }: { project: ProjectIndexItem; index: number; search: string }) {
  const primaryCategory = project.categories[0]
  return (
    <li>
      <Link
        to={`/projects/${project.slug}`}
        state={{ fromGallery: true, search }}
        className="project-card group block rounded-[1.4rem] outline-none"
      >
        <div className="relative aspect-[16/9] overflow-hidden rounded-[1.25rem] border border-white/10 bg-panel shadow-soft transition duration-200 group-hover:border-sky-300/40 group-focus-visible:border-sky-300/60">
          {project.cover ? (
            <ResponsiveImage
              image={project.cover}
              sizes={CARD_SIZES}
              priority={index === 0}
              eager={index < 3}
              decorative
              className="h-full w-full transition-transform duration-[250ms] ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
          ) : null}
        </div>
        <div className="px-1 pt-3.5">
          <h2 className="text-lg font-semibold leading-snug text-white transition-colors duration-200 group-hover:text-sky-200">{project.title}</h2>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-sky-300/80">
            {categoryLabel(primaryCategory)} <span className="text-slate-500">·</span> <span className="text-slate-400">{project.status}</span>
          </p>
          <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-slate-400">{project.summary}</p>
        </div>
      </Link>
    </li>
  )
}

export function Component() {
  const entrance = usePageEntrance()
  const animate = useEntrancesEnabled()
  const [params, setParams] = useSearchParams()
  const category = parseCategory(params.get('category'))
  const visible = useMemo(() => filterProjects(PROJECTS, category), [category])
  const search = category ? `?category=${category}` : ''

  const select = (next: CategoryId | null) => {
    if (next === category) return
    setParams(next ? { category: next } : {}, { preventScrollReset: true })
  }

  return (
    <m.div {...entrance}>
      <PageShell className="!pt-8 sm:!pt-10">
        <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="[&>div]:mb-0">
            <SectionHeader eyebrow="PRODUCTS → ANALYTICAL SOLUTIONS" title="Projects" subtitle="Selected work across data, AI, software, and the web." />
          </div>
        </div>

        <div className="sticky-filter mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div role="group" aria-label="Filter projects by category" className="flex flex-wrap gap-2">
            <FilterButton label="All" count={COUNTS.all} pressed={category === null} onSelect={() => select(null)} />
            {CATEGORIES.map((c) => (
              <FilterButton key={c.id} label={c.label} count={COUNTS[c.id]} pressed={category === c.id} onSelect={() => select(c.id)} />
            ))}
          </div>
          <p className="shrink-0 text-sm text-slate-400" aria-live="polite" aria-atomic="true">
            {category ? `${visible.length} of ${PROJECTS.length} projects in ${categoryLabel(category)}` : `${PROJECTS.length} projects`}
          </p>
        </div>

        <m.ul
          key={category ?? 'all'}
          initial={animate ? { opacity: 0, y: 6 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.16, ease: 'easeOut' }}
          className="grid gap-x-6 gap-y-9 sm:grid-cols-2 lg:grid-cols-3"
        >
          {visible.map((project, index) => (
            <ProjectCard key={project.slug} project={project} index={index} search={search} />
          ))}
        </m.ul>
      </PageShell>
    </m.div>
  )
}
