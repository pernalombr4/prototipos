# Pesquisa: IA no campo HTML

Data 2026-10-08. Os prints não foram capturados nesta rodada: a pesquisa usa só fontes em texto (help center, documentação oficial e, quando a oficial não abre, guia de terceiros marcado como tal).

Demanda: abrir a IA (BENI) pelo comando "/" no campo HTML e por um botão na barra de ferramentas do campo.

## Notion (Notion AI)

- **Como abre:**
  - espaço em linha vazia abre a caixa de pedido;
  - selecionar texto mostra a opção de IA no menu flutuante da seleção;
  - "/" lista os comandos de IA; guias de terceiros citam "Continue writing", "Summarize", "Help me write" e `/AI Block`;
  - atalho Shift+Ctrl+J (Shift+Cmd+J no Mac), configurável em Preferências;
  - o Notion Agent abre também pela barra lateral ou pelo canto inferior.
- **Ações:** corrigir gramática, encurtar, alongar, mudar tom, traduzir, resumir, listar pontos-chave, transformar em tabela, rascunho de e-mail, esboço, brainstorm, sinônimo e definição de palavra. Pedido livre em qualquer ponto.
- **Resultado:** o texto aparece no próprio documento, logo abaixo ou no lugar da seleção, com o menu de decisão embaixo. O bloco de IA (`/AI Block`) guarda o pedido e regenera a saída quando a pessoa clica em Generate.
- **Depois do resultado:** aceitar, descartar ou tentar de novo. Na seleção, guias citam "Replace selection" e "Insert below". No rascunho, a pessoa continua a conversa para refinar. Polegar para cima ou para baixo dá retorno.
- **Contexto e avisos:**
  - lê a página atual; o pedido aceita @ de página, pessoa e data;
  - o Agent usa o workspace, apps conectados e a web;
  - Business e Enterprise têm cota de uso; ao passar dela, o recurso pausa até o dono liberar créditos;
  - Free e Plus têm um número limitado de respostas grátis;
  - não há aviso explícito de erro; a orientação é revisar antes de aceitar.
- **Serve para o ENSPACE:** as 3 portas (espaço, "/", seleção) e o trio aceitar, descartar, tentar de novo. O menu fica colado no texto gerado, então a pessoa decide sem sair do campo. **Não serve:** espaço em linha vazia. No campo HTML do ENSPACE o espaço é digitação comum, e o campo divide a tela com outros campos; a pessoa abriria a IA sem querer.
- **Fonte:**
  - https://www.notion.com/help/notion-ai-faqs
  - https://www.notion.com/help/guides/notion-ai-for-docs
  - https://wiki.circuitrunners.com/pt/help/notion-academy/lesson/ai-improve-writing (cópia da lição da Notion Academy)
  - https://thomasjfrank.com/notion-ai-guide/ (terceiro, para os comandos do "/")

## Twenty CRM (open source)

- **Como abre:** o editor de notas e tarefas não tem IA. O Twenty usa BlockNote sobre TipTap (`@blocknote/react` 0.51 no `package.json` do `twenty-front`) e não instala o pacote de IA do BlockNote (`@blocknote/xl-ai`). O "/" do editor só traz os blocos (título, lista, imagem e afins).
- **Ações:** fora do editor, 2 recursos:
  - um chatbot que consulta e explica registros, relações e métricas;
  - agentes de IA dentro dos Workflows, que classificam, enriquecem e preenchem campos.
- **Resultado:** o chatbot responde em conversa. O help center não diz onde a janela abre.
- **Depois do resultado:** não documentado para escrita; o chatbot não escreve nota.
- **Contexto e avisos:**
  - o chatbot entende "esta empresa" ou "esta oportunidade" a partir da página aberta e guarda o contexto entre perguntas;
  - agentes seguem os cargos (Settings, Members, Roles);
  - ações de IA gastam créditos de workflow conforme a tarefa e o modelo;
  - na nuvem, o workspace escolhe o modelo e não usa chave própria; no self-hosted, o admin liga cada provedor com a chave dele.
