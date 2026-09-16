import type { MetadataRoute } from "next";
import { posts } from "@/content/posts";
import { locales } from "@/lib/i18n";
import { site } from "@/lib/site";
import { localePath } from "@/lib/urls";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = locales.flatMap((locale) => [
    { url: `${site.url}${localePath(locale)}`, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}${localePath(locale, "blog")}`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${site.url}${localePath(locale, "sobre")}`, changeFrequency: "yearly", priority: 0.5 },
  ]);

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${site.url}${localePath(post.meta.lang, `blog/${post.meta.slug}`)}`,
    lastModified: post.meta.date,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...postRoutes];
}
