# Requisitos: Quem acessa a categoria

**Objetivo:** o administrador vê, na configuração da categoria, o que cada cargo do workspace faz nela, sem abrir a
tela de cada cargo. A vista só mostra; para mudar, a pessoa abre o cargo pelo link.

**Onde vale:** a configuração da categoria, numa seção ou aba "Quem acessa" só de leitura. Sai da tela do cargo: é uma
informação de todos os cargos, que fica acima de um cargo só.

**Protótipo:** sem tela no protótipo. A tela do cargo (https://pernalombr4.github.io/prototipos/permissoes-de-cargos/)
mostrava esta tabela até a rodada 6; o desenho segue o mesmo: 1 linha por cargo e as 4 ações em colunas.

**Fora do escopo:** mudar a permissão de um cargo por esta vista; a tela de itens, que é de quem usa a categoria e não
de quem decide permissão; e uma matriz de todos os cargos com todas as categorias.

**Relevância:** Obrigatório, o dev faz. Desejável, o dev faz; se achar melhor não fazer, conversa com produtos antes.
Opcional, o dev pode não fazer quando o esforço é grande para o ganho.

## Quem acessa (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF501 | A configuração da categoria deve ter a seção "Quem acessa", com a quantidade de cargos do workspace junto do título. | O workspace com 7 cargos mostra "Quem acessa" com 7. | Importante | Desejável |
| RF502 | A seção deve mostrar 1 linha por cargo, com as colunas Cargo, Pessoas, Criar, Ver, Atualizar e Excluir, e "Tem" ou "Não tem" em cada ação. | O cargo "Financeiro" mostra "Tem" em Ver e "Não tem" em Excluir. | Importante | Desejável |
| RF503 | A ação que vale só em parte dos formulários, dos campos ou dos itens deve mostrar "Em parte", com a dica do que limita. | Ver só em Criminal mostra "Em parte" e a dica "Ver só em: Criminal". | Importante | Desejável |
| RF504 | O nome do cargo deve ser um link para a tela de permissões dele, aberta na categoria. | O clique em "Financeiro" abre o cargo Financeiro com a categoria aberta. | Importante | Desejável |
| RF505 | A seção deve dizer "O que cada cargo do workspace faz nesta categoria. Para mudar, abra a tela do cargo." e não ter caixa de marcar. | A frase aparece acima da tabela, e a tabela só mostra "Tem", "Não tem" e "Em parte". | Importante | Desejável |
| RF506 | A chave "Esconder cargos sem acesso" deve deixar só os cargos com ao menos 1 ação na categoria. | Sem cargo com acesso, a seção mostra "Nenhum cargo acessa esta categoria.". | Desejável | Opcional |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver | Relevância |
|---|---|---|---|
| RI501 | `GET /ws/roles` e `GET /ws/roles/{id}/permissions` | Os cargos do workspace e as permissões de cada um dão as linhas da seção. | Desejável |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P501 | Com muitos cargos, ler as permissões de cada um ao abrir a seção fica lento? | dev do back | Lento, a seção pede uma rota que devolva as permissões de todos os cargos para 1 categoria, e este épico passa a pedir essa rota ao back |
| P502 | Em que lugar da configuração da categoria a seção entra: aba própria ou bloco no fim da página? | produto | Muda só o lugar; a tabela é a mesma |

## Padrão de qualidade

| Tema | O que se espera |
|---|---|
| Idiomas | Cada texto existe em português, inglês e espanhol, com plural e número do dicionário de textos. Nenhum texto estoura o espaço. |
| Temas | A tela funciona em cada tema do produto, só com as cores do tema. Texto com contraste de 4,5:1. |
| Chamada à API | Esqueleto enquanto a lista carrega e aviso de erro com "Tentar de novo". |
| Acessibilidade | "Tem", "Não tem" e "Em parte" com nome acessível, nunca só cor ou ícone; foco visível no teclado. |
| Visual | Medida, cor, espaçamento, ícone e texto seguem a tabela de categorias do protótipo. Link com cara de link, sem parecer botão. Texto sem travessão. |
| Documentação | A documentação de suporte cobre a funcionalidade antes do lançamento. |
