import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({mode})=>{
  
  const env = loadEnv(mode, process.cwd(), "");
  return {
  plugins: [tailwindcss(), react()],
  server: {
    proxy: {
      "/api": {
        target: env.VITE_SERVER_URL || "http://localhost:8080",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}});
