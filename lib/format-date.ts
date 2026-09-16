import type { Locale } from "./i18n";
import { getDictionary } from "./i18n";

export function formatDate(iso: string, locale: Locale): string {
  const [year, month, day] = iso.split("-").map(Number);
  const dict = getDictionary(locale);
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString(
    dict.dateLocale,
    { day: "2-digit", month: "long", year: "numeric", timeZone: "UTC" }
  );
}
