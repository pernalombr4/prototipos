# Briefing: migração de workspace

## A demanda como ela veio

> preciso de um protótipo simples. essa é a tela de importaçao e exportaçao de casos de uso do enspace.
>
> ao clicar pra importar, o usuario precisa ter uma area de arraste e poder dizer a escolha dele: é pra sobrescrever tudo o que ta ali pelo novo modelo, é pra somar ou é pra simplesmente adicionar?
>
> e fazer a diff em casos em que for necessario, mostrando pra ele a diff, mas nao em codigo, e sim em estrutura. te envio um estrutural do enspace pra voce ter ideia de qual é o modelo, mas o user é leigo e nao pode ver json

## Tela em jogo

Configurações › Interface › Casos de Uso, cartão "Migração de Workspace", botão **Importar Workspace**.

## O que seria sucesso

Quem importa sabe, antes de confirmar, o que entra, o que muda e o que sai do workspace, e escolhe isso sem ler JSON.

## O que a pesquisa de UX já dizia

Procurei em `enspace-ux-research` (`temas/README.md`, `temas/*/auditoria.md` e `UX_REPORT.md`) por importar, exportar, migração, casos de uso e duplicar. Não há auditoria sobre esta tela nem sobre importação de estrutura.

## O que o develop faz hoje

Visitado em 01/10/2026, no workspace de exploração.

- URL: `/workspaces/<ws>/settings/interface/usecases`
- Print: `evidencias/develop-casos-de-uso-hoje.jpg`

### O fluxo real, em passos

1. A pessoa clica em **Importar Workspace**.
2. O navegador abre o seletor de arquivos do sistema operacional. Não há área de arraste.
3. A pessoa escolhe o arquivo.
4. A importação começa na hora: os 2 botões (Exportar e Importar) giram juntos. Não há prévia, escolha nem confirmação. Print: `evidencias/develop-importando-sem-previa.jpg`.
5. A tela chama `POST /migration-requests` e consulta `GET /migration-requests?status_in=pending&status_in=processing&type=structure`. A importação é assíncrona.
6. Os botões voltam ao normal. Nenhuma mensagem diz o que entrou.
7. A categoria já aparece em Estrutura › Categorias. Print: `evidencias/develop-categoria-criada-na-hora.jpg`.

Para medir, importei um arquivo mínimo com 1 categoria fictícia ("Teste UX importacao"). Ela ficou no workspace de exploração: a exclusão é definitiva e pede o e-mail de quem confirma, então ficou para a Mikaela decidir.

### O que já existe e funciona

- **O arquivo de exportação.** É um JSON com 21 chaves: `c-item-types` (categorias), `c-fields`, `c-forms`, `c-form-blocks`, `c-folders`, `c-lists`, `c-screens`, `c-menu-items`, `module-groups`, `group-email-templates`, `c-type-reports`, `c-document-templates` e as de fluxo e etapa (`c-type-flows`, `c-flow-stages`, `c-stage-tasks` e outras). No arquivo de referência, as de fluxo vieram vazias.
- **Cada peça tem uma chave estável:** `slug` na categoria, `refId` no campo e `migration_hash` em campo, formulário e modelo de e-mail. É o que permite reconhecer "a mesma categoria" sem duplicar.
- **Um padrão de confirmação destrutiva.** A exclusão de categoria (Estrutura › Categorias › lixeira) mostra "O que será excluído", o detalhamento por quantidade e pede que a pessoa digite o próprio e-mail. O protótipo reusa esse padrão no "Substituir tudo".

### Onde trava

- **Não há escolha.** Toda importação soma tudo do arquivo como novo. O próprio produto avisa: "O sistema não identifica categorias pré-existentes no workspace. Se o arquivo contiver categorias já cadastradas, elas serão duplicadas."
- **Não há prévia.** A pessoa só descobre o que entrou abrindo cada categoria depois.
- **Não há volta.** Não há desfazer nem cópia automática do estado anterior.

### Achados de passagem (não são objeto da demanda)

- A descrição da tela promete "consultar todas as categorias disponíveis e entender a finalidade de cada uma", mas a tela não lista categorias.
- O arquivo baixado se chama `estructural_export_...`: "estructural" é espanhol ou erro de digitação.
- Durante a importação, o botão Exportar também fica girando, como se as 2 ações estivessem rodando.

## A casca da tela, item por item

Copiada do develop em 01/10/2026. Componente: `_CascaDoEnspace.vue`.

| Parte | O que tem |
|---|---|
| Topo do menu | Avatar do workspace, nome, slug, seta para trocar |
| Busca | "Buscar..." com `ctrl` `K` |
| Membro | Início, Spaceflows, Categorias (abre), Tarefas (abre), Agenda, Knowledge (abre) |
| Configurações | Visão Geral, Sistema, Estrutura (abre), Gestão de Membros, Interface (aberta: Menus, Telas, **Casos de Uso** ativa), E-mails (abre), Integrações, Agentes de IA, Logs, Credenciais |
| Ajuda | Releases, Documentação (abre fora) |
| Barra do topo | Recolher menu, voltar, avançar, recarregar, início; trilha "workspace › Configurações › Interface › Casos de Uso" com `ctrl` `B` e estrela; bandeira, tema, Suporte, sino, avatar |
| Conteúdo | Logo EN, título "Casos de Uso", descrição, cartão "Migração de Workspace" com Exportar e Importar lado a lado e o ícone de arquivo no meio, aviso "Atenção" |

O logo EN é texto no protótipo.

## Dado do protótipo

O arquivo de referência que a Mikaela enviou é de cliente e **não entrou** no repositório. O `mocks.ts` copia a forma dele (categorias com campos, formulários e pastas; listas, telas, grupos, modelos de e-mail, relatórios, modelos de documento e itens de menu) com valores inventados: um departamento jurídico fictício.

Não usei a API para preparar nada.
