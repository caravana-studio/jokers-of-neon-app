import svgx from "@svgx/vite-plugin-react";
import react from "@vitejs/plugin-react";
import topLevelAwait from "vite-plugin-top-level-await";
import wasm from "vite-plugin-wasm";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react() , wasm(), topLevelAwait(), svgx()],
    build: {
      outDir: 'dist',
    },
});
