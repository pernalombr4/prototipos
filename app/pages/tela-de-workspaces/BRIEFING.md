# Briefing — Tela de entrada (Workspaces)

## 1. A demanda, como ela veio

> testa fazendo um prototipo da tela de entrada do enspace, a tela de workspaces, pra melhorar
> a hierarquia das informaçoes e fazer os usuarios terem acesso mais rápido às ações e
> COMPREENDEREM que é uma tela de entrada. eles ficam perdidos. alguns usuarios chegam a
> colocar pra criar um novo workspace achando que estao ABRINDO UM CHAMADO quando a emrpesa
> manda dizendo "é nesse workspace que voce abre chamado", a pessoa loga e na tela de
> workspaces ela acha que ta abrindo chamado quando coloca "criar novo workspace".

## 2. Onde acontece

`/workspaces` — a primeira tela depois do login, antes de entrar em qualquer workspace.

## 3. O que seria sucesso

Quem chega para abrir um chamado entende, sem ler nada com atenção, que precisa **entrar**
em um workspace — e chega lá em um clique, sem passar perto de "Criar Workspace".

---

## 4. Como o develop faz hoje

**URL:** `/workspaces` (rota fixa, sem query string).
**Estado observado:** conta com 18 workspaces, 0 favoritos, 0 recentes, 1 convite pendente.

### O fluxo real, em passos

1. A pessoa entra e cai no `/workspaces`.
2. A tela abre com um **campo de busca** no topo à esquerda e, no topo à direita, dois botões:
   **Atualizar** e **Criar Workspace**.
3. Abaixo, três abas — `Todas (18)`, `Favoritos (0)`, `Recentes (0)` — e uma grade de cards de
   quatro colunas.
4. Cada card traz: ícone, nome, referência, `Sem descrição`, um selo de papel
   (`Proprietário` / `Full`) e um botão **Entrar**.
5. Para trabalhar, é preciso achar o card certo e clicar em **Entrar** dentro dele.

### O que já existe e funciona

- busca com atalho de teclado (`Enter` seleciona o primeiro, `Esc` limpa);
- favoritos e recentes **já existem como conceito** — as abas estão lá, só chegam vazias;
- papel do usuário visível em cada card;
- criação em duas etapas, com template opcional.

Ou seja: a matéria-prima da solução já está no produto. O problema é de **hierarquia**, não de
funcionalidade faltando.

### Onde trava

| # | O que se vê | Por que confunde |
|---|---|---|
| 1 | **A tela não tem título.** Não existe `h1`, nem uma frase dizendo o que ela é. O primeiro texto que se lê é o *placeholder* da busca. | Nada afirma "isto é uma escolha". Sem rótulo, a pessoa projeta a expectativa que trouxe — e ela veio para abrir chamado. |
| 2 | **`Criar Workspace` ocupa o canto superior direito**, posição canônica da ação primária da página. | É o único botão de nível de página. "Criar" casa com a intenção de quem quer *criar um chamado*. O erro relatado não é distração: a tela está pedindo esse clique. |
| 3 | **`Entrar` está 18 vezes na tela**, dentro dos cards, em tamanho `small`. | A ação que resolve 100% das entradas é a menos destacada. Nenhuma se destaca das outras. |
| 4 | **16 dos 18 cards dizem `Sem descrição`.** | Um card de ~140px de altura cujo único conteúdo é "Sem descrição" e um slug. A grade ocupa a tela inteira sem informar nada. |
| 5 | **Favoritos (0) e Recentes (0)** para quem está chegando. | A ordenação é plana. O workspace que a pessoa usa todo dia tem o mesmo peso do que ela nunca abriu. |
| 6 | **O convite pendente vira um card apagado** ("Alou"), borrado, sem ação visível. | O que mais precisa de ação é o que menos parece acionável. |
| 7 | **O modal de criação não desambigua.** Pede Nome, Referência, Descrição e Ícone; o Nome aceita "Apenas letras, números e espaços, de 3 a 50 caracteres". | O assunto de um chamado passa nessa validação. Nada no caminho pergunta "é isso mesmo que você quer?". |

### Achado extra (fora do escopo, mas registrado)

Os botões da barra superior expõem **chaves de tradução cruas** como nome acessível:
`button.home`, `button.back`, `words.forward`, `button.refresh`. Quem usa leitor de tela ouve
a chave, não o rótulo.

---

## 5. Evidência

**Limitação declarada:** o `save_to_disk` da captura não gerou arquivo em disco nesta sessão,
então **não há PNG** em `evidencias/`. O que está registrado como prova do estado atual é o
texto extraído do DOM da tela em 16/09/2026, abaixo — nomes reais de workspaces do ambiente de
teste foram substituídos por `[...]` porque este repositório é público.

```
Comece a digitar para buscar (Enter para selecionar o primeiro)
Digite para buscar • Enter para selecionar • Esc para limpar
18 workspaces disponíveis
Atualizar | Criar Workspace
📁 Todas (18)  ⭐ Favoritos (0)  🕒 Recentes (0)
[nome do workspace] / [referencia] / 👑 Proprietário / Sem descrição / Entrar
[nome do workspace] / [referencia] / 👑 Proprietário / Sem descrição / Entrar
[... 16 repetições da mesma estrutura, 16 delas com "Sem descrição" ...]
[nome do workspace] / Convite pendente / ⭐ Full / Sem descrição / Entrar
```

Modal de criação, passo 1 de 2:

```
🚀 Criar um novo workspace
(1) Dados Gerais ———— (2) Selecionar Template (Opcional)
Nome*        — Apenas letras, números e espaços são permitidos. O nome deve ter entre 3 e 50 caracteres.
Referência*  — Este campo é preenchido automaticamente com o nome informado em snake_case.
Descrição
Ícone*
                                              [Cancelar]  [Próximo]
```
