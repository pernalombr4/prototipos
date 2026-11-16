# Central de Agentes de IA

## A demanda, como veio

Da sessão que analisou um agente de IA em produção (2026-11-16), as 5 melhorias que pedem protótipo antes de virar card:

> 1. **Confirmação antes de ferramenta sensível (no chat).** Quando o agente vai chamar uma ferramenta que grava, envia, cobra ou sai do ENSPACE, o chat mostra um cartão de confirmação no lugar de executar. [...] O cartão diz o que vai acontecer e com que dados [...]. Os botões são **Confirmar**, **Editar** e **Cancelar**. Estados: pendente, confirmado (executa e mostra o resultado), cancelado (o agente segue sem a ação), erro, e lote (resumo de N itens, com "ver todos"). Ferramenta de leitura executa sem cartão. No cadastro do agente, um controle diz quais ferramentas pedem confirmação. Padrão: todas as que gravam, enviam ou cobram.
>
> 2. **Modelos permitidos no agente.** Na aba Essencial do agente, o campo de modelo vira **Modelo padrão**, e entra um campo novo de seleção múltipla, **Modelos permitidos no chat**. No chat, o seletor de modelo oferece só os permitidos, e no lugar de "Modelo padrão" mostra "Padrão do agente: <modelo>". Com 1 modelo permitido, o seletor fica fixo: sem lista, com a dica "Modelo definido pelo agente". Ao trocar de agente no chat, o seletor se ajusta.
>
> 3. **Arquivo de referência fixo no agente.** No cadastro do agente, a seção **Arquivos de referência** permite anexar PDF e DOCX que o agente lê inteiros em toda conversa. Não é busca por trechos. Mostrar: enviar, listar (nome, tamanho, data, quem enviou), substituir por versão nova, remover. Aviso de tamanho quando o arquivo passa do que cabe no contexto do modelo escolhido. No chat, um indicador discreto de quais arquivos de referência o agente usa.
>
> 4. **Aba Testar igual ao chat.** Conversa de várias mensagens, anexo de arquivo, seletor de modelo (só os permitidos) e as mesmas ferramentas do chat, respeitando o filtro. Cada chamada de ferramenta aparece na conversa. Extra a avaliar com a redatora: **Comparar modelos**, a mesma conversa rodando em 2 ou 3 modelos lado a lado.
>
> 5. **Biblioteca de modelos de resposta.** Blocos de texto aprovados, com campos do tipo {{processo}}, {{saldo}} e {{cust_id}}, ligados ao agente. O agente escolhe o bloco e preenche os campos, sem reescrever o texto. Mostrar: o editor do bloco com os campos marcados e a pré-visualização; a lista de blocos do agente; e, no chat, a minuta montada com o bloco usado e os campos preenchidos destacados, editáveis antes de copiar.

E da redatora, na conversa (2026-11-16):

> "alem de prototipar isso que foi pedido, voce deve fazer uma pesquisa /deep-research vendo como o mercado de SAAS e ERPs, alem de sistemas juridicos e sistemas de gestao de tarefa apresentam CONSTRUTORES DE AGENTES DE IA. as centrais de agentes de ia edsses produtos, como sao? quão complexas sao? quais funcionalidades faltam pro enspace? e aí voce junta no prototipo o que mais faltar, pra deixar completo nosso desnenho de hoje. aí teremos uma central de agentes de ia como um produto completo.
>
> nao precisa botar no protitpo uma simulaçao de como é hoje. é desperdicio."

## Tela e jornada

- **Configurações > Agentes de IA** (Central de Agentes IA): a lista, o cadastro do agente (gaveta com as abas Essencial, Personalização e Testar) e a aba Playbooks.
- **Chat de IA**, flutuante e em tela cheia: o seletor de agente, o seletor de modelo e as chamadas de ferramenta.

## O que é sucesso

Quem configura um agente decide, numa tela só, o que ele sabe, o que ele pode fazer sozinho e com que modelo, e confere tudo numa conversa de teste igual à do chat antes de liberar para o time.

## O que a pesquisa de UX já dizia

Procurei no `enspace-ux-research` (índice dos temas, auditoria de Configurações do Sistema e `UX_REPORT.md`). Não há tema sobre Agentes de IA. O vizinho mais perto:

- **S3-F5** (Cobrança): o extrato de consumo mostra o agente pelo slug (`analista-de-duplicidade---juridico-bp`) e o consumo em "217.0k tokens", sem o custo que importaria. Pesa na proposta de consumo por agente.

## O caso real que motivou

