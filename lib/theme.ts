export type Theme = "system" | "light" | "dark";

export const themeVariables = {
  dark: {
    "--bg": "#0a0d0b",
    "--bg-raised": "#10140f",
    "--fg": "#d9ded8",
    "--muted": "#7c8a7e",
    "--border": "#263029",
    "--accent": "#4ade80",
    "--accent-contrast": "#04140a",
    "--code-bg": "#0f130f",
  },
  light: {
    "--bg": "#f5f4ef",
    "--bg-raised": "#ebe9e1",
    "--fg": "#161815",
    "--muted": "#5b6259",
    "--border": "#cfccc0",
    "--accent": "#0d7a3f",
    "--accent-contrast": "#f5f4ef",
    "--code-bg": "#eae8df",
  },
} as const;

export const themeStorageKey = "theme";
