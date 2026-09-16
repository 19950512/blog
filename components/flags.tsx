// Ícones de bandeira desenhados em SVG (em vez de emoji) porque o Windows
// não tem os glifos de bandeira regional-indicator e cai para texto "BR"/"US".
// Decorativos: o nome do idioma vem do aria-label no <Link> que os envolve.

const sharedProps = {
  width: 20,
  height: 14,
  viewBox: "0 0 39 26",
  "aria-hidden": true,
  focusable: false,
} as const;

export function FlagBR() {
  return (
    <svg {...sharedProps}>
      <rect width="39" height="26" fill="#009739" />
      <polygon points="19.5,3 36,13 19.5,23 3,13" fill="#fedd00" />
      <circle cx="19.5" cy="13" r="6.5" fill="#002776" />
    </svg>
  );
}

export function FlagUS() {
  return (
    <svg {...sharedProps}>
      <rect width="39" height="26" fill="#ffffff" />
      {[0, 4, 8, 12, 16, 20, 24].map((y) => (
        <rect key={y} y={y} width="39" height="2" fill="#b22234" />
      ))}
      <rect width="15.6" height="14" fill="#3c3b6e" />
    </svg>
  );
}
