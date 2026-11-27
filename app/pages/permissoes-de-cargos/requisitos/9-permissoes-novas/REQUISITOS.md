# Requisitos: Permissões novas

**Objetivo:** o administrador controla, pelo cargo, as áreas do workspace que hoje não têm permissão própria: painel de
tarefas, relatórios, execuções de Spaceflow, IA nos campos, faturamento, ações de membros, Início, migrações e as
outras ações de item em cada categoria.

**Depende de:** épico "Tela nova de permissões" (abas e sublinhas da categoria) e épico "Permissões fixas em matriz"
(grupos e outras ações).

**Onde vale:** o back, que passa a aceitar e conferir as referências novas, e as abas Categorias, Funcionalidades e
Configurações da tela do cargo.

**Protótipo:** https://pernalombr4.github.io/prototipos/permissoes-de-cargos/. As linhas novas estão em
Funcionalidades, em Configurações e na sublinha "Outras ações" de cada categoria aberta.

**Fora do escopo:** base de conhecimento, arquivos, formulário público, link de tarefa externa, visualização salva para
todos e feature flags (decisão da redatora em 27/11/2026).

**Relevância:** Obrigatório, o dev faz. Desejável, o dev faz; se achar melhor não fazer, conversa com produtos antes.
Opcional, o dev pode não fazer quando o esforço é grande para o ganho.

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN801 | Cada referência nova segue o formato que o back valida: o início é uma referência da lista do back e o fim é uma ação da lista do back. | `tasks::dashboard::read` começa com `tasks` e termina com `read`. | Obrigatório |
| RN802 | Cada referência nova cai na aba pela regra que a tela já usa (épico "Tela nova de permissões", RF035): `types::<slug>` em Categorias, `workspace`, `members` e `screens` em Configurações, o resto em Funcionalidades. | `workspace::billing::read` aparece em Configurações › Sistemas. | Obrigatório |
| RN803 | A outra ação de item só vale com a ação da categoria que ela exige: Exportar, Ver histórico e Comentar exigem Ver; Excluir definitivamente exige Excluir. | Sem Ver em "Reembolsos", a caixa Exportar fica desabilitada com a dica "Libere Ver na categoria para usar esta ação.". | Obrigatório |

## Referências novas (RF)

| ID | Linha na tela | Referência | O que o back muda | Prioridade | Relevância |
|---|---|---|---|---|---|
| RF801 | Funcionalidades › Geral › Painel de tarefas: Ver | `tasks::dashboard::read` | O painel de tarefas confere esta referência; hoje confere `tasks::quick::read`. | Importante | Obrigatório |
| RF802 | Funcionalidades › Geral › Relatórios: Criar, Ver, Atualizar, Excluir | `reports::create`, `read`, `update`, `delete` | `reports` entra na lista de referências; hoje a leitura de relatórios não confere nada e a escrita confere só se a pessoa é membro full. | Importante | Obrigatório |
| RF803 | Funcionalidades › Automação e IA › Spaceflows: "Ver execuções" e "Cancelar execução" | `workflows::executions::read`, `workflows::executions::cancel` | As rotas de execução conferem estas referências; hoje conferem `workflows::update`. | Importante | Obrigatório |
| RF804 | Funcionalidades › Automação e IA › IA: "Usar IA em campos e anexos" | `ai::inference` | `inference` entra na lista de ações. Hoje o back já confere `ai::inference`, mas recusa gravar a referência, então só o dono e o membro full usam. | Essencial | Obrigatório |
| RF805 | Configurações › Sistemas › Faturamento: Ver e "Comprar créditos" | `workspace::billing::read`, `workspace::billing::create` | As rotas de créditos e consumo conferem estas referências. | Importante | Obrigatório |
| RF806 | Configurações › Acesso › Membros: "Importar membros", "Gerenciar ausências" e "Mesclar duplicados" | `members::import::create`, `members::absences::update`, `members::duplicates::update` | As rotas de cada ação conferem a referência dela. | Importante | Desejável |
| RF807 | Configurações › Interface › Início: Atualizar | `screens::home::update` | Mudar os widgets do Início para todos os membros confere esta referência; hoje basta ser membro full. | Importante | Desejável |
| RF808 | Configurações › Interface › Migrações: Ver e "Executar migração" | `workspace::migrations::read`, `workspace::migrations::create` | Troca `settings::data::migrations::read`, que a tela usa hoje e o back recusa gravar. | Essencial | Obrigatório |
| RF809 | Categorias › categoria aberta › sublinha "Outras ações": Exportar, "Ver histórico", Comentar, "Excluir definitivamente" | `types::<slug>::export`, `history`, `comment`, `purge` | `export`, `history`, `comment` e `purge` entram na lista de ações, e cada rota confere a referência da categoria do item (RN803). | Importante | Obrigatório |

