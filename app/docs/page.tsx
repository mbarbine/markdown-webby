import { siteConfig } from "@/lib/platphorm/config"
import { SiteHeader } from "@/components/site-header"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ExternalLink, Code2, FileJson, Sparkles, Download, FileText, Network } from "lucide-react"

export const metadata = {
  title: `Documentation - ${siteConfig.name}`,
  description: `API documentation and guides for ${siteConfig.name}`,
}

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <Badge className="mb-4">v{siteConfig.version}</Badge>
            <h1 className="text-4xl font-bold mb-4">Documentation</h1>
            <p className="text-lg text-muted-foreground">
              Learn how to use {siteConfig.name} and integrate with our API.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 mb-12">
            <Link 
              href="/editor" 
              className="group rounded-lg border border-border bg-card p-6 hover:border-primary transition-colors"
            >
              <Code2 className="h-8 w-8 mb-4 text-primary" />
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
              <FileJson className="h-8 w-8 mb-4 text-primary" />
              <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                API Reference
              </h2>
              <p className="text-muted-foreground">
                OpenAPI specification for programmatic access.
              </p>
            </Link>
          </div>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Quick Start</h2>
            
            <div className="space-y-6">
              <div className="rounded-lg border border-border bg-card p-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Network className="h-5 w-5 text-primary" />
                  Transform Markdown to Graph
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
                  Export Document
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
                  AI Enhancement
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
            <h2 className="text-2xl font-bold mb-6">Endpoints</h2>
            
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
                    <td className="p-4 text-muted-foreground">Health check</td>
                  </tr>
                  <tr>
                    <td className="p-4"><Badge variant="outline">GET</Badge></td>
                    <td className="p-4 font-mono text-sm">/api/docs</td>
                    <td className="p-4 text-muted-foreground">OpenAPI spec</td>
                  </tr>
                  <tr>
                    <td className="p-4"><Badge variant="secondary">POST</Badge></td>
                    <td className="p-4 font-mono text-sm">/api/v1/transform</td>
                    <td className="p-4 text-muted-foreground">Parse markdown to graph</td>
                  </tr>
                  <tr>
                    <td className="p-4"><Badge variant="secondary">POST</Badge></td>
                    <td className="p-4 font-mono text-sm">/api/v1/export</td>
                    <td className="p-4 text-muted-foreground">Export document</td>
                  </tr>
                  <tr>
                    <td className="p-4"><Badge variant="secondary">POST</Badge></td>
                    <td className="p-4 font-mono text-sm">/api/v1/ai/enhance</td>
                    <td className="p-4 text-muted-foreground">AI enhancement</td>
                  </tr>
                  <tr>
                    <td className="p-4"><Badge variant="secondary">POST</Badge></td>
                    <td className="p-4 font-mono text-sm">/api/v1/ai/chat</td>
                    <td className="p-4 text-muted-foreground">AI chat assistant</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6">Resources</h2>
            
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <a 
                href="/feed.xml" 
                target="_blank"
                className="flex items-center gap-3 rounded-lg border border-border p-4 hover:border-primary transition-colors"
              >
                <FileText className="h-5 w-5 text-primary" />
                <span>RSS Feed</span>
                <ExternalLink className="h-4 w-4 ml-auto text-muted-foreground" />
              </a>
              <a 
                href="/sitemap.xml" 
                target="_blank"
                className="flex items-center gap-3 rounded-lg border border-border p-4 hover:border-primary transition-colors"
              >
                <FileText className="h-5 w-5 text-primary" />
                <span>Sitemap</span>
                <ExternalLink className="h-4 w-4 ml-auto text-muted-foreground" />
              </a>
              <a 
                href="/llms.txt" 
                target="_blank"
                className="flex items-center gap-3 rounded-lg border border-border p-4 hover:border-primary transition-colors"
              >
                <Sparkles className="h-5 w-5 text-primary" />
                <span>LLM Context</span>
                <ExternalLink className="h-4 w-4 ml-auto text-muted-foreground" />
              </a>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
