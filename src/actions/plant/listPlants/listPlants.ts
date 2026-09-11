"use server";

import { prisma } from "@/prisma/prismaClient";

export async function listPlants() {
  return prisma.plant.findMany({
    orderBy: { createdAt: "desc" },
  });
}
