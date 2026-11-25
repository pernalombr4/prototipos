# 9. Aba Mensagens

**Objetivo:** a pessoa acha, filtra, lê e responde os e-mails que o ENSPACE já guarda com os itens, numa tabela só, sem
abrir item por item. A tabela vazia diz o próximo passo.

**Depende de:** 8. Central E-mails.

**Onde vale:** a central "E-mails", aba Mensagens, sobre a tela "Emails Recebidos" de hoje, que não tem entrada no
menu.

**Protótipo:** https://pernalombr4.github.io/prototipos/comunicacao-no-workspace/. Abra E-mails › Mensagens; o
controle "Dados" mostra "Workspace novo", "Primeiro uso" e "Em uso".

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN801 | A tabela a seguir define o estado vazio da aba Mensagens, sem e-mail e sem filtro. Política: Única. | Linha 3: com a conta do Outlook integrada, a aba mostra "Escreva o primeiro e-mail." e "Novo e-mail". | Obrigatório |

| Linha | Conta do Outlook da pessoa | Quem vê | Título | Texto | Botões |
|---|---|---|---|---|---|
| 1 | Não integrada, no workspace sem modelo e sem caixa | Quem administra | "Nenhum e-mail ainda" | "Os e-mails que as pessoas trocam pelos itens aparecem aqui. Para começar, integre a sua conta do Outlook e crie os modelos e as caixas do workspace." | "Integrar conta do Outlook", "Criar modelo", "Criar caixa de e-mail" |
| 2 | Não integrada, nos demais casos | Cada pessoa | "Nenhum e-mail ainda" | "Os e-mails que você troca pelos itens aparecem aqui. Para enviar pelo ENSPACE, integre a sua conta do Outlook." | "Integrar conta do Outlook" |
| 3 | Integrada | Cada pessoa | "Nenhum e-mail ainda" | "Escreva o primeiro e-mail. Ele aparece aqui e na Mail Box do item vinculado." | "Novo e-mail" |

## A tabela (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF801 | A aba Mensagens deve listar os e-mails que o ENSPACE guarda com item, os que a tela "Emails Recebidos" mostra hoje (RN904, RN905). | O e-mail enviado de CTR-00231 aparece; o e-mail enviado sem item, não. | Essencial | Obrigatório |
| RF802 | O "i" da aba deve dizer "Os e-mails recebidos e enviados pela Mail Box dos itens.". | A dica aparece ao lado do nome Mensagens. | Importante | Obrigatório |
| RF803 | A tabela deve usar a tabela das telas novas do produto, a de Logs de Auditoria: a coluna Ações primeiro, com 1 botão ⋮ que abre o menu da linha; o clique direito na linha abre esse menu; o paginador diz "Mostrando 1 a N de N resultados", com 10, 25, 50 ou 100 por página. | O clique direito numa linha abre o menu do ⋮. | Essencial | Obrigatório |
| RF804 | A tabela deve ter as colunas Ações, Tipo, De, Para, Assunto, Item, "Enviado por" e Data, com a Data mais recente primeiro ao abrir. | O e-mail de hoje fica na 1ª linha. | Essencial | Obrigatório |
| RF805 | "Colunas" deve esconder e mostrar Tipo, De, Para, Item e "Enviado por". | Desmarcar Tipo tira a coluna da tabela. | Importante | Obrigatório |
| RF806 | O cabeçalho de De, Para, Assunto, Item e Data deve ordenar a tabela no clique. | 2 cliques em Assunto ordenam de A a Z e de Z a A. | Importante | Obrigatório |
| RF807 | O funil de De, Para e Assunto deve filtrar por texto, com os operadores "É totalmente Igual a", "É totalmente Diferente De", "Contém parcialmente", "Não contém" e as variantes que diferenciam maiúsculas, cada operador 1 vez. | "Contém parcialmente" "rafael" em De deixa só os e-mails de rafael.monteiro@example.com. | Importante | Obrigatório |
| RF808 | O funil de Tipo, Item e "Enviado por" deve filtrar por seleção, com busca, "Todos" e "Limpar". | Marcar CTR-00231 em Item deixa só os e-mails desse item. | Importante | Obrigatório |