- **Serve para o ENSPACE:**
  - o chatbot lê o registro aberto, a mesma ideia de a BENI ler os outros campos do item;
  - o BlockNote já oferece IA no "/" e na barra de formatação (`@blocknote/xl-ai`), um caminho de referência para quem usa TipTap.
  **Não serve:** como referência de interação no editor, porque o Twenty não tem.
- **Fonte:**
  - https://docs.twenty.com/user-guide/ai/overview
  - https://docs.twenty.com/user-guide/ai/capabilities/ai-chatbot.md
  - https://docs.twenty.com/user-guide/ai/how-tos/ai-faq
  - https://raw.githubusercontent.com/twentyhq/twenty/main/packages/twenty-front/package.json
  - https://www.blocknotejs.org/docs/features/ai/getting-started (IA do BlockNote: item no "/" e botão na barra)

## ClickUp (ClickUp Brain)

- **Como abre:**
  - "/" na descrição da tarefa ou em qualquer campo de texto, e depois "Write with AI";
  - selecionar texto mostra 2 botões na barra de texto: Improve e Edit;
  - um botão "Write with AI" na área de detalhes da tarefa (guia de terceiros);
  - nos Docs, o botão Ask no canto superior direito abre o painel do Brain.
- **Ações:** escrever livre, prompts prontos, gerar standup, melhorar, editar com prompt próprio, resumir o Doc, traduzir, criar tarefa a partir do texto selecionado, gerar descrição e itens de ação a partir da tarefa.
- **Resultado:** o Improve gera a versão nova e mostra para revisão antes de aplicar. O Ask abre em painel lateral.
- **Depois do resultado:** "Replace with this answer", "Insert below", Copy, continuar no Ask AI e Back. Tentar de novo aparece nos artigos de Docs e de Chat.
- **Contexto e avisos:**
  - usa o contexto da tarefa ou do Doc aberto;
  - recurso e limite variam por plano e por papel da pessoa;
  - o ClickUp cobra a IA por membro do workspace (terceiros citam créditos mensais por usuário).
- **Serve para o ENSPACE:**
  - "Write with AI" no "/" de qualquer campo de texto da tarefa, o caso mais próximo do campo HTML dentro do item;
  - a barra da seleção com Improve de 1 clique ao lado de Edit;
  - Substituir e Inserir abaixo como escolhas separadas.
  **Não serve:** levar o resultado ao painel Ask. Dentro de um formulário de item a pessoa perde de vista o campo que está preenchendo.
- **Fonte:**
  - https://help.clickup.com/hc/en-us/articles/14800632845975-Write-with-Brain-AI (403 para leitura automática; conteúdo pelo resumo da busca)
  - https://help.clickup.com/hc/en-us/articles/25033706599191-Manage-Docs-with-Brain-AI
  - https://help.clickup.com/hc/en-us/articles/34958900405143-Use-Brain-AI-on-tasks
  - https://clickup.com/blog/how-to-use-ai-for-documentation/
  - https://www.guideflow.com/tutorial/how-to-generate-task-descriptions-with-ai-brain-in-clickup (terceiro)

## Monday (monday AI e Sidekick)

- **Como abre:**
  - nas atualizações do item: ícone "AI writing tools" na caixa de texto, ou sugestão de resposta ao clicar dentro da caixa;
  - nos workdocs: selecionar texto e clicar em Refine na barra de menu;
  - Sidekick é a porta principal de IA em 2026 e também gera texto nos docs;
  - o "/" dos workdocs aceita ações criadas por apps de terceiros (Doc Actions); o help center não lista comando de IA nativo no "/".
- **Ações:** nas atualizações, "Shorten text", "Improve text" e "Write with AI" (pedido livre), além de resumir a conversa do item. Nos workdocs, encurtar, melhorar, elaborar e mudar tom.
- **Resultado:** nas atualizações, o texto novo entra na própria caixa de texto, para revisão antes de publicar. O resumo da conversa vira um bloco de mensagem no fim da lista.
- **Depois do resultado:**
  - "Apply changes" ou "Add to update" nas atualizações;
  - adicionar abaixo ou substituir nos workdocs;
  - no resumo, Regenerate e Copy.
