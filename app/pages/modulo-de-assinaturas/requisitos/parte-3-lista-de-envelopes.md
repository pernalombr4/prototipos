# 3. Lista de envelopes

**Objetivo:** a lista de envelopes mostra num clique o que precisa de atenção, acha o envelope pelo signatário, diz de
onde veio cada envelope e oferece no menu ⋮ só as ações que o status e o provedor permitem.

**Onde vale:** Módulos > Assinaturas, com 1 envelope ou mais.

**Protótipo:** https://pernalombr4.github.io/prototipos/modulo-de-assinaturas, menu Assinaturas.

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN201 | Um envelope aberto é considerado a vencer quando o "Expira em" fica entre hoje e 3 dias à frente. | Em 19/11, o envelope que expira em 21/11 vence em até 3 dias. | Obrigatório |
| RN202 | A tabela a seguir define as ações do menu ⋮ de cada envelope, conforme RN902 e RN904. Política: Múltipla: o menu tem cada ação cuja condição vale. | Linha 4: o envelope aberto da Certisign tem "Links de assinatura". | Obrigatório |

| Linha | Ação | Quando aparece |
|---|---|---|
| 1 | "Ver detalhes" | sempre |
| 2 | "Enviar" | rascunho; desligado, com "Para enviar, conecte um provedor.", quando o rascunho não tem provedor |
| 3 | "Atualizar status" e "Reenviar e-mail" | envelope aberto, quando o provedor consulta o status e reenvia |
| 4 | "Links de assinatura" | envelope aberto, quando o provedor gera links |
| 5 | "Baixar assinado" | envelope concluído |
| 6 | "Baixar original" | sempre |
| 7 | "Cancelar envelope" | envelope aberto; desligado no envelope avulso do provedor que cancela só no ENSPACE |

## Precisam de atenção (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF201 | Acima da tabela, a lista deve ter "Precisam de atenção" com 3 atalhos: "Com erro", "Sem retorno há mais de 2 dias" (RN903) e "Vencem em até 3 dias" (RN201), cada um com o número de envelopes. | Com 1 envelope em Erro, o atalho "Com erro" mostra 1. | Importante | Obrigatório |
| RF202 | Clicar num atalho deve filtrar a tabela pelos envelopes dele, e o 2º clique tira o filtro. | "Com erro" deixa só os envelopes em Erro. | Importante | Obrigatório |
| RF203 | O envelope sem retorno (RN903) deve levar, na coluna Status, o selo "Sem retorno há {n} dias". | O envelope sem retorno desde 15/11 mostra "Sem retorno há 4 dias" em 19/11. | Essencial | Obrigatório |

## Busca e filtros (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF204 | A busca "Buscar por título, referência ou signatário" deve achar o envelope pelo título, pela referência e pelo nome ou e-mail de cada participante, sem diferença de acento ou de maiúscula. | "otavio" acha o envelope em que Otávio assina. | Essencial | Obrigatório |
| RF205 | A busca, os filtros Status, Provedor e Origem e o atalho escolhido devem valer juntos. | "Com erro" com o provedor ClickSign mostra só os envelopes da ClickSign em Erro. | Importante | Obrigatório |
| RF206 | Se a busca e os filtros não acham envelope, a tabela deve mostrar "Nenhum envelope para estes filtros" e "Limpar filtros", que apaga a busca, os filtros e o atalho. | O botão volta a mostrar todos os envelopes. | Importante | Obrigatório |

## Colunas (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF207 | A coluna Origem deve mostrar o tipo e o nome: o fluxo do Spaceflow ou a categoria do fluxo da categoria. O envelope avulso mostra "Avulso". | O envelope da execução do fluxo "Contrato de fornecedor" mostra "Spaceflow" e "Contrato de fornecedor". | Importante | Obrigatório |
| RF208 | A coluna Provedor deve mostrar o nome do provedor; o rascunho sem provedor mostra "Sem provedor". | O rascunho criado antes da conexão mostra "Sem provedor". | Importante | Obrigatório |
| RF209 | As colunas Criado em, Enviado em e Concluído em devem mostrar a data e a hora. | "18/11, 19:12". | Importante | Desejável |
| RF210 | A coluna Assinados deve mostrar quantos participantes assinaram do total. | "1/3". | Importante | Obrigatório |

## Menu ⋮ (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF211 | O menu ⋮ de cada envelope deve mostrar as ações conforme RN202, em grupos: ver, ações do provedor, baixar e cancelar. | O envelope concluído não tem "Cancelar envelope" nem "Reenviar e-mail". | Essencial | Obrigatório |
| RF212 | A ação desligada deve mostrar o motivo abaixo do rótulo. | O rascunho sem provedor mostra "Enviar" desligado, com "Para enviar, conecte um provedor.". | Importante | Obrigatório |
| RF213 | "Cancelar envelope", "Reenviar e-mail" e "Links de assinatura" devem abrir o modal que abrem no detalhe do envelope. | O modal de cancelar da lista pede o motivo, como no detalhe. | Essencial | Obrigatório |

## Rascunhos sem provedor (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF214 | Com envelope e com 0 credenciais no workspace, a lista deve mostrar, acima da tabela, o aviso "Nenhum provedor conectado", com "Os rascunhos ficam salvos. Para enviar, conecte um provedor e escolha a credencial em cada rascunho.". | Com 2 rascunhos e sem credencial, o aviso aparece acima da tabela. | Importante | Obrigatório |
| RF215 | O aviso deve ter "Conectar um provedor", que abre a seção "Assinatura eletrônica" em Integrações > Apps. | O botão leva aos 5 provedores. | Importante | Obrigatório |
