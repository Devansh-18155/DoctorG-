import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ChevronLeft,
  List,
  Map as MapIcon,
  Search,
  Filter,
  SlidersHorizontal,
  MapPin,
  Calendar,
  Sparkles,
  RotateCcw,
  Stethoscope,
  X,
  Phone,
  Mail,
  Clock,
  Star,
  CheckCircle2,
  Navigation,
  Building2,
  Share2,
  Compass,
  Bed,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Crosshair,
} from 'lucide-react';
import { CitySelector } from '../../components/doctor/CitySelector';
import { DoctorSearchBar } from '../../components/doctor/DoctorSearchBar';
import { DoctorFilters } from '../../components/doctor/DoctorFilters';
import { DoctorCard } from '../../components/doctor/DoctorCard';
import { DoctorMap, MapMarkerItem } from '../../components/doctor/DoctorMap';
import { VoiceSearchModal } from '../../components/common/VoiceSearchModal';
import { SmartLocationSearchModal } from '../../components/location/SmartLocationSearchModal';
import { LocationSuggestion } from '../../services/indiaLocationService';
import {
  INDIA_HEALTHCARE_REGISTRY,
  getHospitalsNearLocation,
  HealthcareFacility,
} from '../../data/indiaHealthcareRegistry';
import {
  getEnrichedDoctors,
  filterAndSortDoctors,
  DoctorFilterOptions,
  EnrichedDoctor,
} from '../../utils/doctorDiscoveryHelper';
import { CITIES_DATA, CityInfo } from '../../data/cityData';
import { TravelTimeCardSection } from '../../components/navigation/TravelTimeCardSection';
import { LiveRouteNavigationModal, NavigationTarget } from '../../components/navigation/LiveRouteNavigationModal';
import { HOSPITALS } from '../../data/mockData';

