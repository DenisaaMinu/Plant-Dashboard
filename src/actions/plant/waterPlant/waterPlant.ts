"use server";

import { getDaysSince, wasWateredOnTime } from "@/lib/moodLogic";
import { prisma } from "@/prisma/prismaClient";

export type WaterPlantResult =
  | { status: "watered"; plant: Awaited<ReturnType<typeof prisma.plant.update>> }
  | { status: "already-watered" };

function getCalendarDayKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function getCalendarDaysSince(date: Date, now: Date) {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

export async function waterPlant(id: number): Promise<WaterPlantResult> {
  const plant = await prisma.plant.findUniqueOrThrow({ where: { id } });
  const now = new Date();

  if (
    plant.lastWateredAt &&
    getCalendarDayKey(plant.lastWateredAt) === getCalendarDayKey(now)
  ) {
    return { status: "already-watered" };
  }

  const daysSince = getDaysSince(plant.lastWateredAt);
  const calendarDaysSince = plant.lastWateredAt
    ? getCalendarDaysSince(plant.lastWateredAt, now)
    : null;
  const onTime = plant.lastWateredAt
    ? wasWateredOnTime(daysSince, plant.wateringFrequency)
    : false;

  const updatedPlant = await prisma.plant.update({
    where: { id },
    data: {
      lastWateredAt: now,
      streak:
        calendarDaysSince === 1 && onTime ? plant.streak + 1 : 1,
    },
  });

  return { status: "watered", plant: updatedPlant };
}
