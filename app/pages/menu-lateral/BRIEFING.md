# Briefing — Menu lateral em dois níveis

**Slug:** `menu-lateral` · **Rodadas:** 1 e 2 · **Data:** 16 e 17/09/2026
**Ambiente investigado:** develop, workspace de exploração `teste-ux`

---

## 1. A demanda, como ela veio

Demanda de cliente, repassada pela Mikaela:

> "o menu do enspace na lateral esquerda é muito cheio e confuso. se eu tiver muitas
> categorias entao... piorou. mesmo sem menus personalizados so os nativos ja sao muitos.
> todo mundo se confunde"

E a instrução de produto que veio junto:

> "a ideia de produtos é fazer um menu em 2 níveis pro enspace.
> veja como ficaria. e pode reorganizar todo o menu como quiser. os menus aninhados pode
> mudar os aninhamentos. menu dentro de sistema (abas) podem virar menus soltos... como
> achar interessante em UX.
> só lembre de nao fazer nada FORA DA CURVA. siga o padrao de mercado. como outros produtos
> fazem? notion, clickup, monday, hubspot, airtable, asana, twenty crm... qualquer produto
> que voce saiba que POSSUI UM MENU NATIVO COMPLEXO COM MUITAS OPÇOES."

O critério de aceite é esse texto. Em especial: **dois níveis**, **reorganização livre** dos
aninhamentos e das abas, e **nada fora do padrão de mercado**.

## 2. Qual tela está em jogo

O menu lateral esquerdo do workspace, presente em **todas as telas** do produto. Não é uma
tela: é o componente de navegação que acompanha o usuário o tempo inteiro.

## 3. O que seria sucesso

Alguém que entra no workspace acha o que procura sem rolar o menu e sem abrir a coisa
errada, mesmo com dezenas de categorias cadastradas.

---

## 4. O que a pesquisa de UX já dizia

Consulta obrigatória ao `../enspace-ux-research` (regra 30). **Havia material, e ele
converge com a demanda.** Quatro fricções já registradas apontam para o menu:

| Código | Sev. | O que diz | Tema |
|---|---|---|---|
| **S1-F3** | P1 | "Dois itens *Categorias* no mesmo menu com significados diferentes; do menu de uso não há como criar." | [categorias](../../../../enspace-ux-research/temas/categorias/) |
| **S1-F4** | P1 | "*Menu automático* nasce desligado. A categoria criada não aparece no menu lateral." | [categorias](../../../../enspace-ux-research/temas/categorias/) |
| **S2-F1** | P1 | "A Base de Conhecimento não aparece em lugar nenhum por padrão; só é descoberta dentro do dropdown *Screen* do editor de menus." | [base-de-conhecimento](../../../../enspace-ux-research/temas/base-de-conhecimento/) |
| **S3-P2** | P3 | "Menu lateral a **4,36:1** de contraste, abaixo do mínimo WCAG AA (4,5:1). **24 elementos**, o texto de navegação mais usado do produto." | [plataforma](../../../../enspace-ux-research/temas/plataforma/) |

O diagnóstico do S1-F3 é literalmente o problema da demanda, dito por outra via:

> "o mesmo rótulo nomeia a instância (os dados que existem, em Membro) e a definição (o
> molde, em Configurações › Estrutura). Quem conhece o produto lê a diferença pelo
> agrupamento; quem não conhece lê dois links iguais."

Isso tira a demanda de "opinião de um cliente" e a coloca como **convergência de dois
métodos**: a persona que tropeçou na Sessão 1 e o cliente que reclamou agora.

O S3-P2 entra como **requisito de contraste** do protótipo, não como item separado: se o
menu vai ser redesenhado, sai daqui já passando em AA.

---

## 5. O que o develop faz hoje

**URL:** `https://develop.enspace.io/workspaces/teste-ux`
**Evidência:** [`evidencias/develop-menu-transborda.gif`](evidencias/develop-menu-transborda.gif)
**Viewport da medição:** 1920 × 911 (monitor grande, não notebook)

### A estrutura completa, como ela é

Três grupos com rótulo, e dentro deles 33 itens clicáveis. **Cinco deles são deste
workspace, não do produto**, e estão marcados com `‹ws›` abaixo: a categoria `leve`, os dois
formulários dela e a seção `Knowledge` que alguém criou ali. O menu **nativo**, o que existe
em qualquer workspace, são as outras linhas: 28 itens mais 3 rótulos = **31 linhas**.

