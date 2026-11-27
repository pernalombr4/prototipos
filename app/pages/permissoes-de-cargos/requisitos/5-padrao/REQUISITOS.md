# Requisitos: Padrão para novas categorias

**Objetivo:** o administrador define o que o cargo recebe em cada categoria criada a partir de agora, e a categoria
nova já nasce com essa permissão. As categorias que já existem não mudam.

**Depende de:** épico "Tela nova de permissões", onde fica o bloco do padrão; épico "Quais itens, criador e
responsável", só para a seção "Quais itens no padrão".

**Onde vale:** o bloco "Padrão para novas categorias", acima da busca na aba Categorias da aba Dados; a confirmação de
"Salvar Alterações"; e a criação de categoria, que grava a permissão do padrão em cada cargo.

**Protótipo:** https://pernalombr4.github.io/prototipos/permissoes-de-cargos/, aba Dados › Categorias, bloco "Padrão
para novas categorias".

**Fora do escopo:** mudar as categorias que já existem pelo padrão (a caixa do cabeçalho de cada ação, do épico 3,
faz isso na lista filtrada); as permissões fixas, que ficam na aba Fora das categorias.

**Relevância:** Obrigatório, o dev faz. Desejável, o dev faz; se achar melhor não fazer, conversa com produtos antes.
Opcional, o dev pode não fazer quando o esforço é grande para o ganho.

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN101 | O padrão vale só para a categoria criada depois de salvo. A categoria que já existe guarda o próprio valor. | Com Ver no padrão, a categoria "Fornecedores" criada amanhã nasce com Ver; "Contratos", que já existe sem Ver, continua sem Ver. | Obrigatório |
| RN102 | A categoria nova recebe uma cópia do padrão. Mudar o padrão depois não muda a categoria já criada. | "Fornecedores" nasce com Ver; tirar Ver do padrão na semana seguinte não tira Ver de "Fornecedores". | Obrigatório |
| RN103 | Na regra de responsável do padrão, conta cada campo Pessoa da categoria nova. | Padrão com Ver só se for o responsável: em "Chamados de TI" criada depois, contam "Responsável" e "Solicitante". | Obrigatório |

## Bloco do padrão (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF101 | A aba Categorias deve ter, acima da busca e fora da tabela, o bloco "Padrão para novas categorias", com a frase "O que este cargo recebe em cada categoria criada a partir de agora. As categorias que já existem não mudam.". | O bloco fica acima da busca e não muda com busca ou filtro. | Essencial | Obrigatório |
| RF102 | O bloco deve ter a linha "Ações na categoria", com as caixas Criar, Ver, Atualizar e Excluir alinhadas às colunas da tabela de categorias. | As 4 caixas ficam na mesma coluna que as caixas das categorias. | Essencial | Obrigatório |
| RF103 | Mudar uma caixa do bloco não deve mudar nenhuma categoria da tabela (RN101). | Marcar Excluir no padrão deixa as 120 categorias como estavam. | Essencial | Obrigatório |
| RF104 | Marcar Atualizar ou Excluir no padrão deve marcar e travar Ver no padrão, como nas categorias. | Marcar Excluir no padrão trava Ver no padrão, com o cadeado e o motivo. | Essencial | Obrigatório |
| RF105 | O bloco alterado e ainda não salvo deve mostrar o ponto de "Alterada, não salva" junto do título. | Marcar Criar no padrão mostra o ponto até salvar ou descartar. | Importante | Obrigatório |
| RF106 | No workspace sem categorias, o aviso deve dizer também "Quando alguém criar uma, ela recebe o padrão para novas categorias.". | O workspace novo mostra as 2 frases. | Desejável | Desejável |

## Categoria nova (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF107 | Criar uma categoria deve gravar, em cada cargo, as ações do padrão daquele cargo (RN101). | Cargo com Ver e Criar no padrão: a categoria "Fornecedores" criada depois aparece com Ver e Criar na tela do cargo. | Essencial | Obrigatório |
| RF108 | A categoria nova deve aparecer na tabela como qualquer outra, sem marca de origem. | "Fornecedores" mostra as caixas marcadas, sem selo nem tom diferente. | Importante | Obrigatório |

