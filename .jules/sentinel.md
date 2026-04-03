## YYYY-MM-DD - JSON-LD XSS Prevention
**Vulnerability:** XSS vulnerability in `JsonLd` component. When embedding JSON-LD schemas, `JSON.stringify` does not escape `<` and `>` characters by default. If untrusted data is included, an attacker could break out of the script tag (e.g., `</script><script>alert(1)</script>`).
**Learning:** `dangerouslySetInnerHTML` on script tags with `JSON.stringify` requires escaping HTML characters, particularly `<`.
**Prevention:** Replace `<` with `\u003c` or use a dedicated serialization library like `serialize-javascript` when interpolating JSON directly inside a script tag.
