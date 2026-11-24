import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Search,
  Star,
  ShieldCheck,
  Building2,
  Phone,
  Clock,
  Calendar as CalendarIcon,
  CheckCircle2,
  QrCode,
  Share2,
  Download,
  AlertCircle,
  CreditCard,
  Wallet,
  Smartphone,
  Banknote,
  Upload,
  User,
  Users,
  Check,
  Sparkles,
  Info,
  Navigation,
  Crosshair,
  Stethoscope,
  HeartPulse,
  Bone,
  Brain,
  Baby,
  Ear,
  Eye,
  Smile,
  Activity,
  Wind,
  Droplets,
  ArrowRight,
  Filter,
  X,
  Mic,
  MicOff,
} from 'lucide-react';
import {
  HOSPITALS,
  DOCTORS,
  DEPARTMENTS,
} from '../../data/mockData';
import { Hospital, Doctor, Department } from '../../types';
import confetti from 'canvas-confetti';
import { getNearbyHospitals, getNearbyDoctors, HospitalWithDistance, DoctorWithDistance, formatLocationName } from '../../utils/locationHelper';
import { initiateRazorpayPayment } from '../../services/razorpayService';
import { searchIndiaLocations, LocationSuggestion, INDIA_LOCATIONS_DATABASE } from '../../services/indiaLocationService';
import { VoiceSearchInput } from '../../components/common/VoiceSearchInput';
import { TravelTimeCardSection } from '../../components/navigation/TravelTimeCardSection';
import { LiveRouteNavigationModal, NavigationTarget } from '../../components/navigation/LiveRouteNavigationModal';

// The 14 Required Medical Departments with modern icons and descriptions
export interface MedicalDeptItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  doctorCount: number;
}

export const APPOINTMENT_DEPARTMENTS: MedicalDeptItem[] = [
  { id: 'gen-med', name: 'General Medicine', icon: Stethoscope, description: 'Fever, cough, cold, infections & adult care', doctorCount: 42 },
  { id: 'cardio', name: 'Cardiology', icon: HeartPulse, description: 'Heart, blood pressure, ECG & cardiac care', doctorCount: 28 },
  { id: 'derma', name: 'Dermatology', icon: Sparkles, description: 'Skin, hair, acne, allergies & cosmetic care', doctorCount: 24 },
  { id: 'ortho', name: 'Orthopedics', icon: Bone, description: 'Bones, joints, arthritis, fracture & spine', doctorCount: 31 },
  { id: 'neuro', name: 'Neurology', icon: Brain, description: 'Brain, nerves, migraine, headache & stroke', doctorCount: 19 },
  { id: 'pedia', name: 'Pediatrics', icon: Baby, description: 'Infants, child health, growth & vaccines', doctorCount: 35 },
  { id: 'gynae', name: 'Gynecology', icon: Users, description: "Women's health, maternity & pregnancy care", doctorCount: 38 },
  { id: 'ent', name: 'ENT', icon: Ear, description: 'Ear, nose, throat, sinuses & hearing', doctorCount: 22 },
  { id: 'ophtha', name: 'Ophthalmology', icon: Eye, description: 'Eye checkup, vision, cataracts & glaucoma', doctorCount: 26 },
  { id: 'dent', name: 'Dentistry', icon: Smile, description: 'Teeth, root canal, braces, cavity & gums', doctorCount: 20 },
  { id: 'psych', name: 'Psychiatry', icon: Activity, description: 'Mental wellness, stress, anxiety & depression', doctorCount: 18 },
  { id: 'gastro', name: 'Gastroenterology', icon: Activity, description: 'Stomach, liver, acidity, digestion & endoscopy', doctorCount: 16 },
  { id: 'pulmo', name: 'Pulmonology', icon: Wind, description: 'Lungs, asthma, chest infections & breathing', doctorCount: 14 },
  { id: 'uro', name: 'Urology', icon: Droplets, description: 'Kidneys, bladder, urinary tract & stones', doctorCount: 15 },
];

