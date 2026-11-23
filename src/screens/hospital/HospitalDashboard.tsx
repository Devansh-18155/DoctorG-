import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building2,
  Stethoscope,
  Users,
  Calendar,
  Clock,
  TrendingUp,
  DollarSign,
  Plus,
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { HOSPITALS, DOCTORS, DEPARTMENTS } from '../../data/mockData';

export const HospitalDashboard: React.FC = () => {
  const { loginAsPatient, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'departments' | 'doctors' | 'billing'>('overview');
  const [selectedHospital] = useState(HOSPITALS[0]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-base text-[#172B4D]">
              {selectedHospital.name} — Hospital Administration
            </h1>
            <p className="text-xs text-slate-500">
              Campus ID: HSP-KOL-01 • {selectedHospital.address}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => loginAsPatient(false)}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
          >
            Switch to Patient App
          </button>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            NABH Accredited ✓
          </span>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Today's OPD Bookings
            </span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-black text-[#172B4D]">248</span>
              <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
                14 Departments
              </span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Bed Occupancy
            </span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-black text-[#172B4D]">
                {selectedHospital.bedsAvailable} Beds Free
              </span>
              <span className="text-xs font-bold text-slate-500">82% Occupied</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Active Duty Doctors
            </span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-black text-teal-600">42 Consultants</span>
              <span className="text-xs font-bold text-emerald-700">100% Verified</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Today's OPD Collections
            </span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-black text-emerald-600">₹2,14,500</span>
              <span className="text-xs font-bold text-slate-500">Direct Settlement</span>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 border-b border-slate-200 pb-2">
          {[
            { id: 'overview', label: 'Hospital Overview' },
            { id: 'departments', label: 'Departments & Beds' },
            { id: 'doctors', label: 'Doctor Panel & Roaster' },
            { id: 'billing', label: 'Billing & Settlement' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === t.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* DEPARTMENTS TAB */}
        {activeTab === 'departments' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-sm text-[#172B4D]">Configured Departments</h3>
              <button
                onClick={() => showToast('Add Department dialog enabled', 'info')}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-bold"
              >
                + Add Department
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {DEPARTMENTS.map((dept) => (
                <div key={dept.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <h4 className="font-bold text-xs text-[#172B4D]">{dept.name}</h4>
                  <p className="text-[11px] text-slate-500 mt-1">{dept.description}</p>
                  <p className="text-xs font-bold text-blue-700 mt-2">
                    {dept.doctorCount} Doctors On Duty
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DOCTORS TAB */}
        {(activeTab === 'overview' || activeTab === 'doctors') && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
            <h3 className="font-extrabold text-sm text-[#172B4D]">Hospital Doctor Panel</h3>
            <div className="divide-y divide-slate-100">
              {DOCTORS.map((doc) => (
                <div key={doc.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={doc.imageUrl}
                      alt={doc.name}
                      className="w-10 h-10 rounded-xl object-cover"
                    />
                    <div>
                      <h4 className="font-bold text-xs text-[#172B4D]">{doc.name}</h4>
                      <p className="text-[11px] text-teal-700 font-semibold">{doc.specialty}</p>
                      <p className="text-[10px] text-slate-400">{doc.qualification}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-[#172B4D]">
                      Fee: ₹{doc.consultationFee}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-bold block">
                      Status: Active On Duty
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BILLING TAB */}
        {activeTab === 'billing' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3">
            <h3 className="font-extrabold text-sm text-[#172B4D]">Daily Financial Settlement</h3>
            <p className="text-xs text-slate-500">
              Automated NEFT batch settlement processed every 24 hours to hospital account.
            </p>
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 font-semibold">
              ✓ Yesterday's Settlement of ₹1,98,400 transferred to HDFC Bank A/c ending 4821 (UTR: N2611189421)
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
