import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  Plus,
  Minus,
  Navigation,
  Compass,
  MapPin,
  Crosshair,
  RotateCcw,
  Layers,
  ChevronRight,
  Clock,
  Star,
  CheckCircle2,
  Calendar,
  DollarSign,
  Building2,
  X,
  Phone,
  ArrowUpRight,
} from 'lucide-react';
import { EnrichedDoctor } from '../../utils/doctorDiscoveryHelper';

export interface MapCoordinates {
  lat: number;
  lng: number;
}

export interface MapMarkerItem {
  id: string;
  lat: number;
  lng: number;
  title: string;
  subtitle?: string;
  type: 'doctor' | 'hospital' | 'user' | 'pin';
  data?: EnrichedDoctor | any;
}

interface DoctorMapProps {
  center: MapCoordinates;
  zoom?: number;
  markers?: MapMarkerItem[];
  selectedDoctor?: EnrichedDoctor | null;
  onSelectDoctor?: (doc: EnrichedDoctor | null) => void;
  userLocation?: MapCoordinates | null;
  onRequestUserLocation?: () => void;
  routePoints?: MapCoordinates[];
  isPickerMode?: boolean;
  pickerCoordinates?: MapCoordinates | null;
  onPickerChange?: (coords: MapCoordinates) => void;
  onBookAppointment?: (doc: EnrichedDoctor) => void;
  onGetDirections?: (doc: EnrichedDoctor) => void;
  onViewProfile?: (doc: EnrichedDoctor) => void;
  height?: string | number;
  showSearchAreaBtn?: boolean;
  onSearchThisArea?: (center: MapCoordinates) => void;
  radiusKm?: number;
  radiusCenter?: MapCoordinates | null;
}

// Web Mercator projections
function latLngToWorldPixel(lat: number, lng: number, zoom: number): { x: number; y: number } {
  const n = Math.pow(2, zoom);
  const x = ((lng + 180) / 360) * n * 256;
  const latRad = (lat * Math.PI) / 180;
  const y = ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n * 256;
  return { x, y };
}

function worldPixelToLatLng(x: number, y: number, zoom: number): { lat: number; lng: number } {
  const n = Math.pow(2, zoom);
  const lng = (x / (n * 256)) * 360 - 180;
  const latRad = Math.atan(Math.sinh(Math.PI * (1 - (2 * y) / (n * 256))));
  const lat = (latRad * 180) / Math.PI;
  return { lat, lng };
}

