import { expect, test } from "vitest";

import { createPlant } from "@/actions/plant/createPlant/createPlant";

const baseInput = {
  name: "Fernie",
  species: "Nephrolepis exaltata",
  photoUrl: null,
  wateringFrequency: 7,
  lightPreference: "Bright, indirect light",
  personality: "dramatic",
};

test("creates a plant with trimmed fields and defaults", async () => {
  const plant = await createPlant({
    ...baseInput,
    name: "  Fernie  ",
    species: "   ",
    personality: null,
  });

  expect(plant.id).toBeTypeOf("number");
  expect(plant.name).toBe("Fernie");
  expect(plant.species).toBeNull();
  expect(plant.personality).toBe("chill");
  expect(plant.streak).toBe(0);
  expect(plant.lastWateredAt).toBeNull();
});

test("rejects an empty name", async () => {
  await expect(createPlant({ ...baseInput, name: "   " })).rejects.toThrow(
    "Plant name is required",
  );
});

test("rejects a non-positive watering frequency", async () => {
  await expect(
    createPlant({ ...baseInput, wateringFrequency: 0 }),
  ).rejects.toThrow("Watering frequency must be a positive number of days");
});
