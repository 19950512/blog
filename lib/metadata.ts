import type { Metadata } from "next";
import { getDictionary, type Locale } from "./i18n";
import { site } from "./site";
import { localePath } from "./urls";
import avatarPhoto from "@/public/eu-mesmo.jpeg";

const avatarImage = {
  url: avatarPhoto.src,
  width: avatarPhoto.width,
  height: avatarPhoto.height,
};

export function baseMetadata(locale: Locale): Metadata {
  const description = site.descriptions[locale];
  const titleFull = `${site.author} — blog pessoal`;

  return {
    metadataBase: new URL(site.url),
    title: { default: titleFull, template: `%s — ${site.author}` },
    description,
    authors: [{ name: site.author }],
    alternates: {
      canonical: localePath(locale),
      languages: { "pt-BR": localePath("pt-br"), en: localePath("en") },
      types: {
        "application/rss+xml": [{ url: "/feed.xml", title: `${site.author} — RSS` }],
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "pt-br" ? "pt_BR" : "en_US",
      siteName: titleFull,
      title: titleFull,
      description,
      url: localePath(locale),
      images: [avatarImage],
    },
    twitter: {
      card: "summary_large_image",
      title: titleFull,
      description,
      images: [avatarImage.url],
    },
  };
}

export function blogIndexMetadata(locale: Locale): Metadata {
  const dict = getDictionary(locale);
  return {
    title: dict.blog.title,
    description: dict.blog.intro,
    alternates: { canonical: localePath(locale, "blog") },
  };
}

export function sobreMetadata(locale: Locale): Metadata {
  const dict = getDictionary(locale);
  return {
    title: dict.sobre.title,
    description: dict.sobre.intro,
    alternates: { canonical: localePath(locale, "sobre") },
  };
}

export function postMetadata(
  locale: Locale,
  post: { title: string; excerpt: string; date: string; slug: string }
): Metadata {
  const path = localePath(locale, `blog/${post.slug}`);
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
      url: path,
    },
    twitter: { card: "summary", title: post.title, description: post.excerpt },
  };
}
