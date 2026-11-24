import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  ShieldCheck,
  Store,
  FlaskConical,
  Stethoscope,
} from 'lucide-react';
import { AshokaChakraBackground } from '../../components/welcome/AshokaChakraBackground';
import {
  TricolourTopDecoration,
  TricolourBottomDecoration,
} from '../../components/welcome/TricolourBorderDecoration';
import { DoctorGLogo } from '../../components/welcome/DoctorGLogo';

export const DoctorServicesScreen: React.FC = () => {
  const { navigateTo, goBack } = useApp();

  const handleSelectMedicalShop = () => {
    navigateTo('medical-store');
  };

  const handleSelectLaboratory = () => {
    navigateTo('medical-checkup');
  };

  const handleSelectDoctorSpecialist = () => {
    navigateTo('find-doctor');
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-0 sm:p-4 select-none">
      {/* Mobile Frame Container matching Doctor G branding */}
      <div className="relative w-full max-w-[430px] min-h-screen sm:min-h-[700px] sm:max-h-[880px] bg-white sm:rounded-[36px] sm:shadow-2xl sm:border border-slate-100 flex flex-col justify-between overflow-hidden">
        
        {/* ========================================================
            TOP: INDIAN TRICOLOUR DECORATIVE WAVE
            ======================================================== */}
        <TricolourTopDecoration className="w-full flex-shrink-0" />

        {/* ========================================================
            CENTER CONTENT AREA
            ======================================================== */}
        <div className="flex-1 flex flex-col justify-between px-6 py-2 sm:px-7">
          
          {/* TOP BAR WITH BACK NAVIGATION & LOGO */}
          <div className="relative flex flex-col items-center pt-1 sm:pt-2">
            {/* Back button */}
            <div className="w-full flex items-center justify-start mb-1">
              <button
                onClick={goBack}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#102B55] hover:text-[#008F83] bg-slate-100 hover:bg-slate-200/80 px-3 py-1.5 rounded-full transition-all active:scale-95 shadow-2xs"
                title="Back to Welcome Screen"
              >
                <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
                <span>Back</span>
              </button>
            </div>

            {/* Ashoka Chakra Background Watermark */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 mt-4">
              <AshokaChakraBackground size={220} opacity={0.07} />
            </div>

            {/* Doctor G Logo Stack */}
            <div className="relative z-10 my-1">
              <DoctorGLogo />
            </div>

            {/* 24×7 MEDICAL CARE Capsule Badge */}
            <div className="relative z-10 mt-2 sm:mt-3">
              <div className="inline-flex items-center gap-2 bg-[#C5161D] text-white px-4 py-1.5 rounded-full shadow-sm hover:shadow-md transition-shadow">
                <div className="w-4 h-4 rounded-full border-1.5 border-white flex items-center justify-center">
                  <Clock className="w-3 h-3 text-white stroke-[2.5]" />
                </div>
                <span className="font-black text-sm tracking-tight leading-none">
                  24×7
                </span>
                <span className="text-white/60 font-light text-xs">|</span>
                <span className="font-extrabold text-[11px] tracking-wider uppercase leading-none">
                  MEDICAL CARE
                </span>
              </div>
            </div>
          </div>

          {/* ========================================================
              EXACTLY THREE OPTIONS:
              1. Medical Shop (Teal/Green)
              2. Laboratory (Orange)
              3. Doctor Specialist (Blue)
              ======================================================== */}
          <div className="w-full my-auto py-4 space-y-3 sm:space-y-3.5">
            
            {/* 1. MEDICAL SHOP CARD (Teal / Green) */}
            <div
              onClick={handleSelectMedicalShop}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSelectMedicalShop();
                }
              }}
              className="relative w-full h-[88px] sm:h-[92px] px-4 sm:px-5 rounded-2xl sm:rounded-3xl border-2 border-[#8CDCD3] hover:border-[#008F83] bg-gradient-to-r from-[#EAF8F6] via-[#EFF9F8] to-[#E2F5F2] flex items-center justify-between cursor-pointer select-none overflow-hidden transition-all duration-200 shadow-xs hover:shadow-md active:scale-[0.985] group"
            >
              {/* Soft Teal Decorative Corner Curve on Bottom-Right */}
              <div className="absolute right-0 bottom-0 pointer-events-none opacity-40 group-hover:opacity-60 transition-opacity">
                <svg
                  viewBox="0 0 130 75"
                  className="w-32 h-20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0 75 C45 60 70 35 130 0 L130 75 Z"
                    fill="#008F83"
                    fillOpacity="0.12"
                  />
                  <path
                    d="M30 75 C70 65 90 45 130 20 L130 75 Z"
                    fill="#008F83"
                    fillOpacity="0.18"
                  />
                </svg>
              </div>

              {/* Left: Icon in Circular Badge */}
              <div className="flex items-center gap-4 sm:gap-5 z-10">
                <div className="w-14 h-14 sm:w-15 sm:h-15 rounded-full bg-[#D2F1EC] flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 shadow-2xs">
                  {/* Medical Shop Pharmacy Icon */}
                  <div className="relative flex items-center justify-center">
                    <Store className="w-7 h-7 text-[#008F83] stroke-[2.2]" />
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#008F83] text-white rounded-full flex items-center justify-center text-[10px] font-black leading-none border border-white">
                      +
                    </span>
                  </div>
                </div>

                {/* Center: Title */}
                <span className="text-xl sm:text-[23px] font-black text-[#102B55] tracking-tight">
                  Medical Shop
                </span>
              </div>

              {/* Right: Circular Teal Arrow Button */}
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#008F83] flex items-center justify-center text-white shadow-xs group-hover:scale-105 group-hover:shadow-md transition-all z-10 flex-shrink-0">
                <ChevronRight className="w-6 h-6 stroke-[3]" />
              </div>
            </div>

            {/* 2. LABORATORY CARD (Orange) */}
            <div
              onClick={handleSelectLaboratory}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSelectLaboratory();
                }
              }}
              className="relative w-full h-[88px] sm:h-[92px] px-4 sm:px-5 rounded-2xl sm:rounded-3xl border-2 border-[#FFD3A8] hover:border-[#FF8C00] bg-gradient-to-r from-[#FFF8F0] via-[#FFFBF6] to-[#FFF1E0] flex items-center justify-between cursor-pointer select-none overflow-hidden transition-all duration-200 shadow-xs hover:shadow-md active:scale-[0.985] group"
            >
              {/* Soft Orange Decorative Corner Curve on Bottom-Right */}
              <div className="absolute right-0 bottom-0 pointer-events-none opacity-40 group-hover:opacity-60 transition-opacity">
                <svg
                  viewBox="0 0 130 75"
                  className="w-32 h-20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0 75 C45 60 70 35 130 0 L130 75 Z"
                    fill="#FF8C00"
                    fillOpacity="0.14"
                  />
                  <path
                    d="M30 75 C70 65 90 45 130 20 L130 75 Z"
                    fill="#FF8C00"
                    fillOpacity="0.2"
                  />
                </svg>
              </div>

              {/* Left: Icon in Circular Badge */}
              <div className="flex items-center gap-4 sm:gap-5 z-10">
                <div className="w-14 h-14 sm:w-15 sm:h-15 rounded-full bg-[#FFE8D1] flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 shadow-2xs">
                  {/* Laboratory Flask Icon */}
                  <FlaskConical className="w-7 h-7 text-[#FF8C00] stroke-[2.2]" />
                </div>

                {/* Center: Title */}
                <span className="text-xl sm:text-[23px] font-black text-[#102B55] tracking-tight">
                  Laboratory
                </span>
              </div>

              {/* Right: Circular Orange Arrow Button */}
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#FF8C00] flex items-center justify-center text-white shadow-xs group-hover:scale-105 group-hover:shadow-md transition-all z-10 flex-shrink-0">
                <ChevronRight className="w-6 h-6 stroke-[3]" />
              </div>
            </div>

            {/* 3. DOCTOR SPECIALIST CARD (Blue) */}
            <div
              onClick={handleSelectDoctorSpecialist}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSelectDoctorSpecialist();
                }
              }}
              className="relative w-full h-[88px] sm:h-[92px] px-4 sm:px-5 rounded-2xl sm:rounded-3xl border-2 border-[#BFDBFE] hover:border-[#2563EB] bg-gradient-to-r from-[#EFF6FF] via-[#F5F9FF] to-[#E0EFFF] flex items-center justify-between cursor-pointer select-none overflow-hidden transition-all duration-200 shadow-xs hover:shadow-md active:scale-[0.985] group"
            >
              {/* Soft Blue Decorative Corner Curve on Bottom-Right */}
              <div className="absolute right-0 bottom-0 pointer-events-none opacity-40 group-hover:opacity-60 transition-opacity">
                <svg
                  viewBox="0 0 130 75"
                  className="w-32 h-20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0 75 C45 60 70 35 130 0 L130 75 Z"
                    fill="#2563EB"
                    fillOpacity="0.12"
                  />
                  <path
                    d="M30 75 C70 65 90 45 130 20 L130 75 Z"
                    fill="#2563EB"
                    fillOpacity="0.18"
                  />
                </svg>
              </div>

              {/* Left: Icon in Circular Badge */}
              <div className="flex items-center gap-4 sm:gap-5 z-10">
                <div className="w-14 h-14 sm:w-15 sm:h-15 rounded-full bg-[#DBEAFE] flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 shadow-2xs">
                  {/* Doctor Specialist Stethoscope Icon */}
                  <Stethoscope className="w-7 h-7 text-[#2563EB] stroke-[2.2]" />
                </div>

                {/* Center: Title */}
                <span className="text-xl sm:text-[23px] font-black text-[#102B55] tracking-tight">
                  Doctor Specialist
                </span>
              </div>

              {/* Right: Circular Blue Arrow Button */}
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#2563EB] flex items-center justify-center text-white shadow-xs group-hover:scale-105 group-hover:shadow-md transition-all z-10 flex-shrink-0">
                <ChevronRight className="w-6 h-6 stroke-[3]" />
              </div>
            </div>

          </div>

          {/* ========================================================
              FOOTER: TRUST VERIFICATION LINE
              ======================================================== */}
          <div className="w-full pb-2 pt-1 flex items-center justify-center gap-1.5 text-center">
            <ShieldCheck className="w-4 h-4 text-[#24B34B] flex-shrink-0" />
            <span className="text-xs font-bold text-[#102B55] tracking-tight">
              NMC Verified Doctors • Encrypted & Private
            </span>
          </div>
        </div>

        {/* ========================================================
            BOTTOM: INDIAN TRICOLOUR DECORATIVE WAVE
            ======================================================== */}
        <TricolourBottomDecoration className="w-full flex-shrink-0" />
      </div>
    </div>
  );
};
