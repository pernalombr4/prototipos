# Decisões: módulo de assinaturas

## Rodada 1 · 2026-11-18

- **Pedido (literal):** "pode colocar tudo num protótipo só, e nao varios protótipos. [...] voce vai prototipar outras melhorias visuais/de organizaçao nas telas de acordo com o que achar interessante pra melhorar a ux. [...] as suas precisam vir primeiro porque vao ser a base da aparencia do modulo pra fazer todo o resto."
- **Origem:** os itens que mudam o front no documento de testes de assinadores em develop de 2026-11-18, mais M16, M19 e M23, que a redatora pediu para incluir. Tradução, tooltip, rótulo e ajuste pequeno ficaram de fora.
- **Fronteira:**
  - muda: Integrações > Apps (seção Assinatura eletrônica), a página do provedor, Módulos > Assinaturas (lista, novo envelope, detalhe, cancelar, reenviar, links), a execução e o editor do nó Assinatura eletrônica, a tarefa Integração e o aviso ao desligar o módulo em Sistema;
  - não muda: o resto da casca (menu, barra do topo, atalhos), copiado da prévia da branch em `_CascaDoEnspace.vue`. As 2 exceções estão no topo do arquivo: o item "Assinatura Eletrônica" sai de Integrações, e a trilha mostra o nome da tela.

### A base do módulo (proposta desta sessão, vem antes dos itens do documento)

- **B1. Os provedores ficam na loja de apps.** O item "Assinatura Eletrônica" sai do menu Integrações. Os 5 provedores entram em Apps, numa seção "Assinatura eletrônica", com 1 card por provedor e 1 estado em texto: "Conectado · N credenciais", "Falta 1 etapa" ou "Não conectado". O card abre a página do provedor. O andaime liga "Menu de hoje", que mostra o item atual riscado, para comparar.
- **B2. 1 aviso para as 5 integrações antigas.** Hoje o mesmo aviso aparece 5 vezes. As antigas ficam recolhidas abaixo dos provedores novos, com 1 aviso só.
- **B3. A página do provedor diz cada coisa 1 vez.** Hoje a mesma informação aparece até 5 vezes, com textos diferentes (selos do topo, alerta, "Como se comporta", "Recursos opcionais" e detalhes técnicos).
  - O topo tem o provedor e 1 estado: "Pronto para enviar" ou "Falta configurar".
  - "Configuração" lista as etapas numeradas, cada uma com o próprio conteúdo: a credencial dentro da etapa 1; o cofre (D4Sign); o consentimento (DocuSign); a URL do webhook dentro da etapa do webhook.
  - A etapa do webhook da conta conclui só com o 1º retorno do provedor (M17), porque o ENSPACE não confere o portal.
  - "O que a <provedor> faz no ENSPACE" diz cada recurso 1 vez, com a consequência. "Detalhes técnicos" fica recolhido.
- **B4. A lista de envelopes mostra o que precisa de atenção.**
  - Chips "Precisam de atenção": com erro e sem retorno há mais de 2 dias, num clique.
  - A busca acha também pelo nome e pelo e-mail do signatário (M18); as datas levam a hora (M27).
  - A coluna Origem diz o fluxo ou a categoria, não só o tipo.
- **B5. 1 campo de credencial no novo envelope**, agrupado por provedor, no lugar de Provedor e Credencial. Só aparecem as credenciais prontas. "Enviar para assinatura" fica ao lado de "Salvar rascunho"; hoje é preciso salvar, abrir o rascunho e enviar.
- **B6. O detalhe do envelope com até 2 ações e 1 faixa de estado.**
  - No topo, até 2 ações visíveis, conforme o estado; o resto vai para "Mais ações", com 1 linha de explicação em cada item. Hoje são até 8 botões lado a lado.
  - 1 faixa de estado no lugar de até 7 alertas empilhados: o que aconteceu, quem fez, o motivo, o efeito no fluxo e o atalho.
  - A origem é um link para a execução ou para a tarefa que criou o envelope.
  - Participantes agrupados por ordem de assinatura.
