import { expect, test } from "vitest";

import { waterPlant } from "@/actions/plant/waterPlant/waterPlant";
import { prisma } from "@/prisma/prismaClient";

const DAY = 24 * 60 * 60 * 1000;

async function seedPlant(data: {
  wateringFrequency: number;
  lastWateredAt?: Date | null;
  streak?: number;
}) {
  return prisma.plant.create({
    data: { name: "Fernie", lightPreference: "Low light", ...data },
  });
}

test("waters a plant that was never watered and starts the streak", async () => {
  const plant = await seedPlant({ wateringFrequency: 7 });

  const result = await waterPlant(plant.id);

  expect(result.status).toBe("watered");
  if (result.status !== "watered") return;
  expect(result.plant.lastWateredAt).toBeInstanceOf(Date);
  expect(result.plant.streak).toBe(1);
});

test("refuses to water twice on the same day", async () => {
  const plant = await seedPlant({ wateringFrequency: 7, lastWateredAt: new Date() });

  expect(await waterPlant(plant.id)).toEqual({ status: "already-watered" });
});

test("reports too-early with remaining days", async () => {
  const plant = await seedPlant({
    wateringFrequency: 7,
    lastWateredAt: new Date(Date.now() - 2 * DAY),
  });

  expect(await waterPlant(plant.id)).toEqual({
    status: "too-early",
    remainingDays: 5,
  });
});

test("extends the streak when watered on time the next day", async () => {
  const plant = await seedPlant({
    wateringFrequency: 1,
    lastWateredAt: new Date(Date.now() - DAY),
    streak: 3,
  });

  const result = await waterPlant(plant.id);

  expect(result.status).toBe("watered");
  if (result.status !== "watered") return;
  expect(result.plant.streak).toBe(4);
});
