export interface MechanismParams {
  r2: number; // Crank length (in)
  r3: number; // Connecting rod length (in)
  omega2: number; // Crank angular velocity (rad/s)
  theta2: number; // Current crank angle (degrees)
}

export interface KinematicState {
  theta2: number; // Input angle (deg)
  theta3: number; // Coupler angle (deg)
  sliderPos: number; // Slider position (in)
}

export interface ChartDataPoint {
  angle: number;
  position: number;
}