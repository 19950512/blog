import Link from "next/link";
import { getPostsByLocale, getPostsByTypeAndLocale, type PostType } from "@/content/posts";
import { formatDate } from "@/lib/format-date";
import { getDictionary, type Locale } from "@/lib/i18n";
import { localePath } from "@/lib/urls";
import { blogCollectionSchema, breadcrumbSchema } from "@/lib/json-ld";
import { JsonLd } from "@/components/json-ld";

const sections: PostType[] = ["projeto", "estudo", "consideracao"];

export function BlogIndexContent({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const groups = sections
    .map((type) => ({ type, items: getPostsByTypeAndLocale(type, locale) }))
    .filter((group) => group.items.length > 0);
  const breadcrumb = breadcrumbSchema([
    { name: dict.nav.home, path: localePath(locale) },
    { name: dict.nav.blog, path: localePath(locale, "blog") },
  ]);

  return (
    <main>
      <section>
        <h1>{dict.blog.title}</h1>
        <p>{dict.blog.intro}</p>

        {groups.length === 0 ? <p>{dict.blog.empty}</p> : null}

        {groups.map(({ type, items }) => (
          <section key={type}>
            <h2>{dict.postTypeLabelPlural[type]}</h2>
            <ul>
              {items.map(({ meta }) => (
                <li key={meta.slug}>
                  <article>
                    <header>
                      <h3>
                        <Link href={localePath(locale, `blog/${meta.slug}`)}>{meta.title}</Link>
                      </h3>
                      <p>
                        <time dateTime={meta.date}>{formatDate(meta.date, locale)}</time>
                      </p>
                    </header>
                    <p>{meta.excerpt}</p>
                  </article>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </section>

      <JsonLd data={blogCollectionSchema(locale, getPostsByLocale(locale))} />
      <JsonLd data={breadcrumb} />
    </main>
  );
}
