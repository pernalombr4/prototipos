# 4. Pessoas do cargo e confirmação

**Objetivo:** antes de salvar, o administrador sabe quem tem o cargo e lê, em palavras, o que cada alteração muda e
para quantas pessoas.

**Depende de:** 1. Tabela de categorias.

**Onde vale:** o selo ao lado do nome do cargo, o aviso de alterações pendentes no topo e a confirmação de "Salvar
Alterações".

**Protótipo:** https://pernalombr4.github.io/prototipos/permissoes-de-cargos/. Clique no selo "14 pessoas com este
cargo"; marque uma caixa e clique em "Salvar Alterações".

## Pessoas do cargo (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF401 | Ao lado do nome do cargo, a tela deve mostrar o selo "{n} pessoas com este cargo", com o total de membros do cargo. | O cargo com 14 membros mostra "14 pessoas com este cargo". | Importante | Obrigatório |
| RF402 | O clique no selo deve abrir uma janela com cada pessoa do cargo: nome, e-mail, licença e situação. | A janela lista as 14 pessoas, com "Full" e "Convite pendente" onde vale. | Importante | Obrigatório |
| RF403 | A janela deve ter o campo "Buscar por nome ou e-mail", que filtra as pessoas. | "ana" deixa só as pessoas com "ana" no nome ou no e-mail. Sem resultado, "Ninguém com esse nome ou e-mail.". | Importante | Desejável |
| RF404 | A janela deve ter o botão "Abrir Gestão de Membros", que abre a lista de membros do workspace. | O botão abre Gestão de Membros. | Desejável | Desejável |

## Alterações pendentes (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF405 | Com alteração não salva, o topo deve mostrar "Alterações pendentes", "{n} alterações não salvas.", "Descartar" e "Salvar Alterações". | Marcar Ver em 2 categorias mostra "2 alterações não salvas.". | Essencial | Obrigatório |
| RF406 | Cada categoria alterada deve contar como 1 alteração, com 1 ou mais caixas mexidas. | Escolher 35 campos em "Contratos" conta 1 alteração. | Importante | Obrigatório |
| RF407 | "Descartar" deve voltar cada caixa ao estado salvo e mostrar o toast "Mudanças descartadas". | Depois de descartar, o filtro Alteradas mostra 0. | Essencial | Obrigatório |

## Confirmação (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF408 | "Salvar Alterações" deve abrir a confirmação "Salvar {n} alterações?", com a frase "Vale na hora para as {n} pessoas com este cargo." (RN902). | Com 14 pessoas no cargo, a frase diz "as 14 pessoas". | Essencial | Obrigatório |
| RF409 | A confirmação deve listar cada alteração em palavras: o lugar e o que mudou. | "Contratos de Clientes: liberou Ver, 76 campos escolhidos". "Processos Judiciais: liberou Criar, só em 1 formulário". | Essencial | Obrigatório |
| RF410 | O botão Salvar da confirmação deve gravar as alterações e mostrar o toast "Permissões salvas", com "O cargo já vale com as mudanças.". | Depois de salvar, o aviso de pendências some e o filtro Alteradas mostra 0. | Essencial | Obrigatório |
| RF411 | Se a gravação falha, a tela deve manter cada marcação e mostrar o aviso "Não salvamos as mudanças", com "Suas marcações continuam aqui. Tente de novo.". | As caixas alteradas continuam alteradas, e o aviso de pendências continua no topo. | Essencial | Obrigatório |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver | Relevância |
|---|---|---|---|
| RI401 | `GET /ws/members` | A lista de membros filtrada pelo cargo dá o total do selo e as linhas da janela: nome, e-mail, licença e situação. | Obrigatório |
