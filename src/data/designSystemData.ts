export interface ColorToken {
  name: string;
  hex: string;
  twClass: string;
  usage: string;
}

export interface DesignTokenGroup {
  category: string;
  tokens: ColorToken[];
}

export const DESIGN_PHILOSOPHY = {
  corePillars: [
    { title: 'Industrial Efficiency', desc: 'Optimized for high-throughput operational clarity in harsh outdoor quarry and weighbridge environments.' },
    { title: 'Zero Clutter Enterprise', desc: 'Clean, modern typography paired with high-contrast neutral surfaces and zero distracting visual noise.' },
    { title: 'Mobile First & One-Handed', desc: 'Driver and field operator apps feature 48px+ touch targets and bottom-sheet controls for single-thumb execution.' },
    { title: 'AI-First Co-Pilot Experience', desc: 'Contextual Gemini AI Assistant drawer available on every screen for natural language commands and instant insights.' }
  ]
};

export const BRAND_TOKENS: DesignTokenGroup[] = [
  {
    category: 'Core Neutral Canvas (Slate & Obsidian)',
    tokens: [
      { name: 'Canvas Base Dark', hex: '#020617', twClass: 'bg-slate-950', usage: 'Primary dark background canvas for high outdoor legibility' },
      { name: 'Surface Container', hex: '#0f172a', twClass: 'bg-slate-900', usage: 'Card surfaces, table containers, sidebar panels' },
      { name: 'Border Hairline', hex: '#1e293b', twClass: 'border-slate-800', usage: 'Subtle container borders, dividers, grid lines' },
      { name: 'Primary Text', hex: '#f8fafc', twClass: 'text-slate-50', usage: 'Headings, table header text, key financial metrics' },
      { name: 'Muted Text', hex: '#94a3b8', twClass: 'text-slate-400', usage: 'Labels, helper text, timestamps, metadata' }
    ]
  },
  {
    category: 'Suite Accent Palette',
    tokens: [
      { name: 'Shared Core Blue', hex: '#3b82f6', twClass: 'text-blue-500', usage: 'Core navigation, primary buttons, system status' },
      { name: 'Mining Operations Amber', hex: '#f59e0b', twClass: 'text-amber-500', usage: 'Quarry yields, overburden removal, explosive logs' },
      { name: 'Fleet Logistics Cyan', hex: '#06b6d4', twClass: 'text-cyan-500', usage: 'GPS telematics, tipper trips, driver navigation' },
      { name: 'Materials Emerald', hex: '#10b981', twClass: 'text-emerald-500', usage: 'Laterite stone inventory, aggregate stock, sales' },
      { name: 'Marketplace Rose', hex: '#f43f5e', twClass: 'text-rose-500', usage: 'E-commerce orders, customer quotes, public catalog' },
      { name: 'Finance Gold', hex: '#eab308', twClass: 'text-yellow-500', usage: 'P&L ledgers, GST tax invoices, bank settlements' },
      { name: 'HRMS Indigo', hex: '#6366f1', twClass: 'text-indigo-500', usage: 'Attendance punches, worker payroll, ESS portal' },
      { name: 'AI Platform Violet', hex: '#8b5cf6', twClass: 'text-violet-500', usage: 'Gemini Copilot, document OCR, voice gateway' }
    ]
  }
];

export const SUITE_BRANDING_THEMES = [
  { suite: 'Mining Operations', icon: 'Pickaxe', color: 'Amber (#f59e0b)', emblem: 'Quarry Pit Silhouette', atmosphere: 'Rugged, high-contrast, dust-safe typography' },
  { suite: 'Fleet & Logistics', icon: 'Truck', color: 'Cyan (#06b6d4)', emblem: 'GPS Compass Dial', atmosphere: 'Real-time telemetry, map-centric overlays' },
  { suite: 'Building Materials', icon: 'Box', color: 'Emerald (#10b981)', emblem: 'Laterite Block Pattern', atmosphere: 'Clean stock gauges, weighbridge POS look' },
  { suite: 'Marketplace E-Com', icon: 'ShoppingBag', color: 'Rose (#f43f5e)', emblem: 'Shopping Cart & Pin', atmosphere: 'Consumer-grade, fast checkout, public map' },
  { suite: 'Finance & BI', icon: 'Landmark', color: 'Yellow (#eab308)', emblem: 'Balance Sheet Ledger', atmosphere: 'Dense financial tables, P&L trend graphs' },
  { suite: 'HRMS & Payroll', icon: 'UserCheck', color: 'Indigo (#6366f1)', emblem: 'Worker Badge', atmosphere: 'Mobile-friendly punch cards, payslip cards' },
  { suite: 'AI Platform', icon: 'Brain', color: 'Violet (#8b5cf6)', emblem: 'Gemini Neural Spark', atmosphere: 'Glowing purple accents, conversational UI' }
];

