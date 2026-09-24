import React from 'react';
import { FinanceAccountsMasterView } from './views/FinanceAccountsMasterView';

export type FinanceSubSection =
  | 'debtors'
  | 'creditors'
  | 'banks'
  | 'cash'
  | 'investors'
  | 'partners'
  | 'land-owners'
  | 'vehicle-owners'
  | 'staff-salary'
  | 'trip-accounts'
  | 'pay-in'
  | 'pay-out'
  | 'expenses'
  | 'settlements'
  | 'payroll'
  | 'staff-advances'
  | 'trips'
  | 'ledgers'
  | 'reconciliation'
  | 'reports'
  | 'finance-dashboard';

interface SharedErpFinanceSectionProps {
  onNavigate?: (section: string) => void;
  initialSubSection?: FinanceSubSection | string;
}

export const SharedErpFinanceSection: React.FC<SharedErpFinanceSectionProps> = ({
  onNavigate,
  initialSubSection = 'finance-dashboard'
}) => {
  return (
    <div className="space-y-6">
      <FinanceAccountsMasterView initialSubTab={initialSubSection} />
    </div>
  );
};
