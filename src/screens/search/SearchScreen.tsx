import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  X,
  History,
  TrendingUp,
  Hospital as HospitalIcon,
  Stethoscope,
  Pill,
  FlaskConical,
  PackagePlus,
  Ambulance,
  Droplet,
  ChevronLeft,
  ChevronRight,
  Filter,
  Mic,
  Sparkles,
  Flower2,
  Calendar,
  Clock,
  PhoneCall,
  Video,
  FileText,
  Activity,
  Users,
} from 'lucide-react';
import {
  HOSPITALS,
  DOCTORS,
  MEDICINE_PRODUCTS,
  DIAGNOSTIC_TESTS,
  HEALTH_PACKAGES,
  AMBULANCE_SERVICES,
  BLOOD_BANKS,
  TRADITIONAL_PRACTITIONERS,
} from '../../data/mockData';
import { VoiceSearchModal } from '../../components/common/VoiceSearchModal';

const APP_SERVICES_DATA = [
  {
    id: 'svc-appointment',
    name: 'Book Doctor Appointment',
    keywords: ['doctor', 'appointment', 'booking', 'hospital', 'clinic', 'consult'],
    screen: 'book-appointment',
    icon: Calendar,
    color: 'bg-teal-50 text-teal-700',
    desc: 'Instant clinic & hospital slot booking with live patient queue',
  },
  {
    id: 'svc-ambulance',
    name: 'Find & Dispatch Ambulance',
    keywords: ['ambulance', 'emergency', 'van', 'icu', 'als', '108', 'sos'],
    screen: 'find-ambulance',
    icon: Ambulance,
    color: 'bg-rose-50 text-rose-700',
    desc: 'GPS tracked Basic, Oxygen & ICU Cardiac ambulances',
  },
  {
    id: 'svc-store',
    name: 'Medical Store & Pharmacy',
    keywords: ['medicine', 'pharmacy', 'store', 'tablet', 'syrup', 'drugs', 'rx'],
    screen: 'medical-store',
    icon: Pill,
    color: 'bg-amber-50 text-amber-700',
    desc: 'Order genuine medicines with Rx upload & doorstep delivery',
  },
  {
    id: 'svc-checkup',
    name: 'Medical Checkup & Lab Tests',
    keywords: ['lab', 'test', 'blood test', 'checkup', 'pathology', 'xray', 'mri'],
    screen: 'medical-checkup',
    icon: FlaskConical,
    color: 'bg-sky-50 text-sky-700',
    desc: 'Book home sample collection from NABL accredited labs',
  },
  {
    id: 'svc-packages',
    name: 'Health Checkup Packages',
    keywords: ['package', 'full body', 'health check', 'preventive', 'annual'],
    screen: 'all-checkups',
    icon: PackagePlus,
    color: 'bg-purple-50 text-purple-700',
    desc: 'Curated preventive packages with doctor consultation',
  },
  {
    id: 'svc-consult',
    name: 'Online Video Consultation',
    keywords: ['online', 'video', 'call', 'consultation', 'chat doctor', 'telehealth'],
    screen: 'online-consultation',
    icon: Video,
    color: 'bg-indigo-50 text-indigo-700',
    desc: 'Connect with verified specialists in 10 minutes from home',
  },
  {
    id: 'svc-blood',
    name: 'Blood Bank & Donor Network',
    keywords: ['blood', 'donor', 'plasma', 'platelets', 'transfusion', 'o+', 'a+', 'b+', 'ab+'],
    screen: 'blood-bank',
    icon: Droplet,
    color: 'bg-red-50 text-red-700',
    desc: 'Live verified blood units across certified hospital banks',
  },
  {
    id: 'svc-traditional',
    name: 'Traditional Healing & AYUSH',
    keywords: ['ayurveda', 'ayush', 'homeopathy', 'yoga', 'naturopathy', 'unani', 'herbal'],
    screen: 'traditional-healing',
    icon: Flower2,
    color: 'bg-emerald-50 text-emerald-700',
    desc: 'Certified practitioners in Ayurveda, Homeopathy & Yoga',
  },
  {
    id: 'svc-reminders',
    name: 'Medicine Pill Reminder',
    keywords: ['reminder', 'pill', 'alarm', 'medicine reminder', 'schedule'],
    screen: 'medicine-reminders',
    icon: Clock,
    color: 'bg-orange-50 text-orange-700',
    desc: 'Daily medicine intake reminders and refill alerts',
  },
  {
    id: 'svc-records',
    name: 'Digital Health Records',
    keywords: ['records', 'prescriptions', 'reports', 'ehr', 'vault', 'medical history'],
    screen: 'health-records',
    icon: FileText,
    color: 'bg-blue-50 text-blue-700',
    desc: 'Secure cloud locker for lab reports and prescriptions',
  },
  {
    id: 'svc-tracker',
    name: 'Vitals & Health Tracker',
    keywords: ['tracker', 'bp', 'sugar', 'vitals', 'heart rate', 'spo2', 'bmi'],
    screen: 'health-tracker',
    icon: Activity,
    color: 'bg-pink-50 text-pink-700',
    desc: 'Track blood pressure, blood glucose, heart rate and SpO2',
  },
];

