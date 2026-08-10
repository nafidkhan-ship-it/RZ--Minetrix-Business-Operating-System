export interface DesignTokenSpec {
  category: string;
  tokens: { name: string; value: string; usage: string }[];
}

export interface ComponentConfigSpec {
  id: string;
  name: string;
  category: 'Atoms' | 'Molecules' | 'Organisms' | 'Templates' | 'Pages';
  description: string;
  wcagCompliance: string;
  propsCount: number;
  codeSnippet: string;
}

export interface ThemeConfigSpec {
  themeId: string;
  name: string;
  mode: 'light' | 'dark' | 'high-contrast' | 'custom';
  primaryColor: string;
  backgroundColor: string;
  surfaceColor: string;
  textColor: string;
  accentColor: string;
  isWhiteLabelReady: boolean;
}

export const PRESET_THEMES: ThemeConfigSpec[] = [
  {
    themeId: 'minetrix-dark-enterprise',
    name: 'Minetrix Dark Obsidian (Default)',
    mode: 'dark',
    primaryColor: '#F59E0B', // Amber 500
    backgroundColor: '#020617', // Slate 950
    surfaceColor: '#0F172A', // Slate 900
    textColor: '#F8FAFC', // Slate 50
    accentColor: '#3B82F6', // Blue 500
    isWhiteLabelReady: true
  },
  {
    themeId: 'minetrix-light-clean',
    name: 'Enterprise Executive Light',
    mode: 'light',
    primaryColor: '#D97706', // Amber 600
    backgroundColor: '#F8FAFC', // Slate 50
    surfaceColor: '#FFFFFF',
    textColor: '#0F172A', // Slate 900
    accentColor: '#2563EB', // Blue 600
    isWhiteLabelReady: true
  },
  {
    themeId: 'high-contrast-accessibility',
    name: 'WCAG 2.2 AAA High Contrast',
    mode: 'high-contrast',
    primaryColor: '#FFFF00', // High Vis Yellow
    backgroundColor: '#000000',
    surfaceColor: '#121212',
    textColor: '#FFFFFF',
    accentColor: '#00FFFF', // High Vis Cyan
    isWhiteLabelReady: false
  },
  {
    themeId: 'quarry-gold-whitelabel',
    name: 'Custom White-Label Quarry Gold',
    mode: 'custom',
    primaryColor: '#EAB308',
    backgroundColor: '#0C0A09',
    surfaceColor: '#1C1917',
    textColor: '#FAFAF9',
    accentColor: '#10B981',
    isWhiteLabelReady: true
  }
];

export const DESIGN_TOKENS: DesignTokenSpec[] = [
  {
    category: 'Color Tokens (Mining & Enterprise Palette)',
    tokens: [
      { name: '--color-primary-amber', value: '#F59E0B', usage: 'Primary CTA, Active State, Weighbridge Indicator' },
      { name: '--color-accent-blue', value: '#3B82F6', usage: 'Links, Information Badges, API Status' },
      { name: '--color-success-emerald', value: '#10B981', usage: 'Completed Tickets, Healthy Telemetry, Approved POs' },
      { name: '--color-danger-rose', value: '#EF4444', usage: 'Overload Alerts, Critical Crashes, DR Failover Trigger' },
      { name: '--color-neutral-slate-900', value: '#0F172A', usage: 'Card Surface, Table Headers, Side Navigation' }
    ]
  },
  {
    category: 'Typography Scale (WCAG 2.2 AA Responsive)',
    tokens: [
      { name: '--font-size-display-xl', value: '2.25rem (36px)', usage: 'Executive Dashboard Totals, Weighbridge Live Gauge' },
      { name: '--font-size-heading-1', value: '1.5rem (24px)', usage: 'Module Title, Section Header' },
      { name: '--font-size-body-base', value: '0.875rem (14px)', usage: 'Standard Table Row Text, Form Labels, Descriptions' },
      { name: '--font-size-mono-code', value: '0.75rem (12px)', usage: 'GPS Coordinates, JSON API Payloads, SQL Queries' }
    ]
  },
  {
    category: 'Spatial & Grid Scale (4px Rhythmic Grid)',
    tokens: [
      { name: '--spacing-2 xs', value: '4px (0.25rem)', usage: 'Tag padding, icon gap' },
      { name: '--spacing-sm', value: '12px (0.75rem)', usage: 'Form input inner padding, compact table cell padding' },
      { name: '--spacing-md', value: '16px (1.0rem)', usage: 'Standard Card Padding, Modal Header Margin' },
      { name: '--spacing-xl', value: '32px (2.0rem)', usage: 'Section Layout Gap, Dashboard Column Grid Gap' }
    ]
  },
  {
    category: 'Elevation & Shadow Tokens',
    tokens: [
      { name: '--elevation-1-card', value: '0 1px 3px rgba(0,0,0,0.4)', usage: 'Standard Surface Card, Table Container' },
      { name: '--elevation-3-modal', value: '0 20px 25px -5px rgba(0,0,0,0.7)', usage: 'Dialog Modal, Command Palette Dropdown' },
      { name: '--radius-card', value: '16px (1rem)', usage: 'Enterprise Card Corner Radius' },
      { name: '--radius-pill', value: '9999px', usage: 'Badges, Action Buttons, Filter Chips' }
    ]
  }
];

