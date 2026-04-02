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
import * as dagre from "@dagrejs/dagre"
import { useShallow } from "zustand/react/shallow"
import { useMarkdown } from "@/lib/store/use-markdown"
import { cn } from "@/lib/utils"
import type { MarkdownNode } from "@/lib/markdown/parser"

// ─── Node type → colour ───────────────────────────────────────────────────────
const NODE_COLOURS: Record<string, string> = {
  heading:       "#22c55e",
  paragraph:     "#94a3b8",
  codeBlock:     "#a855f7",
  list:          "#38bdf8",
  task:          "#34d399",
  blockquote:    "#f59e0b",
  table:         "#ec4899",
  image:         "#14b8a6",
  link:          "#60a5fa",
  thematicBreak: "#64748b",
  default:       "#64748b",
}

// ─── Node data passed through ReactFlow ──────────────────────────────────────
interface MdNodeData {
  markdownNode: MarkdownNode
  isSelected: boolean
  isHighlighted: boolean
  onSelect: (id: string) => void
}

// ─── NODE WIDTH / HEIGHT — fixed for dagre layout ────────────────────────────
const NODE_W = 200
const NODE_H = 52

// ─── Custom node ──────────────────────────────────────────────────────────────
// CRITICAL: Must be a single DOM element (not a Fragment).
// Handles must be inside that element.
// Must NOT call useMarkdown() — causes error #002.
function MdNode({ data, id }: NodeProps<MdNodeData>) {
  const node = data.markdownNode
  const colour = NODE_COLOURS[node.type] ?? NODE_COLOURS.default

  const label = useMemo(() => {
    const raw = Array.isArray(node.text) ? node.text.join(" ") : (node.text ?? "")
    if (!raw || raw === "Document") return node.type
    return raw.length > 48 ? raw.slice(0, 45) + "\u2026" : raw
  }, [node.text, node.type])

  const textWeight =
    node.type === "heading"
      ? node.depth === 1 ? "font-bold text-sm"
      : node.depth === 2 ? "font-semibold text-xs"
      : "font-medium text-xs"
      : "text-xs"

  return (
    <div
      onClick={() => data.onSelect(id)}
      className={cn(
        "relative flex items-center gap-2 rounded-lg border px-3 cursor-pointer select-none",
        "transition-shadow duration-150 hover:shadow-md",
        data.isSelected && "ring-2 ring-offset-1",
        data.isHighlighted && "ring-1",
      )}
      style={{
        width: NODE_W,
        height: NODE_H,
        borderColor: colour,
        background: `color-mix(in srgb, ${colour} 12%, #0f172a)`,
        "--tw-ring-color": colour,
      } as React.CSSProperties}
    >
      {/* ReactFlow target handle */}
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: colour, width: 8, height: 8, border: "2px solid #0f172a" }}
      />

      {/* Colour dot */}
      <span
        className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0"
        style={{ background: colour }}
      />

      {/* Label */}
      <span
        className={cn("leading-tight text-slate-100 truncate flex-1", textWeight)}
        title={label}
      >
        {label}
      </span>

      {/* Code language badge */}
      {node.type === "codeBlock" && node.data?.language && (
        <span className="text-[9px] font-mono text-slate-400 flex-shrink-0">
          {node.data.language}
        </span>
      )}

      {/* ReactFlow source handle */}
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: colour, width: 8, height: 8, border: "2px solid #0f172a" }}
      />
    </div>
  )
}

// ─── NODE_TYPES — stable module-level constant ────────────────────────────────
// Never defined inside a component or hook — guarantees identity stability.
const NODE_TYPES = { md: MdNode } as const

// ─── Dagre layout ─────────────────────────────────────────────────────────────
const DIR_MAP: Record<string, "LR" | "TB" | "RL" | "BT"> = {
  RIGHT: "LR",
  DOWN: "TB",
  LEFT: "RL",
  UP: "BT",
}

function runDagre(
  nodes: Node[],
  edges: Edge[],
  direction: "LR" | "TB" | "RL" | "BT",
  spacing: number,
): Node[] {
  const g = new dagre.graphlib.Graph()
  g.setDefaultEdgeLabel(() => ({}))
  g.setGraph({
    rankdir: direction,
    nodesep: Math.max(spacing, 20),
    ranksep: Math.max(spacing * 1.8, 60),
    marginx: 24,
    marginy: 24,
  })
  nodes.forEach((n) => g.setNode(n.id, { width: NODE_W, height: NODE_H }))
  edges.forEach((e) => g.setEdge(e.source, e.target))
  dagre.layout(g)
  return nodes.map((n) => {
    const pos = g.node(n.id)
    return {
      ...n,
      position: {
        x: pos.x - NODE_W / 2,
        y: pos.y - NODE_H / 2,
      },
    }
  })
}

