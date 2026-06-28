/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface LoragicaLogoProps {
  size?: number;
  theme?: 'light' | 'dark';
  className?: string;
}

export default function LoragicaLogo({
  size = 32,
  theme = 'light',
  className = '',
}: LoragicaLogoProps) {
  const isDark = theme === 'dark';
  const solidColor = isDark ? '#FFFFFF' : '#000000';
  const midColor = isDark ? '#7E7E7E' : '#737373';
  const outlineColor = isDark ? '#FFFFFF' : '#000000';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`transition-transform duration-500 hover:rotate-90 hover:scale-105 select-none ${className}`}
    >
      {/* Top Left - Hollow frame (Thick outline) */}
      <rect
        x="9"
        y="9"
        width="32"
        height="32"
        rx="8"
        stroke={outlineColor}
        strokeWidth="8"
        fill="none"
      />
      {/* Top Right - Filled solid brand box */}
      <rect
        x="55"
        y="5"
        width="40"
        height="40"
        rx="10"
        fill={solidColor}
      />
      {/* Bottom Left - Solid gray semantic box */}
      <rect
        x="5"
        y="55"
        width="40"
        height="40"
        rx="10"
        fill={midColor}
      />
      {/* Bottom Right - Hollow frame (Identical thick outline) */}
      <rect
        x="59"
        y="59"
        width="32"
        height="32"
        rx="8"
        stroke={outlineColor}
        strokeWidth="8"
        fill="none"
      />
    </svg>
  );
}
