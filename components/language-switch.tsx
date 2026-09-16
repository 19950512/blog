"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getDictionary, locales, type Locale } from "@/lib/i18n";
import { localeFromPathname, localePath, pathSegmentsWithoutLocale } from "@/lib/urls";
import { FlagBR, FlagUS } from "@/components/flags";

const flags: Record<Locale, ComponentType> = {
  "pt-br": FlagBR,
  en: FlagUS,
};

export function LanguageSwitch() {
  const pathname = usePathname();
  const currentLocale = localeFromPathname(pathname);
  const rest = pathSegmentsWithoutLocale(pathname);
  const isSinglePost = rest[0] === "blog" && rest.length > 1;
  const dict = getDictionary(currentLocale);

  return (
    <nav aria-label={dict.language.legend}>
      <ul>
        {locales.map((locale) => {
          const target = isSinglePost
            ? localePath(locale, "blog")
            : localePath(locale, rest.join("/"));
          const isActive = locale === currentLocale;
          const Flag = flags[locale];
          return (
            <li key={locale}>
              <Link
                href={target}
                lang={locale}
                aria-label={dict.language.names[locale]}
                aria-current={isActive ? "true" : undefined}
              >
                <Flag />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
