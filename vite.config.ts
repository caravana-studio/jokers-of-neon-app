import { defineConfig } from "vite";
import wasm from "vite-plugin-wasm";
import react from "@vitejs/plugin-react";
import topLevelAwait from "vite-plugin-top-level-await";

import svgx from "@svgx/vite-plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), wasm(), topLevelAwait(), svgx()],
    build: {
      outDir: 'dist',
    },
});
