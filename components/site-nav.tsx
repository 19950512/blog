"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getDictionary } from "@/lib/i18n";
import { localeFromPathname, localePath } from "@/lib/urls";

export function SiteNav() {
  const pathname = usePathname();
  const locale = localeFromPathname(pathname);
  const dict = getDictionary(locale);

  const items = [
    { href: localePath(locale), label: dict.nav.home },
    { href: localePath(locale, "blog"), label: dict.nav.blog },
    { href: localePath(locale, "sobre"), label: dict.nav.about },
  ];

  return (
    <nav aria-label="Principal">
      <ul>
        {items.map((item) => {
          const isActive =
            item.href === localePath(locale)
              ? pathname === item.href
              : pathname.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link href={item.href} aria-current={isActive ? "page" : undefined}>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
