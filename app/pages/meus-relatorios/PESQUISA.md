# Pesquisa: onde fica o arquivo exportado

Pesquisa feita em 14/10/2026, na documentação oficial e na central de ajuda de cada produto.

**Sem print de referência nesta rodada.** As fontes são páginas de ajuda, e 2 delas (ClickUp e monday)
bloquearam a leitura com erro 403; para essas, o texto vem do resultado de busca e de um guia de terceiros
(breeze.pm) que cita a ajuda oficial. Fica registrado no `DECISOES.md`.

## Resumo em 4 linhas

- **Só o HubSpot tem uma central de exportações completa**: tabela, status, cancelar, baixar e histórico de
  quem baixou.
- Os outros baixam o arquivo na hora (exportação pequena) ou mandam e-mail com link (exportação grande).
- **Onde existe, a tela mora em Configurações, ao lado de Importar.** Nunca no menu principal.
- O mercado chama a tela de **Exportações** ("Exports", "Import & Export").

## As 5 obrigatórias

### Notion

1. Página ou base, menu `•••`, `Export`.
2. Exportação pequena baixa na hora. Exportação grande (muitas subpáginas ou PDF com subpáginas) manda
   e-mail com link.
3. Workspace inteiro: `Settings`, `General`, `Export all workspace content`. Leva até 30 h. Quem desligou o
   e-mail recebe o link na caixa de entrada do app.
4. Link vale 7 dias. Sem central de exportações.

Fonte: notion.com/help/export-your-content e notion.com/help/back-up-your-data

- **Serve:** o aviso de pronto dentro do app (a caixa de entrada) como alternativa ao e-mail.
- **Não serve:** sem lista, o arquivo perdido no e-mail não se recupera.

### Twenty CRM (código aberto)

1. `⋮` no topo da tabela, `Export view`, ou `Export` na barra de seleção.
2. O navegador monta o CSV na hora (`useRecordIndexExportRecords.ts`, com `json2csv`).
3. **O próprio item do menu mostra o andamento:** `Export (N%)`.
4. O código atual tem um hook novo, `useRecordIndexAsyncExportRecords.ts`, com `onProgress` e `cancel`:
   a exportação assíncrona está chegando.
5. Limite de 20.000 registros; só colunas visíveis e registros filtrados; exige a permissão "Export CSV".

Fonte: docs.twenty.com/user-guide/data-migration/how-tos/export-your-data e
github.com/twentyhq/twenty, `packages/twenty-front/src/modules/object-record/record-index/export/hooks`

- **Serve:** o andamento no próprio controle que a pessoa clicou. No protótipo, o andamento mora no aviso e
  no item do menu.
- **Não serve:** sem central, nada se recupera depois.

### ClickUp

1. Vista: `Customize`, `Export`, escolha de colunas (visíveis, só nomes ou todas), CSV ou Excel,
   `Download`.
2. Workspace: `Settings`, `Imports / Exports`, `Export Items`, `Start Export`. Ao terminar, aparece
   `Download Export` e chega e-mail.
3. Link por e-mail expira em 1 h (segundo o guia de terceiros). Planos Free e Unlimited têm 5 exportações
   de vista.

Fonte: help.clickup.com, artigos 6310174308631 e 6310551109527 (403); breeze.pm/articles/export-from-clickup

- **Serve:** a escolha de colunas no momento de exportar.
- **Não serve:** a página `Imports / Exports` fica em Configurações, longe de quem exporta.

### monday.com

1. Quadro: `•••`, `More actions`, `Export board to Excel`. Baixa na hora, com opção de mandar cópia por
   e-mail.
2. Conta inteira (só admin): `Administration`, `General`, `Account`, `Export account data`. Gera um .zip e
   manda link em algumas horas.
3. Até 10.000 itens, respeitando o filtro ativo. Sem central.

Fonte: support.monday.com, artigos 26989749858578 e 360002543719 (403)

- **Serve:** a exportação respeita o filtro da tela, como no ENSPACE.
- **Não serve:** sem histórico.

### Pipefy

1. No relatório, ícone Export: baixa a planilha ou manda por e-mail.
2. Na API, `exportPipeReport` cria o pedido e `pipeReportExport` devolve `state` e `fileURL`. É o mesmo
   modelo do ENSPACE: pedido assíncrono com status e arquivo.
3. Até 30.000 linhas; acima disso, corta. Expiração não encontrada.

Fonte: help.pipefy.com/en/articles/619297-create-pipe-reports e developers.pipefy.com/reference/pipe-reports

- **Serve:** confirma que o pedido com status e URL é o modelo comum.
- **Não serve:** a tela não lista os pedidos; o status só existe na API.

## As extras

### HubSpot (a referência mais completa)

1. Exporta a vista ou o objeto e recebe e-mail com link. Exportação grande leva horas e vira .zip.
2. Central: `Settings`, `Data Management`, `Import & Export`, lista de exportações.
   - Colunas: **Name** (arquivo), **Source**, **Records**, **User**, **Date**.
   - Status: "Processing" e "Canceled".
   - Ações: cancelar o que está processando, baixar pelo nome, ver quem baixou (IP e data).
   - O Super Admin vê tudo; cada pessoa vê só as próprias exportações.
