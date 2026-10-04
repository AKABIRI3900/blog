import { useEffect, useRef } from "react";
import { RouterProvider, useRouter } from "./router";
import { byId, heading, excerpt } from "./data";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Archive from "./pages/Archive";
import Post from "./pages/Post";
import About from "./pages/About";
import useRipple from "./useRipple";

function titleFor(path) {
  if (path === "/") return "زرتسترا | وب‌لاگ شخصی";
  if (path === "/archive") return "نوشته‌ها | زرتسترا";
  if (path === "/about") return "درباره | زرتسترا";
  if (path.startsWith("/post/")) {
    const p = byId(path.slice(6));
    if (!p) return "پیدا نشد | زرتسترا";
    const t = heading(p) || p.music?.title || excerpt(p, 50) || p.dateLabel;
    return `${t} | زرتسترا`;
  }
  return "زرتسترا";
}

function Routes() {
  const { path } = useRouter();
  const mainRef = useRef(null);
  useRipple();

  // عنوان تب را به‌روز کن و بعد از تغییر صفحه فوکوس را به محتوا ببر (برای صفحه‌خوان و کیبورد)
  useEffect(() => {
    document.title = titleFor(path);
    mainRef.current?.focus({ preventScroll: true });
  }, [path]);

  let page;
  if (path === "/") page = <Home />;
  else if (path === "/archive") page = <Archive />;
  else if (path === "/about") page = <About />;
  else if (path.startsWith("/post/")) page = <Post id={path.slice(6)} key={path} />;
  else page = <Post id="" />;

  return (
    <>
      <a className="skip" href="#main">
        رفتن به محتوا
      </a>
      <Header />
      <main id="main" ref={mainRef} tabIndex={-1}>
        {page}
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <Routes />
    </RouterProvider>
  );
}
