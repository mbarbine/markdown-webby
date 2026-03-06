import {
  parseMarkdown,
  parseMarkdownToGraph,
  generateOutline,
  getDocumentStats,
  graphToMarkdown,
  MarkdownGraph,
} from "@/lib/markdown/parser"

describe("parseMarkdown", () => {
  it("returns a root Document node for empty input", () => {
    const result = parseMarkdown("")
    expect(result.nodes).toHaveLength(1)
    expect(result.nodes[0].text).toBe("Document")
    expect(result.nodes[0].type).toBe("paragraph")
    expect(result.edges).toHaveLength(0)
  })

  it("parses headings with correct depth", () => {
    const md = "# Title\n## Subtitle\n### Sub-subtitle"
    const result = parseMarkdown(md)

    const headings = result.nodes.filter((n) => n.type === "heading")
    expect(headings).toHaveLength(3)
    expect(headings[0].text).toBe("Title")
    expect(headings[0].depth).toBe(1)
    expect(headings[1].text).toBe("Subtitle")
    expect(headings[1].depth).toBe(2)
    expect(headings[2].text).toBe("Sub-subtitle")
    expect(headings[2].depth).toBe(3)
  })

  it("creates edges from headings to their parent", () => {
    const md = "# Title\n## Subtitle"
    const result = parseMarkdown(md)

    // root -> Title (heading level 1 connected to root)
    // Title -> Subtitle (heading level 2 connected to level 1)
    const headings = result.nodes.filter((n) => n.type === "heading")
    expect(headings).toHaveLength(2)

    // There should be edges connecting root->Title and Title->Subtitle
    expect(result.edges).toHaveLength(2)
    expect(result.edges[0].from).toBe(result.nodes[0].id) // root -> Title
    expect(result.edges[0].to).toBe(headings[0].id)
    expect(result.edges[1].from).toBe(headings[0].id) // Title -> Subtitle
    expect(result.edges[1].to).toBe(headings[1].id)
  })

  it("parses code blocks", () => {
    const md = "# Intro\n```javascript\nconsole.log('hi')\n```"
    const result = parseMarkdown(md)

    const codeBlocks = result.nodes.filter((n) => n.type === "codeBlock")
    expect(codeBlocks).toHaveLength(1)
    expect(codeBlocks[0].data.language).toBe("javascript")
    expect(codeBlocks[0].text).toBe("console.log('hi')")
  })

  it("parses code blocks without language", () => {
    const md = "```\nsome code\n```"
    const result = parseMarkdown(md)

    const codeBlocks = result.nodes.filter((n) => n.type === "codeBlock")
    expect(codeBlocks).toHaveLength(1)
    expect(codeBlocks[0].data.language).toBe("text")
  })

  it("parses unordered lists", () => {
    const md = "- Item 1\n- Item 2\n- Item 3"
    const result = parseMarkdown(md)

    const lists = result.nodes.filter((n) => n.type === "list")
    expect(lists).toHaveLength(1)
    expect(lists[0].text).toEqual(["Item 1", "Item 2", "Item 3"])
  })

  it("parses ordered lists", () => {
    const md = "1. First\n2. Second\n3. Third"
    const result = parseMarkdown(md)

    const lists = result.nodes.filter((n) => n.type === "list")
    expect(lists).toHaveLength(1)
    expect(lists[0].text).toEqual(["First", "Second", "Third"])
  })

  it("parses task lists", () => {
    const md = "- [x] Done\n- [ ] Not done"
    const result = parseMarkdown(md)

    const tasks = result.nodes.filter((n) => n.type === "task")
    expect(tasks).toHaveLength(1)
    expect(tasks[0].text).toEqual(["[x] Done", "[ ] Not done"])
  })

  it("parses blockquotes", () => {
    const md = "> This is a quote\n> With another line"
    const result = parseMarkdown(md)

    const quotes = result.nodes.filter((n) => n.type === "blockquote")
    expect(quotes).toHaveLength(1)
    expect(quotes[0].text).toBe("This is a quote\nWith another line")
  })

  it("parses images", () => {
    const md = '![Alt text](https://example.com/image.png "Title")'
    const result = parseMarkdown(md)

    const images = result.nodes.filter((n) => n.type === "image")
    expect(images).toHaveLength(1)
    expect(images[0].data.url).toBe("https://example.com/image.png")
    expect(images[0].data.alt).toBe("Alt text")
    expect(images[0].data.title).toBe("Title")
  })

  it("parses horizontal rules", () => {
    const md = "Some text\n\n---\n\nMore text"
    const result = parseMarkdown(md)

    const breaks = result.nodes.filter((n) => n.type === "thematicBreak")
    expect(breaks).toHaveLength(1)
  })

  it("parses tables", () => {
    const md = "| Header 1 | Header 2 |\n| --- | --- |\n| Cell 1 | Cell 2 |"
    const result = parseMarkdown(md)

    const tables = result.nodes.filter((n) => n.type === "table")
    expect(tables).toHaveLength(1)
    expect(tables[0].data.isParent).toBe(true)
  })

  it("parses paragraphs with links as link type", () => {
    const md = "Check out [Example](https://example.com) for more info."
    const result = parseMarkdown(md)

    const links = result.nodes.filter((n) => n.type === "link")
    expect(links).toHaveLength(1)
    expect(links[0].data.url).toBe("https://example.com")
  })

  it("parses plain paragraphs", () => {
    const md = "This is a simple paragraph."
    const result = parseMarkdown(md)

    const paragraphs = result.nodes.filter(
      (n) => n.type === "paragraph" && n.text !== "Document"
    )
    expect(paragraphs).toHaveLength(1)
    expect(paragraphs[0].text).toBe("This is a simple paragraph.")
  })

  it("calculates node widths and heights", () => {
    const md = "# Big Heading"
    const result = parseMarkdown(md)

    const heading = result.nodes.find((n) => n.type === "heading")
    expect(heading?.width).toBeGreaterThan(0)
    expect(heading?.height).toBeGreaterThan(0)
  })

  it("handles a complex document with multiple element types", () => {
    const md = `# Main Title

Some introductory text.

## Section One

- Item A
- Item B

\`\`\`python
print("hello")
\`\`\`

## Section Two

> A wise quote

![Logo](https://example.com/logo.png)

---

| Name | Value |
| --- | --- |
| Key | 42 |
`
    const result = parseMarkdown(md)

    expect(result.nodes.length).toBeGreaterThan(5)
    expect(result.edges.length).toBeGreaterThan(3)

    const types = result.nodes.map((n) => n.type)
    expect(types).toContain("heading")
    expect(types).toContain("paragraph")
    expect(types).toContain("list")
    expect(types).toContain("codeBlock")
    expect(types).toContain("blockquote")
    expect(types).toContain("image")
    expect(types).toContain("thematicBreak")
    expect(types).toContain("table")
  })

  it("updates root node children count", () => {
    const md = "# Title\n\nParagraph under root"
    const result = parseMarkdown(md)

    const root = result.nodes[0]
    expect(root.text).toBe("Document")
    expect(root.data.childrenCount).toBeGreaterThanOrEqual(1)
  })
})

