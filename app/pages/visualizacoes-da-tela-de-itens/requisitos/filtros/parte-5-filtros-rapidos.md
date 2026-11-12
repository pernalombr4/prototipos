# 5. Filtros rápidos

**Objetivo:** a pessoa liga e desliga com 1 clique os filtros que usa sempre. Os filtros rápidos do sistema aparecem
em toda visualização, e a pessoa cria os próprios, com nome e regras.

**Depende de:** 1. Linha de filtros e chip por campo; 3. Filtro avançado, porque as regras do filtro rápido usam o
construtor dele.

**Onde vale:** a linha de filtros e a seção Filtros do painel Configurar, também ao criar uma visualização, em toda
visualização da tela de itens, inclusive "Itens"; em Tarefas Rápidas e Tarefas Agendadas, com os filtros rápidos do
sistema da RN009.

**Protótipo:** https://pernalombr4.github.io/prototipos/visualizacoes-da-tela-de-itens. A visualização "Vencendo em 30
dias" tem 2 filtros rápidos criados, "Alta prioridade" e "Jurídico".

## Botões na linha de filtros (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF164 | Cada filtro rápido do sistema da tela (RN009) com o uso "Como botão" (RN016) deve aparecer como botão no começo da linha de filtros, em toda visualização, sem configuração. | Em "Itens", a linha mostra "Meus itens" e "Dos meus grupos" antes do "+ Filtro". | Essencial | Obrigatório |
| RF165 | Cada filtro rápido criado na visualização deve aparecer como botão depois dos filtros rápidos do sistema, na ordem de criação. | Em "Vencendo em 30 dias", a linha mostra "Meus itens", "Dos meus grupos", "Alta prioridade" e "Jurídico". | Essencial | Obrigatório |
| RF166 | Um separador deve dividir os botões dos filtros rápidos dos chips e do "+ Filtro". | Em "Vencendo em 30 dias", o separador fica entre "Jurídico" e "Vencimento: nos próximos 30 dias". | Desejável | Desejável |
| RF167 | Clicar no botão deve alternar o filtro rápido entre ligado e desligado. | Clicar "Meus itens" em "Itens" mostra só os itens da pessoa; clicar de novo mostra os 48. | Essencial | Obrigatório |
| RF168 | O botão ligado deve aparecer em destaque, com o ícone de marcado no lugar do ícone do filtro. | "Meus itens" ligado aparece em destaque, com o ícone de marcado. | Importante | Obrigatório |
| RF169 | O filtro rápido ligado deve valer junto com os outros filtros, conforme RN007. | "Alta prioridade" ligado em "Vencendo em 30 dias" mostra só os itens de prioridade Alta que vencem nos próximos 30 dias. | Essencial | Obrigatório |
| RF170 | Ligar ou desligar um filtro rápido não deve contar como alteração da visualização. | Ligar "Meus itens" não mostra a barra de alterações não salvas. | Essencial | Obrigatório |
| RF171 | O filtro rápido ligado deve continuar ligado até a pessoa sair da visualização. | Trocar de visualização e voltar mostra "Meus itens" desligado. | Importante | Obrigatório |
| RF172 | A dica do botão do sistema deve mostrar o que o filtro faz e "Filtro do sistema. Clique para ligar ou desligar.". | Parar o mouse sobre "Meus itens" mostra "Itens em que você é o dono." e a frase do sistema. | Desejável | Desejável |
| RF173 | A dica do botão criado deve mostrar as regras do filtro rápido e "Clique para ligar ou desligar. Botão direito para editar.". | Parar o mouse sobre "Alta prioridade" mostra a regra de Prioridade e a frase. | Desejável | Desejável |

## Criar, editar e excluir (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF182 | "+ Filtro" deve ter "Filtro rápido", que abre o modal "Novo filtro rápido" vazio. | Em "Itens", "+ Filtro" > "Filtro rápido" abre o modal sem nome e sem regra. | Essencial | Obrigatório |
| RF183 | O "⋯" do chip deve ter "Salvar como filtro rápido", que abre o modal com o campo e o valor do chip no nome e a regra do chip. | No chip "Status: não é Vencido", o modal abre com o nome "Status: não é Vencido" e a regra "Status não é Vencido". | Essencial | Obrigatório |
| RF184 | Criar o filtro rápido pelo chip deve tirar o chip da linha e criar o botão já ligado. | Criar pelo chip "Status: não é Vencido" troca o chip pelo botão ligado, e a tabela continua com os mesmos itens. | Importante | Obrigatório |
| RF185 | O modal deve pedir "Nome do botão" e "O que o botão filtra", com o construtor do filtro avançado (E, Ou e grupos). | O modal "Novo filtro rápido" monta 2 regras ligadas por Ou. | Essencial | Obrigatório |
| RF186 | O modal só deve criar ou salvar o filtro rápido que cumpre RN014 e RN015. | Criar sem nome mostra "Dê um nome ao filtro rápido."; com o nome "jurídico" em "Vencendo em 30 dias", mostra "Já existe um filtro rápido com este nome nesta visualização."; sem valor, "Escolha pelo menos 1 valor numa regra.". | Essencial | Obrigatório |
| RF187 | O botão direito no botão criado deve abrir "Editar filtro rápido" e "Excluir filtro rápido". | Botão direito em "Alta prioridade" mostra as 2 opções. | Importante | Obrigatório |
| RF188 | O modal de edição deve ter "Excluir filtro rápido". | O modal de "Jurídico" exclui o filtro rápido. | Importante | Obrigatório |
| RF189 | Os botões dos filtros rápidos do sistema não devem ter editar nem excluir. | Botão direito em "Meus itens" não abre menu. | Importante | Obrigatório |
| RF190 | Criar, editar e excluir um filtro rápido devem contar como alteração da visualização, com a barra de alterações não salvas e as permissões de salvar do épico "Criar, configurar e salvar visualização". | Criar "Alta prioridade" em "Itens" mostra a barra de alterações não salvas; "Descartar" tira o botão. | Essencial | Obrigatório |
| RF191 | Criar, salvar e excluir devem mostrar o toast do protótipo: "Filtro rápido <nome> criado." com "Ele fica na visualização quando você salvar.", "Filtro rápido <nome> alterado." e "Filtro rápido <nome> excluído.". | Criar "Alta prioridade" mostra "Filtro rápido Alta prioridade criado.". | Importante | Obrigatório |

