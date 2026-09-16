import Link from "next/link";
import type { PostMeta } from "./index";

export const meta: PostMeta = {
  slug: "ola-mundo",
  title: "Olá, mundo",
  date: "2026-09-16",
  excerpt:
    "Por que este blog existe: um lugar para registrar projetos, estudos e considerações, sem me preocupar em publicar para os outros.",
  tags: ["meta", "blog"],
  type: "consideracao",
  lang: "pt-br",
};

export default function OlaMundo() {
  return (
    <>
      <p>
        Este espaço existe para um propósito simples: registrar, em público,
        o que estou construindo, o que estou estudando e as considerações que
        vou tendo pelo caminho. Não é um blog pensado para audiência — é
        pensado para mim mesmo, no futuro, revisando o que o eu do presente
        achou que valia a pena anotar.
      </p>

      <p>
        Cada post aqui é escrito à mão, diretamente em HTML semântico dentro
        de um componente <code>.tsx</code>. Não existe um editor, não existe
        um CMS, não existe Markdown intermediário. Isso é proposital: quero
        que escrever um post seja tão deliberado quanto escrever código.
      </p>

      <blockquote>
        <p>
          Feito é melhor que perfeito, mas registrado é melhor que
          esquecido.
        </p>
      </blockquote>

      <p>
        Se você chegou até aqui por acidente: seja bem-vindo. Os posts estão
        organizados em três categorias —{" "}
        <strong>projetos</strong>, <strong>estudos</strong> e{" "}
        <strong>considerações</strong> — e todas podem ser navegadas a
        partir do <Link href="/blog">índice do blog</Link>.
      </p>
    </>
  );
}
