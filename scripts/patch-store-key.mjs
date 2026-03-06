import { readFileSync, writeFileSync } from "fs"

const filePath = "/vercel/share/v0-project/lib/store/use-markdown.ts"
let content = readFileSync(filePath, "utf-8")

// Rename the storage key so stale browser localStorage (with showOutline: true) is ignored
content = content.replace(
  /name:\s*["']markdowntree-storage["']/g,
  'name: "markdowntree-v2"'
)

writeFileSync(filePath, content, "utf-8")
console.log("Patched storage key to markdowntree-v2")
console.log("Snippet:")
const lines = content.split("\n")
const idx = lines.findIndex(l => l.includes("markdowntree-v2"))
console.log(lines.slice(Math.max(0, idx - 1), idx + 3).join("\n"))
