import { streamText, tool, convertToModelMessages } from "ai"
import { z } from "zod"
import { errors, corsHeaders } from "@/lib/api/utils"
import { parseMarkdownToGraph, generateOutline, getDocumentStats } from "@/lib/markdown/parser"

const markdownTools = {
  analyzeDocument: tool({
    description: "Analyze the current markdown document structure and statistics",
    inputSchema: z.object({
      markdown: z.string().describe("The markdown content to analyze"),
    }),
    execute: async ({ markdown }) => {
      const graph = parseMarkdownToGraph(markdown)
      const { nodes, edges } = graph
      const stats = getDocumentStats(markdown, graph)
      const outline = generateOutline(markdown, graph)
      return {
        nodeCount: nodes.length,
        edgeCount: edges.length,
        stats,
        outline: outline.slice(0, 10), // First 10 items
        topLevelHeadings: outline.filter((item) => item.level === 1).length,
      }
    },
  }),
  formatMarkdown: tool({
    description: "Format and clean up markdown text",
    inputSchema: z.object({
      markdown: z.string().describe("The markdown to format"),
      style: z.enum(["clean", "compact", "expanded"]).describe("Formatting style"),
    }),
    execute: async ({ markdown, style }) => {
      let formatted = markdown
        .replace(/\n{3,}/g, "\n\n") // Remove excess newlines
        .replace(/[ \t]+$/gm, "") // Trim trailing spaces
        .trim()

      if (style === "compact") {
        formatted = formatted.replace(/\n\n/g, "\n")
      } else if (style === "expanded") {
        formatted = formatted.replace(/\n(?!\n)/g, "\n\n")
      }

      return { formatted, style, charsSaved: markdown.length - formatted.length }
    },
  }),
  generateSection: tool({
    description: "Generate a new markdown section based on a topic",
    inputSchema: z.object({
      topic: z.string().describe("The topic for the section"),
      level: z.number().min(1).max(6).describe("Heading level (1-6)"),
      includeExamples: z.boolean().describe("Whether to include code examples"),
    }),
    execute: async ({ topic, level, includeExamples }) => {
      const heading = "#".repeat(level) + " " + topic
      const placeholder = `${heading}\n\nWrite content about ${topic} here.\n`
      const example = includeExamples
        ? `\n\`\`\`markdown\n# Example\nYour example code here\n\`\`\`\n`
        : ""
      return { generated: placeholder + example }
    },
  }),
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { messages, currentDocument } = body

    if (!messages || !Array.isArray(messages)) {
      return errors.badRequest("messages array is required")
    }

    const systemPrompt = `You are a helpful AI assistant specializing in markdown editing and document creation.
You have access to tools that can analyze markdown documents, format text, and generate content.
The user is working with a markdown editor that visualizes documents as interactive graphs.

${currentDocument ? `Current document preview (first 500 chars):\n${currentDocument.slice(0, 500)}...` : "No document currently loaded."}

Help the user with:
- Writing and improving markdown content
- Understanding markdown syntax
- Structuring documents effectively
- Analyzing document structure
- Generating new sections and content

Be concise and provide practical markdown examples when helpful.`

    const result = streamText({
      model: "openai/gpt-4o-mini",
      system: systemPrompt,
      messages: await convertToModelMessages(messages),
      tools: markdownTools,
      maxOutputTokens: 2000,
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error("AI chat error:", error)
    return errors.serverError("AI chat failed")
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() })
}
