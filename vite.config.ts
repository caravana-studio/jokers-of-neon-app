import { defineConfig } from "vite";
import wasm from "vite-plugin-wasm";
import react from "@vitejs/plugin-react";
import topLevelAwait from "vite-plugin-top-level-await";
import { VitePWA } from 'vite-plugin-pwa'

//https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), wasm(), topLevelAwait(),  VitePWA({
      registerType: 'prompt',
      includeAssets: ['favicon.svg', 'robots.txt', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'My PWA App',
        short_name: 'PWA',
        description: 'My Progressive Web App using Vite and React',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'icon.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icon.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'icon.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],
        background_color: "#e8eac2",
        display: "standalone",
        scope: "/",
        start_url: "/",
        orientation: "portrait",
      },
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
      },
      devOptions: {
        enabled: true, // Enable PWA in development mode
      }
    })],
    build: {
      outDir: 'dist',
    },
    server: {
      host: '0.0.0.0', // or your local network IP
      port: 5173,      // specify the port if needed
    },
});
