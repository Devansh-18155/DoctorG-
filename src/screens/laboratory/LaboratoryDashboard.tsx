import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FlaskConical,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Search,
  Upload,
  ArrowRight,
  TrendingUp,
  CreditCard,
  Building2,
  Check,
  AlertCircle,
} from 'lucide-react';
import { VERIFIED_DIAGNOSTIC_LABS } from '../../data/labCatalogData';

export const LaboratoryDashboard: React.FC = () => {
  const { loginAsPatient, showToast, testBookings } = useApp();

  const [activeTab, setActiveTab] = useState<'orders' | 'tests' | 'profile' | 'subscription'>('orders');

  const labProfile = VERIFIED_DIAGNOSTIC_LABS[0]; // Dr Lal PathLabs Reference Center

  // Simulated orders state
  const [labOrders, setLabOrders] = useState([
    {
      id: 'LAB-ORD-901',
      patientName: 'Priya Sharma',
      phone: '+91 98260 11223',
      tests: 'Complete Blood Count (CBC), Fasting Sugar',
      type: 'HOME_COLLECTION',
      address: 'Flat 302, Green Meadows, M.P. Nagar, Bhopal',
      date: 'Today',
      slot: '07:30 AM - 08:00 AM',
      amount: 380,
      status: 'PROCESSING',
      reportUrl: '',
    },
    {
      id: 'LAB-ORD-902',
      patientName: 'Rajesh Meena',
      phone: '+91 94250 88771',
      tests: 'Lipid Profile Complete, HbA1c',
      type: 'LAB_VISIT',
      address: 'Walk-in Diagnostic Center',
      date: 'Today',
      slot: '09:00 AM - 09:30 AM',
      amount: 1100,
      status: 'COMPLETED',
      reportUrl: 'https://doctorg.in/reports/demo-lipid-902.pdf',
    },
  ]);

  const handleUploadReport = (orderId: string) => {
    setLabOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId
          ? {
              ...ord,
              status: 'COMPLETED',
              reportUrl: `https://doctorg.in/reports/signed-${orderId}.pdf`,
            }
          : ord
      )
    );
    showToast(`Signed diagnostic report uploaded for order ${orderId}`, 'success');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <header className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500 text-slate-950 flex items-center justify-center font-black">
            <FlaskConical className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-extrabold text-base text-white">
              {labProfile.name}
            </h1>
            <p className="text-xs text-slate-400">
              Diagnostic Laboratory Portal • {labProfile.city}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => loginAsPatient(false)}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-colors"
          >
            Switch to Patient App
          </button>
          <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold px-2.5 py-1 rounded-full">
            NABL Accredited ✓
          </span>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto w-full p-6 space-y-6 flex-1">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Today's Sample Orders
            </span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-black text-white">{labOrders.length + (testBookings?.length || 0)}</span>
              <span className="text-xs font-bold text-emerald-400">Doorstep & Walk-in</span>
            </div>
          </div>

          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Pending Lab Reports
            </span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-black text-amber-400">
                {labOrders.filter((o) => o.status === 'PROCESSING').length}
              </span>
              <span className="text-xs font-bold text-amber-400">In Testing</span>
            </div>
          </div>

          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Quality Turnaround (TAT)
            </span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-black text-teal-400">4.2h</span>
              <span className="text-xs font-bold text-slate-400">Avg delivery time</span>
            </div>
          </div>

          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Today's Net Revenue
            </span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-black text-emerald-400">₹4,890</span>
              <span className="text-xs font-bold text-slate-400">Settled via Razorpay</span>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 border-b border-slate-800 pb-2">
          {[
            { id: 'orders', label: 'Sample Bookings & Orders' },
            { id: 'profile', label: 'Laboratory Facility Details' },
            { id: 'subscription', label: 'Doctor G Provider Plan' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === t.id
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Orders */}
        {activeTab === 'orders' && (
          <div className="bg-slate-800/60 rounded-3xl border border-slate-700/80 p-6 space-y-4">
            <h3 className="font-extrabold text-sm text-white">Active Diagnostic Orders & Sample Pipeline</h3>
            <div className="divide-y divide-slate-700">
              {labOrders.map((ord) => (
                <div key={ord.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-xs text-white">{ord.id}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          ord.type === 'HOME_COLLECTION'
                            ? 'bg-purple-900/60 text-purple-300 border border-purple-700'
                            : 'bg-blue-900/60 text-blue-300 border border-blue-700'
                        }`}
                      >
                        {ord.type === 'HOME_COLLECTION' ? 'Doorstep Phlebotomy' : 'Walk-In Center'}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          ord.status === 'COMPLETED'
                            ? 'bg-emerald-900/60 text-emerald-300'
                            : 'bg-amber-900/60 text-amber-300 animate-pulse'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-white mt-1">{ord.patientName} ({ord.phone})</h4>
                    <p className="text-xs text-teal-400 font-medium">{ord.tests}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {ord.type === 'HOME_COLLECTION' && `Address: ${ord.address} • `}
                      {ord.date} at {ord.slot}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <div className="text-right">
                      <span className="font-extrabold text-xs text-white">₹{ord.amount}</span>
                      <span className="block text-[10px] text-emerald-400">Prepaid</span>
                    </div>

                    {ord.status !== 'COMPLETED' ? (
                      <button
                        onClick={() => handleUploadReport(ord.id)}
                        className="px-3.5 py-1.5 bg-[#087E8B] hover:bg-[#06626D] text-white text-xs font-bold rounded-xl flex items-center gap-1 transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Report</span>
                      </button>
                    ) : (
                      <a
                        href={ord.reportUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-1.5 bg-slate-700 hover:bg-slate-600 text-teal-300 text-xs font-bold rounded-xl flex items-center gap-1"
                      >
                        <span>View Report PDF</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Profile */}
        {activeTab === 'profile' && (
          <div className="bg-slate-800/60 rounded-3xl border border-slate-700/80 p-6 space-y-4 max-w-2xl">
            <h3 className="font-extrabold text-sm text-white">Laboratory Information & Operating Hours</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Laboratory Facility Name</label>
                <input
                  type="text"
                  readOnly
                  value={labProfile.name}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Full Physical Address</label>
                <input
                  type="text"
                  readOnly
                  value={labProfile.address}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Official Contact Phone</label>
                  <input
                    type="text"
                    readOnly
                    value={labProfile.phone}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Operating Hours</label>
                  <input
                    type="text"
                    readOnly
                    value={`${labProfile.openingTime} - ${labProfile.closingTime}`}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Subscription */}
        {activeTab === 'subscription' && (
          <div className="bg-slate-800/60 rounded-3xl border border-slate-700/80 p-6 space-y-4 max-w-xl">
            <h3 className="font-extrabold text-sm text-white">Doctor G Diagnostic Network Partnership</h3>
            <div className="bg-slate-900 p-4 rounded-2xl border border-teal-500/30 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-teal-400 uppercase">Current Tier</span>
                <h4 className="text-base font-black text-white">NABL Certified Diagnostic Partner</h4>
                <p className="text-xs text-slate-400">Valid through 31 Dec 2026 • Auto-renew active</p>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-800">
                Active
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
