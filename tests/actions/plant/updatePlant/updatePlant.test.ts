import { expect, test } from "vitest";

import { updatePlant } from "@/actions/plant/updatePlant/updatePlant";
import { prisma } from "@/prisma/prismaClient";

async function seedPlant() {
  return prisma.plant.create({
    data: { name: "Fernie", wateringFrequency: 7, lightPreference: "Low light" },
  });
}

test("updates name and personality with trimmed values", async () => {
  const plant = await seedPlant();

  const updated = await updatePlant(plant.id, {
    name: "  Sir Fernsworth ",
    personality: " sassy ",
  });

  expect(updated.name).toBe("Sir Fernsworth");
  expect(updated.personality).toBe("sassy");
});

test("rejects an empty name without writing", async () => {
  const plant = await seedPlant();

  await expect(
    updatePlant(plant.id, { name: " ", personality: "sassy" }),
  ).rejects.toThrow("Plant name is required");

  const stored = await prisma.plant.findUniqueOrThrow({ where: { id: plant.id } });
  expect(stored.name).toBe("Fernie");
});
