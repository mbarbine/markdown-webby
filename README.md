# 🌳 MarkdownTree

**A visual markdown editor and interactive graph viewer — write, preview, and explore your documents as connected nodes.**

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Next.js 15](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

---

## ✨ Features

- ✏️ **Monaco-powered markdown editor** — full IntelliSense, syntax highlighting, and keyboard shortcuts
- 📊 **Interactive graph visualization** — explore document structure as a node graph with ReactFlow
- 🤖 **AI-powered enhancements** — smart suggestions, summarization, and chat via Vercel AI SDK
- 🔄 **Four view modes** — Editor · Split · Graph · Preview
- 📤 **Export anywhere** — Markdown, HTML, and JSON output
- 🔗 **Shareable URLs** — share documents instantly, no account needed
- 🌐 **I18N ready** — internationalization support baked in
- 🔌 **MCP-compatible REST API** — connected to [mcp.platphormnews.com](https://mcp.platphormnews.com) — integrate with external tools and agents
- 🎨 **Dark / light theme** — respects system preference with manual toggle
- ♿ **Accessible** — built following WCAG guidelines

---

## 🚀 Demo

👉 **[markdown.platphormnews.com](https://markdown.platphormnews.com)**

---

## ⚡ Quick Start

```sh
git clone https://github.com/mbarbine/markdown-webby.git
cd markdown-webby
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start editing.

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| ⚙️ Framework | [Next.js 15](https://nextjs.org/) (App Router) |
| 🧩 UI | [React 18](https://react.dev/) · [Tailwind CSS](https://tailwindcss.com/) · [shadcn/ui](https://ui.shadcn.com/) |
| ✏️ Editor | [Monaco Editor](https://microsoft.github.io/monaco-editor/) |
| 📊 Graph | [ReactFlow](https://reactflow.dev/) |
| 🤖 AI | [Vercel AI SDK](https://sdk.vercel.ai/) |
| 🔤 Language | [TypeScript 5](https://www.typescriptlang.org/) |

---

## 📡 API

MarkdownTree exposes a lightweight REST API for programmatic access:

| Endpoint | Description |
|----------|-------------|
| `GET /api/health` | Health check |
| `POST /api/v1/transform` | Transform markdown to graph data |
| `POST /api/v1/export` | Export document (Markdown, HTML, JSON) |
| `POST /api/v1/ai/enhance` | AI-powered document enhancement |
| `POST /api/v1/ai/chat` | Conversational AI assistant |
| `GET /api/docs` | Interactive API documentation |

---

## 🔌 MCP Integration

MarkdownTree is compatible with the **Model Context Protocol (MCP)**. Connect it to your MCP-enabled agents and tools via:

👉 **[mcp.platphormnews.com](https://mcp.platphormnews.com)**

MarkdownTree is proudly registered on the [Platphorm News Network](https://platphormnews.com/api/network/graph) and adheres to its [API standards](https://platphormnews.com/api/docs).

---

## 📁 Project Structure

```
markdown-webby/
├── app/            # Next.js app router pages & layouts
├── components/     # Reusable React components
├── hooks/          # Custom React hooks
├── lib/            # Utilities, helpers, and shared logic
├── public/         # Static assets
├── scripts/        # Build & maintenance scripts
├── src/            # Core application source
└── next.config.mjs # Next.js configuration
```

---

## 🤝 Contributing

Contributions are welcome! Please read the [Contributing Guide](CONTRIBUTING.md) before opening a pull request.

---

## 🗺 Roadmap

See [ROADMAP.md](ROADMAP.md) for planned features and milestones.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙏 Credits

Built and maintained by **[Platphorm News](https://platphormnews.com)**.
