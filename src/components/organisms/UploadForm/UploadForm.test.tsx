import { expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";

import { UploadForm } from "./UploadForm";

const photo = new File(["fake"], "plant.png", { type: "image/png" });

test("disables Add plant until a photo is chosen", async () => {
  const screen = await render(
    <UploadForm identifyPlant={vi.fn()} onCreatePlant={vi.fn()} />,
  );

  await expect
    .element(screen.getByRole("button", { name: "Add plant" }))
    .toBeDisabled();
});

test("submits the plant with the selected preset's care plan", async () => {
  const onCreatePlant = vi.fn();
  const screen = await render(
    <UploadForm identifyPlant={vi.fn()} onCreatePlant={onCreatePlant} />,
  );

  await screen.getByLabelText("Plant photo").upload(photo);
  await screen.getByLabelText("Plant type").selectOptions("Monstera");
  await screen.getByLabelText("Name").fill("Monty");
  await screen.getByRole("button", { name: "Add plant" }).click();

  expect(onCreatePlant).toHaveBeenCalledWith(
    expect.objectContaining({
      name: "Monty",
      species: "Monstera deliciosa",
      personality: "chill",
    }),
  );
});

test("shows the identified species after Identify plant", async () => {
  const identifyPlant = vi.fn().mockResolvedValue({
    status: "matched",
    speciesName: "Epipremnum aureum",
    commonName: "Golden pothos",
    confidence: 0.9,
    care: {
      id: "pothos",
      commonName: "Pothos",
      scientificName: "Epipremnum aureum",
      wateringFrequency: 7,
      lightPreference: "Bright, indirect light",
    },
  });
  const screen = await render(
    <UploadForm identifyPlant={identifyPlant} onCreatePlant={vi.fn()} />,
  );

  await screen.getByLabelText("Plant photo").upload(photo);
  await screen.getByRole("button", { name: "Identify plant" }).click();

  await expect
    .element(screen.getByText("Identified as Golden pothos (90% confidence)"))
    .toBeVisible();
});

test("asks for a name before submitting", async () => {
  const onCreatePlant = vi.fn();
  const screen = await render(
    <UploadForm identifyPlant={vi.fn()} onCreatePlant={onCreatePlant} />,
  );

  await screen.getByLabelText("Plant photo").upload(photo);
  await screen.getByRole("button", { name: "Add plant" }).click();

  await expect
    .element(screen.getByRole("alert"))
    .toHaveTextContent("Give your plant a name.");
  expect(onCreatePlant).not.toHaveBeenCalled();
});
