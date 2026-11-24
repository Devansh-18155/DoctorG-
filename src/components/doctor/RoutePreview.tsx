import React from 'react';
import {
  Car,
  Footprints,
  Clock,
  Compass,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export interface RouteAlternative {
  id: string;
  name: string;
  distanceKm: number;
  durationMinutes: number;
  trafficCondition: 'Clear' | 'Moderate' | 'Heavy';
  isFastest: boolean;
}

interface RoutePreviewProps {
  mode: 'driving' | 'walking';
  onChangeMode: (mode: 'driving' | 'walking') => void;
  selectedRouteId: string;
  onSelectRoute: (id: string) => void;
  alternatives: RouteAlternative[];
}

export const RoutePreview: React.FC<RoutePreviewProps> = ({
  mode,
  onChangeMode,
  selectedRouteId,
  onSelectRoute,
  alternatives,
}) => {
  return (
    <div className="space-y-3">
      {/* Mode Switcher: Driving vs Walking */}
      <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
        <button
          onClick={() => onChangeMode('driving')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all ${
            mode === 'driving'
              ? 'bg-white text-[#087E8B] shadow-xs'
              : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          <Car className="w-4 h-4" />
          <span>Drive / Cab</span>
        </button>

        <button
          onClick={() => onChangeMode('walking')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all ${
            mode === 'walking'
              ? 'bg-white text-[#087E8B] shadow-xs'
              : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          <Footprints className="w-4 h-4" />
          <span>Walk</span>
        </button>
      </div>

      {/* Route Alternatives */}
      <div className="space-y-2">
        {alternatives.map((alt) => {
          const isSelected = alt.id === selectedRouteId;
          const adjustedDuration =
            mode === 'walking' ? Math.round(alt.distanceKm * 12) : alt.durationMinutes;

          return (
            <div
              key={alt.id}
              onClick={() => onSelectRoute(alt.id)}
              className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-teal-50/70 border-teal-400 ring-2 ring-teal-100 shadow-2xs'
                  : 'bg-white border-slate-200 hover:border-teal-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      isSelected ? 'bg-[#087E8B]' : 'bg-slate-300'
                    }`}
                  ></div>
                  <h4 className="font-extrabold text-xs text-[#172B4D]">{alt.name}</h4>
                  {alt.isFastest && (
                    <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold flex items-center gap-0.5">
                      <Zap className="w-2.5 h-2.5 fill-emerald-600" />
                      Fastest
                    </span>
                  )}
                </div>

                <div className="text-right">
                  <span className="font-extrabold text-sm text-[#172B4D]">
                    {adjustedDuration > 60
                      ? `${Math.floor(adjustedDuration / 60)}h ${adjustedDuration % 60}m`
                      : `${adjustedDuration} min`}
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    {alt.distanceKm.toFixed(1)} km
                  </span>
                </div>
              </div>

              <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-500 pl-4.5">
                <span>Traffic: <strong className={alt.trafficCondition === 'Clear' ? 'text-emerald-600' : 'text-amber-600'}>{alt.trafficCondition}</strong></span>
                <span>•</span>
                <span>Smooth Hospital Corridor</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