Um agente de chat que monta minutas de resposta a ofícios judiciais a partir de modelos aprovados, testado em 15 modelos em 2026-11-16 (material de cliente: nada dele entra aqui; o protótipo usa empresa, processo e pessoas fictícios). O que o teste mostrou:

- 3 modelos inventaram vara, partes ou número do processo numa minuta, e qualquer usuário consegue escolher esses modelos no chat;
- o seletor do chat mostra "Modelo padrão" sem dizer qual modelo roda;
- o campo de ferramentas vazio libera as 51 ferramentas, e nenhuma pede confirmação: um modelo leve chamou sozinho a consulta jurídica paga;
- o PDF de respostas prontas é copiado à mão nas Instruções;
- a aba Testar não lê arquivo, então o agente só se testa no chat.

## O develop hoje

Visitado em 2026-11-16, no workspace de exploração, pelo Chrome.

| Tela | URL | Print |
|---|---|---|
| Central de Agentes IA, filtro Todos | `/workspaces/<ws>/settings/ai/agents` | `evidencias/develop-01-central-de-agentes.jpg` |
| Criar Agente, aba Essencial | mesma URL, gaveta aberta | `evidencias/develop-02-criar-agente-essencial.jpg` |
| Criar Agente, aba Personalização | idem | `evidencias/develop-03-criar-agente-personalizacao.jpg` |
| Criar Agente, aba Testar | idem | `evidencias/develop-04-aba-testar.jpg` |
| Chat flutuante, conversa nova | qualquer tela, botão do BENI | `evidencias/develop-05-chat-flutuante.jpg` |
| Seletor de modelo do chat aberto | idem | `evidencias/develop-06-seletor-de-modelo.jpg` |

### O fluxo de hoje, em passos

1. Configurações > Agentes de IA. A tela abre no filtro Workspace.
2. "Criar Novo Agente" abre uma gaveta à direita.
3. Essencial: Nome, Descrição, Instruções, Filtro de ferramentas, Modelo de linguagem, Tipo (Chat/Texto ou Revisor) e Status.
4. Personalização: ícone, Papel, Abordagem, Estilo de Escrita, Regras (até 255 caracteres cada) e as cores e o acessório do mascote.
5. Testar: 1 mensagem, "Executar Teste", 1 resposta.
6. "Criar Agente". O agente aparece como card na lista.
7. No chat, a pessoa escolhe o agente no topo e o modelo no rodapé do campo de mensagem.

### Lido no código do ENSPACE (develop, 2026-11-16)

- **Modelos:** 19, em 8 provedores. Alibaba: qwen3.8-flash, qwen3.8-max, qwen3.8-max-prime. Anthropic: claude-haiku-5.5, claude-sonnet-5.5, claude-opus-5.5. DeepSeek: deepseek-v4.1-flash, deepseek-v4-pro. Google: gemini-3.5-flash-lite, gemini-3.8-flash, gemini-4-argon. MiniMax: minimax-m3.1-flash. Moonshot AI: kimi-k3.1-pro, kimi-k3.1-pro-highspeed. OpenAI: gpt-6-luna, gpt-6.1-terra, gpt-6.1-sol. Z.ai: glm-5.3-flash, glm-5.3. A lista da demanda tinha 16: faltavam qwen3.8-max, glm-5.3 e kimi-k3.1-pro-highspeed. O padrão dos agentes no servidor é o qwen3.8-max.
- **Capacidades por modelo**, que o seletor do chat mostra em ícones: visão, arquivo anexado, ferramentas e raciocínio.
- **Seletor do chat:** "Modelo padrão" no topo, depois os grupos por provedor. Não diz qual modelo o padrão usa.
- **Campo de modelo do agente:** lista sem grupo, com o id cru ("openai/gpt-6-luna"). O agente novo nasce com o gpt-6-luna, diferente do padrão do servidor.
- **Ferramentas:** 51, numa lista plana de nomes em inglês. O servidor já manda a categoria de cada uma e se ela lê ou grava; a tela não usa. Vazio = todas.
- **Grupos de ferramenta** (como o servidor separa): Estrutura, Itens, Pessoas, Utilitários, Tarefas, Jurídico e Workspaces. Gravam: 23. Leem: 28.
- **Aba Testar:** 1 mensagem, sem histórico, sem anexo, sem seletor de modelo, e não mostra as chamadas de ferramenta. O servidor usa uma lista fixa de ferramentas e ignora o filtro do agente.
- **Chamada de ferramenta no chat:** aparece com o nome técnico ("smartCreateItem"), fechada, sem argumentos, resultado nem erro.
- **Base de conhecimento:** o agente tem o campo de ligação no servidor, e a tela não mostra.
- **Não existe hoje:** confirmação antes de ferramenta, modelos permitidos por agente, arquivo fixo no agente, biblioteca de modelos de resposta. O mais perto da confirmação é o modo Planejamento do chat, que bloqueia as ferramentas que gravam, e só existe no BENI.

