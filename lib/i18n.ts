export const locales = ["pt-br", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "pt-br";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

const dictionaries = {
  "pt-br": {
    htmlLang: "pt-BR",
    dateLocale: "pt-BR",
    nav: { home: "início", blog: "blog", about: "sobre" },
    theme: {
      legend: "tema",
      system: "sistema",
      light: "claro",
      dark: "escuro",
    },
    language: {
      legend: "idioma",
      names: { "pt-br": "Português", en: "Inglês" },
    },
    home: {
      title: "Matheus Maydana",
      intro:
        "Registro de projetos que construo, coisas que estudo e considerações que vou tendo pelo caminho. Escrito à mão, em HTML semântico, sem nenhuma classe CSS.",
      latestPosts: "Últimos posts",
      seeAll: "ver todos os posts →",
      aboutBox: "Sobre este espaço",
      stackLabel: "Stack",
      stackValue: "Next.js, TypeScript, CSS puro",
      ruleLabel: "Regra",
      ruleValue: "Zero classes CSS — apenas seletores de elemento",
      contentLabel: "Conteúdo",
      contentValue: "Escrito manualmente, um arquivo por post",
      learnMore: "saiba mais →",
    },
    blog: {
      title: "Blog",
      intro:
        "Todos os posts, agrupados por tipo. Mais recentes primeiro dentro de cada grupo.",
      empty: "Ainda não há posts neste idioma.",
    },
    postTypeLabel: {
      projeto: "Projeto",
      estudo: "Estudo",
      consideracao: "Consideração",
    },
    postTypeLabelPlural: {
      projeto: "Projetos",
      estudo: "Estudos",
      consideracao: "Considerações",
    },
    post: { back: "← voltar ao blog" },
    sobre: {
      title: "Sobre",
      intro:
        "Sou Matheus Maydana, desenvolvedor de software. Este blog é onde registro projetos, estudos e considerações — sem a pressão de escrever para uma audiência.",
      formatTitle: "Por que este formato",
      formatBody:
        "Prefiro escrever pouco e com intenção a manter um fluxo constante de posts. Cada entrada aqui é escrita manualmente, direto em HTML semântico, sem editor de texto rico e sem CSS baseado em classes — detalhes técnicos que valorizo tanto quanto o conteúdo em si.",
      contactTitle: "Contato",
      contactEmpty: "Links de contato ainda não configurados.",
      photoCaption: "Eu, numa tarde de sol na varanda do escritório.",
      photoAltSmiling:
        "Matheus Maydana sorrindo, com a mão apoiada no queixo, em uma varanda com vista da cidade ao fundo.",
      photoAltThinking:
        "Matheus Maydana com expressão pensativa, na mesma varanda.",
      photoAltFull:
        "Matheus Maydana de corpo inteiro, sorrindo, na mesma varanda.",
      photoExpandPrefix: "Ampliar foto: ",
      photoClose: "Fechar",
    },
    notFound: {
      title: "404",
      command: "bash: rota: comando não encontrado",
      message: "A página que você procura não existe (ou nunca existiu).",
      backHome: "voltar ao início",
    },
    footer: {
      tagline: "Este site é construído com Next.js e não usa nenhuma classe CSS.",
    },
  },
  en: {
    htmlLang: "en",
    dateLocale: "en-US",
    nav: { home: "home", blog: "blog", about: "about" },
    theme: {
      legend: "theme",
      system: "system",
      light: "light",
      dark: "dark",
    },
    language: {
      legend: "language",
      names: { "pt-br": "Portuguese", en: "English" },
    },
    home: {
      title: "Matheus Maydana",
      intro:
        "A record of projects I build, things I study and considerations I pick up along the way. Written by hand, in semantic HTML, with zero CSS classes.",
      latestPosts: "Latest posts",
      seeAll: "see all posts →",
      aboutBox: "About this space",
      stackLabel: "Stack",
      stackValue: "Next.js, TypeScript, plain CSS",
      ruleLabel: "Rule",
      ruleValue: "Zero CSS classes — element selectors only",
      contentLabel: "Content",
      contentValue: "Written by hand, one file per post",
      learnMore: "learn more →",
    },
    blog: {
      title: "Blog",
      intro:
        "All posts, grouped by type. Most recent first within each group.",
      empty: "No posts in this language yet.",
    },
    postTypeLabel: {
      projeto: "Project",
      estudo: "Study",
      consideracao: "Thought",
    },
    postTypeLabelPlural: {
      projeto: "Projects",
      estudo: "Studies",
      consideracao: "Thoughts",
    },
    post: { back: "← back to blog" },
    sobre: {
      title: "About",
      intro:
        "I'm Matheus Maydana, a software developer. This blog is where I record projects, studies and considerations — without the pressure of writing for an audience.",
      formatTitle: "Why this format",
      formatBody:
        "I'd rather write little and with intent than keep a constant stream of posts. Every entry here is written by hand, directly in semantic HTML, with no rich text editor and no class-based CSS — technical details I care about as much as the content itself.",
      contactTitle: "Contact",
      contactEmpty: "Contact links not configured yet.",
      photoCaption: "Me, on a sunny afternoon on the office balcony.",
      photoAltSmiling:
        "Matheus Maydana smiling, hand resting on his chin, on a balcony with a city view behind him.",
      photoAltThinking: "Matheus Maydana with a thoughtful expression, same balcony.",
      photoAltFull: "Matheus Maydana full-length, smiling, same balcony.",
      photoExpandPrefix: "Enlarge photo: ",
      photoClose: "Close",
    },
    notFound: {
      title: "404",
      command: "bash: route: command not found",
      message: "The page you're looking for doesn't exist (or never did).",
      backHome: "back to home",
    },
    footer: {
      tagline: "This site is built with Next.js and uses zero CSS classes.",
    },
  },
} as const;

export type Dictionary = (typeof dictionaries)[Locale];

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
