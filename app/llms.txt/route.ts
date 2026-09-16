import { posts } from "@/content/posts";
import { defaultLocale } from "@/lib/i18n";
import { site } from "@/lib/site";
import { localePath } from "@/lib/urls";

export const dynamic = "force-static";

export function GET() {
  const lines = [
    `# ${site.author}`,
    "",
    `> ${site.descriptions[defaultLocale]}`,
    "",
    "Personal blog written by hand in semantic HTML, available in Portuguese",
    "(pt-br) and English (en). Each post below has its full text at the",
    "given URL — no paywall, no JS required.",
    "",
    "## Posts",
    "",
    ...posts.map(
      (post) =>
        `- [${post.meta.title}](${site.url}${localePath(post.meta.lang, `blog/${post.meta.slug}`)}) [${post.meta.lang}]: ${post.meta.excerpt} (${post.meta.date})`
    ),
    "",
    "## Feeds",
    "",
    `- RSS: ${site.url}/feed.xml`,
    `- Sitemap: ${site.url}/sitemap.xml`,
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
