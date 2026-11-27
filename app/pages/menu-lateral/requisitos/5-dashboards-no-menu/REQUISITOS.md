# Requisitos: dashboard de itens no menu da categoria

**Objetivo:** cada dashboard de itens fica ligado a 1 categoria. Análise > Dashboards continua a tela central de todos
os dashboards, e a chave "No menu da categoria" põe o dashboard no menu, abaixo da categoria, como tela separada.

**Onde vale:** Análise > Dashboards, as categorias do menu (em Categorias e em Favoritos) e o botão direito de cada categoria.

**Protótipo:** https://pernalombr4.github.io/prototipos/menu-lateral/, cenário "Em uso", Análise > Dashboards, aprovado
em 2026-11-27. Os textos em português, inglês e espanhol estão no protótipo, pelo seletor de idioma.

**Depende de:** o épico Menu em trilha e painel, com a área Análise e a tela Dashboards.

**Fora do escopo:** criar e editar o dashboard, que são os do produto; o dashboard dentro de um menu que o workspace
criou (P001).

**Relevância** (coluna das tarefas): Obrigatório, o dev faz. Desejável, o dev faz; se achar melhor não fazer,
conversa com produtos antes. Opcional, o dev pode não fazer quando o esforço é grande para o ganho.

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN001 | Cada dashboard de itens mostra os itens de 1 categoria. | "Contratos por status" mostra os itens de Contratos. | Obrigatório |
| RN002 | Tirar um dashboard do menu não exclui o dashboard: o dashboard continua em Análise > Dashboards. | Tirar "Contratos por status" do menu deixa a linha em Análise > Dashboards. | Obrigatório |
| RN003 | Só quem tem licença Owner ou Full põe e tira dashboard do menu da categoria. | Membro com licença Basic vê a chave desligada. | Obrigatório |
| RN004 | O dashboard no menu só aparece para quem pode abrir o dashboard pelos grupos de acesso dele. | Dashboard restrito ao grupo Comercial não aparece no menu de quem está fora do grupo. | Obrigatório |

## Categoria do dashboard (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF001 | O sistema deve guardar a categoria de cada dashboard de itens (RN001). | Abrir "Contratos por status" mostra os itens de Contratos. | Essencial | Obrigatório |
| RF002 | Análise > Dashboards deve ter a coluna "Categoria", com o nome da categoria de cada dashboard. | A linha "Contratos por status" mostra Contratos na coluna. | Essencial | Obrigatório |
| RF003 | Sem categoria no workspace, Análise > Dashboards deve mostrar o estado vazio com "O dashboard mostra os itens de uma categoria. Crie a primeira categoria para criar um dashboard." | Workspace novo: o texto aparece no lugar da lista. | Importante | Obrigatório |
| RF004 | Análise > Dashboards deve ter a coluna "Criado por", com quem criou cada dashboard. | A linha "Contratos por status" mostra quem a criou. | Desejável | Desejável |

## Pôr e tirar do menu (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF011 | Análise > Dashboards deve ter a coluna "No menu da categoria", com uma chave em cada linha. | Cada linha tem a chave, ligada ou desligada. | Essencial | Obrigatório |
| RF012 | Ligar a chave deve pôr o dashboard no menu, abaixo da categoria dele, no 3º nível, e avisar "<dashboard> aparece no menu, abaixo de <categoria>." | Ligar "Contratos por status": a linha aparece abaixo de Contratos, e o aviso aparece. | Essencial | Obrigatório |
| RF013 | Desligar a chave deve tirar o dashboard do menu (RN002) e avisar "<dashboard> saiu do menu. O dashboard continua em Análise > Dashboards." | Desligar: a linha sai do menu, e o dashboard continua na lista. | Essencial | Obrigatório |
| RF014 | Análise > Dashboards deve mostrar, abaixo da lista, "Remover um dashboard do menu não o exclui. Ele continua nesta lista." | O texto aparece abaixo da lista. | Desejável | Desejável |
| RF015 | O botão direito de uma categoria deve ter "Dashboards no menu", com a lista dos dashboards da categoria para marcar e desmarcar. | Marcar um dashboard na lista o põe abaixo da categoria; desmarcar o tira. | Importante | Obrigatório |
| RF016 | A lista "Dashboards no menu" deve terminar com "Novo dashboard", que cria um dashboard da categoria e abre a tela dele. | "Novo dashboard" em Contratos cria "Dashboard de Contratos" e abre a tela dele. | Importante | Desejável |
| RF017 | Se a pessoa não cumpre a RN003, a chave e "Dashboards no menu" devem aparecer desligados, com "Só quem configura o workspace". | Membro com licença Basic: a chave aparece desligada. | Essencial | Obrigatório |

