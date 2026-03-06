import { NextResponse } from "next/server"
import { siteConfig } from "@/lib/platphorm/config"

export async function GET() {
  const platphormConfig = {
    "@context": "https://platphormnews.com/schema/network",
    "@type": "PlatphormSite",
    
    identity: {
      name: siteConfig.name,
      description: siteConfig.description,
      url: siteConfig.url,
      version: siteConfig.version,
      creator: siteConfig.creator,
    },
    
    network: {
      id: "markdown-platphormnews-com",
      type: "tool",
      category: "developer-tools",
      tags: ["markdown", "visualization", "editor", "graph", "ai"],
    },
    
    capabilities: {
      api: true,
      mcp: true,
      ai: true,
      collaboration: false,
      i18n: ["en"],
    },
    
    discovery: {
      sitemap: `${siteConfig.url}/sitemap.xml`,
      robots: `${siteConfig.url}/robots.txt`,
      rss: `${siteConfig.url}/feed.xml`,
      llms: `${siteConfig.url}/llms.txt`,
      llmsFull: `${siteConfig.url}/llms-full.txt`,
      mcp: `${siteConfig.url}/.well-known/mcp.json`,
      openapi: `${siteConfig.url}/api/docs`,
    },
    
    endpoints: {
      api: {
        version: "v1",
        base: `${siteConfig.url}/api/v1`,
        health: `${siteConfig.url}/api/health`,
        docs: `${siteConfig.url}/api/docs`,
      },
      features: {
        transform: `${siteConfig.url}/api/v1/transform`,
        export: `${siteConfig.url}/api/v1/export`,
        aiEnhance: `${siteConfig.url}/api/v1/ai/enhance`,
        aiChat: `${siteConfig.url}/api/v1/ai/chat`,
      },
    },
    
    social: {
      github: siteConfig.links.github,
      twitter: siteConfig.links.twitter,
    },
    
    support: {
      coinbase: siteConfig.coinbase,
    },
    
    metadata: {
      ogImage: siteConfig.ogImage,
      icon: `${siteConfig.url}/icon-512.jpg`,
    },
  }

  return NextResponse.json(platphormConfig, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600",
      "Access-Control-Allow-Origin": "*",
    },
  })
}
