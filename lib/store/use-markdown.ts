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
  // Content
  content: string
  graph: MarkdownGraph
  hasChanges: boolean
  
  // View state
  viewMode: "split" | "editor" | "graph" | "preview"
  fullscreen: boolean
  loading: boolean
  
  // Selection
  selectedNodeId: string | null
  hoveredNodeId: string | null
  highlightedNodes: string[]
  
  // Collapse state
  collapsedNodes: string[]
  
  // View settings
  viewSettings: ViewSettings
  
  // Zoom & pan
  scale: number
  position: { x: number; y: number }
  
  // Search
  searchQuery: string
  searchResults: string[]
  currentSearchIndex: number
}

interface MarkdownActions {
  // Content actions
  setContent: (content: string) => void
  updateContent: (content: string) => void
  clearContent: () => void
  
  // View actions
  setViewMode: (mode: MarkdownState["viewMode"]) => void
  toggleFullscreen: () => void
  setLoading: (loading: boolean) => void
  
  // Selection actions
  selectNode: (nodeId: string | null) => void
  hoverNode: (nodeId: string | null) => void
  highlightNodes: (nodeIds: string[]) => void
  
  // Collapse actions
  toggleNodeCollapse: (nodeId: string) => void
  expandAll: () => void
  collapseAll: () => void
  
  // View settings actions
  updateViewSettings: (settings: Partial<ViewSettings>) => void
  
  // Zoom & pan actions
  setScale: (scale: number) => void
  setPosition: (position: { x: number; y: number }) => void
  zoomIn: () => void
  zoomOut: () => void
  resetView: () => void
  
  // Search actions
  setSearchQuery: (query: string) => void
  nextSearchResult: () => void
  prevSearchResult: () => void
  clearSearch: () => void
  
  // Graph actions
  refreshGraph: () => void
  getNodeById: (nodeId: string) => MarkdownNode | undefined
  getEdgesForNode: (nodeId: string) => MarkdownEdge[]
  getChildNodes: (nodeId: string) => MarkdownNode[]
  getParentNode: (nodeId: string) => MarkdownNode | undefined
}

const defaultContent = `# Headers

# h1 Heading 8-)
## h2 Heading
### h3 Heading
#### h4 Heading
##### h5 Heading
###### h6 Heading

Alternatively, for H1 and H2, an underline-ish style:

Alt-H1
======

Alt-H2
------

------

# Emphasis

Emphasis, aka italics, with *asterisks* or _underscores_.

Strong emphasis, aka bold, with **asterisks** or __underscores__.

Combined emphasis with **asterisks and _underscores_**.

Strikethrough uses two tildes. ~~Scratch this.~~

------

# Lists

1. First ordered list item
2. Another item
3. Actual numbers don't matter, just that it's a number
4. And another item.

* Unordered list can use asterisks
- Or minuses
+ Or pluses

1. Make my changes
    1. Fix bug
    2. Improve formatting
2. Push my commits to GitHub
3. Open a pull request

------

# Task lists

- [x] Finish my changes
- [ ] Push my commits to GitHub
- [ ] Open a pull request
- [x] @mentions, #refs, [links](), **formatting**, and tags supported

------

# Links

[I'm an inline-style link](https://www.google.com)

[I'm an inline-style link with title](https://www.google.com "Google's Homepage")

------

# Images

![alt text](https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png "Logo Title Text 1")

------

# Code and Syntax Highlighting

Inline \`code\` has \`back-ticks around\` it.

\`\`\`javascript
function $initHighlight(block, cls) {
  try {
    if (cls.search(/\\bno\\-highlight\\b/) != -1)
      return process(block, true, 0x0F)
  } catch (e) {
    /* handle exception */
  }
}
\`\`\`

\`\`\`css
body {
  color: #F0F0F0;
  background: #600;
}
\`\`\`

------

# Tables

| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |

------

# Blockquotes

> Blockquotes are very handy in email to emulate reply text.
> This line is part of the same quote.

> This is a very long line that will still be quoted properly when it wraps.

------

# Horizontal Rules

Three or more...

---

Hyphens

***

Asterisks

------

# Inline HTML

<dl>
  <dt>Definition list</dt>
  <dd>Is something people use sometimes.</dd>
</dl>
`

const initialState: MarkdownState = {
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
    nodeSpacing: 80,
    edgeType: "smooth"
  },
  scale: 0.5,
  position: { x: 0, y: 0 },
  searchQuery: "",
  searchResults: [],
  currentSearchIndex: 0
}

