import React from 'react';
import { ChevronRight } from 'lucide-react';

interface RoleSelectionCardProps {
  role: 'patient' | 'doctor';
  onClick: () => void;
}

export const RoleSelectionCard: React.FC<RoleSelectionCardProps> = ({ role, onClick }) => {
  const isPatient = role === 'patient';

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className={`relative w-full h-[88px] sm:h-[94px] px-4 sm:px-5 rounded-2xl sm:rounded-3xl border-2 flex items-center justify-between cursor-pointer select-none overflow-hidden transition-all duration-200 shadow-xs hover:shadow-md active:scale-[0.985] group ${
        isPatient
          ? 'bg-gradient-to-r from-[#EAF8F6] via-[#EFF9F8] to-[#E2F5F2] border-[#8CDCD3] hover:border-[#008F83]'
          : 'bg-gradient-to-r from-[#FFF8F0] via-[#FFFBF6] to-[#FFF1E0] border-[#FFD3A8] hover:border-[#FF8C00]'
      }`}
    >
      {/* Soft Decorative Corner Curve on Bottom-Right */}
      <div className="absolute right-0 bottom-0 pointer-events-none opacity-40 group-hover:opacity-60 transition-opacity">
        <svg
          viewBox="0 0 130 75"
          className="w-32 h-20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 75 C45 60 70 35 130 0 L130 75 Z"
            fill={isPatient ? '#008F83' : '#FF8C00'}
            fillOpacity={isPatient ? '0.12' : '0.14'}
          />
          <path
            d="M30 75 C70 65 90 45 130 20 L130 75 Z"
            fill={isPatient ? '#008F83' : '#FF8C00'}
            fillOpacity={isPatient ? '0.18' : '0.2'}
          />
        </svg>
      </div>

      {/* Left: Avatar / Graphic Icon in Circle Container */}
      <div className="flex items-center gap-4 sm:gap-5 z-10">
        <div
          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 ${
            isPatient ? 'bg-[#D2F1EC]' : 'bg-[#FFE8D1]'
          }`}
        >
          {isPatient ? (
            /* Patient Avatar: Teal silhouette with medical plus on chest */
            <svg
              viewBox="0 0 64 64"
              className="w-9 h-9"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Head */}
              <circle cx="32" cy="20" r="10" fill="#008F83" />
              {/* Torso */}
              <path
                d="M16 48 C16 38 23 34 32 34 C41 34 48 38 48 48 C48 51 45 52 42 52 L22 52 C19 52 16 51 16 48 Z"
                fill="#008F83"
              />
              {/* Medical Plus on chest */}
              <rect x="36" y="40" width="3" height="9" rx="1" fill="#FFFFFF" />
              <rect x="33" y="43" width="9" height="3" rx="1" fill="#FFFFFF" />
            </svg>
          ) : (
            /* Doctor Avatar: Male/female doctor with stethoscope matching reference */
            <svg
              viewBox="0 0 64 64"
              className="w-10 h-10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Hair */}
              <path
                d="M22 22 C22 14 26 12 32 12 C38 12 42 14 42 22 C42 23 41 24 39 24 C37 20 35 18 32 18 C29 18 27 20 25 24 C23 24 22 23 22 22 Z"
                fill="#102B55"
              />
              {/* Face */}
              <path
                d="M24 22 C24 27 27 30 32 30 C37 30 40 27 40 22 C40 18 37 16 32 16 C27 16 24 18 24 22 Z"
                fill="#FFDCB8"
                stroke="#102B55"
                strokeWidth="1.5"
              />
              {/* Doctor Coat & Shirt */}
              <path
                d="M18 52 C18 42 23 36 32 36 C41 36 46 42 46 52"
                fill="#FFFFFF"
                stroke="#102B55"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              {/* Shirt V-neck collar & tie */}
              <path
                d="M28 36 L32 44 L36 36"
                stroke="#102B55"
                strokeWidth="1.5"
                fill="none"
              />
              <path
                d="M31 43 L33 43 L32.5 50 L31.5 50 Z"
                fill="#102B55"
              />
              {/* Stethoscope around neck */}
              <path
                d="M24 37 C24 45 28 47 30 47"
                stroke="#102B55"
                strokeWidth="1.6"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M40 37 C40 45 36 47 34 47 L34 49"
                stroke="#102B55"
                strokeWidth="1.6"
                strokeLinecap="round"
                fill="none"
              />
              {/* Stethoscope chest piece circle */}
              <circle
                cx="34"
                cy="51"
                r="2.2"
                fill="#008F83"
                stroke="#102B55"
                strokeWidth="1.2"
              />
            </svg>
          )}
        </div>

        {/* Center: Large bold navy Role Title */}
        <span className="text-2xl sm:text-[26px] font-black text-[#102B55] tracking-tight">
          {isPatient ? 'Patient' : 'Doctor'}
        </span>
      </div>

      {/* Right: Circular Arrow Action Button */}
      <div
        className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white shadow-xs group-hover:scale-105 group-hover:shadow-md transition-all z-10 flex-shrink-0 ${
          isPatient ? 'bg-[#008F83]' : 'bg-[#FF8C00]'
        }`}
      >
        <ChevronRight className="w-6 h-6 stroke-[3]" />
      </div>
    </div>
  );
};
