"use client";

import { useId } from "react";

interface SolanaIconProps {
  size?: number;
  className?: string;
}

/**
 * Official Solana logo — three diagonal bars with the
 * purple→green gradient (#9945FF → #14F195).
 * useId() ensures gradient IDs are unique per instance.
 */
export default function SolanaIcon({ size = 14, className = "" }: SolanaIconProps) {
  const id = useId();
  const gradId = `sol-grad-${id}`.replace(/:/g, "_");

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="SOL"
      role="img"
    >
      <defs>
        <linearGradient
          id={gradId}
          x1="0"
          y1="16"
          x2="20"
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#9945FF" />
          <stop offset="100%" stopColor="#14F195" />
        </linearGradient>
      </defs>

      {/* Top bar */}
      <path
        d="M3.24 12.04C3.44 11.84 3.71 11.73 3.99 11.73H19.48C19.93 11.73 20.15 12.27 19.83 12.59L16.76 15.66C16.56 15.86 16.29 15.97 16.01 15.97H0.52C0.07 15.97 -0.15 15.43 0.17 15.11L3.24 12.04Z"
        fill={`url(#${gradId})`}
      />

      {/* Top bar */}
      <path
        d="M3.24 0.31C3.44 0.11 3.71 0 3.99 0H19.48C19.93 0 20.15 0.54 19.83 0.86L16.76 3.93C16.56 4.13 16.29 4.24 16.01 4.24H0.52C0.07 4.24 -0.15 3.7 0.17 3.38L3.24 0.31Z"
        fill={`url(#${gradId})`}
      />

      {/* Middle bar */}
      <path
        d="M16.76 6.16C16.56 5.96 16.29 5.85 16.01 5.85H0.52C0.07 5.85 -0.15 6.39 0.17 6.71L3.24 9.78C3.44 9.98 3.71 10.09 3.99 10.09H19.48C19.93 10.09 20.15 9.55 19.83 9.23L16.76 6.16Z"
        fill={`url(#${gradId})`}
      />
    </svg>
  );
}
