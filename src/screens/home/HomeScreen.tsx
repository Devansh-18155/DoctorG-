import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Header } from '../../components/common/Header';
import { LanguageModal } from '../../components/common/LanguageModal';
import { LocationModal } from '../../components/common/LocationModal';
import { SmartLocationSearchModal } from '../../components/location/SmartLocationSearchModal';
import { LocationSuggestion } from '../../services/indiaLocationService';
import {
  Search,
  CalendarDays,
  Ambulance,
  Store,
  FlaskConical,
  PackagePlus,
  Droplet,
  Flower2,
  FileText,
  Clock,
  Users,
  Activity,
  ArrowRight,
  ShieldCheck,
  Star,
  MapPin,
  ChevronRight,
  AlertCircle,
  Sparkles,
  HeartHandshake,
  Mic,
  Compass,
  Navigation as NavigationIcon,
} from 'lucide-react';
import {
  HOSPITALS,
  DOCTORS,
  HEALTH_PACKAGES,
  DIAGNOSTIC_TESTS,
} from '../../data/mockData';
import { VoiceSearchModal } from '../../components/common/VoiceSearchModal';
import { getNearbyHospitals, getNearbyDoctors, HospitalWithDistance, DoctorWithDistance } from '../../utils/locationHelper';
import { LiveRouteNavigationModal, NavigationTarget } from '../../components/navigation/LiveRouteNavigationModal';

