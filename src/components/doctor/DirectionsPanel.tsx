import React from 'react';
import {
  MapPin,
  CornerUpRight,
  ArrowUp,
  Building2,
  Phone,
  Clock,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { EnrichedDoctor } from '../../utils/doctorDiscoveryHelper';

interface DirectionsPanelProps {
  doctor: EnrichedDoctor;
  originLabel: string;
  destinationLabel: string;
  distanceKm: number;
  durationMinutes: number;
  mode: 'driving' | 'walking';
}

export const DirectionsPanel: React.FC<DirectionsPanelProps> = ({
  doctor,
  originLabel,
  destinationLabel,
  distanceKm,
  durationMinutes,
  mode,
}) => {
  const steps = [
    {
      icon: ArrowUp,
      title: `Depart from ${originLabel}`,
      detail: 'Follow arterial medical corridor signs towards hospital road',
      distance: '0.4 km',
    },
    {
      icon: CornerUpRight,
      title: 'Turn right onto Main Medical Center Bypass',
      detail: 'Continue straight across traffic interchange',
      distance: `${(distanceKm * 0.6).toFixed(1)} km`,
    },
    {
      icon: CornerUpRight,
      title: `Turn into ${doctor.hospitalName} Campus Gate 2`,
      detail: 'Emergency & Outpatient OPD vehicle drop-off zone',
      distance: '0.2 km',
    },
    {
      icon: MapPin,
      title: `Arrive at ${doctor.name}'s OPD Chamber`,
      detail: `OPD 03 • Floor 1 • ${doctor.fullClinicAddress}`,
      distance: 'Destination',
    },
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-sm space-y-4">
      {/* Route Header Info */}
      <div className="flex items-start justify-between pb-3 border-b border-slate-100">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Turn-By-Turn Route Guidance
          </span>
          <h3 className="font-extrabold text-sm text-[#172B4D] mt-0.5">
            Directions to {doctor.name}
          </h3>
          <p className="text-xs text-teal-700 font-semibold">{doctor.hospitalName}</p>
        </div>

        <div className="text-right">
          <span className="text-base font-black text-[#172B4D]">
            {durationMinutes > 60
              ? `${Math.floor(durationMinutes / 60)}h ${durationMinutes % 60}m`
              : `${durationMinutes} mins`}
          </span>
          <span className="text-[11px] text-teal-700 block font-bold">
            {distanceKm.toFixed(1)} km total
          </span>
        </div>
      </div>

      {/* Origin & Destination Summary */}
      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs">
        <div className="flex items-center gap-2 text-slate-600">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-600 flex-shrink-0"></div>
          <span className="truncate">
            From: <strong>{originLabel}</strong>
          </span>
        </div>
        <div className="flex items-center gap-2 text-slate-800">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-600 flex-shrink-0"></div>
          <span className="truncate">
            To: <strong>{destinationLabel}</strong>
          </span>
        </div>
      </div>

      {/* Turn-by-Turn Steps */}
      <div className="space-y-3">
        <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Navigation Steps ({steps.length})
        </h5>
        <div className="space-y-3">
          {steps.map((st, idx) => {
            const Icon = st.icon;
            const isLast = idx === steps.length - 1;
            return (
              <div key={idx} className="flex items-start gap-3 relative">
                {!isLast && (
                  <div className="absolute left-3.5 top-7 bottom-0 w-0.5 bg-slate-200"></div>
                )}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                    isLast
                      ? 'bg-rose-100 text-rose-700 border border-rose-300'
                      : 'bg-teal-50 text-teal-700 border border-teal-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h6 className="font-bold text-xs text-[#172B4D] truncate">{st.title}</h6>
                    <span className="text-[10px] text-slate-400 font-mono flex-shrink-0 ml-2">
                      {st.distance}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{st.detail}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Parking & Clinic Help Note */}
      <div className="p-3 bg-teal-50/60 rounded-2xl border border-teal-200 text-xs text-teal-900 space-y-1">
        <div className="flex items-center gap-1.5 font-bold">
          <ShieldCheck className="w-4 h-4 text-teal-700" />
          <span>Patient Arrival Guidelines</span>
        </div>
        <p className="text-[11px] text-teal-800 leading-relaxed">
          Ample 2-wheeler and 4-wheeler parking is available inside Gate 2. Wheelchair ramp
          access is situated directly opposite OPD Reception.
        </p>
      </div>
    </div>
  );
};
