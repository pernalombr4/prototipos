# 4. Auditoria, Integrações e Análise como áreas

**Objetivo:** os logs, as integrações e os dashboards ganham área própria na trilha. Análise > Dashboards lista os
dashboards que o workspace já tem.

**Depende de:** 1. Trilha, painel e menu flutuante; 2. Configurações em painel próprio e Ajuda.

**Onde vale:** os ícones e os painéis de Auditoria, Integrações e Análise e a tela Dashboards.

**Protótipo:** https://pernalombr4.github.io/prototipos/menu-lateral/

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN301 | Integrações tem ordem fixa: só Apps, Credenciais e Webhooks moram ali, nessa ordem. | Apps, Credenciais e Webhooks ficam nessa ordem em todo workspace. | Obrigatório |
| RN302 | Dashboards mostra só os dashboards que a pessoa pode abrir pelos grupos de acesso de cada um. | Dashboard restrito ao grupo Comercial não aparece para quem está fora do grupo. | Obrigatório |

## Áreas (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF301 | O sistema deve mostrar Auditoria como área da trilha, com as telas Logs de auditoria e Logs de requisição. | Configurações não tem mais Logs. | Essencial | Obrigatório |
| RF302 | O sistema deve mostrar Integrações como área da trilha, com as telas Apps, Credenciais e Webhooks, nessa ordem (RN301). | Configurações não tem mais Integrações nem Credenciais. | Essencial | Obrigatório |
| RF303 | O sistema deve mostrar Análise como área da trilha, com a tela Dashboards. | O ícone Análise abre o painel com Dashboards. | Essencial | Obrigatório |
| RF304 | Auditoria e Integrações só devem aparecer na trilha para quem cumpre a RN901. | Membro com licença Basic não vê os 2 ícones. | Essencial | Obrigatório |

## Dashboards (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF311 | Dashboards deve listar os dashboards do workspace (RN302), com as colunas Nome e Atualizado em. | Workspace com 3 dashboards: a lista tem 3 linhas. | Essencial | Obrigatório |
| RF312 | Clicar no nome de um dashboard deve abrir a tela do dashboard. | Clicar em "Vendas do trimestre" abre o dashboard com os painéis dele. | Essencial | Obrigatório |
| RF313 | Sem dashboard, a tela deve mostrar o estado vazio "Nenhum dashboard ainda". | Workspace novo: o estado vazio aparece no lugar da lista. | Importante | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P301 | A lista de dashboards já filtra pelos grupos de acesso da pessoa, ou o filtro da RN302 é novo? | dev | RN302 vira trabalho no back. |
| P303 | Quem não cumpre a RN901 vê Análise? Hoje o dashboard abre pela tela do menu para quem tem acesso. | produto | RF304 inclui Análise. |
