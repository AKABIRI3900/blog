import { ALT, excerpt, heading, mediaUrl } from "../data";
import { Link } from "../router";
import { Note, Play } from "./Icons";

const label = (p) => (p.images.length ? "تصویر" : p.videos.length ? "ویدیو" : "نوشته");

/* کارت یک پست. نوشته‌های بی‌عنوان با خود متن معرفی می‌شوند، نه عنوان ساختگی. */
export default function PostCard({ p, big = false }) {
  const h = heading(p);
  const img = p.images[0];
  const vid = p.videos[0];
  const text = excerpt(p, big ? 360 : 190);

  return (
    <article className={`card${big ? " big-card" : ""}`}>
      <Link to={`/post/${p.id}`} className="card-link" aria-label={`خواندن: ${h || text.slice(0, 40) || p.music?.title || label(p)}`}>
        {(img || vid || p.music) && (
          <span className={`card-media${p.music ? " music" : ""}`}>
            {img && <img src={mediaUrl(img.src)} alt={ALT[img.src] || ""} width={img.w} height={img.h} loading="lazy" />}
            {!img && vid && (
              <>
                <img src={mediaUrl(vid.poster)} alt={ALT[vid.poster] || ""} loading="lazy" />
                <span className="play-badge">
                  <Play />
                </span>
              </>
            )}
            {p.music && <Note />}
          </span>
        )}
        <span className="card-body">
          <span className="meta-row">
            <time dateTime={p.iso}>{p.dateLabel}</time>
            {p.tags.map((t) => (
              <span className="tag" key={t}>
                {t}
              </span>
            ))}
          </span>
          {h && <h3>{h}</h3>}
          {p.music ? (
            <span className="music-line">{p.music.title}</span>
          ) : text ? (
            <span className="ex">{text}</span>
          ) : (
            !h && <span className="ex dim">{label(p)}</span>
          )}
        </span>
      </Link>
    </article>
  );
}
