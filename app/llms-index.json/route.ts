import { NextResponse } from "next/server"
import { siteConfig } from "@/lib/platphorm/config"

export async function GET() {
  const index = {
    title: `${siteConfig.name} - LLM Index`,
    description: "Index of LLM-friendly documents and endpoints",
    url: siteConfig.url,
    files: [
      {
        path: "/llms.txt",
        description: "Essential LLM Discovery",
        format: "markdown"
      },
      {
        path: "/llms-full.txt",
        description: "Comprehensive LLM Discovery & Full Context",
        format: "markdown"
      },
      {
        path: "/.well-known/mcp.json",
        description: "Model Context Protocol Configuration",
        format: "json"
      },
      {
        path: "/api/docs",
        description: "OpenAPI Specification",
        format: "json"
      },
      {
        path: "/schemas/platphorm-universal-schema-pack.json",
        description: "PlatPhorm Universal Schema Pack",
        format: "json"
      },
      {
        path: "/schemas/core.schema.json",
        description: "Core Schema Enums and Defaults",
        format: "json"
      },
      {
        path: "/schemas/realm.schema.json",
        description: "Realm and Universe Schema",
        format: "json"
      },
      {
        path: "/schemas/item.schema.json",
        description: "Item and Content Schema",
        format: "json"
      },
      {
        path: "/schemas/observability.schema.json",
        description: "Observability and Trace Schema",
        format: "json"
      },
      {
        path: "/schemas/agent.schema.json",
        description: "Agent and Tool Schema",
        format: "json"
      }
    ]
  }

  return NextResponse.json(index, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600",
    },
  })
}
