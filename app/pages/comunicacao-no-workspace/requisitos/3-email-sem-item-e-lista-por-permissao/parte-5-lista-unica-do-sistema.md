# 5. Lista única com os e-mails do sistema

**Objetivo:** a aba Mensagens junta numa lista só os e-mails dos itens e os enviados pelo sistema, com ordem e
paginação únicas. O filtro "Do sistema" recorta essa lista, no lugar de trocar a fonte da tabela.

**Depende de:** o épico "E-mail com o que o produto já tem" (os e-mails do sistema na aba Mensagens, o filtro "Do
sistema", a coluna Status e o atalho Configurações › E-mails › E-mails Enviados).

**Onde vale:** a central E-mails, aba Mensagens, para quem tem a permissão de hoje de ver os e-mails enviados.

**Protótipo:** https://pernalombr4.github.io/prototipos/comunicacao-no-workspace/. Controle "Perfil" em "Admin"; E-mails
› Mensagens, filtro rápido "Do sistema". O protótipo já lê os 2 tipos de e-mail numa lista só.

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN401 | Para quem tem a permissão de ver os e-mails enviados, os e-mails dos itens e os enviados pelo sistema formam 1 lista na aba Mensagens. | Quem administra vê "CTR-00231 · Minuta revisada" e o e-mail do sistema da tarefa T-1042 na mesma tabela, ordenados por Data. | Obrigatório |

## Lista única (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF401 | A aba Mensagens deve listar numa tabela só os e-mails dos itens e os enviados pelo sistema (RN401). | Com a permissão, a tabela intercala as linhas de "Enviado por" com nome de pessoa e as de "Sistema · <tarefa>". | Essencial | Obrigatório |
| RF402 | A ordem escolhida no cabeçalho deve valer para a lista única, sem separar as 2 origens. | Ordenar por Data, mais recente primeiro (o padrão), põe o e-mail do sistema de ontem entre os e-mails de pessoa de hoje e de anteontem. | Essencial | Obrigatório |
| RF403 | O paginador deve contar e paginar a lista única. | Com 30 e-mails de item e 12 do sistema, o paginador diz "Mostrando 1 a 25 de 42 resultados". | Essencial | Obrigatório |
| RF404 | O filtro "Do sistema" deve recortar a lista única, sem trocar a fonte da tabela. | "Do sistema" ligado com "Com anexo": a tabela mostra só os e-mails do sistema com anexo. | Essencial | Obrigatório |
| RF405 | O filtro "Enviados" deve incluir os e-mails enviados pelo sistema, que são do tipo Enviado. | "Enviados" ligado mostra os e-mails de pessoa e os do sistema. | Importante | Obrigatório |
| RF406 | A busca, o período e os filtros de coluna devem valer para as 2 origens ao mesmo tempo. | Período "Hoje" mostra os e-mails de pessoa e os do sistema de hoje. | Importante | Obrigatório |
| RF407 | Sem a permissão de ver os e-mails enviados, a lista, a contagem e os filtros devem considerar só os e-mails dos itens. | Membro sem a permissão: o paginador diz "de 30 resultados", sem as 12 linhas do sistema. | Essencial | Obrigatório |
| RF408 | Configurações › E-mails › E-mails Enviados deve abrir a lista única com o filtro "Do sistema" ligado. | O clique abre Mensagens com "Do sistema" ligado e a contagem de 12 resultados. | Importante | Obrigatório |

## Não funcionais, restrições e transição (RNF, RS, RT)

| ID | Requisito | Como medir ou conferir | Prioridade | Relevância |
|---|---|---|---|---|
| RT401 | Até a lista única sair, o filtro "Do sistema" deve trocar a fonte da tabela, 1 lista por vez, como no épico "E-mail com o que o produto já tem". Critério de fim: a lista única no ar. | Antes desta parte, ligar "Do sistema" mostra só os e-mails do sistema, com paginação própria. | Importante | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P401 | A aba consegue juntar as 2 listas de hoje (os e-mails dos itens e os enviados pelo sistema) com ordem e paginação únicas, sem back novo? | dev do back | Sem back novo, esta parte entra no épico "E-mail com o que o produto já tem", e a RT401 sai |
