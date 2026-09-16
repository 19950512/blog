import type { PostMeta } from "./index";

export const meta: PostMeta = {
  slug: "guia-de-tags-semanticas",
  title: "Guia de referência: tags semânticas usadas aqui",
  date: "2026-09-14",
  excerpt:
    "Um post-catálogo com as principais tags HTML que este blog estiliza — útil como estudo de semântica e como teste de estresse do CSS.",
  tags: ["html", "css", "estudo"],
  type: "estudo",
  lang: "pt-br",
};

export default function GuiaDeTagsSemanticas() {
  return (
    <>
      <p>
        Estudando a especificação de HTML da <abbr title="World Wide Web Consortium">W3C</abbr>{" "}
        de novo, decidi transformar as anotações num post que também serve
        de catálogo visual: cada elemento abaixo é estilizado apenas pela
        própria tag, sem nenhuma classe.
      </p>

      <h2>Citações e ênfase</h2>
      <p>
        Uma <dfn>citação em bloco</dfn> usa <code>blockquote</code> com{" "}
        <code>cite</code>:
      </p>
      <blockquote cite="https://developer.mozilla.org/docs/Web/HTML/Element/blockquote">
        <p>Programs must be written for people to read, and only incidentally for machines to execute.</p>
        <cite>Harold Abelson</cite>
      </blockquote>
      <p>
        Também dá pra marcar um trecho como <mark>importante</mark>, riscar
        algo <del>que deixou de ser verdade</del> e{" "}
        <ins>inserir a correção</ins>, ou simplesmente{" "}
        <s>desistir da frase</s>.
      </p>

      <h2>Código e teclado</h2>
      <p>
        Para rodar o gerador de posts, digite <kbd>node scripts/new-post.mjs</kbd>{" "}
        e o terminal deve responder com algo como <samp>post criado em content/posts/…</samp>,
        onde <var>slug</var> é derivado do título.
      </p>
      <pre>
        <code>{`function slugify(title: string) {
  return title
    .normalize("NFD")
    .replace(/[\\u0300-\\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}`}</code>
      </pre>

      <h2>Listas de definição e tabelas</h2>
      <table>
        <caption>Categorias de post e seu propósito</caption>
        <thead>
          <tr>
            <th scope="col">Tipo</th>
            <th scope="col">Quando uso</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Projeto</th>
            <td>Algo que construí, do início ao fim ou em progresso.</td>
          </tr>
          <tr>
            <th scope="row">Estudo</th>
            <td>Anotações de algo que estou aprendendo.</td>
          </tr>
          <tr>
            <th scope="row">Consideração</th>
            <td>Opinião ou reflexão sem compromisso de estar certa.</td>
          </tr>
        </tbody>
      </table>

      <h2>Detalhes recolhíveis</h2>
      <details>
        <summary>Por que não usar Markdown/MDX?</summary>
        <p>
          Markdown mapeia bem para um subconjunto pequeno de tags (
          <code>p</code>, <code>h1</code>–<code>h6</code>, <code>ul</code>,{" "}
          <code>blockquote</code>, <code>code</code>). Escrever o post
          diretamente em JSX permite usar <code>dfn</code>, <code>abbr</code>,{" "}
          <code>details</code>, <code>table</code> e outras tags sem precisar
          de componentes MDX customizados para cada uma.
        </p>
      </details>

      <h2>Notas numéricas e unidades</h2>
      <p>
        A velocidade da luz é de aproximadamente 3×10<sup>8</sup> m/s, e a
        fórmula da água é H<sub>2</sub>O — nada de especial, só{" "}
        <code>sup</code> e <code>sub</code> fazendo o trabalho de sempre.
      </p>

      <hr />

      <p>
        <small>
          Este post é atualizado sempre que um novo elemento ganha estilo
          próprio na folha de estilos global.
        </small>
      </p>
    </>
  );
}
