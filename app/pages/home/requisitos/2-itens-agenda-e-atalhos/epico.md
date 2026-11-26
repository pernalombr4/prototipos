# Épico: Widgets de itens, agenda, atalhos e comunicação na Home

**O que é:** o catálogo da Home ganha os widgets dos itens que a pessoa criou, dos itens mais novos, dos compromissos
do dia, dos atalhos, das telas abertas por último, do e-mail, do WhatsApp e do SMS. Todos leem o que o produto já
guarda ou abrem o que ele já tem: o autor do item, a data de criação, as fontes da tela Agenda, os favoritos, o
histórico de navegação, os e-mails enviados de um item, a central E-mails e o painel "Enviar SMS".

**Onde vale:** a Home do workspace e os grupos Agenda, Itens e categorias, Telas e atalhos e Comunicação do catálogo.

**Protótipo:** https://pernalombr4.github.io/prototipos/home, com "Proposta completa" em "Versão". A troca de idioma do protótipo mostra os textos em português, inglês e espanhol. A barra de baixo é
ferramenta de revisão e não entra no produto.

**Fora do escopo:** a contagem de itens por categoria e as tarefas que a pessoa delegou, que pedem dado novo (épico
Widgets com dado novo).

**Relevância** (coluna das tarefas): Obrigatório, o dev faz. Desejável, o dev faz; se achar melhor não fazer,
conversa com produtos antes. Opcional, o dev pode não fazer quando o esforço é grande para o ganho.

## As partes

| Parte | O que entrega | Depende de | Por que nesta ordem |
|---|---|---|---|
| [1. Compromissos do dia](parte-1-compromissos-do-dia.md) | O widget com o que há hoje na Agenda: compromisso do calendário, prazo de tarefa e data de item | o épico Home em widgets, com Categorias e tarefas | Junta as fontes que a tela Agenda já lê |
| [2. Meus itens e itens recentes](parte-2-meus-itens-e-recentes.md) | Os widgets Meus itens e Itens criados recentemente | o épico Home em widgets, com Categorias e tarefas | Usa o filtro "Meus Itens" que a busca de itens já tem |
| [3. Atalhos e Recentes](parte-3-atalhos-e-recentes.md) | Os favoritos da pessoa e as telas abertas por último | o épico Home em widgets, com Categorias e tarefas | Os 2 já ficam no navegador |
| [4. Agenda da semana e do mês](parte-4-agenda-da-semana-e-do-mes.md) | A semana em colunas e o mês em miniatura | 1 | Repete visões da tela Agenda |
| [5. E-mail, WhatsApp e SMS](parte-5-email-whatsapp-e-sms.md) | O widget E-mail, com os e-mails enviados de um item, e os widgets WhatsApp e SMS, cada um com o número e o botão; os 3 fora da Home padrão | o épico "Escrever e-mail de qualquer tela e central E-mails no menu" | Abre a central E-mails e o painel "Enviar SMS" daquele épico; fica por último |

## Regras de negócio comuns (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN901 | Um item só aparece nos widgets da Home se a pessoa tem acesso à categoria do item. | O item de Contratos não aparece em Itens criados recentemente para quem não acessa Contratos. | Obrigatório |
| RN902 | A data de item que entra na agenda é o campo de data que a Agenda da categoria usa, sem filtro de pessoa, como a tela Agenda faz hoje. | A categoria sem campo de data configurado na Agenda não leva item para os widgets de agenda. | Obrigatório |

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
