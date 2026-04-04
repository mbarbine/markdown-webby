## YYYY-MM-DD - JSON-LD XSS Prevention
**Vulnerability:** XSS vulnerability in `JsonLd` component. When embedding JSON-LD schemas, `JSON.stringify` does not escape `<` and `>` characters by default. If untrusted data is included, an attacker could break out of the script tag (e.g., `</script><script>alert(1)</script>`).
**Learning:** `dangerouslySetInnerHTML` on script tags with `JSON.stringify` requires escaping HTML characters, particularly `<`.
**Prevention:** Replace `<` with `\u003c` or use a dedicated serialization library like `serialize-javascript` when interpolating JSON directly inside a script tag.

## 2025-02-18 - Markdown Image/Link URL XSS
**Vulnerability:** XSS via un-sanitized Markdown URLs. `renderMarkdown` injected markdown image/link URIs (`[text](url)`) directly into `href` and `src` attributes without verifying protocols or escaping quotes, allowing `javascript:` execution or HTML attribute breakout via `"` / `'`.
**Learning:** Custom markdown renderers that rely on string `.replace()` are heavily prone to XSS if URLs are not sanitized.
**Prevention:** Always parse and sanitize URLs before placing them in HTML attributes. Block dangerous protocols (`javascript:`, `vbscript:`, `data:text/html`), and escape double and single quotes to prevent breaking out of attribute context. Use an explicit helper function (e.g. `sanitizeUrl`).
