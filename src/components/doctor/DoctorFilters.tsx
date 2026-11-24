import React, { useState } from 'react';
import {
  Filter,
  SlidersHorizontal,
  ArrowUpDown,
  Check,
  RotateCcw,
  Building2,
  Calendar,
  Sparkles,
  MapPin,
  Clock,
  X,
} from 'lucide-react';
import { ALL_SPECIALIZATIONS } from '../../data/cityData';
import { HOSPITALS } from '../../data/mockData';
import { DoctorFilterOptions } from '../../utils/doctorDiscoveryHelper';

interface DoctorFiltersProps {
  filters: DoctorFilterOptions;
  onChangeFilters: (newFilters: DoctorFilterOptions) => void;
  onResetFilters: () => void;
  activeCount: number;
  hasUserLocation?: boolean;
}

export const DoctorFilters: React.FC<DoctorFiltersProps> = ({
  filters,
  onChangeFilters,
  onResetFilters,
  activeCount,
  hasUserLocation = false,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const specializations = ['All Specializations', ...ALL_SPECIALIZATIONS];

  const sortOptions = [
    { id: 'RECOMMENDED', label: 'Recommended' },
    { id: 'NEAREST', label: 'Nearest to Me' },
    { id: 'FEE_LOW', label: 'Lowest Fee' },
    { id: 'EXPERIENCE', label: 'Most Experienced' },
    { id: 'EARLIEST_SLOT', label: 'Earliest Available' },
  ];

  return (
    <div className="space-y-2">
      {/* Horizontal Quick Specialization Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {specializations.slice(0, 8).map((spec) => {
          const isSelected =
            (filters.specialization || 'All Specializations') === spec;
          return (
            <button
              key={spec}
              onClick={() =>
                onChangeFilters({
                  ...filters,
                  specialization: spec === 'All Specializations' ? undefined : spec,
                })
              }
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-[#087E8B] text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              {spec}
            </button>
          );
        })}
      </div>

      {/* Filter and Sort Trigger Row */}
      <div className="flex items-center justify-between gap-2">
        {/* Filter Drawer Button */}
        <button
          onClick={() => setIsDrawerOpen(true)}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
            activeCount > 0
              ? 'bg-teal-50 border-teal-300 text-teal-800'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-teal-600" />
          <span>Filters</span>
          {activeCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-teal-600 text-white text-[10px] flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </button>

        {/* Sort Dropdown */}
        <div className="relative flex-1">
          <select
            value={filters.sortBy || 'RECOMMENDED'}
            onChange={(e) =>
              onChangeFilters({
                ...filters,
                sortBy: e.target.value as any,
              })
            }
            className="w-full appearance-none py-2 pl-3 pr-8 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          >
            {sortOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                Sort: {opt.label}
              </option>
            ))}
          </select>
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Available Today Quick Toggle */}
        <button
          onClick={() =>
            onChangeFilters({
              ...filters,
              availableToday: !filters.availableToday,
            })
          }
          className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1 ${
            filters.availableToday
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-emerald-600" />
          <span>Today</span>
        </button>
      </div>

      {/* Comprehensive Filter Modal Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-md w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden animate-in slide-in-from-bottom duration-200">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-teal-600" />
                <h3 className="font-extrabold text-sm text-[#172B4D]">
                  Doctor & Clinic Filters
                </h3>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-200/80 hover:bg-slate-300 flex items-center justify-center text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Filter Controls Body */}
            <div className="p-4 overflow-y-auto space-y-4 flex-1 text-xs">
              {/* Specialization Selection */}
              <div>
                <label className="font-bold text-[#172B4D] block mb-2">
                  Specialization ({ALL_SPECIALIZATIONS.length})
                </label>
                <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto p-1 bg-slate-50 rounded-xl border border-slate-200/70">
                  {specializations.map((spec) => {
                    const isSelected =
                      (filters.specialization || 'All Specializations') === spec;
                    return (
                      <button
                        key={spec}
                        onClick={() =>
                          onChangeFilters({
                            ...filters,
                            specialization:
                              spec === 'All Specializations' ? undefined : spec,
                          })
                        }
                        className={`py-1.5 px-2 rounded-lg text-left text-[11px] font-semibold truncate transition-colors flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#087E8B] text-white'
                            : 'bg-white hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <span className="truncate">{spec}</span>
                        {isSelected && <Check className="w-3 h-3 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Consultation Fee Range */}
              <div>
                <label className="font-bold text-[#172B4D] block mb-2">
                  Consultation Fee
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { id: 'ALL', label: 'All Fees' },
                    { id: 'UNDER_500', label: '≤ ₹500' },
                    { id: '500_1000', label: '₹500 - 1k' },
                    { id: 'ABOVE_1000', label: '> ₹1000' },
                  ].map((fee) => (
                    <button
                      key={fee.id}
                      onClick={() =>
                        onChangeFilters({
                          ...filters,
                          feeRange: fee.id as any,
                        })
                      }
                      className={`py-2 px-1 text-center font-bold text-[11px] rounded-xl border transition-all ${
                        (filters.feeRange || 'ALL') === fee.id
                          ? 'bg-[#172B4D] text-white border-[#172B4D]'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {fee.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div>
                <label className="font-bold text-[#172B4D] block mb-2">
                  Years of Experience
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { val: 0, label: 'Any Exp.' },
                    { val: 5, label: '5+ Years' },
                    { val: 10, label: '10+ Years' },
                    { val: 15, label: '15+ Years' },
                  ].map((exp) => (
                    <button
                      key={exp.val}
                      onClick={() =>
                        onChangeFilters({
                          ...filters,
                          minExperience: exp.val,
                        })
                      }
                      className={`py-2 px-1 text-center font-bold text-[11px] rounded-xl border transition-all ${
                        (filters.minExperience || 0) === exp.val
                          ? 'bg-[#172B4D] text-white border-[#172B4D]'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {exp.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Max Distance (Radius) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-bold text-[#172B4D]">
                    Maximum Distance Radius
                  </label>
                  {!hasUserLocation && (
                    <span className="text-[10px] text-amber-600 font-medium">
                      Calculated from City Center
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { val: undefined, label: 'Any' },
                    { val: 5, label: '≤ 5 km' },
                    { val: 10, label: '≤ 10 km' },
                    { val: 25, label: '≤ 25 km' },
                  ].map((dist) => (
                    <button
                      key={dist.label}
                      onClick={() =>
                        onChangeFilters({
                          ...filters,
                          maxDistanceKm: dist.val,
                        })
                      }
                      className={`py-2 px-1 text-center font-bold text-[11px] rounded-xl border transition-all ${
                        filters.maxDistanceKm === dist.val
                          ? 'bg-teal-700 text-white border-teal-700'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {dist.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Associated Hospital/Clinic Facility */}
              <div>
                <label className="font-bold text-[#172B4D] block mb-2">
                  Hospital / Clinic Facility
                </label>
                <select
                  value={filters.hospitalId || 'ALL'}
                  onChange={(e) =>
                    onChangeFilters({
                      ...filters,
                      hospitalId: e.target.value === 'ALL' ? undefined : e.target.value,
                    })
                  }
                  className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                >
                  <option value="ALL">All Hospitals & Partner Clinics</option>
                  {HOSPITALS.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name} ({h.city})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center gap-2">
              <button
                onClick={() => {
                  onResetFilters();
                  setIsDrawerOpen(false);
                }}
                className="py-2.5 px-3 bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="flex-1 py-2.5 px-4 bg-[#087E8B] hover:bg-[#06626D] text-white rounded-xl font-bold text-xs shadow-md transition-all text-center"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
