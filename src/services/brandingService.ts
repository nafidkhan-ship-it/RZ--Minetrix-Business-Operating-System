// RZ® Minetrix BOS Central Branding Service & Global Asset Exporter
import { EnterpriseBrandSpec, BrandThemeMode, BrandAsset } from '../types/branding';

// Official RZ® Minetrix BOS Vector Logo SVG (Single Source of Truth)
export const OFFICIAL_RZ_LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <defs>
    <linearGradient id="rzAmberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F59E0B" />
      <stop offset="50%" stop-color="#D97706" />
      <stop offset="100%" stop-color="#B45309" />
    </linearGradient>
    <linearGradient id="rzGoldGlow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FCD34D" stop-opacity="0.8" />
      <stop offset="100%" stop-color="#F59E0B" stop-opacity="0.2" />
    </linearGradient>
    <linearGradient id="rzDarkBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F172A" />
      <stop offset="100%" stop-color="#020617" />
    </linearGradient>
    <filter id="rzGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Outer Rounded Polygon Shield Base -->
  <rect x="16" y="16" width="480" height="480" rx="96" fill="url(#rzDarkBg)" stroke="#334155" stroke-width="8" />
  <rect x="28" y="28" width="456" height="456" rx="84" fill="none" stroke="url(#rzAmberGrad)" stroke-width="4" stroke-opacity="0.4" />

  <!-- Geometric RZ Diamond Core -->
  <path d="M 256 72 L 416 232 L 256 392 L 96 232 Z" fill="url(#rzAmberGrad)" opacity="0.15" />
  <path d="M 256 96 L 392 232 L 256 368 L 120 232 Z" fill="none" stroke="url(#rzAmberGrad)" stroke-width="6" />

  <!-- Heavyweight Monogram RZ Path -->
  <!-- Letter R -->
  <path d="M 160 160 L 160 336 M 160 160 L 230 160 C 265 160, 275 180, 275 205 C 275 230, 260 245, 230 245 L 160 245 M 215 245 L 275 336"
        fill="none" stroke="#FFFFFF" stroke-width="32" stroke-linecap="round" stroke-linejoin="round" />

  <!-- Letter Z -->
  <path d="M 295 160 L 375 160 L 295 336 L 375 336"
        fill="none" stroke="url(#rzAmberGrad)" stroke-width="32" stroke-linecap="round" stroke-linejoin="round" filter="url(#rzGlow)" />

  <!-- Registered Trademark Symbol (®) -->
  <circle cx="410" cy="140" r="18" fill="none" stroke="#F59E0B" stroke-width="3" />
  <text x="410" y="146" font-family="sans-serif" font-size="16" font-weight="900" fill="#F59E0B" text-anchor="middle">R</text>

  <!-- Accent Sub-line Minetrix BOS -->
  <text x="256" y="440" font-family="'Outfit', 'Space Grotesk', sans-serif" font-size="28" font-weight="900" letter-spacing="8" fill="#F8FAFC" text-anchor="middle">MINETRIX BOS</text>
</svg>`;

export const OFFICIAL_RZ_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="100%" height="100%">
  <defs>
    <linearGradient id="rzIconGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F59E0B" />
      <stop offset="100%" stop-color="#B45309" />
    </linearGradient>
  </defs>
  <rect x="8" y="8" width="240" height="240" rx="48" fill="#020617" stroke="#334155" stroke-width="4" />
  <path d="M 70 70 L 70 186 M 70 70 L 115 70 C 138 70, 145 85, 145 100 C 145 118, 135 128, 115 128 L 70 128 M 105 128 L 145 186"
        fill="none" stroke="#FFFFFF" stroke-width="20" stroke-linecap="round" stroke-linejoin="round" />
  <path d="M 155 70 L 200 70 L 155 186 L 200 186"
        fill="none" stroke="url(#rzIconGrad)" stroke-width="20" stroke-linecap="round" stroke-linejoin="round" />
  <circle cx="215" cy="55" r="10" fill="none" stroke="#F59E0B" stroke-width="2" />
  <text x="215" y="59" font-family="sans-serif" font-size="9" font-weight="900" fill="#F59E0B" text-anchor="middle">R</text>
</svg>`;

