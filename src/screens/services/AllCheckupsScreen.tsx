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
  Activity,
  Heart,
  Eye,
} from 'lucide-react';
import {
  LAB_TEST_CATALOG,
  LabTestItem,
  getLabsForSelectedTests,
  EnrichedLabWithPrice,
} from '../../data/labCatalogData';
import { VoiceSearchInput } from '../../components/common/VoiceSearchInput';
import {
  LiveRouteNavigationModal,
  NavigationTarget,
} from '../../components/navigation/LiveRouteNavigationModal';
import { DoctorMap, MapMarkerItem } from '../../components/doctor/DoctorMap';

type StepType = 'select-tests' | 'find-labs' | 'book-test' | 'confirmed';

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
  } = useApp();

  // Navigation steps
  const [currentStep, setCurrentStep] = useState<StepType>('select-tests');

  // Search & Filter in Step 1 (Select Tests)
  const [testSearchQuery, setTestSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Tests');
  const [selectedTestIds, setSelectedTestIds] = useState<string[]>([
    'test-cbc',
    'test-fbs',
  ]); // sensible defaults pre-selected
  const [expandedTestInfoId, setExpandedTestInfoId] = useState<string | null>(null);

  // Labs Filtering & Sorting in Step 2
  const [sortBy, setSortBy] = useState<'distance' | 'price' | 'rating'>('distance');
  const [filterHomeSample, setFilterHomeSample] = useState<boolean>(false);
  const [filterNablOnly, setFilterNablOnly] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedLabForMap, setSelectedLabForMap] = useState<EnrichedLabWithPrice | null>(null);

  // Compare Labs state
  const [compareLabIds, setCompareLabIds] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState<boolean>(false);

  // Selected Lab for Booking
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

  // Confirmed booking data
  const [confirmedBookingResult, setConfirmedBookingResult] = useState<any>(null);

  // Live Navigation Modal
  const [navTarget, setNavTarget] = useState<NavigationTarget | null>(null);
  const [isNavModalOpen, setIsNavModalOpen] = useState<boolean>(false);

  // City Picker Modal
  const [isCityPickerOpen, setIsCityPickerOpen] = useState<boolean>(false);

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

  // Test Categories
  const categories = [
    'All Tests',
    'Blood Tests',
    'Diabetes',
    'Thyroid',
    'Liver',
    'Kidney',
    'Heart Health',
    'Vitamins',
    'Urine Tests',
  ];

  // Filtered Tests for Step 1
  const filteredTests = useMemo(() => {
    return LAB_TEST_CATALOG.filter((test) => {
      const matchesCategory =
        selectedCategory === 'All Tests' || test.category === selectedCategory;
      const q = testSearchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        test.name.toLowerCase().includes(q) ||
        test.shortName.toLowerCase().includes(q) ||
        test.category.toLowerCase().includes(q) ||
        test.description.toLowerCase().includes(q) ||
        test.clinicalSignificance.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, testSearchQuery]);

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

  // Total base price
  const selectedTestsEstimatedTotal = useMemo(() => {
    return selectedTestItems.reduce((sum, t) => sum + t.basePrice, 0);
  }, [selectedTestItems]);

  const selectedTestsMrpTotal = useMemo(() => {
    return selectedTestItems.reduce((sum, t) => sum + t.mrp, 0);
  }, [selectedTestItems]);

  // Toggle test selection
  const toggleTestSelection = (testId: string) => {
    setSelectedTestIds((prev) => {
      if (prev.includes(testId)) {
        return prev.filter((id) => id !== testId);
      } else {
        return [...prev, testId];
      }
    });
  };

  // Nearby Labs calculation (Step 2)
  const nearbyLabs = useMemo(() => {
    const rawLabs = getLabsForSelectedTests(
      currentCity,
      currentArea,
      selectedTestIds,
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

  // Proceed to Step 2
  const handleProceedToFindLabs = () => {
    if (selectedTestIds.length === 0) {
      showToast('Please select at least 1 diagnostic test to find labs', 'error');
      return;
    }
    setCurrentStep('find-labs');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Proceed to Step 3 (Booking) with chosen lab
  const handleChooseLabToBook = (lab: EnrichedLabWithPrice) => {
    setChosenLab(lab);
    // If the lab doesn't do home collection, default to lab visit
    if (!lab.homeCollectionAvailable && collectionMethod === 'HOME_COLLECTION') {
      setCollectionMethod('LAB_VISIT');
    }
    setCurrentStep('book-test');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Confirm Final Booking (Step 3 -> Step 4)
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

    const testNamesString = selectedTestItems.map((t) => t.name).join(', ');
    const homeFee = collectionMethod === 'HOME_COLLECTION' ? chosenLab.homeCollectionFee : 0;
    const finalTotal = chosenLab.totalSelectedPrice + homeFee;

    const newBooking = addTestBooking({
      testOrPackageName:
        selectedTestItems.length === 1
          ? selectedTestItems[0].name
          : `${selectedTestItems.length} Tests Panel (${selectedTestItems.map((t) => t.shortName).join(' + ')})`,
      type: selectedTestItems.length === 1 ? 'single-test' : 'package',
      labName: chosenLab.name,
      collectionMethod: collectionMethod,
      collectionAddress: collectionMethod === 'HOME_COLLECTION' ? patientAddress : chosenLab.address,
      date: selectedDate === 'Tomorrow' ? 'Tomorrow, 08:00 AM' : selectedDate,
      timeSlot: selectedSlot,
      patientName: patientName,
      amount: finalTotal,
      paymentStatus: paymentChoice === 'PAY_ONLINE' ? 'PAID' : 'PAY_AT_COLLECTION',
      status: 'BOOKED',
    });

    setConfirmedBookingResult({
      ...newBooking,
      lab: chosenLab,
      selectedTests: selectedTestItems,
      collectionMethod,
      patientAddress,
      homeFee,
      finalTotal,
    });

    showToast('Diagnostic checkup booked successfully!', 'success');
    setCurrentStep('confirmed');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Step Navigation Back handler
  const handleStepBack = () => {
    if (currentStep === 'confirmed') {
      navigateTo('home');
    } else if (currentStep === 'book-test') {
      setCurrentStep('find-labs');
    } else if (currentStep === 'find-labs') {
      setCurrentStep('select-tests');
    } else {
      goBack();
    }
  };

  // Date Pills
  const appointmentDates = [
    { label: 'Today', sub: 'Urgent' },
    { label: 'Tomorrow', sub: 'Recommended' },
    { label: 'Wed, 26 Nov', sub: 'Available' },
    { label: 'Thu, 27 Nov', sub: 'Available' },
    { label: 'Fri, 28 Nov', sub: 'Available' },
  ];

  // Time slots
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
      <div className="bg-white border-b border-slate-200/80 sticky top-0 z-30 px-4 py-3 shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={handleStepBack}
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors"
            title="Back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-sm font-extrabold text-[#172B4D] leading-tight">
              {currentStep === 'select-tests' && 'Select Your Test'}
              {currentStep === 'find-labs' && 'Find Nearby Labs'}
              {currentStep === 'book-test' && 'Book Lab Checkup'}
              {currentStep === 'confirmed' && 'Booking Confirmed'}
            </h1>
            <p className="text-[10px] text-slate-500 font-medium">
              {currentStep === 'select-tests' && 'Verified NABL & CAP Accredited Pathology'}
              {currentStep === 'find-labs' && `${selectedTestIds.length} tests • ${currentArea}, ${currentCity}`}
              {currentStep === 'book-test' && `${chosenLab?.name}`}
              {currentStep === 'confirmed' && 'Sample collection scheduled'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {currentStep === 'find-labs' && (
            <button
              onClick={() => setIsCompareModalOpen(true)}
              className="text-xs font-bold text-[#087E8B] bg-teal-50 hover:bg-teal-100 border border-teal-200 px-2.5 py-1.5 rounded-full flex items-center gap-1 transition-colors"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Compare ({compareLabIds.length > 0 ? compareLabIds.length : 'All'})</span>
            </button>
          )}

          {currentStep === 'select-tests' && selectedTestIds.length > 0 && (
            <div className="bg-teal-50 border border-teal-200 text-[#087E8B] text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
              <span>{selectedTestIds.length} Selected</span>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* STEP 1: SELECT YOUR TEST */}
      {/* ========================================================================= */}
      {currentStep === 'select-tests' && (
        <div className="p-4 space-y-4 max-w-3xl mx-auto">
          {/* Hero Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#087E8B] to-[#172B4D] p-4 text-white shadow-md">
            <div className="relative z-10 space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="bg-white/20 backdrop-blur-xs text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Verified Lab Network
                </span>
                <span className="bg-amber-400 text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> 100% NABL Quality
                </span>
              </div>
              <h2 className="text-base font-extrabold text-white leading-tight">
                Accurate Blood, Urine & Health Screening Tests
              </h2>
              <p className="text-xs text-teal-100 leading-relaxed">
                Choose individual tests or comprehensive profiles. Compare real laboratory prices and get free doorstep sample collection.
              </p>
            </div>
          </div>

          {/* Voice & Text Search Bar */}
          <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-2xs">
            <VoiceSearchInput
              value={testSearchQuery}
              onChange={(e) => setTestSearchQuery(e.target.value)}
              onChangeValue={(val) => setTestSearchQuery(val)}
              placeholder="Search tests e.g. CBC, Fasting Sugar, Thyroid, LFT, KFT..."
              searchCategory="test"
              language="auto"
              onClear={() => setTestSearchQuery('')}
            />
          </div>

          {/* Test Categories Horizontal Scroll */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Test Categories
              </span>
              <span className="text-[11px] text-slate-400">
                {filteredTests.length} tests available
              </span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#087E8B] text-white shadow-xs font-bold'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Popular Bundles Quick-Select */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-700 flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-amber-950">
                  Popular Complete Preventive Screening
                </p>
                <p className="text-[10px] text-amber-800">
                  Selects CBC + Fasting Sugar + Thyroid Profile + Lipid Profile
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                const bundle = ['test-cbc', 'test-fbs', 'test-thyroid-profile', 'test-lipid'];
                setSelectedTestIds(bundle);
                showToast('Selected Popular Screening Bundle (4 Tests)', 'success');
              }}
              className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-2xs whitespace-nowrap"
            >
              Select All 4
            </button>
          </div>

          {/* Fasting Notice Banner (if any selected test requires fasting) */}
          {anyFastingRequired && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3 flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-blue-900 leading-snug">
                <span className="font-bold">Fasting Requirement:</span> One or more of your selected tests requires {maxFastingHours > 0 ? `${maxFastingHours} hours` : 'overnight'} fasting (water is allowed). Morning appointment slots are recommended.
              </div>
            </div>
          )}

          {/* Test Cards List */}
          <div className="space-y-3">
            {filteredTests.map((test) => {
              const isSelected = selectedTestIds.includes(test.id);
              const isExpanded = expandedTestInfoId === test.id;
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
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 cursor-pointer" onClick={() => toggleTestSelection(test.id)}>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700">
                          {test.category}
                        </span>
                        <span className="text-[10px] font-medium text-slate-500 flex items-center gap-1">
                          <Droplets className="w-3 h-3 text-red-500" /> {test.sampleType} Sample
                        </span>
                        {test.fastingRequired ? (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800">
                            Fasting: {test.fastingHours} hrs
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-emerald-50 text-emerald-700">
                            No fasting
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400">
                          Reports in {test.reportTurnaroundHours}h
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
                            ? 'bg-[#087E8B] text-white shadow-2xs hover:bg-[#076d78]'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Clinical info drawer toggle */}
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => setExpandedTestInfoId(isExpanded ? null : test.id)}
                      className="text-[11px] font-semibold text-[#087E8B] hover:underline flex items-center gap-1"
                    >
                      <Info className="w-3 h-3" />
                      <span>{isExpanded ? 'Hide clinical significance' : 'Why this test is done'}</span>
                    </button>
                    <span className="text-[10px] text-slate-400">
                      Standard Diagnostic Reference
                    </span>
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

            {filteredTests.length === 0 && (
              <div className="bg-white rounded-2xl p-8 text-center border border-slate-200">
                <Search className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h4 className="font-bold text-sm text-slate-700">No tests matched your search</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Try searching for keywords like "CBC", "Sugar", "Thyroid", "Lipid", or switch category.
                </p>
                <button
                  onClick={() => {
                    setTestSearchQuery('');
                    setSelectedCategory('All Tests');
                  }}
                  className="mt-3 px-4 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>

          {/* Sticky Bottom Summary Bar */}
          {selectedTestIds.length > 0 && (
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
                  onClick={handleProceedToFindLabs}
                  className="px-5 py-2.5 bg-gradient-to-r from-[#087E8B] to-[#172B4D] text-white font-extrabold text-xs rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 flex-shrink-0"
                >
                  <span>Find Labs ({selectedTestIds.length})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 2: FIND NEARBY LABS */}
      {/* ========================================================================= */}
      {currentStep === 'find-labs' && (
        <div className="p-4 space-y-4 max-w-3xl mx-auto">
          {/* Location Bar with Change option */}
          <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#087E8B] flex items-center justify-center font-bold">
                <MapPin className="w-5 h-5 text-[#087E8B]" />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Searching Labs Near
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <h3 className="font-extrabold text-xs text-[#172B4D]">
                  {currentArea}, {currentCity}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => detectLiveLocation()}
                disabled={isDetectingLocation}
                className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-[11px] font-bold text-slate-700 flex items-center gap-1"
                title="Detect GPS Location"
              >
                <Navigation className={`w-3.5 h-3.5 text-[#087E8B] ${isDetectingLocation ? 'animate-spin' : ''}`} />
                <span>{isDetectingLocation ? 'GPS...' : 'GPS'}</span>
              </button>
              <button
                onClick={() => setIsCityPickerOpen(true)}
                className="px-2.5 py-1.5 rounded-xl bg-[#087E8B]/10 hover:bg-[#087E8B]/20 text-[#087E8B] text-[11px] font-bold"
              >
                Change City
              </button>
            </div>
          </div>

          {/* Selected Tests Summary Pill Bar */}
          <div className="bg-teal-50/70 border border-teal-200 rounded-2xl p-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider">
                Selected Tests ({selectedTestIds.length})
              </span>
              <p className="text-xs font-extrabold text-[#172B4D] truncate max-w-xs mt-0.5">
                {selectedTestItems.map((t) => t.shortName).join(' + ')}
              </p>
            </div>
            <button
              onClick={() => setCurrentStep('select-tests')}
              className="text-xs font-bold text-[#087E8B] underline whitespace-nowrap ml-2"
            >
              Edit Tests
            </button>
          </div>

          {/* View Mode Toggle & Compare Labs trigger */}
          <div className="flex items-center justify-between gap-2">
            {/* List vs Map Switcher */}
            <div className="bg-slate-200/80 p-0.5 rounded-xl flex items-center">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'list'
                    ? 'bg-white text-[#172B4D] shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                List View ({nearbyLabs.length})
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                  viewMode === 'map'
                    ? 'bg-white text-[#172B4D] shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-[#087E8B]" />
                <span>Interactive Map</span>
              </button>
            </div>

            {/* Compare Drawer Button */}
            {compareLabIds.length > 0 && (
              <button
                onClick={() => setIsCompareModalOpen(true)}
                className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-2xs flex items-center gap-1"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Compare Selected ({compareLabIds.length})</span>
              </button>
            )}
          </div>

          {/* Sort & Filter Controls */}
          <div className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-2xs space-y-2.5">
            {/* Sort Options */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1 mr-1">
                <SlidersHorizontal className="w-3.5 h-3.5" /> Sort by:
              </span>
              <button
                onClick={() => setSortBy('distance')}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                  sortBy === 'distance'
                    ? 'bg-[#172B4D] text-white font-bold shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                📍 Distance (Nearest)
              </button>
              <button
                onClick={() => setSortBy('price')}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                  sortBy === 'price'
                    ? 'bg-[#172B4D] text-white font-bold shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                💰 Price (Lowest)
              </button>
              <button
                onClick={() => setSortBy('rating')}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                  sortBy === 'rating'
                    ? 'bg-[#172B4D] text-white font-bold shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                ⭐ Rating (Highest)
              </button>
            </div>

            {/* Filter Checkboxes */}
            <div className="flex items-center gap-3 pt-2 border-t border-slate-100 flex-wrap">
              <label className="flex items-center gap-1.5 text-xs text-slate-700 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={filterHomeSample}
                  onChange={(e) => setFilterHomeSample(e.target.checked)}
                  className="rounded text-[#087E8B] focus:ring-[#087E8B] w-3.5 h-3.5"
                />
                <span>🏠 Home Sample Collection</span>
              </label>

              <label className="flex items-center gap-1.5 text-xs text-slate-700 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={filterNablOnly}
                  onChange={(e) => setFilterNablOnly(e.target.checked)}
                  className="rounded text-[#087E8B] focus:ring-[#087E8B] w-3.5 h-3.5"
                />
                <span>🏅 NABL / CAP Accredited</span>
              </label>
            </div>
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

              {/* Lab Preview Drawer in Map View */}
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
                      Total: ₹{selectedLabForMap.totalSelectedPrice} for {selectedTestIds.length} tests
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleOpenLiveNavigation(selectedLabForMap)}
                      className="px-2.5 py-1.5 rounded-xl border border-teal-200 bg-teal-50 hover:bg-teal-100 text-[#087E8B] text-xs font-bold flex items-center gap-1"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Directions</span>
                    </button>
                    <button
                      onClick={() => handleChooseLabToBook(selectedLabForMap)}
                      className="px-3 py-1.5 rounded-xl bg-[#087E8B] hover:bg-[#076d78] text-white text-xs font-bold shadow-2xs"
                    >
                      Book Test
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= LIST VIEW MODE ================= */}
          {viewMode === 'list' && (
            <div className="space-y-3.5">
              {nearbyLabs.map((lab) => {
                const isCompared = compareLabIds.includes(lab.id);
                const allTestsOffered = lab.availableTestsCount === selectedTestIds.length;

                return (
                  <div
                    key={lab.id}
                    className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-2xs hover:shadow-md transition-all space-y-3"
                  >
                    {/* Header: Logo, Name, Rating, Compare */}
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
                            {lab.accreditation.slice(0, 2).map((acc) => (
                              <span
                                key={acc}
                                className="text-[10px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded flex items-center gap-0.5"
                              >
                                <ShieldCheck className="w-3 h-3 text-[#087E8B]" />
                                {acc}
                              </span>
                            ))}
                          </div>

                          <h3 className="font-extrabold text-sm text-[#172B4D] mt-1 leading-snug">
                            {lab.name}
                          </h3>

                          {/* Address & Locality */}
                          <p className="text-xs text-slate-500 font-medium mt-0.5 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                            <span>{lab.address}, {lab.area}</span>
                          </p>
                        </div>
                      </div>

                      {/* Compare checkbox */}
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

                    {/* Meta Row: Distance, Hours, Phone */}
                    <div className="grid grid-cols-3 gap-2 bg-slate-50/80 p-2.5 rounded-2xl text-[11px] border border-slate-100">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Distance & Drive</span>
                        <span className="font-bold text-[#172B4D] flex items-center gap-1 mt-0.5">
                          <Navigation className="w-3 h-3 text-[#087E8B]" />
                          {lab.distanceStr}
                        </span>
                        <span className="text-[10px] text-slate-500">{lab.driveTimeStr}</span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px]">Operating Hours</span>
                        <span className="font-bold text-[#172B4D] flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3 text-amber-500" />
                          {lab.openingTime} - {lab.closingTime}
                        </span>
                        <span className="text-[10px] text-emerald-600 font-semibold">Open Today</span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px]">Rating & Reviews</span>
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

                    {/* Test Availability and Home Sample tags */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2 flex-wrap">
                        {allTestsOffered ? (
                          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>All {selectedTestIds.length} Tests Available</span>
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                            {lab.availableTestsCount}/{selectedTestIds.length} Tests Offered
                          </span>
                        )}

                        {lab.homeCollectionAvailable ? (
                          <span className="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Home className="w-3 h-3 text-blue-600" />
                            <span>Home Collection Available ({lab.homeCollectionFee === 0 ? 'FREE' : `₹${lab.homeCollectionFee}`})</span>
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                            Lab Visit Only
                          </span>
                        )}
                      </div>

                      {/* Price Section */}
                      <div className="text-right">
                        <div className="flex items-baseline gap-1.5 justify-end">
                          <span className="text-xs text-slate-400">Total Price:</span>
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

                    {/* Action Buttons: View Location / Directions + Book Test */}
                    <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                      <a
                        href={`tel:${lab.phone.replace(/\s+/g, '')}`}
                        className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Call Lab</span>
                      </a>

                      <button
                        onClick={() => handleOpenLiveNavigation(lab)}
                        className="flex-1 py-2 rounded-xl border border-[#087E8B]/30 bg-teal-50 hover:bg-teal-100 text-[#087E8B] text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>View Location & Route</span>
                      </button>

                      <button
                        onClick={() => handleChooseLabToBook(lab)}
                        className="flex-1 py-2 rounded-xl bg-gradient-to-r from-[#087E8B] to-[#172B4D] hover:from-[#076d78] hover:to-[#12223c] text-white text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-2xs hover:shadow-md transition-all"
                      >
                        <span>Book Test</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {nearbyLabs.length === 0 && (
                <div className="bg-white rounded-2xl p-8 text-center border border-slate-200">
                  <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-2" />
                  <h4 className="font-bold text-sm text-slate-800">No laboratories matched filters</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Try unchecking filters or choose a nearby primary city like Bhopal or Indore.
                  </p>
                  <button
                    onClick={() => {
                      setFilterHomeSample(false);
                      setFilterNablOnly(false);
                      setSortBy('distance');
                    }}
                    className="mt-3 px-4 py-1.5 bg-[#087E8B] text-white rounded-xl text-xs font-bold"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 3: BOOK TEST (SCHEDULE & PATIENT DETAILS) */}
      {/* ========================================================================= */}
      {currentStep === 'book-test' && chosenLab && (
        <div className="p-4 space-y-4 max-w-2xl mx-auto">
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
                  {chosenLab.address}, {chosenLab.area}
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
              <span className="font-bold text-slate-700">{chosenLab.openingTime} - {chosenLab.closingTime} (Open Today)</span>
            </div>
          </div>

          {/* Selected Tests List & Price Summary */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider">
                Tests Included ({selectedTestItems.length})
              </h4>
              <button
                onClick={() => setCurrentStep('select-tests')}
                className="text-xs font-bold text-[#087E8B] hover:underline"
              >
                Change Tests
              </button>
            </div>

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

            {/* Total Calculation */}
            <div className="pt-2 border-t border-slate-200 space-y-1 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Tests Subtotal:</span>
                <span>₹{chosenLab.totalSelectedPrice}</span>
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
                  ₹{chosenLab.totalSelectedPrice + (collectionMethod === 'HOME_COLLECTION' ? chosenLab.homeCollectionFee : 0)}
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
                  <h5 className="font-extrabold text-xs text-[#172B4D]">Visit Diagnostic Lab</h5>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Visit centre directly at selected time slot. No waiting.
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
                    <h5 className="font-extrabold text-xs text-[#172B4D]">Home Sample Collection</h5>
                    {chosenLab.homeCollectionFee === 0 && (
                      <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1 py-0.2 rounded">
                        FREE
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Trained certified phlebotomist visits your doorstep.
                  </p>
                </div>
              </button>
            </div>

            {/* Address input if Home Collection */}
            {collectionMethod === 'HOME_COLLECTION' && (
              <div className="mt-3 p-3 bg-blue-50/60 rounded-2xl border border-blue-100 space-y-2 animate-fadeIn">
                <label className="text-xs font-bold text-blue-950 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-700" />
                  <span>Doorstep Collection Address:</span>
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
              <span>Select Appointment Date</span>
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
                  <span>Morning Fasting Slots (Recommended)</span>
                </h4>
                <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-bold">
                  Ideal for Sugar & Lipid
                </span>
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
                Regular Day Slots
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
              Patient Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">
                  Patient Full Name *
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
                  Mobile Number *
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
                  Age (Years) *
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
                  Gender *
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
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Fasting Declaration */}
            {anyFastingRequired && (
              <label className="flex items-start gap-2 pt-2 border-t border-slate-100 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={fastingConfirmed}
                  onChange={(e) => setFastingConfirmed(e.target.checked)}
                  className="rounded text-[#087E8B] focus:ring-[#087E8B] w-4 h-4 mt-0.5"
                />
                <span>
                  I confirm that the patient will maintain {maxFastingHours > 0 ? `${maxFastingHours} hours` : 'overnight'} fasting prior to blood sample collection.
                </span>
              </label>
            )}
          </div>

          {/* Payment Choice */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-2.5">
            <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider">
              Payment Method
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
                  Pay at Centre / Cash
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  Pay after sample collection via UPI or Cash
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
                  Pay Online (Instant)
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  Google Pay, PhonePe, Cards or Netbanking
                </span>
              </button>
            </div>
          </div>

          {/* Final Confirm CTA Button */}
          <button
            onClick={handleConfirmBooking}
            className="w-full py-3.5 bg-gradient-to-r from-[#087E8B] to-[#172B4D] hover:from-[#076d78] hover:to-[#12223c] text-white font-extrabold text-sm rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <span>
              Confirm & Book (₹{chosenLab.totalSelectedPrice + (collectionMethod === 'HOME_COLLECTION' ? chosenLab.homeCollectionFee : 0)})
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 4: BOOKING CONFIRMED */}
      {/* ========================================================================= */}
      {currentStep === 'confirmed' && confirmedBookingResult && (
        <div className="p-4 space-y-4 max-w-xl mx-auto">
          {/* Success Card */}
          <div className="bg-white rounded-3xl border border-emerald-200 p-6 text-center shadow-md space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>

            <span className="inline-block bg-emerald-50 text-emerald-800 text-xs font-extrabold px-3 py-1 rounded-full border border-emerald-200">
              Booking Confirmed
            </span>

            <h2 className="text-lg font-black text-[#172B4D]">
              Diagnostic Checkup Scheduled!
            </h2>

            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Your appointment has been registered with {confirmedBookingResult.lab?.name}. Digital confirmation has been sent to {patientPhone}.
            </p>

            {/* Booking Code Ticket */}
            <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-3 max-w-xs mx-auto">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                Booking Reference Token
              </span>
              <span className="text-base font-black text-[#087E8B] tracking-wider block mt-0.5">
                {confirmedBookingResult.bookingCode || 'DG-LAB-8419'}
              </span>
              <span className="text-[10px] text-slate-400 block mt-1">
                Show this barcode / token at the laboratory desk
              </span>
            </div>
          </div>

          {/* Details Summary Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3 text-xs">
            <h4 className="font-bold text-slate-700 uppercase tracking-wider">
              Booking Information
            </h4>

            <div className="grid grid-cols-2 gap-3 pb-3 border-b border-slate-100">
              <div>
                <span className="text-slate-400 text-[10px] block">Patient Name</span>
                <span className="font-bold text-[#172B4D]">{patientName} ({patientAge}y, {patientGender})</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Mobile</span>
                <span className="font-bold text-[#172B4D]">{patientPhone}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Scheduled Date & Time</span>
                <span className="font-bold text-[#172B4D]">{selectedDate} • {selectedSlot}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Collection Mode</span>
                <span className="font-bold text-[#087E8B]">
                  {collectionMethod === 'HOME_COLLECTION' ? 'Doorstep Home Collection' : 'Diagnostic Lab Visit'}
                </span>
              </div>
            </div>

            {/* Lab & Address */}
            <div>
              <span className="text-slate-400 text-[10px] block">Laboratory Facility</span>
              <span className="font-bold text-[#172B4D] block">{confirmedBookingResult.lab?.name}</span>
              <span className="text-slate-500 text-[11px] block mt-0.5">
                {confirmedBookingResult.lab?.address}, {confirmedBookingResult.lab?.area}
              </span>
            </div>

            {/* Preparation guidelines */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-amber-900 space-y-1">
              <p className="font-bold flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-amber-700" />
                <span>Preparation Instructions:</span>
              </p>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-800">
                {anyFastingRequired && (
                  <li>Maintain 8-10 hours overnight fasting. You may drink plain water.</li>
                )}
                <li>Avoid heavy fatty meals, alcohol, or smoking 12 hours prior to test.</li>
                <li>Carry a valid photo ID (Aadhaar or Voter ID).</li>
              </ul>
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
                <span>Get Driving Directions to Lab</span>
              </button>
            )}

            <button
              onClick={() => navigateTo('my-bookings')}
              className="w-full py-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-extrabold text-xs rounded-xl shadow-2xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>View in My Bookings</span>
            </button>

            <button
              onClick={() => {
                setCurrentStep('select-tests');
                setConfirmedBookingResult(null);
              }}
              className="w-full py-2.5 text-slate-500 hover:text-slate-800 font-bold text-xs"
            >
              Book Another Checkup
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
                  Side-by-side comparison for your {selectedTestIds.length} selected tests
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
                      <p className="text-[10px] text-slate-500 mt-0.5">{lab.area}</p>

                      <div className="flex items-center gap-1 font-bold text-xs text-amber-600 mt-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{lab.rating}</span>
                        <span className="text-[10px] text-slate-400 font-normal">({lab.reviewCount})</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-[11px] pt-2 border-t border-slate-200">
                      <div>
                        <span className="text-slate-400 block text-[9px]">Package Price</span>
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
      {/* CITY PICKER MODAL */}
      {/* ========================================================================= */}
      {isCityPickerOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-sm w-full p-4 shadow-2xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-sm text-[#172B4D]">
                Select Medical Region / City
              </h3>
              <button
                onClick={() => setIsCityPickerOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {availableCities.map((city) => (
                <button
                  key={city}
                  onClick={() => {
                    setCurrentCity(city);
                    setCurrentArea(city === 'Ashta' ? 'Kothri Kalan' : 'Central Hub');
                    setIsCityPickerOpen(false);
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
