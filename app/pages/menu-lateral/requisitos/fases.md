# Fases de implementação: menu lateral em trilha e painel

**Objetivo:** dividir a construção do menu novo em 6 fases de front-end, na ordem em que o dev deve fazer, para
cada fase partir de uma base que já funciona.

**Atualizado em 2026-10-20:** as fases 3, 4 e 5 seguem as rodadas 28 a 31 do protótipo: 3 níveis (seção > menu >
submenu), menu nativo sem submenu, tirar não é excluir, excluir tudo o que não é nativo, Personalizar com 1 "Salvar" e
o formulário "Criar menu" com listas de seleção. Ver o `DECISOES.md`.

**Regra de lançamento:** nenhuma fase vai para o cliente sozinha. O menu novo só é liberado depois da fase 6. Até
lá, cada fase termina num estado que o QA confere em develop.

**Referência visual:** protótipo navegável em https://pernalombr4.github.io/prototipos/menu-lateral/, modelo "Trilha
e painel". As decisões, rodada a rodada, estão no `DECISOES.md` da pasta do protótipo. O modelo "Barra única" está
travado no protótipo e não entra em nenhuma fase.

**Convenção dos IDs:** a numeração é única nas 6 fases. A fase 1 usa 001 a 099, a fase 2 usa 101 a 199, e assim por
diante. RF é requisito funcional, RN é regra de negócio, RI é interface, RNF é não funcional, RS é restrição e RT é
transição.

## As fases

| Fase | O que entrega | Depende de | Documento |
|---|---|---|---|
| 1 | A estrutura: trilha de ícones, painel da área aberta, menu flutuante no hover, recolher, Configurações em painel próprio, Auditoria, Integrações, Análise e Ajuda | nada | [fase-1-trilha-e-painel.md](fase-1-trilha-e-painel.md) |
| 2 | O conteúdo: destinos nativos do Início (Inbox, Chat de IA, Meus relatórios), Favoritos, Categorias com teto e "Ver todas", formulário como aba e busca do workspace no topo | 1 | [fase-2-conteudo-do-menu.md](fase-2-conteudo-do-menu.md) |
| 3 | A personalização de cada pessoa: Personalizar com 1 "Salvar", o que fica na trilha, seções pessoais com menus e submenus, quantos itens cada seção mostra, filtro do menu e largura do painel | 2 | [fase-3-personalizacao.md](fase-3-personalizacao.md) |
| 4 | Arrumar o menu do workspace ao vivo: arrastar, regras de encaixe, botão direito, submenu e tirar, ocultar, rascunho com a bolinha amarela, o cartão de salvar e o "Salvar para todos" do Personalizar | 3 | [fase-4-arrumar-o-menu.md](fase-4-arrumar-o-menu.md) |
| 5 | Criar e excluir: os botões "+", o formulário único de menu, criar categoria, excluir tudo o que não é nativo, o editor de menus e a moldura única das janelas | 4 | [fase-5-criar.md](fase-5-criar.md) |
| 6 | Casos de uso e importação: a Central de casos de uso, usar, guardar, criar, importar e exportar | 5 | [fase-6-casos-de-uso-e-importacao.md](fase-6-casos-de-uso-e-importacao.md) |

## Por que esta ordem

| Fase | Por que vem aqui |
|---|---|
| 1 | Tudo o que vem depois mora dentro da trilha e do painel. Sem eles, nenhuma outra peça tem onde aparecer. |
| 2 | Com a estrutura pronta, o menu ganha o que a pessoa usa todo dia. É a primeira fase que dá para usar de verdade. |
| 3 | Personalizar só mexe nas preferências de quem usa. Não grava nada no menu do workspace; o "Salvar" da janela grava só as preferências da pessoa. |
| 4 | Arrumar o menu do workspace precisa das 3 fases anteriores: o menu inteiro na tela e a camada pessoal, que é o destino do "Salvar só para mim". |
| 5 | Criar menu e categoria grava na mesma árvore e passa pelo mesmo rascunho da fase 4. |
| 6 | Usar ou importar um caso de uso cria menus e categorias pelo caminho da fase 5. |

## Glossário

| Termo | O que é | Nome na tela |
|---|---|---|
| Trilha | Coluna de ícones à esquerda, uma área por ícone | (sem nome na tela) |
| Área | O que um ícone da trilha abre: Início, Dados, uma seção do workspace posta na trilha, ou Configurações | o nome do ícone |
| Painel | A coluna ao lado da trilha com o menu da área aberta | o nome da área, no topo |
| Menu flutuante | O menu de uma área que abre ao lado do ícone quando o mouse para nele, sem trocar o painel | (sem nome na tela) |
| Destino nativo | Item que o produto traz pronto e que abre 1 tela: Início, Inbox, Chat de IA, Tarefas, Agenda, Spaceflows, Documentos, Meus relatórios | o nome do item |
| Seção do workspace | Grupo de menus montado pelo administrador (ou nativo, como Auditoria), igual para todo o workspace | o nome da seção |
| Seção pessoal | Grupo que cada pessoa cria no Início, só para ela, com menus e submenus | o nome que a pessoa deu |
| Menu | Linha do menu que abre 1 tela. O tipo do menu é a tela | o nome do menu |
| Submenu | Menu dentro de outro menu, no 3º nível. Só o menu que o workspace criou recebe submenu, e submenu não recebe submenu | o nome do menu |
| Menu nativo | Menu que o produto traz pronto: destino nativo, tela nativa (Dashboard de tarefas) ou tela de módulo. Não recebe submenu nem se exclui | o nome do menu |
| Rascunho | A versão do menu do workspace que a pessoa está arrumando, antes de salvar | "Alterações não salvas" |

## Fora de todas as fases

| O quê | Por quê |
|---|---|
| O modelo "Barra única" | Ficou fora da proposta; está travado no protótipo. |
| O miolo das telas (tabela de itens, dashboards, Inbox completo) | O protótipo desenha só a navegação. As telas abertas pelo menu são as do produto. |
| O menu em telefone | O protótipo esconde a barra abaixo de 768 px; o desenho para telefone não estava na demanda. |
| A migração das telas que hoje existem fora de qualquer menu | Decisão de migração, listada em "Em aberto" da fase 5. |
