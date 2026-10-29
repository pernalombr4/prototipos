# 9. Sem en-credits

**Objetivo:** quando os en-credits do workspace acabam, a caixa do BENI avisa e oferece a chave de uma conta própria;
o pedido feito nesse meio-tempo espera e roda assim que a chave é conectada.

**Depende de:** 6. Modelo; 8. Chaves de IA do workspace.

**Onde vale:** a caixa do BENI e o seletor de modelo, com o workspace sem en-credits.

**Protótipo:** https://pernalombr4.github.io/prototipos/ia-no-campo-html/, estado "Sem en-credits".

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN007 | A tabela a seguir define se o pedido responde, conforme os en-credits e a chave. Política: Única. | Linha 3: sem en-credits, modelo GPT-5.4 e chave da OpenAI conectada: responde, cobrado na conta OpenAI. | Obrigatório |

Tabela da RN007:

| Linha | en-credits | Modelo escolhido | Chave da conta do modelo | Resultado |
|---|---|---|---|---|
| 1 | com saldo | qualquer modelo ou Auto | conectada | responde, cobrado na conta da empresa |
| 2 | com saldo | qualquer modelo ou Auto | não conectada | responde, cobrado em en-credits |
| 3 | sem saldo | modelo de uma empresa | conectada | responde, cobrado na conta da empresa |
| 4 | sem saldo | modelo de uma empresa | não conectada | não responde; mostra o aviso de en-credits (RF058) |
| 5 | sem saldo | Auto | ao menos 1 conta conectada | responde com modelo de conta conectada (RN008) |
| 6 | sem saldo | Auto | nenhuma conta conectada | não responde; mostra o aviso de en-credits (RF058) |

## Aviso e pedido que espera (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF058 | Enquanto o workspace está sem en-credits e o modelo escolhido não pode responder (RN007, linhas 4 e 6), a caixa do BENI deve mostrar no topo o aviso "Os en-credits do workspace acabaram". | No estado "Sem en-credits" do protótipo, abrir a caixa mostra o aviso acima do campo de pedido. | Essencial | Obrigatório |
| RF059 | Com "Auto", o aviso deve dizer "Para seguir usando a IA, conecte a chave de uma conta própria. O consumo passa a ser cobrado nessa conta." e ter o botão "Usar a chave de uma conta própria", que abre o modal na lista de contas. | Clicar no botão abre o modal com os cartões. | Essencial | Obrigatório |
| RF060 | Com um modelo de uma empresa (escolhido ou do agente), o aviso deve dizer "O <modelo> usa en-credits. Para seguir com ele, conecte a chave da conta <empresa>." e ter o botão "Conectar a chave da conta <empresa>", que abre o modal no passo da chave dessa conta. | Com o Revisor de Contratos (GPT-5.4), o botão abre direto o passo da chave da OpenAI. | Essencial | Obrigatório |
| RF061 | Quando outra conta já tem chave, o aviso de um modelo sem chave deve acrescentar "Ou escolha em Modelo um modelo de uma conta com chave: <contas>.". | Com a chave da Anthropic e o modelo GPT-5.4, o aviso cita "Claude". | Importante | Obrigatório |
| RF062 | Quando a pessoa pede uma ação sem poder responder (RN007), o sistema deve guardar a ação, mostrar no aviso "Ao conectar, o BENI faz o que você pediu: <ação>." e deixar o campo como está. | Pedir "Resumir o campo" sem en-credits mostra a linha no aviso, e nenhuma proposta aparece. | Essencial | Obrigatório |
| RF063 | Quando a pessoa conecta a chave que permite responder e volta ao campo, o sistema deve executar a ação guardada. | Conectar a chave da Anthropic e voltar gera o resumo com "Auto: Claude Sonnet 4.6 (conta Anthropic)". | Essencial | Obrigatório |
| RF064 | Enquanto o workspace está sem en-credits, cada modelo sem chave deve mostrar "Sem en-credits" no seletor de modelo, no lugar do consumo. | No estado "Sem en-credits" do protótipo, o GPT-5.4 mostra "Sem en-credits". | Importante | Obrigatório |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver | Relevância |
|---|---|---|---|
| RI005 | Saldo de en-credits do workspace (rota <a definir>) | Deve informar se o workspace está sem en-credits, para a RN007. | Obrigatório |

## Não funcionais (RNF)

| ID | Requisito | Como medir ou conferir | Prioridade | Relevância |
|---|---|---|---|---|
| RNF004 | O aviso de en-credits deve ter `role="alert"`. | O leitor de tela lê o aviso ao abrir a caixa sem en-credits. | Importante | Obrigatório |
