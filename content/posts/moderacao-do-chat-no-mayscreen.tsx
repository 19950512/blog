import Link from "next/link";
import type { PostMeta } from "./index";

export const meta: PostMeta = {
  slug: "moderacao-do-chat-no-mayscreen",
  title: "Moderação de chat em camadas: regras, filtro de palavras, IA opcional e gente de verdade",
  date: "2026-10-14",
  excerpt:
    "Como o chat do MayScreen barra ódio, ameaças, crimes e xingamentos sem barrar “vou matar esse boss”. Um filtro que desfaz disfarces, níveis por canal, IA como reforço opcional e ferramentas para os moderadores.",
  tags: ["moderacao", "chat", "cloudflare", "workers-ai", "durable-objects"],
  type: "projeto",
  lang: "pt-br",
};

const layers = ` mensagem
    │
    ▼
 1. regras de acesso      banido? silenciado? nickname novo demais?
    │                     modo lento? repetiu a mesma coisa?
    ▼
 2. filtro de palavras    sem rede, sem custo, em microssegundos
    │                     bloqueia, mascara (p****) ou deixa passar
    ▼
 3. IA (opcional)         Llama Guard 3 no Workers AI
    │                     pega ameaça e crime ditos sem palavrão
    ▼
 grava no D1 e manda para todos
    ·
    · depois, a qualquer momento:
 4. gente de verdade      apagar, silenciar, banir, registro`;

const fold = String.raw`const LEET = { '0': 'o', '1': 'i', '3': 'e', '4': 'a', '5': 's', '7': 't', '@': 'a', $: 's' };

function loose(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')                  // pôrra → porra
    .replace(/[013457@$]/g, (c) => LEET[c])  // p0rr4 → porra
    .replace(/ch/g, 'x')                     // chupa → xupa
    .replace(/k/g, 'c');                     // karalho → caralho
}

// letras repetidas viram uma só, no texto e na lista de termos
function skeleton(text: string): string {
  return loose(text).replace(/(.)\1+/gu, '$1'); // poooorra → pora
}`;

const sequences = `// cada grupo lista alternativas; "?" marca um grupo que pode faltar
{ category: 'threat', seq: ['vou|vamos|vamo|vo|irei|quero|eu', 'te|ti', KILL] },
{ category: 'hate',   seq: ['seu|sua|seus|suas|teu|tua', 'macaco*|macaca*|gorila*'] },
{ category: 'insult', seq: ['vai|va|vao', 'tomar|toma', 'no|nu|na', 'cu|rabo'] },
{ category: 'crime',  seq: ['vendo|vende|compro|entrego|tenho|passo',
                            '?a|o|uma|um|de|da|do|boa|pura', DRUGS] },`;

const guard = `// o modelo já respondeu "unsafe\\nS1,S10" e já respondeu { safe, categories }
const response = body?.result?.response;
if (typeof response === 'string') {
  const match = /^\\s*(safe|unsafe)\\b([\\s\\S]*)$/i.exec(response);
  ...
}
if (typeof response === 'object' && typeof response.safe === 'boolean') {
  ...
}
return null; // sem veredito: a mensagem passa`;

