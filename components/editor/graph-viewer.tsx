"use client"

import { useEffect, useMemo, useRef } from "react"
import ReactFlow, {
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Panel,
  MarkerType,
  BackgroundVariant,
  Handle,
  Position,
  type Node,
  type Edge,
  type NodeProps,
} from "reactflow"
import "reactflow/dist/style.css"
import dagre from "@dagrejs/dagre"
import { useMarkdown } from "@/lib/store/use-markdown"
import { cn } from "@/lib/utils"
import type { MarkdownNode } from "@/lib/markdown/parser"

// ─── Node type colours ──────────────────────────────────────────────────────
const NODE_COLOURS: Record<string, string> = {
  heading:       "hsl(142 71% 45%)",
  paragraph:     "hsl(215 20% 65%)",
  codeBlock:     "hsl(270 60% 60%)",
  list:          "hsl(199 89% 48%)",
  blockquote:    "hsl(38 92% 50%)",
  table:         "hsl(316 68% 55%)",
  image:         "hsl(173 80% 40%)",
  link:          "hsl(142 71% 45%)",
  thematicBreak: "hsl(215 20% 50%)",
  default:       "hsl(215 20% 55%)",
}

// ─── Node data shape ─────────────────────────────────────────────────────────
interface MdNodeData {
  markdownNode: MarkdownNode
  isSelected: boolean
  isHighlighted: boolean
  onSelect: (id: string) => void
}

// ─── Custom node component ───────────────────────────────────────────────────
// IMPORTANT: This component must NOT call useMarkdown() — doing so creates a
// new closure on every render, which React Flow detects as a new nodeTypes
// object (error #002). Instead, onSelect is passed via node data.
function MarkdownNodeComponent({ data, id }: NodeProps<MdNodeData>) {
  const node = data.markdownNode
  const colour = NODE_COLOURS[node.type] ?? NODE_COLOURS.default

  const label = useMemo(() => {
    const raw = Array.isArray(node.text) ? node.text.join(" ") : (node.text ?? "")
    if (!raw || raw === "Document") return node.type
    return raw.length > 52 ? raw.slice(0, 49) + "…" : raw
  }, [node.text, node.type])

  const textClass =
    node.type === "heading"
      ? node.depth === 1 ? "text-sm font-bold"
      : node.depth === 2 ? "text-xs font-semibold"
      : "text-xs font-medium"
      : "text-xs"

  return (
    <>
      {/* Target handle — where incoming edges connect */}
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />

      <div
        onClick={() => data.onSelect(id)}
        className={cn(
          "rounded-md border px-3 py-2 cursor-pointer select-none",
          "min-w-[90px] max-w-[260px] w-fit",
          "transition-shadow duration-150",
          data.isSelected    && "shadow-[0_0_0_2px_var(--node-colour)]",
          data.isHighlighted && "shadow-[0_0_0_1px_var(--node-colour)]",
        )}
        style={{
          "--node-colour": colour,
          borderColor: colour,
          background: `color-mix(in srgb, ${colour} 14%, hsl(var(--card)))`,
        } as React.CSSProperties}
      >
        <div className="flex items-center gap-1.5">
          <span
            className="inline-block w-2 h-2 rounded-full flex-shrink-0"
            style={{ background: colour }}
          />
          <span className={cn("leading-tight text-foreground truncate", textClass)}>
            {label}
          </span>
        </div>
        {node.type === "codeBlock" && node.data?.language && (
          <span className="mt-0.5 text-[10px] text-muted-foreground font-mono block truncate">
            {node.data.language}
          </span>
        )}
      </div>

      {/* Source handle — where outgoing edges start */}
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
    </>
  )
}

// ─── NODE_TYPES: stable module-level constant — NEVER recreated ──────────────
const NODE_TYPES = { markdown: MarkdownNodeComponent } as const

// ─── Dagre layout helper ─────────────────────────────────────────────────────
function applyDagreLayout(
  nodes: Node[],
  edges: Edge[],
  direction: "LR" | "TB" | "RL" | "BT" = "LR",
  nodeSpacing = 80,
): Node[] {
  const g = new dagre.graphlib.Graph()
  g.setDefaultEdgeLabel(() => ({}))
  g.setGraph({
    rankdir: direction,
    nodesep: nodeSpacing,
    ranksep: nodeSpacing * 1.5,
    marginx: 24,
    marginy: 24,
  })

  nodes.forEach((node) => {
    g.setNode(node.id, { width: node.width ?? 200, height: node.height ?? 50 })
  })
  edges.forEach((edge) => {
    g.setEdge(edge.source, edge.target)
  })

  dagre.layout(g)

  return nodes.map((node) => {
    const pos = g.node(node.id)
    return {
      ...node,
      position: {
        x: pos.x - (node.width ?? 200) / 2,
        y: pos.y - (node.height ?? 50) / 2,
      },
    }
  })
}

