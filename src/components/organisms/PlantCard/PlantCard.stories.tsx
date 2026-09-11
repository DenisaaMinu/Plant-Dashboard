import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn } from "storybook/test";

import { PlantCard } from "./PlantCard";

const meta: Meta<typeof PlantCard> = {
  title: "Organisms/PlantCard",
  component: PlantCard,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    controls: {
      include: ["plant", "onWater", "className"],
    },
  },
  args: {
    onWater: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof PlantCard>;

export const Default: Story = {
  args: {
    plant: {
      id: 1,
      name: "Fernie",
      species: "Nephrolepis exaltata",
      photoUrl: null,
      wateringFrequency: 7,
      lightPreference: "Bright, indirect light",
      personality: "dramatic",
      lastWateredAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      streak: 3,
      createdAt: new Date(),
    },
  },
  play: async ({ canvas, userEvent, args }) => {
    const waterButton = canvas.getByRole("button", {
      name: /mark as watered/i,
    });
    await userEvent.click(waterButton);
    await expect(args.onWater).toHaveBeenCalledWith(args.plant.id);
  },
};
