import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Users,
  Stethoscope,
  Building2,
  Calendar,
  DollarSign,
  TrendingUp,
  FileCheck2,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  Download,
  Filter,
  MapPin,
  Plus,
  Edit3,
  Compass,
  X,
  Check,
} from 'lucide-react';
import { HOSPITALS, DOCTORS, INITIAL_APPOINTMENTS } from '../../data/mockData';
import { Doctor } from '../../types';
import { DoctorLocationPicker } from '../../components/doctor/DoctorLocationPicker';
import { CLINIC_COORDINATES } from '../../utils/doctorDiscoveryHelper';
import { ALL_SPECIALIZATIONS, CITIES_DATA } from '../../data/cityData';
import { VoiceSearchInput } from '../../components/common/VoiceSearchInput';

export const AdminDashboard: React.FC = () => {
  const { loginAsPatient, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'verifications' | 'doctors' | 'providers' | 'appointments'
  >('overview');

  // Verification Queue State with Approve/Reject actions
  const [pendingVerifications, setPendingVerifications] = useState([
    {
      id: 'ver-1',
      name: 'Dr. Anirban Sen (MD, DM Cardiology)',
      type: 'Doctor Registration',
      regNo: 'WBMC-2014-9842',
      status: 'PENDING_REVIEW',
      submittedAt: '2 hours ago',
    },
    {
      id: 'ver-2',
      name: 'Desun Emergency Trauma Care',
      type: 'Hospital Onboarding',
      regNo: 'HSP-WB-2026-4410',
      status: 'PENDING_REVIEW',
      submittedAt: '5 hours ago',
    },
    {
      id: 'ver-3',
      name: 'Dr. Lal PathLabs New Town Franchise',
      type: 'Diagnostic Laboratory',
      regNo: 'NABL-LAB-8812',
      status: 'PENDING_REVIEW',
      submittedAt: '1 day ago',
    },
  ]);

  // Doctors State in Admin with GPS coordinates
  const [doctorsList, setDoctorsList] = useState<Doctor[]>(() => {
    return DOCTORS.map((doc) => {
      const coords = CLINIC_COORDINATES[doc.hospitalId] || {
        lat: 22.5802,
        lng: 88.4357,
        state: 'West Bengal',
        pincode: '700091',
      };
      return {
        ...doc,
        latitude: doc.latitude || coords.lat,
        longitude: doc.longitude || coords.lng,
        city: doc.city || 'Kolkata',
        state: doc.state || coords.state,
        pincode: doc.pincode || coords.pincode,
        clinicAddress: doc.clinicAddress || `${doc.hospitalName}, Central Hospital Enclave`,
        phone: doc.phone || '+91 98301 22445',
        email: doc.email || `${doc.name.toLowerCase().replace(/[^a-z]/g, '')}@doctorg.in`,
        openingHours: doc.openingHours || '9:00 AM - 5:00 PM',
        appointmentAvailability: doc.appointmentAvailability || doc.nextSlot,
      };
    });
  });

  const [doctorSearchQuery, setDoctorSearchQuery] = useState('');

  // Doctor Form Modal State (Add / Edit)
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [editingDoctorId, setEditingDoctorId] = useState<string | null>(null);
  const [isPickerActive, setIsPickerActive] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState<Partial<Doctor>>({
    name: '',
    specialty: 'General Physician',
    qualification: 'MBBS, MD',
    experienceYears: 10,
    consultationFee: 700,
    hospitalName: 'Apollo Multispeciality Hospital',
    hospitalId: 'hosp-1',
    clinicAddress: '',
    city: 'Kolkata',
    state: 'West Bengal',
    pincode: '700091',
    phone: '+91 98300 11223',
    email: 'doctor@doctorg.in',
    openingHours: '9:00 AM - 5:00 PM',
    appointmentAvailability: 'Today, 4:30 PM',
    latitude: 22.5802,
    longitude: 88.4357,
    imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
    verified: true,
  });

  const handleOpenAddDoctor = () => {
    setEditingDoctorId(null);
    setFormData({
      name: '',
      specialty: 'General Physician',
      qualification: 'MBBS, MD',
      experienceYears: 8,
      consultationFee: 650,
      hospitalName: 'Apollo Multispeciality Hospital',
      hospitalId: 'hosp-1',
      clinicAddress: '58 Canal Circular Road, Salt Lake',
      city: 'Kolkata',
      state: 'West Bengal',
      pincode: '700054',
      phone: '+91 98300 44556',
      email: 'doctor@doctorg.in',
      openingHours: '10:00 AM - 6:00 PM',
      appointmentAvailability: 'Tomorrow, 11:00 AM',
      latitude: 22.5697,
      longitude: 88.4055,
      imageUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80',
      verified: true,
    });
    setIsPickerActive(false);
    setIsDoctorModalOpen(true);
  };

  const handleOpenEditDoctor = (doc: Doctor) => {
    setEditingDoctorId(doc.id);
    setFormData({
      ...doc,
      latitude: doc.latitude || 22.5802,
      longitude: doc.longitude || 88.4357,
    });
    setIsPickerActive(false);
    setIsDoctorModalOpen(true);
  };

  const handleSaveDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      showToast('Doctor name is required', 'warning');
      return;
    }

    if (editingDoctorId) {
      // Update existing
      setDoctorsList((prev) =>
        prev.map((d) => (d.id === editingDoctorId ? ({ ...d, ...formData } as Doctor) : d))
      );
      showToast(`Updated doctor profile & clinic coordinates for ${formData.name}`, 'success');
    } else {
      // Add new
      const newDoctor: Doctor = {
        id: `doc-${Date.now()}`,
        name: formData.name || 'Dr. New Specialist',
        specialty: formData.specialty || 'General Physician',
        departmentId: 'gen-med',
        qualification: formData.qualification || 'MBBS',
        experienceYears: Number(formData.experienceYears) || 5,
        hospitalId: formData.hospitalId || 'hosp-1',
        hospitalName: formData.hospitalName || 'Apollo Multispeciality Hospital',
        consultationFee: Number(formData.consultationFee) || 600,
        rating: 4.8,
        reviewCount: 12,
        imageUrl:
          formData.imageUrl ||
          'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
        verified: Boolean(formData.verified),
        availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        languages: ['English', 'Hindi'],
        about: `${formData.specialty} specialist practicing at ${formData.hospitalName}. Experienced in diagnosis, disease prevention, and patient wellness.`,
        nextSlot: formData.appointmentAvailability || 'Today, 5:00 PM',
        city: formData.city || 'Kolkata',
        state: formData.state || 'West Bengal',
        pincode: formData.pincode || '700091',
        clinicAddress: formData.clinicAddress || `${formData.hospitalName}, Medical Hub`,
        phone: formData.phone || '+91 98300 00000',
        email: formData.email || 'info@doctorg.in',
        openingHours: formData.openingHours || '9:00 AM - 5:00 PM',
        latitude: Number(formData.latitude) || 22.5802,
        longitude: Number(formData.longitude) || 88.4357,
        isDemo: true,
      };
      setDoctorsList((prev) => [newDoctor, ...prev]);
      showToast(`Successfully onboarded ${newDoctor.name} to Doctor G GIS database`, 'success');
    }
    setIsDoctorModalOpen(false);
  };

  const handleApprove = (id: string, name: string) => {
    setPendingVerifications((prev) => prev.filter((v) => v.id !== id));
    showToast(`Approved & verified credentials for: ${name}`, 'success');
  };

  const handleReject = (id: string, name: string) => {
    setPendingVerifications((prev) => prev.filter((v) => v.id !== id));
    showToast(`Rejected onboarding application for: ${name}`, 'warning');
  };

  const filteredAdminDoctors = doctorsList.filter((doc) => {
    if (!doctorSearchQuery.trim()) return true;
    const q = doctorSearchQuery.toLowerCase();
    return (
      doc.name.toLowerCase().includes(q) ||
      doc.specialty.toLowerCase().includes(q) ||
      doc.hospitalName.toLowerCase().includes(q) ||
      (doc.city || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Top Admin Header */}
      <header className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500 text-slate-950 flex items-center justify-center font-black">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-extrabold text-base text-white">
              Doctor G Super-Administrator Portal
            </h1>
            <p className="text-xs text-slate-400">
              National Healthcare Super-App Central Monitoring & Verifications
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => loginAsPatient(false)}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-colors"
          >
            Switch to Patient App
          </button>
          <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold px-2.5 py-1 rounded-full">
            All Systems Operational ✓
          </span>
        </div>
      </header>

      {/* Main Admin Content */}
      <div className="max-w-7xl mx-auto w-full p-6 space-y-6 flex-1">
        {/* KPI Overview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Registered Patients
            </span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-black text-white">1,48,290</span>
              <span className="text-xs font-bold text-emerald-400">+12% this month</span>
            </div>
          </div>

          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Verified Doctors
            </span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-black text-teal-400">3,420</span>
              <span className="text-xs font-bold text-slate-400">14 Specialities</span>
            </div>
          </div>

          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Partner Hospitals
            </span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-black text-white">418</span>
              <span className="text-xs font-bold text-slate-400">Govt + Private</span>
            </div>
          </div>

          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Monthly Platform Volume
            </span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-black text-emerald-400">₹1.84 Cr</span>
              <span className="text-xs font-bold text-slate-400">Gross GMV</span>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 border-b border-slate-800 pb-2 overflow-x-auto scrollbar-none">
          {[
            { id: 'overview', label: 'Platform Summary' },
            { id: 'doctors', label: `Doctors & Clinic GIS (${doctorsList.length})` },
            { id: 'verifications', label: `Pending Verifications (${pendingVerifications.length})` },
            { id: 'providers', label: 'Active Hospitals' },
            { id: 'appointments', label: 'Live Bookings Stream' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === t.id
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* DOCTORS & CLINIC LOCATION MANAGEMENT TAB */}
        {activeTab === 'doctors' && (
          <div className="bg-slate-800/60 rounded-3xl border border-slate-700/80 p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-teal-400" />
                  <span>Doctors & Clinic Geolocation Registry</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Manage consulting doctors, hospital affiliation, OPD chambers, and real GPS map pins
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-56">
                  <VoiceSearchInput
                    placeholder="Search doctor or clinic..."
                    value={doctorSearchQuery}
                    onChange={(e) => setDoctorSearchQuery(e.target.value)}
                    onChangeValue={setDoctorSearchQuery}
                    onClear={() => setDoctorSearchQuery('')}
                    searchCategory="doctor"
                    inputClassName="bg-slate-900 border-slate-700 text-white placeholder-slate-500 py-1.5 focus:ring-1 focus:ring-teal-400"
                  />
                </div>

                <button
                  onClick={handleOpenAddDoctor}
                  className="px-3.5 py-2 bg-[#087E8B] hover:bg-[#06626D] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Doctor</span>
                </button>
              </div>
            </div>

            {/* Doctors Table / Cards */}
            <div className="divide-y divide-slate-700">
              {filteredAdminDoctors.map((doc) => (
                <div key={doc.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <img
                      src={doc.imageUrl}
                      alt={doc.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-700 flex-shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-xs text-white">{doc.name}</h4>
                        <span className="text-[10px] bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2 py-0.2 rounded font-semibold">
                          {doc.specialty}
                        </span>
                        {doc.verified && (
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-mono">
                            Verified ✓
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {doc.hospitalName} • {doc.city} ({doc.qualification}) • Fee: ₹{doc.consultationFee}
                      </p>

                      <div className="flex items-center gap-2 mt-1 text-[10px] font-mono text-slate-400">
                        <MapPin className="w-3 h-3 text-teal-400" />
                        <span className="text-teal-300">
                          {doc.latitude ? `${doc.latitude.toFixed(4)}°N, ${doc.longitude?.toFixed(4)}°E` : 'Pending GPS'}
                        </span>
                        <span>•</span>
                        <span className="truncate max-w-[280px]">{doc.clinicAddress}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => handleOpenEditDoctor(doc)}
                      className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-bold rounded-xl flex items-center gap-1 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-teal-400" />
                      <span>Edit & Map Location</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VERIFICATIONS QUEUE TAB */}
        {activeTab === 'verifications' && (
          <div className="bg-slate-800/60 rounded-3xl border border-slate-700/80 p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-extrabold text-sm text-white">
                  Provider Medical Credential Verification Queue
                </h3>
                <p className="text-xs text-slate-400">
                  Medical Council registrations & hospital clinical licenses awaiting validation
                </p>
              </div>
              <span className="text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 px-3 py-1 rounded-full">
                {pendingVerifications.length} Urgent Reviews
              </span>
            </div>

            {pendingVerifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                All provider registration credentials verified! Zero backlog.
              </div>
            ) : (
              <div className="divide-y divide-slate-700">
                {pendingVerifications.map((item) => (
                  <div key={item.id} className="py-3.5 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-xs text-white">{item.name}</h4>
                        <span className="text-[10px] bg-slate-700 text-slate-300 px-2 py-0.2 rounded font-mono">
                          {item.type}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Registration: <strong>{item.regNo}</strong> • Submitted {item.submittedAt}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleApprove(item.id, item.name)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-colors"
                      >
                        Approve & Verify
                      </button>
                      <button
                        onClick={() => handleReject(item.id, item.name)}
                        className="px-3 py-1.5 bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-bold rounded-xl transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PROVIDERS ROSTER TAB */}
        {activeTab === 'providers' && (
          <div className="bg-slate-800/60 rounded-3xl border border-slate-700/80 p-6 space-y-4">
            <h3 className="font-extrabold text-sm text-white">Approved Partner Institutions</h3>
            <div className="divide-y divide-slate-700">
              {HOSPITALS.map((hosp) => (
                <div key={hosp.id} className="py-3 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-white">{hosp.name}</h4>
                    <p className="text-[11px] text-slate-400">
                      {hosp.type} • {hosp.city} • Rating: {hosp.rating}★
                    </p>
                  </div>
                  <span className="text-xs font-bold text-emerald-400">Active Licensed</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Doctor & Clinic Geolocation Modal */}
      {isDoctorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div>
                <h3 className="font-extrabold text-sm text-white">
                  {editingDoctorId ? 'Edit Doctor & Clinic Location' : 'Onboard New Doctor with GIS Location'}
                </h3>
                <p className="text-xs text-slate-400">
                  Configure professional credentials and exact latitude/longitude coordinates
                </p>
              </div>

              <button
                onClick={() => setIsDoctorModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
              {isPickerActive ? (
                /* Embedded DoctorLocationPicker */
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-teal-400 text-xs">
                      📍 Drag Pin or Click to Select Exact Clinic Location
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsPickerActive(false)}
                      className="text-xs text-slate-400 hover:text-white underline font-semibold"
                    >
                      Back to Form Fields
                    </button>
                  </div>

                  <DoctorLocationPicker
                    initialCoordinates={{
                      lat: Number(formData.latitude) || 22.5802,
                      lng: Number(formData.longitude) || 88.4357,
                    }}
                    initialAddress={formData.clinicAddress || ''}
                    initialCity={formData.city || 'Kolkata'}
                    onSaveLocation={(coords, addr) => {
                      setFormData((prev) => ({
                        ...prev,
                        latitude: coords.lat,
                        longitude: coords.lng,
                        clinicAddress: addr?.address || prev.clinicAddress,
                        city: addr?.city || prev.city,
                      }));
                      setIsPickerActive(false);
                      showToast(`Pinned coordinates: ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`, 'success');
                    }}
                    onCancel={() => setIsPickerActive(false)}
                  />
                </div>
              ) : (
                /* Doctor Form Fields */
                <form id="doctor-admin-form" onSubmit={handleSaveDoctor} className="space-y-4">
                  {/* Row 1: Name and Specialty */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">
                        Doctor Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Dr. Ramesh Gupta"
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">
                        Medical Specialization *
                      </label>
                      <select
                        value={formData.specialty || 'General Physician'}
                        onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs"
                      >
                        {ALL_SPECIALIZATIONS.map((spec) => (
                          <option key={spec} value={spec}>
                            {spec}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Row 2: Qualification & Experience & Fee */}
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">
                        Qualifications
                      </label>
                      <input
                        type="text"
                        value={formData.qualification || ''}
                        onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                        placeholder="MBBS, MD, DM"
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">
                        Experience (Years)
                      </label>
                      <input
                        type="number"
                        value={formData.experienceYears || ''}
                        onChange={(e) => setFormData({ ...formData, experienceYears: Number(e.target.value) })}
                        placeholder="12"
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">
                        Consultation Fee (₹)
                      </label>
                      <input
                        type="number"
                        value={formData.consultationFee || ''}
                        onChange={(e) => setFormData({ ...formData, consultationFee: Number(e.target.value) })}
                        placeholder="800"
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs"
                      />
                    </div>
                  </div>

                  {/* Row 3: Hospital & Profile Photo URL */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">
                        Affiliated Hospital / Clinic Facility
                      </label>
                      <input
                        type="text"
                        value={formData.hospitalName || ''}
                        onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                        placeholder="Apollo Multispeciality Hospital"
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">
                        Profile Image URL
                      </label>
                      <input
                        type="text"
                        value={formData.imageUrl || ''}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        placeholder="https://..."
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs"
                      />
                    </div>
                  </div>

                  {/* Row 4: Phone & Email */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">
                        Doctor / Clinic Contact Phone
                      </label>
                      <input
                        type="text"
                        value={formData.phone || ''}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98300 12345"
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">
                        Official Email
                      </label>
                      <input
                        type="email"
                        value={formData.email || ''}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="doctor@hospital.in"
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs"
                      />
                    </div>
                  </div>

                  {/* Row 5: Full Address */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">
                      Full Clinic Address
                    </label>
                    <input
                      type="text"
                      value={formData.clinicAddress || ''}
                      onChange={(e) => setFormData({ ...formData, clinicAddress: e.target.value })}
                      placeholder="e.g. 58 Canal Circular Road, Salt Lake Sector V"
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs"
                    />
                  </div>

                  {/* Row 6: City, State, PIN Code */}
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">City</label>
                      <select
                        value={formData.city || 'Kolkata'}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs"
                      >
                        {CITIES_DATA.map((c) => (
                          <option key={c.id} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">State</label>
                      <input
                        type="text"
                        value={formData.state || 'West Bengal'}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">PIN Code</label>
                      <input
                        type="text"
                        value={formData.pincode || '700091'}
                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs"
                      />
                    </div>
                  </div>

                  {/* Row 7: Opening Hours & Next Available Slot */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">
                        Opening / OPD Hours
                      </label>
                      <input
                        type="text"
                        value={formData.openingHours || '9:00 AM - 5:00 PM'}
                        onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">
                        Appointment Availability
                      </label>
                      <input
                        type="text"
                        value={formData.appointmentAvailability || 'Today, 4:30 PM'}
                        onChange={(e) => setFormData({ ...formData, appointmentAvailability: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs"
                      />
                    </div>
                  </div>

                  {/* Row 8: GEOLOCATION COORDINATES & LOCATION PICKER TRIGGER */}
                  <div className="p-4 bg-slate-950/80 rounded-2xl border border-teal-500/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-teal-400" />
                        <span className="font-bold text-xs text-white">
                          Precise GIS Clinic Geolocation Coordinates
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsPickerActive(true)}
                        className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
                      >
                        <Compass className="w-3.5 h-3.5" />
                        <span>Open Interactive Map Location Picker</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 mb-1">
                          Latitude (°N)
                        </label>
                        <input
                          type="number"
                          step="0.000001"
                          required
                          value={formData.latitude !== undefined ? formData.latitude : 22.5802}
                          onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-teal-300 font-mono text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-slate-400 mb-1">
                          Longitude (°E)
                        </label>
                        <input
                          type="number"
                          step="0.000001"
                          required
                          value={formData.longitude !== undefined ? formData.longitude : 88.4357}
                          onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-teal-300 font-mono text-xs"
                        />
                      </div>
                    </div>

                    <p className="text-[10px] text-slate-400">
                      Coordinates are directly used by patient routing engines and external Google Maps deep-links.
                    </p>
                  </div>
                </form>
              )}
            </div>

            {/* Modal Footer */}
            {!isPickerActive && (
              <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsDoctorModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="doctor-admin-form"
                  className="px-5 py-2.5 bg-[#087E8B] hover:bg-[#06626D] text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingDoctorId ? 'Save Changes' : 'Register Doctor & Clinic'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