export const LAYOUT_GRID_SYSTEM = {
  breakpoints: [
    { name: 'Mobile (xs/sm)', range: '< 640px', columns: 4, padding: '16px', behavior: 'Single column stack, bottom sheet navigation, touch controls' },
    { name: 'Tablet (md)', range: '640px - 1024px', columns: 8, padding: '24px', behavior: 'Collapsible sidebar, split master-detail views' },
    { name: 'Desktop (lg/xl)', range: '1024px - 1536px', columns: 12, padding: '32px', behavior: 'Persistent navigation, multi-card dashboard grids' },
    { name: 'Ultra-Wide (2xl)', range: '> 1536px', columns: 16, padding: '48px', behavior: 'Max-width 1800px wrapper with dynamic side telemetry panels' }
  ],
  layoutPanels: [
    { title: 'Top Global Command Bar', features: 'Tenant/Branch Switcher, Global Search (Ctrl+K), Notification Center, Voice mic button, User profile' },
    { title: 'Collapsible Navigation Sidebar', features: 'Suite icon strip + expandable portal route tree + dark mode toggle' },
    { title: 'Main Operational Viewport', features: 'Breadcrumbs, page header actions, dynamic widget dashboard or dense data grid' },
    { title: 'Slide-Over AI Co-Pilot Panel', features: 'Conversational Gemini AI chat, document dropzone, instant SQL report generator' }
  ]
};

export const REUSABLE_UI_COMPONENTS = [
  {
    category: 'Core Controls',
    components: [
      { name: 'Primary Action Button', specs: 'Minimum 44px height, high-contrast background, focus ring, loading spinner state' },
      { name: 'Form Input & Auto-Complete', specs: 'Floating label, inline validation error text, clear button, keyboard shortcut focus' },
      { name: 'Date/Time & Shift Selector', specs: 'Calendar popup with preset ranges (Today, Current Shift, YTD), shift A/B/C toggle' },
      { name: 'Multi-Select Dropdown', specs: 'Searchable option list, checkbox selections, chip display for selected items' }
    ]
  },
  {
    category: 'Data Displays & Grids',
    components: [
      { name: 'Enterprise Data Table', specs: 'Sticky headers, column freeze, global search, column sorting, pagination, CSV/PDF export' },
      { name: 'KPI Metric Stat Card', specs: 'Big number display, percentage comparison badge (vs last week), mini sparkline chart' },
      { name: 'Kanban Board View', specs: 'Drag-and-drop cards for sales leads/orders, column totals, card filter tags' },
      { name: 'Status Badge & Pill', specs: 'One-line non-wrapping text, distinct color coding for Pending, Verified, Dispatched, Paid' }
    ]
  },
  {
    category: 'Mobile & Hardware Captures',
    components: [
      { name: 'Camera & Bill OCR Scanner', specs: 'Native camera overlay with edge auto-detection, flash toggle, photo preview & auto-crop' },
      { name: 'QR & Barcode Scanner', specs: 'Hardware camera reader for gate passes, driver IDs, vehicle tags with beep feedback' },
      { name: 'Digital Signature Pad', specs: 'Canvas touch signature capture for e-POD proof of delivery with instant PNG export' },
      { name: 'Live GPS Navigation Map', specs: 'Mapbox / Google Maps route overlay, live tipper pin, speed gauge, ETA card' }
    ]
  }
];

export const DENSE_FORM_AND_TABLE_SPECS = {
  formPatterns: [
    'Quick Entry Bar: Compact single-row weighbridge entry form for sub-10 second truck processing.',
    'Multi-Step Wizard: Structured 4-step wizard for new customer onboarding & credit line application.',
    'Inline Table Editing: Direct cell modification in crusher daily production logs with auto-save indicator.',
    'Approval Flow Form: Clear side-by-side diff view showing requested expense vs policy threshold.'
  ],
  dataGridPatterns: [
    'Freeze First N Columns: Freeze Vehicle Number and Driver Name during horizontal scroll.',
    'Group By Property: Group gate passes by Quarry Pit or Aggregate Size (20mm, M-Sand).',
    'Bulk Execution Bar: Floating toolbar appearing on row selection for Bulk Invoice, Bulk WhatsApp, or Print.',
    'Responsive Stack: Auto-converting table rows into mobile card list below 640px screen width.'
  ]
};

