import { posts } from "@/content/posts";
import { defaultLocale } from "@/lib/i18n";
import { site } from "@/lib/site";
import { localePath } from "@/lib/urls";

export const dynamic = "force-static";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function GET() {
  const items = posts
    .map((post) => {
      const url = `${site.url}${localePath(post.meta.lang, `blog/${post.meta.slug}`)}`;
      const pubDate = new Date(post.meta.date).toUTCString();
      return `    <item>
      <title>${escapeXml(post.meta.title)}</title>
      <link>${url}</link>
      <guid>${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(post.meta.excerpt)}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(site.author)} — blog pessoal</title>
    <link>${site.url}</link>
    <description>${escapeXml(site.descriptions[defaultLocale])}</description>
    <language>pt-br</language>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
