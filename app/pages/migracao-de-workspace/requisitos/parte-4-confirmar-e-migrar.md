# 4. Confirmar e acompanhar a migração

**Objetivo:** quem importa guarda uma cópia do workspace, confirma a Substituição total com o próprio e-mail, acompanha
a migração por etapas, pode cancelar enquanto ela não termina e recebe o resultado no sino.

**Depende de:** 2. Revisão.

**Onde vale:** o rodapé do passo "Revisar" e a camada "Importar estrutura" durante e depois da migração; o sino do
membro que iniciou a migração.

**Protótipo:** https://pernalombr4.github.io/prototipos/migracao-de-workspace/, botão "Protótipo: usar arquivo de
exemplo", Continuar e Importar. A falha se abre por "Falha" na barra inferior, antes de importar.

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN003 | Cada entidade do arquivo que tem correspondente no workspace deve continuar como 1 entidade depois da migração. | Importar "Partes" num workspace que já tem "Partes" deixa 1 categoria "Partes", nos 3 modos. | Obrigatório |
| RN005 | Uma migração na Substituição total que remove ao menos 1 entidade só pode começar se o e-mail digitado for igual ao e-mail do membro logado. | Com ana.souza@exemplo.com.br logada, digitar "ana@exemplo.com.br" não libera o botão. | Obrigatório |
| RN006 | Uma migração concluída não pode ser desfeita. | A tela de migração concluída não tem botão de desfazer; a volta é pela cópia do workspace. | Obrigatório |
| RN007 | Uma migração só pode ser cancelada enquanto está em andamento. | Cancela na etapa "Criando categorias"; concluída, não cancela. | Obrigatório |
| RN008 | Uma migração cancelada ou com falha não pode deixar alteração na estrutura do workspace. | Falha na etapa "Criando campos e listas" não deixa categoria nova no workspace. | Obrigatório |

## Confirmação (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF023 | Enquanto o workspace de destino tem estrutura, o sistema deve mostrar no passo Revisar a opção "Baixar uma cópia do workspace antes", marcada, com a ajuda "Depois de concluída, a migração não tem como ser desfeita." | Marcada, o arquivo de estrutura do workspace é baixado antes de a migração começar; no workspace vazio, a opção não aparece. | Importante | Obrigatório |
| RF024 | Enquanto o modo é Substituição total e a prévia tem ao menos 1 entidade Removida, o sistema deve mostrar o aviso de erro "Remove tudo o que não está no arquivo, inclusive os itens cadastrados.", o texto "Para confirmar, digite seu e-mail:", o e-mail do membro logado e o campo para digitá-lo, conforme RN005. | Digitar "ana.souza@exemplo.com.br" mostra ✓ e habilita "Substituir workspace", na cor de erro; nos outros modos, o botão é "Importar", na cor primária, sem e-mail. | Essencial | Obrigatório |
| RF033 | Quando o membro clica em Voltar no passo Revisar, o sistema deve abrir o passo "Arquivo e modo" com o arquivo e o modo escolhidos. | Exemplo: Substituição total escolhida; Voltar mostra o mesmo arquivo e a Substituição total marcada. A revisão não tem botão de trocar o modo. | Importante | Obrigatório |

## Migração (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF025 | Enquanto a migração está em andamento, o sistema deve mostrar "Importando a estrutura", "Isso leva alguns minutos em workspaces grandes.", a barra com a porcentagem e as etapas "Conferindo o arquivo", "Criando categorias", "Criando campos e listas", "Montando formulários e telas" e "Ajustando permissões e menus", com a concluída, a atual e as próximas diferenciadas. | Exemplo: na etapa "Criando campos e listas", as 2 anteriores têm ✓, a atual gira e a barra mostra 40%; Fechar não interrompe a migração. | Importante | Obrigatório |
| RF026 | Enquanto a migração está em andamento, o sistema deve permitir que o membro cancele a migração pelo botão "Cancelar migração", conforme RN007. | O rodapé mostra "Cancelar migração", com contorno na cor de erro, e "Fechar". | Essencial | Obrigatório |
| RF027 | Quando a migração termina sem falha, o sistema deve mostrar "Migração concluída", o resumo das categorias novas, alteradas e removidas sem as quantidades zeradas e o botão "Ver categorias". | Exemplo: "8 categorias novas." sem "0 categorias alteradas"; com a cópia marcada, "A cópia de antes da importação está na sua pasta de downloads."; sem botão de desfazer (RN006). | Importante | Obrigatório |
| RF028 | Quando a migração é cancelada, o sistema deve mostrar "Migração cancelada", "Nada foi migrado." e o botão Fechar. | Exemplo: cancelada em "Criando categorias"; o workspace continua com as 5 categorias de antes (RN008). | Essencial | Obrigatório |
| RF029 | Se a migração falha, o sistema deve mostrar o aviso de erro "A migração falhou" com "Nada foi migrado.", sem a etapa em que parou, e os botões Fechar e "Tentar de novo". | Exemplo: falha em "Criando campos e listas"; o nome da etapa não aparece. "Tentar de novo" recomeça com o mesmo arquivo e o mesmo modo. | Essencial | Obrigatório |
| RF030 | Quando a migração termina concluída ou com falha, o sistema deve enviar o aviso com o resultado ao sino do membro que iniciou a migração. | Exemplo: ana.souza@exemplo.com.br fechou a camada durante a migração; o sino de ana.souza@exemplo.com.br mostra o resultado. | Importante | Obrigatório |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver | Relevância |
|---|---|---|---|
| RI001 | `POST /migration-requests` (`type=structure`) | Deve receber o arquivo de estrutura e o modo de importação, no campo <a definir>, com 3 valores <a definir>, e aplicar a cada entidade a situação que a prévia mostrou, conforme RN003. | Obrigatório |
| RI003 | Cancelamento da migração, rota <a definir> | Deve interromper a migração em andamento e devolver o status cancelado (RN007, RN008). | Obrigatório |
| RI004 | `GET /migration-requests?status_in=pending&status_in=processing&type=structure` | Deve devolver a etapa atual da migração, no campo <a definir>; hoje devolve só o status. | Obrigatório |
| RI005 | Cancelamento de migração concluída ou com falha | A rota de cancelamento deve devolver erro com o status HTTP <a definir>, sem mudar a estrutura. | Obrigatório |
