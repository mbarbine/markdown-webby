"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { parseMarkdown, MarkdownGraph, MarkdownNode, MarkdownEdge } from "@/lib/markdown/parser"

interface ViewSettings {
  showMinimap: boolean
  showOutline: boolean
  graphDirection: "RIGHT" | "DOWN" | "LEFT" | "UP"
  nodeSpacing: number
  edgeType: "smooth" | "straight" | "step"
}

interface MarkdownState {
  content: string
  graph: MarkdownGraph
  hasChanges: boolean
  viewMode: "split" | "editor" | "graph" | "preview"
  fullscreen: boolean
  loading: boolean
  selectedNodeId: string | null
  hoveredNodeId: string | null
  highlightedNodes: string[]
  collapsedNodes: string[]
  viewSettings: ViewSettings
  scale: number
  position: { x: number; y: number }
  searchQuery: string
  searchResults: string[]
  currentSearchIndex: number
}

interface MarkdownActions {
  setContent: (content: string) => void
  updateContent: (content: string) => void
  clearContent: () => void
  setViewMode: (mode: MarkdownState["viewMode"]) => void
  toggleFullscreen: () => void
  setLoading: (loading: boolean) => void
  selectNode: (nodeId: string | null) => void
  hoverNode: (nodeId: string | null) => void
  highlightNodes: (nodeIds: string[]) => void
  toggleNodeCollapse: (nodeId: string) => void
  expandAll: () => void
  collapseAll: () => void
  updateViewSettings: (settings: Partial<ViewSettings>) => void
  setScale: (scale: number) => void
  setPosition: (position: { x: number; y: number }) => void
  zoomIn: () => void
  zoomOut: () => void
  resetView: () => void
  setSearchQuery: (query: string) => void
  nextSearchResult: () => void
  prevSearchResult: () => void
  clearSearch: () => void
  refreshGraph: () => void
  getNodeById: (nodeId: string) => MarkdownNode | undefined
  getEdgesForNode: (nodeId: string) => MarkdownEdge[]
  getChildNodes: (nodeId: string) => MarkdownNode[]
  getParentNode: (nodeId: string) => MarkdownNode | undefined
}

// Full Markdown spec reference — used as the default editor content
const defaultContent = `# h1 Heading

## h2 Heading

### h3 Heading

#### h4 Heading

##### h5 Heading

###### h6 Heading

---

# Emphasis

Emphasis, aka italics, with *asterisks* or _underscores_.

Strong emphasis, aka bold, with **asterisks** or __underscores__.

Combined emphasis with **asterisks and _underscores_**.

Strikethrough uses two tildes. ~~Scratch this.~~

---

# Lists

1. First ordered list item
2. Another item
3. And another item

- Unordered list can use asterisks
- Or minuses
- Or pluses

---

# Task lists

- [x] Finish my changes
- [ ] Push my commits to GitHub
- [ ] Open a pull request

---

# Links

[I'm an inline-style link](https://www.google.com)

[I'm an inline-style link with title](https://www.google.com "Google's Homepage")

---

# Code and Syntax Highlighting

Inline \`code\` has \`back-ticks around\` it.

\`\`\`javascript
function hello() {
  console.log("Hello, MarkdownTree!");
}
\`\`\`

\`\`\`css
body {
  color: #F0F0F0;
  background: #600;
}
\`\`\`

---

# Tables

| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |

---

# Blockquotes

> Blockquotes are very handy in email to emulate reply text.
> This line is part of the same quote.

> This is a very long line that will still be quoted properly when it wraps.

---

# Images

![Markdown logo](https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png "Markdown Here")

---

# Horizontal Rules

---

***

___
`

export const initialState: MarkdownState = {
  content: defaultContent,
  graph: { nodes: [], edges: [] },
  hasChanges: false,
  viewMode: "split",
  fullscreen: false,
  loading: false,
  selectedNodeId: null,
  hoveredNodeId: null,
  highlightedNodes: [],
  collapsedNodes: [],
  viewSettings: {
    showMinimap: true,
    showOutline: false,
    graphDirection: "RIGHT",
    nodeSpacing: 60,
    edgeType: "smooth",
  },
  scale: 0.5,
  position: { x: 0, y: 0 },
  searchQuery: "",
  searchResults: [],
  currentSearchIndex: 0,
}

