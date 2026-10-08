import { describe, expect, it } from 'vitest'
import { escapeHtml } from './escapeHtml'

describe('escapeHtml', () => {
  it('escapes tags, quotes and ampersands', () => {
    expect(escapeHtml(`<script>alert("x") & 'y'</script>`)).toBe(
      '&lt;script&gt;alert(&quot;x&quot;) &amp; &#39;y&#39;&lt;/script&gt;',
    )
  })

  it('leaves plain text untouched', () => {
    expect(escapeHtml('Jan de Vries')).toBe('Jan de Vries')
  })
})
