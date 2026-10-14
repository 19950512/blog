import type { PostMeta } from "./index";

export const meta: PostMeta = {
  slug: "mayscreen",
  title: "MayScreen: compartilhar a tela depois que o Discord perdeu o Go Live",
  date: "2026-10-14",
  excerpt:
    "Com o Go Live suspenso no Brasil, fiz um site para transmitir a tela com áudio por um link. Como ele funciona por dentro e por que escolhi WebRTC e Cloudflare.",
  tags: ["webrtc", "cloudflare", "durable-objects", "react"],
  type: "projeto",
  lang: "pt-br",
};

const diagram = ` quem transmite                     Cloudflare                   quem assiste
┌──────────────────┐    ┌────────────────────────────────┐    ┌────────────────┐
│ tela + áudio     │ ws │ Worker ─► Durable Object       │ ws │ navegador      │
│ + microfone      │◄──►│ (uma sala por transmissão)     │◄──►│ (sem conta)    │
│ (Web Audio mixa) │    │ D1: canais · R2: fotos/replay  │    │                │
└────────┬─────────┘    └────────────────────────────────┘    └───────▲────────┘
         │                                                            │
         └────────── vídeo + áudio por WebRTC, direto (P2P) ──────────┘`;

export default function Mayscreen() {
  return (
    <>
      <p>
        Quem joga com amigos no Discord conhece o ritual: entra na call, clica
        em transmitir e todo mundo vê a sua tela, com o som do jogo. Desde 17
        de agosto isso não existe mais para quem está no Brasil. Então fiz o{" "}
        <a target="_blank" href="https://may-screen.matheusmaydana.com.br">MayScreen</a>: você
        escolhe um nickname, dá um nome para a transmissão e manda o link. Quem
        abrir assiste na hora, com áudio, sem instalar nada e sem criar conta.
      </p>

      <h2>O que aconteceu com o Discord</h2>
      <p>
        No dia 6 de agosto, depois da morte de uma adolescente de 13 anos em
        Mato Grosso do Sul, num caso ligado ao Discord, a primeira-dama Janja
        pediu publicamente que a plataforma saísse do ar. No dia 12, a{" "}
        <abbr title="Autoridade Nacional de Proteção de Dados">ANPD</abbr>{" "}
        adotou uma medida preventiva com base no ECA Digital: o Discord teve de
        suspender no Brasil o Go Live e qualquer recurso equivalente de
        transmissão ou compartilhamento de vídeo. A suspensão vale desde o dia
        17 e só termina quando a empresa demonstrar medidas de proteção que a
        ANPD aceite (
        <a target="_blank" href="https://www.techtudo.com.br/noticias/2026/08/suspensao-do-discord-no-brasil-o-que-muda-apos-proibicao-de-transmissoes-edjogos.ghtml">
          TechTudo
        </a>
        ,{" "}
        <a target="_blank" href="https://support.discord.com/hc/en-us/articles/42704051358359-Why-video-features-are-currently-unavailable-in-Brazil">
          Discord
        </a>
        ).
      </p>
      <p>
        O Discord não foi banido: texto, voz e servidores continuam
        funcionando. Mas o recurso que o meu grupo mais usava, mostrar o jogo
        enquanto conversa, sumiu sem data para voltar.
      </p>
      <p>
        A segurança de crianças e adolescentes nas plataformas é um assunto
        sério e merece mais do que um parágrafo num post técnico. Este post é
        sobre o buraco prático que ficou e sobre como eu o preenchi.
      </p>

      <h2>O que o MayScreen faz</h2>
      <ul>
        <li>
          Cada transmissão tem um endereço próprio, no formato{" "}
          <code>/nickname/nome-da-transmissao</code>.
        </li>
        <li>
          Não tem cadastro. Você escolhe um nickname e recebe uma chave de
          acesso, que fica no navegador e serve para entrar com o mesmo nickname
          em outro lugar.
        </li>
        <li>
          Dá para compartilhar uma aba, uma janela ou a tela inteira. O áudio do
          sistema funciona no Chrome e no Edge, e o microfone entra junto.
        </li>
        <li>A página inicial lista os canais, com quem está no ar primeiro.</li>
        <li>
          Se o dono quiser, a transmissão é gravada e fica disponível como
          replay por 30 dias.
        </li>
        <li>
          Quando alguém entra no ar, o MayScreen posta um aviso num canal do
          Discord, por webhook. Texto ainda funciona por lá.
        </li>
      </ul>

      <h2>Como funciona</h2>
      <p>
        O vídeo não passa pelo servidor. Ele vai direto do navegador de quem
        transmite para o de cada espectador, por WebRTC. O servidor só ajuda os
        navegadores a se encontrarem e guarda o que precisa persistir: canais,
        histórico, fotos de perfil e replays.
      </p>
      <pre>
        <code>{diagram}</code>
      </pre>

      <h3>Captura e áudio</h3>
      <p>
        A tela vem de <code>getDisplayMedia</code> e o microfone, de{" "}
        <code>getUserMedia</code>. Em vez de mandar duas faixas de áudio, um
        mixer feito com Web Audio junta as duas numa só. Assim, ligar ou
        desligar o microfone no meio da transmissão é só mudar um ganho, sem
        renegociar a conexão com cada espectador. O SDP também é reescrito para
        o Opus sair em estéreo a 128 kbps, porque o padrão do WebRTC é mono,
        pensado para voz, e não para a trilha de um jogo.
      </p>

      <h3>Sinalização</h3>
      <p>
        Antes de trocar vídeo, os navegadores precisam trocar ofertas, respostas
        e candidatos de rede (offer, answer e ICE). Isso passa por um WebSocket.
        Cada transmissão tem a sua sala: um Durable Object da Cloudflare, que
        recebe os sockets de quem transmite e de quem assiste e repassa as
        mensagens entre eles.
      </p>
      <p>
        A sala usa a API de hibernação. O estado de cada conexão fica no próprio
        socket, e o objeto dorme enquanto ninguém fala. O keepalive dos clientes
        é respondido pelo runtime sem acordá-lo. Se quem transmite some por 120
        segundos, um alarme do próprio objeto encerra a transmissão.
      </p>

      <h3>Mídia em mesh</h3>
      <p>
        Quem transmite abre uma conexão WebRTC por espectador, com vídeo de até
        2,5 Mbps a 30 fps e áudio de 128 kbps. É a topologia mais simples que
        existe e não custa nada de servidor, mas o upload de quem transmite
        cresce a cada pessoa que entra: com 5 espectadores são uns 13 Mbps, com
        25 passa de 65 Mbps. Por isso o limite é de 25 espectadores por
        transmissão.
      </p>

      <h3>Replay</h3>
      <p>
        Se o dono liga “Gravar para replay”, o navegador dele grava MP4 (H.264 +
        AAC, cerca de 1,5 Mbps) com <code>MediaRecorder</code> e envia o arquivo
        em partes de 8 MiB enquanto transmite. O Worker grava cada parte no R2
        como um multipart upload, então nunca precisa segurar o vídeo inteiro.
        Como o <code>MediaRecorder</code> não acompanha a troca de faixa quando a
        pessoa para e volta a compartilhar, cada trecho contínuo vira um
        segmento, e o player toca os segmentos em sequência.
      </p>
      <p>
        Um Cron Trigger diário completa uploads abandonados e apaga replays com
        mais de 30 dias. A soma de todos os replays tem um teto de 9 GB, para
        ficar dentro dos 10 GB gratuitos do R2.
      </p>

      <h2>Por que essas tecnologias</h2>
      <dl>
        <dt>WebRTC</dt>
        <dd>
          É o jeito de capturar tela e áudio no navegador e entregar com menos
          de um segundo de atraso, sem instalar nada. Um fluxo com OBS, RTMP e
          HLS teria vários segundos de atraso e precisaria de um servidor
          recebendo e redistribuindo o vídeo.
        </dd>
        <dt>Mesh em vez de SFU</dt>
        <dd>
          Um SFU (como o Cloudflare Realtime ou o LiveKit) recebe o vídeo uma vez
          e redistribui, o que acaba com o limite de upload. Mas é mais uma peça
          para operar e pagar. Para um grupo de amigos, a mesh resolve. E tem um
          efeito colateral bom: como a mídia não passa pelo servidor, ele não vê
          nem guarda a transmissão, a não ser que o dono peça o replay.
        </dd>
        <dt>Cloudflare Workers</dt>
        <dd>
          A primeira versão rodava num servidor Node com Express,{" "}
          <code>ws</code> e SQLite. Funcionava, mas era uma máquina para manter
          ligada. Na Cloudflare, o frontend sai como Static Assets, que não
          contam como requisição de Worker, e a API roda num Worker com{" "}
          <a href="https://hono.dev">Hono</a>, que tem a cara do Express. O plano
          gratuito dá 100 mil requisições de Worker por dia, o que cobre o uso
          de um grupo de amigos.
        </dd>
        <dt>Durable Objects</dt>
        <dd>
          A sinalização precisa de um lugar onde todos os sockets de uma
          transmissão se encontrem. Num servidor comum, isso é um objeto em
          memória; em serverless, costuma virar Redis ou pub/sub. O Durable
          Object é exatamente esse lugar: uma instância única por nome, com
          WebSockets, alarmes e armazenamento próprios. Com a hibernação, uma
          sala ociosa não fica cobrando tempo de execução.
        </dd>
        <dt>D1 e R2</dt>
        <dd>
          O D1 é SQLite, o mesmo banco que a versão Node já usava. A sala grava
          nele o número de espectadores e se a tela está ativa, e a API lê de lá
          sem precisar acordar a sala. O R2 guarda fotos e replays, é acessado
          pelo binding do Worker, sem chaves de API no código, e não cobra
          tráfego de saída, o que pesa quando o conteúdo é vídeo.
        </dd>
        <dt>React e Vite</dt>
        <dd>
          No frontend, uma SPA com React, Vite e CSS escrito à mão, sem
          biblioteca de componentes.
        </dd>
      </dl>

      <h2>Como eu testo</h2>
      <p>
        Os testes de unidade e de API rodam o bundle real do Worker dentro do{" "}
        <code>workerd</code>, via Miniflare, com D1, R2 e Durable Objects
        emulados. O teste de ponta a ponta usa o Playwright num Chromium com uma
        tela falsa desenhada em canvas: um transmissor e dois espectadores
        conectam por WebRTC de verdade, e o teste confere se o vídeo que chega
        tem conteúdo e se o áudio do sistema e o do microfone chegam, e somem
        quando silenciados.
      </p>

      <h2>Limites</h2>
      <ul>
        <li>25 espectadores por transmissão, por causa da mesh.</li>
        <li>
          Só há STUN. Quem está atrás de NAT simétrico ou de firewall
          corporativo pode não conectar; para esses casos seria preciso um
          servidor TURN.
        </li>
        <li>
          Áudio do sistema só no Chrome e no Edge, no Windows e no ChromeOS,
          compartilhando a tela inteira. Uma aba manda o próprio áudio. No
          Firefox e no Safari, só o microfone. No celular, dá para assistir, mas
          não para transmitir.
        </li>
        <li>
          O link é público: quem tiver o endereço assiste. Para criar um canal,
          os termos de uso exigem 18 anos ou autorização dos pais.
        </li>
      </ul>

      <p>
        Se a audiência crescer, o próximo passo é trocar a mesh por um SFU. Por
        enquanto, o MayScreen está no ar em{" "}
        <a href="https://may-screen.matheusmaydana.com.br">
          may-screen.matheusmaydana.com.br
        </a>
        , e quem quiser trocar ideia sobre ele pode entrar no{" "}
        <a href="https://discord.gg/ChNwHF7bTG">servidor do Discord</a>. Por
        texto, claro.
      </p>
    </>
  );
}
