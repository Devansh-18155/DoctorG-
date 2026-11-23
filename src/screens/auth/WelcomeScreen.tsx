import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Globe, ArrowRight, ShieldCheck, Heart, User, Sparkles } from 'lucide-react';
import { LanguageModal } from '../../components/common/LanguageModal';
import { SUPPORTED_LANGUAGES } from '../../translations';

export const WelcomeScreen: React.FC = () => {
  const { navigateTo, loginAsPatient, currentLanguage, t } = useApp();
  const [isLangOpen, setIsLangOpen] = useState(false);

  const activeLang = SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage);

  return (
    <div className="min-h-[580px] h-full flex flex-col justify-between p-6 bg-gradient-to-b from-white via-[#F6F8FA] to-[#EAF7F6]/40">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#087E8B] to-[#172B4D] flex items-center justify-center text-white font-extrabold text-sm">
            G+
          </div>
          <span className="font-bold text-sm text-[#172B4D]">Doctor G</span>
        </div>

        {/* Language Pill */}
        <button
          onClick={() => setIsLangOpen(true)}
          className="flex items-center gap-1.5 bg-white border border-slate-200/80 px-2.5 py-1 rounded-full text-xs font-semibold text-slate-700 shadow-2xs hover:border-teal-500 transition-colors"
        >
          <Globe className="w-3.5 h-3.5 text-[#087E8B]" />
          <span>{activeLang?.nativeName || 'English'}</span>
        </button>
      </div>

      {/* Main Illustration & Intro */}
      <div className="my-auto py-6 flex flex-col items-center text-center">
        {/* Doctor Graphic */}
        <div className="relative mb-6">
          <div className="w-48 h-48 rounded-full bg-gradient-to-tr from-teal-100 to-sky-50 border-4 border-white shadow-xl flex items-center justify-center overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=500&q=80"
              alt="Caring Doctor"
              className="w-full h-full object-cover object-top"
            />
          </div>
          <div className="absolute bottom-2 right-2 bg-white px-3 py-1 rounded-full shadow-md border border-slate-100 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="text-[11px] font-bold text-slate-700">Verified Doctors</span>
          </div>
        </div>

        {/* Headlines */}
        <h2 className="text-2xl font-extrabold text-[#172B4D] tracking-tight mb-2">
          Healthcare That Cares For You
        </h2>
        <p className="text-xs text-slate-500 max-w-[280px] leading-relaxed mb-4">
          Book trusted doctors, request urgent ambulances, order doorstep medicines, and monitor live clinic queues.
        </p>

        {/* Highlights */}
        <div className="flex items-center gap-4 text-[11px] font-medium text-slate-600 bg-white/80 backdrop-blur-xs py-2 px-4 rounded-xl border border-slate-100 shadow-2xs">
          <span className="flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> 24/7 Care
          </span>
          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
          <span>Zero Extra Fees</span>
          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
          <span>Live Patient Queue</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2.5">
        {/* Get Started -> Registration */}
        <button
          onClick={() => navigateTo('register')}
          className="w-full flex items-center justify-center gap-2 bg-[#087E8B] hover:bg-[#06626D] text-white py-3.5 px-4 rounded-2xl font-bold text-sm shadow-md shadow-teal-700/25 transition-all group"
        >
          <span>{t('getStarted') || 'Get Started'}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Sign In -> Login */}
        <button
          onClick={() => navigateTo('login')}
          className="w-full flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-[#172B4D] border border-slate-200 py-3 px-4 rounded-2xl font-bold text-sm shadow-2xs transition-all"
        >
          <User className="w-4 h-4 text-[#087E8B]" />
          <span>{t('signIn') || 'Sign In to Existing Account'}</span>
        </button>

        {/* Skip for Now -> Guest Mode */}
        <button
          onClick={() => loginAsPatient(true)}
          className="w-full py-2 text-center text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors"
        >
          {t('skipForNow') || 'Skip for Now (Browse as Guest)'}
        </button>
      </div>

      <LanguageModal isOpen={isLangOpen} onClose={() => setIsLangOpen(false)} />
    </div>
  );
};
