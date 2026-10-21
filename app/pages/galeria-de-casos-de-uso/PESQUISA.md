# Pesquisa: galeria de modelos

A Fase 3 deste assunto já rodou 2 vezes, nos protótipos que a demanda manda seguir. Esta pasta não repete a pesquisa; ela aponta para lá e registra só o que muda por a galeria morar numa tela de configurações.

| Onde | O que está lá |
|---|---|
| `menu-lateral/PESQUISA.md`, seção "Rodada 18: a Central de modelos do ClickUp" | Os 9 prints da Central de modelos do ClickUp, lista e detalhe, e a diferença entre Usar e Adicionar |
| `menu-lateral/PESQUISA.md`, seções 1 a 8 | Notion, Twenty CRM, ClickUp, monday.com, Pipefy, Linear, Attio e Airtable |
| `tela-de-workspaces/PESQUISA.md` | As mesmas 5 obrigatórias e 3 extras para a tela de entrada, onde a Central virou o passo 2 da criação |

## O padrão que todos seguem

- **Vitrine com cartão de prévia.** ClickUp, monday.com, Notion, Pipefy e Airtable mostram o modelo por uma imagem do que ele monta, e não por texto.
- **Navegação lateral por origem e filtro.** Destaques, os do produto e os do workspace; e filtros por tipo e complexidade.
- **Busca no topo e agrupamento por área de negócio.**
- **Detalhe antes de usar**, com o que vem junto e um botão principal.

## O que muda por estar em Configurações

- **A galeria fica na página, não numa janela.** No ClickUp e no monday.com a central é uma camada sobre o trabalho. Aqui a tela inteira é sobre casos de uso, e a demanda pede a galeria no lugar do bloco "General". A lateral de filtros gruda no topo enquanto a lista rola.
- **Só os casos do ENSPACE.** O produto não tem caso de uso criado pelo workspace nesta tela. As vistas são Destaques e Todos do ENSPACE.
- **Usar é migrar.** O botão principal faz o que o **Migrar Caso de Uso** faz hoje: soma ao workspace pela tabela de Backup/Migração.

## O que nenhum deles faz

- **Dizer o custo antes de aplicar.** O ENSPACE já avisa que a migração pode cobrar valor adicional e que categorias com o mesmo nome se duplicam. A confirmação mostra os 2 avisos junto da lista do que entra. Nenhuma das referências diz, antes do clique, o efeito no plano.

## Rodada 6: onde importar e exportar ficam numa galeria de modelos

Pergunta da Mikaela: "se tiver botao de importar e exportar, onde ficam na lojinha de casos de uso/templates". Pesquisa em 2026-10-21, pela documentação de cada produto.

| Produto | Galeria de modelos | Importar e exportar |
|---|---|---|
| ClickUp | Template Center, aberta pelo menu do workspace, pelo "+" da barra lateral ou por /Template ([Find a template](https://help.clickup.com/hc/en-us/articles/6326080034199-Find-a-template)) | Fora da galeria: a importação fica nas configurações do workspace; a galeria não tem botão de importar nem de exportar |
| monday.com | Template center com "Use template", que escolhe o workspace de destino ([monday.com templates](https://support.monday.com/hc/en-us/articles/360001362625-monday-com-templates)) | Fora da galeria: "Import Data" no menu do perfil, no canto de cima ([Import and export](https://coefficient.io/import-and-export-monday-com-data)) |
| Pipefy | Galeria de templates por um botão da barra lateral ([gallery templates](https://community.pipefy.com/getting-started-146/how-to-use-gallery-templates-to-get-started-faster-5242)) | Fora da galeria: o app Importer, que põe um ícone no cabeçalho do pipe ([Importer](https://help.pipefy.com/articles/2446394-importer-pipe-apps)) |
| Airtable | "Add a base" oferece 3 caminhos lado a lado: do zero, de um template ou importando planilha ([CSV import](https://www.thebricks.com/resources/how-to-import-a-new-csv-file-into-airtable)) | Importar é uma porta irmã do template, no mesmo menu de criar |
| Notion | Templates na barra lateral, com "Use this template" ([import templates](https://thebricks.com/resources/how-to-import-templates-in-notion)) | Importar fica na barra lateral, separado da galeria (fonte de terceiros, não confirmada na doc oficial) |
| Referência enviada pela Mikaela (artefato "Casos de Uso, proposta") | Título à esquerda, destaque "Comece por aqui", busca, chips de categoria e cartões com "Ver detalhes" e "Adicionar" | Um grupo no canto de cima à direita: "Migração de Workspace" com "i", Exportar e Importar |

**O padrão:** nenhum dos 5 põe importar e exportar como bloco principal da galeria. A galeria é o conteúdo da página; importar e exportar ficam num canto, num menu ou como porta irmã do "criar".

**O que serve ao ENSPACE:** a tela tem as 2 coisas, então as 2 ficam visíveis: a galeria como página e a migração como um grupo pequeno, com moldura e rótulo, no canto de cima, onde a referência também pôs.

**O que não serve:** esconder a migração num menu de "…", como fazem ClickUp e monday. Ela é metade do motivo da tela existir hoje, e a Mikaela pediu que não perca tanto o destaque.

**O que nenhum deles faz:** mostrar o aviso de risco da importação (categorias duplicadas) no momento de escolher o arquivo. Na proposta, o aviso sai do meio da página e vai para a camada que abre antes do arquivo.