type FilterCategory =
  | 'All'
  | 'Services'
  | 'Doctors'
  | 'Hospitals'
  | 'Medicines'
  | 'Tests'
  | 'Packages'
  | 'Ambulances'
  | 'Blood Banks'
  | 'Traditional';

export const SearchScreen: React.FC = () => {
  const { navigateTo, goBack, screenParams } = useApp();

  const [query, setQuery] = useState(screenParams?.initialQuery || '');
  const [selectedFilter, setSelectedFilter] = useState<FilterCategory>('All');
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState<boolean>(
    screenParams?.startVoice || false
  );

  const [searchHistory, setSearchHistory] = useState<string[]>([
    'Cardiologist in Salt Lake',
    'Augmentin 625',
    'Full Body Checkup',
    'Apollo Hospital',
    'Blood Group O+',
    'ICU Ambulance',
  ]);

  const trendingSearches = [
    'Dr. Arindam Mukherjee',
    'Lipid Profile Test',
    'Dolo 650',
    'Blood Group B+',
    'ICU Ambulance',
    'Ayurvedic Doctor',
    'Online Consultation',
  ];

  // Auto-handle initialQuery changes if passed from outside
  useEffect(() => {
    if (screenParams?.initialQuery) {
      setQuery(screenParams.initialQuery);
      addSearchHistory(screenParams.initialQuery);
    }
    if (screenParams?.startVoice) {
      setIsVoiceModalOpen(true);
    }
  }, [screenParams]);

  const addSearchHistory = (text: string) => {
    if (!text.trim()) return;
    setSearchHistory((prev) => [text, ...prev.filter((h) => h.toLowerCase() !== text.toLowerCase())].slice(0, 8));
  };

  const clearHistoryItem = (item: string) => {
    setSearchHistory((prev) => prev.filter((h) => h !== item));
  };

  const handleVoiceSearchResult = (spokenText: string) => {
    setQuery(spokenText);
    addSearchHistory(spokenText);
  };

  // Filtered categorized results covering EVERYTHING in the app
  const results = useMemo(() => {
    if (!query.trim()) return null;
    const q = query.toLowerCase().trim();

    // App Services & Core Features
    const matchedServices = APP_SERVICES_DATA.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.desc.toLowerCase().includes(q) ||
        s.keywords.some((kw) => kw.includes(q) || q.includes(kw))
    );

    // Doctors
    const matchedDoctors = DOCTORS.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.specialty.toLowerCase().includes(q) ||
        d.hospitalName.toLowerCase().includes(q) ||
        d.qualification.toLowerCase().includes(q)
    );

    // Hospitals
    const matchedHospitals = HOSPITALS.filter(
      (h) =>
        h.name.toLowerCase().includes(q) ||
        h.area.toLowerCase().includes(q) ||
        h.city.toLowerCase().includes(q) ||
        h.departments.some((dept) => dept.toLowerCase().includes(q))
    );

    // Medicines
    const matchedMedicines = MEDICINE_PRODUCTS.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.composition.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q) ||
        m.brand.toLowerCase().includes(q)
    );

    // Diagnostic Tests
    const matchedTests = DIAGNOSTIC_TESTS.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.labName.toLowerCase().includes(q)
    );

    // Health Packages
    const matchedPackages = HEALTH_PACKAGES.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );

    // Ambulances
    const matchedAmbulances = AMBULANCE_SERVICES.filter(
      (a) =>
        a.providerName.toLowerCase().includes(q) ||
        a.type.toLowerCase().includes(q) ||
        a.tagline.toLowerCase().includes(q) ||
        a.vehicleNo.toLowerCase().includes(q) ||
        q.includes('ambulance')
    );

    // Blood Banks
    const matchedBloodBanks = BLOOD_BANKS.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.city.toLowerCase().includes(q) ||
        b.area.toLowerCase().includes(q) ||
        q.includes('blood') ||
        Object.keys(b.stock).some((group) => q.includes(group.toLowerCase()))
    );

    // Traditional AYUSH Healers
    const matchedTraditional = TRADITIONAL_PRACTITIONERS.filter(
      (tp) =>
        tp.name.toLowerCase().includes(q) ||
        tp.type.toLowerCase().includes(q) ||
        tp.description.toLowerCase().includes(q) ||
        tp.location.toLowerCase().includes(q) ||
        tp.services.some((s) => s.toLowerCase().includes(q))
    );

    const totalCount =
      matchedServices.length +
      matchedDoctors.length +
      matchedHospitals.length +
      matchedMedicines.length +
      matchedTests.length +
      matchedPackages.length +
      matchedAmbulances.length +
      matchedBloodBanks.length +
      matchedTraditional.length;

    return {
      services: matchedServices,
      doctors: matchedDoctors,
      hospitals: matchedHospitals,
      medicines: matchedMedicines,
      tests: matchedTests,
      packages: matchedPackages,
      ambulances: matchedAmbulances,
      bloodBanks: matchedBloodBanks,
      traditional: matchedTraditional,
      totalCount,
    };
  }, [query]);

  const filterTabs: FilterCategory[] = [
    'All',
    'Services',
    'Doctors',
    'Hospitals',
    'Medicines',
    'Tests',
    'Packages',
    'Ambulances',
    'Blood Banks',
    'Traditional',
  ];

  return (
    <div className="min-h-full pb-20 bg-white">
      {/* Search Header */}
      <div className="p-4 border-b border-slate-100 sticky top-0 bg-white z-20 shadow-2xs">
        <div className="flex items-center gap-2">
          <button
            onClick={goBack}
            className="p-1.5 -ml-1 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-100 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex-1 relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  addSearchHistory(query);
                }
              }}
              placeholder="Search doctors, medicines, tests, ambulance..."
              className="w-full pl-9 pr-18 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-medium"
            />

            <div className="absolute right-2 flex items-center gap-1">
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-200"
                  title="Clear text"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Voice Search Mic Button inside input bar */}
              <button
                type="button"
                onClick={() => setIsVoiceModalOpen(true)}
                className="p-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-[#087E8B] hover:scale-105 active:scale-95 transition-all shadow-2xs"
                title="Search with Voice"
              >
                <Mic className="w-4 h-4 text-[#087E8B]" />
              </button>
            </div>
          </div>
        </div>

        {/* Filters chips */}
        <div className="flex gap-1.5 overflow-x-auto pt-2.5 scrollbar-none">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedFilter(tab)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedFilter === tab
                  ? 'bg-[#087E8B] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Main Search Content */}
      <div className="p-4 space-y-5">
        {/* If no query: Show Voice Search Promo, History, Trending & Quick Category tiles */}
        {!query.trim() && (
          <>
            {/* Prominent Voice Search Hero Card */}
            <div
              onClick={() => setIsVoiceModalOpen(true)}
              className="bg-gradient-to-r from-teal-600 to-[#087E8B] rounded-2xl p-4 text-white shadow-md cursor-pointer hover:shadow-lg transition-all flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Mic className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-xs uppercase tracking-wider text-teal-100">
                      Doctor G Voice Search
                    </span>
                    <span className="bg-amber-400 text-slate-900 text-[9px] font-extrabold px-1.5 py-0.2 rounded-full">
                      MIC
                    </span>
                  </div>
                  <p className="text-xs font-medium text-white/95 mt-0.5">
                    Tap to search everything by speaking in English or Hindi
                  </p>
                </div>
              </div>
              <div className="px-3 py-1.5 bg-white text-[#087E8B] font-bold text-xs rounded-xl shadow-xs whitespace-nowrap flex items-center gap-1">
                <span>Speak</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Search History */}
            {searchHistory.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5 text-slate-400" />
                    <span>Recent Searches</span>
                  </h4>
                  <button
                    onClick={() => setSearchHistory([])}
                    className="text-[11px] font-semibold text-rose-500 hover:underline"
                  >
                    Clear All
                  </button>
                </div>
                <div className="space-y-1">
                  {searchHistory.map((item) => (
                    <div
                      key={item}
                      className="flex items-center justify-between py-2 px-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
                      onClick={() => setQuery(item)}
                    >
                      <span className="text-xs text-slate-700 font-medium group-hover:text-[#087E8B]">
                        {item}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          clearHistoryItem(item);
                        }}
                        className="text-slate-300 hover:text-slate-500 p-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trending Searches */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-teal-600" />
                <span>Trending Searches</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {trendingSearches.map((item) => (
                  <button
                    key={item}
                    onClick={() => setQuery(item)}
                    className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-teal-500 text-xs font-medium text-slate-700 hover:text-[#087E8B] hover:bg-teal-50/50 transition-all flex items-center gap-1.5"
                  >
                    <span>{item}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Browse Categories */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Browse Entire Platform
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => navigateTo('book-appointment')}
                  className="p-3 rounded-2xl bg-teal-50/60 border border-teal-100 flex items-center gap-3 text-left hover:bg-teal-100/60 transition-colors"
                >
                  <Stethoscope className="w-5 h-5 text-[#087E8B]" />
                  <div>
                    <h5 className="font-bold text-xs text-[#172B4D]">Doctors & Clinics</h5>
                    <p className="text-[10px] text-slate-500">14 Specialities</p>
                  </div>
                </button>

                <button
                  onClick={() => navigateTo('medical-store')}
                  className="p-3 rounded-2xl bg-amber-50/60 border border-amber-100 flex items-center gap-3 text-left hover:bg-amber-100/60 transition-colors"
                >
                  <Pill className="w-5 h-5 text-amber-700" />
                  <div>
                    <h5 className="font-bold text-xs text-[#172B4D]">Medicines & Rx</h5>
                    <p className="text-[10px] text-slate-500">Doorstep Delivery</p>
                  </div>
                </button>

                <button
                  onClick={() => navigateTo('medical-checkup')}
                  className="p-3 rounded-2xl bg-sky-50/60 border border-sky-100 flex items-center gap-3 text-left hover:bg-sky-100/60 transition-colors"
                >
                  <FlaskConical className="w-5 h-5 text-sky-700" />
                  <div>
                    <h5 className="font-bold text-xs text-[#172B4D]">Lab Tests</h5>
                    <p className="text-[10px] text-slate-500">Home Collection</p>
                  </div>
                </button>

                <button
                  onClick={() => navigateTo('all-checkups')}
                  className="p-3 rounded-2xl bg-purple-50/60 border border-purple-100 flex items-center gap-3 text-left hover:bg-purple-100/60 transition-colors"
                >
                  <PackagePlus className="w-5 h-5 text-purple-700" />
                  <div>
                    <h5 className="font-bold text-xs text-[#172B4D]">Health Packages</h5>
                    <p className="text-[10px] text-slate-500">Up to 60% OFF</p>
                  </div>
                </button>

                <button
                  onClick={() => navigateTo('find-ambulance')}
                  className="p-3 rounded-2xl bg-rose-50/60 border border-rose-100 flex items-center gap-3 text-left hover:bg-rose-100/60 transition-colors"
                >
                  <Ambulance className="w-5 h-5 text-rose-700" />
                  <div>
                    <h5 className="font-bold text-xs text-[#172B4D]">Ambulance</h5>
                    <p className="text-[10px] text-slate-500">GPS SOS Dispatch</p>
                  </div>
                </button>

                <button
                  onClick={() => navigateTo('blood-bank')}
                  className="p-3 rounded-2xl bg-red-50/60 border border-red-100 flex items-center gap-3 text-left hover:bg-red-100/60 transition-colors"
                >
                  <Droplet className="w-5 h-5 text-red-700" />
                  <div>
                    <h5 className="font-bold text-xs text-[#172B4D]">Blood Bank</h5>
                    <p className="text-[10px] text-slate-500">Live Availability</p>
                  </div>
                </button>
              </div>
            </div>
          </>
        )}

        {/* If query has results */}
        {results && (
          <div>
            {results.totalCount === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
                  <Search className="w-8 h-8" />
                </div>
                <h4 className="text-sm font-bold text-[#172B4D]">No matches found for "{query}"</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  Try speaking or searching with keywords like doctor specialty, medicine salt name, test, or ambulance.
                </p>
                <div className="flex items-center justify-center gap-2 mt-4">
                  <button
                    onClick={() => setIsVoiceModalOpen(true)}
                    className="px-4 py-2 bg-[#087E8B] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>Try Voice Search</span>
                  </button>
                  <button
                    onClick={() => setQuery('')}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                  >
                    Clear Search
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                {/* APP SERVICES / DIRECT SHORTCUTS */}
                {(selectedFilter === 'All' || selectedFilter === 'Services') &&
                  results.services.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>Services & Actions ({results.services.length})</span>
                      </h4>
                      <div className="space-y-2">
                        {results.services.map((svc) => {
                          const IconComp = svc.icon;
                          return (
                            <div
                              key={svc.id}
                              onClick={() => navigateTo(svc.screen)}
                              className="p-3 bg-white border border-slate-200/80 rounded-2xl shadow-2xs hover:shadow-md cursor-pointer transition-all flex items-center justify-between"
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${svc.color}`}
                                >
                                  <IconComp className="w-5 h-5" />
                                </div>
                                <div>
                                  <h5 className="font-bold text-xs text-[#172B4D]">{svc.name}</h5>
                                  <p className="text-[10px] text-slate-500">{svc.desc}</p>
                                </div>
                              </div>
                              <span className="text-[10px] font-bold text-[#087E8B] bg-teal-50 px-2 py-1 rounded-lg">
                                Open
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                {/* DOCTORS RESULTS */}
                {(selectedFilter === 'All' || selectedFilter === 'Doctors') &&
                  results.doctors.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                        <span>Doctors ({results.doctors.length})</span>
                      </h4>
                      <div className="space-y-2">
                        {results.doctors.map((doc) => (
                          <div
                            key={doc.id}
                            onClick={() =>
                              navigateTo('book-appointment', { selectedDoctorId: doc.id, step: 6 })
                            }
                            className="p-3 bg-white border border-slate-200/80 rounded-2xl shadow-2xs hover:shadow-md cursor-pointer transition-all flex items-center justify-between"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={doc.imageUrl}
                                alt={doc.name}
                                className="w-12 h-12 rounded-xl object-cover"
                              />
                              <div>
                                <h5 className="font-bold text-xs text-[#172B4D]">{doc.name}</h5>
                                <p className="text-[11px] text-teal-700 font-semibold">
                                  {doc.specialty}
                                </p>
                                <p className="text-[10px] text-slate-400">{doc.hospitalName}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xs font-bold text-[#172B4D]">
                                ₹{doc.consultationFee}
                              </p>
                              <span className="text-[10px] font-bold text-[#087E8B] bg-teal-50 px-2 py-0.5 rounded-lg mt-1 inline-block">
                                Book
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* HOSPITALS RESULTS */}
                {(selectedFilter === 'All' || selectedFilter === 'Hospitals') &&
                  results.hospitals.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <HospitalIcon className="w-3.5 h-3.5 text-blue-600" />
                        <span>Hospitals ({results.hospitals.length})</span>
                      </h4>
                      <div className="space-y-2">
                        {results.hospitals.map((hosp) => (
                          <div
                            key={hosp.id}
                            onClick={() =>
                              navigateTo('book-appointment', {
                                selectedHospitalId: hosp.id,
                                step: 3,
                              })
                            }
                            className="p-3 bg-white border border-slate-200/80 rounded-2xl shadow-2xs hover:shadow-md cursor-pointer transition-all flex items-center justify-between"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={hosp.imageUrl}
                                alt={hosp.name}
                                className="w-12 h-12 rounded-xl object-cover"
                              />
                              <div>
                                <h5 className="font-bold text-xs text-[#172B4D]">{hosp.name}</h5>
                                <p className="text-[10px] text-slate-500">
                                  {hosp.area}, {hosp.city} • {hosp.distance}
                                </p>
                                <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded mt-1 inline-block">
                                  {hosp.type}
                                </span>
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-400" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* MEDICINES RESULTS */}
                {(selectedFilter === 'All' || selectedFilter === 'Medicines') &&
                  results.medicines.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Pill className="w-3.5 h-3.5 text-amber-600" />
                        <span>Medicines ({results.medicines.length})</span>
                      </h4>
                      <div className="space-y-2">
                        {results.medicines.map((med) => (
                          <div
                            key={med.id}
                            onClick={() => navigateTo('medical-store', { productId: med.id })}
                            className="p-3 bg-white border border-slate-200/80 rounded-2xl shadow-2xs hover:shadow-md cursor-pointer transition-all flex items-center justify-between"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={med.imageUrl}
                                alt={med.name}
                                className="w-12 h-12 rounded-xl object-cover border border-slate-100"
                              />
                              <div>
                                <h5 className="font-bold text-xs text-[#172B4D]">{med.name}</h5>
                                <p className="text-[10px] text-slate-500">{med.composition}</p>
                                <p className="text-[10px] text-slate-400">{med.brand}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xs font-extrabold text-[#172B4D]">₹{med.price}</p>
                              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">
                                In Stock
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* TESTS RESULTS */}
                {(selectedFilter === 'All' || selectedFilter === 'Tests') &&
                  results.tests.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <FlaskConical className="w-3.5 h-3.5 text-sky-600" />
                        <span>Diagnostic Tests ({results.tests.length})</span>
                      </h4>
                      <div className="space-y-2">
                        {results.tests.map((test) => (
                          <div
                            key={test.id}
                            onClick={() => navigateTo('medical-checkup', { selectedTestId: test.id })}
                            className="p-3 bg-white border border-slate-200/80 rounded-2xl shadow-2xs hover:shadow-md cursor-pointer transition-all flex items-center justify-between"
                          >
                            <div>
                              <h5 className="font-bold text-xs text-[#172B4D]">{test.name}</h5>
                              <p className="text-[10px] text-slate-500">{test.labName}</p>
                              <span className="text-[9px] font-bold bg-sky-50 text-sky-700 px-1.5 py-0.2 rounded mt-1 inline-block">
                                {test.category}
                              </span>
                            </div>
                            <div className="text-right">
                              <p className="text-xs font-extrabold text-[#172B4D]">₹{test.price}</p>
                              <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-lg mt-1 inline-block">
                                Book
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* PACKAGES RESULTS */}
                {(selectedFilter === 'All' || selectedFilter === 'Packages') &&
                  results.packages.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <PackagePlus className="w-3.5 h-3.5 text-purple-600" />
                        <span>Health Packages ({results.packages.length})</span>
                      </h4>
                      <div className="space-y-2">
                        {results.packages.map((pkg) => (
                          <div
                            key={pkg.id}
                            onClick={() => navigateTo('all-checkups', { packageId: pkg.id })}
                            className="p-3 bg-white border border-slate-200/80 rounded-2xl shadow-2xs hover:shadow-md cursor-pointer transition-all flex items-center justify-between"
                          >
                            <div>
                              <h5 className="font-bold text-xs text-[#172B4D]">{pkg.name}</h5>
                              <p className="text-[10px] text-slate-500">{pkg.testsCount} Tests included</p>
                              <span className="text-[9px] font-bold bg-purple-50 text-purple-700 px-1.5 py-0.2 rounded mt-1 inline-block">
                                {pkg.category}
                              </span>
                            </div>
                            <div className="text-right">
                              <p className="text-xs font-extrabold text-[#172B4D]">₹{pkg.price}</p>
                              <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-lg mt-1 inline-block">
                                View
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* AMBULANCES RESULTS */}
                {(selectedFilter === 'All' || selectedFilter === 'Ambulances') &&
                  results.ambulances.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Ambulance className="w-3.5 h-3.5 text-rose-600" />
                        <span>Ambulance Services ({results.ambulances.length})</span>
                      </h4>
                      <div className="space-y-2">
                        {results.ambulances.map((amb) => (
                          <div
                            key={amb.id}
                            onClick={() => navigateTo('find-ambulance', { ambulanceId: amb.id })}
                            className="p-3 bg-white border border-slate-200/80 rounded-2xl shadow-2xs hover:shadow-md cursor-pointer transition-all flex items-center justify-between"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
                                <Ambulance className="w-5 h-5" />
                              </div>
                              <div>
                                <h5 className="font-bold text-xs text-[#172B4D]">{amb.providerName}</h5>
                                <p className="text-[10px] text-slate-500">
                                  {amb.type} • {amb.vehicleNo}
                                </p>
                                <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded mt-1 inline-block">
                                  {amb.eta} ETA
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xs font-extrabold text-[#172B4D]">₹{amb.fareEstimate}</p>
                              <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-lg mt-1 inline-block">
                                Dispatch
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* BLOOD BANKS RESULTS */}
                {(selectedFilter === 'All' || selectedFilter === 'Blood Banks') &&
                  results.bloodBanks.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Droplet className="w-3.5 h-3.5 text-red-600" />
                        <span>Blood Banks ({results.bloodBanks.length})</span>
                      </h4>
                      <div className="space-y-2">
                        {results.bloodBanks.map((bb) => (
                          <div
                            key={bb.id}
                            onClick={() => navigateTo('blood-bank')}
                            className="p-3 bg-white border border-slate-200/80 rounded-2xl shadow-2xs hover:shadow-md cursor-pointer transition-all flex items-center justify-between"
                          >
                            <div>
                              <h5 className="font-bold text-xs text-[#172B4D]">{bb.name}</h5>
                              <p className="text-[10px] text-slate-500">
                                {bb.area}, {bb.city} • {bb.distance}
                              </p>
                              <div className="flex flex-wrap gap-1 mt-1.5">
                                {Object.entries(bb.unitsAvailable).slice(0, 4).map(([grp, units]) => (
                                  <span
                                    key={grp}
                                    className="text-[9px] font-bold bg-red-50 text-red-700 px-1.5 py-0.2 rounded"
                                  >
                                    {grp}: {units}u
                                  </span>
                                ))}
                              </div>
                            </div>
                            <span className="text-[10px] font-bold text-red-700 bg-red-50 px-2 py-1 rounded-lg">
                              Request
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* TRADITIONAL HEALING RESULTS */}
                {(selectedFilter === 'All' || selectedFilter === 'Traditional') &&
                  results.traditional.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Flower2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Traditional AYUSH Healers ({results.traditional.length})</span>
                      </h4>
                      <div className="space-y-2">
                        {results.traditional.map((healer) => (
                          <div
                            key={healer.id}
                            onClick={() => navigateTo('traditional-healing')}
                            className="p-3 bg-white border border-slate-200/80 rounded-2xl shadow-2xs hover:shadow-md cursor-pointer transition-all flex items-center justify-between"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
                                <Flower2 className="w-6 h-6" />
                              </div>
                              <div>
                                <h5 className="font-bold text-xs text-[#172B4D]">{healer.name}</h5>
                                <p className="text-[11px] text-emerald-700 font-semibold">
                                  {healer.type}
                                </p>
                                <p className="text-[10px] text-slate-400 truncate max-w-[180px]">
                                  {healer.location}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xs font-bold text-[#172B4D]">
                                ⭐ {healer.rating}
                              </p>
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg mt-1 inline-block">
                                View Profile
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Voice Search Modal */}
      <VoiceSearchModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onSearch={handleVoiceSearchResult}
      />
    </div>
  );
};
