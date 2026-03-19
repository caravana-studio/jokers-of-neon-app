import fs from "node:fs";
import { execSync } from "node:child_process";
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
const localCertDir = path.resolve(rootDir, ".cert");
const isReactCompilerEnabled = process.env.VITE_REACT_COMPILER !== "false";

const reactCompilerPlugin = react({
  babel: {
    plugins: [
      [
        "babel-plugin-react-compiler",
        {
          target: "18",
          panicThreshold: "none",
        },
      ],
    ],
  },
});

const ensureLocalHttpsCert = () => {
  const keyFilePath = path.resolve(localCertDir, "localhost-key.pem");
  const certFilePath = path.resolve(localCertDir, "localhost.pem");

  if (fs.existsSync(keyFilePath) && fs.existsSync(certFilePath)) {
    return { keyFilePath, certFilePath };
  }

  fs.mkdirSync(localCertDir, { recursive: true });

  try {
    execSync(
      [
        "openssl req -x509 -newkey rsa:2048 -nodes -sha256 -days 365",
        `-keyout "${keyFilePath}"`,
        `-out "${certFilePath}"`,
        '-subj "/CN=localhost"',
        '-addext "subjectAltName=DNS:localhost,IP:127.0.0.1,IP:::1"',
      ].join(" "),
      { stdio: "ignore" },
    );
  } catch (error) {
    console.error(error);
    throw new Error(
      "Failed to generate local HTTPS certificate. Set VITE_DEV_SSL_KEY_PATH and VITE_DEV_SSL_CERT_PATH manually."
    );
  }

  return { keyFilePath, certFilePath };
};

const resolveHttpsServerConfig = () => {
  const isHttpsEnabled = process.env.VITE_DEV_HTTPS === "true";
  if (!isHttpsEnabled) {
    return undefined;
  }

  const keyPath = process.env.VITE_DEV_SSL_KEY_PATH;
  const certPath = process.env.VITE_DEV_SSL_CERT_PATH;

  if (keyPath && certPath) {
    const resolvedKeyPath = path.resolve(rootDir, keyPath);
    const resolvedCertPath = path.resolve(rootDir, certPath);

    return {
      key: fs.readFileSync(resolvedKeyPath),
      cert: fs.readFileSync(resolvedCertPath),
    };
  }

  const { keyFilePath, certFilePath } = ensureLocalHttpsCert();
  return {
    key: fs.readFileSync(keyFilePath),
    cert: fs.readFileSync(certFilePath),
  };
};

const createConfig = (target: BuildTarget): UserConfig => {
  const isStandaloneShop = target === "standaloneShop";
  const isAll = target === "all";
  const https = resolveHttpsServerConfig();
  const config: UserConfig = {
    base: "./",
    plugins: [
      ...(isReactCompilerEnabled ? [reactCompilerPlugin] : []),
      wasm(),
      topLevelAwait(),
      svgx(),
    ],
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

  if (https) {
    config.server = {
      ...config.server,
      https,
    };
    config.preview = {
      ...config.preview,
      https,
    };
  }

  if (isStandaloneShop) {
    config.appType = "mpa";
    config.server = {
      ...config.server,
      open: "/",
    };
    config.preview = {
      ...config.preview,
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
