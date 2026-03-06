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

const defaultContent = `# Welcome to MarkdownTree

Transform your markdown documents into interactive graph visualizations.

## Features

### Visual Editor
- **Live Preview**: See your changes in real-time
- **Graph View**: Visualize document structure
- **Split View**: Edit and preview side by side

### AI Enhancements
- Smart formatting suggestions
- Content summarization
- Auto-completion

## Getting Started

1. Write your markdown in the editor
2. Switch to Graph view to see the structure
3. Click on nodes to navigate
4. Export to various formats

## Code Example

\`\`\`javascript
function hello() {
  console.log("Hello, MarkdownTree!");
}
\`\`\`

> "The best way to understand complex documents is to visualize them."

## Links

[Visit our documentation](https://docs.platphormnews.com)

---

Made with love by Platphorm News
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
      name: "markdowntree-storage",
      partialize: (state) => ({
        content: state.content,
        viewSettings: state.viewSettings,
        viewMode: state.viewMode
      })
    }
  )
)
