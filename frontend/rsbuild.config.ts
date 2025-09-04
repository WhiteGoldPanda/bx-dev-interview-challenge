import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

export default defineConfig({
  plugins: [pluginReact()],
  source: {
    entry: { index: "./src/index.tsx" },
    exclude: [
      /\.spec\.(tsx?|jsx?)$/,
      /\.test\.(tsx?|jsx?)$/,
      /__tests__/,
      /\.stories\.(tsx?|jsx?)$/,
    ],
    define: {
      __API_BASE__: JSON.stringify(
        process.env.VITE_API_URL || process.env.API_URL || ""
      ),
    },
  },
  html: {
    meta: { viewport: "initial-scale=1, width=device-width" },
  },
  server: {
    port: 3001,
    proxy: {
      "/api": { target: "http://localhost:3000", changeOrigin: true },
    },
  },
});
