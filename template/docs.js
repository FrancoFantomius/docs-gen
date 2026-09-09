import '@francofantomius/material-components';
import { applyTheme, darkColorScheme, lightColorScheme } from '@francofantomius/material-components/theme';
import { SITE_CONFIG, CATEGORIES, DOCS, SEARCH_INDEX } from './docs-data.js';

// --- HTML Escaping Helper ---
function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// --- Toast & Notification Helper ---
export function showToast(message) {
  const snackbar = document.getElementById('global-snackbar');
  if (snackbar) {
    snackbar.message = message;
    snackbar.show();
  }
}

// --- Clipboard Copy Helper ---
export function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast('Copied to clipboard!');
  }).catch(() => {
    showToast('Failed to copy to clipboard');
  });
}

// --- Color Palettes & Theming ---
export const PALETTES = [
  { id: 'purple', name: 'Purple (Default)', hex: '#6750A4' },
  { id: 'violet', name: 'Violet', hex: '#7E57C2' },
  { id: 'indigo', name: 'Indigo', hex: '#3F51B5' },
  { id: 'blue', name: 'Blue', hex: '#1976D2' },
  { id: 'sky', name: 'Sky', hex: '#0288D1' },
  { id: 'cyan', name: 'Cyan', hex: '#00838F' },
  { id: 'teal', name: 'Teal', hex: '#00796B' },
  { id: 'green', name: 'Green', hex: '#2E7D32' },
  { id: 'light-green', name: 'Light Green', hex: '#558B2F' },
  { id: 'lime', name: 'Lime', hex: '#827717' },
  { id: 'yellow', name: 'Yellow', hex: '#F57F17' },
  { id: 'orange', name: 'Orange', hex: '#E65100' },
  { id: 'deep-orange', name: 'Deep Orange', hex: '#D84315' },
  { id: 'red', name: 'Red', hex: '#B3261E' },
  { id: 'pink', name: 'Pink', hex: '#C2185B' },
  { id: 'slate', name: 'Slate', hex: '#455A64' },
];

