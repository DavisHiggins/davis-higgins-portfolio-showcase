import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { renderReply } from '../../src/assistant/renderReply'

const html = (text: string) => renderToStaticMarkup(createElement(MemoryRouter, null, renderReply(text)))

describe('assistant reply rendering', () => {
  it('renders links nested inside bold text', () => {
    const out = html('- **[SecondChance](/projects/secondchance)** - team project')
    expect(out).toContain('<strong><a class="di-link" href="/projects/secondchance">SecondChance</a></strong>')
    expect(out).not.toContain('[SecondChance]')
  })

  it('never renders raw HTML or unsafe links', () => {
    const out = html('Hi <img src=x onerror=alert(1)> [x](javascript:alert(1)) <script>alert(1)</script>')
    expect(out).not.toMatch(/<img|<script|href="javascript/i)
  })

  it('renders paragraphs and lists', () => {
    const out = html('First paragraph.\n\n- one\n- two')
    expect(out).toContain('<p>First paragraph.</p>')
    expect(out).toContain('<ul class="di-list"><li>one</li><li>two</li></ul>')
  })
})
