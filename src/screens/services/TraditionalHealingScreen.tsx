import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ChevronLeft,
  Flower2,
  AlertTriangle,
  MapPin,
  Phone,
  Calendar,
  Star,
  CheckCircle2,
  X,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { TRADITIONAL_PRACTITIONERS } from '../../data/mockData';
import { TraditionalPractitioner } from '../../types';

export const TraditionalHealingScreen: React.FC = () => {
  const { goBack, navigateTo, currentCity, showToast, requireAuth } = useApp();

  const [selectedPractitioner, setSelectedPractitioner] = useState<TraditionalPractitioner>(
    TRADITIONAL_PRACTITIONERS[0]
  );
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [bookingDate, setBookingDate] = useState('2026-11-24');

  const handleBookRequest = () => {
    requireAuth(() => {
      setIsBookModalOpen(false);
      showToast(
        `Consultation request sent to ${selectedPractitioner.name}. Clinic coordinator will confirm via call.`,
        'success'
      );
    }, 'Sign in to request traditional healing appointment');
  };

  return (
    <div className="min-h-full pb-20 bg-[#F6F8FA]">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 p-4 sticky top-0 z-20 flex items-center justify-between shadow-2xs">
        <button
          onClick={goBack}
          className="flex items-center gap-1 text-slate-500 hover:text-slate-800 text-xs font-semibold"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Home</span>
        </button>

        <span className="text-xs font-bold text-[#172B4D]">Traditional & Holistic Wellness</span>

        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
          Culturally Certified
        </span>
      </div>

      <div className="p-4 space-y-4">
        {/* MANDATORY PROMINENT STATUTORY SAFETY DISCLAIMER */}
        <div className="p-4 bg-amber-50 rounded-2xl border-2 border-amber-300 text-amber-950 text-xs shadow-xs space-y-1.5">
          <div className="flex items-center gap-2 text-amber-800 font-extrabold uppercase text-[11px] tracking-wide">
            <ShieldAlert className="w-4 h-4 text-amber-700 flex-shrink-0" />
            <span>Important Healthcare Safety Notice</span>
          </div>
          <p className="leading-relaxed font-medium">
            <strong>Traditional or faith-based practices are not a substitute for medical diagnosis or emergency care. Seek qualified medical care when needed.</strong>
          </p>
          <p className="text-[10px] text-amber-800 leading-snug">
            Doctor G provides discovery for vetted traditional wellness guides, Ayurveda consultants & cultural heritage practitioners. In conditions like chest pain, severe infections, or fractures, seek emergency hospital care immediately.
          </p>
        </div>

        {/* Introduction */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 p-4 rounded-3xl text-white shadow-md">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
            Heritage Healing Systems
          </span>
          <h3 className="font-extrabold text-sm text-white mt-0.5">
            Discover Traditional Wellness, Ayurveda & Homeopathy
          </h3>
          <p className="text-[11px] text-emerald-100 mt-0.5">
            Respectful traditional counseling, Nadi Pariksha, and constitutional lifestyle guidance
          </p>
        </div>

        {/* Practitioners List */}
        <div className="space-y-3.5">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Verified Traditional Practitioners in {currentCity}
          </h4>

          {TRADITIONAL_PRACTITIONERS.map((pr) => (
            <div
              key={pr.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs hover:shadow-md transition-all space-y-2.5"
            >
              <div className="flex items-start justify-between pb-2 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                    {pr.type}
                  </span>
                  <h4 className="font-bold text-xs text-[#172B4D] mt-1">{pr.name}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {pr.experienceYears} Years Heritage Experience
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-slate-700">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>{pr.rating}</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{pr.description}</p>

              {/* Services pills */}
              <div className="flex flex-wrap gap-1">
                {pr.services.map((s) => (
                  <span
                    key={s}
                    className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                  >
                    • {s}
                  </span>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1 truncate max-w-[180px]">
                  <MapPin className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
                  <span className="truncate">{pr.location}</span>
                </span>
                <button
                  onClick={() => {
                    setSelectedPractitioner(pr);
                    setIsBookModalOpen(true);
                  }}
                  className="px-3 py-1.5 bg-[#087E8B] hover:bg-[#06626D] text-white rounded-xl font-bold shadow-xs transition-colors"
                >
                  Request Visit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Appointment Request Modal */}
      {isBookModalOpen && selectedPractitioner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-slate-100 animate-in zoom-in-95 space-y-3">
            <div className="flex justify-between items-start pb-2 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-sm text-[#172B4D]">
                  Request Wellness Appointment
                </h3>
                <p className="text-xs text-slate-500">{selectedPractitioner.name}</p>
              </div>
              <button onClick={() => setIsBookModalOpen(false)} className="text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900">
              <strong>Reminder:</strong> This is an auxiliary holistic appointment. For urgent fever, infection, or severe symptoms, consult modern medical clinics.
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Preferred Date
              </label>
              <input
                type="date"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => setIsBookModalOpen(false)}
                className="flex-1 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleBookRequest}
                className="flex-1 py-2.5 bg-[#087E8B] hover:bg-[#06626D] text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
