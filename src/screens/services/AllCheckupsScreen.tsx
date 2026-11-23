import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ChevronLeft,
  PackagePlus,
  CheckCircle2,
  Clock,
  Home,
  ShieldCheck,
  Star,
  ArrowRight,
  Sparkles,
  Layers,
  X,
} from 'lucide-react';
import { HEALTH_PACKAGES } from '../../data/mockData';
import { HealthPackage } from '../../types';

export const AllCheckupsScreen: React.FC = () => {
  const { goBack, navigateTo, addTestBooking, requireAuth, showToast } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPackage, setSelectedPackage] = useState<HealthPackage>(HEALTH_PACKAGES[0]);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const categories = [
    'All',
    'Full Body Checkup',
    'Senior Citizen',
    'Women',
    'Heart Health',
  ];

  const filteredPackages = HEALTH_PACKAGES.filter(
    (p) => selectedCategory === 'All' || p.category === selectedCategory
  );

  const handleBookPackage = (pkg: HealthPackage) => {
    requireAuth(() => {
      addTestBooking({
        testOrPackageName: pkg.name,
        type: 'package',
        labName: pkg.labName,
        collectionMethod: pkg.homeCollection ? 'HOME_COLLECTION' : 'LAB_VISIT',
        date: '2026-11-23',
        timeSlot: '08:00 AM - 09:00 AM',
        patientName: 'Subhasis Gupta',
        amount: pkg.price,
        paymentStatus: 'PAID',
        status: 'BOOKED',
      });
      showToast(`Booked ${pkg.name}! Sample collection scheduled.`, 'success');
      navigateTo('medical-checkup');
    }, 'Sign in to reserve health package');
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

        <span className="text-xs font-bold text-[#172B4D]">Preventive Health Packages</span>

        <button
          onClick={() => setIsCompareOpen(true)}
          className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full flex items-center gap-1"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Compare</span>
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Banner */}
        <div className="bg-gradient-to-r from-purple-900 to-[#172B4D] p-4 rounded-3xl text-white shadow-md">
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300">
            Preventive Healthcare
          </span>
          <h3 className="font-extrabold text-sm text-white mt-0.5">
            Full Body Screenings with Free Home Sample Collection
          </h3>
          <p className="text-[11px] text-purple-200 mt-0.5">
            NABL & CAP Accredited diagnostics with reports in 24 hours
          </p>
        </div>

        {/* Categories */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Package Cards List */}
        <div className="space-y-3.5">
          {filteredPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-2xs hover:shadow-md transition-all space-y-3"
            >
              <div className="flex items-start justify-between pb-2 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    {pkg.popularTag && (
                      <span className="text-[9px] font-extrabold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                        ★ {pkg.popularTag}
                      </span>
                    )}
                    <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
                      {pkg.testsCount} Tests
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-[#172B4D] mt-1">{pkg.name}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">{pkg.labName}</p>
                </div>

                <div className="text-right">
                  <span className="text-base font-black text-[#172B4D]">₹{pkg.price}</span>
                  <span className="text-xs text-slate-400 line-through block">₹{pkg.mrp}</span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded">
                    {pkg.discountPercent}% OFF
                  </span>
                </div>
              </div>

              {/* Tests Included Preview */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Tests & Profiles Covered:
                </span>
                <div className="space-y-1">
                  {pkg.testsIncluded.slice(0, 4).map((test) => (
                    <p key={test} className="text-xs text-slate-600 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-600"></span>
                      <span>{test}</span>
                    </p>
                  ))}
                  {pkg.testsIncluded.length > 4 && (
                    <p className="text-[11px] text-teal-700 font-bold pl-3">
                      +{pkg.testsIncluded.length - 4} more vital organ profiles
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedPackage(pkg);
                    setIsDetailsOpen(true);
                  }}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                >
                  View All Tests
                </button>
                <button
                  onClick={() => handleBookPackage(pkg)}
                  className="flex-1 py-2.5 bg-[#087E8B] hover:bg-[#06626D] text-white rounded-xl text-xs font-bold shadow-xs"
                >
                  Book Package
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Package Details Modal */}
      {isDetailsOpen && selectedPackage && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-100 max-h-[85vh] flex flex-col animate-in slide-in-from-bottom">
            <div className="flex justify-between items-start pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-sm text-[#172B4D]">{selectedPackage.name}</h3>
                <p className="text-xs text-slate-500">
                  {selectedPackage.testsCount} Tests • ₹{selectedPackage.price}
                </p>
              </div>
              <button
                onClick={() => setIsDetailsOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 my-3 space-y-3 text-xs pr-1">
              <div>
                <h5 className="font-bold text-[#172B4D] mb-1">Preparation Instructions</h5>
                <p className="text-slate-600 leading-relaxed bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                  {selectedPackage.preparationInstructions}
                </p>
              </div>

              <div>
                <h5 className="font-bold text-[#172B4D] mb-1.5">All Included Parameters</h5>
                <div className="space-y-1.5">
                  {selectedPackage.testsIncluded.map((test) => (
                    <div
                      key={test}
                      className="p-2 bg-slate-50 rounded-xl text-slate-700 font-medium flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
                      <span>{test}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setIsDetailsOpen(false);
                handleBookPackage(selectedPackage);
              }}
              className="w-full py-3 bg-[#087E8B] hover:bg-[#06626D] text-white rounded-xl text-xs font-bold"
            >
              Book This Package (₹{selectedPackage.price})
            </button>
          </div>
        </div>
      )}

      {/* Package Comparison Modal */}
      {isCompareOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-slate-100 animate-in zoom-in-95 max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-[#172B4D]">Package Comparison</h3>
              <button onClick={() => setIsCompareOpen(false)} className="text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 my-3 text-xs space-y-3">
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-3 bg-teal-50 rounded-2xl border border-teal-100">
                  <h4 className="font-bold text-xs text-teal-900">Comprehensive Shield</h4>
                  <p className="text-base font-extrabold text-teal-800 my-1">₹1,599</p>
                  <p className="text-[10px] text-teal-700">78 Parameters</p>
                  <p className="text-[10px] text-slate-500 mt-2">Best for: All Adults</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100">
                  <h4 className="font-bold text-xs text-purple-900">Senior Citizen Care</h4>
                  <p className="text-base font-extrabold text-purple-800 my-1">₹1,899</p>
                  <p className="text-[10px] text-purple-700">64 Parameters</p>
                  <p className="text-[10px] text-slate-500 mt-2">Best for: 55+ Years</p>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600">
                <p>• Fasting required for both packages</p>
                <p>• Free doorstep sample collection included</p>
                <p>• Smart digital reports with doctor video explanation</p>
              </div>
            </div>

            <button
              onClick={() => setIsCompareOpen(false)}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
            >
              Close Comparison
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
