import React from 'react';
import { Link } from 'react-router-dom';

export const RetrivoLogo = ({ size = 'medium', variant = 'dark' }) => {
  const isDark = variant === 'dark';
  const textColor = isDark ? 'var(--color-forest)' : 'var(--color-ivory)';
  const iconBg = isDark ? 'var(--color-forest)' : 'rgba(255, 255, 255, 0.12)';
  const accentColor = 'var(--color-marigold)';

  const iconSizes = {
    small: { w: 26, h: 26, text: '1.15rem' },
    medium: { w: 34, h: 34, text: '1.4rem' },
    large: { w: 44, h: 44, text: '1.9rem' }
  };

  const currentSize = iconSizes[size] || iconSizes.medium;

  return (
    <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}>
      <div
        style={{
          width: currentSize.w,
          height: currentSize.h,
          borderRadius: '8px',
          backgroundColor: iconBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: isDark ? 'var(--shadow-xs)' : 'none'
        }}
      >
        <svg
          width={currentSize.w * 0.75}
          height={currentSize.h * 0.75}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Recovery circular loop */}
          <path
            d="M21 12A9 9 0 1 1 18.36 5.64L21 8"
            stroke={accentColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Loop arrow tip */}
          <path
            d="M21 3V8H16"
            stroke={accentColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Center pinpoint */}
          <circle cx="12" cy="12" r="2.5" fill={isDark ? 'var(--color-ivory)' : '#FFFFFF'} />
        </svg>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: currentSize.text,
            fontWeight: 700,
            color: textColor,
            letterSpacing: '-0.03em'
          }}
        >
          RETRIVO
        </span>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6rem',
            color: isDark ? 'var(--color-muted)' : 'rgba(245, 240, 230, 0.7)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginTop: '2px'
          }}
        >
          Campus Lost & Found
        </span>
      </div>
    </Link>
  );
};