// ─── Inner viewer ─────────────────────────────────────────────────────────────
function GraphViewerInner() {
  // ⚡ Bolt: useShallow ensures the graph canvas only re-renders when relevant
  // data changes, significantly reducing jank during unrelated text edits.
  const { graph, selectedNodeId, highlightedNodes, collapsedNodes, viewSettings, selectNode } =
    useMarkdown(
      useShallow((state) => ({
        graph: state.graph,
        selectedNodeId: state.selectedNodeId,
        highlightedNodes: state.highlightedNodes,
        collapsedNodes: state.collapsedNodes,
        viewSettings: state.viewSettings,
        selectNode: state.selectNode,
      }))
    )

  // Stable onSelect via ref — never changes identity, safe in node data
  const selectRef = useRef(selectNode)
  useEffect(() => { selectRef.current = selectNode }, [selectNode])
  const onSelect = useRef((id: string) => selectRef.current(id)).current

  // Freeze nodeTypes reference with useRef — survives every render and HMR reload
  const nodeTypes = useRef(NODE_TYPES).current

  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])

  const collapsedSet = useMemo(() => new Set(collapsedNodes), [collapsedNodes])
  const highlightSet = useMemo(() => new Set(highlightedNodes), [highlightedNodes])

  // Cache the structural topology and layout to avoid O(V+E) recalculations on mere selection changes
  const baseLayout = useMemo(() => {
    if (!graph.nodes.length) {
      return { laidNodes: [], rfEdges: [] }
    }

    const direction = DIR_MAP[viewSettings.graphDirection] ?? "LR"
    const spacing   = Math.max(viewSettings.nodeSpacing ?? 60, 20)

    // Compute hidden node IDs (descendants of collapsed nodes)
    const childMap = new Map<string, string[]>()
    graph.edges.forEach((e) => {
      if (!childMap.has(e.from)) childMap.set(e.from, [])
      childMap.get(e.from)!.push(e.to)
    })
    const hiddenIds = new Set<string>()
    function markHidden(id: string) {
      for (const c of childMap.get(id) ?? []) {
        hiddenIds.add(c)
        markHidden(c)
      }
    }
    collapsedSet.forEach((id) => markHidden(id))

    // Build ReactFlow nodes (positions set by dagre next)
    const rfNodes: Node<MdNodeData>[] = graph.nodes
      .filter((n) => !hiddenIds.has(n.id))
      .map((n) => ({
        id:       n.id,
        type:     "md",
        position: { x: 0, y: 0 },
        width:    NODE_W,
        height:   NODE_H,
        data: {
          markdownNode:  n,
          isSelected:    false, // Will be updated in effect
          isHighlighted: false, // Will be updated in effect
          onSelect:      () => {}, // Placeholder, will be updated in effect
        },
      }))

    // Build edges — no sourceHandle / targetHandle (uses default handles)
    const rfEdges: Edge[] = graph.edges
      .filter((e) => !hiddenIds.has(e.from) && !hiddenIds.has(e.to))
      .map((e) => ({
        id:     e.id,
        source: e.from,
        target: e.to,
        type:   "smoothstep",
        animated: false,
        style: {
          stroke:      "hsl(215 20% 50%)",
          strokeWidth: 1.5,
          opacity:     0.7,
        },
        markerEnd: {
          type:   MarkerType.ArrowClosed,
          width:  10,
          height: 10,
          color:  "hsl(215 20% 50%)",
        },
      }))

    const laidNodes = runDagre(rfNodes, rfEdges, direction, spacing)
    return { laidNodes, rfEdges }
  }, [
    graph,
    collapsedSet,
    viewSettings.graphDirection,
    viewSettings.nodeSpacing,
  ])

  // Apply layout changes (ONLY when topology/baseLayout changes)
  useEffect(() => {
    if (!baseLayout.laidNodes.length) {
      setNodes([])
      setEdges([])
      return
    }

    setNodes(
      baseLayout.laidNodes.map((n) => ({
        ...n,
        data: {
          ...n.data,
          isSelected: n.id === selectedNodeId,
          isHighlighted: highlightSet.has(n.id),
          onSelect,
        },
      }))
    )
    setEdges(baseLayout.rfEdges)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseLayout, setNodes, setEdges]) // Intentionally omit selection state to avoid layout trashing

  // Update nodes with current selection state and callbacks without recalculating layout
  useEffect(() => {
    setNodes((nds) =>
      nds.map((n) => {
        const isSelected = n.id === selectedNodeId
        const isHighlighted = highlightSet.has(n.id)

        // Only clone and update if styling/selection state actually changed
        if (
          n.data.isSelected !== isSelected ||
          n.data.isHighlighted !== isHighlighted ||
          n.data.onSelect !== onSelect
        ) {
          return {
            ...n,
            data: {
              ...n.data,
              isSelected,
              isHighlighted,
              onSelect,
            },
          }
        }
        return n
      })
    )
  }, [selectedNodeId, highlightSet, onSelect, setNodes])

  return (
    <div className="h-full w-full bg-slate-950">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.12, includeHiddenNodes: false }}
        minZoom={0.05}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1}
          color="rgba(148,163,184,0.12)"
        />
        <Controls
          className="[&>button]:!bg-slate-800 [&>button]:!border-slate-700 [&>button]:!text-slate-300 [&>button:hover]:!bg-slate-700"
        />
        {viewSettings.showMinimap && (
          <MiniMap
            style={{ background: "#0f172a", border: "1px solid #1e293b" }}
            nodeColor={(n) =>
              NODE_COLOURS[(n.data as MdNodeData)?.markdownNode?.type] ?? NODE_COLOURS.default
            }
            maskColor="rgba(15,23,42,0.7)"
          />
        )}
        <Panel
          position="top-right"
          className="text-xs text-slate-400 bg-slate-900/80 border border-slate-700 rounded-md px-3 py-1.5 backdrop-blur-sm flex gap-2"
        >
          <span>{nodes.length} nodes</span>
          <span className="opacity-30">|</span>
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