export default function ModeracaoDoChatNoMayscreen() {
  return (
    <>
      <p>
        O <Link href="/blog/chat-no-mayscreen">chat do MayScreen</Link> é aberto para
        qualquer pessoa que crie um nickname, e criar um nickname leva dois
        segundos. Sem moderação, é questão de tempo até alguém aparecer com
        xingamento, ódio, golpe ou coisa pior. E tem uma ironia que eu não queria
        repetir: o MayScreen existe porque o Discord perdeu o Go Live no Brasil
        por preocupações com a segurança de crianças e adolescentes. Colocar um
        chat sem cuidado nenhum no lugar seria um tanto incoerente.
      </p>
      <p>
        O básico não depende de serviço externo nenhum: roda dentro da própria
        sala da transmissão, em camadas, da mais barata para a mais cara. A IA
        entra como reforço opcional.
      </p>

      <h2>As camadas</h2>
      <pre>
        <code>{layers}</code>
      </pre>
      <p>
        As três primeiras rodam na sala, um Durable Object por transmissão,
        antes de a mensagem ser gravada. Nada chega ao banco nem às outras telas
        sem passar por elas. O dono do canal e os moderadores pulam as três: quem
        modera não precisa ser moderado pelo filtro.
      </p>

      <h3>1. Regras de acesso</h3>
      <ul>
        <li>Banido ou silenciado não escreve nem reage.</li>
        <li>
          Idade mínima do nickname (opcional): só escreve quem criou o nickname
          há pelo menos 10 minutos, 1 hora, 1 dia ou 1 semana. É o que segura
          quem cria outro nome logo depois de ser banido.
        </li>
        <li>
          Modo lento (opcional): uma mensagem a cada 5, 10, 30, 60 ou 120
          segundos.
        </li>
        <li>A mesma mensagem repetida em 30 segundos é recusada.</li>
        <li>
          “kkkkkkkkkkkkkkkkkk” vira “kkkkkk”: qualquer caractere repetido é cortado
          em seis, para uma linha não inundar a coluna.
        </li>
      </ul>

      <h2>O filtro de palavras</h2>
      <p>
        É a camada que faz o trabalho pesado, e o problema não é ter uma lista de
        palavrões. É que ninguém escreve o palavrão do jeito que ele está na
        lista. Escrevem <code>p0rr4</code>, <code>poooorra</code>,{" "}
        <code>p o r r a</code>, <code>PÔRRA</code>. Antes de comparar qualquer
        coisa, o texto passa por duas dobras:
      </p>
      <pre>
        <code>{fold}</code>
      </pre>
      <p>
        O truque está em aplicar a mesma dobra nos termos da lista, quando o
        módulo carrega. “porra” e “pora” viram o mesmo esqueleto, então não
        importa quantas letras a pessoa esticou. A lista é escrita na grafia
        normal, legível, e quem lê o código não precisa pensar em leetspeak.
      </p>
      <table>
        <caption>O que cada disfarce vira antes de comparar</caption>
        <thead>
          <tr>
            <th scope="col">Escrito</th>
            <th scope="col">Comparado como</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>1d10t4</code></td>
            <td><code>idiota</code></td>
          </tr>
          <tr>
            <td><code>idiiiiiota</code></td>
            <td><code>idiota</code></td>
          </tr>
          <tr>
            <td><code>ÍDÍÓTÁ</code></td>
            <td><code>idiota</code></td>
          </tr>
          <tr>
            <td><code>b1ch4</code></td>
            <td><code>bixa</code> (mesmo esqueleto do termo da lista)</td>
          </tr>
          <tr>
            <td><code>f.d.p</code>, <code>p o r r a</code></td>
            <td>letras soltas são coladas de volta</td>
          </tr>
          <tr>
            <td><code>viado123</code></td>
            <td>a palavra é separada dos números</td>
          </tr>
        </tbody>
      </table>

      <h3>Que tipo de regra</h3>
      <p>
        Comparar palavra por palavra não basta. São 159 termos e 32 frases,
        divididos em cinco tipos de regra:
      </p>
      <dl>
        <dt>Palavra inteira</dt>
        <dd>
          <code>cu</code> só bate com “cu”, nunca dentro de “curso” ou
          “cultura”.
        </dd>
        <dt>Começo de palavra</dt>
        <dd>
          <code>idiot</code> pega idiota, idiotas e idiotice. Só serve para
          radicais que não começam nenhuma palavra inocente.
        </dd>
        <dt>Trecho</dt>
        <dd>
          Para pouquíssimos termos longos e inconfundíveis, como “caralh” e
          “filhodaputa” escrito tudo junto.
        </dd>
        <dt>Sequência</dt>
        <dd>
          Para o que só é grave junto: “vou te matar”, “volta pra senzala”, “sei
          onde você mora”.
        </dd>
        <dt>Combinação</dt>
        <dd>
          Duas partes em qualquer lugar da linha: o nome de uma droga e “chama no
          pv” é oferta, enquanto o nome da droga sozinho é conversa.
        </dd>
      </dl>
      <pre>
        <code>{sequences}</code>
      </pre>
      <p>
        Fora as palavras, o filtro procura padrões: CPF (formatado ou com dígito
        verificador válido, o que separa um CPF de um celular de 11 dígitos),
        telefone, e-mail, link e linha TODA EM MAIÚSCULAS.
      </p>

      <h2>O problema de Scunthorpe</h2>
      <p>
        Em 1996, moradores de Scunthorpe, na Inglaterra, não conseguiam criar
        conta num provedor porque o nome da cidade tem um palavrão no meio. É o
        maior risco de um filtro assim: barrar gente que não fez nada. Cada
        regra que eu escrevia, eu testava contra frases normais de chat. Alguns
        casos que apareceram no caminho:
      </p>
      <table>
        <caption>Falsos positivos encontrados enquanto a lista era escrita</caption>
        <thead>
          <tr>
            <th scope="col">Frase inocente</th>
            <th scope="col">O que pegaria</th>
            <th scope="col">Como ficou</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>“o viaduto tava parado”</td>
            <td>radical de um insulto homofóbico</td>
            <td>só a palavra inteira e as variações conhecidas</td>
          </tr>
          <tr>
            <td>“fui pra Boston”, “o porão alagou”</td>
            <td>radicais de “bosta” e “porra”</td>
            <td>palavra inteira</td>
          </tr>
          <tr>
            <td>“tô vendo essa droga de lag”</td>
            <td>“vendo” (vender) + “droga”</td>
            <td>“vendo” só conta colado no nome de uma droga específica</td>
          </tr>
          <tr>
            <td>“vou matar esse boss”</td>
            <td>ameaça</td>
            <td>ameaça precisa de alvo: “te”, “você”</td>
          </tr>
          <tr>
            <td>“conteúdo infantil pros meus filhos”</td>
            <td>regra de abuso infantil</td>
            <td>só com nude, pelada, vazado e afins</td>
          </tr>
          <tr>
            <td>“você é um monstro nesse jogo”</td>
            <td>insulto direto</td>
            <td>é elogio no português dos jogos; saiu da lista</td>
          </tr>
          <tr>
            <td>“fds tô livre”</td>
            <td>abreviação de “foda-se”</td>
            <td>em mensagem é “fim de semana”; saiu da lista</td>
          </tr>
          <tr>
            <td>“computador”</td>
            <td>contém um palavrão de quatro letras</td>
            <td>palavrão curto só como palavra inteira</td>
          </tr>
        </tbody>
      </table>
      <p>
        Essas frases viraram testes. São 67 casos no total, e os que precisam
        passar valem tanto quanto os que precisam ser barrados. Um teste que só
        confere bloqueios aprova um filtro que bloqueia tudo.
      </p>

      <h2>Níveis por canal</h2>
      <p>
        Um grupo de amigos adultos e uma live para crianças não querem a mesma
        coisa. Em qualquer canal, ódio, ameaça, incentivo a autolesão, crime e
        documento pessoal são bloqueados. O resto o dono escolhe:
      </p>
      <table>
        <caption>O que cada nível faz com o resto</caption>
        <thead>
          <tr>
            <th scope="col">Nível</th>
            <th scope="col">O que acontece</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Leve</th>
            <td>Palavrão, xingamento, conteúdo sexual e contato passam.</td>
          </tr>
          <tr>
            <th scope="row">Padrão</th>
            <td>
              Palavrão aparece mascarado (<code>p****</code>). Xingamento, conteúdo
              sexual, telefone e e-mail são bloqueados.
            </td>
          </tr>
          <tr>
            <th scope="row">Rigoroso</th>
            <td>Tudo isso é bloqueado, e também linhas TODAS EM MAIÚSCULAS.</td>
          </tr>
        </tbody>
      </table>
      <p>
        Bloquear links vem ligado e vale em qualquer nível. O dono também
        cadastra até 100 termos próprios (spoiler, nome de alguém, o que for),
        que passam pela mesma dobra e pegam as mesmas variações.
      </p>
      <p>
        Mascarar é melhor do que bloquear quando a mensagem tem conteúdo:
        “que p**** de lag” ainda diz o que a pessoa queria dizer. Mas só dá para
        mascarar uma palavra que está ali, inteira. Um palavrão soletrado
        (“p o r r a”) ou numa frase é bloqueado: não tem uma palavra para cobrir,
        e quem soletra está tentando escapar do filtro.
      </p>

      <h3>Três bloqueios</h3>
      <p>
        Quem tem uma mensagem bloqueada lê o motivo, não um “erro” genérico, e
        quantos bloqueios ainda pode ter: “Mais um bloqueio e você fica 10
        minutos sem poder escrever.” Três bloqueios em 10 minutos silenciam a
        pessoa por 10 minutos, automaticamente. Uma mensagem barrada pode ser
        engano. Três seguidas, não, e o silêncio de 10 minutos esfria a pessoa
        antes de um moderador precisar entrar.
      </p>

      <h2>IA como reforço, não como base</h2>
      <p>
        Um filtro de palavras não entende frase. “Me passa teu endereço que eu
        vou aí resolver” não tem palavrão nenhum, e não existe lista que cubra
        todas as formas de ameaçar alguém. Para tentar pegar o que depende de
        contexto existe a terceira camada: o{" "}
        <a href="https://developers.cloudflare.com/workers-ai/models/llama-guard-3-8b/">
          Llama Guard 3
        </a>
        , um modelo da Meta feito para classificar conteúdo inseguro, rodando no
        Workers AI da Cloudflare. A mensagem que passou pelo filtro vai para ele,
        e ele responde se é segura e em quais categorias de risco cai. Bloqueio
        só as que importam num chat: crimes violentos e não violentos, crimes
        sexuais, exploração infantil, armas, ódio, autolesão e conteúdo sexual
        (este último liberado no nível Leve).
      </p>
      <p>Algumas decisões dessa camada:</p>
      <dl>
        <dt>Ela é reforço, não a base</dt>
        <dd>
          O Llama Guard não tem categoria para assédio ou xingamento comum, e
          isso é boa parte do que estraga um chat. O filtro de palavras continua
          sendo a primeira linha.
        </dd>
        <dt>Falha aberta</dt>
        <dd>
          Se o modelo demorar mais de 2,5 segundos, der erro ou a cota acabar, a
          mensagem passa. O filtro de regras já rodou, e um chat que trava cada
          vez que um serviço externo soluça é pior do que um chat com uma camada
          a menos por alguns minutos.
        </dd>
        <dt>API REST em vez do binding</dt>
        <dd>
          O jeito natural seria o binding de IA do Worker. Mas, no{" "}
          <code>wrangler dev</code>, ele sempre usa a conta remota, e o próprio
          wrangler avisa que isso pode gerar cobrança mesmo em desenvolvimento.
          Pela API REST, com um token opcional, o desenvolvimento local e os
          testes ficam isolados, e os testes simulam a resposta do modelo.
        </dd>
        <dt>Resposta em dois formatos</dt>
        <dd>
          A documentação não fixa o formato da saída. O código aceita texto e
          objeto, e qualquer outra coisa conta como “sem veredito”.
        </dd>
        <dt>Desligada por padrão</dt>
        <dd>
          Ela só liga com um token da Cloudflare configurado, e o dono pode
          desligá-la no próprio canal. O preço é de US$ 0,484 por milhão de
          tokens de entrada, mas o plano gratuito do Workers AI tem um limite
          diário que um chat movimentado gasta rápido. Por isso ela vem como
          opção, não como requisito.
        </dd>
      </dl>
      <pre>
        <code>{guard}</code>
      </pre>

      <h2>Gente de verdade</h2>
      <p>
        Filtro nenhum substitui alguém olhando. O dono do canal escolhe até 20
        moderadores. Pelo menu de cada mensagem, dono e moderadores podem:
      </p>
      <ul>
        <li>apagar a mensagem;</li>
        <li>silenciar a pessoa por 1 minuto, 10 minutos, 1 hora ou 24 horas;</li>
        <li>banir a pessoa do chat do canal.</li>
      </ul>
      <p>
        Silenciar ou banir também apaga tudo o que a pessoa escreveu na
        transmissão em andamento, como na Twitch: o problema some da tela de
        todo mundo de uma vez. O ban vale para todas as transmissões daquele
        canal até alguém liberar. Moderador não age sobre o dono nem sobre outro
        moderador, e só o dono muda as regras e escolhe moderadores.
      </p>
      <p>
        Tudo fica num registro: quem apagou, silenciou, baniu ou liberou quem, e
        o motivo de cada bloqueio automático. O que não fica é o texto da
        mensagem. Uma mensagem apagada que continua guardada no registro não foi
        apagada de verdade, e o registro só precisa explicar decisões. Ele é
        limpo depois de 90 dias por um cron diário, que também tira os
        silenciamentos vencidos.
      </p>

      <h2>Como as regras chegam à sala</h2>
      <p>
        A sala precisa saber as regras do canal a cada mensagem, e ler o banco a
        cada mensagem seria desperdício. Ela carrega tudo uma vez (regras,
        moderadores, banidos e silenciados) e guarda em memória. Quando alguém
        muda alguma coisa pela API, a API chama a sala ao vivo por RPC, a sala
        recarrega e manda para cada pessoa conectada o que mudou para ela: o
        aviso de que foi silenciada, o selo novo de moderador, o modo lento
        ligado. Se a sala hibernar, a memória some e ela recarrega na próxima
        mensagem. Como ela só hiberna quando está parada, não perde nada.
      </p>

      <h2>Nicknames e títulos</h2>
      <p>
        O nickname aparece em todo lugar: no chat, na lista de canais, no aviso
        que vai para o Discord. Por isso nicknames e nomes de transmissão
        ofensivos são recusados na hora de criar, com o filtro no nível mais
        rigoroso.
      </p>

      <h2>O que ainda falta</h2>
      <ul>
        <li>
          O filtro de palavras erra, para os dois lados. Os testes reduzem isso,
          mas não zeram, e língua muda mais rápido do que lista.
        </li>
        <li>
          Quem assiste ainda não tem um botão de denunciar. Quando o dono está
          ocupado transmitindo e não há moderador, esse seria o próximo passo.
        </li>
        <li>
          Não existe um administrador da plataforma com poder sobre todos os
          canais. Hoje, um caso grave fora do alcance do dono vai por e-mail,
          como está nos termos de uso.
        </li>
      </ul>
      <p>
        Nenhuma das camadas resolve sozinha. O filtro é rápido e de graça, mas
        não entende contexto. A IA entende contexto, mas custa e pode falhar. As
        pessoas entendem tudo, mas não estão sempre lá. Juntas, cobrem bem os
        buracos umas das outras.
      </p>
    </>
  );
}
