import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ChevronLeft,
  Ambulance,
  MapPin,
  Navigation,
  PhoneCall,
  Clock,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Phone,
  ArrowRight,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import { AMBULANCE_SERVICES, HOSPITALS } from '../../data/mockData';
import { AmbulanceService } from '../../types';

export const FindAmbulanceScreen: React.FC = () => {
  const {
    goBack,
    navigateTo,
    currentCity,
    currentArea,
    user,
    activeAmbulanceBooking,
    createAmbulanceBooking,
    cancelAmbulanceBooking,
    showConfirmDialog,
    showToast,
  } = useApp();

  const [page, setPage] = useState<1 | 2 | 3 | 4>(activeAmbulanceBooking ? 4 : 1);

  // Form data
  const [pickupAddress, setPickupAddress] = useState(`${currentArea}, ${currentCity}`);
  const [destinationHospital, setDestinationHospital] = useState(HOSPITALS[0].name);
  const [patientName, setPatientName] = useState(user?.name || 'Subhasis Gupta');
  const [emergencyPhone, setEmergencyPhone] = useState(user?.phone || '+91 98301 54321');
  const [assistanceType, setAssistanceType] = useState('Severe Chest Pain / Cardiac Emergency');
  const [selectedAmbulance, setSelectedAmbulance] = useState<AmbulanceService>(
    AMBULANCE_SERVICES[1] // Advanced Life Support
  );

  const handleConfirmBooking = () => {
    createAmbulanceBooking({
      serviceType: selectedAmbulance.type,
      pickupLocation: pickupAddress,
      destinationHospital,
      patientName,
      patientPhone: emergencyPhone,
      emergencyContact: '+91 98301 99999',
      assistanceType,
      driverName: selectedAmbulance.driverName,
      driverPhone: selectedAmbulance.driverPhone,
      vehicleNo: selectedAmbulance.vehicleNo,
      etaMinutes: 8,
      currentLat: 22.5726,
      currentLng: 88.3639,
    });
    setPage(4); // Tracking page
  };

  const handleCancel = () => {
    showConfirmDialog({
      title: 'Cancel Ambulance Request?',
      message: 'Are you sure you want to cancel this emergency ambulance dispatch?',
      confirmLabel: 'Cancel Dispatch',
      isDestructive: true,
      onConfirm: () => {
        cancelAmbulanceBooking();
        setPage(1);
      },
    });
  };

  return (
    <div className="min-h-full pb-20 bg-[#F6F8FA]">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 p-4 sticky top-0 z-20 flex items-center justify-between shadow-2xs">
        <button
          onClick={() => {
            if (page > 1 && page < 4) setPage((prev) => (prev - 1) as any);
            else goBack();
          }}
          className="flex items-center gap-1 text-slate-500 hover:text-slate-800 text-xs font-semibold"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>{page === 4 ? 'Home' : 'Back'}</span>
        </button>

        <span className="text-xs font-bold text-[#172B4D]">
          {page === 4 ? 'Live Ambulance Tracking' : 'Emergency Ambulance Dispatch'}
        </span>

        <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
          SOS 24x7
        </span>
      </div>

      <div className="p-4 space-y-4">
        {/* CRITICAL LIFE-THREATENING DISCLAIMER */}
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5">
          <ShieldAlert className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5 animate-pulse" />
          <div>
            <h5 className="font-bold text-xs text-rose-900">Life-Threatening Emergency?</h5>
            <p className="text-[11px] text-rose-800 leading-relaxed mt-0.5">
              Do not wait for app confirmation. If the patient is unconscious or experiencing severe chest pain/bleeding, immediately dial{' '}
              <a href="tel:108" className="font-extrabold underline text-rose-900">
                108 (National Emergency)
              </a>{' '}
              or{' '}
              <a href="tel:112" className="font-extrabold underline text-rose-900">
                112
              </a>
              .
            </p>
          </div>
        </div>

        {/* ========================================================
            PAGE 1: PICKUP & EMERGENCY TYPE
            ======================================================== */}
        {page === 1 && (
          <div className="space-y-4 animate-in fade-in">
            <div>
              <h2 className="text-lg font-extrabold text-[#172B4D]">Request Ambulance</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Rapid response fleet with GPS positioning
              </p>
            </div>

            {/* Simulated Map Preview */}
            <div className="h-40 rounded-2xl bg-slate-200 overflow-hidden relative border border-slate-300 flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80"
                alt="Map"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-slate-900/30 flex items-center justify-center">
                <div className="p-2 bg-white rounded-xl shadow-lg flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-teal-600 animate-spin" />
                  <span className="text-xs font-bold text-slate-800">
                    Pickup: {pickupAddress}
                  </span>
                </div>
              </div>
            </div>

            {/* Address fields */}
            <div className="space-y-3 bg-white p-4 rounded-2xl border border-slate-200">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Pickup Location
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-rose-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={pickupAddress}
                    onChange={(e) => setPickupAddress(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Destination Hospital
                </label>
                <select
                  value={destinationHospital}
                  onChange={(e) => setDestinationHospital(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium cursor-pointer"
                >
                  {HOSPITALS.map((h) => (
                    <option key={h.id} value={h.name}>
                      {h.name} ({h.distance})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Type of Medical Assistance
                </label>
                <select
                  value={assistanceType}
                  onChange={(e) => setAssistanceType(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium cursor-pointer"
                >
                  <option value="Severe Chest Pain / Cardiac Emergency">
                    Severe Chest Pain / Cardiac Emergency
                  </option>
                  <option value="Road Accident / Major Trauma">Road Accident / Major Trauma</option>
                  <option value="Stroke / Neurological Paralysis">Stroke / Neurological Paralysis</option>
                  <option value="Breathing Distress / Low SpO2">Breathing Distress / Low SpO2</option>
                  <option value="Routine Patient Transfer / Dialysis">
                    Routine Patient Transfer / Dialysis
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Emergency Contact Number
                </label>
                <input
                  type="tel"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>
            </div>

            <button
              onClick={() => setPage(2)} // Selection
              className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-bold text-xs shadow-md shadow-rose-600/30 transition-all flex items-center justify-center gap-2"
            >
              <span>Select Ambulance Category</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ========================================================
            PAGE 2: AMBULANCE CATEGORY SELECTION
            ======================================================== */}
        {page === 2 && (
          <div className="space-y-4 animate-in fade-in">
            <div>
              <h2 className="text-lg font-extrabold text-[#172B4D]">Choose Ambulance Type</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Equipped vehicles operating nearest to {currentArea}
              </p>
            </div>

            <div className="space-y-3">
              {AMBULANCE_SERVICES.map((amb) => {
                const isSelected = selectedAmbulance.id === amb.id;
                return (
                  <div
                    key={amb.id}
                    onClick={() => setSelectedAmbulance(amb)}
                    className={`bg-white p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-rose-500 ring-2 ring-rose-500/20 shadow-md'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between pb-2 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-xs text-[#172B4D]">{amb.type}</h4>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                            ETA: {amb.eta}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{amb.tagline}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-extrabold text-[#172B4D]">
                          ₹{amb.fareEstimate}
                        </span>
                        <span className="text-[10px] text-slate-400 block">Est. Fare</span>
                      </div>
                    </div>

                    <div className="mt-2.5">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Equipment on board:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {amb.equipment.map((eq) => (
                          <span
                            key={eq}
                            className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                          >
                            ✓ {eq}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Provider: {amb.providerName}</span>
                      <span className="font-bold text-rose-600">
                        {isSelected ? 'Selected ✓' : 'Select'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setPage(3)} // Confirmation
              className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-bold text-xs shadow-md shadow-rose-600/30 transition-all flex items-center justify-center gap-2"
            >
              <span>Proceed to Booking Confirmation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ========================================================
            PAGE 3: BOOKING CONFIRMATION
            ======================================================== */}
        {page === 3 && (
          <div className="space-y-4 animate-in fade-in">
            <div>
              <h2 className="text-lg font-extrabold text-[#172B4D]">Confirm Request</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Verify details before emergency dispatch signal is sent
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 text-xs">
              <div className="flex justify-between pb-2 border-b border-slate-100">
                <span className="text-slate-400">Service</span>
                <span className="font-bold text-[#172B4D]">{selectedAmbulance.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Pickup</span>
                <span className="font-bold text-[#172B4D] text-right max-w-[200px] truncate">
                  {pickupAddress}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Destination</span>
                <span className="font-bold text-[#172B4D] text-right max-w-[200px] truncate">
                  {destinationHospital}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Emergency Case</span>
                <span className="font-semibold text-rose-700">{assistanceType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Patient & Phone</span>
                <span className="font-bold text-[#172B4D]">
                  {patientName} • {emergencyPhone}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-100">
                <span className="text-slate-400">Estimated Fare</span>
                <span className="font-extrabold text-sm text-[#172B4D]">
                  ₹{selectedAmbulance.fareEstimate}
                </span>
              </div>
            </div>

            <button
              onClick={handleConfirmBooking}
              className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-bold text-xs shadow-md shadow-rose-600/30 transition-all flex items-center justify-center gap-2"
            >
              <Ambulance className="w-4 h-4 animate-bounce" />
              <span>Confirm & Dispatch Ambulance Now</span>
            </button>
          </div>
        )}

        {/* ========================================================
            PAGE 4: LIVE AMBULANCE TRACKING
            ======================================================== */}
        {page === 4 && (
          <div className="space-y-4 animate-in zoom-in-95">
            {/* Live Tracking Map Screen */}
            <div className="h-56 rounded-3xl bg-slate-900 overflow-hidden relative border border-slate-700 shadow-md">
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80"
                alt="Map Tracking"
                className="w-full h-full object-cover opacity-60"
              />

              {/* Pulsing ambulance marker */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-2xl shadow-rose-600/80 animate-bounce">
                  <Ambulance className="w-6 h-6" />
                </div>
                <span className="bg-slate-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 border border-rose-500">
                  Ambulance En-Route
                </span>
              </div>

              {/* Top ETA Badge */}
              <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase block leading-none">
                  Estimated Arrival
                </span>
                <span className="text-base font-black text-rose-600 leading-tight">
                  ~7 Minutes
                </span>
              </div>
            </div>

            {/* Vehicle & Driver Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h4 className="font-bold text-xs text-[#172B4D]">
                    {selectedAmbulance.driverName} (Driver)
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Vehicle: <strong className="text-slate-800">{selectedAmbulance.vehicleNo}</strong>
                  </p>
                  <p className="text-[10px] text-teal-700 font-semibold">{selectedAmbulance.providerName}</p>
                </div>
                <a
                  href={`tel:${selectedAmbulance.driverPhone}`}
                  className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Driver</span>
                </a>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Destination:</span>
                <span className="font-bold text-slate-800">{destinationHospital}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="flex-1 py-3 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 rounded-xl text-xs font-bold transition-colors"
              >
                Cancel Dispatch
              </button>
              <button
                onClick={() => navigateTo('home')}
                className="flex-1 py-3 bg-[#087E8B] hover:bg-[#06626D] text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                Go to Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
