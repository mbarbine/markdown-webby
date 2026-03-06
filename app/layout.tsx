import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter"
})

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"],
  variable: "--font-mono"
})

export const metadata: Metadata = {
  title: {
    default: "MarkdownTree - Visual Markdown Editor & Graph Viewer",
    template: "%s | MarkdownTree"
  },
  description: "Transform markdown documents into interactive graph visualizations. Edit, explore, and export markdown with AI-powered enhancements.",
  keywords: ["markdown", "visualization", "graph", "editor", "AI", "documentation", "MCP"],
  authors: [{ name: "Platphorm News" }],
  creator: "Platphorm News",
  publisher: "Platphorm News",
  metadataBase: new URL("https://markdown.platphormnews.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://markdown.platphormnews.com",
    title: "MarkdownTree - Visual Markdown Editor & Graph Viewer",
    description: "Transform markdown documents into interactive graph visualizations with AI-powered enhancements.",
    siteName: "MarkdownTree",
  },
  twitter: {
    card: "summary_large_image",
    title: "MarkdownTree - Visual Markdown Editor",
    description: "Transform markdown into interactive graph visualizations",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" }
  ],
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
