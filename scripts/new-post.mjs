#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const postsDir = join(__dirname, "..", "content", "posts");
const indexFile = join(postsDir, "index.ts");

const [, , rawTitle, rawType, rawLang] = process.argv;
const validTypes = ["projeto", "estudo", "consideracao"];
const validLangs = ["pt-br", "en"];

if (!rawTitle) {
  console.error(
    "uso: node scripts/new-post.mjs \"Título do post\" [projeto|estudo|consideracao] [pt-br|en]"
  );
  process.exit(1);
}

const type = validTypes.includes(rawType) ? rawType : "consideracao";
const lang = validLangs.includes(rawLang) ? rawLang : "pt-br";

function slugify(title) {
  return title
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const slug = slugify(rawTitle);
const postFile = join(postsDir, `${slug}.tsx`);

if (existsSync(postFile)) {
  console.error(`já existe um post em content/posts/${slug}.tsx`);
  process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);

const postTemplate = `import type { PostMeta } from "./index";

export const meta: PostMeta = {
  slug: "${slug}",
  title: "${rawTitle.replace(/"/g, '\\"')}",
  date: "${today}",
  excerpt: "",
  tags: [],
  type: "${type}",
  lang: "${lang}",
};

export default function ${toComponentName(slug)}() {
  return (
    <>
      <p></p>
    </>
  );
}
`;

function toComponentName(value) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

writeFileSync(postFile, postTemplate);

const importName = "p" + toComponentName(slug);
const importLine = `import * as ${importName} from "./${slug}";`;
const entryLine = `  { meta: ${importName}.meta, Content: ${importName}.default },`;

const indexSource = readFileSync(indexFile, "utf8");

if (!indexSource.includes("// scripts:import-marker") || !indexSource.includes("// scripts:entry-marker")) {
  console.warn(
    `arquivo criado em content/posts/${slug}.tsx, mas os marcadores não foram encontrados em content/posts/index.ts — adicione manualmente:\n\n${importLine}\n${entryLine}`
  );
  process.exit(0);
}

const updatedSource = indexSource
  .replace("// scripts:import-marker", `// scripts:import-marker\n${importLine}`)
  .replace("// scripts:entry-marker", `// scripts:entry-marker\n${entryLine}`);

writeFileSync(indexFile, updatedSource);

console.log(`post criado em content/posts/${slug}.tsx`);
console.log(`registrado em content/posts/index.ts`);
console.log(`edite o excerpt, as tags e o conteúdo antes de publicar.`);
