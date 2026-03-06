"use client"

import { useEffect, useMemo, useRef } from "react"
import ReactFlow, {
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
  Panel,
  MarkerType,
  BackgroundVariant,
  type Node,
  type Edge,
  type NodeProps,
} from "reactflow"
import "reactflow/dist/style.css"
import dagre from "@dagrejs/dagre"
import { useMarkdown } from "@/lib/store/use-markdown"
import { cn } from "@/lib/utils"
import type { MarkdownNode } from "@/lib/markdown/parser"

// ─── Node colours ────────────────────────────────────────────────────────────
const NODE_COLOURS: Record<string, string> = {
  heading:      "hsl(142 71% 45%)",
  paragraph:    "hsl(215 20% 65%)",
  codeBlock:    "hsl(270 60% 60%)",
  list:         "hsl(199 89% 48%)",
  blockquote:   "hsl(38 92% 50%)",
  table:        "hsl(316 68% 55%)",
  image:        "hsl(173 80% 40%)",
  link:         "hsl(142 71% 45%)",
  thematicBreak:"hsl(215 20% 50%)",
  default:      "hsl(215 20% 55%)",
}

// ─── Node data shape ──────────────────────────────────────────────────────────
interface MdNodeData {
  markdownNode: MarkdownNode
  isSelected: boolean
  isHighlighted: boolean
  onSelect: (id: string) => void
}

