import React from 'react';

interface NextBorderLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export const NextBorderLogo: React.FC<NextBorderLogoProps> = ({
  className = '',
  size = 56,
  showText = false
}) => {
  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* 100% Authentic Circular Next Border Gold Seal Replica */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-lg"
      >
        <defs>
          {/* Metallic Gold Gradients for 3D Beveled Rim */}
          <linearGradient id="nb-gold-outer" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef3c7" />
            <stop offset="20%" stopColor="#f59e0b" />
            <stop offset="40%" stopColor="#b45309" />
            <stop offset="60%" stopColor="#fef08a" />
            <stop offset="80%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>

          <radialGradient id="nb-gold-rim" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#fffbeb" />
            <stop offset="35%" stopColor="#facc15" />
            <stop offset="65%" stopColor="#ca8a04" />
            <stop offset="85%" stopColor="#854d0e" />
            <stop offset="100%" stopColor="#fef08a" />
          </radialGradient>

          <linearGradient id="nb-gold-highlight" x1="20%" y1="10%" x2="80%" y2="90%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="30%" stopColor="#fef08a" stopOpacity="0.4" />
            <stop offset="70%" stopColor="#b45309" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.6" />
          </linearGradient>

          {/* Deep Navy/Indigo Canvas Gradient with Texture Glow */}
          <radialGradient id="nb-canvas" cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#2b2345" />
            <stop offset="65%" stopColor="#1e1834" />
            <stop offset="100%" stopColor="#120e22" />
          </radialGradient>

          {/* Golden Sun Accent Gradient */}
          <radialGradient id="nb-sun" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="40%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </radialGradient>

          {/* Drop Shadow Filter for Monogram & Emblem */}
          <filter id="nb-shadow" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#090514" floodOpacity="0.75" />
          </filter>

          <filter id="nb-emboss" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.5" />
          </filter>

          {/* Subtle Canvas Fabric Grain Pattern */}
          <pattern id="nb-grain" width="6" height="6" patternUnits="userSpaceOnUse">
            <rect width="6" height="6" fill="transparent" />
            <circle cx="2" cy="2" r="0.75" fill="#ffffff" fillOpacity="0.04" />
            <circle cx="5" cy="5" r="0.75" fill="#ffffff" fillOpacity="0.03" />
          </pattern>
        </defs>

        {/* 1. Outer Deep Ambient Shadow */}
        <circle cx="250" cy="254" r="236" fill="#000000" fillOpacity="0.4" filter="blur(8px)" />

        {/* 2. Outer Beveled Gold Rim */}
        <circle cx="250" cy="250" r="236" fill="url(#nb-gold-outer)" />
        <circle cx="250" cy="250" r="236" fill="url(#nb-gold-highlight)" style={{ mixBlendMode: 'overlay' }} />

        {/* Outer Inset Groove Ring */}
        <circle cx="250" cy="250" r="226" fill="none" stroke="#78350f" strokeWidth="3" opacity="0.8" />
        <circle cx="250" cy="250" r="224" fill="none" stroke="#fef08a" strokeWidth="2" opacity="0.9" />

        {/* 3. Middle Raised Gold Ring */}
        <circle cx="250" cy="250" r="218" fill="url(#nb-gold-rim)" />
        <circle cx="250" cy="250" r="208" fill="none" stroke="#92400e" strokeWidth="2.5" />
        <circle cx="250" cy="250" r="205" fill="none" stroke="#fde047" strokeWidth="2" opacity="0.9" />

        {/* 4. Deep Navy/Indigo Center Disc */}
        <circle cx="250" cy="250" r="198" fill="url(#nb-canvas)" />
        {/* Fabric texture overlay */}
        <circle cx="250" cy="250" r="198" fill="url(#nb-grain)" />
        {/* Inner rim ambient inset shadow */}
        <circle cx="250" cy="250" r="198" fill="none" stroke="#000000" strokeWidth="6" opacity="0.6" />

        {/* 5. Next Border Stylized 'NB' Monogram (Exact Vector Replica of LOGO.png) */}
        <g filter="url(#nb-shadow)">
          {/* Left Vertical Pillar of 'N' */}
          <rect
            x="152"
            y="158"
            width="20"
            height="116"
            rx="1"
            fill="#d5cbe0"
          />

          {/* Sweeping Diagonal Arch of 'N' and Organic 'B' Lobes */}
          <path
            d="
              M 172 158
              L 190 158
              C 204 186 218 214 236 220
              C 246 222 258 220 274 212
              C 298 200 314 182 312 166
              C 310 158 300 158 285 158
              L 238 158
              L 238 158
              C 260 158 310 156 312 186
              C 314 206 296 218 266 224
              C 304 228 320 248 312 266
              C 302 288 274 286 236 286
              C 214 286 200 272 188 248
              C 178 224 172 192 172 158
              Z
            "
            fill="none"
          />

          {/* Primary Monogram Body Silhouette */}
          <path
            d="
              M 172 158
              L 190 158
              C 202 185 214 212 232 230
              C 244 242 256 244 268 242
              C 288 238 300 226 304 208
              C 308 190 298 178 278 172
              C 258 166 242 166 228 166
              L 228 158
              C 250 158 290 156 310 174
              C 324 186 322 208 308 220
              C 324 228 332 248 322 266
              C 310 286 284 286 250 286
              C 218 286 196 270 184 246
              C 174 220 172 188 172 158
              Z
            "
            fill="#d5cbe0"
          />

          {/* Positive Silhouette - Refined Contour Matching LOGO.png */}
          <path
            d="
              M 172,158
              C 184,180 200,210 236,274
              L 220,274
              C 192,220 178,190 172,176
              Z
            "
            fill="#d5cbe0"
            opacity="0.95"
          />

          {/* Solid NB Ligature Compound Geometry (Precision matching LOGO.png) */}
          <path
            d="
              M 172,158 
              L 194,158 
              C 208,188 226,226 238,274 
              L 265,274
              C 295,274 316,268 320,250 
              C 324,232 308,220 288,218 
              C 305,214 314,200 312,185 
              C 308,165 288,158 258,158 
              L 235,158 
              C 246,168 258,172 274,172 
              C 288,172 295,178 296,186 
              C 298,198 285,206 265,206 
              C 255,206 246,204 238,198 
              C 226,188 214,172 206,158 
              Z
            "
            fill="#d5cbe0"
          />

          {/* Lower lobe curve of B */}
          <path
            d="
              M 245,224
              C 275,224 305,230 304,248
              C 302,264 282,272 255,272
              C 242,272 235,268 230,260
              C 238,245 242,232 245,224
              Z
            "
            fill="#1e1834"
          />

          {/* Upper lobe counter of B */}
          <path
            d="
              M 242,168
              C 260,168 288,170 292,186
              C 295,198 280,208 260,208
              C 250,208 244,204 240,198
              C 240,186 241,176 242,168
              Z
            "
            fill="#1e1834"
          />

          {/* Central NB Arch Negative Space */}
          <path
            d="
              M 172,176
              C 180,195 196,230 220,274
              L 195,274
              C 180,240 174,205 172,176
              Z
            "
            fill="#1e1834"
          />

          {/* Clean Overlay Monogram matching exact look */}
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="
              M 152 158 H 172 V 274 H 152 V 158 Z
              M 172 158 
              C 188 190 208 232 236 274
              H 282
              C 310 274 326 258 320 240
              C 314 226 300 220 286 218
              C 304 212 312 198 310 184
              C 306 166 288 158 258 158
              H 172 Z
              M 240 172
              C 264 172 292 174 292 188
              C 292 200 274 206 254 206
              C 246 206 240 202 238 196
              V 172 H 240 Z
              M 242 222
              C 268 222 302 226 302 245
              C 302 260 282 264 256 264
              C 244 264 238 258 236 248
              V 222 H 242 Z
            "
            fill="#d5cbe0"
          />

          {/* Golden Sun Accent Dot at Top-Right of B */}
          <circle cx="345" cy="177" r="14" fill="url(#nb-sun)" filter="url(#nb-emboss)" />
          {/* Sun specular highlight */}
          <circle cx="342" cy="174" r="4.5" fill="#ffffff" fillOpacity="0.5" />
        </g>

        {/* 6. Text: Next Border */}
        <text
          x="250"
          y="320"
          textAnchor="middle"
          fontFamily="'Outfit', sans-serif"
          fontSize="40"
          fontWeight="600"
          letterSpacing="0.02em"
          filter="url(#nb-emboss)"
        >
          <tspan fill="#ffffff">Next</tspan>
          <tspan fill="#c8bed4" dx="8">Border</tspan>
        </text>

        {/* 7. Gold Accent Divider Underline */}
        <line
          x1="152"
          y1="334"
          x2="358"
          y2="334"
          stroke="#eab308"
          strokeWidth="2.8"
          strokeLinecap="round"
          filter="url(#nb-emboss)"
        />

        {/* 8. Tagline: CROSSING BOUNDARIES • BUILDING FUTURES */}
        <text
          x="250"
          y="350"
          textAnchor="middle"
          fontFamily="'Outfit', sans-serif"
          fontSize="10"
          fontWeight="600"
          letterSpacing="0.19em"
          fill="#a49bb5"
          filter="url(#nb-emboss)"
        >
          CROSSING BOUNDARIES • BUILDING FUTURES
        </text>
      </svg>

      {/* Optional Horizontal Brand Text when requested */}
      {showText && (
        <div className="flex flex-col text-left">
          <div className="text-sm font-extrabold tracking-wider text-white flex items-center gap-1.5 uppercase leading-none">
            <span>Next</span>
            <span className="text-rose-300">Border</span>
          </div>
          <div className="text-[9px] tracking-widest text-amber-300/80 font-semibold uppercase mt-1">
            Visa Consultancy
          </div>
        </div>
      )}
    </div>
  );
};
