import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// در حالت dev از ریشه سرو می‌شود. نسخهٔ انتشار روی GitHub Pages زیر /blog/ است.
export default defineConfig(({ command }) => ({
  base: command === "build" ? "/blog/" : "/",
  plugins: [react()],
  server: { port: 5176, host: "127.0.0.1" },
}));