## No painel Configurar (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF192 | A seção Filtros do painel Configurar, também ao criar uma visualização, deve ter o bloco "Filtros rápidos", com as partes "Do sistema" e "Criados por você". | Em "+ Visualização" > "Tabela", o painel mostra o bloco com "Meus itens" e "Dos meus grupos" em "Do sistema". | Essencial | Obrigatório |
| RF193 | Cada filtro rápido do sistema deve ter a escolha "Como usar <nome>", com "Como botão", "Sempre aplicado" e "Não usar", conforme RN016. "Como botão" vem marcado na visualização nova. | Trocar "Meus itens" para "Não usar" tira o botão da linha. | Essencial | Obrigatório |
| RF194 | "Criados por você" deve listar os filtros rápidos da visualização, cada um com editar e excluir, e "Adicionar filtro rápido", que abre o modal vazio. | Em "Vencendo em 30 dias", a lista mostra "Alta prioridade" e "Jurídico". | Essencial | Obrigatório |
| RF195 | Sem filtro rápido criado, "Criados por você" deve mostrar "Nenhum filtro rápido.". | Em "Itens", a parte mostra "Nenhum filtro rápido.". | Desejável | Desejável |
| RF196 | Cada filtro do grupo "Por campo" deve ter o botão "Salvar como filtro rápido", que abre o modal como o "⋯" do chip (RF183) e cria o botão já ligado. | Em "Em análise", o botão da linha Status cria o filtro rápido "Status: Em análise", ligado. | Importante | Obrigatório |

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN014 | O nome do filtro rápido tem de 1 a 40 caracteres e é único na visualização, sem diferenciar maiúsculas de minúsculas. | "jurídico" repete "Jurídico" em "Vencendo em 30 dias". | Obrigatório |
| RN015 | O filtro rápido tem pelo menos 1 regra com valor. "Está vazio" e "Está preenchido" contam como regra com valor. | "Prioridade é" sem opção marcada não basta. | Obrigatório |
| RN016 | O uso de cada filtro rápido do sistema numa visualização é o da tabela a seguir. Política: Única. | Linha 2: "Meus contratos" aplica "Só itens meus" sempre, sem o botão "Meus itens". | Obrigatório |

Uso do filtro rápido do sistema (RN016).

| Linha | Uso | Na linha de filtros | Filtra |
|---|---|---|---|
| 1 | "Como botão" | o botão, desligado ao abrir a visualização | quando a pessoa liga o botão |
| 2 | "Sempre aplicado" | a etiqueta com X, sem o botão; o X tira o filtro, como alteração da visualização | sempre |
| 3 | "Não usar" | nada | nunca |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver | Relevância |
|---|---|---|---|
| RI010 | Visualização (`ModelView`), `filters.quick_filters` | Deve guardar o uso de cada filtro rápido do sistema (RN016). Hoje a entrada sem `required` vira botão e a entrada com `required` é o filtro sempre aplicado; o produto não tem como guardar "Não usar". No protótipo: sem entrada é "Como botão", e "Não usar" é `oculto: true`. Formato: <a definir>. | Obrigatório |
| RI011 | Visualização (`ModelView`), filtros rápidos criados | Deve guardar, na ordem, o nome e a árvore de regras de cada filtro rápido criado, no formato do filtro avançado (parte 3). Hoje `filters.quick_filters` guarda só a chave de um filtro pronto do produto. No protótipo: `filters.rapidos`, com `id`, `nome` e `regras`. Formato: <a definir>. | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P019 | O botão ligado fica ligado ao voltar à visualização, ou volta desligado, como no protótipo (RF171)? | Mikaela | Ficando ligado, o produto guarda o estado por pessoa e por visualização |
| P020 | Quem não pode salvar a visualização pode criar filtro rápido só para si, na versão só minha do épico "Criar, configurar e salvar visualização"? | Mikaela | Com a versão só minha, RF190 vale também para ela |
| P021 | Existe um limite de filtros rápidos criados por visualização? | Mikaela | Com limite, o modal ganha a regra e o aviso |
| S006 | Em Tarefas Rápidas e Tarefas Agendadas, os filtros prontos da RN009 viram botões do sistema, como "Meus itens" na tela de itens. O protótipo mostra só a tela de itens. | Mikaela | Sem isso, as 2 telas ficam com os filtros prontos como hoje |
