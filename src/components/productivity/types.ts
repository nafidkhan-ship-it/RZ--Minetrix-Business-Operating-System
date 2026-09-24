export type ProductivityToolId =
  | 'hub'
  | 'sheet'
  | 'word'
  | 'form'
  | 'slide'
  | 'drive'
  | 'pdf'
  | 'print';

export type FileType =
  | 'sheet'
  | 'word'
  | 'form'
  | 'slide'
  | 'pdf'
  | 'image'
  | 'video'
  | 'other';

export type SharePermission = 'owner' | 'editor' | 'commenter' | 'viewer';

export interface ProductivityFile {
  id: string;
  name: string;
  type: FileType;
  tool: ProductivityToolId;
  owner: string;
  ownerAvatar?: string;
  lastModified: string;
  size: string;
  location: string;
  category: 'Quarry' | 'Crusher' | 'Vehicle' | 'Contracts' | 'Invoices' | 'Reports' | 'HR' | 'Finance' | 'General';
  sharedStatus: 'private' | 'shared' | 'organization' | 'public';
  starred?: boolean;
  erpSource?: string;
  erpConnected?: boolean;
  versionCount?: number;
}

export interface SheetCell {
  value: string;
  formula?: string;
  bold?: boolean;
  italic?: boolean;
  align?: 'left' | 'center' | 'right';
  format?: 'text' | 'number' | 'currency' | 'percent';
  bg?: string;
  color?: string;
}

export interface FormFieldItem {
  id: string;
  type:
    | 'text'
    | 'number'
    | 'email'
    | 'phone'
    | 'date'
    | 'dropdown'
    | 'multiselect'
    | 'checkbox'
    | 'radio'
    | 'file'
    | 'signature'
    | 'location';
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
  helpText?: string;
}

export interface FormResponseItem {
  id: string;
  formId: string;
  submittedAt: string;
  respondentName: string;
  respondentContact: string;
  answers: Record<string, any>;
  status: 'New' | 'Under Review' | 'Converted to Quote' | 'Actioned' | 'Closed';
  crmLinked?: boolean;
}

export interface SlideItem {
  id: string;
  title: string;
  subtitle: string;
  layout: 'title' | 'split' | 'bullets' | 'chart' | 'stats' | 'quote';
  points?: string[];
  stats?: { label: string; value: string; change?: string }[];
  speakerNotes?: string;
}

export interface PrintSettingsState {
  category:
    | 'Invoices'
    | 'Quotations'
    | 'Purchase Orders'
    | 'Salary Slips'
    | 'Gate Pass'
    | 'Delivery Notes'
    | 'Reports'
    | 'Statements'
    | 'Ledgers'
    | 'Agreements';
  paperSize: 'A4' | 'A5' | 'Letter' | '3-inch Thermal' | 'Continuous Roll';
  orientation: 'portrait' | 'landscape';
  copies: number;
  margins: 'normal' | 'narrow' | 'wide' | 'zero';
  includeHeader: boolean;
  includeFooter: boolean;
  headerText: string;
  footerText: string;
  colorMode: 'color' | 'monochrome';
}

export interface VersionHistoryItem {
  id: string;
  version: string;
  timestamp: string;
  author: string;
  changeSummary: string;
  isCurrent?: boolean;
}