export const DoctorMap: React.FC<DoctorMapProps> = ({
  center,
  zoom = 13,
  markers = [],
  selectedDoctor = null,
  onSelectDoctor,
  userLocation,
  onRequestUserLocation,
  routePoints = [],
  isPickerMode = false,
  pickerCoordinates,
  onPickerChange,
  onBookAppointment,
  onGetDirections,
  onViewProfile,
  height = '100%',
  showSearchAreaBtn = true,
  onSearchThisArea,
  radiusKm,
  radiusCenter,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mapCenter, setMapCenter] = useState<MapCoordinates>(center);
  const [mapZoom, setMapZoom] = useState<number>(zoom);
  const [containerSize, setContainerSize] = useState<{ width: number; height: number }>({
    width: 400,
    height: 500,
  });

  // Pan dragging state
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hasMovedFromCenter, setHasMovedFromCenter] = useState(false);
  const [tileLayer, setTileLayer] = useState<'voyager' | 'standard'>('voyager');

  // Sync external center/zoom
  useEffect(() => {
    setMapCenter(center);
    setHasMovedFromCenter(false);
  }, [center.lat, center.lng]);

  useEffect(() => {
    if (zoom) setMapZoom(zoom);
  }, [zoom]);

  // If a doctor is selected, smooth center on it
  useEffect(() => {
    if (selectedDoctor && selectedDoctor.lat && selectedDoctor.lng) {
      setMapCenter({ lat: selectedDoctor.lat, lng: selectedDoctor.lng });
    }
  }, [selectedDoctor?.id]);

  // Measure container size
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.clientWidth || 400,
          height: containerRef.current.clientHeight || 500,
        });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Compute active tiles
  const tiles = useMemo(() => {
    const { width, height } = containerSize;
    const centerPixel = latLngToWorldPixel(mapCenter.lat, mapCenter.lng, mapZoom);
    const topLeftX = centerPixel.x - width / 2;
    const topLeftY = centerPixel.y - height / 2;

    const minTileX = Math.floor(topLeftX / 256);
    const maxTileX = Math.floor((topLeftX + width) / 256);
    const minTileY = Math.floor(topLeftY / 256);
    const maxTileY = Math.floor((topLeftY + height) / 256);

    const maxTilesAtZoom = Math.pow(2, mapZoom);
    const result: Array<{ key: string; x: number; y: number; z: number; left: number; top: number; url: string }> = [];

    for (let ty = minTileY; ty <= maxTileY; ty++) {
      if (ty < 0 || ty >= maxTilesAtZoom) continue;
      for (let tx = minTileX; tx <= maxTileX; tx++) {
        const wrappedTx = ((tx % maxTilesAtZoom) + maxTilesAtZoom) % maxTilesAtZoom;
        const left = tx * 256 - topLeftX;
        const top = ty * 256 - topLeftY;

        const subdomains = ['a', 'b', 'c', 'd'];
        const s = subdomains[Math.abs(wrappedTx + ty) % subdomains.length];
        const url =
          tileLayer === 'voyager'
            ? `https://${s}.basemaps.cartocdn.com/rastertiles/voyager/${mapZoom}/${wrappedTx}/${ty}.png`
            : `https://tile.openstreetmap.org/${mapZoom}/${wrappedTx}/${ty}.png`;

        result.push({
          key: `${mapZoom}-${wrappedTx}-${ty}`,
          x: wrappedTx,
          y: ty,
          z: mapZoom,
          left,
          top,
          url,
        });
      }
    }
    return result;
  }, [mapCenter.lat, mapCenter.lng, mapZoom, containerSize.width, containerSize.height, tileLayer]);

  // Convert (lat, lng) to pixel coords relative to container
  const getScreenPos = useCallback(
    (lat: number, lng: number) => {
      const centerPixel = latLngToWorldPixel(mapCenter.lat, mapCenter.lng, mapZoom);
      const targetPixel = latLngToWorldPixel(lat, lng, mapZoom);
      return {
        x: targetPixel.x - (centerPixel.x - containerSize.width / 2),
        y: targetPixel.y - (centerPixel.y - containerSize.height / 2),
      };
    },
    [mapCenter.lat, mapCenter.lng, mapZoom, containerSize.width, containerSize.height]
  );

  // Mouse Drag Panning Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only drag with primary mouse button
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
      setHasMovedFromCenter(true);
      const centerPixel = latLngToWorldPixel(mapCenter.lat, mapCenter.lng, mapZoom);
      const newCenterPixel = { x: centerPixel.x - dx, y: centerPixel.y - dy };
      const newLatLng = worldPixelToLatLng(newCenterPixel.x, newCenterPixel.y, mapZoom);
      setMapCenter(newLatLng);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch Drag Panning Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - dragStart.x;
    const dy = e.touches[0].clientY - dragStart.y;
    if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
      setHasMovedFromCenter(true);
      const centerPixel = latLngToWorldPixel(mapCenter.lat, mapCenter.lng, mapZoom);
      const newCenterPixel = { x: centerPixel.x - dx, y: centerPixel.y - dy };
      const newLatLng = worldPixelToLatLng(newCenterPixel.x, newCenterPixel.y, mapZoom);
      setMapCenter(newLatLng);
      setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Click on map in Picker mode to adjust coordinates
  const handleMapClick = (e: React.MouseEvent) => {
    if (isDragging) return;
    if (isPickerMode && onPickerChange && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      const centerPixel = latLngToWorldPixel(mapCenter.lat, mapCenter.lng, mapZoom);
      const targetWorldX = centerPixel.x - containerSize.width / 2 + clickX;
      const targetWorldY = centerPixel.y - containerSize.height / 2 + clickY;
      const clickedCoords = worldPixelToLatLng(targetWorldX, targetWorldY, mapZoom);
      onPickerChange(clickedCoords);
    }
  };

  // Zoom controls
  const handleZoomIn = () => setMapZoom((z) => Math.min(18, z + 1));
  const handleZoomOut = () => setMapZoom((z) => Math.max(5, z - 1));

  const handleRecenter = () => {
    setMapCenter(center);
    setHasMovedFromCenter(false);
  };

  // Compute SVG polyline string for route
  const routeSvgPoints = useMemo(() => {
    if (!routePoints || routePoints.length < 2) return '';
    return routePoints
      .map((p) => {
        const pos = getScreenPos(p.lat, p.lng);
        return `${pos.x},${pos.y}`;
      })
      .join(' ');
  }, [routePoints, getScreenPos]);

  return (
    <div
      ref={containerRef}
      style={{ height }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={handleMapClick}
      className="relative w-full overflow-hidden select-none cursor-grab active:cursor-grabbing bg-[#EAF2F5]"
    >
      {/* Tile Container Layer */}
      <div className="absolute inset-0 pointer-events-none">
        {tiles.map((t) => (
          <img
            key={t.key}
            src={t.url}
            alt=""
            loading="lazy"
            decoding="async"
            style={{
              position: 'absolute',
              left: `${t.left}px`,
              top: `${t.top}px`,
              width: '256px',
              height: '256px',
            }}
            className="transition-opacity duration-150"
            onError={(e) => {
              // Graceful fallback to standard OSM if carto is blocked
              (e.currentTarget as HTMLImageElement).src = `https://tile.openstreetmap.org/${t.z}/${t.x}/${t.y}.png`;
            }}
          />
        ))}
      </div>

      {/* SVG Radius Circle & Route Line Layer */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
        {radiusKm && radiusKm > 0 && (
          (() => {
            const targetCenter = radiusCenter || mapCenter;
            const pos = getScreenPos(targetCenter.lat, targetCenter.lng);
            const metersPerPixel =
              (156543.03392 * Math.cos((targetCenter.lat * Math.PI) / 180)) / Math.pow(2, mapZoom);
            const rPx = Math.max(6, (radiusKm * 1000) / metersPerPixel);
            return (
              <g>
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={rPx}
                  fill="rgba(8, 126, 139, 0.08)"
                  stroke="#087E8B"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                />
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={rPx}
                  fill="none"
                  stroke="rgba(8, 126, 139, 0.25)"
                  strokeWidth="6"
                />
              </g>
            );
          })()
        )}

        {routeSvgPoints && (
          <>
            <polyline
              points={routeSvgPoints}
              fill="none"
              stroke="#087E8B"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="filter drop-shadow-sm opacity-90"
            />
            <polyline
              points={routeSvgPoints}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeDasharray="6 4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-95"
            />
          </>
        )}
      </svg>

      {/* Map Markers Layer */}
      <div className="absolute inset-0 pointer-events-none z-20">
        {/* User Location Pulse Marker */}
        {userLocation && (
          (() => {
            const pos = getScreenPos(userLocation.lat, userLocation.lng);
            return (
              <div
                style={{
                  position: 'absolute',
                  left: `${pos.x}px`,
                  top: `${pos.y}px`,
                  transform: 'translate(-50%, -50%)',
                }}
                className="pointer-events-auto flex items-center justify-center group"
              >
                <div className="w-8 h-8 rounded-full bg-blue-500/20 animate-ping absolute"></div>
                <div className="w-5 h-5 rounded-full bg-blue-600 border-2 border-white shadow-md flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                </div>
                <span className="hidden group-hover:block absolute top-6 bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded shadow whitespace-nowrap">
                  Your Location
                </span>
              </div>
            );
          })()
        )}

        {/* Doctor & Clinic Markers */}
        {markers.map((marker) => {
          const pos = getScreenPos(marker.lat, marker.lng);
          const isSelected = selectedDoctor?.id === marker.data?.id;

          // Hide markers that are far off screen
          if (
            pos.x < -60 ||
            pos.x > containerSize.width + 60 ||
            pos.y < -60 ||
            pos.y > containerSize.height + 60
          ) {
            return null;
          }

          if (marker.type === 'hospital') {
            return (
              <div
                key={marker.id}
                style={{
                  position: 'absolute',
                  left: `${pos.x}px`,
                  top: `${pos.y}px`,
                  transform: 'translate(-50%, -100%)',
                }}
                className="pointer-events-auto cursor-pointer group"
                onClick={(e) => {
                  e.stopPropagation();
                  if (marker.data) onSelectDoctor?.(marker.data);
                }}
              >
                <div className="px-2 py-1 bg-white border border-slate-300 rounded-lg shadow-sm flex items-center gap-1 text-[10px] font-bold text-slate-800 hover:border-teal-600 transition-colors">
                  <Building2 className="w-3 h-3 text-teal-700" />
                  <span className="max-w-[100px] truncate">{marker.title}</span>
                </div>
              </div>
            );
          }

          // Doctor Marker Pin
          return (
            <div
              key={marker.id}
              style={{
                position: 'absolute',
                left: `${pos.x}px`,
                top: `${pos.y}px`,
                transform: 'translate(-50%, -100%)',
                zIndex: isSelected ? 40 : 25,
              }}
              className="pointer-events-auto cursor-pointer group transition-transform duration-200 hover:scale-110"
              onClick={(e) => {
                e.stopPropagation();
                if (marker.data) {
                  onSelectDoctor?.(marker.data);
                }
              }}
            >
              {isSelected && (
                <div className="absolute -inset-2 rounded-full bg-teal-400/40 animate-ping"></div>
              )}

              <div
                className={`relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl shadow-md transition-all ${
                  isSelected
                    ? 'bg-[#087E8B] text-white ring-4 ring-teal-200 font-extrabold scale-105'
                    : 'bg-white text-[#172B4D] border border-teal-200/90 font-bold hover:border-[#087E8B]'
                }`}
              >
                {/* Doctor Avatar or Stethoscope icon */}
                {marker.data?.imageUrl ? (
                  <img
                    src={marker.data.imageUrl}
                    alt=""
                    className="w-5 h-5 rounded-full object-cover border border-white"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-[10px] font-bold">
                    Dr
                  </div>
                )}

                <div className="flex flex-col text-left leading-tight">
                  <span className="text-[11px] truncate max-w-[120px]">
                    {marker.title.replace('Dr. ', '')}
                  </span>
                  <span
                    className={`text-[9px] font-semibold ${
                      isSelected ? 'text-teal-100' : 'text-teal-700'
                    }`}
                  >
                    ₹{marker.data?.consultationFee || 600}
                  </span>
                </div>

                {/* Marker pointer triangle */}
                <div
                  className={`absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent ${
                    isSelected ? 'border-t-[8px] border-t-[#087E8B]' : 'border-t-[8px] border-t-white'
                  }`}
                ></div>
              </div>
            </div>
          );
        })}

        {/* Picker Mode Draggable Pin */}
        {isPickerMode && pickerCoordinates && (
          (() => {
            const pos = getScreenPos(pickerCoordinates.lat, pickerCoordinates.lng);
            return (
              <div
                style={{
                  position: 'absolute',
                  left: `${pos.x}px`,
                  top: `${pos.y}px`,
                  transform: 'translate(-50%, -100%)',
                  zIndex: 50,
                }}
                className="pointer-events-auto cursor-grab active:cursor-grabbing flex flex-col items-center animate-bounce"
              >
                <div className="px-2 py-0.5 bg-rose-600 text-white rounded text-[10px] font-bold shadow-md whitespace-nowrap mb-1">
                  Selected Clinic Pin
                </div>
                <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg border-2 border-white">
                  <MapPin className="w-5 h-5 fill-white text-rose-600" />
                </div>
                <div className="w-2 h-2 rounded-full bg-rose-900/60 mt-0.5"></div>
              </div>
            );
          })()
        )}
      </div>

      {/* Floating Map Controls Top-Right */}
      <div className="absolute top-3 right-3 z-30 flex flex-col gap-1.5 shadow-md rounded-2xl bg-white/95 backdrop-blur-xs p-1 border border-slate-200">
        <button
          onClick={handleZoomIn}
          title="Zoom In"
          className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          title="Zoom Out"
          className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
        >
          <Minus className="w-4 h-4" />
        </button>
        <div className="w-full h-px bg-slate-200 my-0.5"></div>
        <button
          onClick={handleRecenter}
          title="Recenter Map"
          className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
        >
          <Compass className="w-4 h-4" />
        </button>
        {onRequestUserLocation && (
          <button
            onClick={onRequestUserLocation}
            title="My Current Location"
            className="w-8 h-8 rounded-xl flex items-center justify-center text-[#087E8B] hover:bg-teal-50 transition-colors"
          >
            <Crosshair className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={() => setTileLayer((l) => (l === 'voyager' ? 'standard' : 'voyager'))}
          title="Toggle Tile Style"
          className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-500 hover:bg-teal-50 hover:text-teal-700 transition-colors text-[10px] font-bold"
        >
          <Layers className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* "Search this area" button if user panned away */}
      {showSearchAreaBtn && hasMovedFromCenter && onSearchThisArea && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30">
          <button
            onClick={() => {
              onSearchThisArea(mapCenter);
              setHasMovedFromCenter(false);
            }}
            className="px-3.5 py-1.5 bg-white/95 hover:bg-white text-teal-800 font-bold text-xs rounded-full shadow-lg border border-teal-200 flex items-center gap-1.5 transition-all animate-in fade-in"
          >
            <RotateCcw className="w-3.5 h-3.5 text-teal-600" />
            <span>Search This Area</span>
          </button>
        </div>
      )}

      {/* OpenStreetMap Attribution */}
      <div className="absolute bottom-1 right-2 z-20 text-[9px] text-slate-400 bg-white/80 px-1.5 py-0.5 rounded backdrop-blur-2xs pointer-events-none">
        © OpenStreetMap contributors • Doctor G GIS
      </div>

      {/* Selected Doctor Bottom Sheet Drawer */}
      {selectedDoctor && !isPickerMode && (
        <div className="absolute bottom-3 left-3 right-3 z-40 animate-in slide-in-from-bottom duration-200">
          <div className="bg-white rounded-3xl p-4 shadow-2xl border border-teal-200 relative">
            <button
              onClick={() => onSelectDoctor?.(null)}
              className="absolute top-3 right-3 w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            {/* Top row: Avatar & Doctor basic info */}
            <div className="flex items-start gap-3">
              <img
                src={selectedDoctor.imageUrl}
                alt={selectedDoctor.name}
                className="w-14 h-14 rounded-2xl object-cover border border-slate-100 flex-shrink-0"
              />
              <div className="flex-1 min-w-0 pr-6">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-extrabold text-xs text-[#172B4D] truncate">
                    {selectedDoctor.name}
                  </h4>
                  {selectedDoctor.verified && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
                  )}
                </div>
                <p className="text-[11px] font-semibold text-teal-700 truncate mt-0.5">
                  {selectedDoctor.specialty}
                </p>
                <p className="text-[10px] text-slate-500 truncate">{selectedDoctor.qualification}</p>
                <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-600">
                  <span className="flex items-center gap-0.5 font-bold text-amber-600">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    {selectedDoctor.rating} ({selectedDoctor.reviewCount})
                  </span>
                  <span>•</span>
                  <span>{selectedDoctor.experienceYears} yrs exp</span>
                </div>
              </div>
            </div>

            {/* Clinic Details */}
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1.5 text-slate-600 truncate max-w-[210px]">
                <Building2 className="w-3.5 h-3.5 text-teal-700 flex-shrink-0" />
                <span className="truncate">{selectedDoctor.hospitalName}</span>
              </div>
              <span className="font-extrabold text-[#172B4D]">₹{selectedDoctor.consultationFee}</span>
            </div>

            {/* Address & distance snippet */}
            <p className="text-[10px] text-slate-400 mt-1 truncate">
              {selectedDoctor.fullClinicAddress}
            </p>

            {/* Distance / ETA pill if calculated */}
            {selectedDoctor.distanceStr && (
              <div className="mt-2 py-1 px-2.5 bg-teal-50 text-teal-800 rounded-xl text-[10px] font-bold flex items-center justify-between">
                <span>Distance: {selectedDoctor.distanceStr}</span>
                <span>{selectedDoctor.driveTimeStr || '10 min drive'}</span>
              </div>
            )}

            {/* Actions: Get Directions, Book, Profile */}
            <div className="mt-3 grid grid-cols-3 gap-2">
              <button
                onClick={() => onViewProfile?.(selectedDoctor)}
                className="py-2.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors text-center truncate"
              >
                Profile
              </button>
              <button
                onClick={() => onGetDirections?.(selectedDoctor)}
                className="py-2.5 px-2 bg-teal-50 hover:bg-teal-100 text-[#087E8B] border border-teal-200 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1 truncate"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Directions</span>
              </button>
              <button
                onClick={() => onBookAppointment?.(selectedDoctor)}
                className="py-2.5 px-2 bg-[#087E8B] hover:bg-[#06626D] text-white rounded-xl text-xs font-bold transition-colors text-center truncate shadow-sm"
              >
                Book OPD
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
