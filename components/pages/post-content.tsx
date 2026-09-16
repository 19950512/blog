import Link from "next/link";
import type { Post } from "@/content/posts";
import { formatDate } from "@/lib/format-date";
import { getDictionary } from "@/lib/i18n";
import { localePath } from "@/lib/urls";
import { blogPostingSchema, breadcrumbSchema } from "@/lib/json-ld";
import { JsonLd } from "@/components/json-ld";

export function PostContent({ post }: { post: Post }) {
  const { meta, Content } = post;
  const locale = meta.lang;
  const dict = getDictionary(locale);

  const breadcrumb = breadcrumbSchema([
    { name: dict.nav.home, path: localePath(locale) },
    { name: dict.nav.blog, path: localePath(locale, "blog") },
    { name: meta.title, path: localePath(locale, `blog/${meta.slug}`) },
  ]);

  return (
    <main>
      <article>
        <header>
          <p>
            <Link href={localePath(locale, "blog")}>{dict.post.back}</Link>
          </p>
          <h1>{meta.title}</h1>
          <p>
            <time dateTime={meta.date}>{formatDate(meta.date, locale)}</time>
            {" · "}
            {dict.postTypeLabel[meta.type]}
          </p>
        </header>

        <Content />

        <footer>
          <ul>
            {meta.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        </footer>
      </article>

      <JsonLd data={blogPostingSchema(post)} />
      <JsonLd data={breadcrumb} />
    </main>
  );
}
