# Briefing: galeria de casos de uso

## A demanda como ela veio

> observe os prototipos de tela de workspaces e de menu lateral de 2 niveis. a parte de casos de uso mostra uma galeria similar à do clickup.
>
> hoje nao é assim nosso modelo. é assim como voce vai ver nesse link https://be.enspace.io/workspaces/produtos/settings/interface/usecases
>
> voce deve criar um prototipo pra reformular somente a galeria de casos de uso. a parte superior da tela, de importar e exportar, será mantida como hoje em dia. agora, a parte abaixo deve ter essa aparência de "lojinha" como nos outros prototipos.
>
> trabalhe nisso

## Tela em jogo

Configurações › Interface › Casos de Uso, o bloco abaixo da Migração de Workspace e do aviso de Atenção.

O link da demanda é de produção. Pela regra 1 da spec, a tela foi vista no develop, no workspace de exploração, na mesma rota.

## O que seria sucesso

Quem configura o workspace acha o caso de uso que serve ao processo dele, entende o que vem junto e usa, sem abrir caso por caso.

## O que a pesquisa de UX já dizia

Procurei em `enspace-ux-research` (`temas/README.md`, `temas/*/auditoria.md` e `UX_REPORT.md`) por casos de uso, caso de uso, use case, usecases, modelo e template. Não há auditoria sobre esta tela nem sobre a galeria.

A forma da galeria vem de 2 protótipos daqui, já revisados pela Mikaela:

- `menu-lateral`, rodada 18: a Central de casos de uso, padrão da Central de modelos do ClickUp;
- `tela-de-workspaces`, rodada 24: a mesma Central no passo 2 da criação do workspace, com o filtro de Localidade.

## O que o develop faz hoje

Visitado em 20/10/2026, no workspace de exploração.

- URL: `/workspaces/<ws>/settings/interface/usecases`
- Prints: `evidencias/develop-1-topo-como-hoje.jpg`, `evidencias/develop-2-galeria-como-hoje.jpg`, `evidencias/develop-3-saiba-mais.jpg`

### O fluxo real, em passos

1. A pessoa rola a tela até abaixo do aviso de Atenção.
2. Um bloco com o título "General" e o texto "Casos de uso disponíveis nesta categoria" mostra os cartões. No workspace de exploração há 1: "QA Comercial - Brasil (pt-br)".
3. O cartão tem 3 faixas: nome, descrição ("Caso de uso de QA") e o botão **Saiba Mais**.
4. **Saiba Mais** abre uma janela com o nome, 1 imagem (o logo do ENSPACE), "Descrição:" e o botão **Migrar Caso de Uso**.
5. Pelo bundle da tela, **Migrar Caso de Uso** pede confirmação: "Are you sure you want to migrate the selected use case? Additional charges may apply for exceeding products" (texto `confirm_migration`). Depois, o aviso "Os registros estão sendo carregados na tabela de Backup/Migração" (`loading_records`). A confirmação não foi clicada: ela grava no workspace.

### O que já existe e funciona

- **A rota `use-cases`**, que a tela de criar workspace também lê, com a localidade (`brazil`, `usa`, `global`) escolhida pelo idioma de quem abre.
- **O agrupamento.** Os cartões vêm em blocos por "categoria" ("General").
- **As permissões** `settings::interface::usecases::read` e "Criar Casos de Uso" (`usecases::create`), no texto de permissões do bundle.
- **A migração assíncrona**, pela tabela de Backup/Migração, a mesma da importação.

### Onde trava

- **Nada filtra nem busca.** Com 1 caso funciona. Com dezenas, a pessoa rola blocos de cartões iguais.
- **O cartão não diz o que o caso traz.** Nome e descrição só. Quantas categorias, quais campos, se há menu: nada aparece antes de migrar.
- **A janela do Saiba Mais também não diz.** Imagem genérica e a mesma descrição do cartão.
- **A localidade está no nome** ("Brasil (pt-br)"), e não num filtro.
- **"Categoria" quer dizer 2 coisas.** O grupo dos cartões se chama categoria, e categoria no ENSPACE é o tipo de item que o caso de uso cria.

### Achados de passagem (não são objeto da demanda)

- A janela do Saiba Mais repete "Descrição:" com dois-pontos, como rótulo de formulário.
- O botão **Saiba Mais** é a única ação do cartão, mas só ele é clicável; o cartão não é.

## A casca da tela, item por item

Copiada do develop em 20/10/2026. Componente: `_CascaDoEnspace.vue`, a partir do de `migracao-de-workspace` (01/10/2026).

| Parte | O que tem |
|---|---|
| Topo do menu | Avatar do workspace, nome, slug, seta para trocar |
| Busca | "Buscar..." com `ctrl` `K` |
| Membro | Início, Spaceflows, Categorias (abre), Tarefas (abre), Agenda, Knowledge (abre) |
| Configurações | Visão Geral, Sistema, Estrutura (abre), Gestão de Membros, Interface (aberta: Menus, Telas, **Casos de Uso** ativa), E-mails (abre), Integrações (abre), Agentes de IA, Logs |
| Ajuda | Releases, Documentação (abre fora) |
| Barra do topo | Recolher menu, voltar, avançar, recarregar, início; trilha "workspace › Configurações › Interface › Casos de Uso" com `ctrl` `B` e estrela; bandeira, tema, Suporte, sino, avatar |
| Conteúdo de cima | Logo EN, título "Casos de Uso", descrição, cartão "Migração de Workspace" com Exportar e Importar lado a lado e o ícone de arquivo no meio, aviso "Atenção" |

Diferenças desde a cópia de 01/10: "Integrações" ganhou a seta de abrir e "Credenciais" saiu do menu. O logo EN é texto no protótipo.

## Dado do protótipo

18 casos de uso fictícios em 8 áreas, nas 3 localidades, com um nome longo de propósito ("Procurações, poderes e representação societária"). O caso de uso não tem tipo no `enspace-sdk-schemas`; a forma está comentada no `mocks.ts`.

Não usei a API para preparar nada.
