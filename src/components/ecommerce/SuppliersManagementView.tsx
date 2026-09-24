import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  ShieldCheck,
  Star,
  Layers,
  Phone,
  Mail,
  MapPin,
  FileText,
  MessageSquare,
  DollarSign,
  Package,
  CheckCircle2
} from 'lucide-react';
import {
  Supplier,
  SupplierProductListing,
  COMMERCE_SUPPLIERS,
  COMMERCE_SUPPLIER_LISTINGS
} from '../../data/ecommerceStudioData';

interface SuppliersManagementViewProps {
  onChatWithSupplier: (supplierName: string, ref: string) => void;
  onViewSupplierProducts: (supplierId: string) => void;
}

export const SuppliersManagementView: React.FC<SuppliersManagementViewProps> = ({
  onChatWithSupplier,
  onViewSupplierProducts
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(COMMERCE_SUPPLIERS[0]);
  const [activeTab, setActiveTab] = useState<'DIRECTORY' | 'LISTINGS'>('DIRECTORY');

  const filteredSuppliers = COMMERCE_SUPPLIERS.filter((s) => {
    return (
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.gstNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
              PRODUCER & MILL NETWORK
            </span>
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Verified Concessions
            </span>
          </div>
          <h1 className="text-xl font-black text-white mt-1">Supplier Management ({COMMERCE_SUPPLIERS.length})</h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('DIRECTORY')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'DIRECTORY' ? 'bg-amber-500 text-slate-950 shadow' : 'bg-slate-800 text-slate-300'
            }`}
          >
            Directory
          </button>
          <button
            onClick={() => setActiveTab('LISTINGS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'LISTINGS' ? 'bg-amber-500 text-slate-950 shadow' : 'bg-slate-800 text-slate-300'
            }`}
          >
            Product Listings ({COMMERCE_SUPPLIER_LISTINGS.length})
          </button>
        </div>
      </div>

      {activeTab === 'DIRECTORY' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Supplier Directory List */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search suppliers by name, district, GST..."
                className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-3">
              {filteredSuppliers.map((sup) => {
                const isSelected = selectedSupplier?.id === sup.id;
                return (
                  <div
                    key={sup.id}
                    onClick={() => setSelectedSupplier(sup)}
                    className={`p-5 rounded-3xl border transition cursor-pointer space-y-3 ${
                      isSelected
                        ? 'bg-slate-900 border-amber-500/50 shadow-xl'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono font-bold text-amber-400">{sup.id}</span>
                        <h3 className="text-sm font-bold text-white">{sup.name}</h3>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        sup.status === 'Active'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                      }`}>
                        {sup.status}
                      </span>
                    </div>

                    <div className="text-xs text-slate-300">
                      <div>Legal Entity: <span className="text-white font-medium">{sup.businessName}</span></div>
                      <div>Contact: <span className="text-white">{sup.contactPerson}</span> ({sup.phone})</div>
                    </div>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {sup.productCategories.map((cat, i) => (
                        <span key={i} className="px-2 py-0.5 bg-slate-900 rounded text-[10px] text-slate-400 border border-slate-800">
                          {cat}
                        </span>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400">Capacity: <strong className="text-white">{sup.monthlyCapacity}</strong></span>
                      <span className="text-amber-300 font-bold">{sup.rating} ★</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Supplier Detailed Dossier */}
          {selectedSupplier && (
            <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5 self-start sticky top-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-amber-400 font-bold">{selectedSupplier.id}</span>
                  <h3 className="text-base font-black text-white mt-0.5">{selectedSupplier.name}</h3>
                </div>
                <button
                  onClick={() => onChatWithSupplier(selectedSupplier.name, 'Supplier Inquiry')}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                  <span>Chat</span>
                </button>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs">
                <div><span className="text-slate-500">Business:</span> <strong className="text-white">{selectedSupplier.businessName}</strong></div>
                <div><span className="text-slate-500">GSTIN:</span> <span className="text-white font-mono font-bold">{selectedSupplier.gstNumber}</span></div>
                <div><span className="text-slate-500">Address:</span> <span className="text-slate-300">{selectedSupplier.address}, {selectedSupplier.district}, {selectedSupplier.state}</span></div>
                <div><span className="text-slate-500">Email:</span> <span className="text-white font-mono">{selectedSupplier.email}</span></div>
                <div><span className="text-slate-500">Active Orders:</span> <span className="text-emerald-400 font-bold font-mono">{selectedSupplier.activeOrdersCount} Live Orders</span></div>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Gross Commerce Sales:</span>
                  <span className="text-white font-bold">₹{selectedSupplier.totalSalesRs.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Escrow Payable Due:</span>
                  <span className="text-amber-400 font-bold">₹{selectedSupplier.outstandingPayableRs.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => onViewSupplierProducts(selectedSupplier.id)}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition cursor-pointer shadow-md"
                >
                  View Product Catalogue & Listings
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* PRODUCT LISTINGS (Requirement #9) */
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
              Supplier Catalogued Material Rates
            </h3>
            <span className="text-xs text-slate-400 font-mono">Live Price Index</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px] bg-slate-950/80">
                  <th className="p-4">Listing Code</th>
                  <th className="p-4">Product & Category</th>
                  <th className="p-4">Supplier</th>
                  <th className="p-4">Price Type</th>
                  <th className="p-4">Base Rate</th>
                  <th className="p-4">Available Qty</th>
                  <th className="p-4">Dispatch Lead Time</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {COMMERCE_SUPPLIER_LISTINGS.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40">
                    <td className="p-4 font-mono font-bold text-amber-400">{item.id}</td>
                    <td className="p-4">
                      <div className="font-bold text-white">{item.productName}</div>
                      <div className="text-[11px] text-slate-400">{item.specifications}</div>
                    </td>
                    <td className="p-4 text-slate-300 font-medium">{item.supplierName}</td>
                    <td className="p-4">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                        {item.priceType}
                      </span>
                    </td>
                    <td className="p-4 font-mono font-black text-amber-400 text-sm">
                      ₹{item.baseRate} <span className="text-[10px] text-slate-400 font-normal">/ {item.unit}</span>
                    </td>
                    <td className="p-4 font-mono font-bold text-white">
                      {item.availableQuantity.toLocaleString()} {item.unit}s
                    </td>
                    <td className="p-4 text-slate-300 font-mono">{item.dispatchTime}</td>
                    <td className="p-4">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