- **B7. O editor do nó escolhe antes de abrir campos.** 1 campo de credencial com o nome do provedor (hoje são 2 campos e o provedor aparece pelo código, M24). Documento escolhe entre "De um nó anterior" e "Arquivo fixo"; Signatários entre Fixos, De uma lista ou os dois. Só o escolhido fica aberto. A ordem diz se assinam ao mesmo tempo ou em sequência.
- **B8. O painel da execução fala a língua de quem configura.** O painel do nó tem Resultado, o link do envelope, os signatários e a configuração com nomes (M25). O JSON fica em "Dados técnicos", recolhido. Nó que não executou fica cinza tracejado.
- **B9. A tarefa Integração leva ao envelope** no módulo, com o título e o status dele.

### Os itens do documento de testes, em cima da base

| Item | O que o protótipo mostra |
|---|---|
| M35, C48 | Envelope do Spaceflow cancelado no módulo ou recusado: o nó e a execução vão para Erro, com "Envio cancelado no módulo de assinaturas por <pessoa> em <data>. Motivo: <motivo>" e "Ver cancelamento". O nó ganha "Se o envelope for recusado, cancelado ou expirar": dar erro (padrão) ou seguir. |
| M35, C48, C10 | A tarefa Integração vai para Erro, com o motivo no topo e no Histórico; a cobrança e "Concluir Tarefa" saem. Falha no envio mostra o motivo e "Enviar para Integração de novo". |
| M35 | Cancelar um envelope que veio de fluxo diz o efeito antes ("A tarefa Integração #<n> do item <ref> vai para erro com este motivo") e pede o motivo, que é obrigatório nesse caso. |
| M32 | O nó no canvas mostra o desfecho em texto (Assinado, Recusado, Cancelado, Expirado, Erro), não só a cor. |
| M25 | Ver B8. |
| C55 | O erro de configuração diz o motivo e o caminho usado, com a dica `workflow_input.input` e "Editar o nó"; no editor, a mesma dica fica embaixo do caminho da lista. |
| M31 | Quem ainda não está na vez aparece "Na fila", com "Recebe o convite quando a ordem <n> terminar", e não tem Reenviar. |
| M23 | Reenviar e-mail confirma antes e lista quem recebe; diz quantos estão na fila. |
| M34 | Certisign avulsa: "Cancelar envelope" desligado em "Mais ações", com a explicação. Certisign de fluxo: o modal de cancelar avisa que o documento continua ativo no portal. Nos 2 casos, "Abrir Certisign". |
| C52 | Certisign do fluxo da categoria: "Links de assinatura" aparece, com o aviso de segurança. |
| C54, C43, M20 | A trilha diz quem fez (pessoa, provedor ou ENSPACE) e o motivo. O eco do provedor vira "A <provedor> confirmou às..." na mesma linha, sem 2º evento. |
| M21 | Depois do cancelamento, quem não assinou aparece "Não assinou". |
| M13 | Envelope aberto sem retorno do provedor há mais de 2 dias: selo na lista e faixa no detalhe, com "Atualizar status" ou o portal, se o provedor não consulta. |
| M14 | O campo Documento diz o limite e os formatos do provedor escolhido e recusa o arquivo na hora, com o motivo. |
| M16 | Sem provedor, a lista leva a conectar 1; com provedor e sem envelope, convida a criar o 1º; a 1ª credencial liga o módulo e avisa; desligar o módulo com envelopes aguardando avisa quantos são e o que acontece com eles. |
| M19 | O menu ⋮ da lista mostra só as ações que o status e o provedor permitem. |

