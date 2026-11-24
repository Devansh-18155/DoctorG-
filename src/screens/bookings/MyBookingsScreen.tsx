import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CalendarDays,
  Clock,
  MapPin,
  ChevronRight,
  Plus,
  CalendarCheck,
  Search,
} from 'lucide-react';
import { StatusBadge } from '../../components/common/StatusBadge';
import { EmptyState } from '../../components/common/EmptyState';
import { VoiceSearchInput } from '../../components/common/VoiceSearchInput';

export const MyBookingsScreen: React.FC = () => {
  const { appointments, navigateTo } = useApp();
  const [activeTab, setActiveTab] = useState<'UPCOMING' | 'COMPLETED' | 'CANCELLED'>('UPCOMING');
  const [search, setSearch] = useState('');

  const filteredAppointments = appointments.filter((apt) => {
    const matchesTab = apt.bookingStatus === activeTab;
    const matchesSearch =
      apt.doctorName.toLowerCase().includes(search.toLowerCase()) ||
      apt.hospitalName.toLowerCase().includes(search.toLowerCase()) ||
      apt.bookingId.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-full pb-20 bg-[#F6F8FA]">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-100 p-4 sticky top-0 z-20 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-lg font-extrabold text-[#172B4D] tracking-tight">
              My Appointments
            </h1>
            <p className="text-xs text-slate-500">Track consultation slips & live patient queue</p>
          </div>
          <button
            onClick={() => navigateTo('book-appointment')}
            className="flex items-center gap-1 bg-[#087E8B] hover:bg-[#06626D] text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Book New</span>
          </button>
        </div>

        {/* Search with Reusable Voice Search */}
        <div className="mb-3">
          <VoiceSearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onChangeValue={setSearch}
            onClear={() => setSearch('')}
            placeholder="Search by doctor, hospital or ID..."
            searchCategory="doctor"
          />
        </div>

        {/* 3 Tabs */}
        <div className="flex p-1 bg-slate-100 rounded-xl">
          {(['UPCOMING', 'COMPLETED', 'CANCELLED'] as const).map((tab) => {
            const count = appointments.filter((a) => a.bookingStatus === tab).length;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === tab
                    ? 'bg-white text-[#087E8B] shadow-xs'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <span>
                  {tab === 'UPCOMING'
                    ? 'Upcoming'
                    : tab === 'COMPLETED'
                    ? 'Completed'
                    : 'Cancelled'}
                </span>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded-full font-semibold">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bookings List */}
      <div className="p-4 space-y-3">
        {filteredAppointments.length === 0 ? (
          <EmptyState
            icon={CalendarCheck}
            title={`No ${activeTab.toLowerCase()} appointments`}
            description={
              activeTab === 'UPCOMING'
                ? "You don't have any upcoming doctor appointments scheduled."
                : `No ${activeTab.toLowerCase()} appointment records found.`
            }
            actionLabel="Book An Appointment"
            onAction={() => navigateTo('book-appointment')}
          />
        ) : (
          filteredAppointments.map((apt) => (
            <div
              key={apt.id}
              onClick={() => navigateTo('appointment-details', { appointmentId: apt.id })}
              className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs hover:shadow-md cursor-pointer transition-all"
            >
              {/* Top Row: Patient Number & Status */}
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="bg-teal-50 text-teal-800 font-extrabold text-xs px-2.5 py-0.5 rounded-lg border border-teal-200/60">
                    Patient No: #{String(apt.patientNumber || apt.tokenNumber).padStart(3, '0')}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono font-medium">
                    {apt.bookingId}
                  </span>
                </div>
                <StatusBadge status={apt.bookingStatus} />
              </div>

              {/* Doctor Details */}
              <div className="flex items-start gap-3 my-3">
                <img
                  src={apt.doctorImage}
                  alt={apt.doctorName}
                  className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs text-[#172B4D] truncate">{apt.doctorName}</h4>
                  <p className="text-[11px] text-teal-700 font-semibold truncate">
                    {apt.doctorSpecialty}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">{apt.hospitalName}</p>
                </div>
              </div>

              {/* Date & Time pill */}
              <div className="bg-slate-50 p-2.5 rounded-xl flex items-center justify-between text-xs text-slate-600">
                <div className="flex items-center gap-1.5 font-medium">
                  <CalendarDays className="w-3.5 h-3.5 text-teal-600" />
                  <span>{apt.date}</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <Clock className="w-3.5 h-3.5 text-teal-600" />
                  <span>{apt.timeSlot}</span>
                </div>
              </div>

              {/* Card Footer: Live Queue or View Details */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                {apt.bookingStatus === 'UPCOMING' ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateTo('live-queue', { appointment: apt });
                    }}
                    className="flex items-center gap-1 text-[11px] font-bold text-teal-700 hover:text-teal-800"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Live Queue: Patient #{String(apt.currentToken || 19).padStart(3, '0')} (Wait ~{apt.estimatedWaitMinutes}m)</span>
                  </button>
                ) : (
                  <span className="text-[10px] text-slate-400">
                    Patient: {apt.patientName}
                  </span>
                )}

                <span className="font-bold text-[#087E8B] text-xs flex items-center gap-0.5">
                  View Slip <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