## Confirmação (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF109 | A confirmação deve dizer a mudança do padrão em palavras, com o alcance. | "Padrão para novas categorias: liberou Ver; vale só para as categorias criadas a partir de agora". | Essencial | Obrigatório |

## Quais itens no padrão (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF110 | O bloco deve ter as linhas "Só se for o criador" e "Só se for o responsável", com as caixas Ver, Atualizar e Excluir. Criar não tem regra de itens. | O bloco mostra as 2 linhas abaixo de "Ações na categoria". | Importante | Obrigatório |
| RF111 | A caixa de regra de uma ação desligada no padrão deve ficar desabilitada, com a dica "Libere {ação} para usar a regra.". | Sem Excluir no padrão, as caixas de Excluir das 2 linhas ficam desabilitadas. | Importante | Obrigatório |
| RF112 | A linha "Só se for o responsável" deve dizer "No padrão, conta qualquer campo Pessoa da categoria." (RN103). | O bloco não tem a escolha de campos Pessoa. | Importante | Obrigatório |
| RF113 | A categoria nova deve receber também a regra de itens do padrão. | Padrão com Ver só se for o criador: "Fornecedores" criada depois tem Ver só se for o criador. | Importante | Obrigatório |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver | Relevância |
|---|---|---|---|
| RI101 | Permissão do padrão no cargo | Uma referência do padrão por ação, aceita na gravação do cargo e lida ao criar categoria; o formato fica <a definir>. | Obrigatório |
| RI102 | Criação de categoria | Grava em cada cargo as permissões da categoria nova a partir do padrão do cargo (RF107, RF113). | Obrigatório |

## Não funcionais, restrições e transição (RNF, RS, RT)

| ID | Requisito | Como medir ou conferir | Prioridade | Relevância |
|---|---|---|---|---|
| RT101 | Na migração, o cargo gravado hoje deve abrir com o padrão vazio e cada categoria com as permissões de hoje. Critério de fim: cargos migrados. | Nenhum cargo muda o que vê ou faz depois da migração. | Essencial | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P101 | A categoria criada pela API, pela importação ou por agente de IA também recebe o padrão? | produto | Recebendo, RI102 vale em toda porta de criação de categoria, não só na tela |
| P102 | Na migração, o padrão vazio dá a cada categoria nova nenhuma permissão nos cargos de hoje. Isso basta, ou o padrão nasce com Ver? | produto | Nascendo com Ver, RT101 muda: o padrão começa com Ver em cada cargo |

## Padrão de qualidade

| Tema | O que se espera |
|---|---|
| Idiomas | Cada texto existe em português, inglês e espanhol, com plural e número do dicionário de textos. Nenhum texto estoura o espaço. |
| Temas | A tela funciona em cada tema do produto, só com as cores do tema. Texto com contraste de 4,5:1. |
| Chamada à API | Carregamento no controle clicado, esqueleto enquanto a lista carrega e aviso de erro com "Tentar de novo". Depois de cada alteração, a tela recarrega o dado. |
| Avisos | Cada alteração mostra um toast de confirmação, e cada erro mostra um aviso. O texto de cada um está no protótipo. |
| Animação | Entrada, hover, troca de estado e abertura de modal seguem o padrão de animação do produto. Com `prefers-reduced-motion`, nada anima. |
| Acessibilidade | Botão só de ícone e caixa de marcar com nome acessível, modal com título e descrição, foco visível no teclado. |
| Visual | Medida, cor, espaçamento, ícone e texto seguem o protótipo, no computador e no celular. Ação clicável fora de texto corrido é botão com borda ou fundo. Texto sem travessão. |
| Documentação | A documentação de suporte cobre a funcionalidade antes do lançamento. |
