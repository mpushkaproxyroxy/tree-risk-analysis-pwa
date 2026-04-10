export function formatSpeedMs(value: number): string {
  return `${value.toFixed(1)} m/s`;
}

export function formatSpeedMph(value: number): string {
  return `${(value * 2.23694).toFixed(0)} mph`;
}

export function formatMoment(value: number): string {
  return `${value.toFixed(1)} kN-m`;
}

export function formatStress(value: number): string {
  return `${value.toFixed(1)} MPa`;
}

export function formatRatio(value: number): string {
  return `${value.toFixed(2)}x`;
}
