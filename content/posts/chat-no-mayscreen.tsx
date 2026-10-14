import Link from "next/link";
import type { PostMeta } from "./index";

export const meta: PostMeta = {
  slug: "chat-no-mayscreen",
  title: "Um chat no MayScreen: como foi e por que foi fácil",
  date: "2026-10-14",
  excerpt:
    "Coloquei chat, reações no estilo do Google Meet e curtidas no MayScreen. O servidor ganhou menos de 500 linhas, porque a sala que já fazia a sinalização do vídeo virou o chat. O trabalho de verdade estava na interface.",
  tags: ["chat", "websocket", "durable-objects", "cloudflare", "react"],
  type: "projeto",
  lang: "pt-br",
};

const flow = ` espectador                    sala da transmissão                 dono (estúdio)
                               (Durable Object)
 join ──────────────────────►  guarda o socket          ◄────────  join + chave
 offer/answer/ICE ◄─────────►  repassa                  ◄────────► offer/answer/ICE
 auth (chave) ──────────────►  identifica no socket
 chat ──────────────────────►  grava no D1, manda a todos ───────► chat
 react ─────────────────────►  soma em memória, manda a todos ───► reaction`;

const protocol = `// o que o navegador pode mandar pela sala (shared/protocol.ts)
| { type: 'join'; role: 'viewer'; nickname: string; slug: string }
| { type: 'signal'; to: string; data: SignalPayload }
// novos:
| { type: 'auth'; token: string }
| { type: 'chat'; text: string; nonce: string }
| { type: 'react'; emoji: Reaction }`;

const insert = `INSERT INTO chat_messages (broadcast_id, user_id, body, created_at)
SELECT ?, ?, ?, ?
WHERE EXISTS (SELECT 1 FROM broadcasts WHERE id = ? AND status = 'live')
RETURNING id, created_at`;

const reactions = `// cada toque soma na memória da sala e já aparece para todos
this.pendingReactions.set(emoji, (this.pendingReactions.get(emoji) ?? 0) + 1);
this.flushTimer ??= setTimeout(() => void this.flushReactions(), 5_000);
this.broadcast({ type: 'reaction', emoji, nickname: user.nickname });`;

