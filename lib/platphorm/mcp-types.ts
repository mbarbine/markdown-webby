export interface MCPEndpoint {
  name: string
  description: string
  path: string
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
  parameters?: MCPParameter[]
  response: MCPResponse
}

export interface MCPParameter {
  name: string
  type: "string" | "number" | "boolean" | "array" | "object"
  required: boolean
  description: string
  default?: unknown
}

export interface MCPResponse {
  type: string
  description: string
  schema?: object
}

export interface MCPConfig {
  version: string
  name: string
  description: string
  endpoints: MCPEndpoint[]
  authentication?: {
    type: "bearer" | "api-key" | "none"
    headerName?: string
  }
  rateLimit?: {
    requests: number
    window: string
  }
}

export const mcpConfig: MCPConfig = {
  version: "1.0.0",
  name: "MarkdownTree MCP",
  description: "Model Context Protocol for MarkdownTree - Visual Markdown Editor & Graph Viewer",
  endpoints: [
    {
      name: "parseMarkdown",
      description: "Parse markdown content into a graph structure",
      path: "/api/v1/parse",
      method: "POST",
      parameters: [
        {
          name: "content",
          type: "string",
          required: true,
          description: "Markdown content to parse"
        },
        {
          name: "options",
          type: "object",
          required: false,
          description: "Parsing options"
        }
      ],
      response: {
        type: "object",
        description: "Parsed graph structure with nodes and edges"
      }
    },
    {
      name: "exportDocument",
      description: "Export document to various formats",
      path: "/api/v1/export",
      method: "POST",
      parameters: [
        {
          name: "content",
          type: "string",
          required: true,
          description: "Markdown content to export"
        },
        {
          name: "format",
          type: "string",
          required: true,
          description: "Export format: markdown, json, html, pdf"
        }
      ],
      response: {
        type: "object",
        description: "Exported document data"
      }
    },
    {
      name: "aiEnhance",
      description: "AI-powered markdown enhancement",
      path: "/api/v1/ai/enhance",
      method: "POST",
      parameters: [
        {
          name: "content",
          type: "string",
          required: true,
          description: "Markdown content to enhance"
        },
        {
          name: "action",
          type: "string",
          required: true,
          description: "Enhancement action: summarize, expand, format, translate"
        }
      ],
      response: {
        type: "object",
        description: "Enhanced markdown content"
      }
    }
  ],
  authentication: {
    type: "none"
  },
  rateLimit: {
    requests: 100,
    window: "1m"
  }
}
