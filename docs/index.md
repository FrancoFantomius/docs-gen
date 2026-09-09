---
title: Docs Gen
category: Overview
order: 0
icon: home
hero:
  badge: "Material Design 3 • Zero Config"
  title: "Docs Gen"
  subtitle: "Write documentation entirely in Markdown and deploy modern Material 3 Single Page Apps directly to GitHub Pages."
  actions:
    - text: "Getting Started"
      link: "#/getting-started"
      variant: "filled"
      icon: "rocket_launch"
    - text: "GitHub Repository"
      link: "https://github.com/FrancoFantomius/docs-gen"
      variant: "outlined"
      icon: "code"
---

## Key Features

- **100% Markdown Driven**: Organize Markdown files into categories simply through folder structure or YAML frontmatter.
- **Material Design 3**: Modern, accessible UI powered by Lit and `@francofantomius/material-components`.
- **Light, Dark & 16 Color Schemes**: Instant live color palette switcher and system dark/light detection.
- **Instant Client-Side Search**: Dynamic `<md-search-bar>` with fuzzy filtering and keyboard navigation (`/` or `Ctrl+K`).
- **Syntax Highlighting & Copy**: Formatted code blocks with one-click copy buttons.
- **GitHub-Style Callout Alerts**: Full support for `> [!NOTE]`, `> [!TIP]`, `> [!IMPORTANT]`, `> [!WARNING]`, and `> [!CAUTION]`.
- **Reusable GitHub Action**: Import `FrancoFantomius/docs-gen@main` in your GitHub Actions workflows for continuous GitHub Pages deployment.
- **Automated `llms.txt` & `llms-full.txt`**: Standard `/llms.txt` index and concatenated `/llms-full.txt` are built automatically for AI crawlers and LLMs.
- **Local Dev Server**: Instant hot-reloading with `docs-gen dev` powered by Vite.

---

## Quick Navigation

| Guide | Description |
|---|---|
| [Getting Started](#/getting-started) | Rapid setup guide for GitHub Actions and local CLI |
| [CLI Reference](#/cli) | Complete options and flags for `docs-gen build` and `dev` |
| [GitHub Actions](#/github-actions) | Workflow setup, deployment inputs, and GitHub Pages instructions |
| [Markdown & Frontmatter](#/markdown-syntax) | Frontmatter parameters, callout alerts, code blocks, and components |
| [Configuration](#/configuration) | `docs.config.json` schema and option precedence |
| [Theming & Palettes](#/theming) | Color schemes, dark mode, and search bar shortcuts |
| [LLM Documentation (`llms.txt`)](llms.txt) | Standard index of documentation for AI agents and LLMs |
