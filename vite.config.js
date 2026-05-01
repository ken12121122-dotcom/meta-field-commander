import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/meta-field-commander/",
  build: {
    outDir: "docs",
    emptyOutDir: true
  }
});
