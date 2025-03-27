import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  server: {
    port:3000
  },
  base: "/", // ✅ Ensures correct base URL
  build: {
    outDir: "dist", // ✅ Ensures output in `dist/`
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // ✅ Ensures `@` refers to `src/`
    },
  },
});
