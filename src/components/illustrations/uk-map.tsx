"use client";

const CITIES = [
  { name: "London",     x: 330, y: 388, r: 26, jobs: 4820 },
  { name: "Manchester", x: 255, y: 208, r: 12, jobs: 610  },
  { name: "Edinburgh",  x: 260, y:  80, r: 10, jobs: 380  },
  { name: "Cambridge",  x: 355, y: 318, r: 11, jobs: 540  },
  { name: "Bristol",    x: 232, y: 364, r:  9, jobs: 290  },
  { name: "Oxford",     x: 296, y: 350, r:  9, jobs: 260  },
  { name: "Leeds",      x: 280, y: 220, r:  8, jobs: 160  },
  { name: "Birmingham", x: 278, y: 298, r:  9, jobs: 195  },
  { name: "Glasgow",    x: 240, y:  92, r:  8, jobs: 130  },
  { name: "Cardiff",    x: 218, y: 360, r:  7, jobs: 90   },
];

const CONNECTIONS = [
  [0, 1], [0, 3], [0, 5], [0, 4],
  [1, 6], [1, 7], [1, 2], [2, 8],
];

const UK_PATH =
  "M304,24 C312,18 322,20 332,26 C342,32 354,42 362,56 " +
  "C370,70 376,86 378,102 C380,118 388,132 392,148 " +
  "C396,164 394,180 390,194 C386,208 388,222 386,236 " +
  "C384,250 380,262 384,276 C388,290 386,306 380,318 " +
  "C374,330 376,344 370,356 C364,368 358,380 350,390 " +
  "C342,400 332,410 320,418 C308,426 296,430 284,426 " +
  "C272,422 260,414 250,404 C240,394 232,382 226,368 " +
  "C220,354 218,340 220,326 C222,312 216,298 214,284 " +
  "C212,270 216,256 212,242 C208,228 214,214 218,202 " +
  "C222,190 232,180 228,168 C224,156 224,142 228,130 " +
  "C232,118 244,108 240,96 C236,84 240,70 250,60 " +
  "C260,50 268,38 276,28 C284,18 296,18 304,24 Z";

const ISLAND_1 = "M190,140 C186,134 182,126 186,120 C190,114 198,114 202,120 C206,126 204,136 198,140 Z";
const ISLAND_2 = "M178,108 C174,102 176,94 182,92 C188,90 194,96 192,104 C190,112 182,114 178,108 Z";

