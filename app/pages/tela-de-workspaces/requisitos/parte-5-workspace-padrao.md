# 5. Workspace padrão

**Objetivo:** a pessoa que trabalha num workspace só escolhe esse workspace como padrão e passa a cair nele direto
depois do login, sem passar pela tela de workspaces.

**Depende de:** 3. Menu "⋯", sair e excluir; 4. Recentes e favoritos.

**Onde vale:** o bloco do topo e o menu "⋯" da tela `/workspaces`, e o login.

**Protótipo:** https://pernalombr4.github.io/prototipos/tela-de-workspaces.

## Definir o padrão (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF301 | Sem padrão, o bloco do topo deve mostrar o botão "Abrir sempre este ao entrar". | Com 1 workspace só, o bloco "Seu workspace" mostra o botão. | Essencial | Obrigatório |
| RF302 | Com padrão, o bloco do topo deve mostrar "Na próxima vez que você entrar no ENSPACE, vai direto para {nome}." e o botão "Voltar a escolher ao entrar". | "Voltar a escolher ao entrar" tira o padrão. | Essencial | Obrigatório |
| RF303 | Com padrão, o bloco do topo deve mostrar o workspace padrão no lugar do último acessado (RN902). | Definir Vértice Log como padrão põe Vértice Log no bloco. | Essencial | Obrigatório |
| RF304 | Com padrão, o rótulo do bloco deve ser "Abre direto quando você entra", com a borda do bloco na cor primária. | Definir o padrão troca o rótulo e a borda na hora. | Importante | Obrigatório |
| RF307 | O 1º item do menu "⋯" deve ser "Abrir sempre ao entrar" ou, no padrão, "Voltar a escolher ao entrar". | O rótulo do item muda conforme o workspace é padrão. | Essencial | Obrigatório |
| RF308 | Ao sair do workspace padrão, a tela deve desfazer o padrão (RN904). | Depois de sair do padrão, o bloco do topo volta a "Continue de onde você parou". | Essencial | Obrigatório |

## Onde o padrão aparece (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF309 | Com padrão definido, o login deve abrir direto o workspace padrão, sem passar pela tela de workspaces. | Com padrão definido, o login seguinte cai dentro do workspace. | Essencial | Obrigatório |
| RF310 | À esquerda do rodapé, o card do padrão deve mostrar "Abre ao entrar" no lugar do último acesso. | O card do padrão diz "Abre ao entrar". | Importante | Obrigatório |
| RF311 | Na lista, a coluna Workspace deve mostrar o ícone de casa depois do nome do padrão. | A linha do padrão mostra a casa ao lado do nome. | Importante | Obrigatório |
