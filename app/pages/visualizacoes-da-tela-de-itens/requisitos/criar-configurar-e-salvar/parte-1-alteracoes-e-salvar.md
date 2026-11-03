# 1. Alterações não salvas e salvar

**Objetivo:** o que a pessoa muda na visualização ativa fica aplicado só para ela até salvar; pela barra flutuante na
base da tela, ela salva para todos, só para ela ou como nova visualização, descarta, ou fecha a barra e segue com o
ajuste.

**Onde vale:** a visualização ativa, a pílula dela na barra de visualizações e a base da tela, na tela de itens, em
Tarefas Rápidas e em Tarefas Agendadas.

**Protótipo:** https://pernalombr4.github.io/prototipos/visualizacoes-da-tela-de-itens. Tirar o chip "Status: Em
análise" da visualização "Em análise" mostra a barra flutuante.

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN005 | Uma versão "só para mim" vale só para quem a salvou, por cima da versão compartilhada da visualização. | Mikaela salva "Em análise" só para ela com o filtro "Área é Financeiro"; os outros veem "Em análise" sem esse filtro. | Obrigatório |
| RN012 | A visualização do sistema de cada tela ("Itens", "Tarefas Rápidas", "Tarefas Programadas") só recebe alteração como versão "só para mim" ou como visualização nova. | Em "Itens", salvar oferece "Salvar só para mim" e "Salvar como nova visualização". | Obrigatório |

## Alteração não salva (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF029 | Quando a pessoa muda filtro, ordenação ou coluna da visualização ativa, pela linha de filtros, pelo título da coluna ou pelo construtor de visualização, o sistema deve guardar a mudança como alteração não salva, sem gravar. | Recarregar a página desfaz a alteração. | Essencial | Obrigatório |
| RF030 | A visualização com alteração não salva deve mostrar um ponto na cor de alerta: na seta ⌄ quando ativa, depois do nome quando não ativa e na linha da lista do "+N". | Trocar de visualização mantém o ponto na que ficou com alteração. | Essencial | Obrigatório |
| RF156 | O ponto de alteração não salva deve ter o nome acessível "Alterações não salvas". | O leitor de tela lê "Alterações não salvas" na pílula. | Importante | Obrigatório |
| RF035 | Descartar deve voltar a visualização ao que estava salvo. | O ponto e a barra flutuante somem. | Essencial | Obrigatório |

## Barra flutuante (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF031 | Enquanto a visualização ativa tem alteração não salva e o construtor de visualização está fechado, o sistema deve mostrar uma barra flutuante centrada na base da tela com "Você alterou <nome>", a ajuda, Descartar e o botão de salvar com seta. | Aplicar "Área é Financeiro" em "Em análise" mostra a barra. | Essencial | Obrigatório |
| RF032 | O botão de salvar e a ajuda da barra devem seguir a tabela a seguir, conforme RN011 e RN012; as outras opções da linha ficam na seta. | Owner ou Full em "Em análise" vê "Salvar para todos", com "Salvar só para mim" e "Salvar como nova visualização" na seta. | Essencial | Obrigatório |
| RF086 | A barra flutuante deve ter um X com o tooltip "Fechar sem salvar. O ajuste continua aplicado para você.", que fecha a barra e mantém a alteração aplicada. | Fechar a barra depois de tirar "Status: Em análise" mantém os 48 itens na tabela e o ponto na pílula. | Essencial | Obrigatório |
| RF087 | Depois do X, a barra flutuante deve voltar quando a pessoa faz outra mudança na mesma visualização. | Ordenar por Fornecedor depois do X mostra a barra de novo. | Importante | Desejável |

| Linha | Visualização ativa | Perfil | Botão principal | Na seta | Ajuda da barra flutuante |
|---|---|---|---|---|---|
| 1 | De todos, fora a do sistema | Owner ou Full | "Salvar para todos" | "Salvar só para mim", "Salvar como nova visualização" | "Salve para tornar esta versão o padrão desta visualização." |
| 2 | De todos | Standard ou Viewer | "Salvar só para mim" | "Salvar como nova visualização" | "Salve para manter esta versão como a sua." |
| 3 | A do sistema | cada perfil | "Salvar só para mim" | "Salvar como nova visualização" | "Salve para manter esta versão como a sua." |
| 4 | Só minha | cada perfil | "Salvar" | "Salvar como nova visualização" | "Salve para tornar esta versão o padrão desta visualização." |

## Salvar como nova visualização (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF157 | "Salvar como nova visualização" deve abrir o modal "Salvar como nova visualização", com o nome "<nome> (cópia)" e o botão "Criar visualização". | Em "Em análise", o campo vem com "Em análise (cópia)". | Essencial | Obrigatório |
| RF158 | "Criar visualização" deve criar a visualização nova com os filtros, as colunas e a ordenação da tela, manter a original como estava salva e abrir a nova. | Com "Área é Financeiro" aplicado em "Em análise", a nova abre com o filtro, e "Em análise" volta sem o ponto. | Essencial | Obrigatório |
| RF159 | A visualização nova deve repetir o quem vê da original quando quem salva é Owner ou Full, e ser só de quem salva quando é Standard ou Viewer (RN011). | Standard que salva como nova ganha uma visualização que só ele vê. | Essencial | Obrigatório |
| RF160 | Se o nome do modal está vazio, "Criar visualização" não deve criar a visualização. | Apagar o nome e clicar em "Criar visualização" mantém o modal aberto. | Importante | Obrigatório |

## Versão só minha (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF010 | A pílula que tem versão "só para mim" (RN005) deve mostrar um ícone de pessoa depois do nome, com o nome acessível "Versão só sua". | O tooltip da pílula diz "Você usa a sua versão. Os outros veem a de todos." | Importante | Obrigatório |
| RF161 | O menu da visualização com versão só minha deve ter "Voltar à versão de todos", no grupo "Só para mim", que apaga a versão só minha e mostra a versão compartilhada. | Depois de "Voltar à versão de todos", "Em análise" perde o ícone de pessoa e o filtro "Área é Financeiro". | Importante | Obrigatório |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver | Relevância |
|---|---|---|---|
| RI002 | Versão "só para mim" | Deve guardar, por pessoa e por visualização, a versão pessoal (RN005) e permitir apagá-la ("Voltar à versão de todos"). A visualização (`ModelView`) não guarda nada por pessoa hoje. Rota e formato: <a definir>. | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P006 | A alteração não salva deve sobreviver a recarregar a página? O protótipo zera. | Mikaela | Muda a alteração não salva e o que o back guarda por pessoa |
| P018 | "Salvar como nova visualização" aceita um nome que já existe na tela? O protótipo aceita. | Mikaela | Se não aceita, o modal mostra "Já existe uma visualização com este nome." |
