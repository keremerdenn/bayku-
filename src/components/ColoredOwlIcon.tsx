import React from "react";

interface ColoredOwlIconProps {
  size?: number;
  gradientId?: string;
  gradient?: { from: string; to: string };
  color?: string; // Düz renk için
}

const ColoredOwlIcon: React.FC<ColoredOwlIconProps> = ({
  size = 28,
  gradientId = "owlGradientDefault",
  gradient = { from: "#38bdf8", to: "#6366f1" },
  color,
}) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="16" cy="22" rx="10" ry="7" fill={color ? color : `url(#${gradientId})`} />
    <ellipse cx="11.5" cy="14" rx="3.5" ry="4" fill="#fff" />
    <ellipse cx="20.5" cy="14" rx="3.5" ry="4" fill="#fff" />
    <circle cx="11.5" cy="14" r="1.2" fill="#0ea5e9" />
    <circle cx="20.5" cy="14" r="1.2" fill="#0ea5e9" />
    <ellipse cx="16" cy="18.5" rx="2.5" ry="1.2" fill="#e5e7eb" />
    <path d="M8 10 Q16 2 24 10" stroke="#0ea5e9" strokeWidth="2" fill="none" />
    {!color && (
      <defs>
        <linearGradient id={gradientId} x1="6" y1="22" x2="26" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor={gradient.from} />
          <stop offset="1" stopColor={gradient.to} />
        </linearGradient>
      </defs>
    )}
  </svg>
);

export default ColoredOwlIcon; 