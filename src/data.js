import raw from "./posts.json";

export const CHANNEL = raw.channel;
export const POSTS = raw.posts; // تازه‌ترین اول
export const mediaUrl = (name) => `${import.meta.env.BASE_URL}media/${name}`;

/* متن جایگزین برای تصویرها (توصیف آنچه در تصویر دیده می‌شود) */
export const ALT = {
  "avatar.jpg": "پیرمردی ریش‌سفید با ردایی رنگین و عصا در برابر آسمانی نارنجی و کوه",
  "photo-2.jpg": "پیرمردی با ردای سفید در کوهستانی برفی، پادشاهی ناتوان با تاج زرین را در آغوش گرفته است",
  "photo-3.jpg": "مردی لاغر و زانوزده با پارچه‌ای پاره در دست، رو به گربه‌ای سیاه‌وسفید",
  "photo-4.jpg": "مردی با تنی پر از زخم که دستش در شعله می‌سوزد و رو به بالا نگاه می‌کند",
  "photo-5.jpg": "مردی گریان که زنی را در آغوش گرفته است، در تاریکی",
  "photo-6.jpg": "اسبی سفید و زین‌شده بر دو پا ایستاده بالای پیکره‌ای ترک‌خورده از سنگ، در دشتی خشک",
  "photo-7.jpg": "مردی با پالتو از پشت، بر تپه‌ای تاریک رو به غروب سرخ زیر ابرهای سنگین",
  "video-1.jpg": "گلی سفید میان دو دست که از شکاف سنگ بیرون آمده است",
  "video-2.jpg": "دستی از دل دریای سیاه شمشیری را بالا گرفته است",
};

const stripTags = (html) =>
  html.replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/\s+/g, " ").trim();

/* جست‌وجو: حروف عربی و فاصلهٔ مجازی یکی گرفته می‌شوند */
export const norm = (s) =>
  s.normalize("NFKC").replace(/[ً-ٰٟ‌‍]/g, "").replace(/ي/g, "ی").replace(/ك/g, "ک").replace(/ة/g, "ه").toLowerCase();

export const excerpt = (p, n = 200) => {
  const t = stripTags(p.body.join(" "));
  return t.length > n ? t.slice(0, n).replace(/\s\S*$/, "") + "…" : t;
};

export const heading = (p) => (p.title ? stripTags(p.title) : null);

POSTS.forEach((p) => {
  p._search = norm(`${p.plain} ${p.music?.title || ""} ${p.forwardedFrom || ""} ${p.tags.join(" ")}`);
});

export const byId = (id) => POSTS.find((p) => p.id === id);
export const neighbors = (id) => {
  const i = POSTS.findIndex((p) => p.id === id);
  return { newer: i > 0 ? POSTS[i - 1] : null, older: i >= 0 && i < POSTS.length - 1 ? POSTS[i + 1] : null };
};

export const TAGS = [...POSTS.reduce((m, p) => (p.tags.forEach((t) => m.set(t, (m.get(t) || 0) + 1)), m), new Map())]
  .sort((a, b) => b[1] - a[1])
  .map(([name, count]) => ({ name, count }));

export const SERIES = POSTS.filter((p) => p.series === "ماکیاولی").slice().reverse(); // قدیمی‌ترین اول
export const MUSIC = POSTS.filter((p) => p.music);
export const GALLERY = POSTS.flatMap((p) => [
  ...p.images.map((img) => ({ post: p, kind: "image", src: img.src, w: img.w, h: img.h })),
  ...p.videos.map((v) => ({ post: p, kind: "video", src: v.poster, video: v.src, duration: v.duration })),
]);

export const STATS = {
  posts: POSTS.length,
  images: POSTS.reduce((a, p) => a + p.images.length, 0),
  videos: POSTS.reduce((a, p) => a + p.videos.length, 0),
  music: MUSIC.length,
  since: POSTS[POSTS.length - 1].monthLabel,
};
