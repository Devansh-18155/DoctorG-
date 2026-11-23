import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Users,
  Stethoscope,
  Building2,
  Calendar,
  DollarSign,
  TrendingUp,
  FileCheck2,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  Download,
  Filter,
} from 'lucide-react';
import { HOSPITALS, DOCTORS, INITIAL_APPOINTMENTS } from '../../data/mockData';

export const AdminDashboard: React.FC = () => {
  const { loginAsPatient, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'providers' | 'appointments' | 'verifications'>('overview');

  // Verification Queue State with Approve/Reject actions
  const [pendingVerifications, setPendingVerifications] = useState([
    {
      id: 'ver-1',
      name: 'Dr. Anirban Sen (MD, DM Cardiology)',
      type: 'Doctor Registration',
      regNo: 'WBMC-2014-9842',
      status: 'PENDING_REVIEW',
      submittedAt: '2 hours ago',
    },
    {
      id: 'ver-2',
      name: 'Desun Emergency Trauma Care',
      type: 'Hospital Onboarding',
      regNo: 'HSP-WB-2026-4410',
      status: 'PENDING_REVIEW',
      submittedAt: '5 hours ago',
    },
    {
      id: 'ver-3',
      name: 'Dr. Lal PathLabs New Town Franchise',
      type: 'Diagnostic Laboratory',
      regNo: 'NABL-LAB-8812',
      status: 'PENDING_REVIEW',
      submittedAt: '1 day ago',
    },
  ]);

  const handleApprove = (id: string, name: string) => {
    setPendingVerifications((prev) => prev.filter((v) => v.id !== id));
    showToast(`Approved & verified credentials for: ${name}`, 'success');
  };

  const handleReject = (id: string, name: string) => {
    setPendingVerifications((prev) => prev.filter((v) => v.id !== id));
    showToast(`Rejected onboarding application for: ${name}`, 'warning');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Top Admin Header */}
      <header className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500 text-slate-950 flex items-center justify-center font-black">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-extrabold text-base text-white">
              Doctor G Super-Administrator Portal
            </h1>
            <p className="text-xs text-slate-400">
              National Healthcare Super-App Central Monitoring & Verifications
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
            All Systems Operational ✓
          </span>
        </div>
      </header>

      {/* Main Admin Content */}
      <div className="max-w-7xl mx-auto w-full p-6 space-y-6 flex-1">
        {/* KPI Overview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Registered Patients
            </span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-black text-white">1,48,290</span>
              <span className="text-xs font-bold text-emerald-400">+12% this month</span>
            </div>
          </div>

          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Verified Doctors
            </span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-black text-teal-400">3,420</span>
              <span className="text-xs font-bold text-slate-400">14 Specialities</span>
            </div>
          </div>

          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Partner Hospitals
            </span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-black text-white">418</span>
              <span className="text-xs font-bold text-slate-400">Govt + Private</span>
            </div>
          </div>

          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Monthly Platform Volume
            </span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-black text-emerald-400">₹1.84 Cr</span>
              <span className="text-xs font-bold text-slate-400">Gross GMV</span>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 border-b border-slate-800 pb-2">
          {[
            { id: 'overview', label: 'Platform Summary' },
            { id: 'verifications', label: `Pending Verifications (${pendingVerifications.length})` },
            { id: 'providers', label: 'Active Providers Roster' },
            { id: 'appointments', label: 'Live Bookings Stream' },
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

        {/* VERIFICATIONS QUEUE TAB */}
        {(activeTab === 'overview' || activeTab === 'verifications') && (
          <div className="bg-slate-800/60 rounded-3xl border border-slate-700/80 p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-extrabold text-sm text-white">
                  Provider Medical Credential Verification Queue
                </h3>
                <p className="text-xs text-slate-400">
                  Medical Council registrations & hospital clinical licenses awaiting validation
                </p>
              </div>
              <span className="text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 px-3 py-1 rounded-full">
                {pendingVerifications.length} Urgent Reviews
              </span>
            </div>

            {pendingVerifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                All provider registration credentials verified! Zero backlog.
              </div>
            ) : (
              <div className="divide-y divide-slate-700">
                {pendingVerifications.map((item) => (
                  <div key={item.id} className="py-3.5 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-xs text-white">{item.name}</h4>
                        <span className="text-[10px] bg-slate-700 text-slate-300 px-2 py-0.2 rounded font-mono">
                          {item.type}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Registration: <strong>{item.regNo}</strong> • Submitted {item.submittedAt}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleApprove(item.id, item.name)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-colors"
                      >
                        Approve & Verify
                      </button>
                      <button
                        onClick={() => handleReject(item.id, item.name)}
                        className="px-3 py-1.5 bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-bold rounded-xl transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PROVIDERS ROSTER TAB */}
        {activeTab === 'providers' && (
          <div className="bg-slate-800/60 rounded-3xl border border-slate-700/80 p-6 space-y-4">
            <h3 className="font-extrabold text-sm text-white">Approved Partner Institutions</h3>
            <div className="divide-y divide-slate-700">
              {HOSPITALS.map((hosp) => (
                <div key={hosp.id} className="py-3 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-white">{hosp.name}</h4>
                    <p className="text-[11px] text-slate-400">
                      {hosp.type} • {hosp.city} • Rating: {hosp.rating}★
                    </p>
                  </div>
                  <span className="text-xs font-bold text-emerald-400">Active Licensed</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
