# 6. Modelo

**Objetivo:** a pessoa escolhe o modelo de IA do pedido, ou deixa o Auto escolher, e vê na proposta qual modelo
respondeu. Cada modelo funciona sem chave, em en-credits.

**Depende de:** 1. Pedir ao BENI e aceitar a proposta.

**Onde vale:** o seletor de modelo no rodapé da caixa do BENI e a barra da proposta.

**Protótipo:** https://pernalombr4.github.io/prototipos/ia-no-campo-html/, estado "Sem chave (en-credits)".

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN001 | Cada modelo de IA que o ENSPACE disponibiliza pode ser usado no campo sem chave de conta própria, com o consumo cobrado em en-credits. | Workspace sem chave nenhuma usa o Claude Opus 4.6 e o consumo sai dos en-credits. | Obrigatório |

## Seletor de modelo (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF041 | O seletor de modelo deve mostrar "Auto" no topo e os modelos agrupados por empresa, com o logo e o nome da empresa no título de cada grupo. | Grupos: ChatGPT (OpenAI), Claude (Anthropic), Gemini (Google), DeepSeek. | Importante | Obrigatório |
| RF042 | Cada modelo do seletor deve mostrar o perfil, a velocidade e a inteligência de 1 a 5 e o consumo de en-credits (baixo, médio ou alto). | O GPT-5-mini mostra velocidade 5 e consumo baixo. | Importante | Obrigatório |
| RF043 | Cada modelo deve poder ser escolhido sem chave de conta própria (RN001). | Sem chave nenhuma, escolher Claude Opus 4.6 e pedir algo gera a proposta. | Essencial | Obrigatório |
| RF034 | A barra da proposta deve mostrar quem respondeu e o modelo: "BENI · Auto: Claude Sonnet 4.6" com Auto, e o nome do modelo escolhido nos outros casos. | Pedido com Auto mostra o modelo que o Auto escolheu (RN008). | Importante | Obrigatório |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver | Relevância |
|---|---|---|---|
| RI003 | Lista de modelos (rota <a definir>) | Deve devolver cada modelo com a empresa, o perfil e o consumo de en-credits. | Obrigatório |
| RI008 | Geração da resposta do BENI | Deve receber o modelo escolhido (ou Auto) e devolver o modelo que respondeu. | Obrigatório |
