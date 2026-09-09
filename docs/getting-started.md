---
title: Getting Started
category: Overview
order: 1
icon: rocket_launch
badge: Quickstart
description: Learn how to set up, build, and deploy documentation using docs-gen in minutes.
---

# Getting Started with docs-gen

`@francofantomius/docs-gen` is a zero-config, static documentation generator tailored for **Material Design 3 (M3)**. It takes a directory of Markdown files and produces a modern single-page documentation app equipped with client-side search, responsive drawer navigation, code copy buttons, callout alerts, and light/dark theme switching with 16 color schemes.

You can use `docs-gen` in two primary ways:

1. **In GitHub Actions (Zero Local Setup)**: Compile and deploy documentation directly to GitHub Pages on every push.
2. **As a Local CLI**: Develop and preview documentation on your local machine with hot-reloading.

---

## 1. Zero-Install via GitHub Actions (Recommended)

If you only want automated documentation deployed on GitHub Pages, you do not need to install anything locally.

### Step 1: Create your Documentation Directory

In your repository, create a `docs/` folder and add an `index.md` file:

```markdown
---
title: My Project Docs
category: Overview
order: 0
icon: home
hero:
  badge: "v1.0.0"
  title: "Welcome to My Project"
  subtitle: "Fast, reliable, and easy to use."
  actions:
    - text: "Get Started"
      link: "#/getting-started"
      variant: "filled"
      icon: "rocket_launch"
---

## Welcome

Welcome to the official documentation for My Project!
```

### Step 2: Add the Deployment Workflow

Create `.github/workflows/deploy-docs.yml`:

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
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Generate Documentation
        uses: FrancoFantomius/docs-gen@main
        with:
          docs-dir: 'docs'
          output-dir: '_site'

      - name: Upload Artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: '_site'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### Step 3: Enable GitHub Pages

1. Navigate to **Settings** > **Pages** in your GitHub repository.
2. Under **Build and deployment**, select **GitHub Actions** as the source.
3. Push your commits to `main`. The workflow will automatically generate and host your site!

---

## 2. Local CLI Usage

If you want to preview docs locally or run the build tool as part of your project's npm scripts:

### Installation

Install `docs-gen` as a development dependency:

```bash
npm install -D @francofantomius/docs-gen
```

Or run directly using `npx`:

```bash
npx @francofantomius/docs-gen --help
```

### Local Development Server

Run the development server with live reload:

```bash
npx docs-gen dev --input docs --port 3000
```

Any edits to your `.md` files or `docs.config.json` will trigger an instant reload in your browser.

### Building for Production

Compile your markdown files into a static production folder (e.g. `_site`):

```bash
npx docs-gen build --input docs --output _site
```

You can preview the built site with any static server:

```bash
npx vite preview --outDir _site
```

---

## Next Steps

- Explore the [CLI Command Reference](#/cli) for all available build and dev server options.
- Learn about [GitHub Actions Deployment](#/github-actions) for custom domains and advanced configurations.
- Read [Markdown Syntax & Frontmatter](#/markdown-syntax) to master alerts, code highlighting, and hero sections.
- Configure site title and URLs in [Configuration (`docs.config.json`)](#/configuration).