- **Descartado:** página própria de credenciais por provedor fora de Apps. Motivo: é o menu a mais que a redatora pediu para tirar; a credencial mora dentro da etapa 1 da página do provedor.
- **Descartado:** cartões grandes para escolher Documento e Signatários no editor do nó. Motivo: decisão anterior da redatora (modal de configuração usa escolha compacta); ficou o grupo de opções do Nuxt UI.
- **Fora do escopo:** C42 (data passada em "Expira em") entrou só como o mínimo do campo, por ser o mesmo campo de M27. As abas Item, Versões, Comentários e Logs abrem o aviso de fora do escopo.
- **Pesquisa:** `PESQUISA.md`, com 9 referências (Zapier, Make, monday, ClickUp, Notion, DocuSign, PandaDoc, Twenty, Pipefy). As páginas do ClickUp e do monday estavam bloqueadas; PandaDoc entrou no lugar da Clicksign; a página do envelope da DocuSign não tem fonte oficial.
- **Não deu:** prints das referências da pesquisa. Por quê: a pesquisa foi por páginas públicas, sem captura.
- **Maquete:**
  - os dados são o `mocks.ts`: 1 workspace fictício (Vértice Engenharia), 5 provedores, credenciais e 40 envelopes inventados;
  - enviar, cancelar, reenviar e criar credencial mexem no estado em memória; recarregar volta ao começo;
  - baixar, abrir o portal, Testar credencial e as abas fora do escopo só mostram aviso;
  - a barra "Protótipo" (Ir para, situação do workspace, desfecho do nó, estado da tarefa, Menu de hoje, Reiniciar) é andaime, não proposta.
- **CSS próprio:** nenhum. Sem `<style>`, `:deep(` ou `!important`; as animações usam as curvas do `main.css`.
- **Crítica e acessibilidade:**
  - botões só de ícone (⋮ da lista, Mostrar e Copiar a URL do webhook, Copiar link) têm `aria-label` ou rótulo;
  - estado nunca só por cor: o nó, a faixa, o selo e o participante dizem o estado em texto;
  - os cards de provedor em Apps são botões, com foco visível;
  - sem correção: o tema escuro e os idiomas EN e ES não foram conferidos tela a tela nesta rodada; os textos existem nos 3 idiomas.
- **Ver:** `https://pernalombr4.github.io/prototipos/modulo-de-assinaturas` · `evidencias/prototipo-*.png` (25 prints, 1 por item, sem ponteiro, sem a barra do andaime).

## Rodada 2 · 2026-11-19

- **Pedido (literal):** "a tela de apps ta bem estranha. um escrito gerenciar, outro escrito instalar... faça direito isso do jeito certo. e ta parecendo um rascunho em vez de uma tela completa. [...] os estados iniciais da tela do modulo nao estao legais. o que nao tem integrador instalado nao tem nem atalho. [...] todos os cards na tela apps precisam ter o mesmo formato. [...] nao tem um estado quando nao tem NEM envelope e nem provedor conectado. [...] nao ter provedor conectado nao é impeditivo pro cara usar o módulo. [...] ele pode criar o primeiro envelope dele sem provedor, so nao vai conseguir enviar."
- **Fronteira:** muda Integrações > Apps inteira, o começo de Módulos > Assinaturas, o novo envelope e o detalhe do rascunho sem provedor; o resto fica como na rodada 1.

### Apps: 1 formato de card

- **1 card para todo app** (`_CardDeApp.vue`), na loja e no começo do módulo: logo, nome, descrição, estado em texto e 1 botão. O card inteiro abre o app.
  - Antes: 3 formatos de botão (cheio, link rosa com seta, fantasma) e 4 rótulos (Gerenciar Integração, Instalar Integração, Utilizar Plugin, Conectar).
  - Agora: o botão é "Ver detalhes" em todo card da loja. O que fazer (conectar, instalar, gerenciar) fica na página do app.
- **O estado usa o mesmo vocabulário em todo app:** Conectado, Falta 1 etapa, Não conectado. O detalhe vem junto: "· 2 credenciais".
- **A tela ganhou o que faltava para parecer completa:**
  - a linha do que é a tela;
  - o filtro Todos, Conectados e Não conectados, com a contagem;
  - a busca;
  - cada seção com ícone, contagem e 1 linha do que faz.
