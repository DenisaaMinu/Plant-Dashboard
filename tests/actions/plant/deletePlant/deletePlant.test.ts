import { expect, test } from "vitest";

import { deletePlant } from "@/actions/plant/deletePlant/deletePlant";
import { prisma } from "@/prisma/prismaClient";

test("deletes the plant and returns its id", async () => {
  const plant = await prisma.plant.create({
    data: { name: "Fernie", wateringFrequency: 7, lightPreference: "Low light" },
  });

  const result = await deletePlant(plant.id);

  expect(result).toEqual({ id: plant.id });
  expect(await prisma.plant.count()).toBe(0);
});

test("throws when the plant does not exist", async () => {
  await expect(deletePlant(999_999)).rejects.toThrow();
});
