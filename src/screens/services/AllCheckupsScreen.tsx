import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  MapPin,
  Phone,
  Clock,
  Star,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Filter,
  SlidersHorizontal,
  Home,
  Building2,
  Plus,
  Minus,
  Trash2,
  Check,
  ExternalLink,
  Info,
  Navigation,
  Layers,
  Sparkles,
  ArrowRight,
  Share2,
  Download,
  Flame,
  X,
  Droplets,
  Droplet,
  Activity,
  Heart,
  FlaskConical,
  FileText,
  CheckSquare,
  Package,
} from 'lucide-react';
import {
  LAB_TEST_CATALOG,
  LabTestItem,
  getLabsForSelectedTests,
  EnrichedLabWithPrice,
  VERIFIED_DIAGNOSTIC_LABS,
} from '../../data/labCatalogData';
import { HEALTH_PACKAGES } from '../../data/mockData';
import { HealthPackage } from '../../types';
import { VoiceSearchInput } from '../../components/common/VoiceSearchInput';
import {
  LiveRouteNavigationModal,
  NavigationTarget,
} from '../../components/navigation/LiveRouteNavigationModal';
import { DoctorMap, MapMarkerItem } from '../../components/doctor/DoctorMap';

type StepType = 'all-checkups' | 'lab-results' | 'book-test' | 'confirmed';
type MainTabType = 'tests' | 'packages';