- **Nada se repete:**
  - "Novo" aparece 1 vez, na seção Assinatura eletrônica, e não em cada card;
  - o card não repete a categoria, que a seção já diz;
  - o aviso das integrações antigas fica 1 vez, no cabeçalho do grupo recolhido;
  - o card antigo diz o que é só dele: os fluxos de categoria que ainda o usam ("Em uso · 2 fluxos" ou "Sem uso").

### O começo do módulo (M16)

- **4 situações**, todas no andaime ("Workspace" e "Ir para"):

  | Situação | O que a tela mostra |
  |---|---|
  | Nem provedor nem envelope | o começo completo, com "Criar o primeiro envelope" como ação principal e "Conectar um provedor" ao lado |
  | Provedor conectado, sem envelope | o mesmo começo, com o provedor conectado no topo e o passo 1 concluído |
  | Rascunhos, sem provedor | a lista, com o aviso "Nenhum provedor conectado" e o atalho para conectar |
  | Dia normal | a lista, como na rodada 1 |

- **O começo completo** (`_ComecoDoModulo.vue`) tem 4 blocos:
  - o que o módulo faz, com uma prévia de como o envelope fica (participantes por ordem, Assinou, Na vez, Na fila);
  - os 3 passos (conectar, criar, acompanhar), com o estado de cada um. Sem provedor, o passo 1 diz "Pode ser depois";
  - sem provedor: os 5 provedores, no mesmo card da loja, cada um com o limite de arquivo e o atalho "Conectar" para a página dele. A rodada 1 tinha só os nomes, sem atalho;
  - as outras formas de criar envelope (nó do Spaceflow e tarefa Integração), com o atalho de cada uma.
- **Sem provedor, o envelope continua possível:** ele é salvo como rascunho e é enviado depois.
  - **Novo envelope:** o campo da credencial avisa, com o atalho para conectar. O produto já avisa hoje, com "Nenhuma credencial configurada para <provedor>". "Salvar rascunho" vira a ação principal, e "Enviar para assinatura" só aparece com um provedor conectado.
  - **Lista:** a coluna Provedor diz "Sem provedor". No menu ⋮, Enviar fica desligado, com o motivo.
  - **Detalhe do rascunho:** a faixa diz que o envio espera a conexão, e a ação principal é "Conectar um provedor". Com um provedor já conectado, a faixa manda escolher a credencial no rascunho.
- **Descartado:**
  - **Rótulo do botão conforme o estado (Conectar ou Gerenciar).** É o que a redatora apontou como estranho. O estado em texto já diz se o app está conectado.
  - **"Enviar para assinatura" desligado no modal.** O botão desligado parecia ligado, o mesmo problema do "Concluir Tarefa" da rodada 1.

### Fechamento

- **Maquete:**
  - o dia normal fica intacto. Os começos usam um workspace à parte, para os atalhos dos outros itens continuarem abrindo os envelopes;
  - criar rascunho ou credencial num começo muda a situação sozinho.
- **CSS próprio:** nenhum.
- **Conferido:**
  - Apps e o começo no tema escuro;
  - Apps e o começo em espanhol, sem texto estourado.
- **Ver:** `evidencias/` tem 30 prints, sem ponteiro e sem a barra do andaime. Os desta rodada:
  - `prototipo-ux-apps-assinatura.png` e `prototipo-ux-apps-legado.png`;
  - `prototipo-m16-nem-provedor-nem-envelope.png` e `prototipo-m16-atalhos-do-comeco.png`;
  - `prototipo-m16-novo-envelope-sem-provedor.png`;
  - `prototipo-m16-rascunhos-sem-provedor.png` e `prototipo-m16-rascunho-sem-provedor-detalhe.png`;
  - `prototipo-m16-sem-envelope.png`.

  O `prototipo-m16-sem-provedor.png` saiu: o estado mudou.

## Rodada 3 · 2026-11-19

