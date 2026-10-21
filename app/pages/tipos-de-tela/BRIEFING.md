# Briefing: tipos de tela

## A demanda como ela veio

Primeiro pedido (21/10/2026), que gerou a pesquisa:

> o enspace possui uma funcionalidade chamada telas.
>
> é uma funcionalidade que ta se tornando legada por falta de manutençao.
>
> algumas telas ali ja foram canibalizadas por novas telas nativas do enspace e perderam sua utilidade. outras podem ter utilidade real se forem reformuladas em ux/ui.
>
> essas telas usam ainda tabelas antigas, mal formuladas, front quebrado, e tem falta de funcionalidades que realmente a tornariam mais úteis.
>
> estude TODOS os tipos de tela que o enspace oferece e aponte como alteraria cada uma delas [...] tome essas decisoes e coloque aqui no chat, ainda sem desenhar o prototipo.
>
> entretanto, alem de estudar as funcionalidades do enspce, pesquise pra descobrir se OUTROS produtos possuem funcionalidades similares a essa nossa ideia de criar TELAS com funçoes especificas pra tirar dali insights de melhoria.

Segundo pedido (21/10/2026), que gerou este protótipo:

> pode botar a confirmaçao no painel do menu, mas nao mexa em mais nada naquele prototipo.
>
> mexa somente no seu novo.
>
> voce deve prototipar agora os tipos de tela. só fazer um menuzinho do enspace simulando os tipos de tela com seus nomes mesmo (tela de requisiçoes), dai o dev consegue entrar e ver como seria na realidade. sem mudar nada no prototipo de menu agora alem da confirmaçao que vai botar la, ok?
>
> pode começar

## Tela em jogo

Configurações › Interface › Telas, os 13 tipos do campo **Tipo** em **Criar +**, e o resultado de cada um no menu lateral do membro.

## O que seria sucesso

O dev abre o protótipo, clica em cada tipo no menu e vê, com dado de verdade, como cada tela fica depois da reforma: o que ela faz, o que ela substitui e onde mora no menu.

## As decisões que o protótipo mostra

Vieram do relatório "Telas do ENSPACE e concorrentes" (deep research de 21/10/2026, 26 produtos), entregue no chat antes deste protótipo.

| Tipo legado | Destino | Tela no protótipo |
|---|---|---|
| Arquivos | Funde com a nativa escondida Documents | Documentos |
| Consultas | Recorte "Todos" | Lista de itens |
| Consultas (Grupo de Membros) | Recorte "Do meu grupo" | Lista de itens |
| Conteúdo Embutido | Front novo, com moldura | Página externa |
| Customizado | Deixa de existir | (sai) |
| Meus Itens | Recorte "Só os meus" | Lista de itens |
| Minhas Requisições | Módulo fixo no menu | Requisições › Minhas requisições |
| Painéis | Front novo e 4 funções | Painel |
| Requisições | Módulo fixo no menu | Requisições › Abrir requisição |
| Tarefas | Front novo e lote à vista | Fila de tarefas |
| Tarefas Geral | Recorte "Todas" | Fila de tarefas |
| Telas Personalizadas | Visualização salva e coluna de expressão | Lista de itens |
| Triagem | Módulo fixo no menu | Requisições › Triagem |

## O que a pesquisa de UX já dizia

`../enspace-ux-research/temas/construtor-de-telas/auditoria.md` (14 e 15/09/2026) levou 12 dos 13 tipos a funcionar no develop. As fricções que este protótipo ataca:

