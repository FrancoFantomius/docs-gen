import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

// Helper to convert kebab-case or snake_case to Title Case
export function toTitleCase(str) {
  if (!str) return '';
  return str
    .replace(/^[\d]+[-_]/, '') // remove leading sort numbers like 01- or 02_
    .replace(/[-_]/g, ' ')
    .replace(/\.md$/i, '')
    .split(' ')
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

// Convert GitHub style alerts like > [!NOTE] into Material Design alert callouts
export function processAlerts(html) {
  const alertTypes = {
    NOTE: { icon: 'info', title: 'Note', class: 'docs-alert-note' },
    TIP: { icon: 'lightbulb', title: 'Tip', class: 'docs-alert-tip' },
    IMPORTANT: { icon: 'priority_high', title: 'Important', class: 'docs-alert-important' },
    WARNING: { icon: 'warning', title: 'Warning', class: 'docs-alert-warning' },
    CAUTION: { icon: 'report', title: 'Caution', class: 'docs-alert-caution' }
  };

  return html.replace(
    /<blockquote>\s*<p>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]([\s\S]*?)<\/blockquote>/gi,
    (match, type, content) => {
      const alertInfo = alertTypes[type.toUpperCase()] || alertTypes.NOTE;
      // Trim leading <br> or newlines from content
      const cleanContent = content.replace(/^(\s*<br\s*\/?>)+/i, '').trim();
      return `
<div class="docs-alert ${alertInfo.class}">
  <div class="docs-alert-header">
    <md-icon name="${alertInfo.icon}"></md-icon>
    <span class="docs-alert-title">${alertInfo.title}</span>
  </div>
  <div class="docs-alert-body">
    <p>${cleanContent}</p>
  </div>
</div>`;
    }
  );
}

// Wrap tables in table-container and apply api-table class
export function enhanceTables(html) {
  return html.replace(/<table>([\s\S]*?)<\/table>/gi, (match) => {
    return `<div class="table-container"><table class="api-table">${match.slice(7, -8)}</table></div>`;
  });
}

