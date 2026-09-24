import { CalculatorMeta, CalculatorCategoryId } from '../types';

export interface CategoryInfo {
  id: CalculatorCategoryId;
  name: string;
  description: string;
  iconName: string;
  count: number;
}

export const CALCULATOR_CATEGORIES: CategoryInfo[] = [
  { id: 'ALL', name: 'All Calculators', description: 'Complete suite of 30+ precision calculation engines', iconName: 'LayoutGrid', count: 28 },
  { id: 'BASIC', name: 'Basic & Everyday', description: 'Desk, percentage, discount, markup, profit & loss, ratio', iconName: 'Calculator', count: 6 },
  { id: 'CONVERSION', name: 'Units & Land', description: 'Mining weights, volumes, acres, cents, sq.ft, hectares', iconName: 'Scale', count: 2 },
  { id: 'GST', name: 'GST & Taxation', description: 'Add/remove GST, CGST/SGST/IGST breakdown, custom rates', iconName: 'Receipt', count: 1 },
  { id: 'FINANCE', name: 'Finance & Loans', description: 'EMI, reverse loan, interest, reducing balance, prepayment', iconName: 'Coins', count: 8 },
  { id: 'BUSINESS', name: 'Business Operations', description: 'Break-even, margins, revenue models, sales targets, unit cost', iconName: 'TrendingUp', count: 6 },
  { id: 'QUARRY', name: 'Quarry Mining', description: 'Cost per load, revenue, landowner royalty, block yield', iconName: 'Pickaxe', count: 3 },
  { id: 'CRUSHER', name: 'Crusher Plants', description: 'Aggregates cost per ton, power, maintenance, net margin', iconName: 'Layers', count: 2 },
  { id: 'VEHICLE', name: 'Fleet & Logistics', description: 'Trip revenue, diesel burn, toll, driver batta, cost per km', iconName: 'Truck', count: 2 },
  { id: 'PARTNER', name: 'Partnership & ROI', description: 'Capital ownership split, equity ratios, investment return', iconName: 'Users', count: 2 }
];

