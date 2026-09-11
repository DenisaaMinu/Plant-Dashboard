import { expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";

import { PlantCard } from "./PlantCard";

test("calls onWater with the plant id when the water button is clicked", async () => {
  const onWater = vi.fn();
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

  const screen = await render(<PlantCard plant={plant} onWater={onWater} />);

  await screen.getByRole("button", { name: /mark as watered/i }).click();

  expect(onWater).toHaveBeenCalledWith(42);
});
