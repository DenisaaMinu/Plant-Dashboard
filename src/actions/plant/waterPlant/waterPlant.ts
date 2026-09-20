"use server";

import { getDaysSince, wasWateredOnTime } from "@/lib/moodLogic";
import { prisma } from "@/prisma/prismaClient";

export type WaterPlantResult =
  | {
      status: "watered";
      plant: Awaited<ReturnType<typeof prisma.plant.update>>;
    }
  | { status: "already-watered" }
  | { status: "too-early"; remainingDays: number };

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

  if (plant.lastWateredAt) {
    const daysSince = getDaysSince(plant.lastWateredAt, now.getTime());
    const remainingDays = Math.max(
      1,
      Math.ceil(plant.wateringFrequency - daysSince),
    );

    if (daysSince < plant.wateringFrequency) {
      return { status: "too-early", remainingDays };
    }
  }

  const daysSince = plant.lastWateredAt
    ? getDaysSince(plant.lastWateredAt, now.getTime())
    : 0;
  const calendarDaysSince = plant.lastWateredAt
    ? getCalendarDaysSince(plant.lastWateredAt, now)
    : 0;
  const onTime = plant.lastWateredAt
    ? wasWateredOnTime(daysSince, plant.wateringFrequency)
    : true;

  const updatedPlant = await prisma.plant.update({
    where: { id },
    data: {
      lastWateredAt: now,
      streak:
        plant.lastWateredAt && calendarDaysSince === 1 && onTime
          ? plant.streak + 1
          : 1,
    },
  });

  return { status: "watered", plant: updatedPlant };
}
