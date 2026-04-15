"use client"

import Link from "next/link"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { 
  Moon, 
  Sun, 
  Menu, 
  Download, 
  Upload, 
  Settings, 
  FileText,
  Github,
  Sparkles,
  BookOpen,
  Code2
} from "lucide-react"
import { siteConfig } from "@/lib/platphorm/config"

export function SiteHeader() {
  const { theme, setTheme } = useTheme()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4 gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-semibold" title={siteConfig.name} aria-label={siteConfig.name}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Code2 className="h-4 w-4" />
          </div>
          <span className="hidden sm:inline-block">{siteConfig.name}</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/editor">Editor</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/docs">Docs</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/api/docs">API</Link>
          </Button>
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* File Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" title="File menu" aria-label="File menu">
                <FileText className="h-4 w-4" />
                <span className="sr-only">File menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Upload className="mr-2 h-4 w-4" />
                Import Markdown
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                Export
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Sparkles className="mr-2 h-4 w-4" />
                AI Enhance
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Docs */}
          <Button variant="ghost" size="icon" className="h-8 w-8" asChild title="Documentation" aria-label="Documentation">
            <Link href="/docs">
              <BookOpen className="h-4 w-4" />
              <span className="sr-only">Documentation</span>
            </Link>
          </Button>

          {/* GitHub */}
          <Button variant="ghost" size="icon" className="h-8 w-8" asChild title="GitHub" aria-label="GitHub">
            <a href={siteConfig.links.github} target="_blank" rel="noreferrer">
              <Github className="h-4 w-4" />
              <span className="sr-only">GitHub</span>
            </a>
          </Button>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            title="Toggle theme"
            aria-label="Toggle theme"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Mobile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 md:hidden" title="Menu" aria-label="Menu">
                <Menu className="h-4 w-4" />
                <span className="sr-only">Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/editor">Editor</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/docs">Documentation</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/api/docs">API</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <a href={siteConfig.links.github} target="_blank" rel="noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
