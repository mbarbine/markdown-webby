import { NextResponse } from "next/server"
import { siteConfig } from "@/lib/platphorm/config"

export async function GET() {
  const mcpConfig = {
    name: siteConfig.name,
    version: siteConfig.version,
    description: siteConfig.description,
    homepage: siteConfig.url,
    
    capabilities: {
      resources: true,
      tools: true,
      prompts: true,
    },
    
    resources: [
      {
        uri: `${siteConfig.url}/api/v1/transform`,
        name: "markdown-to-graph",
        description: "Transform markdown content into graph structure",
        mimeType: "application/json",
      },
      {
        uri: `${siteConfig.url}/api/v1/export`,
        name: "export-document",
        description: "Export document in various formats",
        mimeType: "application/json",
      },
    ],
    
    tools: [
      {
        name: "transform_markdown",
        description: "Convert markdown text to a graph visualization structure",
        inputSchema: {
          type: "object",
          properties: {
            content: {
              type: "string",
              description: "Markdown content to transform",
            },
          },
          required: ["content"],
        },
      },
      {
        name: "export_document",
        description: "Export document in markdown, json, or html format",
        inputSchema: {
          type: "object",
          properties: {
            content: {
              type: "string",
              description: "Document content",
            },
            format: {
              type: "string",
              enum: ["markdown", "json", "html"],
              description: "Export format",
            },
          },
          required: ["content", "format"],
        },
      },
      {
        name: "enhance_content",
        description: "Use AI to enhance markdown content",
        inputSchema: {
          type: "object",
          properties: {
            content: {
              type: "string",
              description: "Content to enhance",
            },
            action: {
              type: "string",
              enum: ["improve", "summarize", "expand", "fix-grammar", "generate-toc"],
              description: "Enhancement action",
            },
          },
          required: ["content", "action"],
        },
      },
    ],
    
    prompts: [
      {
        name: "document_analysis",
        description: "Analyze a markdown document structure",
        arguments: [
          {
            name: "content",
            description: "The markdown content to analyze",
            required: true,
          },
        ],
      },
    ],
    
    server: {
      transport: "http",
      endpoints: {
        base: `${siteConfig.url}/api/v1`,
        transform: `${siteConfig.url}/api/v1/transform`,
        export: `${siteConfig.url}/api/v1/export`,
        enhance: `${siteConfig.url}/api/v1/ai/enhance`,
        chat: `${siteConfig.url}/api/v1/ai/chat`,
      },
    },
    
    authentication: {
      type: "none",
      required: false,
    },
    
    rateLimit: {
      requestsPerMinute: 60,
      requestsPerDay: 1000,
    },
  }

  return NextResponse.json(mcpConfig, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600",
    },
  })
}
