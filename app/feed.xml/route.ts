import { siteConfig } from "@/lib/platphorm/config"

export async function GET() {
  const buildDate = new Date().toUTCString()
  
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${siteConfig.name}</title>
    <link>${siteConfig.url}</link>
    <description>${siteConfig.description}</description>
    <language>en-us</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${siteConfig.url}/feed.xml" rel="self" type="application/rss+xml"/>
    <generator>${siteConfig.name} ${siteConfig.version}</generator>
    <webMaster>support@platphormnews.com (${siteConfig.creator})</webMaster>
    
    <item>
      <title>Welcome to ${siteConfig.name}</title>
      <link>${siteConfig.url}</link>
      <guid isPermaLink="true">${siteConfig.url}#welcome</guid>
      <pubDate>${buildDate}</pubDate>
      <description>Transform your markdown documents into interactive graph visualizations with AI-powered enhancements.</description>
      <content:encoded><![CDATA[
        <h2>Welcome to ${siteConfig.name}</h2>
        <p>${siteConfig.description}</p>
        <ul>
          <li>Visual markdown editing with real-time preview</li>
          <li>Interactive graph visualization of document structure</li>
          <li>AI-powered writing assistance</li>
          <li>Multiple export formats (Markdown, JSON, HTML)</li>
        </ul>
      ]]></content:encoded>
    </item>
    
    <item>
    <item>
      <title>Now on Platphorm News Network &amp; MCP</title>
      <link>https://platphormnews.com/api/network/graph</link>
      <guid isPermaLink="true">https://platphormnews.com/api/network/graph</guid>
      <pubDate>${buildDate}</pubDate>
      <description>MarkdownTree is registered on the Platphorm News Network. View the network graph and integrate via MCP at https://mcp.platphormnews.com</description>
    </item>

      <title>API Documentation</title>
      <link>${siteConfig.url}/api/docs</link>
      <guid isPermaLink="true">${siteConfig.url}/api/docs</guid>
      <pubDate>${buildDate}</pubDate>
      <description>Explore the ${siteConfig.name} API for programmatic access to markdown transformation and export features.</description>
    </item>
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  })
}
