import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
  ExternalLink
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Code2 className="h-4 w-4" />
            </div>
            <span>{siteConfig.name}</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Docs
            </Link>
            <Link href="/api/docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              API
            </Link>
            <a 
              href={siteConfig.links.github} 
              target="_blank" 
              rel="noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              GitHub
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <a href={siteConfig.links.github} target="_blank" rel="noreferrer">
                <Github className="h-4 w-4 mr-2" />
                Star
              </a>
            </Button>
            <Button size="sm" asChild>
              <Link href="/editor">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="container relative py-24 md:py-32 lg:py-40">
          <div className="flex flex-col items-center text-center gap-8 max-w-4xl mx-auto">
            <Badge variant="secondary" className="px-4 py-1">
              <Sparkles className="h-3 w-3 mr-2" />
              AI-Powered Markdown Visualization
            </Badge>
            
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-balance">
              Transform Markdown into
              <span className="text-primary"> Interactive Graphs</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-2xl text-pretty">
              Visualize, edit, and explore your markdown documents like never before. 
              See the structure of your content as an interactive graph, with AI-powered 
              enhancements and seamless export capabilities.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Button size="lg" asChild>
                <Link href="/editor">
                  Open Editor
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/docs">
                  <FileText className="mr-2 h-4 w-4" />
                  Documentation
                </Link>
              </Button>
            </div>

            {/* Preview */}
            <div className="w-full mt-8 rounded-xl border border-border bg-card shadow-2xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/50">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="text-xs text-muted-foreground ml-2">{siteConfig.url}</span>
              </div>
              <div className="aspect-video bg-gradient-to-br from-muted via-card to-muted flex items-center justify-center">
                <div className="grid grid-cols-3 gap-4 p-8 w-full max-w-3xl">
                  {/* Editor Mock */}
                  <div className="col-span-1 bg-background rounded-lg border border-border p-4 space-y-2">
                    <div className="h-2 w-12 bg-primary/60 rounded" />
                    <div className="h-2 w-full bg-muted rounded" />
                    <div className="h-2 w-3/4 bg-muted rounded" />
                    <div className="h-2 w-16 bg-violet-500/60 rounded mt-4" />
                    <div className="h-2 w-full bg-muted rounded" />
                    <div className="h-2 w-2/3 bg-muted rounded" />
                    <div className="h-2 w-14 bg-amber-500/60 rounded mt-4" />
                    <div className="h-2 w-full bg-muted rounded" />
                  </div>
                  {/* Graph Mock */}
                  <div className="col-span-2 bg-background rounded-lg border border-border p-4 relative">
                    <svg className="w-full h-full" viewBox="0 0 200 120">
                      {/* Nodes */}
                      <rect x="10" y="45" width="40" height="30" rx="4" className="fill-emerald-500/20 stroke-emerald-500" strokeWidth="2" />
                      <rect x="70" y="20" width="40" height="25" rx="4" className="fill-violet-500/20 stroke-violet-500" strokeWidth="2" />
                      <rect x="70" y="55" width="40" height="25" rx="4" className="fill-amber-500/20 stroke-amber-500" strokeWidth="2" />
                      <rect x="70" y="90" width="40" height="25" rx="4" className="fill-blue-500/20 stroke-blue-500" strokeWidth="2" />
                      <rect x="130" y="35" width="40" height="20" rx="4" className="fill-muted stroke-muted-foreground" strokeWidth="1" />
                      <rect x="130" y="60" width="40" height="20" rx="4" className="fill-muted stroke-muted-foreground" strokeWidth="1" />
                      <rect x="130" y="85" width="40" height="20" rx="4" className="fill-muted stroke-muted-foreground" strokeWidth="1" />
                      {/* Edges */}
                      <line x1="50" y1="55" x2="70" y2="32" className="stroke-muted-foreground" strokeWidth="2" />
                      <line x1="50" y1="60" x2="70" y2="67" className="stroke-muted-foreground" strokeWidth="2" />
                      <line x1="50" y1="65" x2="70" y2="102" className="stroke-muted-foreground" strokeWidth="2" />
                      <line x1="110" y1="32" x2="130" y2="45" className="stroke-muted-foreground" strokeWidth="1" />
                      <line x1="110" y1="67" x2="130" y2="70" className="stroke-muted-foreground" strokeWidth="1" />
                      <line x1="110" y1="102" x2="130" y2="95" className="stroke-muted-foreground" strokeWidth="1" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-border bg-muted/30">
        <div className="container py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Powerful Features
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to work with markdown documents, all in one place.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-xl border border-border bg-card">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Network className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Graph Visualization</h3>
              <p className="text-muted-foreground">
                See your document structure as an interactive, zoomable graph. 
                Navigate complex documents with ease.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-xl border border-border bg-card">
              <div className="h-12 w-12 rounded-lg bg-violet-500/10 flex items-center justify-center mb-4">
                <Code2 className="h-6 w-6 text-violet-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Live Editor</h3>
              <p className="text-muted-foreground">
                Edit markdown with syntax highlighting, auto-completion, 
                and see changes reflected instantly in the graph.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-xl border border-border bg-card">
              <div className="h-12 w-12 rounded-lg bg-amber-500/10 flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-amber-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Enhancements</h3>
              <p className="text-muted-foreground">
                Leverage AI to summarize content, suggest improvements, 
                and enhance your documentation automatically.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-xl border border-border bg-card">
              <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                <Eye className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Multiple Views</h3>
              <p className="text-muted-foreground">
                Switch between editor, graph, split, and preview modes 
                to work the way you prefer.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-xl border border-border bg-card">
              <div className="h-12 w-12 rounded-lg bg-teal-500/10 flex items-center justify-center mb-4">
                <Download className="h-6 w-6 text-teal-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Export Anywhere</h3>
              <p className="text-muted-foreground">
                Export your documents as Markdown, HTML, JSON, or PNG. 
                Share your work in any format.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-xl border border-border bg-card">
              <div className="h-12 w-12 rounded-lg bg-pink-500/10 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-pink-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">MCP Ready</h3>
              <p className="text-muted-foreground">
                Built with Model Context Protocol support for seamless 
                integration with AI tools and workflows.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border">
        <div className="container py-24">
          <div className="flex flex-col items-center text-center gap-6 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to visualize your markdown?
            </h2>
            <p className="text-lg text-muted-foreground">
              Start exploring your documents in a whole new way. No signup required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link href="/editor">
                  Launch Editor
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href={siteConfig.links.github} target="_blank" rel="noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  View on GitHub
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30">
        <div className="container py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Code2 className="h-4 w-4" />
              </div>
              <span className="font-semibold">{siteConfig.name}</span>
            </div>
            
            <nav className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="/docs" className="hover:text-foreground transition-colors">
                Documentation
              </Link>
              <Link href="/api/docs" className="hover:text-foreground transition-colors">
                API
              </Link>
              <Link href="/privacy" className="hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">
                Terms
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <a 
                href={siteConfig.links.github}
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>Built by {siteConfig.creator}. Open source and available on GitHub.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
