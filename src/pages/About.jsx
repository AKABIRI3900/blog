import { ALT, CHANNEL, STATS, mediaUrl } from "../data";
import { Link } from "../router";

const fa = (n) => n.toLocaleString("fa-IR");

export default function About() {
  return (
    <div className="cat-hero">
      <div className="wrap cat-grid">
        <div>
          <p className="kicker">دربارهٔ من</p>
          <h1 className="big">علی کبیری</h1>
          <div className="prose-left">
            <p>
              من علی کبیری‌ام. این وب‌لاگ جای نوشته‌های من است: جستار، قطعه‌های کوتاه و گاهی تصویر، موسیقی و ویدیو. همه از
              کانال تلگرامی آمده که «{CHANNEL.name}» نام دارد و از {STATS.since} در آن می‌نویسم.
            </p>
            <p>
              بیشتر نوشته‌ها دربارهٔ رنج، تنهایی، مرگ، آزادی و قدرت‌اند. چند جستار هم دربارهٔ ماکیاولی و سیاست امروز
              نوشته‌ام که در بخش «ماکیاولی» کنار هم آمده‌اند.
            </p>
            <p>
              هر نوشته همان‌طور که اول در کانال آمده، این‌جا هم هست. فقط تاریخ‌ها شمسی نشان داده می‌شوند و همه‌چیز
              بایگانی و قابل جست‌وجوست. نوشته‌هایی که از دیگران بازنشر کرده‌ام با برچسب «بازنشر» و نام منبعشان مشخص‌اند.
            </p>
            <p>
              تا امروز {fa(STATS.posts)} پست، {fa(STATS.images)} تصویر و {fa(STATS.videos)} ویدیو در این وب‌لاگ آمده است.
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