function hexToHsl(hex) {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const num = parseInt(c, 16);
  let r = (num >> 16) / 255;
  let g = ((num >> 8) & 255) / 255;
  let b = (num & 255) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToHex(h, s, l) {
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;
  const a = s * Math.min(l, 1 - l);
  const f = n => {
    const k = (n + (h % 360) / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

function generateColorScheme(paletteId, isDark) {
  if (paletteId === 'purple') {
    return isDark ? darkColorScheme : lightColorScheme;
  }
  const palette = PALETTES.find(p => p.id === paletteId) || PALETTES[0];
  const [h, s] = hexToHsl(palette.hex);

  if (isDark) {
    return {
      primary: hslToHex(h, Math.max(s, 60), 80),
      onPrimary: hslToHex(h, Math.max(s, 70), 20),
      primaryContainer: hslToHex(h, Math.max(s, 60), 32),
      onPrimaryContainer: hslToHex(h, Math.max(s, 60), 90),
      secondary: hslToHex((h + 10) % 360, 25, 75),
      onSecondary: hslToHex((h + 10) % 360, 30, 20),
      secondaryContainer: hslToHex((h + 10) % 360, 30, 32),
      onSecondaryContainer: hslToHex((h + 10) % 360, 35, 92),
      tertiary: hslToHex((h + 60) % 360, 40, 80),
      onTertiary: hslToHex((h + 60) % 360, 45, 20),
      tertiaryContainer: hslToHex((h + 60) % 360, 45, 32),
      onTertiaryContainer: hslToHex((h + 60) % 360, 50, 92),
      error: '#F2B8B5',
      onError: '#601410',
      errorContainer: '#8C1D18',
      onErrorContainer: '#F9DEDC',
      background: '#141218',
      onBackground: '#E6E0E9',
      surface: '#141218',
      onSurface: '#E6E0E9',
      surfaceVariant: '#49454F',
      onSurfaceVariant: '#CAC4D0',
      outline: '#938F99',
      outlineVariant: '#49454F',
      shadow: '#000000',
      scrim: 'rgba(0, 0, 0, 0.32)',
      inverseSurface: '#E6E0E9',
      inverseOnSurface: '#313033',
      inversePrimary: palette.hex,
      surfaceDim: '#141218',
      surfaceBright: '#3B383E',
      surfaceContainerLowest: '#0F0D13',
      surfaceContainerLow: '#1D1B20',
      surfaceContainer: '#211F26',
      surfaceContainerHigh: '#2B2930',
      surfaceContainerHighest: '#36343B',
    };
  }

  return {
    primary: palette.hex,
    onPrimary: '#FFFFFF',
    primaryContainer: hslToHex(h, Math.max(s, 55), 90),
    onPrimaryContainer: hslToHex(h, Math.max(s, 70), 16),
    secondary: hslToHex((h + 10) % 360, 25, 42),
    onSecondary: '#FFFFFF',
    secondaryContainer: hslToHex((h + 10) % 360, 35, 92),
    onSecondaryContainer: hslToHex((h + 10) % 360, 40, 16),
    tertiary: hslToHex((h + 60) % 360, 40, 42),
    onTertiary: '#FFFFFF',
    tertiaryContainer: hslToHex((h + 60) % 360, 50, 92),
    onTertiaryContainer: hslToHex((h + 60) % 360, 55, 16),
    error: '#B3261E',
    onError: '#FFFFFF',
    errorContainer: '#F9DEDC',
    onErrorContainer: '#410E0B',
    background: hslToHex(h, 15, 99),
    onBackground: '#1D1B20',
    surface: hslToHex(h, 15, 99),
    onSurface: '#1D1B20',
    surfaceVariant: hslToHex(h, 15, 92),
    onSurfaceVariant: '#49454F',
    outline: '#79747E',
    outlineVariant: '#CAC4D0',
    shadow: '#000000',
    scrim: 'rgba(0, 0, 0, 0.32)',
    inverseSurface: '#313033',
    inverseOnSurface: '#F4EFF4',
    inversePrimary: hslToHex(h, Math.max(s, 60), 80),
    surfaceDim: hslToHex(h, 10, 88),
    surfaceBright: hslToHex(h, 15, 99),
    surfaceContainerLowest: '#FFFFFF',
    surfaceContainerLow: hslToHex(h, 12, 97),
    surfaceContainer: hslToHex(h, 12, 95),
    surfaceContainerHigh: hslToHex(h, 12, 92),
    surfaceContainerHighest: hslToHex(h, 12, 90),
  };
}

let currentTheme = localStorage.getItem('docs-theme') || 'system';
let currentPalette = localStorage.getItem('docs-palette') || 'purple';

function applyCurrentTheme() {
  const isDark =
    currentTheme === 'dark' ||
    (currentTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');

  const scheme = generateColorScheme(currentPalette, isDark);
  applyTheme(scheme);

  const themeIcon = document.getElementById('theme-icon');
  if (themeIcon) {
    if (currentTheme === 'system') themeIcon.name = 'brightness_auto';
    else if (currentTheme === 'dark') themeIcon.name = 'dark_mode';
    else themeIcon.name = 'light_mode';
  }
}

function setupPalettePicker() {
  const paletteMenu = document.getElementById('palette-menu');
  const paletteGrid = document.getElementById('palette-grid');
  const pickerBtn = document.getElementById('palette-picker-btn');
  const resetBtn = document.getElementById('reset-palette-btn');
  const themeBtn = document.getElementById('theme-toggle-btn');

  if (!paletteMenu || !paletteGrid || !pickerBtn) return;

  // Render Swatches
  paletteGrid.innerHTML = PALETTES.map(p => `
    <button
      type="button"
      class="palette-swatch-btn ${p.id === currentPalette ? 'selected' : ''}"
      data-palette-id="${p.id}"
      title="${escapeHtml(p.name)}"
      style="background-color: ${p.hex};"
    >
      <span class="swatch-check material-symbols-outlined">check</span>
    </button>
  `).join('');

  paletteGrid.querySelectorAll('.palette-swatch-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const paletteId = btn.getAttribute('data-palette-id');
      currentPalette = paletteId;
      localStorage.setItem('docs-palette', paletteId);
      updatePaletteMenuSelection();
      applyCurrentTheme();
      paletteMenu.setAttribute('hidden', '');
      showToast(`Palette: ${PALETTES.find(p => p.id === paletteId)?.name}`);
    });
  });

  resetBtn?.addEventListener('click', () => {
    currentPalette = 'purple';
    localStorage.removeItem('docs-palette');
    updatePaletteMenuSelection();
    applyCurrentTheme();
    paletteMenu.setAttribute('hidden', '');
    showToast('Reset palette to default Purple');
  });

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      if (currentTheme === 'system') currentTheme = 'light';
      else if (currentTheme === 'light') currentTheme = 'dark';
      else currentTheme = 'system';

      localStorage.setItem('docs-theme', currentTheme);
      applyCurrentTheme();
      showToast(`Theme: ${currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1)}`);
    });
  }

  pickerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isHidden = paletteMenu.hasAttribute('hidden');
    if (isHidden) paletteMenu.removeAttribute('hidden');
    else paletteMenu.setAttribute('hidden', '');
  });

  document.addEventListener('click', (e) => {
    if (!paletteMenu.hasAttribute('hidden') && !paletteMenu.contains(e.target) && !pickerBtn.contains(e.target)) {
      paletteMenu.setAttribute('hidden', '');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !paletteMenu.hasAttribute('hidden')) {
      paletteMenu.setAttribute('hidden', '');
    }
  });

  applyCurrentTheme();
}

