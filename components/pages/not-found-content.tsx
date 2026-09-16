import Link from "next/link";
import { getDictionary, type Locale } from "@/lib/i18n";
import { localePath } from "@/lib/urls";

export function NotFoundContent({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);

  return (
    <main>
      <section>
        <h1>{dict.notFound.title}</h1>
        <pre>
          <code>{dict.notFound.command}</code>
        </pre>
        <p>
          {dict.notFound.message}{" "}
          <Link href={localePath(locale)}>{dict.notFound.backHome}</Link>
        </p>
      </section>
    </main>
  );
}
