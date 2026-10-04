import { useEffect, useState } from "react";
import { Link, useRouter } from "../router";
import { Flame } from "./Icons";

const LINKS = [
  { to: "/archive", label: "نوشته‌ها" },
  { to: "/#series", label: "سلسله" },
  { to: "/#gallery", label: "تصویرها" },
  { to: "/#music", label: "موسیقی" },
  { to: "/about", label: "درباره" },
];

export default function Header() {
  const { path } = useRouter();
  const [menu, setMenu] = useState(false);

  // با رفتن به صفحهٔ دیگر منوی موبایل بسته شود
  useEffect(() => setMenu(false), [path]);

  return (
    <header className={path === "/" ? "over" : "solid"}>
      <div className="wrap nav">
        <Link className="brand" to="/" aria-label="زرتسترا، صفحهٔ اصلی">
          <Flame />
          زرتسترا
        </Link>

        <nav id="site-nav" className={menu ? "open" : ""} aria-label="منوی اصلی">
          <ul>
            {LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} aria-current={path === l.to ? "page" : undefined}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <button className="menu-btn" aria-expanded={menu} aria-controls="site-nav" onClick={() => setMenu((m) => !m)}>
          {menu ? "بستن" : "منو"}
        </button>
        <Link className="btn nav-cta" to="/archive#search">
          جست‌وجو
        </Link>
      </div>
    </header>
  );
}
