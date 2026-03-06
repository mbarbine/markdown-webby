import Link from "next/link"
import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SiteFooter } from "@/components/site-footer"
import { JsonLd, generateFAQSchema } from "@/components/json-ld"
import { siteConfig } from "@/lib/platphorm/config"
import {
  ArrowRight,
  Code2,
  Network,
  Sparkles,
  Download,
  FileText,
  Zap,
  Eye,
  Github,
  Layers,
  Share2,
  Terminal,
} from "lucide-react"
import { ApiCodeBlock } from "@/components/landing/api-code-block"

export const metadata: Metadata = {
  title: "MarkdownTree — Visual Markdown Editor & Graph Viewer",
  description:
    "Transform any markdown document into an interactive graph visualization. Edit, explore, navigate and export with AI-powered enhancements. Free and open source.",
  alternates: { canonical: "/" },
}

const faqs = [
  {
    question: "What is MarkdownTree?",
    answer:
      "MarkdownTree is a visual markdown editor that transforms your documents into interactive graph visualizations, so you can see, navigate and understand document structure at a glance.",
  },
  {
    question: "Is MarkdownTree free?",
    answer:
      "Yes, MarkdownTree is completely free and open source under the MIT license.",
  },
  {
    question: "Does MarkdownTree store my documents?",
    answer:
      "No. Documents are processed entirely in your browser. Nothing is sent to or stored on our servers.",
  },
  {
    question: "What export formats does MarkdownTree support?",
    answer:
      "MarkdownTree supports export to Markdown, HTML, and JSON. PNG graph export is coming soon.",
  },
  {
    question: "Does MarkdownTree have an API?",
    answer:
      "Yes. MarkdownTree exposes a versioned REST API at /api/v1 with OpenAPI documentation at /api/docs. It is MCP-compatible for AI agent workflows.",
  },
]

const features = [
  {
    icon: Network,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    title: "Graph Visualization",
    description:
      "See every heading, paragraph, code block, and link as a navigable node in an interactive graph. Collapse subtrees, zoom, pan, and click to jump to source.",
  },
  {
    icon: Code2,
    color: "text-violet-500",
    bg: "bg-violet-500/10",
    title: "Monaco Editor",
    description:
      "Full-featured markdown editor powered by Monaco — the same engine as VS Code. Syntax highlighting, auto-pairs, and live graph updates as you type.",
  },
  {
    icon: Sparkles,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    title: "AI Enhancements",
    description:
      "Open the AI panel to improve writing, generate a table of contents, summarize sections, or ask questions about your document in natural language.",
  },
  {
    icon: Eye,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    title: "Four View Modes",
    description:
      "Switch between Editor, Graph, Split, and Preview. Resize panels freely. Toggle the document outline sidebar and minimap to fit your workflow.",
  },
  {
    icon: Download,
    color: "text-teal-500",
    bg: "bg-teal-500/10",
    title: "Export Anywhere",
    description:
      "Export to Markdown, clean HTML, or structured JSON. Share a URL that encodes your document so collaborators open it instantly, no signup needed.",
  },
  {
    icon: Zap,
    color: "text-pink-500",
    bg: "bg-pink-500/10",
    title: "MCP-Ready API",
    description:
      "Every feature is available via a versioned REST API with OpenAPI docs. Webhook delivery, structured events, and n8n-compatible payloads built in.",
  },
]

const stats = [
  { value: "100%", label: "Browser-native, no backend required" },
  { value: "4 views", label: "Editor · Split · Graph · Preview" },
  { value: "MIT", label: "Open source licence" },
  { value: "v1 API", label: "OpenAPI documented, MCP-compatible" },
]

