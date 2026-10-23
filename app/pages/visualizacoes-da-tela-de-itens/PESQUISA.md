# Pesquisa: barra de visualizações e construtor

Síntese de 23/10/2026 (skill `product-management:synthesize-research`) sobre 2 fontes:

- **Mercado:** pesquisa aprofundada (skill `deep-research`) em 16 produtos e 9 design systems, mais evidência de usabilidade da NN/g, do Baymard, da WCAG 2.2 e do WAI-ARIA APG. Relatório completo, com a URL de cada afirmação: [`pesquisa/reports/Barra de visualizações salvas.md`](pesquisa/reports/Barra%20de%20visualizações%20salvas.md). Notas por frente em `pesquisa/research_notes/`.
- **Produto:** a tela nova de itens na branch do PR 2936, percorrida pela tela no workspace `teste-ux` (detalhe no `BRIEFING.md`).

**Pergunta:** como a barra de visualizações e o construtor devem funcionar para trocar, criar, ajustar e organizar visualizações sem sair da tabela, inclusive com a tela apertada?

**Limite:** nenhum estudo publicado mede barras de visualizações salvas. A força vem da convenção (o que os produtos fazem igual) e de estudos vizinhos (navegação escondida, modal, arrastar). Não houve entrevista nem dado de uso do ENSPACE.

## Achados, por prioridade

### 1. A ativa nunca sai da barra; o excesso vai para "Mais (N)" com busca

- **Evidência:**
  - o Polaris publica a regra em código: a aba selecionada fica sempre visível e a largura do botão de transbordo fica reservada;
  - Notion ("N more..."), ClickUp ("more..." com contador, busca e reordenar), Fluent e Ant usam menu de transbordo;
  - a NN/g mede o custo de esconder: no desktop, a navegação escondida foi usada em 27% dos casos, contra 48% da visível (179 pessoas, 2016);
  - a NN/g também mostra que as pessoas ignoram setas de rolagem horizontal.
- **No ENSPACE hoje:** rolagem horizontal escondida, com seta ">" na ponta; o "+ Visualizar" sai da tela.
- **Frequência:** 6 fontes de produto e design system; 2 estudos vizinhos.
- **Impacto:** alto. Quem tem muitas visualizações deixa de ver as que estão fora da tela.
- **Confiança:** alta na convenção; média na evidência (o estudo mediu navegação global, não esta barra).

### 2. Criar a partir do que está na tela, em 1 passo curto

- **Evidência:**
  - Twenty tem o modo "criar a partir da atual", que copia filtros e ordenação, num formulário dentro do próprio menu (ícone, nome, tipo, Enter);
  - Attio, Linear (Alt+V), HubSpot ("clone") e Polaris ("Save as") salvam o estado atual como nova;
  - a NN/g recomenda reusar escolhas anteriores como padrão e reservar assistente para tarefa rara.
- **No ENSPACE hoje:** modal com 5 blocos e 2 obrigatórios (nome e ícone) antes de ver qualquer item; a visualização criada não abre.
- **Frequência:** 6 produtos.
- **Impacto:** alto. Criar é tarefa frequente de quem usa a tabela todo dia.
- **Confiança:** alta.

### 3. Mudança não salva aparece no nome; Salvar, Salvar como nova e Descartar ficam à vista

- **Evidência:**
  - GitHub Projects põe um ponto ao lado do nome da aba; SAP Fiori põe um asterisco;
  - Twenty, ClickUp e Attio mostram o par salvar e descartar, com "salvar como nova" numa seta;
  - Polaris e SAP desligam "Save" na visualização que não aceita alteração e mantêm "Save as";
  - no fórum do Asana, a mudança perdida em silêncio aparece como "o produto reverte o que fiz".
- **No ENSPACE hoje:** não existe estado de "mexido". Mudar a visualização só acontece pelo modal.
- **Frequência:** 7 produtos e design systems.
- **Impacto:** alto. Sem o sinal, a pessoa não sabe se o que vê é a visualização salva.
- **Confiança:** alta.

### 4. O construtor fica fora de modal, com a tabela à vista

- **Evidência:**
  - ClickUp abre o "Customize" numa barra lateral direita; HubSpot, num painel; Notion, num menu "View options";
  - a NN/g desaconselha modal quando a decisão depende de informação que ele cobre (aqui, a própria tabela) e recomenda prévia em tempo real em aplicação complexa.
