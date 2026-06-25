"use client";

interface CityDot {
  name: string;
  x: number;
  y: number;
  size: number;
  jobs: number;
}

const CITIES: CityDot[] = [
  { name: "London",     x: 340, y: 370, size: 22, jobs: 4820 },
  { name: "Manchester", x: 268, y: 198, size: 10, jobs: 610  },
  { name: "Edinburgh",  x: 270, y: 90,  size:  8, jobs: 380  },
  { name: "Cambridge",  x: 355, y: 310, size:  9, jobs: 540  },
  { name: "Bristol",    x: 245, y: 355, size:  7, jobs: 290  },
  { name: "Oxford",     x: 300, y: 335, size:  7, jobs: 260  },
  { name: "Leeds",      x: 295, y: 210, size:  6, jobs: 160  },
  { name: "Birmingham", x: 290, y: 285, size:  7, jobs: 195  },
  { name: "Glasgow",    x: 250, y: 100, size:  6, jobs: 130  },
  { name: "Liverpool",  x: 255, y: 225, size:  6, jobs: 120  },
];

const UK_PATH =
  "M290 30 L310 28 L325 40 L340 38 L355 50 L360 65 L370 75 L375 90 " +
  "L380 105 L385 118 L378 130 L390 145 L395 158 L385 168 L390 182 " +
  "L382 195 L390 210 L388 225 L380 238 L385 252 L378 265 " +
  "L385 278 L378 295 L385 308 L380 320 L372 332 " +
  "L378 345 L374 360 L368 372 L362 385 L355 398 " +
  "L348 410 L340 420 L332 415 L325 428 L318 435 " +
  "L310 430 L302 440 L295 445 L288 438 L280 450 " +
  "L272 445 L265 435 L258 425 L252 415 " +
  "L245 405 L240 390 L235 375 L240 360 " +
  "L232 345 L228 330 L222 315 L218 300 " +
  "L215 285 L220 270 L215 255 L218 240 " +
  "L225 228 L220 215 L228 202 L235 190 " +
  "L230 178 L238 165 L232 150 L238 138 " +
  "L242 125 L250 112 L245 98 L252 85 " +
  "L260 73 L268 62 L275 50 L282 40 Z " +
  // Scotland bump
  "M248 95 L255 82 L262 72 L270 62 L278 53 L285 45 L290 38 L295 30 " +
  "L285 28 L275 32 L265 42 L255 52 L248 65 L242 78 Z";

interface UKMapProps {
  className?: string;
  showLabels?: boolean;
  animated?: boolean;
}

export function UKMap({ className = "", showLabels = true, animated = true }: UKMapProps) {
  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox="0 0 500 480"
        className="w-full h-full"
        aria-label="UK map showing AI job concentration by city"
      >
        <defs>
          <radialGradient id="mapGlow" cx="50%" cy="60%" r="50%">
            <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#4F46E5" stopOpacity="0" />
          </radialGradient>
          <filter id="cityGlow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background glow */}
        <ellipse cx="290" cy="280" rx="180" ry="220" fill="url(#mapGlow)" />

        {/* UK outline */}
        <path
          d={UK_PATH}
          fill="#F1F5F9"
          stroke="#CBD5E1"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Grid lines */}
        {[100, 150, 200, 250, 300, 350, 400].map((y) => (
          <line key={y} x1="180" y1={y} x2="420" y2={y} stroke="#E2E8F0" strokeWidth="0.5" strokeDasharray="4 4" />
        ))}
        {[200, 250, 300, 350, 400].map((x) => (
          <line key={x} x1={x} y1="30" x2={x} y2="460" stroke="#E2E8F0" strokeWidth="0.5" strokeDasharray="4 4" />
        ))}

        {/* City dots */}
        {CITIES.map((city, i) => (
          <g key={city.name} filter="url(#cityGlow)">
            {/* Pulse ring */}
            {animated && i < 3 && (
              <circle
                cx={city.x}
                cy={city.y}
                r={city.size + 8}
                fill="none"
                stroke="#4F46E5"
                strokeWidth="1"
                strokeOpacity="0.3"
                style={{
                  animation: `pulse 2.5s ease-in-out ${i * 0.4}s infinite`,
                  transformOrigin: `${city.x}px ${city.y}px`,
                }}
              />
            )}
            {/* Dot */}
            <circle
              cx={city.x}
              cy={city.y}
              r={city.size}
              fill={i === 0 ? "#4F46E5" : "#818CF8"}
              fillOpacity={i === 0 ? 1 : 0.75}
            />
            <circle cx={city.x} cy={city.y} r={city.size * 0.45} fill="white" fillOpacity="0.6" />

            {/* Label */}
            {showLabels && (
              <>
                <text
                  x={city.x + city.size + 5}
                  y={city.y + 4}
                  fontSize="10"
                  fontFamily="system-ui, sans-serif"
                  fontWeight="600"
                  fill="#475569"
                >
                  {city.name}
                </text>
                {i < 5 && (
                  <text
                    x={city.x + city.size + 5}
                    y={city.y + 15}
                    fontSize="8"
                    fontFamily="system-ui, sans-serif"
                    fill="#94A3B8"
                  >
                    {city.jobs.toLocaleString()} roles
                  </text>
                )}
              </>
            )}
          </g>
        ))}

        {/* Legend */}
        <g transform="translate(30, 380)">
          <rect x="0" y="0" width="120" height="60" rx="8" fill="white" stroke="#E2E8F0" strokeWidth="1" />
          <circle cx="16" cy="16" r="8" fill="#4F46E5" />
          <circle cx="16" cy="16" r="3.5" fill="white" fillOpacity="0.6" />
          <text x="30" y="13" fontSize="8" fontWeight="700" fill="#0F172A" fontFamily="system-ui, sans-serif">London hub</text>
          <text x="30" y="23" fontSize="7" fill="#94A3B8" fontFamily="system-ui, sans-serif">4,820 active roles</text>
          <circle cx="16" cy="42" r="5" fill="#818CF8" fillOpacity="0.75" />
          <circle cx="16" cy="42" r="2.2" fill="white" fillOpacity="0.6" />
          <text x="30" y="39" fontSize="8" fontWeight="600" fill="#475569" fontFamily="system-ui, sans-serif">Regional hub</text>
          <text x="30" y="49" fontSize="7" fill="#94A3B8" fontFamily="system-ui, sans-serif">120–610 roles</text>
        </g>
      </svg>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.6); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
