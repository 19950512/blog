import type { Post } from "@/content/posts";
import { getDictionary, type Locale } from "./i18n";
import { site } from "./site";
import { localePath } from "./urls";
import avatarPhoto from "@/public/eu-mesmo.jpeg";

const avatarUrl = `${site.url}${avatarPhoto.src}`;

export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.author,
    url: site.url,
    image: avatarUrl,
    ...(site.links.github
      ? { sameAs: [site.links.github, site.links.linkedin].filter(Boolean) }
      : {}),
  };
}

export function websiteSchema(locale: Locale) {
  const dict = getDictionary(locale);
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: `${site.author} — blog pessoal`,
    description: site.descriptions[locale],
    url: `${site.url}${localePath(locale)}`,
    inLanguage: dict.htmlLang,
    author: { "@type": "Person", name: site.author, url: site.url },
  };
}

type BreadcrumbItem = { name: string; path: string };

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${site.url}${item.path}`,
    })),
  };
}

export function blogCollectionSchema(locale: Locale, posts: Post[]) {
  const dict = getDictionary(locale);
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: dict.blog.title,
    description: dict.blog.intro,
    url: `${site.url}${localePath(locale, "blog")}`,
    inLanguage: dict.htmlLang,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: posts.map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${site.url}${localePath(locale, `blog/${post.meta.slug}`)}`,
        name: post.meta.title,
      })),
    },
  };
}

export function blogPostingSchema(post: Post) {
  const { meta } = post;
  const locale = meta.lang;
  const dict = getDictionary(locale);
  const url = `${site.url}${localePath(locale, `blog/${meta.slug}`)}`;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: meta.title,
    description: meta.excerpt,
    datePublished: meta.date,
    dateModified: meta.date,
    inLanguage: dict.htmlLang,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    isPartOf: {
      "@type": "Blog",
      name: dict.blog.title,
      url: `${site.url}${localePath(locale, "blog")}`,
    },
    image: avatarUrl,
    author: { "@type": "Person", name: site.author, url: site.url },
    publisher: { "@type": "Person", name: site.author, url: site.url },
    keywords: meta.tags.join(", "),
  };
}
