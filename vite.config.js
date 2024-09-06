import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist', // Specify your output directory for build
  },
  server: {
    port: 5173, // Set the port for the development server
  },
});
