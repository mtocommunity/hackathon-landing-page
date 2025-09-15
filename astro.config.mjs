// @ts-check
import { defineConfig } from "astro/config";

import cloudflare from "@astrojs/cloudflare";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  adapter: cloudflare({
    platformProxy: { enabled: true },
  }),
  output: "server",
  vite: {
    //@ts-expect-error
    plugins: [tailwindcss()],
  },
});