describe("parseMarkdownToGraph alias", () => {
  it("is the same function as parseMarkdown", () => {
    expect(parseMarkdownToGraph).toBe(parseMarkdown)
  })
})

describe("generateOutline", () => {
  it("returns only headings with correct levels", () => {
    const md = "# Title\n\nSome text\n\n## Section\n\nMore text\n\n### Sub"
    const outline = generateOutline(md)

    expect(outline).toHaveLength(3)
    expect(outline[0].text).toBe("Title")
    expect(outline[0].level).toBe(1)
    expect(outline[1].text).toBe("Section")
    expect(outline[1].level).toBe(2)
    expect(outline[2].text).toBe("Sub")
    expect(outline[2].level).toBe(3)
  })

  it("returns empty array when no headings", () => {
    const md = "Just some text without headings."
    const outline = generateOutline(md)
    expect(outline).toHaveLength(0)
  })
})

describe("getDocumentStats", () => {
  it("counts characters, words, and lines", () => {
    const md = "Hello world\nSecond line"
    const stats = getDocumentStats(md)

    expect(stats.characters).toBe(md.length)
    expect(stats.words).toBe(4)
    expect(stats.lines).toBe(2)
  })

  it("counts headings, code blocks, links, and images", () => {
    const md = `# Title

Some [link](https://example.com)

\`\`\`js
code
\`\`\`

![img](https://example.com/img.png)
`
    const stats = getDocumentStats(md)

    expect(stats.headings).toBe(1)
    expect(stats.codeBlocks).toBe(1)
    expect(stats.links).toBe(1)
    expect(stats.images).toBe(1)
  })

  it("handles empty string", () => {
    const stats = getDocumentStats("")
    expect(stats.characters).toBe(0)
    expect(stats.words).toBe(0)
    expect(stats.lines).toBe(1) // empty string splits into ['']
    expect(stats.headings).toBe(0)
  })
})

describe("graphToMarkdown", () => {
  it("reconstructs markdown from a parsed graph", () => {
    const md = "# Title\n\nSome paragraph text."
    const graph = parseMarkdown(md)
    const result = graphToMarkdown(graph)

    expect(result).toContain("# Title")
    expect(result).toContain("Some paragraph text.")
  })

  it("reconstructs code blocks", () => {
    const md = "```javascript\nconsole.log('hi')\n```"
    const graph = parseMarkdown(md)
    const result = graphToMarkdown(graph)

    expect(result).toContain("```javascript")
    expect(result).toContain("console.log('hi')")
    expect(result).toContain("```")
  })

  it("reconstructs blockquotes", () => {
    const md = "> Quote text"
    const graph = parseMarkdown(md)
    const result = graphToMarkdown(graph)

    expect(result).toContain("> Quote text")
  })

  it("reconstructs horizontal rules", () => {
    const md = "Some text\n\n---\n\nMore text"
    const graph = parseMarkdown(md)
    const result = graphToMarkdown(graph)

    expect(result).toContain("---")
  })

  it("handles empty graph", () => {
    const graph: MarkdownGraph = { nodes: [], edges: [] }
    const result = graphToMarkdown(graph)
    expect(result).toBe("")
  })
})