export const useMarkdown = create<MarkdownState & MarkdownActions>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      // Content actions
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
          searchResults: []
        })
      },
      
      // View actions
      setViewMode: (viewMode) => set({ viewMode }),
      
      toggleFullscreen: () => set((state) => ({ fullscreen: !state.fullscreen })),
      
      setLoading: (loading) => set({ loading }),
      
      // Selection actions
      selectNode: (nodeId) => set({ selectedNodeId: nodeId }),
      
      hoverNode: (nodeId) => set({ hoveredNodeId: nodeId }),
      
      highlightNodes: (nodeIds) => set({ highlightedNodes: nodeIds }),
      
      // Collapse actions
      toggleNodeCollapse: (nodeId) => {
        const { collapsedNodes } = get()
        if (collapsedNodes.includes(nodeId)) {
          set({ collapsedNodes: collapsedNodes.filter(id => id !== nodeId) })
        } else {
          set({ collapsedNodes: [...collapsedNodes, nodeId] })
        }
      },
      
      expandAll: () => set({ collapsedNodes: [] }),
      
      collapseAll: () => {
        const { graph } = get()
        const parentNodes = graph.nodes.filter(n => n.data.isParent).map(n => n.id)
        set({ collapsedNodes: parentNodes })
      },
      
      // View settings actions
      updateViewSettings: (settings) => {
        set((state) => ({
          viewSettings: { ...state.viewSettings, ...settings }
        }))
      },
      
      // Zoom & pan actions
      setScale: (scale) => set({ scale: Math.min(Math.max(scale, 0.1), 2) }),
      
      setPosition: (position) => set({ position }),
      
      zoomIn: () => set((state) => ({ scale: Math.min(state.scale + 0.1, 2) })),
      
      zoomOut: () => set((state) => ({ scale: Math.max(state.scale - 0.1, 0.1) })),
      
      resetView: () => set({ scale: 0.5, position: { x: 0, y: 0 } }),
      
      // Search actions
      setSearchQuery: (query) => {
        if (!query) {
          set({ searchQuery: "", searchResults: [], currentSearchIndex: 0 })
          return
        }
        
        const { graph } = get()
        const results = graph.nodes
          .filter(node => {
            const text = Array.isArray(node.text) ? node.text.join(" ") : node.text
            return text.toLowerCase().includes(query.toLowerCase())
          })
          .map(node => node.id)
        
        set({ 
          searchQuery: query, 
          searchResults: results, 
          currentSearchIndex: 0,
          highlightedNodes: results
        })
      },
      
      nextSearchResult: () => {
        const { searchResults, currentSearchIndex } = get()
        if (searchResults.length === 0) return
        
        const nextIndex = (currentSearchIndex + 1) % searchResults.length
        set({ 
          currentSearchIndex: nextIndex,
          selectedNodeId: searchResults[nextIndex]
        })
      },
      
      prevSearchResult: () => {
        const { searchResults, currentSearchIndex } = get()
        if (searchResults.length === 0) return
        
        const prevIndex = currentSearchIndex === 0 ? searchResults.length - 1 : currentSearchIndex - 1
        set({ 
          currentSearchIndex: prevIndex,
          selectedNodeId: searchResults[prevIndex]
        })
      },
      
      clearSearch: () => {
        set({ 
          searchQuery: "", 
          searchResults: [], 
          currentSearchIndex: 0,
          highlightedNodes: []
        })
      },
      
      // Graph actions
      refreshGraph: () => {
        const { content } = get()
        const graph = parseMarkdown(content)
        set({ graph, loading: false })
      },
      
      getNodeById: (nodeId) => {
        const { graph } = get()
        return graph.nodes.find(n => n.id === nodeId)
      },
      
      getEdgesForNode: (nodeId) => {
        const { graph } = get()
        return graph.edges.filter(e => e.from === nodeId || e.to === nodeId)
      },
      
      getChildNodes: (nodeId) => {
        const { graph } = get()
        const childIds = graph.edges.filter(e => e.from === nodeId).map(e => e.to)
        return graph.nodes.filter(n => childIds.includes(n.id))
      },
      
      getParentNode: (nodeId) => {
        const { graph } = get()
        const parentEdge = graph.edges.find(e => e.to === nodeId)
        if (!parentEdge) return undefined
        return graph.nodes.find(n => n.id === parentEdge.from)
      }
    }),
    {
      name: "markdowntree-v4",
      partialize: (state) => ({
        content: state.content,
        viewSettings: state.viewSettings,
        viewMode: state.viewMode
      })
    }
  )
)
