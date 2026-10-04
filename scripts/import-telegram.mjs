/* واردکردن خروجی HTML تلگرام (Export chat history) به وب‌لاگ.
   استفاده:  node scripts/import-telegram.mjs "D:\claud\ChatExport_2026-10-04"
   خروجی: src/posts.json و فایل‌های عکس و ویدیو در public/media.
   متن پست‌ها دست‌نخورده می‌ماند؛ فقط قالب‌بندی (پررنگ، کج، لینک) و شکستن پاراگراف‌ها حفظ می‌شود. */
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const src = process.argv[2];
if (!src || !existsSync(src)) {
  console.error('پوشهٔ خروجی تلگرام را بدهید: node scripts/import-telegram.mjs "<ChatExport dir>"');
  process.exit(1);
}
const OUT_MEDIA = "public/media";
mkdirSync(OUT_MEDIA, { recursive: true });

/* ---------- ابزارها ---------- */
const ENT = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", laquo: "«", raquo: "»", zwnj: "\u200c" };
const decode = (s) =>
  s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&([a-z]+);/gi, (m, n) => ENT[n.toLowerCase()] ?? m);
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const escAttr = (s) => esc(s).replace(/"/g, "&quot;");

/* متن تلگرام → HTML امن: فقط strong/em/code/a(http) می‌ماند، بقیه حذف می‌شود */
function toHtml(inner) {
  let out = "";
  let pos = 0;
  const stack = [];
  const re = /<(\/?)(\w+)([^>]*)>/g;
  let m;
  while ((m = re.exec(inner))) {
    out += esc(decode(inner.slice(pos, m.index)));
    pos = re.lastIndex;
    const [, close, tag, attrs] = m;
    if (tag === "br") {
      out += "\n";
    } else if (tag === "strong" || tag === "em" || tag === "code") {
      out += close ? `</${tag}>` : `<${tag}>`;
    } else if (tag === "a") {
      if (close) {
        out += stack.pop() ? "</a>" : "";
      } else {
        const href = decode(/href="([^"]*)"/.exec(attrs)?.[1] ?? "");
        const ok = /^https?:\/\//i.test(href);
        stack.push(ok);
        if (ok) out += `<a href="${escAttr(href)}" target="_blank" rel="noopener noreferrer">`;
      }
    }
  }
  out += esc(decode(inner.slice(pos)));
  return out;
}
const strip = (html) => decode(html.replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim();

function jpegSize(file) {
  const b = readFileSync(file);
  let i = 2;
  while (i < b.length) {
    if (b[i] !== 0xff) { i++; continue; }
    const m = b[i + 1];
    if (m >= 0xc0 && m <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(m)) return { h: b.readUInt16BE(i + 5), w: b.readUInt16BE(i + 7) };
    i += 2 + b.readUInt16BE(i + 2);
  }
  return { w: 0, h: 0 };
}

const jalaliParts = (iso) => {
  const d = new Date(iso);
  const f = (opts) => new Intl.DateTimeFormat("fa-IR", { calendar: "persian", timeZone: "Asia/Tehran", ...opts }).format(d);
  return {
    dateLabel: f({ day: "numeric", month: "long", year: "numeric" }),
    // ماه و سال جدا ساخته می‌شوند تا ترتیب «شهریور ۱۴۰۵» حفظ شود (قالب پیش‌فرض ICU سال را اول می‌گذارد)
    monthLabel: `${f({ month: "long" })} ${f({ year: "numeric" })}`,
    year: f({ year: "numeric" }),
    time: f({ hour: "2-digit", minute: "2-digit", hour12: false }),
  };
};

/* ---------- خواندن پیام‌ها ---------- */
const files = readdirSync(src).filter((f) => /^messages\d*\.html$/.test(f)).sort((a, b) => (parseInt(a.replace(/\D/g, "") || "1") - parseInt(b.replace(/\D/g, "") || "1")));
const html = files.map((f) => readFileSync(join(src, f), "utf8")).join("\n");
const blocks = html.split(/(?=<div class="message (?:default|service))/).filter((b) => b.startsWith('<div class="message'));

let channelName = "";
let avatarFrom = null;
const messages = [];

for (const b of blocks) {
  if (b.startsWith('<div class="message service')) {
    const created = /Channel &laquo;([\s\S]*?)&raquo; created/.exec(b);
    if (created) channelName = decode(created[1]).trim();
    const pic = /href="(photos\/[^"]+)"/.exec(b);
    if (pic && /Channel photo changed/.test(b)) avatarFrom = pic[1];
    continue;
  }
  const dt = /title="(\d\d)\.(\d\d)\.(\d{4}) (\d\d):(\d\d):(\d\d) UTC([+-]\d\d:\d\d)"/.exec(b);
  if (!dt) continue;
  const [, dd, mo, yy, hh, mi, ss, off] = dt;
  const forwarded = b.includes('class="forwarded body"');
  let forwardedFrom = null;
  if (forwarded) {
    const fb = b.slice(b.indexOf('class="forwarded body"'));
    const fm = /<div class="from_name">\s*([\s\S]*?)(?:<span|<\/div>)/.exec(fb);
    forwardedFrom = fm ? strip(fm[1]) : "";
  }
  const text = /<div class="text">([\s\S]*?)<\/div>/.exec(b);
  const photo = /<a class="photo_wrap[^"]*" href="(photos\/[^"]+)"/.exec(b)?.[1] ?? null;
  const video = /<a class="video_file_wrap[^"]*" href="(video_files\/[^"]+)"/.exec(b)?.[1] ?? null;
  const duration = /class="video_duration[^"]*">\s*([^<]+?)\s*</.exec(b)?.[1] ?? null;
  const audio = b.includes("media_audio_file") ? strip(/<div class="title bold">([\s\S]*?)<\/div>/.exec(b)?.[1] ?? "") : null;
  messages.push({
    key: `${dd}.${mo}.${yy} ${hh}:${mi}:${ss}`,
    iso: `${yy}-${mo}-${dd}T${hh}:${mi}:${ss}${off}`,
    slug: `${yy}${mo}${dd}-${hh}${mi}`,
    joined: / joined/.test(b.slice(0, 80)),
    forwardedFrom,
    textHtml: text ? toHtml(text[1]) : "",
    photo, video, duration, audio,
  });
}

/* پیام‌های هم‌ثانیهٔ پشت‌سرهم (تلگرام متن بلند را دو تکه می‌کند) یک پست می‌شوند */
const merged = [];
for (const m of messages) {
  const prev = merged[merged.length - 1];
  if (prev && m.joined && prev.key === m.key) {
    prev.textHtml = [prev.textHtml, m.textHtml].filter(Boolean).join("\n\n");
    prev.photos.push(...(m.photo ? [m.photo] : []));
    if (m.video) prev.videos.push({ file: m.video, duration: m.duration });
    if (m.audio) prev.audio = m.audio;
  } else {
    merged.push({ ...m, photos: m.photo ? [m.photo] : [], videos: m.video ? [{ file: m.video, duration: m.duration }] : [] });
  }
}

/* ---------- ساخت پست‌ها و کپی رسانه ---------- */
const slugCount = {};
const copyMedia = (rel, name) => {
  const from = join(src, rel);
  if (!existsSync(from)) return null;
  copyFileSync(from, join(OUT_MEDIA, name));
  return name;
};

const MAX_TITLE = 90;
const posts = merged.map((m) => {
  // در پست موسیقی، متن فقط «links / via» است. آن را نوشته حساب نمی‌کنیم و لینک‌ها جدا نگه داشته می‌شوند.
  const paragraphs = (m.audio ? "" : m.textHtml)
    .split(/\n\s*\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => p.replace(/\n/g, "<br>"));
  const plainParas = paragraphs.map((p) => strip(p));

  // عنوان: خط اول فقط اگر کوتاه باشد و چیز دیگری هم برای خواندن مانده باشد (متن حذف نمی‌شود، فقط جابه‌جا می‌شود)
  const hasMoreBody = paragraphs.length > 1;
  const title = plainParas[0] && plainParas[0].length <= MAX_TITLE && hasMoreBody ? paragraphs[0] : null;
  const body = title ? paragraphs.slice(1) : paragraphs;
  const plain = plainParas.join(" ");

  slugCount[m.slug] = (slugCount[m.slug] || 0) + 1;
  const slug = slugCount[m.slug] > 1 ? `${m.slug}-${slugCount[m.slug]}` : m.slug;

  const images = m.photos.map((p) => {
    const n = /photo_(\d+)@/.exec(p)?.[1] ?? slug;
    const name = copyMedia(p, `photo-${n}.jpg`);
    return name ? { src: name, ...jpegSize(join(src, p)) } : null;
  }).filter(Boolean);
  const videos = m.videos.map((v) => {
    const n = /video_(\d+)@/.exec(v.file)?.[1] ?? slug;
    const file = copyMedia(v.file, `video-${n}.mp4`);
    const poster = copyMedia(`${v.file}_thumb.jpg`, `video-${n}.jpg`);
    return file ? { src: file, poster, duration: v.duration } : null;
  }).filter(Boolean);

  const tags = [];
  if (m.audio) tags.push("موسیقی");
  else if (plain.length > 1500) tags.push("جستار");
  else if (plain) tags.push("قطعه");
  if (images.length) tags.push("عکس");
  if (videos.length) tags.push("ویدیو");
  if (m.forwardedFrom !== null) tags.push("بازنشر");

  const series = /ماکیاول/.test(plain.slice(0, 160)) ? "ماکیاولی" : null;
  const words = plain.split(/\s+/).filter(Boolean).length;

  return {
    id: slug,
    iso: m.iso,
    ...jalaliParts(m.iso),
    title,
    body,
    plain,
    tags,
    series,
    images,
    videos,
    music: m.audio ? { title: m.audio, links: [...m.textHtml.matchAll(/<a href="([^"]+)"[^>]*>([^<]*)<\/a>/g)].map((x) => ({ href: x[1].replace(/&amp;/g, "&"), label: x[2] })) } : null,
    forwardedFrom: m.forwardedFrom,
    minutes: Math.max(1, Math.round(words / 180)),
  };
});

posts.reverse(); // تازه‌ترین اول

const avatar = avatarFrom ? copyMedia(avatarFrom, "avatar.jpg") : null;
const data = {
  channel: { name: channelName || "کانال", url: "https://t.me/sanmartin1378", avatar },
  generatedFrom: files,
  posts,
};
mkdirSync("src", { recursive: true });
writeFileSync("src/posts.json", JSON.stringify(data, null, 1), "utf8");

const count = (f) => posts.filter(f).length;
console.log(`کانال: ${data.channel.name}`);
console.log(`پست‌ها: ${posts.length} | با متن: ${count((p) => p.plain)} | عکس: ${count((p) => p.images.length)} | ویدیو: ${count((p) => p.videos.length)} | موسیقی: ${count((p) => p.music)} | بازنشر: ${count((p) => p.forwardedFrom !== null)} | با عنوان: ${count((p) => p.title)}`);
console.log(`آواتار: ${avatar}`);
