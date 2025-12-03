import React from 'react';

const Logo = ({ className = "w-8 h-8" }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            fill="none"
            className={className}
        >
            <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: 'var(--accent-primary)', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: 'var(--text-secondary)', stopOpacity: 1 }} />
                </linearGradient>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {/* Hexagon Background */}
            <path
                d="M50 5 L93.3 25 V75 L50 95 L6.7 75 V25 Z"
                stroke="url(#grad1)"
                strokeWidth="4"
                fill="var(--bg-secondary)"
                fillOpacity="0.5"
                filter="url(#glow)"
            />

            {/* Stylized S / Bolt */}
            <path
                d="M65 35 L35 35 L35 50 L65 50 L65 65 L35 65"
                stroke="url(#grad1)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glow)"
            />
        </svg>
    );
};

export default Logo;
