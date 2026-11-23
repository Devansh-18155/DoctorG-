import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronLeft, Download, CreditCard, CheckCircle2, XCircle, Clock, X } from 'lucide-react';
import { PaymentTransaction } from '../../types';

export const PaymentHistoryScreen: React.FC = () => {
  const { goBack, showToast } = useApp();

  const [activeFilter, setActiveFilter] = useState<'ALL' | 'PAID' | 'PENDING' | 'REFUNDED'>('ALL');
  const [selectedTx, setSelectedTx] = useState<PaymentTransaction | null>(null);

  const transactions: PaymentTransaction[] = [
    {
      id: 'tx-1',
      transactionId: 'TXN-9842109823',
      service: 'Cardiology Consultation - Dr. Arindam Mukherjee',
      date: '18 Nov 2026',
      amount: 900,
      method: 'UPI',
      status: 'PAID',
      bookingOrOrderId: 'DG-2026-9812',
    },
    {
      id: 'tx-2',
      transactionId: 'TXN-8741029811',
      service: 'Medicine Order (Augmentin 625, Dolo 650)',
      date: '15 Nov 2026',
      amount: 450,
      method: 'Debit Card',
      status: 'PAID',
      bookingOrOrderId: 'DG-MED-5501',
    },
    {
      id: 'tx-3',
      transactionId: 'TXN-7610294821',
      service: 'Orthopedic Consultation - Woodlands Hospital',
      date: '25 Oct 2026',
      amount: 1000,
      method: 'Debit Card',
      status: 'REFUNDED',
      bookingOrOrderId: 'DG-2026-7731',
    },
  ];

  const filtered = transactions.filter(
    (t) => activeFilter === 'ALL' || t.status === activeFilter
  );

  return (
    <div className="min-h-full pb-20 bg-[#F6F8FA]">
      <div className="bg-white border-b border-slate-100 p-4 sticky top-0 z-20 flex items-center justify-between shadow-2xs">
        <button
          onClick={goBack}
          className="flex items-center gap-1 text-slate-500 hover:text-slate-800 text-xs font-semibold"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Profile</span>
        </button>

        <span className="text-xs font-bold text-[#172B4D]">Payment History</span>

        <span className="w-8"></span>
      </div>

      <div className="p-4 space-y-4">
        {/* Filters */}
        <div className="flex gap-2">
          {(['ALL', 'PAID', 'REFUNDED'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeFilter === f
                  ? 'bg-[#172B4D] text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Transactions list */}
        <div className="space-y-3">
          {filtered.map((tx) => (
            <div
              key={tx.id}
              onClick={() => setSelectedTx(tx)}
              className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md cursor-pointer transition-all space-y-2"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-xs text-[#172B4D]">{tx.service}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {tx.date} • Method: {tx.method}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-extrabold text-[#172B4D]">₹{tx.amount}</span>
                  <span
                    className={`text-[9px] font-bold block px-1.5 py-0.2 rounded mt-0.5 ${
                      tx.status === 'PAID'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-rose-50 text-rose-700'
                    }`}
                  >
                    {tx.status}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="font-mono text-[10px]">{tx.transactionId}</span>
                <span className="text-[#087E8B] font-bold">View Receipt →</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Digital Receipt Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-slate-100 animate-in zoom-in-95 space-y-4">
            <div className="flex justify-between items-start pb-2 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700">
                  Doctor G Official Receipt
                </span>
                <h3 className="font-bold text-sm text-[#172B4D]">{selectedTx.service}</h3>
              </div>
              <button onClick={() => setSelectedTx(null)} className="text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Transaction Ref</span>
                <span className="font-mono font-bold text-slate-800">
                  {selectedTx.transactionId}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Date & Time</span>
                <span className="font-bold text-slate-800">{selectedTx.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Payment Channel</span>
                <span className="font-bold text-slate-800">{selectedTx.method}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-100 text-sm font-extrabold text-[#172B4D]">
                <span>Total Amount Paid</span>
                <span>₹{selectedTx.amount}</span>
              </div>
            </div>

            <button
              onClick={() => {
                showToast('Tax invoice PDF downloaded', 'success');
                setSelectedTx(null);
              }}
              className="w-full py-2.5 bg-[#087E8B] hover:bg-[#06626D] text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Tax Invoice (PDF)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
