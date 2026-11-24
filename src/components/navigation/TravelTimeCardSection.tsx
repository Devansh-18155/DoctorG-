import React from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { calculateMultiModalTravelTimes } from '../../services/routingService';

export interface TravelTimeCardSectionProps {
  distanceKm?: number;
  onViewRoute?: (e?: React.MouseEvent) => void;
  className?: string;
  buttonLabel?: string;
}

export const TravelTimeCardSection: React.FC<TravelTimeCardSectionProps> = ({
  distanceKm = 4.2,
  onViewRoute,
  className = '',
  buttonLabel = 'View Route',
}) => {
  const travel = calculateMultiModalTravelTimes(distanceKm);

  return (
    <div
      onClick={(e) => {
        // Prevent triggering parent card click if desired
        e.stopPropagation();
      }}
      className={`bg-slate-50/95 hover:bg-slate-100/90 border border-slate-200/80 rounded-2xl p-2.5 transition-all space-y-1.5 ${className}`}
    >
      {/* Top Row: Distance & Modes */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-[#087E8B] flex-shrink-0" />
          <span className="text-xs font-black text-[#172B4D] tracking-tight">
            {travel.distanceStr} away
          </span>
        </div>

        {/* View Route Button */}
        {onViewRoute && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onViewRoute(e);
            }}
            className="px-2.5 py-1 text-[11px] font-black bg-[#FFB800] hover:bg-[#F0AD00] text-[#102B55] border border-[#E6A600] rounded-xl flex items-center gap-1 transition-all shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer"
            title="View road route & live GPS navigation"
          >
            <Navigation className="w-3 h-3 stroke-[2.5]" />
            <span>{buttonLabel}</span>
          </button>
        )}
      </div>

      {/* Bottom Travel Times: Car · Bike · Walking */}
      <div className="flex items-center gap-1 text-[11px] text-slate-600 font-semibold flex-wrap">
        <span className="flex items-center gap-1 text-slate-700">
          <span>🚗</span>
          <span>{travel.car.timeStr}</span>
        </span>
        <span className="text-slate-300 font-bold">·</span>
        <span className="flex items-center gap-1 text-slate-700">
          <span>🏍️</span>
          <span>{travel.bike.timeStr}</span>
        </span>
        <span className="text-slate-300 font-bold">·</span>
        <span className="flex items-center gap-1 text-slate-700">
          <span>🚶</span>
          <span>{travel.walking.timeStr}</span>
        </span>
      </div>
    </div>
  );
};
