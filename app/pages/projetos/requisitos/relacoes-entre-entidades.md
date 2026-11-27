# Requisitos: relações entre projeto, meta, marco, tarefa, item e discussão

**Objetivo:** cada ligação entre as entidades de Projetos se edita dos 2 lados, conta certo na meta e no marco e não
fica apontando para algo que saiu do projeto ou foi excluído.

**Onde vale:** tela Metas, página do projeto (Visão geral, Itens, Tarefas, Marcos, Discussões), painel da tarefa,
painel do marco, painel do item, janela Nova tarefa, Mover categoria e Configurações do projeto.

**Protótipo:** https://pernalombr4.github.io/prototipos/projetos/, rodada 14. Os textos nos 3 idiomas estão em
`app/pages/projetos/textosDasRelacoes.ts`.

**Fora do escopo:** convidar para o projeto alguém de fora do workspace; discussão dentro da meta; marcos no modelo de
projeto.

**Relevância:** Obrigatório, o dev faz. Desejável, o dev faz; se achar melhor não fazer, conversa com produtos antes.
Opcional, o dev pode não fazer quando o esforço é grande para o ganho.

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN001 | O andamento da meta medida pelos marcos é calculado como a média do andamento dos marcos ligados à meta que contam (RN006). | Meta com 4 marcos em 20%, 33%, 33% e 0%: andamento de 22%. | Obrigatório |
| RN002 | Ligar um projeto a uma meta liga os marcos que o projeto tem naquele momento. | Financeiro com 3 marcos ligado à meta: os 3 entram na lista de marcos da meta. | Obrigatório |
| RN003 | Cada marco criado num projeto ligado com "Incluir marcos novos" deve entrar nas metas dessa ligação. | Marco "Auditoria de dezembro" criado no Financeiro entra em "Fechar 2026 sem pendência fiscal". | Obrigatório |
| RN004 | Cada tarefa do projeto deve guardar o projeto. Trocar o item da tarefa ou mover a categoria do item não muda o projeto da tarefa. | Tarefa do Financeiro ligada a um item de Contratos, categoria do workspace, continua no Financeiro. | Obrigatório |
| RN005 | Uma subtarefa fica no marco da tarefa-mãe. O marco conta só as tarefas-mãe. | Marco com 1 tarefa-mãe de 3 subtarefas conta 1 tarefa. | Obrigatório |
| RN006 | Um marco aberto de projeto arquivado não conta na meta. O marco concluído continua contando. | Obra Aurora arquivado: "Entrega do bloco B", aberto, sai da média. | Desejável |
| RN007 | O responsável e os colaboradores de tarefa, subtarefa e marco devem ter acesso ao projeto. | Júlia Ferraz, sem acesso ao Financeiro, passa a participar ao virar responsável de uma tarefa dele. | Obrigatório |
| RN008 (em revisão) | Só pode ligar um projeto a uma meta quem edita a meta ou administra o projeto. | Administrador do Financeiro liga o projeto a uma meta de que não é dono. | Desejável |
| RN009 | Uma mensagem de discussão pode originar 0 ou mais tarefas, sem limite. | Mensagem com 2 tarefas criadas lista as 2. | Desejável |
| RN010 | Uma discussão trata de no máximo 1 marco ou 1 item do mesmo projeto. | Discussão "Checklist da auditoria" sobre o marco "Auditoria de dezembro". | Opcional |

## Marco e meta (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF001 | O formulário de criar e de editar marco deve ter o campo "Metas", múltiplo, com as metas medidas pelos marcos. | O campo não lista a meta medida por valor. | Essencial | Obrigatório |
| RF002 | Quando o marco é novo, o sistema deve preencher "Metas" com as metas que incluem os marcos novos do projeto (RN003). | Exemplo: Novo marco no Financeiro já vem com "Fechar 2026 sem pendência fiscal". | Essencial | Obrigatório |
| RF003 | O painel do marco deve ter a seção "Conta para", que mostra e edita as metas do marco. | Tirar a meta em "Conta para" tira o marco da lista de marcos no painel da meta. | Essencial | Obrigatório |
| RF004 | No painel da meta, cada projeto ligado deve mostrar quantos marcos dele estão na meta e o interruptor "Incluir marcos novos". | Desligar o interruptor e criar um marco no projeto: o marco não entra na meta. | Essencial | Obrigatório |
| RF005 | No painel da meta, cada marco deve sair da meta pelo X, inclusive o que entrou pelo projeto. | Tirar 1 marco do Financeiro mantém o projeto e os outros marcos dele na meta. | Essencial | Obrigatório |
| RF006 | Quando o projeto sai da meta, o sistema deve tirar da meta os marcos desse projeto. | Tirar o Financeiro da meta tira os 3 marcos dele da lista. | Essencial | Obrigatório |
| RF007 | O seletor de tarefas do marco e o campo Marco do painel da tarefa devem listar só tarefas-mãe (RN005). | A subtarefa mostra o marco da mãe, só para leitura. | Essencial | Obrigatório |

