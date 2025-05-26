// vite.config.ts
import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    alias: [
      { find: "react", replacement: "@preact/compat" },
      { find: "react-dom", replacement: "@preact/compat" },
      { find: "react-dom/test-utils", replacement: "@preact/compat" },
    ],
  },
  optimizeDeps: {
    include: ["@preact/compat", "@preact/signals"],
  },
  envPrefix: ["PUBLIC_"],
  envDir: process.cwd(),
});
