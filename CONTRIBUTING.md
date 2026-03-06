# 🤝 Contributing to MarkdownTree

Thank you for considering a contribution to MarkdownTree! Every bug report, feature request, and pull request helps make the project better for everyone.

---

## 📋 Table of Contents

- [Code of Conduct](#-code-of-conduct)
- [Getting Started](#-getting-started)
- [Development Workflow](#-development-workflow)
- [Pull Request Guidelines](#-pull-request-guidelines)
- [Coding Standards](#-coding-standards)
- [Reporting Issues](#-reporting-issues)

---

## 🧭 Code of Conduct

This project follows the [Contributor Covenant](https://www.contributor-covenant.org/) code of conduct. Please be respectful and constructive in all interactions.

---

## 🚀 Getting Started

1. **Fork** the repository on GitHub.
2. **Clone** your fork locally:

   ```sh
   git clone https://github.com/<your-username>/markdown-webby.git
   cd markdown-webby
   ```

3. **Install dependencies**:

   ```sh
   npm install
   ```

4. **Start the dev server**:

   ```sh
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔄 Development Workflow

1. Create a feature branch from `main`:

   ```sh
   git checkout -b feat/my-feature
   ```

2. Make your changes.
3. Run the linter:

   ```sh
   npm run lint
   ```

4. Build to verify there are no errors:

   ```sh
   npm run build
   ```

5. Commit with a clear message:

   ```sh
   git commit -m "feat: add my feature"
   ```

6. Push and open a pull request.

---

## ✅ Pull Request Guidelines

- **Small, focused PRs** are preferred over large sweeping changes.
- Include a clear description of *what* changed and *why*.
- Reference related issues (e.g., `Fixes #42`).
- Make sure the build passes (`npm run build`).
- Update documentation if your change affects user-facing behavior.

---

## 🎨 Coding Standards

- **TypeScript** — all new code should be fully typed.
- **Tailwind CSS** — use utility classes; avoid inline styles.
- **Radix UI / shadcn/ui** — use existing UI primitives where possible.
- **Formatting** — Prettier is configured. Run `npx prettier --write .` if needed.
- **Linting** — ESLint rules are enforced via `npm run lint`.

---

## 🐛 Reporting Issues

When opening an issue, please include:

1. **Description** — what happened and what you expected.
2. **Steps to reproduce** — minimal reproduction steps.
3. **Environment** — browser, OS, Node.js version.
4. **Screenshots** — if the issue is visual.

---

Thank you for helping improve MarkdownTree! 🌳
