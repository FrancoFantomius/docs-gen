---
title: CLI Reference
category: Usage
order: 1
icon: terminal
badge: CLI
description: Command-line options and parameters for docs-gen build and dev commands.
---

# Command Line Interface (CLI)

The `@francofantomius/docs-gen` package provides an executable binary `docs-gen` for building static assets and running local preview servers.

```bash
# General syntax
npx docs-gen [command] [options]
```

## Global Help & Version

```bash
# Print general help and available commands
npx docs-gen --help

# Print version
npx docs-gen --version
```

---

## `docs-gen dev`

Starts a fast local development server with instant browser hot-reloading when `.md` or `.json` files change.

```bash
npx docs-gen dev [options]
```

### Options

| Option | Flag | Default | Description |
|---|---|---|---|
| `--input <path>` | `-i` | `docs` | Path to the directory containing Markdown files. |
| `--port <number>` | `-p` | `3000` | Port for the local dev server. |
| `--no-open` | | `false` | Prevent opening the default browser window automatically. |
| `--title <title>` | `-t` | Inferred / `Documentation` | Site title shown in header and top app bar. |
| `--description <desc>` | `-d` | Inferred | Site description for metadata and search. |
| `--github <url>` | `-g` | `""` | URL to your GitHub repository (adds a GitHub icon button to the top bar). |
| `--config <path>` | `-c` | `<input>/docs.config.json` | Path to a custom `docs.config.json` file. |

### Examples

```bash
# Basic local preview
npx docs-gen dev

# Custom folder and port without opening the browser
npx docs-gen dev -i my-docs -p 8080 --no-open

# Specify custom title and GitHub repository link
npx docs-gen dev -i docs -t "Acme SDK" -g "https://github.com/acme/sdk"
```

---

## `docs-gen build`

Compiles all Markdown files in the input directory, processes YAML frontmatter, builds the search index, bundles CSS and JavaScript with Vite, and exports an optimized static single page application.

```bash
npx docs-gen build [options]
```

### Options

| Option | Flag | Default | Description |
|---|---|---|---|
| `--input <path>` | `-i` | `docs` | Source directory containing Markdown documentation files. |
| `--output <path>` | `-o` | `_site` | Destination directory for the compiled static assets. |
| `--base <path>` | `-b` | `./` | Base URL path for assets (e.g. `/my-repo/` for GitHub Pages). |
| `--title <title>` | `-t` | Inferred | Documentation site title. |
| `--description <desc>` | `-d` | Inferred | Documentation site description. |
| `--github <url>` | `-g` | `""` | GitHub repository link for the top app bar button. |
| `--config <path>` | `-c` | `<input>/docs.config.json` | Path to custom configuration file. |

### Examples

```bash
# Default build into _site
npx docs-gen build

# Build with a specific base path for GitHub Pages hosting
npx docs-gen build -i docs -o _site --base "/my-awesome-repo/"

# Full build command specifying metadata
npx docs-gen build \
  --input docs \
  --output public \
  --base "./" \
  --title "Component Library" \
  --github "https://github.com/my-org/components"
```

---

## Adding to `package.json`

You can integrate `docs-gen` directly into your `package.json` scripts:

```json
{
  "scripts": {
    "docs:dev": "docs-gen dev --input docs",
    "docs:build": "docs-gen build --input docs --output _site",
    "docs:preview": "vite preview --outDir _site"
  },
  "devDependencies": {
    "@francofantomius/docs-gen": "^1.0.0"
  }
}
```

Now you can simply run:

```bash
npm run docs:dev
npm run docs:build
```

