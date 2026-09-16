import type { ReactNode } from "react";
import Link from "next/link";
import { getDictionary, type Locale } from "@/lib/i18n";
import { site } from "@/lib/site";
import { localePath } from "@/lib/urls";
import { themeStorageKey, themeVariables } from "@/lib/theme";
import { personSchema } from "@/lib/json-ld";
import { SiteNav } from "@/components/site-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitch } from "@/components/language-switch";
import { JsonLd } from "@/components/json-ld";

// Roda no <head>, antes do primeiro paint, para aplicar um tema salvo
// sem flash. Fica fora de components/ porque `<head>` só é permitido
// pelo lint dentro de app/**/layout.tsx.
export const themeInitScript = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
  themeStorageKey
)});var v=${JSON.stringify(themeVariables)};if(t==="dark"||t==="light"){var r=document.documentElement;var vars=v[t];for(var k in vars){r.style.setProperty(k,vars[k]);}}}catch(e){}})();`;

export function SiteBody({ locale, children }: { locale: Locale; children: ReactNode }) {
  const dict = getDictionary(locale);

  return (
    <body>
      <JsonLd data={personSchema()} />
      <header>
        <p>
          <Link href={localePath(locale)}>{site.title}:~$</Link>
        </p>
        <SiteNav />
        <LanguageSwitch />
        <ThemeToggle />
      </header>
      {children}
      <footer>
        <p>{site.name}</p>
        <p>
          <small>{dict.footer.tagline}</small>
        </p>
        <address>
          <a href="/feed.xml">rss</a>
          {site.links.github ? (
            <>
              {" · "}
              <a href={site.links.github} target="_blank" rel="noopener noreferrer">
                github
              </a>
            </>
          ) : null}
          {site.links.linkedin ? (
            <>
              {" · "}
              <a href={site.links.linkedin} target="_blank" rel="noopener noreferrer">
                linkedin
              </a>
            </>
          ) : null}
        </address>
      </footer>
    </body>
  );
}
