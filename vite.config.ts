import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import topLevelAwait from "vite-plugin-top-level-await";
import wasm from "vite-plugin-wasm";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), wasm(), topLevelAwait()],
    build: {
      outDir: 'dist',
      rollupOptions: {
        external: ["react", "react-router", "react-router-dom"],
        output: {
          globals: {
            react: "React",
          },
        },
      },
    },
});
