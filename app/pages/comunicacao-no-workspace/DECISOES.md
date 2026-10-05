# Comunicação no workspace: decisões

## A proposta em 1 minuto

**Um protótipo para as 3 partes do documento**, porque elas mexem nas mesmas telas e no mesmo
botão de E-mail (motivo no `BRIEFING.md`, seção 4).

| Parte do documento | Onde aparece no protótipo |
|---|---|
| (a) Link do formulário público | Requisições (cartão "Compartilhar este formulário"); Início ("Link de formulário público"); lista de itens da categoria; painel da tarefa de preencher formulário |
| (b) Atalhos de e-mail, WhatsApp e SMS | Início (Atalhos); item (Contato rápido); lista de itens (menu "Contatar"); quadro de itens (clique direito); tarefas (coluna Contato, aviso em lote, clique direito, painel); Agenda (lembrete) |
| Configuração dos atalhos | Sistema › Módulos ("Atalhos de comunicação": canais, telas, texto inicial, cópia para o item); Categorias › cartão "Atalhos de comunicação" (de quais campos vêm nome, e-mail e telefone) |
| E-mail do ENSPACE em todas as telas | "Novo e-mail" na barra do topo; "E-mails" no menu (Recebidos e Enviados, com o item); o compositor com "De" e "Vincular a item" |
| Configuração do e-mail | Sistema › Módulos ("E-mail do ENSPACE em todas as telas": caixa para e-mail sem item; quais categorias têm a pasta Mail Box) |

## O fluxo do e-mail

```
De qualquer tela                     Do item (Contato rápido ou Mail Box)
   │ Novo e-mail (topo)                 │ E-mail › Escrever pelo ENSPACE
   ▼                                    ▼
Nova Mensagem ── De: caixa do workspace   Nova Mensagem ── De: caixa do item
   │                                    │  Vincular a item: já preenchido
   │ Vincular a item (opcional)          │  (troca ou remove)
   │  busca: nome, referência, ID,       │
   │  categoria, contato                 │
   ▼                                    ▼
 Enviar ─────────────────────────────────┘
   │
   ├─ com item: sai do endereço do item; aparece em E-mails e na aba Mail Box do item
   └─ sem item: sai da caixa do workspace; aparece em E-mails, coluna Item "Sem item"
                (dá para vincular depois, na leitura do e-mail)
```

## Rodada 1 · 2026-10-05

- **Pedido (literal):** "voce deve construir o front das propostas que estao neste doc. agrupe o
  que fizer sentido [...] lembre-se de dar conta de TODOS os pontos daí: configuraçao (user
  configurador jornada) e jornada de usabilidade tambem daquilo ali". No meio da rodada: "veja
  como funciona tambem nossa folders de emails pra ver se existe endereço do item etc pra isso
  fazer sentido, ok? ou se é endereço do workspace inteiro".
- **Mudou:** protótipo novo, com 9 telas navegáveis pelo menu lateral:
  - Início, lista e quadro de itens, item, Tarefas Rápidas (quadro e lista), Agenda, Requisições,
    E-mails, Sistema e Categorias;
  - o compositor ("Nova Mensagem") abre de qualquer uma.
- **Fronteira:** muda o que o contorno tracejado mostra (chave "Mostrar o que muda" no andaime);
  não muda a casca (menu, barra do topo, trilha) nem o conteúdo de hoje das telas.
- **Maquete:**
  - os atalhos não abrem o app: mostram, num aviso, o link exato que abririam (`mailto:`,
    `https://wa.me/...`, `sms:`). Assim ninguém manda mensagem para número inventado;
  - "Abrir numa nova aba" do link público só avisa;
  - Enviar grava o e-mail na memória (some ao recarregar). O cenário "Envio falha" do andaime
    mostra o erro;
  - Anexar arquivo acrescenta um nome de arquivo fictício;
  - as pastas do item fora de Visão Geral, Tarefas e Mail Box mostram "Pasta fora deste
    protótipo";
  - "Tornar público" e "Tornar privado" no menu do formulário são atalho do protótipo para o Editar
    › Visibilidade (e para o "Alternar Privacidade" do construtor), que já existem.
