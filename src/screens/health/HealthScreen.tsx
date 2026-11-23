import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  HeartPulse,
  FileText,
  Clock,
  Users,
  Activity,
  Plus,
  ChevronRight,
  TrendingUp,
  Calendar,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export const HealthScreen: React.FC = () => {
  const {
    navigateTo,
    healthRecords,
    medicineReminders,
    vitals,
    familyMembers,
    activeFamilyMemberId,
    setActiveFamilyMemberId,
    appointments,
  } = useApp();

  const activeFamilyMember =
    familyMembers.find((m) => m.id === activeFamilyMemberId) || familyMembers[0];

  const upcomingApt = appointments.find((a) => a.bookingStatus === 'UPCOMING');

  return (
    <div className="min-h-full pb-20 bg-[#F6F8FA]">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 p-4 sticky top-0 z-20 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-lg font-extrabold text-[#172B4D] tracking-tight">
              Health Dashboard
            </h1>
            <p className="text-xs text-slate-500">Personal health metrics & medical history</p>
          </div>
          <button
            onClick={() => navigateTo('health-tracker')}
            className="flex items-center gap-1 bg-teal-50 text-teal-800 hover:bg-teal-100 px-3 py-1.5 rounded-xl text-xs font-bold border border-teal-200 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log Vitals</span>
          </button>
        </div>

        {/* Family Member Profile Selector */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {familyMembers.map((member) => {
            const isSelected = member.id === activeFamilyMemberId;
            return (
              <button
                key={member.id}
                onClick={() => setActiveFamilyMemberId(member.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#172B4D] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{member.name.split(' ')[0]}</span>
                <span className="text-[10px] opacity-75">({member.relationship})</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Vitals Overview Grid */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-extrabold text-sm text-[#172B4D]">Latest Vitals</h3>
            <button
              onClick={() => navigateTo('health-tracker')}
              className="text-xs font-bold text-[#087E8B] hover:underline flex items-center gap-0.5"
            >
              <span>Trends & Charts</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {vitals.slice(0, 4).map((vital) => (
              <div
                key={vital.id}
                onClick={() => navigateTo('health-tracker')}
                className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md cursor-pointer transition-all"
              >
                <div className="flex justify-between items-start">
                  <span className="text-[11px] font-semibold text-slate-400">{vital.type}</span>
                  <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                    {vital.statusTag}
                  </span>
                </div>
                <div className="mt-2">
                  <span className="text-xl font-black text-[#172B4D]">{vital.value}</span>
                  <span className="text-[10px] text-slate-400 ml-1">{vital.unit}</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">{vital.timestamp}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 4 Health Core Modules */}
        <div className="grid grid-cols-2 gap-2.5">
          <div
            onClick={() => navigateTo('health-records')}
            className="p-3.5 bg-blue-50/60 border border-blue-100 rounded-2xl shadow-2xs hover:shadow-md cursor-pointer transition-all"
          >
            <div className="w-8 h-8 rounded-xl bg-white text-blue-700 flex items-center justify-center shadow-2xs mb-2">
              <FileText className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-xs text-[#172B4D]">Health Records</h4>
            <p className="text-[10px] text-slate-500 mt-0.5">
              {healthRecords.length} Documents Saved
            </p>
          </div>

          <div
            onClick={() => navigateTo('reminders')}
            className="p-3.5 bg-emerald-50/60 border border-emerald-100 rounded-2xl shadow-2xs hover:shadow-md cursor-pointer transition-all"
          >
            <div className="w-8 h-8 rounded-xl bg-white text-emerald-700 flex items-center justify-center shadow-2xs mb-2">
              <Clock className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-xs text-[#172B4D]">Medicine Reminders</h4>
            <p className="text-[10px] text-slate-500 mt-0.5">
              {medicineReminders.filter((r) => r.status === 'ACTIVE').length} Active Doses
            </p>
          </div>

          <div
            onClick={() => navigateTo('family-health')}
            className="p-3.5 bg-purple-50/60 border border-purple-100 rounded-2xl shadow-2xs hover:shadow-md cursor-pointer transition-all"
          >
            <div className="w-8 h-8 rounded-xl bg-white text-purple-700 flex items-center justify-center shadow-2xs mb-2">
              <Users className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-xs text-[#172B4D]">Family Profiles</h4>
            <p className="text-[10px] text-slate-500 mt-0.5">
              {familyMembers.length} Members Linked
            </p>
          </div>

          <div
            onClick={() => navigateTo('health-tracker')}
            className="p-3.5 bg-amber-50/60 border border-amber-100 rounded-2xl shadow-2xs hover:shadow-md cursor-pointer transition-all"
          >
            <div className="w-8 h-8 rounded-xl bg-white text-amber-700 flex items-center justify-center shadow-2xs mb-2">
              <Activity className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-xs text-[#172B4D]">Vitals Tracker</h4>
            <p className="text-[10px] text-slate-500 mt-0.5">BP, Sugar & Steps</p>
          </div>
        </div>

        {/* Medicine Reminders Today */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-xs text-[#172B4D]">Today's Medicines</h4>
            <button
              onClick={() => navigateTo('reminders')}
              className="text-[11px] font-bold text-[#087E8B] hover:underline"
            >
              Manage Reminders
            </button>
          </div>

          <div className="space-y-2">
            {medicineReminders.slice(0, 2).map((rem) => (
              <div
                key={rem.id}
                className="p-2.5 rounded-xl bg-slate-50 flex items-center justify-between text-xs"
              >
                <div>
                  <h5 className="font-bold text-[#172B4D]">{rem.medicineName}</h5>
                  <p className="text-[10px] text-slate-500">
                    {rem.dosage} • {rem.instructions} • {rem.timeSlots.join(', ')}
                  </p>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    rem.takenToday[0]
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {rem.takenToday[0] ? 'Taken ✓' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Health Records */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-xs text-[#172B4D]">Recent Medical Records</h4>
            <button
              onClick={() => navigateTo('health-records')}
              className="text-[11px] font-bold text-[#087E8B] hover:underline"
            >
              View All ({healthRecords.length})
            </button>
          </div>

          <div className="space-y-2">
            {healthRecords.slice(0, 2).map((rec) => (
              <div
                key={rec.id}
                onClick={() => navigateTo('health-records')}
                className="p-2.5 rounded-xl border border-slate-100 flex items-center justify-between hover:bg-slate-50 cursor-pointer text-xs"
              >
                <div>
                  <h5 className="font-bold text-[#172B4D] truncate max-w-[220px]">
                    {rec.title}
                  </h5>
                  <p className="text-[10px] text-slate-400">
                    {rec.category} • {rec.date}
                  </p>
                </div>
                <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                  {rec.fileType.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