## Barra e filtros rápidos (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF811 | A barra deve ter a busca, o período ("Todo o período", "Hoje", "Últimos 7 dias", "Últimos 30 dias"), "Limpar filtros", "Colunas" e o botão que mostra e esconde os filtros rápidos. | "Últimos 7 dias" deixa só os e-mails da semana. | Essencial | Obrigatório |
| RF812 | A busca deve procurar no assunto, no De, no Para, na referência do item e em "Enviado por". | Buscar "CTR-00231" deixa os e-mails desse item. | Importante | Obrigatório |
| RF813 | Os filtros rápidos devem ser "Recebidos", "Enviados", "Não lidos" e "Com anexo", cada um ligado e desligado no clique. | "Não lidos" deixa só os recebidos não lidos. | Importante | Obrigatório |
| RF814 | "Limpar filtros" deve desligar a busca, o período, os filtros rápidos e os filtros de coluna. | Depois de "Limpar filtros", a tabela volta a mostrar cada e-mail. | Importante | Obrigatório |

## Menu da linha e leitura (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF821 | O menu da linha deve ter "Ver Detalhes", "Responder", "Marcar como não lido" (no recebido já lido) e "Ver Item" (RN914). | O menu de um recebido lido mostra os 4 itens; o de um enviado, sem "Marcar como não lido". | Essencial | Obrigatório |
| RF822 | "Ver Item" deve abrir o item do e-mail na aba Mail Box. | "Ver Item" num e-mail de CTR-00231 abre a Mail Box de CTR-00231. | Importante | Obrigatório |
| RF823 | O clique na linha e "Ver Detalhes" devem abrir a leitura num painel lateral, com Tipo, De, Para, Cc, "Enviado por", o item vinculado e o corpo. | O painel de "CTR-00229 · Índice de reajuste" mostra os campos e o texto. | Essencial | Obrigatório |
| RF824 | Abrir a leitura de um recebido não lido deve marcar o e-mail como lido. | O e-mail sai de "Não lidos" depois de aberto. | Importante | Obrigatório |
| RF825 | O painel de leitura deve ter "Responder" e, no recebido, "Marcar como não lido" (RN914). | "Responder" no painel abre "Re: Minuta revisada" vinculado a CTR-00231. | Essencial | Obrigatório |

## Estado inicial (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF831 | Sem e-mail na aba e sem filtro, a tabela deve mostrar o próximo passo pela tabela da RN801. | No workspace novo, o membro vê "Nenhum e-mail ainda" e "Integrar conta do Outlook". | Essencial | Obrigatório |
| RF832 | Os botões do estado vazio devem abrir: "Integrar conta do Outlook", Perfil › Integrações; "Criar modelo" e "Criar caixa de e-mail", as abas Modelos e Caixas de E-mail; "Novo e-mail", o compositor sem vínculo. | "Criar modelo" abre E-mails › Modelos. | Importante | Obrigatório |
| RF833 | Com filtro e sem resultado, a tabela deve mostrar "Nenhum e-mail com estes filtros." e "Limpar filtros". | "Com anexo" sem e-mail com anexo mostra a frase e o botão. | Importante | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P801 | A tela "Emails Recebidos" de hoje basta como base da aba, com a busca, os filtros e a paginação desta parte, sem back novo? | dev | Se não basta, a parte pede trabalho no back, ou os filtros que a tela não aceita saem |
| S801 | Na linha 1 da RN801, "workspace sem modelo e sem caixa" é o workspace novo do protótipo; com modelo ou caixa, quem administra cai na linha 2. | produto | Muda quando quem administra vê "Criar modelo" e "Criar caixa de e-mail" |