- **Pedido (literal):** "do modo como voce fez esse header quando entra num doc nao ta sem graça? hoje o dev ta usando o icone/logo do assinador. ta mais ilustrativo, nao? melhor ser como ta hoje, eu acredito. opine. o mesmo vale pra tela de configuraçao [...] a parte central que mostra os passos de configuraçao, nao poderia usar o componente de step-by-step do nuxt?? de cima pra baixo, que faz uma linha vertical, sem divider entre os passos"
- **Fronteira:** muda o logo do app em toda tela do protótipo e as etapas da página do provedor; o resto fica como na rodada 2.

### O logo do app no lugar do monograma

- **O logo é o mesmo arquivo do produto**, claro e escuro, para os 5 provedores, a OpenAI, o SendGrid, o Twilio e o Plugin do Word (`logos/`, lido por `_Logo.vue`). O monograma das rodadas 1 e 2 saiu (`_Monograma.vue`).
  - Os arquivos tiveram a margem transparente cortada e a altura reduzida para 96 px. No original, o Adobe Sign, a Certisign e o SendGrid escuro vêm com margem grande e aparecem pequenos.
  - O tema troca o arquivo por CSS (`dark:`).
- **Onde o logo aparece:**

  | Tela | Como |
  |---|---|
  | Card da loja e do começo do módulo | o logo em cima, o nome e a descrição embaixo, como no card do produto |
  | Página do provedor | o logo e o estado em cima, o nome e a descrição embaixo, como no produto |
  | Detalhe do envelope | o logo no lugar do monograma e do nome, ao lado da origem |
  | Começo do módulo com provedor conectado | o logo no atalho do provedor, sem o nome repetido |
  | Execução do nó (envelope criado) | o logo no atalho do envelope |
  | Lista de envelopes | só o nome do provedor, como na tabela do produto; o logo em cada linha pesa a tabela |

- **Repositório público:** os logos são das marcas dos provedores e o produto os serve sem login; nenhum outro arquivo do produto veio junto.

### As etapas da configuração em linha do tempo

- **`UTimeline` vertical** no lugar da lista com divisória. A linha liga uma etapa à seguinte e fica verde até a última etapa concluída; a etapa que aguarda o provedor tem o relógio, e a pendente, o número.
- **Por que não o `UStepper`:** ele mostra o conteúdo de 1 etapa por vez, como um assistente de passos. Aqui cada etapa tem conteúdo que fica à vista (a credencial, o cofre, a URL do webhook), e quem volta à página precisa ver todas.
- **CSS próprio:** nenhum; as cores do indicador e da linha vão pelo `ui` de cada item.

### Fechamento

- **Ver:** os 30 prints de `evidencias/` foram regravados com o logo; a página do provedor está em `prototipo-ux-pagina-do-provedor.png` (Certisign, 1 etapa concluída e 1 aguardando) e `prototipo-m16-primeira-credencial.png` (ClickSign, nenhuma etapa concluída).

## Requisitos · 2026-11-19

- **Pedido (literal):** "prnto. ja fez os docs de requisito no github?"
- **Aprovado em 19/11/2026**, depois da rodada 3. O status do protótipo passou para `aprovado`.
- **1 épico de 9 partes**, em `requisitos/`: `epico.md` e 1 arquivo por parte, com a RN comum (RN901 a RN908) e o padrão de qualidade só no épico.
  - As 12 partes do 1º desenho viraram 9, porque a faixa de ID 901 a 999 é do épico: a busca e o filtro entraram na loja de apps (parte 1), a trilha entrou no detalhe do envelope (parte 5), e o editor e a execução do nó viraram 1 parte (parte 8).
  - A loja de apps muda também os cards da OpenAI, do Plugin do Word, do SendGrid e do Twilio; se ela vira um épico próprio está em aberto (P902), para a redatora decidir. Sem a decisão, fica 1 épico.
- **Prints dos requisitos:** `evidencias/requisitos/`, gerados por `node ferramentas/prints-de-requisito.mjs app/pages/modulo-de-assinaturas` a partir de `requisitos/prints.json`. O requisito sem tela no protótipo (toast que some, gesto, ausência de botão) leva o motivo no lugar do print.
