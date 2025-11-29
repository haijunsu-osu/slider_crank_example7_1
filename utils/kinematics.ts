import { MechanismParams, KinematicState, ChartDataPoint } from '../types';

const degToRad = (deg: number) => deg * (Math.PI / 180);
const radToDeg = (rad: number) => rad * (180 / Math.PI);

export const calculateKinematics = (params: MechanismParams): KinematicState => {
  const { r2, r3, theta2 } = params;
  const theta2Rad = degToRad(theta2);

  // Geometric constraint: r2 * sin(theta2) = r3 * sin(phi)
  const h = r2 * Math.sin(theta2Rad);
  
  // Check validity
  if (Math.abs(h) > r3) {
    // Mechanism cannot assemble
    return {
      theta2,
      theta3: 0,
      sliderPos: 0,
    };
  }

  // theta3 calculation (Standard convention where theta3 is measured ccw from x-axis)
  // For inline slider crank: r2*sin(theta2) + r3*sin(theta3) = 0 => sin(theta3) = -(r2/r3)sin(theta2)
  const sinTheta3 = -(r2 / r3) * Math.sin(theta2Rad);
  const theta3Rad = Math.asin(sinTheta3);
  const theta3 = radToDeg(theta3Rad);

  // Position
  // x = r2 cos(theta2) + r3 cos(theta3)
  const sliderPos = r2 * Math.cos(theta2Rad) + r3 * Math.cos(theta3Rad);

  return {
    theta2,
    theta3,
    sliderPos,
  };
};

export const generateCycleData = (r2: number, r3: number, omega2: number): ChartDataPoint[] => {
  const data: ChartDataPoint[] = [];
  for (let i = 0; i <= 360; i += 2) {
    const state = calculateKinematics({ r2, r3, omega2, theta2: i });
    data.push({
      angle: i,
      position: state.sliderPos,
    });
  }
  return data;
};