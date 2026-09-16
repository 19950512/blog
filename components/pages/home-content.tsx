import Link from "next/link";
import { getPostsByLocale } from "@/content/posts";
import { formatDate } from "@/lib/format-date";
import { getDictionary, type Locale } from "@/lib/i18n";
import { localePath } from "@/lib/urls";
import { websiteSchema } from "@/lib/json-ld";
import { JsonLd } from "@/components/json-ld";

export function HomeContent({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const latest = getPostsByLocale(locale).slice(0, 5);

  return (
    <main>
      <section>
        <h1>{dict.home.title}</h1>
        <p>{dict.home.intro}</p>

        <h2>{dict.home.latestPosts}</h2>
        <ul>
          {latest.map(({ meta }) => (
            <li key={meta.slug}>
              <article>
                <header>
                  <h3>
                    <Link href={localePath(locale, `blog/${meta.slug}`)}>{meta.title}</Link>
                  </h3>
                  <p>
                    <time dateTime={meta.date}>{formatDate(meta.date, locale)}</time>
                    {" · "}
                    {dict.postTypeLabel[meta.type]}
                  </p>
                </header>
                <p>{meta.excerpt}</p>
              </article>
            </li>
          ))}
        </ul>
        <p>
          <Link href={localePath(locale, "blog")}>{dict.home.seeAll}</Link>
        </p>
      </section>

      <aside>
        <h2>{dict.home.aboutBox}</h2>
        <dl>
          <dt>{dict.home.stackLabel}</dt>
          <dd>{dict.home.stackValue}</dd>
          <dt>{dict.home.ruleLabel}</dt>
          <dd>{dict.home.ruleValue}</dd>
          <dt>{dict.home.contentLabel}</dt>
          <dd>{dict.home.contentValue}</dd>
        </dl>
        <p>
          <Link href={localePath(locale, "sobre")}>{dict.home.learnMore}</Link>
        </p>
      </aside>

      <JsonLd data={websiteSchema(locale)} />
    </main>
  );
}
