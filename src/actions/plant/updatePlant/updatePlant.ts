"use server";

import { prisma } from "@/prisma/prismaClient";

export type UpdatePlantInput = {
  name: string;
  personality: string;
};

export async function updatePlant(id: number, input: UpdatePlantInput) {
  const name = input.name.trim();
  const personality = input.personality.trim();

  if (!name) {
    throw new Error("Plant name is required");
  }

  if (!personality) {
    throw new Error("Plant personality is required");
  }

  return prisma.plant.update({
    where: { id },
    data: { name, personality },
  });
}
