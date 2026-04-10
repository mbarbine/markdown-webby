## YYYY-MM-DD - JSON-LD XSS Prevention
**Vulnerability:** XSS vulnerability in `JsonLd` component. When embedding JSON-LD schemas, `JSON.stringify` does not escape `<` and `>` characters by default. If untrusted data is included, an attacker could break out of the script tag (e.g., `</script><script>alert(1)</script>`).
**Learning:** `dangerouslySetInnerHTML` on script tags with `JSON.stringify` requires escaping HTML characters, particularly `<`.
**Prevention:** Replace `<` with `\u003c` or use a dedicated serialization library like `serialize-javascript` when interpolating JSON directly inside a script tag.

## 2025-02-28 - Regex Dependency on Early Replacements
**Vulnerability:** Not a direct vulnerability, but a regression introduced by a security fix. Escaping raw HTML tags (`<` to `&lt;` and `>` to `&gt;`) at the beginning of a custom Markdown-to-HTML pipeline broke subsequent Markdown parsing regexes.
**Learning:** If you globally escape characters early in a parsing pipeline, downstream regexes that rely on those characters (like `^>` for blockquotes) must be updated to match the escaped entities (e.g., `^&gt;`).
**Prevention:** When introducing early replacement steps in string processing, review all downstream patterns to see if their matching criteria have been mutated by the earlier step. Add comprehensive test coverage to catch these regressions.
