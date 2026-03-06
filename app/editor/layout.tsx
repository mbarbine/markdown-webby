import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Editor",
  description:
    "The MarkdownTree editor — paste or write markdown and see it instantly transform into an interactive graph. Edit, explore, and export with AI assistance.",
  alternates: { canonical: "/editor" },
  openGraph: {
    title: "MarkdownTree Editor",
    description: "Visual markdown editor with graph visualization and AI assistance.",
    url: "https://markdown.platphormnews.com/editor",
  },
}

export default function EditorLayout({ children }: { children: React.ReactNode }) {
  return children
}
