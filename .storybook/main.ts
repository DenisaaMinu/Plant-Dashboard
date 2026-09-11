import type { StorybookConfig } from "@storybook/nextjs-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: ["@storybook/addon-vitest", "@storybook/addon-mcp"],
  framework: {
    name: "@storybook/nextjs-vite",
    options: {},
  },
};

export default config;
