import { MarkdownNodeType, markdownNodeTypes } from "@/lib/platphorm/config"

export interface MarkdownNode {
  id: string
  type: MarkdownNodeType
  text: string | string[]
  depth?: number
  data: {
    raw?: string
    language?: string
    url?: string
    title?: string
    alt?: string
    checked?: boolean
    isParent?: boolean
    childrenCount?: number
    startLine?: number
    endLine?: number
  }
  width?: number
  height?: number
  path?: string
}

export interface MarkdownEdge {
  id: string
  from: string
  to: string
  type?: "contains" | "follows" | "links"
}

export interface MarkdownGraph {
  nodes: MarkdownNode[]
  edges: MarkdownEdge[]
}

let nodeIdCounter = 0

function generateId(): string {
  return `md-node-${++nodeIdCounter}`
}

function resetIdCounter(): void {
  nodeIdCounter = 0
}

interface ParseState {
  nodes: MarkdownNode[]
  edges: MarkdownEdge[]
  currentLine: number
  parentStack: string[]
}

function calculateNodeSize(text: string | string[], type: MarkdownNodeType): { width: number; height: number } {
  const textContent = Array.isArray(text) ? text.join("\n") : text
  const lines = textContent.split("\n")
  const maxLineLength = Math.max(...lines.map(l => l.length), 10)
  
  const charWidth = 8
  const lineHeight = 20
  const padding = 32
  
  let baseWidth = Math.min(Math.max(maxLineLength * charWidth + padding, 120), 400)
  let baseHeight = lines.length * lineHeight + padding
  
  // Adjust based on node type
  switch (type) {
    case "heading":
      baseWidth = Math.max(baseWidth, 200)
      baseHeight = Math.max(baseHeight, 60)
      break
    case "codeBlock":
      baseWidth = Math.min(Math.max(baseWidth, 250), 500)
      baseHeight = Math.min(Math.max(baseHeight, 100), 300)
      break
    case "table":
      baseWidth = Math.max(baseWidth, 300)
      break
    case "image":
      baseWidth = 200
      baseHeight = 80
      break
    case "blockquote":
      baseWidth = Math.max(baseWidth, 200)
      break
    default:
      break
  }
  
  return { width: baseWidth, height: baseHeight }
}

