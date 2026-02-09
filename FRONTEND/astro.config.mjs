// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import fs from "fs";

// https://astro.build/config
export default defineConfig({
  output: 'server',
  vite: {
    plugins: [tailwindcss()],
    server: {
      https: {
        key: fs.readFileSync("./certs/localhost-key.pem"),
        cert: fs.readFileSync("./certs/localhost-cert.pem"),
      },
      port: 4321,
    },
  },

  integrations: [react()],
});
