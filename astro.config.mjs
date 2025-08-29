// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },

  adapter: cloudflare({
    platformProxy: { enabled: true },
    workerEntryPoint: {
      path: "./src/pages/api/registry",
    },
  }),
  output: "server",
});
