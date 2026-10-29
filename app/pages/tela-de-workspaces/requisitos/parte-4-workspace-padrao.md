# Requisitos: tela de workspaces, parte 4, workspace padrão

**Objetivo:** a pessoa que trabalha num workspace só escolhe esse workspace como padrão e passa a cair nele direto
depois do login, sem passar pela tela de workspaces.

**Onde vale:** o bloco do topo e o menu "⋯" da tela `/workspaces`, e o login.

**Referência visual:** https://pernalombr4.github.io/prototipos/tela-de-workspaces, aprovado em 14/10/2026 e
revisado até 20/10/2026.

**Convenção:** "deve" é obrigatório. Cada requisito tem um critério de aceite que se confere na tela. Os textos
entre aspas são os da interface em português; os de inglês e espanhol estão no `textos.ts` da pasta do protótipo.
{chaves} são valores variáveis.

**Relevância:** Obrigatório, o dev faz. Desejável, o dev faz; se achar melhor não fazer, conversa com produtos antes.
Opcional, o dev pode não fazer quando o esforço é grande para o ganho.

**Épico:** [epico.md](epico.md). Depende das partes 2 e 3; segue a RN902 e a RN904.

**Fora do escopo:** ocultar o padrão (parte 5, RF416).

## Resumo

| Grupo | O que muda em relação ao develop de 16/09/2026 | Requisitos |
|---|---|---|
| Definir o padrão | Hoje não existe. Pelo bloco do topo e pelo menu "⋯" | RF301 a RF308 |
| Onde o padrão aparece | O login abre direto o padrão; card e lista mostram a casa | RF309 a RF311 |
| Dados | A API passa a guardar o padrão de cada pessoa, e o login passa a ler o padrão | RI301, RI302 |

## Definir o padrão (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF301 | Sem padrão, o bloco do topo deve mostrar, abaixo de um divisor, o botão com borda e ícone de casa "Abrir sempre este ao entrar". | Com 1 workspace só, o bloco "Seu workspace" mostra o botão. | Essencial | Obrigatório |
| RF302 | Com padrão, o bloco do topo deve mostrar, abaixo de um divisor, "Na próxima vez que você entrar no ENSPACE, vai direto para {nome}." e o botão com borda "Voltar a escolher ao entrar". | Os 2 botões de RF301 e RF302 têm borda; nenhum é link cinza. | Essencial | Obrigatório |
| RF303 | Com padrão definido, o bloco do topo deve mostrar o workspace padrão no lugar do último acessado (RN902). | Definir Vértice Log como padrão põe Vértice Log no bloco. | Essencial | Obrigatório |
| RF304 | Com padrão, o rótulo do bloco deve ser "Abre direto quando você entra", com ícone de casa e a borda do bloco na cor primária. | Definir o padrão troca o rótulo e a borda na hora. | Importante | Obrigatório |
| RF305 | Definir o padrão deve mostrar o toast "{nome} abre direto quando você entrar", com "Para trocar, use o menu de qualquer workspace." | O toast aparece ao definir o padrão. | Importante | Obrigatório |
| RF306 | Tirar o padrão deve mostrar o toast "Você volta a escolher o workspace ao entrar." | O toast aparece ao tirar o padrão. | Importante | Obrigatório |
| RF307 | O 1º item do menu "⋯" (RF103) deve ser "Abrir sempre ao entrar" ou, no padrão, "Voltar a escolher ao entrar", com ícone de casa. | O rótulo do item muda conforme o workspace é padrão. | Essencial | Obrigatório |
| RF308 | Ao sair do workspace padrão (RF108), a tela deve desfazer o padrão (RN904). | Depois de sair do padrão, o bloco do topo volta a "Continue de onde você parou". | Essencial | Obrigatório |

## Onde o padrão aparece (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF309 | Com padrão definido, o login deve abrir direto o workspace padrão, sem passar pela tela de workspaces. | Com padrão definido, o login seguinte cai dentro do workspace. | Essencial | Obrigatório |
| RF310 | À esquerda do rodapé, o card do padrão deve mostrar o ícone de casa e "Abre ao entrar" no lugar do último acesso (RF209). | O card do padrão diz "Abre ao entrar". | Importante | Obrigatório |
| RF311 | Na lista, a coluna Workspace deve mostrar a casa depois do nome quando o workspace é o padrão. | A linha do padrão mostra a casa na 1ª linha da coluna. | Importante | Obrigatório |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver | Relevância |
|---|---|---|---|
| RI301 | Workspace padrão (rota <a definir>) | A API deve guardar, por pessoa, o workspace padrão (RN902) e devolver a marca na listagem. | Obrigatório |
| RI302 | Login | O login deve ler o workspace padrão da pessoa e abrir direto nele. | Obrigatório |
