import React, { useState } from 'react';
import {
  X,
  Flag,
  ShieldAlert,
  AlertCircle,
  CheckCircle2,
  Lock,
  UserX
} from 'lucide-react';
import { ReportedEntityType, ReportReason } from '../types/rzChatTypes';
import { rzChatService } from '../services/rzChatService';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportedEntityType: ReportedEntityType;
  reportedEntityId: string;
  reportedUserId: string;
  conversationId?: string;
  messageId?: string;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  reportedEntityType,
  reportedEntityId,
  reportedUserId,
  conversationId,
  messageId
}) => {
  const [reason, setReason] = useState<ReportReason>('spam');
  const [description, setDescription] = useState('');
  const [alsoBlockUser, setAlsoBlockUser] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const reportedUser = rzChatService.getUserById(reportedUserId);
  const currentUser = rzChatService.getCurrentUser();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!description.trim()) {
      setErrorMsg('Please describe the reason for your report in detail.');
      return;
    }

    try {
      setIsSubmitting(true);
      rzChatService.submitReport(currentUser.id, {
        reportedEntityType,
        reportedEntityId,
        reportedUserId,
        conversationId,
        messageId,
        reason,
        description: description.trim()
      });

      if (alsoBlockUser) {
        rzChatService.blockUser(currentUser.id, reportedUserId);
      }

      setSuccessMsg('Report submitted to Platform Safety & Compliance. Thank you.');
      setTimeout(() => {
        setSuccessMsg(null);
        setDescription('');
        setIsSubmitting(false);
        onClose();
      }, 2000);
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMsg(err.message || 'Failed to submit report.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-red-50/30 dark:bg-red-950/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 flex items-center justify-center">
              <Flag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Submit Moderation Report
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Report {reportedEntityType.replace(/_/g, ' ')} #{reportedEntityId}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {successMsg ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Report Filed
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm mx-auto">
              {successMsg}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Identity Protection Callout */}
            <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-900/50 text-xs text-blue-900 dark:text-blue-300 flex items-start gap-2.5">
              <Lock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Masked Reporter Protection:</span> Your reporter identity is strictly protected and will remain anonymous to target user ({reportedUser?.displayName || reportedUserId}).
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 dark:bg-red-950/40 rounded-xl border border-red-200 dark:border-red-900/50 text-xs text-red-800 dark:text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {errorMsg}
              </div>
            )}

            {/* Target Display */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-800 text-xs">
              <span className="text-slate-400">Target User:</span>{' '}
              <span className="font-bold text-slate-900 dark:text-slate-100">
                {reportedUser?.displayName || reportedUserId}
              </span>{' '}
              <span className="text-slate-400">(@{reportedUser?.username})</span>
            </div>

            {/* Reason Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Violation Reason
              </label>
              <select
                value={reason}
                onChange={e => setReason(e.target.value as ReportReason)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="spam">Spam / Unsolicited Bulk Messaging</option>
                <option value="harassment">Harassment or Abuse</option>
                <option value="fraud">Fraud / Financial Scam</option>
                <option value="inappropriate_content">Inappropriate Content</option>
                <option value="impersonation">Impersonation or False Profile</option>
                <option value="policy_violation">Platform Policy Violation</option>
                <option value="other">Other Violation</option>
              </select>
            </div>

            {/* Description Textarea */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Report Explanation &amp; Context
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Provide detailed context regarding the issue..."
                rows={3}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
              />
            </div>

            {/* Block Option Toggle */}
            <div className="pt-2">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={alsoBlockUser}
                  onChange={e => setAlsoBlockUser(e.target.checked)}
                  className="rounded border-slate-300 text-red-600 focus:ring-red-500 w-4 h-4"
                />
                <UserX className="w-4 h-4 text-red-600" />
                Also block this user immediately
              </label>
            </div>

            {/* Actions */}
            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting Report...' : 'Submit Report'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