export const AllCheckupsScreen: React.FC = () => {
  const {
    goBack,
    navigateTo,
    currentCity,
    setCurrentCity,
    currentArea,
    setCurrentArea,
    liveCoordinates,
    detectLiveLocation,
    isDetectingLocation,
    user,
    addTestBooking,
    showToast,
    t,
    currentLanguage,
  } = useApp();

  // Navigation Steps:
  // 'all-checkups' = Screen 1 (Hero, Search, Tabs: Individual Tests vs Health Packages)
  // 'lab-results' = Screen 2 (Selected Test details, location dropdown, sort, lab cards)
  // 'book-test' = Screen 3 (Date/Time, Lab Visit vs Home Collection, Patient Info)
  // 'confirmed' = Screen 4 (Token, Barcode, Directions, Fasting Guidelines)
  const [currentStep, setCurrentStep] = useState<StepType>('all-checkups');

  // Screen 1: Active Tab ('tests' = Individual Tests, 'packages' = Health Packages)
  const [activeMainTab, setActiveMainTab] = useState<MainTabType>('tests');

  // Screen 1 Search & Category Filtering
  const [testSearchQuery, setTestSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedTestIds, setSelectedTestIds] = useState<string[]>(['test-cbc']);
  const [expandedClinicalTestId, setExpandedClinicalTestId] = useState<string | null>(null);

  // Selected Health Package (if user chose a package from the packages tab)
  const [selectedPackage, setSelectedPackage] = useState<HealthPackage | null>(null);

  // Screen 2: Location, Sorting, View & Filter
  const [sortBy, setSortBy] = useState<'distance' | 'price' | 'rating'>('distance');
  const [filterHomeSample, setFilterHomeSample] = useState<boolean>(false);
  const [filterNablOnly, setFilterNablOnly] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedLabForMap, setSelectedLabForMap] = useState<EnrichedLabWithPrice | null>(null);

  // Compare Labs State
  const [compareLabIds, setCompareLabIds] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState<boolean>(false);

  // Chosen Lab for Booking
  const [chosenLab, setChosenLab] = useState<EnrichedLabWithPrice | null>(null);

  // Booking Form State (Step 3)
  const [collectionMethod, setCollectionMethod] = useState<'LAB_VISIT' | 'HOME_COLLECTION'>('LAB_VISIT');
  const [selectedDate, setSelectedDate] = useState<string>('Tomorrow');
  const [selectedSlot, setSelectedSlot] = useState<string>('08:00 AM - 08:30 AM');
  const [patientName, setPatientName] = useState<string>(user?.name || 'Subhasis Gupta');
  const [patientAge, setPatientAge] = useState<string>('28');
  const [patientGender, setPatientGender] = useState<'Male' | 'Female' | 'Other'>(
    user?.gender === 'female' ? 'Female' : user?.gender === 'other' ? 'Other' : 'Male'
  );
  const [patientPhone, setPatientPhone] = useState<string>(user?.phone || '+91 98765 43210');
  const [patientAddress, setPatientAddress] = useState<string>('Flat 402, Royal Palms, Kothri Kalan');
  const [fastingConfirmed, setFastingConfirmed] = useState<boolean>(true);
  const [paymentChoice, setPaymentChoice] = useState<'PAY_AT_COLLECTION' | 'PAY_ONLINE'>('PAY_AT_COLLECTION');

  // Confirmed booking state
  const [confirmedBookingResult, setConfirmedBookingResult] = useState<any>(null);

  // Live Navigation Modal
  const [navTarget, setNavTarget] = useState<NavigationTarget | null>(null);
  const [isNavModalOpen, setIsNavModalOpen] = useState<boolean>(false);

  // Location Selector Dropdown / Modal
  const [isLocationSelectorOpen, setIsLocationSelectorOpen] = useState<boolean>(false);

  const availableCities = [
    'Bhopal',
    'Indore',
    'Sehore',
    'Ashta',
    'Delhi NCR',
    'Mumbai',
    'Kolkata',
    'Bengaluru',
  ];

  // 8 Individual Test Categories (Matching reference design & translated)
  const INDIVIDUAL_CATEGORIES = [
    {
      id: 'Blood Tests',
      title: t('catBlood', 'Blood Tests'),
      subtitle: t('catBloodSub', 'CBC, Hemoglobin, Blood Group'),
      icon: Droplets,
      color: 'text-rose-500',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-100 hover:border-rose-300',
    },
    {
      id: 'Diabetes Tests',
      title: t('catDiabetes', 'Diabetes Tests'),
      subtitle: t('catDiabetesSub', 'Fasting Sugar, PP Sugar, HbA1c'),
      icon: Activity,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-100 hover:border-amber-300',
    },
    {
      id: 'Thyroid Tests',
      title: t('catThyroid', 'Thyroid Tests'),
      subtitle: t('catThyroidSub', 'TSH, T3, T4'),
      icon: ShieldCheck,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-100 hover:border-purple-300',
    },
    {
      id: 'Liver Tests',
      title: t('catLiver', 'Liver Tests'),
      subtitle: t('catLiverSub', 'LFT, SGPT, SGOT, Bilirubin'),
      icon: FlaskConical,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-100 hover:border-emerald-300',
    },
    {
      id: 'Kidney Tests',
      title: t('catKidney', 'Kidney Tests'),
      subtitle: t('catKidneySub', 'KFT, Creatinine, Urea'),
      icon: Layers,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-100 hover:border-blue-300',
    },
    {
      id: 'Heart Tests',
      title: t('catHeart', 'Heart Tests'),
      subtitle: t('catHeartSub', 'Lipid Profile, ECG, Troponin'),
      icon: Heart,
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-100 hover:border-red-300',
    },
    {
      id: 'Vitamin Tests',
      title: t('catVitamins', 'Vitamin Tests'),
      subtitle: t('catVitaminsSub', 'Vitamin B12, Vitamin D'),
      icon: Sparkles,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-100 hover:border-yellow-300',
    },
    {
      id: 'Urine Tests',
      title: t('catUrine', 'Urine Tests'),
      subtitle: t('catUrineSub', 'Urine Routine, Urine Culture'),
      icon: Droplet,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      borderColor: 'border-cyan-100 hover:border-cyan-300',
    },
  ];

  // Helper to match category identifiers cleanly
  const matchesCategoryFilter = (testCategory: string, filter: string) => {
    if (filter === 'All') return true;
    const normTest = testCategory.toLowerCase().replace(' tests', '').replace(' health', '');
    const normFilter = filter.toLowerCase().replace(' tests', '').replace(' health', '');
    return normTest.includes(normFilter) || normFilter.includes(normTest);
  };

  // Filtered Tests for Individual Tests Tab
  const filteredIndividualTests = useMemo(() => {
    return LAB_TEST_CATALOG.filter((test) => {
      const matchesCat = matchesCategoryFilter(test.category, activeCategory);
      const q = testSearchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        test.name.toLowerCase().includes(q) ||
        test.shortName.toLowerCase().includes(q) ||
        test.category.toLowerCase().includes(q) ||
        test.description.toLowerCase().includes(q) ||
        test.clinicalSignificance.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [activeCategory, testSearchQuery]);

  // Selected test objects
  const selectedTestItems = useMemo(() => {
    return LAB_TEST_CATALOG.filter((t) => selectedTestIds.includes(t.id));
  }, [selectedTestIds]);

  // Fasting requirements flag
  const anyFastingRequired = useMemo(() => {
    return selectedTestItems.some((t) => t.fastingRequired);
  }, [selectedTestItems]);

  const maxFastingHours = useMemo(() => {
    return Math.max(0, ...selectedTestItems.map((t) => t.fastingHours || 0));
  }, [selectedTestItems]);

  // Estimated Pricing totals
  const selectedTestsEstimatedTotal = useMemo(() => {
    if (selectedPackage) return selectedPackage.price;
    return selectedTestItems.reduce((sum, t) => sum + t.basePrice, 0);
  }, [selectedTestItems, selectedPackage]);

  const selectedTestsMrpTotal = useMemo(() => {
    if (selectedPackage) return selectedPackage.mrp;
    return selectedTestItems.reduce((sum, t) => sum + t.mrp, 0);
  }, [selectedTestItems, selectedPackage]);

  // Toggle test selection
  const toggleTestSelection = (testId: string) => {
    setSelectedPackage(null); // clear package if user selects single test
    setSelectedTestIds((prev) => {
      if (prev.includes(testId)) {
        return prev.filter((id) => id !== testId);
      } else {
        return [...prev, testId];
      }
    });
  };

  // Nearby Labs calculation (Screen 2)
  const nearbyLabs = useMemo(() => {
    const rawLabs = getLabsForSelectedTests(
      currentCity,
      currentArea,
      selectedPackage ? ['test-cbc', 'test-fbs', 'test-lipid', 'test-tsh'] : selectedTestIds,
      liveCoordinates
        ? { lat: liveCoordinates.latitude, lng: liveCoordinates.longitude }
        : undefined
    );

    let filtered = rawLabs.filter((lab) => {
      if (filterHomeSample && !lab.homeCollectionAvailable) return false;
      if (
        filterNablOnly &&
        !lab.accreditation.some((a) => a.includes('NABL') || a.includes('CAP'))
      )
        return false;
      return true;
    });

    // Sorting
    filtered.sort((a, b) => {
      if (sortBy === 'distance') {
        return a.distanceKm - b.distanceKm;
      }
      if (sortBy === 'price') {
        return a.totalSelectedPrice - b.totalSelectedPrice;
      }
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      return 0;
    });

    return filtered;
  }, [
    currentCity,
    currentArea,
    selectedTestIds,
    selectedPackage,
    liveCoordinates,
    filterHomeSample,
    filterNablOnly,
    sortBy,
  ]);

  // Set default lab for map preview when labs change
  useEffect(() => {
    if (nearbyLabs.length > 0 && !selectedLabForMap) {
      setSelectedLabForMap(nearbyLabs[0]);
    }
  }, [nearbyLabs, selectedLabForMap]);

  // Map markers for nearby labs
  const mapMarkers = useMemo<MapMarkerItem[]>(() => {
    return nearbyLabs.map((lab) => ({
      id: lab.id,
      lat: lab.coordinates.lat,
      lng: lab.coordinates.lng,
      title: lab.name,
      subtitle: `${lab.distanceKm} km • ₹${lab.totalSelectedPrice}`,
      type: 'hospital',
      data: lab,
    }));
  }, [nearbyLabs]);

  // Handle View Location / Directions click
  const handleOpenLiveNavigation = (lab: EnrichedLabWithPrice) => {
    setNavTarget({
      id: lab.id,
      name: lab.name,
      specialty: 'Diagnostic Laboratory & Pathology Center',
      type: 'Laboratory',
      address: lab.address,
      city: lab.city,
      area: lab.area,
      latitude: lab.coordinates.lat,
      longitude: lab.coordinates.lng,
      coordinates: lab.coordinates,
      phone: lab.phone,
      imageUrl: lab.imageUrl,
    });
    setIsNavModalOpen(true);
  };

  // Toggle compare lab
  const toggleCompareLab = (labId: string) => {
    setCompareLabIds((prev) => {
      if (prev.includes(labId)) {
        return prev.filter((id) => id !== labId);
      } else {
        if (prev.length >= 3) {
          showToast('You can compare up to 3 laboratories at a time', 'info');
          return prev;
        }
        return [...prev, labId];
      }
    });
  };

  // Transition from Screen 1 to Screen 2
  const handleProceedToLabs = () => {
    if (!selectedPackage && selectedTestIds.length === 0) {
      showToast('Please select at least 1 test or health package', 'error');
      return;
    }
    setCurrentStep('lab-results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle choosing a package directly
  const handleSelectHealthPackage = (pkg: HealthPackage) => {
    setSelectedPackage(pkg);
    setSelectedTestIds([]);
    setCurrentStep('lab-results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Transition from Screen 2 to Screen 3 (Booking with chosen lab)
  const handleChooseLabToBook = (lab: EnrichedLabWithPrice) => {
    setChosenLab(lab);
    if (!lab.homeCollectionAvailable && collectionMethod === 'HOME_COLLECTION') {
      setCollectionMethod('LAB_VISIT');
    }
    setCurrentStep('book-test');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Confirm Final Booking (Screen 3 -> Screen 4)
  const handleConfirmBooking = () => {
    if (!chosenLab) return;
    if (!patientName.trim()) {
      showToast('Please enter patient name', 'error');
      return;
    }
    if (!patientPhone.trim() || patientPhone.length < 10) {
      showToast('Please enter a valid 10-digit mobile number', 'error');
      return;
    }
    if (collectionMethod === 'HOME_COLLECTION' && !patientAddress.trim()) {
      showToast('Please provide your complete address for home sample collection', 'error');
      return;
    }

    const homeFee = collectionMethod === 'HOME_COLLECTION' ? chosenLab.homeCollectionFee : 0;
    const finalAmount =
      (selectedPackage ? selectedPackage.price : chosenLab.totalSelectedPrice) + homeFee;

    const newBooking = addTestBooking({
      testOrPackageName: selectedPackage
        ? selectedPackage.name
        : selectedTestItems.length === 1
        ? selectedTestItems[0].name
        : `${selectedTestItems.length} Tests Panel (${selectedTestItems.map((t) => t.shortName).join(' + ')})`,
      type: selectedPackage ? 'package' : selectedTestItems.length === 1 ? 'single-test' : 'package',
      labName: chosenLab.name,
      collectionMethod: collectionMethod,
      collectionAddress: collectionMethod === 'HOME_COLLECTION' ? patientAddress : chosenLab.address,
      date: selectedDate === 'Tomorrow' ? 'Tomorrow, 08:00 AM' : selectedDate,
      timeSlot: selectedSlot,
      patientName: patientName,
      amount: finalAmount,
      paymentStatus: paymentChoice === 'PAY_ONLINE' ? 'PAID' : 'PAY_AT_COLLECTION',
      status: 'BOOKED',
    });

    setConfirmedBookingResult({
      ...newBooking,
      lab: chosenLab,
      selectedTests: selectedTestItems,
      selectedPackage,
      collectionMethod,
      patientAddress,
      homeFee,
      finalAmount,
    });

    showToast('Diagnostic checkup booked successfully!', 'success');
    setCurrentStep('confirmed');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Step Back
  const handleStepBack = () => {
    if (currentStep === 'confirmed') {
      navigateTo('home');
    } else if (currentStep === 'book-test') {
      setCurrentStep('lab-results');
    } else if (currentStep === 'lab-results') {
      setCurrentStep('all-checkups');
    } else {
      goBack();
    }
  };

  // Appointment dates
  const appointmentDates = [
    { label: 'Today', sub: 'Urgent' },
    { label: 'Tomorrow', sub: 'Recommended' },
    { label: 'Wed, 26 Nov', sub: 'Available' },
    { label: 'Thu, 27 Nov', sub: 'Available' },
    { label: 'Fri, 28 Nov', sub: 'Available' },
  ];

  // Appointment slots
  const morningFastingSlots = [
    '06:30 AM - 07:00 AM',
    '07:00 AM - 07:30 AM',
    '07:30 AM - 08:00 AM',
    '08:00 AM - 08:30 AM',
    '08:30 AM - 09:00 AM',
    '09:00 AM - 09:30 AM',
  ];

  const daytimeSlots = [
    '10:00 AM - 10:30 AM',
    '11:30 AM - 12:00 PM',
    '01:00 PM - 01:30 PM',
    '03:30 PM - 04:00 PM',
    '05:00 PM - 05:30 PM',
  ];

  return (
    <div className="min-h-full pb-24 bg-[#F8FAFC]">
      {/* ========================================================================= */}
      {/* TOP HEADER */}
      {/* ========================================================================= */}
      <div className="bg-white border-b border-slate-200/90 sticky top-0 z-30 px-4 py-3 shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={handleStepBack}
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors"
            title="Back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base font-extrabold text-[#172B4D] leading-tight">
              {currentStep === 'all-checkups' && t('allCheckupsTitle', 'All Checkups')}
              {currentStep === 'lab-results' && t('laboratoryResults', 'Laboratory Results')}
              {currentStep === 'book-test' && t('scheduleAndBook', 'Schedule & Book Appointment')}
              {currentStep === 'confirmed' && t('bookingConfirmed', 'Booking Confirmed')}
            </h1>
            <p className="text-[11px] text-slate-500 font-medium">
              {currentStep === 'all-checkups' && t('heroSubtitle', 'Certified Pathology & Health Packages')}
              {currentStep === 'lab-results' && `${nearbyLabs.length} ${t('laboratoriesAvailable', 'labs available near you')}`}
              {currentStep === 'book-test' && chosenLab?.name}
              {currentStep === 'confirmed' && t('barcodeTokenNotice', 'Digital token generated')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {currentStep === 'lab-results' && (
            <button
              onClick={() => setIsCompareModalOpen(true)}
              className="text-xs font-bold text-[#087E8B] bg-teal-50 hover:bg-teal-100 border border-teal-200 px-2.5 py-1.5 rounded-full flex items-center gap-1 transition-colors"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Compare ({compareLabIds.length > 0 ? compareLabIds.length : 'All'})</span>
            </button>
          )}

          {currentStep === 'all-checkups' && (selectedTestIds.length > 0 || selectedPackage) && (
            <button
              onClick={handleProceedToLabs}
              className="bg-teal-50 border border-teal-200 text-[#087E8B] text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1 hover:bg-teal-100 transition-colors"
            >
              <span>{selectedPackage ? '1 Package' : `${selectedTestIds.length} Selected`}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SCREEN 1: ALL CHECKUPS (HERO, SEARCH, TABS, CATEGORIES, TESTS & PACKAGES) */}
      {/* ========================================================================= */}
      {currentStep === 'all-checkups' && (
        <div className="p-4 space-y-4 max-w-3xl mx-auto animate-fadeIn">
          {/* HERO SECTION: HEADING, SUBTITLE & LABORATORY CLIPBOARD/TUBES ILLUSTRATION */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#087E8B]/10 via-white to-teal-50/60 p-4 border border-teal-100/90 shadow-2xs flex items-center justify-between gap-3">
            <div className="space-y-1 flex-1 min-w-0">
              <span className="inline-block text-[10px] font-extrabold text-[#087E8B] bg-teal-100/80 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Doctor G Diagnostics
              </span>
              <h2 className="text-base sm:text-lg font-black text-[#172B4D] leading-snug">
                {t('heroHeading', 'Select Your Checkup or Test')}
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed max-w-sm">
                {t('heroSubtitle', 'Choose from a wide range of laboratory tests and health packages')}
              </p>
            </div>

            {/* Medical Laboratory Illustration with Blood Tubes & Clipboard */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 flex items-center justify-center">
              {/* Soft decorative aura */}
              <div className="absolute inset-0 bg-teal-200/40 rounded-full blur-md" />

              <svg
                viewBox="0 0 120 120"
                className="w-full h-full relative z-10 drop-shadow-md"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Clipboard background */}
                <rect x="24" y="16" width="60" height="82" rx="8" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2.5" />
                {/* Clipboard clip */}
                <rect x="42" y="10" width="24" height="12" rx="3" fill="#172B4D" />
                <circle cx="54" cy="16" r="2.5" fill="#FFFFFF" />
                {/* Checklist lines */}
                <rect x="36" y="32" width="20" height="3" rx="1.5" fill="#087E8B" />
                <rect x="36" y="42" width="36" height="3" rx="1.5" fill="#E2E8F0" />
                <rect x="36" y="52" width="30" height="3" rx="1.5" fill="#E2E8F0" />
                <rect x="36" y="62" width="24" height="3" rx="1.5" fill="#E2E8F0" />
                <path d="M30 42L32 44L36 40" stroke="#087E8B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M30 52L32 54L36 50" stroke="#087E8B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

                {/* Test Tube 1 (Blood Sample / Red) */}
                <g transform="translate(68, 38) rotate(12)">
                  <rect x="0" y="0" width="14" height="52" rx="7" fill="#F1F5F9" stroke="#087E8B" strokeWidth="2" />
                  <path d="M1 24C1 24 4 22 7 24C10 26 13 24 13 24V45C13 48.866 9.866 52 6 52C2.134 52 1 48.866 1 45V24Z" fill="#EF4444" />
                  <rect x="-1" y="-3" width="16" height="6" rx="2" fill="#DC2626" />
                  <line x1="4" y1="30" x2="8" y2="30" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" />
                  <line x1="4" y1="36" x2="7" y2="36" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" />
                  <line x1="4" y1="42" x2="8" y2="42" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" />
                </g>

                {/* Test Tube 2 (Lavender / EDTA Purple) */}
                <g transform="translate(86, 44) rotate(-8)">
                  <rect x="0" y="0" width="14" height="46" rx="7" fill="#F1F5F9" stroke="#475569" strokeWidth="2" />
                  <path d="M1 18C1 18 4 16 7 18C10 20 13 18 13 18V39C13 42.866 9.866 46 6 46C2.134 46 1 42.866 1 39V18Z" fill="#A855F7" />
                  <rect x="-1" y="-3" width="16" height="6" rx="2" fill="#7E22CE" />
                </g>

                {/* Test Tube Rack base */}
                <path d="M60 92H108" stroke="#172B4D" strokeWidth="3" strokeLinecap="round" />
                <circle cx="28" cy="92" r="3" fill="#087E8B" />
              </svg>
            </div>
          </div>

          {/* SEARCH BAR WITH MICROPHONE (VOICE SEARCH HINDI & ENGLISH) */}
          <div className="bg-white rounded-2xl p-2 border border-slate-200/90 shadow-2xs">
            <VoiceSearchInput
              value={testSearchQuery}
              onChange={(e) => setTestSearchQuery(e.target.value)}
              onChangeValue={(val) => setTestSearchQuery(val)}
              placeholder={t('searchTestsPlaceholder', 'Search tests (e.g., Vitamin B12, CBC)...')}
              searchCategory="test"
              language="auto"
              onClear={() => setTestSearchQuery('')}
            />
          </div>

          {/* MAIN TABS: INDIVIDUAL TESTS VS HEALTH PACKAGES */}
          <div className="bg-slate-200/80 p-1 rounded-2xl flex items-center">
            <button
              onClick={() => setActiveMainTab('tests')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                activeMainTab === 'tests'
                  ? 'bg-white text-[#172B4D] shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FlaskConical className="w-4 h-4 text-[#087E8B]" />
              <span>{t('individualTests', 'Individual Tests')}</span>
            </button>

            <button
              onClick={() => setActiveMainTab('packages')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                activeMainTab === 'packages'
                  ? 'bg-white text-[#172B4D] shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Package className="w-4 h-4 text-purple-600" />
              <span>{t('healthPackages', 'Health Packages')}</span>
            </button>
          </div>

          {/* ======================================================== */}
          {/* TAB 1: INDIVIDUAL TESTS & CATEGORY CARDS */}
          {/* ======================================================== */}
          {activeMainTab === 'tests' && (
            <div className="space-y-4">
              {/* Category selector row header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-xs text-[#172B4D] uppercase tracking-wider">
                    Test Categories
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Click a category to browse relevant diagnostics
                  </p>
                </div>
                {activeCategory !== 'All' && (
                  <button
                    onClick={() => setActiveCategory('All')}
                    className="text-xs font-bold text-[#087E8B] hover:underline flex items-center gap-1"
                  >
                    <span>View All ({LAB_TEST_CATALOG.length})</span>
                  </button>
                )}
              </div>

              {/* 8 Clickable Category Cards (Grid 2-column) */}
              <div className="grid grid-cols-2 gap-2.5">
                {INDIVIDUAL_CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isCategoryActive = activeCategory === cat.id;

                  return (
                    <div
                      key={cat.id}
                      onClick={() => {
                        setActiveCategory(isCategoryActive ? 'All' : cat.id);
                        setTestSearchQuery('');
                      }}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between min-h-[82px] shadow-2xs hover:shadow-md ${
                        isCategoryActive
                          ? 'border-[#087E8B] bg-teal-50/70 ring-2 ring-[#087E8B]/20'
                          : `bg-white ${cat.borderColor}`
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div
                          className={`w-8 h-8 rounded-xl ${cat.bgColor} flex items-center justify-center flex-shrink-0`}
                        >
                          <Icon className={`w-4 h-4 ${cat.color}`} />
                        </div>
                        {isCategoryActive && (
                          <span className="w-2 h-2 rounded-full bg-[#087E8B]" />
                        )}
                      </div>

                      <div className="mt-2">
                        <h4 className="font-extrabold text-xs text-[#172B4D] leading-tight">
                          {cat.title}
                        </h4>
                        <p className="text-[10px] text-slate-500 font-medium leading-tight mt-0.5 line-clamp-1">
                          {cat.subtitle}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Fasting Requirement Notification if any selected test requires fasting */}
              {anyFastingRequired && (
                <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-3 flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-950 leading-snug">
                    <span className="font-bold">Fasting Notice:</span> One or more of your selected tests requires {maxFastingHours > 0 ? `${maxFastingHours} hours` : 'overnight'} fasting.
                  </div>
                </div>
              )}

              {/* Test Cards List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pt-1">
                  <h4 className="font-bold text-xs text-slate-600 uppercase tracking-wider">
                    {activeCategory === 'All' ? 'All Individual Tests' : activeCategory}
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    {filteredIndividualTests.length} tests available
                  </span>
                </div>

                {filteredIndividualTests.map((test) => {
                  const isSelected = selectedTestIds.includes(test.id);
                  const isExpanded = expandedClinicalTestId === test.id;
                  const discount = Math.round(((test.mrp - test.basePrice) / test.mrp) * 100);

                  return (
                    <div
                      key={test.id}
                      className={`bg-white rounded-2xl border transition-all p-3.5 shadow-2xs hover:shadow-md ${
                        isSelected
                          ? 'border-[#087E8B] ring-2 ring-[#087E8B]/10 bg-teal-50/20'
                          : 'border-slate-200/90'
                      }`}
                    >
                      {/* Top test row: Title, Tags, Price & Add Button */}
                      <div className="flex items-start justify-between gap-3">
                        <div
                          className="flex-1 cursor-pointer"
                          onClick={() => toggleTestSelection(test.id)}
                        >
                          <div className="flex items-center gap-1.5 flex-wrap mb-1">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700">
                              {test.category}
                            </span>
                            <span className="text-[10px] font-medium text-slate-500 flex items-center gap-1">
                              <Droplets className="w-3 h-3 text-red-500" /> {test.sampleType} {t('sampleType', 'Sample')}
                            </span>
                            {test.fastingRequired ? (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800">
                                {t('fasting', 'Fasting')}: {test.fastingHours} hrs
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-emerald-50 text-emerald-700">
                                {t('noFastingRequired', 'No fasting')}
                              </span>
                            )}
                            <span className="text-[10px] text-slate-400">
                              {t('reportInHours', 'Reports in')} {test.reportTurnaroundHours}h
                            </span>
                          </div>

                          <h3 className="font-extrabold text-sm text-[#172B4D] leading-snug">
                            {test.name}
                          </h3>
                          <p className="text-xs text-slate-500 font-medium mt-0.5">
                            {test.shortName} • {test.description}
                          </p>
                        </div>

                        {/* Price and Add/Remove button */}
                        <div className="flex flex-col items-end justify-between flex-shrink-0">
                          <div className="text-right">
                            <div className="flex items-baseline gap-1.5 justify-end">
                              <span className="font-extrabold text-base text-[#172B4D]">
                                ₹{test.basePrice}
                              </span>
                              <span className="text-[11px] text-slate-400 line-through">
                                ₹{test.mrp}
                              </span>
                            </div>
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                              {discount}% OFF
                            </span>
                          </div>

                          <button
                            onClick={() => toggleTestSelection(test.id)}
                            className={`mt-2 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                              isSelected
                                ? 'bg-[#087E8B] hover:bg-[#076d78] text-white shadow-2xs'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                            }`}
                            title={isSelected ? t('remove', '- Remove') : t('add', '+ Add')}
                          >
                            {isSelected ? (
                              <>
                                <Minus className="w-3.5 h-3.5 stroke-[3]" />
                                <span>{t('remove', '- Remove')}</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                                <span>{t('add', '+ Add')}</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Expandable "Why is this test done?" section */}
                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedClinicalTestId(isExpanded ? null : test.id)
                          }
                          className="text-[11px] font-semibold text-[#087E8B] hover:underline flex items-center gap-1"
                        >
                          <Info className="w-3 h-3" />
                          <span>
                            {isExpanded ? t('close', 'Close') : t('whyIsThisTestDone', 'Why is this test done?')}
                          </span>
                        </button>
                        <span className="text-[10px] text-slate-400">NABL Quality Standard</span>
                      </div>

                      {isExpanded && (
                        <div className="mt-2 p-2.5 bg-slate-50 rounded-xl text-xs text-slate-600 border border-slate-200/60 animate-fadeIn">
                          <p className="font-bold text-slate-800 mb-0.5">Clinical Purpose:</p>
                          <p>{test.clinicalSignificance}</p>
                        </div>
                      )}
                    </div>
                  );
                })}

                {filteredIndividualTests.length === 0 && (
                  <div className="bg-white rounded-2xl p-8 text-center border border-slate-200">
                    <Search className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <h4 className="font-bold text-sm text-slate-700">No tests matched your search</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Try searching for keywords like "CBC", "Sugar", "Thyroid", "Lipid", or clear filters.
                    </p>
                    <button
                      onClick={() => {
                        setTestSearchQuery('');
                        setActiveCategory('All');
                      }}
                      className="mt-3 px-4 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700"
                    >
                      Reset Filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: HEALTH PACKAGES */}
          {/* ======================================================== */}
          {activeMainTab === 'packages' && (
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-xs text-[#172B4D] uppercase tracking-wider">
                    Full Body & Preventive Health Packages
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Comprehensive multi-organ screenings with free home collection
                  </p>
                </div>
                <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
                  Up to 60% OFF
                </span>
              </div>

              {HEALTH_PACKAGES.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-2xs hover:shadow-md transition-all space-y-3"
                >
                  <div className="flex items-start justify-between pb-2 border-b border-slate-100">
                    <div>
                      {pkg.popularTag && (
                        <span className="text-[9px] font-extrabold uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md inline-block mb-1">
                          {pkg.popularTag}
                        </span>
                      )}
                      <h4 className="font-black text-sm text-[#172B4D] leading-snug">
                        {pkg.name}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">{pkg.description}</p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className="flex items-baseline gap-1.5 justify-end">
                        <span className="font-black text-base text-[#172B4D]">₹{pkg.price}</span>
                        <span className="text-xs text-slate-400 line-through">₹{pkg.mrp}</span>
                      </div>
                      <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded">
                        {pkg.discountPercent}% OFF
                      </span>
                    </div>
                  </div>

                  {/* Included tests chips */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 block mb-1">
                      Includes {pkg.testsCount} Essential Parameters:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {pkg.testsIncluded.slice(0, 5).map((tName, i) => (
                        <span
                          key={i}
                          className="bg-slate-50 border border-slate-200 text-slate-700 text-[10px] px-2 py-0.5 rounded-md font-medium"
                        >
                          {tName}
                        </span>
                      ))}
                      {pkg.testsIncluded.length > 5 && (
                        <span className="bg-teal-50 text-[#087E8B] text-[10px] px-2 py-0.5 rounded-md font-bold">
                          +{pkg.testsIncluded.length - 5} More
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Meta: turnaround & home sample */}
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-500" /> Reports in {pkg.reportTimeHours}h
                    </span>
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <Home className="w-3.5 h-3.5 text-emerald-600" /> Free Home Sample Collection
                    </span>
                  </div>

                  {/* Select Package CTA */}
                  <button
                    onClick={() => handleSelectHealthPackage(pkg)}
                    className="w-full py-2.5 bg-gradient-to-r from-[#087E8B] to-[#172B4D] hover:from-[#076d78] hover:to-[#12223c] text-white font-extrabold text-xs rounded-xl shadow-2xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <span>Select Package & Find Laboratories (₹{pkg.price})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* STICKY BOTTOM TRAY WHEN TESTS SELECTED */}
          {selectedTestIds.length > 0 && activeMainTab === 'tests' && (
            <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 shadow-lg z-40">
              <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#172B4D]">
                      {selectedTestIds.length} {selectedTestIds.length === 1 ? 'Test' : 'Tests'} Selected
                    </span>
                    <span className="text-xs font-extrabold text-[#087E8B]">
                      Est. ₹{selectedTestsEstimatedTotal}
                    </span>
                    <span className="text-[10px] text-slate-400 line-through">
                      ₹{selectedTestsMrpTotal}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 truncate mt-0.5">
                    {selectedTestItems.map((t) => t.shortName).join(' • ')}
                  </p>
                </div>

                <button
                  onClick={handleProceedToLabs}
                  className="px-5 py-2.5 bg-gradient-to-r from-[#087E8B] to-[#172B4D] text-white font-extrabold text-xs rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 flex-shrink-0"
                >
                  <span>Continue to Laboratories ({selectedTestIds.length})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 2: LABORATORY RESULTS (MATCHING REFERENCE DESIGN) */}
      {/* ========================================================================= */}
      {currentStep === 'lab-results' && (
        <div className="p-4 space-y-4 max-w-3xl mx-auto animate-fadeIn">
          {/* AT THE TOP: SELECTED TEST DETAILS CARD */}
          <div className="bg-white rounded-3xl border border-teal-200/80 p-4 shadow-2xs space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-extrabold text-teal-800 bg-teal-100/70 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Selected Checkup / Test
                </span>
                <h3 className="font-black text-sm sm:text-base text-[#172B4D] mt-1 leading-snug">
                  {selectedPackage
                    ? selectedPackage.name
                    : selectedTestItems.length === 1
                    ? selectedTestItems[0].name
                    : `${selectedTestItems.length} Tests Selected (${selectedTestItems.map((t) => t.shortName).join(' + ')})`}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  {selectedPackage
                    ? selectedPackage.description
                    : selectedTestItems.length === 1
                    ? selectedTestItems[0].description
                    : selectedTestItems.map((t) => t.shortName).join(' • ')}
                </p>
              </div>

              {/* Price Breakdown */}
              <div className="text-right flex-shrink-0">
                <div className="flex items-baseline gap-1.5 justify-end">
                  <span className="font-black text-base sm:text-lg text-[#087E8B]">
                    ₹{selectedTestsEstimatedTotal}
                  </span>
                  <span className="text-xs text-slate-400 line-through">
                    ₹{selectedTestsMrpTotal}
                  </span>
                </div>
                <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded">
                  {Math.round(((selectedTestsMrpTotal - selectedTestsEstimatedTotal) / selectedTestsMrpTotal) * 100)}% Savings
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">
                {selectedPackage ? 'Health Package' : `${selectedTestIds.length} Individual Tests`}
              </span>
              <button
                onClick={() => setCurrentStep('all-checkups')}
                className="text-xs font-bold text-[#087E8B] hover:underline"
              >
                Change Tests
              </button>
            </div>
          </div>

          {/* LOCATION & FILTERS TOOLBAR */}
          <div className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-2xs space-y-2.5">
            {/* Location selector row */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-teal-50 text-[#087E8B] flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-[#087E8B]" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Location
                  </span>
                  <button
                    onClick={() => setIsLocationSelectorOpen(true)}
                    className="font-extrabold text-xs text-[#172B4D] hover:text-[#087E8B] flex items-center gap-1"
                  >
                    <span>{currentArea}, {currentCity}</span>
                    <span className="text-[10px] text-[#087E8B]">▼</span>
                  </button>
                </div>
              </div>

              {/* GPS & Change location actions */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => detectLiveLocation()}
                  disabled={isDetectingLocation}
                  className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-[11px] font-bold text-slate-700 flex items-center gap-1"
                  title="Detect GPS Location"
                >
                  <Navigation className={`w-3 h-3 text-[#087E8B] ${isDetectingLocation ? 'animate-spin' : ''}`} />
                  <span>{isDetectingLocation ? 'Detecting...' : 'Current GPS'}</span>
                </button>
                <button
                  onClick={() => setIsLocationSelectorOpen(true)}
                  className="px-2.5 py-1.5 rounded-xl bg-[#087E8B]/10 hover:bg-[#087E8B]/20 text-[#087E8B] text-[11px] font-bold"
                >
                  Change
                </button>
              </div>
            </div>

            {/* Sorting & Counter Row */}
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                  <SlidersHorizontal className="w-3.5 h-3.5" /> {t('sortBy', 'Sort')}:
                </span>
                {(['distance', 'price', 'rating'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setSortBy(mode)}
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize transition-all ${
                      sortBy === mode
                        ? 'bg-[#172B4D] text-white font-bold shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {mode === 'distance' && `📍 ${t('sortByDistance', 'Distance')}`}
                    {mode === 'price' && `💰 ${t('sortByPrice', 'Price')}`}
                    {mode === 'rating' && `⭐ ${t('sortByRating', 'Rating')}`}
                  </button>
                ))}
              </div>

              {/* View Switcher: List vs Map */}
              <div className="bg-slate-100 p-0.5 rounded-lg flex items-center">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                    viewMode === 'list' ? 'bg-white shadow-2xs text-[#172B4D]' : 'text-slate-500'
                  }`}
                >
                  List
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                    viewMode === 'map' ? 'bg-white shadow-2xs text-[#172B4D]' : 'text-slate-500'
                  }`}
                >
                  Map
                </button>
              </div>
            </div>
          </div>

          {/* Laboratories Available Counter Banner */}
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-extrabold text-[#172B4D]">
              {nearbyLabs.length} {t('laboratoriesAvailable', 'laboratories available near you')}
            </span>
            <span className="text-[11px] text-slate-400">
              {t('certifiedNablLabs', 'Verified Pathology Centers')}
            </span>
          </div>

          {/* ================= MAP VIEW MODE ================= */}
          {viewMode === 'map' && (
            <div className="space-y-3">
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md">
                <DoctorMap
                  center={
                    selectedLabForMap
                      ? selectedLabForMap.coordinates
                      : { lat: 23.2332, lng: 77.4344 }
                  }
                  zoom={13}
                  height={320}
                  markers={mapMarkers}
                  userLocation={
                    liveCoordinates
                      ? { lat: liveCoordinates.latitude, lng: liveCoordinates.longitude }
                      : undefined
                  }
                />
              </div>

              {selectedLabForMap && (
                <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-sm flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-xs text-[#172B4D] truncate">
                        {selectedLabForMap.name}
                      </span>
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {selectedLabForMap.rating}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {selectedLabForMap.address} • {selectedLabForMap.distanceKm} km away
                    </p>
                    <p className="text-xs font-extrabold text-[#087E8B] mt-1">
                      Test Price: ₹{selectedLabForMap.totalSelectedPrice}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleOpenLiveNavigation(selectedLabForMap)}
                      className="px-2.5 py-1.5 rounded-xl border border-teal-200 bg-teal-50 text-[#087E8B] text-xs font-bold flex items-center gap-1"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Directions</span>
                    </button>
                    <button
                      onClick={() => handleChooseLabToBook(selectedLabForMap)}
                      className="px-3 py-1.5 rounded-xl bg-[#087E8B] text-white text-xs font-bold shadow-2xs"
                    >
                      Book Test
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= LABORATORY CARDS LIST ================= */}
          {viewMode === 'list' && (
            <div className="space-y-3.5">
              {nearbyLabs.map((lab) => {
                const isCompared = compareLabIds.includes(lab.id);

                return (
                  <div
                    key={lab.id}
                    className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-2xs hover:shadow-md transition-all space-y-3"
                  >
                    {/* Lab Header: Thumbnail/Logo, Name, Verified Badge, Rating & Compare */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <img
                          src={lab.imageUrl}
                          alt={lab.name}
                          className="w-13 h-13 rounded-2xl object-cover border border-slate-200 flex-shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] font-extrabold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
                              {lab.network}
                            </span>
                            <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                              <ShieldCheck className="w-3 h-3 text-[#087E8B]" />
                              {t('verified', 'Verified')} • NABL
                            </span>
                          </div>

                          <h3 className="font-extrabold text-sm text-[#172B4D] mt-1 leading-snug">
                            {lab.name}
                          </h3>

                          {/* Full address with area/locality and city */}
                          <p className="text-xs text-slate-500 font-medium mt-0.5 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                            <span>{lab.address}, {lab.area}, {lab.city}</span>
                          </p>
                        </div>
                      </div>

                      {/* Compare Checkbox */}
                      <button
                        onClick={() => toggleCompareLab(lab.id)}
                        className={`p-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-1 transition-all ${
                          isCompared
                            ? 'bg-amber-500 text-white border-amber-600 shadow-2xs'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                        title="Compare this lab"
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>{isCompared ? 'Compared' : 'Compare'}</span>
                      </button>
                    </div>

                    {/* Metadata Row: Distance, Hours, Rating & Phone */}
                    <div className="grid grid-cols-3 gap-2 bg-slate-50/80 p-2.5 rounded-2xl text-[11px] border border-slate-100">
                      <div>
                        <span className="text-slate-400 block text-[10px]">{t('sortByDistance', 'Distance & Drive')}</span>
                        <span className="font-bold text-[#172B4D] flex items-center gap-1 mt-0.5">
                          <Navigation className="w-3 h-3 text-[#087E8B]" />
                          {lab.distanceStr}
                        </span>
                        <span className="text-[10px] text-slate-500">{lab.driveTimeStr}</span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px]">{t('openingHours', 'Opening Hours')}</span>
                        <span className="font-bold text-[#172B4D] flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3 text-amber-500" />
                          {lab.openingTime} - {lab.closingTime}
                        </span>
                        <span className="text-[10px] text-emerald-600 font-semibold">{t('open', 'Open Today')}</span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px]">{t('reviews', 'Rating & Reviews')}</span>
                        <div className="flex items-center gap-1 font-bold text-[#172B4D] mt-0.5">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{lab.rating}</span>
                          <span className="text-[10px] text-slate-400 font-normal">({lab.reviewCount})</span>
                        </div>
                        <a
                          href={`tel:${lab.phone.replace(/\s+/g, '')}`}
                          className="text-[10px] font-bold text-[#087E8B] hover:underline flex items-center gap-1 mt-0.5"
                        >
                          <Phone className="w-2.5 h-2.5" />
                          <span>{lab.phone}</span>
                        </a>
                      </div>
                    </div>

                    {/* Test Price and Availability Row */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        {lab.homeCollectionAvailable ? (
                          <span className="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Home className="w-3 h-3 text-blue-600" />
                            <span>{t('homeSampleCollection', 'Home Collection')} ({lab.homeCollectionFee === 0 ? 'FREE' : `₹${lab.homeCollectionFee}`})</span>
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                            {t('labVisit', 'Lab Visit Only')}
                          </span>
                        )}
                      </div>

                      <div className="text-right">
                        <div className="flex items-baseline gap-1.5 justify-end">
                          <span className="text-xs text-slate-400">{t('sortByPrice', 'Test Price')}:</span>
                          <span className="font-extrabold text-base text-[#172B4D]">
                            ₹{lab.totalSelectedPrice}
                          </span>
                          <span className="text-[11px] text-slate-400 line-through">
                            ₹{lab.totalMrpPrice}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-600">
                          {lab.discountPercentage}% Savings
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons: Call, View Location, and Book Test */}
                    <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                      <a
                        href={`tel:${lab.phone.replace(/\s+/g, '')}`}
                        className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                        title={`Call ${lab.phone}`}
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{t('call', 'Call')} ({lab.phone})</span>
                      </a>

                      <button
                        onClick={() => handleOpenLiveNavigation(lab)}
                        className="flex-1 py-2 rounded-xl border border-[#087E8B]/30 bg-teal-50 hover:bg-teal-100 text-[#087E8B] text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>{t('viewLocation', 'View Location')}</span>
                      </button>

                      <button
                        onClick={() => handleChooseLabToBook(lab)}
                        className="flex-1 py-2 rounded-xl bg-gradient-to-r from-[#087E8B] to-[#172B4D] hover:from-[#076d78] hover:to-[#12223c] text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-2xs hover:shadow-md transition-all"
                      >
                        <span>{t('bookTest', 'Book Test')}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {nearbyLabs.length === 0 && (
                <div className="bg-white rounded-2xl p-8 text-center border border-slate-200">
                  <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-2" />
                  <h4 className="font-bold text-sm text-slate-800">No laboratories found near this location</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Try choosing a nearby primary hub like Bhopal, Indore, or Sehore.
                  </p>
                  <button
                    onClick={() => {
                      setCurrentCity('Bhopal');
                      setCurrentArea('Central Hub');
                    }}
                    className="mt-3 px-4 py-1.5 bg-[#087E8B] text-white rounded-xl text-xs font-bold"
                  >
                    Switch to Bhopal
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 3: BOOK TEST (SCHEDULE & PATIENT DETAILS) */}
      {/* ========================================================================= */}
      {currentStep === 'book-test' && chosenLab && (
        <div className="p-4 space-y-4 max-w-2xl mx-auto animate-fadeIn">
          {/* Chosen Lab Details Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md uppercase tracking-wider">
                  Selected Diagnostic Laboratory
                </span>
                <h3 className="font-extrabold text-sm text-[#172B4D] mt-1">
                  {chosenLab.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {chosenLab.address}, {chosenLab.area}, {chosenLab.city}
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 font-bold text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{chosenLab.rating}</span>
                </div>
                <span className="text-[10px] text-slate-400 block mt-1">
                  {chosenLab.distanceStr}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Opening Hours:</span>
              <span className="font-bold text-slate-700">
                {chosenLab.openingTime} - {chosenLab.closingTime} (Open Today)
              </span>
            </div>
          </div>

          {/* Selected Tests List & Price Summary */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider">
                {selectedPackage ? 'Health Package' : `Tests Included (${selectedTestItems.length})`}
              </h4>
              <button
                onClick={() => setCurrentStep('all-checkups')}
                className="text-xs font-bold text-[#087E8B] hover:underline"
              >
                Change Selection
              </button>
            </div>

            {selectedPackage ? (
              <div className="py-2 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-[#172B4D] block">{selectedPackage.name}</span>
                  <span className="text-[10px] text-slate-500">{selectedPackage.testsCount} Tests Included</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-[#172B4D]">₹{selectedPackage.price}</span>
                  <span className="text-[10px] text-slate-400 line-through block">₹{selectedPackage.mrp}</span>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {selectedTestItems.map((test) => (
                  <div key={test.id} className="py-2 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-[#172B4D] block">{test.name}</span>
                      <span className="text-[10px] text-slate-500">
                        {test.sampleType} Sample • {test.fastingRequired ? `Fasting: ${test.fastingHours}h` : 'No fasting'}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-[#172B4D]">
                        ₹{Math.round(test.basePrice * chosenLab.priceMultiplier)}
                      </span>
                      <span className="text-[10px] text-slate-400 line-through block">
                        ₹{test.mrp}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Total Calculation */}
            <div className="pt-2 border-t border-slate-200 space-y-1 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal:</span>
                <span>₹{selectedPackage ? selectedPackage.price : chosenLab.totalSelectedPrice}</span>
              </div>
              {collectionMethod === 'HOME_COLLECTION' && (
                <div className="flex justify-between text-slate-500">
                  <span>Home Sample Phlebotomist Visit:</span>
                  <span>{chosenLab.homeCollectionFee === 0 ? 'FREE' : `₹${chosenLab.homeCollectionFee}`}</span>
                </div>
              )}
              <div className="flex justify-between font-extrabold text-sm text-[#172B4D] pt-1 border-t border-slate-100">
                <span>Total Amount:</span>
                <span className="text-[#087E8B]">
                  ₹{(selectedPackage ? selectedPackage.price : chosenLab.totalSelectedPrice) +
                    (collectionMethod === 'HOME_COLLECTION' ? chosenLab.homeCollectionFee : 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Collection Method Switcher */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
            <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider">
              Choose Sample Collection Mode
            </h4>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setCollectionMethod('LAB_VISIT')}
                className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  collectionMethod === 'LAB_VISIT'
                    ? 'border-[#087E8B] bg-teal-50/40 ring-2 ring-[#087E8B]/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-teal-100 text-[#087E8B] flex items-center justify-center">
                    <Building2 className="w-4 h-4" />
                  </div>
                  {collectionMethod === 'LAB_VISIT' && (
                    <CheckCircle2 className="w-4 h-4 text-[#087E8B]" />
                  )}
                </div>
                <div className="mt-2">
                  <h5 className="font-extrabold text-xs text-[#172B4D]">{t('visitDiagnosticLab', 'Visit Diagnostic Lab')}</h5>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {t('walkInLabDesc', 'Visit centre directly at selected time slot. Instant slot token provided.')}
                  </p>
                </div>
              </button>

              <button
                type="button"
                disabled={!chosenLab.homeCollectionAvailable}
                onClick={() => setCollectionMethod('HOME_COLLECTION')}
                className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                  !chosenLab.homeCollectionAvailable
                    ? 'opacity-40 cursor-not-allowed border-slate-200 bg-slate-50'
                    : collectionMethod === 'HOME_COLLECTION'
                    ? 'border-[#087E8B] bg-teal-50/40 ring-2 ring-[#087E8B]/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                    <Home className="w-4 h-4" />
                  </div>
                  {collectionMethod === 'HOME_COLLECTION' && (
                    <CheckCircle2 className="w-4 h-4 text-[#087E8B]" />
                  )}
                </div>
                <div className="mt-2">
                  <div className="flex items-center gap-1">
                    <h5 className="font-extrabold text-xs text-[#172B4D]">{t('homeCollectionOption', 'Home Sample Collection')}</h5>
                    {chosenLab.homeCollectionFee === 0 && (
                      <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1 py-0.2 rounded">
                        FREE
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {t('homeCollectionDesc', 'Trained certified phlebotomist visits your doorstep at your preferred time.')}
                  </p>
                </div>
              </button>
            </div>

            {collectionMethod === 'HOME_COLLECTION' && (
              <div className="mt-3 p-3 bg-blue-50/60 rounded-2xl border border-blue-100 space-y-2 animate-fadeIn">
                <label className="text-xs font-bold text-blue-950 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-700" />
                  <span>{t('sampleCollectionAddress', 'Doorstep Collection Address')}:</span>
                </label>
                <textarea
                  value={patientAddress}
                  onChange={(e) => setPatientAddress(e.target.value)}
                  placeholder="House/Flat No, Street, Landmark, Area & Pincode"
                  rows={2}
                  className="w-full text-xs p-2.5 rounded-xl border border-blue-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#087E8B]"
                />
              </div>
            )}
          </div>

          {/* Appointment Date Selection */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-2.5">
            <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#087E8B]" />
              <span>{t('selectAppointmentDate', 'Select Appointment Date')}</span>
            </h4>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {appointmentDates.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setSelectedDate(item.label)}
                  className={`p-2.5 rounded-xl border text-center min-w-[90px] transition-all ${
                    selectedDate === item.label
                      ? 'border-[#087E8B] bg-[#087E8B] text-white shadow-2xs'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <span className="block font-bold text-xs">{item.label}</span>
                  <span
                    className={`block text-[10px] ${
                      selectedDate === item.label ? 'text-teal-100' : 'text-slate-400'
                    }`}
                  >
                    {item.sub}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Time Slot Selection */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  <span>{t('morningFastingSlots', 'Morning Fasting Slots (Recommended)')}</span>
                </h4>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                {morningFastingSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`p-2 rounded-xl text-xs font-bold border transition-all text-center ${
                      selectedSlot === slot
                        ? 'border-[#087E8B] bg-teal-50 text-[#087E8B] ring-2 ring-[#087E8B]/20'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <h4 className="font-bold text-xs text-slate-500 uppercase tracking-wider">
                {t('regularSlots', 'Regular Day Slots')}
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                {daytimeSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`p-2 rounded-xl text-xs font-bold border transition-all text-center ${
                      selectedSlot === slot
                        ? 'border-[#087E8B] bg-teal-50 text-[#087E8B] ring-2 ring-[#087E8B]/20'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Patient Details Form */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
            <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider">
              {t('patientDetails', 'Patient Details')}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">
                  {t('patientName', 'Patient Full Name')} *
                </label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#087E8B]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">
                  {t('contactNumber', 'Mobile Number')} *
                </label>
                <input
                  type="tel"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#087E8B]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">
                  {t('age', 'Age')} *
                </label>
                <input
                  type="number"
                  value={patientAge}
                  onChange={(e) => setPatientAge(e.target.value)}
                  placeholder="e.g. 35"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#087E8B]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">
                  {t('gender', 'Gender')} *
                </label>
                <div className="flex gap-2">
                  {(['Male', 'Female', 'Other'] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setPatientGender(g)}
                      className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all ${
                        patientGender === g
                          ? 'border-[#087E8B] bg-teal-50 text-[#087E8B]'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      {g === 'Male' ? t('male', 'Male') : g === 'Female' ? t('female', 'Female') : t('other', 'Other')}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {anyFastingRequired && (
              <label className="flex items-start gap-2 pt-2 border-t border-slate-100 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={fastingConfirmed}
                  onChange={(e) => setFastingConfirmed(e.target.checked)}
                  className="rounded text-[#087E8B] focus:ring-[#087E8B] w-4 h-4 mt-0.5"
                />
                <span>
                  {t('fastingInstructions', 'I confirm that the patient will maintain fasting prior to blood sample collection.')}
                </span>
              </label>
            )}
          </div>

          {/* Payment Choice */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-2.5">
            <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider">
              {t('paymentMethod', 'Payment Method')}
            </h4>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setPaymentChoice('PAY_AT_COLLECTION')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  paymentChoice === 'PAY_AT_COLLECTION'
                    ? 'border-[#087E8B] bg-teal-50/50 ring-2 ring-[#087E8B]/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span className="font-extrabold text-xs text-[#172B4D] block">
                  {t('payAtCollection', 'Pay at Centre / Cash')}
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  UPI or Cash
                </span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentChoice('PAY_ONLINE')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  paymentChoice === 'PAY_ONLINE'
                    ? 'border-[#087E8B] bg-teal-50/50 ring-2 ring-[#087E8B]/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span className="font-extrabold text-xs text-[#172B4D] block">
                  {t('payOnline', 'Pay Online Now')}
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  UPI, Cards or Netbanking
                </span>
              </button>
            </div>
          </div>

          {/* Confirm Button */}
          <button
            onClick={handleConfirmBooking}
            className="w-full py-3.5 bg-gradient-to-r from-[#087E8B] to-[#172B4D] hover:from-[#076d78] hover:to-[#12223c] text-white font-extrabold text-sm rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <span>
              {t('confirmTestBooking', 'Confirm & Book Test')} (₹{(selectedPackage ? selectedPackage.price : chosenLab.totalSelectedPrice) +
                (collectionMethod === 'HOME_COLLECTION' ? chosenLab.homeCollectionFee : 0)})
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCREEN 4: BOOKING CONFIRMED */}
      {/* ========================================================================= */}
      {currentStep === 'confirmed' && confirmedBookingResult && (
        <div className="p-4 space-y-4 max-w-xl mx-auto animate-fadeIn">
          {/* Success Card */}
          <div className="bg-white rounded-3xl border border-emerald-200 p-6 text-center shadow-md space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>

            <span className="inline-block bg-emerald-50 text-emerald-800 text-xs font-extrabold px-3 py-1 rounded-full border border-emerald-200">
              {t('bookingConfirmed', 'Booking Confirmed')}
            </span>

            <h2 className="text-lg font-black text-[#172B4D]">
              {t('bookingConfirmed', 'Diagnostic Checkup Scheduled!')}
            </h2>

            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Your appointment has been registered with {confirmedBookingResult.lab?.name}.
            </p>

            {/* Booking Code Token */}
            <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-3 max-w-xs mx-auto">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                {t('bookingRef', 'Booking Reference Token')}
              </span>
              <span className="text-base font-black text-[#087E8B] tracking-wider block mt-0.5">
                {confirmedBookingResult.bookingCode || 'DG-LAB-8419'}
              </span>
              <span className="text-[10px] text-slate-400 block mt-1">
                {t('barcodeTokenNotice', 'Show this digital token / barcode upon arrival')}
              </span>
            </div>
          </div>

          {/* Details Summary Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3 text-xs">
            <h4 className="font-bold text-slate-700 uppercase tracking-wider">
              {t('myAppointments', 'Booking Information')}
            </h4>

            <div className="grid grid-cols-2 gap-3 pb-3 border-b border-slate-100">
              <div>
                <span className="text-slate-400 text-[10px] block">{t('patientName', 'Patient Name')}</span>
                <span className="font-bold text-[#172B4D]">{patientName} ({patientAge}y, {patientGender})</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">{t('contactNumber', 'Mobile')}</span>
                <span className="font-bold text-[#172B4D]">{patientPhone}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">{t('selectTimeSlot', 'Scheduled Slot')}</span>
                <span className="font-bold text-[#172B4D]">{selectedDate} • {selectedSlot}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">{t('collectionType', 'Collection Mode')}</span>
                <span className="font-bold text-[#087E8B]">
                  {collectionMethod === 'HOME_COLLECTION' ? t('homeCollectionOption', 'Home Collection') : t('visitDiagnosticLab', 'Lab Visit')}
                </span>
              </div>
            </div>

            {/* Lab & Address */}
            <div>
              <span className="text-slate-400 text-[10px] block">{t('selectedTestSummary', 'Laboratory Facility')}</span>
              <span className="font-bold text-[#172B4D] block">{confirmedBookingResult.lab?.name}</span>
              <span className="text-slate-500 text-[11px] block mt-0.5">
                {confirmedBookingResult.lab?.address}, {confirmedBookingResult.lab?.area}, {confirmedBookingResult.lab?.city}
              </span>
            </div>

            {/* Preparation guidelines */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-amber-900 space-y-1">
              <p className="font-bold flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-amber-700" />
                <span>{t('preparationGuidelines', 'Preparation Instructions')}:</span>
              </p>
              <p className="text-[11px] text-amber-800">
                {t('fastingInstructions')}
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-2">
            {collectionMethod === 'LAB_VISIT' && confirmedBookingResult.lab && (
              <button
                onClick={() => handleOpenLiveNavigation(confirmedBookingResult.lab)}
                className="w-full py-3 bg-[#087E8B] hover:bg-[#076d78] text-white font-extrabold text-xs rounded-xl shadow-2xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Navigation className="w-4 h-4" />
                <span>{t('getDirectionsToLab', 'Get Driving Directions to Lab')}</span>
              </button>
            )}

            <button
              onClick={() => navigateTo('my-bookings')}
              className="w-full py-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-extrabold text-xs rounded-xl shadow-2xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>{t('viewInMyBookings', 'View in My Bookings')}</span>
            </button>

            <button
              onClick={() => {
                setCurrentStep('all-checkups');
                setConfirmedBookingResult(null);
                setSelectedPackage(null);
              }}
              className="w-full py-2.5 text-slate-500 hover:text-slate-800 font-bold text-xs"
            >
              {t('allCheckupsTitle', 'Book Another Checkup')}
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* COMPARE LABS MODAL */}
      {/* ========================================================================= */}
      {isCompareModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-sm text-[#172B4D] flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-[#087E8B]" />
                  <span>Compare Diagnostic Laboratories</span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  Side-by-side comparison for {selectedPackage ? selectedPackage.name : `${selectedTestIds.length} tests`}
                </p>
              </div>
              <button
                onClick={() => setIsCompareModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body: Comparison Table */}
            <div className="p-4 overflow-y-auto flex-1 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {(compareLabIds.length > 0
                  ? nearbyLabs.filter((l) => compareLabIds.includes(l.id))
                  : nearbyLabs.slice(0, 3)
                ).map((lab) => (
                  <div
                    key={lab.id}
                    className="border border-slate-200 rounded-2xl p-3 flex flex-col justify-between space-y-3 bg-slate-50/50"
                  >
                    <div>
                      <span className="text-[9px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded">
                        {lab.network}
                      </span>
                      <h4 className="font-extrabold text-xs text-[#172B4D] mt-1 line-clamp-2">
                        {lab.name}
                      </h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">{lab.area}, {lab.city}</p>

                      <div className="flex items-center gap-1 font-bold text-xs text-amber-600 mt-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{lab.rating}</span>
                        <span className="text-[10px] text-slate-400 font-normal">({lab.reviewCount})</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-[11px] pt-2 border-t border-slate-200">
                      <div>
                        <span className="text-slate-400 block text-[9px]">Test Price</span>
                        <span className="font-black text-sm text-[#087E8B]">
                          ₹{lab.totalSelectedPrice}
                        </span>
                        <span className="text-[10px] text-slate-400 line-through ml-1">
                          ₹{lab.totalMrpPrice}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[9px]">Distance</span>
                        <span className="font-bold text-slate-700">{lab.distanceStr}</span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[9px]">Accreditation</span>
                        <span className="font-semibold text-slate-700 text-[10px] block">
                          {lab.accreditation.join(', ')}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[9px]">Home Collection</span>
                        <span className="font-semibold text-slate-700 text-[10px]">
                          {lab.homeCollectionAvailable ? 'Available' : 'Lab Visit Only'}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setIsCompareModalOpen(false);
                        handleChooseLabToBook(lab);
                      }}
                      className="w-full py-2 bg-[#087E8B] hover:bg-[#076d78] text-white font-extrabold text-xs rounded-xl shadow-2xs"
                    >
                      Book This Lab
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* LOCATION DROPDOWN / SELECTOR MODAL */}
      {/* ========================================================================= */}
      {isLocationSelectorOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-sm w-full p-4 shadow-2xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-sm text-[#172B4D] flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#087E8B]" />
                <span>Select Medical Location / City</span>
              </h3>
              <button
                onClick={() => setIsLocationSelectorOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* GPS locate button */}
            <button
              onClick={() => {
                detectLiveLocation();
                setIsLocationSelectorOpen(false);
              }}
              className="w-full p-2.5 rounded-xl bg-teal-50 hover:bg-teal-100 border border-teal-200 text-[#087E8B] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Navigation className="w-4 h-4" />
              <span>Use Current GPS Location</span>
            </button>

            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pt-1">
              Popular Cities
            </div>

            <div className="grid grid-cols-2 gap-2">
              {availableCities.map((city) => (
                <button
                  key={city}
                  onClick={() => {
                    setCurrentCity(city);
                    setCurrentArea(city === 'Ashta' ? 'Kothri Kalan' : 'Central Hub');
                    setIsLocationSelectorOpen(false);
                    showToast(`Updated location to ${city}`, 'success');
                  }}
                  className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all ${
                    currentCity === city
                      ? 'border-[#087E8B] bg-teal-50 text-[#087E8B]'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* LIVE ROAD ROUTE NAVIGATION MODAL */}
      {/* ========================================================================= */}
      <LiveRouteNavigationModal
        isOpen={isNavModalOpen}
        onClose={() => setIsNavModalOpen(false)}
        target={navTarget}
      />
    </div>
  );
};
