import React, { useState, useMemo } from 'react';
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
} from 'lucide-react';
import {
  HOSPITALS,
  DOCTORS,
  DEPARTMENTS,
} from '../../data/mockData';
import { Hospital, Doctor, Department } from '../../types';
import confetti from 'canvas-confetti';
import { getNearbyHospitals, getNearbyDoctors, HospitalWithDistance, DoctorWithDistance } from '../../utils/locationHelper';

export const BookAppointmentFlow: React.FC = () => {
  const {
    navigateTo,
    goBack,
    screenParams,
    currentCity,
    currentArea,
    setCurrentCity,
    setCurrentArea,
    user,
    familyMembers,
    addAppointment,
    requireAuth,
    showToast,
  } = useApp();

  // Step indicator 1 to 12
  const initialStep = screenParams?.step || 1;
  const [currentStep, setCurrentStep] = useState<number>(initialStep);

  // Flow State
  const [selectedHospital, setSelectedHospital] = useState<Hospital>(
    HOSPITALS.find((h) => h.id === screenParams?.selectedHospitalId) || HOSPITALS[0]
  );
  const [selectedDepartment, setSelectedDepartment] = useState<Department>(
    DEPARTMENTS.find((d) => d.id === screenParams?.selectedDepartmentId) || DEPARTMENTS[0]
  );
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor>(
    DOCTORS.find((d) => d.id === screenParams?.selectedDoctorId) || DOCTORS[0]
  );

  // Dynamic nearby calculations based on user's chosen location
  const nearbyHospitals = useMemo(() => {
    return getNearbyHospitals(currentCity, currentArea, HOSPITALS);
  }, [currentCity, currentArea]);

  const nearbyDoctors = useMemo(() => {
    return getNearbyDoctors(currentCity, currentArea, DOCTORS, HOSPITALS);
  }, [currentCity, currentArea]);

  // Date & Slot Selection
  const [selectedDate, setSelectedDate] = useState<string>('2026-11-21');
  const [selectedSlot, setSelectedSlot] = useState<string>('04:30 PM');
  const [consultationType, setConsultationType] = useState<'in-person' | 'video' | 'audio'>('in-person');

  // Patient Info Form
  const [patientName, setPatientName] = useState(user?.name || 'Subhasis Gupta');
  const [patientAge, setPatientAge] = useState(48);
  const [patientGender, setPatientGender] = useState('male');
  const [patientPhone, setPatientPhone] = useState(user?.phone || '+91 98301 54321');
  const [isNewPatient, setIsNewPatient] = useState(false);
  const [visitReason, setVisitReason] = useState('Routine consultation & general checkup');
  const [symptoms, setSymptoms] = useState('Occasional dizziness, mild blood pressure fluctuations');
  const [uploadedDocName, setUploadedDocName] = useState<string | null>(null);

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'Wallet' | 'Hospital'>('UPI');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Confirmed Appointment Result
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);

  // Filters for Step 2 (Hospitals)
  const [hospitalFilter, setHospitalFilter] = useState<'All' | 'Private' | 'Government'>('All');
  const [hospitalSearch, setHospitalSearch] = useState('');

  // Filters for Step 5 (Doctors)
  const [doctorSearch, setDoctorSearch] = useState('');

  // Calendar dates generation
  const dates = [
    { day: 'Thu', date: '20', full: '2026-11-20', label: 'Today' },
    { day: 'Fri', date: '21', full: '2026-11-21', label: 'Tomorrow' },
    { day: 'Sat', date: '22', full: '2026-11-22' },
    { day: 'Sun', date: '23', full: '2026-11-23' },
    { day: 'Mon', date: '24', full: '2026-11-24' },
    { day: 'Tue', date: '25', full: '2026-11-25' },
    { day: 'Wed', date: '26', full: '2026-11-26' },
  ];

  const morningSlots = ['09:30 AM', '10:00 AM', '10:30 AM', '11:15 AM (Full)', '11:45 AM'];
  const afternoonSlots = ['02:00 PM', '02:30 PM (Full)', '03:15 PM', '03:45 PM'];
  const eveningSlots = ['04:30 PM', '05:00 PM', '05:30 PM', '06:15 PM (Full)', '07:00 PM'];

  // Family profile selector handler
  const handleSelectFamilyMember = (memberId: string) => {
    const member = familyMembers.find((m) => m.id === memberId);
    if (member) {
      setPatientName(member.name);
      setPatientAge(member.age);
      setPatientGender(member.gender);
      showToast(`Selected patient profile: ${member.name}`, 'info');
    }
  };

  // Payment Execution & Confirmation
  const handleExecutePayment = () => {
    requireAuth(() => {
      setIsProcessingPayment(true);
      setTimeout(() => {
        setIsProcessingPayment(false);

        // Add to appointments state
        const newBooking = addAppointment({
          patientId: user?.id || 'usr-1',
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
          consultationType,
          fee: selectedDoctor.consultationFee,
          paymentStatus: paymentMethod === 'Hospital' ? 'PAY_AT_HOSPITAL' : 'PAID',
          paymentMethod:
            paymentMethod === 'UPI'
              ? 'UPI (Google Pay / PhonePe)'
              : paymentMethod === 'Card'
              ? 'Debit/Credit Card'
              : paymentMethod === 'Wallet'
              ? 'Paytm Wallet'
              : 'Pay at Hospital Counter',
          bookingStatus: 'UPCOMING',
          tokenNumber: 24,
          patientNumber: 24,
          patientNumberStr: '024',
          currentToken: 19,
          opdRoom: 'OPD 03',
          officialStatus: 'Confirmed',
          estimatedWaitMinutes: 25,
          queueStatus: 'WAITING',
          reason: visitReason,
          symptoms: [symptoms],
          isDemo: true,
        });

        setConfirmedBooking(newBooking);
        setCurrentStep(12);

        // Confetti celebration
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch (e) {}
      }, 1200);
    }, 'Sign in to confirm your appointment reservation');
  };

  return (
    <div className="min-h-full pb-20 bg-[#F6F8FA]">
      {/* Top Header with Step progress */}
      <div className="bg-white border-b border-slate-100 p-4 sticky top-0 z-20 shadow-2xs">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => {
              if (currentStep > 1 && currentStep < 12) {
                setCurrentStep((prev) => prev - 1);
              } else {
                goBack();
              }
            }}
            className="flex items-center gap-1 text-slate-500 hover:text-slate-800 text-xs font-semibold"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{currentStep === 12 ? 'Home' : 'Back'}</span>
          </button>

          <span className="text-xs font-bold text-[#172B4D]">
            {currentStep === 12 ? 'Booking Confirmed' : `Step ${currentStep} of 11`}
          </span>

          <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200/60">
            Official Hospital Booking
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-[#087E8B] to-emerald-500 h-full transition-all duration-300"
            style={{ width: `${(Math.min(currentStep, 11) / 11) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="p-4">
        {/* ========================================================
            STEP 1: SELECT LOCATION
            ======================================================== */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-in fade-in">
            <div>
              <h2 className="text-lg font-extrabold text-[#172B4D]">Live Location Auto-Detected</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Doctor G has detected your current live location automatically. No manual selection required.
              </p>
            </div>

            {/* Current GPS detection card */}
            <div className="p-4 bg-gradient-to-br from-teal-50 to-emerald-50 border-2 border-teal-500 rounded-3xl flex flex-col gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white absolute -top-0.5 -right-0.5 animate-ping"></span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-teal-800 bg-teal-100/80 px-2 py-0.5 rounded-md">
                      Live GPS Active
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700">✓ Auto-Selected</span>
                  </div>
                  <h3 className="text-base font-black text-[#172B4D] mt-0.5">
                    {currentArea}, {currentCity}
                  </h3>
                </div>
              </div>

              <p className="text-[11px] text-teal-900 leading-snug bg-white/70 p-2 rounded-xl border border-teal-200/50">
                Hospitals, consultation slots & diagnostic labs in <strong>{currentCity}</strong> have been pre-filtered for you.
              </p>

              <button
                onClick={() => setCurrentStep(2)}
                className="w-full py-3 bg-[#087E8B] hover:bg-[#06626D] text-white text-xs font-bold rounded-xl shadow-md shadow-teal-700/20 flex items-center justify-center gap-1.5 transition-all"
              >
                <span>Continue with My Live Location ({currentArea})</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Change City option (optional) */}
            <div className="pt-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Or Switch to Another City (Optional)
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {['Kolkata', 'Delhi NCR', 'Mumbai', 'Bengaluru', 'Kalyani', 'Hyderabad'].map((city) => (
                  <button
                    key={city}
                    onClick={() => {
                      setCurrentCity(city);
                      setCurrentArea('Central Medical Hub');
                      setCurrentStep(2);
                    }}
                    className={`p-3 rounded-2xl border text-left font-bold text-xs transition-all ${
                      currentCity === city
                        ? 'border-[#087E8B] bg-teal-50/50 text-[#087E8B]'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setCurrentStep(2)}
              className="w-full py-3.5 bg-[#087E8B] hover:bg-[#06626D] text-white rounded-2xl font-bold text-xs shadow-md shadow-teal-700/20 transition-all flex items-center justify-center gap-1.5 mt-4"
            >
              <span>Continue to Hospitals</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ========================================================
            STEP 2: SELECT HOSPITAL / CLINIC
            ======================================================== */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-in fade-in">
            <div>
              <h2 className="text-lg font-extrabold text-[#172B4D]">Choose Hospital or Clinic</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Showing verified healthcare centers in {currentCity}
              </p>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={hospitalSearch}
                onChange={(e) => setHospitalSearch(e.target.value)}
                placeholder="Search hospital name or facility..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              {(['All', 'Private', 'Government'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setHospitalFilter(f)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    hospitalFilter === f
                      ? 'bg-[#172B4D] text-white'
                      : 'bg-white border border-slate-200 text-slate-600'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Hospital Cards List */}
            <div className="space-y-3">
              {nearbyHospitals.filter(
                (h: HospitalWithDistance) =>
                  (hospitalFilter === 'All' || h.type === hospitalFilter) &&
                  h.name.toLowerCase().includes(hospitalSearch.toLowerCase())
              ).map((hosp: HospitalWithDistance) => (
                <div
                  key={hosp.id}
                  onClick={() => {
                    setSelectedHospital(hosp);
                    setCurrentStep(3); // Go to Hospital Details
                  }}
                  className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md cursor-pointer transition-all"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={hosp.imageUrl}
                      alt={hosp.name}
                      className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[9px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded">
                          {hosp.type}
                        </span>
                        {hosp.verified && (
                          <span className="text-[9px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.2 rounded flex items-center gap-0.5">
                            <ShieldCheck className="w-2.5 h-2.5" /> Verified
                          </span>
                        )}
                        <span className="ml-auto text-[10px] font-bold text-slate-700 flex items-center gap-0.5">
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> {hosp.rating}
                        </span>
                      </div>

                      <h4 className="font-bold text-xs text-[#172B4D] truncate">{hosp.name}</h4>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">{hosp.address}, {hosp.area}</p>
                      <p className="text-[10px] text-teal-700 font-semibold mt-1">
                        📍 {hosp.calculatedDistanceStr} away ({hosp.driveTimeStr}) • {hosp.bedsAvailable} Beds Available
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-slate-500">
                      {hosp.departments.slice(0, 3).join(', ')}...
                    </span>
                    <span className="font-bold text-[#087E8B] flex items-center gap-0.5">
                      View Details & OPD <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            STEP 3: HOSPITAL DETAILS
            ======================================================== */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-in fade-in">
            {/* Hospital Cover */}
            <div className="relative h-44 rounded-2xl overflow-hidden shadow-sm">
              <img
                src={selectedHospital.imageUrl}
                alt={selectedHospital.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <span className="text-[10px] font-bold bg-teal-600 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {selectedHospital.type} Multispeciality
                </span>
                <h3 className="font-bold text-base mt-1 leading-tight">{selectedHospital.name}</h3>
                <p className="text-xs text-slate-200 mt-0.5">{selectedHospital.address}</p>
              </div>
            </div>

            {/* Quick hospital stats */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-center">
                <p className="text-[10px] text-slate-400">Rating</p>
                <p className="font-extrabold text-xs text-[#172B4D] flex items-center justify-center gap-1 mt-0.5">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  {selectedHospital.rating}
                </p>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-center">
                <p className="text-[10px] text-slate-400">Reviews</p>
                <p className="font-extrabold text-xs text-[#172B4D] mt-0.5">
                  {selectedHospital.reviewCount}+
                </p>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-center">
                <p className="text-[10px] text-slate-400">Emergency</p>
                <p className="font-extrabold text-xs text-rose-600 mt-0.5">24x7 Open</p>
              </div>
            </div>

            {/* About Hospital */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200">
              <h4 className="font-bold text-xs text-[#172B4D] mb-1">About Facility</h4>
              <p className="text-xs text-slate-500 leading-relaxed">{selectedHospital.about}</p>
              <div className="mt-3 flex items-center gap-3 text-xs text-slate-600">
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-teal-600" /> {selectedHospital.phone}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-teal-600" /> {selectedHospital.openingHours}
                </span>
              </div>
            </div>

            {/* Facilities */}
            <div>
              <h4 className="font-bold text-xs text-[#172B4D] mb-2">Key Facilities</h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedHospital.facilities.map((fac) => (
                  <span
                    key={fac}
                    className="bg-slate-100 text-slate-700 text-[11px] font-medium px-2.5 py-1 rounded-lg"
                  >
                    ✓ {fac}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => setCurrentStep(4)} // Go to Departments
              className="w-full py-3.5 bg-[#087E8B] hover:bg-[#06626D] text-white rounded-2xl font-bold text-xs shadow-md shadow-teal-700/20 transition-all flex items-center justify-center gap-1.5 mt-2"
            >
              <span>Select Department</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ========================================================
            STEP 4: SELECT DEPARTMENT
            ======================================================== */}
        {currentStep === 4 && (
          <div className="space-y-4 animate-in fade-in">
            <div>
              <h2 className="text-lg font-extrabold text-[#172B4D]">Select Clinical Department</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Choose the medical specialty at {selectedHospital.name}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {DEPARTMENTS.map((dept) => {
                const isSelected = selectedDepartment.id === dept.id;
                return (
                  <div
                    key={dept.id}
                    onClick={() => {
                      setSelectedDepartment(dept);
                      setCurrentStep(5); // Go to Doctors
                    }}
                    className={`p-3 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between min-h-[85px] ${
                      isSelected
                        ? 'border-[#087E8B] bg-teal-50/60 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <h4 className="font-bold text-xs text-[#172B4D] leading-tight">
                        {dept.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                        {dept.description}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-teal-700 mt-2">
                      {dept.doctorCount} Doctors Available →
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================
            STEP 5: SELECT DOCTOR
            ======================================================== */}
        {currentStep === 5 && (
          <div className="space-y-4 animate-in fade-in">
            <div>
              <h2 className="text-lg font-extrabold text-[#172B4D]">
                Select Doctor — {selectedDepartment.name}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Experienced consultants at {selectedHospital.name}
              </p>
            </div>

            <div className="space-y-3">
              {nearbyDoctors
                .filter((d: DoctorWithDistance) => d.hospitalId === selectedHospital.id || d.departmentId === selectedDepartment.id)
                .concat(nearbyDoctors.filter((d: DoctorWithDistance) => d.hospitalId !== selectedHospital.id && d.departmentId !== selectedDepartment.id))
                .slice(0, 8)
                .map((doc: DoctorWithDistance) => {
                const isSelected = selectedDoctor.id === doc.id;
                return (
                  <div
                    key={doc.id}
                    onClick={() => {
                      setSelectedDoctor(doc);
                      setCurrentStep(6); // Doctor profile
                    }}
                    className={`bg-white p-3.5 rounded-2xl border shadow-2xs hover:shadow-md cursor-pointer transition-all ${
                      isSelected ? 'border-[#087E8B] ring-1 ring-teal-500' : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={doc.imageUrl}
                        alt={doc.name}
                        className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.2 rounded">
                            {doc.specialty}
                          </span>
                          <span className="ml-auto text-[10px] font-bold text-slate-700 flex items-center gap-0.5">
                            <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> {doc.rating}
                          </span>
                        </div>
                        <h4 className="font-bold text-xs text-[#172B4D] truncate mt-1">
                          {doc.name}
                        </h4>
                        <p className="text-[10px] text-slate-500 truncate">{doc.qualification}</p>
                        <p className="text-[10px] text-teal-700 font-semibold mt-0.5">
                          📍 {doc.calculatedDistanceStr} away • 🏥 {doc.hospitalName}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {doc.experienceYears} Years Exp • {doc.languages.join(', ')}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400">Consultation Fee</span>
                        <p className="font-extrabold text-sm text-[#172B4D]">
                          ₹{doc.consultationFee}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-emerald-600 font-bold block">
                          Next: {doc.nextSlot}
                        </span>
                        <span className="text-[11px] font-bold text-[#087E8B]">
                          View Schedule & Profile →
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
            STEP 6: DOCTOR PROFILE
            ======================================================== */}
        {currentStep === 6 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
              <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-2 border-2 border-teal-500 shadow-md">
                <img
                  src={selectedDoctor.imageUrl}
                  alt={selectedDoctor.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-bold text-base text-[#172B4D]">{selectedDoctor.name}</h3>
              <p className="text-xs text-teal-700 font-semibold">{selectedDoctor.specialty}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">{selectedDoctor.qualification}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {selectedHospital.name} • {selectedDoctor.experienceYears} Yrs Exp
              </p>

              <div className="flex justify-center gap-4 mt-3 pt-3 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Fee</span>
                  <span className="font-extrabold text-[#172B4D]">
                    ₹{selectedDoctor.consultationFee}
                  </span>
                </div>
                <div className="h-6 w-[1px] bg-slate-200"></div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Rating</span>
                  <span className="font-extrabold text-[#172B4D] flex items-center justify-center gap-0.5">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    {selectedDoctor.rating}
                  </span>
                </div>
                <div className="h-6 w-[1px] bg-slate-200"></div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Reviews</span>
                  <span className="font-extrabold text-[#172B4D]">
                    {selectedDoctor.reviewCount}
                  </span>
                </div>
              </div>
            </div>

            {/* Consultation Mode */}
            <div>
              <h4 className="font-bold text-xs text-[#172B4D] mb-1.5">Consultation Mode</h4>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { mode: 'in-person' as const, label: 'Hospital Visit', icon: Building2 },
                  { mode: 'video' as const, label: 'Video Call', icon: Smartphone },
                  { mode: 'audio' as const, label: 'Phone Call', icon: Phone },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.mode}
                      onClick={() => setConsultationType(item.mode)}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        consultationType === item.mode
                          ? 'border-[#087E8B] bg-teal-50/50 text-[#087E8B] font-bold'
                          : 'border-slate-200 bg-white text-slate-600'
                      }`}
                    >
                      <Icon className="w-4 h-4 mx-auto mb-1" />
                      <span className="text-[11px] block">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* About Doctor */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200">
              <h4 className="font-bold text-xs text-[#172B4D] mb-1">About Doctor</h4>
              <p className="text-xs text-slate-500 leading-relaxed">{selectedDoctor.about}</p>
              <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-600">
                <span className="font-semibold text-slate-700">Languages:</span>
                <span>{selectedDoctor.languages.join(', ')}</span>
              </div>
            </div>

            <button
              onClick={() => setCurrentStep(7)} // Go to choose date
              className="w-full py-3.5 bg-[#087E8B] hover:bg-[#06626D] text-white rounded-2xl font-bold text-xs shadow-md shadow-teal-700/20 transition-all flex items-center justify-center gap-1.5 mt-2"
            >
              <span>Choose Date & Time Slot</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ========================================================
            STEP 7 & 8: CHOOSE DATE & TIME SLOT
            ======================================================== */}
        {(currentStep === 7 || currentStep === 8) && (
          <div className="space-y-4 animate-in fade-in">
            <div>
              <h2 className="text-lg font-extrabold text-[#172B4D]">Select Appointment Date</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Consultation with {selectedDoctor.name} ({consultationType})
              </p>
            </div>

            {/* Calendar Horizontal Selector */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {dates.map((d) => (
                <button
                  key={d.full}
                  onClick={() => setSelectedDate(d.full)}
                  className={`flex flex-col items-center min-w-[58px] p-2 rounded-2xl border transition-all ${
                    selectedDate === d.full
                      ? 'border-[#087E8B] bg-[#087E8B] text-white shadow-xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span className="text-[10px] font-medium opacity-80">{d.day}</span>
                  <span className="text-base font-extrabold my-0.5">{d.date}</span>
                  {d.label && (
                    <span
                      className={`text-[9px] font-bold px-1 rounded ${
                        selectedDate === d.full ? 'bg-white/20' : 'bg-slate-100 text-teal-800'
                      }`}
                    >
                      {d.label}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Time Slots Selection */}
            <div>
              <h3 className="font-bold text-xs text-[#172B4D] mb-2 flex items-center justify-between">
                <span>Choose Time Slot</span>
                <span className="text-[10px] text-slate-400 font-normal">
                  Patient Numbers allocated in order
                </span>
              </h3>

              {/* Morning */}
              <div className="mb-3">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Morning
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {morningSlots.map((slot) => {
                    const isFull = slot.includes('Full');
                    const cleanSlot = slot.replace(' (Full)', '');
                    const isSelected = selectedSlot === cleanSlot;

                    return (
                      <button
                        key={slot}
                        disabled={isFull}
                        onClick={() => setSelectedSlot(cleanSlot)}
                        className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                          isFull
                            ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed'
                            : isSelected
                            ? 'border-[#087E8B] bg-teal-50 text-[#087E8B] shadow-2xs font-bold'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        {cleanSlot}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Afternoon */}
              <div className="mb-3">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Afternoon
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {afternoonSlots.map((slot) => {
                    const isFull = slot.includes('Full');
                    const cleanSlot = slot.replace(' (Full)', '');
                    const isSelected = selectedSlot === cleanSlot;

                    return (
                      <button
                        key={slot}
                        disabled={isFull}
                        onClick={() => setSelectedSlot(cleanSlot)}
                        className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                          isFull
                            ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed'
                            : isSelected
                            ? 'border-[#087E8B] bg-teal-50 text-[#087E8B] shadow-2xs font-bold'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        {cleanSlot}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Evening */}
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Evening
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {eveningSlots.map((slot) => {
                    const isFull = slot.includes('Full');
                    const cleanSlot = slot.replace(' (Full)', '');
                    const isSelected = selectedSlot === cleanSlot;

                    return (
                      <button
                        key={slot}
                        disabled={isFull}
                        onClick={() => setSelectedSlot(cleanSlot)}
                        className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                          isFull
                            ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed'
                            : isSelected
                            ? 'border-[#087E8B] bg-teal-50 text-[#087E8B] shadow-2xs font-bold'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        {cleanSlot}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <button
              onClick={() => setCurrentStep(9)} // Go to Patient details
              className="w-full py-3.5 bg-[#087E8B] hover:bg-[#06626D] text-white rounded-2xl font-bold text-xs shadow-md shadow-teal-700/20 transition-all flex items-center justify-center gap-1.5 mt-4"
            >
              <span>Continue to Patient Details</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ========================================================
            STEP 9: PATIENT DETAILS
            ======================================================== */}
        {currentStep === 9 && (
          <div className="space-y-4 animate-in fade-in">
            <div>
              <h2 className="text-lg font-extrabold text-[#172B4D]">Patient Information</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Who is this consultation booking for?
              </p>
            </div>

            {/* Select from Family Profiles */}
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                Select from Family Profiles
              </span>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {familyMembers.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => handleSelectFamilyMember(m.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all ${
                      patientName.includes(m.name.split(' ')[0])
                        ? 'border-[#087E8B] bg-teal-50 text-[#087E8B]'
                        : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    {m.name} ({m.relationship})
                  </button>
                ))}
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-3 bg-white p-4 rounded-2xl border border-slate-200">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Patient Full Name *
                </label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Age *</label>
                  <input
                    type="number"
                    value={patientAge}
                    onChange={(e) => setPatientAge(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Gender *
                  </label>
                  <select
                    value={patientGender}
                    onChange={(e) => setPatientGender(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-medium cursor-pointer"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Reason for Visit
                </label>
                <input
                  type="text"
                  value={visitReason}
                  onChange={(e) => setVisitReason(e.target.value)}
                  placeholder="e.g. Chest pain, Fever, Joint stiffness"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Optional Symptoms / Notes
                </label>
                <textarea
                  rows={2}
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="Describe any current symptoms or past conditions"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-medium"
                ></textarea>
              </div>

              {/* Optional Document Upload */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Attach Medical Records / Past Rx (Optional)
                </label>
                <div
                  onClick={() => {
                    setUploadedDocName('Past_Cardio_ECG_Report.pdf');
                    showToast('Document attached to booking', 'success');
                  }}
                  className="border border-dashed border-slate-300 rounded-xl p-3 text-center cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <Upload className="w-4 h-4 text-slate-400 mx-auto mb-1" />
                  <span className="text-xs text-slate-600 font-semibold">
                    {uploadedDocName ? `Attached: ${uploadedDocName}` : 'Tap to upload PDF or Photo'}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setCurrentStep(10)} // Go to Summary
              className="w-full py-3.5 bg-[#087E8B] hover:bg-[#06626D] text-white rounded-2xl font-bold text-xs shadow-md shadow-teal-700/20 transition-all flex items-center justify-center gap-1.5 mt-2"
            >
              <span>Review Booking Summary</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ========================================================
            STEP 10: BOOKING SUMMARY
            ======================================================== */}
        {currentStep === 10 && (
          <div className="space-y-4 animate-in fade-in">
            <div>
              <h2 className="text-lg font-extrabold text-[#172B4D]">Booking Summary</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Review your appointment details before payment
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3.5">
              <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedDoctor.imageUrl}
                    alt={selectedDoctor.name}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-xs text-[#172B4D]">{selectedDoctor.name}</h4>
                    <p className="text-[11px] text-teal-700 font-semibold">
                      {selectedDoctor.specialty}
                    </p>
                    <p className="text-[10px] text-slate-400">{selectedHospital.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => setCurrentStep(5)}
                  className="text-xs font-bold text-[#087E8B] hover:underline"
                >
                  Edit
                </button>
              </div>

              {/* Date & Time Slot */}
              <div className="flex items-center justify-between py-1 text-xs">
                <span className="text-slate-500">Date & Slot</span>
                <span className="font-bold text-[#172B4D]">
                  {selectedDate} at {selectedSlot}
                </span>
              </div>

              {/* Consultation Type */}
              <div className="flex items-center justify-between py-1 text-xs">
                <span className="text-slate-500">Consultation Type</span>
                <span className="font-bold uppercase text-teal-700">{consultationType}</span>
              </div>

              {/* Patient */}
              <div className="flex items-center justify-between py-1 text-xs">
                <span className="text-slate-500">Patient</span>
                <span className="font-bold text-[#172B4D]">
                  {patientName} ({patientAge}y, {patientGender})
                </span>
              </div>

              {/* Fee Breakdown */}
              <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Consultation Fee</span>
                  <span>₹{selectedDoctor.consultationFee}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Hospital Facility Charge</span>
                  <span className="text-emerald-600 font-medium">Free (Zero Platform Fee)</span>
                </div>
                <div className="flex items-center justify-between font-extrabold text-sm text-[#172B4D] pt-1 border-t border-slate-100">
                  <span>Total Amount</span>
                  <span>₹{selectedDoctor.consultationFee}</span>
                </div>
              </div>
            </div>

            {/* Cancellation Notice */}
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/60 flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-amber-900 leading-relaxed">
                Free cancellation or rescheduling up to 2 hours before the scheduled time slot. 100% refund is credited back to your original payment method.
              </p>
            </div>

            <button
              onClick={() => setCurrentStep(11)} // Go to Payment
              className="w-full py-3.5 bg-[#087E8B] hover:bg-[#06626D] text-white rounded-2xl font-bold text-xs shadow-md shadow-teal-700/20 transition-all flex items-center justify-center gap-1.5"
            >
              <span>Proceed to Payment (₹{selectedDoctor.consultationFee})</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ========================================================
            STEP 11: PAYMENT PAGE
            ======================================================== */}
        {currentStep === 11 && (
          <div className="space-y-4 animate-in fade-in">
            <div>
              <h2 className="text-lg font-extrabold text-[#172B4D]">Select Payment Method</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Amount payable: <strong className="text-slate-800">₹{selectedDoctor.consultationFee}</strong>
              </p>
            </div>

            {/* Test Payment Banner */}
            <div className="p-3 bg-teal-50 rounded-xl border border-teal-200 text-teal-800 text-[11px] font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-600 flex-shrink-0" />
              <span>
                <strong>Zero-Budget Development Sandbox:</strong> Test payment simulation enabled. No actual monetary charge will occur.
              </span>
            </div>

            {/* Payment Options */}
            <div className="space-y-2.5">
              {[
                { id: 'UPI' as const, label: 'UPI (GPay / PhonePe / Paytm / BHIM)', icon: Smartphone },
                { id: 'Card' as const, label: 'Debit / Credit Card (Visa, RuPay, MasterCard)', icon: CreditCard },
                { id: 'Wallet' as const, label: 'Paytm / Amazon Pay Wallet', icon: Wallet },
                { id: 'Hospital' as const, label: 'Pay at Hospital OPD Counter', icon: Banknote },
              ].map((opt) => {
                const Icon = opt.icon;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setPaymentMethod(opt.id)}
                    className={`p-3.5 rounded-2xl border bg-white flex items-center justify-between cursor-pointer transition-all ${
                      paymentMethod === opt.id
                        ? 'border-[#087E8B] ring-1 ring-teal-500 bg-teal-50/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-[#172B4D]">{opt.label}</span>
                    </div>
                    {paymentMethod === opt.id && (
                      <div className="w-5 h-5 rounded-full bg-[#087E8B] text-white flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-center gap-2 text-[11px] text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>256-Bit SSL Encrypted Healthcare Checkout</span>
            </div>

            <button
              onClick={handleExecutePayment}
              disabled={isProcessingPayment}
              className="w-full py-3.5 bg-[#087E8B] hover:bg-[#06626D] text-white rounded-2xl font-bold text-xs shadow-md shadow-teal-700/20 transition-all flex items-center justify-center gap-2"
            >
              {isProcessingPayment ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <span>Pay ₹{selectedDoctor.consultationFee} & Confirm Ticket</span>
              )}
            </button>
          </div>
        )}

        {/* ========================================================
            STEP 12: OFFICIAL APPOINTMENT CONFIRMATION SLIP
            ======================================================== */}
        {currentStep === 12 && confirmedBooking && (
          <div className="space-y-4 animate-in zoom-in-95 text-center">
            {/* Success Icon */}
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center justify-center mx-auto mb-1">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 animate-scale-up" />
            </div>

            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Official Registration Confirmed
              </span>
              <h2 className="text-xl font-black text-[#172B4D] mt-1.5">
                APPOINTMENT CONFIRMATION
              </h2>
              <p className="text-xs text-slate-500">
                Registration Ref: <strong className="text-slate-800 font-mono">{confirmedBooking.bookingId}</strong>
              </p>
            </div>

            {/* Official Digital Appointment Slip */}
            <div className="bg-white rounded-3xl border-2 border-slate-200 p-5 shadow-sm text-left relative overflow-hidden">
              {/* Top hospital branding banner */}
              <div className="flex items-center justify-between pb-3 border-b-2 border-slate-100">
                <div>
                  <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider block">
                    Hospital Registration Slip
                  </span>
                  <h3 className="font-extrabold text-sm text-[#172B4D] mt-0.5">
                    {confirmedBooking.hospitalName}
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    {confirmedBooking.hospitalAddress}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded-lg inline-block border border-emerald-300">
                    ● Confirmed
                  </span>
                </div>
              </div>

              {/* Primary Patient Number & OPD Highlight */}
              <div className="grid grid-cols-2 gap-3 my-3 p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/80">
                <div className="border-r border-slate-200 pr-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                    Patient Number
                  </span>
                  <span className="text-3xl font-black text-[#172B4D] tracking-tight block mt-0.5">
                    {confirmedBooking.patientNumberStr || '024'}
                  </span>
                  <span className="text-[10px] font-bold text-teal-700">Official Queue ID</span>
                </div>

                <div className="pl-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                    OPD / Chamber
                  </span>
                  <span className="text-3xl font-black text-teal-800 tracking-tight block mt-0.5">
                    {confirmedBooking.opdRoom || 'OPD 03'}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500">First Floor Wing</span>
                </div>
              </div>

              {/* Official Structured Information Table */}
              <div className="space-y-2 py-2 text-xs border-b border-slate-100">
                <div className="flex justify-between items-center py-1 border-b border-slate-50">
                  <span className="text-slate-400">Consulting Doctor:</span>
                  <span className="font-bold text-[#172B4D]">{confirmedBooking.doctorName}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-50">
                  <span className="text-slate-400">Department / Specialty:</span>
                  <span className="font-semibold text-slate-800">{confirmedBooking.department}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-50">
                  <span className="text-slate-400">Appointment Date:</span>
                  <span className="font-bold text-[#172B4D]">{confirmedBooking.date}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-50">
                  <span className="text-slate-400">Scheduled Time:</span>
                  <span className="font-bold text-teal-800">{confirmedBooking.timeSlot}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-50">
                  <span className="text-slate-400">Patient Name:</span>
                  <span className="font-bold text-slate-800">
                    {confirmedBooking.patientName} ({confirmedBooking.patientAge}y, {confirmedBooking.patientGender})
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-400">Consultation Fee:</span>
                  <span className="font-extrabold text-emerald-700">
                    ₹{confirmedBooking.fee} ({confirmedBooking.paymentStatus})
                  </span>
                </div>
              </div>

              {/* Clear Arrival Notice (Mandatory Requirement) */}
              <div className="my-3 p-3 bg-amber-50 rounded-2xl border border-amber-200/90 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                <p className="text-xs font-bold text-amber-900 leading-snug">
                  Please arrive 15 minutes before your scheduled appointment.
                </p>
              </div>

              {/* QR Verification Code Section */}
              <div className="pt-2 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold text-slate-700">Appointment Verification QR</p>
                  <p className="text-[10px] text-slate-400">Scan at clinic reception or OPD 03 kiosk</p>
                  <p className="text-[9px] text-slate-400 font-mono mt-0.5">Secure SHA-256 Validated</p>
                </div>
                <div className="w-16 h-16 bg-white border-2 border-slate-200 rounded-2xl p-1.5 flex items-center justify-center shadow-xs">
                  <QrCode className="w-full h-full text-slate-900" />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                onClick={() =>
                  navigateTo('live-queue', { appointment: confirmedBooking })
                }
                className="w-full py-3.5 bg-[#087E8B] hover:bg-[#06626D] text-white rounded-2xl font-bold text-xs shadow-md shadow-teal-700/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Track Live Patient Queue (Patient No: {confirmedBooking.patientNumberStr || '024'})</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => showToast('Official appointment slip downloaded (PDF)', 'success')}
                  className="py-2.5 px-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Slip</span>
                </button>
                <button
                  onClick={() => showToast('Appointment link copied to clipboard', 'info')}
                  className="py-2.5 px-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5 text-teal-600" />
                  <span>Share Slip</span>
                </button>
              </div>

              <button
                onClick={() => navigateTo('home')}
                className="w-full py-2.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
              >
                Return to Home Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
