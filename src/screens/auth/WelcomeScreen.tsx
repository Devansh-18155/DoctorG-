import React from 'react';
import { useApp } from '../../context/AppContext';
import { Clock, ShieldCheck } from 'lucide-react';
import { AshokaChakraBackground } from '../../components/welcome/AshokaChakraBackground';
import {
  TricolourTopDecoration,
  TricolourBottomDecoration,
} from '../../components/welcome/TricolourBorderDecoration';
import { DoctorGLogo } from '../../components/welcome/DoctorGLogo';
import { RoleSelectionCard } from '../../components/welcome/RoleSelectionCard';

export const WelcomeScreen: React.FC = () => {
  const { navigateTo, setCurrentRole, loginAsDoctor, showToast } = useApp();

  const handleSelectPatient = () => {
    setCurrentRole('patient');
    showToast('Continuing as Patient', 'info');
    navigateTo('login');
  };

  const handleSelectDoctor = () => {
    navigateTo('doctor-services');
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-0 sm:p-4 select-none">
      {/* Mobile Card Container matching the reference image */}
      <div className="relative w-full max-w-[430px] min-h-screen sm:min-h-[700px] sm:max-h-[880px] bg-white sm:rounded-[36px] sm:shadow-2xl sm:border border-slate-100 flex flex-col justify-between overflow-hidden">
        
        {/* ========================================================
            TOP: INDIAN TRICOLOUR DECORATIVE WAVE
            ======================================================== */}
        <TricolourTopDecoration className="w-full flex-shrink-0" />

        {/* ========================================================
            CENTER CONTENT AREA
            ======================================================== */}
        <div className="flex-1 flex flex-col justify-between px-6 py-2 sm:px-7">
          
          {/* BRANDING SECTION: CHAKRA WATERMARK + LOGO + 24x7 BADGE */}
          <div className="relative flex flex-col items-center pt-2 sm:pt-4">
            {/* Ashoka Chakra Background Watermark */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0">
              <AshokaChakraBackground size={235} opacity={0.08} />
            </div>

            {/* Doctor G Logo Stack */}
            <div className="relative z-10 my-2">
              <DoctorGLogo />
            </div>

            {/* 24×7 MEDICAL CARE Capsule Badge */}
            <div className="relative z-10 mt-3 sm:mt-4">
              <div className="inline-flex items-center gap-2 bg-[#C5161D] text-white px-4 py-1.5 rounded-full shadow-sm hover:shadow-md transition-shadow">
                {/* White Clock Icon */}
                <div className="w-4 h-4 rounded-full border-1.5 border-white flex items-center justify-center">
                  <Clock className="w-3 h-3 text-white stroke-[2.5]" />
                </div>

                {/* Bold 24×7 */}
                <span className="font-black text-sm tracking-tight leading-none">
                  24×7
                </span>

                {/* Divider */}
                <span className="text-white/60 font-light text-xs">|</span>

                {/* MEDICAL CARE */}
                <span className="font-extrabold text-[11px] tracking-wider uppercase leading-none">
                  MEDICAL CARE
                </span>
              </div>
            </div>
          </div>

          {/* ========================================================
              ROLE SELECTION SECTION: "Continue as" + Patient & Doctor Cards
              ======================================================== */}
          <div className="w-full my-auto py-5 space-y-3.5 sm:space-y-4">
            {/* Header Row: "Continue as" + "Select your profile" */}
            <div className="flex items-baseline justify-between px-1">
              <h2 className="text-xl sm:text-[22px] font-black text-[#102B55] tracking-tight">
                Continue as
              </h2>
              <span className="text-xs font-semibold text-slate-500">
                Select your profile
              </span>
            </div>

            {/* Patient Card */}
            <RoleSelectionCard
              role="patient"
              onClick={handleSelectPatient}
            />

            {/* Doctor Card */}
            <RoleSelectionCard
              role="doctor"
              onClick={handleSelectDoctor}
            />
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
