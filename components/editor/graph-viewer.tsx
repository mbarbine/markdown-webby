"use client"

import { useEffect } from "react"
import {
  ReactFlow,
  ReactFlowProvider,
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  useReactFlow,
  NodeProps,
  Handle,
  Position,
  MarkerType,
  Panel,
} from "reactflow"
import "reactflow/dist/style.css"
import { useMarkdown } from "@/lib/store/use-markdown"
import { MarkdownNode } from "@/lib/markdown/parser"
import { markdownNodeTypes } from "@/lib/platphorm/config"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  Heading1,
  FileText,
  Code2,
  Link,
  Image,
  List,
  Quote,
  Table,
  Minus,
  CheckSquare,
  Hash,
} from "lucide-react"

const nodeTypeIcons: Record<string, React.ReactNode> = {
  heading: <Heading1 className="h-3.5 w-3.5" />,
  paragraph: <FileText className="h-3.5 w-3.5" />,
  codeBlock: <Code2 className="h-3.5 w-3.5" />,
  code: <Code2 className="h-3.5 w-3.5" />,
  link: <Link className="h-3.5 w-3.5" />,
  image: <Image className="h-3.5 w-3.5" />,
  list: <List className="h-3.5 w-3.5" />,
  listItem: <List className="h-3.5 w-3.5" />,
  blockquote: <Quote className="h-3.5 w-3.5" />,
  table: <Table className="h-3.5 w-3.5" />,
  thematicBreak: <Minus className="h-3.5 w-3.5" />,
  task: <CheckSquare className="h-3.5 w-3.5" />,
}

const nodeColorClasses: Record<string, string> = {
  heading: "border-emerald-500/70 bg-emerald-500/10",
  paragraph: "border-border/60 bg-card",
  codeBlock: "border-violet-500/70 bg-violet-500/10",
  code: "border-violet-500/70 bg-violet-500/10",
  link: "border-blue-500/70 bg-blue-500/10",
  image: "border-pink-500/70 bg-pink-500/10",
  list: "border-amber-500/70 bg-amber-500/10",
  listItem: "border-amber-400/50 bg-amber-500/5",
  blockquote: "border-purple-500/70 bg-purple-500/10",
  table: "border-teal-500/70 bg-teal-500/10",
  thematicBreak: "border-zinc-500/50 bg-zinc-500/10",
  task: "border-green-500/70 bg-green-500/10",
}

const NODE_W = 210
const NODE_H = 90
const H_GAP = 80
const V_GAP = 20

type GraphEdge = { from: string; to: string; id: string }

function computeLayout(
  graphNodes: MarkdownNode[],
  graphEdges: GraphEdge[],
  visibleIds: Set<string>,
  isHorizontal: boolean
): Map<string, { x: number; y: number }> {
  const childrenOf = new Map<string, string[]>()
  const parentOf = new Map<string, string>()
  graphEdges.forEach((e) => {
    if (!visibleIds.has(e.from) || !visibleIds.has(e.to)) return
    if (!childrenOf.has(e.from)) childrenOf.set(e.from, [])
    childrenOf.get(e.from)!.push(e.to)
    parentOf.set(e.to, e.from)
  })

  const rootIds = graphNodes
    .filter((n) => visibleIds.has(n.id) && !parentOf.has(n.id))
    .map((n) => n.id)

  // BFS depth
  const depth = new Map<string, number>()
  const bfsQ: { id: string; d: number }[] = rootIds.map((id) => ({ id, d: 0 }))
  while (bfsQ.length) {
    const item = bfsQ.shift()!
    depth.set(item.id, item.d)
    ;(childrenOf.get(item.id) ?? []).forEach((c) =>
      bfsQ.push({ id: c, d: item.d + 1 })
    )
  }

  // Iterative post-order
  const stack: string[] = [...rootIds]
  const postOrder: string[] = []
  while (stack.length) {
    const id = stack.pop()!
    postOrder.push(id)
    ;(childrenOf.get(id) ?? []).forEach((c) => stack.push(c))
  }
  postOrder.reverse()

  const prelim = new Map<string, number>()
  const modMap = new Map<string, number>()
  postOrder.forEach((id) => {
    const children = (childrenOf.get(id) ?? []).filter((c) => visibleIds.has(c))
    if (!children.length) {
      prelim.set(id, 0)
      modMap.set(id, 0)
      return
    }
    const slot = NODE_H + V_GAP
    children.forEach((c, i) => {
      prelim.set(c, i * slot)
      modMap.set(c, i * slot)
    })
    prelim.set(id, ((children.length - 1) * slot) / 2)
  })

  const crossAbs = new Map<string, number>()
  let rootOffset = 0
  rootIds.forEach((rootId) => {
    const preQ: { id: string; inherited: number }[] = [
      { id: rootId, inherited: rootOffset },
    ]
    let maxC = -Infinity
    while (preQ.length) {
      const { id, inherited } = preQ.shift()!
      const p = (prelim.get(id) ?? 0) - (modMap.get(id) ?? 0) + inherited
      crossAbs.set(id, p)
      if (p > maxC) maxC = p
      ;(childrenOf.get(id) ?? []).forEach((c) =>
        preQ.push({ id: c, inherited: p + (modMap.get(c) ?? 0) })
      )
    }
    rootOffset = maxC + (NODE_H + V_GAP) * 2
  })

  const MAIN_STEP = NODE_W + H_GAP
  const positions = new Map<string, { x: number; y: number }>()
  graphNodes.filter((n) => visibleIds.has(n.id)).forEach((n) => {
    const d = depth.get(n.id) ?? 0
    const cross = crossAbs.get(n.id) ?? 0
    positions.set(
      n.id,
      isHorizontal ? { x: d * MAIN_STEP, y: cross } : { x: cross, y: d * MAIN_STEP }
    )
  })
  return positions
}

