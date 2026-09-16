import type { Metadata } from "next";
import Link from "next/link";
import { getDictionary, locales } from "@/lib/i18n";
import { localePath } from "@/lib/urls";
import "./globals.css";

// Página bypassa os layouts normais, então precisa declarar os ícones
// explicitamente — não herda o favicon.ico/icon.svg/apple-icon.png
// que o Next resolve automaticamente para o resto do site.
export const metadata: Metadata = {
  title: "404",
  description: "Page not found / Página não encontrada.",
  icons: {
    icon: "/icon.svg",
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.webmanifest",
};

export default function GlobalNotFound() {
  return (
    <html lang="pt-BR">
      <body>
        <main>
          <section>
            <h1>404</h1>
            <pre>
              <code>bash: rota: comando não encontrado / command not found</code>
            </pre>
            {locales.map((locale) => {
              const dict = getDictionary(locale);
              return (
                <p key={locale}>
                  {dict.notFound.message}{" "}
                  <Link href={localePath(locale)}>{dict.notFound.backHome}</Link>
                </p>
              );
            })}
          </section>
        </main>
      </body>
    </html>
  );
}
