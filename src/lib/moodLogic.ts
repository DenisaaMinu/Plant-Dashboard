export type PlantMood = "healthy" | "needsWaterSoon" | "overdue";

const MS_PER_DAY = 1000 * 60 * 60 * 24;

export function getDaysSince(date: Date): number {
  return Math.floor((Date.now() - date.getTime()) / MS_PER_DAY);
}

export function getMood(daysSince: number, wateringFrequency: number): PlantMood {
  const ratio = daysSince / wateringFrequency;
  if (ratio < 0.7) return "healthy";
  if (ratio <= 1) return "needsWaterSoon";
  return "overdue";
}

export function getWateringProgress(
  daysSince: number,
  wateringFrequency: number,
): number {
  return Math.min(daysSince / wateringFrequency, 1);
}

export function wasWateredOnTime(
  daysSince: number,
  wateringFrequency: number,
): boolean {
  return getMood(daysSince, wateringFrequency) !== "overdue";
}
