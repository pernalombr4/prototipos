# 7. Link de formulário público

**Objetivo:** a pessoa copia ou envia o link do formulário público, por e-mail, pelo WhatsApp ou por SMS, onde o formulário está
em uso, sem ir à configuração da categoria.

**Depende de:** 1. Compositor e Novo e-mail na barra do topo.

**Onde vale:** Requisições; a lista de itens da categoria; o painel da tarefa de formulário (Tarefas › Rápidas);
Configurações › Estrutura › Categorias › a categoria › Formulários.

**Protótipo:** https://pernalombr4.github.io/prototipos/comunicacao-no-workspace/. Em Requisições, escolha um
formulário público e um privado; na lista de Contratos, abra "Link de formulário público".

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN601 | Um formulário só tem link público se tiver a visibilidade Público e o tipo Criação ou Geral. | "Solicitação jurídica" (Criação, Público) tem link; "Revisão de contrato" (Editar) e "Pedido de orçamento" (Criação, Privado) não têm. | Obrigatório |
| RN602 | O link público é o de hoje, `/public/<formulário>/Answer`: abre sem login e não expira. A resposta pelo link cria um item na categoria do formulário. | Responder "Nova solicitação" pelo link cria um item em Solicitações. | Obrigatório |
| RN603 | A resposta pelo link público não conclui a tarefa de formulário: a tarefa continua aberta até o responsável preencher e concluir. | A tarefa de formulário T-1050 continua aberta depois da resposta pelo link. | Obrigatório |

## Copiar, abrir e enviar o link (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF601 | "Copiar link" deve copiar o link público e mostrar o aviso "Link copiado", com esse texto em cada tela, inclusive no "Copiar" dos Formulários da categoria. | Copiar em Requisições e nos Formulários da categoria mostra "Link copiado"; "Copiado!" e "Link copiado para a sua área de transferência" saem. | Importante | Obrigatório |
| RF602 | "Abrir numa nova aba" deve abrir a página pública do formulário numa aba nova. | A aba nova mostra o formulário sem login. | Importante | Obrigatório |
| RF603 | "Enviar o link por" deve oferecer os 2 caminhos do atalho, sem item vinculado e com o Para em branco (RN909, RN910). | O compositor abre com o Para vazio; o app abre sem Cc. | Essencial | Obrigatório |
| RF604 | O e-mail do link deve abrir com o assunto "Formulário: <nome>" e o texto "Para preencher o formulário "<nome>", use este link: <link>". | "Formulário: Nova solicitação", com o link no texto. | Importante | Obrigatório |
| RF605 | "Enviar o link por" deve ter também o WhatsApp, que abre o WhatsApp sem número, com o texto "Para preencher o formulário "<nome>", use este link: <link>": a pessoa escolhe a conversa ou o grupo e envia (RN917). | Em Requisições, o WhatsApp abre `https://wa.me/?text=` com o texto e o link de "Solicitação jurídica". | Essencial | Obrigatório |
| RF606 | A dica do WhatsApp deve dizer "Abre o WhatsApp com a mensagem e o link. Escolha a conversa e envie.". | A dica aparece no botão de Requisições e no item do menu da lista de itens. | Importante | Obrigatório |
| RF607 | "Enviar o link por" deve ter também o SMS, depois do WhatsApp, que abre o painel "Enviar SMS" sem número, com o mesmo texto do WhatsApp: a pessoa escolhe o destinatário no app de SMS (RN924). | Em Requisições, o SMS abre o painel com "Você escolhe o destinatário no app de SMS." e o texto com o link de "Solicitação jurídica"; "Abrir no app de SMS" abre `sms:?body=`. | Essencial | Obrigatório |
| RF608 | A dica do SMS deve dizer "Abre as opções de SMS com a mensagem e o link. Escolha o destinatário e envie.". | A dica aparece no botão de Requisições e no item do menu da lista de itens. | Importante | Obrigatório |

## Onde o link aparece (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF611 | Em Requisições, com um formulário público escolhido (RN601), o cartão "Compartilhar este formulário" deve aparecer entre o seletor e o formulário, com o link, "Copiar link", "Abrir numa nova aba" e "Enviar o link por". | Escolher "Solicitação jurídica" mostra o cartão acima dos campos. | Essencial | Obrigatório |
| RF612 | Em Requisições, com um formulário privado escolhido, a tela deve mostrar a linha "Formulário privado: só membros do workspace respondem. Por isso não tem link para enviar." no lugar do cartão. | Escolher "Pedido de orçamento" mostra a linha, sem o cartão. | Importante | Obrigatório |
| RF613 | A lista de itens deve ter o botão "Link de formulário público" ao lado de "Novo registro", com os formulários públicos da categoria (RN601), cada um com copiar e enviar por e-mail, por WhatsApp e por SMS. | Em Solicitações, o menu lista "Nova solicitação" com copiar, e-mail, WhatsApp e SMS. | Essencial | Obrigatório |
| RF614 | Na categoria sem formulário público, o menu do botão deve mostrar "Nenhum formulário público", a explicação e "Ver formulários", que abre os Formulários da categoria. | Em Contratos, sem formulário público, o menu mostra o vazio e "Ver formulários". | Importante | Obrigatório |
| RF615 | O painel da tarefa de formulário com formulário público deve mostrar o cartão "Compartilhar este formulário" e a linha "A resposta pelo link cria um item novo em <categoria>. Esta tarefa continua aberta até você concluí-la." (RN603). | T-1049 mostra o cartão e a linha com "Solicitações". | Essencial | Obrigatório |
| RF616 | O menu da linha dos Formulários da categoria deve ganhar "Tornar público" no formulário privado e "Tornar privado" no público, que mudam a visibilidade como o Editar › Visibilidade de hoje. | "Tornar privado" em "Nova solicitação" deixa o formulário privado, e o link some de Requisições. | Importante | Obrigatório |
| RF617 | No formulário privado, o "Copiar" do menu da linha deve ficar indisponível com o motivo "Só formulário público tem link". | O menu de "Cadastro interno" mostra "Copiar" cinza com o motivo. | Desejável | Desejável |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver | Relevância |
|---|---|---|---|
| RI601 | Link público do formulário, `/public/<formulário>/Answer` | O link que existe hoje, sem mudança: abre a página pública do formulário sem login. | Obrigatório |
