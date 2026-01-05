"use client";

import { useId, ReactNode } from "react";

export interface ReededGlassProps {
  children: ReactNode;
  /** Horizontal wave frequency (higher = tighter vertical striations) */
  baseFrequencyX?: number;
  /** Vertical wave frequency (lower = more horizontal continuity) */
  baseFrequencyY?: number;
  /** Displacement intensity (higher = more warping) */
  scale?: number;
  /** Number of noise octaves (more = finer detail) */
  numOctaves?: number;
  /** Static seed for consistent glass pattern */
  seed?: number;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Wrapper component that applies reeded glass effect to children.
 * 
 * Use this to wrap any content you want to appear behind frosted/reeded glass.
 */
export function ReededGlass({
  children,
  baseFrequencyX = 0.05,
  baseFrequencyY = 0.005,
  scale = 40,
  numOctaves = 2,
  seed = 42,
  className = "",
}: ReededGlassProps) {
  const filterId = useId().replace(/:/g, "");

  return (
    <div className={`relative ${className}`}>
      {/* SVG filter definition */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          <filter id={`reeded-${filterId}`}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency={`${baseFrequencyX} ${baseFrequencyY}`}
              numOctaves={numOctaves}
              seed={seed}
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={scale}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* Content with glass filter applied */}
      <div style={{ filter: `url(#reeded-${filterId})` }}>
        {children}
      </div>
    </div>
  );
}
