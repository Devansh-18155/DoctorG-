import React from 'react';

interface DoctorGLogoProps {
  className?: string;
  size?: 'normal' | 'large';
}

export const DoctorGLogo: React.FC<DoctorGLogoProps> = ({
  className = '',
  size = 'large',
}) => {
  return (
    <div className={`flex items-center gap-3.5 sm:gap-4 select-none ${className}`}>
      {/* Red Medical Cross with Dynamic Swoosh & White Cross Accent */}
      <div className="relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-sm"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main Red Cross with Rounded Ends */}
          <path
            d="M38 12 C38 6.5 42.5 2 48 2 L52 2 C57.5 2 62 6.5 62 12 L62 38 L88 38 C93.5 38 98 42.5 98 48 L98 52 C98 57.5 93.5 62 88 62 L62 62 L62 88 C62 93.5 57.5 98 52 98 L48 98 C42.5 98 38 93.5 38 88 L38 62 L12 62 C6.5 62 2 57.5 2 52 L2 48 C2 42.5 6.5 38 12 38 L38 38 Z"
            fill="#D71920"
          />

          {/* Inner White Medical Cross Accent */}
          <path
            d="M44 24 C44 21 46 19 49 19 L51 19 C54 19 56 21 56 24 L56 44 L76 44 C79 44 81 46 81 49 L81 51 C81 54 79 56 76 56 L56 56 L56 76 C56 79 54 81 51 81 L49 81 C46 81 44 79 44 76 L44 56 L24 56 C21 56 19 54 19 51 L19 49 C19 46 21 44 24 44 L44 44 Z"
            fill="#FFFFFF"
            opacity="0.95"
          />

          {/* Golden/Orange Swoosh passing diagonally across */}
          <path
            d="M6 75 C25 60 55 42 94 30 C80 38 45 58 14 79 Z"
            fill="url(#swooshGradient)"
          />

          <defs>
            <linearGradient id="swooshGradient" x1="6" y1="75" x2="94" y2="30" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FF8C00" />
              <stop offset="60%" stopColor="#FFB300" />
              <stop offset="100%" stopColor="#FFF176" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Brand Text Stack: "Doctor G", Orange ECG Line, "डॉक्टर जी" */}
      <div className="flex flex-col text-left">
        {/* Brand Name */}
        <h1 className="text-3xl sm:text-4xl font-black text-[#102B55] tracking-tight leading-none flex items-baseline">
          <span>Doctor</span>
          <span className="font-extrabold ml-1.5 text-[#102B55]">G</span>
        </h1>

        {/* Orange ECG / Heartbeat pulse line */}
        <div className="w-full my-1 sm:my-1.5 flex items-center">
          <svg
            viewBox="0 0 170 18"
            className="w-full h-3.5 sm:h-4 text-[#FF8C00]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Horizontal line with QRS Heartbeat Pulse in the middle */}
            <path
              d="M0 9 L58 9 L63 9 L66 14 L71 2 L76 16 L80 7 L84 10 L88 9 L170 9"
              stroke="#FF8C00"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Hindi Typography */}
        <span className="text-xl sm:text-2xl font-black text-[#102B55] tracking-wide leading-none mt-0.5">
          डॉक्टर जी
        </span>
      </div>
    </div>
  );
};
