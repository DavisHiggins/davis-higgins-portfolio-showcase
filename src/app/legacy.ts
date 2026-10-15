import projectsIndex from '../generated/projects-index.json'
import { slugify } from '../components/SectionNav'

// The previous single-page portfolio generated in-page anchors from titles:
// proj-<title>, exp-<company>, edu-<section>, impact-<story>. When an old link with
// one of those hashes lands on the home page, route it once to its new address.
const TITLE_TO_SLUG = new Map<string, string>(projectsIndex.map((p) => [slugify(p.title), p.slug]))
// The old "Davis Intelligence" card is now the AI Workflow System case study.
TITLE_TO_SLUG.set('davis-intelligence', 'ai-workflow-system')

export function legacyHashTarget(pathname: string, hash: string): string | null {
  if (pathname !== '/' || !hash) return null
  const id = decodeURIComponent(hash.slice(1))
  if (id.startsWith('proj-')) {
    const slug = TITLE_TO_SLUG.get(id.slice(5))
    return slug ? `/projects/${slug}` : '/projects'
  }
  if (id.startsWith('exp-')) return `/experience#${id}`
  if (id.startsWith('edu-')) return `/education#${id}`
  if (id.startsWith('impact-')) return '/writing'
  if (id.startsWith('skills-')) return '/experience'
  return null
}
