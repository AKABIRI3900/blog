import { ALT, CHANNEL, STATS, mediaUrl } from "../data";
import { Link } from "../router";

const fa = (n) => n.toLocaleString("fa-IR");

export default function About() {
  return (
    <div className="cat-hero">
      <div className="wrap cat-grid">
        <div>
          <p className="kicker">دربارهٔ این وب‌لاگ</p>
          <h1 className="big">زرتسترا</h1>
          <div className="prose-left">
            <p>
              این وب‌لاگ نسخهٔ کاملِ نوشته‌های کانال «{CHANNEL.name}» در تلگرام است. هر نوشته همان‌طور که در کانال آمده این‌جا
              هم هست؛ فقط تاریخ‌ها شمسی نشان داده می‌شوند و نوشته‌ها بایگانی و قابل جست‌وجوند.
            </p>
            <p>
              تا امروز {fa(STATS.posts)} پست، {fa(STATS.images)} تصویر و {fa(STATS.videos)} ویدیو از {STATS.since} تا کنون در
              آن آمده است. نوشته‌های بازنشرشده با برچسب «بازنشر» و نام منبعشان مشخص شده‌اند.
            </p>
          </div>
          <div className="actions">
            <a className="btn" href={CHANNEL.url} target="_blank" rel="noopener noreferrer">
              کانال تلگرام
            </a>
            <Link className="btn ghost" to="/archive">
              خواندن نوشته‌ها
            </Link>
          </div>
        </div>
        <div className="cat-cover">
          <img src={mediaUrl(CHANNEL.avatar)} alt={ALT[CHANNEL.avatar]} width="640" height="640" />
        </div>
      </div>
    </div>
  );
}
