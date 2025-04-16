import svgx from "@svgx/vite-plugin-react";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import topLevelAwait from "vite-plugin-top-level-await";
import wasm from "vite-plugin-wasm";
import fs from "fs";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), wasm(), topLevelAwait(), svgx()],
    build: {
      outDir: "dist",
    },
    server: {
      // host: "0.0.0.0", // or your local network IP
      // https: {
      //   key: fs.readFileSync(path.resolve(__dirname, "localhost+2-key.pem")),
      //   cert: fs.readFileSync(path.resolve(__dirname, "localhost+2-cert.pem")),
      // },
      proxy: {
        "/api/forward-push": {
          target: env.VITE_GG_URL,
          changeOrigin: true,
          rewrite: (path) =>
            path.replace(
              /^\/api\/forward-push/,
              "/api/v2/action-dispatcher/dispatch/public"
            ),
        },
      },
    },
  };
});
