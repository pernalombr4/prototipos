# Formulário anônimo: decisões

## A proposta em 1 minuto

- **Visibilidade ganha a 3ª opção, "Anônimo"**, ao lado de Privado e Público. Público continua como hoje.
- **O link abre o formulário direto, sem login.** O endereço é o mesmo de hoje e é fixo, para cartaz e QR code.
  A proteção fica por trás: chave de 30 minutos por visita, verificação de robô sem clique, limite por hora e por
  dia e pausa automática num pico.
- **O item nasce com o usuário genérico `anonymous`**, como Airtable, ServiceNow e Pipefy. Sem
  `request_email`, sem IP e com a hora cheia. O Log de Auditoria diz "anonymous criou um registro".
- **O retorno é por protocolo e senha.** A confirmação aparece na tela e fica como 1ª mensagem do
  acompanhamento. O comitê responde pela pasta nova "Canal do denunciante" ou pelo nó novo do Spaceflow,
  "Responder ao denunciante".
- **O e-mail de retorno é opcional.** Fica cifrado fora do item, nenhuma tela mostra, o aviso não leva conteúdo
  e o e-mail some quando o caso fecha. A tela avisa que, com e-mail, a denúncia passa a ser sigilosa.

## A jornada

```
QUEM CONFIGURA                        QUEM DENUNCIA                         COMITÊ DE ÉTICA
Formulários › Editar                  Link fixo (cartaz, QR, site)
 Visibilidade = Anônimo                 │ sem login, sem Acesso Externo
 aba Anonimato:                         ▼
  link + QR, robô, limites,           Formulário + "sua denúncia é anônima"
  mensagem de recebimento,              │ verificação sem clique
  aviso por e-mail (opcional)           │ e-mail opcional (vira sigilosa)
        │                               ▼
Spaceflow do caso                     Enviar ──► item criado por anonymous ──► Lista de denúncias
 Start: Ações de Itens,                 │        (sem e-mail, sem IP,            │
  formulário Canal de denúncia          │         hora cheia)                    ▼
  (recebe user = anonymous)             ▼                                   Painel do item
 Responder ao denunciante ──────► Protocolo + senha + comprovante           Canal do denunciante
 Tarefa: Triar denúncia                 │                                    │ resposta
                                        ▼                                    ▼
                                      Acompanhar (protocolo + senha) ◄──── mensagem no acompanhamento
                                       lê e responde                       (+ aviso sem conteúdo, se pediu e-mail)
```

## Rodada 1 · 2026-10-15

- **Pedido (literal):** "tem que seguir a lógica dos no-codes ta? de virar user generico anonymous / com isso,
  pode prototipar." (a demanda inteira está no `BRIEFING.md`).
- **Mudou:** protótipo novo, uma porta, 3 jornadas pelo "Ir para" do andaime:
  - Formulários: Visibilidade "Anônimo", aba Anonimato, Rascunhos desligado no anônimo, selo na lista;
  - Spaceflow: Start com o campo Formulário e "Dados que o fluxo recebe"; o nó novo "Responder ao denunciante";
  - página pública e acompanhamento, com protocolo e senha;
  - lista de denúncias e painel do item com criador `anonymous`, pasta "Canal do denunciante", Log de Auditoria
    com hora cheia e Emails Automáticos com "Destinatário protegido".
- **Fronteira:** muda Visibilidade, a aba Anonimato, a página do link no modo anônimo, o acompanhamento, o
  cartão da denúncia e a pasta do canal no item, o nó novo e o quadro de dados do Start; não muda a casca, o
  Público de hoje, a tabela de itens, Comentários, Tarefas, Anexos nem o nó de Tarefa.
- **Descartado:**
  - Link temporário ou único por pessoa. Motivo: link por pessoa identifica quem recebeu, e link que expira
    morre no cartaz. A expiração fica na chave da visita, por trás do link fixo.
  - E-mail obrigatório escondido. Motivo: continua dado pessoal (pseudonimizado), o provedor de envio guarda o
    destinatário e conflita com a Lei 14.457, art. 23, II.
  - reCAPTCHA. Motivo: manda dado do navegador ao Google; o canal anônimo usa verificação do ENSPACE ou Turnstile.
  - "Esqueci a senha". Motivo: recuperar exige guardar um contato. A tela diz o que fazer: nova denúncia citando
    o protocolo antigo.
  - Rascunho no formulário anônimo. Motivo: exigiria guardar quem está escrevendo.
