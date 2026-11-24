import React from 'react';

interface AshokaChakraProps {
  className?: string;
  size?: number;
  opacity?: number;
}

export const AshokaChakraBackground: React.FC<AshokaChakraProps> = ({
  className = '',
  size = 230,
  opacity = 0.08,
}) => {
  // 24 spokes evenly distributed at 15 degrees each (360 / 24 = 15)
  const spokes = Array.from({ length: 24 }, (_, i) => i * 15);

  return (
    <div
      className={`pointer-events-none select-none flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 200 200"
        width={size}
        height={size}
        className="w-full h-full"
        style={{ opacity }}
      >
        <defs>
          <radialGradient id="chakraGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#008F83" stopOpacity="0.1" />
            <stop offset="70%" stopColor="#102B55" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#102B55" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Soft background glow */}
        <circle cx="100" cy="100" r="96" fill="url(#chakraGlow)" />

        {/* Outer Rim Double Circle */}
        <circle
          cx="100"
          cy="100"
          r="92"
          fill="none"
          stroke="#102B55"
          strokeWidth="2.5"
        />
        <circle
          cx="100"
          cy="100"
          r="86"
          fill="none"
          stroke="#102B55"
          strokeWidth="1.2"
        />

        {/* 24 Outer Dots / Beads */}
        {spokes.map((angle) => {
          const rad = (angle * Math.PI) / 180;
          const cx = 100 + 89 * Math.cos(rad);
          const cy = 100 + 89 * Math.sin(rad);
          return (
            <circle
              key={`dot-${angle}`}
              cx={cx}
              cy={cy}
              r="1.8"
              fill="#102B55"
            />
          );
        })}

        {/* Center Hub Circles */}
        <circle
          cx="100"
          cy="100"
          r="16"
          fill="none"
          stroke="#102B55"
          strokeWidth="2"
        />
        <circle
          cx="100"
          cy="100"
          r="7"
          fill="#102B55"
        />

        {/* 24 Spokes radiating from center hub */}
        <g stroke="#102B55" strokeWidth="1.6" strokeLinecap="round">
          {spokes.map((angle) => (
            <line
              key={`spoke-${angle}`}
              x1="100"
              y1="100"
              x2="100"
              y2="14"
              transform={`rotate(${angle} 100 100)`}
            />
          ))}
        </g>
      </svg>
    </div>
  );
};