## O dashboard no menu (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF021 | Clicar no dashboard abaixo da categoria deve abrir a tela do dashboard. | Clicar em "Contratos por status" no menu abre o dashboard. | Essencial | Obrigatório |
| RF022 | A trilha do topo deve mostrar workspace > Categorias > categoria > dashboard. | Com "Contratos por status" aberto, a trilha termina em Contratos > Contratos por status. | Importante | Obrigatório |
| RF023 | O botão direito no dashboard do menu deve ter "Abrir" e "Tirar do menu"; "Tirar do menu" faz o que RF013 faz. | "Tirar do menu" no botão direito desliga a chave em Análise > Dashboards. | Importante | Obrigatório |
| RF024 | O sistema deve mostrar o dashboard no menu só para quem cumpre a RN004. | Membro fora do grupo Comercial não vê o dashboard restrito abaixo da categoria. | Essencial | Obrigatório |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver | Relevância |
|---|---|---|---|
| RI001 | Listar dashboards | Deve devolver, de cada dashboard, a categoria e se está no menu da categoria. Rota <a definir>. | Obrigatório |
| RI002 | Pôr e tirar do menu | Deve receber o dashboard e o estado da chave, e recusar quem não cumpre a RN003. Rota <a definir>. | Obrigatório |

## Padrão de qualidade

| Tema | O que se espera |
|---|---|
| Idiomas | Cada texto existe em português, inglês e espanhol, com plural e número do dicionário de textos. Nenhum texto estoura o espaço. |
| Temas | A tela funciona em cada tema do produto, só com as cores do tema. Texto com contraste de 4,5:1. |
| Chamada à API | Carregamento na chave clicada, esqueleto enquanto a lista carrega e aviso de erro com "Tentar de novo". Depois de cada alteração, a tela recarrega o dado. |
| Avisos | Cada alteração mostra um toast de confirmação, e cada erro mostra um aviso. O texto de cada um está no protótipo. |
| Animação | Entrada, hover e troca de estado seguem o padrão de animação do produto. Com `prefers-reduced-motion`, nada anima. |
| Acessibilidade | Cada chave tem nome acessível com o nome do dashboard, e o foco é visível no teclado. |
| Visual | Medida, cor, espaçamento, ícone e texto seguem o protótipo, no computador e no celular. Texto sem travessão. |
| Documentação | A documentação de suporte cobre a funcionalidade antes do lançamento. |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P001 | O dashboard pode ir para um menu que o workspace criou, além da categoria? O pedido diz "categoria ou personalizado"; o protótipo só tem a porta da categoria. | produto | Um grupo de requisitos com a porta no menu do workspace. |
| P002 | O dashboard no menu da categoria vale para cada membro ou só para quem pôs? O protótipo trata como mudança do workspace. | produto | Com "só para quem pôs", a chave vira preferência pessoal do épico Personalizar o meu menu, e a RN003 sai. |
| P003 | O dashboard que existe hoje sem categoria recebe qual categoria? | produto e dev | Um requisito de transição para os dashboards de hoje. |
