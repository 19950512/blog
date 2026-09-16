import type { PostMeta } from "./index";

export const meta: PostMeta = {
  slug: "este-blog",
  title: "Este blog: construído sem nenhuma classe CSS",
  date: "2026-09-16",
  excerpt:
    "As decisões técnicas por trás deste site: Next.js, App Router, e uma regra rígida — zero classes CSS, apenas seletores de elemento HTML.",
  tags: ["nextjs", "css", "seo"],
  type: "projeto",
  lang: "pt-br",
};

export default function EsteBlog() {
  return (
    <>
      <p>
        Este blog é, ele mesmo, o primeiro projeto documentado aqui. A stack
        é <a href="https://nextjs.org">Next.js</a> com App Router, TypeScript
        e nenhuma biblioteca de estilos — nem Tailwind, nem CSS Modules, nem
        styled-components.
      </p>

      <h2>A regra</h2>
      <p>
        A regra que guiou todo o layout foi simples de descrever e difícil
        de seguir até o fim: <mark>nenhum atributo class em lugar nenhum</mark>.
        Toda a folha de estilos seleciona elementos HTML diretamente —{" "}
        <code>header</code>, <code>nav</code>, <code>article</code>,{" "}
        <code>dl</code> — combinados com seletores estruturais (
        <code>:nth-child</code>, <code>:is()</code>) e atributos nativos
        (<code>href</code>, <code>aria-current</code>,{" "}
        <code>open</code>) que já fariam parte do HTML de qualquer forma.
      </p>

      <h2>Por que</h2>
      <p>
        Duas razões. A primeira é estética: em 2026 praticamente todo site
        pessoal parece o mesmo template de componentes. Um layout que nasce
        das restrições da semântica HTML pura tende a parecer diferente,
        porque força decisões de design incomuns. A segunda é técnica:
        escrever CSS sem classes obriga a pensar em documento, não em
        componente — o que combina bem com um blog cujo conteúdo é HTML
        escrito à mão.
      </p>

      <h2>O que isso significa na prática</h2>
      <dl>
        <dt>Tipografia</dt>
        <dd>
          Pilha de fontes monoespaçadas do sistema, sem carregar fontes
          externas — mantém o visual de terminal e evita depender de{" "}
          <code>next/font</code>, que injeta uma classe no <code>html</code>.
        </dd>
        <dt>Layout responsivo</dt>
        <dd>
          Feito inteiramente com <code>@media</code>, <code>clamp()</code> e
          CSS Grid, direcionando <code>body &gt; header</code>,{" "}
          <code>body &gt; main</code> e <code>body &gt; footer</code>.
        </dd>
        <dt>Conteúdo</dt>
        <dd>
          Cada post é um arquivo <code>.tsx</code> em{" "}
          <code>content/posts/</code>, com metadados exportados separadamente
          do corpo do texto.
        </dd>
      </dl>

      <p>
        O resultado não segue nenhum design system de 2026 — e essa é
        exatamente a ideia.
      </p>
    </>
  );
}
