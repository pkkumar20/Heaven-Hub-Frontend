import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: process.env.PORT || 3000,
  },
  plugins: [react()],
  base: "/", // ✅ Ensures correct base URL
  build: {
    outDir: "dist",  // ✅ Output folder for deployment
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // ✅ Ensure @ refers to src/
    },
  },
});
