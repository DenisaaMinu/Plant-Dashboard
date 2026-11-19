import { definePreview } from "@storybook/nextjs-vite";
import * as nextjsAddon from "@storybook/nextjs-vite/preview";

import "../src/app/globals.css";

export default definePreview({
  addons: [nextjsAddon],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
});
