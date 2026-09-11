import type { Preview } from "@storybook/nextjs-vite";
import {
  decorators,
  loaders,
  parameters as nextjsParameters,
} from "@storybook/nextjs-vite/preview";

// Storybook's TypeScript configuration does not declare CSS modules.
// @ts-ignore
import "../src/app/globals.css";

const preview: Preview = {
  decorators: decorators as unknown as Preview["decorators"],
  loaders,
  parameters: {
    ...nextjsParameters,
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
