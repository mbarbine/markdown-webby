import React from 'react'
import { render } from '@testing-library/react'
import { MarkdownPreview } from '@/components/editor/markdown-preview'
import { useMarkdown } from '@/lib/store/use-markdown'

// Mock the store
jest.mock('@/lib/store/use-markdown', () => ({
  useMarkdown: jest.fn(),
}))

describe('MarkdownPreview XSS Prevention', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('escapes quotes and dangerous protocols in image URLs', () => {
    (useMarkdown as unknown as jest.Mock).mockImplementation((selector) => {
      const state = { content: '![alt](" onerror="alert(1))' }
      return selector(state)
    })

    const { container } = render(<MarkdownPreview />)
    const img = container.querySelector('img')
    expect(img).not.toBeNull()
    // In jsdom environment, getAttribute('src') decodes entities, so we expect the decoded value or we check outerHTML
    expect(img?.outerHTML).toContain('src="&quot; onerror=&quot;alert(1"')
  })

  it('blocks javascript: URLs in links', () => {
    (useMarkdown as unknown as jest.Mock).mockImplementation((selector) => {
      const state = { content: '[link](javascript:alert(1))' }
      return selector(state)
    })

    const { container } = render(<MarkdownPreview />)
    const link = container.querySelector('a')
    expect(link).not.toBeNull()
    expect(link?.getAttribute('href')).toBe('#')
  })

  it('allows data:image URLs in images', () => {
    (useMarkdown as unknown as jest.Mock).mockImplementation((selector) => {
      const state = { content: '![alt](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=)' }
      return selector(state)
    })

    const { container } = render(<MarkdownPreview />)
    const img = container.querySelector('img')
    expect(img).not.toBeNull()
    expect(img?.getAttribute('src')).toContain('data:image/png')
  })

  it('blocks data: URLs in links', () => {
    (useMarkdown as unknown as jest.Mock).mockImplementation((selector) => {
      const state = { content: '[link](data:text/html,<script>alert(1)</script>)' }
      return selector(state)
    })

    const { container } = render(<MarkdownPreview />)
    const link = container.querySelector('a')
    expect(link).not.toBeNull()
    expect(link?.getAttribute('href')).toBe('#')
  })
})
