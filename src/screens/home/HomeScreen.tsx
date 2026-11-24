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
import { NearbyCareExplorer } from '../../components/common/NearbyCareExplorer';
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

  // Find next upcoming appointment
  const upcomingAppointment = appointments.find(
    (apt) => apt.bookingStatus === 'UPCOMING'
  );

  // Active Service Cards:
  // 1. Book Appointment
  // 2. Find Ambulance
  // 3. Medical Store
  // 4. Medical Checkup
  // 5. All Checkups
  // 6. Blood Bank
  // 7. Traditional Healing
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
      id: 'medical-store',
      title: t('medicalStore') || 'Medical Store',
      subtitle: 'Doorstep Delivery',
      icon: Store,
      bgGradient: 'from-amber-50 to-orange-50',
      iconColor: 'text-amber-700',
      badge: 'Flat 15% OFF',
      screen: 'medical-store',
    },
    {
      id: 'medical-checkup',
      title: t('medicalCheckup') || 'Medical Checkup',
      subtitle: 'Individual Lab Tests',
      icon: FlaskConical,
      bgGradient: 'from-sky-50 to-cyan-50',
      iconColor: 'text-sky-700',
      badge: 'Home Sample',
      screen: 'medical-checkup',
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
      id: 'blood-bank',
      title: t('bloodBank') || 'Blood Bank',
      subtitle: 'Stock & Donors',
      icon: Droplet,
      bgGradient: 'from-rose-50 to-pink-50',
      iconColor: 'text-rose-700',
      badge: 'Verified Units',
      screen: 'blood-bank',
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
        {/* Prominent Search Bar with Mic button */}
        <div
          onClick={() => navigateTo('search')}
          className="flex items-center gap-2.5 bg-white border border-slate-200/90 rounded-2xl px-3.5 py-2.5 shadow-xs hover:border-teal-500 hover:shadow-sm cursor-pointer transition-all group"
        >
          <Search className="w-4 h-4 text-slate-400 group-hover:text-[#087E8B] transition-colors" />
          <span className="text-xs text-slate-400 group-hover:text-slate-600 flex-1 truncate">
            {t('searchPlaceholder') || 'Search hospitals, medicines, tests...'}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsVoiceModalOpen(true);
              }}
              className="p-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-[#087E8B] hover:scale-105 active:scale-95 transition-all shadow-2xs flex items-center gap-1 border border-teal-200/50"
              title="Voice Search Everything"
            >
              <Mic className="w-3.5 h-3.5 text-[#087E8B]" />
              <span className="text-[10px] font-bold">Voice</span>
            </button>
            <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-xl border border-slate-200">
              Search
            </span>
          </div>
        </div>

        {/* Upcoming Appointment Card (if available) */}
        {upcomingAppointment && (
          <div className="bg-white rounded-2xl p-3.5 border border-teal-200/80 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#087E8B] text-white text-[9px] font-extrabold px-2.5 py-0.5 rounded-bl-lg uppercase tracking-wide">
              Patient Number: #{String(upcomingAppointment.patientNumber || upcomingAppointment.tokenNumber).padStart(3, '0')}
            </div>

            <div className="flex items-start gap-3">
              <img
                src={upcomingAppointment.doctorImage}
                alt={upcomingAppointment.doctorName}
                className="w-12 h-12 rounded-xl object-cover border border-slate-200 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
                    Upcoming Appointment
                  </span>
                </div>
                <h4 className="font-bold text-xs text-[#172B4D] truncate mt-1">
                  {upcomingAppointment.doctorName}
                </h4>
                <p className="text-[11px] text-slate-500 truncate">
                  {upcomingAppointment.department} • {upcomingAppointment.hospitalName}
                </p>
                <p className="text-[11px] font-semibold text-slate-700 mt-1">
                  📅 {upcomingAppointment.date} at {upcomingAppointment.timeSlot}
                </p>
              </div>
            </div>

            {/* Quick Live Queue Tracker Bar */}
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
              <div>
                <span className="text-[11px] text-slate-500">Queue Status: </span>
                <span className="font-bold text-emerald-700">
                  Current Patient: #{String(upcomingAppointment.currentToken).padStart(3, '0')}
                </span>
                <span className="text-[10px] text-slate-400 ml-1">
                  (OPD: {upcomingAppointment.opdRoom || 'OPD 03'} • ~{upcomingAppointment.estimatedWaitMinutes}m wait)
                </span>
              </div>
              <button
                onClick={() => navigateTo('live-queue', { appointment: upcomingAppointment })}
                className="flex items-center gap-1 text-[11px] font-bold text-[#087E8B] hover:text-[#06626D]"
              >
                <span>Track Queue</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* EXACTLY 8 HEALTHCARE SERVICES GRID */}
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

        {/* DYNAMIC NEARBY CARE RADAR & LOCATION EXPLORER */}
        <NearbyCareExplorer onOpenLocationModal={() => setIsLocationOpen(true)} />

        {/* FEATURED DOCTORS */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-extrabold text-sm text-[#172B4D]">Featured Doctors</h3>
              <p className="text-[11px] text-slate-400">Book OPD or video consultation</p>
            </div>
            <button
              onClick={() => navigateTo('book-appointment')}
              className="text-xs font-bold text-[#087E8B] hover:underline flex items-center gap-0.5"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
            {nearbyDoctors.slice(0, 5).map((doc: DoctorWithDistance) => (
              <div
                key={doc.id}
                onClick={() => navigateTo('book-appointment', { selectedDoctorId: doc.id, step: 6 })}
                className="w-48 flex-shrink-0 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md cursor-pointer transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative mb-2">
                    <img
                      src={doc.imageUrl}
                      alt={doc.name}
                      className="w-full h-24 rounded-xl object-cover"
                    />
                    <div className="absolute top-1.5 left-1.5 bg-[#172B4D]/85 backdrop-blur-xs px-1.5 py-0.5 rounded-full text-[9px] font-bold text-teal-300 flex items-center gap-0.5 shadow-2xs">
                      <span>{doc.calculatedDistanceStr} away</span>
                    </div>
                    <div className="absolute top-1.5 right-1.5 bg-white/90 backdrop-blur-xs px-1.5 py-0.5 rounded text-[10px] font-bold text-slate-800 flex items-center gap-0.5 shadow-2xs">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span>{doc.rating}</span>
                    </div>
                  </div>

                  <h4 className="font-bold text-xs text-[#172B4D] truncate">{doc.name}</h4>
                  <p className="text-[10px] text-teal-700 font-semibold truncate">{doc.specialty}</p>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">{doc.hospitalName}</p>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
                  <span className="text-xs font-extrabold text-[#172B4D]">
                    ₹{doc.consultationFee}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setNavTarget({
                          id: doc.id,
                          name: doc.name,
                          specialty: doc.specialty,
                          hospitalName: doc.hospitalName,
                          area: doc.hospitalArea,
                          city: doc.hospitalCity,
                          type: 'doctor',
                        });
                      }}
                      className="bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-black px-1.5 py-1 rounded-lg transition-colors flex items-center gap-0.5"
                      title="View live road route"
                    >
                      Route 📍
                    </button>
                    <button className="bg-teal-50 hover:bg-teal-100 text-[#087E8B] text-[10px] font-bold px-2 py-1 rounded-lg transition-colors">
                      Book
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RECOMMENDED HEALTH PACKAGES */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-extrabold text-sm text-[#172B4D]">Recommended Packages</h3>
              <p className="text-[11px] text-slate-400">Preventive body checkups at home</p>
            </div>
            <button
              onClick={() => navigateTo('all-checkups')}
              className="text-xs font-bold text-[#087E8B] hover:underline flex items-center gap-0.5"
            >
              <span>Explore</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {HEALTH_PACKAGES.slice(0, 2).map((pkg) => (
              <div
                key={pkg.id}
                onClick={() => navigateTo('all-checkups', { packageId: pkg.id })}
                className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md cursor-pointer transition-all flex items-center justify-between gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {pkg.popularTag && (
                      <span className="text-[9px] font-extrabold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded">
                        {pkg.popularTag}
                      </span>
                    )}
                    <span className="text-[10px] font-medium text-slate-400">
                      {pkg.testsCount} Tests Included
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-[#172B4D] truncate">{pkg.name}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 truncate">{pkg.labName}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-sm font-extrabold text-[#172B4D]">₹{pkg.price}</span>
                    <span className="text-xs text-slate-400 line-through">₹{pkg.mrp}</span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded">
                      {pkg.discountPercent}% OFF
                    </span>
                  </div>
                </div>

                <button className="px-3 py-2 bg-[#087E8B] hover:bg-[#06626D] text-white rounded-xl text-xs font-bold shadow-xs flex-shrink-0">
                  Book Test
                </button>
              </div>
            ))}
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
