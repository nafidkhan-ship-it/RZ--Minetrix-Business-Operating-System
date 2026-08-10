// RZ® Minetrix BOS Central Branding & Theme Types

export type BrandThemeMode = 'dark-obsidian' | 'gold-amber' | 'high-contrast-slate' | 'enterprise-emerald';

export interface ColorToken {
  name: string;
  hex: string;
  rgb: string;
  hsl: string;
  cssVar: string;
  usage: string;
}

export interface BrandPalette {
  primaryAmber: ColorToken;
  secondaryOrange: ColorToken;
  accentEmerald: ColorToken;
  accentCyan: ColorToken;
  accentIndigo: ColorToken;
  canvasObsidian: ColorToken;
  slateBorder: ColorToken;
  textLight: ColorToken;
}

export interface BrandAsset {
  id: string;
  name: string;
  category: 'Logo' | 'Icon' | 'Watermark' | 'Favicon' | 'Typography' | 'Design Token';
  format: 'SVG' | 'PNG' | 'CSS' | 'JSON' | 'TTF';
  sizeBytes?: number;
  description: string;
  svgContent?: string;
}

export interface EnterpriseBrandSpec {
  brandName: string;
  registeredMark: string;
  tagline: string;
  version: string;
  palette: BrandPalette;
  primaryFont: string;
  monoFont: string;
  logoSvg: string;
  logoIconSvg: string;
  watermarkSvg: string;
}
