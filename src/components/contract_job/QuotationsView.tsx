import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Search,
  Plus,
  Filter,
  Eye,
  Copy,
  Send,
  Printer,
  Download,
  FileSignature,
  Briefcase,
  CheckCircle2,
  Calendar,
  DollarSign,
  X,
  Trash2,
  Share2
} from 'lucide-react';
import {
  Quotation,
  QuotationLineItem,
  QuotationStatus,
  SAMPLE_QUOTATIONS,
  SAMPLE_CUSTOMERS
} from '../../data/contractJobStudioData';

interface QuotationsViewProps {
  onConvertToAgreement: (quote: Quotation) => void;
  onConvertToJob: (quote: Quotation) => void;
  onOpenChat: (customerName: string) => void;
}

export const QuotationsView: React.FC<QuotationsViewProps> = ({
  onConvertToAgreement,
  onConvertToJob,
  onOpenChat
}) => {
  const [quotations, setQuotations] = useState<Quotation[]>(SAMPLE_QUOTATIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedQuotationForPreview, setSelectedQuotationForPreview] = useState<Quotation | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // New Quotation form state
  const [newQuoteCust, setNewQuoteCust] = useState(SAMPLE_CUSTOMERS[0]?.id || '');
  const [validUntil, setValidUntil] = useState('2026-10-31');
  const [paymentTerms, setPaymentTerms] = useState('15% Advance, Monthly RA Bills');
  const [deliveryTerms, setDeliveryTerms] = useState('Delivered at Client Site Yard');
  const [quoteNotes, setQuoteNotes] = useState('Rates fixed for 60 days. Weighment at computerized weighbridge.');
  const [lineItems, setLineItems] = useState<QuotationLineItem[]>([
    {
      id: '1',
      description: '40mm Granular Sub-base Machine Crushed Aggregate',
      quantity: 5000,
      unit: 'MT',
      rate: 150,
      discountPercent: 0,
      taxPercent: 5,
      totalAmount: 787500
    },
    {
      id: '2',
      description: 'VSI Manufactured Concrete Sand (Zone-II)',
      quantity: 3000,
      unit: 'MT',
      rate: 260,
      discountPercent: 0,
      taxPercent: 5,
      totalAmount: 819000
    }
  ]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleDuplicate = (quote: Quotation) => {
    const duplicated: Quotation = {
      ...quote,
      quotationNumber: `QT-2026-0${40 + quotations.length + 1}`,
      date: '2026-09-23',
      status: 'Draft',
      notes: `Duplicated from ${quote.quotationNumber}`
    };
    setQuotations([duplicated, ...quotations]);
    showToast(`Duplicated quotation as ${duplicated.quotationNumber}`);
  };

  const handleSend = (quote: Quotation) => {
    setQuotations(
      quotations.map((q) =>
        q.quotationNumber === quote.quotationNumber ? { ...q, status: 'Sent' } : q
      )
    );
    showToast(`Quotation ${quote.quotationNumber} sent to client email & RZ Chat`);
  };

  const handleAddLineItem = () => {
    const newItem: QuotationLineItem = {
      id: String(Date.now()),
      description: 'Granite Metal / Screening Material',
      quantity: 1000,
      unit: 'MT',
      rate: 200,
      discountPercent: 0,
      taxPercent: 5,
      totalAmount: 210000
    };
    setLineItems([...lineItems, newItem]);
  };

  const handleRemoveLineItem = (id: string) => {
    setLineItems(lineItems.filter((i) => i.id !== id));
  };

  const handleItemChange = (
    id: string,
    field: keyof QuotationLineItem,
    value: any
  ) => {
    setLineItems(
      lineItems.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: value };
        const qty = Number(updated.quantity) || 0;
        const rate = Number(updated.rate) || 0;
        const disc = Number(updated.discountPercent) || 0;
        const tax = Number(updated.taxPercent) || 0;

        const base = qty * rate;
        const discountAmount = base * (disc / 100);
        const taxable = base - discountAmount;
        const taxAmount = taxable * (tax / 100);
        updated.totalAmount = Math.round(taxable + taxAmount);
        return updated;
      })
    );
  };

  const calculateSubtotal = () =>
    lineItems.reduce((acc, curr) => acc + (curr.quantity * curr.rate), 0);

  const calculateDiscountTotal = () =>
    lineItems.reduce(
      (acc, curr) => acc + (curr.quantity * curr.rate * (curr.discountPercent / 100)),
      0
    );

  const calculateTaxTotal = () =>
    lineItems.reduce((acc, curr) => {
      const base = curr.quantity * curr.rate;
      const disc = base * (curr.discountPercent / 100);
      return acc + ((base - disc) * (curr.taxPercent / 100));
    }, 0);

  const calculateGrandTotal = () =>
    lineItems.reduce((acc, curr) => acc + curr.totalAmount, 0);

  const handleCreateQuotation = (e: React.FormEvent) => {
    e.preventDefault();
    const cust = SAMPLE_CUSTOMERS.find((c) => c.id === newQuoteCust) || SAMPLE_CUSTOMERS[0];
    const created: Quotation = {
      quotationNumber: `QT-2026-0${40 + quotations.length + 1}`,
      date: '2026-09-23',
      customerId: cust.id,
      customerName: cust.name,
      requirementId: 'REQ-2026-001',
      validUntil,
      items: lineItems,
      subtotal: calculateSubtotal(),
      discountTotal: calculateDiscountTotal(),
      taxTotal: calculateTaxTotal(),
      grandTotal: calculateGrandTotal(),
      paymentTerms,
      deliveryTerms,
      notes: quoteNotes,
      status: 'Draft',
      preparedBy: 'Er. Anand Kumar'
    };

    setQuotations([created, ...quotations]);
    setIsAddModalOpen(false);
    showToast(`Quotation ${created.quotationNumber} saved as Draft`);
  };

  const filteredQuotations = quotations.filter((q) => {
    const matchesSearch =
      q.quotationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.notes.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || q.status === statusFilter;

    return matchesSearch && matchesStatus;
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
              Commercial Bids & Proposals
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
              {filteredQuotations.length} Bids
            </span>
          </div>
          <h2 className="text-xl font-black text-white mt-0.5">Quotation Management</h2>
          <p className="text-xs text-slate-400">
            Generate itemized proposals with taxes, discounts, delivery terms, and 1-click conversion to Contract Agreements.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ New Quotation</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search quotations by number, client, terms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="Draft">Draft</option>
            <option value="Sent">Sent</option>
            <option value="Viewed">Viewed</option>
            <option value="Negotiation">Negotiation</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
            <option value="Converted">Converted</option>
          </select>
        </div>
      </div>

      {/* Quotations List Cards */}
      <div className="space-y-4">
        {filteredQuotations.map((quote) => (
          <div
            key={quote.quotationNumber}
            className="p-5 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl transition space-y-4"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-black text-emerald-400">
                    {quote.quotationNumber}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                    Ref: {quote.requirementId}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      quote.status === 'Accepted' || quote.status === 'Converted'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : quote.status === 'Sent'
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                        : quote.status === 'Negotiation'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : quote.status === 'Rejected'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {quote.status}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mt-1">{quote.customerName}</h3>
                <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                  <span>Dated: {quote.date}</span>
                  <span>&bull;</span>
                  <span>Valid Until: {quote.validUntil}</span>
                  <span>&bull;</span>
                  <span>By: {quote.preparedBy}</span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs text-slate-500">Quotation Grand Total</div>
                <div className="text-2xl font-black text-white font-mono mt-0.5">
                  ₹{quote.grandTotal.toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-emerald-400 font-semibold">
                  (Incl. Tax ₹{quote.taxTotal.toLocaleString('en-IN')})
                </div>
              </div>
            </div>

            {/* Line Items Preview Table */}
            <div className="bg-slate-950/70 rounded-2xl border border-slate-800/80 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 border-b border-slate-800 text-[10px] uppercase font-mono text-slate-400">
                  <tr>
                    <th className="py-2.5 px-3">Item / Service</th>
                    <th className="py-2.5 px-3 text-right">Quantity</th>
                    <th className="py-2.5 px-3 text-right">Unit Rate (₹)</th>
                    <th className="py-2.5 px-3 text-right">Disc.</th>
                    <th className="py-2.5 px-3 text-right">Tax</th>
                    <th className="py-2.5 px-3 text-right">Total (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                  {quote.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/40">
                      <td className="py-2 px-3 font-sans text-slate-200">{item.description}</td>
                      <td className="py-2 px-3 text-right text-slate-300">
                        {item.quantity.toLocaleString()} {item.unit}
                      </td>
                      <td className="py-2 px-3 text-right text-slate-300">₹{item.rate}</td>
                      <td className="py-2 px-3 text-right text-slate-400">{item.discountPercent}%</td>
                      <td className="py-2 px-3 text-right text-slate-400">{item.taxPercent}%</td>
                      <td className="py-2 px-3 text-right font-bold text-emerald-400">
                        ₹{item.totalAmount.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Commercial terms footer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-400 p-3 bg-slate-950/40 rounded-xl border border-slate-800/60">
              <div>
                <strong className="text-slate-300">Payment Terms:</strong> {quote.paymentTerms}
              </div>
              <div>
                <strong className="text-slate-300">Delivery Terms:</strong> {quote.deliveryTerms}
              </div>
            </div>

            {/* Action Buttons (All 9 actions required) */}
            <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  onClick={() => setSelectedQuotationForPreview(quote)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition flex items-center gap-1 cursor-pointer"
                  title="Preview Official PDF / Print"
                >
                  <Eye className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Preview</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedQuotationForPreview(quote);
                    setTimeout(() => window.print(), 300);
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition flex items-center gap-1 cursor-pointer"
                  title="Print Quotation"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>

                <button
                  onClick={() => showToast(`Downloaded PDF for ${quote.quotationNumber}`)}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition flex items-center gap-1 cursor-pointer"
                  title="Download PDF"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>PDF</span>
                </button>

                <button
                  onClick={() => handleDuplicate(quote)}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition flex items-center gap-1 cursor-pointer"
                  title="Duplicate Quotation"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Duplicate</span>
                </button>

                <button
                  onClick={() => handleSend(quote)}
                  className="px-2.5 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-semibold transition border border-cyan-500/20 flex items-center gap-1 cursor-pointer"
                  title="Send to Customer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>

                <button
                  onClick={() => onOpenChat(quote.customerName)}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition flex items-center gap-1 cursor-pointer"
                  title="Chat with Customer"
                >
                  <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Chat</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onConvertToAgreement(quote)}
                  className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold transition border border-cyan-500/30 flex items-center gap-1.5 cursor-pointer shadow-sm"
                  title="Convert to Legal Contract Agreement"
                >
                  <FileSignature className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Convert to Agreement</span>
                </button>

                <button
                  onClick={() => onConvertToJob(quote)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/20"
                  title="Convert to Active Job Order"
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Convert to Job</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* OFFICIAL PRINTABLE QUOTATION PREVIEW MODAL */}
      {selectedQuotationForPreview && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 w-full max-w-3xl max-h-[92vh] overflow-y-auto space-y-6 shadow-2xl">
            {/* Header / Actions toolbar */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <span className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Official Quotation Document Preview
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => showToast('Printing Document...')}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
                <button
                  onClick={() => showToast('PDF Exported')}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
                <button
                  onClick={() => setSelectedQuotationForPreview(null)}
                  className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Document Content (White/light styling simulation inside dark theme container) */}
            <div className="bg-white text-slate-900 rounded-2xl p-6 sm:p-8 space-y-6 shadow-inner">
              {/* Company Letterhead */}
              <div className="flex items-start justify-between border-b border-slate-200 pb-5">
                <div>
                  <div className="font-mono text-xs font-black text-emerald-700 tracking-wider">
                    RZ® MINETRIX MINING & QUARRY OPERATIONS
                  </div>
                  <h1 className="text-xl font-black text-slate-900 mt-0.5">FORMAL PRICE QUOTATION</h1>
                  <div className="text-xs text-slate-500 mt-1">
                    GSTIN: 29AAACR9982L1Z4 &bull; Mining Concession & Crusher Operations
                  </div>
                  <div className="text-xs text-slate-500">
                    Industrial Estate, Baikampady, Mangalore, Karnataka 575011
                  </div>
                </div>

                <div className="text-right text-xs">
                  <div className="font-mono text-sm font-black text-slate-900">
                    {selectedQuotationForPreview.quotationNumber}
                  </div>
                  <div className="text-slate-600 mt-0.5">Date: {selectedQuotationForPreview.date}</div>
                  <div className="text-slate-600 font-semibold">
                    Valid Until: {selectedQuotationForPreview.validUntil}
                  </div>
                </div>
              </div>

              {/* Client Info */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="font-mono text-[10px] text-slate-500 uppercase font-bold">
                    Quotation Prepared For:
                  </div>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">
                    {selectedQuotationForPreview.customerName}
                  </div>
                  <div className="text-slate-600">Customer ID: {selectedQuotationForPreview.customerId}</div>
                  <div className="text-slate-600">Requirement Ref: {selectedQuotationForPreview.requirementId}</div>
                </div>
                <div>
                  <div className="font-mono text-[10px] text-slate-500 uppercase font-bold">
                    Delivery Specifications:
                  </div>
                  <div className="text-slate-700 font-semibold mt-0.5">
                    {selectedQuotationForPreview.deliveryTerms}
                  </div>
                  <div className="text-slate-600 mt-1">
                    Payment Terms: {selectedQuotationForPreview.paymentTerms}
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full text-left text-xs border border-slate-200">
                <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-2.5">#</th>
                    <th className="p-2.5">Scope Description</th>
                    <th className="p-2.5 text-right">Qty</th>
                    <th className="p-2.5 text-right">Unit Rate</th>
                    <th className="p-2.5 text-right">Disc.</th>
                    <th className="p-2.5 text-right">GST</th>
                    <th className="p-2.5 text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {selectedQuotationForPreview.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="p-2.5 font-mono text-slate-500">{idx + 1}</td>
                      <td className="p-2.5 font-medium text-slate-900">{item.description}</td>
                      <td className="p-2.5 text-right font-mono">
                        {item.quantity.toLocaleString()} {item.unit}
                      </td>
                      <td className="p-2.5 text-right font-mono">₹{item.rate}</td>
                      <td className="p-2.5 text-right font-mono">{item.discountPercent}%</td>
                      <td className="p-2.5 text-right font-mono">{item.taxPercent}%</td>
                      <td className="p-2.5 text-right font-mono font-bold text-slate-900">
                        ₹{item.totalAmount.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Total Calculation Summary */}
              <div className="flex justify-end">
                <div className="w-64 space-y-1.5 text-xs text-slate-700">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-mono font-semibold">
                      ₹{selectedQuotationForPreview.subtotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Total Discount:</span>
                    <span className="font-mono">
                      -₹{selectedQuotationForPreview.discountTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Taxes (GST):</span>
                    <span className="font-mono">
                      +₹{selectedQuotationForPreview.taxTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-slate-300 pt-1.5 font-bold text-sm text-slate-900">
                    <span>Grand Total:</span>
                    <span className="font-mono font-black text-emerald-700">
                      ₹{selectedQuotationForPreview.grandTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Notes and Signatures */}
              <div className="border-t border-slate-200 pt-4 grid grid-cols-2 gap-6 text-xs text-slate-600">
                <div>
                  <div className="font-bold text-slate-900">Terms & Conditions:</div>
                  <p className="mt-1 leading-relaxed text-slate-500">
                    {selectedQuotationForPreview.notes}
                  </p>
                </div>
                <div className="text-right flex flex-col justify-between">
                  <div className="text-slate-400">Authorized Signatory</div>
                  <div className="mt-8 font-bold text-slate-900">
                    {selectedQuotationForPreview.preparedBy}
                    <div className="text-[11px] font-normal text-slate-500">
                      RZ® Minetrix Commercial Division
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Bottom Converter triggers */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  const q = selectedQuotationForPreview;
                  setSelectedQuotationForPreview(null);
                  onConvertToAgreement(q);
                }}
                className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold text-xs transition border border-cyan-500/30 cursor-pointer"
              >
                Proceed to Agreement
              </button>
              <button
                onClick={() => {
                  const q = selectedQuotationForPreview;
                  setSelectedQuotationForPreview(null);
                  onConvertToJob(q);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition cursor-pointer"
              >
                Direct Convert to Job
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE NEW QUOTATION MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <span>Create Commercial Quotation</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateQuotation} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Customer / Client *</label>
                  <select
                    value={newQuoteCust}
                    onChange={(e) => setNewQuoteCust(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    {SAMPLE_CUSTOMERS.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.companyName})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Valid Until Date</label>
                  <input
                    type="date"
                    value={validUntil}
                    onChange={(e) => setValidUntil(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Dynamic Line items */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white uppercase text-[10px] tracking-wider font-mono">
                    Items & Material Rates
                  </span>
                  <button
                    type="button"
                    onClick={handleAddLineItem}
                    className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-bold text-[11px] border border-emerald-500/20 cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {lineItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-slate-950 rounded-2xl border border-slate-800 grid grid-cols-1 sm:grid-cols-12 gap-2 items-center text-xs"
                    >
                      <div className="sm:col-span-4">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                          placeholder="Description..."
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(item.id, 'quantity', Number(e.target.value))}
                          placeholder="Qty"
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white font-mono text-right"
                        />
                      </div>
                      <div className="sm:col-span-1">
                        <input
                          type="text"
                          value={item.unit}
                          onChange={(e) => handleItemChange(item.id, 'unit', e.target.value)}
                          placeholder="Unit"
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-1.5 py-1.5 text-white text-center font-mono"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <input
                          type="number"
                          value={item.rate}
                          onChange={(e) => handleItemChange(item.id, 'rate', Number(e.target.value))}
                          placeholder="Rate"
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-white font-mono text-right"
                        />
                      </div>
                      <div className="sm:col-span-2 text-right font-mono font-bold text-emerald-400">
                        ₹{item.totalAmount.toLocaleString('en-IN')}
                      </div>
                      <div className="sm:col-span-1 text-right">
                        <button
                          type="button"
                          onClick={() => handleRemoveLineItem(item.id)}
                          className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Summary Strip */}
              <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 flex items-center justify-between font-mono">
                <span className="text-slate-400 text-xs">Calculated Grand Total:</span>
                <span className="text-lg font-black text-emerald-400">
                  ₹{calculateGrandTotal().toLocaleString('en-IN')}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Payment Terms</label>
                  <input
                    type="text"
                    value={paymentTerms}
                    onChange={(e) => setPaymentTerms(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Delivery Terms</label>
                  <input
                    type="text"
                    value={deliveryTerms}
                    onChange={(e) => setDeliveryTerms(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Notes & Specifications</label>
                <textarea
                  rows={2}
                  value={quoteNotes}
                  onChange={(e) => setQuoteNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
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
                  Save Quotation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
