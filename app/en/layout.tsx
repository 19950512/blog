import type { ReactNode } from "react";
import type { Metadata } from "next";
import { SiteBody, themeInitScript } from "@/components/site-chrome";
import { getDictionary } from "@/lib/i18n";
import { baseMetadata } from "@/lib/metadata";
import "../globals.css";

export const metadata: Metadata = baseMetadata("en");

export default function EnLayout({ children }: { children: ReactNode }) {
  const dict = getDictionary("en");
  return (
    <html lang={dict.htmlLang} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <SiteBody locale="en">{children}</SiteBody>
    </html>
  );
}