export const ENTERPRISE_BRAND_SPEC: EnterpriseBrandSpec = {
  brandName: 'RZ® Minetrix Business Operating System',
  registeredMark: 'RZ®',
  tagline: 'Enterprise Mining, Fleet & Industrial Intelligence Operating System',
  version: '2026.8.0-RELEASE',
  palette: {
    primaryAmber: { name: 'Amber Gold Primary', hex: '#F59E0B', rgb: '245, 158, 11', hsl: '38, 92%, 50%', cssVar: '--rz-primary-amber', usage: 'Primary Brand Mark, Active Headers, Highlights' },
    secondaryOrange: { name: 'Burnt Industrial Orange', hex: '#D97706', rgb: '217, 119, 6', hsl: '32, 95%, 44%', cssVar: '--rz-secondary-orange', usage: 'Secondary Gradients, Call to Action' },
    accentEmerald: { name: 'Operation Emerald', hex: '#10B981', rgb: '16, 185, 129', hsl: '160, 84%, 39%', cssVar: '--rz-accent-emerald', usage: 'Success Status, Active Sagas, Safety Checks' },
    accentCyan: { name: 'Telemetry Cyan', hex: '#06B6D4', rgb: '6, 182, 212', hsl: '189, 94%, 43%', cssVar: '--rz-accent-cyan', usage: 'IoT Streams, Cloud Metrics, Traces' },
    accentIndigo: { name: 'Enterprise Indigo', hex: '#6366F1', rgb: '99, 102, 241', hsl: '239, 84%, 67%', cssVar: '--rz-accent-indigo', usage: 'HRMS, ERP Sync, Multi-Tenant Governance' },
    canvasObsidian: { name: 'Obsidian Night Base', hex: '#020617', rgb: '2, 6, 23', hsl: '222, 84%, 5%', cssVar: '--rz-canvas-obsidian', usage: 'Primary UI Background Canvas' },
    slateBorder: { name: 'Industrial Slate Border', hex: '#1E293B', rgb: '30, 41, 59', hsl: '215, 32%, 17%', cssVar: '--rz-slate-border', usage: 'Container Borders, Dividers' },
    textLight: { name: 'Pure White Text', hex: '#F8FAFC', rgb: '248, 250, 252', hsl: '210, 40%, 98%', cssVar: '--rz-text-light', usage: 'Headings, High Contrast Labels' }
  },
  primaryFont: "'Outfit', 'Plus Jakarta Sans', system-ui, sans-serif",
  monoFont: "'JetBrains Mono', 'Space Mono', monospace",
  logoSvg: OFFICIAL_RZ_LOGO_SVG,
  logoIconSvg: OFFICIAL_RZ_ICON_SVG,
  watermarkSvg: OFFICIAL_RZ_ICON_SVG
};

export const BRAND_ASSET_LIBRARY: BrandAsset[] = [
  {
    id: 'asset-1',
    name: 'RZ® Minetrix Master Vector Logo (Full Color)',
    category: 'Logo',
    format: 'SVG',
    sizeBytes: 2450,
    description: 'Official primary brand logo with RZ monogram, registered trademark, and MINETRIX BOS title.',
    svgContent: OFFICIAL_RZ_LOGO_SVG
  },
  {
    id: 'asset-2',
    name: 'RZ® Icon Monogram Mark',
    category: 'Icon',
    format: 'SVG',
    sizeBytes: 1120,
    description: 'Square standalone RZ monogram icon badge for favicons, mobile apps, and taskbar alerts.',
    svgContent: OFFICIAL_RZ_ICON_SVG
  },
  {
    id: 'asset-3',
    name: 'Enterprise CSS Theme Variables',
    category: 'Design Token',
    format: 'CSS',
    sizeBytes: 1850,
    description: 'Root CSS custom properties containing official RZ® color palette, fonts, radii, and shadows.'
  },
  {
    id: 'asset-4',
    name: 'RZ® Brand Design Tokens JSON',
    category: 'Design Token',
    format: 'JSON',
    sizeBytes: 3200,
    description: 'JSON spec for Figma, Tailwind, and Mobile SDK brand token synchronization.'
  }
];

class BrandingService {
  private currentTheme: BrandThemeMode = 'dark-obsidian';

  /**
   * Initializes global CSS variables, browser title, and favicon on document root
   */
  public initializeGlobalTheme(): void {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    const p = ENTERPRISE_BRAND_SPEC.palette;

    // Set Browser Document Title Area
    document.title = 'RZ® Minetrix BOS — Enterprise Architecture Platform';

    root.style.setProperty(p.primaryAmber.cssVar, p.primaryAmber.hex);
    root.style.setProperty(p.secondaryOrange.cssVar, p.secondaryOrange.hex);
    root.style.setProperty(p.accentEmerald.cssVar, p.accentEmerald.hex);
    root.style.setProperty(p.accentCyan.cssVar, p.accentCyan.hex);
    root.style.setProperty(p.accentIndigo.cssVar, p.accentIndigo.hex);
    root.style.setProperty(p.canvasObsidian.cssVar, p.canvasObsidian.hex);
    root.style.setProperty(p.slateBorder.cssVar, p.slateBorder.hex);
    root.style.setProperty(p.textLight.cssVar, p.textLight.hex);

    // Apply favicon dynamically
    this.updateFavicon();
  }

