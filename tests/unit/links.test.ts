import { describe, expect, it } from 'vitest'
import { classifyLink } from '../../src/assistant/renderReply'

describe('assistant link allowlist', () => {
  it('allows known local routes and documents', () => {
    expect(classifyLink('/projects/flowcast')).toEqual({ kind: 'internal', to: '/projects/flowcast' })
    expect(classifyLink('/writing/kewaunee-dashboards')).toMatchObject({ kind: 'internal' })
    expect(classifyLink('/davis-resume.pdf')).toMatchObject({ kind: 'internal' })
    expect(classifyLink('/experience')).toMatchObject({ kind: 'internal' })
    expect(classifyLink('https://portfolio.davishiggins.com/projects/cade')).toEqual({ kind: 'internal', to: '/projects/cade' })
  })

  it('allows verified public destinations over https', () => {
    expect(classifyLink('https://flowcastweb.vercel.app/model')).toMatchObject({ kind: 'external' })
    expect(classifyLink('https://notes.davishiggins.com/notes/building-cade')).toMatchObject({ kind: 'external' })
    expect(classifyLink('higginsd.com')).toMatchObject({ kind: 'external', href: 'https://higginsd.com/' })
    expect(classifyLink('https://github.com/DavisHiggins/Flowcast')).toMatchObject({ kind: 'external' })
    expect(classifyLink('https://charlottephidelt.com')).toMatchObject({ kind: 'external' })
    expect(classifyLink('/writing/contender-breakdown')).toMatchObject({ kind: 'internal' })
  })

  it('blocks unsafe schemes, unknown hosts, and unknown local paths', () => {
    expect(classifyLink('javascript:alert(1)')).toBeNull()
    expect(classifyLink('data:text/html,<script>')).toBeNull()
    expect(classifyLink('http://davishiggins.com')).toBeNull()
    expect(classifyLink('https://evil.example.com')).toBeNull()
    expect(classifyLink('https://davishiggins.com.evil.example')).toBeNull()
    expect(classifyLink('https://github.com/someone-else/repo')).toBeNull()
    expect(classifyLink('/admin')).toBeNull()
    expect(classifyLink('/projects/y-not')).toBeNull()
    expect(classifyLink('/projects/one-chaptr')).toBeNull()
    expect(classifyLink('/writing/propify-breakdown')).toBeNull()
    expect(classifyLink('https://chaplain.davishiggins.com')).toBeNull()
    expect(classifyLink('https://propifyai.davishiggins.com')).toBeNull()
    expect(classifyLink('//evil.example')).toBeNull()
  })
})
