/* آیکن‌ها: همه aria-hidden هستند و نام قابل‌دسترس را عنصر والد می‌دهد. */

// پیکان به‌سمت پایان خوانش (در راست‌به‌چپ یعنی چپ). کلاس .fwd در CSS آینه‌اش می‌کند.
export function Arrow({ back = false }) {
  return (
    <svg viewBox="0 0 26 26" className={back ? "arrow back" : "arrow fwd"} aria-hidden="true">
      <path d="M3 13h19m-6-6 6 6-6 6" />
    </svg>
  );
}

export function Flame() {
  return (
    <svg viewBox="0 0 32 40" aria-hidden="true">
      <path d="M16 2c1 7-7 11-7 20a7 7 0 0 0 14 0c0-4-2-6-3-9-1 3-3 4-4 4 2-6 1-11 0-15Z" />
      <path d="M16 27c-2 0-3 1.5-3 3.2A3 3 0 0 0 16 33a3 3 0 0 0 3-2.8c0-1.7-1-3.200-3-3.200Z" />
    </svg>
  );
}

export function Sparkle({ style, className = "" }) {
  return (
    <svg className={`sparkle ${className}`} style={style} viewBox="0 0 44 44" aria-hidden="true">
      <path d="M22 2c1 12 8 19 20 20-12 1-19 8-20 20-1-12-8-19-20-20C14 21 21 14 22 2z" />
    </svg>
  );
}

export function Play() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

export function Note() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 18V6l10-2v12" />
      <circle cx="7" cy="18" r="2.2" />
      <circle cx="17" cy="16" r="2.2" />
    </svg>
  );
}

export function Search() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m15.500 15.500 5 5" />
    </svg>
  );
}

export function ScribbleArrow() {
  return (
    <svg viewBox="0 0 58 18" aria-hidden="true">
      <path d="M2 12c10-8 18 6 28-2s14 0 24-2m0 0-6-4m6 4-6 4" />
    </svg>
  );
}
