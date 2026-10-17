import { Link, useLocation } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { PageShell, SectionHeader } from '../components/ui'

export function NotFound() {
  const { pathname } = useLocation()
  const section = pathname.startsWith('/projects/') ? 'project' : pathname.startsWith('/writing/') ? 'note' : 'page'
  const primary =
    section === 'project'
      ? { to: '/projects', label: 'Browse all projects' }
      : section === 'note'
        ? { to: '/writing', label: 'Browse all writing' }
        : { to: '/', label: 'Go to the home page' }

  return (
    <PageShell>
      <SectionHeader
        eyebrow="404"
        title={section === 'page' ? 'Page not found' : `That ${section} could not be found`}
        subtitle={
          section === 'page'
            ? 'The address may be mistyped, or the page may have moved during the October 2026 update.'
            : `There is no ${section} at this address. It may have been renamed.`
        }
      />
      <div className="flex flex-wrap gap-3">
        <Link to={primary.to} className="primary-btn">
          {primary.label}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
        {section !== 'page' ? (
          <Link to="/" className="secondary-btn">
            Home
          </Link>
        ) : (
          <>
            <Link to="/projects" className="secondary-btn">
              Projects
            </Link>
            <Link to="/writing" className="secondary-btn">
              Writing
            </Link>
          </>
        )}
      </div>
    </PageShell>
  )
}