function parseHeading(line: string): { level: number; text: string } | null {
  const match = line.match(/^(#{1,6})\s+(.+)$/)
  if (match) {
    return { level: match[1].length, text: match[2].trim() }
  }
  return null
}

function parseCodeBlockStart(line: string): { language: string } | null {
  const match = line.match(/^```(\w*)/)
  if (match) {
    return { language: match[1] || "text" }
  }
  return null
}

function parseListItem(line: string): { type: "ordered" | "unordered" | "task"; text: string; checked?: boolean; indent: number } | null {
  // Task list
  const taskMatch = line.match(/^(\s*)[-*+]\s+\[([ xX])\]\s+(.+)$/)
  if (taskMatch) {
    return {
      type: "task",
      text: taskMatch[3],
      checked: taskMatch[2].toLowerCase() === "x",
      indent: taskMatch[1].length
    }
  }
  
  // Unordered list
  const unorderedMatch = line.match(/^(\s*)[-*+]\s+(.+)$/)
  if (unorderedMatch) {
    return {
      type: "unordered",
      text: unorderedMatch[2],
      indent: unorderedMatch[1].length
    }
  }
  
  // Ordered list
  const orderedMatch = line.match(/^(\s*)\d+\.\s+(.+)$/)
  if (orderedMatch) {
    return {
      type: "ordered",
      text: orderedMatch[2],
      indent: orderedMatch[1].length
    }
  }
  
  return null
}

function parseBlockquote(line: string): string | null {
  const match = line.match(/^>\s*(.*)$/)
  if (match) {
    return match[1]
  }
  return null
}

function parseTableRow(line: string): string[] | null {
  if (line.includes("|")) {
    const cells = line.split("|").map(c => c.trim()).filter(c => c && !c.match(/^-+:?$/))
    if (cells.length > 0) {
      return cells
    }
  }
  return null
}

function parseLink(text: string): { text: string; url: string; title?: string }[] {
  const links: { text: string; url: string; title?: string }[] = []
  const linkRegex = /\[([^\]]+)\]\(([^)\s]+)(?:\s+"([^"]+)")?\)/g
  let match
  
  while ((match = linkRegex.exec(text)) !== null) {
    links.push({
      text: match[1],
      url: match[2],
      title: match[3]
    })
  }
  
  return links
}

function parseImage(line: string): { alt: string; url: string; title?: string } | null {
  const match = line.match(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]+)")?\)/)
  if (match) {
    return {
      alt: match[1],
      url: match[2],
      title: match[3]
    }
  }
  return null
}

function isHorizontalRule(line: string): boolean {
  return /^[-*_]{3,}\s*$/.test(line.trim())
}

export function parseMarkdown(markdown: string): MarkdownGraph {
  resetIdCounter()
  
  const state: ParseState = {
    nodes: [],
    edges: [],
    currentLine: 0,
    parentStack: []
  }
  
  const lines = markdown.split("\n")
  let i = 0
  
  // Root document node
  const rootId = generateId()
  const rootNode: MarkdownNode = {
    id: rootId,
    type: "paragraph",
    text: "Document",
    data: {
      isParent: true,
      childrenCount: 0
    },
    ...calculateNodeSize("Document", "paragraph")
  }
  state.nodes.push(rootNode)
  state.parentStack.push(rootId)
  
  let currentHeadingStack: { id: string; level: number }[] = []
  
  while (i < lines.length) {
    const line = lines[i]
    const trimmedLine = line.trim()
    
    // Skip empty lines
    if (trimmedLine === "") {
      i++
      continue
    }
    
    // Heading
    const heading = parseHeading(trimmedLine)
    if (heading) {
      const nodeId = generateId()
      const { width, height } = calculateNodeSize(heading.text, "heading")
      
      const node: MarkdownNode = {
        id: nodeId,
        type: "heading",
        text: heading.text,
        depth: heading.level,
        data: {
          raw: trimmedLine,
          isParent: true,
          childrenCount: 0,
          startLine: i
        },
        width,
        height
      }
      state.nodes.push(node)
      
      // Pop headings with same or higher level
      while (currentHeadingStack.length > 0 && currentHeadingStack[currentHeadingStack.length - 1].level >= heading.level) {
        currentHeadingStack.pop()
      }
      
      // Connect to parent heading or root
      const parentId = currentHeadingStack.length > 0 
        ? currentHeadingStack[currentHeadingStack.length - 1].id 
        : rootId
      
      state.edges.push({
        id: `edge-${parentId}-${nodeId}`,
        from: parentId,
        to: nodeId,
        type: "contains"
      })
      
      currentHeadingStack.push({ id: nodeId, level: heading.level })
      i++
      continue
    }
    
    // Code block
    const codeStart = parseCodeBlockStart(trimmedLine)
    if (codeStart) {
      const codeLines: string[] = []
      i++
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i])
        i++
      }
      
      const nodeId = generateId()
      const codeText = codeLines.join("\n")
      const { width, height } = calculateNodeSize(codeText, "codeBlock")
      
      const node: MarkdownNode = {
        id: nodeId,
        type: "codeBlock",
        text: codeText,
        data: {
          language: codeStart.language,
          raw: "```" + codeStart.language + "\n" + codeText + "\n```",
          startLine: state.currentLine
        },
        width,
        height
      }
      state.nodes.push(node)
      
      const parentId = currentHeadingStack.length > 0 
        ? currentHeadingStack[currentHeadingStack.length - 1].id 
        : rootId
      
      state.edges.push({
        id: `edge-${parentId}-${nodeId}`,
        from: parentId,
        to: nodeId,
        type: "contains"
      })
      
      i++
      continue
    }
    
    // Horizontal rule
    if (isHorizontalRule(trimmedLine)) {
      const nodeId = generateId()
      const node: MarkdownNode = {
        id: nodeId,
        type: "thematicBreak",
        text: "---",
        data: { raw: trimmedLine, startLine: i },
        width: 100,
        height: 30
      }
      state.nodes.push(node)
      
      const parentId = currentHeadingStack.length > 0 
        ? currentHeadingStack[currentHeadingStack.length - 1].id 
        : rootId
      
      state.edges.push({
        id: `edge-${parentId}-${nodeId}`,
        from: parentId,
        to: nodeId,
        type: "contains"
      })
      
      i++
      continue
    }
    
    // Image
    const image = parseImage(trimmedLine)
    if (image) {
      const nodeId = generateId()
      const { width, height } = calculateNodeSize(image.alt || "Image", "image")
      
      const node: MarkdownNode = {
        id: nodeId,
        type: "image",
        text: image.alt || "Image",
        data: {
          url: image.url,
          alt: image.alt,
          title: image.title,
          raw: trimmedLine,
          startLine: i
        },
        width,
        height
      }
      state.nodes.push(node)
      
      const parentId = currentHeadingStack.length > 0 
        ? currentHeadingStack[currentHeadingStack.length - 1].id 
        : rootId
      
      state.edges.push({
        id: `edge-${parentId}-${nodeId}`,
        from: parentId,
        to: nodeId,
        type: "contains"
      })
      
      i++
      continue
    }
    
    // Blockquote
    const quoteText = parseBlockquote(trimmedLine)
    if (quoteText !== null) {
      const quoteLines: string[] = [quoteText]
      i++
      while (i < lines.length) {
        const nextQuote = parseBlockquote(lines[i].trim())
        if (nextQuote !== null) {
          quoteLines.push(nextQuote)
          i++
        } else if (lines[i].trim() === "") {
          i++
          break
        } else {
          break
        }
      }
      
      const nodeId = generateId()
      const fullQuote = quoteLines.join("\n")
      const { width, height } = calculateNodeSize(fullQuote, "blockquote")
      
      const node: MarkdownNode = {
        id: nodeId,
        type: "blockquote",
        text: fullQuote,
        data: { raw: quoteLines.map(l => "> " + l).join("\n"), startLine: state.currentLine },
        width,
        height
      }
      state.nodes.push(node)
      
      const parentId = currentHeadingStack.length > 0 
        ? currentHeadingStack[currentHeadingStack.length - 1].id 
        : rootId
      
      state.edges.push({
        id: `edge-${parentId}-${nodeId}`,
        from: parentId,
        to: nodeId,
        type: "contains"
      })
      
      continue
    }
    
    // List items
    const listItem = parseListItem(trimmedLine)
    if (listItem) {
      // Create a list container
      const listId = generateId()
      const listItems: { text: string; checked?: boolean; type: string }[] = []
      
      while (i < lines.length) {
        const itemLine = lines[i].trim()
        const item = parseListItem(itemLine)
        if (item) {
          listItems.push({ text: item.text, checked: item.checked, type: item.type })
          i++
        } else if (itemLine === "") {
          i++
          // Check if next line is also a list item
          if (i < lines.length && parseListItem(lines[i].trim())) {
            continue
          }
          break
        } else {
          break
        }
      }
      
      const listText = listItems.map(item => {
        if (item.type === "task") {
          return `[${item.checked ? "x" : " "}] ${item.text}`
        }
        return item.text
      })
      
      const { width, height } = calculateNodeSize(listText.join("\n"), "list")
      
      const listNode: MarkdownNode = {
        id: listId,
        type: listItem.type === "task" ? "task" : "list",
        text: listText,
        data: {
          isParent: true,
          childrenCount: listItems.length,
          startLine: state.currentLine
        },
        width,
        height
      }
      state.nodes.push(listNode)
      
      const parentId = currentHeadingStack.length > 0 
        ? currentHeadingStack[currentHeadingStack.length - 1].id 
        : rootId
      
      state.edges.push({
        id: `edge-${parentId}-${listId}`,
        from: parentId,
        to: listId,
        type: "contains"
      })
      
      continue
    }
    
    // Table
    const tableRow = parseTableRow(trimmedLine)
    if (tableRow) {
      const tableRows: string[][] = [tableRow]
      i++
      
      while (i < lines.length) {
        const row = parseTableRow(lines[i])
        if (row) {
          tableRows.push(row)
          i++
        } else if (lines[i].trim() === "") {
          i++
          break
        } else {
          break
        }
      }
      
      // Filter out separator rows
      const filteredRows = tableRows.filter(row => !row.every(cell => cell.match(/^[-:]+$/)))
      
      if (filteredRows.length > 0) {
        const nodeId = generateId()
        const tableText = filteredRows.map(row => row.join(" | ")).join("\n")
        const { width, height } = calculateNodeSize(tableText, "table")
        
        const node: MarkdownNode = {
          id: nodeId,
          type: "table",
          text: filteredRows,
          data: {
            isParent: true,
            childrenCount: filteredRows.length,
            startLine: state.currentLine
          },
          width: Math.max(width, 300),
          height
        }
        state.nodes.push(node)
        
        const parentId = currentHeadingStack.length > 0 
          ? currentHeadingStack[currentHeadingStack.length - 1].id 
          : rootId
        
        state.edges.push({
          id: `edge-${parentId}-${nodeId}`,
          from: parentId,
          to: nodeId,
          type: "contains"
        })
      }
      
      continue
    }
    
    // Default: paragraph
    if (trimmedLine) {
      const paragraphLines: string[] = [trimmedLine]
      i++
      
      while (i < lines.length) {
        const nextLine = lines[i].trim()
        if (nextLine === "" || parseHeading(nextLine) || parseCodeBlockStart(nextLine) || 
            parseListItem(nextLine) || parseBlockquote(nextLine) || isHorizontalRule(nextLine) ||
            parseImage(nextLine)) {
          break
        }
        paragraphLines.push(nextLine)
        i++
      }
      
      const nodeId = generateId()
      const paragraphText = paragraphLines.join(" ")
      const { width, height } = calculateNodeSize(paragraphText, "paragraph")
      
      // Check for links in paragraph
      const links = parseLink(paragraphText)
      
      const node: MarkdownNode = {
        id: nodeId,
        type: links.length > 0 ? "link" : "paragraph",
        text: paragraphText,
        data: {
          raw: paragraphLines.join("\n"),
          startLine: state.currentLine,
          ...(links.length > 0 && { url: links[0].url })
        },
        width,
        height
      }
      state.nodes.push(node)
      
      const parentId = currentHeadingStack.length > 0 
        ? currentHeadingStack[currentHeadingStack.length - 1].id 
        : rootId
      
      state.edges.push({
        id: `edge-${parentId}-${nodeId}`,
        from: parentId,
        to: nodeId,
        type: "contains"
      })
      
      continue
    }
    
    i++
  }
  
  // Update root node children count
  const rootEdges = state.edges.filter(e => e.from === rootId)
  rootNode.data.childrenCount = rootEdges.length
  
  // Update all parent nodes' children count
  state.nodes.forEach(node => {
    if (node.data.isParent) {
      const childEdges = state.edges.filter(e => e.from === node.id)
      node.data.childrenCount = childEdges.length
    }
  })
  
  return {
    nodes: state.nodes,
    edges: state.edges
  }
}

export function graphToMarkdown(graph: MarkdownGraph): string {
  // Reconstruct markdown from graph (for export)
  const lines: string[] = []
  
  // Build tree structure
  const nodeMap = new Map(graph.nodes.map(n => [n.id, n]))
  const childrenMap = new Map<string, string[]>()
  
  graph.edges.forEach(edge => {
    if (!childrenMap.has(edge.from)) {
      childrenMap.set(edge.from, [])
    }
    childrenMap.get(edge.from)!.push(edge.to)
  })
  
  function processNode(nodeId: string): void {
    const node = nodeMap.get(nodeId)
    if (!node) return
    
    switch (node.type) {
      case "heading":
        lines.push("#".repeat(node.depth || 1) + " " + node.text)
        lines.push("")
        break
      case "paragraph":
        if (node.text !== "Document") {
          lines.push(Array.isArray(node.text) ? node.text.join("\n") : node.text)
          lines.push("")
        }
        break
      case "codeBlock":
        lines.push("```" + (node.data.language || ""))
        lines.push(Array.isArray(node.text) ? node.text.join("\n") : node.text)
        lines.push("```")
        lines.push("")
        break
      case "blockquote":
        const quoteText = Array.isArray(node.text) ? node.text : [node.text]
        quoteText.forEach(line => lines.push("> " + line))
        lines.push("")
        break
      case "list":
      case "task":
        const listText = Array.isArray(node.text) ? node.text : [node.text]
        listText.forEach(item => {
          if (node.type === "task") {
            lines.push("- " + item)
          } else {
            lines.push("- " + item)
          }
        })
        lines.push("")
        break
      case "image":
        lines.push(`![${node.data.alt || ""}](${node.data.url})`)
        lines.push("")
        break
      case "link":
        lines.push(Array.isArray(node.text) ? node.text.join("\n") : node.text)
        lines.push("")
        break
      case "table":
        if (Array.isArray(node.text) && Array.isArray(node.text[0])) {
          const rows = node.text as string[][]
          rows.forEach((row, idx) => {
            lines.push("| " + row.join(" | ") + " |")
            if (idx === 0) {
              lines.push("| " + row.map(() => "---").join(" | ") + " |")
            }
          })
          lines.push("")
        }
        break
      case "thematicBreak":
        lines.push("---")
        lines.push("")
        break
    }
    
    // Process children
    const children = childrenMap.get(nodeId) || []
    children.forEach(childId => processNode(childId))
  }
  
  // Find root nodes (nodes with no incoming edges)
  const targetNodes = new Set(graph.edges.map(e => e.to))
  const rootNodes = graph.nodes.filter(n => !targetNodes.has(n.id))
  
  rootNodes.forEach(node => processNode(node.id))
  
  return lines.join("\n").trim()
}
