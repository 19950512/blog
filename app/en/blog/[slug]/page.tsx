import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostBySlug, posts } from "@/content/posts";
import { postMetadata } from "@/lib/metadata";
import { PostContent } from "@/components/pages/post-content";

export const dynamicParams = false;

export function generateStaticParams() {
  return posts
    .filter((post) => post.meta.lang === "en")
    .map((post) => ({ slug: post.meta.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post || post.meta.lang !== "en") return {};
  return postMetadata("en", post.meta);
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post || post.meta.lang !== "en") notFound();

  return <PostContent post={post} />;
}
