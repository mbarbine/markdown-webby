## YYYY-MM-DD - JSON-LD XSS Prevention
**Vulnerability:** XSS vulnerability in `JsonLd` component. When embedding JSON-LD schemas, `JSON.stringify` does not escape `<` and `>` characters by default. If untrusted data is included, an attacker could break out of the script tag (e.g., `</script><script>alert(1)</script>`).
**Learning:** `dangerouslySetInnerHTML` on script tags with `JSON.stringify` requires escaping HTML characters, particularly `<`.
**Prevention:** Replace `<` with `\u003c` or use a dedicated serialization library like `serialize-javascript` when interpolating JSON directly inside a script tag.
## 2025-02-28 - Markdown Rendering XSS
**Vulnerability:** XSS in custom markdown renderer (`components/editor/markdown-preview.tsx`). Interpolating unvalidated URLs directly into `href` or `src` attributes allows users to break out with quotes (`" onmouseover="alert(1)`) or inject dangerous protocols like `javascript:`.
**Learning:** `dangerouslySetInnerHTML` passes raw HTML straight to the DOM. Regular expression replacements that build HTML strings *must* sanitize inputs being injected into attributes to block dangerous URIs and escape attribute boundary characters.
**Prevention:** Implement a dedicated `sanitizeAttribute` helper to neutralize `javascript:`, `vbscript:`, and non-image `data:` URIs, and systematically replace quotes and HTML brackets.