- **Não deu:**
  - Print das referências. Por quê: a pesquisa foi documental; capturar exige conta em cada produto.
  - Conferir demanda real de cliente. Por quê: a política da sessão barrou o workspace produtos e o espelho de
    chamados do QA.
  - Ver o envio passando pelo Acesso Externo até o fim. Por quê: o código chega por e-mail a uma caixa que o
    agente não lê; o comportamento veio do parecer de QA (C37).
- **Maquete:**
  - o QR code é um desenho fixo, não um QR legível; "Baixar QR code" baixa esse desenho em SVG;
  - "Baixar comprovante" baixa um .txt montado no navegador;
  - a verificação de robô é um atraso de 1,4 s que sempre passa;
  - o e-mail digitado na página pública é descartado no envio (no produto, iria para o cofre);
  - a senha da denúncia fica no mock (`senhaDoPrototipo`) só para o acompanhamento funcionar; no produto, só o
    hash, fora do item;
  - o gráfico das últimas 24 horas e o pico das 3h são fixos;
  - Comentários, Tarefas, Anexos, Mail Box, Notes e Campos mostram "Pasta fora deste protótipo";
  - os nós Tarefa e End e os campos do Start (exceto o quadro de dados) não salvam;
  - cenários do andaime: "Sem denúncias" esvazia a lista, "Pico de envios" pausa a página pública, "Envio
    falha" mantém o texto e mostra o erro.
- **CSS próprio** (consultas no MCP `nuxt-ui` registradas em "Crítica e acessibilidade"):
  - `[&>.peer]:[--sidebar-width:12.5rem]` na casca: o `EnLayout` não repassa `ui` ao `USidebar` (herdado de
    `comunicacao-no-workspace`);
  - grade do Spaceflow com `bg-[linear-gradient(var(--ui-border)…)]`: nenhum componente desenha grade de
    canvas; usa o token de borda;
  - rótulos Entrada e Saída do modal com `[writing-mode:vertical-rl]`: cópia do develop, sem componente para
    texto vertical;
  - traços do fundo da página pública em SVG com `text-accented`: decoração copiada do "Acesso Externo".
- **Crítica e acessibilidade:**
  - contraste medido por script nos 2 temas (texto visível contra o fundo efetivo). Corrigido: horas das
    mensagens e rótulo "Mensagem automática" (2,6:1 e 4,2:1), "Verificado" em verde (2,5:1), totais e aviso de
    pico da aba Anonimato (até 1,9:1) e a descrição do cartão de verificação (4,1:1, prop `ui` do
    `URadioGroup`);
  - sem correção: rosa primário com texto branco e link rosa (3,4:1) e o verde do "Salvar" (2,5:1) vêm do tema
    do `en-docs` e da cópia do develop; o placeholder "Selecione" (3,0:1) é o padrão do Nuxt UI. Achado para o
    tema, não para este protótipo;
  - crítica: os nós do Spaceflow tinham alturas diferentes (corrigido, altura fixa); o botão "Acompanhar
    denúncia" fica desligado até marcar "Guardei o protocolo e a senha", de propósito;
  - copy (skill `design:ux-copy`): o erro de login do acompanhamento ganhou o "como resolver";
  - MCP `nuxt-ui`: `search-components` com "chat message bubble" achou `UChatMessage`; ficou de fora porque os
    papéis são `user`, `assistant` e `system` e o `parts` segue o Vercel AI SDK. A conversa é composta com
    `UIcon` e utilitários. "canvas grid background" não achou componente de grade.
- **Ver:** `pnpm dev` › `http://localhost:3000/formulario-anonimo` · publicado em
  `https://pernalombr4.github.io/prototipos/formulario-anonimo/`.
