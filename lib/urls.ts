import { defaultLocale, type Locale } from "./i18n";

/** Constrói o caminho de uma rota para um idioma: pt-br não leva prefixo, en leva /en. */
export function localePath(locale: Locale, path = ""): string {
  const base = locale === defaultLocale ? "" : `/${locale}`;
  if (!path) return base || "/";
  return `${base}/${path}`;
}

/** Detecta o idioma a partir do pathname atual (usado em Client Components). */
export function localeFromPathname(pathname: string): Locale {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : defaultLocale;
}

/** Remove o prefixo de idioma do pathname, devolvendo os segmentos restantes. */
export function pathSegmentsWithoutLocale(pathname: string): string[] {
  const locale = localeFromPathname(pathname);
  const segments = pathname.split("/").filter(Boolean);
  return locale === "en" ? segments.slice(1) : segments;
}
