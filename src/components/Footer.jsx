import { CHANNEL, STATS } from "../data";
import { Link } from "../router";

export default function Footer() {
  return (
    <footer>
      <div className="arc" aria-hidden="true" />
      <div className="wrap foot">
        <div className="big word" aria-hidden="true">
          زرتسترا
        </div>
        <div className="follow">
          <p>همین نوشته‌ها در تلگرام</p>
          <a className="btn" href={CHANNEL.url} target="_blank" rel="noopener noreferrer">
            عضویت در کانال
          </a>
        </div>
      </div>
      <div className="wrap legal">
        <span>© زرتسترا · {STATS.posts.toLocaleString("fa-IR")} نوشته از {STATS.since}</span>
        <nav aria-label="پیوندها" className="legal-nav">
          <Link to="/archive">نوشته‌ها</Link>
          <Link to="/about">درباره</Link>
        </nav>
      </div>
    </footer>
  );
}