- **No ENSPACE hoje:** o modal cobre a tabela, abre outro modal por filtro e promete um preview que não aparece.
- **Frequência:** 3 produtos; 2 diretrizes.
- **Impacto:** alto para quem configura.
- **Confiança:** média. É inferência: nenhum estudo comparou modal e painel para configurar tabela.

### 5. Arrastar reordena, e precisa de um 2º caminho de 1 clique

- **Evidência:**
  - Notion, ClickUp, monday, Twenty, HubSpot, GitHub e Airtable reordenam arrastando;
  - a WCAG 2.2, critério 2.5.7 (AA), exige alternativa com 1 ponteiro, sem arrastar; o teclado sozinho não cumpre;
  - no ClickUp, a falta de reordenar dentro do "n more" foi tratada como bug.
- **No ENSPACE hoje:** a barra não reordena. As folders, na mesma branch, já arrastam.
- **Frequência:** 7 produtos; 1 norma.
- **Impacto:** médio. Organiza a barra de quem tem muitas visualizações.
- **Confiança:** alta.

### 6. A tela fala o nome da coisa, não o nome do sistema

- **Evidência:** a heurística 2 da NN/g ("speak the users' language") e os construtores do mercado mostram campos pelo rótulo.
- **No ENSPACE hoje:** "isOwner", "inGroups", "inputText", "EnlCalendar", "reference" e "(copy)" aparecem para quem configura.
- **Frequência:** 6 ocorrências na tela de hoje.
- **Impacto:** médio. Bloqueia quem não é técnico.
- **Confiança:** alta.

### 7. A visualização do sistema fica protegida, e a padrão é explícita

- **Evidência:**
  - Twenty mantém a "All" com cadeado, sem editar nem excluir;
  - SAP tem a "Standard" não excluível; Airtable exige 1 visualização em grade colaborativa;
  - ClickUp e Asana têm "Set as default"; o HubSpot define a padrão arrastando para a 1ª posição, efeito que não aparece na tela.
- **No ENSPACE hoje:** não há visualização padrão escolhível; "Itens" não tem menu.
- **Frequência:** 6 produtos.
- **Impacto:** médio.
- **Confiança:** alta.

## Quem usa

| Grupo | O que faz | O que precisa |
|---|---|---|
| Quem configura (gestor, dono da categoria) | Cria e ajusta visualizações para o time | Criar rápido, ajustar vendo a tabela, decidir quem vê, proteger a padrão |
| Quem consome (membro, inclusive só leitura) | Troca de visualização, filtra no dia a dia, organiza a própria barra | Achar a visualização com a tela apertada, saber se o que vê está salvo, salvar a própria versão sem estragar a do time |

Segmentação tirada das permissões do produto e dos modelos de escopo do mercado; não houve entrevista.

## As referências, uma a uma

| Produto | Como resolve | Serve ao ENSPACE | Não serve |
|---|---|---|---|
| Notion | Abas; "N more..."; "+" com tipo e nome; "View settings"; "Save for everyone" e "Reset" | Contador no transbordo; salvar para todos explícito | Ícone ou texto por pessoa (complexidade sem pedido) |
| ClickUp | Views Bar; "more..." com busca, fixar e reordenar; Customize na lateral; "Save view" com "Save as new" e "Revert" | Fixadas primeiro; painel lateral; seta com "Salvar como nova" | Menu de 13 grupos; aviso de "não salvo" a cada clique, alvo de reclamação |
| monday | Abas ou dropdown, conforme o cabeçalho; ordem por pessoa; fixadas só entre si | Ordem pessoal | 2 formas na mesma tela |
| Pipefy | 3 visualizações fixas num dropdown; não salva visualização | Nada além de abrir a última usada | Sem visualização nomeada |
| Twenty | Dropdown único; nome com até 130px e tooltip; criar no próprio menu, a partir da atual; "Update view" e "Create view"; "All" com cadeado | Criar a partir da atual; proteção da visualização do sistema; "Salvar como nova" na padrão | Esconder todas num dropdown (a demanda pede barra) |
| Airtable | Barra lateral com busca e Ctrl+Shift+K; Collaborative, Personal e Locked | Busca no transbordo; escopo escolhido ao criar | Barra lateral tira largura da tabela |
| Linear | Página de visualizações; Alt+V salva o filtro como visualização | Atalho de salvar como nova | Barra fora da lista |
| Attio | Dropdown; "Save for everyone", "Save as new view", "Discard changes" | O trio de ações | Dropdown único |
| HubSpot | Até 5 abas abertas; catálogo atrás do "+" com busca | Separar barra de catálogo | Fechar aba sozinha ao abrir a 6ª |
| GitHub Projects | Abas; ponto no nome quando mexida; arrastar grava sozinho | O ponto de "não salva" | Salvar escondido em "View options" |
| Polaris | "More views" com a ativa sempre visível; "Save" ou "Save as" | A regra de transbordo e a de salvar | Sem reordenar |
| SAP Fiori | Asterisco; Save, Save As, Manage Views; "Standard" protegida | Asterisco como sinal; padrão protegida | Diálogo de gerenciar separado |