export function UKMap({
  className = "",
  showLabels = true,
  animated = true,
}: {
  className?: string;
  showLabels?: boolean;
  animated?: boolean;
}) {
  return (
    <div className={`relative select-none ${className}`}>
      <svg
        viewBox="0 0 520 480"
        className="w-full h-full"
        style={{ filter: "drop-shadow(0 8px 24px rgba(79,70,229,0.12))" }}
        aria-label="UK AI job market map"
      >
        <defs>
          <linearGradient id="ukLand" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#EEF2FF" />
            <stop offset="50%"  stopColor="#E0E7FF" />
            <stop offset="100%" stopColor="#C7D2FE" />
          </linearGradient>

          <linearGradient id="ukSea" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#F0F5FF" />
            <stop offset="100%" stopColor="#E8EFFE" />
          </linearGradient>

          <radialGradient id="lonGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#4F46E5" stopOpacity="0.45" />
            <stop offset="70%"  stopColor="#4F46E5" stopOpacity="0.1"  />
            <stop offset="100%" stopColor="#4F46E5" stopOpacity="0"    />
          </radialGradient>

          <filter id="dotGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="3.5" result="b" />
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="dotGlowBig" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="7" result="b" />
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>

          <radialGradient id="cityFill" cx="35%" cy="30%" r="65%">
            <stop offset="0%"   stopColor="#818CF8" />
            <stop offset="100%" stopColor="#4F46E5" />
          </radialGradient>
          <radialGradient id="lonFill" cx="35%" cy="30%" r="65%">
            <stop offset="0%"   stopColor="#6366F1" />
            <stop offset="100%" stopColor="#3730A3" />
          </radialGradient>

          <clipPath id="ukClip"><path d={UK_PATH} /></clipPath>
        </defs>

        {/* Sea background */}
        <rect x="0" y="0" width="520" height="480" fill="url(#ukSea)" rx="18" />

        {/* Grid lines */}
        {[80,130,180,230,280,330,380,430].map(y => (
          <line key={`h${y}`} x1="155" y1={y} x2="430" y2={y}
            stroke="#818CF8" strokeWidth="0.5" strokeDasharray="4 8" opacity="0.3" />
        ))}
        {[190,230,270,310,350,390].map(x => (
          <line key={`v${x}`} x1={x} y1="15" x2={x} y2="465"
            stroke="#818CF8" strokeWidth="0.5" strokeDasharray="4 8" opacity="0.3" />
        ))}

        {/* Country */}
        <path d={UK_PATH}  fill="url(#ukLand)" stroke="#818CF8" strokeWidth="1.8" strokeLinejoin="round" />
        <path d={ISLAND_1} fill="#DDD6FE"      stroke="#A5B4FC" strokeWidth="1"   />
        <path d={ISLAND_2} fill="#C7D2FE"      stroke="#A5B4FC" strokeWidth="0.8" />

        {/* Region labels */}
        <text x="304" y="140" textAnchor="middle" fontSize="8" fill="#C7D2FE"
          fontFamily="ui-sans-serif,system-ui,sans-serif" fontWeight="700" letterSpacing="3"
          transform="rotate(-8,304,140)">SCOTLAND</text>
        <text x="236" y="338" textAnchor="middle" fontSize="7" fill="#C7D2FE"
          fontFamily="ui-sans-serif,system-ui,sans-serif" fontWeight="700" letterSpacing="2"
          transform="rotate(-6,236,338)">WALES</text>
        <text x="316" y="288" textAnchor="middle" fontSize="8" fill="#C7D2FE"
          fontFamily="ui-sans-serif,system-ui,sans-serif" fontWeight="700" letterSpacing="2">ENGLAND</text>

        {/* Connection lines */}
        {CONNECTIONS.map(([a, b], i) => {
          const ca = CITIES[a], cb = CITIES[b];
          return (
            <line key={i}
              x1={ca.x} y1={ca.y} x2={cb.x} y2={cb.y}
              stroke="#818CF8" strokeWidth="0.8" strokeDasharray="3 5" opacity="0.35"
            />
          );
        })}

        {/* London ambient halo */}
        <circle cx={CITIES[0].x} cy={CITIES[0].y} r="60" fill="url(#lonGlow)" />

        {/* Cities */}
        {CITIES.map((city, i) => {
          const isLon = i === 0;
          return (
            <g key={city.name}>
              {isLon && animated && (
                <>
                  <circle cx={city.x} cy={city.y} r={city.r + 18}
                    fill="#4F46E5" fillOpacity="0.12"
                    style={{ animation: "ukPulse 2.8s ease-out infinite" }} />
                  <circle cx={city.x} cy={city.y} r={city.r + 10}
                    fill="none" stroke="#818CF8" strokeWidth="1" opacity="0.25"
                    style={{ animation: "ukPulse 2.8s ease-out 0.6s infinite" }} />
                </>
              )}
              {!isLon && i < 5 && (
                <circle cx={city.x} cy={city.y} r={city.r + 4}
                  fill="none" stroke="#818CF8" strokeWidth="0.7" opacity="0.3" />
              )}
              {/* Shadow */}
              <circle cx={city.x + 1} cy={city.y + 2} r={city.r} fill="#3730A3" opacity="0.18" />
              {/* Fill */}
              <circle cx={city.x} cy={city.y} r={city.r}
                fill={isLon ? "url(#lonFill)" : "url(#cityFill)"}
                filter={isLon ? "url(#dotGlowBig)" : "url(#dotGlow)"}
              />
              {/* Highlights */}
              <circle cx={city.x - city.r * 0.28} cy={city.y - city.r * 0.28}
                r={city.r * 0.38} fill="white" opacity="0.4" />
              <circle cx={city.x - city.r * 0.1} cy={city.y - city.r * 0.1}
                r={city.r * 0.18} fill="white" opacity="0.7" />
              {isLon && (
                <circle cx={city.x} cy={city.y} r={city.r + 5}
                  fill="none" stroke="#C7D2FE" strokeWidth="1.5"
                  strokeDasharray="8 4" opacity="0.55" />
              )}

              {/* Labels */}
              {showLabels && (
                <g>
                  <rect
                    x={city.x + city.r + 5}
                    y={city.y - (isLon ? 11 : 7)}
                    width={city.name.length * (isLon ? 6.5 : 5.8) + 10}
                    height={isLon ? 24 : 16}
                    rx="5" fill="white" opacity="0.9"
                  />
                  <text
                    x={city.x + city.r + 10}
                    y={city.y + (isLon ? 1 : 3)}
                    fontSize={isLon ? "10" : "8.5"}
                    fontFamily="ui-sans-serif,system-ui,sans-serif"
                    fontWeight={isLon ? "800" : "700"}
                    fill={isLon ? "#3730A3" : "#4338CA"}
                  >{city.name}</text>
                  {isLon && (
                    <text
                      x={city.x + city.r + 10}
                      y={city.y + 12}
                      fontSize="7.5"
                      fontFamily="ui-sans-serif,system-ui,sans-serif"
                      fill="#6366F1" fontWeight="600"
                    >{city.jobs.toLocaleString()} roles</text>
                  )}
                </g>
              )}
            </g>
          );
        })}

        {/* Legend */}
        <g transform="translate(14,370)">
          <rect x="0" y="0" width="148" height="88" rx="12"
            fill="white" opacity="0.93" stroke="#E0E7FF" strokeWidth="1.2" />
          <circle cx="20" cy="18" r="10" fill="url(#lonFill)" filter="url(#dotGlowBig)" />
          <circle cx="16" cy="14" r="3.5" fill="white" opacity="0.5" />
          <text x="36" y="14" fontSize="8.5" fontWeight="800" fill="#1E1B4B"
            fontFamily="ui-sans-serif,system-ui,sans-serif">London</text>
          <text x="36" y="24" fontSize="7" fill="#818CF8"
            fontFamily="ui-sans-serif,system-ui,sans-serif">4,820 AI roles · Capital hub</text>
          <circle cx="20" cy="46" r="7"   fill="url(#cityFill)" filter="url(#dotGlow)" />
          <circle cx="17" cy="43" r="2.5" fill="white" opacity="0.5" />
          <text x="36" y="42" fontSize="8.5" fontWeight="700" fill="#3730A3"
            fontFamily="ui-sans-serif,system-ui,sans-serif">Regional hubs</text>
          <text x="36" y="52" fontSize="7" fill="#818CF8"
            fontFamily="ui-sans-serif,system-ui,sans-serif">90 – 610 roles each</text>
          <line x1="8" y1="68" x2="34" y2="68"
            stroke="#818CF8" strokeWidth="0.9" strokeDasharray="3 4" opacity="0.6" />
          <text x="40" y="71.5" fontSize="7" fill="#94A3B8"
            fontFamily="ui-sans-serif,system-ui,sans-serif">City connections</text>
          <circle cx="14" cy="81" r="3" fill="#059669" />
          <circle cx="14" cy="81" r="5" fill="#059669" opacity="0.2" />
          <text x="24" y="84.5" fontSize="7" fill="#059669" fontWeight="700"
            fontFamily="ui-sans-serif,system-ui,sans-serif">Live · Updated weekly</text>
        </g>

        {/* Compass */}
        <g transform="translate(460,42)">
          <circle cx="0" cy="0" r="18" fill="white" opacity="0.9" stroke="#E0E7FF" strokeWidth="1.2" />
          <line x1="0" y1="-12" x2="0" y2="12" stroke="#818CF8" strokeWidth="0.9" />
          <line x1="-12" y1="0" x2="12" y2="0" stroke="#818CF8" strokeWidth="0.9" />
          <polygon points="0,-12 -3,-4 3,-4" fill="#4F46E5" opacity="0.8" />
          <text x="0"   y="-14" textAnchor="middle" fontSize="7.5" fill="#4F46E5" fontWeight="800"
            fontFamily="ui-sans-serif,sans-serif">N</text>
          <text x="0"   y="21"  textAnchor="middle" fontSize="6.5" fill="#A5B4FC"
            fontFamily="ui-sans-serif,sans-serif">S</text>
          <text x="-17" y="3"   textAnchor="middle" fontSize="6.5" fill="#A5B4FC"
            fontFamily="ui-sans-serif,sans-serif">W</text>
          <text x="17"  y="3"   textAnchor="middle" fontSize="6.5" fill="#A5B4FC"
            fontFamily="ui-sans-serif,sans-serif">E</text>
        </g>

        <style>{`
          @keyframes ukPulse {
            0%   { opacity: 0.6; }
            80%  { opacity: 0;   }
            100% { opacity: 0;   }
          }
        `}</style>
      </svg>
    </div>
  );
}
