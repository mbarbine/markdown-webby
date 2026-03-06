import { siteConfig } from "@/lib/platphorm/config"

export const openApiSpec = {
  openapi: "3.1.0",
  info: {
    title: `${siteConfig.name} API`,
    description: siteConfig.description,
    version: siteConfig.version,
    contact: {
      name: siteConfig.creator,
      url: siteConfig.url,
    },
    license: {
      name: "MIT",
      url: "https://opensource.org/licenses/MIT",
    },
  },
  servers: [
    {
      url: siteConfig.url,
      description: "Production",
    },
    {
      url: "http://localhost:3000",
      description: "Development",
    },
  ],
  tags: [
    { name: "Health", description: "Service health endpoints" },
    { name: "Documents", description: "Markdown document operations" },
    { name: "Transform", description: "Markdown transformation endpoints" },
    { name: "AI", description: "AI-powered features" },
    { name: "Export", description: "Export and conversion endpoints" },
  ],
  paths: {
    "/api/health": {
      get: {
        tags: ["Health"],
        summary: "Health check",
        description: "Returns service health status",
        operationId: "getHealth",
        responses: {
          "200": {
            description: "Service is healthy",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/HealthResponse" },
              },
            },
          },
        },
      },
    },
    "/api/v1/transform": {
      post: {
        tags: ["Transform"],
        summary: "Transform markdown to graph",
        description: "Parses markdown and returns a graph representation",
        operationId: "transformMarkdown",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/TransformRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "Successfully transformed",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/TransformResponse" },
              },
            },
          },
        },
      },
    },
    "/api/v1/export": {
      post: {
        tags: ["Export"],
        summary: "Export document",
        description: "Export markdown to various formats",
        operationId: "exportDocument",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ExportRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "Successfully exported",
          },
        },
      },
    },
    "/api/v1/ai/enhance": {
      post: {
        tags: ["AI"],
        summary: "AI enhancement",
        description: "Enhance markdown with AI suggestions",
        operationId: "aiEnhance",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AIEnhanceRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "AI suggestions returned",
          },
        },
      },
    },
  },
  components: {
    schemas: {
      ApiResponse: {
        type: "object",
        properties: {
          success: { type: "boolean" },
          data: { type: "object" },
          error: { $ref: "#/components/schemas/ApiError" },
          meta: { $ref: "#/components/schemas/ApiMeta" },
        },
        required: ["success"],
      },
      ApiError: {
        type: "object",
        properties: {
          code: { type: "string" },
          message: { type: "string" },
          details: { type: "object" },
        },
        required: ["code", "message"],
      },
      ApiMeta: {
        type: "object",
        properties: {
          version: { type: "string" },
          timestamp: { type: "string", format: "date-time" },
          requestId: { type: "string" },
        },
      },
      HealthResponse: {
        type: "object",
        properties: {
          status: { type: "string", enum: ["healthy", "degraded", "unhealthy"] },
          service: { type: "string" },
          version: { type: "string" },
          uptime: { type: "number", nullable: true },
          environment: { type: "string" },
        },
      },
      TransformRequest: {
        type: "object",
        properties: {
          markdown: { type: "string", description: "Raw markdown content" },
          options: {
            type: "object",
            properties: {
              includeMetadata: { type: "boolean", default: true },
              flattenInline: { type: "boolean", default: false },
            },
          },
        },
        required: ["markdown"],
      },
      TransformResponse: {
        type: "object",
        properties: {
          nodes: { type: "array", items: { $ref: "#/components/schemas/GraphNode" } },
          edges: { type: "array", items: { $ref: "#/components/schemas/GraphEdge" } },
          outline: { type: "array", items: { $ref: "#/components/schemas/OutlineItem" } },
          stats: { $ref: "#/components/schemas/DocumentStats" },
        },
      },
      GraphNode: {
        type: "object",
        properties: {
          id: { type: "string" },
          type: { type: "string" },
          text: { type: "string" },
          depth: { type: "integer" },
          parent: { type: "string", nullable: true },
        },
      },
      GraphEdge: {
        type: "object",
        properties: {
          id: { type: "string" },
          from: { type: "string" },
          to: { type: "string" },
        },
      },
      OutlineItem: {
        type: "object",
        properties: {
          id: { type: "string" },
          level: { type: "integer" },
          text: { type: "string" },
          children: { type: "array", items: { $ref: "#/components/schemas/OutlineItem" } },
        },
      },
      DocumentStats: {
        type: "object",
        properties: {
          nodeCount: { type: "integer" },
          wordCount: { type: "integer" },
          charCount: { type: "integer" },
          headingCount: { type: "integer" },
          linkCount: { type: "integer" },
          imageCount: { type: "integer" },
          codeBlockCount: { type: "integer" },
        },
      },
      ExportRequest: {
        type: "object",
        properties: {
          markdown: { type: "string" },
          format: { type: "string", enum: ["markdown", "json", "html", "pdf", "png"] },
        },
        required: ["markdown", "format"],
      },
      AIEnhanceRequest: {
        type: "object",
        properties: {
          markdown: { type: "string" },
          action: { type: "string", enum: ["improve", "summarize", "expand", "fix-grammar", "generate-toc"] },
          context: { type: "string" },
        },
        required: ["markdown", "action"],
      },
    },
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
      apiKey: {
        type: "apiKey",
        in: "header",
        name: "X-API-Key",
      },
    },
  },
}
