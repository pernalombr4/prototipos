# Componentes fora do Nuxt UI

Tudo que está aqui é código que **o time de front vai ter que construir** se o protótipo for
aprovado. Por isso a lista existe: ela é metade do handoff.

A regra (Parte 2 da spec) é uma escada — só se chega aqui depois de tentar os degraus
anteriores:

1. **o ENSPACE já tem?** — `EnTable`, `EnKanbanBoard`, `EnLayout`, `EnApp` do
   `@be-enlighten/enspace-sdk-ui/base`;
2. procurar o componente pelo nome em `node_modules/@nuxt/ui/dist/runtime/components/`;
3. compor com as primitivas que existem;
4. só então criar em `app/components/ux/Ux<Nome>.vue`;
5. e registrar nesta tabela.

## Registro

| Componente | Protótipo | Por que Nuxt UI não cobriu | Partiu de | O que o dev precisa construir |
|---|---|---|---|---|
| `UxSeletorDeIcones.vue` | configuracoes-do-sistema (Logo do workspace) | Nuxt UI não tem seletor de ícone, e nenhuma lista dele virtualiza. O `USelectMenu` monta todas as opções no DOM: com 50 mil ícones, trava | `UInput` + grade de `<button>` com `UIcon`, mais rolagem virtual escrita à mão | A grade virtualizada (só as linhas visíveis no DOM), a busca que normaliza acento e casa com sinônimo em português, a curadoria que aparece antes de qualquer busca, e o índice de termos por ícone |
| `_CascaDoEnspace.vue` | tarefas-rapidas | Não é o Nuxt UI que falta: é o SDK. O `EnLayout` publica a **estrutura** da casca (sidebar, navbar, inspector) com slots vazios, não o menu do produto nem a barra de navegação do develop | Marcação própria com os tokens do tema, medidas e ordem copiadas do develop | **Nada.** É reprodução do que já existe em produção, e está aqui só para o quadro ser julgado no lugar onde vive (regra 37). Na implementação, é o `EnLayout` com `sidebar-header`, `sidebar-default`, `navbar-leading`, `navbar-title` e `navbar-trailing` preenchidos |
| `_RaiaDoQuadro.vue` | tarefas-rapidas | O `EnKanbanBoard` não expõe slot de coluna, então não há onde pendurar o totalizador, o menu da raia nem o "ver mais" | `EnKanbanBoard` como referência de comportamento (arraste, agrupamento, menu de contexto), remontado com `UButton`, `UDropdownMenu` e `USkeleton` | Rodapé por coluna (`slot #column-footer` ou prop `columnSummary: { field, operation }`, com o `cFormat` do campo para formatar moeda), `columnLimit`, `collapsedColumns`, `pageSizePerColumn` com evento `load-more` e `cardDensity`. A ordem por raia **já existe** no `EnKanbanColumn` (`sortByField`, `sortDesc`): falta só a tela deixar escolher. Com volume, o total vira agregação no back (`sum`/`avg` por campo, inclusive sobre chave de `form_result`). A lista completa está no `DECISOES.md` do protótipo |
| `_PainelDaTarefa.vue` (seção Tempo) | tarefas-rapidas | Não é falta do Nuxt UI: **o ENSPACE não tem apontamento de tempo**. O schema `Task` não tem estimativa nem tempo registrado, e não existe rota de apontamento | `UButton`, `UProgress`, `UInput`, `USwitch` e `UAvatar`, com a leitura de duração escrita à mão | Campo `time_estimate` na tarefa, recurso `/tasks/{id}/time-entries` (dono, começo, duração, nota, etiqueta, faturável), soma por tarefa vinda pronta, e o cronômetro em andamento guardado fora da tela, para sobreviver a recarregar e a trocar de aba |