3. Arquivo disponível por 30 dias; o registro fica 3 anos. Até 300 exportações em 24 h e 3 ao mesmo tempo;
   as demais entram na fila.

Fonte: knowledge.hubspot.com/import-and-export/export-records e
knowledge.hubspot.com/import-and-export/view-a-log-of-your-users-exports-in-your-account

- **Serve:** as colunas Origem e Registros, a fila e o histórico de download. Entram no protótipo.
- **Não serve:** a tela em Configurações. Quem exporta não é quem configura.

### Salesforce

1. Relatório: `Export`, `Formatted Report` (.xlsx) ou `Details Only`. Baixa na hora.
2. Organização inteira: `Setup`, `Data Export`. Manda e-mail com link para a página de download.
3. Link vale 48 h (fonte de terceiros; a doc oficial não abriu).

- **Serve:** pouco. **Não serve:** a página de exportação é de administrador.

### Attio

1. `Import / Export`, `Export view as CSV` ou `as Excel`. Baixa na hora.
2. Backup do workspace em `Workspace settings`, com andamento até 100% e ícone de download.

Fonte: attio.com/help/reference/imports-exports

- **Serve:** o andamento em porcentagem. Entrou no status "Gerando 64%".

### Linear

1. Vista: `Export issues as CSV…`, download direto (membro até 250 issues, admin até 2.000).
2. Workspace: `Settings`, `Administration`, `Import Export`, `Export data`. Manda e-mail com link de 12 h.
3. Sem central; a exportação fica no log de auditoria.

Fonte: linear.app/docs/exporting-data

### Jira, Asana, Zendesk, Google Takeout, Metabase e Airtable

- **Jira:** CSV assíncrono até 10.000 itens, com barra de progresso no canto inferior esquerdo. Sem central.
- **Asana:** projeto grande abre aba com "arquivo sendo preparado" e manda e-mail.
- **Zendesk:** `Account`, `Tools`, `Reports`, aba `Export`. Só guarda o link mais recente de cada tipo; nome
  do arquivo `export_AAAA_MM_DD_id`.
- **Google Takeout:** e-mail com "Download archive"; arquivo expira em cerca de 7 dias e baixa até 5 vezes.
- **Metabase e Airtable:** download direto. Sem central.

## O padrão que todos seguem

| Ponto | Convenção |
|---|---|
| Disparo | Na própria tela; exporta o que está visível e filtrado |
| Exportação pequena | Download direto, às vezes com andamento no botão (Twenty, Jira) |
| Exportação grande | E-mail com link; o aviso na tela só diz "estamos preparando" |
| Onde mora a tela | Em Configurações, ao lado de Importar. Nunca no menu principal |
| Colunas (HubSpot) | Nome, Origem, Registros, Usuário, Data, Status |
| Expiração | De 1 h (ClickUp) a 30 dias (HubSpot); 7 dias é o mais comum |
| Quem vê | Cada pessoa vê as suas; o admin vê todas |

**Onde o protótipo diverge, e por quê:** a tela vai para o menu principal, contra o padrão. No ENSPACE o
arquivo **sempre** passa pela tela (nenhuma exportação baixa direto), e quem exporta é o membro, não o
administrador. Em Configurações, a tela continuaria escondida para quem mais usa.

## O que nenhum deles faz

1. **Aviso de pronto dentro do app com botão Baixar.** Só o Notion usa a caixa de entrada, e só quando o
   e-mail está desligado. Entrou: o aviso termina com "Baixar", e o sino guarda o pronto.
2. **Filtros aplicados em frase.** Ninguém mostra; o ENSPACE já guarda filtro e ordenação. Entrou na coluna
   Filtros e no painel.
3. **Extrair de novo com os mesmos filtros.** Ninguém oferece. Entrou na linha e no painel.
4. **Formato e tamanho como colunas.** Entrou.
5. **Painel de detalhe do pedido.** Ninguém tem. Entrou.
6. **Voltar para a tela de origem com o filtro aplicado.** Entrou como "Abrir na origem".
7. **Expiração no próprio item.** Não entrou: o develop não mostra expiração e o arquivo baixou de novo
   sem limite visível. Fica como pergunta no `DECISOES.md`.

## O nome da tela

| Opção | A favor | Contra |
|---|---|---|
| **Exportações** (EN Exports, ES Exportaciones) | É o nome do mercado; não se confunde com o construtor de relatórios da categoria (`Configurações › Estrutura › Categoria › Relatórios`), que também se chama "relatório" e aparece na coluna Modelo | O botão de origem diz "Extrair Relatório" |
| **Meus relatórios** (EN My reports, ES Mis informes) | Casa com o botão "Extrair Relatório" e com o protótipo `menu-lateral` | "Relatório" no ENSPACE já é o modelo do construtor; a mesma linha teria "relatório" e "modelo de relatório" |
| Downloads | Curto | Descreve o navegador, e não cobre "gerando" nem "falhou" |

Recomendação: **Exportações**. O andaime do protótipo alterna os 2 nomes para comparar na tela.
