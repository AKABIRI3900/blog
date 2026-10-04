/* مسیریاب کوچک مبتنی بر History API، بدون وابستگی اضافه.
   مسیرهای برنامه همیشه از ریشه شروع می‌شوند (/archive)؛ پیشوند استقرار (مثل /blog) فقط هنگام
   خواندن و نوشتن آدرس مرورگر اضافه و حذف می‌شود. */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Flame } from "./components/Icons";

const RouterCtx = createContext(null);
export const useRouter = () => useContext(RouterCtx);

const BASE = import.meta.env.BASE_URL.replace(/\/$/, ""); // "" در dev و "/blog" در انتشار
export const withBase = (to) => BASE + to;

const appPath = () => {
  let p = decodeURIComponent(window.location.pathname);
  if (BASE && p.startsWith(BASE)) p = p.slice(BASE.length);
  return p.replace(/\/+$/, "") || "/";
};
const read = () => ({ path: appPath(), hash: window.location.hash });
const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const CURTAIN_IN = 460; // مدت بالا آمدن پرده
const CURTAIN_OUT = 520; // مدت کنار رفتن پرده

export function RouterProvider({ children }) {
  const [loc, setLoc] = useState(read);
  const [curtain, setCurtain] = useState(null); // null | "in" | "out"
  const busy = useRef(false);

  useEffect(() => {
    const onPop = () => setLoc(read());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const navigate = useCallback((to) => {
    const u = new URL(to, window.location.origin);
    const target = decodeURIComponent(u.pathname).replace(/\/+$/, "") || "/";
    const samePage = target === appPath();
    const go = () => {
      window.history.pushState({}, "", BASE + u.pathname + u.hash);
      setLoc(read());
    };

    // روی همان صفحه (فقط لنگر) یا با «کاهش حرکت»: بدون پرده
    if (samePage || reduced()) return go();
    if (busy.current) return;

    busy.current = true;
    setCurtain("in");
    window.setTimeout(() => {
      go();
      setCurtain("out");
      window.setTimeout(() => {
        setCurtain(null);
        busy.current = false;
      }, CURTAIN_OUT);
    }, CURTAIN_IN);
  }, []);

  // بعد از هر تغییر مسیر: به لنگر برو یا بالای صفحه
  useEffect(() => {
    if (loc.hash) {
      requestAnimationFrame(() => document.getElementById(loc.hash.slice(1))?.scrollIntoView());
    } else {
      window.scrollTo(0, 0);
    }
  }, [loc]);

  const value = useMemo(() => ({ path: loc.path, navigate }), [loc.path, navigate]);
  return (
    <RouterCtx.Provider value={value}>
      {children}
      <div className={`curtain ${curtain || ""}`} aria-hidden="true">
        <div className="curtain-mark">
          <Flame />
          <span>زرتسترا</span>
        </div>
      </div>
    </RouterCtx.Provider>
  );
}

export function Link({ to, children, onClick, ...rest }) {
  const { navigate } = useRouter();
  const handle = (e) => {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    navigate(to);
  };
  return (
    <a href={withBase(to)} onClick={handle} {...rest}>
      {children}
    </a>
  );
}