| `_CascaDaDoc.vue` | seletor-de-produto-na-doc | Não é falta do Nuxt UI nem do SDK: é a casca de **outro produto**, o `docs.enspace.io`, que é um Nuxt Content com barra de vidro própria. O SDK cobre a casca da plataforma, não a do site de documentação | Marcação própria com os tokens do tema, medidas e classes lidas do `SpaceNavigation.vue` do `en-docs` | **Nada.** É reprodução do que já está no ar, e existe só para o seletor ser julgado no lugar onde ele vive (regra 37). Na implementação, o que muda é o `SpaceNavigation.vue` do `en-docs`, que ganha o seletor ao lado do logo |
| `_BotaoDeLink.vue` | padrao-dos-campos (campo Editor de texto HTML) | O `UEditorToolbar` TEM o `kind: "link"`, e o handler dele chama um `prompt()` do navegador com o texto "Enter the URL:": em inglês, fora do alternador de idioma do protótipo e com a cara do sistema operacional em vez da do produto | `UPopover` com dois `UInput` (endereço e texto) e três `UButton`, falando com a instância do TipTap que o slot do `UEditor` entrega | O popover de link inteiro: ler o estado do editor ao abrir (texto selecionado, cursor dentro de link), esticar a seleção para a marca toda antes de ler, normalizar endereço sem esquema para `https://` e sem barra com arroba para `mailto:`, e as ações Abrir e Remover só quando já existe link. É contribuição para o Nuxt UI mais do que código nosso: o que falta lá é o popover, não o comando |
| `_MatrizDeDados.vue` | padrao-dos-campos (campo Matriz de dados) | O `URadioGroup` existe e continua sendo o radio usado aqui, item por item. O que não existe é a GRADE: um grupo por linha, alinhado à mesma coluna de todos os outros, com o cabeçalho de coluna escrito uma vez só. `URadioGroup` em `orientation="horizontal"` distribui os próprios itens, e não se alinha com os de outro grupo | `URadioGroup` com os itens sem rótulo (é assim que ele desenha só o controle), dentro de uma grade CSS de uma variável `--n`, usada pelo cabeçalho e por cada linha | Um componente de matriz no SDK, recebendo `linhas`, `colunas` e um valor `linha -> coluna`, com uma resposta por linha, o Rótulo Complementar de título e o Limpar opcional. E o valor é o contrato que falta: a forma gravada não aparece em lugar nenhum da tela, e está no `campos.ts` marcada como proposta |
| `_MenuDaDoc.vue` | seletor-de-produto-na-doc | O `UContentNavigation` existe e é o certo, mas monta a navegação a partir de rotas reais do `@nuxt/content`, e aqui não há rota por página: o menu troca de árvore sem sair da tela | `UCollapsible` mais botões, com a mesma hierarquia, o mesmo item ativo em primária e a mesma indentação do `UContentNavigation` | **Nada de componente.** Na implementação continua sendo o `UContentNavigation`, alimentado pela árvore do produto em uso em vez da árvore única de hoje. O que o dev constrói é a derivação dessa árvore a partir do produto escolhido |

**Dado que acompanha:** `app/components/ux/icones.ts`, gerado a partir do `@iconify-json/lucide`
instalado. No produto esse índice vem do servidor de ícones, não do bundle do cliente.

**Duplicação conhecida:** o protótipo `tela-de-workspaces` tem uma cópia local da mesma
biblioteca e um seletor equivalente, feitos antes deste componente existir. Quando ele migrar
para cá, a cópia de lá sai. Este agente não edita a pasta do outro protótipo.

## O que vale antes de criar um componente novo

- **Slot resolve mais do que parece.** Quase todo componente do Nuxt UI aceita slot no lugar
  da prop — `#header`, `#leading`, `#trailing`, `#item`. Antes de escrever do zero, confira o
  arquivo `.vue` do componente e veja quais slots ele expõe.
- **`ui` reestiliza sem bifurcar.** A prop `ui` de cada componente aceita sobrescrever as
  classes de cada parte interna. Ajuste de aparência quase nunca justifica componente novo.
- **Composto não é custom.** `UCard` com `UTable` dentro e um `UButton` no header continua
  sendo Nuxt UI puro — não entra nesta lista.