export const CALCULATOR_CATALOG: CalculatorMeta[] = [
  // 1. Basic Desk
  {
    id: 'basic-desk',
    name: 'Standard Desk Calculator',
    shortName: 'Desk Calc',
    category: 'BASIC',
    description: 'High-precision 64-bit desk calculator with memory (MC, MR, M+, M-), tape history, and sign toggle.',
    formula: 'Result = Operand1 [+, −, ×, ÷] Operand2',
    howItWorks: 'Performs instant arithmetic with IEEE 754 precision. Stores running calculations in tape history.',
    example: 'Enter 125000 × 18% = 22,500',
    tags: ['basic', 'desk', 'math', 'arithmetic', 'memory', 'add', 'divide', 'multiply'],
    isPopular: true
  },
  // 2. Percentage
  {
    id: 'percentage',
    name: 'Percentage & Variance Calculator',
    shortName: 'Percentage',
    category: 'BASIC',
    description: 'Calculate what is X% of Y, X is what % of Y, percentage increase, decrease, and variance difference.',
    formula: 'Percentage = (Value / Total) × 100 | Result = (X / 100) × Y',
    howItWorks: 'Evaluates standard percentage proportions, growth increments, and absolute difference percentages.',
    example: 'What is 18% of ₹45,000? Result = ₹8,100',
    tags: ['percentage', 'percent', 'variance', 'fraction', 'growth'],
    isPopular: true
  },
  // 3. Discount
  {
    id: 'discount',
    name: 'Discount & Markdown Calculator',
    shortName: 'Discount',
    category: 'BASIC',
    description: 'Compute final price after discount percentage, or reverse-calculate original price from discounted total.',
    formula: 'Discount Amount = Original Price × (Discount % / 100) | Final = Original − Discount',
    howItWorks: 'Computes monetary savings from promotional discounts and offers reverse deduction.',
    example: 'Original: ₹10,000 with 15% discount &rarr; Discount: ₹1,500, Final: ₹8,500',
    tags: ['discount', 'markdown', 'sale', 'savings', 'off'],
    isPopular: true
  },
  // 4. Markup
  {
    id: 'markup',
    name: 'Cost Markup Calculator',
    shortName: 'Markup',
    category: 'BASIC',
    description: 'Convert base production cost into target selling price via cost markup percentage or gross margin.',
    formula: 'Selling Price = Cost Price × (1 + Markup % / 100) | Markup % = ((Selling − Cost) / Cost) × 100',
    howItWorks: 'Takes material procurement cost and adds specified markup percentage to determine wholesale/retail quote.',
    example: 'Cost: ₹400/ton, Markup: 25% &rarr; Markup Amount: ₹100, Selling Price: ₹500/ton',
    tags: ['markup', 'cost', 'selling', 'price', 'pricing'],
    isPopular: false
  },
  // 5. Profit & Loss
  {
    id: 'profit-loss',
    name: 'Profit & Loss & Margin Calculator',
    shortName: 'Profit & Loss',
    category: 'BASIC',
    description: 'Determine gross profit, profit percentage, and sales margin from unit cost, selling price, and volume.',
    formula: 'Profit = Total Revenue − Total Cost | Margin % = (Profit / Revenue) × 100',
    howItWorks: 'Multiplies quantities by unit costs and sales rates to produce comprehensive bottom-line financial yield.',
    example: 'Cost: ₹45,000, Sale: ₹62,000 for 100 units &rarr; Net Profit: ₹17,000 (27.42% margin)',
    tags: ['profit', 'loss', 'margin', 'gross', 'revenue', 'ebitda'],
    isPopular: true
  },
  // 6. Ratio
  {
    id: 'ratio',
    name: 'Ratio, Proportion & Split Calculator',
    shortName: 'Ratio & Split',
    category: 'BASIC',
    description: 'Simplify ratios, compute missing proportions (A:B = C:D), and split lump sums across partner shares.',
    formula: 'Share A = Total Amount × (Ratio A / Sum of Ratios)',
    howItWorks: 'Normalizes multiple ratio coefficients and allocates arbitrary budget amounts proportionally.',
    example: 'Split ₹100,000 in 60 : 40 ratio &rarr; Share A = ₹60,000, Share B = ₹40,000',
    tags: ['ratio', 'proportion', 'split', 'shares', 'simplify'],
    isPopular: false
  },
  // 7. Unit Converter
  {
    id: 'unit-converter',
    name: 'Industrial Unit Converter',
    shortName: 'Unit Converter',
    category: 'CONVERSION',
    description: 'Convert length, weight, volume, distance, time across metric, imperial, and mining standard units.',
    formula: 'Value_target = Value_base × ConversionFactor',
    howItWorks: 'Converts between millimeters, meters, kilometers, kilograms, metric tons, cubic meters, liters, and CFT.',
    example: '100 Metric Tons = 100,000 kg | 1 Cubic Meter = 35.3147 CFT',
    tags: ['unit', 'converter', 'metric', 'cft', 'ton', 'weight', 'volume', 'length'],
    isPopular: true
  },
  // 8. Land Converter
  {
    id: 'land-converter',
    name: 'Quarry Land & Area Converter',
    shortName: 'Land Converter',
    category: 'CONVERSION',
    description: 'Convert Indian & international land units: Cents, Acres, Hectares, Square Feet, Square Meters, Gunthas.',
    formula: '1 Acre = 100 Cents = 43,560 Sq.Ft = 4,046.86 Sq.M = 0.4047 Hectares',
    howItWorks: 'Implements official South Indian revenue department land survey ratios for quarry lease sizing.',
    example: '50 Cents = 0.50 Acre = 21,780 Sq.Ft = 2,023.43 Sq.M',
    tags: ['land', 'cent', 'acre', 'hectare', 'sqft', 'sqm', 'guntha', 'survey'],
    isPopular: true
  },
  // 9. GST Calculator
  {
    id: 'gst-calculator',
    name: 'GST Tax Calculator (Add / Remove)',
    shortName: 'GST Calculator',
    category: 'GST',
    description: 'Calculate Indian Goods and Services Tax: Add GST to base, Remove GST from gross, CGST + SGST or IGST.',
    formula: 'Add: GST = Base × (Rate / 100) | Remove: Base = Gross / (1 + Rate / 100)',
    howItWorks: 'Breaks down GST into equal CGST and SGST for intra-state sales, or unified IGST for inter-state interstate dispatch.',
    example: 'Base: ₹100,000 @ 18% &rarr; CGST: ₹9,000, SGST: ₹9,000, Total: ₹118,000',
    tags: ['gst', 'tax', 'cgst', 'sgst', 'igst', 'invoice', 'hsn'],
    isPopular: true
  },
  // 10. EMI Calculator
  {
    id: 'emi-calculator',
    name: 'Loan EMI Calculator & Schedule',
    shortName: 'EMI Calculator',
    category: 'FINANCE',
    description: 'Calculate monthly Equated Monthly Installment (EMI), total interest, and complete month-by-month repayment schedule.',
    formula: 'EMI = [P × r × (1 + r)^n] / [(1 + r)^n − 1]',
    howItWorks: 'Calculates amortized loan payment based on monthly compounding interest rate and tenure.',
    example: 'Principal: ₹25,00,000 @ 10.5% for 60 months &rarr; Monthly EMI: ₹53,744',
    tags: ['emi', 'loan', 'finance', 'interest', 'amortization', 'monthly'],
    isPopular: true
  },
  // 11. Reverse EMI
  {
    id: 'reverse-emi',
    name: 'Reverse EMI (Affordability / Tenure)',
    shortName: 'Reverse EMI',
    category: 'FINANCE',
    description: 'Find out how much loan principal you qualify for based on budget EMI, or how many months to clear.',
    formula: 'Principal = [EMI × ((1 + r)^n − 1)] / [r × (1 + r)^n]',
    howItWorks: 'Inverts standard amortization formula to calculate borrowing capacity from monthly cash flow.',
    example: 'Budget EMI ₹40,000 @ 10% for 5 years &rarr; Maximum Loan: ₹18,82,607',
    tags: ['reverse', 'emi', 'affordability', 'borrowing', 'tenure'],
    isPopular: false
  },
  // 12. Simple Interest
  {
    id: 'simple-interest',
    name: 'Simple Interest Calculator',
    shortName: 'Simple Interest',
    category: 'FINANCE',
    description: 'Calculate flat simple interest accrual and total maturity payout over days, months, or years.',
    formula: 'Interest = (P × R × T) / 100 | Total = P + Interest',
    howItWorks: 'Applies fixed annual percentage rate directly to initial principal without periodic compounding.',
    example: '₹5,00,000 @ 8% p.a. for 3 years &rarr; Interest: ₹1,20,000, Total: ₹6,20,000',
    tags: ['simple', 'interest', 'flat', 'deposit', 'finance'],
    isPopular: false
  },
  // 13. Compound Interest
  {
    id: 'compound-interest',
    name: 'Compound Interest Calculator',
    shortName: 'Compound Interest',
    category: 'FINANCE',
    description: 'Compute compound interest with annual, semi-annual, quarterly, or monthly compounding intervals.',
    formula: 'A = P × (1 + r / n)^(n × t) | Compound Interest = A − P',
    howItWorks: 'Re-invests accrued interest into principal each cycle, compounding growth exponentially.',
    example: '₹10,00,000 @ 9% quarterly for 5 years &rarr; Maturity: ₹15,59,945',
    tags: ['compound', 'interest', 'cagr', 'investment', 'growth'],
    isPopular: true
  },
  // 14. Reducing Interest
  {
    id: 'reducing-interest',
    name: 'Reducing Balance Interest Calculator',
    shortName: 'Reducing Balance',
    category: 'FINANCE',
    description: 'Simulate commercial diminishing balance interest where interest is calculated strictly on unpaid principal.',
    formula: 'Monthly Interest = Outstanding Balance × (Annual Rate / 12)',
    howItWorks: 'Applies each payment first toward accrued interest, deducting remainder from principal balance.',
    example: '₹15,00,000 @ 11% reducing rate &rarr; Notice principal portion rises while interest portion declines.',
    tags: ['reducing', 'diminishing', 'balance', 'schedule', 'bank'],
    isPopular: false
  },
  // 15. Loan Calculator
  {
    id: 'loan-calculator',
    name: 'Commercial Equipment & Vehicle Loan',
    shortName: 'Loan Calculator',
    category: 'FINANCE',
    description: 'Calculate commercial vehicle and equipment loans including down payment, processing fees, and net disbursal.',
    formula: 'Net Loan = Asset Price − Down Payment | Total Upfront = Down Payment + Processing Fee',
    howItWorks: 'Models heavy tipper or excavator financing with upfront down payment and statutory fees.',
    example: 'Tipper: ₹42,00,000, Down Payment: ₹8,00,000, Loan: ₹34,00,000 @ 9.8% for 4 years',
    tags: ['loan', 'vehicle', 'tipper', 'machinery', 'processing', 'downpayment'],
    isPopular: true
  },
  // 16. Repayment Schedule
  {
    id: 'repayment-schedule',
    name: 'Loan Amortization Repayment Table',
    shortName: 'Repayment Table',
    category: 'FINANCE',
    description: 'Generate full printable repayment schedule showing opening balance, EMI, principal, interest, and closing balance.',
    formula: 'Period by period amortization table breakdown',
    howItWorks: 'Generates tabular ledger for each installment period with export and print preview actions.',
    example: 'Review all 60 months of payments with cumulative interest and balance reduction.',
    tags: ['amortization', 'schedule', 'table', 'monthly', 'ledger', 'print'],
    isPopular: false
  },
  // 17. Prepayment
  {
    id: 'prepayment-calculator',
    name: 'Loan Prepayment & Part-Payment',
    shortName: 'Prepayment',
    category: 'FINANCE',
    description: 'Estimate interest savings and tenure reduction when making lump-sum part payments toward principal.',
    formula: 'New Outstanding = Outstanding − Prepayment | Recompute EMI or Tenure',
    howItWorks: 'Compares two strategies: (1) Reduce monthly EMI amount, or (2) Keep EMI constant and finish loan early.',
    example: 'Outstanding: ₹18,00,000, Lump sum ₹3,00,000 &rarr; Save ₹1,42,000 interest and reduce 14 months',
    tags: ['prepayment', 'partpayment', 'foreclosure', 'savings', 'tenure'],
    isPopular: true
  },
  // 18. Revenue
  {
    id: 'revenue-calculator',
    name: 'Multi-Product Revenue Calculator',
    shortName: 'Revenue Model',
    category: 'BUSINESS',
    description: 'Model aggregate commercial turnover across multiple product lines (Laterite, M-Sand, Aggregates, Boulders).',
    formula: 'Total Revenue = &Sigma; (Product_Quantity_i &times; Product_Price_i)',
    howItWorks: 'Aggregates multi-row product dispatches with quantity and unit rates into consolidated turnover.',
    example: '1,000 laterite blocks @ ₹42 + 200 MT aggregates @ ₹480 = ₹1,38,000',
    tags: ['revenue', 'sales', 'turnover', 'products', 'volume'],
    isPopular: false
  },
  // 19. Expense Ratio
  {
    id: 'expense-ratio',
    name: 'Operating Expense Ratio (OER)',
    shortName: 'Expense Ratio',
    category: 'BUSINESS',
    description: 'Calculate operating efficiency by comparing total operational overhead against gross revenue.',
    formula: 'Expense Ratio % = (Total Operating Expenses / Gross Revenue) × 100',
    howItWorks: 'Benchmarks operating cost overheads to identify efficiency and margin compression.',
    example: 'Revenue: ₹15,00,000, Expenses: ₹9,75,000 &rarr; Expense Ratio: 65.0%',
    tags: ['expense', 'ratio', 'oer', 'overhead', 'efficiency'],
    isPopular: false
  },
  // 20. Gross Margin
  {
    id: 'gross-margin',
    name: 'Gross Margin & COGS Calculator',
    shortName: 'Gross Margin',
    category: 'BUSINESS',
    description: 'Determine Cost of Goods Sold (COGS), gross profit dollar value, and gross margin percentage.',
    formula: 'Gross Margin % = ((Revenue − COGS) / Revenue) × 100',
    howItWorks: 'Calculates direct production efficiency before administrative and financing expenses.',
    example: 'Revenue: ₹5,00,000, COGS: ₹3,20,000 &rarr; Gross Profit: ₹1,80,000 (36.0%)',
    tags: ['margin', 'cogs', 'gross', 'profitability'],
    isPopular: true
  },
  // 21. Break-even
  {
    id: 'break-even',
    name: 'Break-Even Analysis Calculator',
    shortName: 'Break-Even',
    category: 'BUSINESS',
    description: 'Find required sales volume (units & revenue) to cover fixed and variable operating costs.',
    formula: 'Break-Even Units = Fixed Costs / (Selling Price Per Unit − Variable Cost Per Unit)',
    howItWorks: 'Calculates unit contribution margin and the minimum volume needed to avoid operating losses.',
    example: 'Fixed Costs: ₹2,50,000, Unit Price: ₹850, Variable Cost: ₹450 &rarr; Break-even: 625 units',
    tags: ['breakeven', 'contribution', 'fixed', 'variable', 'units'],
    isPopular: true
  },
  // 22. Sales Target
  {
    id: 'sales-target',
    name: 'Sales Target & Gap Analysis',
    shortName: 'Sales Target',
    category: 'BUSINESS',
    description: 'Calculate remaining units and dispatch pace needed to reach monthly revenue objectives.',
    formula: 'Remaining Units = (Target Revenue − Current Sales) / Average Selling Price',
    howItWorks: 'Determines shortfall between current booked sales and monthly target, converting it to daily quotas.',
    example: 'Target: ₹20,00,000, Achieved: ₹13,50,000 @ ₹500/unit &rarr; 1,300 units remaining',
    tags: ['target', 'sales', 'quota', 'forecast', 'gap'],
    isPopular: false
  },
  // 23. Cost Per Unit
  {
    id: 'cost-per-unit',
    name: 'Cost Per Unit (Piece / Ton / Load)',
    shortName: 'Cost Per Unit',
    category: 'BUSINESS',
    description: 'Divide total production overhead across units, tons, trips, or loads to determine exact unit cost.',
    formula: 'Cost Per Unit = Total Operating Cost / Total Units Produced',
    howItWorks: 'Allocates direct labor, consumables, fuel, and depreciation across total production output.',
    example: 'Total Cost: ₹1,40,000 for 500 laterite blocks &rarr; Cost: ₹280 / block',
    tags: ['unitcost', 'cost', 'piece', 'load', 'ton', 'overhead'],
    isPopular: false
  },
  // 24. Quarry Load
  {
    id: 'quarry-load',
    name: 'Quarry Load Revenue & Contribution',
    shortName: 'Quarry Load',
    category: 'QUARRY',
    description: 'Calculate quarry revenue, vehicle haulage, landowner royalty, loading costs, and net contribution.',
    formula: 'Gross Contribution = Total Revenue − (Haulage + Loading + Landowner Royalty)',
    howItWorks: 'Models quarry gate dispatch economics per tipper load with itemized direct costs.',
    example: '50 Loads @ ₹8,500/load = ₹4,25,000 revenue &rarr; Net contribution after costs: ₹1,95,000',
    tags: ['quarry', 'load', 'tipper', 'extraction', 'revenue', 'mining'],
    isPopular: true
  },
  // 25. Landowner Load
  {
    id: 'landowner-load',
    name: 'Land Owner Royalty Per Load',
    shortName: 'Landowner Royalty',
    category: 'QUARRY',
    description: 'Calculate exact land owner royalty payable per extracted load or block based on lease agreement.',
    formula: 'Land Owner Royalty = Number of Loads × Royalty Rate Per Load',
    howItWorks: 'Multiplies verified weighbridge or pit tally slips by agreed lease royalty rate per load.',
    example: '120 Loads × ₹1,200/load = ₹1,44,000 Land Owner Royalty',
    tags: ['landowner', 'royalty', 'lease', 'quarry', 'settlement'],
    isPopular: true
  },
  // 26. Quarry Profit
  {
    id: 'quarry-profit',
    name: 'Quarry Block Extraction Profit',
    shortName: 'Quarry Profit',
    category: 'QUARRY',
    description: 'Calculate quarry profit per block incorporating wire sawing, excavator fuel, labor, royalty, and sales.',
    formula: 'Profit Per Block = Selling Price − (Drilling + Fuel + Labor + Royalty) / Total Blocks',
    howItWorks: 'Calculates the real unit margin on dimension stone and laterite extraction runs.',
    example: '500 blocks @ ₹42 selling price with ₹14,000 total pit cost &rarr; Profit: ₹14/block (33.3%)',
    tags: ['quarry', 'profit', 'block', 'laterite', 'wire', 'sawing'],
    isPopular: true
  },
  // 27. Crusher Cost
  {
    id: 'crusher-cost',
    name: 'Crusher Production Cost Per Ton',
    shortName: 'Crusher Cost/Ton',
    category: 'CRUSHER',
    description: 'Calculate production cost per metric ton of aggregates, M-Sand, and gravel incorporating raw stone, power, wear parts, and labor.',
    formula: 'Cost Per Ton = (Raw Boulders + Power + Jaw/Cone Wear + Labor) / Output Tons',
    howItWorks: 'Calculates composite crushing cost per MT for primary jaw and secondary cone/VSI operations.',
    example: '300 MT production costing ₹84,000 &rarr; Production Cost: ₹280 / MT',
    tags: ['crusher', 'cost', 'ton', 'msand', 'aggregates', 'power', 'vsi'],
    isPopular: true
  },
  // 28. Crusher Margin
  {
    id: 'crusher-margin',
    name: 'Crusher Plant Operating Margin',
    shortName: 'Crusher Margin',
    category: 'CRUSHER',
    description: 'Determine crushing plant gross profit and operational margin from selling price per ton vs total cost.',
    formula: 'Gross Margin = (Selling Price Per Ton − Cost Per Ton) × Output Tons',
    howItWorks: 'Evaluates wholesale dispatch margins across 20mm, 40mm, and manufactured sand grades.',
    example: 'Selling: ₹480/MT, Cost: ₹310/MT for 500 MT &rarr; Gross Profit: ₹85,000 (35.4% margin)',
    tags: ['crusher', 'margin', 'aggregates', 'profit', 'turnover'],
    isPopular: false
  },
  // 29. Vehicle Trip
  {
    id: 'vehicle-trip',
    name: 'Vehicle Trip Cost & Freight Profit',
    shortName: 'Trip Profit',
    category: 'VEHICLE',
    description: 'Estimate diesel burn, toll, driver batta, loading/unloading, and net freight profit for commercial tippers and trailers.',
    formula: 'Net Profit = Freight Billed − (Fuel Cost + Toll + Driver Batta + Loading Charges)',
    howItWorks: 'Calculates trip economics based on round-trip kilometers, tipper mileage, and diesel rate.',
    example: '140 km trip @ 3.5 km/L diesel (₹92/L) + ₹450 toll &rarr; Net freight profit: ₹3,820 (44.9% margin)',
    tags: ['trip', 'vehicle', 'tipper', 'freight', 'fuel', 'diesel', 'logistics'],
    isPopular: true
  },
  // 30. Fuel Mileage
  {
    id: 'fuel-mileage',
    name: 'Fuel Consumption & Mileage Calculator',
    shortName: 'Fuel Mileage',
    category: 'VEHICLE',
    description: 'Calculate fuel liters required, total diesel cost, or reverse-calculate vehicle mileage from odometer reading and fuel fill.',
    formula: 'Fuel Required = Distance / Mileage | Mileage = Distance / Fuel Used',
    howItWorks: 'Provides bi-directional fuel calculations for tipper fleets and heavy machinery.',
    example: '450 km @ 3.2 km/L &rarr; 140.6 Liters diesel required = ₹12,937 at ₹92/L',
    tags: ['fuel', 'diesel', 'mileage', 'consumption', 'kmpl', 'fleet'],
    isPopular: true
  },
  // 31. Ownership Split
  {
    id: 'ownership-split',
    name: 'Partner & Capital Ownership Split',
    shortName: 'Ownership Split',
    category: 'PARTNER',
    description: 'Divide profit, dividends, equipment purchase costs, or quarry sale proceeds across partners according to equity share.',
    formula: 'Partner Share = Total Distribution Amount × (Partner Equity % / 100)',
    howItWorks: 'Splits arbitrary lump sums across up to 5 partners with custom equity percentages.',
    example: '₹10,00,000 split: Partner A (60%) = ₹6,00,000, Partner B (40%) = ₹4,00,000',
    tags: ['partner', 'equity', 'ownership', 'split', 'shares', 'dividend'],
    isPopular: true
  },
  // 32. Investment Return
  {
    id: 'investment-return',
    name: 'Investment Return & ROI Calculator',
    shortName: 'Investment ROI',
    category: 'PARTNER',
    description: 'Calculate Return on Investment (ROI %), annualized return, and total payout from initial capital plus returns.',
    formula: 'ROI % = ((Net Return − Total Investment) / Total Investment) × 100',
    howItWorks: 'Estimates percentage return on capital deployed in quarry leases, machinery purchases, and plant upgrades.',
    example: 'Invested: ₹20,00,000, Returned: ₹27,50,000 &rarr; Net Profit: ₹7,50,000 (37.5% ROI)',
    tags: ['investment', 'roi', 'return', 'capital', 'profit', 'yield'],
    isPopular: false
  }
];
