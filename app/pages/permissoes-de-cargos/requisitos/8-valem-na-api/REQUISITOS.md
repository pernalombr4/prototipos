# Requisitos: Permissões valem na API

**Objetivo:** o que a tela do cargo diz que a pessoa não pode fazer, a API também recusa. Hoje parte das permissões
que a tela oferece não é conferida no back, e o administrador acha que restringiu o que continua aberto.

**Onde vale:** o back, nas rotas das áreas que a tela do cargo já lista, e o menu de Configurações.

**Protótipo:** sem tela nova. As linhas são as das abas Funcionalidades e Configurações de
https://pernalombr4.github.io/prototipos/permissoes-de-cargos/.

**Fora do escopo:** permissão que ainda não existe (épico "Permissões novas"); a regra de itens (épico "Quais itens,
criador e responsável").

**Relevância:** Obrigatório, o dev faz. Desejável, o dev faz; se achar melhor não fazer, conversa com produtos antes.
Opcional, o dev pode não fazer quando o esforço é grande para o ganho.

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN701 | A API confere, na rota da ação, toda permissão que a tela do cargo oferece, pela mesma referência que a tela grava. | Sem "Cargos: Atualizar", o cargo não muda um cargo pela tela nem pela API. | Obrigatório |
| RN702 | O dono do workspace continua com todas as permissões. | O dono muda qualquer cargo. | Obrigatório |
| RN703 | O membro full segue o cargo dele, como o membro comum, salvo no workspace que o dono marcou para o membro full passar por cima das permissões. | Membro full com o cargo "Analista" sem "Cargos: Ver" não abre a lista de cargos. | Obrigatório |

## Configurações (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF701 | As rotas de cargos devem conferir `roles::create`, `read`, `update` e `delete`. Hoje a leitura da lista de cargos não confere nada, e criar, mudar e excluir conferem só se a pessoa é membro full. | Membro full sem "Cargos: Atualizar" recebe 403 ao mudar um cargo pela API. | Essencial | Obrigatório |
| RF702 | Cada linha da aba Configurações (grupos Sistemas, Dados, Acesso, Interface, Emails, Integrações, Logs e Credenciais) deve conferir a referência dela em todas as rotas da área. Hoje essas rotas conferem só se a pessoa é dona ou membro full. | Membro full sem "Logs: Ver" recebe 403 na lista de logs. | Essencial | Obrigatório |
| RF703 | O menu de Configurações deve mostrar só as áreas em que o cargo tem ao menos Ver. | Cargo sem "Agentes de IA" não vê o item Agentes de IA no menu. | Importante | Obrigatório |
| RF704 | A configuração do workspace que deixa o membro full passar por cima das permissões deve aparecer na tela, para o dono, com o efeito escrito. Hoje ela existe só no dado do workspace. | O dono vê a opção e a frase "Membros full ignoram as permissões do cargo.". | Importante | Desejável |

## Funcionalidades e categorias (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF711 | Todas as rotas de agentes de IA devem conferir `ai::agents`. Hoje 8 das 31 rotas conferem. | Cargo sem "Gerenciar agentes" recebe 403 em qualquer rota de agente. | Essencial | Obrigatório |
| RF712 | A rota do histórico do item deve conferir Ver na categoria do item (`types::<slug>::read`). Hoje confere só se a pessoa é membro do workspace. | Cargo sem Ver em "Reembolsos" recebe 403 no histórico de um reembolso. | Essencial | Obrigatório |
| RF713 | Comentar num item deve conferir Ver na categoria do item. Hoje o comentário em item confere só se a pessoa é membro do workspace; o comentário em tarefa já confere a tarefa. | Cargo sem Ver em "Reembolsos" recebe 403 ao comentar num reembolso pela API. | Essencial | Obrigatório |

## Não funcionais, restrições e transição (RNF, RS, RT)

| ID | Requisito | Como medir ou conferir | Prioridade | Relevância |
|---|---|---|---|---|
| RT701 | Antes de ligar a conferência, cada cargo de cada workspace deve receber as referências de Configurações que dão o acesso de hoje, para nenhum membro full perder acesso no dia da troca. | No dia da troca, o membro full que abria Logs continua abrindo. | Essencial | Obrigatório |
| RS701 | A recusa deve devolver 403 com a referência que faltou, como as rotas de categoria já fazem. | A resposta diz `roles::update`. | Importante | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| S701 | O que está em "Hoje" foi lido no código da develop em 27/11/2026, sem teste pela API. | dev do back, ou o QA pela API | Uma rota que já confere sai do escopo |
| P701 | Quantos workspaces têm a opção de o membro full passar por cima das permissões ligada? | dev do back | Com muitos, RF704 sobe para Obrigatório |

## Padrão de qualidade

| Tema | O que se espera |
|---|---|
| Idiomas | Cada texto existe em português, inglês e espanhol. |
| Chamada à API | A tela trata o 403 com o aviso "Você não tem permissão para esta ação." e não deixa o botão ativo. |
| Documentação | A documentação de suporte de cargos diz o que cada permissão de Configurações libera antes do lançamento. |
