# Requisitos: Permissões fixas em matriz

**Objetivo:** o administrador vê e muda as permissões que não dependem de categoria numa matriz por área, com as
mesmas 4 ações da tabela de categorias e as outras ações na mesma linha.

**Onde vale:** as abas Funcionalidades ("O que o cargo faz nas áreas do workspace que não são categorias.") e
Configurações da tela do cargo.

**Protótipo:** https://pernalombr4.github.io/prototipos/permissoes-de-cargos/, abas Funcionalidades e Configurações.
As linhas que pedem permissão nova no back (Painel de tarefas, Relatórios, Faturamento e as outras ações novas) são
do épico "Permissões novas"; aqui entram só as que o back já aceita.

**Fora do escopo:** a aba Categorias (épico "Tela nova de permissões"). A aba Inválidas continua como está.

**Relevância:** Obrigatório, o dev faz. Desejável, o dev faz; se achar melhor não fazer, conversa com produtos antes.
Opcional, o dev pode não fazer quando o esforço é grande para o ganho.

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN301 | Atualizar e Excluir só podem valer na área fixa em que Ver vale. | Com Excluir em Membros, Ver em Membros fica marcado e não se desmarca. | Obrigatório |
| RN302 | Uma alteração de permissão só vale para as pessoas do cargo depois de salva. | Marcar Atualizar em Cargos e sair sem salvar não muda o que as pessoas fazem. | Obrigatório |

## Matriz por área (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF301 | Cada grupo de permissões fixas deve ser uma tabela com 1 linha por área e as colunas Área, Criar, Ver, Atualizar, Excluir e Outras ações. | O grupo Acesso mostra as linhas Cargos, Grupos e Membros. | Essencial | Obrigatório |
| RF302 | Cada caixa deve ligar ou desligar a permissão fixa daquela área e ação. | Marcar Atualizar em Cargos e salvar dá ao cargo a permissão de atualizar cargos. | Essencial | Obrigatório |
| RF303 | A ação que a área não tem deve aparecer vazia, sem caixa. | Uma área sem Excluir não mostra caixa na coluna Excluir. | Essencial | Obrigatório |
| RF304 | Cada área deve mostrar abaixo do nome a descrição de 1 linha do que a área cobre. | Cargos mostra "Cargos e as permissões de cada um.". | Importante | Desejável |
| RF305 | O cabeçalho de cada grupo deve ter uma caixa que marca ou desmarca cada permissão do grupo, com o nome acessível "Marcar tudo em {grupo}". | Marcar o cabeçalho de Acesso marca cada ação de Cargos, Grupos e Membros. | Importante | Obrigatório |
| RF306 | Cada linha deve ter uma caixa que marca ou desmarca cada ação da área, com o nome acessível "Marcar todas as ações de {área}". | Marcar a linha Cargos marca Criar, Ver, Atualizar e Excluir de Cargos. | Importante | Desejável |
| RF307 | Marcar Atualizar ou Excluir numa área deve marcar e travar Ver na mesma área (RN301). | Marcar Excluir em Membros trava Ver em Membros. | Essencial | Obrigatório |

## Aba Funcionalidades (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF312 | A aba Funcionalidades deve ter 2 grupos com título: Geral (Agenda, Tarefas rápidas, Tarefas programadas e Assinaturas) e Automação e IA (Spaceflows e IA). Os grupos são só de leitura: a referência de cada linha não muda. | A aba mostra os 2 títulos, cada um com a caixa do grupo e a contagem. | Importante | Obrigatório |
| RF313 | A linha Assinaturas deve ter Criar, Ver e a outra ação Cancelar (`signature::create`, `read` e `cancel`, que o back já confere). | Marcar Cancelar e salvar deixa o cargo cancelar uma assinatura enviada. | Essencial | Obrigatório |
| RF314 | A linha IA deve ter as outras ações "Usar Chat da IA" e "Gerenciar agentes" (`ai::chat` e `ai::agents`). | A linha IA mostra as 2 caixas. | Essencial | Obrigatório |
| RF315 | A linha Spaceflows de Funcionalidades deve dizer "Iniciar e acompanhar fluxos de trabalho." e a de Configurações › Dados, "Montar e editar fluxos.", para a pessoa distinguir as 2. | As 2 linhas mostram a descrição de 1 linha. | Importante | Obrigatório |
| RF316 | Na aba Configurações, Casos de uso deve ter Criar, Ver, Atualizar e Excluir, como o back calcula; hoje a tela oferece Criar e Ver. | Casos de uso mostra as 4 caixas. | Importante | Obrigatório |

## Outras ações (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF308 | A coluna Outras ações deve mostrar até 2 ações da área como caixas com o nome da ação. | IA mostra "Usar Chat da IA". | Essencial | Obrigatório |
| RF309 | Com 3 ou mais outras ações, a coluna deve mostrar o botão "+{n} ações", que abre a lista de caixas, com a quantidade marcada entre parênteses. | Área com 5 outras ações, 2 marcadas: "+5 ações (2 marcadas)". | Importante | Obrigatório |
| RF317 | O cabeçalho da coluna Outras ações deve ter a caixa que marca ou desmarca todas as outras ações do grupo, como as caixas de Criar, Ver, Atualizar e Excluir. | Marcar a caixa de Outras ações em Automação e IA marca "Iniciar Spaceflow", "Usar Chat da IA" e "Gerenciar agentes". | Importante | Desejável |

## Salvar (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF310 | Cada área fixa alterada deve contar como 1 alteração no aviso de alterações pendentes, com 1 ou mais caixas mexidas (RN302). | Marcar Criar e Atualizar em Membros conta 1 alteração. | Importante | Obrigatório |
| RF311 | A confirmação de "Salvar Alterações" deve listar cada área fixa alterada em palavras: a área e o que mudou. | "Membros: liberou Atualizar". | Importante | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| S301 | As áreas e as outras ações são as que a árvore da develop lista (com Assinaturas e "Gerenciar agentes"), sem permissão nova. | dev do front | Permissão fixa nova entra como linha ou como outra ação, sem mudar a matriz |
| P301 | O cargo gravado hoje com Atualizar ou Excluir sem Ver numa área fixa: a tela marca Ver ao abrir, ou mostra o cargo como está até alguém salvar? | produto | Marcando ao abrir, salvar dá Ver a cargos que hoje não têm |

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
