# @francofantomius/docs-gen

> A modern, accessible, and lightweight **Material Design 3 (M3)** static documentation generator from Markdown, powered by Lit, Vite, and [@francofantomius/material-components](https://github.com/FrancoFantomius/material-components).

Write your project documentation exclusively in clean **Markdown files (`.md`)**. When pushed to GitHub, `@francofantomius/docs-gen` automatically compiles your documentation into a responsive Material 3 Single Page Application (SPA) and publishes it seamlessly to **GitHub Pages**.

---

## Features

- **100% Markdown-Driven**: Write `.md` files anywhere in your repository with optional YAML frontmatter.
- **Material Design 3 Theme**: Complete M3 design token support with Light, Dark, and System modes.
- **16 Material Color Palettes**: Instant live theme switcher with 16 color schemes and system accent color detection.
- **Fully Responsive Layout**: Material Design top app bar and navigation drawer that docks on desktop and transitions to modal drawer on mobile.
- **Instant Client-Side Search**: Dynamic `<md-search-bar>` with fuzzy filtering and keyboard shortcuts (`/` or `Ctrl+K` / `Cmd+K`).
- **Syntax-Highlighted Code Blocks**: Automatically converts code blocks to `<md-code>` web components with instant one-click copy buttons.
- **GitHub-Style Callouts**: Native support for `> [!NOTE]`, `> [!TIP]`, `> [!IMPORTANT]`, `> [!WARNING]`, and `> [!CAUTION]`.
- **Material 3 Tables**: Clean API tables with responsive horizontal scrolling containers.
- **Reusable GitHub Action**: Import directly in your GitHub workflows (`uses: FrancoFantomius/docs-gen@main`) with automated GitHub Pages artifact deployment.
- **Automatic `llms.txt` & `llms-full.txt`**: Standard `/llms.txt` index and concatenated `/llms-full.txt` are automatically generated for AI agents and LLMs.
- **Lightning Fast**: Built on top of Vite for sub-second builds and instant local hot-reloading.

---

## Quick Start with GitHub Actions & GitHub Pages

To add automated documentation deployment to any GitHub repository:

### 1. Structure Your Markdown Files

In your project repository, create a `docs/` folder with Markdown files:

```
my-project/
├── docs/
│   ├── index.md                 # Home page
│   ├── guides/
│   │   ├── getting-started.md   # Guide page
│   │   └── configuration.md
│   └── components/
│       ├── button.md            # Component / API page
│       └── modal.md
└── .github/
    └── workflows/
        └── deploy-docs.yml
```

### 2. Create the GitHub Actions Workflow

Create `.github/workflows/deploy-docs.yml` in your repository:

```yaml
name: Deploy Documentation

on:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Project
        uses: actions/checkout@v4

      - name: Build Documentation
        uses: FrancoFantomius/docs-gen@main
        with:
          docs-dir: 'docs'
          output-dir: '_site'

      - name: Upload GitHub Pages Artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: '_site'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 3. Enable GitHub Pages

In your repository on GitHub:
1. Go to **Settings** > **Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Push to `main` — your documentation will be built and published automatically!

---

## Local CLI Usage

You can also run `docs-gen` locally or integrate it into your build scripts:

### Installation

```bash
npm install -D @francofantomius/docs-gen
```

### Build for Production

```bash
# Build docs folder into _site directory
npx docs-gen build --input docs --output _site

# Specify custom project title and GitHub URL
npx docs-gen build -i docs -o _site -t "My Library" -g "https://github.com/my-org/my-library"
```

### Local Development Server

Run a local development server with instant hot-reload whenever Markdown files change:

```bash
npx docs-gen dev --input docs --port 3000
```

---

## Writing Documentation in Markdown

### YAML Frontmatter

Add frontmatter to the top of any Markdown file to control navigation, icons, and metadata:

```markdown
---
title: Button
category: Components
order: 1
icon: smart_button
badge: <md-button>
description: Buttons help users initiate actions and choices.
---

# Button Component
Content goes here...
```

| Property | Type | Description |
|---|---|---|
| `title` | `string` | Page title displayed in header, breadcrumb, and drawer (inferred from first `# Heading` if omitted). |
| `category` | `string` | Group name in the navigation drawer (inferred from parent directory if omitted). |
| `order` | `number` | Ordering weight in navigation drawer (lower numbers appear first). |
| `icon` | `string` | [Material Symbols](https://fonts.google.com/icons) icon name. |
| `badge` | `string` | Optional tag chip displayed next to the title (e.g. `<md-button>` or `v1.2`). |
| `description` | `string` | Summary text displayed under the title and indexed in search. |

### Home Page Hero (`index.md`)

In your root `index.md`, you can define a custom hero banner:

```markdown
---
title: My Library
category: Overview
order: 0
icon: home
hero:
  badge: "Version 1.0 • Modern UI"
  title: "My Awesome Library"
  subtitle: "High-performance, accessible components built for the modern web."
  actions:
    - text: "Get Started"
      link: "#/guides/getting-started"
      variant: "filled"
      icon: "rocket_launch"
    - text: "Browse API"
      link: "#/components/button"
      variant: "outlined"
      icon: "widgets"
---

## Additional Content
...
```

### GitHub-Style Alerts

Use standard GitHub alert syntax:

```markdown
> [!NOTE]
> Useful information that users should know.

> [!TIP]
> Helpful advice or best practices.

> [!IMPORTANT]
> Key information users need to know.

> [!WARNING]
> Urgent info that needs immediate user attention to avoid problems.

> [!CAUTION]
> Advises about potential negative consequences or breaking changes.
```

### Code Blocks & Previews

Code blocks are automatically rendered with the Material 3 `<md-code>` web component with copy-to-clipboard support:

````markdown
```javascript
import '@francofantomius/material-components/button';
```
````

You can also embed live Web Components directly inside your Markdown:

```html
<div class="example-box">
  <h3>Interactive Demo</h3>
  <div class="demo-preview">
    <md-button variant="filled">Click Me</md-button>
  </div>
</div>
```

---

## Configuration File (`docs.config.json`)

You can place an optional `docs.config.json` in your documentation folder:

```json
{
  "title": "My Project",
  "description": "Comprehensive documentation for My Project",
  "githubUrl": "https://github.com/my-username/my-project",
  "baseUrl": "./"
}
```

---

## GitHub Action Inputs (`action.yml`)

| Input | Description | Default |
|---|---|---|
| `docs-dir` | Path to your Markdown docs folder | `docs` |
| `output-dir` | Output directory for the static site | `_site` |
| `base-url` | Base URL path for GitHub Pages | `/<repository-name>/` |
| `project-title` | Title in the top app bar | Repository name |
| `project-description` | SEO meta description | Inferred / default |
| `github-url` | URL for the top bar GitHub icon | Repository URL |
| `config` | Path to custom `docs.config.json` | `""` |

---

## LLM Documentation (`llms.txt`)

`docs-gen` automatically generates [llms.txt](https://llmstxt.org) standard files during every build:
- `/llms.txt`: Structured markdown index of all documentation sections, pages, and summaries designed for quick LLM ingestion.
- `/llms-full.txt`: Complete concatenated markdown of your entire documentation in a single file.

If you want to provide custom curated LLM instructions, simply place an `llms.txt` file inside your documentation folder (e.g. `docs/llms.txt`) and `docs-gen` will use it instead.

---

## License

MIT - [Franco Fantomius](https://github.com/FrancoFantomius)
