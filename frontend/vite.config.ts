import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: "@app", replacement: fileURLToPath(new URL("./src/app", import.meta.url)) },
      { find: "@processes", replacement: fileURLToPath(new URL("./src/processes", import.meta.url)) },
      { find: "@pages", replacement: fileURLToPath(new URL("./src/pages", import.meta.url)) },
      { find: "@widgets", replacement: fileURLToPath(new URL("./src/widgets", import.meta.url)) },
      { find: "@features", replacement: fileURLToPath(new URL("./src/features", import.meta.url)) },
      { find: "@entities", replacement: fileURLToPath(new URL("./src/entities", import.meta.url)) },
      { find: "@shared", replacement: fileURLToPath(new URL("./src/shared", import.meta.url)) },
      { find: "@ui", replacement: fileURLToPath(new URL("./src/shared/ui", import.meta.url)) },
      { find: "@lib", replacement: fileURLToPath(new URL("./src/shared/lib", import.meta.url)) },
      { find: "@config", replacement: fileURLToPath(new URL("./src/shared/config", import.meta.url)) },
      { find: "@api", replacement: fileURLToPath(new URL("./src/shared/api", import.meta.url)) }
    ]
  }
});
