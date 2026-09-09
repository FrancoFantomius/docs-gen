---
title: Markdown & Frontmatter
category: Authoring
order: 1
icon: edit_note
badge: Markdown
description: Complete guide to writing documentation pages with frontmatter, callout alerts, code blocks, and components.
---

# Markdown & Frontmatter Syntax

Every `.md` file inside your documentation folder becomes a page in your generated site. `@francofantomius/docs-gen` supports standard GitHub Flavored Markdown (GFM) along with Material Design 3 enhancements.

---

## Frontmatter Reference

Add a YAML frontmatter block enclosed by `---` at the top of any Markdown file:

```markdown
---
title: Button Component
category: Components
order: 1
icon: smart_button
badge: <md-button>
description: Buttons communicate actions that users can take.
---
```

### Supported Properties

| Property | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | First `# Heading` or filename | Display name in the drawer navigation, page header, and search results. |
| `category` | `string` | Parent folder name or `Overview` | Navigation section in the sidebar drawer where this page is grouped. |
| `order` | `number` | `100` (or `0` for `index.md`) | Order within the category. Lower numbers appear first. |
| `icon` | `string` | `description` (`home` for index) | [Google Material Symbols](https://fonts.google.com/icons) icon name. |
| `badge` | `string` | `""` | Optional pill tag displayed alongside the title in the drawer and page header (e.g. `v2.0` or `Beta`). |
| `description` | `string` | `""` | Summary text displayed below the page title and indexed by client-side search. |
| `hero` | `object` | `null` | *(Index page only)* Configuration for the landing page hero banner. |

### Automatic Inferences

If you don't provide frontmatter:
- **Title**: Extracted from the first `# Heading` in your document, or converted from the filename (e.g., `getting-started.md` becomes `Getting Started`).
- **Category**: Inferred from the parent folder (e.g., `docs/guides/setup.md` gets category `Guides`). Files in the root `docs/` get `General` (or `Overview` if named `index.md` or `README.md`).
- **Order**: Can be prefixed to filenames (e.g., `01-intro.md`, `02-installation.md`).

---

## Home Page Hero Banner (`hero`)

For `index.md`, you can configure a Material 3 hero section:

```markdown
---
title: My Project
category: Overview
order: 0
icon: home
hero:
  badge: "Version 2.0 • Production Ready"
  title: "Modern Material Design"
  subtitle: "Build beautiful web experiences effortlessly."
  actions:
    - text: "Get Started"
      link: "#/getting-started"
      variant: "filled"
      icon: "rocket_launch"
    - text: "GitHub"
      link: "https://github.com/my-org/my-project"
      variant: "outlined"
      icon: "code"
---
```

Button variants supported in `actions`: `filled`, `outlined`, `tonal`, `text`.

---

## GitHub-Style Callout Alerts

You can insert styled Material callout cards using GitHub blockquote syntax:

```markdown
> [!NOTE]
> Informational callout highlighting useful context.

> [!TIP]
> Helpful recommendations or performance best practices.

> [!IMPORTANT]
> Crucial information that users shouldn't miss.

> [!WARNING]
> Warning informing users about potential pitfalls.

> [!CAUTION]
> Warnings regarding critical errors or breaking changes.
```

Each alert automatically renders with appropriate Material colors and icons (`info`, `lightbulb`, `priority_high`, `warning`, `report`).

---

## Code Blocks & Syntax

Code blocks are automatically rendered with the Material 3 `<md-code>` web component, featuring a label, copy-to-clipboard button, and styling:

````markdown
```typescript
interface UserProfile {
  id: string;
  name: string;
  roles: string[];
}
```
````

---

## API & Data Tables

Standard Markdown tables are automatically wrapped in responsive horizontal scrolling containers with Material Design styling:

```markdown
| Parameter | Type | Required | Description |
|---|---|:---:|---|
| `id` | `string` | Yes | Unique identifier |
| `count` | `number` | No | Total count (default: `0`) |
```

---

## Embedding Material Web Components

Because the documentation site runs on Lit and `@francofantomius/material-components`, you can embed live interactive HTML and Material components directly inside your Markdown:

```html
<div style="display: flex; gap: 8px; margin: 16px 0;">
  <md-button variant="filled">Filled Button</md-button>
  <md-button variant="outlined">Outlined Button</md-button>
  <md-button variant="tonal">Tonal Button</md-button>
</div>
```

