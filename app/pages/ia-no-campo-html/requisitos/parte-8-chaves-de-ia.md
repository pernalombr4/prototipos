# 8. Chaves de IA do workspace

**Objetivo:** quem administra conecta a chave de uma conta própria do workspace (OpenAI, Anthropic, Google) sem sair
do campo, e o consumo dos modelos daquela empresa passa a ser cobrado nessa conta. A pessoa vê no seletor e na
proposta qual conta paga.

**Depende de:** 6. Modelo.

**Onde vale:** o modal "Chaves de IA do workspace", que abre sobre a tela do item, o seletor de modelo e a barra da
proposta.

**Protótipo:** https://pernalombr4.github.io/prototipos/ia-no-campo-html/, estados "Sem chave (en-credits)", "Chave da
OpenAI" e "3 chaves próprias".

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN002 | O consumo de um modelo é cobrado na conta da empresa dona do modelo quando o workspace tem a chave dessa conta conectada. | Com a chave da Anthropic conectada, um pedido no Claude Sonnet 4.6 é cobrado na conta Anthropic, e um no GPT-5.4 continua em en-credits. | Obrigatório |
| RN003 | Uma chave de conta própria conectada vale para o workspace inteiro. | A chave conectada por quem administra vale para cada membro e para cada campo. | Obrigatório |

## A conta que paga, no seletor e na proposta (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF044 | Quando o workspace tem a chave de uma conta conectada, o grupo daquela empresa no seletor de modelo deve mostrar o selo "Sua conta" com ícone de chave. | Com a chave da OpenAI, o grupo ChatGPT tem "Sua conta". | Importante | Obrigatório |
| RF065 | Quando o workspace tem a chave de uma conta conectada, cada modelo daquela empresa deve mostrar "Cobrado na conta <empresa>" no lugar do consumo de en-credits. | Com a chave da OpenAI, o GPT-5.4 mostra "Cobrado na conta OpenAI". | Importante | Obrigatório |
| RF045 | O rodapé do seletor de modelo deve ter o botão "Usar a chave de uma conta própria" (ou "Ver as chaves conectadas" quando cada conta disponível já tem chave), que abre o modal "Chaves de IA do workspace". | Clicar abre o modal na lista de contas. | Importante | Obrigatório |
| RF035 | Quando o consumo é cobrado numa conta própria (RN002), a barra da proposta deve acrescentar a conta ao modelo: "Auto: Claude Sonnet 4.6 (conta Anthropic)". | Com a chave da Anthropic, o resumo mostra "(conta Anthropic)"; sem chave, só o modelo. | Importante | Obrigatório |

## Modal das chaves (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF047 | O modal "Chaves de IA do workspace" deve abrir sobre a tela do item, com a descrição "Opcional. Conecte a chave de uma conta do workspace para o consumo dos modelos daquela empresa ser cobrado nela." e a trilha "Configurações › Integrações › Inteligência Artificial". | O modal abre sem sair do item; o campo continua visível atrás. | Essencial | Obrigatório |
| RF048 | O modal deve mostrar no topo o aviso "Todos os modelos já funcionam sem chave, com os en-credits do ENSPACE. A chave só muda quem paga." | O aviso aparece acima dos cartões. | Importante | Obrigatório |
| RF049 | O modal deve mostrar 1 cartão por conta de IA, com o logo, o nome do produto, a empresa e 1 frase. | Cartões: ChatGPT (OpenAI), Claude (Anthropic), Gemini (Google), Kimi (Moonshot AI), DeepSeek. | Essencial | Obrigatório |
| RF050 | O cartão de uma conta sem chave deve ter o botão "Conectar chave". | Sem chave da Anthropic, o cartão Claude mostra "Conectar chave". | Essencial | Obrigatório |
| RF066 | O cartão de uma conta com chave deve ter o selo "Chave conectada" e a linha "N modelos cobrados na conta <empresa>", sem o botão "Conectar chave". | Com a chave da OpenAI, o cartão ChatGPT mostra "Chave conectada" e "3 modelos cobrados na conta OpenAI". | Essencial | Obrigatório |
| RF051 | O cartão de uma conta que ainda não aceita chave própria deve ter o selo "Em breve" e "Ainda não aceita chave própria.", sem botão. | Kimi e DeepSeek aparecem com "Em breve". | Importante | Obrigatório |
| RF052 | Quando a pessoa clica em "Conectar chave", o modal deve mostrar o passo da chave da conta, com o foco no campo "Chave de API". | Clicar em "Conectar chave" no Claude mostra "Conectar a chave da conta Anthropic" e o cursor já no campo. | Essencial | Obrigatório |
| RF053 | O passo da chave deve ter o link "Onde pego a chave?" para a página de chaves da empresa, o botão de mostrar e esconder a chave e a ajuda "O consumo é cobrado na conta <empresa>, que precisa ter créditos." | O link do Claude abre a página de chaves da Anthropic numa aba nova. | Importante | Obrigatório |
| RF054 | Se a pessoa envia o campo "Chave de API" vazio, o sistema deve mostrar no próprio campo "Cole a chave para conectar.". | Enviar vazio mostra o erro, e nada é conectado. | Essencial | Obrigatório |
| RF055 | Quando a chave é aceita, o modal deve mostrar "Chave da conta <empresa> conectada", os modelos cobrados nessa conta, "Conectar outra chave" e "Voltar ao campo", com o foco em "Voltar ao campo". | Conectar a da Anthropic lista Claude Sonnet 4.6 e Claude Opus 4.6; Enter volta ao campo. | Essencial | Obrigatório |
| RF056 | Quando o modal fecha, o sistema deve devolver a pessoa ao campo como estava, com a caixa do BENI aberta se a caixa estava aberta. | Abrir o modal pelo seletor de modelo e fechar mantém a caixa aberta. | Importante | Obrigatório |
| RF057 | O rodapé do modal deve ter "A IA só lê o que você selecionar ou enviar.". | O texto aparece no rodapé do modal. | Desejável | Desejável |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver | Relevância |
|---|---|---|---|
| RI004 | Chaves de conta própria do workspace (rota <a definir>) | Deve devolver as contas com chave conectada e receber a chave nova de uma conta. Hoje a integração OpenAI grava a chave pelo modal "Api Key" de Configurações › Integrações. | Obrigatório |
| RI010 | Resposta da geração | Deve devolver a conta cobrada: en-credits ou a empresa da chave conectada. | Obrigatório |
