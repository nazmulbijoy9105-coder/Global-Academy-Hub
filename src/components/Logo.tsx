import React from "react";

interface LogoProps {
  size?: number;
  className?: string;
  showBg?: boolean;
}

export default function Logo({ size = 32, className = "", showBg = false }: LogoProps) {
  // Center of our 100x100 coordinate system
  const cx = 50;
  const cy = 50;
  
  // Radii for the "G" ring and the Globe
  const rGlobe = 19;
  const rInner = 24;
  const rOuter = 44;

  // Polar to Cartesian conversion helper for radial arcs
  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0; // Offset by -90 to align 0 with the top if needed, but we'll use standard math
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  // Helper to generate the path for an annular sector (ring segment)
  // Angles are in degrees, clockwise from 3 o'clock (0 degrees)
  const getAnnularSectorPath = (
    startAngle: number,
    endAngle: number
  ) => {
    const startRad = (startAngle * Math.PI) / 180.0;
    const endRad = (endAngle * Math.PI) / 180.0;

    const startOuter = {
      x: cx + rOuter * Math.cos(startRad),
      y: cy + rOuter * Math.sin(startRad),
    };
    const endOuter = {
      x: cx + rOuter * Math.cos(endRad),
      y: cy + rOuter * Math.sin(endRad),
    };
    const startInner = {
      x: cx + rInner * Math.cos(startRad),
      y: cy + rInner * Math.sin(startRad),
    };
    const endInner = {
      x: cx + rInner * Math.cos(endRad),
      y: cy + rInner * Math.sin(endRad),
    };

    const largeArcFlag = Math.abs(endAngle - startAngle) > 180 ? 1 : 0;
    const sweepFlag = endAngle > startAngle ? 1 : 0;

    return [
      `M ${startOuter.x} ${startOuter.y}`,
      `A ${rOuter} ${rOuter} 0 ${largeArcFlag} ${sweepFlag} ${endOuter.x} ${endOuter.y}`,
      `L ${endInner.x} ${endInner.y}`,
      `A ${rInner} ${rInner} 0 ${largeArcFlag} ${sweepFlag === 1 ? 0 : 1} ${startInner.x} ${startInner.y}`,
      `Z`,
    ].join(" ");
  };

  // Colors based on the user's logo image
  const colorTealBlue = "#207ab7"; // Medium blue / teal-blue for top/bottom segments
  const colorDarkNavy = "#0f3057"; // Deep navy blue for left segments and the horizontal bar
  const colorGreen = "#2ecc71";    // Vivid green for the globe

  return (
    <div 
      className={`inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Optional App-icon style white card background with rounded-corners and border */}
        {showBg && (
          <rect
            x="2"
            y="2"
            width="96"
            height="96"
            rx="24"
            fill="white"
            stroke="#1e293b"
            strokeWidth="1.5"
          />
        )}

        {/* Group containing the logo graphics, centered */}
        <g id="gah-logo-graphics">
          {/* 1. THE GREEN GLOBE IN THE CENTER */}
          {/* We clip the globe so the horizontal bar has a clean cut on the right */}
          <g>
            {/* Base Green Sphere */}
            <circle cx={cx} cy={cy} r={rGlobe} fill={colorGreen} />

            {/* Latitude & Longitude Grid Lines (White) */}
            {/* Center Vertical */}
            <line x1={cx} y1={cy - rGlobe} x2={cx} y2={cy + rGlobe} stroke="white" strokeWidth="1.5" />
            {/* Center Horizontal */}
            <line x1={cx - rGlobe} y1={cy} x2={cx + rGlobe} y2={cy} stroke="white" strokeWidth="1.5" />
            
            {/* Longitude Arcs */}
            <path
              d={`M ${cx} ${cy - rGlobe} A ${rGlobe * 0.55} ${rGlobe} 0 0 0 ${cx} ${cy + rGlobe}`}
              stroke="white"
              strokeWidth="1.5"
            />
            <path
              d={`M ${cx} ${cy - rGlobe} A ${rGlobe * 0.55} ${rGlobe} 0 0 1 ${cx} ${cy + rGlobe}`}
              stroke="white"
              strokeWidth="1.5"
            />

            {/* Latitude Arcs */}
            <path
              d={`M ${cx - rGlobe * 0.866} ${cy - rGlobe * 0.5} A ${rGlobe} ${rGlobe * 0.5} 0 0 1 ${cx + rGlobe * 0.866} ${cy - rGlobe * 0.5}`}
              stroke="white"
              strokeWidth="1.5"
            />
            <path
              d={`M ${cx - rGlobe * 0.866} ${cy + rGlobe * 0.5} A ${rGlobe} ${rGlobe * 0.5} 0 0 0 ${cx + rGlobe * 0.866} ${cy + rGlobe * 0.5}`}
              stroke="white"
              strokeWidth="1.5"
            />
          </g>

          {/* 2. THE STYLIZED "G" OUTER SEGMENTS */}
          {/* Top Segment: Medium Teal-Blue. Spans from top-left (225 degrees) to top-right (325 degrees) */}
          <path d={getAnnularSectorPath(225, 325)} fill={colorTealBlue} />

          {/* Left-Top Segment: Dark Navy. Spans from left-middle (180) to top-left (225) */}
          <path d={getAnnularSectorPath(180, 225)} fill={colorDarkNavy} />

          {/* Left-Bottom Segment: Dark Navy. Spans from bottom-left (135) to left-middle (180) */}
          <path d={getAnnularSectorPath(135, 180)} fill={colorDarkNavy} />

          {/* Bottom Segment: Medium Teal-Blue. Spans from bottom-right (35) to bottom-left (135) */}
          <path d={getAnnularSectorPath(35, 135)} fill={colorTealBlue} />

          {/* 3. HORIZONTAL BAR OF THE "G" */}
          {/* Dark Navy block overlaying the right of the globe */}
          {/* Top is exactly at y=50, extending down to y=64. Starts from x=52 to x=76. */}
          <path
            d="M 52.5 50 L 76 50 L 76 65 L 52.5 65 Z"
            fill={colorDarkNavy}
          />

          {/* 4. SHARP WHITE DIVIDING LINES & BORDERS */}
          {/* White border circle around the globe to separate it from outer segments */}
          <circle cx={cx} cy={cy} r={rInner} stroke="white" strokeWidth="2.5" />

          {/* Left Equator Separator Line (from outer ring through to globe boundary) */}
          <line
            x1={cx - rOuter - 1}
            y1={cy}
            x2={cx - rGlobe}
            y2={cy}
            stroke="white"
            strokeWidth="2.5"
          />

          {/* Top-Left Radial Separator Line (at 225 degrees) */}
          <line
            x1={cx + (rOuter + 1) * Math.cos((225 * Math.PI) / 180)}
            y1={cy + (rOuter + 1) * Math.sin((225 * Math.PI) / 180)}
            x2={cx + (rGlobe - 1) * Math.cos((225 * Math.PI) / 180)}
            y2={cy + (rGlobe - 1) * Math.sin((225 * Math.PI) / 180)}
            stroke="white"
            strokeWidth="2.5"
          />

          {/* Bottom-Left Radial Separator Line (at 135 degrees) */}
          <line
            x1={cx + (rOuter + 1) * Math.cos((135 * Math.PI) / 180)}
            y1={cy + (rOuter + 1) * Math.sin((135 * Math.PI) / 180)}
            x2={cx + (rGlobe - 1) * Math.cos((135 * Math.PI) / 180)}
            y2={cy + (rGlobe - 1) * Math.sin((135 * Math.PI) / 180)}
            stroke="white"
            strokeWidth="2.5"
          />

          {/* Vertical Separator for the Horizontal Bar (on its left edge) */}
          <line
            x1={51.25}
            y1={48}
            x2={51.25}
            y2={67}
            stroke="white"
            strokeWidth="2.5"
          />

          {/* Bottom horizontal cutoff for the Horizontal Bar (separating it from the bottom segment) */}
          <line
            x1={51.25}
            y1={66.25}
            x2={77.25}
            y2={66.25}
            stroke="white"
            strokeWidth="2.5"
          />
        </g>
      </svg>
    </div>
  );
}
