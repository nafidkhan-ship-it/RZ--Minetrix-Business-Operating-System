import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Filter,
  Eye,
  Edit3,
  FileCheck2,
  FileSpreadsheet,
  Briefcase,
  Receipt,
  MessageSquare,
  Building,
  Phone,
  Mail,
  MapPin,
  X,
  CheckCircle2,
  Download,
  Printer,
  ChevronRight
} from 'lucide-react';
import {
  Customer,
  CustomerType,
  SAMPLE_CUSTOMERS
} from '../../data/contractJobStudioData';

interface CustomersViewProps {
  onNewRequirement: (customer: Customer) => void;
  onNewQuotation: (customer: Customer) => void;
  onNewJob: (customer: Customer) => void;
  onOpenChat: (customerName: string) => void;
}

export const CustomersView: React.FC<CustomersViewProps> = ({
  onNewRequirement,
  onNewQuotation,
  onNewJob,
  onOpenChat
}) => {
  const [customers, setCustomers] = useState<Customer[]>(SAMPLE_CUSTOMERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [statementCustomer, setStatementCustomer] = useState<Customer | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // New customer form state
  const [newCust, setNewCust] = useState<Partial<Customer>>({
    name: '',
    companyName: '',
    customerType: 'Company',
    phone: '',
    email: '',
    address: '',
    district: '',
    state: 'Karnataka',
    gstRegistration: '',
    contactPerson: '',
    creditLimit: 2000000,
    paymentTerms: '15 Days Net',
    status: 'Active'
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCust.name || !newCust.phone) {
      showToast('Please provide Customer Name and Phone');
      return;
    }

    const created: Customer = {
      id: `CUST-${1000 + customers.length + 1}`,
      name: newCust.name || 'New Customer',
      companyName: newCust.companyName || newCust.name || '',
      customerType: (newCust.customerType as CustomerType) || 'Company',
      phone: newCust.phone || '',
      email: newCust.email || '',
      address: newCust.address || '',
      district: newCust.district || 'Dakshina Kannada',
      state: newCust.state || 'Karnataka',
      gstRegistration: newCust.gstRegistration || '29AAAAA0000A1Z5',
      contactPerson: newCust.contactPerson || newCust.name || '',
      creditLimit: Number(newCust.creditLimit) || 1000000,
      paymentTerms: newCust.paymentTerms || '30 Days Net',
      status: 'Active',
      documentsCount: 1,
      totalJobsCount: 0,
      totalBilled: 0,
      totalPaid: 0,
      outstandingBalance: 0
    };

    setCustomers([created, ...customers]);
    setIsAddModalOpen(false);
    showToast(`Created Customer ${created.name} (${created.id})`);
  };

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery);

    const matchesType = typeFilter === 'ALL' || c.customerType === typeFilter;
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-slate-950 px-4 py-2.5 rounded-2xl font-bold text-xs shadow-2xl flex items-center gap-2 border border-emerald-400">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header and Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
              CRM & Directory
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
              {filteredCustomers.length} Records
            </span>
          </div>
          <h2 className="text-xl font-black text-white mt-0.5">Customer & Client Management</h2>
          <p className="text-xs text-slate-400">
            Government authorities, builders, contractors, individual project owners, and registered enterprises.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ New Customer</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by customer name, company, ID, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Types</option>
            <option value="Individual">Individual</option>
            <option value="Company">Company</option>
            <option value="Contractor">Contractor</option>
            <option value="Builder">Builder</option>
            <option value="Government">Government</option>
            <option value="Other">Other</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Under Review">Under Review</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Customer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((cust) => (
          <div
            key={cust.id}
            className="p-4 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl transition space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-mono text-xs font-bold text-emerald-400">{cust.id}</span>
                  <span className="ml-2 text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                    {cust.customerType}
                  </span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                  {cust.status}
                </span>
              </div>

              <h3 className="text-sm font-bold text-white mt-1.5 leading-snug">{cust.name}</h3>
              <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                <Building className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>{cust.companyName}</span>
              </div>

              <div className="mt-3 space-y-1 text-xs text-slate-400 border-t border-slate-800/80 pt-2.5">
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="text-slate-300 font-mono">{cust.phone}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="truncate">{cust.email}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="truncate">
                    {cust.district}, {cust.state}
                  </span>
                </div>
              </div>

              <div className="mt-3 p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/60 grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <div className="text-slate-500">Credit Limit</div>
                  <div className="text-slate-200 font-mono font-bold">
                    ₹{(cust.creditLimit / 100000).toFixed(1)} L
                  </div>
                </div>
                <div>
                  <div className="text-slate-500">Outstanding</div>
                  <div
                    className={`font-mono font-bold ${
                      cust.outstandingBalance > 0 ? 'text-amber-400' : 'text-emerald-400'
                    }`}
                  >
                    ₹{(cust.outstandingBalance / 100000).toFixed(2)} L
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Toolbar */}
            <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-1.5 text-xs">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setSelectedCustomer(cust)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition flex items-center gap-1 cursor-pointer"
                  title="View Customer Profile"
                >
                  <Eye className="w-3 h-3 text-slate-400" />
                  <span>View</span>
                </button>

                <button
                  onClick={() => setStatementCustomer(cust)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition flex items-center gap-1 cursor-pointer"
                  title="View Statement of Account"
                >
                  <Receipt className="w-3 h-3 text-cyan-400" />
                  <span>Statement</span>
                </button>

                <button
                  onClick={() => onOpenChat(cust.name)}
                  className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold transition cursor-pointer"
                  title="Open Customer Chat in RZ Chat"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => onNewRequirement(cust)}
                  className="px-2 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-semibold transition border border-emerald-500/20 cursor-pointer"
                  title="+ New Requirement"
                >
                  + Req
                </button>
                <button
                  onClick={() => onNewQuotation(cust)}
                  className="px-2 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-semibold transition border border-amber-500/20 cursor-pointer"
                  title="+ New Quotation"
                >
                  + Quote
                </button>
                <button
                  onClick={() => onNewJob(cust)}
                  className="px-2 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 font-semibold transition border border-purple-500/20 cursor-pointer"
                  title="+ New Job"
                >
                  + Job
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* VIEW CUSTOMER MODAL / PROFILE */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-emerald-400">
                      {selectedCustomer.id}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {selectedCustomer.customerType}
                    </span>
                  </div>
                  <h3 className="text-base font-black text-white">{selectedCustomer.name}</h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedCustomer(null)}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-slate-950/60 rounded-2xl border border-slate-800/80 space-y-2">
                <h4 className="font-bold text-white uppercase font-mono text-[10px] tracking-wider text-slate-400">
                  Company & Registration
                </h4>
                <div>
                  <span className="text-slate-500">Company:</span>{' '}
                  <span className="text-slate-200 font-semibold">{selectedCustomer.companyName}</span>
                </div>
                <div>
                  <span className="text-slate-500">GST / Tax Reg:</span>{' '}
                  <span className="text-slate-200 font-mono">{selectedCustomer.gstRegistration}</span>
                </div>
                <div>
                  <span className="text-slate-500">Contact Person:</span>{' '}
                  <span className="text-slate-200">{selectedCustomer.contactPerson}</span>
                </div>
                <div>
                  <span className="text-slate-500">Phone:</span>{' '}
                  <span className="text-emerald-400 font-mono font-semibold">{selectedCustomer.phone}</span>
                </div>
                <div>
                  <span className="text-slate-500">Email:</span>{' '}
                  <span className="text-slate-300">{selectedCustomer.email}</span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-950/60 rounded-2xl border border-slate-800/80 space-y-2">
                <h4 className="font-bold text-white uppercase font-mono text-[10px] tracking-wider text-slate-400">
                  Address & Terms
                </h4>
                <div>
                  <span className="text-slate-500">Address:</span>{' '}
                  <span className="text-slate-200">{selectedCustomer.address}</span>
                </div>
                <div>
                  <span className="text-slate-500">District / State:</span>{' '}
                  <span className="text-slate-200">
                    {selectedCustomer.district}, {selectedCustomer.state}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Payment Terms:</span>{' '}
                  <span className="text-slate-200 font-medium">{selectedCustomer.paymentTerms}</span>
                </div>
                <div>
                  <span className="text-slate-500">Credit Limit:</span>{' '}
                  <span className="text-white font-mono font-bold">
                    ₹{(selectedCustomer.creditLimit / 100000).toFixed(2)} Lakhs
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Status:</span>{' '}
                  <span className="text-emerald-400 font-bold">{selectedCustomer.status}</span>
                </div>
              </div>
            </div>

            {/* Financial Ledger Mini-summary */}
            <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-white">Commercial Account Summary</h4>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-2.5 bg-slate-900 rounded-xl">
                  <div className="text-[10px] text-slate-400">Total Billed</div>
                  <div className="text-sm font-black text-white font-mono mt-0.5">
                    ₹{(selectedCustomer.totalBilled / 100000).toFixed(2)} L
                  </div>
                </div>
                <div className="p-2.5 bg-slate-900 rounded-xl">
                  <div className="text-[10px] text-slate-400">Total Paid</div>
                  <div className="text-sm font-black text-emerald-400 font-mono mt-0.5">
                    ₹{(selectedCustomer.totalPaid / 100000).toFixed(2)} L
                  </div>
                </div>
                <div className="p-2.5 bg-slate-900 rounded-xl">
                  <div className="text-[10px] text-slate-400">Current Outstanding</div>
                  <div className="text-sm font-black text-amber-400 font-mono mt-0.5">
                    ₹{(selectedCustomer.outstandingBalance / 100000).toFixed(2)} L
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  const cust = selectedCustomer;
                  setSelectedCustomer(null);
                  setStatementCustomer(cust);
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <Receipt className="w-3.5 h-3.5 text-cyan-400" />
                <span>Open Statement</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const cust = selectedCustomer;
                    setSelectedCustomer(null);
                    onNewRequirement(cust);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition cursor-pointer"
                >
                  Create Requirement
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STATEMENT OF ACCOUNT MODAL */}
      {statementCustomer && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-cyan-400 font-bold">
                  Official Statement of Account
                </span>
                <h3 className="text-base font-black text-white">{statementCustomer.name}</h3>
                <div className="text-xs text-slate-400 font-mono">
                  Account ID: {statementCustomer.id} &bull; GST: {statementCustomer.gstRegistration}
                </div>
              </div>

              <button
                onClick={() => setStatementCustomer(null)}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Statement Table */}
            <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-900 border-b border-slate-800 text-[10px] uppercase font-mono text-slate-400">
                  <tr>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Voucher Ref</th>
                    <th className="py-2.5 px-3">Description</th>
                    <th className="py-2.5 px-3 text-right">Debit (₹)</th>
                    <th className="py-2.5 px-3 text-right">Credit (₹)</th>
                    <th className="py-2.5 px-3 text-right">Balance (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                  <tr>
                    <td className="py-2 px-3 text-slate-400">2026-09-01</td>
                    <td className="py-2 px-3 text-emerald-400">OB-SEP26</td>
                    <td className="py-2 px-3 font-sans text-slate-300">Opening Balance</td>
                    <td className="py-2 px-3 text-right text-slate-400">-</td>
                    <td className="py-2 px-3 text-right text-slate-400">-</td>
                    <td className="py-2 px-3 text-right text-white">0.00</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-slate-400">2026-09-18</td>
                    <td className="py-2 px-3 text-cyan-400">INV-088</td>
                    <td className="py-2 px-3 font-sans text-slate-300">Milestone 1 RA Bill</td>
                    <td className="py-2 px-3 text-right text-rose-400 font-semibold">7,93,800.00</td>
                    <td className="py-2 px-3 text-right text-slate-400">-</td>
                    <td className="py-2 px-3 text-right text-rose-300">7,93,800.00 Dr</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-slate-400">2026-09-19</td>
                    <td className="py-2 px-3 text-emerald-400">RCPT-403</td>
                    <td className="py-2 px-3 font-sans text-slate-300">NEFT RTGS Release</td>
                    <td className="py-2 px-3 text-right text-slate-400">-</td>
                    <td className="py-2 px-3 text-right text-emerald-400 font-semibold">7,93,800.00</td>
                    <td className="py-2 px-3 text-right text-emerald-300">0.00</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-slate-400">2026-09-21</td>
                    <td className="py-2 px-3 text-cyan-400">INV-092</td>
                    <td className="py-2 px-3 font-sans text-slate-300">Running Bill #2</td>
                    <td className="py-2 px-3 text-right text-rose-400 font-semibold">6,74,100.00</td>
                    <td className="py-2 px-3 text-right text-slate-400">-</td>
                    <td className="py-2 px-3 text-right text-rose-300">6,74,100.00 Dr</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-slate-400">2026-09-22</td>
                    <td className="py-2 px-3 text-emerald-400">RCPT-401</td>
                    <td className="py-2 px-3 font-sans text-slate-300">Part Payment Received</td>
                    <td className="py-2 px-3 text-right text-slate-400">-</td>
                    <td className="py-2 px-3 text-right text-emerald-400 font-semibold">3,74,100.00</td>
                    <td className="py-2 px-3 text-right text-amber-400 font-bold">3,00,000.00 Dr</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Closing Outstanding Balance:</span>
              <span className="font-mono text-base font-black text-amber-400">
                ₹{statementCustomer.outstandingBalance.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => showToast('Statement PDF exported to download tray')}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export PDF</span>
              </button>
              <button
                onClick={() => showToast('Printing Statement...')}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Statement</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE NEW CUSTOMER MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                <span>Add New Customer / Client Account</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Customer / Entity Name *</label>
                  <input
                    type="text"
                    required
                    value={newCust.name}
                    onChange={(e) => setNewCust({ ...newCust, name: e.target.value })}
                    placeholder="e.g. Prestige Estates Ltd"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Company / Trade Name</label>
                  <input
                    type="text"
                    value={newCust.companyName}
                    onChange={(e) => setNewCust({ ...newCust, companyName: e.target.value })}
                    placeholder="e.g. Prestige Group South"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Customer Type</label>
                  <select
                    value={newCust.customerType}
                    onChange={(e) => setNewCust({ ...newCust, customerType: e.target.value as CustomerType })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Individual">Individual</option>
                    <option value="Company">Company</option>
                    <option value="Contractor">Contractor</option>
                    <option value="Builder">Builder</option>
                    <option value="Government">Government</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={newCust.phone}
                    onChange={(e) => setNewCust({ ...newCust, phone: e.target.value })}
                    placeholder="+91 98450 XXXXX"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Email Address</label>
                  <input
                    type="email"
                    value={newCust.email}
                    onChange={(e) => setNewCust({ ...newCust, email: e.target.value })}
                    placeholder="procurement@prestige.in"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">GST / Tax Registration</label>
                  <input
                    type="text"
                    value={newCust.gstRegistration}
                    onChange={(e) => setNewCust({ ...newCust, gstRegistration: e.target.value })}
                    placeholder="29AAAAA0000A1Z5"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Contact Person</label>
                  <input
                    type="text"
                    value={newCust.contactPerson}
                    onChange={(e) => setNewCust({ ...newCust, contactPerson: e.target.value })}
                    placeholder="e.g. Ramesh Hegde (GM)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Credit Limit (₹)</label>
                  <input
                    type="number"
                    value={newCust.creditLimit}
                    onChange={(e) => setNewCust({ ...newCust, creditLimit: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">District</label>
                  <input
                    type="text"
                    value={newCust.district}
                    onChange={(e) => setNewCust({ ...newCust, district: e.target.value })}
                    placeholder="e.g. Dakshina Kannada"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">State</label>
                  <select
                    value={newCust.state}
                    onChange={(e) => setNewCust({ ...newCust, state: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Karnataka">Karnataka</option>
                    <option value="Kerala">Kerala</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Goa">Goa</option>
                    <option value="Maharashtra">Maharashtra</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Office / Site Address</label>
                <textarea
                  rows={2}
                  value={newCust.address}
                  onChange={(e) => setNewCust({ ...newCust, address: e.target.value })}
                  placeholder="Street address, building number, landmark..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition cursor-pointer shadow-lg shadow-emerald-500/20"
                >
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
