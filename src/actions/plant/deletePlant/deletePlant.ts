"use server";

import { prisma } from "@/prisma/prismaClient";

export async function deletePlant(id: number) {
  await prisma.plant.delete({ where: { id } });
  return { id };
}