export const useMarkdown = create<MarkdownState & MarkdownActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      setContent: (content) => {
        const graph = parseMarkdown(content)
        set({ content, graph, hasChanges: false, loading: false })
      },

      updateContent: (content) => {
        const graph = parseMarkdown(content)
        set({ content, graph, hasChanges: true })
      },

      clearContent: () => {
        set({
          content: "",
          graph: { nodes: [], edges: [] },
          hasChanges: false,
          selectedNodeId: null,
          collapsedNodes: [],
          searchQuery: "",
          searchResults: [],
        })
      },

      setViewMode: (viewMode) => set({ viewMode }),
      toggleFullscreen: () => set((s) => ({ fullscreen: !s.fullscreen })),
      setLoading: (loading) => set({ loading }),
      selectNode: (nodeId) => set({ selectedNodeId: nodeId }),
      hoverNode: (nodeId) => set({ hoveredNodeId: nodeId }),
      highlightNodes: (nodeIds) => set({ highlightedNodes: nodeIds }),

      toggleNodeCollapse: (nodeId) => {
        const { collapsedNodes } = get()
        set({
          collapsedNodes: collapsedNodes.includes(nodeId)
            ? collapsedNodes.filter((id) => id !== nodeId)
            : [...collapsedNodes, nodeId],
        })
      },

      expandAll: () => set({ collapsedNodes: [] }),

      collapseAll: () => {
        const { graph } = get()
        const parentIds = graph.nodes
          .filter((n) => n.data?.isParent)
          .map((n) => n.id)
        set({ collapsedNodes: parentIds })
      },

      updateViewSettings: (settings) =>
        set((s) => ({ viewSettings: { ...s.viewSettings, ...settings } })),

      setScale: (scale) => set({ scale: Math.min(Math.max(scale, 0.05), 2) }),
      setPosition: (position) => set({ position }),
      zoomIn: () => set((s) => ({ scale: Math.min(s.scale + 0.1, 2) })),
      zoomOut: () => set((s) => ({ scale: Math.max(s.scale - 0.1, 0.05) })),
      resetView: () => set({ scale: 0.5, position: { x: 0, y: 0 } }),

      setSearchQuery: (query) => {
        if (!query) {
          set({ searchQuery: "", searchResults: [], currentSearchIndex: 0 })
          return
        }
        const { graph } = get()
        const q = query.toLowerCase()
        const results = graph.nodes
          .filter((n) => {
            const t = Array.isArray(n.text) ? n.text.join(" ") : (n.text ?? "")
            return t.toLowerCase().includes(q)
          })
          .map((n) => n.id)
        set({
          searchQuery: query,
          searchResults: results,
          currentSearchIndex: 0,
          highlightedNodes: results,
        })
      },

      nextSearchResult: () => {
        const { searchResults, currentSearchIndex } = get()
        if (!searchResults.length) return
        const next = (currentSearchIndex + 1) % searchResults.length
        set({ currentSearchIndex: next, selectedNodeId: searchResults[next] })
      },

      prevSearchResult: () => {
        const { searchResults, currentSearchIndex } = get()
        if (!searchResults.length) return
        const prev =
          currentSearchIndex === 0 ? searchResults.length - 1 : currentSearchIndex - 1
        set({ currentSearchIndex: prev, selectedNodeId: searchResults[prev] })
      },

      clearSearch: () =>
        set({
          searchQuery: "",
          searchResults: [],
          currentSearchIndex: 0,
          highlightedNodes: [],
        }),

      refreshGraph: () => {
        const { content } = get()
        set({ graph: parseMarkdown(content), loading: false })
      },

      getNodeById: (nodeId) => get().graph.nodes.find((n) => n.id === nodeId),

      getEdgesForNode: (nodeId) =>
        get().graph.edges.filter((e) => e.from === nodeId || e.to === nodeId),

      getChildNodes: (nodeId) => {
        const { graph } = get()
        const childIds = graph.edges.filter((e) => e.from === nodeId).map((e) => e.to)
        return graph.nodes.filter((n) => childIds.includes(n.id))
      },

      getParentNode: (nodeId) => {
        const { graph } = get()
        const edge = graph.edges.find((e) => e.to === nodeId)
        return edge ? graph.nodes.find((n) => n.id === edge.from) : undefined
      },
    }),
    {
      name: "markdowntree-v3",
      partialize: (state) => ({
        content: state.content,
        viewSettings: state.viewSettings,
        viewMode: state.viewMode,
      }),
    }
  )
)