interface CustomNodeData {
  markdownNode: MarkdownNode
  isSelected: boolean
  isHighlighted: boolean
  isCollapsed: boolean
}

function CustomNode({ data, id }: NodeProps<CustomNodeData>) {
  const { markdownNode, isSelected, isHighlighted, isCollapsed } = data
  const { selectNode, hoverNode, toggleNodeCollapse } = useMarkdown()
  const nodeConfig =
    markdownNodeTypes[markdownNode.type] ?? { label: "Node", color: "gray" }

  const rawText = Array.isArray(markdownNode.text)
    ? markdownNode.text.slice(0, 3).join("\n")
    : markdownNode.text
  const truncated =
    rawText.length > 120 ? rawText.slice(0, 120) + "…" : rawText
  const hasChildren = (markdownNode.data.childrenCount ?? 0) > 0

  return (
    <div
      className={cn(
        "rounded-md border shadow-sm cursor-pointer select-none transition-all duration-150",
        "hover:shadow-md hover:brightness-110",
        nodeColorClasses[markdownNode.type] ?? "border-border bg-card",
        isSelected &&
          "ring-2 ring-primary ring-offset-1 ring-offset-background shadow-lg",
        isHighlighted && "ring-2 ring-yellow-400 ring-offset-1"
      )}
      style={{ width: NODE_W }}
      onClick={() => selectNode(id)}
      onMouseEnter={() => hoverNode(id)}
      onMouseLeave={() => hoverNode(null)}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-primary/70 !w-1.5 !h-1.5 !border-0"
      />

      <div className="flex items-center gap-1.5 px-2.5 py-1.5 border-b border-border/40">
        <span className="text-muted-foreground shrink-0">
          {nodeTypeIcons[markdownNode.type] ?? (
            <Hash className="h-3.5 w-3.5" />
          )}
        </span>
        <span className="text-[11px] font-medium text-muted-foreground truncate flex-1">
          {nodeConfig.label}
        </span>
        {markdownNode.depth ? (
          <Badge variant="outline" className="text-[9px] px-1 py-0 h-4 shrink-0">
            H{markdownNode.depth}
          </Badge>
        ) : null}
        {markdownNode.data.language ? (
          <Badge
            variant="secondary"
            className="text-[9px] px-1 py-0 h-4 shrink-0 max-w-[60px] truncate"
          >
            {markdownNode.data.language}
          </Badge>
        ) : null}
        {hasChildren && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              toggleNodeCollapse(id)
            }}
            className="shrink-0 text-[10px] text-muted-foreground hover:text-foreground leading-none px-0.5"
            title={isCollapsed ? "Expand" : "Collapse"}
          >
            {isCollapsed ? `+${markdownNode.data.childrenCount}` : "−"}
          </button>
        )}
      </div>

      {markdownNode.type !== "thematicBreak" && (
        <div className="px-2.5 py-1.5">
          {markdownNode.type === "codeBlock" ? (
            <pre className="text-[10px] font-mono text-foreground/70 whitespace-pre-wrap overflow-hidden leading-4 max-h-16">
              {truncated}
            </pre>
          ) : markdownNode.type === "image" ? (
            <span className="text-[11px] text-foreground/70 truncate block">
              {markdownNode.data.alt ?? "Image"}
            </span>
          ) : markdownNode.type === "table" &&
            Array.isArray(markdownNode.text) ? (
            <div className="text-[11px]">
              <div className="font-medium text-foreground/80 truncate">
                {Array.isArray(markdownNode.text[0])
                  ? (markdownNode.text[0] as string[]).join(" | ")
                  : String(markdownNode.text[0])}
              </div>
              {markdownNode.text.length > 1 && (
                <div className="text-muted-foreground">
                  {markdownNode.text.length - 1} rows
                </div>
              )}
            </div>
          ) : (
            <p className="text-[11px] text-foreground/80 leading-4 whitespace-pre-wrap overflow-hidden max-h-12">
              {truncated}
            </p>
          )}
        </div>
      )}

      <Handle
        type="source"
        position={Position.Right}
        className="!bg-primary/70 !w-1.5 !h-1.5 !border-0"
      />
    </div>
  )
}

