import { Button } from "@/components/ui/button"
import { Metadata } from "next"
import Link from "next/link"
import { siteConfig } from "@/lib/platphorm/config"
import { SiteFooter } from "@/components/site-footer"
import { Code2, ArrowLeft, Github, ExternalLink } from "lucide-react"

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

export const metadata: Metadata = {
  title: "Open Source",
  description: "MarkdownTree is open source software built with open source tools.",
}

const dependencies = [
  { name: "Next.js", url: "https://nextjs.org", description: "React framework" },
  { name: "React", url: "https://react.dev", description: "UI library" },
  { name: "Tailwind CSS", url: "https://tailwindcss.com", description: "Utility-first CSS" },
  { name: "shadcn/ui", url: "https://ui.shadcn.com", description: "UI components" },
  { name: "React Flow", url: "https://reactflow.dev", description: "Graph visualization" },
  { name: "Monaco Editor", url: "https://microsoft.github.io/monaco-editor/", description: "Code editor" },
  { name: "Zustand", url: "https://zustand-demo.pmnd.rs/", description: "State management" },
  { name: "Vercel AI SDK", url: "https://sdk.vercel.ai", description: "AI integration" },
  { name: "Lucide", url: "https://lucide.dev", description: "Icons" },
]

export default function OpenSourcePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="container flex h-14 items-center">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Code2 className="h-4 w-4" />
            </div>
            <span>{siteConfig.name}</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 container py-12">
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild><Link href="/">Home</Link></BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Open Source</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Button variant="ghost" size="sm" asChild className="mb-8">
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </Button>

        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold mb-4">Open Source</h1>
          <p className="text-lg text-muted-foreground mb-8">
            {siteConfig.name} is open source and built on the shoulders of giants.
          </p>

          <div className="mb-12">
            <Button size="lg" asChild>
              <a href={siteConfig.links.github} target="_blank" rel="noreferrer">
                <Github className="h-5 w-5 mr-2" />
                View on GitHub
              </a>
            </Button>
          </div>

          <h2 className="text-2xl font-semibold mb-4">License</h2>
          <p className="text-muted-foreground mb-8">
            This project is licensed under the MIT License. You are free to use, modify, 
            and distribute it for personal or commercial purposes.
          </p>

          <h2 className="text-2xl font-semibold mb-4">Built With</h2>
          <p className="text-muted-foreground mb-6">
            We are grateful to these open source projects:
          </p>

          <div className="grid gap-4">
            {dependencies.map((dep) => (
              <a
                key={dep.name}
                href={dep.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors group"
              >
                <div>
                  <h3 className="font-medium group-hover:text-primary transition-colors">
                    {dep.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{dep.description}</p>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
            ))}
          </div>

          <h2 className="text-2xl font-semibold mt-12 mb-4">Contributing</h2>
          <p className="text-muted-foreground mb-4">
            We welcome contributions! Please check our GitHub repository for:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2">
            <li>Bug reports and feature requests</li>
            <li>Pull requests</li>
            <li>Documentation improvements</li>
            <li>Translations</li>
          </ul>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
