# 3. Aba Mensagens por permissão

**Objetivo:** a aba Mensagens da central E-mails mostra a cada pessoa só os e-mails dos itens que ela pode ver, na
tabela, na busca, nos filtros e na contagem.

**Depende de:** o épico "Escrever e-mail de qualquer tela e central E-mails no menu" (a aba Mensagens sobre a tela "Emails Recebidos").

**Onde vale:** a central E-mails, aba Mensagens: tabela, busca, filtros, paginador e leitura no painel lateral.

**Protótipo:** https://pernalombr4.github.io/prototipos/comunicacao-no-workspace/. Fase "2 · Remetente"; E-mails ›
Mensagens. Os contratos CTR-00214 e CTR-00202 estão sem permissão para a pessoa.

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN201 | Um e-mail com item só aparece para quem pode ver o item (RN901). | O e-mail de CTR-00214 fica fora da aba Mensagens de quem não vê CTR-00214. | Obrigatório |

## Lista da aba (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF201 | A aba Mensagens deve listar só os e-mails dos itens que a pessoa pode ver (RN201). | Membro sem permissão em CTR-00214: os e-mails de CTR-00214 não aparecem; os de CTR-00231 aparecem. | Essencial | Obrigatório |
| RF202 | A contagem do paginador deve somar só os e-mails que a pessoa pode ver. | "Mostrando 1 a N de N resultados" deixa de fora os e-mails de CTR-00214. | Essencial | Obrigatório |
| RF203 | A busca, o período e os filtros da aba devem devolver só os e-mails que a pessoa pode ver. | Busca por "CTR-00214" volta vazia, com "Nenhum e-mail com estes filtros." | Essencial | Obrigatório |
| RF204 | As opções do filtro da coluna Item devem listar só os itens que a pessoa pode ver. | O funil da coluna Item não oferece CTR-00214. | Importante | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P201 | A tela "Emails Recebidos" de hoje, base da aba, mostra também os enviados com item, ou só os recebidos? Quem a vê hoje: cada membro, ou só quem vê o item do e-mail? | dev do back | Se ela já filtra pelo item, esta parte se reduz a conferir a regra |
| P202 | Quem vê na aba Mensagens o que chega numa Caixa de E-mail do workspace? Hoje a caixa é porta de entrada do Spaceflow e da Central de Atendimento. | produto | A aba ganha a regra da caixa, além da regra do item |
| P203 | O e-mail do sistema com item segue também a permissão de ver o item, além da permissão de hoje de ver os e-mails enviados? | produto | Quem vê os e-mails do sistema perde os dos itens que não vê |
