import { useEffect, useRef, useState } from "react";
import { ALT, CHANNEL, byId, heading, mediaUrl, neighbors, excerpt } from "../data";
import { Link } from "../router";
import { Arrow, Note } from "../components/Icons";

const fa = (n) => n.toLocaleString("fa-IR");

function NotFound() {
  return (
    <div className="cat-hero">
      <div className="wrap">
        <h1 className="big">پیدا نشد</h1>
        <p className="cat-intro">این نوشته وجود ندارد یا آدرس درست نیست.</p>
        <Link className="btn" to="/archive">
          رفتن به بایگانی
        </Link>
      </div>
    </div>
  );
}

export default function Post({ id }) {
  const p = byId(id);
  const bar = useRef(null);
  const [copied, setCopied] = useState(false);

  // نوار پیشرفت خواندن
  useEffect(() => {
    const el = bar.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      el.style.transform = `scaleX(${max > 0 ? Math.min(1, h.scrollTop / max) : 0})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [id]);

  if (!p) return <NotFound />;
  const { newer, older } = neighbors(id);
  const h = heading(p);

  const copy = async () => {
    const url = window.location.href;
    let ok = false;
    try {
      await navigator.clipboard.writeText(url);
      ok = true;
    } catch {
      // مرورگر اجازهٔ clipboard نداد (مثلاً بدون HTTPS): روش قدیمی‌تر
      try {
        const ta = document.createElement("textarea");
        ta.value = url;
        ta.setAttribute("readonly", "");
        ta.style.cssText = "position:fixed;opacity:0;pointer-events:none";
        document.body.appendChild(ta);
        ta.select();
        ok = document.execCommand("copy");
        ta.remove();
      } catch {
        ok = false;
      }
    }
    setCopied(ok ? "ok" : "fail");
    window.setTimeout(() => setCopied(false), 2200);
  };

  const nav = (post, dir) =>
    post && (
      <Link to={`/post/${post.id}`} className="pn" rel={dir === "next" ? "next" : "prev"}>
        <small>{dir === "next" ? "نوشتهٔ بعدی" : "نوشتهٔ قبلی"}</small>
        <b>{heading(post) || (post.music ? post.music.title : excerpt(post, 60) || (post.images.length ? "تصویر" : "ویدیو"))}</b>
        <span className="circle-btn" aria-hidden="true">
          <Arrow back={dir === "prev"} />
        </span>
      </Link>
    );

  return (
    <>
      <div className="progress" ref={bar} aria-hidden="true" />
      <article className="post">
        <header className="post-head wrap">
          <p className="meta-row big-meta">
            <time dateTime={p.iso}>
              {p.dateLabel}، {p.time}
            </time>
            {p.tags.map((t) => (
              <span className="tag" key={t}>
                {t}
              </span>
            ))}
            {p.plain && <span className="read">حدود {fa(p.minutes)} دقیقه خواندن</span>}
          </p>
          {h ? <h1>{h}</h1> : <h1 className="date-title">{p.music ? p.music.title : p.dateLabel}</h1>}
          {p.forwardedFrom !== null && (
            <p className="fwd">بازنشر از «{p.forwardedFrom || "کانالی دیگر"}». این نوشته از نویسندهٔ این وب‌لاگ نیست.</p>
          )}
        </header>

        {p.images.map((img) => (
          <figure className="p-fig wrap" key={img.src}>
            <img src={mediaUrl(img.src)} alt={ALT[img.src] || ""} width={img.w} height={img.h} />
          </figure>
        ))}
        {p.videos.map((v) => (
          <figure className="p-fig wrap" key={v.src}>
            <video controls preload="none" poster={v.poster ? mediaUrl(v.poster) : undefined} src={mediaUrl(v.src)}>
              مرورگر شما پخش ویدیو را پشتیبانی نمی‌کند.
            </video>
            {v.duration && <figcaption>مدت ویدیو: {v.duration}</figcaption>}
          </figure>
        ))}

        {p.music && (
          <div className="wrap music-card">
            <span className="note-ic big">
              <Note />
            </span>
            <div>
              <b>{p.music.title}</b>
              <p>فایل صدا در این وب‌لاگ نیست.</p>
              <div className="actions">
                {p.music.links.filter((l) => l.label === "links").map((l) => (
                  <a className="btn" key={l.href} href={l.href} target="_blank" rel="noopener noreferrer">
                    شنیدن
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {p.body.length > 0 && (
          <div className="prose wrap">
            {p.body.map((html, i) => (
              <p key={i} dangerouslySetInnerHTML={{ __html: html }} />
            ))}
          </div>
        )}

        <div className="wrap post-actions">
          <button className={`btn ghost copy-btn${copied === "ok" ? " ok" : ""}`} onClick={copy} aria-live="polite">
            {copied === "ok" ? "لینک کپی شد ✓" : copied === "fail" ? "کپی نشد؛ آدرس را از نوار بالا بردارید" : "کپی لینک این نوشته"}
          </button>
          <a className="btn ghost" href={CHANNEL.url} target="_blank" rel="noopener noreferrer">
            کانال تلگرام
          </a>
        </div>

        <nav className="wrap nav-pn" aria-label="نوشتهٔ قبلی و بعدی">
          {nav(older, "prev")}
          {nav(newer, "next")}
        </nav>
      </article>
    </>
  );
}
