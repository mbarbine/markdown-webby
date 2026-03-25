import { Button } from "@/components/ui/button"
import { siteConfig } from "@/lib/platphorm/config"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ExternalLink, Code2, FileJson, Sparkles, Download, FileText, Network, Plug, Globe } from "lucide-react"

export const metadata = {
  title: `📚 Documentation - ${siteConfig.name}`,
  description: `API documentation, MCP integration, and guides for ${siteConfig.name}`,
}

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <Badge className="mb-4">v{siteConfig.version}</Badge>
            <h1 className="text-4xl font-bold mb-4">📚 Documentation</h1>
            <p className="text-lg text-muted-foreground">
              Learn how to use {siteConfig.name} and integrate with our API and MCP endpoints.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 mb-12">
            <Link 
              href="/editor" 
              className="group rounded-lg border border-border bg-card p-6 hover:border-primary transition-colors"
            >
              <div className="flex items-center gap-2 mb-4">
                <Code2 className="h-8 w-8 text-primary" />
                <span className="text-2xl">✏️</span>
              </div>
              <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                Editor Guide
              </h2>
              <p className="text-muted-foreground">
                Learn how to use the visual markdown editor with graph visualization.
              </p>
            </Link>

            <Link 
              href="/api/docs" 
              className="group rounded-lg border border-border bg-card p-6 hover:border-primary transition-colors"
            >
              <div className="flex items-center gap-2 mb-4">
                <FileJson className="h-8 w-8 text-primary" />
                <span className="text-2xl">📡</span>
              </div>
              <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                API Reference
              </h2>
              <p className="text-muted-foreground">
                OpenAPI specification for programmatic access.
              </p>
            </Link>

            <a 
              href="https://mcp.platphormnews.com" 
              target="_blank"
              rel="noreferrer"
              className="group rounded-lg border border-border bg-card p-6 hover:border-primary transition-colors"
            >
              <div className="flex items-center gap-2 mb-4">
                <Plug className="h-8 w-8 text-primary" />
                <span className="text-2xl">🔌</span>
              </div>
              <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                MCP Client
              </h2>
              <p className="text-muted-foreground">
                Connect to AI agents via the Model Context Protocol.
              </p>
            </a>
          </div>

          {/* MCP Integration Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span>🔌</span> MCP Integration
            </h2>
            
            <div className="rounded-lg border border-border bg-card p-6 mb-6">
              <p className="text-muted-foreground mb-4">
                MarkdownTree is fully compatible with the <strong>Model Context Protocol (MCP)</strong>.
                Connect your AI agents, LLM workflows, and automation tools to MarkdownTree&apos;s capabilities.
              </p>
              <div className="space-y-4">
                <div className="rounded-lg bg-muted p-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <span>🌐</span> MCP Discovery Endpoint
                  </h4>
                  <pre className="text-sm overflow-x-auto">
{`GET ${siteConfig.url}/.well-known/mcp.json`}
                  </pre>
                </div>
                <div className="rounded-lg bg-muted p-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <span>🤖</span> MCP Client Portal
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Use the Platphorm MCP Client to connect agents and tools:
                  </p>
                  <a 
                    href="https://mcp.platphormnews.com" 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:underline text-sm font-medium"
                  >
                    mcp.platphormnews.com
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <div className="rounded-lg bg-muted p-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <span>📋</span> Available MCP Tools
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• <code className="text-primary">parseMarkdown</code> — Parse markdown content into a graph structure</li>
                    <li>• <code className="text-primary">exportDocument</code> — Export to Markdown, HTML, or JSON</li>
                    <li>• <code className="text-primary">aiEnhance</code> — AI-powered text enhancement</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span>⚡</span> Quick Start
            </h2>
            
            <div className="space-y-6">
              <div className="rounded-lg border border-border bg-card p-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Network className="h-5 w-5 text-primary" />
                  <span>📊</span> Transform Markdown to Graph
                </h3>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
{`curl -X POST ${siteConfig.url}/api/v1/transform \\
  -H "Content-Type: application/json" \\
  -d '{"markdown": "# Hello\\n\\nWorld"}'`}
                </pre>
              </div>

              <div className="rounded-lg border border-border bg-card p-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Download className="h-5 w-5 text-primary" />
                  <span>📤</span> Export Document
                </h3>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
{`curl -X POST ${siteConfig.url}/api/v1/export \\
  -H "Content-Type: application/json" \\
  -d '{"markdown": "# Doc", "format": "html"}'`}
                </pre>
              </div>

              <div className="rounded-lg border border-border bg-card p-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <span>🤖</span> AI Enhancement
                </h3>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
{`curl -X POST ${siteConfig.url}/api/v1/ai/enhance \\
  -H "Content-Type: application/json" \\
  -d '{"markdown": "# Draft", "action": "improve"}'`}
                </pre>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span>📡</span> Endpoints
            </h2>
            
            <div className="rounded-lg border border-border overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-4 font-medium">Method</th>
                    <th className="text-left p-4 font-medium">Endpoint</th>
                    <th className="text-left p-4 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="p-4"><Badge variant="outline">GET</Badge></td>
                    <td className="p-4 font-mono text-sm">/api/health</td>
                    <td className="p-4 text-muted-foreground">💚 Health check</td>
                  </tr>
                  <tr>
                    <td className="p-4"><Badge variant="outline">GET</Badge></td>
                    <td className="p-4 font-mono text-sm">/api/docs</td>
                    <td className="p-4 text-muted-foreground">📄 OpenAPI spec</td>
                  </tr>
                  <tr>
                    <td className="p-4"><Badge variant="secondary">POST</Badge></td>
                    <td className="p-4 font-mono text-sm">/api/v1/transform</td>
                    <td className="p-4 text-muted-foreground">📊 Parse markdown to graph</td>
                  </tr>
                  <tr>
                    <td className="p-4"><Badge variant="secondary">POST</Badge></td>
                    <td className="p-4 font-mono text-sm">/api/v1/export</td>
                    <td className="p-4 text-muted-foreground">📤 Export document</td>
                  </tr>
                  <tr>
                    <td className="p-4"><Badge variant="secondary">POST</Badge></td>
                    <td className="p-4 font-mono text-sm">/api/v1/ai/enhance</td>
                    <td className="p-4 text-muted-foreground">🤖 AI enhancement</td>
                  </tr>
                  <tr>
                    <td className="p-4"><Badge variant="secondary">POST</Badge></td>
                    <td className="p-4 font-mono text-sm">/api/v1/ai/chat</td>
                    <td className="p-4 text-muted-foreground">💬 AI chat assistant</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* I18N Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Globe className="h-6 w-6 text-primary" />
              <span>🌐</span> Internationalization
            </h2>
            <div className="rounded-lg border border-border bg-card p-6">
              <p className="text-muted-foreground mb-3">
                MarkdownTree includes built-in I18N support. The interface automatically detects your browser language and supports:
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  { flag: "🇺🇸", lang: "English" },
                  { flag: "🇪🇸", lang: "Español" },
                  { flag: "🇫🇷", lang: "Français" },
                  { flag: "🇩🇪", lang: "Deutsch" },
                  { flag: "🇯🇵", lang: "日本語" },
                  { flag: "🇨🇳", lang: "中文" },
                ].map((l) => (
                  <span key={l.lang} className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-sm">
                    <span>{l.flag}</span>
                    <span>{l.lang}</span>
                  </span>
                ))}
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span>📎</span> Resources
            </h2>
            
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <a 
                href="/feed.xml" 
                target="_blank"
                className="flex items-center gap-3 rounded-lg border border-border p-4 hover:border-primary transition-colors"
              >
                <FileText className="h-5 w-5 text-primary" />
                <span>📰 RSS Feed</span>
                <ExternalLink className="h-4 w-4 ml-auto text-muted-foreground" />
              </a>
              <a 
                href="/sitemap.xml" 
                target="_blank"
                className="flex items-center gap-3 rounded-lg border border-border p-4 hover:border-primary transition-colors"
              >
                <FileText className="h-5 w-5 text-primary" />
                <span>🗺️ Sitemap</span>
                <ExternalLink className="h-4 w-4 ml-auto text-muted-foreground" />
              </a>
              <a 
                href="/llms.txt" 
                target="_blank"
                className="flex items-center gap-3 rounded-lg border border-border p-4 hover:border-primary transition-colors"
              >
                <Sparkles className="h-5 w-5 text-primary" />
                <span>🤖 LLM Context</span>
                <ExternalLink className="h-4 w-4 ml-auto text-muted-foreground" />
              </a>
              <a 
                href="/.well-known/mcp.json" 
                target="_blank"
                className="flex items-center gap-3 rounded-lg border border-border p-4 hover:border-primary transition-colors"
              >
                <Plug className="h-5 w-5 text-primary" />
                <span>🔌 MCP Config</span>
                <ExternalLink className="h-4 w-4 ml-auto text-muted-foreground" />
              </a>
              <a 
                href="https://mcp.platphormnews.com" 
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-lg border border-border p-4 hover:border-primary transition-colors"
              >
                <Plug className="h-5 w-5 text-primary" />
                <span>🌐 MCP Client Portal</span>
                <ExternalLink className="h-4 w-4 ml-auto text-muted-foreground" />
              </a>
              <a 
                href={siteConfig.links.github} 
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-lg border border-border p-4 hover:border-primary transition-colors"
              >
                <Code2 className="h-5 w-5 text-primary" />
                <span>⭐ GitHub</span>
                <ExternalLink className="h-4 w-4 ml-auto text-muted-foreground" />
              </a>
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
