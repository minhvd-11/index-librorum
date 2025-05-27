// @ts-check
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

import react from "@astrojs/react";

import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  integrations: [tailwind(), react()],
  site: "https://minhvd-11.github.io",
  base: "/index-librorum",

  build: {
    assetsPrefix: "/index-librorum",
  },
});