// Stable module-level reference — never recreated on render
const nodeTypes = { markdown: CustomNode }

function GraphViewerInner() {
  const {
    graph,
    selectedNodeId,
    highlightedNodes,
    collapsedNodes,
    viewSettings,
  } = useMarkdown()

  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const { fitView } = useReactFlow()

  const isHorizontal =
    viewSettings.graphDirection === "RIGHT" ||
    viewSettings.graphDirection === "LEFT"

  useEffect(() => {
    if (!graph.nodes.length) {
      setNodes([])
      setEdges([])
      return
    }

    const collapsedSet = new Set(collapsedNodes)

    // Determine visible nodes
    const parentOf = new Map<string, string>()
    graph.edges.forEach((e) => parentOf.set(e.to, e.from))

    function isVisible(id: string): boolean {
      const parent = parentOf.get(id)
      if (!parent) return true
      if (collapsedSet.has(parent)) return false
      return isVisible(parent)
    }

    const visibleIds = new Set<string>()
    graph.nodes.forEach((n) => {
      if (isVisible(n.id)) visibleIds.add(n.id)
    })

    const positions = computeLayout(
      graph.nodes,
      graph.edges,
      visibleIds,
      isHorizontal
    )

    const flowNodes: Node[] = graph.nodes
      .filter((n) => visibleIds.has(n.id))
      .map((n) => ({
        id: n.id,
        type: "markdown",
        position: positions.get(n.id) ?? { x: 0, y: 0 },
        data: {
          markdownNode: n,
          isSelected: selectedNodeId === n.id,
          isHighlighted: highlightedNodes.includes(n.id),
          isCollapsed: collapsedSet.has(n.id),
        } as CustomNodeData,
      }))

    const edgeType =
      viewSettings.edgeType === "smooth"
        ? "smoothstep"
        : viewSettings.edgeType === "step"
        ? "step"
        : "default"

    const flowEdges: Edge[] = graph.edges
      .filter((e) => visibleIds.has(e.from) && visibleIds.has(e.to))
      .map((e) => ({
        id: e.id,
        source: e.from,
        target: e.to,
        type: edgeType,
        animated: false,
        style: {
          stroke: "hsl(var(--muted-foreground))",
          strokeWidth: 1.5,
          opacity: 0.6,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "hsl(var(--muted-foreground))",
          width: 12,
          height: 12,
        },
      }))

    setNodes(flowNodes)
    setEdges(flowEdges)

    requestAnimationFrame(() => {
      fitView({ padding: 0.15, duration: 300 })
    })
  }, [
    graph,
    selectedNodeId,
    highlightedNodes,
    collapsedNodes,
    viewSettings,
    isHorizontal,
    setNodes,
    setEdges,
    fitView,
  ])

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        minZoom={0.05}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
        nodesDraggable
        nodesConnectable={false}
        elementsSelectable
      >
        <Background
          color="hsl(var(--muted-foreground) / 0.2)"
          gap={24}
          size={1}
        />
        <Controls
          className="!bg-card !border !border-border !shadow-md"
          showInteractive={false}
        />
        {viewSettings.showMinimap && (
          <MiniMap
            className="!bg-card !border !border-border"
            nodeColor={(node) => {
              const type = (node.data as CustomNodeData)?.markdownNode?.type
              const palette: Record<string, string> = {
                heading: "#22c55e",
                codeBlock: "#a855f7",
                link: "#3b82f6",
                list: "#f59e0b",
                blockquote: "#a855f7",
                table: "#14b8a6",
                image: "#ec4899",
                task: "#16a34a",
              }
              return palette[type] ?? "#64748b"
            }}
            maskColor="hsl(var(--background) / 0.75)"
            zoomable
            pannable
          />
        )}
        <Panel position="top-right" className="!m-2 !mt-3">
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground bg-card/90 backdrop-blur-sm px-2.5 py-1 rounded-md border border-border shadow-sm">
            <span>{nodes.length} nodes</span>
            <span className="opacity-40">|</span>
            <span>{edges.length} edges</span>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  )
}

export function GraphViewer() {
  return (
    <ReactFlowProvider>
      <GraphViewerInner />
    </ReactFlowProvider>
  )
}
