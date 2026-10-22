import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    // Si el puerto esta ocupado vite se mueve al siguiente en silencio y el frontend deja de
    // coincidir con CORS_ORIGIN. Con strictPort falla visible en su lugar.
    strictPort: true,
  },
});
