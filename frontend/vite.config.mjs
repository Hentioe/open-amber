import tailwindcss from "@tailwindcss/vite";
import process from "node:process";
import { defineConfig } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";
import solid from "vite-plugin-solid";

const backend = {
  target: "http://localhost:3000",
  changeOrigin: true,
};

export default defineConfig(() => {
  return {
    plugins: [
      solid(),
      tailwindcss(),
      createHtmlPlugin({
        inject: {
          data: {
            analyticsScript: injectPlausible(),
          },
        },
      }),
    ],
    build: {
      outDir: "../public",
      emptyOutDir: true,
    },
    server: {
      port: 4000,
      proxy: {
        "/api": backend,
        "/admin/api": backend,
        "/shared_assets": backend,
        "/submit/verify": backend,
        "/review": backend,
      },
    },
  };
});

function injectPlausible(domain = envVar("OPEN_AMBER_PLAUSIBLE_DOMAIN"), src = envVar("OPEN_AMBER_PLAUSIBLE_SRC")) {
  if (!domain || !src || envVar("NODE_ENV") !== "production") {
    return "";
  }

  return `<script defer data-domain="${domain}" src="${src}"></script>`;
}

function envVar(name) {
  return process.env[name];
}
