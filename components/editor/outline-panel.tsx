"use client"

import { useMemo, useEffect, useState } from "react"
import { useMarkdown } from "@/lib/store/use-markdown"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  ChevronRight, 
  ChevronDown, 
  Heading1, 
  Heading2, 
  Heading3, 
  Heading4,
  FileText,
  Code2,
  List,
  Quote,
  Table,
  Image,
  Link,
} from "lucide-react"

interface OutlineItem {
  id: string
  type: string
  text: string
  depth?: number
  children: OutlineItem[]
}

const typeIcons: Record<string, React.ReactNode> = {
  heading: <Heading1 className="h-3.5 w-3.5" />,
  paragraph: <FileText className="h-3.5 w-3.5" />,
  codeBlock: <Code2 className="h-3.5 w-3.5" />,
  list: <List className="h-3.5 w-3.5" />,
  blockquote: <Quote className="h-3.5 w-3.5" />,
  table: <Table className="h-3.5 w-3.5" />,
  image: <Image className="h-3.5 w-3.5" />,
  link: <Link className="h-3.5 w-3.5" />,
}

function getHeadingIcon(depth: number) {
  switch (depth) {
    case 1: return <Heading1 className="h-3.5 w-3.5" />
    case 2: return <Heading2 className="h-3.5 w-3.5" />
    case 3: return <Heading3 className="h-3.5 w-3.5" />
    default: return <Heading4 className="h-3.5 w-3.5" />
  }
}

interface OutlineItemProps {
  item: OutlineItem
  level: number
  selectedId: string | null
  collapsedIds: Set<string>
  onSelect: (id: string) => void
  onToggle: (id: string) => void
}

function OutlineItemComponent({ item, level, selectedId, collapsedIds, onSelect, onToggle }: OutlineItemProps) {
  const hasChildren = item.children.length > 0
  const isCollapsed = collapsedIds.has(item.id)
  const isSelected = selectedId === item.id

  const text = Array.isArray(item.text) ? item.text[0] : item.text
  const displayText = text.length > 40 ? text.slice(0, 40) + "..." : text

  return (
    <div>
      <button
        onClick={() => onSelect(item.id)}
        className={cn(
          "flex items-center gap-1.5 w-full px-2 py-1 text-left text-sm rounded-md transition-colors",
          "hover:bg-muted",
          isSelected && "bg-primary/10 text-primary"
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
      >
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onToggle(item.id)
            }}
            className="p-0.5 hover:bg-muted rounded"
          >
            {isCollapsed ? (
              <ChevronRight className="h-3 w-3 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            )}
          </button>
        ) : (
          <span className="w-4" />
        )}
        
        <span className="text-muted-foreground">
          {item.type === "heading" ? getHeadingIcon(item.depth || 1) : typeIcons[item.type] || <FileText className="h-3.5 w-3.5" />}
        </span>
        
        <span className={cn(
          "truncate",
          item.type === "heading" && "font-medium"
        )}>
          {displayText}
        </span>
      </button>
      
      {hasChildren && !isCollapsed && (
        <div>
          {item.children.map((child) => (
            <OutlineItemComponent
              key={child.id}
              item={child}
              level={level + 1}
              selectedId={selectedId}
              collapsedIds={collapsedIds}
              onSelect={onSelect}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function OutlinePanel() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const { graph, selectedNodeId, selectNode, collapsedNodes, toggleNodeCollapse } = useMarkdown()

  const outline = useMemo(() => {
    // Build hierarchical outline from graph
    const items: OutlineItem[] = []
    const nodeMap = new Map(graph.nodes.map(n => [n.id, n]))
    const childrenMap = new Map<string, string[]>()
    
    graph.edges.forEach(edge => {
      if (!childrenMap.has(edge.from)) {
        childrenMap.set(edge.from, [])
      }
      childrenMap.get(edge.from)!.push(edge.to)
    })

    function buildOutlineItem(nodeId: string): OutlineItem | null {
      const node = nodeMap.get(nodeId)
      if (!node) return null
      
      // Only include meaningful content in outline
      if (node.type !== "heading" && node.text === "Document") return null
      
      const children = (childrenMap.get(nodeId) || [])
        .map(id => buildOutlineItem(id))
        .filter((item): item is OutlineItem => item !== null)
      
      return {
        id: node.id,
        type: node.type,
        text: Array.isArray(node.text) ? node.text[0] : node.text,
        depth: node.depth,
        children: children.filter(c => c.type === "heading" || c.children.length > 0)
      }
    }

    // Find root nodes
    const targetNodes = new Set(graph.edges.map(e => e.to))
    const rootNodes = graph.nodes.filter(n => !targetNodes.has(n.id))
    
    rootNodes.forEach(root => {
      const item = buildOutlineItem(root.id)
      if (item) {
        // For the document root, just add its heading children
        if (item.text === "Document") {
          items.push(...item.children)
        } else {
          items.push(item)
        }
      }
    })

    return items
  }, [graph])

  const collapsedSet = useMemo(() => new Set(collapsedNodes), [collapsedNodes])

  // Avoid hydration mismatch — Zustand persisted state differs between server/client
  if (!mounted) return null

  if (outline.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <p className="text-sm text-muted-foreground text-center">
          No headings found. Add headings to see the document outline.
        </p>
      </div>
    )
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-2">
        <h3 className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Outline
        </h3>
        <div className="mt-2">
          {outline.map((item) => (
            <OutlineItemComponent
              key={item.id}
              item={item}
              level={0}
              selectedId={selectedNodeId}
              collapsedIds={collapsedSet}
              onSelect={selectNode}
              onToggle={toggleNodeCollapse}
            />
          ))}
        </div>
      </div>
    </ScrollArea>
  )
}