- **Não deu:** prints das referências (a pesquisa leu a documentação, sem captura); `vue-tsc` para
  checar tipos (não está instalado e instalar mexe no `package.json`).
- **Ver:** `http://localhost:3000/comunicacao-no-workspace` · prints:
  [início](evidencias/prototipo-01-inicio-atalhos.jpg),
  [item](evidencias/prototipo-02-item-contato-rapido.jpg),
  [E-mail com 2 caminhos](evidencias/prototipo-03-email-dois-caminhos.jpg),
  [compositor e busca](evidencias/prototipo-04-compositor-busca-de-item.jpg),
  [Sistema › Módulos](evidencias/prototipo-05-sistema-modulos.jpg).

## Por que cada decisão

### O endereço do item é o remetente

O develop mostra que **cada item tem caixa própria**:
`<referência>.<workspace>@develop.box.enspace.io`, na aba Mail Box. O e-mail escrito ali sai desse
endereço, e a resposta volta para o item. O workspace também tem caixas (a "Caixa de Triagem").

Daí:

- **com item vinculado,** o compositor propõe o endereço do item no "De";
- **sem item,** propõe a caixa do workspace escolhida em Sistema › Módulos;
- **sem item e sem caixa** (cenário "Sem caixa de e-mail"), o compositor avisa e oferece "Vincular
  um item". O documento pede que a falta de item não impeça o envio: para isso o workspace precisa
  de 1 caixa.

**Divergência com o documento:** "O vínculo com o item é uma informação interna do ENSPACE e não
interfere no conteúdo ou envio do e-mail." No ENSPACE de hoje o vínculo **é** o remetente: é ele
que faz a resposta voltar para o item. O protótipo mantém isso e deixa o "De" à vista (hoje a tela
esconde). Quem quiser vincular sem trocar o remetente escolhe outra caixa no "De"; o vínculo
continua. **Pergunta para a Mikaela e o Felipe:** é isso, ou o vínculo deve virar só uma etiqueta
interna, com o e-mail saindo sempre da mesma caixa?

### O "De" aparece

A "Nova Mensagem" de hoje não diz de onde o e-mail sai. Com o compositor abrindo de qualquer tela,
o remetente muda conforme o vínculo, e esconder isso faz a pessoa mandar e-mail do endereço errado
sem saber. HubSpot e Pipefy mostram o From.

### O botão E-mail tem 2 caminhos

Com o módulo "E-mail do ENSPACE" ligado, o E-mail dos atalhos abre um menu:

- **Escrever pelo ENSPACE:** sai da caixa do item e fica no histórico;
- **Abrir no meu app de e-mail:** o `mailto:` que o documento pede.

Com o módulo desligado, o botão abre direto o app. É a regra do Twenty (com caixa, compositor
interno; sem caixa, `mailto:`), só que com a escolha à vista, porque no ENSPACE as 2 coisas existem
juntas.

### A caixa do item vai em cópia no e-mail do app

Ideia do monday ("CC to pulse"). Quando a pessoa abre o e-mail no Outlook, o `mailto:` leva a
caixa do item em `cc`. A resposta do cliente volta para a aba Mail Box, e o ENSPACE não enviou
nada. Liga e desliga em Sistema › Módulos ("Pôr a caixa do item em cópia").

### "Não gerar conteúdo" e o texto inicial

O documento diz que o ENSPACE "não deverá gerar conteúdo da mensagem" e, no mesmo parágrafo, pede
`mailto:...?subject=ASSUNTO&body=CORPO`. O protótipo resolve assim:

- o assunto e o texto inicial vêm de um modelo curto, por categoria, com variáveis (`{referencia}`,
  `{titulo}`, `{nome}`, `{categoria}`);
- quem envia muda tudo no app antes de mandar;
- o administrador desliga em Sistema › Módulos ("Preencher assunto e mensagem"), e aí o app abre só
  com o destinatário.

### Quem é o contato: por categoria

