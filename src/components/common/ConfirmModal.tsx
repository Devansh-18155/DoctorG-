import React from 'react';
import { useApp } from '../../context/AppContext';
import { AlertCircle, HelpCircle } from 'lucide-react';

export const ConfirmModal: React.FC = () => {
  const { confirmDialog, closeConfirmDialog } = useApp();

  if (!confirmDialog) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-100 animate-in zoom-in-95">
        <div className="flex items-center gap-3 mb-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              confirmDialog.isDestructive
                ? 'bg-rose-100 text-rose-600'
                : 'bg-teal-100 text-teal-700'
            }`}
          >
            {confirmDialog.isDestructive ? (
              <AlertCircle className="w-5 h-5" />
            ) : (
              <HelpCircle className="w-5 h-5" />
            )}
          </div>
          <h3 className="font-bold text-base text-[#172B4D]">{confirmDialog.title}</h3>
        </div>

        <p className="text-xs text-slate-600 mb-5 leading-relaxed">
          {confirmDialog.message}
        </p>

        <div className="flex items-center justify-end gap-2.5">
          <button
            onClick={() => {
              if (confirmDialog.onCancel) confirmDialog.onCancel();
              closeConfirmDialog();
            }}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            {confirmDialog.cancelLabel || 'Cancel'}
          </button>
          <button
            onClick={() => {
              confirmDialog.onConfirm();
              closeConfirmDialog();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-sm transition-all ${
              confirmDialog.isDestructive
                ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/30'
                : 'bg-[#087E8B] hover:bg-[#06626D] shadow-teal-600/30'
            }`}
          >
            {confirmDialog.confirmLabel || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};
