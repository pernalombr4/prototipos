# 4. Ordem para todos

**Objetivo:** Owner ou Full aplica a própria ordem como a ordem padrão da tela, recupera a ordem padrão e escolhe a
visualização que abre primeiro para todos.

**Depende de:** 2. Menu da visualização; 3. Reordenar e fixar.

**Onde vale:** o grupo "Para todos" e o grupo "Só para mim" do menu da visualização e o rodapé da lista do "+N", na tela
de itens, em Tarefas Rápidas e em Tarefas Agendadas.

**Protótipo:** https://pernalombr4.github.io/prototipos/visualizacoes-da-tela-de-itens, com "Perfil: Owner ou Full" na
barra inferior.

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN003 | A ordem padrão é a ordem que vale para quem não mudou a própria ordem. Só Owner ou Full pode mudar a ordem padrão. | Owner aplica a ordem dele para todos; quem nunca reordenou passa a ver essa ordem. | Obrigatório |

## Ordem padrão (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF036 | "Aplicar minha ordem para todos" deve gravar a ordem da pessoa como ordem padrão (RN003), com Desfazer no aviso (RN010). | O aviso diz "Sua ordem agora é a de todos."; Desfazer volta a ordem padrão anterior. | Essencial | Obrigatório |
| RF037 | "Recuperar a ordem padrão" deve trocar a ordem da pessoa pela ordem padrão e desafixar as fixadas, com Desfazer no aviso (RN010). | Desfazer volta a ordem e as fixadas da pessoa. | Essencial | Obrigatório |
| RF038 | As 2 ações devem ficar desligadas quando a ordem da pessoa é igual à ordem padrão. | Sem reordenar nada, as 2 aparecem desligadas. | Importante | Obrigatório |
| RF039 | As 2 ações devem aparecer só para Owner ou Full (RN004, linha 4). | Standard ou Viewer não as vê no menu nem na lista do "+N". | Essencial | Obrigatório |
| RF073 | Para Owner ou Full, o rodapé da lista do "+N" deve ter "Aplicar minha ordem para todos" e "Recuperar a ordem padrão". | Standard ou Viewer não vê o rodapé. | Essencial | Obrigatório |

## Visualização que abre primeiro (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF151 | "Abrir primeiro para todos" deve marcar a visualização do menu como a que abre quando a pessoa entra na tela sem `?view=` no endereço, conforme RN004, linha 3. | Marcar "Vencidos" e abrir a tela sem `?view=` abre "Vencidos". | Importante | Obrigatório |
| RF152 | Na visualização que já abre primeiro, o item deve aparecer desligado, como "Abre primeiro para todos", com a explicação no próprio item. | O menu de "Vencidos", depois de marcada, mostra "Abre primeiro para todos" desligado. | Importante | Obrigatório |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver | Relevância |
|---|---|---|---|
| RI009 | Ordem padrão da tela | Deve guardar a ordem padrão de cada tela (RN003), separada da ordem de cada pessoa. Rota e formato: <a definir>. | Obrigatório |
| RI004 | Visualização que abre primeiro | Deve marcar 1 visualização por tela com `default` e devolvê-la ao abrir a tela sem `?view=`. | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P002 | "Abrir primeiro para todos" vale para o workspace inteiro ou por pessoa? O protótipo assume o workspace. | Mikaela e produto | Muda a visualização que abre primeiro e o texto do menu |
| S002 | Recuperar a ordem padrão também desafixa, porque fixar faz parte da ordem pessoal. | Mikaela confirma | Se não, as fixadas ficam no começo depois de recuperar |
| S004 | "Recuperar a ordem padrão" não mostra as ocultas nem tira a minimização: as 2 são escolhas de aparência de cada pessoa, não de ordem. | Mikaela confirma | Se não, recuperar a ordem também devolve as ocultas e os nomes |
