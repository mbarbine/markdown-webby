import { NextResponse } from "next/server"
import { siteConfig } from "@/lib/platphorm/config"

export async function GET() {
  const feed = {
    version: "https://jsonfeed.org/version/1.1",
    title: siteConfig.name,
    home_page_url: siteConfig.url,
    feed_url: `${siteConfig.url}/feed.json`,
    description: siteConfig.description,
    icon: `${siteConfig.url}/icon-512.jpg`,
    favicon: `${siteConfig.url}/icon-192.jpg`,
    language: "en",
    authors: [
      {
        name: siteConfig.creator,
        url: "https://platphormnews.com",
      },
    ],
    items: [
      {
        id: `${siteConfig.url}/docs/getting-started`,
        url: `${siteConfig.url}/docs`,
        title: "Getting Started with MarkdownTree",
        content_text: "Learn how to use MarkdownTree to visualize your markdown documents as interactive graphs.",
        date_published: new Date().toISOString(),
        tags: ["documentation", "getting-started"],
      },
      {
        id: `${siteConfig.url}/api/v1`,
        url: `${siteConfig.url}/api/docs`,
        title: "MarkdownTree API v1",
        content_text: "Transform markdown to graphs, export documents, and leverage AI enhancements via our REST API.",
        date_published: new Date().toISOString(),
        tags: ["api", "documentation"],
      },
    ],
  }

  return NextResponse.json(feed, {
    headers: {
      "Content-Type": "application/feed+json",
      "Cache-Control": "public, max-age=3600",
    },
  })
}
