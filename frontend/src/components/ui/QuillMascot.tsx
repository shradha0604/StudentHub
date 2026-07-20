import React from 'react'

interface QuillMascotProps {
  size?: number
  mood?: 'default' | 'happy' | 'searching' | 'reading' | 'waving'
  className?: string
}

export const QuillMascot: React.FC<QuillMascotProps> = ({
  size = 64,
  mood = 'default',
  className = ''
}) => {
  return (
    <div
      className={`relative inline-block select-none transition-transform duration-300 hover:scale-105 ${className}`}
      style={{ width: size, height: size * 1.4 }}
    >
      <svg
        viewBox="0 0 100 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_4px_8px_rgba(139,94,60,0.15)]"
      >
        {/* Soft shadow filter */}
        <defs>
          <filter id="soft-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#8B5E3C" floodOpacity="0.12" />
          </filter>
          <style>
            {`
              @keyframes tasselSway {
                0%, 100% { transform: rotate(0deg); }
                50% { transform: rotate(-10deg); }
              }
              @keyframes eyeBlink {
                0%, 90%, 100% { transform: scaleY(1); }
                95% { transform: scaleY(0.1); }
              }
              @keyframes bodyFloat {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-4px); }
              }
              .animate-tassel {
                animation: tasselSway 4s ease-in-out infinite;
                transform-origin: 50px 18px;
              }
              .animate-blink {
                animation: eyeBlink 5s infinite;
                transform-origin: center;
              }
              .animate-float {
                animation: bodyFloat 6s ease-in-out infinite;
              }
            `}
          </style>
        </defs>

        <g className="animate-float">
          {/* 1. Tassel (sways gently) */}
          <g className="animate-tassel">
            {/* Tassel cord */}
            <path
              d="M50 18 Q55 10 52 4"
              stroke="#C8A97E"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
            {/* Golden tassel knot and fringe */}
            <circle cx="52" cy="4" r="2.5" fill="#8B5E3C" />
            <path
              d="M52 4 L48 -2 L56 -2 Z"
              fill="#C8A97E"
              stroke="#C8A97E"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </g>

          {/* 2. Soft Green Leaf growing from top */}
          <path
            d="M48 20 C42 12 45 8 49 6 C53 8 51 14 50 20 Z"
            fill="#7A9D7A"
            stroke="#5F825F"
            strokeWidth="0.75"
          />
          <path
            d="M48.5 13 Q47 10 46 9"
            stroke="#5F825F"
            strokeWidth="0.5"
            fill="none"
          />

          {/* 3. Fountain Pen clipped to the side */}
          <g transform="translate(6, 0)">
            {/* Pen Nib */}
            <path
              d="M66 60 L69 52 L72 60 Z"
              fill="#C8A97E"
              stroke="#B5966B"
              strokeWidth="0.5"
            />
            <line x1="69" y1="52" x2="69" y2="58" stroke="#3A2C21" strokeWidth="0.5" />
            {/* Pen Body */}
            <rect
              x="66"
              y="60"
              width="6"
              height="30"
              rx="1.5"
              fill="#2F5D50"
              stroke="#23483E"
              strokeWidth="0.75"
            />
            {/* Gold Clip */}
            <path
              d="M69 63 L69 75 C69 76 67 76 67 75"
              stroke="#C8A97E"
              strokeWidth="1"
              strokeLinecap="round"
              fill="none"
            />
          </g>

          {/* 4. Bookmark Main Body (Brown Leather with Gold Stitching) */}
          {/* Path outline with V-cut at bottom */}
          <path
            d="M30 20 H70 V112 L50 125 L30 112 Z"
            fill="#8B5E3C"
            stroke="#785133"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          
          {/* Leather texture subtle line */}
          <path
            d="M31 21 H69 V111.5 L50 123.5 L31 111.5 Z"
            fill="none"
            stroke="#9E734E"
            strokeWidth="1"
            strokeLinejoin="round"
            opacity="0.3"
          />

          {/* Gold Stitched Border (Dashed) */}
          <path
            d="M33 23 H67 V109 L50 120 L33 109 Z"
            fill="none"
            stroke="#C8A97E"
            strokeWidth="1.25"
            strokeDasharray="3 3.5"
            strokeLinejoin="round"
          />

          {/* 5. Tiny Round Glasses (Gold Wire) */}
          <g>
            {/* Left Frame */}
            <circle
              cx="43"
              cy="52"
              r="8"
              fill="#FFFFFF"
              fillOpacity="0.08"
              stroke="#C8A97E"
              strokeWidth="1.5"
            />
            {/* Right Frame */}
            <circle
              cx="57"
              cy="52"
              r="8"
              fill="#FFFFFF"
              fillOpacity="0.08"
              stroke="#C8A97E"
              strokeWidth="1.5"
            />
            {/* Bridge */}
            <path
              d="M48.5 50.5 Q50 49 51.5 50.5"
              stroke="#C8A97E"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
            />
            {/* Temple left */}
            <path
              d="M35 52 H30"
              stroke="#C8A97E"
              strokeWidth="1"
              fill="none"
            />
            {/* Temple right */}
            <path
              d="M65 52 H70"
              stroke="#C8A97E"
              strokeWidth="1"
              fill="none"
            />
          </g>

          {/* 6. Expressive Eyes & Smile */}
          <g>
            {mood === 'happy' || mood === 'waving' ? (
              // Happy Arc Eyes
              <>
                <path
                  d="M40 54 Q43 50 46 54"
                  stroke="#2D2D2D"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                  className="stroke-text dark:stroke-[#FAF8F5]"
                />
                <path
                  d="M54 54 Q57 50 60 54"
                  stroke="#2D2D2D"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                  className="stroke-text dark:stroke-[#FAF8F5]"
                />
              </>
            ) : (
              // Round Eyes with Blink animation
              <>
                <g className="animate-blink">
                  <circle
                    cx="43"
                    cy="52.5"
                    r="2.5"
                    fill="#2D2D2D"
                    className="fill-text dark:fill-[#FAF8F5]"
                  />
                  <circle
                    cx="57"
                    cy="52.5"
                    r="2.5"
                    fill="#2D2D2D"
                    className="fill-text dark:fill-[#FAF8F5]"
                  />
                </g>
              </>
            )}

            {/* Friendly Smile */}
            <path
              d="M47 64 Q50 67.5 53 64"
              stroke="#2D2D2D"
              strokeWidth="1.75"
              strokeLinecap="round"
              fill="none"
              className="stroke-text dark:stroke-[#FAF8F5]"
            />
          </g>

          {/* 7. Mood Overlays: Reading Book / Searching Magnifying Glass */}
          {mood === 'searching' && (
            // Magnifying Glass
            <g transform="translate(18, 72)" filter="url(#soft-shadow)">
              {/* Handle */}
              <line
                x1="6"
                y1="12"
                x2="15"
                y2="21"
                stroke="#8B5E3C"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <line
                x1="6"
                y1="12"
                x2="15"
                y2="21"
                stroke="#C8A97E"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              {/* Glass Frame */}
              <circle
                cx="0"
                cy="6"
                r="8.5"
                fill="#D4EAF7"
                fillOpacity="0.4"
                stroke="#C8A97E"
                strokeWidth="1.75"
              />
              {/* Shine */}
              <circle
                cx="-2"
                cy="4"
                r="5"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="0.75"
                strokeDasharray="2 10"
                opacity="0.7"
              />
            </g>
          )}

          {mood === 'reading' && (
            // Open Hardcover Book
            <g transform="translate(32, 80)" filter="url(#soft-shadow)">
              {/* Book Cover */}
              <path
                d="M4 14 Q18 16 36 14 Q18 17 4 14"
                stroke="#2F5D50"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
              />
              {/* Book Pages */}
              <path
                d="M5 12 C13 14 18 14 18 13.5 C18 14 23 14 31 12 V2 C23 4 18 4 18 3.5 C18 4 13 4 5 2 Z"
                fill="#F8F5F1"
                stroke="#E8E2D8"
                strokeWidth="0.75"
              />
              {/* Center Line/Spine */}
              <line x1="18" y1="3.5" x2="18" y2="13.5" stroke="#8B5E3C" strokeWidth="1" />
              {/* Tiny text lines */}
              <line x1="8" y1="5" x2="14" y2="5" stroke="#C4BEB5" strokeWidth="0.5" />
              <line x1="8" y1="7" x2="12" y2="7" stroke="#C4BEB5" strokeWidth="0.5" />
              <line x1="8" y1="9" x2="15" y2="9" stroke="#C4BEB5" strokeWidth="0.5" />
              
              <line x1="21" y1="5" x2="28" y2="5" stroke="#C4BEB5" strokeWidth="0.5" />
              <line x1="22" y1="7" x2="26" y2="7" stroke="#C4BEB5" strokeWidth="0.5" />
              <line x1="21" y1="9" x2="27" y2="9" stroke="#C4BEB5" strokeWidth="0.5" />
            </g>
          )}

          {mood === 'waving' && (
            // Tiny waving bookmark hand
            <g transform="translate(18, 70)">
              <path
                d="M12 10 Q2 6 -2 2"
                stroke="#C8A97E"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="-2" cy="2" r="2.5" fill="#8B5E3C" />
            </g>
          )}
        </g>
      </svg>
    </div>
  )
}
