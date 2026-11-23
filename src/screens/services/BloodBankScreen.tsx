import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ChevronLeft,
  Droplet,
  Heart,
  Phone,
  MapPin,
  Clock,
  Search,
  CheckCircle2,
  AlertTriangle,
  Send,
  UserPlus,
  ShieldAlert,
} from 'lucide-react';
import { BLOOD_BANKS } from '../../data/mockData';
import { BloodBankItem } from '../../types';

export const BloodBankScreen: React.FC = () => {
  const {
    goBack,
    navigateTo,
    createBloodRequest,
    registerDonor,
    currentCity,
    currentArea,
    user,
    requireAuth,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'stock' | 'request' | 'donor'>('stock');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<string>('B+');

  // Request form state
  const [reqUnits, setReqUnits] = useState(2);
  const [reqHospital, setReqHospital] = useState('Apollo Multispeciality Hospital');
  const [reqContactPerson, setReqContactPerson] = useState(user?.name || 'Subhasis Gupta');
  const [reqPhone, setReqPhone] = useState(user?.phone || '+91 98301 54321');
  const [reqUrgency, setReqUrgency] = useState<'Immediate (Critical)' | 'Within 24 Hours' | 'Scheduled Surgery'>('Within 24 Hours');
  const [reqNotes, setReqNotes] = useState('Patient scheduled for bypass surgery tomorrow morning.');

  // Donor registration form state
  const [donorName, setDonorName] = useState(user?.name || 'Subhasis Gupta');
  const [donorGroup, setDonorGroup] = useState('B+');
  const [donorPhone, setDonorPhone] = useState(user?.phone || '+91 98301 54321');
  const [donorConsent, setDonorConsent] = useState(false);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const handleSendBloodRequest = (e: React.FormEvent) => {
    e.preventDefault();
    requireAuth(() => {
      createBloodRequest({
        bloodGroup: selectedBloodGroup,
        unitsNeeded: reqUnits,
        hospitalName: reqHospital,
        city: currentCity,
        requiredDate: '2026-11-21',
        contactPerson: reqContactPerson,
        contactNumber: reqPhone,
        urgency: reqUrgency,
        notes: reqNotes,
      });
      showToast(`Blood request broadcasted for ${reqUnits} units of ${selectedBloodGroup}!`, 'success');
      setActiveTab('stock');
    }, 'Sign in to broadcast emergency blood request');
  };

  const handleRegisterDonor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorConsent) {
      showToast('Please accept the voluntary blood donor terms', 'warning');
      return;
    }
    requireAuth(() => {
      registerDonor({
        name: donorName,
        bloodGroup: donorGroup,
        city: currentCity,
        phone: donorPhone,
        availableNow: true,
      });
      showToast('Thank you! Registered as active life-saving blood donor.', 'success');
      setActiveTab('stock');
    }, 'Sign in to register as blood donor');
  };

  return (
    <div className="min-h-full pb-20 bg-[#F6F8FA]">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 p-4 sticky top-0 z-20 flex items-center justify-between shadow-2xs">
        <button
          onClick={goBack}
          className="flex items-center gap-1 text-slate-500 hover:text-slate-800 text-xs font-semibold"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Home</span>
        </button>

        <span className="text-xs font-bold text-[#172B4D]">Blood Availability & Donors</span>

        <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
          Red Cross Linked
        </span>
      </div>

      <div className="p-4 space-y-4">
        {/* Transparent Demo Notice */}
        <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Demo Data Notice:</strong> Blood stock quantities below are simulated sample data for UI verification. In critical requirements, verify directly with hospital blood component centers.
          </p>
        </div>

        {/* 3 Main Action Tabs */}
        <div className="flex p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setActiveTab('stock')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'stock'
                ? 'bg-white text-rose-700 shadow-xs'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Check Stock
          </button>
          <button
            onClick={() => setActiveTab('request')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'request'
                ? 'bg-white text-rose-700 shadow-xs'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Emergency Request
          </button>
          <button
            onClick={() => setActiveTab('donor')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'donor'
                ? 'bg-white text-rose-700 shadow-xs'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Become a Donor
          </button>
        </div>

        {/* ========================================================
            TAB 1: STOCK OVERVIEW
            ======================================================== */}
        {activeTab === 'stock' && (
          <div className="space-y-4 animate-in fade-in">
            {/* Blood Groups Selector */}
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Select Blood Group
              </span>
              <div className="grid grid-cols-4 gap-2">
                {bloodGroups.map((bg) => (
                  <button
                    key={bg}
                    onClick={() => setSelectedBloodGroup(bg)}
                    className={`py-2 rounded-xl text-center font-black text-sm border transition-all ${
                      selectedBloodGroup === bg
                        ? 'border-rose-600 bg-rose-600 text-white shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {bg}
                  </button>
                ))}
              </div>
            </div>

            {/* Blood Banks List */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Availability in {currentCity} for {selectedBloodGroup}
              </h4>
              {BLOOD_BANKS.map((bb) => {
                const stockStatus = bb.stock[selectedBloodGroup] || 'Low';
                const units = bb.unitsAvailable[selectedBloodGroup] || 0;

                return (
                  <div
                    key={bb.id}
                    className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-2.5"
                  >
                    <div className="flex items-start justify-between pb-2 border-b border-slate-100">
                      <div>
                        <h4 className="font-bold text-xs text-[#172B4D]">{bb.name}</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">{bb.address}</p>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          stockStatus === 'Available'
                            ? 'bg-emerald-50 text-emerald-700'
                            : stockStatus === 'Low'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {stockStatus} ({units} Units)
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>📍 {bb.distance} away</span>
                      <span>Updated: {bb.lastUpdated}</span>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <a
                        href={`tel:${bb.phone}`}
                        className="flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:underline"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call Component Center</span>
                      </a>
                      <button
                        onClick={() => {
                          setActiveTab('request');
                          setReqHospital(bb.name);
                        }}
                        className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-bold transition-colors"
                      >
                        Request Units
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: REQUEST BLOOD
            ======================================================== */}
        {activeTab === 'request' && (
          <form onSubmit={handleSendBloodRequest} className="space-y-3 bg-white p-4 rounded-3xl border border-slate-200 animate-in fade-in">
            <h3 className="font-bold text-sm text-[#172B4D] mb-1">
              Emergency Blood Requisition
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              Broadcast urgent blood requests to nearby blood banks and registered voluntary donors.
            </p>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Blood Group Needed *
              </label>
              <select
                value={selectedBloodGroup}
                onChange={(e) => setSelectedBloodGroup(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold cursor-pointer"
              >
                {bloodGroups.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Units *</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={reqUnits}
                  onChange={(e) => setReqUnits(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Urgency</label>
                <select
                  value={reqUrgency}
                  onChange={(e) => setReqUrgency(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-rose-700 font-bold cursor-pointer"
                >
                  <option value="Immediate (Critical)">Immediate (Critical)</option>
                  <option value="Within 24 Hours">Within 24 Hours</option>
                  <option value="Scheduled Surgery">Scheduled Surgery</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Hospital Admitted
              </label>
              <input
                type="text"
                value={reqHospital}
                onChange={(e) => setReqHospital(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Attendant Contact Person & Phone
              </label>
              <input
                type="text"
                value={reqContactPerson}
                onChange={(e) => setReqContactPerson(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium mb-2"
                placeholder="Name"
              />
              <input
                type="tel"
                value={reqPhone}
                onChange={(e) => setReqPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
                placeholder="Mobile number"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-bold text-xs shadow-md shadow-rose-600/30 transition-all flex items-center justify-center gap-2 mt-2"
            >
              <Send className="w-4 h-4" />
              <span>Broadcast Emergency Blood Request</span>
            </button>
          </form>
        )}

        {/* ========================================================
            TAB 3: BECOME A DONOR
            ======================================================== */}
        {activeTab === 'donor' && (
          <form onSubmit={handleRegisterDonor} className="space-y-3 bg-white p-4 rounded-3xl border border-slate-200 animate-in fade-in">
            <h3 className="font-bold text-sm text-[#172B4D] mb-1">
              Voluntary Donor Registration
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              One blood donation can save up to three lives. Register to be notified when patients near you need help.
            </p>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Your Full Name</label>
              <input
                type="text"
                required
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Blood Group</label>
                <select
                  value={donorGroup}
                  onChange={(e) => setDonorGroup(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold cursor-pointer"
                >
                  {bloodGroups.map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Mobile</label>
                <input
                  type="tel"
                  required
                  value={donorPhone}
                  onChange={(e) => setDonorPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>
            </div>

            <label className="flex items-start gap-2 pt-2 cursor-pointer">
              <input
                type="checkbox"
                checked={donorConsent}
                onChange={(e) => setDonorConsent(e.target.checked)}
                className="mt-0.5 text-rose-600 rounded"
              />
              <span className="text-[11px] text-slate-600 leading-snug">
                I confirm I am between 18-65 years of age, weigh at least 45kg, and consent to voluntary blood donor notifications.
              </span>
            </label>

            <button
              type="submit"
              className="w-full py-3 bg-[#087E8B] hover:bg-[#06626D] text-white rounded-2xl font-bold text-xs shadow-md shadow-teal-700/20 transition-all flex items-center justify-center gap-2 mt-2"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>Register as Active Life-Saver</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
