"use client"

import { useEffect, useCallback, useRef, useState } from "react"
import dynamic from "next/dynamic"
import { useShallow } from "zustand/react/shallow"
import { useMarkdown } from "@/lib/store/use-markdown"
import { EditorToolbar } from "@/components/editor/toolbar"
import { OutlinePanel } from "@/components/editor/outline-panel"
import { MarkdownPreview } from "@/components/editor/markdown-preview"
import { AIChatPanel } from "@/components/editor/ai-chat-panel"
import { SiteHeader } from "@/components/site-header"
import { 
  ResizableHandle, 
  ResizablePanel, 
  ResizablePanelGroup 
} from "@/components/ui/resizable"
import { cn } from "@/lib/utils"
import { parseShareUrl } from "@/lib/export/utils"

const MarkdownEditor = dynamic(
  () => import("@/components/editor/markdown-editor").then(mod => mod.MarkdownEditor),
  { ssr: false, loading: () => <div className="h-full w-full animate-pulse bg-muted" /> }
)

const GraphViewer = dynamic(
  () => import("@/components/editor/graph-viewer").then(mod => mod.GraphViewer),
  { ssr: false, loading: () => <div className="h-full w-full animate-pulse bg-muted" /> }
)

export default function EditorPage() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showAI, setShowAI] = useState(false)
  // ⚡ Bolt: Extracting specific properties with useShallow stops the entire page
  // from re-rendering on high-frequency graph state changes (position, scale, selection).
  const { 
    viewMode, 
    fullscreen, 
    setContent, 
    content, 
    graph,
    viewSettings,
    setLoading 
  } = useMarkdown(
    useShallow((state) => ({
      viewMode: state.viewMode,
      fullscreen: state.fullscreen,
      setContent: state.setContent,
      content: state.content,
      graph: state.graph,
      viewSettings: state.viewSettings,
      setLoading: state.setLoading,
    }))
  )

  // Check for shared content in URL on mount
  useEffect(() => {
    const sharedContent = parseShareUrl()
    if (sharedContent) {
      setContent(sharedContent)
    }
  }, [setContent])

  const handleInsertFromAI = useCallback((text: string) => {
    setContent(content + "\n\n" + text)
  }, [content, setContent])

  const toggleAI = useCallback(() => {
    setShowAI(prev => !prev)
  }, [])

  const handleImport = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const text = event.target?.result as string
        setContent(text)
      }
      reader.readAsText(file)
    }
    // Reset input
    e.target.value = ""
  }, [setContent])

  const handleExport = useCallback((format: string) => {
    let exportContent: string
    let filename: string
    let mimeType: string

    switch (format) {
      case "markdown":
        exportContent = content
        filename = "document.md"
        mimeType = "text/markdown"
        break
      case "html":
        exportContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Exported Markdown</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; }
    pre { background: #f4f4f5; padding: 1rem; border-radius: 0.5rem; overflow-x: auto; }
    code { font-family: monospace; }
    blockquote { border-left: 4px solid #22c55e; padding-left: 1rem; margin-left: 0; }
  </style>
</head>
<body>
${content}
</body>
</html>`
        filename = "document.html"
        mimeType = "text/html"
        break
      case "json":
        exportContent = JSON.stringify({ content, graph }, null, 2)
        filename = "document.json"
        mimeType = "application/json"
        break
      default:
        return
    }

    const blob = new Blob([exportContent], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [content, graph])

  return (
    <div className={cn("flex flex-col h-screen bg-background", fullscreen && "fixed inset-0 z-50")}>
      {!fullscreen && <SiteHeader />}
      
      <EditorToolbar 
        onImport={handleImport} 
        onExport={handleExport} 
        onToggleAI={toggleAI}
        showAI={showAI}
      />
      
      <input
        ref={fileInputRef}
        type="file"
        accept=".md,.markdown,.txt"
        onChange={handleFileChange}
        className="hidden"
      />

      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={showAI ? 75 : 100} minSize={50}>
          <div className="h-full overflow-hidden">
            {viewMode === "editor" && (
              <ResizablePanelGroup direction="horizontal">
                {viewSettings.showOutline && (
                  <>
                    <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
                      <OutlinePanel />
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                  </>
                )}
                <ResizablePanel defaultSize={80}>
                  <MarkdownEditor />
                </ResizablePanel>
              </ResizablePanelGroup>
            )}

            {viewMode === "split" && (
              <ResizablePanelGroup direction="horizontal">
                {viewSettings.showOutline && (
                  <>
                    <ResizablePanel defaultSize={15} minSize={10} maxSize={25}>
                      <OutlinePanel />
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                  </>
                )}
                <ResizablePanel defaultSize={35} minSize={25}>
                  <MarkdownEditor />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={50} minSize={30}>
                  <GraphViewer />
                </ResizablePanel>
              </ResizablePanelGroup>
            )}

            {viewMode === "graph" && (
              <ResizablePanelGroup direction="horizontal">
                {viewSettings.showOutline && (
                  <>
                    <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
                      <OutlinePanel />
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                  </>
                )}
                <ResizablePanel defaultSize={80}>
                  <GraphViewer />
                </ResizablePanel>
              </ResizablePanelGroup>
            )}

            {viewMode === "preview" && (
              <ResizablePanelGroup direction="horizontal">
                {viewSettings.showOutline && (
                  <>
                    <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
                      <OutlinePanel />
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                  </>
                )}
                <ResizablePanel defaultSize={80}>
                  <MarkdownPreview className="bg-card" />
                </ResizablePanel>
              </ResizablePanelGroup>
            )}
          </div>
        </ResizablePanel>

        {showAI && (
          <>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
              <AIChatPanel 
                currentDocument={content} 
                onInsert={handleInsertFromAI} 
              />
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </div>
  )
}