function updatePaletteMenuSelection() {
  const paletteGrid = document.getElementById('palette-grid');
  if (!paletteGrid) return;
  paletteGrid.querySelectorAll('.palette-swatch-btn').forEach(btn => {
    const isSelected = btn.getAttribute('data-palette-id') === currentPalette;
    if (isSelected) btn.classList.add('selected');
    else btn.classList.remove('selected');
  });
}

// --- Navigation Drawer Setup ---
const docsDrawer = document.getElementById('docs-drawer');
const menuBtn = document.getElementById('menu-nav-btn');

if (menuBtn && docsDrawer) {
  menuBtn.addEventListener('click', () => {
    docsDrawer.toggle();
  });
}

function renderDrawerItems() {
  if (!docsDrawer) return;

  let html = '';
  CATEGORIES.forEach(cat => {
    if (!cat.items || cat.items.length === 0) return;
    html += `
      <div class="drawer-section-title">${escapeHtml(cat.name)}</div>
      ${cat.items.map(item => {
        const badgeAttr = item.badge ? `badge="${escapeHtml(item.badge)}"` : '';
        const iconAttr = item.icon ? `icon="${escapeHtml(item.icon)}"` : '';
        return `
          <md-navigation-drawer-item
            href="${item.path}"
            label="${escapeHtml(item.title)}"
            data-route-id="${item.id}"
            ${iconAttr}
            ${badgeAttr}
          ></md-navigation-drawer-item>
        `;
      }).join('')}
    `;
  });

  docsDrawer.innerHTML = html;

  // Add click listener to close drawer on mobile navigation
  docsDrawer.querySelectorAll('md-navigation-drawer-item').forEach(item => {
    item.addEventListener('click', () => {
      if (window.innerWidth <= 960) {
        docsDrawer.close();
      }
    });
  });
}

function updateActiveDrawerItem(routeId) {
  if (!docsDrawer) return;
  const items = docsDrawer.querySelectorAll('md-navigation-drawer-item');
  items.forEach(item => {
    const itemRouteId = item.getAttribute('data-route-id');
    const isActive = itemRouteId === routeId;
    if (isActive) item.setAttribute('active', '');
    else item.removeAttribute('active');
  });
}

// --- Quick Search Setup ---
function setupSearch() {
  const searchBar = document.getElementById('docs-search-bar');
  if (!searchBar) return;

  function getFilteredSuggestions(query) {
    const q = (query || '').trim().toLowerCase();
    if (!q) return SEARCH_INDEX;

    const matched = SEARCH_INDEX.filter(item => {
      const label = (item.label || '').toLowerCase();
      const desc = (item.supportingText || '').toLowerCase();
      const tag = (item.trailingSupportingText || '').toLowerCase();
      const cat = (item.category || '').toLowerCase();
      const id = (item.id || '').toLowerCase();
      return label.includes(q) || desc.includes(q) || tag.includes(q) || cat.includes(q) || id.includes(q);
    });

    if (matched.length === 0) {
      return [
        {
          label: 'No results found',
          supportingText: `No documentation matching "${query}"`,
          icon: 'search_off',
          isNoResult: true
        }
      ];
    }
    return matched;
  }

  searchBar.suggestions = SEARCH_INDEX;

  function handleNavigate(item) {
    if (!item || item.isNoResult || !item.path) return;
    window.location.hash = item.path;
    searchBar.value = '';
    searchBar.suggestions = SEARCH_INDEX;
    searchBar.close();
    if (window.innerWidth <= 960 && docsDrawer) {
      docsDrawer.close();
    }
  }

  searchBar.addEventListener('input', (e) => {
    const query = e.detail?.value ?? searchBar.value ?? '';
    searchBar.suggestions = getFilteredSuggestions(query);
  });

  searchBar.addEventListener('suggestion-select', (e) => {
    handleNavigate(e.detail?.suggestion);
  });

  searchBar.addEventListener('search', (e) => {
    const item = e.detail?.suggestion;
    if (item && !item.isNoResult && item.path) {
      handleNavigate(item);
    } else {
      const query = (e.detail?.value ?? searchBar.value ?? '').trim().toLowerCase();
      if (query) {
        const matches = getFilteredSuggestions(query).filter(m => !m.isNoResult);
        if (matches.length > 0) handleNavigate(matches[0]);
      }
    }
  });

  searchBar.addEventListener('clear', () => {
    searchBar.suggestions = SEARCH_INDEX;
  });

  document.addEventListener('keydown', (e) => {
    if (
      (e.key === '/' || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k')) &&
      document.activeElement !== searchBar &&
      !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)
    ) {
      e.preventDefault();
      searchBar.show();
    }
  });
}