- **Contexto e avisos:**
  - o resumo usa a conversa do item;
  - a IA só aparece se o admin ligar os recursos de IA;
  - disponível nos planos Standard, Pro e Enterprise.
- **Serve para o ENSPACE:**
  - o ícone de IA dentro do próprio campo de texto do item, com 2 ações de 1 clique (encurtar, melhorar) e 1 pedido livre: menu curto que cabe num campo de formulário;
  - o resultado volta para o campo e a pessoa revisa antes de salvar.
  **Não serve:** depender de app de terceiros para ter IA no "/". O ENSPACE precisa do comando nativo.
- **Fonte:**
  - https://support.monday.com/hc/en-us/articles/115005900249 (The Updates Section)
  - https://support.monday.com/hc/en-us/articles/24113404490258-AI-workdocs (403 para leitura automática; conteúdo pelo resumo da busca)
  - https://developer.monday.com/apps/docs/ai-assistant
  - https://community.monday.com/t/ai-2026-what-s-new-and-what-s-coming/123164

## Pipefy (Pipefy AI)

- **Como abre:** o help center não documenta IA de escrita em campo de texto longo, comentário ou e-mail do card. A IA do Pipefy fica no desenho e na automação do processo:
  - AI Automation: uma decisão e uma ação, como preencher um campo a partir de outro;
  - AI Agents: tarefas de vários passos, com botão no topo do pipe;
  - AI Assistant: chat sobre processos e políticas;
  - criar o pipe a partir de uma descrição.
- **Ações:** preencher campo com IA (modo `fill_with_ai` do agente), mover, criar e atualizar card, enviar e-mail por modelo, ler documento, buscar em outros pipes e na web.
- **Resultado:** o agente grava direto no campo do card. Os agentes registram o raciocínio em log ("Glass Box"); a AI Automation não registra.
- **Depois do resultado:** não há revisão inline: o valor já está gravado.
- **Contexto e avisos:**
  - até 30 campos do card como contexto e instrução de até 10.000 caracteres;
  - PDF lido até 30 páginas;
  - créditos de IA: cada plano traz 1.000 créditos iniciais e cada execução do agente gasta 2 ou 3 conforme o modelo;
  - execução que não atende a condição não gasta crédito;
  - quem configura o agente é o admin do pipe.
- **Serve para o ENSPACE:**
  - escolher os campos do registro que entram como contexto, com limite claro (30 campos);
  - mostrar o saldo de créditos num painel do admin.
  **Não serve:** como referência de escrita assistida, porque o Pipefy não oferece. O ENSPACE sai na frente no nicho de BPM low-code brasileiro se a BENI ajudar quem escreve no campo.
- **Fonte:**
  - https://help.pipefy.com/en/articles/14537321-general-guide-pipefy-ai-ecosystem
  - https://help.pipefy.com/en/articles/12001177-new-pipefy-ai-models-and-pricing
  - https://help.pipefy.com/en/articles/14602433-consumption-guide-api-ai-credits-and-automations
  - https://developers.pipefy.com/reference/ai-behavior-actions
  - https://www.pipefy.com/glossary/long-text-field

## Google Docs (Gemini)

- **Como abre:**
  - botão "Help me write" à esquerda da linha onde está o cursor (Create, depois Refine, depois Insert);
  - botão Gemini que abre uma barra de pedido no rodapé, que pode virar painel lateral;
  - selecionar texto mostra uma barra flutuante com Refine;
  - o help center não cita "/" nem atalho.
- **Ações:** Rephrase, Shorten, Elaborate, More formal, More casual, Bulletize, Summarize, pedido livre, lista para tabela, mudar formatação, gerar e-mail a partir do documento.
- **Resultado:** a edição pela barra do rodapé aparece no documento como sugestão marcada, igual ao modo de sugestão. O rascunho do "Help me write" aparece numa caixa antes de entrar no texto.
- **Depois do resultado:**
  - sugestão a sugestão: aceitar uma, "Accept all" ou "Reject all";
  - no rascunho: Refine, Insert e voto de boa ou má sugestão;
  - um guia de terceiros cita Retry.
