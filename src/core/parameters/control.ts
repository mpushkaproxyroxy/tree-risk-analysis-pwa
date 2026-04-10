export const CONTROL_LIMITS = {
  maxCorrection: 1,
  deadbandDegrees: 1.5,
} as const;

export const ROBOT_CONTROL_PRESETS = {
  inspectionRover: {
    gain: 0.08,
    damping: 0.12,
  },
} as const;