| Código | O que é | Onde o protótipo responde |
|---|---|---|
| N4 (P0) | O envio de Requisições responde `POST /c-form-results → 500` e a tela não mostra nada | Abrir requisição: enviando, enviado com número, falhou com o preenchido preservado |
| U2 | Consultas, Consultas (Grupo de Membros) e Meus Itens mostram a mesma tela; Minhas Requisições e Triagem também | O recorte vira 3 abas com contagem; Minhas requisições e Triagem viram telas diferentes |
| U6 (P1) | Tarefas Geral abre em 30 dias, sem "Todo o período" | Fila de tarefas: "Todo o período" é o padrão; outro período diz quantas tarefas ficaram de fora |
| U4 (P1) | Customizado não renderiza em nenhum dos 3 caminhos testados | O tipo sai; o atalho externo vai para Página externa |
| U7 | Conteúdo Embutido entra sem título nem origem | Moldura com o domínio e "Abrir em nova aba" |
| U1 | O Nome configurado só vira título em Painéis | Toda tela usa o nome do menu como título |
| U5 | 3 componentes de tabela | Todas as listas usam o `EnTable` |
| C2 | Arquivos tem 4 nomes em 4 lugares | 1 nome: Documentos |
| C6 | Customizado e Telas Personalizadas são sinônimos para coisas diferentes | Os 2 saem do catálogo |
| W1 | "Escopo é parâmetro, não tipo" | É a tese do protótipo |
| W3 | Um estado vazio que diz o que falta | `_EstadoDaTela.vue`, com o texto de cada tela |
| W4 | Mutação termina em 1 de 3 estados | Abrir requisição e o lote da Fila de tarefas |

Também em `UX_REPORT.md`: S2-F1, as 6 telas nativas escondidas que só aparecem no seletor do editor de menus (Documents, Screening, Received Emails, Knowledge Base, Requests, Support Center). Documentos, Abrir requisição e Triagem absorvem 4 delas.

Sinais de demanda (de `analises-dados/grupos-risco-2026-09`, lidos na pesquisa): 118 dos 2.545 chamados do time de produto citam tela legada; "Minhas Requisições" lidera com 40. Bugs abertos: BUG5F179670 (o membro não vê as próprias requisições), BUGAB69AEDF (a consulta mostra todos os campos), BUG9F1D5B7E (as telas do menu legado não abrem o quick view).

## O que o develop faz hoje

**Fase 2 não foi refeita nesta rodada.** A demanda pediu para começar o protótipo na hora, e a auditoria de 14 e 15/09/2026 já percorreu os 13 tipos no develop, do formulário de configuração à tela renderizada, com prints. Cada `.vue` deste protótipo cita no comentário de abertura a fricção medida lá. O que falta medir de novo está no fim do `DECISOES.md`.

O fluxo de hoje, resumido da auditoria:

1. Configurações › Interface › Telas › **Criar +**.
2. Nome, Descrição e **Tipo** (13 opções). 6 tipos pedem só Categorias; Requisições pede Formulários; Minhas Requisições e Triagem pedem "Tipo da Filtragem"; Conteúdo Embutido pede `url`; Customizado pede Caminho.
3. Salvar. A tela não aparece para ninguém.
4. Configurações › Interface › **Menus**: escolher a tela no campo "Screen" (com nome em inglês) e pôr numa seção.
5. O membro vê a tela no menu lateral.

## A casca da tela, item por item

Copiada do protótipo `galeria-de-casos-de-uso`, que a copiou do develop em 20/10/2026.

| Parte | Como está | Muda aqui? |
|---|---|---|
| Topo do menu | Avatar do workspace, nome, slug, seta | Não |
| Busca | "Buscar...", Ctrl K | Não |
| Membro | Início, Spaceflows, Categorias, Tarefas, Agenda, Knowledge | **Sim:** entra Requisições, com 3 telas e contador |
| Seção nova | (não existe) | **Sim:** "Tipos de menu", 1 menu de cada tipo |
| Configurações | Visão Geral, Sistema, Estrutura, Gestão de Membros, Interface, E-mails, Integrações, Agentes de IA, Logs | **Sim:** Interface perde a tela Telas (decisão do `menu-lateral`) |
| Ajuda | Releases, Documentação | Não |
| Barra do topo | Recolher, voltar, avançar, recarregar, início, trilha, Ctrl B, estrela, idioma, tema, Suporte, sino, avatar | Não |
| Trilha | workspace › seção › tela | Não |

## Achados na casca (ficam como estão)

- A seção Membro mistura item que abre (Início, Agenda) e item que expande (Categorias, Tarefas, Knowledge) com o mesmo estilo; só a seta diferencia.
