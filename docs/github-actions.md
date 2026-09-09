---
title: GitHub Actions
category: Usage
order: 2
icon: smart_display
badge: CI/CD
description: Complete guide on deploying your documentation to GitHub Pages with the docs-gen GitHub Action.
---

# GitHub Actions Deployment

`FrancoFantomius/docs-gen` is published as a reusable GitHub Composite Action. It automatically configures Node.js, installs dependencies, derives your repository title and base URL, compiles your docs, and produces an artifact ready for GitHub Pages.

---

## Complete Workflow Template

Save this file as `.github/workflows/deploy-docs.yml` in your repository:

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

      - name: Upload GitHub Pages Artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: '_site'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

---

## Action Inputs (`with:`)

All inputs are optional and have sensible defaults:

| Input | Description | Default |
|---|---|---|
| `docs-dir` | Path to the directory containing Markdown documentation. | `'docs'` |
| `output-dir` | Path to directory where compiled static files will be placed. | `'_site'` |
| `base-url` | Base URL path for assets. Auto-detected as `/<repository-name>/`. Set to `'/'` or `'./'` if using custom domain. | `''` (auto-detected) |
| `project-title` | Site title displayed in the top navigation app bar. | Auto-detected from repository name |
| `project-description` | SEO meta description inserted into HTML `<head>`. | Auto-detected |
| `github-url` | URL pointing to your repository for the top app bar GitHub button. | Auto-detected (`https://github.com/<owner>/<repo>`) |
| `config` | Path to a custom `docs.config.json` configuration file. | `''` (falls back to `docs.config.json` inside `docs-dir`) |

---

## Common Scenarios

### Custom Domains on GitHub Pages

If your repository uses a custom domain (e.g., `https://docs.mycompany.com` instead of `https://username.github.io/my-repo/`), override `base-url`:

```yaml
- name: Generate Documentation
  uses: FrancoFantomius/docs-gen@main
  with:
    docs-dir: 'docs'
    output-dir: '_site'
    base-url: '/'
```

### Custom Site Title & Description

```yaml
- name: Generate Documentation
  uses: FrancoFantomius/docs-gen@main
  with:
    docs-dir: 'docs'
    output-dir: '_site'
    project-title: 'Design System Documentation'
    project-description: 'Official Material Design 3 component library and guidelines.'
```

### Monorepo or Subdirectory Documentation

If your documentation lives inside a subpackage (e.g., `packages/client/docs`):

```yaml
- name: Generate Documentation
  uses: FrancoFantomius/docs-gen@main
  with:
    docs-dir: 'packages/client/docs'
    output-dir: '_site'
```

---

## Required Repository Settings on GitHub

Before running the action:

1. In GitHub, go to your repository **Settings**.
2. In the left sidebar, click **Pages**.
3. Under **Build and deployment** > **Source**, select **GitHub Actions** (do NOT choose "Deploy from a branch").
4. Under **Workflow permissions** (in Settings > Actions > General), ensure `GITHUB_TOKEN` has read and write permissions (or rely on the `permissions:` block in the workflow YAML above).