export const ROLE_NAVIGATION_MAPPINGS = [
  { role: 'Super Admin', home: '/admin/dashboard', primaryNav: ['Tenant Manager', 'Global Analytics', 'System Logs', 'License Matrix'] },
  { role: 'Quarry Pit Manager', home: '/quarry/dashboard', primaryNav: ['Live Pit Yield', 'Weighbridge Gate', 'Royalty Passes', 'Equipment Logs'] },
  { role: 'Crusher Operator', home: '/crusher/dashboard', primaryNav: ['Feeder Yield', 'Stockpile Gauges', 'Shift Production', 'Maintenance'] },
  { role: 'Fleet Manager', home: '/fleet/dashboard', primaryNav: ['Live GPS Map', 'Trip Vouchers', 'Fuel Audit', 'Vehicle Maintenance'] },
  { role: 'Tipper Driver', home: '/driver/app', primaryNav: ['Assigned Trips', 'Turn-by-Turn GPS', 'e-POD Signature', 'Trip Expenses'] },
  { role: 'Customer / Buyer', home: '/customer/portal', primaryNav: ['Order Laterite Stone', 'Track Delivery', 'Invoices', 'Support Tickets'] }
];

export const MOBILE_AND_PUBLIC_UX = {
  mobileUx: [
    'Offline First Queue: Local SQLite storage allowing full offline trip logging with auto background sync.',
    'One-Hand Thumb Zone: All primary actions placed in bottom 40% of the screen.',
    'Haptic Feedback: Subtle vibration confirmation on weighbridge tare weight freeze or e-POD upload.',
    'High Visibility Sunlight Mode: Extra high contrast mode for outdoor quarry daylight viewing.'
  ],
  publicPortalUx: [
    '⭐ Instant Laterite Stone Order Flow: 3-tap material selection -> nearby quarry locator -> live price calculator -> instant UPI checkout.',
    'Real-Time Tipper Map: Customer view of dispatched truck moving on interactive map with live ETA.',
    'Equipment & Machinery Rental Catalog: Browse excavators and tippers with hourly rates and booking calendar.'
  ]
};

export const AI_INTERACTION_UX = {
  features: [
    'Floating Gemini Copilot Button: Permanent bottom-right action trigger opening the AI Assistant drawer.',
    'Voice Command Microphone: Hold-to-speak voice input (e.g. "Show me today\'s revenue for Kannur crusher").',
    'Contextual Smart Action Pills: Dynamic suggestions below headers (e.g. "Suggest optimal price for M-Sand").',
    'Document OCR Dropzone: Drag invoice PDF or bill photo into AI drawer for instant structured extraction.'
  ]
};

export const ACCESSIBILITY_AND_FRONTEND_STRUCTURE = {
  accessibility: [
    'WCAG 2.1 AA Compliance: All text meets minimum 4.5:1 contrast ratio against background surfaces.',
    'Complete Keyboard Navigation: Full tab focus order across form fields, modal traps, and data grid cells.',
    'Screen Reader Support: Descriptive aria-labels on camera scanner controls and status pills.'
  ],
  folderStructure: [
    'src/frontend/',
    '├── design-system/       # Reusable Tokens, Typography, Colors & Base Controls',
    '│   ├── tokens/          # JSON design tokens (colors, spacing, elevation)',
    '│   ├── primitives/      # Button, Input, Select, Modal, Badge, Toast',
    '│   └── patterns/        # DataTable, FormWizard, QuickEntryBar, MetricCard',
    '├── layouts/             # App Shells (Desktop Dashboard, Mobile App, Public Web)',
    '│   ├── CommandHeader.tsx',
    '│   ├── SidebarNav.tsx',
    '│   └── AiCopilotDrawer.tsx',
    '├── modules/             # UI Views for 11 Business Suites & 15 Role Portals',
    '└── mobile-native/       # Native Camera, GPS, QR Scanner & Biometric Shell Hooks'
  ]
};
