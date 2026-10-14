import type { ComponentType } from "react";
import type { Locale } from "@/lib/i18n";

export type PostType = "projeto" | "estudo" | "consideracao";

export type PostMeta = {
  slug: string;
  title: string;
  date: string; // formato ISO: yyyy-mm-dd
  excerpt: string;
  tags: string[];
  type: PostType;
  lang: Locale;
};

export type Post = {
  meta: PostMeta;
  Content: ComponentType;
};

// scripts:import-marker
import * as pMayscreen from "./mayscreen";
import * as pDeployDeProjetosNaCloudflareOuVercel from "./deploy-de-projetos-na-cloudflare-ou-vercel";
import * as olaMundo from "./ola-mundo";
import * as esteBlog from "./este-blog";
import * as guiaDeTagsSemanticas from "./guia-de-tags-semanticas";

const registry: Post[] = [
  // scripts:entry-marker
  { meta: pMayscreen.meta, Content: pMayscreen.default },
  { meta: pDeployDeProjetosNaCloudflareOuVercel.meta, Content: pDeployDeProjetosNaCloudflareOuVercel.default },
  { meta: olaMundo.meta, Content: olaMundo.default },
  { meta: esteBlog.meta, Content: esteBlog.default },
  { meta: guiaDeTagsSemanticas.meta, Content: guiaDeTagsSemanticas.default },
];

export const posts: Post[] = [...registry].sort((a, b) =>
  a.meta.date < b.meta.date ? 1 : -1
);

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((post) => post.meta.slug === slug);
}

export function getPostsByLocale(locale: Locale): Post[] {
  return posts.filter((post) => post.meta.lang === locale);
}

export function getPostsByTypeAndLocale(type: PostType, locale: Locale): Post[] {
  return posts.filter((post) => post.meta.type === type && post.meta.lang === locale);
}
