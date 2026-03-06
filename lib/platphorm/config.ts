export const siteConfig = {
  name: "MarkdownTree",
  description: "Visual Markdown Editor & Graph Viewer - Transform markdown documents into interactive graph visualizations with AI-powered enhancements.",
  url: "https://markdown.platphormnews.com",
  ogImage: "https://markdown.platphormnews.com/og-image.jpg",
  links: {
    github: "https://github.com/mbarbine/markdown-webby",
    twitter: "https://twitter.com/platphormnews",
  },
  creator: "Platphorm News",
  version: "1.0.0",
  api: {
    version: "v1",
    basePath: "/api/v1",
  },
  features: {
    ai: true,
    mcp: true,
    collaboration: true,
    export: ["markdown", "json", "html", "pdf", "png"],
  },
  coinbase: "0x30589F2e1B8E9a48BBb2c66Ac012FE7ED2A7eB85",
}

export const markdownNodeTypes = {
  heading: { label: "Heading", color: "emerald" },
  paragraph: { label: "Paragraph", color: "slate" },
  code: { label: "Code", color: "violet" },
  codeBlock: { label: "Code Block", color: "violet" },
  link: { label: "Link", color: "blue" },
  image: { label: "Image", color: "pink" },
  list: { label: "List", color: "amber" },
  listItem: { label: "List Item", color: "amber" },
  blockquote: { label: "Quote", color: "purple" },
  table: { label: "Table", color: "teal" },
  tableRow: { label: "Table Row", color: "teal" },
  tableCell: { label: "Table Cell", color: "teal" },
  thematicBreak: { label: "Divider", color: "gray" },
  emphasis: { label: "Emphasis", color: "orange" },
  strong: { label: "Strong", color: "orange" },
  inlineCode: { label: "Inline Code", color: "violet" },
  html: { label: "HTML", color: "red" },
  footnote: { label: "Footnote", color: "cyan" },
  task: { label: "Task", color: "green" },
} as const

export type MarkdownNodeType = keyof typeof markdownNodeTypes