  /**
   * Returns global standard logo heights (32px desktop, 24px mobile) and name layout spec
   */
  public getHeaderBrandingSpec() {
    return {
      appName: 'RZ® Minetrix BOS',
      registeredMark: 'RZ®',
      subTitle: 'Business Operating System',
      desktopLogoHeightPx: 32,
      mobileLogoHeightPx: 24,
      desktopLogoClass: 'h-8 w-8',
      mobileLogoClass: 'h-6 w-6'
    };
  }

  /**
   * Applies selected theme mode
   */
  public applyBrandTheme(theme: BrandThemeMode): void {
    this.currentTheme = theme;
    if (typeof document === 'undefined') return;
    const root = document.documentElement;

    if (theme === 'gold-amber') {
      root.style.setProperty('--rz-primary-amber', '#FBBF24');
      root.style.setProperty('--rz-canvas-obsidian', '#1C1917');
    } else if (theme === 'high-contrast-slate') {
      root.style.setProperty('--rz-primary-amber', '#38BDF8');
      root.style.setProperty('--rz-canvas-obsidian', '#0F172A');
    } else if (theme === 'enterprise-emerald') {
      root.style.setProperty('--rz-primary-amber', '#34D399');
      root.style.setProperty('--rz-canvas-obsidian', '#022C22');
    } else {
      // dark-obsidian default
      this.initializeGlobalTheme();
    }
  }

  public getCurrentTheme(): BrandThemeMode {
    return this.currentTheme;
  }

  public getBrandSpec(): EnterpriseBrandSpec {
    return ENTERPRISE_BRAND_SPEC;
  }

  /**
   * Dynamically injects RZ® Icon SVG as browser favicon
   */
  private updateFavicon(): void {
    if (typeof document === 'undefined') return;
    let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'shortcut icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    const blob = new Blob([OFFICIAL_RZ_ICON_SVG], { type: 'image/svg+xml' });
    link.href = URL.createObjectURL(blob);
  }

  /**
   * Download Asset as SVG File
   */
  public downloadSvgAsset(svgContent: string, fileName: string): void {
    if (typeof window === 'undefined') return;
    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Export Brand Tokens as CSS file download
   */
  public exportCssTokens(): void {
    const cssContent = `/* RZ® Minetrix BOS - Official Enterprise Brand Design Tokens */
:root {
  --rz-brand-name: "${ENTERPRISE_BRAND_SPEC.brandName}";
  --rz-primary-amber: ${ENTERPRISE_BRAND_SPEC.palette.primaryAmber.hex};
  --rz-secondary-orange: ${ENTERPRISE_BRAND_SPEC.palette.secondaryOrange.hex};
  --rz-accent-emerald: ${ENTERPRISE_BRAND_SPEC.palette.accentEmerald.hex};
  --rz-accent-cyan: ${ENTERPRISE_BRAND_SPEC.palette.accentCyan.hex};
  --rz-accent-indigo: ${ENTERPRISE_BRAND_SPEC.palette.accentIndigo.hex};
  --rz-canvas-obsidian: ${ENTERPRISE_BRAND_SPEC.palette.canvasObsidian.hex};
  --rz-slate-border: ${ENTERPRISE_BRAND_SPEC.palette.slateBorder.hex};
  --rz-text-light: ${ENTERPRISE_BRAND_SPEC.palette.textLight.hex};
  --rz-font-primary: ${ENTERPRISE_BRAND_SPEC.primaryFont};
  --rz-font-mono: ${ENTERPRISE_BRAND_SPEC.monoFont};
}
`;
    this.downloadTextFile(cssContent, 'rz-minetrix-brand-tokens.css', 'text/css');
  }

  /**
   * Export Brand Tokens as JSON
   */
  public exportJsonTokens(): void {
    const jsonContent = JSON.stringify(ENTERPRISE_BRAND_SPEC, null, 2);
    this.downloadTextFile(jsonContent, 'rz-minetrix-brand-tokens.json', 'application/json');
  }

  private downloadTextFile(content: string, fileName: string, mimeType: string): void {
    if (typeof window === 'undefined') return;
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

export const brandingService = new BrandingService();
