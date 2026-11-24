# 2. Padrão para todas as categorias

**Objetivo:** o administrador define uma vez o que o cargo faz em toda categoria, inclusive nas criadas depois, e
marca só as exceções.

**Onde vale:** a primeira linha da seção Categorias, na aba Dados da tela do cargo, e a confirmação de "Salvar
Alterações".

**Protótipo:** https://pernalombr4.github.io/prototipos/permissoes-de-cargos/, linha "Padrão para todas as categorias".

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN101 | O padrão vale para cada categoria sem regra própria, inclusive a categoria criada depois. | Com Ver no padrão, a categoria "Fornecedores" criada amanhã já tem Ver para o cargo. | Obrigatório |
| RN102 | A regra própria da categoria vence o padrão, ação por ação. | Padrão com Excluir e "Reembolsos" com regra própria sem Excluir: o cargo não exclui em "Reembolsos". | Obrigatório |
| RN103 | Uma categoria passa a ter regra própria quando alguma caixa dela fica diferente do padrão. | Desmarcar Ver em "Contratos" com Ver no padrão dá regra própria a "Contratos". | Obrigatório |

## Linha do padrão (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF101 | A primeira linha da seção Categorias deve ser "Padrão para todas as categorias", com as 4 caixas alinhadas às colunas e a frase "Vale para toda categoria sem regra própria, inclusive as criadas depois.". | A linha fica acima da primeira categoria e não some com busca ou filtro. | Essencial | Obrigatório |
| RF102 | Cada caixa do padrão deve mudar a ação em cada categoria sem regra própria (RN101). | Marcar Ver no padrão marca Ver, em tom claro, em cada categoria que segue o padrão. | Essencial | Obrigatório |
| RF103 | Abaixo do padrão, cada ação deve mostrar o contador de exceções com direção: "Liberado em {n}" e "Tirado em {n}". | Ver no padrão e 9 categorias sem Ver mostra "Tirado em 9" em Ver. | Importante | Desejável |
| RF104 | Marcar Atualizar ou Excluir no padrão deve marcar e travar Ver no padrão (RN901). | Marcar Excluir no padrão trava Ver no padrão. | Essencial | Obrigatório |

## Categoria que segue o padrão (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF105 | A categoria sem regra própria deve mostrar "Segue o padrão" e as caixas em tom claro. | "Fornecedores" sem regra mostra "Segue o padrão". | Essencial | Obrigatório |
| RF106 | A categoria com regra própria deve mostrar o selo "Regra própria" e as caixas diferentes do padrão em cor cheia (RN103). | Desmarcar Ver em "Contratos" mostra o selo e Ver vazio em cor cheia. | Essencial | Obrigatório |
| RF107 | Cada caixa diferente do padrão deve ter o desfazer "Voltar {ação} ao padrão em {categoria}". | O desfazer de Ver em "Contratos" volta Ver ao valor do padrão. | Importante | Desejável |
| RF108 | A linha da categoria com regra própria deve ter "Voltar ao padrão", que tira a regra própria inteira. | "Voltar ao padrão" em "Contratos" volta as 4 caixas, os campos e os formulários ao padrão. | Importante | Obrigatório |
| RF109 | A categoria com as 4 caixas iguais às do padrão deve voltar a seguir o padrão. | Marcar de novo Ver em "Contratos" tira o selo "Regra própria". | Importante | Obrigatório |
| RF110 | A tabela deve ter o filtro "Regra própria", com a contagem de categorias com regra própria. | O filtro mostra só as categorias com o selo. | Importante | Obrigatório |
| RF111 | No workspace sem categorias, o aviso deve dizer também "Quando alguém criar uma, ela segue o padrão acima.". | O workspace novo mostra as 2 frases. | Desejável | Desejável |

## Confirmação (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF112 | A confirmação deve dizer a mudança do padrão em palavras, com o alcance. | "Padrão das categorias: liberou Ver, vale para 111 categorias". | Essencial | Obrigatório |
| RF113 | A confirmação deve dizer quando uma categoria passa a ter regra própria ou volta a seguir o padrão. | "Contratos: passou a ter regra própria". "Reembolsos: voltou a seguir o padrão". | Importante | Obrigatório |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver | Relevância |
|---|---|---|---|
| RI101 | Permissão do padrão no cargo | Uma referência que vale para toda categoria, aceita na gravação do cargo; o formato fica <a definir>. | Obrigatório |
| RI102 | Checagem de permissão de item | A regra própria da categoria vence a referência do padrão (RN102). | Obrigatório |

## Não funcionais, restrições e transição (RNF, RS, RT)

| ID | Requisito | Como medir ou conferir | Prioridade | Relevância |
|---|---|---|---|---|
| RT101 | Na migração, o cargo gravado hoje deve abrir com o padrão vazio e cada categoria com as permissões de hoje. Critério de fim: cargos migrados. | Nenhum cargo muda o que vê ou faz depois da migração. | Essencial | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P101 | Quem quer que uma categoria não acompanhe a mudança futura do padrão, com as 4 caixas iguais às dele, consegue travar a categoria? | produto | Pedindo trava, RF109 vira escolha da pessoa, e não automático |
| P102 | Na migração, o cargo com a mesma regra em todas as categorias já abre com essa regra no padrão? | produto | Abrindo, RT101 muda: o padrão nasce preenchido e as categorias seguem o padrão |