- **Contexto e avisos:**
  - lê o documento inteiro, sem exigir seleção;
  - aceita arquivos do Drive, Gmail, Chat e web como fonte (botão Sources ou @ no pedido);
  - guarda histórico de conversa;
  - pede plano Google Workspace ou Google AI elegível.
- **Serve para o ENSPACE:**
  - a mudança da IA aparece como sugestão marcada, com aceitar e rejeitar por trecho: a pessoa vê o que mudou antes de salvar;
  - a lista curta de Refine (7 ações) cabe num submenu.
  **Não serve:** barra de pedido no rodapé da janela. No ENSPACE o campo HTML é um de vários campos do item, e o rodapé fica longe dele.
- **Fonte:**
  - https://support.google.com/docs/answer/13447609
  - https://support.google.com/docs/answer/13951448
  - https://www.computerworld.com/article/1627842/how-to-use-help-me-write-ai-writing-tool-google-docs-gmail.html (terceiro)

## Confluence (Rovo, antigo Atlassian Intelligence)

- **Como abre:**
  - "/ai" ou "/rovo" no editor, e depois "Ask Rovo";
  - botão Rovo na barra de formatação (rótulo "Edit with Rovo" em parte da documentação);
  - selecionar texto mostra "Ask Rovo" ou "Write" no menu flutuante;
  - espaço numa página ou live doc abre o pedido;
  - "Ask Rovo" no cabeçalho do conteúdo e ícone de chat no canto inferior direito.
- **Ações:** melhorar escrita, corrigir ortografia e gramática, simplificar, mudar tom (casual, educativo, empático, neutro, profissional), encurtar, alongar, traduzir, definir, resumir, transformar em passos, gerar tabela com o conteúdo da página, pedido livre. O botão Review aponta trecho impreciso ou desatualizado.
- **Resultado:** a edição chega em streaming direto no editor e substitui a seleção enquanto é escrita. Conteúdo novo pelo "Create with Rovo" mostra prévia editável antes de entrar.
- **Depois do resultado:** desfazer (Ctrl+Z ou botão na barra de ação), refazer, "View changes" (comparação de versão), editar à mão ou seguir no chat do Rovo. O help center não cita "tentar de novo" nem "descartar".
- **Contexto e avisos:**
  - o pedido aceita link e imagem;
  - o Review cruza Confluence, Jira e Loom;
  - avisa que qualidade e precisão variam e que a pessoa deve conferir;
  - disponível nos planos Standard, Premium e Enterprise, com IA ligada pelo admin da organização;
  - "Edit with Rovo" gasta créditos Rovo; sem IA em organização Government.
- **Serve para o ENSPACE:** é o par mais direto da demanda.
  - "/ai" no editor e botão de IA na barra de formatação, as 2 portas pedidas;
  - o desfazer comum (Ctrl+Z) volta a edição inteira da IA num passo.
  **Não serve:** substituir a seleção ao vivo sem prévia. Num campo de formulário que se salva junto com o item, a pessoa precisa ver e aceitar antes de o texto original sumir.
- **Fonte:**
  - https://support.atlassian.com/confluence-cloud/docs/use-atlassian-intelligence-to-help-write-or-edit-content/
  - https://support.atlassian.com/confluence-cloud/docs/create-new-content-items-with-rovo
  - https://www.atlassian.com/software/confluence/resources/guides/confluence-essentials/formatting-editing
  - https://learning.atlassian.com/learning/lesson/enhance-your-content-using-rovo

## Coda (Coda AI)

- **Como abre:**
  - Ctrl+Espaço em linha nova;
  - "/" em linha nova e depois "AI block";
  - selecionar texto e clicar em AI na barra de formatação;
  - coluna de IA em tabela (botão + ao lado da tabela, depois AI);
  - chat de IA à parte.
- **Ações:** escrever, montar tabela, editar seleção (elaborar, encurtar), resumir, tirar itens de ação, achar feedback recorrente. Ajuste fino de tamanho, tom e tipo.
- **Resultado:**
  - na página, o texto entra no lugar com a barra de pedido embaixo;
  - o AI block tem 2 áreas: a saída em cima e o pedido embaixo;
  - a coluna de IA mostra prévia em tempo real.
