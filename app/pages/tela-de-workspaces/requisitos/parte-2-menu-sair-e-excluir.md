# Requisitos: tela de workspaces, parte 2, menu "⋯", sair e excluir

**Objetivo:** cada workspace da lista ganha o menu "⋯", com sair do workspace e, para o proprietário, excluir o
workspace, sem a pessoa precisar entrar nele. O menu é a porta das ações das partes 4, 5 e 6.

**Onde vale:** o card e a linha da lista da tela `/workspaces`.

**Referência visual:** https://pernalombr4.github.io/prototipos/tela-de-workspaces, aprovado em 14/10/2026 e
revisado até 20/10/2026. No protótipo, "Excluir workspace" mostra um toast no lugar do modal de exclusão.

**Convenção:** "deve" é obrigatório. Cada requisito tem um critério de aceite que se confere na tela. Os textos
entre aspas são os da interface em português; os de inglês e espanhol estão no `textos.ts` da pasta do protótipo.
{chaves} são valores variáveis.

**Relevância:** Obrigatório, o dev faz. Desejável, o dev faz; se achar melhor não fazer, conversa com produtos antes.
Opcional, o dev pode não fazer quando o esforço é grande para o ganho.

**Épico:** [epico.md](epico.md). Depende da parte 1.

**Fora do escopo:** os itens "Abrir sempre ao entrar" (parte 4), "Ocultar da lista" (parte 5) e "Etiquetas" (parte 6);
o modal de exclusão de workspace, que o produto já tem.

## Resumo

| Grupo | O que muda em relação ao develop de 16/09/2026 | Requisitos |
|---|---|---|
| Menu "⋯" | Hoje não existe. Aparece no card e na linha, com a ordem dos itens das partes 2 a 6 | RN101, RF101 a RF105 |
| Sair do workspace | Hoje não existe nesta tela. Sai com confirmação | RF106 a RF108 |

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN101 | Um proprietário só deixa o workspace pela exclusão do workspace. | No workspace de que Mariana é proprietária, o menu oferece "Excluir workspace" no lugar de "Sair do workspace". | Obrigatório |

## Menu "⋯" (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF101 | Em cada workspace que não é convite pendente, o card e a linha devem mostrar o menu "⋯", visível sem passar o mouse, com o nome acessível "Mais ações de {nome}". | O "⋯" aparece sem passar o mouse; o card de convite não tem "⋯". | Essencial | Obrigatório |
| RF102 | Na lista, o 1º item do menu deve ser "Entrar" (ícone de entrar), que entra direto no workspace. No card, o menu começa sem "Entrar". | Clicar no "⋯" da linha abre o menu sem entrar no workspace; "Entrar" entra. | Importante | Obrigatório |
| RF103 | Os itens do menu devem seguir esta ordem: "Abrir sempre ao entrar" ou "Voltar a escolher ao entrar" (parte 4); "Etiquetas" (parte 6); separador; "Ocultar da lista" ou "Mostrar na lista" (parte 5); por último, o item de saída (RF104 ou RF105). Cada item tem o efeito descrito na parte dele. | Com as partes 2 a 6 prontas, o menu mostra os itens nesta ordem. | Essencial | Obrigatório |
| RF104 | Para quem não é proprietário, o último item deve ser "Sair do workspace", em vermelho, com ícone de sair. | O menu de um workspace de Membro termina em "Sair do workspace". | Essencial | Obrigatório |
| RF105 | Para o proprietário, o último item deve ser "Excluir workspace", em vermelho, com ícone de lixeira, que abre o modal de exclusão de workspace que o produto já usa dentro do workspace (RN101). | Num workspace de proprietário, o menu mostra "Excluir workspace" e não mostra "Sair do workspace". | Essencial | Obrigatório |

## Sair do workspace (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF106 | "Sair do workspace" deve pedir confirmação num modal com "Sair de {nome}?" e "Você perde o acesso a tudo o que está lá dentro. Para voltar, alguém do workspace precisa convidar você de novo." | Fechar o modal mantém o workspace na lista. | Essencial | Obrigatório |
| RF107 | O modal deve ter "Cancelar" e "Sair do workspace", este em vermelho, com ícone de sair e carregamento ao clicar. | O botão vermelho mostra carregamento antes de concluir. | Importante | Obrigatório |
| RF108 | Ao confirmar a saída, a tela deve tirar o workspace da lista e mostrar o toast "Você saiu de {nome}". | A aba "Todos" conta 1 a menos. | Essencial | Obrigatório |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver | Relevância |
|---|---|---|---|
| RI101 | Sair do workspace (rota <a definir>) | Deve tirar a pessoa do workspace e devolver o resultado para a tela atualizar a lista. | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P101 | A API já tem a ação de sair do workspace (RI101)? | dev do back-end | Se não tem, RI101 é obra nova nesta parte |
