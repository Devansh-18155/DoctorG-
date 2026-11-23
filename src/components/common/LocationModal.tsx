import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MapPin, Navigation, Search, Check, X, Hospital as HospitalIcon, Stethoscope, ChevronRight } from 'lucide-react';
import { HOSPITALS, DOCTORS } from '../../data/mockData';
import { getNearbyHospitals, getNearbyDoctors } from '../../utils/locationHelper';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_CITIES = [
  { city: 'Kolkata', areas: ['Salt Lake', 'New Town', 'Ballygunge', 'Park Street', 'Alipore', 'Sector V', 'Behala'] },
  { city: 'Delhi NCR', areas: ['Connaught Place', 'South Extension', 'Dwarka', 'Noida Sec 62', 'Gurugram'] },
  { city: 'Mumbai', areas: ['Bandra', 'Andheri West', 'Powai', 'Colaba', 'Dadar'] },
  { city: 'Bengaluru', areas: ['Koramangala', 'Indiranagar', 'Whitefield', 'HSR Layout', 'Jayanagar'] },
  { city: 'Hyderabad', areas: ['Banjara Hills', 'Hitec City', 'Jubilee Hills', 'Gachibowli'] },
  { city: 'Chennai', areas: ['T Nagar', 'Anna Nagar', 'Adyar', 'Velachery'] },
  { city: 'Kalyani', areas: ['Central District', 'AIIMS Campus Zone', 'Kalyani Station Road'] },
];

export const LocationModal: React.FC<LocationModalProps> = ({ isOpen, onClose }) => {
  const {
    currentCity,
    setCurrentCity,
    currentArea,
    setCurrentArea,
    isDetectingLocation,
    liveCoordinates,
    detectLiveLocation,
    showToast,
  } = useApp();
  const [selectedCity, setSelectedCity] = useState(currentCity);

  if (!isOpen) return null;

  const currentCityObj = POPULAR_CITIES.find((c) => c.city === selectedCity) || POPULAR_CITIES[0];

  const handleUseGPS = async () => {
    await detectLiveLocation();
    onClose();
  };

  const handleSelectArea = (city: string, area: string) => {
    setCurrentCity(city);
    setCurrentArea(area);
    const nearbyHosps = getNearbyHospitals(city, area, HOSPITALS);
    const nearbyDocs = getNearbyDoctors(city, area, DOCTORS, HOSPITALS);
    showToast(
      `📍 Location set to ${area}, ${city}! Found ${nearbyHosps.length} nearby hospitals & ${nearbyDocs.length} doctors.`,
      'success'
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col animate-in slide-in-from-bottom">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#172B4D]">Choose Location for Nearby Care</h3>
              <p className="text-[11px] text-slate-500">Auto-loads doctors & hospitals around that area</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live GPS Active Card */}
        <div className="my-2.5 p-3 bg-gradient-to-br from-teal-50 to-emerald-50/50 border-2 border-teal-500/80 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between pb-1.5 border-b border-teal-200/60">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] uppercase font-black text-teal-800 tracking-wider">
                {isDetectingLocation ? 'Detecting Satellite GPS...' : 'Your Live GPS Location'}
              </span>
            </div>

            <button
              onClick={handleUseGPS}
              disabled={isDetectingLocation}
              className="text-[11px] font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 underline"
            >
              <Navigation className={`w-3 h-3 ${isDetectingLocation ? 'animate-spin' : ''}`} />
              <span>{isDetectingLocation ? 'Locating...' : 'Use Live GPS'}</span>
            </button>
          </div>

          <div className="mt-2 flex items-center justify-between">
            <div>
              <p className="text-sm font-extrabold text-[#172B4D] leading-tight">
                {currentArea}, {currentCity}
              </p>
              {liveCoordinates ? (
                <p className="text-[10px] text-teal-700 font-mono mt-0.5">
                  GPS: {liveCoordinates.latitude.toFixed(4)}°, {liveCoordinates.longitude.toFixed(4)}°
                </p>
              ) : (
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Currently active. Nearby hospitals & doctors loaded.
                </p>
              )}
            </div>

            <span className="px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-bold rounded-lg shadow-2xs">
              Active ✓
            </span>
          </div>
        </div>

        {/* Cities horizontal scroll */}
        <div className="flex items-center justify-between mb-1">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            1. Select City
          </p>
          <span className="text-[10px] font-bold text-[#087E8B]">
            {selectedCity}
          </span>
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {POPULAR_CITIES.map((c) => (
            <button
              key={c.city}
              onClick={() => setSelectedCity(c.city)}
              className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap font-bold transition-all ${
                selectedCity === c.city
                  ? 'bg-[#172B4D] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c.city}
            </button>
          ))}
        </div>

        {/* Areas list */}
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1 mb-1.5">
          2. Choose Area to View Nearby Doctors & Hospitals
        </p>
        <div className="overflow-y-auto flex-1 space-y-1.5 pr-1 my-1 max-h-56">
          {currentCityObj.areas.map((area) => {
            const isCurrent = currentCity === selectedCity && currentArea === area;
            const nearbyH = getNearbyHospitals(selectedCity, area, HOSPITALS);
            const nearbyD = getNearbyDoctors(selectedCity, area, DOCTORS, HOSPITALS);
            const closest = nearbyH[0];

            return (
              <button
                key={area}
                onClick={() => handleSelectArea(selectedCity, area)}
                className={`w-full flex items-center justify-between p-2.5 rounded-2xl text-left border transition-all text-xs group ${
                  isCurrent
                    ? 'border-[#087E8B] bg-teal-50/70 text-[#087E8B] font-bold shadow-2xs'
                    : 'border-slate-100 hover:border-teal-300 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-[#172B4D] group-hover:text-[#087E8B]">
                      {area}
                    </span>
                    {isCurrent && (
                      <span className="text-[9px] bg-teal-600 text-white font-extrabold px-1.5 py-0.2 rounded-full">
                        Selected
                      </span>
                    )}
                  </div>
                  {closest && (
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Nearest: {closest.name.split(' ')[0]} ({closest.calculatedDistanceStr}) • {nearbyD.length} doctors
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-lg border border-teal-200/60 group-hover:bg-[#087E8B] group-hover:text-white transition-colors">
                    Select 📍
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Informative Footer */}
        <div className="pt-2 mt-2 border-t border-slate-100 text-center">
          <p className="text-[10px] text-slate-400">
            Selecting an area updates distances across all hospital lists, doctor cards & booking steps.
          </p>
        </div>
      </div>
    </div>
  );
};
