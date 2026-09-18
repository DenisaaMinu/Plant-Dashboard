import { expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";

import { PlantCard } from "./PlantCard";

test("calls onWater with the plant id when the water button is clicked", async () => {
  const plant = {
    id: 42,
    name: "Fernie",
    species: "Nephrolepis exaltata",
    photoUrl: null,
    wateringFrequency: 7,
    lightPreference: "Bright, indirect light",
    personality: "dramatic",
    lastWateredAt: new Date(),
    streak: 0,
    createdAt: new Date(),
  };
  const onWater = vi.fn().mockResolvedValue({ status: "watered", plant });
  const onUpdate = vi.fn();
  const onDelete = vi.fn();

  const screen = await render(
    <PlantCard
      plant={plant}
      onWater={onWater}
      onUpdate={onUpdate}
      onDelete={onDelete}
    />,
  );

  await expect(screen.getByText("Every 7 days")).toBeVisible();

  await screen.getByRole("button", { name: /mark as watered/i }).click();

  expect(onWater).toHaveBeenCalledWith(42);
});
