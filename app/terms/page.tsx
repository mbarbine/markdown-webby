import { Button } from "@/components/ui/button"
import { Metadata } from "next"
import Link from "next/link"
import { siteConfig } from "@/lib/platphorm/config"
import { SiteFooter } from "@/components/site-footer"
import { Code2, ArrowLeft } from "lucide-react"

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of service for using MarkdownTree.",
}

export default function TermsPage() {
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
              <BreadcrumbPage>Terms of Service</BreadcrumbPage>
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
          <h1>Terms of Service</h1>
          <p className="lead">Last updated: {new Date().toLocaleDateString()}</p>

          <h2>Acceptance of Terms</h2>
          <p>
            By using {siteConfig.name}, you agree to these terms. If you do not agree,
            please do not use the service.
          </p>

          <h2>Description of Service</h2>
          <p>
            {siteConfig.name} provides a web-based markdown editor with graph visualization
            and AI-powered enhancement features.
          </p>

          <h2>Use License</h2>
          <p>
            This software is provided under the MIT License. You are free to use, modify,
            and distribute it according to the license terms.
          </p>

          <h2>User Content</h2>
          <p>
            You retain all rights to content you create using this service. We do not claim
            ownership of your documents or markdown content.
          </p>

          <h2>AI Features</h2>
          <p>
            AI-generated content is provided as-is. You are responsible for reviewing and
            verifying any AI-generated suggestions before use.
          </p>

          <h2>Limitations</h2>
          <ul>
            <li>The service is provided as-is without warranties</li>
            <li>We are not liable for any data loss or damages</li>
            <li>Service availability is not guaranteed</li>
          </ul>

          <h2>API Usage</h2>
          <p>
            API usage is subject to rate limits. Excessive use or abuse may result in
            access restrictions.
          </p>

          <h2>Changes to Terms</h2>
          <p>
            We may update these terms at any time. Continued use of the service after
            changes constitutes acceptance of the new terms.
          </p>

          <h2>Contact</h2>
          <p>
            For questions about these terms, please open an issue on our{" "}
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
