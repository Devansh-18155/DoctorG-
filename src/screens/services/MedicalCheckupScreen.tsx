import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ChevronLeft,
  Search,
  FlaskConical,
  Clock,
  Home,
  Building2,
  FileCheck2,
  Download,
  Share2,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  X,
  ArrowRight,
} from 'lucide-react';
import { DIAGNOSTIC_TESTS } from '../../data/mockData';
import { DiagnosticTest, TestBooking } from '../../types';

export const MedicalCheckupScreen: React.FC = () => {
  const {
    goBack,
    navigateTo,
    testBookings,
    addTestBooking,
    savedAddresses,
    user,
    requireAuth,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'tests' | 'details' | 'booking' | 'reports'>('tests');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTest, setSelectedTest] = useState<DiagnosticTest>(DIAGNOSTIC_TESTS[0]);

  // Booking Form State
  const [collectionMethod, setCollectionMethod] = useState<'HOME_COLLECTION' | 'LAB_VISIT'>('HOME_COLLECTION');
  const [bookingDate, setBookingDate] = useState('2026-11-22');
  const [bookingSlot, setBookingSlot] = useState('07:30 AM - 08:30 AM');
  const [patientName, setPatientName] = useState(user?.name || 'Subhasis Gupta');

  // Active Report Modal
  const [viewingReport, setViewingReport] = useState<any>(null);

  const categories = [
    'All',
    'Blood',
    'Thyroid',
    'Diabetes',
    'Heart',
    'Liver',
    'Kidney',
    'Vitamins',
    'Imaging',
  ];

  const filteredTests = DIAGNOSTIC_TESTS.filter((t) => {
    const matchesCat = selectedCategory === 'All' || t.category === selectedCategory;
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.labName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleConfirmBooking = () => {
    requireAuth(() => {
      const newBooking = addTestBooking({
        testOrPackageName: selectedTest.name,
        type: 'single-test',
        labName: selectedTest.labName,
        collectionMethod,
        collectionAddress: savedAddresses[0]?.flat + ', ' + savedAddresses[0]?.street,
        date: bookingDate,
        timeSlot: bookingSlot,
        patientName,
        amount: selectedTest.price,
        paymentStatus: 'PAID',
        status: 'BOOKED',
      });
      setActiveTab('reports');
      showToast(`Test booking confirmed! Sample slot: ${bookingSlot}`, 'success');
    }, 'Sign in to reserve diagnostic slot');
  };

  return (
    <div className="min-h-full pb-20 bg-[#F6F8FA]">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 p-4 sticky top-0 z-20 flex items-center justify-between shadow-2xs">
        <button
          onClick={() => {
            if (activeTab !== 'tests') setActiveTab('tests');
            else goBack();
          }}
          className="flex items-center gap-1 text-slate-500 hover:text-slate-800 text-xs font-semibold"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>{activeTab === 'tests' ? 'Home' : 'Back to Tests'}</span>
        </button>

        <span className="text-xs font-bold text-[#172B4D]">
          {activeTab === 'reports' ? 'Diagnostic Test Reports' : 'Medical Diagnostics & Lab Tests'}
        </span>

        <button
          onClick={() => setActiveTab('reports')}
          className="text-xs font-bold text-[#087E8B] hover:underline"
        >
          Reports ({testBookings.length})
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* ========================================================
            TEST LISTING VIEW
            ======================================================== */}
        {activeTab === 'tests' && (
          <div className="space-y-4 animate-in fade-in">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search diagnostic blood, urine or imaging tests..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-medium"
              />
            </div>

            {/* Category horizontal scroll */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCategory(c)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === c
                      ? 'bg-[#087E8B] text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Test Cards */}
            <div className="space-y-3">
              {filteredTests.map((test) => (
                <div
                  key={test.id}
                  onClick={() => {
                    setSelectedTest(test);
                    setActiveTab('details');
                  }}
                  className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md cursor-pointer transition-all"
                >
                  <div className="flex items-start justify-between pb-2 border-b border-slate-100">
                    <div>
                      <span className="text-[9px] font-bold bg-sky-50 text-sky-700 px-1.5 py-0.2 rounded">
                        {test.category}
                      </span>
                      <h4 className="font-bold text-xs text-[#172B4D] mt-1">{test.name}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{test.shortDescription}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-extrabold text-[#172B4D]">₹{test.price}</span>
                      <span className="text-[10px] text-slate-400 line-through block">
                        ₹{test.mrp}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500">
                    <span>🧪 {test.sampleType}</span>
                    <span className="text-emerald-600 font-medium">
                      ⏱ Report in {test.reportTimeHours}h
                    </span>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-slate-400">{test.labName}</span>
                    <span className="font-bold text-[#087E8B] flex items-center gap-0.5">
                      Book Test <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================
            TEST DETAILS VIEW
            ======================================================== */}
        {activeTab === 'details' && selectedTest && (
          <div className="space-y-4 animate-in fade-in">
            <div className="bg-white rounded-3xl p-4 border border-slate-200">
              <span className="text-[10px] font-bold bg-sky-50 text-sky-700 px-2 py-0.5 rounded-full">
                {selectedTest.category} Diagnostics
              </span>
              <h3 className="font-bold text-base text-[#172B4D] mt-1.5">{selectedTest.name}</h3>
              <p className="text-xs text-slate-500 mt-1">{selectedTest.shortDescription}</p>

              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
                <span className="text-lg font-black text-[#172B4D]">₹{selectedTest.price}</span>
                <span className="text-xs text-slate-400 line-through">₹{selectedTest.mrp}</span>
                <span className="text-xs font-bold text-emerald-600">
                  Save ₹{selectedTest.mrp - selectedTest.price}
                </span>
              </div>
            </div>

            {/* Preparation & Clinical Insights */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
              <div>
                <h5 className="font-bold text-[#172B4D] mb-0.5">Why is this test performed?</h5>
                <p className="text-slate-500 leading-relaxed">{selectedTest.whyPerformed}</p>
              </div>

              <div>
                <h5 className="font-bold text-[#172B4D] mb-0.5">Preparation Instructions</h5>
                <p className="text-slate-500 leading-relaxed">{selectedTest.preparationRequired}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 block">Sample Required</span>
                  <span className="font-bold text-slate-700">{selectedTest.sampleType}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Report Delivery</span>
                  <span className="font-bold text-slate-700">
                    Within {selectedTest.reportTimeHours} Hours
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('booking')}
              className="w-full py-3.5 bg-[#087E8B] hover:bg-[#06626D] text-white rounded-2xl font-bold text-xs shadow-md shadow-teal-700/20 transition-all flex items-center justify-center gap-1.5"
            >
              <span>Schedule Sample Collection</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ========================================================
            TEST BOOKING VIEW
            ======================================================== */}
        {activeTab === 'booking' && selectedTest && (
          <div className="space-y-4 animate-in fade-in">
            <div>
              <h2 className="text-lg font-extrabold text-[#172B4D]">Schedule Test Booking</h2>
              <p className="text-xs text-slate-500 mt-0.5">{selectedTest.name}</p>
            </div>

            {/* Collection Method Toggle */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setCollectionMethod('HOME_COLLECTION')}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  collectionMethod === 'HOME_COLLECTION'
                    ? 'border-[#087E8B] bg-teal-50/50 text-[#087E8B] font-bold'
                    : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                <Home className="w-4 h-4 mx-auto mb-1" />
                <span className="text-xs block">Home Sample Collection</span>
              </button>
              <button
                onClick={() => setCollectionMethod('LAB_VISIT')}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  collectionMethod === 'LAB_VISIT'
                    ? 'border-[#087E8B] bg-teal-50/50 text-[#087E8B] font-bold'
                    : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                <Building2 className="w-4 h-4 mx-auto mb-1" />
                <span className="text-xs block">Visit Diagnostic Center</span>
              </button>
            </div>

            {/* Date & Time Slot Form */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Collection Date
                </label>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Time Slot
                </label>
                <select
                  value={bookingSlot}
                  onChange={(e) => setBookingSlot(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium cursor-pointer"
                >
                  <option value="07:00 AM - 08:00 AM">07:00 AM - 08:00 AM (Fasting)</option>
                  <option value="08:00 AM - 09:00 AM">08:00 AM - 09:00 AM (Fasting)</option>
                  <option value="09:00 AM - 10:00 AM">09:00 AM - 10:00 AM</option>
                  <option value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</option>
                  <option value="04:00 PM - 05:00 PM">04:00 PM - 05:00 PM</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Patient Name
                </label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>
            </div>

            <button
              onClick={handleConfirmBooking}
              className="w-full py-3.5 bg-[#087E8B] hover:bg-[#06626D] text-white rounded-2xl font-bold text-xs shadow-md shadow-teal-700/20 transition-all flex items-center justify-center gap-1.5"
            >
              <span>Confirm & Pay ₹{selectedTest.price}</span>
            </button>
          </div>
        )}

        {/* ========================================================
            REPORTS VIEW
            ======================================================== */}
        {activeTab === 'reports' && (
          <div className="space-y-4 animate-in fade-in">
            <div>
              <h2 className="text-lg font-extrabold text-[#172B4D]">My Lab Test Reports</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Download verified test summaries and share securely
              </p>
            </div>

            <div className="space-y-3">
              {/* Sample Simulated CBC Report */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="flex items-start justify-between pb-2 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
                      Report Ready ✓
                    </span>
                    <h4 className="font-bold text-xs text-[#172B4D] mt-1">
                      Complete Blood Count (CBC) with ESR
                    </h4>
                    <p className="text-[11px] text-slate-500">Dr. Lal PathLabs Certified Center</p>
                  </div>
                  <span className="text-xs font-mono text-slate-400">DG-LAB-4491</span>
                </div>

                <div className="py-2 text-xs text-slate-600 space-y-1">
                  <p>• Hemoglobin: 14.2 g/dL (Normal: 13.0 - 17.0)</p>
                  <p>• Total Leukocyte Count (WBC): 6,800 /mcL (Normal: 4,000 - 11,000)</p>
                  <p>• Platelet Count: 240,000 /mcL (Normal: 150,000 - 450,000)</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() =>
                      showToast('CBC Report PDF downloaded to device storage', 'success')
                    }
                    className="flex-1 py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </button>
                  <button
                    onClick={() => showToast('Encrypted share link generated', 'info')}
                    className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Any newly booked test reports */}
              {testBookings.map((b) => (
                <div key={b.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="flex items-start justify-between pb-2 border-b border-slate-100">
                    <div>
                      <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">
                        Sample Slot Booked
                      </span>
                      <h4 className="font-bold text-xs text-[#172B4D] mt-1">
                        {b.testOrPackageName}
                      </h4>
                      <p className="text-[11px] text-slate-500">{b.labName}</p>
                    </div>
                    <span className="text-xs font-mono text-slate-400">{b.bookingCode}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-2">
                    Collection on: {b.date} at {b.timeSlot} ({b.collectionMethod})
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
