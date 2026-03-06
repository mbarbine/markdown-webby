"use client"

import { useMemo } from "react"
import { useMarkdown } from "@/lib/store/use-markdown"
import { cn } from "@/lib/utils"

interface MarkdownPreviewProps {
  className?: string
}

// Simple markdown to HTML renderer
function renderMarkdown(content: string): string {
  let html = content

  // Escape HTML first
  html = html.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")

  // Code blocks (must be before other processing)
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    return `<pre class="bg-muted rounded-lg p-4 overflow-x-auto my-4"><code class="language-${lang || 'text'} text-sm font-mono">${code.trim()}</code></pre>`
  })

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')

  // Headers
  html = html.replace(/^###### (.+)$/gm, '<h6 class="text-base font-semibold mt-6 mb-2">$1</h6>')
  html = html.replace(/^##### (.+)$/gm, '<h5 class="text-lg font-semibold mt-6 mb-2">$1</h5>')
  html = html.replace(/^#### (.+)$/gm, '<h4 class="text-xl font-semibold mt-6 mb-3">$1</h4>')
  html = html.replace(/^### (.+)$/gm, '<h3 class="text-2xl font-semibold mt-8 mb-3">$1</h3>')
  html = html.replace(/^## (.+)$/gm, '<h2 class="text-3xl font-bold mt-10 mb-4 pb-2 border-b border-border">$1</h2>')
  html = html.replace(/^# (.+)$/gm, '<h1 class="text-4xl font-bold mt-8 mb-6">$1</h1>')

  // Horizontal rules
  html = html.replace(/^[-*_]{3,}\s*$/gm, '<hr class="my-8 border-border" />')

  // Blockquotes
  html = html.replace(/^&gt;\s*(.+)$/gm, '<blockquote class="border-l-4 border-primary pl-4 my-4 italic text-muted-foreground">$1</blockquote>')

  // Task lists
  html = html.replace(/^- \[x\] (.+)$/gm, '<div class="flex items-center gap-2 my-1"><input type="checkbox" checked disabled class="rounded" /><span>$1</span></div>')
  html = html.replace(/^- \[ \] (.+)$/gm, '<div class="flex items-center gap-2 my-1"><input type="checkbox" disabled class="rounded" /><span>$1</span></div>')

  // Unordered lists
  html = html.replace(/^[-*+] (.+)$/gm, '<li class="ml-6 list-disc">$1</li>')
  
  // Ordered lists
  html = html.replace(/^\d+\. (.+)$/gm, '<li class="ml-6 list-decimal">$1</li>')

  // Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full rounded-lg my-4" />')

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:underline" target="_blank" rel="noopener noreferrer">$1</a>')

  // Bold
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold">$1</strong>')
  html = html.replace(/__([^_]+)__/g, '<strong class="font-bold">$1</strong>')

  // Italic
  html = html.replace(/\*([^*]+)\*/g, '<em class="italic">$1</em>')
  html = html.replace(/_([^_]+)_/g, '<em class="italic">$1</em>')

  // Strikethrough
  html = html.replace(/~~([^~]+)~~/g, '<del class="line-through">$1</del>')

  // Tables (basic support)
  const tableRegex = /\|(.+)\|\n\|[-:|]+\|\n((?:\|.+\|\n?)+)/g
  html = html.replace(tableRegex, (_, header, body) => {
    const headers = header.split("|").map((h: string) => h.trim()).filter(Boolean)
    const rows = body.trim().split("\n").map((row: string) => 
      row.split("|").map((cell: string) => cell.trim()).filter(Boolean)
    )
    
    const headerHtml = headers.map((h: string) => `<th class="px-4 py-2 text-left border-b border-border font-semibold">${h}</th>`).join("")
    const rowsHtml = rows.map((row: string[]) => 
      `<tr class="border-b border-border">${row.map((cell: string) => `<td class="px-4 py-2">${cell}</td>`).join("")}</tr>`
    ).join("")
    
    return `<div class="overflow-x-auto my-4"><table class="w-full border-collapse border border-border rounded-lg"><thead class="bg-muted"><tr>${headerHtml}</tr></thead><tbody>${rowsHtml}</tbody></table></div>`
  })

  // Wrap list items in ul/ol (basic)
  html = html.replace(/(<li class="ml-6 list-disc">[\s\S]*?<\/li>\n?)+/g, '<ul class="my-4">$&</ul>')
  html = html.replace(/(<li class="ml-6 list-decimal">[\s\S]*?<\/li>\n?)+/g, '<ol class="my-4">$&</ol>')

  // Paragraphs (wrap remaining text)
  html = html.split("\n\n").map(block => {
    block = block.trim()
    if (!block) return ""
    if (block.startsWith("<")) return block
    return `<p class="my-4 leading-relaxed">${block}</p>`
  }).join("\n")

  // Clean up extra newlines
  html = html.replace(/\n{3,}/g, "\n\n")

  return html
}

export function MarkdownPreview({ className }: MarkdownPreviewProps) {
  const { content } = useMarkdown()

  const renderedHtml = useMemo(() => renderMarkdown(content), [content])

  return (
    <div className={cn("h-full overflow-auto custom-scrollbar", className)}>
      <article
        className="prose dark:prose-invert max-w-none p-6"
        dangerouslySetInnerHTML={{ __html: renderedHtml }}
      />
    </div>
  )
}
