import type { ReactNode } from 'react'
import { Link, useLoaderData, useLocation } from 'react-router-dom'
import type { LoaderFunctionArgs } from 'react-router-dom'
import { m } from 'framer-motion'
import { ArrowLeft, ArrowRight, ExternalLink, FileText, Github, Users } from 'lucide-react'
import { categoryLabel } from '../lib/categories'
import { PROJECT_LOGOS } from '../lib/logos'
import { usePageEntrance } from '../lib/motion'
import { Bullet, PageShell, Pill } from '../components/ui'
import { ResponsiveImage } from '../components/ResponsiveImage'
import { SectionNav } from '../components/SectionNav'
import type { TocSection } from '../components/SectionNav'
import type { ProjectDetail, ProjectLink } from '../lib/types'

const modules = import.meta.glob<ProjectDetail>('../generated/projects/*.json', { import: 'default' })

export async function loader({ params }: LoaderFunctionArgs): Promise<ProjectDetail> {
  const slug = params.slug ?? ''
  const load = /^[a-z0-9-]+$/.test(slug) ? modules[`../generated/projects/${slug}.json`] : undefined
  if (!load) throw new Response('Project not found', { status: 404 })
  return load()
}

const LINK_ICON: Partial<Record<ProjectLink['kind'], ReactNode>> = {
  showcase: <Github className="h-4 w-4" aria-hidden="true" />,
  source: <Github className="h-4 w-4" aria-hidden="true" />,
  paper: <FileText className="h-4 w-4" aria-hidden="true" />,
}

function ProjectLinkButton({ link, primary }: { link: ProjectLink; primary: boolean }) {
  const className = primary ? 'primary-btn' : 'secondary-btn'
  if (link.href.startsWith('/') && !link.href.endsWith('.pdf')) {
    return (
      <Link to={link.href} className={className}>
        {link.label}
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    )
  }
  return (
    <a href={link.href} target="_blank" rel="noopener noreferrer" className={className}>
      {LINK_ICON[link.kind] ?? null}
      {link.label}
      {LINK_ICON[link.kind] ? null : <ExternalLink className="h-4 w-4" aria-hidden="true" />}
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  )
}

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-28">
      <h2 id={`${id}-title`} data-reveal className="text-2xl font-semibold tracking-tight text-white">
        {title}
      </h2>
      <div data-reveal-children className="mt-4 space-y-4 text-base leading-8 text-slate-300">
        {children}
      </div>
    </section>
  )
}

function Paragraphs({ items }: { items: string[] }) {
  return (
    <>
      {items.map((text) => (
        <p key={text}>{text}</p>
      ))}
    </>
  )
}

function ArchitectureFlow({ steps }: { steps: string[] }) {
  return (
    <ol data-reveal-children className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-label="Architecture flow">
      {steps.map((step, i) => (
        <li key={step} className="relative flex items-start gap-3 rounded-2xl border border-sky-300/20 bg-[#0b1729]/80 p-4">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-sky-300/40 bg-sky-400/10 text-xs font-semibold text-sky-200" aria-hidden="true">
            {i + 1}
          </span>
          <span className="text-sm leading-6 text-slate-200">{step}</span>
        </li>
      ))}
    </ol>
  )
}

