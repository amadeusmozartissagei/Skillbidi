import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from 'tailwindcss';

export default defineConfig({
    plugins: [react(), tailwindcss()],
  root: ".", // Set the root directory if needed
    build: {
    outDir: "dist", // Specify your output directory
    },
});
