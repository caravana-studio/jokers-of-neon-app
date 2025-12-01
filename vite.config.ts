import path from "node:path";
import type { IncomingMessage } from "node:http";
import { fileURLToPath } from "node:url";

import svgx from "@svgx/vite-plugin-react";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin, type UserConfig } from "vite";
import topLevelAwait from "vite-plugin-top-level-await";
import wasm from "vite-plugin-wasm";

type BuildTarget = "main" | "standaloneShop" | "all";

const rootDir = fileURLToPath(new URL(".", import.meta.url));
const indexHtml = path.resolve(rootDir, "index.html");
const standaloneShopHtml = path.resolve(rootDir, "standalone-shop.html");

const createConfig = (target: BuildTarget): UserConfig => {
  const isStandaloneShop = target === "standaloneShop";
  const isAll = target === "all";
  const config: UserConfig = {
    base: "./",
    plugins: [react(), wasm(), topLevelAwait(), svgx()],
    build: {
      outDir: isStandaloneShop ? "dist-shop" : "dist",
      rollupOptions: {
        input: isStandaloneShop
          ? { shop: standaloneShopHtml }
          : isAll
          ? { main: indexHtml, shop: standaloneShopHtml }
          : indexHtml,
      },
    },
  };

  if (isStandaloneShop) {
    config.appType = "mpa";
    config.server = {
      open: "/",
    };
    config.preview = {
      open: "/",
    };
    config.plugins?.push(htmlFallbackPlugin("/standalone-shop.html"));
  }

  return config;
};

const htmlFallbackPlugin = (fallback: string): Plugin => {
  const maybeRewrite = (req: IncomingMessage) => {
    const url = req.url || "/";
    const pathname = url.split("?")[0];
    const accept = req.headers.accept ?? "";
    const isHtmlRequest = accept.includes("text/html");
    const hasExtension = path.extname(pathname) !== "";
    const isViteInternal =
      pathname.startsWith("/@") || pathname === "/__vite_ping";

    if (isHtmlRequest && !hasExtension && !isViteInternal) {
      req.url = fallback;
    }
  };

  return {
    name: "standalone-shop-fallback",
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        maybeRewrite(req);
        next();
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, _res, next) => {
        maybeRewrite(req);
        next();
      });
    },
  };
};

export default defineConfig(({ mode }) => {
  const target: BuildTarget =
    process.env.BUILD_ALL === "true" || mode === "all"
      ? "all"
      : process.env.STANDALONE_SHOP === "true" || mode === "standalone-shop"
      ? "standaloneShop"
      : "main";

  return createConfig(target);
});