```
MEMBRO                              CONFIGURAÇÕES              AJUDA
├ Início                            ├ Visão Geral              ├ Releases
├ Spaceflows                        ├ Sistema                  └ Documentação ↗
├ Categorias          ▾             ├ Estrutura        ▾
│ └ leve        ‹ws›  ▾             │ ├ Categorias
│   ├ Todos     ‹ws›                │ ├ Listas
│   └ AUD Formulario ‹ws›           │ └ Spaceflow
├ Tarefas             ▾             ├ Gestão de Membros
│ ├ Agendadas                       ├ Interface        ▾
│ └ Rápidas                         │ ├ Menus
├ Agenda                            │ ├ Telas
└ Knowledge           ▾             │ └ Casos de Uso
  └ Knowledge Base                  ├ E-mails          ▾
                                    │ ├ E-mails Enviados
                                    │ ├ Modelos de E-mail
                                    │ └ Caixas de E-mail
                                    ├ Integrações
                                    ├ Agentes de IA
                                    ├ Logs
                                    └ Credenciais
```

### A medição

| | Valor |
|---|---|
| **Linhas do menu nativo** (qualquer workspace, zero categorias) | **31** (28 itens + 3 rótulos) |
| Linhas neste workspace, com tudo aberto | 36 (as 31 mais 5 dele) |
| Níveis de profundidade | **3** (Categorias › categoria › formulário) |
| Altura do conteúdo do menu, medida aqui | **1208 px** |
| Altura disponível para ele | **847 px** |
| Sobra para fora da tela | **361 px**, ou 30% |
| Altura do menu nativo, derivada (1208 / 36 × 31) | **~1040 px**, ainda acima de 847 |
| Linhas que são de Configurações | **19 de 28 nativas**, ou 68% |
| Categorias neste workspace | **1** |
| Seções personalizadas | **1** (Knowledge) |

### Onde trava

1. **O menu não cabe na tela, e isso não depende de volume.** Com **uma** categoria e
   **uma** seção personalizada, em um monitor de 1920 × 911, 30% do menu já nasce fora da
   área visível. E tirando as cinco linhas que são deste workspace, **o menu nativo sozinho
   já passa de mil pixels** contra os 847 disponíveis. A queixa do cliente ("se eu tiver
   muitas categorias então piorou") descreve o agravamento, não a causa: a causa está no
   workspace vazio.

2. **Cada categoria cadastrada soma uma linha, direto no menu de trabalho.** Não há teto,
   não há agrupamento, não há favoritos. A lista de categorias é o único item do menu que
   cresce sem limite, e ela cresce no meio do caminho entre Spaceflows e Tarefas.

3. **Dois terços do menu são administração.** Dezenove dos 28 itens nativos são de Configurações: estrutura
   de dados, membros, integrações, credenciais, logs. Coisas que se configuram uma vez e se
   revisitam raramente dividem espaço, peso visual e rolagem com o que a pessoa usa todo
   dia.

4. **Três níveis, e o terceiro é invisível até você abrir dois.** Para chegar em "AUD
   Formulario" é preciso abrir Categorias, depois abrir "leve". Nada na tela antecipa que
   existe um terceiro nível ali dentro.

5. **"Categorias" aparece duas vezes, com sentidos diferentes** (S1-F3), e as duas ficam
   visíveis ao mesmo tempo quando os dois grupos estão abertos.

### O que já existe e funciona, e não se reinventa

- **Busca com `Ctrl K`** no topo do menu. Já está lá, já funciona.
- **Seções personalizadas** com nome, ícone, ordem e grupos permitidos, criadas em
  `Configurações › Interface › Menus`. O produto **já tem** o conceito de seção nomeada com
  itens dentro: é exatamente a gramática de dois níveis que a demanda pede. A proposta usa
  esse conceito que já existe, em vez de inventar outro.
- **Menu automático** por categoria, que decide se ela entra no menu.
- **Recolher o menu** pela alavanca na borda.

### O que foi preparado por API

**Nada.** Nenhum dado foi criado, editado ou apagado no develop. O `API_TOKEN` do
`config/tokens.md` é de leitura, e a spec manda parar e perguntar antes de escrever. A
medição acima é do estado em que o workspace `teste-ux` já estava.

**Consequência declarada:** o cenário de volume (dezenas de categorias) **não foi
observado no produto**, foi modelado no `mocks.ts`. Ver a pergunta em aberto no
`DECISOES.md`.

### Ressalva honesta

A primeira medição desta rodada foi feita **em produção** (`be.enspace.io`, workspace
`Produtos`), antes de eu ter lido a spec deste repositório, que manda usar develop e só o
workspace de exploração. Nada foi criado, editado ou apagado lá: só naveguei e li o DOM. A
medição de produção foi **descartada** e refeita no develop, e é a do develop que está
acima. Registrado aqui porque a regra 1 é a regra 1.
