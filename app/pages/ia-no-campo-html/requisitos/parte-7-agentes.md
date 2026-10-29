# 7. Agentes

**Objetivo:** a pessoa pede a um agente de IA do workspace, em vez do BENI, e o pedido usa o modelo do perfil do
agente.

**Depende de:** 6. Modelo; o cadastro de agentes (Configurações › Agentes de IA).

**Onde vale:** o seletor de agente no rodapé da caixa do BENI, o grupo "Pedir a um agente" da caixa e a barra da
proposta.

**Protótipo:** https://pernalombr4.github.io/prototipos/ia-no-campo-html/, agentes "Assistente Jurídico" e "Revisor de
Contratos".

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN005 | Com um agente escolhido, o modelo do perfil do agente vem marcado; a troca de modelo vale só para o pedido e não altera o perfil do agente. | O Assistente Jurídico usa Claude Opus 4.6; trocar para GPT-5.4 na caixa não muda o cadastro do agente. | Obrigatório |
| RN006 | Só os agentes ativos que a pessoa tem permissão de usar podem aparecer no seletor de agente. | Um agente inativo e um agente restrito à diretoria não aparecem para um membro comum. | Obrigatório |

## Agentes na caixa (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF014 | A caixa deve mostrar o grupo "Pedir a um agente" com até 5 agentes (RN006) e o item "Ver todos os agentes (N)" quando houver mais de 5. | Com 6 agentes disponíveis, aparecem 5 e "Ver todos os agentes (6)". | Importante | Obrigatório |
| RF015 | Cada agente da lista deve mostrar o avatar do BENI com as cores e o acessório do cadastro do agente, o nome e o tipo ("Chat e texto" ou "Revisor"). | O Assistente Jurídico aparece com o avatar azul de capacete e "Chat e texto". | Desejável | Desejável |
| RF037 | O rodapé da caixa deve ter o seletor de agente, com o BENI como padrão e os agentes da RN006. | O seletor abre com "BENI" marcado. | Importante | Obrigatório |
| RF038 | Quando a pessoa escolhe um agente, o sistema deve trocar o placeholder para "Escreva o pedido para <agente>..." e marcar no seletor de modelo o modelo do perfil do agente (RN005). | Escolher o Assistente Jurídico mostra "Claude Opus 4.6" no seletor de modelo, com o selo "do agente". | Importante | Obrigatório |
| RF039 | Quando a pessoa troca o modelo de um agente, o seletor deve mostrar "Só neste pedido. O perfil do agente continua com <modelo>." | Trocar para GPT-5.4 mostra o aviso com "Claude Opus 4.6". | Importante | Obrigatório |
| RF040 | Com um agente do tipo Revisor, a barra da proposta deve listar o que o Revisor mudou. | O Revisor de Contratos mostra a lista das correções feitas. | Desejável | Desejável |
| RF046 | A escolha de agente e de modelo deve continuar valendo nos pedidos seguintes da sessão, nos 2 campos da tela. | Escolher GPT-5.4 no 1º campo e abrir a caixa no 2º mostra GPT-5.4. | Desejável | Desejável |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver | Relevância |
|---|---|---|---|
| RI002 | Lista de agentes do workspace, do cadastro de Configurações › Agentes de IA (rota <a definir>) | Deve devolver só os agentes da RN006, com nome, tipo, descrição, modelo do perfil e aparência do BENI (`beniTheme`). | Obrigatório |
| RI009 | Geração da resposta do BENI | Deve receber o agente escolhido. | Obrigatório |