export default function ChatNoMayscreen() {
  return (
    <>
      <p>
        O <Link href="/blog/mayscreen">MayScreen</Link> nasceu para transmitir a tela
        com áudio por um link, depois que o Discord perdeu o Go Live no Brasil.
        Faltava o que toda live tem: um lugar para quem assiste falar. Agora a
        página da transmissão tem um chat ao lado do vídeo, como no YouTube e na
        Twitch, reações que sobem pela tela de todo mundo, como no Google Meet,
        e um botão de curtir. Tudo fica salvo: quem abre uma transmissão
        encerrada lê o chat inteiro, com o tempo de cada mensagem contado desde
        o início.
      </p>
      <p>
        Esperava que fosse um projeto grande. Não foi, e o motivo está numa
        decisão tomada lá atrás, antes de existir chat.
      </p>

      <h2>O chat já estava quase pronto</h2>
      <p>
        Para o vídeo ir direto de um navegador para o outro, eles precisam
        trocar ofertas, respostas e candidatos de rede antes. No MayScreen, isso
        passa por uma sala: um Durable Object da Cloudflare por transmissão, com
        o WebSocket de quem transmite e de cada pessoa assistindo. Ou seja, já
        existia um lugar onde todo mundo daquela transmissão estava conectado ao
        mesmo tempo, com um canal aberto para mandar mensagens.
      </p>
      <p>
        Um chat é exatamente isso. Bastou ensinar a sala três mensagens novas:
      </p>
      <pre>
        <code>{protocol}</code>
      </pre>
      <pre>
        <code>{flow}</code>
      </pre>
      <p>
        Nada de servidor de chat separado, fila, Redis ou serviço de terceiros.
        O lado do servidor inteiro ganhou 477 linhas:
      </p>
      <table>
        <caption>O que o chat acrescentou no servidor</caption>
        <thead>
          <tr>
            <th scope="col">Parte</th>
            <th scope="col">Linhas</th>
            <th scope="col">O que faz</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Sala (Durable Object)</th>
            <td>149</td>
            <td>identificação, mensagens, reações, ritmo por pessoa</td>
          </tr>
          <tr>
            <th scope="row">Banco (D1)</th>
            <td>135</td>
            <td>gravar e paginar mensagens, curtidas, totais de reações</td>
          </tr>
          <tr>
            <th scope="row">API HTTP</th>
            <td>85</td>
            <td>histórico, apagar mensagem, curtir</td>
          </tr>
          <tr>
            <th scope="row">Migração SQL</th>
            <td>28</td>
            <td>três tabelas e uma coluna</td>
          </tr>
          <tr>
            <th scope="row">Tipos e validação</th>
            <td>80</td>
            <td>protocolo e limpeza do texto, usados nos dois lados</td>
          </tr>
        </tbody>
      </table>

      <h2>Entrar no chat sem derrubar o vídeo</h2>
      <p>
        Assistir continua sem cadastro. Para escrever, reagir ou curtir, é
        preciso um nickname, e dá para criar um no próprio chat, sem sair da
        transmissão. O detalhe é o que acontece no instante seguinte.
      </p>
      <p>
        O jeito óbvio seria reconectar o WebSocket com a identidade nova. Só que
        é esse socket que sustenta o vídeo: reconectar faz o transmissor
        renegociar a conexão WebRTC, e a tela fica preta por alguns segundos. Em
        vez disso, o navegador manda <code>auth</code> com a chave pelo socket
        que já está aberto. A sala confere a chave no D1 e anota quem é aquela
        conexão no próprio attachment do socket, o mesmo lugar onde já guardava
        o papel de cada um. O vídeo nem percebe.
      </p>

      <h2>Gravar antes de mostrar</h2>
      <p>
        Cada mensagem vai para o D1 antes de chegar a qualquer pessoa. Não é só
        cuidado: com a hibernação, a sala não guarda nada em memória quando fica
        quieta. O histórico precisa estar no banco. O próprio{" "}
        <code>INSERT</code> confere se a transmissão ainda está no ar, porque a
        sala pode viver alguns instantes depois do fim:
      </p>
      <pre>
        <code>{insert}</code>
      </pre>
      <p>
        O <code>id</code> que volta dessa inserção é a ordem oficial do chat.
        Quem chega no meio da transmissão busca as 100 mensagens mais recentes
        pela API e, ao mesmo tempo, recebe as novas pelo socket. Como as duas
        fontes podem trazer a mesma mensagem, o navegador junta tudo pelo{" "}
        <code>id</code>, sem duplicar e sem depender de qual chegou primeiro.
      </p>
      <p>
        Outro detalhe: cada mensagem enviada leva um <code>nonce</code>. A sala
        devolve a linha gravada com esse <code>nonce</code> só para quem mandou.
        O campo de texto só é limpo quando essa confirmação chega. Se o servidor
        recusar, a mensagem de erro volta com o mesmo <code>nonce</code> e o
        texto continua lá para corrigir.
      </p>

      <h2>Reações como no Google Meet</h2>
      <p>
        São oito emojis. Um toque e o emoji sobe pela tela de todo mundo, com o
        nickname de quem reagiu embaixo, inclusive em tela cheia. A altura da
        subida usa unidades de container query (<code>cqh</code>), então é a
        mesma proporção da imagem em qualquer tamanho de tela.
      </p>
      <p>
        Reação vem em rajada, e gravar cada toque no D1 gastaria a cota à toa.
        A sala soma os toques em memória e grava um total por emoji a cada 5
        segundos:
      </p>
      <pre>
        <code>{reactions}</code>
      </pre>
      <p>
        O <code>setTimeout</code> parece um risco num objeto que hiberna, mas é o
        contrário: enquanto houver um timer pendente, o Durable Object{" "}
        <a href="https://developers.cloudflare.com/durable-objects/concepts/durable-object-lifecycle/">
          não hiberna
        </a>
        , então a soma é gravada antes de a memória sumir. Só um deploy ou uma
        falha bem nesses 5 segundos perderia alguns toques.
      </p>
      <p>
        A conta fecha no plano gratuito, que dá 100 mil escritas no D1 por dia:
        cada mensagem custa uma escrita, e as reações de uma transmissão custam
        no máximo uma escrita por emoji a cada 5 segundos, por mais gente que
        esteja tocando.
      </p>

      <h2>Curtidas pelo HTTP</h2>
      <p>
        Curtir é diferente: faz sentido também depois que a transmissão acabou,
        quando a sala já fechou. Por isso a curtida vai pela API HTTP. O total é
        recontado na mesma transação que grava a curtida, então clicar duas
        vezes ou curtir em duas abas não infla o número. Se a transmissão está
        no ar, a API só avisa a sala, que repassa o total novo para quem está
        assistindo.
      </p>

      <h2>Onde foi o trabalho de verdade</h2>
      <p>
        Se o servidor ganhou 477 linhas, a interface ganhou 1.920 (733 só de
        CSS). É ali que um chat parece profissional ou improvisado:
      </p>
      <ul>
        <li>
          A lista só acompanha a mensagem mais nova se você já está no fim. Se
          você subiu para ler algo, ela fica parada e aparece um aviso de “3
          mensagens novas”.
        </li>
        <li>
          Carregar mensagens antigas no topo não pode fazer a lista pular: a
          posição de leitura é compensada pela altura que entrou.
        </li>
        <li>
          Cada nickname tem uma cor fixa, calculada a partir do nome, que
          funciona no tema claro e no escuro. O dono do canal tem um selo, e uma
          mensagem que cita você aparece destacada.
        </li>
        <li>
          A página da transmissão ficou mais larga para caber vídeo e chat lado a
          lado. No estúdio, são três colunas: prévia, chat e controles. No
          celular, uma embaixo da outra.
        </li>
        <li>
          Uma aba aberta por horas não pode crescer sem limite: ela guarda até
          mil mensagens e oferece o resto como “carregar anteriores”.
        </li>
      </ul>

      <h2>Como testei</h2>
      <p>
        Os testes do servidor rodam o Worker real dentro do{" "}
        <code>workerd</code>, via Miniflare, com WebSockets de verdade:
        anônimo não escreve, a identificação funciona com a chave certa e
        devolve vazio com a errada, o texto é limpo, a sexta mensagem seguida é
        recusada, o histórico pagina, as reações chegam a todos e os totais
        sobrevivem ao fim da transmissão.
      </p>
      <p>
        O teste de ponta a ponta abre dois navegadores. Um transmite. O outro
        entra anônimo, cria o nickname pelo chat e confere que o vídeo continua
        rodando. Depois conversa, reage, curte e vê o dono apagar uma mensagem.
        No fim, a transmissão é encerrada e a página do histórico precisa mostrar
        o chat, as curtidas e as reações.
      </p>
      <p>
        Escrever esses testes achou um bug que não era do chat: o utilitário que
        espera por uma mensagem no socket deixava a espera para trás quando
        estourava o tempo, e ela engolia a mensagem seguinte. Nos testes
        antigos, uma espera que estoura o tempo só aparecia no fim. Nos do chat,
        o teste confere que algo não chegou e segue esperando outras coisas.
      </p>

      <h2>Limites</h2>
      <ul>
        <li>
          O limite de 25 espectadores da mesh vale para o chat também, porque o
          chat mora na mesma sala.
        </li>
        <li>
          Tudo o que se escreve fica público para quem tem o link, durante e
          depois da transmissão. A política de privacidade diz isso.
        </li>
        <li>
          Um chat aberto para qualquer um com um nickname criado em dois segundos
          precisa de moderação. Isso ficou grande o bastante para um{" "}
          <Link href="/blog/moderacao-do-chat-no-mayscreen">post só dele</Link>.
        </li>
      </ul>
      <p>
        O chat está no ar no{" "}
        <a href="https://may-screen.matheusmaydana.com.br">MayScreen</a>. A lição
        que fica é antiga, mas vale repetir: quando a peça que junta as pessoas
        já existe, o recurso novo é só mais um tipo de mensagem passando por
        ela.
      </p>
    </>
  );
}
