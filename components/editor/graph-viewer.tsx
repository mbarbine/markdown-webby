"use client"

import { useCallback, useEffect, useRef, useState } from "react"
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
  heading: "border-emerald-500 bg-emerald-500/10",
  paragraph: "border-border bg-card",
  codeBlock: "border-violet-500 bg-violet-500/10",
  code: "border-violet-500 bg-violet-500/10",
  link: "border-blue-500 bg-blue-500/10",
  image: "border-pink-500 bg-pink-500/10",
  list: "border-amber-500 bg-amber-500/10",
  listItem: "border-amber-500 bg-amber-500/10",
  blockquote: "border-purple-500 bg-purple-500/10",
  table: "border-teal-500 bg-teal-500/10",
  thematicBreak: "border-gray-500 bg-gray-500/10",
  task: "border-green-500 bg-green-500/10",
}

interface CustomNodeData {
  markdownNode: MarkdownNode
  isSelected: boolean
  isHighlighted: boolean
  isCollapsed: boolean
  onToggleCollapse: (nodeId: string) => void
}

function CustomNode({ data, id }: NodeProps<CustomNodeData>) {
  const { markdownNode, isSelected, isHighlighted, isCollapsed, onToggleCollapse } = data
  const { selectNode, hoverNode } = useMarkdown()
  const nodeConfig = markdownNodeTypes[markdownNode.type] || { label: "Unknown", color: "gray" }
  
  const text = Array.isArray(markdownNode.text) 
    ? markdownNode.text.slice(0, 3).join("\n") + (markdownNode.text.length > 3 ? "\n..." : "")
    : markdownNode.text

  const truncatedText = text.length > 100 ? text.slice(0, 100) + "..." : text

  return (
    <div
      className={cn(
        "rounded-lg border-2 shadow-sm transition-all duration-200 cursor-pointer",
        "hover:shadow-md hover:scale-[1.02]",
        nodeColorClasses[markdownNode.type] || "border-border bg-card",
        isSelected && "ring-2 ring-primary ring-offset-2 ring-offset-background shadow-lg scale-[1.02]",
        isHighlighted && "ring-2 ring-yellow-500 ring-offset-1"
      )}
      style={{
        minWidth: Math.max(markdownNode.width || 150, 150),
        maxWidth: Math.min(markdownNode.width || 300, 400),
      }}
      onClick={() => selectNode(id)}
      onMouseEnter={() => hoverNode(id)}
      onMouseLeave={() => hoverNode(null)}
    >
      <Handle type="target" position={Position.Left} className="!bg-primary !w-2 !h-2" />
      
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border/50">
        <span className="text-muted-foreground">
          {nodeTypeIcons[markdownNode.type] || <Hash className="h-3.5 w-3.5" />}
        </span>
        <span className="text-xs font-medium text-muted-foreground">
          {nodeConfig.label}
        </span>
        {markdownNode.depth && (
          <Badge variant="outline" className="text-[10px] px-1 py-0">
            H{markdownNode.depth}
          </Badge>
        )}
        {markdownNode.data.language && (
          <Badge variant="secondary" className="text-[10px] px-1 py-0">
            {markdownNode.data.language}
          </Badge>
        )}
        {markdownNode.data.childrenCount !== undefined && markdownNode.data.childrenCount > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onToggleCollapse(id)
            }}
            className="ml-auto text-xs text-muted-foreground hover:text-foreground"
          >
            {isCollapsed ? `+${markdownNode.data.childrenCount}` : `-`}
          </button>
        )}
      </div>
      
      {/* Content */}
      <div className="px-3 py-2">
        {markdownNode.type === "codeBlock" ? (
          <pre className="text-xs font-mono text-foreground/80 whitespace-pre-wrap overflow-hidden">
            {truncatedText}
          </pre>
        ) : markdownNode.type === "image" ? (
          <div className="flex items-center gap-2">
            <Image className="h-4 w-4 text-pink-500" />
            <span className="text-xs text-foreground/80 truncate">
              {markdownNode.data.alt || "Image"}
            </span>
          </div>
        ) : markdownNode.type === "table" && Array.isArray(markdownNode.text) ? (
          <div className="text-xs">
            <div className="font-medium text-foreground/90">
              {Array.isArray(markdownNode.text[0]) 
                ? (markdownNode.text[0] as string[]).join(" | ") 
                : markdownNode.text[0]}
            </div>
            {markdownNode.text.length > 1 && (
              <div className="text-muted-foreground mt-1">
                + {markdownNode.text.length - 1} rows
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-foreground/90 whitespace-pre-wrap">
            {truncatedText}
          </p>
        )}
      </div>

      <Handle type="source" position={Position.Right} className="!bg-primary !w-2 !h-2" />
    </div>
  )
}

