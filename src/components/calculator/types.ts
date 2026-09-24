export type CalculatorCategoryId =
  | 'ALL'
  | 'BASIC'
  | 'CONVERSION'
  | 'GST'
  | 'FINANCE'
  | 'BUSINESS'
  | 'QUARRY'
  | 'CRUSHER'
  | 'VEHICLE'
  | 'PARTNER';

export type CalculatorId =
  // Basic & Everyday
  | 'basic-desk'
  | 'percentage'
  | 'discount'
  | 'markup'
  | 'profit-loss'
  | 'ratio'
  // Conversion & Tax
  | 'unit-converter'
  | 'land-converter'
  | 'gst-calculator'
  // Finance
  | 'emi-calculator'
  | 'reverse-emi'
  | 'simple-interest'
  | 'compound-interest'
  | 'reducing-interest'
  | 'loan-calculator'
  | 'repayment-schedule'
  | 'prepayment-calculator'
  // Business
  | 'revenue-calculator'
  | 'expense-ratio'
  | 'gross-margin'
  | 'break-even'
  | 'sales-target'
  | 'cost-per-unit'
  // Industry: Quarry
  | 'quarry-load'
  | 'landowner-load'
  | 'quarry-profit'
  // Industry: Crusher
  | 'crusher-cost'
  | 'crusher-margin'
  // Industry: Vehicle & Fuel
  | 'vehicle-trip'
  | 'fuel-mileage'
  // Partnership & Investment
  | 'ownership-split'
  | 'investment-return';

export interface CalculatorMeta {
  id: CalculatorId;
  name: string;
  shortName: string;
  category: CalculatorCategoryId;
  description: string;
  formula: string;
  howItWorks: string;
  example: string;
  tags: string[];
  isPopular?: boolean;
}

export interface CalculationHistoryItem {
  id: string;
  calculatorId: CalculatorId;
  calculatorName: string;
  timestamp: string;
  inputs: Record<string, string | number>;
  resultSummary: string;
  details?: Record<string, string | number>;
}
