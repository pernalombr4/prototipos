# Briefing: permissões de cargos

## A demanda como ela veio

> observe a tela de permissoes de cargos do enspace. cada vez que criamos permissionamento pra alguma
> funcionalidade, cresce exponencialmente a tela. ta insustentavel. visualmente é ruim pros usuarios irem
> selecionando ponto a ponto e nao sabemos como resolver o problema. veja como outros sistemas fazem e saiba
> que no nosso caso, por exemplo, se um workspace tem 100 categorias, o schema todo de permissoes de
> categorias vai se repetir 100x nas permissoes. e se cada uma delas tem 100 forms, tambem se replica... por
> ai vai. o tamanho do sistema de permissoes depende do tamanho do workspace. sendo assim, precisamos
> otimizar o modo de representar em tela.
>
> uma coisa os usuarios gostam e funciona bem: ser campos de checkbox pra liberar ou nao liberar a
> permissao.
>
> mas a estrutura linear ta complexificando cada vez mais.
>
> pesquise e proponha, depois de investigar como nosso modelo é hoje.

## Tela em jogo

**Configurações › Gestão de Membros › aba Cargos › (cargo) › Permissões.**

- Lista de cargos: `/workspaces/<ws>/settings/access?tab=roles`
- Tela do cargo: `/workspaces/<ws>/settings/access/roles/<id>/permissions`

## O que seria sucesso

Quem administra um workspace de 100 categorias define o que um cargo faz em poucos minutos, marcando
caixas, sem rolar milhares de linhas e sem repetir a mesma escolha categoria por categoria.

## O que a pesquisa de UX já dizia

Procurei no `enspace-ux-research` (índice de temas, auditoria de Configurações do Sistema, `UX_REPORT.md`
por "permiss" e "cargo"). **Não há auditoria da tela de cargos.** O que existe é vizinho:

- **Sessão 3 (Configurações do Sistema):** a chave "Ignorar permissões para membros full" tem o mesmo peso
  visual de "Mostrar categorias", sem confirmação, apesar de dar acesso irrestrito. Mesmo tema: permissão
  com efeito grande precisa de peso e confirmação à altura.

## O que o develop faz hoje

Investigado em 08/10/2026 no workspace de exploração ("teste ux 2", 2 categorias: "Teste UX importacao"
com 1 campo e "leve" com 34 campos e 1 formulário). Criei o cargo "Analista de Contratos" (id 129) pela
tela para chegar às permissões. Não preparei nada por API.

### O fluxo real, em passos

1. Configurações › **Gestão de Membros** › aba **Cargos**.
2. **+ Criar Cargo** abre o modal "Criar Cargo Customizado": Nome, Descrição e Ícone. O botão só responde
   depois de escolher o ícone, embora o campo não esteja marcado como obrigatório.
3. O cargo entra na tabela. Para chegar às permissões: menu **Ações** da linha › **Permissões** (a outra
   opção é Visualizar).
4. A tela do cargo mostra 2 contadores (**Permissões Ativas** `0 / 94` e **Mudanças Pendentes** `0`) e 3
   abas: **Dados** `0/27`, **Configurações** `0/67` e **Inválidas**.
5. **Dados** tem 2 seções em árvore (componente de árvore com caixa de 3 estados):
   - **Padrão** `0/15`: Agenda, IA, Spaceflows, Tarefas (Rápidas e Programadas), cada uma com suas ações;
   - **Tipos de Dados** `0/12`: uma entrada por categoria. Cada categoria abre Criar, Ver, Atualizar e
     Excluir. **Criar, Ver e Atualizar abrem, cada uma, a lista inteira de campos da categoria**; Ver
     ainda soma "Criado em" e "Atualizado em". Cada formulário da categoria entra como mais um nó com as
     4 ações.
6. Marcar o pai marca todos os filhos; desmarcar 1 filho deixa o pai em estado intermediário.
7. Qualquer mudança faz aparecer o aviso "Alterações pendentes · N alterações não salvas." com **Salvar
   Alterações**. O botão abre "Tem certeza que deseja salvar N alterações?" (Não / Sim).
8. **Configurações** traz 67 permissões fixas em 8 seções: Sistemas 14, Dados 12, Acesso 12, Interface 10,
   Emails 10, Integrações 4, Logs 1, Credenciais 4.
9. **Inválidas** lista permissões obsoletas ou sem acesso. Vazia: "Nenhuma permissão obsoleta encontrada".

Prints: `evidencias/hoje-01-arvore-dados.jpg` a `hoje-08-categoria-sem-permissoes.jpg`.

### O tamanho, medido

| | Medida no develop (2 categorias) |
|---|---|
| Nós na aba Dados com a árvore aberta | **145** |
| Altura de rolagem da aba Dados | **4.803 px** (cerca de 33 px por linha) |
| Categoria "leve" sozinha (34 campos, 1 formulário) | 114 nós |

A conta por categoria é `5 + 3 × campos + 2 + 5 × formulários`. Com o volume que a demanda cita:

| Workspace | Nós na aba Dados | Rolagem estimada |
|---|---|---|
| 2 categorias (develop) | 145 | 4.800 px |
| 40 categorias, 12 a 80 campos | 4.935 | 163.000 px |
| 120 categorias (o volume grande do protótipo) | **14.828** | **489.000 px** |
| 100 categorias × 30 campos × 100 formulários | cerca de 59.700 | 2 milhões de px |

