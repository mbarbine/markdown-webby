import { Metadata } from "next"
import Link from "next/link"
import { siteConfig } from "@/lib/platphorm/config"
import { SiteFooter } from "@/components/site-footer"
import { Code2, ArrowLeft, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { JsonLd, generateFAQSchema } from "@/components/json-ld"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

export const metadata: Metadata = {
  title: "FAQ | Frequently Asked Questions",
  description: "Common questions about MarkdownTree, features, and pricing.",
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
]

export default function FAQPage() {
  const faqSchema = generateFAQSchema(faqs)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <JsonLd type="FAQPage" data={{ mainEntity: faqSchema }} />
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
              <BreadcrumbPage>FAQ</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Find answers to common questions about MarkdownTree.
          </p>

          <div className="divide-y divide-border">
            {faqs.map((faq) => (
              <div key={faq.question} className="py-6">
                <h3 className="text-xl font-semibold mb-2">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>

        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
