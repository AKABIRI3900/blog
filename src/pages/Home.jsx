import { ALT, CHANNEL, GALLERY, MUSIC, POSTS, SERIES, STATS, excerpt, mediaUrl } from "../data";
import { Link } from "../router";
import { Play, Note, ScribbleArrow, Sparkle } from "../components/Icons";
import PostCard from "../components/PostCard";

const fa = (n) => n.toLocaleString("fa-IR");

export default function Home() {
  const latest = POSTS.find((p) => p.plain) || POSTS[0];
  const rest = POSTS.filter((p) => p !== latest).slice(0, 6);

  return (
    <>
      <div className="hero" id="top">
        <div className="hero-glow" aria-hidden="true" />
        <Sparkle style={{ insetInlineStart: "46%", top: 140 }} />
        <div className="wrap hero-grid">
          <div className="hero-body">
            <p className="kicker">وب‌لاگ شخصی</p>
            <h1 className="big">زرتسترا</h1>
            <p className="hero-sub">جستار، قطعه و تصویر. هر نوشته همان‌طور که در کانال آمده، با تاریخ شمسی و بدون دست‌کاری.</p>
            <div className="actions">
              <Link className="btn" to={`/post/${latest.id}`}>
                خواندن تازه‌ترین نوشته
              </Link>
              <Link className="btn ghost" to="/archive">
                همهٔ نوشته‌ها
              </Link>
            </div>
            <dl className="facts">
              <div>
                <dt>نوشته و پست</dt>
                <dd>{fa(STATS.posts)}</dd>
              </div>
              <div>
                <dt>تصویر</dt>
                <dd>{fa(STATS.images)}</dd>
              </div>
              <div>
                <dt>ویدیو</dt>
                <dd>{fa(STATS.videos)}</dd>
              </div>
            </dl>
          </div>
          <div className="hero-arch">
            <img src={mediaUrl(CHANNEL.avatar)} alt={ALT[CHANNEL.avatar]} width="640" height="640" />
          </div>
        </div>
      </div>

      <section id="latest" aria-labelledby="lat-h">
        <div className="wrap">
          <div className="col-head">
            <h2 className="big" id="lat-h">
              تازه‌ترین
            </h2>
            <Link className="btn ghost" to="/archive">
              بایگانی کامل
            </Link>
          </div>
          <div className="latest-grid">
            <PostCard p={latest} big />
            <div className="cards">
              {rest.map((p) => (
                <PostCard key={p.id} p={p} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {SERIES.length > 0 && (
        <section id="series" aria-labelledby="ser-h" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <h2 className="big" id="ser-h" style={{ marginBottom: 12 }}>
              ماکیاولی
            </h2>
            <p className="extra-note">جستارهایی که پشت‌سر هم دربارهٔ ماکیاولی نوشته شده‌اند، به ترتیب انتشار.</p>
            <ol className="series">
              {SERIES.map((p) => (
                <li key={p.id}>
                  <Link className="row-link" to={`/post/${p.id}`}>
                    <span className="num" aria-hidden="true" />
                    <span className="s-text">
                      <b>{excerpt(p, 96)}</b>
                      <small>
                        {p.dateLabel} · حدود {fa(p.minutes)} دقیقه
                      </small>
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      <section id="gallery" aria-labelledby="gal-h" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <h2 className="big" id="gal-h" style={{ marginBottom: "clamp(20px,3vw,36px)" }}>
            تصویرها
          </h2>
          <ul className="gal">
            {GALLERY.map((g) => (
              <li key={g.src}>
                <Link to={`/post/${g.post.id}`} className="gal-item" aria-label={`${g.kind === "video" ? "ویدیو" : "تصویر"} از ${g.post.dateLabel}`}>
                  <img src={mediaUrl(g.src)} alt={ALT[g.src] || ""} loading="lazy" />
                  {g.kind === "video" && (
                    <span className="play-badge">
                      <Play />
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {MUSIC.length > 0 && (
        <section id="music" aria-labelledby="mus-h" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <h2 className="big" id="mus-h" style={{ marginBottom: 12 }}>
              موسیقی
            </h2>
            <p className="extra-note">آهنگ‌هایی که کنار نوشته‌ها گذاشته شده‌اند. فایل صدا در این وب‌لاگ نیست؛ فقط لینک آن (اگر در کانال بوده).</p>
            <ul className="tracks">
              {MUSIC.map((p) => (
                <li key={p.id}>
                  <span className="note-ic">
                    <Note />
                  </span>
                  <div className="t-text">
                    <b>{p.music.title}</b>
                    <small>{p.dateLabel}</small>
                  </div>
                  {p.music.links.filter((l) => l.label === "links").map((l) => (
                    <a className="btn ghost" key={l.href} href={l.href} target="_blank" rel="noopener noreferrer">
                      شنیدن
                    </a>
                  ))}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section aria-labelledby="cta-h" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="cta">
            <h2 className="big" id="cta-h">
              هر نوشته اول در کانال
            </h2>
            <a className="btn" href={CHANNEL.url} target="_blank" rel="noopener noreferrer">
              رفتن به کانال تلگرام
              <ScribbleArrow />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
