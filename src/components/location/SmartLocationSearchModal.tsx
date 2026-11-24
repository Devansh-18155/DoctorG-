import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  MapPin,
  Crosshair,
  X,
  Compass,
  Check,
  Building2,
  Navigation,
  Sparkles,
  History,
  RotateCcw,
  ArrowRight,
  ExternalLink,
  Mic,
  AlertCircle,
} from 'lucide-react';
import {
  searchIndiaLocations,
  LocationSuggestion,
  LocationType,
} from '../../services/indiaLocationService';
import { DoctorMap } from '../doctor/DoctorMap';
import { VoiceSearchModal } from '../common/VoiceSearchModal';
import { VoiceSearchInput } from '../common/VoiceSearchInput';

interface SmartLocationSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (location: LocationSuggestion) => void;
  currentLocationName?: string;
}

export const SmartLocationSearchModal: React.FC<SmartLocationSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectLocation,
  currentLocationName,
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationSuggestion | null>(null);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);

  // Search History stored in state
  const [searchHistory, setSearchHistory] = useState<LocationSuggestion[]>([
    {
      id: 'mp-bhopal-1',
      name: 'Bhopal',
      type: 'CITY',
      city: 'Bhopal',
      district: 'Bhopal',
      state: 'Madhya Pradesh',
      pincode: '462001',
      lat: 23.2599,
      lng: 77.4126,
      displayName: 'Bhopal, Madhya Pradesh, India',
      source: 'Local Knowledge Base',
    },
    {
      id: 'mp-kolar-1',
      name: 'Kolar Road',
      type: 'LOCALITY',
      locality: 'Kolar Road',
      city: 'Bhopal',
      district: 'Bhopal',
      state: 'Madhya Pradesh',
      pincode: '462042',
      lat: 23.1765,
      lng: 77.4241,
      displayName: 'Kolar Road, Bhopal, Madhya Pradesh',
      source: 'Local Knowledge Base',
    },
    {
      id: 'dl-aiims-delhi',
      name: 'AIIMS Delhi',
      type: 'LANDMARK',
      locality: 'Ansari Nagar',
      city: 'New Delhi',
      district: 'South Delhi',
      state: 'Delhi',
      pincode: '110029',
      lat: 28.5672,
      lng: 77.21,
      displayName: 'AIIMS New Delhi, 110029',
      source: 'Local Knowledge Base',
    },
  ]);

  const abortControllerRef = useRef<AbortController | null>(null);

  // Debounced Search Effect
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const timer = setTimeout(async () => {
      try {
        const results = await searchIndiaLocations(query, {
          signal: controller.signal,
          limit: 8,
        });
        setSuggestions(results);
      } catch (err) {
        // Handled silently
      } finally {
        setIsLoading(false);
      }
    }, 280);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  if (!isOpen) return null;

  const handlePickSuggestion = (loc: LocationSuggestion) => {
    setSelectedLocation(loc);
    // Add to history if not exists
    if (!searchHistory.some((h) => h.id === loc.id)) {
      setSearchHistory((prev) => [loc, ...prev.slice(0, 4)]);
    }
  };

  const handleConfirmLocation = () => {
    if (selectedLocation) {
      onSelectLocation(selectedLocation);
      setSelectedLocation(null);
      onClose();
    }
  };

  const getTypeBadge = (type: LocationType) => {
    switch (type) {
      case 'CITY':
        return { label: 'City', color: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'LOCALITY':
        return { label: 'Locality', color: 'bg-teal-50 text-teal-700 border-teal-200' };
      case 'LANDMARK':
        return { label: 'Landmark / Hospital', color: 'bg-rose-50 text-rose-700 border-rose-200' };
      case 'PINCODE':
        return { label: 'PIN Code', color: 'bg-purple-50 text-purple-700 border-purple-200' };
      case 'VILLAGE':
        return { label: 'Village', color: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'TOWN':
        return { label: 'Town', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      default:
        return { label: 'Location', color: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#087E8B] text-white flex items-center justify-center font-bold shadow-xs">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-[#172B4D]">
                {selectedLocation ? 'Confirm Selected Location' : 'Search Any Location in India'}
              </h3>
              <p className="text-[11px] text-slate-500">
                Type any city, town, village, locality, landmark or PIN code
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setSelectedLocation(null);
              onClose();
            }}
            className="w-7 h-7 rounded-full bg-slate-200/80 hover:bg-slate-300 flex items-center justify-center text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {selectedLocation ? (
            /* LOCATION CONFIRMATION SECTION (Section 3 Requirement) */
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 bg-gradient-to-br from-teal-50/60 to-white rounded-2xl border border-teal-200 shadow-2xs space-y-2.5">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-700 bg-teal-100/70 px-2 py-0.5 rounded-full">
                      Selected Reference Location
                    </span>
                    <h4 className="font-black text-base text-[#172B4D] mt-1">
                      {selectedLocation.name}
                    </h4>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-lg bg-white border border-teal-200 text-teal-800 shadow-2xs font-mono">
                    📍 {selectedLocation.lat.toFixed(4)}°N, {selectedLocation.lng.toFixed(4)}°E
                  </span>
                </div>

                <div className="space-y-1 text-xs text-slate-600 pt-1 border-t border-slate-100">
                  <p>
                    <strong>City / Area:</strong>{' '}
                    {selectedLocation.locality
                      ? `${selectedLocation.locality}, ${selectedLocation.city}`
                      : selectedLocation.city}
                  </p>
                  {selectedLocation.district && (
                    <p>
                      <strong>District:</strong> {selectedLocation.district}
                    </p>
                  )}
                  <p>
                    <strong>State:</strong> {selectedLocation.state}, India
                  </p>
                  {selectedLocation.pincode && (
                    <p>
                      <strong>PIN Code:</strong>{' '}
                      <span className="font-mono font-bold text-teal-800">
                        {selectedLocation.pincode}
                      </span>
                    </p>
                  )}
                </div>

                <div className="text-[10px] text-slate-400 font-medium">
                  Source: {selectedLocation.source} • Verified Geographical Coordinates
                </div>
              </div>

              {/* Interactive Map Preview for Selected Location */}
              <div className="h-52 w-full rounded-2xl overflow-hidden border border-slate-200 shadow-inner relative">
                <DoctorMap
                  center={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
                  zoom={14}
                  markers={[
                    {
                      id: 'selected-preview-marker',
                      lat: selectedLocation.lat,
                      lng: selectedLocation.lng,
                      title: selectedLocation.name,
                      type: 'user',
                    },
                  ]}
                  height="100%"
                  showSearchAreaBtn={false}
                />
                <div className="absolute top-2 left-2 z-30 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-lg text-[9px] font-bold text-slate-700 border border-slate-200">
                  📍 Map Center: {selectedLocation.name}
                </div>
              </div>

              {/* Action Buttons: Change vs Confirm */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => setSelectedLocation(null)}
                  className="py-3 px-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition-colors text-center"
                >
                  Change Location
                </button>

                <button
                  onClick={handleConfirmLocation}
                  className="py-3 px-4 bg-[#087E8B] hover:bg-[#06626D] text-white font-bold text-xs rounded-xl shadow-md shadow-teal-700/20 transition-all flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Confirm Location</span>
                </button>
              </div>
            </div>
          ) : (
            /* SEARCH INPUT & SUGGESTIONS SECTION */
            <div className="space-y-4">
              {/* Modern Search Bar with Reusable Voice Search */}
              <VoiceSearchInput
                autoFocus
                placeholder="Search city, area, village, hospital or PIN code..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onChangeValue={setQuery}
                onClear={() => setQuery('')}
                searchCategory="location"
                inputClassName="bg-slate-100 rounded-2xl py-3"
              />

              {/* Suggestions List */}
              {isLoading ? (
                <div className="py-8 text-center space-y-2">
                  <div className="w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-xs text-slate-500 font-medium">
                    Searching Indian cities, towns, villages & PIN codes...
                  </p>
                </div>
              ) : suggestions.length > 0 ? (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Matching Locations ({suggestions.length})
                  </span>
                  <div className="space-y-1.5">
                    {suggestions.map((item) => {
                      const badge = getTypeBadge(item.type);
                      return (
                        <div
                          key={item.id}
                          onClick={() => handlePickSuggestion(item)}
                          className="p-3 bg-white hover:bg-teal-50/60 rounded-2xl border border-slate-200/90 hover:border-teal-300 cursor-pointer transition-all flex items-start gap-2.5 group"
                        >
                          <div className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-[#087E8B] group-hover:text-white text-slate-700 flex items-center justify-center flex-shrink-0 transition-colors mt-0.5">
                            <MapPin className="w-4 h-4" />
                          </div>

                          <div className="flex-1 min-w-0 text-left">
                            <div className="flex items-center gap-2">
                              <h5 className="font-extrabold text-xs text-[#172B4D] truncate group-hover:text-teal-800">
                                {item.name}
                              </h5>
                              <span
                                className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${badge.color}`}
                              >
                                {badge.label}
                              </span>
                            </div>

                            <p className="text-[11px] text-slate-500 truncate mt-0.5">
                              {item.locality ? `${item.locality}, ` : ''}
                              {item.city !== item.name ? `${item.city}, ` : ''}
                              {item.district && item.district !== item.city
                                ? `${item.district}, `
                                : ''}
                              <strong className="text-slate-700">{item.state}</strong>
                              {item.pincode ? ` • PIN: ${item.pincode}` : ''}
                            </p>
                          </div>

                          <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-teal-600 self-center flex-shrink-0 transition-colors" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : query.length >= 2 ? (
                <div className="py-6 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                  <p className="font-bold text-slate-700">No exact location matches found for "{query}"</p>
                  <p className="text-[11px]">
                    Try typing the main district, state (e.g. "Indore", "Bhopal"), or 6-digit PIN code.
                  </p>
                </div>
              ) : null}

              {/* Popular Indian Healthcare Metros & Cities */}
              {!query && (
                <div className="space-y-3">
                  {/* Search History */}
                  {searchHistory.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 mb-1.5">
                        <History className="w-3.5 h-3.5" />
                        <span>Recent Searches</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {searchHistory.map((h) => (
                          <button
                            key={h.id}
                            onClick={() => handlePickSuggestion(h)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200/80 transition-colors flex items-center gap-1"
                          >
                            <span>📍 {h.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Popular Cities Grid */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                      Popular Indian Healthcare Destinations
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { name: 'Bhopal (Kolar Road)', q: 'Bhopal Kolar Road', state: 'Madhya Pradesh' },
                        { name: 'Indore (Vijay Nagar)', q: 'Indore Vijay Nagar', state: 'Madhya Pradesh' },
                        { name: 'AIIMS Delhi / Saket', q: 'AIIMS Delhi Saket', state: 'New Delhi' },
                        { name: 'Banaras Hindu Univ (BHU)', q: 'BHU Varanasi', state: 'Uttar Pradesh' },
                        { name: 'Jaipur (Malviya Nagar)', q: 'Jaipur Malviya Nagar', state: 'Rajasthan' },
                        { name: 'Ranchi (RIMS Hub)', q: 'Ranchi RIMS', state: 'Jharkhand' },
                        { name: 'Patna (AIIMS Bihar)', q: 'AIIMS Patna', state: 'Bihar' },
                        { name: 'Kolkata (Salt Lake)', q: 'Kolkata Salt Lake', state: 'West Bengal' },
                        { name: 'Bengaluru (Indiranagar)', q: 'Bengaluru Indiranagar', state: 'Karnataka' },
                        { name: 'Mumbai (Bandra West)', q: 'Mumbai Bandra', state: 'Maharashtra' },
                      ].map((item) => (
                        <button
                          key={item.name}
                          onClick={() => setQuery(item.q)}
                          className="p-2.5 text-left bg-slate-50 hover:bg-teal-50/70 border border-slate-200 hover:border-teal-300 rounded-xl transition-all"
                        >
                          <div className="font-bold text-xs text-[#172B4D] truncate">
                            {item.name}
                          </div>
                          <div className="text-[10px] text-teal-700">{item.state}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Voice Search Integration */}
      <VoiceSearchModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        onSearch={(spokenText) => {
          setQuery(spokenText);
          setIsVoiceOpen(false);
        }}
      />
    </div>
  );
};