export function Component() {
  const project = useLoaderData() as ProjectDetail
  const entrance = usePageEntrance()
  const location = useLocation()
  // Return to the gallery with the visitor's filter still applied.
  const state = location.state as { search?: string } | null
  const backHref = `/projects${state?.search ?? ''}`
  const logo = PROJECT_LOGOS[project.slug]

  const toc: TocSection[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'problem', label: 'The problem' },
    { id: 'contribution', label: 'My contribution' },
    { id: 'built', label: 'What I built' },
    { id: 'how-it-works', label: 'How it works' },
    { id: 'decisions', label: 'Key decisions' },
    { id: 'outcomes', label: 'Outcomes & evidence' },
    ...(project.limits.length ? [{ id: 'limits', label: 'Scope & limits' }] : []),
    { id: 'lessons', label: 'What I learned' },
    { id: 'more', label: 'More projects' },
  ]

  return (
    <>
      {/* Sibling keys must differ: a shared key made React keep the previous
          project's article when moving between case studies. */}
      <m.article {...entrance} key={`article-${project.slug}`}>
        <PageShell reserveRail className="!pt-6 sm:!pt-8">
          <nav aria-label="Breadcrumb" className="mb-6">
            <Link to={backHref} className="inline-flex min-h-[44px] items-center gap-2 rounded-full text-sm font-medium text-slate-400 transition hover:text-sky-200">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Projects
            </Link>
          </nav>

          <header id="overview" className="scroll-mt-28">
            <div className="flex items-start justify-between gap-6">
              <div className="min-w-0 max-w-4xl">
                <div className="flex flex-wrap gap-2">
                  {project.categories.map((c) => (
                    <Link
                      key={c}
                      to={`/projects?category=${c}`}
                      className="inline-flex rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-200 transition hover:bg-white/15 sm:text-xs"
                    >
                      {categoryLabel(c)}
                    </Link>
                  ))}
                </div>
                <h1 tabIndex={-1} data-page-heading className="mt-4 break-words text-4xl font-semibold tracking-tight text-white outline-none sm:text-5xl">
                  {project.title}
                </h1>
                <p className="mt-4 text-lg leading-8 text-slate-300">{project.tagline}</p>
                <p className="mt-3 text-sm text-slate-400">
                  {project.status}
                  {project.period ? ` · ${project.period}` : ''}
                </p>
              </div>
              {logo ? (
                <img
                  src={logo.src}
                  alt=""
                  width={logo.wide ? 176 : 112}
                  height={logo.wide ? 112 : 112}
                  className={`hidden shrink-0 object-contain sm:block ${logo.wide ? 'h-24 w-44' : 'h-24 w-24'}`}
                />
              ) : null}
            </div>

            <div className="mt-6 grid gap-3 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 sm:grid-cols-[auto_1fr] sm:gap-x-6">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">My role</div>
              <p className="text-sm leading-7 text-slate-200">{project.role}</p>
              {project.team ? (
                <>
                  <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">
                    <Users className="h-3.5 w-3.5" aria-hidden="true" /> Team
                  </div>
                  <p className="text-sm leading-7 text-slate-200">{project.team}</p>
                </>
              ) : null}
            </div>

            {project.links.length ? (
              <div className="mt-6 flex flex-wrap gap-3">
                {project.links.map((link, i) => (
                  <ProjectLinkButton key={link.href} link={link} primary={i === 0} />
                ))}
              </div>
            ) : null}
          </header>

          {project.hero ? (
            <figure className="mt-8 overflow-hidden rounded-[1.75rem] border border-white/10 bg-panel shadow-glow">
              <ResponsiveImage image={project.hero} sizes="(min-width: 1280px) 1184px, calc(100vw - 32px)" priority className="aspect-[16/9] h-auto w-full" />
            </figure>
          ) : null}

          {project.metrics.length ? (
            <dl data-reveal-children className={`mt-8 grid gap-4 ${project.metrics.length >= 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>
              {project.metrics.map((metric, i) => (
                <div key={metric.label} className={`rounded-2xl border p-5 ${i === 0 ? 'border-sky-300/30 bg-sky-400/10' : 'border-white/10 bg-white/[0.03]'}`}>
                  <dt className="sr-only">{metric.label}</dt>
                  <dd>
                    <span className="block text-3xl font-bold text-white">{metric.value}</span>
                    <span className="mt-1 block text-sm font-medium text-slate-200" aria-hidden="true">
                      {metric.label}
                    </span>
                    {metric.context ? <span className="mt-1 block text-xs leading-5 text-slate-400">{metric.context}</span> : null}
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}

          <div className="mt-12 max-w-4xl space-y-12">
            <Section id="problem" title="The problem">
              <Paragraphs items={project.problem} />
            </Section>

            <Section id="contribution" title="My contribution">
              <Paragraphs items={project.contribution} />
            </Section>

            <Section id="built" title="What I built">
              <Paragraphs items={project.solution} />
              {project.solutionPoints.length ? (
                <ul data-reveal-children className="space-y-3 text-[15px] leading-7">
                  {project.solutionPoints.map((point) => (
                    <Bullet key={point}>{point}</Bullet>
                  ))}
                </ul>
              ) : null}
            </Section>

            <Section id="how-it-works" title="How it works">
              <p>{project.architecture.summary}</p>
              <ArchitectureFlow steps={project.architecture.flow} />
              {project.architecture.layers?.length ? (
                <div data-reveal-children className="mt-2 grid gap-3 sm:grid-cols-2">
                  {project.architecture.layers.map((layer) => (
                    <div key={layer.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">{layer.label}</div>
                      <p className="mt-2 text-sm leading-6 text-slate-300">{layer.text}</p>
                    </div>
                  ))}
                </div>
              ) : null}
            </Section>
          </div>

          {project.detailImage ? (
            <figure data-reveal className="mt-12 max-w-5xl">
              <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-panel shadow-soft">
                <ResponsiveImage
                  image={project.detailImage}
                  sizes="(min-width: 1280px) 1024px, calc(100vw - 32px)"
                  fit="contain"
                  className="h-auto w-full"
                />
              </div>
              {project.detailImage.caption ? (
                <figcaption className="mt-3 text-sm leading-6 text-slate-400">
                  {project.detailImage.caption}
                  {project.detailImage.credit ? <span className="text-slate-500"> {project.detailImage.credit}.</span> : null}
                </figcaption>
              ) : null}
            </figure>
          ) : null}

          <div className="mt-12 max-w-4xl space-y-12">
            <Section id="decisions" title="Key decisions">
              <div data-reveal-children className="grid gap-4">
                {project.decisions.map((d) => (
                  <div key={d.title} className="glass rounded-[1.5rem] p-5">
                    <h3 className="text-base font-semibold text-white">{d.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-300">{d.text}</p>
                  </div>
                ))}
              </div>
              {project.tradeoffs.length ? (
                <div data-reveal-children className="mt-6 space-y-3 text-sm leading-7">
                  <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">Tradeoffs</h3>
                  {project.tradeoffs.map((t) => (
                    <p key={t.title}>
                      <span className="font-semibold text-white">{t.title}:</span> {t.text}
                    </p>
                  ))}
                </div>
              ) : null}
            </Section>

            <Section id="outcomes" title="Outcomes & evidence">
              <Paragraphs items={project.outcomes} />
            </Section>

            {project.limits.length ? (
              <Section id="limits" title="Scope & limits">
                <Paragraphs items={project.limits} />
              </Section>
            ) : null}

            <Section id="lessons" title="What I learned">
              <p>{project.lessons}</p>
            </Section>

            <section data-reveal aria-labelledby="stack-title">
              <h2 id="stack-title" className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Built with
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.stack.map((item) => (
                  <Pill key={item}>{item}</Pill>
                ))}
              </div>
            </section>

            {project.relatedNotes.length ? (
              <section aria-labelledby="related-writing-title">
                <h2 id="related-writing-title" data-reveal className="text-xl font-semibold text-white">
                  Related writing
                </h2>
                <ul data-reveal-children className="mt-4 grid gap-3 sm:grid-cols-2">
                  {project.relatedNotes.map((note) => (
                    <li key={note.slug}>
                      <Link to={`/writing/${note.slug}`} className="glass block h-full rounded-[1.25rem] p-4 transition hover:border-sky-300/30">
                        <span className="text-xs uppercase tracking-[0.16em] text-slate-400">
                          {note.category} · {note.dateLabel}
                        </span>
                        <span className="mt-1 block text-sm font-semibold leading-6 text-white">{note.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>

          <section id="more" aria-labelledby="more-title" className="mt-16 scroll-mt-28 border-t border-white/10 pt-10">
            <h2 id="more-title" data-reveal className="text-2xl font-semibold tracking-tight text-white">
              More projects
            </h2>
            <ul data-reveal-children className="mt-6 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
              {project.related.map((other) => (
                <li key={other.slug}>
                  <Link to={`/projects/${other.slug}`} className="project-card group block rounded-[1.4rem] outline-none">
                    <div className="aspect-[16/9] overflow-hidden rounded-[1.25rem] border border-white/10 bg-panel transition duration-200 group-hover:border-sky-300/40">
                      {other.cover ? (
                        <ResponsiveImage
                          image={other.cover}
                          sizes="(min-width: 1280px) 384px, (min-width: 640px) 45vw, calc(100vw - 32px)"
                          decorative
                          className="h-full w-full transition-transform duration-[250ms] group-hover:scale-[1.03] motion-reduce:group-hover:scale-100"
                        />
                      ) : null}
                    </div>
                    <h3 className="mt-3.5 px-1 text-lg font-semibold text-white transition-colors group-hover:text-sky-200">{other.title}</h3>
                    <p className="mt-1 line-clamp-2 px-1 text-sm leading-6 text-slate-400">{other.summary}</p>
                  </Link>
                </li>
              ))}
            </ul>
            <Link to={backHref} data-reveal className="secondary-btn mt-10">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              All projects
            </Link>
          </section>
        </PageShell>
      </m.article>
      <SectionNav key={`toc-${project.slug}`} sections={toc} />
    </>
  )
}
