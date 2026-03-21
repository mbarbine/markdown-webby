"use client"

import { useRef, useCallback, useEffect } from "react"
import Editor, { OnMount, OnChange } from "@monaco-editor/react"
import { useTheme } from "next-themes"
import { useMarkdown } from "@/lib/store/use-markdown"
import { cn } from "@/lib/utils"

interface MarkdownEditorProps {
  className?: string
}

export function MarkdownEditor({ className }: MarkdownEditorProps) {
  const editorRef = useRef<any>(null)
  const { resolvedTheme } = useTheme()
  const { content, updateContent, selectedNodeId, getNodeById } = useMarkdown()

  const handleEditorMount: OnMount = useCallback((editor, monaco) => {
    editorRef.current = editor

    // Configure markdown language
    monaco.languages.setLanguageConfiguration("markdown", {
      wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\@\#\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g,
      comments: {
        blockComment: ["<!--", "-->"]
      },
      brackets: [
        ["{", "}"],
        ["[", "]"],
        ["(", ")"]
      ],
      autoClosingPairs: [
        { open: "{", close: "}" },
        { open: "[", close: "]" },
        { open: "(", close: ")" },
        { open: '"', close: '"' },
        { open: "'", close: "'" },
        { open: "`", close: "`" },
        { open: "**", close: "**" },
        { open: "__", close: "__" },
        { open: "*", close: "*" },
        { open: "_", close: "_" }
      ],
      surroundingPairs: [
        { open: "{", close: "}" },
        { open: "[", close: "]" },
        { open: "(", close: ")" },
        { open: '"', close: '"' },
        { open: "'", close: "'" },
        { open: "`", close: "`" },
        { open: "*", close: "*" },
        { open: "_", close: "_" }
      ]
    })

    // Custom markdown theme
    monaco.editor.defineTheme("markdowntree-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "keyword.md", foreground: "22c55e", fontStyle: "bold" },
        { token: "string.link.md", foreground: "3b82f6" },
        { token: "variable.md", foreground: "a855f7" },
        { token: "emphasis.md", fontStyle: "italic" },
        { token: "strong.md", fontStyle: "bold" },
        { token: "comment.md", foreground: "6b7280" }
      ],
      colors: {
        "editor.background": "#09090b",
        "editor.foreground": "#fafafa",
        "editor.lineHighlightBackground": "#27272a",
        "editor.selectionBackground": "#22c55e33",
        "editorCursor.foreground": "#22c55e",
        "editorLineNumber.foreground": "#52525b",
        "editorLineNumber.activeForeground": "#a1a1aa"
      }
    })

    monaco.editor.defineTheme("markdowntree-light", {
      base: "vs",
      inherit: true,
      rules: [
        { token: "keyword.md", foreground: "16a34a", fontStyle: "bold" },
        { token: "string.link.md", foreground: "2563eb" },
        { token: "variable.md", foreground: "9333ea" },
        { token: "emphasis.md", fontStyle: "italic" },
        { token: "strong.md", fontStyle: "bold" }
      ],
      colors: {
        "editor.background": "#ffffff",
        "editor.foreground": "#18181b",
        "editor.lineHighlightBackground": "#f4f4f5",
        "editor.selectionBackground": "#22c55e33",
        "editorCursor.foreground": "#16a34a",
        "editorLineNumber.foreground": "#a1a1aa",
        "editorLineNumber.activeForeground": "#52525b"
      }
    })

    // Apply theme
    monaco.editor.setTheme(resolvedTheme === "dark" ? "markdowntree-dark" : "markdowntree-light")
  }, [resolvedTheme])

  // Debounce the AST parsing and ReactFlow graph update to avoid blocking the main thread on every keystroke
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  const handleChange: OnChange = useCallback((value) => {
    if (value !== undefined) {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
      debounceTimerRef.current = setTimeout(() => {
        updateContent(value)
      }, 300)
    }
  }, [updateContent])

  // Cleanup debounced timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  // Jump to node line when selected
  useEffect(() => {
    if (selectedNodeId && editorRef.current) {
      const node = getNodeById(selectedNodeId)
      if (node?.data.startLine !== undefined) {
        editorRef.current.revealLineInCenter(node.data.startLine + 1)
        editorRef.current.setPosition({ lineNumber: node.data.startLine + 1, column: 1 })
      }
    }
  }, [selectedNodeId, getNodeById])

  // Update theme when it changes
  useEffect(() => {
    if (editorRef.current) {
      const monaco = (window as any).monaco
      if (monaco) {
        monaco.editor.setTheme(resolvedTheme === "dark" ? "markdowntree-dark" : "markdowntree-light")
      }
    }
  }, [resolvedTheme])

  return (
    <div className={cn("h-full w-full overflow-hidden", className)}>
      <Editor
        height="100%"
        defaultLanguage="markdown"
        value={content}
        onChange={handleChange}
        onMount={handleEditorMount}
        theme={resolvedTheme === "dark" ? "markdowntree-dark" : "markdowntree-light"}
        options={{
          fontSize: 14,
          fontFamily: "var(--font-mono), JetBrains Mono, monospace",
          fontLigatures: true,
          lineNumbers: "on",
          minimap: { enabled: true, scale: 1 },
          scrollBeyondLastLine: false,
          wordWrap: "on",
          wrappingStrategy: "advanced",
          tabSize: 2,
          insertSpaces: true,
          automaticLayout: true,
          padding: { top: 16, bottom: 16 },
          smoothScrolling: true,
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
          renderLineHighlight: "all",
          bracketPairColorization: { enabled: true },
          guides: {
            bracketPairs: true,
            indentation: true
          },
          suggest: {
            showKeywords: true,
            showSnippets: true
          },
          quickSuggestions: {
            other: true,
            comments: false,
            strings: true
          }
        }}
      />
    </div>
  )
}
