export const site = {
  name: "Matheus Maydana",
  title: "blog@matheusmaydana",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com",
  descriptions: {
    "pt-br":
      "Blog pessoal de Matheus Maydana: projetos, estudos e considerações sobre desenvolvimento de software.",
    en: "Matheus Maydana's personal blog: projects, studies and considerations about software development.",
  },
  author: "Matheus Maydana",
  links: {
    github: "https://github.com/19950512",
    linkedin: "https://www.linkedin.com/in/matheus-maydana-47003b229",
  },
} as const;
