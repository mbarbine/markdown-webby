// Export utilities for various formats

export function downloadFile(content: string | Blob, filename: string, mimeType: string) {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function exportMarkdown(markdown: string, filename = "document.md") {
  downloadFile(markdown, filename, "text/markdown")
}

export function exportJson(data: object, filename = "document.json") {
  const content = JSON.stringify(data, null, 2)
  downloadFile(content, filename, "application/json")
}

export async function exportHtml(markdown: string, filename = "document.html") {
  const response = await fetch("/api/v1/export", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ markdown, format: "html" }),
  })
  const html = await response.text()
  downloadFile(html, filename, "text/html")
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text)
}

// Format file size
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// Generate shareable URL with encoded content
export function generateShareUrl(markdown: string): string {
  const encoded = encodeURIComponent(btoa(markdown))
  return `${window.location.origin}/editor?content=${encoded}`
}

// Parse shared content from URL
export function parseShareUrl(): string | null {
  if (typeof window === "undefined") return null
  const params = new URLSearchParams(window.location.search)
  const content = params.get("content")
  if (content) {
    try {
      return atob(decodeURIComponent(content))
    } catch {
      return null
    }
  }
  return null
}
