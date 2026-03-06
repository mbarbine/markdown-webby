import { siteConfig } from "@/lib/platphorm/config"
import { openApiSpec } from "@/lib/api/openapi"

export async function GET() {
  const content = `# ${siteConfig.name} - Complete Documentation

> ${siteConfig.description}

Version: ${siteConfig.version}
Created by: ${siteConfig.creator}

---

## Overview

MarkdownTree is a next-generation markdown visualization platform that transforms plain text documents into interactive graph representations. It combines the simplicity of markdown with the power of visual programming and AI assistance.

## Core Capabilities

### 1. Markdown Parsing
- Full CommonMark specification support
- GitHub Flavored Markdown (GFM) extensions
- Table, task list, and strikethrough support
- Footnotes and definition lists

### 2. Graph Visualization
- Real-time AST to graph transformation
- Interactive node manipulation
- Hierarchical layout algorithms
- Zoom, pan, and focus controls
- Node type filtering

### 3. AI Features
- Grammar and style suggestions
- Content expansion and summarization
- Table of contents generation
- Smart formatting

### 4. Export Formats
${siteConfig.features.export.map(f => `- ${f.toUpperCase()}`).join("\n")}

---

## API Reference

### Authentication
Most endpoints are public. Rate limited to 60 requests/minute per IP.

### Base URL
\`${siteConfig.url}${siteConfig.api.basePath}\`

### Endpoints

#### Health Check
\`GET /api/health\`

Returns service status and version information.

#### API Documentation
\`GET /api/docs\`

Returns OpenAPI 3.1 specification.

#### Transform Markdown
\`POST /api/v1/transform\`

Converts markdown to graph representation.

**Request Body:**
\`\`\`json
{
  "markdown": "string (required)",
  "options": {
    "includeMetadata": boolean,
    "flattenInline": boolean
  }
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "nodes": [
      {
        "id": "string",
        "type": "heading|paragraph|code|link|...",
        "text": "string",
        "depth": number,
        "parent": "string|null"
      }
    ],
    "edges": [
      {
        "id": "string",
        "from": "string",
        "to": "string"
      }
    ],
    "outline": [...],
    "stats": {
      "nodeCount": number,
      "wordCount": number,
      "charCount": number,
      "headingCount": number,
      "linkCount": number,
      "imageCount": number,
      "codeBlockCount": number
    }
  }
}
\`\`\`

#### Export Document
\`POST /api/v1/export\`

Export markdown to various formats.

**Request Body:**
\`\`\`json
{
  "markdown": "string (required)",
  "format": "markdown|json|html"
}
\`\`\`

---

## Node Types

| Type | Description | Color |
|------|-------------|-------|
| heading | Document headings (H1-H6) | Emerald |
| paragraph | Text paragraphs | Slate |
| code | Inline code | Violet |
| codeBlock | Code blocks | Violet |
| link | Hyperlinks | Blue |
| image | Images | Pink |
| list | Lists (ul/ol) | Amber |
| listItem | List items | Amber |
| blockquote | Quotations | Purple |
| table | Tables | Teal |
| thematicBreak | Horizontal rules | Gray |

---

## OpenAPI Specification

\`\`\`json
${JSON.stringify(openApiSpec, null, 2)}
\`\`\`

---

## Links

- Production: ${siteConfig.url}
- Editor: ${siteConfig.url}/editor
- API Docs: ${siteConfig.url}/api/docs
- GitHub: ${siteConfig.links.github}
- RSS Feed: ${siteConfig.url}/feed.xml
- Sitemap: ${siteConfig.url}/sitemap.xml

## Support

Coinbase Wallet: ${siteConfig.coinbase}

---

Last updated: ${new Date().toISOString()}
`

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  })
}
