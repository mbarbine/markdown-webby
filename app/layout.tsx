import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { I18nProvider } from "@/lib/i18n"
import { Toaster } from "@/components/ui/toaster"
import { siteConfig } from "@/lib/platphorm/config"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "MarkdownTree — Visual Markdown Editor & Graph Viewer",
    template: "%s | MarkdownTree",
  },
  description:
    "Transform any markdown document into an interactive graph visualization. Edit, explore, navigate and export with AI-powered enhancements.",
  keywords: [
    "markdown",
    "visualization",
    "graph",
    "editor",
    "AI",
    "MCP",
    "document structure",
    "interactive",
    "open source",
    "i18n",
    "share cards",
    "Monaco editor",
    "ReactFlow",
  ],
  authors: [{ name: "Platphorm News", url: "https://platphormnews.com" }],
  creator: "Platphorm News",
  publisher: "Platphorm News",
  metadataBase: new URL("https://markdown.platphormnews.com"),
  alternates: {
    canonical: "/",
    languages: {
      "en": "https://markdown.platphormnews.com",
      "x-default": "https://markdown.platphormnews.com",
    },
    types: {
      "application/rss+xml": "/feed.xml",
      "application/json": "/feed.json",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://markdown.platphormnews.com",
    title: "MarkdownTree — Visual Markdown Editor & Graph Viewer",
    description:
      "Transform markdown documents into interactive graph visualizations with AI-powered enhancements.",
    siteName: "MarkdownTree",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "MarkdownTree — Visual Markdown Editor",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MarkdownTree — Visual Markdown Editor",
    description: "Transform markdown into interactive graph visualizations",
    images: ["/og-image.jpg"],
    creator: "@platphormnews",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  manifest: "/manifest.webmanifest",
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#060c18" },
  ],
  width: "device-width",
  initialScale: 1,
  userScalable: true,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="font-sans antialiased bg-background text-foreground min-h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <I18nProvider>
            {children}
            <Toaster />
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