O item não tem um campo "telefone do contrato" fixo: cada categoria tem os seus. Por isso o cartão
novo no painel da categoria (ao lado de Correção Monetária) diz de quais campos vêm o nome, o
e-mail e o telefone de cada contato. Uma categoria pode ter mais de 1 contato (Contratos tem
"Contato da contraparte" e "Requisitante"); o Contato rápido do item deixa escolher. A prévia ao
lado mostra o link que cada atalho abre com o item de exemplo.

### Canal sem dado: desabilitado, com o motivo

Pedido do documento ("o respectivo botão deverá ficar indisponível"). Nenhuma das referências diz
**por quê**. O protótipo diz: tooltip "Sem telefone cadastrado" e, no Contato rápido, uma linha
visível "Sem telefone: WhatsApp e SMS indisponíveis." (botão desabilitado não recebe foco, e o
tooltip não chega a quem usa teclado). Canal que o administrador desligou não aparece.

### Membro sem telefone

O perfil não tem telefone. O schema tem `User.meta.phone`, e o protótipo supõe esse dado em metade
dos membros, para mostrar os 2 estados. Para o aviso ao responsável de uma tarefa por WhatsApp ou
SMS funcionar de verdade, o perfil precisa do campo. **É dependência fora desta demanda** (regra
19: não resolver na tela B o problema da tela A): fica registrada, não desenhada.

### Link público: nas telas de uso, sem tirar da configuração

- **Requisições:** o cartão do mockup 1, entre o seletor e o formulário, só com formulário público.
  Formulário privado ganha 1 linha dizendo por que não há link.
- **Início:** o menu "Link de formulário público", com copiar e enviar por formulário.
- **Lista de itens:** o mesmo menu, só com os formulários da categoria, ao lado de "Novo registro".
- **Tarefa de preencher formulário** (`type: form`): o cartão no painel da tarefa.
- **O Copiar da configuração continua** (regra 20: destaque soma, não substitui). Muda só o aviso: 1 texto em todo lugar, "Link
  copiado", no lugar dos 2 de hoje.

### Tarefas: lista com aviso em lote, quadro com clique direito

- **Lista:** a coluna Contato (3 ícones) e, com tarefas selecionadas, "Avisar responsáveis por".
  E-mail abre 1 rascunho para todos. WhatsApp e SMS abrem 1 janela com 1 botão por pessoa: o
  navegador bloqueia várias abas abertas de uma vez.
- **Quadro:** o mockup 5 põe "Notify" em cada cartão. O `EnKanbanBoard` 0.17 não aceita ação extra
  no cartão (sem slot e sem prop). O protótipo usa o clique direito (o board emite
  `context-mouse`) e o painel da tarefa, que abre no clique do cartão. **Pedido ao SDK:** uma prop
  de ações extras no menu do cartão (ver `COMPONENTES-CUSTOM.md`).

### Agenda: lembrete por participante

O modal "Evento" de hoje ganha um atalho por participante e "E-mail para todos". Participante do
Outlook só tem e-mail, então WhatsApp e SMS ficam desabilitados com o motivo. Evento que vem de um
item (vencimento, assinatura) traz o telefone do contato do item.

### A área "E-mails" no menu

O documento pede que o e-mail apareça "na área de E-mail do usuário". Essa área existe escondida
(`/itemEmails`, "Emails Recebidos"; achado S2-F1 da pesquisa de UX: telas nativas que só existem no editor de menus). O protótipo a põe na seção Membro, com
Recebidos e Enviados, a coluna Item, o filtro "Com item" e "Sem item", e o vínculo depois do envio
(ideia do Pipedrive). O nome repete o "E-mails" de Configurações, como "Categorias" já se repete
entre Membro e Estrutura.

### "Novo e-mail" na barra do topo

O documento pede o e-mail "da mesma forma que outras funcionalidades transversais da plataforma".
As transversais de hoje moram na barra do topo (Suporte, notificações). O botão tem rótulo, não só
ícone, para ser achado na primeira vez. Com rascunho guardado, ganha um ponto amarelo.

### Busca de item

- Busca, não lista: vazia, mostra os 5 atualizados por último; com texto, os 8 melhores e quantos
  ficaram de fora (regra 34: o controle se desenha para o volume real, e o workspace tem milhares de itens).
