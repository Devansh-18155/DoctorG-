import React from 'react';

/**
 * Subtle Indian Tricolour decorative waves for the top and bottom borders.
 * Styled cleanly with Saffron (#FF8C00 / #FF671F), White transition, and Green (#24B34B / #046A38).
 */
export const TricolourTopDecoration: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`w-full overflow-hidden leading-none pointer-events-none select-none ${className}`}>
      <svg
        viewBox="0 0 500 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="w-full h-10 sm:h-12"
      >
        {/* Saffron Curve */}
        <path
          d="M0 0 C150 25 320 8 500 0 L500 0 L0 0 Z"
          fill="#FF8C00"
          opacity="0.95"
        />
        <path
          d="M0 0 C140 32 300 12 500 0 L500 8 C320 18 160 38 0 8 Z"
          fill="#FFA726"
          opacity="0.8"
        />
        {/* Soft White Transition */}
        <path
          d="M0 8 C160 38 320 18 500 8 L500 14 C340 24 180 44 0 14 Z"
          fill="#FFFFFF"
          opacity="0.9"
        />
        {/* Green Curve */}
        <path
          d="M0 14 C180 44 340 24 500 14 L500 22 C330 32 170 48 0 20 Z"
          fill="#24B34B"
          opacity="0.9"
        />
      </svg>
    </div>
  );
};

export const TricolourBottomDecoration: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`w-full overflow-hidden leading-none pointer-events-none select-none ${className}`}>
      <svg
        viewBox="0 0 500 45"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="w-full h-9 sm:h-11"
      >
        {/* Saffron Wave */}
        <path
          d="M0 25 C160 8 320 30 500 15 L500 23 C320 38 160 16 0 33 Z"
          fill="#FF8C00"
          opacity="0.85"
        />
        {/* Soft White Transition */}
        <path
          d="M0 33 C160 16 320 38 500 23 L500 29 C330 42 170 22 0 39 Z"
          fill="#FFFFFF"
          opacity="0.9"
        />
        {/* Green Bottom Wave */}
        <path
          d="M0 39 C170 22 330 42 500 29 L500 45 L0 45 Z"
          fill="#24B34B"
          opacity="0.95"
        />
      </svg>
    </div>
  );
};