const nodeTypes = {
  markdown: CustomNode,
}

function GraphViewerInner() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { graph, selectedNodeId, highlightedNodes, collapsedNodes, toggleNodeCollapse, viewSettings, scale, setScale, position, setPosition } = useMarkdown()
  
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  
  // Convert markdown graph to ReactFlow nodes and edges
  useEffect(() => {
    if (!graph.nodes.length) return

    // Filter out collapsed children
    const visibleNodeIds = new Set<string>()
    const collapsedSet = new Set(collapsedNodes)
    
    function isVisible(nodeId: string): boolean {
      // Check if any ancestor is collapsed
      const parentEdge = graph.edges.find(e => e.to === nodeId)
      if (!parentEdge) return true // Root node
      if (collapsedSet.has(parentEdge.from)) return false
      return isVisible(parentEdge.from)
    }
    
    graph.nodes.forEach(node => {
      if (isVisible(node.id)) {
        visibleNodeIds.add(node.id)
      }
    })

    // Create ReactFlow nodes with hierarchical layout
    const nodeMap = new Map(graph.nodes.map(n => [n.id, n]))
    const childrenMap = new Map<string, string[]>()
    
    graph.edges.forEach(edge => {
      if (!childrenMap.has(edge.from)) {
        childrenMap.set(edge.from, [])
      }
      childrenMap.get(edge.from)!.push(edge.to)
    })

    // Calculate positions using tree layout
    const positions = new Map<string, { x: number; y: number }>()
    const levelWidths: number[] = []
    const levelHeights: number[] = []
    
    const direction = viewSettings.graphDirection
    const isHorizontal = direction === "RIGHT" || direction === "LEFT"
    const spacing = viewSettings.nodeSpacing || 100
    const nodeGap = 30
    
    function calculateSubtreeSize(nodeId: string): { width: number; height: number } {
      const node = nodeMap.get(nodeId)
      if (!node || !visibleNodeIds.has(nodeId)) {
        return { width: 0, height: 0 }
      }
      
      const nodeWidth = node.width || 200
      const nodeHeight = node.height || 80
      
      const children = (childrenMap.get(nodeId) || []).filter(id => visibleNodeIds.has(id))
      
      if (children.length === 0 || collapsedSet.has(nodeId)) {
        return { width: nodeWidth, height: nodeHeight }
      }
      
      const childSizes = children.map(id => calculateSubtreeSize(id))
      
      if (isHorizontal) {
        const totalChildHeight = childSizes.reduce((sum, s) => sum + s.height, 0) + (children.length - 1) * nodeGap
        return {
          width: nodeWidth + spacing + Math.max(...childSizes.map(s => s.width)),
          height: Math.max(nodeHeight, totalChildHeight)
        }
      } else {
        const totalChildWidth = childSizes.reduce((sum, s) => sum + s.width, 0) + (children.length - 1) * nodeGap
        return {
          width: Math.max(nodeWidth, totalChildWidth),
          height: nodeHeight + spacing + Math.max(...childSizes.map(s => s.height))
        }
      }
    }
    
    function layoutNode(nodeId: string, x: number, y: number): void {
      const node = nodeMap.get(nodeId)
      if (!node || !visibleNodeIds.has(nodeId)) return
      
      positions.set(nodeId, { x, y })
      
      if (collapsedSet.has(nodeId)) return
      
      const children = (childrenMap.get(nodeId) || []).filter(id => visibleNodeIds.has(id))
      if (children.length === 0) return
      
      const nodeWidth = node.width || 200
      const nodeHeight = node.height || 80
      
      if (isHorizontal) {
        const childSizes = children.map(id => calculateSubtreeSize(id))
        const totalChildHeight = childSizes.reduce((sum, s) => sum + s.height, 0) + (children.length - 1) * nodeGap
        let currentY = y + (nodeHeight - totalChildHeight) / 2
        
        children.forEach((childId, i) => {
          layoutNode(childId, x + nodeWidth + spacing, currentY)
          currentY += childSizes[i].height + nodeGap
        })
      } else {
        const childSizes = children.map(id => calculateSubtreeSize(id))
        const totalChildWidth = childSizes.reduce((sum, s) => sum + s.width, 0) + (children.length - 1) * nodeGap
        let currentX = x + (nodeWidth - totalChildWidth) / 2
        
        children.forEach((childId, i) => {
          layoutNode(childId, currentX, y + nodeHeight + spacing)
          currentX += childSizes[i].width + nodeGap
        })
      }
    }
    
    // Find root nodes and layout
    const rootNodes = graph.nodes.filter(n => !graph.edges.some(e => e.to === n.id) && visibleNodeIds.has(n.id))
    let startY = 0
    
    rootNodes.forEach(rootNode => {
      layoutNode(rootNode.id, 0, startY)
      const subtreeSize = calculateSubtreeSize(rootNode.id)
      startY += (isHorizontal ? subtreeSize.height : subtreeSize.width) + spacing
    })

    // Create ReactFlow nodes
    const flowNodes: Node[] = graph.nodes
      .filter(node => visibleNodeIds.has(node.id))
      .map(node => {
        const pos = positions.get(node.id) || { x: 0, y: 0 }
        return {
          id: node.id,
          type: "markdown",
          position: pos,
          data: {
            markdownNode: node,
            isSelected: selectedNodeId === node.id,
            isHighlighted: highlightedNodes.includes(node.id),
            isCollapsed: collapsedSet.has(node.id),
            onToggleCollapse: toggleNodeCollapse,
          } as CustomNodeData,
        }
      })

    // Create ReactFlow edges
    const flowEdges: Edge[] = graph.edges
      .filter(edge => visibleNodeIds.has(edge.from) && visibleNodeIds.has(edge.to))
      .map(edge => ({
        id: edge.id,
        source: edge.from,
        target: edge.to,
        type: viewSettings.edgeType === "smooth" ? "smoothstep" : viewSettings.edgeType === "step" ? "step" : "default",
        animated: false,
        style: { stroke: "hsl(var(--muted-foreground))", strokeWidth: 2 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "hsl(var(--muted-foreground))",
          width: 15,
          height: 15,
        },
      }))

    setNodes(flowNodes)
    setEdges(flowEdges)
  }, [graph, selectedNodeId, highlightedNodes, collapsedNodes, viewSettings, toggleNodeCollapse, setNodes, setEdges])

  return (
    <div ref={containerRef} className="h-full w-full graph-canvas">
      <ReactFlow
        className="bg-canvas"
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.1}
        maxZoom={2}
        defaultViewport={{ x: 0, y: 0, zoom: scale }}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="hsl(var(--muted-foreground))" gap={20} size={1} />
        <Controls className="!bg-card !border-border" />
        {viewSettings.showMinimap && (
          <MiniMap 
            className="!bg-card !border-border"
            nodeColor={(node) => {
              const type = (node.data as CustomNodeData)?.markdownNode?.type
              switch (type) {
                case "heading": return "#22c55e"
                case "codeBlock": return "#a855f7"
                case "link": return "#3b82f6"
                case "list": return "#f59e0b"
                case "blockquote": return "#a855f7"
                case "table": return "#14b8a6"
                case "image": return "#ec4899"
                default: return "#64748b"
              }
            }}
            maskColor="hsl(var(--background) / 0.8)"
          />
        )}
        <Panel position="top-right" className="!m-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-card/80 backdrop-blur-sm px-2 py-1 rounded border border-border">
            <span>{nodes.length} nodes</span>
            <span>|</span>
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