export const FindDoctorScreen: React.FC = () => {
  const {
    goBack,
    navigateTo,
    currentCity,
    setCurrentCity,
    currentArea,
    setCurrentArea,
    isLiveLocation,
    isDetectingLocation,
    liveCoordinates,
    detectLiveLocation,
    showToast,
  } = useApp();

  // View state: List vs Map
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  // Discovery Tab: Doctors vs Hospitals & Diagnostics
  const [activeTab, setActiveTab] = useState<'doctors' | 'hospitals'>('doctors');

  // Selected Discovery Radius in Kilometers (0 = All / Entire City)
  const [selectedRadiusKm, setSelectedRadiusKm] = useState<number>(10);

  // Smart Location Search modal & selected reference location
  const [isSmartLocationModalOpen, setIsSmartLocationModalOpen] = useState(false);
  const [selectedSearchLocation, setSelectedSearchLocation] = useState<LocationSuggestion | null>(null);

  // Hospital category filter
  const [hospitalCategoryFilter, setHospitalCategoryFilter] = useState<'ALL' | 'GOVERNMENT' | 'PRIVATE' | 'EMERGENCY' | 'DIAGNOSTIC'>('ALL');

  // Search and Filter state for doctors
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<DoctorFilterOptions>({
    city: currentCity || 'Kolkata',
    sortBy: 'RECOMMENDED',
  });

  // Voice Search modal
  const [isVoiceSearchOpen, setIsVoiceSearchOpen] = useState(false);

  // Selected Doctor for detail drawer or map focus
  const [selectedDoctor, setSelectedDoctor] = useState<EnrichedDoctor | null>(null);

  // Full Profile Modal
  const [profileDoctor, setProfileDoctor] = useState<EnrichedDoctor | null>(null);

  // Live Navigation Modal Target
  const [navTarget, setNavTarget] = useState<NavigationTarget | null>(null);

  // User effective location coordinates (Prioritize manual search location, then live GPS, then fallback city)
  const effectiveLocationCoords = useMemo(() => {
    if (selectedSearchLocation) {
      return { lat: selectedSearchLocation.lat, lng: selectedSearchLocation.lng };
    }
    if (liveCoordinates) {
      return { lat: liveCoordinates.latitude, lng: liveCoordinates.longitude };
    }
    const cityObj =
      CITIES_DATA.find((c) => c.name.toLowerCase() === (currentCity || '').toLowerCase()) ||
      CITIES_DATA[0];
    return { lat: cityObj.lat, lng: cityObj.lng };
  }, [selectedSearchLocation, liveCoordinates, currentCity]);

  // Sync city filter when global currentCity changes
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      city: currentCity || 'Kolkata',
    }));
  }, [currentCity]);

  // All enriched doctors with distance calculated from effective coordinates
  const allDoctors = useMemo(() => {
    return getEnrichedDoctors(undefined, HOSPITALS, effectiveLocationCoords);
  }, [effectiveLocationCoords]);

  // Filtered and sorted doctors
  const filteredDoctors = useMemo(() => {
    const list = filterAndSortDoctors(
      allDoctors,
      {
        ...filters,
        searchQuery,
      },
      effectiveLocationCoords
    );

    if (selectedRadiusKm > 0) {
      return list.filter((doc) => {
        if (!doc.distanceKm) return true;
        return doc.distanceKm <= selectedRadiusKm;
      });
    }
    return list;
  }, [allDoctors, filters, searchQuery, effectiveLocationCoords, selectedRadiusKm]);

  // Query Hospitals & Diagnostics from National Healthcare Registry
  const nearbyHospitals = useMemo(() => {
    const radiusToUse = selectedRadiusKm > 0 ? selectedRadiusKm : 80;
    const items = getHospitalsNearLocation(
      effectiveLocationCoords.lat,
      effectiveLocationCoords.lng,
      radiusToUse,
      hospitalCategoryFilter
    );

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return items.filter(
        (h) =>
          h.name.toLowerCase().includes(q) ||
          h.city.toLowerCase().includes(q) ||
          h.area.toLowerCase().includes(q) ||
          h.departments.some((d) => d.toLowerCase().includes(q))
      );
    }
    return items;
  }, [effectiveLocationCoords, selectedRadiusKm, hospitalCategoryFilter, searchQuery]);

  // Active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.specialization) count++;
    if (filters.hospitalId) count++;
    if (filters.feeRange && filters.feeRange !== 'ALL') count++;
    if (filters.minExperience && filters.minExperience > 0) count++;
    if (filters.availableToday) count++;
    if (filters.maxDistanceKm) count++;
    return count;
  }, [filters]);

  // Prepare map markers (Doctors + Hospitals)
  const mapMarkers = useMemo<MapMarkerItem[]>(() => {
    const docMarkers: MapMarkerItem[] = filteredDoctors.map((doc) => ({
      id: doc.id,
      lat: doc.lat,
      lng: doc.lng,
      title: doc.name,
      subtitle: `${doc.specialty} • ₹${doc.consultationFee}`,
      type: 'doctor',
      data: doc,
    }));

    const hospMarkers: MapMarkerItem[] = nearbyHospitals.map((h) => ({
      id: h.id,
      lat: h.latitude,
      lng: h.longitude,
      title: h.name,
      subtitle: `${h.area} • ${h.type}`,
      type: 'hospital',
      data: h,
    }));

    return [...docMarkers, ...hospMarkers];
  }, [filteredDoctors, nearbyHospitals]);

  // Map center coordinates
  const mapCenterCoords = useMemo(() => {
    if (selectedDoctor) {
      return { lat: selectedDoctor.lat, lng: selectedDoctor.lng };
    }
    return effectiveLocationCoords;
  }, [selectedDoctor, effectiveLocationCoords]);

  const handleSelectCity = (city: CityInfo, areaName?: string) => {
    setCurrentCity(city.name);
    if (areaName) {
      setCurrentArea(areaName);
    }
    setSelectedSearchLocation(null);
    setFilters((prev) => ({
      ...prev,
      city: city.name,
    }));
    showToast(`Switched discovery to ${city.name}${areaName ? ` (${areaName})` : ''}`, 'info');
  };

  const handleSelectSmartLocation = (loc: LocationSuggestion) => {
    setSelectedSearchLocation(loc);
    setCurrentCity(loc.city);
    if (loc.locality) {
      setCurrentArea(loc.locality);
    }
    setFilters((prev) => ({
      ...prev,
      city: loc.city,
    }));
    showToast(`Reference location set to ${loc.name}, ${loc.city}`, 'success');
  };

  const handleResetFilters = () => {
    setFilters({
      city: currentCity || 'Kolkata',
      sortBy: 'RECOMMENDED',
    });
    setSearchQuery('');
    setSelectedRadiusKm(10);
    setHospitalCategoryFilter('ALL');
    showToast('Filters reset to default', 'info');
  };

  const handleViewLocation = (doc: EnrichedDoctor) => {
    setSelectedDoctor(doc);
    setViewMode('map');
  };

  const handleGetDirections = (doc: EnrichedDoctor) => {
    setNavTarget({
      id: doc.id,
      name: doc.name,
      specialty: doc.specialty,
      hospitalName: doc.hospitalName,
      address: doc.fullClinicAddress,
      latitude: doc.lat,
      longitude: doc.lng,
      hospitalId: doc.hospitalId,
      imageUrl: doc.imageUrl,
    });
  };

  const handleBookAppointment = (doc: EnrichedDoctor) => {
    navigateTo('book-appointment', { selectedDoctorId: doc.id, doctor: doc });
  };

  const openGoogleMapsDirections = (lat: number, lng: number, name: string) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${encodeURIComponent(name)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-full pb-20 bg-[#F6F8FA] flex flex-col">
      {/* Sticky Top Header */}
      <div className="bg-white border-b border-slate-100 p-4 sticky top-0 z-30 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <button
            onClick={goBack}
            className="flex items-center gap-1 text-slate-500 hover:text-slate-800 text-xs font-semibold"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <div className="text-center">
            <h2 className="font-extrabold text-sm text-[#172B4D]">Healthcare Discovery</h2>
            <p className="text-[10px] text-teal-700 font-bold truncate max-w-[200px]">
              {selectedSearchLocation ? selectedSearchLocation.name : currentArea || currentCity || 'India'}
            </p>
          </div>

          {/* List vs Map View Switcher */}
          <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'list'
                  ? 'bg-white text-[#087E8B] shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'map'
                  ? 'bg-white text-[#087E8B] shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Interactive Map View"
            >
              <MapIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ========================================================
            SMART LOCATION REFERENCE BAR
            Search ANY Indian city, village, landmark or PIN code
            ======================================================== */}
        <div className="bg-gradient-to-r from-teal-50 via-sky-50 to-teal-50 border border-teal-200 rounded-2xl p-2.5 flex items-center justify-between gap-2 shadow-2xs">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-[#087E8B] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-teal-800 bg-teal-100/80 px-1.5 py-0.2 rounded">
                  {selectedSearchLocation ? selectedSearchLocation.type : isLiveLocation ? 'Live GPS' : 'Selected Location'}
                </span>
                {selectedSearchLocation?.pincode && (
                  <span className="text-[10px] font-mono text-slate-500 font-bold">
                    📮 {selectedSearchLocation.pincode}
                  </span>
                )}
              </div>
              <p className="text-xs font-black text-[#172B4D] truncate mt-0.5">
                {selectedSearchLocation
                  ? selectedSearchLocation.displayName || `${selectedSearchLocation.name}, ${selectedSearchLocation.city}`
                  : `${currentArea ? `${currentArea}, ` : ''}${currentCity || 'All India'}`}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsSmartLocationModalOpen(true)}
            className="px-3 py-1.5 bg-white hover:bg-teal-50 border border-teal-300 text-[#087E8B] rounded-xl text-xs font-extrabold whitespace-nowrap shadow-xs flex items-center gap-1 transition-all active:scale-95"
            title="Search any Indian city, village, hospital or PIN code"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Search India</span>
          </button>
        </div>

        {/* ========================================================
            DOCTORS VS HOSPITALS & LABS DISCOVERY TABS
            ======================================================== */}
        <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
          <button
            onClick={() => setActiveTab('doctors')}
            className={`py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'doctors'
                ? 'bg-white text-[#087E8B] shadow-xs'
                : 'text-slate-600 hover:text-[#172B4D]'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>Doctors ({filteredDoctors.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('hospitals')}
            className={`py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'hospitals'
                ? 'bg-white text-[#087E8B] shadow-xs'
                : 'text-slate-600 hover:text-[#172B4D]'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Hospitals & Labs ({nearbyHospitals.length})</span>
          </button>
        </div>

        {/* ========================================================
            RADIUS SELECTOR PILLS (1 km, 3 km, 5 km, 10 km, 25 km, 50 km, 100 km, Entire City)
            ======================================================== */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold px-0.5">
            <span className="flex items-center gap-1">
              <Crosshair className="w-3 h-3 text-teal-600" />
              <span>Search Radius from Reference Location:</span>
            </span>
            <span className="font-extrabold text-[#087E8B]">
              {selectedRadiusKm === 0 ? 'Entire Selected City' : `Within ${selectedRadiusKm} km`}
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {[1, 3, 5, 10, 25, 50, 100, 0].map((radius) => (
              <button
                key={radius}
                onClick={() => setSelectedRadiusKm(radius)}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  selectedRadiusKm === radius
                    ? 'bg-[#087E8B] text-white border-[#087E8B] shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-teal-300'
                }`}
              >
                {radius === 0 ? 'Entire City' : `${radius} km`}
              </button>
            ))}
          </div>
        </div>

        {/* Doctor Search Bar with Voice Mic */}
        <DoctorSearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onOpenVoiceSearch={() => setIsVoiceSearchOpen(true)}
          resultCount={activeTab === 'doctors' ? filteredDoctors.length : nearbyHospitals.length}
        />

        {/* Filter and Sort Chips (when Doctors tab is active) */}
        {activeTab === 'doctors' ? (
          <DoctorFilters
            filters={filters}
            onChangeFilters={setFilters}
            onResetFilters={handleResetFilters}
            activeCount={activeFilterCount}
            hasUserLocation={Boolean(selectedSearchLocation || liveCoordinates)}
          />
        ) : (
          /* Hospital Category Filters */
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 text-xs font-semibold">
            {[
              { id: 'ALL', label: 'All Facilities' },
              { id: 'GOVERNMENT', label: '🏛️ Government' },
              { id: 'PRIVATE', label: '🏢 Private' },
              { id: 'EMERGENCY', label: '🚨 24x7 Emergency ICU' },
              { id: 'DIAGNOSTIC', label: '🔬 Labs & Pathology' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setHospitalCategoryFilter(cat.id as any)}
                className={`px-2.5 py-1 rounded-xl whitespace-nowrap transition-all border ${
                  hospitalCategoryFilter === cat.id
                    ? 'bg-teal-900 text-white border-teal-900 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-teal-300'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content Area: List View OR Map View */}
      {viewMode === 'list' ? (
        <div className="p-4 space-y-3 flex-1">
          {/* Active Filter Summary Bar */}
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>
              Showing{' '}
              <strong>
                {activeTab === 'doctors' ? filteredDoctors.length : nearbyHospitals.length}
              </strong>{' '}
              {activeTab === 'doctors' ? 'doctors' : 'hospitals & labs'} within{' '}
              <strong className="text-teal-800">
                {selectedRadiusKm === 0 ? 'entire city' : `${selectedRadiusKm} km`}
              </strong>
            </span>
            {(activeFilterCount > 0 || searchQuery || hospitalCategoryFilter !== 'ALL') && (
              <button
                onClick={handleResetFilters}
                className="text-teal-700 font-bold hover:underline flex items-center gap-1 text-[11px]"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* ========================================================
              TAB 1: DOCTORS LIST
              ======================================================== */}
          {activeTab === 'doctors' && (
            filteredDoctors.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 mt-4 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mx-auto">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <h4 className="font-extrabold text-sm text-[#172B4D]">
                  No doctors found within {selectedRadiusKm === 0 ? 'the city' : `${selectedRadiusKm} km`}
                </h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Try expanding the search radius (e.g. 25 km or 50 km) or searching for another location across India.
                </p>
                <div className="flex justify-center gap-2 pt-2">
                  <button
                    onClick={() => setSelectedRadiusKm(50)}
                    className="py-2 px-4 bg-[#087E8B] text-white text-xs font-bold rounded-xl shadow-xs"
                  >
                    Expand to 50 km
                  </button>
                  <button
                    onClick={() => setIsSmartLocationModalOpen(true)}
                    className="py-2 px-4 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
                  >
                    Change Location
                  </button>
                </div>
              </div>
            ) : (
              filteredDoctors.map((doc) => (
                <DoctorCard
                  key={doc.id}
                  doctor={doc}
                  onViewProfile={setProfileDoctor}
                  onViewLocation={handleViewLocation}
                  onGetDirections={handleGetDirections}
                  onBookAppointment={handleBookAppointment}
                  isSelected={selectedDoctor?.id === doc.id}
                />
              ))
            )
          )}

          {/* ========================================================
              TAB 2: HOSPITALS & DIAGNOSTIC CENTERS LIST
              ======================================================== */}
          {activeTab === 'hospitals' && (
            nearbyHospitals.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 mt-4 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mx-auto">
                  <Building2 className="w-6 h-6" />
                </div>
                <h4 className="font-extrabold text-sm text-[#172B4D]">
                  No hospitals found within this radius
                </h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Expand the radius or search another city/district anywhere in India.
                </p>
                <button
                  onClick={() => setSelectedRadiusKm(50)}
                  className="py-2.5 px-5 bg-[#087E8B] text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Expand Radius to 50 km
                </button>
              </div>
            ) : (
              nearbyHospitals.map((hosp) => (
                <div
                  key={hosp.id}
                  className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={hosp.imageUrl}
                      alt={hosp.name}
                      className="w-20 h-20 rounded-2xl object-cover border border-slate-200 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                          {hosp.categoryType}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          hosp.type === 'Government'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {hosp.type}
                        </span>
                        {hosp.verified && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-teal-600 text-white flex items-center gap-0.5">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Verified</span>
                          </span>
                        )}
                      </div>

                      <h3 className="font-extrabold text-sm text-[#172B4D] mt-1 leading-snug line-clamp-2">
                        {hosp.name}
                      </h3>

                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {hosp.area}, {hosp.city} • PIN {hosp.pincode}
                      </p>

                      <div className="flex items-center gap-2 mt-1.5 text-xs">
                        <span className="flex items-center gap-1 font-bold text-amber-600">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          {hosp.rating} ({hosp.reviewCount})
                        </span>
                        <span>•</span>
                        <span className="font-extrabold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md">
                          📍 {hosp.distanceStr}
                        </span>
                        <span>•</span>
                        <span className="text-slate-500 text-[11px] font-medium">
                          {hosp.driveTimeStr}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Facilities & Emergency Hotline */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      {hosp.hasEmergencyICU ? (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-md flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                          <span>24x7 Emergency ICU</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-slate-500">
                          OPD Timings: {hosp.openingHours.split('|')[0]}
                        </span>
                      )}
                      {hosp.bedsAvailable > 0 && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Bed className="w-3 h-3" />
                          <span>{hosp.bedsAvailable} Beds</span>
                        </span>
                      )}
                    </div>

                    <span className="text-[9px] text-slate-400 font-medium">
                      Source: {hosp.source}
                    </span>
                  </div>

                  {/* Departments pills */}
                  <div className="flex gap-1 flex-wrap">
                    {hosp.departments.slice(0, 4).map((dept) => (
                      <span
                        key={dept}
                        className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] font-semibold"
                      >
                        {dept}
                      </span>
                    ))}
                    {hosp.departments.length > 4 && (
                      <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded-md text-[10px]">
                        +{hosp.departments.length - 4} more
                      </span>
                    )}
                  </div>

                  {/* Travel Time & Route Section (Car · Bike · Walking + View Route) */}
                  <div className="pt-1">
                    <TravelTimeCardSection
                      distanceKm={hosp.distanceKm || 3.5}
                      onViewRoute={() =>
                        setNavTarget({
                          id: hosp.id,
                          name: hosp.name,
                          type: hosp.type,
                          address: `${hosp.address}, ${hosp.area}`,
                          latitude: hosp.latitude,
                          longitude: hosp.longitude,
                          hospitalId: hosp.id,
                          imageUrl: hosp.imageUrl,
                        })
                      }
                    />
                  </div>

                  {/* Actions: Call & Google Maps Directions */}
                  <div className="pt-2 flex items-center gap-2">
                    <a
                      href={`tel:${hosp.emergencyPhone || hosp.phone}`}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-teal-700" />
                      <span>Call Facility</span>
                    </a>

                    <button
                      onClick={() => openGoogleMapsDirections(hosp.latitude, hosp.longitude, hosp.name)}
                      className="flex-1 py-2 px-3 bg-[#087E8B] hover:bg-[#06626D] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Directions (Maps)</span>
                      <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
                    </button>
                  </div>
                </div>
              ))
            )
          )}
        </div>
      ) : (
        /* ========================================================
            MAP VIEW MODE (With Radius Circle Overlay)
            ======================================================== */
        <div className="flex-1 relative min-h-[550px] flex flex-col">
          <DoctorMap
            center={mapCenterCoords}
            zoom={selectedRadiusKm <= 5 ? 14 : selectedRadiusKm <= 15 ? 12 : 11}
            markers={mapMarkers}
            selectedDoctor={selectedDoctor}
            onSelectDoctor={setSelectedDoctor}
            userLocation={effectiveLocationCoords}
            onRequestUserLocation={detectLiveLocation}
            radiusKm={selectedRadiusKm > 0 ? selectedRadiusKm : undefined}
            radiusCenter={effectiveLocationCoords}
            onBookAppointment={handleBookAppointment}
            onGetDirections={handleGetDirections}
            onViewProfile={setProfileDoctor}
            height="100%"
            onSearchThisArea={(newCenter) => {
              showToast('Searching clinic locations in this map view', 'info');
            }}
          />
        </div>
      )}

      {/* Voice Search Modal */}
      <VoiceSearchModal
        isOpen={isVoiceSearchOpen}
        onClose={() => setIsVoiceSearchOpen(false)}
        onSearch={(query: string) => {
          setSearchQuery(query);
          setIsVoiceSearchOpen(false);
          showToast(`Searching for "${query}"`, 'info');
        }}
      />

      {/* Smart Location Search Modal (Search ANY location in India) */}
      <SmartLocationSearchModal
        isOpen={isSmartLocationModalOpen}
        onClose={() => setIsSmartLocationModalOpen(false)}
        onSelectLocation={handleSelectSmartLocation}
        currentLocationName={selectedSearchLocation?.displayName || currentCity}
      />

      {/* Doctor Full Profile Modal */}
      {profileDoctor && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-md w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden animate-in slide-in-from-bottom duration-200">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Doctor Profile
              </span>
              <button
                onClick={() => setProfileDoctor(null)}
                className="w-7 h-7 rounded-full bg-slate-200/80 hover:bg-slate-300 flex items-center justify-center text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Profile Content */}
            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              <div className="flex items-start gap-4">
                <img
                  src={profileDoctor.imageUrl}
                  alt={profileDoctor.name}
                  className="w-20 h-20 rounded-2xl object-cover border border-slate-200 shadow-xs"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-extrabold text-base text-[#172B4D] truncate">
                      {profileDoctor.name}
                    </h3>
                    {profileDoctor.verified && (
                      <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs font-semibold text-teal-700 truncate mt-0.5">
                    {profileDoctor.specialty}
                  </p>
                  <p className="text-[11px] text-slate-500">{profileDoctor.qualification}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs">
                    <span className="flex items-center gap-1 font-bold text-amber-600">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      {profileDoctor.rating} ({profileDoctor.reviewCount} Reviews)
                    </span>
                    <span>•</span>
                    <span className="font-semibold text-slate-700">
                      {profileDoctor.experienceYears} Years Experience
                    </span>
                  </div>
                </div>
              </div>

              {/* Consultation Fee & Availability */}
              <div className="grid grid-cols-2 gap-2 p-3 bg-teal-50/70 rounded-2xl border border-teal-200">
                <div>
                  <span className="text-[10px] text-teal-700 font-bold block uppercase">
                    Consultation Fee
                  </span>
                  <span className="text-base font-black text-[#172B4D]">
                    ₹{profileDoctor.consultationFee}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-teal-700 font-bold block uppercase">
                    Next OPD Slot
                  </span>
                  <span className="text-xs font-bold text-slate-800">
                    {profileDoctor.nextSlot}
                  </span>
                </div>
              </div>

              {/* About */}
              <div>
                <h5 className="font-bold text-xs text-[#172B4D] mb-1">About Doctor</h5>
                <p className="text-xs text-slate-600 leading-relaxed">{profileDoctor.about}</p>
              </div>

              {/* Hospital & Clinic Address */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-[#172B4D]">
                  <Building2 className="w-4 h-4 text-teal-700" />
                  <span>{profileDoctor.hospitalName}</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  {profileDoctor.fullClinicAddress}
                </p>
                <p className="text-[10px] font-mono text-slate-400 pt-1">
                  Coordinates: {profileDoctor.lat.toFixed(4)}°N, {profileDoctor.lng.toFixed(4)}°E
                </p>
              </div>

              {/* Languages Spoken */}
              <div>
                <h5 className="font-bold text-xs text-[#172B4D] mb-1">Languages Spoken</h5>
                <div className="flex gap-1.5 flex-wrap">
                  {profileDoctor.languages.map((l) => (
                    <span
                      key={l}
                      className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-[11px] font-semibold"
                    >
                      {l}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-2">
              <button
                onClick={() => {
                  setProfileDoctor(null);
                  handleGetDirections(profileDoctor);
                }}
                className="flex-1 py-3 bg-white border border-teal-300 text-[#087E8B] hover:bg-teal-50 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
              >
                <Navigation className="w-4 h-4" />
                <span>Get Directions</span>
              </button>

              <button
                onClick={() => {
                  setProfileDoctor(null);
                  handleBookAppointment(profileDoctor);
                }}
                className="flex-1 py-3 bg-[#087E8B] hover:bg-[#06626D] text-white rounded-2xl font-bold text-xs shadow-md shadow-teal-700/20 transition-all text-center"
              >
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Route Navigation & Interactive Map Modal for Doctor & Hospital */}
      <LiveRouteNavigationModal
        isOpen={Boolean(navTarget)}
        onClose={() => setNavTarget(null)}
        target={navTarget}
      />
    </div>
  );
};
