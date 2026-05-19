import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import { ClientSideLayout } from "vite-plugin-vue-layouts";
import Pages from "vite-plugin-pages";
import path from "path";

const isDev =
  process.env.NODE_ENV === "development" || process.env.VITE_DEV === "true";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    host: true,
    open: true,
  },

  plugins: [
    vue(),
    isDev && vueDevTools(),
    Pages({
      dirs: "src/pages",
      extensions: ["vue"],
      exclude: isDev
        ? ["**/__errors/*.vue"]
        : ["**/__dev/*.vue", "**/__errors/*.vue"],
    }),
    ClientSideLayout({
      layoutDir: "src/layouts",
      defaultLayout: "Default",
      importMode: "sync",
    }),
    VitePWA({
      registerType: "prompt",
      injectRegister: "auto",

      pwaAssets: {
        disabled: false,
        config: true,
      },

      manifest: {
        name: "Memora",
        short_name: "Memora",
        description: "Aprenda melhor. Lembre por mais tempo.",

        theme_color: "#081121",
        background_color: "#020617",

        display: "standalone",
        orientation: "portrait",

        icons: [
          {
            src: "/pwa-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/pwa-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/maskable-icon.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },

      workbox: {
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,

        runtimeCaching: [
          {
            urlPattern: ({ url, request }) => {
              const isApiRequest = /\/api\/.*\/*.json/.test(url.pathname);

              const isTargetMethod = ["POST", "PUT", "DELETE"].includes(
                request.method,
              );

              return isApiRequest && isTargetMethod;
            },

            handler: "NetworkOnly",

            options: {
              backgroundSync: {
                name: "memora-sync",
                options: {
                  maxRetentionTime: 24 * 60,
                },
              },
            },
          },
        ],
      },

      devOptions: {
        navigateFallback: "index.html",
        suppressWarnings: true,
        enabled: true,
        type: "module",
      },
    }),
  ],
});