### Rodada 2: Manuais de revisão e conhecimento (develop, 2026-11-16)

| Tela | Onde | Print |
|---|---|---|
| Manuais de instruções (aba Playbooks) | Central de Agentes IA > Playbooks | `evidencias/develop-09-playbooks.jpg` |
| Criar Manual | idem, "Criar Manual" | `evidencias/develop-10-playbook-criar.jpg` |
| Manual do sistema aberto | idem, cartão em Sistema | `evidencias/develop-11-playbook-do-sistema.jpg` |
| Knowledge Base do menu do membro | Knowledge > Knowledge Base | `evidencias/develop-12-knowledge-base.jpg` |

**Manuais (playbooks), pela tela e pelo código:**
- A tela chama de "Manual", "Manuais de instruções", "Manuais de Revisão" e "Playbook de Revisão"; a aba fica "Playbooks", sem tradução.
- O formulário tem Nome, Descrição, Ícone (rótulo cru "icon"), Instruções em 1 linha, Formato de Saída, Tom, Regras (título, descrição, categoria, severidade) e Itens de Verificação (item, categoria, obrigatório).
- O servidor guarda também a categoria do manual (8 valores), mas a tela nunca mostra e sempre grava "custom".
- Limites da tela (regra 100 e 255, item 100) menores que os da API (200, 1.000 e 500); categoria da regra obrigatória na tela e opcional na API.
- Sem ordem das regras, sem busca nem filtro, e o manual do sistema abre desabilitado e sem saída.
- Nenhum manual se liga ao agente: o Revisor oferece o manual no chat. O resultado tem achados por severidade, nota de 0 a 100 e o checklist.
- No workspace de exploração, os manuais do sistema aparecem repetidos dezenas de vezes (achado de passagem).

**Conhecimento:**
- "Knowledge Base" do menu do membro é a busca de perguntas e respostas, sem ligação com IA.
- A base vetorial do servidor (PDF, DOCX, TXT, MD, CSV, XLSX, HTML; trechos de 1.000 caracteres; até 5 trechos por mensagem) não tem tela. O agente tem o campo `knowledge_base_ids`, sem tela; não há conhecimento que valha para todos os agentes nem arquivo fixo no agente.

### Onde trava

- O dono do agente não controla o modelo que o time usa no chat.
- Nada separa ferramenta que lê de ferramenta que grava, envia ou cobra.
- O teste não reproduz o chat: sem arquivo, sem ferramentas do agente, sem conversa.
- O conhecimento do agente vive colado nas Instruções.

### Achados de passagem (ficam fora desta proposta)

- Rótulos sem tradução: "Agents" e "Playbooks" nas abas, "icon" no campo de ícone, "active" e "inactive" no Status, o placeholder da aba Testar.
- Placeholders sem acento: "Analise", "proposito".
- O card mostra o `type` cru ("chat", "multi_task", "reviewer") e "source.system".

## A casca da tela, item por item

Copiada do develop em 2026-11-16 (`evidencias/develop-01-central-de-agentes.jpg`), em `_CascaDasConfiguracoes.vue`. Nada aqui é proposta.

| Parte | O que o develop mostra |
|---|---|
| Topo do menu | Nome do workspace e o slug, com o seletor de workspace |
| Busca | "Buscar..." com o atalho de teclado |
| Grupo Membro | Início, Spaceflows, Categorias (abre), Tarefas (abre), Agenda, Relatórios, Knowledge (abre) |
| Grupo Configurações | Visão Geral, Sistema, Estrutura (abre), Gestão de Membros, Interface (abre), E-mails (abre), Integrações (abre), **Agentes de IA** (ativo), Logs |
| Grupo Ajuda | Releases, Documentação (abre fora) |
| Seções abertas | Nenhuma |
| Recolher o menu | Botão na borda do menu |
| Barra do topo, à esquerda | Recolher o menu, Voltar, Avançar, Recarregar, Início |
| Trilha | Configurações > Assistente de IA > agents |
| Barra do topo, à direita | Idioma (bandeira), Tema, Suporte, Notificações, avatar da conta |

## Preparo

Nada foi criado nem preparado por API. O workspace de exploração tem só os 3 agentes do sistema.
