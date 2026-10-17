// Shapes of the generated content projections (scripts/build-content.mjs).

export type CategoryId = 'data-ml' | 'ai-automation' | 'web-commerce' | 'software-tools' | 'research-community'

export interface Category {
  id: CategoryId
  label: string
}

export interface ImageAsset {
  src: string
  avif: string
  webp: string
  width: number
  height: number
  alt: string
  caption: string | null
  credit: string | null
  position: string
  kind: 'art' | 'screen' | 'artifact' | 'illustrative' | 'diagram'
}

export interface ProjectIndexItem {
  slug: string
  title: string
  summary: string
  categories: CategoryId[]
  status: string
  sortOrder: number
  cover: ImageAsset | null
}

export type ProjectLinkKind =
  | 'website'
  | 'showcase'
  | 'source'
  | 'paper'
  | 'employer'
  | 'model-card'
  | 'dashboard'
  | 'preview'
  | 'methodology'
  | 'internal'

export interface ProjectLink {
  label: string
  href: string
  kind: ProjectLinkKind
}

export interface Metric {
  value: string
  label: string
  context?: string
}

export interface TitledText {
  title: string
  text: string
}

export interface ProjectDetail {
  slug: string
  title: string
  categories: CategoryId[]
  status: string
  period: string | null
  summary: string
  tagline: string
  role: string
  team: string | null
  stack: string[]
  links: ProjectLink[]
  metrics: Metric[]
  problem: string[]
  contribution: string[]
  solution: string[]
  solutionPoints: string[]
  architecture: { summary: string; flow: string[]; layers?: { label: string; text: string }[] }
  decisions: TitledText[]
  tradeoffs: TitledText[]
  outcomes: string[]
  limits: string[]
  lessons: string
  hero: ImageAsset | null
  detailImage: ImageAsset | null
  ogImage: string | null
  relatedNotes: { slug: string; title: string; category: string; dateLabel: string; readTime: string }[]
  related: { slug: string; title: string; summary: string; status: string; cover: ImageAsset | null }[]
}

export interface NoteIndexItem {
  slug: string
  title: string
  category: string
  dateLabel: string
  readTime: string
  excerpt: string
  sourceUrl: string
  relatedProject: { href: string; label: string } | null
}

export interface RouteMetaRecord {
  path: string
  kind: 'page' | 'project' | 'note'
  title: string
  description: string
  canonical: string
  image: string
  type: string
}

export interface Role {
  period: string
  title: string
  detail?: string
  bullets: string[]
  link?: { label: string; href: string }
}

export interface Employer {
  id: string
  company: string
  logo: string
  website?: string
  subtitle?: string
  accent?: string
  current: boolean
  roles: Role[]
}

export interface Profile {
  reviewedAt: string
  identity: { name: string; location: string; headline: string }
  education: {
    id: string
    institution: string
    degree?: string
    minor?: string
    period: string
    expectedGraduation?: string
    gpaDisplay: string
    honors: string[]
    description: string
  }[]
  awards: { name: string; organization: string; date: string; description: string }[]
  experience: Employer[]
  contact: {
    email: string
    linkedin: string
    github: string
    website: string
    company: string
    notes: string
    resume: string
    instagram: string
  }
}