export const BookAppointmentFlow: React.FC = () => {
  const {
    navigateTo,
    goBack,
    screenParams,
    currentCity,
    currentArea,
    setCurrentCity,
    setCurrentArea,
    isDetectingLocation,
    detectLiveLocation,
    user,
    familyMembers,
    addAppointment,
    requireAuth,
    showToast,
    t,
  } = useApp();

  // If user selected a specific doctor from outside (e.g. Find Doctor screen), jump to slot selection (step 5)
  const initialStep = screenParams?.selectedDoctorId ? 5 : screenParams?.step || 1;
  const [currentStep, setCurrentStep] = useState<number>(initialStep);

  // Selected State across the entire flow (preserved across pages)
  const [selectedDeptId, setSelectedDeptId] = useState<string>(
    screenParams?.selectedDepartmentId || 'gen-med'
  );
  const selectedDepartment = useMemo(() => {
    return (
      APPOINTMENT_DEPARTMENTS.find((d) => d.id === selectedDeptId) ||
      APPOINTMENT_DEPARTMENTS[0]
    );
  }, [selectedDeptId]);

  const [selectedHospital, setSelectedHospital] = useState<Hospital>(
    HOSPITALS.find((h) => h.id === screenParams?.selectedHospitalId) || HOSPITALS[0]
  );

  const [selectedDoctor, setSelectedDoctor] = useState<Doctor>(
    DOCTORS.find((d) => d.id === screenParams?.selectedDoctorId) || DOCTORS[0]
  );

  // Live Navigation Modal Target (for doctors & hospitals)
  const [navTarget, setNavTarget] = useState<NavigationTarget | null>(null);

  // ==========================================================
  // STEP 1 STATE: CHOOSE YOUR LOCATION
  // ==========================================================
  const [locationSearchInput, setLocationSearchInput] = useState(
    formatLocationName(currentArea, currentCity)
  );
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([]);
  const [isSearchingLocations, setIsSearchingLocations] = useState(false);
  const locationSearchDebounce = useRef<any>(null);

  // Auto-sync search input on GPS detection or external location changes
  useEffect(() => {
    if (!isDetectingLocation && (currentCity || currentArea)) {
      setLocationSearchInput(formatLocationName(currentArea, currentCity));
    }
  }, [isDetectingLocation, currentCity, currentArea]);

  // Search input debounced handler for any Indian location
  useEffect(() => {
    if (!locationSearchInput || locationSearchInput.trim().length < 2) {
      setLocationSuggestions([]);
      setIsSearchingLocations(false);
      return;
    }

    setIsSearchingLocations(true);
    clearTimeout(locationSearchDebounce.current);
    locationSearchDebounce.current = setTimeout(async () => {
      try {
        const results = await searchIndiaLocations(locationSearchInput, { limit: 6 });
        setLocationSuggestions(results);
      } catch (e) {
        // Fallback to local DB
        const clean = locationSearchInput.toLowerCase().trim();
        const fallback = INDIA_LOCATIONS_DATABASE.filter(
          (loc) =>
            loc.name.toLowerCase().includes(clean) ||
            loc.city.toLowerCase().includes(clean) ||
            loc.state.toLowerCase().includes(clean) ||
            (loc.pincode && loc.pincode.includes(clean))
        ).slice(0, 5);
        setLocationSuggestions(fallback);
      } finally {
        setIsSearchingLocations(false);
      }
    }, 250);

    return () => clearTimeout(locationSearchDebounce.current);
  }, [locationSearchInput]);

  const handleSelectLocationItem = (loc: LocationSuggestion) => {
    setCurrentCity(loc.city);
    setCurrentArea(loc.locality || loc.name);
    setLocationSearchInput(formatLocationName(loc.locality || loc.name, loc.city));
    setLocationSuggestions([]);
    showToast(`Location set to ${formatLocationName(loc.name, loc.city)}`, 'success');
  };

  const activeSelectedLocation = locationSearchInput.trim() || formatLocationName(currentArea, currentCity);
  const isLocationSelected = Boolean(activeSelectedLocation && activeSelectedLocation.length > 0);

  // ==========================================================
  // STEP 3 STATE: 3 OPTIONS REQUESTED BY USER
  // 1. Choose Doctor ('doctor')
  // 2. Private Hospital ('private')
  // 3. Govt Hospital ('government')
  // ==========================================================
  const [step3Option, setStep3Option] = useState<'doctor' | 'private' | 'government'>('doctor');
  const [hospitalKeyword, setHospitalKeyword] = useState('');

  // 1. DOCTORS FOR THIS DEPARTMENT & LOCATION
  const departmentDoctors = useMemo(() => {
    const nearby = getNearbyDoctors(currentCity, currentArea, DOCTORS, HOSPITALS);
    const deptName = selectedDepartment.name.toLowerCase();

    let matched = nearby.filter((d) => {
      const sp = d.specialty.toLowerCase();
      return (
        sp.includes(deptName) ||
        deptName.includes(sp) ||
        (deptName === 'general medicine' && (sp.includes('physician') || sp.includes('medicine'))) ||
        (deptName === 'cardiology' && sp.includes('cardio')) ||
        (deptName === 'dermatology' && sp.includes('derma')) ||
        (deptName === 'orthopedics' && sp.includes('ortho')) ||
        (deptName === 'pediatrics' && sp.includes('pedia')) ||
        (deptName === 'neurology' && sp.includes('neuro')) ||
        (deptName === 'dentistry' && sp.includes('dent')) ||
        (deptName === 'ent' && sp.includes('ent')) ||
        (deptName === 'gynecology' && (sp.includes('gynec') || sp.includes('obstet'))) ||
        (deptName === 'ophthalmology' && sp.includes('eye'))
      );
    });

    if (matched.length === 0) {
      matched = nearby;
    }

    if (hospitalKeyword.trim()) {
      const q = hospitalKeyword.toLowerCase().trim();
      matched = matched.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.specialty.toLowerCase().includes(q) ||
          d.hospitalName.toLowerCase().includes(q) ||
          d.qualification.toLowerCase().includes(q)
      );
    }

    return matched;
  }, [currentCity, currentArea, selectedDepartment, hospitalKeyword]);

  // 2. ALL HOSPITALS MATCHING DEPARTMENT
  const allHospitalsForDept = useMemo(() => {
    const nearby = getNearbyHospitals(currentCity, currentArea, HOSPITALS);
    const deptName = selectedDepartment.name.toLowerCase();

    let matched = nearby.filter((h) => {
      return h.departments.some((d) => {
        const dLower = d.toLowerCase();
        return (
          dLower.includes(deptName) ||
          deptName.includes(dLower) ||
          (deptName === 'general medicine' && dLower.includes('medicine')) ||
          (deptName === 'gynecology' && (dLower.includes('gynecology') || dLower.includes('obstetrics'))) ||
          (deptName === 'ent' && (dLower.includes('ent') || dLower.includes('throat'))) ||
          (deptName === 'dentistry' && (dLower.includes('dent') || dLower.includes('dental')))
        );
      });
    });

    if (matched.length === 0) {
      matched = nearby;
    }

    if (hospitalKeyword.trim()) {
      const q = hospitalKeyword.toLowerCase().trim();
      matched = matched.filter(
        (h) => h.name.toLowerCase().includes(q) || h.area.toLowerCase().includes(q)
      );
    }

    return matched;
  }, [currentCity, currentArea, selectedDepartment, hospitalKeyword]);

  // 3. PRIVATE HOSPITALS
  const privateHospitals = useMemo(() => {
    const priv = allHospitalsForDept.filter((h) => h.type === 'Private');
    if (priv.length === 0) {
      return HOSPITALS.filter((h) => h.type === 'Private').map((h) => ({
        ...h,
        calculatedDistanceKm: 4.2,
        calculatedDistanceStr: '4.2 km',
        driveTimeStr: '12 mins drive',
        isImmediate: false,
        isNearby: true,
      }));
    }
    return priv;
  }, [allHospitalsForDept]);

  // 4. GOVERNMENT HOSPITALS
  const govtHospitals = useMemo(() => {
    const gov = allHospitalsForDept.filter((h) => h.type === 'Government');
    if (gov.length === 0) {
      return HOSPITALS.filter((h) => h.type === 'Government').map((h) => ({
        ...h,
        calculatedDistanceKm: 2.5,
        calculatedDistanceStr: '2.5 km',
        driveTimeStr: '8 mins drive',
        isImmediate: false,
        isNearby: true,
      }));
    }
    return gov;
  }, [allHospitalsForDept]);

  const matchingHospitals = allHospitalsForDept;

  // ==========================================================
  // STEP 4 STATE: DOCTOR SELECTION
  // Doctors at the selected hospital matching the selected department
  // ==========================================================
  const matchingDoctors = useMemo(() => {
    const nearby = getNearbyDoctors(currentCity, currentArea, DOCTORS, HOSPITALS);
    const deptName = selectedDepartment.name.toLowerCase();

    // Prioritize doctors affiliated with selected hospital or department
    const forThisHospital = nearby.filter(
      (d) =>
        d.hospitalId === selectedHospital.id ||
        d.hospitalName.toLowerCase().includes(selectedHospital.name.toLowerCase())
    );

    const forThisDept = nearby.filter((d) => {
      const sp = d.specialty.toLowerCase();
      return (
        sp.includes(deptName) ||
        deptName.includes(sp) ||
        (deptName === 'general medicine' && sp.includes('physician')) ||
        (deptName === 'cardiology' && sp.includes('cardio')) ||
        (deptName === 'dermatology' && sp.includes('derma')) ||
        (deptName === 'orthopedics' && sp.includes('ortho')) ||
        (deptName === 'pediatrics' && sp.includes('pedia')) ||
        (deptName === 'neurology' && sp.includes('neuro')) ||
        (deptName === 'dentistry' && sp.includes('dent'))
      );
    });

    // Combine unique
    const set = new Set<string>();
    const combined: DoctorWithDistance[] = [];

    forThisHospital.forEach((d) => {
      set.add(d.id);
      combined.push(d);
    });

    forThisDept.forEach((d) => {
      if (!set.has(d.id)) {
        set.add(d.id);
        combined.push(d);
      }
    });

    // Fallback if none found
    if (combined.length === 0) {
      return nearby.slice(0, 6);
    }

    return combined;
  }, [selectedHospital, selectedDepartment, currentCity, currentArea]);

  // ==========================================================
  // STEP 5 STATE: DATE & SLOT SELECTION
  // ==========================================================
  const [selectedDate, setSelectedDate] = useState<string>('2026-11-25');
  const [selectedSlot, setSelectedSlot] = useState<string>('10:30 AM');
  const [consultationType, setConsultationType] = useState<'in-person' | 'video'>('in-person');

  const dates = [
    { day: 'Wed', date: '25', full: '2026-11-25', label: 'Today' },
    { day: 'Thu', date: '26', full: '2026-11-26', label: 'Tomorrow' },
    { day: 'Fri', date: '27', full: '2026-11-27' },
    { day: 'Sat', date: '28', full: '2026-11-28' },
    { day: 'Sun', date: '29', full: '2026-11-29' },
    { day: 'Mon', date: '30', full: '2026-11-30' },
  ];

  const morningSlots = ['09:30 AM', '10:00 AM', '10:30 AM', '11:15 AM (Full)', '11:45 AM'];
  const afternoonSlots = ['02:00 PM', '02:30 PM (Full)', '03:15 PM', '03:45 PM'];
  const eveningSlots = ['04:30 PM', '05:00 PM', '05:30 PM', '06:15 PM (Full)', '07:00 PM'];

  // ==========================================================
  // STEP 6 STATE: PATIENT DETAILS
  // ==========================================================
  const [patientName, setPatientName] = useState(user?.name || 'Subhasis Gupta');
  const [patientAge, setPatientAge] = useState(48);
  const [patientGender, setPatientGender] = useState('male');
  const [patientPhone, setPatientPhone] = useState(user?.phone || '+91 98301 54321');
  const [visitReason, setVisitReason] = useState('Routine consultation & diagnostic checkup');
  const [symptoms, setSymptoms] = useState('Occasional dizziness, mild blood pressure fluctuations');

  // ==========================================================
  // STEP 7 STATE: PAYMENT & CONFIRMATION
  // ==========================================================
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'Wallet' | 'Hospital'>('UPI');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);

  const handleExecutePayment = () => {
    requireAuth(async () => {
      setIsProcessingPayment(true);

      const completeBooking = (razorpayPaymentId?: string) => {
        setIsProcessingPayment(false);

        const newBooking = addAppointment({
          patientId: 'patient-demo-01',
          patientName,
          patientAge,
          patientGender,
          patientPhone,
          doctorId: selectedDoctor.id,
          doctorName: selectedDoctor.name,
          doctorSpecialty: selectedDoctor.specialty,
          doctorImage: selectedDoctor.imageUrl,
          hospitalId: selectedHospital.id,
          hospitalName: selectedHospital.name,
          hospitalAddress: selectedHospital.address,
          department: selectedDepartment.name,
          date: selectedDate,
          timeSlot: selectedSlot,
          consultationType: 'in-person',
          fee: selectedDoctor.consultationFee,
          bookingStatus: 'UPCOMING',
          paymentStatus: paymentMethod === 'Hospital' ? 'PAY_AT_HOSPITAL' : 'PAID',
          paymentMethod,
          tokenNumber: 24,
          currentToken: 21,
          patientNumber: 24,
          patientNumberStr: '#024',
          opdRoom: 'Room OPD 03',
          estimatedWaitMinutes: 15,
          queueStatus: 'WAITING',
          reason: 'General Consultation',
          isDemo: true,
          notes: razorpayPaymentId ? `Razorpay ID: ${razorpayPaymentId}` : undefined,
        });

        setConfirmedBooking(newBooking);
        setCurrentStep(8); // Go to Confirmation Slip

        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {
          // ignore
        }
      };

      if (paymentMethod === 'Hospital') {
        completeBooking();
      } else {
        // Trigger Razorpay Checkout Modal
        try {
          const paymentResult = await initiateRazorpayPayment({
            amount: selectedDoctor.consultationFee,
            orderId: `ORD_${Date.now()}`,
            name: 'Doctor G Healthcare',
            description: `Consultation with ${selectedDoctor.name}`,
            prefill: {
              name: patientName || 'Patient',
              email: 'patient@doctorg.in',
              contact: patientPhone || '+919999999999',
            },
            theme: '#087E8B',
          });

          if (paymentResult.success) {
            completeBooking(paymentResult.paymentId);
          } else {
            setIsProcessingPayment(false);
            showToast(paymentResult.error || 'Payment cancelled', 'error');
          }
        } catch (err: any) {
          setIsProcessingPayment(false);
          showToast(err.message || 'Payment processing failed', 'error');
        }
      }
    }, 'Sign in to confirm your appointment reservation');
  };

  // Back Navigation Handler
  const handleBack = () => {
    if (currentStep === 8) {
      navigateTo('home');
    } else if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    } else {
      goBack();
    }
  };

  // Step Titles and Subtitles
  const getStepHeaderInfo = () => {
    switch (currentStep) {
      case 1:
        return { title: 'Choose Your Location', subtitle: 'Find hospitals and clinics near you.' };
      case 2:
        return { title: 'Select Your Department', subtitle: `Choose medical specialty in ${currentCity}` };
      case 3:
        return { title: 'Hospitals & Clinics', subtitle: `Facilities offering ${selectedDepartment.name}` };
      case 4:
        return { title: 'Choose Doctor', subtitle: `${selectedDepartment.name} consultants at ${selectedHospital.name}` };
      case 5:
        return { title: 'Select Date & Slot', subtitle: 'Choose your preferred OPD consultation timing' };
      case 6:
        return { title: 'Patient Information', subtitle: 'Fill in consultation details and symptoms' };
      case 7:
        return { title: 'Review & Payment', subtitle: 'Verify appointment summary and confirm booking' };
      case 8:
        return { title: 'Appointment Confirmed', subtitle: 'Official digital appointment confirmation slip' };
      default:
        return { title: 'Book Appointment', subtitle: 'Doctor G Healthcare Network' };
    }
  };

  const headerInfo = getStepHeaderInfo();

  return (
    <div className="min-h-full pb-20 bg-[#F6F8FA]">
      {/* Top Sticky Header with Back Button & Step Indicator */}
      <div className="bg-white border-b border-slate-100 p-4 sticky top-0 z-20 shadow-2xs">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={handleBack}
            className="flex items-center gap-1 text-slate-600 hover:text-[#172B4D] text-xs font-bold transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{currentStep === 8 ? t('home', 'Home') : t('back', 'Back')}</span>
          </button>

          <span className="text-xs font-black text-[#172B4D]">
            {currentStep === 8 ? t('officialSlip', 'Official Slip') : `Step ${currentStep} of 7`}
          </span>

          <span className="text-[10px] font-extrabold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200/80">
            Doctor G Booking
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-[#087E8B] to-emerald-500 h-full transition-all duration-300"
            style={{ width: `${(Math.min(currentStep, 7) / 7) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="p-4">
        {/* ========================================================
            STEP 1: CHOOSE YOUR LOCATION
            ======================================================== */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-in fade-in">
            <div>
              <h2 className="text-xl font-black text-[#172B4D] tracking-tight">
                {t('selectMedicalLocation', 'Choose Your Location')}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                {t('findHospitalsDoctors', 'Find hospitals and clinics near you.')}
              </p>
            </div>

            {/* Prominent "Use My Current Location" button with GPS */}
            <button
              onClick={detectLiveLocation}
              disabled={isDetectingLocation}
              className="w-full p-4 bg-gradient-to-r from-teal-50 to-emerald-50 hover:from-teal-100/70 hover:to-emerald-100/70 border-2 border-[#087E8B] rounded-2xl flex items-center justify-between shadow-xs transition-all active:scale-[0.99] group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#087E8B] text-white flex items-center justify-center shadow-xs">
                  {isDetectingLocation ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Crosshair className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  )}
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-[#172B4D]">
                      {isDetectingLocation ? 'Detecting GPS Location...' : 'Use My Current Location'}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  </div>
                  <p className="text-[11px] text-teal-800 font-medium mt-0.5">
                    Auto-detect live GPS coordinates instantly
                  </p>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-[#087E8B] group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Location Search Field with Reusable Voice Search */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Or Search Any City / Locality in India
              </label>
              <VoiceSearchInput
                value={locationSearchInput}
                onChange={(e) => setLocationSearchInput(e.target.value)}
                onChangeValue={async (val) => {
                  setLocationSearchInput(val);
                  try {
                    const results = await searchIndiaLocations(val, { limit: 5 });
                    if (results && results.length > 0) {
                      handleSelectLocationItem(results[0]);
                    }
                  } catch (e) {
                    console.error(e);
                  }
                }}
                onClear={() => {
                  setLocationSearchInput('');
                  setLocationSuggestions([]);
                  setCurrentCity('');
                  setCurrentArea('');
                }}
                placeholder="Search city, area or locality..."
                searchCategory="location"
              />

              {/* Suggestions Dropdown */}
              {isSearchingLocations ? (
                <div className="mt-1.5 p-3 bg-white rounded-xl border border-slate-200 text-center text-xs text-slate-400">
                  Searching locations across India...
                </div>
              ) : locationSuggestions.length > 0 ? (
                <div className="mt-1.5 bg-white rounded-2xl border border-slate-200 shadow-md divide-y divide-slate-100 max-h-56 overflow-y-auto">
                  {locationSuggestions.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleSelectLocationItem(item)}
                      className="p-3 hover:bg-teal-50 cursor-pointer flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[#087E8B]" />
                        <span className="text-xs font-bold text-[#172B4D]">
                          {item.name}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {item.city && item.city.toLowerCase() !== item.name.toLowerCase() ? `${item.city}, ` : ''}{item.state}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded">
                        Select
                      </span>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            {/* Continue Button to Step 2 - Dynamic Yellow when location is selected */}
            {isLocationSelected ? (
              <button
                onClick={() => setCurrentStep(2)}
                className="w-full py-3.5 bg-[#FFB800] hover:bg-[#F0AD00] text-[#102B55] border-2 border-[#E6A600] rounded-2xl font-black text-xs shadow-md shadow-amber-500/25 transition-all flex items-center justify-center gap-2 mt-4 active:scale-[0.99] animate-in fade-in"
              >
                <MapPin className="w-4 h-4 text-[#102B55] flex-shrink-0" />
                <span className="truncate">Continue with {activeSelectedLocation}</span>
                <ChevronRight className="w-4 h-4 stroke-[3] text-[#102B55] flex-shrink-0" />
              </button>
            ) : (
              <button
                onClick={() => setCurrentStep(2)}
                className="w-full py-3.5 bg-[#087E8B] hover:bg-[#06626D] text-white rounded-2xl font-black text-xs shadow-md shadow-teal-700/20 transition-all flex items-center justify-center gap-2 mt-4"
              >
                <span>Continue to Select Department</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* ========================================================
            STEP 2: SELECT YOUR DEPARTMENT
            ======================================================== */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 className="text-xl font-black text-[#172B4D] tracking-tight">
                  {t('chooseSpeciality', 'Select Your Department')}
                </h2>
                <p className="text-xs text-slate-600 mt-1 font-medium flex items-center gap-1.5 flex-wrap">
                  <span>Choose medical department for consultation in</span>
                  <span className="bg-[#FFB800] text-[#102B55] px-2 py-0.5 rounded-lg font-black text-xs inline-flex items-center gap-1 shadow-2xs border border-[#E6A600]">
                    <MapPin className="w-3 h-3 text-[#102B55]" />
                    <span>{formatLocationName(currentArea, currentCity)}</span>
                  </span>
                </p>
              </div>
              <span className="text-[10px] font-black text-[#102B55] bg-[#FFB800] px-2.5 py-1 rounded-xl border border-[#E6A600] flex-shrink-0 shadow-2xs flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#102B55]" />
                <span>{formatLocationName(currentArea, currentCity)}</span>
              </span>
            </div>

            {/* Modern Grid of 14 Medical Departments with Icons */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              {APPOINTMENT_DEPARTMENTS.map((dept) => {
                const isSelected = selectedDeptId === dept.id;
                const IconComponent = dept.icon;

                return (
                  <div
                    key={dept.id}
                    onClick={() => {
                      setSelectedDeptId(dept.id);
                    }}
                    className={`p-3.5 rounded-2xl border-2 text-left cursor-pointer transition-all flex flex-col justify-between min-h-[105px] relative group active:scale-[0.98] ${
                      isSelected
                        ? 'border-[#087E8B] bg-gradient-to-br from-teal-50 to-white shadow-sm ring-2 ring-teal-500/20'
                        : 'border-slate-200/90 bg-white hover:border-teal-300 shadow-2xs'
                    }`}
                  >
                    {/* Top Row: Icon & Checkmark indicator */}
                    <div className="flex items-center justify-between mb-2">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'bg-[#087E8B] text-white shadow-xs'
                            : 'bg-slate-100 text-[#087E8B] group-hover:bg-teal-50'
                        }`}
                      >
                        <IconComponent className="w-5 h-5 stroke-[2.2]" />
                      </div>

                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-[#087E8B] text-white flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      ) : (
                        <span className="text-[9px] font-bold text-slate-400">
                          {dept.doctorCount} Doctors
                        </span>
                      )}
                    </div>

                    {/* Department Title & Description */}
                    <div>
                      <h4
                        className={`font-black text-xs leading-snug transition-colors ${
                          isSelected ? 'text-[#087E8B]' : 'text-[#172B4D]'
                        }`}
                      >
                        {dept.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                        {dept.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Continue Button to Step 3 */}
            <button
              onClick={() => setCurrentStep(3)}
              className="w-full py-3.5 bg-[#FFB800] hover:bg-[#F0AD00] text-[#102B55] border-2 border-[#E6A600] rounded-2xl font-black text-xs shadow-md shadow-amber-500/25 transition-all flex items-center justify-center gap-2 mt-4 active:scale-[0.99]"
            >
              <Stethoscope className="w-4 h-4 text-[#102B55]" />
              <span>Continue to Doctor/Hospital ({selectedDepartment.name})</span>
              <ChevronRight className="w-4 h-4 stroke-[3] text-[#102B55]" />
            </button>
          </div>
        )}

        {/* ========================================================
            STEP 3: HOSPITAL & CLINIC LISTING
            Filtering matching BOTH:
            1. User's selected location
            2. User's selected medical department
            ======================================================== */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-in fade-in">
            {/* Header with active badges */}
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-[10px] font-black bg-[#FFB800] text-[#102B55] border border-[#E6A600] px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                  <MapPin className="w-3 h-3 text-[#102B55]" />
                  <span>{formatLocationName(currentArea, currentCity)}</span>
                </span>
                <span className="text-[10px] font-bold bg-sky-50 text-sky-800 border border-sky-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Stethoscope className="w-3 h-3" />
                  <span>{selectedDepartment.name}</span>
                </span>
              </div>
              <h2 className="text-xl font-black text-[#172B4D] tracking-tight">
                Doctor / Hospital
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                Showing{' '}
                {step3Option === 'doctor'
                  ? `${departmentDoctors.length} doctors`
                  : step3Option === 'private'
                  ? `${privateHospitals.length} private hospitals`
                  : `${govtHospitals.length} government hospitals`}
                {formatLocationName(currentArea, currentCity)
                  ? ` in ${formatLocationName(currentArea, currentCity)}`
                  : ''}{' '}
                for {selectedDepartment.name}
              </p>
            </div>

            {/* 3 Main Choice Tabs requested by user: Choose Doctor | Private Hospital | Govt Hospital */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setStep3Option('doctor')}
                className={`py-2.5 px-1.5 rounded-2xl font-black text-[11px] sm:text-xs transition-all flex items-center justify-center gap-1.5 shadow-2xs ${
                  step3Option === 'doctor'
                    ? 'bg-[#FFB800] text-[#102B55] border-2 border-[#E6A600] shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-700 hover:border-amber-300'
                }`}
              >
                <Stethoscope className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">Choose Doctor</span>
              </button>

              <button
                onClick={() => setStep3Option('private')}
                className={`py-2.5 px-1.5 rounded-2xl font-black text-[11px] sm:text-xs transition-all flex items-center justify-center gap-1.5 shadow-2xs ${
                  step3Option === 'private'
                    ? 'bg-[#FFB800] text-[#102B55] border-2 border-[#E6A600] shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-700 hover:border-amber-300'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">Private Hospital</span>
              </button>

              <button
                onClick={() => setStep3Option('government')}
                className={`py-2.5 px-1.5 rounded-2xl font-black text-[11px] sm:text-xs transition-all flex items-center justify-center gap-1.5 shadow-2xs ${
                  step3Option === 'government'
                    ? 'bg-[#FFB800] text-[#102B55] border-2 border-[#E6A600] shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-700 hover:border-amber-300'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">Govt Hospital</span>
              </button>
            </div>

            {/* Search within list with Reusable Voice Search */}
            <VoiceSearchInput
              value={hospitalKeyword}
              onChange={(e) => setHospitalKeyword(e.target.value)}
              onChangeValue={setHospitalKeyword}
              onClear={() => setHospitalKeyword('')}
              placeholder={
                step3Option === 'doctor'
                  ? 'Search doctor by name, qualification or hospital...'
                  : step3Option === 'private'
                  ? 'Filter private hospital by name or area...'
                  : 'Filter govt hospital by name or area...'
              }
              searchCategory={step3Option === 'doctor' ? 'doctor' : 'hospital'}
            />

            {/* 1. CHOOSE DOCTOR LIST */}
            {step3Option === 'doctor' && (
              <div className="space-y-3">
                {departmentDoctors.map((doc: DoctorWithDistance) => (
                  <div
                    key={doc.id}
                    onClick={() => {
                      setSelectedDoctor(doc);
                      const hosp = HOSPITALS.find((h) => h.id === doc.hospitalId) || selectedHospital;
                      setSelectedHospital(hosp);
                      setCurrentStep(5); // Go straight to Select Date & Slot!
                    }}
                    className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-md cursor-pointer transition-all space-y-3 group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative flex-shrink-0">
                        <img
                          src={doc.imageUrl}
                          alt={doc.name}
                          className="w-16 h-16 rounded-2xl object-cover border border-slate-200 group-hover:scale-105 transition-transform"
                        />
                        <span className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-white absolute -bottom-1 -right-1"></span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[9px] font-extrabold bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded-full">
                            {doc.specialty}
                          </span>
                          <span className="ml-auto text-[10px] font-extrabold text-slate-800 flex items-center gap-0.5">
                            <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> {doc.rating}
                          </span>
                        </div>

                        <h4 className="font-black text-sm text-[#172B4D] truncate mt-1 group-hover:text-[#087E8B] transition-colors">
                          {doc.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {doc.qualification} • {doc.experienceYears}+ yrs exp
                        </p>

                        <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-600 font-medium truncate">
                          <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          <span className="truncate">{doc.hospitalName}</span>
                        </div>
                      </div>
                    </div>

                    {/* Travel Time & Route Section (Car · Bike · Walking + View Route) */}
                    <TravelTimeCardSection
                      distanceKm={doc.calculatedDistanceKm || 4.2}
                      onViewRoute={() =>
                        setNavTarget({
                          id: doc.id,
                          name: doc.name,
                          specialty: doc.specialty,
                          hospitalName: doc.hospitalName,
                          address: doc.clinicAddress || `${doc.hospitalName}, ${doc.hospitalArea}`,
                          latitude: doc.latitude,
                          longitude: doc.longitude,
                          hospitalId: doc.hospitalId,
                          imageUrl: doc.imageUrl,
                        })
                      }
                    />

                    {/* Bottom Row: Consultation Fee & Book Button */}
                    <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 font-medium block">Consultation Fee</span>
                        <span className="font-black text-base text-[#172B4D]">₹{doc.consultationFee}</span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDoctor(doc);
                          const hosp = HOSPITALS.find((h) => h.id === doc.hospitalId) || selectedHospital;
                          setSelectedHospital(hosp);
                          setCurrentStep(5);
                        }}
                        className="py-2 px-3.5 bg-[#FFB800] hover:bg-[#F0AD00] text-[#102B55] border border-[#E6A600] rounded-xl font-black text-xs shadow-xs flex items-center gap-1.5 transition-all group-hover:shadow-sm"
                      >
                        <span>Book Slot</span>
                        <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 2. PRIVATE HOSPITALS LIST */}
            {step3Option === 'private' && (
              <div className="space-y-3">
                {privateHospitals.map((hosp: HospitalWithDistance) => (
                  <div
                    key={hosp.id}
                    onClick={() => {
                      setSelectedHospital(hosp);
                      setCurrentStep(4); // Move to Choose Doctor at this Hospital
                    }}
                    className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-md cursor-pointer transition-all space-y-3 group"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={hosp.imageUrl}
                        alt={hosp.name}
                        className="w-20 h-20 rounded-2xl object-cover flex-shrink-0 border border-slate-200 group-hover:scale-102 transition-transform"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[9px] font-extrabold bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-full">
                            Private Hospital
                          </span>
                          {hosp.verified && (
                            <span className="text-[9px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                              <ShieldCheck className="w-2.5 h-2.5" /> Verified
                            </span>
                          )}
                          <span className="ml-auto text-[10px] font-extrabold text-slate-800 flex items-center gap-0.5">
                            <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> {hosp.rating}
                          </span>
                        </div>

                        <h4 className="font-black text-sm text-[#172B4D] truncate mt-1 group-hover:text-[#087E8B] transition-colors">
                          {hosp.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {hosp.address}, {hosp.area}
                        </p>

                      </div>
                    </div>

                    {/* Travel Time & Route Section (Car · Bike · Walking + View Route) */}
                    <TravelTimeCardSection
                      distanceKm={hosp.calculatedDistanceKm || 3.8}
                      onViewRoute={() =>
                        setNavTarget({
                          id: hosp.id,
                          name: hosp.name,
                          type: 'Private',
                          address: `${hosp.address}, ${hosp.area}`,
                          latitude: hosp.latitude,
                          longitude: hosp.longitude,
                          hospitalId: hosp.id,
                          imageUrl: hosp.imageUrl,
                        })
                      }
                    />

                    <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-[#172B4D] bg-slate-100 px-2 py-0.5 rounded-md">
                          👨‍⚕️ 4+ Consultants in {selectedDepartment.name}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                          📅 Next OPD: Today
                        </span>
                      </div>

                      <span className="font-extrabold text-xs text-[#087E8B] flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                        <span>Choose Doctor</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 3. GOVERNMENT HOSPITALS LIST */}
            {step3Option === 'government' && (
              <div className="space-y-3">
                {govtHospitals.map((hosp: HospitalWithDistance) => (
                  <div
                    key={hosp.id}
                    onClick={() => {
                      setSelectedHospital(hosp);
                      setCurrentStep(4); // Move to Choose Doctor at this Govt Hospital
                    }}
                    className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-md cursor-pointer transition-all space-y-3 group"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={hosp.imageUrl}
                        alt={hosp.name}
                        className="w-20 h-20 rounded-2xl object-cover flex-shrink-0 border border-slate-200 group-hover:scale-102 transition-transform"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[9px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full">
                            Government Hospital
                          </span>
                          <span className="text-[9px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                            <ShieldCheck className="w-2.5 h-2.5" /> Govt Subsidized
                          </span>
                          <span className="ml-auto text-[10px] font-extrabold text-slate-800 flex items-center gap-0.5">
                            <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> {hosp.rating}
                          </span>
                        </div>

                        <h4 className="font-black text-sm text-[#172B4D] truncate mt-1 group-hover:text-[#087E8B] transition-colors">
                          {hosp.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {hosp.address}, {hosp.area}
                        </p>

                        <div className="flex items-center gap-2 mt-1.5 text-[11px]">
                          <span className="text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[10px]">
                            🛡️ ₹20 Token / Free OPD
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Travel Time & Route Section (Car · Bike · Walking + View Route) */}
                    <TravelTimeCardSection
                      distanceKm={hosp.calculatedDistanceKm || 2.5}
                      onViewRoute={() =>
                        setNavTarget({
                          id: hosp.id,
                          name: hosp.name,
                          type: 'Government',
                          address: `${hosp.address}, ${hosp.area}`,
                          latitude: hosp.latitude,
                          longitude: hosp.longitude,
                          hospitalId: hosp.id,
                          imageUrl: hosp.imageUrl,
                        })
                      }
                    />

                    <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-[#172B4D] bg-slate-100 px-2 py-0.5 rounded-md">
                          👨‍⚕️ Central Faculty in {selectedDepartment.name}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                          📅 Next OPD: Today
                        </span>
                      </div>

                      <span className="font-extrabold text-xs text-emerald-700 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                        <span>Choose Doctor</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            STEP 4: CHOOSE DOCTOR
            ======================================================== */}
        {currentStep === 4 && (
          <div className="space-y-4 animate-in fade-in">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-teal-700 font-bold mb-1">
                <span>{selectedHospital.name}</span>
                <span>•</span>
                <span>{selectedDepartment.name}</span>
              </div>
              <h2 className="text-xl font-black text-[#172B4D] tracking-tight">
                {t('selectDoctor', 'Choose Doctor')}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                Experienced {selectedDepartment.name} consultants available for consultation
              </p>
            </div>

            <div className="space-y-3">
              {matchingDoctors.map((doc: DoctorWithDistance) => {
                const isSelected = selectedDoctor.id === doc.id;
                return (
                  <div
                    key={doc.id}
                    onClick={() => {
                      setSelectedDoctor(doc);
                      setCurrentStep(5); // Move to Date & Slot Selection
                    }}
                    className={`bg-white p-4 rounded-3xl border shadow-2xs hover:shadow-md cursor-pointer transition-all space-y-3 ${
                      isSelected ? 'border-[#087E8B] ring-2 ring-teal-500/20' : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <img
                        src={doc.imageUrl}
                        alt={doc.name}
                        className="w-16 h-16 rounded-2xl object-cover flex-shrink-0 border border-slate-200"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-extrabold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md">
                            {doc.specialty}
                          </span>
                          <span className="ml-auto text-[11px] font-extrabold text-slate-800 flex items-center gap-0.5">
                            <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> {doc.rating}
                          </span>
                        </div>

                        <h4 className="font-black text-sm text-[#172B4D] truncate mt-1">
                          {doc.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 truncate">{doc.qualification}</p>
                        <p className="text-[11px] text-teal-800 font-semibold mt-0.5">
                          🏥 {doc.hospitalName} • OPD 03
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {doc.experienceYears} Years Exp • {doc.languages.join(', ')}
                        </p>
                      </div>
                    </div>

                    {/* Travel Time & Route Section (Car · Bike · Walking + View Route) */}
                    <TravelTimeCardSection
                      distanceKm={doc.calculatedDistanceKm || 3.5}
                      onViewRoute={() =>
                        setNavTarget({
                          id: doc.id,
                          name: doc.name,
                          specialty: doc.specialty,
                          hospitalName: doc.hospitalName,
                          address: doc.clinicAddress || `${doc.hospitalName}, ${doc.hospitalArea}`,
                          latitude: doc.latitude,
                          longitude: doc.longitude,
                          hospitalId: doc.hospitalId,
                          imageUrl: doc.imageUrl,
                        })
                      }
                    />

                    <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block">Consultation Fee</span>
                        <span className="font-black text-base text-[#172B4D]">
                          ₹{doc.consultationFee}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-emerald-700 font-extrabold block">
                          Next Slot: {doc.nextSlot}
                        </span>
                        <span className="font-extrabold text-xs text-[#087E8B] flex items-center justify-end gap-0.5">
                          <span>Select Timing</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================
            STEP 5: SELECT DATE & TIME SLOT
            ======================================================== */}
        {currentStep === 5 && (
          <div className="space-y-4 animate-in fade-in">
            {/* Selected Doctor Summary Card */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex items-center gap-3">
              <img
                src={selectedDoctor.imageUrl}
                alt={selectedDoctor.name}
                className="w-12 h-12 rounded-xl object-cover"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.2 rounded">
                  {selectedDepartment.name}
                </span>
                <h4 className="font-black text-xs text-[#172B4D] truncate mt-0.5">
                  {selectedDoctor.name}
                </h4>
                <p className="text-[10px] text-slate-400 truncate">
                  {selectedHospital.name} • Fee ₹{selectedDoctor.consultationFee}
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-black text-[#172B4D]">Select Appointment Date</h2>
              <div className="flex gap-2 overflow-x-auto no-scrollbar py-2">
                {dates.map((d) => {
                  const isSelected = selectedDate === d.full;
                  return (
                    <button
                      key={d.full}
                      onClick={() => setSelectedDate(d.full)}
                      className={`p-3 rounded-2xl text-center min-w-[70px] border transition-all flex flex-col items-center justify-between ${
                        isSelected
                          ? 'border-[#087E8B] bg-[#087E8B] text-white shadow-sm'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <span className={`text-[10px] font-semibold ${isSelected ? 'text-teal-100' : 'text-slate-400'}`}>
                        {d.day}
                      </span>
                      <span className="text-base font-black my-1">{d.date}</span>
                      {d.label && (
                        <span
                          className={`text-[8px] font-bold px-1.5 py-0.2 rounded-full uppercase ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-teal-50 text-teal-700'
                          }`}
                        >
                          {d.label}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Slots */}
            <div>
              <h3 className="font-bold text-xs text-slate-500 uppercase tracking-wider mb-2">
                Available OPD Time Slots
              </h3>

              {/* Morning Slots */}
              <div className="mb-3">
                <span className="text-[10px] font-bold text-slate-400 block mb-1">Morning Slots</span>
                <div className="grid grid-cols-3 gap-2">
                  {morningSlots.map((slot) => {
                    const isFull = slot.includes('Full');
                    const isSelected = selectedSlot === slot;
                    return (
                      <button
                        key={slot}
                        disabled={isFull}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-2 px-1 text-center text-xs font-bold rounded-xl border transition-all ${
                          isFull
                            ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed'
                            : isSelected
                            ? 'bg-[#087E8B] text-white border-[#087E8B] shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-teal-300'
                        }`}
                      >
                        {slot.replace(' (Full)', '')}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Afternoon & Evening Slots */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 block mb-1">Afternoon & Evening Slots</span>
                <div className="grid grid-cols-3 gap-2">
                  {[...afternoonSlots, ...eveningSlots].map((slot) => {
                    const isFull = slot.includes('Full');
                    const isSelected = selectedSlot === slot;
                    return (
                      <button
                        key={slot}
                        disabled={isFull}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-2 px-1 text-center text-xs font-bold rounded-xl border transition-all ${
                          isFull
                            ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed'
                            : isSelected
                            ? 'bg-[#087E8B] text-white border-[#087E8B] shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-teal-300'
                        }`}
                      >
                        {slot.replace(' (Full)', '')}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <button
              onClick={() => setCurrentStep(6)}
              className="w-full py-3.5 bg-[#087E8B] hover:bg-[#06626D] text-white rounded-2xl font-black text-xs shadow-md shadow-teal-700/20 transition-all flex items-center justify-center gap-2 mt-4"
            >
              <span>Continue to Patient Details</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ========================================================
            STEP 6: PATIENT INFORMATION FORM
            ======================================================== */}
        {currentStep === 6 && (
          <div className="space-y-4 animate-in fade-in">
            <div>
              <h2 className="text-xl font-black text-[#172B4D] tracking-tight">
                {t('patientDetails', 'Patient Information')}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Hospital OPD token and patient number will be registered under this name
              </p>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-slate-200 space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Patient Full Name
                </label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-[#172B4D] focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    value={patientAge}
                    onChange={(e) => setPatientAge(Number(e.target.value))}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-[#172B4D] focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Gender
                  </label>
                  <select
                    value={patientGender}
                    onChange={(e) => setPatientGender(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-[#172B4D] focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-[#172B4D] focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Primary Symptoms / Reason
                </label>
                <textarea
                  rows={2}
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-[#172B4D] focus:outline-none focus:ring-2 focus:ring-teal-500/20 resize-none"
                />
              </div>
            </div>

            <button
              onClick={() => setCurrentStep(7)}
              className="w-full py-3.5 bg-[#087E8B] hover:bg-[#06626D] text-white rounded-2xl font-black text-xs shadow-md shadow-teal-700/20 transition-all flex items-center justify-center gap-2 mt-4"
            >
              <span>Continue to Payment & Review</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ========================================================
            STEP 7: REVIEW & PAYMENT OPTIONS
            ======================================================== */}
        {currentStep === 7 && (
          <div className="space-y-4 animate-in fade-in">
            <div>
              <h2 className="text-xl font-black text-[#172B4D] tracking-tight">
                {t('paymentMethod', 'Review & Confirm Booking')}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Review appointment details and choose payment method
              </p>
            </div>

            {/* Booking Summary Card */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200 space-y-3">
              <div className="flex items-start gap-3">
                <img
                  src={selectedDoctor.imageUrl}
                  alt={selectedDoctor.name}
                  className="w-14 h-14 rounded-2xl object-cover border border-slate-200"
                />
                <div>
                  <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                    {selectedDepartment.name}
                  </span>
                  <h4 className="font-black text-sm text-[#172B4D] mt-0.5">{selectedDoctor.name}</h4>
                  <p className="text-xs text-slate-500">{selectedHospital.name}</p>
                  <p className="text-xs font-bold text-teal-800 mt-1">
                    📅 {selectedDate} at {selectedSlot}
                  </p>
                </div>
              </div>

              {/* Patient info row */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span>Patient: <strong>{patientName}</strong> ({patientAge}y, {patientGender})</span>
                <span>OPD: <strong>Room 03</strong></span>
              </div>

              {/* Fee Breakdown */}
              <div className="pt-2 border-t border-slate-100 space-y-1 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Consultation Fee</span>
                  <span>₹{selectedDoctor.consultationFee}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Hospital Registration & Service</span>
                  <span className="text-emerald-600 font-bold">FREE</span>
                </div>
                <div className="flex justify-between text-sm font-black text-[#172B4D] pt-1 border-t border-slate-100">
                  <span>Total Amount</span>
                  <span>₹{selectedDoctor.consultationFee}</span>
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Choose Payment Option
              </span>
              <div className="space-y-2">
                {[
                  { id: 'UPI', title: 'UPI / Google Pay / PhonePe', desc: 'Instant zero-fee booking', icon: Smartphone },
                  { id: 'Card', title: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay', icon: CreditCard },
                  { id: 'Hospital', title: 'Pay at Hospital OPD Counter', desc: 'Pay cash or card when you arrive', icon: Banknote },
                ].map((m) => (
                  <div
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id as any)}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                      paymentMethod === m.id
                        ? 'border-[#087E8B] bg-teal-50/60 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <m.icon className="w-5 h-5 text-[#087E8B]" />
                      <div>
                        <h5 className="font-bold text-xs text-[#172B4D]">{m.title}</h5>
                        <p className="text-[10px] text-slate-400">{m.desc}</p>
                      </div>
                    </div>
                    {paymentMethod === m.id && (
                      <div className="w-4 h-4 rounded-full bg-[#087E8B] text-white flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleExecutePayment}
              disabled={isProcessingPayment}
              className="w-full py-4 bg-[#087E8B] hover:bg-[#06626D] text-white rounded-2xl font-black text-sm shadow-md shadow-teal-700/25 transition-all flex items-center justify-center gap-2 mt-4"
            >
              {isProcessingPayment ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Generating Official Patient Number...</span>
                </>
              ) : (
                <>
                  <span>Confirm Appointment Reservation (₹{selectedDoctor.consultationFee})</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}

        {/* ========================================================
            STEP 8: OFFICIAL APPOINTMENT CONFIRMATION SLIP
            ======================================================== */}
        {currentStep === 8 && confirmedBooking && (
          <div className="space-y-4 animate-in zoom-in-95 duration-300">
            {/* Success Banner */}
            <div className="bg-emerald-600 text-white p-4 rounded-3xl text-center space-y-1 shadow-md">
              <div className="w-12 h-12 rounded-full bg-white text-emerald-600 flex items-center justify-center mx-auto mb-1 shadow-inner">
                <CheckCircle2 className="w-7 h-7 stroke-[2.5]" />
              </div>
              <h3 className="font-black text-base tracking-tight">
                {t('bookingConfirmed', 'Appointment Officially Confirmed!')}
              </h3>
              <p className="text-xs text-emerald-100 font-medium">
                Your consultation slip has been issued by {selectedHospital.name}
              </p>
            </div>

            {/* Official Digital Appointment Slip */}
            <div className="bg-white rounded-3xl border-2 border-teal-500/80 shadow-md p-5 space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#087E8B] text-white flex items-center justify-center font-extrabold text-sm">
                    G+
                  </div>
                  <div>
                    <h4 className="font-black text-xs text-[#172B4D]">DOCTOR G HEALTHCARE</h4>
                    <span className="text-[9px] text-slate-400 font-bold uppercase">Official OPD Slip</span>
                  </div>
                </div>

                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-black uppercase tracking-wide">
                  Confirmed
                </span>
              </div>

              {/* Patient Number Hero Badge */}
              <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 p-3.5 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-teal-800 tracking-wider block">
                    Patient Number
                  </span>
                  <span className="text-3xl font-black text-[#087E8B] tracking-tight">
                    #{String(confirmedBooking.patientNumber || confirmedBooking.tokenNumber || 24).padStart(3, '0')}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block">
                    OPD Room
                  </span>
                  <span className="text-xl font-black text-[#172B4D]">
                    {confirmedBooking.opdRoom || 'OPD 03'}
                  </span>
                </div>
              </div>

              {/* Consultation Details */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400">Hospital / Clinic</span>
                  <span className="font-bold text-[#172B4D]">{selectedHospital.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400">Consulting Doctor</span>
                  <span className="font-bold text-[#172B4D]">{selectedDoctor.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400">Department</span>
                  <span className="font-bold text-teal-800">{selectedDepartment.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400">Scheduled Date</span>
                  <span className="font-bold text-[#172B4D]">{selectedDate}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400">Appointment Time</span>
                  <span className="font-bold text-[#172B4D]">{selectedSlot}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400">Patient Name</span>
                  <span className="font-bold text-[#172B4D]">{patientName}</span>
                </div>
              </div>

              {/* QR Code and Notice */}
              <div className="bg-slate-50 p-3.5 rounded-2xl flex items-center gap-4">
                <div className="w-16 h-16 bg-white p-1 rounded-xl border border-slate-200 flex items-center justify-center flex-shrink-0">
                  <QrCode className="w-14 h-14 text-slate-800" />
                </div>
                <div>
                  <p className="text-[11px] font-extrabold text-[#172B4D] leading-snug">
                    Please arrive 15 minutes before your scheduled appointment.
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Present this verification QR code at the OPD hospital reception.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions: Track Live Queue & Return Home */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => navigateTo('live-queue', { appointment: confirmedBooking })}
                className="w-full py-3.5 bg-[#087E8B] hover:bg-[#06626D] text-white rounded-2xl font-black text-xs shadow-md shadow-teal-700/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Track Live Patient Queue</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigateTo('home')}
                className="w-full py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-2xl font-bold text-xs shadow-2xs transition-all text-center"
              >
                Return to Home Screen
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Live Route Navigation & Interactive Map Modal for Doctor & Hospital */}
      <LiveRouteNavigationModal
        isOpen={Boolean(navTarget)}
        onClose={() => setNavTarget(null)}
        target={navTarget}
      />
    </div>
  );
};
