import { Metadata } from "next"
import Link from "next/link"
import { siteConfig } from "@/lib/platphorm/config"
import { SiteFooter } from "@/components/site-footer"
import { Code2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Accessibility Statement",
  description: "Accessibility commitment and features in MarkdownTree.",
}

export default function AccessibilityPage() {
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
        <Button variant="ghost" size="sm" asChild className="mb-8">
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </Button>

        <article className="prose prose-neutral dark:prose-invert max-w-3xl">
          <h1>Accessibility Statement</h1>
          <p className="lead">Our commitment to inclusive design.</p>

          <h2>Our Commitment</h2>
          <p>
            {siteConfig.name} is committed to ensuring digital accessibility for people with 
            disabilities. We continually improve the user experience for everyone and apply 
            relevant accessibility standards.
          </p>

          <h2>Accessibility Features</h2>
          <ul>
            <li><strong>Keyboard Navigation</strong> - Full keyboard support for all features</li>
            <li><strong>Screen Reader Support</strong> - ARIA labels and semantic HTML</li>
            <li><strong>Color Contrast</strong> - WCAG 2.1 AA compliant color ratios</li>
            <li><strong>Focus Indicators</strong> - Clear visual focus states</li>
            <li><strong>Responsive Design</strong> - Works on all device sizes</li>
            <li><strong>Dark Mode</strong> - Reduced eye strain option</li>
          </ul>

          <h2>Standards</h2>
          <p>
            We aim to conform to WCAG 2.1 Level AA guidelines. Our interface uses:
          </p>
          <ul>
            <li>Semantic HTML5 elements</li>
            <li>ARIA attributes where needed</li>
            <li>Skip navigation links</li>
            <li>Proper heading hierarchy</li>
          </ul>

          <h2>Known Limitations</h2>
          <p>
            The graph visualization feature may have limited accessibility for screen 
            reader users. We provide an alternative outline view that presents the same 
            information in a linear, accessible format.
          </p>

          <h2>Feedback</h2>
          <p>
            We welcome feedback on the accessibility of {siteConfig.name}. Please report 
            issues on our{" "}
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
