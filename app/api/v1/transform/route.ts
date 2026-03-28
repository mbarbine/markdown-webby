import { apiSuccess, errors, checkRateLimit, corsHeaders } from "@/lib/api/utils"
import { parseMarkdownToGraph, generateOutline, getDocumentStats } from "@/lib/markdown/parser"
import { headers } from "next/headers"

export async function POST(request: Request) {
  try {
    // Rate limiting
    const headersList = await headers()
    const ip = headersList.get("x-forwarded-for") || "anonymous"
    const rateLimit = checkRateLimit(`transform:${ip}`, 60, 60000)
    
    if (!rateLimit.allowed) {
      return errors.rateLimited()
    }

    const body = await request.json()
    const { markdown, options = {} } = body

    if (!markdown || typeof markdown !== "string") {
      return errors.badRequest("markdown field is required and must be a string")
    }

    const graph = parseMarkdownToGraph(markdown)
    const { nodes, edges } = graph
    const outline = generateOutline(markdown, graph)
    const stats = getDocumentStats(markdown, graph)

    return apiSuccess({
      nodes,
      edges,
      outline,
      stats,
      options,
    })
  } catch (error) {
    console.error("Transform error:", error)
    return errors.serverError("Failed to transform markdown")
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(),
  })
}
