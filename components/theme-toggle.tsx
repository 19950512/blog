"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getDictionary } from "@/lib/i18n";
import { localeFromPathname } from "@/lib/urls";
import { themeStorageKey, themeVariables, type Theme } from "@/lib/theme";

const order: Theme[] = ["system", "light", "dark"];

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "system") {
    for (const key of Object.keys(themeVariables.dark)) {
      root.style.removeProperty(key);
    }
    return;
  }
  for (const [key, value] of Object.entries(themeVariables[theme])) {
    root.style.setProperty(key, value);
  }
}

export function ThemeToggle() {
  const pathname = usePathname();
  const locale = localeFromPathname(pathname);
  const dict = getDictionary(locale);
  const [theme, setTheme] = useState<Theme>("system");

  useEffect(() => {
    // Lido só depois de montar para casar com o valor do SSR (sempre
    // "system") e evitar mismatch de hidratação; localStorage não existe
    // no servidor.
    try {
      const stored = localStorage.getItem(themeStorageKey);
      if (stored === "dark" || stored === "light" || stored === "system") {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- sincroniza com localStorage (sistema externo), não é derivação de estado local
        setTheme(stored);
      }
    } catch {
      // localStorage indisponível (modo privado, etc.) — mantém "system"
    }
  }, []);

  function cycle() {
    const next = order[(order.indexOf(theme) + 1) % order.length];
    setTheme(next);
    applyTheme(next);
    try {
      if (next === "system") localStorage.removeItem(themeStorageKey);
      else localStorage.setItem(themeStorageKey, next);
    } catch {
      // ignora falha de persistência
    }
  }

  return (
    <p>
      <button type="button" onClick={cycle} title={dict.theme.legend}>
        {dict.theme.legend}: {dict.theme[theme]}
      </button>
    </p>
  );
}
