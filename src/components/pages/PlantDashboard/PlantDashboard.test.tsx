import { expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";

import { PlantDashboard } from "./PlantDashboard";

const DAY = 24 * 60 * 60 * 1000;

const plant = {
  id: 1,
  name: "Fernie",
  species: "Nephrolepis exaltata",
  photoUrl: null,
  wateringFrequency: 7,
  lightPreference: "Bright, indirect light",
  personality: "dramatic",
  lastWateredAt: new Date(Date.now() - 8 * DAY),
  streak: 2,
  createdAt: new Date(),
};

function actions() {
  return {
    createPlant: vi.fn(),
    waterPlant: vi.fn(),
    identifyPlant: vi.fn(),
    updatePlant: vi.fn(),
    deletePlant: vi.fn(),
  };
}

test("shows the add form when the garden is empty", async () => {
  const screen = await render(
    <PlantDashboard initialPlants={[]} {...actions()} />,
  );

  await expect
    .element(screen.getByRole("heading", { name: "Start your garden" }))
    .toBeVisible();
});

test("applies the returned row after watering", async () => {
  const props = actions();
  props.waterPlant.mockResolvedValue({
    status: "watered",
    // Server actions serialize dates, so the row may come back with strings.
    plant: { ...plant, lastWateredAt: new Date().toISOString(), streak: 3 },
  });
  const screen = await render(
    <PlantDashboard initialPlants={[plant]} {...props} />,
  );

  await screen.getByRole("button", { name: /water \+10 xp/i }).click();

  expect(props.waterPlant).toHaveBeenCalledWith(1);
  await expect
    .element(screen.getByRole("button", { name: "Watered today" }))
    .toBeDisabled();
});

test("shows a generic alert and keeps the plant when a mutation fails", async () => {
  const props = actions();
  props.waterPlant.mockRejectedValue(new Error("db exploded"));
  const screen = await render(
    <PlantDashboard initialPlants={[plant]} {...props} />,
  );

  await screen.getByRole("button", { name: /water \+10 xp/i }).click();

  await expect
    .element(screen.getByRole("alert"))
    .toHaveTextContent("Something went wrong. Try again.");
  await expect
    .element(screen.getByRole("heading", { name: "Fernie" }))
    .toBeVisible();
});

test("removes a plant after a confirmed delete", async () => {
  vi.spyOn(window, "confirm").mockReturnValue(true);
  const props = actions();
  props.deletePlant.mockResolvedValue({ id: 1 });
  const screen = await render(
    <PlantDashboard initialPlants={[plant]} {...props} />,
  );

  await screen.getByRole("button", { name: "Remove" }).click();

  expect(props.deletePlant).toHaveBeenCalledWith(1);
  await expect
    .element(screen.getByRole("heading", { name: "Start your garden" }))
    .toBeVisible();
});
