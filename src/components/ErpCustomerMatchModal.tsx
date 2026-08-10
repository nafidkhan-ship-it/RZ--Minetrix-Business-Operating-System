import React, { useState, useEffect } from 'react';
import {
  X, Search, UserCheck, UserPlus, Link2, Building2, AlertCircle,
  Phone, Mail, MapPin, ShieldCheck, Check
} from 'lucide-react';
import { ErpCustomerMaster, CustomerEnquiry } from '../types/rzChatTypes';
import { rzChatService } from '../services/rzChatService';

interface ErpCustomerMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  enquiryId: string;
  currentUserId: string;
  onMatched?: () => void;
}

export const ErpCustomerMatchModal: React.FC<ErpCustomerMatchModalProps> = ({
  isOpen,
  onClose,
  enquiryId,
  currentUserId,
  onMatched
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [enquiry, setEnquiry] = useState<CustomerEnquiry | null>(null);
  const [customers, setCustomers] = useState<ErpCustomerMaster[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const loadData = () => {
    const enq = rzChatService.getEnquiryById(enquiryId);
    if (enq) {
      setEnquiry(enq);
      const link = rzChatService.getBusinessErpLink(enq.businessId);
      const orgId = link?.organizationId || 'ORG-101';
      const results = rzChatService.searchErpCustomers(orgId, searchQuery);
      setCustomers(results);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen, enquiryId, searchQuery]);

  if (!isOpen || !enquiry) return null;

  const handleLinkCustomer = (erpCustomerId: string) => {
    try {
      setIsSubmitting(true);
      setError('');
      rzChatService.matchChatUserToErpCustomer(currentUserId, enquiryId, erpCustomerId);
      setIsSubmitting(false);
      if (onMatched) onMatched();
      onClose();
    } catch (err: any) {
      setIsSubmitting(false);
      setError(err.message || 'Failed to match ERP Customer');
    }
  };

  const handleCreateNewCustomer = () => {
    try {
      setIsSubmitting(true);
      setError('');
      rzChatService.createErpCustomerFromChatUser(currentUserId, enquiryId);
      setIsSubmitting(false);
      if (onMatched) onMatched();
      onClose();
    } catch (err: any) {
      setIsSubmitting(false);
      setError(err.message || 'Failed to create new ERP Customer');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
              <Link2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Match ERP Customer Master</h3>
              <p className="text-xs text-slate-400">
                Enquiry #{enquiry.enquiryCode} • {enquiry.customerDisplayName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs text-slate-300">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search ERP Customers by Name, Phone (+91...), or Email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
            />
          </div>

          {/* Fallback Option: Create New */}
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
            <div>
              <h5 className="font-bold text-white">No existing account found?</h5>
              <p className="text-[11px] text-slate-400">
                Auto-generate a new ERP Customer Master entry using {enquiry.customerDisplayName}'s details.
              </p>
            </div>
            <button
              type="button"
              onClick={handleCreateNewCustomer}
              disabled={isSubmitting}
              className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 shrink-0 transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5" /> Create New
            </button>
          </div>

          {/* Customer Search Results */}
          <div className="space-y-2 pt-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Matching ERP Customer Accounts ({customers.length})
            </span>

            {customers.length === 0 ? (
              <div className="p-6 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl">
                No matching ERP customer accounts found. Click "Create New" above to register this chat user in ERP.
              </div>
            ) : (
              customers.map((cust) => (
                <div
                  key={cust.id}
                  className="p-3.5 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl flex items-center justify-between transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h5 className="font-bold text-white text-sm">{cust.customerName}</h5>
                      <span className="px-2 py-0.5 bg-slate-800 border border-slate-700 text-amber-400 font-mono text-[10px] rounded-md">
                        {cust.id}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-500" /> {cust.phone}
                      </span>
                      {cust.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-500" /> {cust.email}
                        </span>
                      )}
                      {cust.taxNumber && (
                        <span className="text-slate-500 font-mono">GST: {cust.taxNumber}</span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={isSubmitting || enquiry.erpCustomerId === cust.id}
                    onClick={() => handleLinkCustomer(cust.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      enquiry.erpCustomerId === cust.id
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default'
                        : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                    }`}
                  >
                    {enquiry.erpCustomerId === cust.id ? 'Linked' : 'Link Account'}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
