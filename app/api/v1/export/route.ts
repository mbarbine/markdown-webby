import { apiSuccess, errors, corsHeaders } from "@/lib/api/utils"
import { parseMarkdownToGraph, generateOutline } from "@/lib/markdown/parser"

type ExportFormat = "markdown" | "json" | "html"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { markdown, format = "json" } = body as { markdown: string; format: ExportFormat }

    if (!markdown || typeof markdown !== "string") {
      return errors.badRequest("markdown field is required")
    }

    const validFormats: ExportFormat[] = ["markdown", "json", "html"]
    if (!validFormats.includes(format)) {
      return errors.badRequest(`Invalid format. Supported: ${validFormats.join(", ")}`)
    }

    switch (format) {
      case "markdown":
        return new Response(markdown, {
          headers: {
            "Content-Type": "text/markdown",
            "Content-Disposition": 'attachment; filename="document.md"',
          },
        })

      case "json": {
        const graph = parseMarkdownToGraph(markdown)
        const { nodes, edges } = graph
        const outline = generateOutline(markdown, graph)
        return apiSuccess({
          markdown,
          graph: { nodes, edges },
          outline,
          exportedAt: new Date().toISOString(),
        })
      }

      case "html": {
        const html = convertMarkdownToHtml(markdown)
        return new Response(html, {
          headers: {
            "Content-Type": "text/html",
            "Content-Disposition": 'attachment; filename="document.html"',
          },
        })
      }

      default:
        return errors.badRequest("Unsupported format")
    }
  } catch (error) {
    console.error("Export error:", error)
    return errors.serverError("Failed to export document")
  }
}

function convertMarkdownToHtml(markdown: string): string {
  // Basic markdown to HTML conversion
  let html = markdown
    // Headings
    .replace(/^######\s+(.*)$/gm, "<h6>$1</h6>")
    .replace(/^#####\s+(.*)$/gm, "<h5>$1</h5>")
    .replace(/^####\s+(.*)$/gm, "<h4>$1</h4>")
    .replace(/^###\s+(.*)$/gm, "<h3>$1</h3>")
    .replace(/^##\s+(.*)$/gm, "<h2>$1</h2>")
    .replace(/^#\s+(.*)$/gm, "<h1>$1</h1>")
    // Bold and italic
    .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    // Code
    .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    // Links and images
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    // Blockquotes
    .replace(/^>\s+(.*)$/gm, "<blockquote>$1</blockquote>")
    // Horizontal rules
    .replace(/^---$/gm, "<hr />")
    // Paragraphs
    .replace(/\n\n/g, "</p><p>")

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Exported Document</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; line-height: 1.6; }
    code { background: #f4f4f5; padding: 0.2em 0.4em; border-radius: 4px; }
    pre { background: #18181b; color: #f4f4f5; padding: 1rem; border-radius: 8px; overflow-x: auto; }
    pre code { background: none; }
    blockquote { border-left: 4px solid #3b82f6; padding-left: 1rem; color: #6b7280; }
    img { max-width: 100%; }
  </style>
</head>
<body>
  <p>${html}</p>
</body>
</html>`
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() })
}