export const HomeScreen: React.FC = () => {
  const {
    navigateTo,
    appointments,
    t,
    currentCity,
    setCurrentCity,
    currentArea,
    setCurrentArea,
    requireAuth,
    showToast,
  } = useApp();

  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [navTarget, setNavTarget] = useState<NavigationTarget | null>(null);

  // Dynamically calculate nearby hospitals & doctors whenever current location changes
  const nearbyHospitals = useMemo(() => {
    return getNearbyHospitals(currentCity, currentArea, HOSPITALS);
  }, [currentCity, currentArea]);

  const nearbyDoctors = useMemo(() => {
    return getNearbyDoctors(currentCity, currentArea, DOCTORS, HOSPITALS);
  }, [currentCity, currentArea]);

  // Active Core Healthcare Services:
  // 1. Book Appointment
  // 2. Find Ambulance
  // 3. All Checkups
  // 4. Traditional Healing
  const SERVICES = [
    {
      id: 'book-appointment',
      title: t('bookAppointment') || 'Book Appointment',
      subtitle: 'Hospitals & Clinics',
      icon: CalendarDays,
      bgGradient: 'from-teal-50 to-emerald-50',
      iconColor: 'text-teal-700',
      badge: 'Queue Live',
      screen: 'book-appointment',
    },
    {
      id: 'find-ambulance',
      title: t('findAmbulance') || 'Find Ambulance',
      subtitle: 'Emergency & ALS',
      icon: Ambulance,
      bgGradient: 'from-rose-50 to-red-50',
      iconColor: 'text-rose-600',
      badge: '8 min ETA',
      screen: 'find-ambulance',
    },
    {
      id: 'all-checkups',
      title: t('allCheckups') || 'All Checkups',
      subtitle: 'Complete Packages',
      icon: PackagePlus,
      bgGradient: 'from-indigo-50 to-purple-50',
      iconColor: 'text-indigo-700',
      badge: 'Up to 60% OFF',
      screen: 'all-checkups',
    },
    {
      id: 'traditional-healing',
      title: t('traditionalHealing') || 'Traditional Healing',
      subtitle: 'Ayurveda & Holistic',
      icon: Flower2,
      bgGradient: 'from-emerald-50 to-teal-50',
      iconColor: 'text-emerald-700',
      badge: 'Guidance',
      screen: 'traditional-healing',
    },
  ];

  // Additional 4 shortcuts
  const SHORTCUTS = [
    {
      id: 'records',
      title: 'Health Records',
      icon: FileText,
      screen: 'health-records',
      color: 'bg-blue-50 text-blue-700',
    },
    {
      id: 'reminders',
      title: 'Medicine Reminder',
      icon: Clock,
      screen: 'reminders',
      color: 'bg-emerald-50 text-emerald-700',
    },
    {
      id: 'family',
      title: 'Family Health',
      icon: Users,
      screen: 'family-health',
      color: 'bg-purple-50 text-purple-700',
    },
    {
      id: 'tracker',
      title: 'Health Tracker',
      icon: Activity,
      screen: 'health-tracker',
      color: 'bg-amber-50 text-amber-700',
    },
  ];

  return (
    <div className="min-h-full pb-20 bg-[#F6F8FA]">
      {/* Header */}
      <Header
        onOpenLanguage={() => setIsLangOpen(true)}
        onOpenLocation={() => setIsLocationOpen(true)}
      />

      <div className="px-4 py-3 space-y-4">
        {/* Healthcare Services Grid */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <div>
              <h3 className="font-extrabold text-sm text-[#172B4D] tracking-tight">
                Healthcare Services
              </h3>
              <p className="text-[11px] text-slate-400">Everything you need for total wellness</p>
            </div>
            <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
              Verified Healthcare
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {SERVICES.map((srv) => {
              const Icon = srv.icon;
              return (
                <div
                  key={srv.id}
                  onClick={() => navigateTo(srv.screen)}
                  className={`bg-gradient-to-br ${srv.bgGradient} p-3 rounded-2xl border border-slate-200/60 shadow-2xs hover:shadow-md cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] flex flex-col justify-between min-h-[92px] group`}
                >
                  <div className="flex items-start justify-between">
                    <div className="w-8 h-8 rounded-xl bg-white shadow-2xs flex items-center justify-center group-hover:rotate-3 transition-transform">
                      <Icon className={`w-4 h-4 ${srv.iconColor}`} />
                    </div>
                    {srv.badge && (
                      <span className="bg-white/80 backdrop-blur-xs text-[9px] font-bold text-slate-700 px-1.5 py-0.5 rounded-md border border-slate-200/50">
                        {srv.badge}
                      </span>
                    )}
                  </div>

                  <div className="mt-2">
                    <h4 className="font-bold text-xs text-[#172B4D] leading-tight group-hover:text-[#087E8B] transition-colors">
                      {srv.title}
                    </h4>
                    <p className="text-[10px] text-slate-500 font-medium leading-none mt-1">
                      {srv.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4 ADDITIONAL SHORTCUTS */}
        <div>
          <div className="grid grid-cols-4 gap-2">
            {SHORTCUTS.map((sc) => {
              const Icon = sc.icon;
              return (
                <button
                  key={sc.id}
                  onClick={() => navigateTo(sc.screen)}
                  className="flex flex-col items-center p-2 rounded-xl bg-white border border-slate-200/70 hover:border-teal-400 shadow-2xs transition-all text-center"
                >
                  <div className={`w-8 h-8 rounded-xl ${sc.color} flex items-center justify-center mb-1`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold text-[#172B4D] leading-tight">
                    {sc.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* NEARBY HOSPITALS */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-extrabold text-sm text-[#172B4D]">Hospitals in {currentCity}</h3>
              <p className="text-[11px] text-slate-400">Verified multi-speciality centers</p>
            </div>
            <button
              onClick={() => navigateTo('book-appointment')}
              className="text-xs font-bold text-[#087E8B] hover:underline flex items-center gap-0.5"
            >
              <span>See All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
            {nearbyHospitals.slice(0, 6).map((hosp: HospitalWithDistance) => (
              <div
                key={hosp.id}
                onClick={() => navigateTo('book-appointment', { selectedHospitalId: hosp.id, step: 3 })}
                className="w-56 flex-shrink-0 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md cursor-pointer transition-all overflow-hidden"
              >
                <div className="relative h-28">
                  <img
                    src={hosp.imageUrl}
                    alt={hosp.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-[#172B4D]/85 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                    <MapPin className="w-3 h-3 text-emerald-400" />
                    <span>{hosp.calculatedDistanceStr} away</span>
                  </div>
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-xs text-slate-800 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 shadow-2xs">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span>{hosp.rating}</span>
                  </div>
                </div>

                <div className="p-3">
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                      {hosp.type}
                    </span>
                    {hosp.verified && (
                      <span className="text-[9px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.2 rounded flex items-center gap-0.5">
                        <ShieldCheck className="w-2.5 h-2.5" /> Verified
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-xs text-[#172B4D] truncate mt-1">
                    {hosp.name}
                  </h4>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">{hosp.address}</p>

                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">
                      <strong className="text-teal-700">{hosp.bedsAvailable}</strong> Beds
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setNavTarget({
                            id: hosp.id,
                            name: hosp.name,
                            area: hosp.area,
                            city: hosp.city,
                            address: hosp.address,
                            type: hosp.type,
                          });
                        }}
                        className="text-[10px] font-black text-amber-800 bg-amber-50 hover:bg-amber-100 px-1.5 py-0.5 rounded-lg border border-amber-300 flex items-center gap-0.5 transition-colors"
                        title="View live road route"
                      >
                        Route 📍
                      </button>
                      <span className="font-bold text-[#087E8B]">OPD →</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* POPULAR MEDICAL TESTS */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-extrabold text-sm text-[#172B4D]">Popular Diagnostic Tests</h3>
              <p className="text-[11px] text-slate-400">Certified NABL accredited labs</p>
            </div>
            <button
              onClick={() => navigateTo('medical-checkup')}
              className="text-xs font-bold text-[#087E8B] hover:underline"
            >
              All Tests
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {DIAGNOSTIC_TESTS.slice(0, 4).map((test) => (
              <div
                key={test.id}
                onClick={() => navigateTo('medical-checkup', { selectedTestId: test.id })}
                className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md cursor-pointer transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-[9px] font-bold bg-sky-50 text-sky-700 px-1.5 py-0.2 rounded">
                    {test.category}
                  </span>
                  <h4 className="font-bold text-xs text-[#172B4D] mt-1.5 leading-snug line-clamp-2">
                    {test.name}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">{test.labName}</p>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#172B4D]">₹{test.price}</span>
                  <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-lg">
                    Book
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* HEALTH TIPS & PROTOCOLS */}
        <div className="bg-gradient-to-r from-teal-800 to-[#172B4D] rounded-2xl p-4 text-white shadow-sm">
          <div className="flex items-center gap-1.5 text-teal-300 text-[10px] font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Doctor G Health Insight</span>
          </div>
          <h4 className="font-bold text-xs text-white mb-1">
            Hydration & Blood Pressure In Seasonal Weather
          </h4>
          <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
            Ensure at least 2.5 liters of clean water daily. Avoid excess caffeine if your systolic blood pressure tends to cross 130 mmHg.
          </p>
          <button
            onClick={() => navigateTo('health-tracker')}
            className="text-xs font-bold text-teal-300 hover:text-white flex items-center gap-1"
          >
            <span>Log Today's Water & Vitals</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Realistic Demo Data Disclaimer Badge */}
        <div className="p-3 bg-slate-100 rounded-xl text-center border border-slate-200/60">
          <p className="text-[10px] text-slate-500 leading-tight">
            <strong>Demonstration Healthcare Environment:</strong> Doctor names, hospitals, ratings & blood availability are simulated for interface evaluation. For active medical emergencies, immediately dial <strong>108</strong> or <strong>112</strong>.
          </p>
        </div>
      </div>

      <LanguageModal isOpen={isLangOpen} onClose={() => setIsLangOpen(false)} />
      <SmartLocationSearchModal
        isOpen={isLocationOpen}
        onClose={() => setIsLocationOpen(false)}
        onSelectLocation={(loc: LocationSuggestion) => {
          setCurrentCity(loc.city);
          if (loc.locality) {
            setCurrentArea(loc.locality);
          }
          showToast(`Location set to ${loc.name}, ${loc.city}`, 'success');
        }}
        currentLocationName={currentArea ? `${currentArea}, ${currentCity}` : currentCity}
      />
      <VoiceSearchModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onSearch={(spokenText) => navigateTo('search', { initialQuery: spokenText })}
      />
      <LiveRouteNavigationModal
        isOpen={Boolean(navTarget)}
        onClose={() => setNavTarget(null)}
        target={navTarget}
      />
    </div>
  );
};
