import { getDictionary, type Locale } from "@/lib/i18n";
import { site } from "@/lib/site";
import { localePath } from "@/lib/urls";
import { breadcrumbSchema } from "@/lib/json-ld";
import { JsonLd } from "@/components/json-ld";
import { PhotoGallery } from "@/components/photo-gallery";
import fotoSorrindo from "@/public/eu-mesmo.jpeg";
import fotoPensativo from "@/public/eu-mesmo-sorrisoless.jpeg";
import fotoCorpoTodo from "@/public/eu-mesmo-corpo-todo.jpeg";

export function SobreContent({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const breadcrumb = breadcrumbSchema([
    { name: dict.nav.home, path: localePath(locale) },
    { name: dict.nav.about, path: localePath(locale, "sobre") },
  ]);

  return (
    <main>
      <section>
        <h1>{dict.sobre.title}</h1>
        <p>{dict.sobre.intro}</p>

        <PhotoGallery
          photos={[
            { src: fotoSorrindo, alt: dict.sobre.photoAltSmiling },
            { src: fotoPensativo, alt: dict.sobre.photoAltThinking },
            { src: fotoCorpoTodo, alt: dict.sobre.photoAltFull },
          ]}
          caption={dict.sobre.photoCaption}
          expandPrefix={dict.sobre.photoExpandPrefix}
          closeLabel={dict.sobre.photoClose}
        />

        <h2>{dict.sobre.formatTitle}</h2>
        <p>{dict.sobre.formatBody}</p>

        <h2>{dict.sobre.contactTitle}</h2>
        {site.links.github || site.links.linkedin ? (
          <dl>
            {site.links.github ? (
              <>
                <dt>GitHub</dt>
                <dd>
                  <a href={site.links.github}>{site.links.github}</a>
                </dd>
              </>
            ) : null}
            {site.links.linkedin ? (
              <>
                <dt>LinkedIn</dt>
                <dd>
                  <a href={site.links.linkedin}>{site.links.linkedin}</a>
                </dd>
              </>
            ) : null}
          </dl>
        ) : (
          <p>
            <small>{dict.sobre.contactEmpty}</small>
          </p>
        )}
      </section>

      <JsonLd data={breadcrumb} />
    </main>
  );
}
