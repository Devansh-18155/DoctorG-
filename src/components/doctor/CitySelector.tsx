import React, { useState } from 'react';
import {
  MapPin,
  Search,
  Crosshair,
  ChevronRight,
  Check,
  Building2,
  Navigation,
  Sparkles,
  History,
  X,
} from 'lucide-react';
import { CITIES_DATA, CityInfo, ALL_STATES } from '../../data/cityData';
import { VoiceSearchInput } from '../common/VoiceSearchInput';

interface CitySelectorProps {
  currentCity: string;
  currentArea?: string;
  onSelectCity: (city: CityInfo, area?: string) => void;
  onUseCurrentLocation: () => Promise<void>;
  isDetectingLocation?: boolean;
}

export const CitySelector: React.FC<CitySelectorProps> = ({
  currentCity,
  currentArea,
  onSelectCity,
  onUseCurrentLocation,
  isDetectingLocation = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState<string>('All');
  const [recentCities, setRecentCities] = useState<string[]>([
    'Kolkata',
    'Delhi NCR',
    'Bengaluru',
  ]);

  // Find currently active city object
  const activeCityObj =
    CITIES_DATA.find(
      (c) =>
        c.name.toLowerCase() === (currentCity || '').toLowerCase() ||
        c.id === (currentCity || '').toLowerCase()
    ) || CITIES_DATA[0];

  // Filter cities by state and search query
  const filteredCities = CITIES_DATA.filter((city) => {
    const matchesState = selectedState === 'All' || city.state === selectedState;
    if (!matchesState) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const matchesCity = city.name.toLowerCase().includes(q);
    const matchesStateName = city.state.toLowerCase().includes(q);
    const matchesPincode = city.pincodes.some((pin) => pin.includes(q));
    const matchesLocality = city.localities.some((loc) =>
      loc.name.toLowerCase().includes(q)
    );
    return matchesCity || matchesStateName || matchesPincode || matchesLocality;
  });

  const handleCityPick = (city: CityInfo, areaName?: string) => {
    onSelectCity(city, areaName);
    // Add to recent cities
    if (!recentCities.includes(city.name)) {
      setRecentCities((prev) => [city.name, ...prev.slice(0, 4)]);
    }
    setIsOpen(false);
  };

  return (
    <>
      {/* Trigger Bar */}
      <div
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-between p-3 bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:border-teal-300 cursor-pointer transition-all group"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-[#087E8B] flex-shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <div className="min-w-0 text-left">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <span>Select Medical City</span>
              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
              <span className="text-teal-700">{activeCityObj.state}</span>
            </div>
            <h4 className="font-extrabold text-xs text-[#172B4D] truncate group-hover:text-[#087E8B] transition-colors">
              {activeCityObj.name}
              {currentArea ? ` • ${currentArea}` : ''}
            </h4>
          </div>
        </div>

        <button className="px-2.5 py-1 text-[11px] font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg flex items-center gap-0.5 flex-shrink-0 transition-colors">
          <span>Change</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* City Selection Modal / Bottom Sheet */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden animate-in slide-in-from-bottom duration-200">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="font-extrabold text-sm text-[#172B4D]">
                  Choose City for Doctor & Clinic Discovery
                </h3>
                <p className="text-[11px] text-slate-500">
                  Search across top healthcare zones or explore any city without GPS restriction
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-200/80 hover:bg-slate-300 flex items-center justify-center text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-4 overflow-y-auto space-y-4 flex-1">
              {/* Search Bar with Reusable Voice Search */}
              <VoiceSearchInput
                placeholder="Search city, area, state, or PIN code (e.g. Salt Lake, 700091)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onChangeValue={setSearchQuery}
                onClear={() => setSearchQuery('')}
                searchCategory="location"
                inputClassName="bg-slate-100 rounded-xl"
                autoFocus
              />

              {/* GPS Live Location Trigger */}
              <div
                onClick={async () => {
                  await onUseCurrentLocation();
                  setIsOpen(false);
                }}
                className="p-3 bg-teal-50/70 hover:bg-teal-100/70 border border-teal-200 rounded-2xl flex items-center justify-between cursor-pointer transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
                    <Crosshair className={`w-4 h-4 ${isDetectingLocation ? 'animate-spin' : ''}`} />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-[#172B4D]">
                      {isDetectingLocation ? 'Detecting Your GPS Location...' : 'Use My Current Location'}
                    </h5>
                    <p className="text-[10px] text-teal-700">
                      Auto-detect nearby doctors & hospital clinics around you
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-teal-800 bg-white px-2 py-0.5 rounded-lg border border-teal-200 shadow-2xs">
                  GPS Auto
                </span>
              </div>

              {/* Recently Selected Cities */}
              {recentCities.length > 0 && !searchQuery && (
                <div>
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 mb-2">
                    <History className="w-3.5 h-3.5" />
                    <span>Recently Selected</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {recentCities.map((cName) => {
                      const cObj = CITIES_DATA.find((x) => x.name === cName);
                      if (!cObj) return null;
                      return (
                        <button
                          key={cName}
                          onClick={() => handleCityPick(cObj)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200/80 transition-colors"
                        >
                          {cName}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* State Filter Chips */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Filter by State
                </span>
                <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {['All', ...ALL_STATES].map((st) => (
                    <button
                      key={st}
                      onClick={() => setSelectedState(st)}
                      className={`px-3 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all ${
                        selectedState === st
                          ? 'bg-[#172B4D] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Popular Cities */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Cities & Healthcare Enclaves ({filteredCities.length})
                </span>
                <div className="space-y-2">
                  {filteredCities.map((city) => {
                    const isSelected = city.id === activeCityObj.id;
                    return (
                      <div
                        key={city.id}
                        className={`p-3 rounded-2xl border transition-all ${
                          isSelected
                            ? 'bg-teal-50/50 border-teal-300 ring-2 ring-teal-100'
                            : 'bg-white border-slate-200/80 hover:border-teal-200'
                        }`}
                      >
                        <div
                          onClick={() => handleCityPick(city)}
                          className="flex items-center justify-between cursor-pointer"
                        >
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="font-extrabold text-xs text-[#172B4D]">{city.name}</h4>
                              <span className="text-[10px] font-medium text-slate-400">
                                ({city.state})
                              </span>
                              {city.popular && (
                                <span className="text-[9px] bg-amber-50 text-amber-700 px-1.5 py-0.2 rounded font-bold border border-amber-200">
                                  Top Medical Hub
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-500 mt-0.5">
                              {city.localities.length} Major Hospital Zones • PIN:{' '}
                              {city.pincodes.slice(0, 3).join(', ')}...
                            </p>
                          </div>
                          {isSelected ? (
                            <div className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center">
                              <Check className="w-3.5 h-3.5" />
                            </div>
                          ) : (
                            <ChevronRight className="w-4 h-4 text-slate-400" />
                          )}
                        </div>

                        {/* Expandable Popular Localities inside City */}
                        <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap gap-1">
                          {city.localities.map((loc) => (
                            <button
                              key={loc.name}
                              onClick={() => handleCityPick(city, loc.name)}
                              className="px-2 py-0.5 text-[10px] font-medium bg-slate-100 hover:bg-teal-100/70 text-slate-700 hover:text-teal-800 rounded-lg transition-colors truncate max-w-[170px]"
                            >
                              📍 {loc.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
