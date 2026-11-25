# 2. Bloco de notas

**Objetivo:** a pessoa guarda anotações na Home que só ela vê.

**Depende de:** o épico Home em widgets, com Categorias e tarefas.

**Onde vale:** o widget Bloco de notas, no grupo Equipe e notas do catálogo.

**Protótipo:** https://pernalombr4.github.io/prototipos/home, com "Proposta completa" em "Versão".

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN101 | A nota é de 1 pessoa em 1 workspace, e só essa pessoa lê e edita a nota. | O administrador não lê a nota de um membro. | Obrigatório |

## O widget (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF101 | O widget deve ter um campo de texto com o texto de ajuda "Escreva aqui. Só você vê.". | O campo vazio mostra o texto de ajuda. | Essencial | Obrigatório |
| RF102 | O texto deve ficar gravado (RN101) sem botão de salvar, enquanto a pessoa escreve. | Escrever, recarregar a página e ver o texto no lugar. | Essencial | Obrigatório |
| RF103 | O pé do widget deve mostrar o cadeado e "Só você vê". | O aviso fica no pé do widget, abaixo do campo. | Importante | Obrigatório |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver | Relevância |
|---|---|---|---|
| RI101 | <a definir> | Lê e grava a nota da pessoa no workspace. O modelo de nota de hoje (`c-item-notes`) é nota de item e não serve. | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P101 | A nota tem limite de tamanho? | produto | RF101 |
| P102 | A nota aceita formatação (lista, negrito) ou é só texto? | produto | RF101 |
