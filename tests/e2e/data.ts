import fs from 'node:fs'
import path from 'node:path'

// Generated content read from disk (Playwright's ESM loader does not import JSON).
const read = <T>(file: string): T => JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src/generated', file), 'utf8')) as T

export const notesIndex = read<{ slug: string; title: string; category: string; dateLabel: string; readTime: string; sourceUrl: string; relatedProject: { href: string; label: string } | null }[]>('notes-index.json')
export const projectsIndex = read<{ slug: string; title: string }[]>('projects-index.json')
