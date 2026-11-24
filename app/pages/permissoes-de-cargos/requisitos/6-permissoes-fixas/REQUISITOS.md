# Requisitos: Permissões fixas em matriz

**Objetivo:** o administrador vê e muda as permissões que não dependem de categoria numa matriz por área, com as
mesmas 4 ações da tabela de categorias e as outras ações na mesma linha.

**Onde vale:** a seção Padrão da aba Dados ("O que o cargo faz fora das categorias.") e a aba Configurações da tela
do cargo.

**Protótipo:** https://pernalombr4.github.io/prototipos/permissoes-de-cargos/, seção Padrão da aba Dados e aba
Configurações.

**Fora do escopo:** a seção Categorias (épico "Tela nova de permissões"). A aba Inválidas continua como está.

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

## Outras ações (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF308 | A coluna Outras ações deve mostrar até 2 ações da área como caixas com o nome da ação. | IA mostra "Usar Chat da IA". | Essencial | Obrigatório |
| RF309 | Com 3 ou mais outras ações, a coluna deve mostrar o botão "+{n} ações", que abre a lista de caixas, com a quantidade marcada entre parênteses. | Área com 5 outras ações, 2 marcadas: "+5 ações (2 marcadas)". | Importante | Obrigatório |

## Salvar (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF310 | Cada área fixa alterada deve contar como 1 alteração no aviso de alterações pendentes, com 1 ou mais caixas mexidas (RN302). | Marcar Criar e Atualizar em Membros conta 1 alteração. | Importante | Obrigatório |
| RF311 | A confirmação de "Salvar Alterações" deve listar cada área fixa alterada em palavras: a área e o que mudou. | "Membros: liberou Atualizar". | Importante | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| S301 | As áreas, os grupos e as outras ações são os que a tela de hoje lista, sem permissão nova. | dev do front | Permissão fixa nova entra como linha ou como outra ação, sem mudar a matriz |
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
