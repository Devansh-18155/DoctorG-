import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X,
  Navigation,
  MapPin,
  Clock,
  Compass,
  ArrowUp,
  ArrowUpRight,
  ArrowUpLeft,
  CornerUpRight,
  CornerUpLeft,
  RotateCcw,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Volume2,
  ChevronRight,
  ChevronDown,
  Layers,
  Crosshair,
} from 'lucide-react';
import { DoctorMap, MapCoordinates, MapMarkerItem } from '../doctor/DoctorMap';
import {
  TravelMode,
  RouteResult,
  NavigationStep,
  getLiveRoadRoute,
  resolveFacilityCoordinates,
  isOffRoute,
  calculateMultiModalTravelTimes,
} from '../../services/routingService';
import { useApp } from '../../context/AppContext';

export interface NavigationTarget {
  id: string;
  name: string;
  specialty?: string;
  type?: string;
  address?: string;
  city?: string;
  area?: string;
  latitude?: number;
  longitude?: number;
  coordinates?: { lat: number; lng: number } | [number, number];
  hospitalId?: string;
  hospitalName?: string;
  phone?: string;
  imageUrl?: string;
}

interface LiveRouteNavigationModalProps {
  isOpen: boolean;
  onClose: () => void;
  target: NavigationTarget | null;
}