export const COMPONENT_CATALOG: ComponentConfigSpec[] = [
  {
    id: 'data-grid-enterprise-v2',
    name: 'Enterprise Virtualized Data Grid',
    category: 'Organisms',
    description: 'High-performance tabular data grid with virtual scrolling (100k+ rows), column pin/unpin, multi-field filters, inline row editing, and PDF/Excel export.',
    wcagCompliance: 'WCAG 2.2 AA Compliant (ARIA Grid role, arrow key navigation)',
    propsCount: 24,
    codeSnippet: `<EnterpriseDataGrid
  columns={[
    { field: 'ticketNo', title: 'Weighment Ticket', width: 140, frozen: true },
    { field: 'grossWeight', title: 'Gross Wt (Tons)', type: 'number', sortable: true },
    { field: 'netWeight', title: 'Net Wt (Tons)', type: 'number', filterable: true },
    { field: 'status', title: 'QC Status', type: 'badge' }
  ]}
  data={weighmentRecords}
  pageSize={50}
  virtualScroll={true}
  enableExport={['csv', 'excel', 'pdf']}
/>`
  },
  {
    id: 'dynamic-form-builder',
    name: 'Dynamic Form Framework & Scanner',
    category: 'Organisms',
    description: 'Conditional field renderer with auto-save drafts, digital signature canvas, camera QR/Barcode scanner, and voice input capability.',
    wcagCompliance: 'WCAG 2.2 AA (Explicit label-id binding, live error region announcements)',
    propsCount: 18,
    codeSnippet: `<DynamicFormEngine
  schema={quarryVehicleEntrySchema}
  autoSaveIntervalMs={3000}
  enableDigitalSignature={true}
  enableQrScanner={true}
  onSubmit={handleVehicleCheckIn}
/>`
  },
  {
    id: 'command-palette-omnibar',
    name: 'Command Palette & Omnibar Navigation',
    category: 'Molecules',
    description: 'Global spotlight search (Cmd + K) with fast page navigation, voice search, recent pages, quick action triggers, and keyboard shortcuts.',
    wcagCompliance: 'WCAG 2.2 AAA (Combobox ARIA pattern, full keyboard arrow traps)',
    propsCount: 12,
    codeSnippet: `<CommandPaletteOmnibar
  shortcut="Meta+k"
  quickActions={[
    { id: 'weigh', title: 'Create Weighment Ticket', shortcut: 'G W' },
    { id: 'po', title: 'Approve Purchase Order', shortcut: 'A P' }
  ]}
/>`
  },
  {
    id: 'mining-fleet-icon-system',
    name: 'Mining & Fleet Domain Icon Set',
    category: 'Atoms',
    description: 'Custom SVG icons for Mining Excavators, Dump Trucks, Crusher PLCs, Weighbridges, RFID Boom Barriers, and Fuel Sensors.',
    wcagCompliance: 'WCAG 2.2 AA (aria-hidden on decorative SVGs, explicit title elements)',
    propsCount: 8,
    codeSnippet: `<MiningIcon name="dumper-truck-heavy" size={24} color="#F59E0B" />`
  }
];

export const DESIGN_SYSTEM_SCHEMA_TABLES = [
  {
    tableName: 'sys_ui_themes',
    columns: ['theme_id (PK)', 'tenant_id (FK)', 'theme_name', 'primary_color_hex', 'background_hex', 'is_active', 'is_whitelabel'],
    description: 'Stores tenant custom white-label themes and brand color configurations.'
  },
  {
    tableName: 'sys_user_ui_preferences',
    columns: ['pref_id (PK)', 'user_id (FK)', 'active_theme_id', 'font_scale_percent', 'high_contrast_enabled', 'keyboard_shortcuts_enabled'],
    description: 'User-specific accessibility, font sizing, and visual settings.'
  },
  {
    tableName: 'sys_component_configs',
    columns: ['config_id (PK)', 'component_id', 'tenant_id (FK)', 'default_page_size', 'grid_density', 'column_visibility_json'],
    description: 'Persists user and tenant column order, grid filter preferences, and layout states.'
  }
];