// ─── Direction map ───────────────────────────────────────────────────────────
const DIR_MAP: Record<string, "LR" | "TB" | "RL" | "BT"> = {
  RIGHT: "LR",
  DOWN:  "TB",
  LEFT:  "RL",
  UP:    "BT",
}

// ─── Inner graph component (inside ReactFlowProvider) ────────────────────────
function GraphViewerInner() {
  const containerRef = useRef<HTMLDivElement>(null)

  const {
    graph,
    selectedNodeId,
    selectNode,
    highlightedNodes,
    collapsedNodes,
    viewSettings,
  } = useMarkdown()

  // Stable callback ref — never changes identity, safe to put in node data
  const selectNodeRef = useRef(selectNode)
  useEffect(() => { selectNodeRef.current = selectNode }, [selectNode])
  const stableSelectNode = useMemo(() => (id: string) => selectNodeRef.current(id), [])

  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  const collapsedSet = useMemo(() => new Set(collapsedNodes), [collapsedNodes])
  const highlightSet = useMemo(() => new Set(highlightedNodes), [highlightedNodes])

  // Build + layout nodes/edges whenever graph or view settings change
  useEffect(() => {
    if (!graph.nodes.length) {
      setNodes([])
      setEdges([])
      return
    }

    const direction = DIR_MAP[viewSettings.graphDirection] ?? "LR"
    const spacing = Math.max(viewSettings.nodeSpacing ?? 80, 60)

    // Build edge set for visibility — collapsed parents hide their subtree
    const hiddenIds = new Set<string>()
    const childMap = new Map<string, string[]>()
    graph.edges.forEach((e) => {
      if (!childMap.has(e.from)) childMap.set(e.from, [])
      childMap.get(e.from)!.push(e.to)
    })
    function markHidden(id: string) {
      childMap.get(id)?.forEach((childId) => {
        hiddenIds.add(childId)
        markHidden(childId)
      })
    }
    collapsedSet.forEach((id) => markHidden(id))

    const rfNodes: Node[] = graph.nodes
      .filter((n) => !hiddenIds.has(n.id))
      .map((n) => ({
        id: n.id,
        type: "markdown",
        position: { x: 0, y: 0 },
        width: n.width ?? 200,
        height: n.height ?? 50,
        data: {
          markdownNode: n,
          isSelected: n.id === selectedNodeId,
          isHighlighted: highlightSet.has(n.id),
          onSelect: stableSelectNode,
        } satisfies MdNodeData,
      }))

    const rfEdges: Edge[] = graph.edges
      .filter((e) => !hiddenIds.has(e.to) && !hiddenIds.has(e.from))
      .map((e) => ({
        id: e.id,
        source: e.from,
        target: e.to,
        type: viewSettings.edgeType === "straight" ? "straight" : "smoothstep",
        animated: false,
        style: { stroke: "hsl(var(--muted-foreground))", strokeWidth: 1.5, strokeOpacity: 0.5 },
        markerEnd: { type: MarkerType.ArrowClosed, width: 12, height: 12, color: "hsl(var(--muted-foreground))" },
      }))

    const laidOut = applyDagreLayout(rfNodes, rfEdges, direction, spacing)
    setNodes(laidOut)
    setEdges(rfEdges)
  }, [graph, selectedNodeId, stableSelectNode, highlightSet, collapsedSet, viewSettings, setNodes, setEdges])

  const nodeCount = nodes.length
  const edgeCount = edges.length

  return (
    <div ref={containerRef} className="h-full w-full bg-[hsl(var(--background))]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={NODE_TYPES}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        minZoom={0.05}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
        defaultEdgeOptions={{ type: "smoothstep" }}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="hsl(var(--muted-foreground) / 0.15)" />
        <Controls className="!bg-card !border-border [&>button]:!bg-card [&>button]:!border-border [&>button]:!text-foreground" />
        {viewSettings.showMinimap && (
          <MiniMap
            className="!bg-card !border !border-border"
            nodeColor={(n) => NODE_COLOURS[(n.data as { markdownNode: MarkdownNode }).markdownNode?.type] ?? NODE_COLOURS.default}
            maskColor="hsl(var(--background) / 0.7)"
          />
        )}
        <Panel position="top-right" className="flex gap-2 text-xs text-muted-foreground bg-card/80 border border-border rounded-md px-3 py-1.5 backdrop-blur-sm">
          <span>{nodeCount} nodes</span>
          <span className="opacity-40">|</span>
          <span>{edgeCount} edges</span>
        </Panel>
      </ReactFlow>
    </div>
  )
}

// ─── Public export — always wraps in ReactFlowProvider ───────────────────────
export function GraphViewer() {
  return (
    <ReactFlowProvider>
      <GraphViewerInner />
    </ReactFlowProvider>
  )
}
