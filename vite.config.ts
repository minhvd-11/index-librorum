// vite.config.ts
import { defineConfig } from "vite";

export default defineConfig({
  envPrefix: ["PUBLIC_"],
  envDir: process.cwd(),
});