// --- View Renderers ---
function renderHero(hero) {
  if (!hero) return '';
  const badgeHtml = hero.badge ? `<div class="hero-badge">${escapeHtml(hero.badge)}</div>` : '';
  const titleHtml = hero.title ? `<h1 class="hero-title">${escapeHtml(hero.title)}</h1>` : '';
  const subtitleHtml = hero.subtitle ? `<p class="hero-subtitle">${escapeHtml(hero.subtitle)}</p>` : '';

  let actionsHtml = '';
  if (hero.actions && Array.isArray(hero.actions)) {
    actionsHtml = `
      <div class="hero-actions">
        ${hero.actions.map(action => `
          <md-button
            variant="${escapeHtml(action.variant || 'filled')}"
            icon="${escapeHtml(action.icon || '')}"
            href="${escapeHtml(action.link || '#/')}"
          >
            ${escapeHtml(action.text || 'Action')}
          </md-button>
        `).join('')}
      </div>
    `;
  }

  return `
    <div class="hero-section">
      ${badgeHtml}
      ${titleHtml}
      ${subtitleHtml}
      ${actionsHtml}
    </div>
  `;
}

function renderDocPage(doc) {
  const isHome = doc.id === 'index' || doc.path === '#/';
  let heroSection = '';

  if (doc.hero) {
    heroSection = renderHero(doc.hero);
  } else if (isHome && !doc.contentHtml.includes('class="hero-section"')) {
    // Default hero for home page if not defined in frontmatter
    heroSection = `
      <div class="hero-section">
        <div class="hero-badge">${escapeHtml(SITE_CONFIG.title)}</div>
        <h1 class="hero-title">${escapeHtml(doc.title)}</h1>
        ${doc.description ? `<p class="hero-subtitle">${escapeHtml(doc.description)}</p>` : ''}
      </div>
    `;
  }

  const breadcrumbs = isHome
    ? ''
    : `
    <nav class="docs-breadcrumb" aria-label="Breadcrumb">
      <a href="#/">Docs</a>
      <span>/</span>
      <span>${escapeHtml(doc.category)}</span>
      <span>/</span>
      <span>${escapeHtml(doc.title)}</span>
    </nav>
  `;

  const header = isHome
    ? ''
    : `
    <header class="doc-header">
      <div class="doc-header-top">
        <span class="category-chip">${escapeHtml(doc.category)}</span>
        ${doc.badge ? `<span class="tag-chip">${escapeHtml(doc.badge)}</span>` : ''}
      </div>
      <h1>${escapeHtml(doc.title)}</h1>
      ${doc.description ? `<p class="doc-lead">${escapeHtml(doc.description)}</p>` : ''}
    </header>
  `;

  return `
    ${breadcrumbs}
    ${heroSection}
    ${header}
    <article class="doc-article">
      ${doc.contentHtml}
    </article>
  `;
}

function renderNotFoundPage() {
  return `
    <div class="not-found-box">
      <h1 class="not-found-title">404</h1>
      <p class="not-found-desc">The requested documentation page could not be found.</p>
      <md-button variant="filled" icon="home" href="#/">Return Home</md-button>
    </div>
  `;
}

