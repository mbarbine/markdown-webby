import { siteConfig } from "@/lib/platphorm/config"

interface JsonLdProps {
  type?: "WebApplication" | "SoftwareApplication" | "Article" | "FAQPage" | "Organization"
  data?: Record<string, unknown>
}

export function JsonLd({ type = "WebApplication", data = {} }: JsonLdProps) {
  const baseSchema = {
    "@context": "https://schema.org",
    "@type": type,
  }

  const schemas: Record<string, object> = {
    WebApplication: {
      ...baseSchema,
      name: siteConfig.name,
      description: siteConfig.description,
      url: siteConfig.url,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Web Browser",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      author: {
        "@type": "Organization",
        name: siteConfig.creator,
        url: "https://platphormnews.com",
      },
      ...data,
    },
    SoftwareApplication: {
      ...baseSchema,
      name: siteConfig.name,
      description: siteConfig.description,
      url: siteConfig.url,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any",
      softwareVersion: siteConfig.version,
      ...data,
    },
    Organization: {
      ...baseSchema,
      name: siteConfig.creator,
      url: "https://platphormnews.com",
      logo: `${siteConfig.url}/icon-512.jpg`,
      sameAs: [
        siteConfig.links.github,
        siteConfig.links.twitter,
      ],
      ...data,
    },
    Article: {
      ...baseSchema,
      headline: data.headline || siteConfig.name,
      description: data.description || siteConfig.description,
      author: {
        "@type": "Organization",
        name: siteConfig.creator,
      },
      publisher: {
        "@type": "Organization",
        name: siteConfig.creator,
        logo: {
          "@type": "ImageObject",
          url: `${siteConfig.url}/icon-512.jpg`,
        },
      },
      ...data,
    },
    FAQPage: {
      ...baseSchema,
      mainEntity: data.questions || [],
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas[type]) }}
    />
  )
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  }))
}
