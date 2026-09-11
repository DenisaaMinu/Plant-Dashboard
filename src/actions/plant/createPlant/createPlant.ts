"use server";

import { parsePlantFields, type CreatePlantInput } from "@/actions/plant/helpers";
import { prisma } from "@/prisma/prismaClient";

export async function createPlant(input: CreatePlantInput) {
  const data = parsePlantFields(input);
  return prisma.plant.create({ data });
}
