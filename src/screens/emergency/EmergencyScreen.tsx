import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ChevronLeft,
  PhoneCall,
  Ambulance,
  Building2,
  AlertTriangle,
  ShieldAlert,
  MapPin,
  HeartPulse,
  Navigation,
} from 'lucide-react';
import { HOSPITALS } from '../../data/mockData';

export const EmergencyScreen: React.FC = () => {
  const { goBack, navigateTo, currentCity, currentArea } = useApp();

  const warningSigns = [
    'Severe crushing chest pain or radiating arm numbness (Heart Attack)',
    'Sudden difficulty breathing or severe choking',
    'Facial drooping, slurred speech or sudden arm weakness (Stroke)',
    'Loss of consciousness or unresponsiveness',
    'Severe uncontrolled bleeding or trauma',
    'Anaphylaxis / Severe sudden allergic swelling',
  ];

  return (
    <div className="min-h-full pb-20 bg-rose-50/30">
      {/* Header */}
      <div className="bg-rose-900 text-white p-4 sticky top-0 z-20 flex items-center justify-between shadow-md">
        <button
          onClick={goBack}
          className="flex items-center gap-1 text-rose-200 hover:text-white text-xs font-semibold"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <span className="text-xs font-black uppercase tracking-wider text-rose-100 flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-rose-300 animate-pulse" />
          <span>24x7 Emergency Help Desk</span>
        </span>

        <span className="w-8"></span>
      </div>

      <div className="p-4 space-y-4">
        {/* Massive 108 Action Button */}
        <a
          href="tel:108"
          className="block w-full bg-rose-600 hover:bg-rose-700 text-white p-5 rounded-3xl shadow-xl shadow-rose-600/40 text-center animate-pulse transition-all"
        >
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white text-rose-600 flex items-center justify-center font-black text-xl shadow-inner">
              <PhoneCall className="w-6 h-6 animate-bounce" />
            </div>
            <div className="text-left">
              <span className="text-[11px] font-bold uppercase tracking-widest text-rose-200 block">
                Direct Emergency Call
              </span>
              <h2 className="text-2xl font-black tracking-tight leading-none">
                DIAL 108 (AMBULANCE)
              </h2>
            </div>
          </div>
          <p className="text-[11px] text-rose-100 font-medium mt-2">
            Free government emergency toll-free hotline across India
          </p>
        </a>

        {/* Secondary Instant Dispatch / 112 */}
        <div className="grid grid-cols-2 gap-2">
          <a
            href="tel:112"
            className="p-3.5 bg-slate-900 text-white rounded-2xl flex items-center gap-2.5 shadow-md"
          >
            <PhoneCall className="w-4 h-4 text-rose-400" />
            <div>
              <span className="text-[10px] text-slate-400 block font-bold">National Police/Fire</span>
              <span className="font-extrabold text-sm">Dial 112 SOS</span>
            </div>
          </a>

          <button
            onClick={() => navigateTo('find-ambulance')}
            className="p-3.5 bg-white border-2 border-rose-500 text-rose-700 rounded-2xl flex items-center gap-2.5 shadow-sm font-bold text-xs"
          >
            <Ambulance className="w-5 h-5 text-rose-600" />
            <div className="text-left">
              <span className="text-[10px] text-slate-500 block">Dispatch Fleet</span>
              <span>Find Ambulance</span>
            </div>
          </button>
        </div>

        {/* Current GPS Location pill */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-rose-600" />
            <div>
              <span className="font-bold text-[#172B4D]">Your Current GPS Location:</span>
              <p className="text-slate-500 text-[11px]">{currentArea}, {currentCity}</p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-lg">
            Active GPS
          </span>
        </div>

        {/* Emergency Warning Signs Checklist */}
        <div className="bg-white rounded-3xl border border-rose-200 p-4 space-y-2.5">
          <h4 className="font-extrabold text-xs text-rose-900 flex items-center gap-1.5 uppercase tracking-wide">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>Critical Emergency Warning Signs</span>
          </h4>
          <p className="text-[11px] text-slate-500 leading-snug">
            If you or someone nearby is experiencing any of the following, seek immediate emergency treatment:
          </p>
          <div className="space-y-1.5 pt-1">
            {warningSigns.map((sign, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 p-2 bg-rose-50/60 rounded-xl text-xs text-rose-900 font-medium"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 mt-1.5 flex-shrink-0"></span>
                <span>{sign}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Nearest Emergency Hospitals with Direct Call */}
        <div className="space-y-2.5">
          <h4 className="font-extrabold text-xs text-[#172B4D] uppercase tracking-wider">
            Nearest Emergency Hospital ERs
          </h4>
          {HOSPITALS.map((hosp) => (
            <div
              key={hosp.id}
              className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between"
            >
              <div>
                <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded">
                  24x7 ER Active
                </span>
                <h5 className="font-bold text-xs text-[#172B4D] mt-1">{hosp.name}</h5>
                <p className="text-[10px] text-slate-400">
                  {hosp.distance} • {hosp.address}
                </p>
              </div>

              <a
                href={`tel:${hosp.emergencyPhone}`}
                className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call ER</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
