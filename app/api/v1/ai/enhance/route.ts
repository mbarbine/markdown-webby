import { streamText, Output } from "ai"
import { z } from "zod"
import { errors, corsHeaders } from "@/lib/api/utils"

const ActionSchema = z.enum(["improve", "summarize", "expand", "fix-grammar", "generate-toc"])

const systemPrompts: Record<z.infer<typeof ActionSchema>, string> = {
  improve: `You are a professional editor. Improve the given markdown text for clarity, flow, and readability while preserving the original meaning and structure. Return only the improved markdown.`,
  summarize: `You are a summarization expert. Create a concise summary of the given markdown content. Return as a markdown bullet list of key points.`,
  expand: `You are a content writer. Expand the given markdown with more detail, examples, and explanations while maintaining the same tone and structure. Return as markdown.`,
  "fix-grammar": `You are a grammar expert. Fix any grammar, spelling, or punctuation errors in the given markdown. Return the corrected markdown without any explanations.`,
  "generate-toc": `You are a document assistant. Generate a table of contents for the given markdown document based on its headings. Return as a markdown list with links.`,
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { markdown, action, context } = body

    if (!markdown || typeof markdown !== "string") {
      return errors.badRequest("markdown field is required")
    }

    const validAction = ActionSchema.safeParse(action)
    if (!validAction.success) {
      return errors.badRequest(`Invalid action. Supported: ${ActionSchema.options.join(", ")}`)
    }

    const systemPrompt = systemPrompts[validAction.data]
    const userPrompt = context 
      ? `Context: ${context}\n\nMarkdown:\n${markdown}`
      : markdown

    const result = streamText({
      model: "openai/gpt-4o-mini",
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
      maxOutputTokens: 4000,
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error("AI enhance error:", error)
    return errors.serverError("AI enhancement failed")
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() })
}
