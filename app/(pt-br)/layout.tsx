import type { ReactNode } from "react";
import type { Metadata } from "next";
import { SiteBody, themeInitScript } from "@/components/site-chrome";
import { getDictionary } from "@/lib/i18n";
import { baseMetadata } from "@/lib/metadata";
import "../globals.css";

export const metadata: Metadata = baseMetadata("pt-br");

export default function PtBrLayout({ children }: { children: ReactNode }) {
  const dict = getDictionary("pt-br");
  return (
    <html lang={dict.htmlLang} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <SiteBody locale="pt-br">{children}</SiteBody>
    </html>
  );
}
