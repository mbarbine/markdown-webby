import { Button } from "@/components/ui/button"
import { Metadata } from "next"
import Link from "next/link"
import { siteConfig } from "@/lib/platphorm/config"
import { SiteFooter } from "@/components/site-footer"
import { Code2, ArrowLeft } from "lucide-react"

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for MarkdownTree - how we handle your data.",
}

export default function PrivacyPage() {
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
              <BreadcrumbPage>Privacy Policy</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Button variant="ghost" size="sm" asChild className="mb-8">
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </Button>

        <article className="prose dark:prose-invert max-w-3xl">
          <h1>Privacy Policy</h1>
          <p className="lead">Last updated: {new Date().toLocaleDateString()}</p>

          <h2>Overview</h2>
          <p>
            {siteConfig.name} is committed to protecting your privacy. This policy explains 
            how we handle information when you use our service.
          </p>

          <h2>Information We Collect</h2>
          <h3>Content You Provide</h3>
          <p>
            When you use the editor, your markdown content is processed locally in your browser.
            We do not store your documents on our servers unless you explicitly choose to share them.
          </p>

          <h3>AI Features</h3>
          <p>
            When you use AI enhancement features, your content is sent to AI providers (via Vercel AI Gateway)
            to process your request. This data is not stored after processing.
          </p>

          <h3>Analytics</h3>
          <p>
            We use Vercel Analytics to collect anonymous usage data to improve our service.
            This includes page views and general usage patterns but no personal information.
          </p>

          <h2>Local Storage</h2>
          <p>
            We use browser local storage to save your preferences and recent documents.
            This data stays on your device and is not transmitted to our servers.
          </p>

          <h2>Third-Party Services</h2>
          <ul>
            <li><strong>Vercel</strong> - Hosting and analytics</li>
            <li><strong>Vercel AI Gateway</strong> - AI processing</li>
          </ul>

          <h2>Data Security</h2>
          <p>
            All connections to our service are encrypted using HTTPS. We follow industry
            best practices to protect any data in transit.
          </p>

          <h2>Your Rights</h2>
          <p>
            You can clear your local data at any time through your browser settings.
            Since we dont store your documents, there is no server-side data to delete.
          </p>

          <h2>Contact</h2>
          <p>
            For privacy concerns, please open an issue on our{" "}
            <a href={siteConfig.links.github} target="_blank" rel="noreferrer">
              GitHub repository
            </a>.
          </p>
        </article>
      </main>

      <SiteFooter />
    </div>
  )
}