## Tela (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF811 | A categoria aberta deve mostrar a sublinha "Outras ações", com "O que o cargo faz com os itens além das 4 ações." e as 4 caixas de RF809 na coluna Restrições. | "Contratos de Fornecedores" aberta mostra a sublinha com Exportar, Ver histórico, Comentar e Excluir definitivamente. | Importante | Obrigatório |
| RF812 | A coluna Restrições da linha da categoria deve mostrar "{n} de {total} outras ações" quando a categoria tira alguma outra ação possível. | Com Comentar desmarcado em "Reembolsos": "2 de 3 outras ações". | Importante | Obrigatório |
| RF813 | O bloco "Padrão para novas categorias" deve ter a linha "Outras ações", com as mesmas 4 caixas, para a categoria criada depois. | Com Comentar desmarcado no padrão, a categoria nova nasce sem Comentar. | Importante | Desejável |
| RF814 | A confirmação deve listar as outras ações liberadas e tiradas por categoria, e "mudou as outras ações do padrão" quando o padrão muda. | "Reembolsos: liberou Excluir definitivamente". | Importante | Obrigatório |

## Não funcionais, restrições e transição (RNF, RS, RT)

| ID | Requisito | Como medir ou conferir | Prioridade | Relevância |
|---|---|---|---|---|
| RT801 | No dia da troca, cada cargo recebe a referência nova que dá o acesso de hoje: quem tem `tasks::quick::read` recebe `tasks::dashboard::read`; quem tem `workflows::update` recebe Ver e Cancelar execução; todo cargo recebe `reports::read`; quem tem Ver numa categoria recebe Exportar, Ver histórico e Comentar nela. | Nenhum membro perde acesso no dia da troca. | Essencial | Obrigatório |
| RT802 | `ai::inference`, `reports::create`, `update`, `delete`, Faturamento, as ações de Membros, Início e "Executar migração" não vão para nenhum cargo na troca: hoje só o dono e o membro full fazem. | O cargo comum segue sem essas ações. | Essencial | Obrigatório |
| RS801 | A tela só deve oferecer a linha nova quando o back aceitar gravar a referência dela. Imposta por: o back de 27/11/2026 recusa a referência fora da lista. | Salvar a linha nova devolve sucesso. | Essencial | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| S801 | O que está em "Hoje" foi lido no código da develop em 27/11/2026, sem teste pela API. | dev do back, ou o QA pela API | Uma rota que já confere sai do escopo |
| P801 | Exportar segue a listagem, que já confere Ver? Se a exportação sai da tela com o que a listagem devolveu, `export` precisa de conferência própria no back. | dev do back e do front | Sem rota de exportação, a conferência fica só na tela |
| P802 | Existe exclusão definitiva de item hoje (esvaziar a lixeira)? Qual rota? | dev do back | Sem a ação, "Excluir definitivamente" sai da lista |

## Padrão de qualidade

| Tema | O que se espera |
|---|---|
| Idiomas | Cada texto existe em português, inglês e espanhol, com plural e número do dicionário de textos. Nenhum texto estoura o espaço. |
| Temas | A tela funciona em cada tema do produto, só com as cores do tema. Texto com contraste de 4,5:1. |
| Avisos | Cada alteração mostra um toast de confirmação, e cada erro mostra um aviso. O texto de cada um está no protótipo. |
| Acessibilidade | Caixa de marcar com nome acessível e dica legível no teclado. |
| Visual | Medida, cor, espaçamento, ícone e texto seguem o protótipo. Texto sem travessão. |
| Documentação | A documentação de suporte de cargos cobre cada permissão nova antes do lançamento. |
