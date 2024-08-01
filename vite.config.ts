import { defineConfig } from "vite";
import wasm from "vite-plugin-wasm";
import react from "@vitejs/plugin-react";
import topLevelAwait from "vite-plugin-top-level-await";
import { VitePWA } from 'vite-plugin-pwa'

//https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), wasm(), topLevelAwait(),  VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt', "apple-touc-icon.png", 'masked-icon.png'],
      manifest: {
        name: 'Jokers of Neon',
        short_name: 'JoN',
        description: 'BUIDL YOUR DECK, RULE THE GAME',
        theme_color: '#ffffff',
        icons:[{
          src: '/android-chrome-192x192.png',
          sizes:'192x192',
          type:'image/png',
          purpose:'favicon'
        },
        {
          src:'/android-chrome-512x512.png',
          sizes:'512x512',
          type:'image/png',
          purpose:'favicon'
        },
        {
          src: '/apple-touch-icon.png',
          sizes:'180x180',
          type:'image/png',
          purpose:'apple touch icon',
        },
        {
          src: '/maskable_icon.png',
          sizes:'512x512',
          type:'image/png',
          purpose:'any maskable',
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