export const LiveRouteNavigationModal: React.FC<LiveRouteNavigationModalProps> = ({
  isOpen,
  onClose,
  target,
}) => {
  const { liveCoordinates, currentCity, currentArea, showToast, detectLiveLocation } = useApp();

  const [mode, setMode] = useState<TravelMode>('car');
  const [route, setRoute] = useState<RouteResult | null>(null);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showStepList, setShowStepList] = useState(false);
  const [isRecalculating, setIsRecalculating] = useState(false);

  // Live Position tracking
  const [currentNavPos, setCurrentNavPos] = useState<MapCoordinates | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const watchIdRef = useRef<number | null>(null);
  const simIntervalRef = useRef<any>(null);

  // Determine user start coordinates
  const userStartCoords: MapCoordinates = React.useMemo(() => {
    if (liveCoordinates && liveCoordinates.latitude && liveCoordinates.longitude) {
      return { lat: liveCoordinates.latitude, lng: liveCoordinates.longitude };
    }
    // Fallback based on city/area or default
    return { lat: 22.5802, lng: 88.4357 };
  }, [liveCoordinates]);

  // Destination coordinates
  const destCoords: MapCoordinates = React.useMemo(() => {
    if (!target) return { lat: 22.5697, lng: 88.4055 };
    return resolveFacilityCoordinates(target);
  }, [target]);

  // Fetch / Calculate Route
  const fetchRoute = useCallback(
    async (start: MapCoordinates, dest: MapCoordinates, travelMode: TravelMode) => {
      if (!target) return;
      setIsLoadingRoute(true);
      try {
        const res = await getLiveRoadRoute(start, dest, travelMode, target.name);
        setRoute(res);
        setCurrentStepIndex(0);
      } catch (e) {
        console.error('Route error:', e);
      } finally {
        setIsLoadingRoute(false);
      }
    },
    [target]
  );

  // Initial load on open or mode switch
  useEffect(() => {
    if (isOpen && target) {
      const start = currentNavPos || userStartCoords;
      fetchRoute(start, destCoords, mode);
    }
  }, [isOpen, target, mode, fetchRoute]);

  // Clean up navigation listeners on close or unmount
  useEffect(() => {
    return () => {
      stopNavigation();
    };
  }, []);

  const stopNavigation = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation?.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (simIntervalRef.current) {
      clearInterval(simIntervalRef.current);
      simIntervalRef.current = null;
    }
    setIsNavigating(false);
  };

  // Start Live GPS Navigation
  const handleStartNavigation = () => {
    setIsNavigating(true);
    showToast(`🚗 Live Navigation started to ${target?.name}`, 'success');

    const start = userStartCoords;
    setCurrentNavPos(start);

    // 1. Try real device GPS watchPosition
    if (navigator.geolocation) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          const newPos: MapCoordinates = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setCurrentNavPos(newPos);

          // Check for off-route deviation (>80m)
          if (route && isOffRoute(newPos, route.points)) {
            setIsRecalculating(true);
            showToast('⚠️ Off route. Recalculating path...', 'info');
            fetchRoute(newPos, destCoords, mode).finally(() => {
              setIsRecalculating(false);
            });
          }
        },
        (err) => {
          console.warn('Geolocation watch error (using simulated progression):', err.message);
        },
        { enableHighAccuracy: true, maximumAge: 3000, timeout: 10000 }
      );
    }

    // 2. Continuous progression along route waypoints for desktop/testing
    if (route && route.points.length > 1) {
      let ptIndex = 0;
      simIntervalRef.current = setInterval(() => {
        ptIndex++;
        if (ptIndex < route.points.length) {
          const nextPt = route.points[ptIndex];
          setCurrentNavPos(nextPt);

          // Progress turn steps as user advances
          const stepAdvancement = Math.floor((ptIndex / route.points.length) * route.steps.length);
          setCurrentStepIndex(Math.min(stepAdvancement, route.steps.length - 1));
        } else {
          // Arrived!
          showToast(`📍 Arrived at ${target?.name}!`, 'success');
          stopNavigation();
        }
      }, 3000);
    }
  };

  if (!isOpen || !target) return null;

  // Build markers
  const markers: MapMarkerItem[] = [
    {
      id: 'origin-user',
      lat: (currentNavPos || userStartCoords).lat,
      lng: (currentNavPos || userStartCoords).lng,
      title: 'Your Location',
      subtitle: `${currentArea || 'Current Spot'}, ${currentCity || ''}`,
      type: 'user',
    },
    {
      id: `dest-${target.id}`,
      lat: destCoords.lat,
      lng: destCoords.lng,
      title: target.name,
      subtitle: target.address || target.specialty || 'Destination',
      type: target.type === 'Private' || target.type === 'Government' ? 'hospital' : 'doctor',
      data: target,
    },
  ];

  // Map center: center on current user pos if navigating, else midpoint
  const mapCenter: MapCoordinates = isNavigating && currentNavPos
    ? currentNavPos
    : {
        lat: ((currentNavPos || userStartCoords).lat + destCoords.lat) / 2,
        lng: ((currentNavPos || userStartCoords).lng + destCoords.lng) / 2,
      };

  const travelMulti = calculateMultiModalTravelTimes(route?.distanceKm || 4.2);
  const currentStep: NavigationStep | undefined = route?.steps[currentStepIndex];

  // Turn icon renderer
  const renderTurnIcon = (iconName?: NavigationStep['icon']) => {
    switch (iconName) {
      case 'turn-right':
        return <CornerUpRight className="w-6 h-6 text-white stroke-[3]" />;
      case 'turn-left':
        return <CornerUpLeft className="w-6 h-6 text-white stroke-[3]" />;
      case 'slight-right':
        return <ArrowUpRight className="w-6 h-6 text-white stroke-[3]" />;
      case 'slight-left':
        return <ArrowUpLeft className="w-6 h-6 text-white stroke-[3]" />;
      case 'u-turn':
        return <RotateCcw className="w-6 h-6 text-white stroke-[3]" />;
      case 'arrive':
        return <CheckCircle2 className="w-6 h-6 text-emerald-300 stroke-[3]" />;
      default:
        return <ArrowUp className="w-6 h-6 text-white stroke-[3]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full h-full sm:h-[92vh] max-w-xl bg-white sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Top Header Bar */}
        <div className="bg-[#102B55] text-white p-3.5 px-4 flex items-center justify-between z-30 shadow-md">
          <div className="flex items-center gap-2 min-w-0">
            <span className="p-1.5 rounded-xl bg-white/10 text-amber-300 flex-shrink-0">
              <Navigation className="w-4 h-4" />
            </span>
            <div className="min-w-0">
              <h3 className="font-black text-sm text-white truncate">{target.name}</h3>
              <p className="text-[11px] text-slate-300 truncate">
                {target.address || target.specialty || target.hospitalName || 'Doctor G Medical Route'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            {/* Native Google Maps Navigation link */}
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${destCoords.lat},${destCoords.lng}&travelmode=${
                mode === 'bike' ? 'two-wheeler' : mode === 'walking' ? 'walking' : 'driving'
              }`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 px-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-slate-200 flex items-center gap-1 transition-all"
              title="Open turn-by-turn navigation in Google Maps App"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Google Maps</span>
            </a>

            <button
              onClick={() => {
                stopNavigation();
                onClose();
              }}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Navigation HUD Turn-by-Turn Banner (When actively navigating) */}
        {isNavigating && (
          <div className="bg-[#087E8B] text-white p-3 px-4 z-30 shadow-lg flex items-center justify-between gap-3 animate-in slide-in-from-top-2">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center flex-shrink-0">
                {renderTurnIcon(currentStep?.icon)}
              </div>
              <div className="min-w-0">
                <span className="text-[11px] uppercase tracking-wider text-teal-200 font-extrabold block">
                  {currentStepIndex === (route?.steps.length || 1) - 1
                    ? 'Arriving'
                    : `In ${currentStep?.distanceMeters || 200}m`}
                </span>
                <h4 className="font-black text-sm text-white truncate">
                  {currentStep?.instruction || 'Follow highlighted road path'}
                </h4>
                <p className="text-[11px] text-teal-100 truncate">{currentStep?.roadName}</p>
              </div>
            </div>

            {isRecalculating && (
              <span className="px-2 py-1 rounded-full bg-amber-400 text-[#102B55] text-[10px] font-black animate-pulse flex-shrink-0">
                Recalculating...
              </span>
            )}
          </div>
        )}

        {/* Travel Mode Selector: Car | Bike | Walking (When previewing route) */}
        {!isNavigating && (
          <div className="bg-slate-50 border-b border-slate-200 p-2.5 px-4 flex items-center justify-between z-20 gap-2">
            <div className="flex items-center gap-1.5 bg-slate-200/70 p-1 rounded-2xl">
              <button
                type="button"
                onClick={() => setMode('car')}
                className={`py-1 px-3 rounded-xl font-black text-xs transition-all flex items-center gap-1 cursor-pointer ${
                  mode === 'car'
                    ? 'bg-[#FFB800] text-[#102B55] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>🚗</span>
                <span>Car ({travelMulti.car.timeStr})</span>
              </button>

              <button
                type="button"
                onClick={() => setMode('bike')}
                className={`py-1 px-3 rounded-xl font-black text-xs transition-all flex items-center gap-1 cursor-pointer ${
                  mode === 'bike'
                    ? 'bg-[#FFB800] text-[#102B55] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>🏍️</span>
                <span>Bike ({travelMulti.bike.timeStr})</span>
              </button>

              <button
                type="button"
                onClick={() => setMode('walking')}
                className={`py-1 px-3 rounded-xl font-black text-xs transition-all flex items-center gap-1 cursor-pointer ${
                  mode === 'walking'
                    ? 'bg-[#FFB800] text-[#102B55] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>🚶</span>
                <span>Walk ({travelMulti.walking.timeStr})</span>
              </button>
            </div>

            <button
              onClick={() => detectLiveLocation()}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-[#087E8B] shadow-2xs transition-colors cursor-pointer"
              title="Locate my real GPS location"
            >
              <Crosshair className="w-4 h-4 text-[#087E8B]" />
            </button>
          </div>
        )}

        {/* Interactive OpenStreetMap Canvas/Tile Component */}
        <div className="flex-1 relative overflow-hidden bg-slate-100">
          <DoctorMap
            center={mapCenter}
            zoom={isNavigating ? 15 : 13}
            markers={markers}
            userLocation={currentNavPos || userStartCoords}
            routePoints={route?.points || []}
            height="100%"
            showSearchAreaBtn={false}
          />

          {/* Loading Route Indicator */}
          {isLoadingRoute && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/95 px-3 py-1.5 rounded-full border border-slate-200 shadow-md text-xs font-bold text-slate-700 flex items-center gap-2 z-30">
              <div className="w-3.5 h-3.5 border-2 border-[#087E8B] border-t-transparent rounded-full animate-spin"></div>
              <span>Drawing real road route...</span>
            </div>
          )}
        </div>

        {/* Bottom Navigation Control Bar */}
        <div className="bg-white border-t border-slate-200 p-4 z-30 shadow-lg space-y-3">
          {/* Quick Metrics Bar: Distance, Time, ETA */}
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#172B4D] tracking-tight">
                {route?.durationStr || travelMulti[mode].timeStr}
              </span>
              <span className="text-xs font-bold text-slate-500">
                ({route?.distanceStr || travelMulti.distanceStr})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1">
                <Clock className="w-3 h-3 text-emerald-700" />
                <span>ETA: {route?.etaStr || 'Calculated'}</span>
              </span>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-2">
            {!isNavigating ? (
              <>
                <button
                  type="button"
                  onClick={handleStartNavigation}
                  className="flex-1 py-3 bg-[#087E8B] hover:bg-[#06626D] text-white rounded-2xl font-black text-sm shadow-md shadow-teal-700/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer"
                >
                  <Navigation className="w-4 h-4 stroke-[3]" />
                  <span>Start Live Navigation</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowStepList(!showStepList)}
                  className="py-3 px-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="View turn-by-turn directions"
                >
                  <span>Steps</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showStepList ? 'rotate-180' : ''}`} />
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={stopNavigation}
                  className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                  <span>Exit Navigation</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (currentNavPos) {
                      showToast('📍 Centered on your live GPS position', 'info');
                    }
                  }}
                  className="py-3 px-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Crosshair className="w-4 h-4 text-[#087E8B]" />
                  <span>Recenter</span>
                </button>
              </>
            )}
          </div>

          {/* Expandable Turn-by-Turn Steps List */}
          {showStepList && route && route.steps && route.steps.length > 0 && (
            <div className="pt-2 border-t border-slate-100 max-h-48 overflow-y-auto space-y-2 pr-1 divide-y divide-slate-100 animate-in fade-in">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block mb-1">
                Turn-by-Turn Road Directions ({route.steps.length} steps)
              </span>
              {route.steps.map((st, i) => (
                <div key={st.id} className="pt-2 flex items-start gap-2.5 text-xs">
                  <div className="w-6 h-6 rounded-lg bg-teal-50 border border-teal-200 text-[#087E8B] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[10px] font-black">{i + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#172B4D]">{st.instruction}</p>
                    <p className="text-[10px] text-slate-400 font-medium">
                      {st.roadName} • {st.distanceMeters}m
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
