import { useEffect, useMemo, useRef, useState } from "react";
import { POSTS, TAGS, excerpt, heading, norm } from "../data";
import { Link } from "../router";
import { Search } from "../components/Icons";

const fa = (n) => n.toLocaleString("fa-IR");

export default function Archive() {
  const [q, setQ] = useState("");
  const [tag, setTag] = useState("همه");
  const [oldest, setOldest] = useState(false);
  const [shuffled, setShuffled] = useState(false);
  const inputRef = useRef(null);

  // وقتی با «جست‌وجو» از هدر آمده‌ایم، فوکوس مستقیم روی کادر جست‌وجو برود
  useEffect(() => {
    if (window.location.hash === "#search") inputRef.current?.focus({ preventScroll: true });
  }, []);

  const list = useMemo(() => {
    const nq = norm(q.trim());
    const out = POSTS.filter((p) => (tag === "همه" || p.tags.includes(tag)) && (!nq || p._search.includes(nq)));
    return oldest ? out.slice().reverse() : out;
  }, [q, tag, oldest]);

  const groups = useMemo(() => {
    const m = new Map();
    list.forEach((p) => m.set(p.monthLabel, [...(m.get(p.monthLabel) || []), p]));
    return [...m];
  }, [list]);

  const touch = (fn) => (...a) => (setShuffled(true), fn(...a));

  return (
    <>
      <div className="cat-hero">
        <div className="wrap">
          <p className="kicker">بایگانی</p>
          <h1 className="big">نوشته‌ها</h1>
          <p className="cat-intro">همهٔ پست‌های کانال، از تازه‌ترین تا قدیمی‌ترین. در متن جست‌وجو کنید یا با برچسب فیلتر کنید.</p>
        </div>
      </div>

      <section id="search" aria-label="جست‌وجو و فیلتر" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <label className="search-box">
            <Search />
            <span className="sr-only">جست‌وجو در نوشته‌ها</span>
            <input
              ref={inputRef}
              type="search"
              value={q}
              placeholder="دنبال چه می‌گردید؟ مثلاً: مرگ، ماکیاول، شب"
              onChange={touch((e) => setQ(e.target.value))}
            />
          </label>

          <div className="filter-row">
            <div className="chips" role="group" aria-label="فیلتر برچسب">
              {[{ name: "همه", count: POSTS.length }, ...TAGS].map((t) => (
                <button key={t.name} className="chip" aria-pressed={t.name === tag} onClick={touch(() => setTag(t.name))}>
                  {t.name} <span className="cnt">{fa(t.count)}</span>
                </button>
              ))}
            </div>
            <button className="chip" aria-pressed={oldest} onClick={touch(() => setOldest((o) => !o))}>
              {oldest ? "قدیمی‌ترین اول" : "تازه‌ترین اول"}
            </button>
          </div>

          <p role="status" className="result-msg">
            {list.length === 0 ? "نتیجه‌ای پیدا نشد. عبارت دیگری امتحان کنید یا فیلتر را بردارید." : `${fa(list.length)} پست`}
          </p>

          <div className={`timeline${shuffled ? " shuffled" : ""}`}>
            {groups.map(([month, items]) => (
              <section key={`${month}-${tag}-${q}-${oldest}`} aria-label={month} className="month">
                <h2>{month}</h2>
                <ul>
                  {items.map((p, i) => {
                    const h = heading(p);
                    const text = excerpt(p, 150);
                    return (
                      <li key={p.id} style={{ "--i": i }}>
                        <Link className="row-link" to={`/post/${p.id}`}>
                          <span className="r-date">
                            <b>{p.dateLabel.split(" ")[0]}</b>
                            <small>{p.time}</small>
                          </span>
                          <span className="r-text">
                            <b>{h || (p.music ? p.music.title : text.slice(0, 80) || (p.images.length ? "تصویر" : "ویدیو"))}</b>
                            {(h || p.music) && text ? <small>{text}</small> : null}
                            {!h && !p.music && text.length > 80 ? <small>{text.slice(80)}</small> : null}
                          </span>
                          <span className="r-tags">
                            {p.tags.map((t) => (
                              <span className="tag" key={t}>
                                {t}
                              </span>
                            ))}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
