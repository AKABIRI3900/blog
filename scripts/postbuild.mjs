// GitHub Pages برای آدرسی مثل /blog/post/xyz فایلی ندارد و 404.html را نشان می‌دهد.
// اگر 404.html همان index.html باشد، مسیریاب برنامه مسیر را می‌خواند و صفحهٔ درست را نشان می‌دهد.
import { copyFileSync } from "node:fs";

copyFileSync("dist/index.html", "dist/404.html");
console.log("dist/404.html created");