// ─── Custom node ──────────────────────────────────────────────────────────────
// Must NOT call useMarkdown() here — that would cause React Flow error #002
// by creating a new closure for the component on every Zustand re-render.
// onSelect is passed through node data instead.
function MarkdownNodeComponent({ data, id }: NodeProps<MdNodeData>) {
  const node = data.markdownNode
  const colour = NODE_COLOURS[node.type] ?? NODE_COLOURS.default

  const label = useMemo(() => {
    const raw = Array.isArray(node.text) ? node.text.join(" ") : (node.text ?? "")
    if (!raw || raw === "Document") return node.type
    return raw.length > 52 ? raw.slice(0, 49) + "\u2026" : raw
  }, [node.text, node.type])

  const textClass =
    node.type === "heading"
      ? node.depth === 1 ? "text-sm font-bold"
      : node.depth === 2 ? "text-xs font-semibold"
      : "text-xs font-medium"
    : "text-xs"

  return (
    <>
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <div
        onClick={() => data.onSelect(id)}
        className={cn(
          "rounded-md border px-3 py-2 cursor-pointer select-none",
          "min-w-[90px] max-w-[260px] w-fit",
          "transition-shadow duration-150",
          data.isSelected    && "ring-2 ring-offset-1",
          data.isHighlighted && "ring-1",
        )}
        style={{
          borderColor: colour,
          background: `color-mix(in srgb, ${colour} 14%, hsl(var(--card)))`,
          "--tw-ring-color": colour,
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
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
    </>
  )
}

// ─── NODE_TYPES — module-level stable constant ────────────────────────────────
// Defined here once. Additionally frozen via useRef inside GraphViewerInner
// to survive HMR reloads (the true cause of React Flow error #002).
const NODE_TYPES = { markdown: MarkdownNodeComponent } as const

// ─── Dagre layout ─────────────────────────────────────────────────────────────
function applyDagreLayout(
  nodes: Node[],
  edges: Edge[],
  direction: "LR" | "TB" | "RL" | "BT",
  nodeSpacing: number,
): Node[] {
  const g = new dagre.graphlib.Graph()
  g.setDefaultEdgeLabel(() => ({}))
  g.setGraph({
    rankdir: direction,
    nodesep: nodeSpacing,
    ranksep: Math.round(nodeSpacing * 1.6),
    marginx: 32,
    marginy: 32,
  })
  nodes.forEach((n) => g.setNode(n.id, { width: n.width ?? 200, height: n.height ?? 48 }))
  edges.forEach((e) => g.setEdge(e.source, e.target))
  dagre.layout(g)
  return nodes.map((n) => {
    const pos = g.node(n.id)
    return { ...n, position: { x: pos.x - (n.width ?? 200) / 2, y: pos.y - (n.height ?? 48) / 2 } }
  })
}

const DIR_MAP: Record<string, "LR" | "TB" | "RL" | "BT"> = {
  RIGHT: "LR", DOWN: "TB", LEFT: "RL", UP: "BT",
}

// ─── Inner component ──────────────────────────────────────────────────────────
function GraphViewerInner() {
  const {
    graph,
    selectedNodeId,
    highlightedNodes,
    collapsedNodes,
    viewSettings,
    selectNode,
  } = useMarkdown()

  // Stable callback via ref — onSelect identity never changes
  const selectNodeRef = useRef(selectNode)
  useEffect(() => { selectNodeRef.current = selectNode }, [selectNode])
  const stableOnSelect = useRef((id: string) => selectNodeRef.current(id)).current

  // Freeze nodeTypes identity with useRef — survives every render + HMR reload.
  // React Flow error #002 fires when nodeTypes reference changes between renders.
  // module-level constant + useRef = permanently same object identity.
  const stableNodeTypes = useRef(NODE_TYPES).current

  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  const collapsedSet = useMemo(() => new Set(collapsedNodes), [collapsedNodes])
  const highlightSet = useMemo(() => new Set(highlightedNodes), [highlightedNodes])

  useEffect(() => {
    if (!graph.nodes.length) { setNodes([]); setEdges([]); return }

    const direction = DIR_MAP[viewSettings.graphDirection] ?? "LR"
    const spacing   = Math.max(viewSettings.nodeSpacing ?? 60, 40)

    // Collect hidden node ids (children of collapsed nodes)
    const hiddenIds = new Set<string>()
    const childMap  = new Map<string, string[]>()
    graph.edges.forEach((e) => {
      if (!childMap.has(e.from)) childMap.set(e.from, [])
      childMap.get(e.from)!.push(e.to)
    })
    function markHidden(id: string) {
      for (const c of childMap.get(id) ?? []) { hiddenIds.add(c); markHidden(c) }
    }
    collapsedSet.forEach((id) => markHidden(id))

    const rfNodes: Node[] = graph.nodes
      .filter((n) => !hiddenIds.has(n.id))
      .map((n) => ({
        id: n.id,
        type: "markdown",
        position: { x: 0, y: 0 },
        width:  n.width  ?? 200,
        height: n.height ?? 48,
        data: {
          markdownNode: n,
          isSelected:   n.id === selectedNodeId,
          isHighlighted: highlightSet.has(n.id),
          onSelect:     stableOnSelect,
        } satisfies MdNodeData,
      }))

    const rfEdges: Edge[] = graph.edges
      .filter((e) => !hiddenIds.has(e.to) && !hiddenIds.has(e.from))
      .map((e) => ({
        id:     e.id,
        source: e.from,
        target: e.to,
        type: viewSettings.edgeType === "straight" ? "straight" : "smoothstep",
        animated: false,
        style: { stroke: "hsl(var(--muted-foreground))", strokeWidth: 1.5, opacity: 0.6 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 12, height: 12,
          color: "hsl(var(--muted-foreground))",
        },
      }))

    const laidOut = applyDagreLayout(rfNodes, rfEdges, direction, spacing)
    setNodes(laidOut)
    setEdges(rfEdges)
  }, [graph, selectedNodeId, stableOnSelect, highlightSet, collapsedSet, viewSettings, setNodes, setEdges])

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={stableNodeTypes}
        fitView
        fitViewOptions={{ padding: 0.12 }}
        minZoom={0.05}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="hsl(var(--muted-foreground) / 0.15)"
        />
        <Controls
          className="!bg-card !border-border [&>button]:!bg-card [&>button]:!border-border [&>button]:!text-foreground"
        />
        {viewSettings.showMinimap && (
          <MiniMap
            className="!bg-card !border !border-border"
            nodeColor={(n) =>
              NODE_COLOURS[(n.data as MdNodeData).markdownNode?.type] ?? NODE_COLOURS.default
            }
            maskColor="hsl(var(--background) / 0.7)"
          />
        )}
        <Panel
          position="top-right"
          className="flex gap-2 text-xs text-muted-foreground bg-card/80 border border-border rounded-md px-3 py-1.5 backdrop-blur-sm"
        >
          <span>{nodes.length} nodes</span>
          <span className="opacity-40">|</span>
          <span>{edges.length} edges</span>
        </Panel>
      </ReactFlow>
    </div>
  )
}

// ─── Public export ────────────────────────────────────────────────────────────
export function GraphViewer() {
  return (
    <ReactFlowProvider>
      <GraphViewerInner />
    </ReactFlowProvider>
  )
}
