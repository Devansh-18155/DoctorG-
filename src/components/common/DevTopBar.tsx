import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Smartphone,
  Monitor,
  UserCheck,
  Stethoscope,
  Building2,
  ShieldCheck,
  Globe,
  Sparkles,
} from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../../translations';

export const DevTopBar: React.FC = () => {
  const {
    currentRole,
    setCurrentRole,
    viewportMode,
    setViewportMode,
    currentLanguage,
    setCurrentLanguage,
    isGuest,
    loginAsPatient,
    loginAsDoctor,
    user,
    navigateTo,
  } = useApp();

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-xs text-slate-300 py-2 px-3 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Brand & Role Selector */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 font-bold text-white tracking-wide">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse"></span>
            <span>DOCTOR G</span>
            <span className="bg-teal-900/80 text-teal-300 text-[10px] px-1.5 py-0.5 rounded border border-teal-700/50">
              PRO SUITE
            </span>
          </div>

          <div className="h-4 w-[1px] bg-slate-700 mx-1"></div>

          {/* Quick Portal Switcher */}
          <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
            <button
              onClick={() => {
                setCurrentRole('patient');
                if (!user && !isGuest) loginAsPatient(false);
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all font-medium ${
                currentRole === 'patient'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Patient Mobile Application"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Patient App</span>
            </button>

            <button
              onClick={() => {
                loginAsDoctor();
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all font-medium ${
                currentRole === 'doctor'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Doctor Clinical Dashboard"
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Doctor Portal</span>
            </button>

            <button
              onClick={() => {
                setCurrentRole('hospital');
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all font-medium ${
                currentRole === 'hospital'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Hospital & Clinic Dashboard"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Hospital Panel</span>
            </button>

            <button
              onClick={() => {
                setCurrentRole('admin');
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all font-medium ${
                currentRole === 'admin'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Super Admin Management Portal"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Super Admin</span>
            </button>
          </div>
        </div>

        {/* Viewport & Controls */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Quick Language switch */}
          <div className="flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700">
            <Globe className="w-3 h-3 text-teal-400" />
            <select
              value={currentLanguage}
              onChange={(e) => setCurrentLanguage(e.target.value as any)}
              className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-slate-900 text-white">
                  {lang.name} ({lang.nativeName})
                </option>
              ))}
            </select>
          </div>

          {/* Viewport Frame Toggle (Patient view) */}
          {currentRole === 'patient' && (
            <div className="flex items-center bg-slate-800 rounded-md p-0.5 border border-slate-700">
              <button
                onClick={() => setViewportMode('mobile-frame')}
                className={`p-1 rounded flex items-center gap-1 ${
                  viewportMode === 'mobile-frame'
                    ? 'bg-slate-700 text-teal-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Simulate Mobile Device Frame (iPhone 16 Pro mockup)"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mobile Frame</span>
              </button>
              <button
                onClick={() => setViewportMode('responsive')}
                className={`p-1 rounded flex items-center gap-1 ${
                  viewportMode === 'responsive'
                    ? 'bg-slate-700 text-teal-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Full Width Responsive"
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Full Responsive</span>
              </button>
            </div>
          )}

          {/* Guest / User Badge */}
          <div className="flex items-center gap-1.5 pl-1">
            {isGuest ? (
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded text-[11px] font-medium">
                Guest Mode
              </span>
            ) : user ? (
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded text-[11px] font-medium">
                {user.name.split(' ')[0]} ({user.role})
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
};