- **Depois do resultado:**
  - Keep aceita, e depois disso o pedido não se reabre;
  - tentar de novo pelo ícone de atualizar no AI block;
  - refinar com novo pedido;
  - no chat, Insert leva a resposta à página;
  - descartar não é claro (texto de terceiro de 2023 diz que só há Keep e Ctrl+Z).
- **Contexto e avisos:**
  - o AI block lê outra parte do doc, inclusive tabela de outra página;
  - a coluna de IA recalcula quando a célula de origem muda;
  - o chat escolhe o contexto: nenhum, página atual ou doc inteiro;
  - avisa que a IA erra e pede conferência;
  - o Coda hoje pertence à Superhuman; plano e crédito não aparecem na fonte aberta.
- **Serve para o ENSPACE:**
  - a escolha explícita de contexto (nenhum, este campo, este item);
  - o bloco que guarda o pedido e se recalcula, ideia para campo HTML preenchido pela BENI a partir de outros campos.
  **Não serve:** Keep sem descartar. A pessoa precisa de saída clara para recusar.
- **Fonte:**
  - https://zapier.com/blog/how-to-use-coda-ai.md (terceiro)
  - https://help.superhuman.com/hc/en-us/articles/46210156957197-Coda-AI-features (403 para leitura automática)
  - https://simonesmerilli.com/writing/coda-ai (terceiro)

## Craft (Craft Assistant)

- **Como abre:** painel do Assistant, com seletor de modo no rodapé. A documentação não cita "/" para IA nem botão na seleção. O "/" do Craft é para blocos e age sobre os blocos selecionados.
- **Ações:** responder pergunta, resumir, navegar no espaço. No modo Execute, acrescentar, substituir, formatar, reorganizar, mover e apagar conteúdo, criar página e pasta.
- **Resultado:** 2 modos:
  - Explore propõe a mudança e espera aprovação;
  - Execute aplica na hora, e a pessoa vê a edição aparecer.
- **Depois do resultado:** Ctrl+Z (Cmd+Z) desfaz a resposta inteira do Assistant num passo; repetir volta respostas anteriores. Também dá para pedir ao Assistant que desfaça ou ajuste.
- **Contexto e avisos:**
  - lê o documento antes de propor;
  - edição só no macOS e iOS e só com os modelos Fast e Max;
  - todo plano tem cota de IA com recarga; modelo local no aparelho não gasta cota;
  - o admin desliga o Assistant por espaço.
- **Serve para o ENSPACE:**
  - o desfazer que volta toda a ação da IA num passo;
  - a separação entre propor e aplicar, que vira a regra "a BENI propõe, a pessoa aplica".
  **Não serve:** painel lateral como única porta. A demanda pede IA no ponto em que a pessoa escreve.
- **Fonte:**
  - https://support.craft.do/en/ai-assistant.md
  - https://support.craft.do/en/ai-assistant/editing.md
  - https://support.craft.do/en/write-and-edit/formatting/slash-menu

## O padrão que todos seguem

- **3 portas para o mesmo menu:** "/" (ou espaço) em linha vazia para gerar; menu flutuante da seleção para editar; botão fixo na barra ou no cabeçalho. Confluence e Notion têm as 3; ClickUp tem "/" e seleção.
- **Pedido livre no topo, ações prontas embaixo.** O campo de texto do pedido vem primeiro; a lista de ações é atalho.
- **As mesmas 8 ações de edição:** melhorar, corrigir ortografia e gramática, encurtar, alongar, mudar tom, simplificar, traduzir, resumir. Gerar tabela ou lista aparece em 4 dos 8.
- **Ação depende de seleção.** Sem seleção: escrever, continuar, gerar a partir do documento. Com seleção: editar, resumir, traduzir.
- **O resultado fica perto do texto.** Inline ou em caixa logo abaixo. Painel lateral só para conversa longa (ClickUp Ask, Craft, Notion Agent).
- **Decisão em 3 ou 4 botões:** aceitar ou substituir, inserir abaixo, descartar, tentar de novo. O pedido de ajuste ("deixe mais formal") fica no mesmo lugar.
- **O desfazer comum funciona** e volta a ação inteira da IA num passo (Confluence, Craft, Coda).
- **Contexto padrão é o documento aberto.** Notion, Google e Coda deixam acrescentar outras fontes (@ de página, arquivo do Drive, outra tabela).
- **IA atrás de plano e de chave do admin,** com cota ou crédito por pessoa ou por workspace.

