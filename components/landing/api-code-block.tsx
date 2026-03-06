"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"

const SAMPLE = `{
  "content": "# Hello\\n\\n## World",
  "options": {
    "includeText": true,
    "direction": "RIGHT"
  }
}

// → 200 OK
{
  "nodes": [
    { "id": "n0", "type": "heading",
      "depth": 1, "text": "Hello" },
    { "id": "n1", "type": "heading",
      "depth": 2, "text": "World" }
  ],
  "edges": [
    { "from": "n0", "to": "n1" }
  ]
}`

export function ApiCodeBlock() {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(SAMPLE)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden font-mono text-sm">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-muted/40">
        <div className="h-2 w-2 rounded-full bg-emerald-500" />
        <span className="text-xs text-muted-foreground">POST /api/v1/transform</span>
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto h-6 w-6 text-muted-foreground hover:text-foreground"
          onClick={handleCopy}
          aria-label="Copy example"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-emerald-500" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </Button>
      </div>
      <pre className="p-4 text-xs leading-6 overflow-x-auto text-foreground/80">{SAMPLE}</pre>
    </div>
  )
}
