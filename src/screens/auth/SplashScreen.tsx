import React from 'react';
import { useApp } from '../../context/AppContext';
import { Stethoscope, Heart, Sparkles } from 'lucide-react';

export const SplashScreen: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <div
      onClick={() => navigateTo('welcome')}
      className="min-h-[580px] h-full flex flex-col items-center justify-between p-8 bg-white text-center cursor-pointer select-none"
    >
      <div className="w-full flex justify-end">
        <span className="text-[11px] text-slate-400 font-medium">Tap anywhere to skip</span>
      </div>

      <div className="flex flex-col items-center animate-in zoom-in-95 duration-700">
        {/* Brand Icon */}
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-[#172B4D] via-[#087E8B] to-[#12A0AF] flex items-center justify-center text-white shadow-2xl shadow-teal-700/30">
            <div className="relative">
              <span className="font-extrabold text-4xl tracking-tighter">G+</span>
              <Heart className="w-5 h-5 text-rose-400 absolute -top-1 -right-4 fill-rose-400 animate-pulse" />
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 bg-emerald-500 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
        </div>

        {/* Brand Name */}
        <h1 className="text-3xl font-extrabold text-[#172B4D] tracking-tight mb-2">
          Doctor G
        </h1>

        {/* Tagline */}
        <p className="text-sm font-semibold text-[#087E8B] tracking-wide mb-3">
          Your Complete Healthcare Partner
        </p>

        <p className="text-xs text-slate-400 max-w-[260px] leading-relaxed">
          Connecting patients, doctors, hospitals, medicines, labs & emergency care
        </p>
      </div>

      {/* Subtle loader */}
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#087E8B] animate-bounce"></span>
          <span className="w-2 h-2 rounded-full bg-[#087E8B] animate-bounce [animation-delay:0.2s]"></span>
          <span className="w-2 h-2 rounded-full bg-[#087E8B] animate-bounce [animation-delay:0.4s]"></span>
        </div>
        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
          Loading Health Ecosystem
        </p>
      </div>
    </div>
  );
};