O peso maior vem dos campos (3 listas por categoria) e dos formulários (5 nós cada). As 82 permissões
fixas (Padrão e Configurações) não crescem.

### O modelo que o develop grava

Medido no `POST /ws/roles/129/permissions` ao salvar pela tela:

```json
{ "reference": "types::leve::delete", "fields": [], "rules": [], "role": "129" }
```

- Uma permissão é uma **referência** (`types::<slug da categoria>::<ação>`) com a **lista de campos**
  liberados e uma lista de **regras** (vazia em tudo que a tela permite marcar).
- "Ver leve" com todos os campos grava os 35 nomes um por um (`created_at`, `data.status`, ...). **Não
  existe "todos os campos"**: a lista é explícita.
- O contador "Permissões Ativas" conta ações de categoria, de formulário e as fixas. Campos não contam
  (2 categorias × 4 + 1 formulário × 4 + 15 + 67 = 94).

### O que já existe e funciona

- **Caixa de seleção**, que os usuários aprovam (a demanda diz isso).
- **Caixa de 3 estados** no pai: marca tudo, desmarca tudo, mostra o intermediário.
- **Gravação em lote** com aviso de pendência e confirmação.
- **Granularidade real**: categoria, formulário e campo, por ação. A doc do produto (Cargos e Permissões)
  explica isso com uma **tabela categoria × Criar/Ler/Atualizar/Excluir**, e não com a árvore.
- **Aba Inválidas**, que separa permissão órfã.

### Onde trava

1. **A tela cresce com o workspace, não com a decisão.** 120 categorias geram 14.828 caixas mesmo quando o
   cargo só precisa de "vê tudo, edita contratos".
2. **O mesmo campo aparece 3 vezes, longe**: sob Criar, sob Ver e sob Atualizar. Para saber o que o cargo
   faz com "Valor do contrato" é preciso achar 3 linhas separadas por dezenas de outras
   (`hoje-02-campos-de-criar.jpg`).
3. **A mesma ação muda de lugar em cada categoria.** Comparar "quem pode Excluir" entre categorias exige
   rolar a árvore inteira.
4. **Nada vale para todas.** Não há padrão: liberar Ver em 100 categorias são 100 cliques, e a categoria
   criada amanhã nasce sem permissão em todos os cargos.
5. **Sem busca e sem filtro.** Não dá para achar uma categoria nem ver só o que está liberado ou alterado.
6. **A confirmação não diz o que muda**: "Tem certeza que deseja salvar 1 alterações?" (`hoje-05`).
   E "1 alteração" pode ter mexido em 35 campos.
7. **Permissão não aparece na categoria.** Estrutura › Categorias › (categoria) tem 12 cartões
   (Campos, Formulários, Fluxos...) e nenhum de acesso (`hoje-08`).

### Achados de passagem (não são objeto da demanda)

- Plural errado: "1 alterações não salvas." e "salvar 1 alterações".
- A trilha mostra o caminho técnico: `roles › 129 › permissions`.
- O modal "Criar Cargo" não avisa que o ícone é obrigatório; o botão só não responde.
- "Tipos de Dados" na tela do cargo; "Categorias" no menu e na doc. O protótipo usa "Categorias".
- O contador da aba fica vermelho mesmo com permissões marcadas (`1/27`), como se fosse erro.
- O SDK declara `RolePermission` com `action`, `subject`, `conditions` e `fields`; o develop grava
  `reference`, `fields` e `rules`. O schema do SDK está desatualizado ou é de outra rota.

## A casca da tela, item por item

Copiada de `/workspaces/<ws>/settings/access/roles/<id>/permissions` em 08/10/2026, em
`_CascaDeAcesso.vue`.

| Parte | Como está no develop |
|---|---|
| Topo do menu | Avatar e nome do workspace, slug embaixo, chevron |
| Busca | "Buscar..." com atalho CTRL K |
| Seção Membro | Início, Spaceflows, Categorias ⌄, Tarefas ⌄, Agenda, Knowledge ⌄ |
| Seção Configurações | Visão Geral, Sistema, Estrutura ⌄, **Gestão de Membros (ativo)**, Interface ⌄, E-mails ⌄, Integrações, Agentes de IA, Logs, Credenciais |
| Seção Ajuda | Releases, Documentação ↗ |
| Barra do topo | Menu, voltar, avançar, recarregar, início; trilha `<ws> › Configurações › Gestão de membros › roles › <id> › permissions`; CTRL B e estrela; bandeira, tema, Suporte, sino, avatar |
| Cabeçalho do cargo | Ícone do cargo, "Cargo: <nome>"; contadores Permissões Ativas e Mudanças Pendentes |
| Abas | Dados, Configurações, Inválidas, com contador |

## Dado do protótipo

`mocks.ts`, tipado por `ItemType`, `Field` e `Role` do `@be-enlighten/enspace-sdk-schemas`. Empresa
fictícia (Aurora Serviços), 40 processos em 3 unidades (120 categorias), 12 a 80 campos e 1 a 12
formulários por categoria, gerados com semente fixa. Casos de canto: categoria de 80 campos e 12
formulários; nome de 70 caracteres. As 82 permissões fixas copiam os rótulos e as ações do develop.
