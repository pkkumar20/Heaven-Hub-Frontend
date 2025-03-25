import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/", // ✅ Ensure correct base URL
  build: {
    outDir: "dist", // ✅ Ensure correct output folder
  },
  server: {
    host: "0.0.0.0",
    port: process.env.PORT || 3000,
  },
});
