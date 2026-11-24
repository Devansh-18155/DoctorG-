import React from 'react';
import {
  CheckCircle2,
  Star,
  MapPin,
  Calendar,
  Clock,
  Navigation,
  Building2,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { EnrichedDoctor } from '../../utils/doctorDiscoveryHelper';
import { TravelTimeCardSection } from '../navigation/TravelTimeCardSection';

interface DoctorCardProps {
  doctor: EnrichedDoctor;
  onViewProfile: (doc: EnrichedDoctor) => void;
  onViewLocation: (doc: EnrichedDoctor) => void;
  onGetDirections: (doc: EnrichedDoctor) => void;
  onBookAppointment: (doc: EnrichedDoctor) => void;
  isSelected?: boolean;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({
  doctor,
  onViewProfile,
  onViewLocation,
  onGetDirections,
  onBookAppointment,
  isSelected = false,
}) => {
  return (
    <div
      className={`bg-white rounded-3xl border p-4 shadow-2xs hover:shadow-md transition-all duration-200 relative overflow-hidden ${
        isSelected
          ? 'border-teal-400 ring-2 ring-teal-100 bg-gradient-to-b from-teal-50/20 to-white'
          : 'border-slate-200/90'
      }`}
    >
      {/* Top Header: Doctor Photo, Name & Specialty */}
      <div className="flex items-start gap-3.5">
        <div className="relative flex-shrink-0">
          <img
            src={doctor.imageUrl}
            alt={doctor.name}
            className="w-16 h-16 rounded-2xl object-cover border border-slate-100 shadow-2xs"
          />
          {doctor.verified && (
            <div
              title="Medical Council Verified"
              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center shadow-xs border-2 border-white"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <h3
              onClick={() => onViewProfile(doctor)}
              className="font-extrabold text-sm text-[#172B4D] truncate cursor-pointer hover:text-teal-700 transition-colors"
            >
              {doctor.name}
            </h3>
            <span className="font-black text-sm text-[#087E8B] whitespace-nowrap">
              ₹{doctor.consultationFee}
            </span>
          </div>

          <p className="text-xs font-semibold text-teal-700 truncate mt-0.5">
            {doctor.specialty}
          </p>

          <p className="text-[11px] text-slate-500 truncate">{doctor.qualification}</p>

          {/* Experience and Rating */}
          <div className="flex items-center gap-2 mt-1.5 text-[11px]">
            <span className="flex items-center gap-1 font-bold text-amber-600">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              {doctor.rating} ({doctor.reviewCount})
            </span>
            <span className="text-slate-300">•</span>
            <span className="font-semibold text-slate-600">
              {doctor.experienceYears} Years Exp
            </span>
            {doctor.isDemo && (
              <>
                <span className="text-slate-300">•</span>
                <span className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.2 rounded font-mono">
                  Demo
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Hospital / Clinic Details & Address */}
      <div className="mt-3.5 pt-3 border-t border-slate-100 space-y-1.5 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-slate-700 font-semibold truncate max-w-[240px]">
            <Building2 className="w-3.5 h-3.5 text-teal-700 flex-shrink-0" />
            <span className="truncate">{doctor.hospitalName}</span>
          </div>

          <span className="text-[10px] text-slate-400 font-medium">
            {doctor.clinicCity}
          </span>
        </div>

        <p className="text-[11px] text-slate-400 line-clamp-1 pl-5">
          {doctor.fullClinicAddress}
        </p>
      </div>

      {/* Travel Time & Route Section (Distance, Car, Bike, Walking + View Route) */}
      <div className="mt-2.5">
        <TravelTimeCardSection
          distanceKm={doctor.distanceKm || 4.2}
          onViewRoute={() => onGetDirections(doctor)}
        />
      </div>

      {/* Next Appointment Slot Pill */}
      <div className="mt-2 p-2 bg-slate-50 rounded-xl flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-1.5 font-medium">
          <Clock className="w-3.5 h-3.5 text-teal-600" />
          <span className="text-[11px]">
            Next Available: <strong className="text-slate-800">{doctor.nextSlot}</strong>
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-3 pt-2 grid grid-cols-4 gap-1.5 text-xs font-bold">
        <button
          onClick={() => onViewProfile(doctor)}
          className="py-2.5 px-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-center transition-colors truncate"
        >
          Profile
        </button>

        <button
          onClick={() => onViewLocation(doctor)}
          className="py-2.5 px-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl flex items-center justify-center gap-1 transition-colors truncate"
          title="View on Map"
        >
          <MapPin className="w-3.5 h-3.5 text-teal-600" />
          <span>Map</span>
        </button>

        <button
          onClick={() => onGetDirections(doctor)}
          className="py-2.5 px-1 bg-teal-50 hover:bg-teal-100 text-[#087E8B] border border-teal-200 rounded-xl flex items-center justify-center gap-1 transition-colors truncate"
          title="Get Directions"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>Route</span>
        </button>

        <button
          onClick={() => onBookAppointment(doctor)}
          className="py-2.5 px-1 bg-[#087E8B] hover:bg-[#06626D] text-white rounded-xl shadow-xs transition-all text-center truncate flex items-center justify-center gap-0.5"
        >
          <span>Book</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
