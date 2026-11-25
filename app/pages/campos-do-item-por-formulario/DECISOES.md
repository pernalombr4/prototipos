# Decisões: campos do item com 1 formulário

## A proposta em uma linha

As 3 opções da demanda, lado a lado com a tela de hoje, na mesma lista e no mesmo item. A pesquisa recomenda a **Opção 1**: a Visão Geral mostra todos os campos em qualquer porta, e o recorte por formulário fica na pasta do tipo Formulário, que já existe.

## O que cada solução faz em cada porta

| Solução | Página "Todos" | Página do formulário | Tela dedicada | Como ver o recorte ou o resto |
|---|---|---|---|---|
| Hoje | só os campos do formulário | só os campos do formulário | só os campos do formulário | não há; com 2 ou mais formulários, um seletor sem "Todos os campos" |
| Opção 1 | todos os campos | todos os campos | todos os campos | pasta do tipo Formulário, com o aviso "Esta pasta exibe 3 de 10 campos" |
| Opção 2 | todos os campos | abre na pasta automática do formulário | todos os campos | a pasta automática, marcada "Automática", e a pasta do tipo Formulário |
| Opção 3 | todos os campos | só os campos do formulário | todos os campos | seletor "Exibir" na Visão Geral, com a contagem "3 de 10 campos" |

Chave "Complementos da pesquisa", nas Opções 1, 2 e 3, quando a Visão Geral mostra todos os campos:

- os campos do formulário de origem vêm primeiro, sob "Campos do formulário Pedido rápido", e o resto sob "Outros campos da categoria";
- os campos vazios ficam recolhidos atrás de "Mostrar 3 campos vazios".

## Rodada 1 · 2026-11-25

- **Pedido (literal):** "use /prototipo pra colocar em um único protótipo a demonstraçao de cada uma das soluçoes"; "pra entender melhor como é hoje e o problema apontado, use /investigar-codigo e analise a experiencia em develop tambem, ok?"; "avalie as proprias soluçoes que oferecemos vendo como isso funciona em outros sistemas que trabalham com formularios. o twenty crm é uma excelente pesquisa pra isso. deve ser analisado no uso mesmo"
- **Mudou:** protótipo novo, com 1 porta: a lista da categoria com o item na barra lateral
- **Mudou:** andaime com a solução (Hoje, Opção 1, 2 e 3), a porta (Todos, página do formulário, tela dedicada) e a chave dos complementos; solução, porta e chave vão para o endereço
- **Mudou:** o protótipo abre no item criado sem formulário, que é o caso que mais confunde hoje; clicar numa linha abre outro item
- **Mudou:** a página do formulário lista só os itens criados por ele, com as colunas dele, como no develop
- **Mudou:** o modal "Nova pasta" cria a pasta do tipo Formulário de verdade, em memória, para todos os itens da categoria
- **Fronteira:** muda o que a Visão Geral mostra, o seletor "Exibir" (Opção 3), a pasta automática (Opção 2), o aviso da pasta de formulário e os complementos; não muda a casca, a lista, o painel do item, as pastas do sistema, o modal "Nova pasta" nem o desenho de cada campo
- **Descartado:** fechar a pasta automática com um "x" na aba. Motivo: botão dentro do botão da aba é HTML inválido; a pasta some sozinha quando o item abre por outra porta
- **Descartado:** escrever a barra de pastas à mão. Motivo: o `UTabs` cobre a barra com `variant="link"`, o `badge` da aba ("Automática") e o slot `list-trailing` para o "+N"
- **Não deu:** confirmar se a pasta automática da Opção 2 deve abrir já selecionada. Por quê: a demanda diz "criada automaticamente", sem dizer se abre nela; o protótipo abre nela, para manter o contexto da origem, e a Visão Geral continua completa na 1ª aba
- **Maquete:** salvar, criar pasta e trocar de item mexem só na memória (o recarregar volta ao começo); Comentários, Logs de Auditoria e Tarefas não têm conteúdo; Ícone e Grupos Permitidos do modal não fazem nada; a busca e os ícones da lista não filtram
- **Crítica e acessibilidade:** as skills `design:design-critique` e `design:accessibility-review` não rodaram nesta rodada. Conferência à mão, no Chrome, em claro, escuro, PT, EN e ES:
  - cada campo tem rótulo ligado à entrada (`UFormField` com `id`); o seletor "Exibir" também;
  - a contagem "3 de 10 campos" e a linha do andaime avisam o leitor de tela na troca (`aria-live`);
  - as pastas usam `role=tablist` e `role=tab` do `UTabs`, com setas do teclado;
  - Esc fecha a barra lateral; o fundo esmaecido é um botão "Fechar item";
  - sem correção: a barra lateral é `role=dialog` sem prender o foco, como a do produto, e o `UTabs` com `content=false` não gera `role=tabpanel`;
  - sem correção: em espanhol, o andaime quebra em 3 linhas e cobre a parte de baixo da lista; é andaime, não proposta
- **Ver:** <https://pernalombr4.github.io/prototipos/campos-do-item-por-formulario/> · `evidencias/proposta-hoje.jpg`, `proposta-opcao-1.jpg`, `proposta-opcao-1-complementos.jpg`, `proposta-opcao-2.jpg`, `proposta-opcao-3.jpg`

### Perguntas para decidir

1. **Qual opção segue.** A pesquisa sustenta a 1; a 2 e a 3 não têm precedente nos 11 produtos olhados.
2. **Os complementos entram junto.** Agrupar pelo formulário de origem e recolher vazios resolvem a tela longa da categoria com muitos campos.
3. **A gravação acompanha.** Hoje, ao salvar, o servidor aceita só os campos do formulário usado. Com a Visão Geral completa, a gravação precisa aceitar todos os campos que a pessoa pode editar.
4. **Permissão de campo.** A Visão Geral completa precisa esconder o campo que a pessoa não pode ver, se o ENSPACE tiver essa regra.

### CSS próprio

Nenhum. `grep -n "<style\|:deep(\|!important"` não acha nada na pasta.
