export function Atmosphere() {
  return (
    <div className="atmosphere" aria-hidden="true">
      <div className="atmosphere-sky" />
      <div className="atm-sun" />
      <div className="atm-dusk" />
      <svg className="atm-land" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="atm-water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#d5e4ea" stopOpacity="0.2" />
            <stop offset="1" stopColor="#9eb4b4" stopOpacity="0.45" />
          </linearGradient>
          <filter id="atm-soft" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="10" />
          </filter>
        </defs>
        <path
          d="M0 520 C180 470 260 500 420 450 C620 386 760 470 980 410 C1160 362 1280 420 1440 370 L1440 900 L0 900 Z"
          fill="#c5d5cf"
          opacity="0.55"
        />
        <path
          d="M0 610 C140 560 240 590 380 545 C560 488 700 560 900 520 C1100 478 1240 530 1440 490 L1440 900 L0 900 Z"
          fill="#a9bfb4"
          opacity="0.7"
        />
        <path
          d="M0 700 C200 650 320 690 520 650 C760 600 900 670 1120 640 C1260 622 1360 660 1440 640 L1440 900 L0 900 Z"
          fill="#8eaa9d"
        />
        <g fill="#6f8c80" opacity="0.85">
          <path d="M70 690 l28-78 28 78z" />
          <path d="M108 704 l22-60 22 60z" />
          <path d="M40 720 l18-46 18 46z" />
          <path d="M150 710 l20-52 20 52z" />
          <path d="M230 730 l16-40 16 40z" />
          <path d="M1180 680 l26-70 26 70z" />
          <path d="M1224 700 l18-48 18 48z" />
          <path d="M1280 690 l24-64 24 64z" />
          <path d="M1340 720 l16-42 16 42z" />
        </g>
        <ellipse cx="480" cy="640" rx="260" ry="36" fill="#f7f4ee" opacity="0.35" filter="url(#atm-soft)" />
        <ellipse cx="980" cy="690" rx="300" ry="40" fill="#f7f4ee" opacity="0.28" filter="url(#atm-soft)" />
        <rect x="0" y="760" width="1440" height="140" fill="url(#atm-water)" />
      </svg>
      <div className="atm-mist" />
      <svg className="atm-grain" aria-hidden="true">
        <filter id="atm-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#atm-grain)" />
      </svg>
    </div>
  );
}

export function HeroScene() {
  return (
    <svg className="hero-scene" viewBox="0 0 1200 420" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="hero-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f6d3ae" />
          <stop offset="28%" stopColor="#f7e3cf" />
          <stop offset="58%" stopColor="#d7e6ef" />
          <stop offset="100%" stopColor="#c5d7cf" />
        </linearGradient>
        <radialGradient id="hero-sun" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fffaf2" />
          <stop offset="35%" stopColor="#ffe3bf" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#ffe3bf" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hero-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f3e2cf" />
          <stop offset="40%" stopColor="#d5e3ea" />
          <stop offset="100%" stopColor="#b7cfc8" />
        </linearGradient>
        <filter id="hero-mist" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="12" />
        </filter>
      </defs>
      <rect width="1200" height="420" fill="url(#hero-sky)" />
      <circle cx="690" cy="150" r="120" fill="url(#hero-sun)" />
      <circle cx="690" cy="150" r="26" fill="#fff8ee" />
      <path
        d="M0 230 C140 200 220 214 340 186 C470 154 560 196 700 176 C860 152 960 198 1200 160 L1200 420 L0 420 Z"
        fill="#d5e2df"
        opacity="0.55"
      />
      <path
        d="M0 268 C160 236 250 250 390 226 C560 196 680 246 860 220 C1000 200 1100 236 1200 214 L1200 420 L0 420 Z"
        fill="#b7ccc4"
        opacity="0.85"
      />
      <g fill="#7f9a8e">
        <path d="M80 250 l22-58 22 58z" />
        <path d="M112 262 l16-42 16 42z" />
        <path d="M46 268 l14-36 14 36z" />
        <path d="M180 258 l18-48 18 48z" />
        <path d="M980 246 l20-52 20 52z" />
        <path d="M1012 258 l14-36 14 36z" />
        <path d="M1060 250 l18-46 18 46z" />
        <path d="M240 270 l12-30 12 30z" />
      </g>
      <rect x="0" y="250" width="1200" height="170" fill="url(#hero-water)" opacity="0.92" />
      <ellipse cx="690" cy="268" rx="70" ry="10" fill="#fff6ea" opacity="0.7" />
      <ellipse cx="690" cy="300" rx="46" ry="16" fill="#fff1dc" opacity="0.35" filter="url(#hero-mist)" />
      <g filter="url(#hero-mist)">
        <ellipse className="hero-mist" cx="280" cy="248" rx="220" ry="22" fill="#fffaf6" opacity="0.45" />
        <ellipse className="hero-mist delay" cx="860" cy="260" rx="260" ry="26" fill="#fffaf6" opacity="0.38" />
      </g>
      <path d="M520 268 C620 300 760 300 860 268" fill="none" stroke="#fffaf4" strokeOpacity="0.35" strokeWidth="8" />
    </svg>
  );
}
