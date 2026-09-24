import React, { useState, useMemo } from 'react';
import {
  Search,
  X,
  Users,
  Building2,
  Package,
  ShoppingBag,
  Truck,
  Pickaxe,
  FileText,
  Clock,
  MessageSquare,
  ArrowRight,
  Filter,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { SectionId } from '../types/architecture';

interface SearchResultItem {
  id: string;
  category: 'USERS' | 'CUSTOMERS' | 'SUPPLIERS' | 'PRODUCTS' | 'ORDERS' | 'JOBS' | 'VEHICLES' | 'QUARRIES' | 'DOCUMENTS' | 'TASKS' | 'MESSAGES';
  title: string;
  subtitle: string;
  sectionId: SectionId;
  badge: string;
  dateOrStatus?: string;
  permissionRequired?: string;
}

const SEARCH_DATABASE: SearchResultItem[] = [
  // Quarries
  {
    id: 'QRY-01',
    category: 'QUARRIES',
    title: 'Wayanad Granite & Laterite Concession #1',
    subtitle: 'Active concession • 42,000 MT capacity • 14 Excavators active',
    sectionId: 'quarry-management',
    badge: 'Concession Active',
    dateOrStatus: 'Compliance Valid'
  },
  {
    id: 'QRY-02',
    category: 'QUARRIES',
    title: 'Malabar Blue Metal Pit #4',
    subtitle: 'Granite aggregate extraction • Calicut Hills zone',
    sectionId: 'quarry-management',
    badge: 'Blasting Cleared',
    dateOrStatus: 'SEIAA Certified'
  },

  // Vehicles
  {
    id: 'VEH-KL11-8902',
    category: 'VEHICLES',
    title: 'KL-11-BH-8902 (Tata Signa 2823.K Tipper)',
    subtitle: 'Driver: Jaleel Ahmed • Destination: Kochi Expressway • Payload: 28 MT',
    sectionId: 'vehicle-management',
    badge: 'On Trip (GPS Live)',
    dateOrStatus: 'Speed: 48 km/h'
  },
  {
    id: 'VEH-KL10-4411',
    category: 'VEHICLES',
    title: 'KL-10-AZ-4411 (BharatBenz 3528CM Heavy Tipper)',
    subtitle: 'Crusher Yard Wayanad • Weighbridge Net: 31.4 MT M-Sand',
    sectionId: 'vehicle-management',
    badge: 'Yard Staging',
    dateOrStatus: 'Maintenance OK'
  },

  // Products
  {
    id: 'PROD-MSAND-01',
    category: 'PRODUCTS',
    title: 'Manufactured Sand (M-Sand Concrete Grade)',
    subtitle: 'Zone II washed plaster/concrete grade • ₹42 / CFT bulk',
    sectionId: 'building-materials-ecommerce',
    badge: 'In Stock (4,200 MT)',
    dateOrStatus: 'IS 383:2016'
  },
  {
    id: 'PROD-AGG-20MM',
    category: 'PRODUCTS',
    title: '20mm Granite Aggregate (Blue Metal)',
    subtitle: 'Triple-stage VSI crushed stone • ₹38 / CFT',
    sectionId: 'building-materials-ecommerce',
    badge: 'Ready for Dispatch',
    dateOrStatus: 'Immediate Delivery'
  },

  // Customers
  {
    id: 'CUST-009',
    category: 'CUSTOMERS',
    title: 'L&T Transportation Infrastructure Kochi',
    subtitle: 'GSTIN: 32AABCL1298K1ZP • Active PO #PO-LT-9921',
    sectionId: 'shared-erp-sales-crm',
    badge: 'Tier-1 Client',
    dateOrStatus: '₹14.2L Outstanding'
  },
  {
    id: 'CUST-014',
    category: 'CUSTOMERS',
    title: 'Sobha City Developers Wayanad Project',
    subtitle: 'Weekly 1,200 MT M-Sand contract allocation',
    sectionId: 'shared-erp-sales-crm',
    badge: 'Contract Active',
    dateOrStatus: 'Credit Limit: ₹50L'
  },

  // Suppliers
  {
    id: 'SUP-002',
    category: 'SUPPLIERS',
    title: 'Indian Oil Commercial Fuels (Bulk Diesel)',
    subtitle: 'Contracted rate: ₹86.40/L • Dedicated fuel bowser feed',
    sectionId: 'shared-erp-procurement',
    badge: 'Verified Supplier',
    dateOrStatus: 'Auto-Replenish Active'
  },

  // Orders
  {
    id: 'ORD-98214',
    category: 'ORDERS',
    title: 'Order #ORD-98214 — 120 MT Laterite Block',
    subtitle: 'Buyer: Malabar Skyline Villas • Dispatched via 4 Tippers',
    sectionId: 'building-materials-ecommerce',
    badge: 'Transit In-Progress',
    dateOrStatus: 'Est: Today 4:30 PM'
  },

  // Jobs
  {
    id: 'JOB-2026-08',
    category: 'JOBS',
    title: 'NH-66 Highway Aggregate Supply & Laying Job',
    subtitle: 'Subcontractor: RZ Infraworks • Scope: 80,000 MT GSB & WMM',
    sectionId: 'contract-job-management',
    badge: '64% Completed',
    dateOrStatus: 'Target: Nov 2026'
  },

  // Tasks (OTT)
  {
    id: 'TASK-OTT-102',
    category: 'TASKS',
    title: 'Calibrate Weighbridge Load Cell #2 at Crusher Plant',
    subtitle: 'Assigned to: Rajesh Nambiar • Priority: HIGH',
    sectionId: 'rz-ott',
    badge: 'Due Tomorrow 11 AM',
    dateOrStatus: 'OTT Synchronized'
  },

  // Messages (RZ Chat)
  {
    id: 'MSG-449',
    category: 'MESSAGES',
    title: 'Dispatch Dispatcher Group: "All tippers for NH-66 staged"',
    subtitle: 'Quarry Logistics Channel • 14 participants active',
    sectionId: 'rz-chating',
    badge: 'Unread (3)',
    dateOrStatus: '12 mins ago'
  },

  // Documents
  {
    id: 'DOC-PCB-2026',
    category: 'DOCUMENTS',
    title: 'Pollution Control Board Consent to Operate (CTO 2026-2028)',
    subtitle: 'Quarry Concession #1 • Authorized Capacity 1.2 Lakh MT/yr',
    sectionId: 'shared-erp-documents',
    badge: 'Verified Legal',
    dateOrStatus: 'Expires Oct 2028'
  },

  // Users
  {
    id: 'USR-01',
    category: 'USERS',
    title: 'Nafid Khan (Managing Director & Super Admin)',
    subtitle: 'nafidkhan@racezoneventures.com • Executive Board',
    sectionId: 'shared-erp-hr',
    badge: 'Super Admin',
    dateOrStatus: 'Active Session'
  }
];

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (section: SectionId) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const filteredResults = useMemo(() => {
    return SEARCH_DATABASE.filter((item) => {
      const matchCat = selectedCategory === 'ALL' || item.category === selectedCategory;
      if (!matchCat) return false;

      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    });
  }, [query, selectedCategory]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-950/70">
          <Search className="w-5 h-5 text-amber-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search across Quarries, Crushers, Vehicles, Orders, Products, Jobs, Tasks, Messages..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-white placeholder-slate-500 text-sm focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-white text-xs p-1"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Category Pills */}
        <div className="px-4 py-2 bg-slate-950/40 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs">
          <span className="text-[10px] uppercase font-mono text-slate-500 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Filter:
          </span>
          {[
            { id: 'ALL', label: 'All Results' },
            { id: 'QUARRIES', label: 'Quarries' },
            { id: 'VEHICLES', label: 'Vehicles' },
            { id: 'PRODUCTS', label: 'Products' },
            { id: 'ORDERS', label: 'Orders' },
            { id: 'JOBS', label: 'Jobs' },
            { id: 'CUSTOMERS', label: 'Customers' },
            { id: 'SUPPLIERS', label: 'Suppliers' },
            { id: 'TASKS', label: 'Tasks' },
            { id: 'MESSAGES', label: 'Messages' },
            { id: 'DOCUMENTS', label: 'Documents' },
            { id: 'USERS', label: 'Users' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Results List */}
        <div className="p-3 overflow-y-auto divide-y divide-slate-800/60 flex-1">
          {filteredResults.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              <Search className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="font-semibold text-slate-300">No matching records found for "{query}"</p>
              <p className="text-slate-500 mt-1">Try searching by code (e.g. QRY-01, KL-11, M-Sand, Order ID)</p>
            </div>
          ) : (
            filteredResults.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onNavigate(item.sectionId);
                  onClose();
                }}
                className="p-3 hover:bg-slate-800/60 rounded-xl transition cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 shrink-0 group-hover:border-amber-500/40">
                    {item.category === 'QUARRIES' && <Pickaxe className="w-4 h-4" />}
                    {item.category === 'VEHICLES' && <Truck className="w-4 h-4" />}
                    {item.category === 'PRODUCTS' && <Package className="w-4 h-4" />}
                    {item.category === 'ORDERS' && <ShoppingBag className="w-4 h-4" />}
                    {item.category === 'CUSTOMERS' && <Building2 className="w-4 h-4" />}
                    {item.category === 'SUPPLIERS' && <Building2 className="w-4 h-4" />}
                    {item.category === 'JOBS' && <CheckCircle2 className="w-4 h-4" />}
                    {item.category === 'TASKS' && <Clock className="w-4 h-4" />}
                    {item.category === 'MESSAGES' && <MessageSquare className="w-4 h-4" />}
                    {item.category === 'DOCUMENTS' && <FileText className="w-4 h-4" />}
                    {item.category === 'USERS' && <Users className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white group-hover:text-amber-300 transition">
                        {item.title}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                        {item.id}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{item.subtitle}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="text-right hidden sm:block">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-amber-400 border border-amber-500/20">
                      {item.badge}
                    </span>
                    {item.dateOrStatus && (
                      <div className="text-[10px] text-slate-500 mt-0.5">{item.dateOrStatus}</div>
                    )}
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>Search respects tenant isolation & role permissions</span>
          <div className="flex items-center gap-2 text-slate-400">
            <span>Press Esc to close</span>
          </div>
        </div>
      </div>
    </div>
  );
};