Asana, Jira, Baserow, NocoDB, Smartsheet, Salesforce, Carbon, Material, Fluent, Ant, Primer e Atlassian estão no relatório.

**Visto, não copiado:** nenhuma marca, cor, ícone ou texto de outro produto entrou no protótipo. Atravessa só o padrão de interação.

## O padrão que todos seguem

- A visualização guarda filtro, ordenação, colunas e tipo de exibição.
- A ativa fica visível; o excesso vai para um menu com busca.
- Criar é curto; o detalhe vem depois.
- Filtro mexido não grava sozinho: aparece o par salvar e descartar.
- Arrastar reordena.
- A visualização base do sistema não se exclui.

Divergir disso custa aprendizado de quem já usa outras ferramentas. O protótipo não diverge.

## O que nenhum deles faz

- **Resumo legível no hover:** nenhum mostra "Status é Aprovado · ordenado por Vencimento" ao passar o mouse na aba.
- **Contagem por visualização:** só o Twenty mostra, e só da atual. Nenhum mostra no transbordo.
- **Marca de "não salva" nas visualizações não ativas:** o GitHub marca a aba mexida, sem dizer se vale para as outras.
- **Mover pelo menu:** nenhum documenta "Mover para a esquerda/direita", o caminho de 1 clique que a WCAG 2.2 pede.

O protótipo faz os 4.

## Recomendações, ligadas aos achados

| # | O que fazer | Achado |
|---|---|---|
| 1 | Barra com "+N" que abre lista com busca, contagem e o menu de cada visualização; a ativa sempre visível; o "+" preso na ponta | 1 |
| 2 | Nome cortado pela largura, com tooltip de nome inteiro, resumo e contagem | 1 |
| 3 | "+" abre um popover com nome, Exibir como e "Começar com os filtros e colunas atuais" ligado; a criada abre | 2 |
| 4 | Ponto na pílula mexida; linha de filtros com Descartar e Salvar, com "Salvar como nova" na seta; na Itens e para quem só lê, só "Salvar como nova" | 3, 7 |
| 5 | Painel "Configurar visualização" à direita, com a tabela mudando ao vivo; filtro na linha, sem 2º modal | 4 |
| 6 | Arrastar como nas folders, mais "Mover para a esquerda/direita" no menu, Ctrl + Shift + seta e anúncio ao leitor de tela | 5 |
| 7 | Rótulos legíveis: "Só itens meus", "Só itens dos meus grupos", ícone do tipo de campo, "(cópia)" | 6 |
| 8 | Itens com Excluir desligado e explicado; "Abrir primeiro para todos" no menu | 7 |

## Perguntas em aberto

- **Ordem da barra:** pessoal (monday) ou de todos (Twenty)? O protótipo assume pessoal, como o "Só para mim" das folders.
- **Quem salva por cima de uma visualização compartilhada:** qualquer pessoa com acesso (Attio), o criador (HubSpot) ou o admin (Jira)? O protótipo deixa salvar quem pode editar.
- **Visualização padrão:** por pessoa (Salesforce, SAP) ou do workspace (Asana, Jira)? O protótipo assume do workspace ("Abrir primeiro para todos").
- **Volume real:** quantas visualizações uma categoria tem nos clientes? O protótipo testa 1, 4 e 18.
- **"isOwner":** é dono, criador ou responsável? O protótipo escreve "itens em que você é o dono"; falta conferir no produto.
- **Mudança não salva ao recarregar:** some (Attio) ou fica? Não confirmado no mercado; o protótipo zera, como todo protótipo.

**Para responder:** dado de uso (quantas visualizações por categoria, quantas trocas por sessão) e 5 testes de tarefa com quem configura e quem só consome.
