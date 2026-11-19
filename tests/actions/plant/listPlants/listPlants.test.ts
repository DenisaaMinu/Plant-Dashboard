import { expect, test } from "vitest";

import { listPlants } from "@/actions/plant/listPlants/listPlants";
import { prisma } from "@/prisma/prismaClient";

test("returns plants newest first", async () => {
  const base = { wateringFrequency: 7, lightPreference: "Low light" };
  await prisma.plant.create({
    data: { ...base, name: "Older", createdAt: new Date("2026-01-01") },
  });
  await prisma.plant.create({
    data: { ...base, name: "Newer", createdAt: new Date("2026-02-01") },
  });

  const plants = await listPlants();

  expect(plants.map((plant) => plant.name)).toEqual(["Newer", "Older"]);
});

test("returns an empty list when there are no plants", async () => {
  expect(await listPlants()).toEqual([]);
});
