# 7. Link de formulário público

**Objetivo:** a pessoa copia ou envia o link do formulário público onde o formulário está em uso, sem ir à configuração
da categoria.

**Depende de:** 1. Compositor e Novo e-mail na barra do topo.

**Onde vale:** Requisições; a lista de itens da categoria; o painel da tarefa de formulário (Tarefas › Rápidas);
Configurações › Estrutura › Categorias › a categoria › Formulários.

**Protótipo:** https://pernalombr4.github.io/prototipos/comunicacao-no-workspace/. Em Requisições, escolha um
formulário público e um privado; na lista de Contratos, abra "Link de formulário público".

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN601 | Um formulário só tem link público se tiver a visibilidade Público e o tipo Criação ou Geral. | "Nova solicitação" (Criação, Público) tem link; "Revisão do contrato" (Editar, Público) e "Cadastro interno" (Criação, Privado) não têm. | Obrigatório |
| RN602 | O link público é o de hoje, `/public/<formulário>/Answer`: abre sem login e não expira. A resposta pelo link cria um item na categoria do formulário. | Responder "Nova solicitação" pelo link cria um item em Solicitações. | Obrigatório |
| RN603 | A resposta pelo link público não conclui a tarefa de formulário: a tarefa continua aberta até o responsável preencher e concluir. | A tarefa de formulário T-1050 continua aberta depois da resposta pelo link. | Obrigatório |

## Copiar, abrir e enviar o link (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF601 | "Copiar link" deve copiar o link público e mostrar o aviso "Link copiado", com esse texto em cada tela, inclusive no "Copiar" dos Formulários da categoria. | Copiar em Requisições e nos Formulários da categoria mostra "Link copiado"; "Copiado!" e "Link copiado para a sua área de transferência" saem. | Importante | Obrigatório |
| RF602 | "Abrir numa nova aba" deve abrir a página pública do formulário numa aba nova. | A aba nova mostra o formulário sem login. | Importante | Obrigatório |
| RF603 | "Enviar o link por" deve oferecer os 2 caminhos do atalho, sem item vinculado e com o Para em branco (RN909, RN910). | O compositor abre com o Para vazio; o app abre sem Cc. | Essencial | Obrigatório |
| RF604 | O e-mail do link deve abrir com o assunto "Formulário: <nome>" e o texto "Para preencher o formulário "<nome>", use este link: <link>". | "Formulário: Nova solicitação", com o link no texto. | Importante | Obrigatório |

## Onde o link aparece (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF611 | Em Requisições, com um formulário público escolhido (RN601), o cartão "Compartilhar este formulário" deve aparecer entre o seletor e o formulário, com o link, "Copiar link", "Abrir numa nova aba" e "Enviar o link por". | Escolher "Nova solicitação" mostra o cartão acima dos campos. | Essencial | Obrigatório |
| RF612 | Em Requisições, com um formulário privado escolhido, a tela deve mostrar a linha "Formulário privado: só membros do workspace respondem. Por isso não tem link para enviar." no lugar do cartão. | Escolher "Cadastro interno" mostra a linha, sem o cartão. | Importante | Obrigatório |
| RF613 | A lista de itens deve ter o botão "Link de formulário público" ao lado de "Novo registro", com os formulários públicos da categoria (RN601), cada um com copiar e enviar. | Em Solicitações, o menu lista "Nova solicitação" com os botões de copiar e de enviar. | Essencial | Obrigatório |
| RF614 | Na categoria sem formulário público, o menu do botão deve mostrar "Nenhum formulário público", a explicação e "Ver formulários", que abre os Formulários da categoria. | Em Fornecedores, sem formulário público, o menu mostra o vazio e "Ver formulários". | Importante | Obrigatório |
| RF615 | O painel da tarefa de formulário com formulário público deve mostrar o cartão "Compartilhar este formulário" e a linha "A resposta pelo link cria um item novo em <categoria>. Esta tarefa continua aberta até você concluí-la." (RN603). | T-1050 mostra o cartão e a linha com "Solicitações". | Essencial | Obrigatório |
| RF616 | O menu da linha dos Formulários da categoria deve ganhar "Tornar público" no formulário privado e "Tornar privado" no público, que mudam a visibilidade como o Editar › Visibilidade de hoje. | "Tornar privado" em "Nova solicitação" deixa o formulário privado, e o link some de Requisições. | Importante | Obrigatório |
| RF617 | No formulário privado, o "Copiar" do menu da linha deve ficar indisponível com o motivo "Só formulário público tem link". | O menu de "Cadastro interno" mostra "Copiar" cinza com o motivo. | Desejável | Desejável |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver | Relevância |
|---|---|---|---|
| RI601 | Link público do formulário, `/public/<formulário>/Answer` | O link que existe hoje, sem mudança: abre a página pública do formulário sem login. | Obrigatório |
