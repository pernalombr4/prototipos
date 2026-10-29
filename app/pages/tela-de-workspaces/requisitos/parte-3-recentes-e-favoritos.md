# 3. Recentes e favoritos

**Objetivo:** a pessoa volta ao workspace de sempre sem procurar: o bloco do topo mostra o último acessado, e as abas
"Favoritos" e "Recentes" e a ordem por acesso levam ao que ela usa.

**Depende de:** 1. Escolher e entrar.

**Onde vale:** a tela `/workspaces`.

**Protótipo:** https://pernalombr4.github.io/prototipos/tela-de-workspaces.

## Abas e favoritos (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF201 | A barra deve ter a aba "Favoritos ({n})", com os favoritos da pessoa, sem convites e sem ocultos (RN903). | A contagem bate com os cards que a aba mostra. | Essencial | Obrigatório |
| RF202 | A barra deve ter a aba "Recentes ({n})", com os workspaces que a pessoa já acessou, sem convites e sem ocultos (RN903). | A contagem bate com os cards que a aba mostra. | Essencial | Obrigatório |
| RF203 | Ao digitar a primeira letra na busca, a aba deve voltar para "Todos". | Na aba "Favoritos", digitar "rh" mostra RH Aurora, que não é favorito. | Importante | Obrigatório |
| RF204 | Cada card que não é convite deve mostrar a estrela, visível sem passar o mouse e amarela no favorito. | A estrela aparece em cada card que não é convite. | Essencial | Obrigatório |
| RF205 | Clicar na estrela deve favoritar ou desfavoritar o workspace sem recarregar a página. | Favoritar soma 1 na aba "Favoritos" sem recarregar a página. | Essencial | Obrigatório |
| RF206 | Na lista, a coluna Workspace deve mostrar a estrela depois do nome do favorito. | Um favorito mostra a estrela ao lado do nome. | Importante | Obrigatório |

## Ordem e último acesso (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF207 | O menu Ordenar deve ganhar, antes dos outros critérios, o bloco de acesso da tabela abaixo, e "Acessados por último" passa a ser o critério padrão. | A tela abre com "Ordenar: Último acesso". | Essencial | Obrigatório |
| RF208 | Nas 2 ordens de acesso, os workspaces sem acesso registrado devem ir para o fim. | Em "Acessados há mais tempo", os nunca acessados ficam no fim. | Importante | Obrigatório |
| RF209 | À esquerda do rodapé, o card deve mostrar só o tempo do último acesso, na escala da tabela abaixo. | Acesso de 2 dias atrás mostra "Acessado há 2 dias"; nenhum card mostra o número de pessoas. | Importante | Obrigatório |
| RF211 | A lista deve ganhar a coluna "Último acesso", com o tempo do último acesso, ordenável pelo cabeçalho. | A coluna ordena ao clicar no cabeçalho. | Importante | Obrigatório |
| RF212 | Na linha de convite, a coluna "Último acesso" deve mostrar "Aceite para entrar". | A linha de Lumen Contábil mostra "Aceite para entrar". | Importante | Obrigatório |

**Bloco de acesso do menu Ordenar (RF207)**

| Opção no menu | No botão | Regra |
|---|---|---|
| Acessados por último (padrão) | Último acesso | último acesso mais recente primeiro |
| Acessados há mais tempo | Acesso mais antigo | último acesso mais antigo primeiro |

**Tempo do último acesso (RF209)**

| Tempo | Texto |
|---|---|
| menos de 60 minutos | "Acessado há {n} min" |
| menos de 24 horas | "Acessado há 1 hora" / "Acessado há {n} horas" |
| menos de 30 dias | "Acessado há 1 dia" / "Acessado há {n} dias" |
| 30 dias ou mais (dias ÷ 30, arredondado) | "Acessado há 1 mês" / "Acessado há {n} meses" |
| sem acesso | "Nunca acessado" |

## Bloco do topo (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF213 | Acima da lista, o bloco do topo deve mostrar o último workspace acessado que está na lista (RN903). Sem acesso registrado, ou com texto na busca, o bloco fica de fora. | Digitar na busca esconde o bloco. | Essencial | Obrigatório |
| RF214 | O rótulo do bloco deve ser "Continue de onde você parou"; com 1 workspace só, "Seu workspace". | Com 1 workspace só, o rótulo diz "Seu workspace". | Importante | Obrigatório |
| RF215 | O bloco deve mostrar o ícone, o nome e a descrição do workspace; sem descrição, o tempo do último acesso. | Um workspace sem descrição mostra "Acessado há…" no lugar. | Importante | Obrigatório |
| RF216 | O botão "Entrar em {nome}" deve ser o principal da tela, de cor cheia. | Clicar no botão entra no workspace do bloco. | Essencial | Obrigatório |
| RF217 | O workspace do bloco deve continuar na lista. | Grupo Aurora aparece no bloco e na grade. | Importante | Obrigatório |
| RF218 | Com 1 workspace só, a tela deve mostrar só o bloco do topo, sem busca, sem barra e sem lista. | O workspace aparece 1 vez. | Essencial | Obrigatório |
