import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/",  // ✅ Ensures correct routing
  build: {
    outDir: "dist",  // ✅ Ensures build output is inside "dist"
  },
  server: {
    host: "0.0.0.0",
    port: process.env.PORT || 3000,
  },
});
