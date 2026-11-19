import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn } from "storybook/test";

import { PlantDashboard } from "./PlantDashboard";

const DAY = 24 * 60 * 60 * 1000;

const meta: Meta<typeof PlantDashboard> = {
  title: "Pages/PlantDashboard",
  component: PlantDashboard,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    controls: {
      include: [
        "initialPlants",
        "createPlant",
        "waterPlant",
        "identifyPlant",
        "updatePlant",
        "deletePlant",
      ],
    },
  },
  args: {
    createPlant: fn(),
    waterPlant: fn(async () => ({
      status: "too-early" as const,
      remainingDays: 2,
    })),
    identifyPlant: fn(),
    updatePlant: fn(),
    deletePlant: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof PlantDashboard>;

export const Default: Story = {
  args: {
    initialPlants: [
      {
        id: 1,
        name: "Fernie",
        species: "Nephrolepis exaltata",
        photoUrl: null,
        wateringFrequency: 7,
        lightPreference: "Bright, indirect light",
        personality: "dramatic",
        lastWateredAt: new Date(Date.now() - 8 * DAY),
        streak: 3,
        createdAt: new Date(),
      },
      {
        id: 2,
        name: "Spike",
        species: "Dracaena trifasciata",
        photoUrl: null,
        wateringFrequency: 14,
        lightPreference: "Low to bright indirect light",
        personality: "sarcastic",
        lastWateredAt: new Date(Date.now() - 2 * DAY),
        streak: 1,
        createdAt: new Date(),
      },
    ],
  },
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.click(
      canvas.getByRole("button", { name: /water \+10 xp/i }),
    );
    await expect(args.waterPlant).toHaveBeenCalledWith(1);
  },
};
