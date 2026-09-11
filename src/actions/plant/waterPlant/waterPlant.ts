"use server";

import { getDaysSince, wasWateredOnTime } from "@/lib/moodLogic";
import { prisma } from "@/prisma/prismaClient";

export async function waterPlant(id: number) {
  const plant = await prisma.plant.findUniqueOrThrow({ where: { id } });
  const daysSince = getDaysSince(plant.lastWateredAt);
  const onTime = wasWateredOnTime(daysSince, plant.wateringFrequency);

  return prisma.plant.update({
    where: { id },
    data: {
      lastWateredAt: new Date(),
      streak: onTime ? plant.streak + 1 : 0,
    },
  });
}