// Escape attribute strings for HTML
export function escapeAttr(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Custom renderer for marked
export function createMarkedRenderer() {
  const renderer = new marked.Renderer();

  // Custom code renderer: convert code blocks to <md-code>
  renderer.code = function ({ text, lang }) {
    const language = lang || 'plaintext';
    const escapedCode = escapeAttr(text);
    const label = language !== 'plaintext' ? toTitleCase(language) : 'Code';
    return `<md-code language="${escapeAttr(language)}" label="${escapeAttr(label)}" code="${escapedCode}"></md-code>\n`;
  };

  // Add id attributes to headings for anchor links
  renderer.heading = function ({ tokens, depth }) {
    const text = this.parser.parseInline(tokens);
    const rawText = text.replace(/<[^>]*>/g, '');
    const id = rawText
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
    return `<h${depth} id="${id}">${text}</h${depth}>\n`;
  };

  return renderer;
}

// Parse a single markdown file
export function parseMarkdownFile(filePath, docsRootDir) {
  const rawContent = fs.readFileSync(filePath, 'utf-8');
  const relativePath = path.relative(docsRootDir, filePath).replace(/\\/g, '/');
  const pathParts = relativePath.split('/');
  const fileName = path.basename(filePath);
  const baseName = fileName.replace(/\.md$/i, '');

  const { data: frontmatter, content } = matter(rawContent);

  // Determine if it's the home / root page
  const isIndex =
    baseName.toLowerCase() === 'index' ||
    baseName.toLowerCase() === 'readme';

  // Category determination
  let category = frontmatter.category;
  if (!category) {
    if (pathParts.length > 1) {
      // Use parent folder name
      category = toTitleCase(pathParts[0]);
    } else if (isIndex) {
      category = 'Overview';
    } else {
      category = 'General';
    }
  }

  // Title determination
  let title = frontmatter.title;
  let cleanContent = content;
  if (!title) {
    // Check if markdown starts with an # Heading
    const headingMatch = content.match(/^#\s+(.+)$/m);
    if (headingMatch) {
      title = headingMatch[1].trim();
      // Optionally remove first h1 so it isn't rendered twice
      cleanContent = content.replace(/^#\s+(.+)$/m, '').trim();
    } else {
      title = toTitleCase(baseName);
    }
  }

  // Route ID and Hash Path
  let routeId = '';
  let hashPath = '';
  if (isIndex && pathParts.length === 1) {
    routeId = 'index';
    hashPath = '#/';
  } else {
    routeId = relativePath.replace(/\.md$/i, '').replace(/[\/\\]/g, '-');
    hashPath = `#/${relativePath.replace(/\.md$/i, '')}`;
  }

  // Order determination
  let order = 100;
  if (typeof frontmatter.order === 'number') {
    order = frontmatter.order;
  } else if (isIndex && pathParts.length === 1) {
    order = 0;
  } else {
    // Check if file starts with digits like 01-introduction.md
    const numPrefixMatch = baseName.match(/^(\d+)[-_]/);
    if (numPrefixMatch) {
      order = parseInt(numPrefixMatch[1], 10);
    }
  }

  // Parse markdown body using marked with custom renderer
  marked.setOptions({
    gfm: true,
    breaks: false
  });
  const renderer = createMarkedRenderer();
  let html = marked.parse(cleanContent, { renderer });

  // Post-process alerts and tables
  html = processAlerts(html);
  html = enhanceTables(html);

  // Generate icon
  const icon = frontmatter.icon || (isIndex ? 'home' : 'description');

  return {
    id: routeId,
    path: hashPath,
    title,
    category,
    order,
    icon,
    badge: frontmatter.badge || '',
    description: frontmatter.description || frontmatter.summary || '',
    hero: frontmatter.hero || null, // Optional custom hero object for home page
    contentHtml: html,
    rawMarkdown: cleanContent,
    sourcePath: relativePath
  };
}

// Find all markdown files recursively
export function findMarkdownFiles(dir) {
  let files = [];
  if (!fs.existsSync(dir)) return files;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!['node_modules', '.git', '_site', 'dist'].includes(entry.name)) {
        files = files.concat(findMarkdownFiles(fullPath));
      }
    } else if (entry.isFile() && /\.md$/i.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

// Scan entire docs directory and generate documentation manifest
export function parseDocsDirectory(docsRootDir, options = {}) {
  const resolvedDir = path.resolve(docsRootDir);
  const mdFiles = findMarkdownFiles(resolvedDir);

  const docs = mdFiles.map(file => parseMarkdownFile(file, resolvedDir));

  // Sort docs by order, then title
  docs.sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order;
    return a.title.localeCompare(b.title);
  });

  // Group into categories
  const categoryMap = new Map();
  for (const doc of docs) {
    if (!categoryMap.has(doc.category)) {
      categoryMap.set(doc.category, []);
    }
    categoryMap.get(doc.category).push(doc);
  }

  const categories = [];
  // Ensure Overview is first if present
  if (categoryMap.has('Overview')) {
    categories.push({
      name: 'Overview',
      items: categoryMap.get('Overview').map(docToNavItem)
    });
    categoryMap.delete('Overview');
  }

  for (const [catName, catDocs] of categoryMap.entries()) {
    categories.push({
      name: catName,
      items: catDocs.map(docToNavItem)
    });
  }

  // Generate Search Items
  const searchIndex = docs.map(doc => ({
    id: doc.id,
    label: doc.title,
    value: doc.title,
    supportingText: doc.description || `${doc.category} documentation`,
    trailingSupportingText: doc.badge || doc.category,
    icon: doc.icon || 'description',
    path: doc.path,
    category: doc.category
  }));

  // Site metadata
  const siteConfig = {
    title: options.title || 'Documentation',
    description: options.description || 'Material Design 3 Documentation',
    githubUrl: options.githubUrl || '',
    baseUrl: options.baseUrl || '/'
  };

  return {
    siteConfig,
    categories,
    docs,
    searchIndex
  };
}

function docToNavItem(doc) {
  return {
    id: doc.id,
    title: doc.title,
    path: doc.path,
    icon: doc.icon,
    badge: doc.badge,
    order: doc.order
  };
}

// Generate llms.txt standard file for LLMs and AI crawlers
export function generateLlmsTxt(siteConfig, categories, docs) {
  let out = `# ${siteConfig.title || 'Documentation'}\n\n`;
  if (siteConfig.description) {
    out += `> ${siteConfig.description}\n\n`;
  }
  if (siteConfig.githubUrl) {
    out += `GitHub Repository: ${siteConfig.githubUrl}\n\n`;
  }

  out += `This documentation is generated with [@francofantomius/docs-gen](https://github.com/FrancoFantomius/docs-gen).\n\n`;

  for (const cat of categories) {
    out += `## ${cat.name}\n\n`;
    for (const item of cat.items) {
      const doc = docs.find(d => d.id === item.id);
      const desc = doc?.description ? `: ${doc.description}` : '';
      out += `- [${item.title}](${item.path})${desc}\n`;
    }
    out += '\n';
  }

  out += `## Optional\n\n`;
  out += `- [Full Documentation Concatenated](llms-full.txt): Complete markdown contents of all documentation pages.\n`;

  return out.trim() + '\n';
}

// Generate llms-full.txt containing the concatenated content of all docs pages
export function generateLlmsFullTxt(siteConfig, docs) {
  let out = `# ${siteConfig.title || 'Documentation'} - Full Documentation\n\n`;
  if (siteConfig.description) {
    out += `> ${siteConfig.description}\n\n`;
  }

  for (const doc of docs) {
    out += `\n---\n\n`;
    out += `# ${doc.title}\n\n`;
    if (doc.description) {
      out += `*${doc.description}*\n\n`;
    }
    if (doc.rawMarkdown) {
      out += `${doc.rawMarkdown.trim()}\n`;
    }
  }

  return out.trim() + '\n';
}


