import type { Metadata } from "next";
import { BlogIndexContent } from "@/components/pages/blog-index-content";
import { blogIndexMetadata } from "@/lib/metadata";

export const metadata: Metadata = blogIndexMetadata("pt-br");

export default function Page() {
  return <BlogIndexContent locale="pt-br" />;
}