## Projeto e meta (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF101 | A seção Metas da Visão geral do projeto deve ter o botão "Ligar a uma meta", que abre a escolha da meta e a caixa "Incluir marcos novos". | Exemplo: Financeiro ligado a "Crescer 20% a carteira de obras"; toast "Financeiro ligado à meta Crescer 20% a carteira de obras". | Importante | Desejável |
| RF102 | O botão "Ligar a uma meta" só deve aparecer quando existe meta sem o projeto que a pessoa pode ligar (RN008). | Sem meta disponível, o botão não aparece. | Importante | Desejável |

## Tarefa, item e categoria (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF201 | O seletor de categoria da janela Nova tarefa e o campo Item do painel da tarefa devem listar também as categorias do workspace que a pessoa vê, com a marca "Do workspace". | Exemplo: Contratos e Clientes aparecem na Nova tarefa do Financeiro. | Essencial | Obrigatório |
| RF202 | O painel da tarefa deve mostrar o projeto da tarefa (RN004) em "Neste projeto". | Tarefa do Financeiro ligada a item de Contratos mostra "Financeiro". | Essencial | Obrigatório |
| RF203 | O painel do item, na aba Itens do projeto, deve ter a seção "Tarefas do item" com as tarefas ligadas ao item. | Clicar na tarefa abre o painel da tarefa. | Importante | Desejável |
| RF204 | O botão "Criar tarefa" da seção "Tarefas do item" deve abrir a janela Nova tarefa com a categoria e o item preenchidos. | Exemplo: no item CP4204, a Nova tarefa vem com Contas a pagar e CP4204. | Importante | Desejável |
| RF205 | A confirmação de Mover categoria deve dizer quantas tarefas ligadas a itens da categoria continuam no projeto delas, com o marco que têm (RN004). | Exemplo: "6 tarefas ligadas a itens desta categoria continuam no projeto delas, com o marco que têm." | Essencial | Obrigatório |
| RF206 | A confirmação de Mover categoria deve dizer quantos painéis de dashboard de outro projeto leem a categoria. | Exemplo: "1 painel de dashboard de outro projeto lê esta categoria e sai do dashboard." | Importante | Desejável |
| RF207 | Quando a categoria sai do projeto, o sistema deve tirar dos dashboards de outros projetos os painéis que leem essa categoria. | Depois de mover, o dashboard do outro projeto não tem o painel. | Importante | Desejável |

## Discussão e tarefa (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF301 | Cada mensagem deve mostrar as tarefas criadas a partir dela (RN009). | Clicar na tarefa fecha a discussão e abre o painel da tarefa. | Importante | Desejável |
| RF302 | O botão "Criar tarefa" da mensagem deve continuar disponível depois da primeira tarefa criada. | A mesma mensagem cria uma 2ª tarefa. | Importante | Desejável |
| RF303 | O botão "Criar tarefa" da mensagem deve abrir a janela Nova tarefa do projeto, com o texto da mensagem no título e o autor como responsável. | A janela tem categoria e item opcionais, prazo, prioridade e marco, como a Nova tarefa da aba Tarefas. | Importante | Desejável |
| RF304 | A janela Nova tarefa aberta da mensagem deve mostrar a linha "Criada na discussão: <título da discussão>". | Exemplo: "Criada na discussão: Aprovar pagamentos até R$ 500 sem a segunda assinatura". | Importante | Desejável |
| RF305 | O painel da tarefa criada de uma mensagem deve ter o cartão "Criada na discussão", com o título da discussão. | Clicar no título fecha a tarefa e abre a discussão. | Importante | Desejável |
| RF306 | Quando a tarefa é excluída, a mensagem deve deixar de mostrar essa tarefa. | Mensagem com 1 tarefa excluída volta a mostrar só "Criar tarefa". | Essencial | Obrigatório |
| RF307 | O formulário Nova discussão deve ter o campo "Sobre", opcional, com os marcos e os itens do projeto (RN010). | O valor padrão é "Nenhum marco ou item". | Desejável | Opcional |
| RF308 | A linha da discussão na lista e o topo do painel da discussão devem mostrar o marco ou o item escolhido em "Sobre". | Clicar no marco fecha a discussão e abre o painel do marco. | Desejável | Opcional |
| RF309 | O painel do marco deve ter a seção "Discussões sobre o marco". | Clicar na discussão abre o painel dela. | Desejável | Opcional |

