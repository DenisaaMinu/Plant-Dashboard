import { definePreview } from "@storybook/nextjs-vite";
import * as nextjsAddon from "@storybook/nextjs-vite/preview";

// Storybook's TypeScript configuration does not declare CSS modules.
// @ts-ignore
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
