import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/hiscores": {
        target: "https://secure.runescape.com/m=hiscore_oldschool",
        changeOrigin: true,
        rewrite: path => "/index_lite.ws" + path.replace("/api/hiscores", ""),
      },
    },
  },
  build: {
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    cssCodeSplit: true,
    sourcemap: false,
    reportCompressedSize: true,
  },
});
