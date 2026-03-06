import Link from "next/link"
import { siteConfig } from "@/lib/platphorm/config"
import { Code2, Github, Rss } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-semibold mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Code2 className="h-4 w-4" />
              </div>
              <span>{siteConfig.name}</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Transform markdown into interactive graph visualizations with AI-powered enhancements.
            </p>
            <div className="flex items-center gap-3">
              <a 
                href={siteConfig.links.github}
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
              <Link 
                href="/feed.xml"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Rss className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="/editor" className="hover:text-foreground transition-colors">
                Editor
              </Link>
              <Link href="/docs" className="hover:text-foreground transition-colors">
                Documentation
              </Link>
              <Link href="/api/docs" className="hover:text-foreground transition-colors">
                API Reference
              </Link>
              <a 
                href={siteConfig.links.github} 
                target="_blank" 
                rel="noreferrer"
                className="hover:text-foreground transition-colors"
              >
                GitHub
              </a>
            </nav>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="/feed.xml" className="hover:text-foreground transition-colors">
                RSS Feed
              </Link>
              <Link href="/sitemap.xml" className="hover:text-foreground transition-colors">
                Sitemap
              </Link>
              <Link href="/llms.txt" className="hover:text-foreground transition-colors">
                LLM Discovery
              </Link>
              <Link href="/.well-known/mcp.json" className="hover:text-foreground transition-colors">
                MCP Config
              </Link>
            </nav>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <Link href="/accessibility" className="hover:text-foreground transition-colors">
                Accessibility
              </Link>
              <Link href="/open-source" className="hover:text-foreground transition-colors">
                Open Source
              </Link>
            </nav>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            {new Date().getFullYear()} {siteConfig.creator}. Open source under MIT license.
          </p>
          <p className="text-xs text-muted-foreground font-mono">
            v{siteConfig.version}
          </p>
        </div>
      </div>
    </footer>
  )
}
