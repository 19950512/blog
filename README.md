# Blog Pessoal

Blog pessoal para registrar projetos, estudos e considerações. Construído
com Next.js (App Router) e uma regra rígida: **nenhuma classe CSS**. Toda a
folha de estilos seleciona elementos HTML diretamente (tags, atributos
nativos e seletores estruturais), nunca `class`.

Bilíngue (pt-br/en) e com tema claro/escuro/sistema — ambos sem classes CSS,
ver detalhes abaixo.

## Rodando localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) — já serve a home em
português; a versão em inglês fica em `/en`.

## Escrevendo um post

Cada post é um arquivo `.tsx` em `content/posts/`, escrito à mão em HTML
semântico (JSX). Não há Markdown, MDX ou CMS — o conteúdo é código.

Para começar um novo post:

```bash
npm run new-post -- "Título do post" estudo pt-br
```

- 2º argumento: tipo (`projeto`, `estudo` ou `consideracao`, padrão `consideracao`).
- 3º argumento: idioma (`pt-br` ou `en`, padrão `pt-br`).

O script:

1. cria `content/posts/<slug>.tsx` com o esqueleto do post;
2. registra o import em `content/posts/index.ts` automaticamente.

Depois é só editar o arquivo gerado: preencher `excerpt`, `tags` e o corpo
do post dentro do componente exportado.

**Importante:** cada post existe em um único idioma (o campo `lang` do
`meta`). Não há tradução automática nem versão espelhada — se um post em
pt-br não tem versão em inglês, `/en/blog/<slug>` simplesmente não existe
(404). O seletor de idioma no cabeçalho, nesse caso, leva para o índice do
blog no outro idioma em vez de uma página inexistente.

## URLs

Português é o idioma padrão e **não leva prefixo**; inglês leva `/en`:

```
/                  /en                  home
/blog              /en/blog             índice do blog
/blog/<slug>       /en/blog/<slug>      post
/sobre             /en/sobre            sobre
```

## Estrutura

```
app/(pt-br)/          rotas em português, sem prefixo — layout raiz próprio
app/en/                rotas em inglês, prefixo /en — layout raiz próprio
                        (duas "root layouts" separadas; cada uma só chama
                        os componentes compartilhados abaixo com o locale)
app/global-not-found.tsx  404 para qualquer URL fora das duas árvores acima
app/sitemap.ts, app/robots.ts, app/feed.xml, app/llms.txt
                      globais, cobrindo os dois idiomas
app/globals.css       única folha de estilos do site — zero classes
content/posts/        um arquivo por post + registro central (index.ts)
components/pages/      conteúdo de cada tipo de página (home, blog, post,
                        sobre, 404), parametrizado por locale — reusado
                        pelas duas árvores de rota para não duplicar lógica
components/            navegação, seletor de idioma, seletor de tema
lib/                  i18n (dicionário), tema, urls (localePath), site.ts
scripts/new-post.mjs  script para criar um novo post
```

## Antes de publicar

- Defina `NEXT_PUBLIC_SITE_URL` (veja `.env.example`) com o domínio real —
  é usado em metadata, sitemap, RSS e `llms.txt`.
- Preencha `lib/site.ts` (links de GitHub/LinkedIn).

## Ícones e manifest

`app/favicon.ico`, `app/icon.svg` (com variante clara/escura via
`prefers-color-scheme`) e `app/apple-icon.png` seguem as convenções de
arquivo do Next.js — nenhum precisa ser referenciado manualmente, exceto
em `app/global-not-found.tsx`, que ignora os layouts normais e por isso
declara os ícones no próprio `metadata`. `app/manifest.ts` gera o
`manifest.webmanifest` usando os ícones em `public/web-app-manifest-*.png`
e os dados de `lib/site.ts`.

## JSON-LD

`lib/json-ld.ts` tem uma função por schema (todas prefixadas por locale
via `localePath`) e `components/json-ld.tsx` só serializa e escapa o
`<script type="application/ld+json">`. Cobertura atual:

| Página          | Schemas                                    |
| ---------------- | ------------------------------------------- |
| todas             | `Person` (no layout, uma vez por página)   |
| home              | `WebSite`                                   |
| `/blog`           | `CollectionPage` (com `ItemList` dos posts) + `BreadcrumbList` |
| post              | `BlogPosting` (com `isPartOf`, `mainEntityOfPage`) + `BreadcrumbList` |
| `/sobre`          | `BreadcrumbList`                            |

## Regra de estilo

Nenhum elemento no projeto usa `className` para estilização (a única
exceção técnica é a variável de tema do `next/font`, que **não** é usada
aqui — as fontes são uma pilha monoespaçada do sistema). Toda variação
visual — estado ativo de navegação, links externos, layout de duas colunas,
tema ativo — é resolvida com seletores de atributo nativo (`aria-current`,
`href^="http"`, `input:checked`), pseudo-classes estruturais (`:nth-child`,
`:has()`) e combinadores (`body > header`, `main > aside`).

O seletor de tema (claro/escuro/sistema) segue a mesma regra: em vez de um
`data-theme` ou `class` no `<html>`, o JS do componente escreve as
variáveis CSS (`--bg`, `--fg`, etc.) diretamente como estilo inline do
`<html>` — a folha de estilos continua selecionando só elementos, sem
nenhum hook novo. "Sistema" simplesmente remove esse estilo inline e deixa
o `@media (prefers-color-scheme)` do `globals.css` decidir.

## i18n

Interface (menu, rodapé, textos das páginas "Blog"/"Sobre", 404) é
bilíngue via dicionário em `lib/i18n.ts`. Cada post individual continua em
um único idioma — não é duplicado.

Como português não leva prefixo e inglês leva `/en`, não dá para usar um
único segmento dinâmico `[locale]` (isso exigiria prefixo nos dois). Por
isso são duas árvores de rota reais — `app/(pt-br)/` (grupo de rotas, não
aparece na URL) e `app/en/` — cada uma com seu próprio *root layout*
(`<html>`/`<body>` próprios; ver "Multiple Root Layouts" nos docs do
Next.js). Ambas só chamam os componentes de `components/pages/` passando
o locale certo, então a lógica de cada página vive em um lugar só.