export default function HomePage() {
  const faqSchema = generateFAQSchema(faqs)

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <JsonLd type="WebApplication" />
      <JsonLd type="Organization" />
      <JsonLd type="FAQPage" data={{ questions: faqSchema }} />

      {/* ── NAV ───────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70">
        <div className="container flex h-14 items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 font-semibold shrink-0">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Code2 className="h-4 w-4" />
            </span>
            <span className="hidden sm:block">{siteConfig.name}</span>
          </Link>

          <nav className="hidden md:flex items-center gap-5 text-sm text-muted-foreground">
            <Link href="/editor" className="hover:text-foreground transition-colors">Editor</Link>
            <Link href="/docs" className="hover:text-foreground transition-colors">Docs</Link>
            <Link href="/api/docs" className="hover:text-foreground transition-colors">API</Link>
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="sm" className="gap-1.5 hidden sm:flex" asChild>
              <a href={siteConfig.links.github} target="_blank" rel="noreferrer">
                <Github className="h-4 w-4" />
                GitHub
              </a>
            </Button>
            <Button size="sm" className="gap-1.5" asChild>
              <Link href="/editor">
                Open Editor
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="relative border-b border-border/50 overflow-hidden">
        {/* Dot grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage: "radial-gradient(circle, hsl(var(--border)) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        {/* Emerald glow */}
        <div
          className="absolute -top-40 -left-40 w-[600px] h-[600px] pointer-events-none"
          style={{
            background: "radial-gradient(circle, hsl(142 71% 45% / 0.08) 0%, transparent 70%)",
          }}
        />
        <div className="relative container py-24 md:py-40">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground mb-8 animate-fade-up backdrop-blur-sm">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              AI-powered · Open source · MCP-ready
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance leading-[1.04] animate-fade-up-1">
              Markdown as a{" "}
              <span className="text-primary">living graph.</span>
            </h1>

            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl text-pretty leading-relaxed animate-fade-up-2">
              MarkdownTree transforms any markdown document into an interactive node graph —
              structure, hierarchy, and relationships become immediately visible.
              Edit, explore, enhance with AI, and export in seconds.
            </p>

            <div className="mt-10 flex flex-wrap gap-3 animate-fade-up-3">
              <Button size="lg" className="gap-2 font-semibold" asChild>
                <Link href="/editor">
                  Open Editor <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="gap-2" asChild>
                <Link href="/docs">
                  <FileText className="h-4 w-4" />
                  Documentation
                </Link>
              </Button>
              <Button size="lg" variant="ghost" className="gap-2 text-muted-foreground" asChild>
                <a href={siteConfig.links.github} target="_blank" rel="noreferrer">
                  <Github className="h-4 w-4" />
                  Star on GitHub
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── LIVE DEMO PREVIEW ─────────────────────────────────────────── */}
      <section className="border-b border-border/50 bg-muted/20">
        <div className="container py-16">
          {/* Browser chrome */}
          <div className="rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/60 shrink-0">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-500/80" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="ml-3 text-xs font-mono text-muted-foreground">
                markdown.platphormnews.com/editor
              </span>
              <div className="ml-auto flex items-center gap-2">
                <div className="flex rounded-md border border-border bg-background text-xs overflow-hidden">
                  <span className="px-2 py-1 bg-secondary text-secondary-foreground font-medium">Split</span>
                  <span className="px-2 py-1 text-muted-foreground">Graph</span>
                  <span className="px-2 py-1 text-muted-foreground">Preview</span>
                </div>
              </div>
            </div>

            {/* Split view mock */}
            <div className="grid grid-cols-5 divide-x divide-border" style={{ minHeight: 360 }}>
              {/* Editor pane */}
              <div className="col-span-2 p-5 font-mono text-xs leading-6 text-foreground/80 bg-card overflow-hidden">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-emerald-500 font-bold text-sm">#</span>
                  <span className="text-foreground font-semibold">Project Architecture</span>
                </div>
                <div className="space-y-1 text-muted-foreground">
                  <div><span className="text-violet-500">##</span> Overview</div>
                  <div className="pl-4">System designed for global scale...</div>
                  <div className="mt-2"><span className="text-violet-500">##</span> Components</div>
                  <div className="pl-4"><span className="text-amber-500">-</span> Frontend layer</div>
                  <div className="pl-4"><span className="text-amber-500">-</span> API gateway</div>
                  <div className="pl-4"><span className="text-amber-500">-</span> Data pipeline</div>
                  <div className="mt-2"><span className="text-violet-500">###</span> API</div>
                  <div className="pl-4 text-xs font-mono bg-muted/60 rounded px-2 py-1 mt-1">
                    <span className="text-blue-400">GET</span>{" "}
                    <span className="text-emerald-400">/api/v1/transform</span>
                  </div>
                  <div className="mt-2"><span className="text-blue-400">[</span>Read docs<span className="text-blue-400">]</span>(https://...)</div>
                </div>
              </div>

              {/* Graph pane */}
              <div
                className="col-span-3 relative overflow-hidden"
                style={{
                  backgroundImage:
                    "radial-gradient(circle,hsl(var(--border)) 1px,transparent 1px)",
                  backgroundSize: "24px 24px",
                  backgroundColor: "hsl(var(--canvas-bg))",
                }}
              >
                <svg className="w-full h-full" viewBox="0 0 540 360" preserveAspectRatio="xMidYMid meet">
                  {/* Edges — animated dash */}
                  <line x1="80" y1="60" x2="200" y2="120" stroke="#22c55e" strokeWidth="1.5" strokeOpacity="0.45" className="edge-animated" />
                  <line x1="80" y1="60" x2="200" y2="210" stroke="#22c55e" strokeWidth="1.5" strokeOpacity="0.45" className="edge-animated" style={{ animationDelay: "0.2s" }} />
                  <line x1="200" y1="120" x2="340" y2="80" stroke="#a855f7" strokeWidth="1.5" strokeOpacity="0.4" className="edge-animated" style={{ animationDelay: "0.4s" }} />
                  <line x1="200" y1="120" x2="340" y2="140" stroke="#a855f7" strokeWidth="1.5" strokeOpacity="0.4" className="edge-animated" style={{ animationDelay: "0.6s" }} />
                  <line x1="200" y1="120" x2="340" y2="200" stroke="#a855f7" strokeWidth="1.5" strokeOpacity="0.4" className="edge-animated" style={{ animationDelay: "0.8s" }} />
                  <line x1="200" y1="210" x2="340" y2="280" stroke="#a855f7" strokeWidth="1.5" strokeOpacity="0.4" className="edge-animated" style={{ animationDelay: "0.5s" }} />
                  <line x1="340" y1="80" x2="460" y2="60" stroke="hsl(var(--muted-foreground))" strokeWidth="1" strokeOpacity="0.35" className="edge-animated" style={{ animationDelay: "0.7s" }} />
                  <line x1="340" y1="80" x2="460" y2="110" stroke="hsl(var(--muted-foreground))" strokeWidth="1" strokeOpacity="0.35" className="edge-animated" style={{ animationDelay: "0.9s" }} />

                  {/* Root node */}
                  <g>
                    <rect x="8" y="36" width="140" height="46" rx="8" fill="#22c55e22" stroke="#22c55e" strokeWidth="2" />
                    <text x="78" y="55" textAnchor="middle" fill="#22c55e" fontSize="9" fontWeight="600">H1</text>
                    <text x="78" y="70" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="10" fontWeight="500">Project Architecture</text>
                  </g>

                  {/* H2 nodes */}
                  <g>
                    <rect x="150" y="96" width="110" height="44" rx="7" fill="#a855f722" stroke="#a855f7" strokeWidth="1.5" />
                    <text x="205" y="113" textAnchor="middle" fill="#a855f7" fontSize="9" fontWeight="600">H2</text>
                    <text x="205" y="128" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="10">Overview</text>
                  </g>
                  <g>
                    <rect x="150" y="186" width="110" height="44" rx="7" fill="#a855f722" stroke="#a855f7" strokeWidth="1.5" />
                    <text x="205" y="203" textAnchor="middle" fill="#a855f7" fontSize="9" fontWeight="600">H2</text>
                    <text x="205" y="218" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="10">Components</text>
                  </g>

                  {/* H3 nodes */}
                  <g>
                    <rect x="290" y="58" width="100" height="40" rx="6" fill="#3b82f622" stroke="#3b82f6" strokeWidth="1.5" />
                    <text x="340" y="74" textAnchor="middle" fill="#3b82f6" fontSize="9" fontWeight="600">H3</text>
                    <text x="340" y="87" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="10">API</text>
                  </g>
                  <g>
                    <rect x="290" y="118" width="100" height="40" rx="6" fill="#f59e0b22" stroke="#f59e0b" strokeWidth="1.5" />
                    <text x="340" y="134" textAnchor="middle" fill="#f59e0b" fontSize="9" fontWeight="600">List</text>
                    <text x="340" y="147" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="10">Frontend layer</text>
                  </g>
                  <g>
                    <rect x="290" y="178" width="100" height="40" rx="6" fill="#f59e0b22" stroke="#f59e0b" strokeWidth="1.5" />
                    <text x="340" y="194" textAnchor="middle" fill="#f59e0b" fontSize="9" fontWeight="600">List</text>
                    <text x="340" y="207" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="10">API gateway</text>
                  </g>
                  <g>
                    <rect x="290" y="258" width="100" height="40" rx="6" fill="#a855f722" stroke="#a855f7" strokeWidth="1.5" />
                    <text x="340" y="274" textAnchor="middle" fill="#a855f7" fontSize="9" fontWeight="600">Code</text>
                    <text x="340" y="287" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="10">GET /api/v1/…</text>
                  </g>

                  {/* Leaf nodes */}
                  <g>
                    <rect x="400" y="42" width="90" height="34" rx="5" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1" />
                    <text x="445" y="62" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="9">Read docs</text>
                  </g>
                  <g>
                    <rect x="400" y="86" width="90" height="34" rx="5" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="1" />
                    <text x="445" y="106" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="9">Link ↗</text>
                  </g>

                  {/* Node count badge */}
                  <rect x="390" y="310" width="90" height="22" rx="6" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="1" />
                  <text x="435" y="325" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="8">9 nodes · 8 edges</text>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────────────── */}
      <section className="border-b border-border/50">
        <dl className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-border/60">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col gap-1.5 px-8 py-10">
              <dt className="text-4xl font-bold text-primary font-mono tracking-tight">{s.value}</dt>
              <dd className="text-sm text-muted-foreground leading-relaxed">{s.label}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────────────── */}
      <section className="border-b border-border/50 bg-muted/10">
        <div className="container py-24">
          <div className="mb-16 max-w-xl">
            <Badge variant="outline" className="mb-4">Features</Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-balance">
              Everything you need to master your markdown
            </h2>
            <p className="mt-4 text-muted-foreground text-pretty leading-relaxed">
              From a powerful Monaco editor to an AI assistant to a fully documented API —
              MarkdownTree is the tool you didn't know you were missing.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bento-card group hover:border-primary/40 transition-colors">
                <div className={`h-10 w-10 rounded-lg ${f.bg} flex items-center justify-center`}>
                  <f.icon className={`h-5 w-5 ${f.color}`} />
                </div>
                <h3 className="text-lg font-semibold">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────── */}
      <section className="border-b border-border/50">
        <div className="container py-24">
          <div className="mb-16 max-w-xl">
            <Badge variant="outline" className="mb-4">How it works</Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-balance">
              Paste. Explore. Export.
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", icon: FileText, title: "Paste or write", body: "Open the editor and paste your existing markdown, import a .md file, or start typing from scratch." },
              { step: "02", icon: Network, title: "Explore the graph", body: "Your document instantly becomes a zoomable, collapsible graph. Click any node to jump to it in the editor." },
              { step: "03", icon: Share2, title: "Export or share", body: "Export to Markdown, HTML or JSON. Copy a shareable URL to send your document — no account required." },
            ].map((item) => (
              <div key={item.step} className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-4xl font-bold text-primary/20 font-mono leading-none">{item.step}</span>
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── API CALLOUT ───────────────────────────────────────────────── */}
      <section className="border-b border-border/50 bg-muted/10">
        <div className="container py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="mb-4">For developers</Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-balance mb-4">
                A fully documented REST API
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Every feature is accessible via{" "}
                <code className="text-primary font-mono text-sm">/api/v1</code>. Transform
                markdown to graph JSON, stream AI enhancements, and receive structured
                webhooks. OpenAPI spec live at{" "}
                <code className="text-primary font-mono text-sm">/api/docs</code>.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" className="gap-2" asChild>
                  <Link href="/api/docs">
                    <Terminal className="h-4 w-4" />
                    API Reference
                  </Link>
                </Button>
                <Button variant="ghost" className="gap-2" asChild>
                  <Link href="/llms.txt">
                    <Layers className="h-4 w-4" />
                    LLM Discovery
                  </Link>
                </Button>
              </div>
            </div>
            <ApiCodeBlock />
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────── */}
      <section className="border-b border-border/50">
        <div className="container py-24 max-w-3xl">
          <Badge variant="outline" className="mb-6">FAQ</Badge>
          <h2 className="text-3xl font-bold tracking-tight mb-10">Common questions</h2>
          <div className="divide-y divide-border">
            {faqs.map((faq) => (
              <div key={faq.question} className="py-6">
                <h3 className="text-base font-semibold mb-2">{faq.question}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className="border-t border-border/50 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 50% 0%, hsl(142 71% 45% / 0.06) 0%, transparent 60%)",
          }}
        />
        <div className="relative container py-32 flex flex-col items-center text-center gap-6 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs text-primary mb-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary" />
            Free forever, no account required
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-balance leading-[1.1]">
            Ready to see your markdown differently?
          </h2>
          <p className="text-muted-foreground max-w-md text-pretty leading-relaxed text-lg">
            Paste any document and get an interactive graph in under a second. No signup, no install.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            <Button size="lg" className="gap-2 font-semibold px-8" asChild>
              <Link href="/editor">
                Launch Editor <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="gap-2" asChild>
              <a href={siteConfig.links.github} target="_blank" rel="noreferrer">
                <Github className="h-4 w-4" />
                View source
              </a>
            </Button>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