- Procura em referência, ID, nome, categoria, contatos e campos de texto (contraparte, CNPJ).
- Resultado agrupado por categoria, com ID, etapa e contraparte: itens de nome igual se distinguem.
- Item sem permissão não aparece, nem na contagem. A lista diz isso no rodapé.

## O que é do SDK

- **Usado:** `EnLayout` (a casca, pela primeira vez neste repositório), `EnTable` (lista de itens,
  lista de tarefas, E-mails, Formulários), `EnKanbanBoard` (quadro de itens e de tarefas) e os
  tipos do `enspace-sdk-schemas` (`Workspace`, `Member`, `ItemType`, `Field`, `Item`, `Task`).
- **Sem schema no SDK 0.17:** formulário, e-mail, caixa de e-mail e evento da Agenda. A forma veio
  das telas do develop e está marcada no `mocks.ts`.
- **Limites encontrados:**
  - `EnLayout` não repassa `ui` ao `USidebar`, que fixa 16rem. O develop usa ~200 px;
  - `EnKanbanBoard` não aceita ação extra no cartão.

## CSS e classes fora do token

Conferido com `grep "<style\|:deep(\|!important"`: nenhum `<style>`, `:deep()` ou `!important`.
Classes com valor arbitrário:

| Onde | Classe | Por quê |
|---|---|---|
| `_CascaDoEnspace.vue` | `[&>.peer]:[--sidebar-width:12.5rem]` | O `EnLayout` não repassa `ui` ao `USidebar`. Consulta: `Layout.vue.js` do SDK e `.nuxt/ui/sidebar.ts` |
| `_CascaDoEnspace.vue` | `w-[min(50rem,calc(100vw-30rem))]` | O slot `navbar-title` do `EnLayout` não estica (sem `flex-1`), e a trilha do develop ocupa o meio da barra |
| telas | `animate-[entrada_...]` | Usa o `@keyframes entrada` do `main.css` |
| `_TelaItem.vue`, `_TelaEmails.vue` | `[&_p]:my-1.5`, `[&_blockquote]:...` | Corpo do e-mail vem em HTML |
| `_TelaAgenda.vue` | `[&:nth-child(7n)]:border-r-0` | Grade do mês montada à mão: nem o Nuxt UI nem o SDK têm calendário de eventos (MCP: o `UCalendar` escolhe data) |

## Crítica e acessibilidade

Rodadas `design:design-critique` e `design:accessibility-review` sobre o código e as telas.

**Corrigido nesta rodada:**

- o motivo do atalho indisponível só estava no tooltip: agora há linha visível no Contato rápido;
- a linha do e-mail na Mail Box abre e fecha sem `aria-expanded`: acrescentado;
- o ponto de "não lido" não tinha papel para leitor de tela: `role="img"` com rótulo;
- "Vinculado porque você começou no item" continuava depois de trocar o item à mão: some na troca;
- os 3 botões do Contato rápido quebravam linha: dividem a largura do cartão.

**Fica sem correção, com o motivo:**

- **o clique direito do quadro não chega pelo teclado.** O caminho de teclado é abrir o cartão (o
  painel da tarefa tem os mesmos atalhos). Correção de verdade depende do SDK;
- **o E-mail com 2 caminhos custa 1 clique a mais** que o `mailto:` direto. Alternativa: botão
  dividido (clique no corpo escreve pelo ENSPACE, a seta abre o app). Fica para a Mikaela decidir;
- **WhatsApp e SMS no Início, sem destinatário,** abrem o app vazio. Estão porque o mockup 6 pede;
  o administrador desliga "Tela inicial" em Onde aparecem;
- **o "Novo e-mail" com rótulo pesa na barra do topo.** Ícone sozinho seria mais leve e mais
  difícil de achar;
- **o tema escuro e o espanhol ficaram sem conferência visual nesta rodada:** a janela do
  navegador estava minimizada e não pintava a tela. O texto em espanhol está completo no
  `textos.ts`;
- **o aviso com "Ver no item" some em 5 s.** O mesmo caminho existe na tela E-mails.