// --- Post-Render Setup ---
function attachPostRenderHandlers() {
  // Convert any remaining pre/code elements to <md-code>
  document.querySelectorAll('.docs-content pre').forEach(pre => {
    if (pre.closest('md-code') || pre.closest('.code-container')) return;
    const codeEl = pre.querySelector('code');
    const codeText = codeEl ? (codeEl.textContent || '') : (pre.textContent || '');
    const langClass = Array.from(codeEl?.classList || []).find(c => c.startsWith('language-'));
    const lang = langClass ? langClass.replace('language-', '') : 'plaintext';

    const mdCode = document.createElement('md-code');
    mdCode.language = lang;
    mdCode.code = codeText;
    pre.parentNode.replaceChild(mdCode, pre);
  });

  // Setup copy buttons
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-copy-id');
      if (targetId) {
        const el = document.getElementById(targetId);
        if (el) copyToClipboard(el.textContent || '');
      } else {
        const pre = btn.closest('.code-wrapper')?.querySelector('pre') || btn.parentElement?.querySelector('pre') || btn.parentElement?.querySelector('code');
        if (pre) copyToClipboard(pre.textContent || '');
      }
    });
  });

  // Generic Dialog handlers
  const demoDialog = document.getElementById('demo-doc-dialog') || document.getElementById('demo-dialog');
  const openDialogBtn = document.getElementById('open-demo-dialog-btn') || document.getElementById('open-dialog-btn');
  const cancelDialogBtn = document.getElementById('cancel-demo-dialog-btn') || document.getElementById('close-dialog-btn');
  const confirmDialogBtn = document.getElementById('confirm-demo-dialog-btn');

  openDialogBtn?.addEventListener('click', () => {
    demoDialog?.show();
  });
  cancelDialogBtn?.addEventListener('click', () => {
    demoDialog?.close('cancel');
  });
  confirmDialogBtn?.addEventListener('click', () => {
    demoDialog?.close('confirm');
  });

  // Support data-dialog-target="<id>"
  document.querySelectorAll('[data-dialog-target]').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const targetId = trigger.getAttribute('data-dialog-target');
      const dialog = document.getElementById(targetId);
      dialog?.show();
    });
  });

  // Support data-dialog-close
  document.querySelectorAll('[data-dialog-close]').forEach(btn => {
    btn.addEventListener('click', () => {
      const dialog = btn.closest('md-dialog');
      dialog?.close();
    });
  });
}

// --- Top Bar Config Setup ---
function setupTopBar() {
  const topBar = document.getElementById('docs-top-bar');
  if (topBar && SITE_CONFIG.title) {
    topBar.headline = SITE_CONFIG.title;
  }

  const githubBtn = document.getElementById('github-link-btn');
  if (githubBtn) {
    if (SITE_CONFIG.githubUrl) {
      githubBtn.href = SITE_CONFIG.githubUrl;
      githubBtn.removeAttribute('hidden');
    } else {
      githubBtn.setAttribute('hidden', '');
    }
  }
}

// --- Router ---
function navigate() {
  const contentEl = document.getElementById('docs-content');
  if (!contentEl) return;

  let hash = window.location.hash || '#/';
  let cleanRoute = hash.replace(/^#\/?/, '').replace(/\.html$/, '');

  let routeDoc = null;

  if (!cleanRoute || cleanRoute === 'index') {
    routeDoc = DOCS.find(d => d.id === 'index') || DOCS[0];
  } else {
    routeDoc = DOCS.find(d => d.path === hash || d.id === cleanRoute || d.id === cleanRoute.replace(/\//g, '-'));
    if (!routeDoc) {
      routeDoc = DOCS.find(d => d.path.replace(/^#\/?/, '') === cleanRoute);
    }
  }

  if (routeDoc) {
    contentEl.innerHTML = renderDocPage(routeDoc);
    document.title = `${routeDoc.title} - ${SITE_CONFIG.title || 'Documentation'}`;
    updateActiveDrawerItem(routeDoc.id);
  } else {
    contentEl.innerHTML = renderNotFoundPage();
    document.title = `Page Not Found - ${SITE_CONFIG.title || 'Documentation'}`;
    updateActiveDrawerItem('404');
  }

  contentEl.scrollTop = 0;
  window.scrollTo(0, 0);
  attachPostRenderHandlers();
}

// --- App Initialization ---
function init() {
  setupTopBar();
  renderDrawerItems();
  setupSearch();
  setupPalettePicker();
  navigate();

  window.addEventListener('hashchange', navigate);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
