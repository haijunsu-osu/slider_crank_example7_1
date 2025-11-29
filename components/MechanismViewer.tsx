import React from 'react';
import { KinematicState, MechanismParams } from '../types';

interface Props {
  params: MechanismParams;
  state: KinematicState;
}

const MechanismViewer: React.FC<Props> = ({ params, state }) => {
  const { r2, r3 } = params;
  const { theta2, theta3, sliderPos } = state;

  // Determine scale and view box to strictly center the mechanism
  // The mechanism spans from x = -r2 (crank at 180) to x = r2 + r3 (slider at 0)
  // Bounding box Width = 2*r2 + r3
  // Bounding box Height = 2*r2 (crank rotation diameter)
  
  const minX = -r2;
  const maxX = r2 + r3;
  const bboxWidth = maxX - minX;
  const bboxHeight = 2 * r2;

  // Padding
  const padding = Math.max(r2, r3) * 0.5;
  
  // Calculate SVG ViewBox
  // We want to center the bounding box in the view
  const scale = 20; // Base scale for stroke widths, pixels per inch roughly
  
  // Let's use a dynamic viewbox based on mechanism dimensions
  const vbMinX = minX - padding;
  const vbMinY = -r2 - padding; // Y is up-negative in standard math, but let's handle SVG Y-down
  const vbWidth = bboxWidth + 2 * padding;
  const vbHeight = bboxHeight + 2 * padding;

  // Transform coordinates for SVG (Y-down)
  // We'll keep the origin (0,0) at the crank pivot
  // And just set the viewBox such that (0,0) is correctly placed relative to the borders
  
  // SVG ViewBox: min-x, min-y, width, height
  // Since Y is inverted in SVG (positive down), and our calculations assume Y positive up (usually),
  // we can just flip the Y coordinates in drawing or flip the viewBox logic.
  // Let's draw with Y-down logic:
  // Crank pivot is (0,0)
  // Crank end: (r2 cos th, -r2 sin th)
  // Slider: (x, 0)
  
  // Min Y in SVG coords (highest point) is -r2
  // Max Y in SVG coords (lowest point) is +r2
  // So viewBox Y range should be [-r2 - padding, r2 + padding]
  
  const viewBoxStr = `${minX - padding} ${-r2 - padding} ${bboxWidth + 2 * padding} ${bboxHeight + 2 * padding}`;

  const degToRad = (deg: number) => deg * (Math.PI / 180);

  // Coordinates
  // Note: Y is negative for 'up' in standard SVG if we want 0,0 to be center and positive angles CCW
  const crankEndX = r2 * Math.cos(degToRad(theta2));
  const crankEndY = -r2 * Math.sin(degToRad(theta2)); 

  const sliderX = sliderPos;
  const sliderY = 0;

  return (
    <div className="w-full h-full flex items-center justify-center bg-slate-900 rounded-xl border border-slate-700 shadow-inner overflow-hidden relative">
      <svg
        width="100%"
        height="100%"
        viewBox={viewBoxStr}
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full"
      >
        <defs>
           {/* Vector effect non-scaling-stroke keeps lines thin regardless of zoom */}
        </defs>

        {/* Grid / Ground Line */}
        <line 
            x1={minX - padding} y1={0} 
            x2={maxX + padding} y2={0} 
            stroke="#334155" 
            strokeWidth={bboxWidth * 0.005}
            strokeDasharray={`${bboxWidth * 0.02} ${bboxWidth * 0.02}`}
        />

        {/* Crank (r2) */}
        <line
          x1={0}
          y1={0}
          x2={crankEndX}
          y2={crankEndY}
          stroke="#38bdf8"
          strokeWidth={bboxWidth * 0.015}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        
        {/* Connecting Rod (r3) */}
        <line
          x1={crankEndX}
          y1={crankEndY}
          x2={sliderX}
          y2={sliderY}
          stroke="#a3e635"
          strokeWidth={bboxWidth * 0.015}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />

        {/* Joints */}
        <circle cx={0} cy={0} r={bboxWidth * 0.02} fill="#0ea5e9" />
        <circle cx={crankEndX} cy={crankEndY} r={bboxWidth * 0.015} fill="#facc15" />
        <circle cx={sliderX} cy={sliderY} r={bboxWidth * 0.015} fill="#facc15" />

        {/* Slider Block */}
        <rect
          x={sliderX - bboxWidth * 0.04}
          y={sliderY - bboxWidth * 0.025}
          width={bboxWidth * 0.08}
          height={bboxWidth * 0.05}
          fill="#f8fafc"
          stroke="#475569"
          strokeWidth={bboxWidth * 0.005}
          rx={bboxWidth * 0.01}
        />

        {/* Labels */}
        <text x={0} y={bboxWidth * 0.05} fill="#94a3b8" fontSize={bboxWidth * 0.03} textAnchor="middle" fontFamily="monospace">O2</text>
        <text x={sliderX} y={bboxWidth * 0.06} fill="#f8fafc" fontSize={bboxWidth * 0.03} textAnchor="middle" fontFamily="monospace">B4</text>

      </svg>
      
      <div className="absolute top-4 right-4 bg-slate-800/80 p-3 rounded-lg backdrop-blur text-xs font-mono text-slate-300 border border-slate-700 pointer-events-none">
        <div>Theta2: {theta2.toFixed(1)}°</div>
        <div>Theta3: {theta3.toFixed(1)}°</div>
        <div>Slider X: {sliderPos.toFixed(2)} in</div>
      </div>
    </div>
  );
};

export default MechanismViewer;