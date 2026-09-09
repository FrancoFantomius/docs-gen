---
title: Configuration
category: Reference
order: 1
icon: settings
badge: Config
description: Reference guide for docs.config.json and site customization options.
---

# Configuration File (`docs.config.json`)

To centralize project configuration without repeating CLI arguments, you can place a `docs.config.json` file inside your documentation folder (e.g. `docs/docs.config.json`) or specify its path with `--config`.

---

## Example `docs.config.json`

```json
{
  "title": "My Awesome Library",
  "description": "Comprehensive guide and API documentation.",
  "githubUrl": "https://github.com/username/my-awesome-library",
  "baseUrl": "./"
}
```

---

## Configuration Properties

| Property | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | `"Documentation"` | Name of your documentation site. Displayed in the browser title, top app bar, and drawer header. |
| `description` | `string` | `"Material Design 3 Documentation"` | Site description inserted into the `<meta name="description">` tag for SEO and social sharing. |
| `githubUrl` | `string` | `""` | Full URL to your GitHub repository. When specified, a GitHub icon button is added to the top app bar. |
| `baseUrl` | `string` | `"./"` | Base URL path for assets. For GitHub Pages under a subpath, specify `"/<repo-name>/"`. |

---

## Precedence Order

Configuration options can come from multiple sources. They are resolved in the following priority order (highest to lowest):

1. **Command Line Flags** (e.g. `--title`, `--github`, `--base`)
2. **Configuration File** (`docs.config.json` or path specified by `--config`)
3. **Environment & GitHub Action Defaults** (auto-detected from GitHub repository metadata)
4. **Built-in Fallbacks**

