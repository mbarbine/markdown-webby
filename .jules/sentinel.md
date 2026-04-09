## YYYY-MM-DD - JSON-LD XSS Prevention
**Vulnerability:** XSS vulnerability in `JsonLd` component. When embedding JSON-LD schemas, `JSON.stringify` does not escape `<` and `>` characters by default. If untrusted data is included, an attacker could break out of the script tag (e.g., `</script><script>alert(1)</script>`).
**Learning:** `dangerouslySetInnerHTML` on script tags with `JSON.stringify` requires escaping HTML characters, particularly `<`.
**Prevention:** Replace `<` with `\u003c` or use a dedicated serialization library like `serialize-javascript` when interpolating JSON directly inside a script tag.

## 2025-02-23 - Custom Markdown Renderer XSS Prevention
**Vulnerability:** XSS vulnerabilities in the custom markdown renderer (`components/editor/markdown-preview.tsx`). Without sanitization, image `src`, link `href`, and `alt` tags could break out of their attribute quotes or execute dangerous protocols (`javascript:`, `data:text/html`).
**Learning:** Custom markdown-to-HTML regex-based renderers easily miss attribute breakouts if inputs containing quotes aren't specifically escaped.
**Prevention:** Created a `sanitizeAttribute` helper to always escape quotes (`"` -> `&quot;`, `'` -> `&#39;`) and strictly block dangerous URI schemes before building the HTML string.
