import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // semua request /api ke backend di port 3000
      "/transactions": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
        rewrite: (p) => p.replace(/^\/transactions/, "/transactions"),
      },
      "/userLogin": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
        rewrite: (p) => p.replace(/^\/login/, "/login"),
      },
      "/userRegister": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
        rewrite: (p) => p.replace(/^\/register/, "/register"),
      },
    },
  },
});
