import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MapPin,
  Hospital as HospitalIcon,
  Stethoscope,
  Navigation,
  Compass,
  Star,
  Clock,
  Phone,
  ChevronRight,
  Filter,
  Layers,
  Sparkles,
} from 'lucide-react';
import { HOSPITALS, DOCTORS } from '../../data/mockData';
import {
  getNearbyHospitals,
  getNearbyDoctors,
  HospitalWithDistance,
  DoctorWithDistance,
} from '../../utils/locationHelper';
import { TravelTimeCardSection } from '../navigation/TravelTimeCardSection';
import { LiveRouteNavigationModal, NavigationTarget } from '../navigation/LiveRouteNavigationModal';

interface NearbyCareExplorerProps {
  onOpenLocationModal: () => void;
}

export const NearbyCareExplorer: React.FC<NearbyCareExplorerProps> = ({
  onOpenLocationModal,
}) => {
  const { currentCity, currentArea, navigateTo } = useApp();

  const [activeTab, setActiveTab] = useState<'hospitals' | 'doctors' | 'radar'>('hospitals');
  const [selectedRadius, setSelectedRadius] = useState<number>(15); // in km
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
  const [navTarget, setNavTarget] = useState<NavigationTarget | null>(null);

  // Dynamically calculate nearby hospitals based on chosen location
  const nearbyHospitals = useMemo(() => {
    return getNearbyHospitals(currentCity, currentArea, HOSPITALS, selectedRadius);
  }, [currentCity, currentArea, selectedRadius]);

  // Dynamically calculate nearby doctors based on chosen location
  const nearbyDoctors = useMemo(() => {
    return getNearbyDoctors(currentCity, currentArea, DOCTORS, HOSPITALS, selectedRadius);
  }, [currentCity, currentArea, selectedRadius]);

  const selectedHospitalForRadar = useMemo(() => {
    if (!selectedMarkerId) return nearbyHospitals[0] || null;
    return nearbyHospitals.find((h) => h.id === selectedMarkerId) || nearbyHospitals[0] || null;
  }, [selectedMarkerId, nearbyHospitals]);

  return (
    <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-xs space-y-3.5">
      {/* Top Header: Location Banner & Distance Summary */}
      <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-start gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-[#087E8B] flex-shrink-0 mt-0.5">
            <Compass className="w-5 h-5 text-[#087E8B] animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200/60">
                Location Care Radar
              </span>
              <span className="text-[10px] font-semibold text-slate-400">
                • {nearbyHospitals.length} Hospitals & {nearbyDoctors.length} Doctors
              </span>
            </div>
            <h3 className="font-extrabold text-sm text-[#172B4D] leading-snug mt-0.5">
              Care Near {currentArea}, {currentCity}
            </h3>
            <p className="text-[11px] text-slate-500">
              Sorted by real-time distance from your chosen location
            </p>
          </div>
        </div>

        {/* Change Location Button */}
        <button
          onClick={onOpenLocationModal}
          className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#172B4D] text-[11px] font-bold rounded-xl transition-colors whitespace-nowrap border border-slate-200"
          title="Change location to see other areas"
        >
          <MapPin className="w-3.5 h-3.5 text-[#087E8B]" />
          <span>Change</span>
        </button>
      </div>

      {/* Radius Filters & Tab Switcher */}
      <div className="flex flex-col gap-2.5">
        {/* Radius Filter Pills */}
        <div className="flex items-center justify-between gap-1 text-[11px]">
          <span className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider">
            Radius:
          </span>
          <div className="flex gap-1 overflow-x-auto scrollbar-none">
            {[
              { label: 'All (<15 km)', val: 15 },
              { label: '< 2 km (Walking)', val: 2 },
              { label: '< 5 km (5-10m)', val: 5 },
            ].map((r) => (
              <button
                key={r.val}
                onClick={() => setSelectedRadius(r.val)}
                className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all ${
                  selectedRadius === r.val
                    ? 'bg-teal-700 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* View Tabs */}
        <div className="grid grid-cols-3 gap-1 bg-slate-100/80 p-1 rounded-2xl border border-slate-200/60">
          <button
            onClick={() => setActiveTab('hospitals')}
            className={`py-1.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'hospitals'
                ? 'bg-white text-[#172B4D] shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <HospitalIcon className="w-3.5 h-3.5 text-blue-600" />
            <span>Hospitals ({nearbyHospitals.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('doctors')}
            className={`py-1.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'doctors'
                ? 'bg-white text-[#172B4D] shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
            <span>Doctors ({nearbyDoctors.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('radar')}
            className={`py-1.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'radar'
                ? 'bg-white text-[#172B4D] shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Navigation className="w-3.5 h-3.5 text-rose-600" />
            <span>Map Radar</span>
          </button>
        </div>
      </div>

      {/* TAB 1: NEARBY HOSPITALS */}
      {activeTab === 'hospitals' && (
        <div className="space-y-2.5">
          {nearbyHospitals.length === 0 ? (
            <div className="text-center py-6 bg-slate-50 rounded-2xl border border-slate-200/60">
              <HospitalIcon className="w-8 h-8 text-slate-300 mx-auto mb-1.5" />
              <p className="text-xs font-bold text-slate-600">No hospitals found within {selectedRadius} km</p>
              <button
                onClick={() => setSelectedRadius(15)}
                className="mt-2 text-xs font-bold text-[#087E8B] hover:underline"
              >
                Expand radius to 15 km
              </button>
            </div>
          ) : (
            nearbyHospitals.slice(0, 4).map((hosp) => (
              <div
                key={hosp.id}
                onClick={() => navigateTo('book-appointment', { selectedHospitalId: hosp.id, step: 3 })}
                className="p-3 bg-white hover:bg-slate-50/70 border border-slate-200/80 rounded-2xl shadow-2xs hover:shadow-xs transition-all cursor-pointer group flex flex-col gap-2"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <img
                      src={hosp.imageUrl}
                      alt={hosp.name}
                      className="w-14 h-14 rounded-xl object-cover border border-slate-200 flex-shrink-0 group-hover:scale-105 transition-transform"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-xs text-[#172B4D] group-hover:text-[#087E8B] transition-colors leading-snug">
                          {hosp.name}
                        </h4>
                        {hosp.verified && (
                          <span className="text-[9px] font-black bg-blue-50 text-blue-700 px-1.5 py-0.2 rounded">
                            Verified
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                        {hosp.address}, {hosp.area}
                      </p>

                      {/* Live Distance Indicator */}
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                            hosp.isImmediate
                              ? 'bg-emerald-100 text-emerald-800'
                              : hosp.isNearby
                              ? 'bg-teal-100 text-teal-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          <span>{hosp.calculatedDistanceStr} away</span>
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          • {hosp.driveTimeStr}
                        </span>
                        <span className="text-[10px] text-amber-600 font-bold flex items-center gap-0.5">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{hosp.rating}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-1 rounded-xl group-hover:bg-[#087E8B] group-hover:text-white transition-all inline-block">
                      Book Slot
                    </span>
                  </div>
                </div>

                {/* Compact Distance, Travel Times (Car, Bike, Walk) & View Route */}
                <div className="pt-1">
                  <TravelTimeCardSection
                    distanceKm={hosp.calculatedDistanceKm}
                    onViewRoute={() =>
                      setNavTarget({
                        id: hosp.id,
                        name: hosp.name,
                        area: hosp.area,
                        city: hosp.city,
                        address: hosp.address,
                        type: hosp.type,
                      })
                    }
                  />
                </div>

                {/* Available Departments Tags */}
                <div className="flex items-center gap-1 overflow-x-auto pt-1 border-t border-slate-100 scrollbar-none">
                  {hosp.departments.slice(0, 3).map((dept) => (
                    <span
                      key={dept}
                      className="text-[9px] font-medium bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded whitespace-nowrap"
                    >
                      {dept}
                    </span>
                  ))}
                  {hosp.departments.length > 3 && (
                    <span className="text-[9px] text-slate-400 font-medium">
                      +{hosp.departments.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            ))
          )}

          {nearbyHospitals.length > 4 && (
            <button
              onClick={() => navigateTo('book-appointment', { step: 2 })}
              className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-1"
            >
              <span>View All {nearbyHospitals.length} Hospitals in {currentCity}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* TAB 2: NEARBY DOCTORS */}
      {activeTab === 'doctors' && (
        <div className="space-y-2.5">
          {nearbyDoctors.length === 0 ? (
            <div className="text-center py-6 bg-slate-50 rounded-2xl border border-slate-200/60">
              <Stethoscope className="w-8 h-8 text-slate-300 mx-auto mb-1.5" />
              <p className="text-xs font-bold text-slate-600">No doctors found within {selectedRadius} km</p>
              <button
                onClick={() => setSelectedRadius(15)}
                className="mt-2 text-xs font-bold text-[#087E8B] hover:underline"
              >
                Expand radius to 15 km
              </button>
            </div>
          ) : (
            nearbyDoctors.slice(0, 4).map((doc) => (
              <div
                key={doc.id}
                onClick={() => navigateTo('book-appointment', { selectedDoctorId: doc.id, step: 6 })}
                className="p-3 bg-white hover:bg-slate-50/70 border border-slate-200/80 rounded-2xl shadow-2xs hover:shadow-xs transition-all cursor-pointer group space-y-2"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <img
                      src={doc.imageUrl}
                      alt={doc.name}
                      className="w-13 h-13 rounded-xl object-cover border border-slate-200 flex-shrink-0 group-hover:scale-105 transition-transform"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-xs text-[#172B4D] group-hover:text-[#087E8B] transition-colors leading-snug">
                          {doc.name}
                        </h4>
                        {doc.verified && (
                          <span className="text-[9px] font-black bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded">
                            Verified
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-teal-700 font-semibold">{doc.specialty}</p>

                      {/* Hospital & Distance Badge */}
                      <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">
                        🏥 {doc.hospitalName} ({doc.hospitalArea})
                      </p>

                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full flex items-center gap-1 ${
                            doc.isImmediate
                              ? 'bg-emerald-100 text-emerald-800'
                              : doc.isNearby
                              ? 'bg-teal-100 text-teal-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          <span>{doc.calculatedDistanceStr} away</span>
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {doc.experienceYears} yrs exp
                        </span>
                        <span className="text-[10px] font-bold text-amber-600 flex items-center gap-0.5">
                          <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                          <span>{doc.rating}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-black text-[#172B4D]">₹{doc.consultationFee}</p>
                    <p className="text-[9px] text-emerald-700 font-semibold mt-0.5">
                      {doc.nextSlot ? doc.nextSlot.split(',')[0] : 'Available'}
                    </p>
                    <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-lg mt-1 inline-block group-hover:bg-[#087E8B] group-hover:text-white transition-all">
                      Book
                    </span>
                  </div>
                </div>

                {/* Compact Distance, Multi-Modal Travel Times & View Route */}
                <TravelTimeCardSection
                  distanceKm={doc.calculatedDistanceKm}
                  onViewRoute={() =>
                    setNavTarget({
                      id: doc.id,
                      name: doc.name,
                      specialty: doc.specialty,
                      hospitalName: doc.hospitalName,
                      area: doc.hospitalArea,
                      city: doc.hospitalCity,
                      type: 'doctor',
                    })
                  }
                />
              </div>
            ))
          )}

          {nearbyDoctors.length > 4 && (
            <button
              onClick={() => navigateTo('book-appointment', { step: 5 })}
              className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-1"
            >
              <span>View All {nearbyDoctors.length} Nearby Doctors</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* TAB 3: LIVE RADAR MAP MOCKUP */}
      {activeTab === 'radar' && (
        <div className="space-y-3">
          <div className="relative w-full h-56 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 rounded-2xl overflow-hidden p-3 border border-slate-700 shadow-inner flex items-center justify-center">
            {/* Background grid lines */}
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#087e8b_1px,transparent_1px)] [background-size:16px_16px]"></div>

            {/* Concentric radar circles */}
            <div className="absolute w-44 h-44 rounded-full border border-teal-500/20"></div>
            <div className="absolute w-32 h-32 rounded-full border border-teal-500/30"></div>
            <div className="absolute w-20 h-20 rounded-full border border-teal-500/40"></div>

            {/* Rotating radar sweep beam */}
            <div className="absolute w-44 h-44 rounded-full border-t-2 border-r-2 border-teal-400/30 animate-spin-slow pointer-events-none"></div>

            {/* Range distance tags */}
            <span className="absolute top-2 right-2 text-[9px] font-mono text-teal-400/80 bg-slate-950/70 px-1.5 py-0.5 rounded">
              Radar Radius: {selectedRadius} km
            </span>
            <span className="absolute bottom-2 left-2 text-[9px] font-mono text-teal-400/80 bg-slate-950/70 px-1.5 py-0.5 rounded">
              Center: {currentArea}
            </span>

            {/* Center Pin: You are Here */}
            <div className="relative z-10 flex flex-col items-center">
              <span className="relative flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-cyan-500 border-2 border-white"></span>
              </span>
              <span className="mt-1 px-2 py-0.5 bg-slate-900/90 text-cyan-300 font-extrabold text-[9px] rounded-full border border-cyan-500/40 whitespace-nowrap shadow-xs">
                📍 You ({currentArea})
              </span>
            </div>

            {/* Placed Markers for Nearby Hospitals */}
            {nearbyHospitals.slice(0, 5).map((hosp, idx) => {
              // Calculate radar positioning based on distance & angle
              const angle = (idx * 72 * Math.PI) / 180;
              const radiusRatio = Math.min(hosp.calculatedDistanceKm / selectedRadius, 0.85);
              const distancePx = 28 + radiusRatio * 65;
              const x = Math.cos(angle) * distancePx;
              const y = Math.sin(angle) * distancePx;

              const isSelected = selectedMarkerId === hosp.id;

              return (
                <div
                  key={hosp.id}
                  onClick={() => setSelectedMarkerId(hosp.id)}
                  style={{ transform: `translate(${x}px, ${y}px)` }}
                  className={`absolute z-20 cursor-pointer transition-transform hover:scale-125 flex flex-col items-center group`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] shadow-md transition-all ${
                      isSelected
                        ? 'bg-rose-500 ring-2 ring-white scale-110'
                        : 'bg-teal-600 hover:bg-teal-500'
                    }`}
                  >
                    🏥
                  </div>
                  <span className="mt-0.5 text-[8px] font-bold text-white bg-slate-950/80 px-1 py-0.2 rounded whitespace-nowrap border border-slate-700">
                    {hosp.name.split(' ')[0]} ({hosp.calculatedDistanceStr})
                  </span>
                </div>
              );
            })}
          </div>

          {/* Focused Facility Preview under Radar */}
          {selectedHospitalForRadar && (
            <div className="p-3 bg-teal-50/70 border border-teal-200/80 rounded-2xl flex items-center justify-between gap-3 animate-in fade-in">
              <div className="flex items-center gap-2.5">
                <img
                  src={selectedHospitalForRadar.imageUrl}
                  alt={selectedHospitalForRadar.name}
                  className="w-11 h-11 rounded-xl object-cover border border-teal-200"
                />
                <div>
                  <h5 className="font-bold text-xs text-[#172B4D]">
                    {selectedHospitalForRadar.name}
                  </h5>
                  <p className="text-[10px] text-teal-800 font-semibold">
                    📍 {selectedHospitalForRadar.calculatedDistanceStr} from {currentArea} • {selectedHospitalForRadar.driveTimeStr}
                  </p>
                </div>
              </div>

              <button
                onClick={() =>
                  navigateTo('book-appointment', {
                    selectedHospitalId: selectedHospitalForRadar.id,
                    step: 3,
                  })
                }
                className="px-3 py-1.5 bg-[#087E8B] hover:bg-[#06626D] text-white text-xs font-bold rounded-xl shadow-xs whitespace-nowrap transition-colors"
              >
                Book
              </button>
            </div>
          )}

          <button
            onClick={() => navigateTo('find-doctor')}
            className="w-full py-2.5 bg-[#087E8B] hover:bg-[#06626D] text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs"
          >
            <Compass className="w-4 h-4 text-teal-200" />
            <span>Launch City GIS Doctor & Clinic Map View</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Interactive Map & Live GPS Route Navigation Modal */}
      <LiveRouteNavigationModal
        isOpen={Boolean(navTarget)}
        onClose={() => setNavTarget(null)}
        target={navTarget}
      />
    </div>
  );
};
