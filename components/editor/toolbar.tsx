"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useMarkdown } from "@/lib/store/use-markdown"
import {
  PanelLeftClose,
  PanelLeft,
  Columns2,
  Eye,
  Code2,
  Network,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Download,
  Upload,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Expand,
  Shrink,
  RotateCcw,
  ArrowRight,
  ArrowDown,
  Settings2,
  Sparkles,
} from "lucide-react"

interface EditorToolbarProps {
  onImport?: () => void
  onExport?: (format: string) => void
  onToggleAI?: () => void
  showAI?: boolean
}

export function EditorToolbar({ onImport, onExport, onToggleAI, showAI }: EditorToolbarProps) {
  const {
    viewMode,
    setViewMode,
    fullscreen,
    toggleFullscreen,
    scale,
    zoomIn,
    zoomOut,
    resetView,
    searchQuery,
    setSearchQuery,
    searchResults,
    currentSearchIndex,
    nextSearchResult,
    prevSearchResult,
    clearSearch,
    expandAll,
    collapseAll,
    viewSettings,
    updateViewSettings,
    hasChanges,
  } = useMarkdown()

  return (
    <div className="flex items-center gap-1 p-2 border-b border-border bg-card">
      {/* View Mode Selector */}
      <div className="flex items-center rounded-md border border-border bg-muted/50 p-0.5">
        <Button
          variant={viewMode === "editor" ? "secondary" : "ghost"}
          size="sm"
          className="h-7 px-2 rounded-sm"
          onClick={() => setViewMode("editor")}
        >
          <Code2 className="h-3.5 w-3.5 mr-1" />
          <span className="hidden sm:inline">Editor</span>
        </Button>
        <Button
          variant={viewMode === "split" ? "secondary" : "ghost"}
          size="sm"
          className="h-7 px-2 rounded-sm"
          onClick={() => setViewMode("split")}
        >
          <Columns2 className="h-3.5 w-3.5 mr-1" />
          <span className="hidden sm:inline">Split</span>
        </Button>
        <Button
          variant={viewMode === "graph" ? "secondary" : "ghost"}
          size="sm"
          className="h-7 px-2 rounded-sm"
          onClick={() => setViewMode("graph")}
        >
          <Network className="h-3.5 w-3.5 mr-1" />
          <span className="hidden sm:inline">Graph</span>
        </Button>
        <Button
          variant={viewMode === "preview" ? "secondary" : "ghost"}
          size="sm"
          className="h-7 px-2 rounded-sm"
          onClick={() => setViewMode("preview")}
        >
          <Eye className="h-3.5 w-3.5 mr-1" />
          <span className="hidden sm:inline">Preview</span>
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Graph Controls */}
      {(viewMode === "graph" || viewMode === "split") && (
        <>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={zoomOut}
              title="Zoom Out"
              aria-label="Zoom Out"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </Button>
            <span className="text-xs text-muted-foreground w-12 text-center">
              {Math.round(scale * 100)}%
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={zoomIn}
              title="Zoom In"
              aria-label="Zoom In"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={resetView}
              title="Reset View"
              aria-label="Reset View"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Expand/Collapse */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={expandAll}
              title="Expand All"
              aria-label="Expand All"
            >
              <Expand className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={collapseAll}
              title="Collapse All"
              aria-label="Collapse All"
            >
              <Shrink className="h-3.5 w-3.5" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Direction Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 px-2">
                {viewSettings.graphDirection === "RIGHT" ? (
                  <ArrowRight className="h-3.5 w-3.5 mr-1" />
                ) : (
                  <ArrowDown className="h-3.5 w-3.5 mr-1" />
                )}
                <span className="hidden sm:inline">Direction</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuCheckboxItem
                checked={viewSettings.graphDirection === "RIGHT"}
                onCheckedChange={() => updateViewSettings({ graphDirection: "RIGHT" })}
              >
                Left to Right
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={viewSettings.graphDirection === "DOWN"}
                onCheckedChange={() => updateViewSettings({ graphDirection: "DOWN" })}
              >
                Top to Bottom
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Separator orientation="vertical" className="h-6 mx-1" />
        </>
      )}

      {/* Search */}
      <div className="flex items-center gap-1">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-7 w-40 pl-7 pr-7 text-xs"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-7 w-7"
              onClick={clearSearch}
              title="Clear Search"
              aria-label="Clear Search"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
        {searchResults.length > 0 && (
          <>
            <span className="text-xs text-muted-foreground">
              {currentSearchIndex + 1}/{searchResults.length}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={prevSearchResult}
              title="Previous search result"
              aria-label="Previous search result"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={nextSearchResult}
              title="Next search result"
              aria-label="Next search result"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </>
        )}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Status */}
      {hasChanges && (
        <Badge variant="outline" className="text-xs">
          Unsaved
        </Badge>
      )}

      {/* AI Enhance */}
      <Button 
        variant={showAI ? "secondary" : "ghost"} 
        size="sm" 
        className="h-7 px-2 text-primary"
        onClick={onToggleAI}
      >
        <Sparkles className="h-3.5 w-3.5 mr-1" />
        <span className="hidden sm:inline">AI</span>
      </Button>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Import/Export */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-7 w-7" title="Import" aria-label="Import">
            <Upload className="h-3.5 w-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onImport}>
            Import Markdown
          </DropdownMenuItem>
          <DropdownMenuItem>
            Import from URL
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-7 w-7" title="Export" aria-label="Export">
            <Download className="h-3.5 w-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onExport?.("markdown")}>
            Export as Markdown
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onExport?.("html")}>
            Export as HTML
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onExport?.("json")}>
            Export as JSON
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onExport?.("png")}>
            Export Graph as PNG
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Settings */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-7 w-7" title="Settings" aria-label="Settings">
            <Settings2 className="h-3.5 w-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuCheckboxItem
            checked={viewSettings.showMinimap}
            onCheckedChange={(checked) => updateViewSettings({ showMinimap: checked })}
          >
            Show Minimap
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={viewSettings.showOutline}
            onCheckedChange={(checked) => updateViewSettings({ showOutline: checked })}
          >
            Show Outline
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Fullscreen */}
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={toggleFullscreen}
        title={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        aria-label={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      >
        {fullscreen ? (
          <Minimize2 className="h-3.5 w-3.5" />
        ) : (
          <Maximize2 className="h-3.5 w-3.5" />
        )}
      </Button>
    </div>
  )
}