## O que nenhum deles faz

Oportunidades para o ENSPACE:

- **Usar os outros campos do item como contexto do editor.** O chatbot do Twenty e o agente do Pipefy leem o registro, mas fora do editor. Nenhum editor de texto rico lê os campos vizinhos (cliente, valor, status, data) para escrever o texto do campo. A BENI pode escrever "a descrição deste chamado" com o que já está preenchido no formulário.
- **Mostrar que fontes a IA leu.** Nenhum mostra, junto do resultado, a lista de campos e trechos usados. Um rodapé "Usei: Cliente, Prioridade, Histórico" no resultado deixa a pessoa conferir antes de aceitar.
- **Comandos prontos definidos pelo admin do workspace.** Os comandos são fixos do produto, salvo o Monday por app de terceiro. O ENSPACE pode deixar o admin da categoria criar comandos como "/parecer técnico" ou "/resposta ao cliente", com o pedido e os campos de contexto já escolhidos.
- **Respeitar a permissão de campo.** Nenhum diz o que acontece quando o contexto inclui campo que a pessoa não pode ver. A BENI só lê os campos que quem pede pode ver no item.
- **Aviso honesto quando a IA não está no plano.** Nenhuma fonte descreve a tela de quem não tem a IA liberada; o recurso some ou vira propaganda. O ENSPACE pode mostrar o botão desativado com o motivo ("A BENI não está ativa neste workspace. Fale com o admin") em vez de esconder.
- **Sugestão marcada dentro de um campo de formulário.** Google mostra a mudança como sugestão no documento inteiro; ninguém faz isso num campo de formulário que se salva junto com o item. A BENI pode marcar o trecho novo e só gravar no item quando a pessoa aceitar.

## Tabela comparativa

| Produto | "/" | Botão na barra | Botão na seleção | Atalho | Onde mostra o resultado | Aceitar / descartar / tentar de novo |
|---|---|---|---|---|---|---|
| Notion | Sim ("/" com comandos de IA e `/AI Block`) | Não documentado | Sim | Shift+Ctrl+J; espaço em linha vazia | Inline, com menu colado | Sim / Sim / Sim |
| Twenty | Não (só blocos) | Não | Não | Não | Chatbot em conversa, fora do editor | Não se aplica |
| ClickUp | Sim ("Write with AI") | Botão "Write with AI" na tarefa; Ask nos Docs | Sim (Improve, Edit) | Não documentado | Caixa de revisão; painel lateral no Ask | Substituir, inserir abaixo, copiar / Back / Sim |
| Monday | Só por app de terceiro | Sim (ícone na caixa de atualização; Refine nos docs) | Sim (Refine nos workdocs) | Não documentado | Dentro da própria caixa de texto | Aplicar ou adicionar / não citado / Regenerate no resumo |
| Pipefy | Não | Não | Não | Não | Grava direto no campo pelo agente | Não há revisão |
| Google Docs | Não | Sim (Help me write; Gemini) | Sim (Refine) | Não documentado | Sugestão marcada no texto; caixa no Help me write; rodapé ou painel | Aceitar um ou todos / Rejeitar todos / Refine (Retry por terceiro) |
| Confluence | Sim ("/ai", "/rovo") | Sim (Rovo) | Sim (Ask Rovo, Write) | Espaço em página | Inline em streaming, substitui a seleção | Sem botão; Ctrl+Z desfaz / chat para ajustar |
| Coda | Sim ("/" e AI block) | Sim (AI na barra da seleção) | Sim | Ctrl+Espaço | Inline com barra de pedido; AI block | Keep / Ctrl+Z / Sim (atualizar) |
| Craft | Não | Painel do Assistant | Não documentado | Não documentado | Painel; edição ao vivo no modo Execute | Aprovar no Explore / Ctrl+Z desfaz tudo / pedir ajuste |