## Pessoas e acesso ao projeto (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF401 | Os seletores de responsável e de colaboradores de tarefa, subtarefa e marco devem listar primeiro quem entra no projeto. | Exemplo: no Financeiro, Lívia Prado e Marina Toledo aparecem no 1º grupo. | Essencial | Obrigatório |
| RF402 | Para quem administra o projeto, esses seletores devem listar os outros membros do workspace no grupo "Sem acesso ao projeto". | Para quem não administra, o grupo não aparece. | Essencial | Obrigatório |
| RF403 | Quando a pessoa escolhida está em "Sem acesso ao projeto", o sistema deve incluí-la como participante do projeto ao salvar (RN007). | Exemplo: toast "Júlia Ferraz passou a participar do projeto." | Essencial | Obrigatório |

## Excluir e arquivar projeto (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF501 | Quando o projeto é excluído, o sistema deve excluir os marcos, as discussões, os dashboards e as tarefas sem item dele. | Nenhuma tela mostra marco, discussão, dashboard ou tarefa sem item do projeto excluído. | Essencial | Obrigatório |
| RF502 | Quando o projeto é excluído, as tarefas com item devem ficar no item, sem projeto. | A tarefa continua no item da categoria que voltou para o workspace. | Essencial | Obrigatório |
| RF503 | Quando o projeto é excluído, o sistema deve tirar das metas o projeto e os marcos dele. | A meta recalcula o andamento sem os marcos do projeto excluído. | Essencial | Obrigatório |
| RF504 | A confirmação de excluir o projeto deve mostrar, sob "Ao excluir o projeto:", a contagem de cada coisa de RF501 a RF503. | Exemplo: "3 marcos são excluídos", "12 tarefas com item ficam no item, sem projeto", "2 metas deixam de contar o projeto e os marcos dele". | Essencial | Obrigatório |
| RF505 | No painel da meta, o projeto arquivado deve ter a marca "Arquivado", e o marco aberto dele a marca "Não conta" (RN006). | A dica das marcas diz que os marcos concluídos continuam contando. | Importante | Desejável |

## Meta por valor e situação dos projetos (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF601 | Na meta medida por valor, as seções do painel devem se chamar "Projetos acompanhados" e "Marcos acompanhados", com o texto de que os projetos e os marcos não entram na conta. | Na meta medida pelos marcos, as seções continuam "Projetos" e "Marcos". | Desejável | Opcional |
| RF602 | No painel da meta, cada projeto ligado deve mostrar a situação mais recente do projeto, só para leitura. | Exemplo: Obra Aurora Engenharia com a marca "Atrasado" na meta "No prazo". | Desejável | Opcional |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| S1 | Liga o projeto a uma meta quem edita a meta ou administra o projeto (RN008). | redatora | RN008, RF102 |
| S2 | O marco conta só as tarefas-mãe, e a subtarefa herda o marco da mãe (RN005). A outra conta possível é só as subtarefas quando a mãe tem subtarefas. | redatora | RN005, RF007 |
| S3 | A meta não tem discussão própria; a conversa fica nas atualizações dela. "Sobre" aceita só marco ou item. | redatora | RN010, RF307 |
| S4 | No projeto arquivado, os marcos abertos param de contar e os concluídos continuam (RN006). | redatora | RN006, RF505 |
| P1 | O modelo de projeto passa a levar os marcos, com datas relativas à criação? | redatora | requisito novo em Salvar como modelo |

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
