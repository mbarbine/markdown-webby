import { siteConfig } from "@/lib/platphorm/config"

export async function GET() {
  const content = `# ${siteConfig.name}

> ${siteConfig.description}

## About

MarkdownTree is a visual markdown editor that transforms documents into interactive graph visualizations. Built by ${siteConfig.creator}.

## Features

- **Visual Editor**: Monaco-based editor with syntax highlighting
- **Graph View**: Interactive node-based visualization of document structure
- **AI Enhancement**: AI-powered writing assistance and suggestions
- **Multiple Views**: Document, Graph, Outline, and Split views
- **Export**: Markdown, JSON, HTML, PDF, PNG formats
- **Real-time Preview**: Live rendering as you type

## API

Base URL: ${siteConfig.url}${siteConfig.api.basePath}

### Endpoints

- \`GET /api/health\` - Service health check
- \`GET /api/docs\` - OpenAPI specification
- \`POST /api/v1/transform\` - Parse markdown to graph
- \`POST /api/v1/export\` - Export document

### Transform Request

\`\`\`json
{
  "markdown": "# Hello World\\n\\nThis is markdown.",
  "options": {
    "includeMetadata": true
  }
}
\`\`\`

### Response

\`\`\`json
{
  "success": true,
  "data": {
    "nodes": [...],
    "edges": [...],
    "outline": [...],
    "stats": {
      "nodeCount": 5,
      "wordCount": 10
    }
  }
}
\`\`\`

## Links

- Website: ${siteConfig.url}
- Editor: ${siteConfig.url}/editor
- API Docs: ${siteConfig.url}/api/docs
- GitHub: ${siteConfig.links.github}

## Support

Coinbase: ${siteConfig.coinbase}
`

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  })
}
