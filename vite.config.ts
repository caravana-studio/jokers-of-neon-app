import { defineConfig } from "vite";
import wasm from "vite-plugin-wasm";
import react from "@vitejs/plugin-react";
import topLevelAwait from "vite-plugin-top-level-await";
import { VitePWA } from 'vite-plugin-pwa'

//https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), wasm(), topLevelAwait(),  VitePWA({
      injectRegister: 'script',
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt', "apple-touc-icon.png", 'masked-icon.png'],
      manifest: {
        name: 'Jokers of Neon',
        short_name: 'JoN',
        description: '🃏 BUIDL your deck, rule the game 🔥',
        theme_color: '#ffffff',
        "icons": [
          {
            "src": "pwa-64x64.png",
            "sizes": "64x64",
            "type": "image/png"
          },
          {
            "src": "pwa-192x192.png",
            "sizes": "192x192",
            "type": "image/png"
          },
          {
            "src": "pwa-512x512.png",
            "sizes": "512x512",
            "type": "image/png"
          },
          {
            "src": "pwa-512x512.png",
            "sizes": "512x512",
            "type": "image/png",
            "purpose": "maskable"
          }
        ],
        prefer_related_applications: false,
        background_color: "#e8eac2",
        display: "standalone",
        scope: "/",
        start_url: "/",
        orientation: "portrait",
        screenshots: [
          {
           "src": "JoN-PopUp.png",
            "sizes": "739x338",
            "type": "image/gif",
            "form_factor": "wide",
            "label": "Icon wide"
          },
          {
            "src": "JoN-Mobile.png",
             "sizes": "350x634",
             "type": "image/gif",
             "form_factor": "narrow",
             "label": "Icon mobile"
           },
        ],
          
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
