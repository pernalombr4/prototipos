# Épico: E-mail ligado à tarefa

**O que é:** o e-mail passa a ter, além do item, uma tarefa vinculada. Quem escreve escolhe a tarefa no compositor, a
Mail Box da tarefa separa os e-mails dela dos do item, e a aba Mensagens e a Mail Box do item mostram a tarefa de cada
e-mail. Hoje a tarefa não tem vínculo com e-mail.

**Onde vale:** o compositor "Nova Mensagem", o painel da tarefa em Tarefas › Rápidas (aba Mail Box), o quadro de
tarefas, a Mail Box do item e a aba Mensagens da central E-mails.

**Protótipo:** https://pernalombr4.github.io/prototipos/comunicacao-no-workspace/, aprovado em 24/11/2026. Na barra de
baixo, escolha "Fase: 3 · Tarefa"; em Tarefas, abra "Enviar minuta assinada à contraparte" (T-1042) e a aba Mail Box.
Os textos nos 3 idiomas estão em `app/pages/comunicacao-no-workspace/textos.ts`.

**Fora do escopo:** o e-mail enviado pelo sistema por uma tarefa, que já mostra "Sistema · <tarefa>" em "Enviado por"
(épico "E-mail com o que o produto já tem"); o vínculo com mais de 1 tarefa.

**Relevância** (coluna das tarefas): Obrigatório, o dev faz. Desejável, o dev faz; se achar melhor não fazer,
conversa com produtos antes. Opcional, o dev pode não fazer quando o esforço é grande para o ganho.

## As partes

| Parte | O que entrega | Depende de | Por que nesta ordem |
|---|---|---|---|
| [1. Vincular a tarefa no compositor](parte-1-vincular-a-tarefa.md) | O campo "Vincular a tarefa", a tarefa vinda da tela de origem e a gravação do vínculo no e-mail | | As outras partes leem o vínculo que esta grava |
| [2. Mail Box da tarefa](parte-2-mail-box-da-tarefa.md) | Os recortes "Desta tarefa" e "Do item" na Mail Box do painel da tarefa | 1 | Mostra os e-mails vinculados na parte 1 |
| [3. A tarefa na aba Mensagens e na Mail Box do item](parte-3-tarefa-na-lista.md) | A coluna, o filtro e o campo Tarefa na aba Mensagens e a referência da tarefa na Mail Box do item | 1 | Mostra o vínculo fora da tarefa; independe da parte 2 |
| [4. Tarefa sem item](parte-4-tarefa-sem-item.md) | O vínculo com a tarefa que não tem item e a Mail Box própria dessa tarefa | 1, 2 | Depende de uma pergunta em aberto e do registro do e-mail sem item; as partes 1 a 3 não esperam por ela |

## Regras de negócio comuns (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN901 | Um e-mail vinculado a uma tarefa pertence à Mail Box da tarefa, além da Mail Box do item. | O e-mail de CTR-00231 vinculado a T-1042 aparece na Mail Box de CTR-00231 e em "Desta tarefa" de T-1042. | Obrigatório |
| RN902 | Cada e-mail tem no máximo 1 tarefa vinculada. | O e-mail vinculado a T-1042 não pode ter também T-1051. | Obrigatório |

## Padrão de qualidade

| Tema | O que se espera |
|---|---|
| Idiomas | Cada texto existe em português, inglês e espanhol, com plural e número do dicionário de textos. Nenhum texto estoura o espaço. |
| Temas | A tela funciona em cada tema do produto, só com as cores do tema. Texto com contraste de 4,5:1. |
| Chamada à API | Carregamento no controle clicado, esqueleto enquanto a lista carrega e aviso de erro com "Tentar de novo". Depois de cada alteração, a tela recarrega o dado. |
| Avisos | Cada alteração mostra um toast de confirmação, e cada erro mostra um aviso. O texto de cada um está no protótipo. |
| Animação | Entrada, hover, troca de estado e abertura de modal seguem o padrão de animação do produto. Com `prefers-reduced-motion`, nada anima. |
| Acessibilidade | Botão só de ícone e caixa de marcar com nome acessível, modal com título e descrição, foco visível no teclado. |
| Visual | Medida, cor, espaçamento, ícone e texto seguem o protótipo, no computador e no celular. Ação clicável fora de texto corrido é botão com borda ou fundo. Texto sem travessão. |
| Documentação | A documentação de suporte cobre a funcionalidade antes do lançamento. |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P901 | A resposta do destinatário a um e-mail vinculado à tarefa ganha a mesma tarefa? No protótipo, o recebido tem a tarefa, mas o envio de hoje liga a resposta só ao item, pelo endereço do item. | dev do back | Sem isso, "Desta tarefa" › Recebidos fica vazio, e a coluna Tarefa só aparece nos enviados |
| P902 | A pessoa vê a referência da tarefa no e-mail mesmo sem permissão de ver a tarefa? | produto | Com restrição, a coluna, o campo e a referência na Mail Box somem para quem não vê a tarefa |
