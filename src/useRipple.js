import { useEffect } from "react";

// هر چیزی که کلیک می‌شود و باید موجِ زیر انگشت/ماوس داشته باشد
const TARGETS = ".btn,.circle-btn,.chip,.menu-btn,.copy-btn,.row-link,.card-link,.play-btn,.nav-pn a";

/* موج کلیک: یک دایرهٔ محو از نقطهٔ لمس پخش می‌شود. با «کاهش حرکت» غیرفعال است. */
export default function useRipple() {
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onDown = (e) => {
      if (mq.matches || e.button > 0) return;
      const t = e.target.closest(TARGETS);
      if (!t || t.disabled) return;
      const r = t.getBoundingClientRect();
      const size = Math.max(r.width, r.height) * 2.2;
      const s = document.createElement("span");
      s.className = "ripple";
      s.setAttribute("aria-hidden", "true");
      s.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - r.left - size / 2}px;top:${e.clientY - r.top - size / 2}px`;
      t.appendChild(s);
      s.addEventListener("animationend", () => s.remove(), { once: true });
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, []);
}
