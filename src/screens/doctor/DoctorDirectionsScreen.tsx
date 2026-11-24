import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ChevronLeft,
  Navigation,
  MapPin,
  Car,
  Footprints,
  Clock,
  Compass,
  Building2,
  ExternalLink,
  ShieldCheck,
  Crosshair,
  Share2,
  Phone,
  AlertCircle,
  Calendar,
} from 'lucide-react';
import { DoctorMap, MapMarkerItem } from '../../components/doctor/DoctorMap';
import { RoutePreview, RouteAlternative } from '../../components/doctor/RoutePreview';
import { DirectionsPanel } from '../../components/doctor/DirectionsPanel';
import { NavigationLauncher } from '../../components/doctor/NavigationLauncher';
import {
  generateRoutePoints,
  EnrichedDoctor,
} from '../../utils/doctorDiscoveryHelper';
import { CITIES_DATA } from '../../data/cityData';
import { haversineDistance } from '../../utils/locationHelper';

export const DoctorDirectionsScreen: React.FC = () => {
  const {
    screenParams,
    goBack,
    navigateTo,
    currentCity,
    currentArea,
    liveCoordinates,
    detectLiveLocation,
    isDetectingLocation,
    showToast,
  } = useApp();

  const doctor: EnrichedDoctor = screenParams?.doctor;

  // Travel Mode: Driving vs Walking
  const [travelMode, setTravelMode] = useState<'driving' | 'walking'>('driving');
  const [selectedRouteId, setSelectedRouteId] = useState<string>('route-1');

  // Custom Origin override if GPS not enabled
  const [isChangingOrigin, setIsChangingOrigin] = useState(false);
  const [customOriginName, setCustomOriginName] = useState<string>('');

  // Destination coordinates
  const destinationCoords = useMemo(() => {
    if (doctor?.lat && doctor?.lng) {
      return { lat: doctor.lat, lng: doctor.lng };
    }
    return { lat: 22.5697, lng: 88.4055 };
  }, [doctor]);

  // Origin coordinates
  const originCoords = useMemo(() => {
    if (liveCoordinates) {
      return { lat: liveCoordinates.latitude, lng: liveCoordinates.longitude };
    }
    // Fallback to active city center or chosen area
    const cityObj =
      CITIES_DATA.find(
        (c) => c.name.toLowerCase() === (currentCity || doctor?.clinicCity || 'Kolkata').toLowerCase()
      ) || CITIES_DATA[0];

    // If custom origin matches a locality
    if (customOriginName) {
      const loc = cityObj.localities.find((l) => l.name.includes(customOriginName));
      if (loc) return { lat: loc.lat, lng: loc.lng };
    }

    return { lat: cityObj.lat, lng: cityObj.lng };
  }, [liveCoordinates, currentCity, doctor, customOriginName]);

  const originLabel = useMemo(() => {
    if (liveCoordinates) return 'Your Live GPS Location';
    if (customOriginName) return customOriginName;
    return `${currentArea || 'City Center'}, ${currentCity || 'Kolkata'}`;
  }, [liveCoordinates, customOriginName, currentArea, currentCity]);

  // Calculate real distance
  const baseDistanceKm = useMemo(() => {
    const d = haversineDistance(
      originCoords.lat,
      originCoords.lng,
      destinationCoords.lat,
      destinationCoords.lng
    );
    return Math.max(1.2, Math.round(d * 10) / 10);
  }, [originCoords, destinationCoords]);

  // Route alternatives
  const alternatives: RouteAlternative[] = useMemo(() => {
    const d1 = baseDistanceKm;
    const d2 = Math.round((baseDistanceKm * 1.15) * 10) / 10;
    const min1 = Math.max(4, Math.round(d1 * 2.6));
    const min2 = Math.max(7, Math.round(d2 * 2.8));

    return [
      {
        id: 'route-1',
        name: 'Via Main Arterial Medical Corridor',
        distanceKm: d1,
        durationMinutes: min1,
        trafficCondition: 'Clear',
        isFastest: true,
      },
      {
        id: 'route-2',
        name: 'Via Inner Ring Road & Flyover',
        distanceKm: d2,
        durationMinutes: min2,
        trafficCondition: 'Moderate',
        isFastest: false,
      },
    ];
  }, [baseDistanceKm]);

  const activeRoute =
    alternatives.find((a) => a.id === selectedRouteId) || alternatives[0];

  // Route polyline waypoints connecting origin and destination
  const routePoints = useMemo(() => {
    return generateRoutePoints(originCoords, destinationCoords, 6);
  }, [originCoords, destinationCoords]);

  // Markers for origin & destination
  const mapMarkers = useMemo<MapMarkerItem[]>(() => {
    return [
      {
        id: 'origin-marker',
        lat: originCoords.lat,
        lng: originCoords.lng,
        title: originLabel,
        type: 'user',
      },
      {
        id: 'dest-marker',
        lat: destinationCoords.lat,
        lng: destinationCoords.lng,
        title: doctor?.name || 'Clinic Destination',
        type: 'doctor',
        data: doctor,
      },
    ];
  }, [originCoords, destinationCoords, originLabel, doctor]);

  // Map center halfway between origin and destination
  const mapCenter = useMemo(() => {
    return {
      lat: (originCoords.lat + destinationCoords.lat) / 2,
      lng: (originCoords.lng + destinationCoords.lng) / 2,
    };
  }, [originCoords, destinationCoords]);

  if (!doctor) {
    return (
      <div className="p-8 text-center bg-[#F6F8FA] min-h-screen">
        <p className="text-sm font-bold text-slate-700">Doctor details not found.</p>
        <button
          onClick={goBack}
          className="mt-3 py-2 px-4 bg-teal-600 text-white rounded-xl text-xs font-bold"
        >
          Return to Doctor Discovery
        </button>
      </div>
    );
  }

  const activeDuration =
    travelMode === 'walking'
      ? Math.round(activeRoute.distanceKm * 12)
      : activeRoute.durationMinutes;

  return (
    <div className="min-h-full pb-20 bg-[#F6F8FA] flex flex-col">
      {/* Sticky Header */}
      <div className="bg-white border-b border-slate-100 p-4 sticky top-0 z-30 shadow-2xs flex items-center justify-between">
        <button
          onClick={goBack}
          className="flex items-center gap-1 text-slate-500 hover:text-slate-800 text-xs font-semibold"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Doctors</span>
        </button>

        <div className="text-center max-w-[200px]">
          <h2 className="font-extrabold text-xs text-[#172B4D] truncate">
            Directions to {doctor.name}
          </h2>
          <p className="text-[10px] text-teal-700 font-bold truncate">
            {doctor.hospitalName} • OPD 03
          </p>
        </div>

        <button
          onClick={() =>
            navigateTo('book-appointment', { selectedDoctorId: doctor.id, doctor })
          }
          className="py-1 px-2.5 bg-[#087E8B] hover:bg-[#06626D] text-white rounded-xl font-bold text-xs shadow-2xs"
        >
          Book OPD
        </button>
      </div>

      {/* Starting Location Bar if no GPS */}
      {!liveCoordinates && (
        <div className="p-3 bg-amber-50 border-b border-amber-200 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-900">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span className="text-[11px] leading-tight">
              Using <strong>{originLabel}</strong> as starting point.
            </span>
          </div>

          <button
            onClick={detectLiveLocation}
            className="text-[10px] font-bold text-amber-800 bg-white px-2 py-1 rounded-lg border border-amber-200 shadow-2xs flex items-center gap-1 flex-shrink-0 hover:bg-amber-100"
          >
            <Crosshair className={`w-3 h-3 ${isDetectingLocation ? 'animate-spin' : ''}`} />
            <span>Enable GPS</span>
          </button>
        </div>
      )}

      {/* Interactive Route Map Container */}
      <div className="h-72 w-full relative border-b border-slate-200">
        <DoctorMap
          center={mapCenter}
          zoom={13}
          markers={mapMarkers}
          routePoints={routePoints}
          userLocation={originCoords}
          height="100%"
          showSearchAreaBtn={false}
        />

        {/* Floating Route Distance/ETA Badge */}
        <div className="absolute bottom-3 left-3 z-30 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-2xl shadow-md border border-teal-200 flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-black text-[#172B4D]">
            <Clock className="w-3.5 h-3.5 text-teal-600" />
            <span>
              {activeDuration > 60
                ? `${Math.floor(activeDuration / 60)}h ${activeDuration % 60}m`
                : `${activeDuration} mins`}
            </span>
          </div>
          <span className="text-slate-300">•</span>
          <span className="text-xs font-bold text-teal-700">
            {activeRoute.distanceKm.toFixed(1)} km
          </span>
        </div>
      </div>

      {/* Route & Navigation Content */}
      <div className="p-4 space-y-4 flex-1">
        {/* Route Preview with Driving vs Walking & Alternatives */}
        <RoutePreview
          mode={travelMode}
          onChangeMode={setTravelMode}
          selectedRouteId={selectedRouteId}
          onSelectRoute={setSelectedRouteId}
          alternatives={alternatives}
        />

        {/* Turn-by-Turn Guidance Panel */}
        <DirectionsPanel
          doctor={doctor}
          originLabel={originLabel}
          destinationLabel={`${doctor.hospitalName} (${doctor.clinicArea})`}
          distanceKm={activeRoute.distanceKm}
          durationMinutes={activeDuration}
          mode={travelMode}
        />

        {/* Google Maps External Navigation Launcher */}
        <NavigationLauncher
          destination={{
            lat: destinationCoords.lat,
            lng: destinationCoords.lng,
            name: `${doctor.name} - ${doctor.hospitalName}`,
            address: doctor.fullClinicAddress,
          }}
          origin={originCoords}
          mode={travelMode}
          onReturnToApp={goBack}
        />
      </div>
    </div>
  );
};
