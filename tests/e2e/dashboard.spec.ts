import { expect, test } from "@playwright/test";

/*
 * Smoke test against prisma/dev.db. Does not assume an empty garden and
 * does not write data (adding a plant requires a PlantNet photo match).
 */
test("loads the plant dashboard", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { level: 1, name: "Plant Care Dashboard" }),
  ).toBeVisible();
  await expect(page.getByText("Plants in your garden")).toBeVisible();
  await expect(page.getByText("Need attention")).toBeVisible();
  await expect(page.getByText(/Garden is looking after \d+ plants?/)).toBeVisible();
});

test("shows either the add form or the plant collection", async ({ page }) => {
  await page.goto("/");

  const startGarden = page.getByRole("heading", { name: "Start your garden" });
  const collection = page.getByRole("heading", { name: "Growing well" });

  await expect(startGarden.or(collection)).toBeVisible();
});
