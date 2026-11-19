import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn } from "storybook/test";

import { UploadForm } from "./UploadForm";

const meta: Meta<typeof UploadForm> = {
  title: "Organisms/UploadForm",
  component: UploadForm,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    controls: {
      include: ["identifyPlant", "onCreatePlant"],
    },
  },
  args: {
    identifyPlant: fn(),
    onCreatePlant: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof UploadForm>;

export const Default: Story = {
  play: async ({ canvas, userEvent, args }) => {
    await userEvent.upload(
      canvas.getByLabelText("Plant photo"),
      new File(["fake"], "plant.png", { type: "image/png" }),
    );
    await userEvent.type(canvas.getByLabelText("Name"), "Fernie");
    await userEvent.click(canvas.getByRole("button", { name: "Add plant" }));
    await expect(args.onCreatePlant).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Fernie" }),
    );
  },
};
