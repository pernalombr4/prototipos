# Decisões

## Rodada 1 · 2026-11-16

- **Pedido (literal):** as 5 melhorias da demanda (confirmação antes de ferramenta sensível; modelo padrão e modelos permitidos no chat; arquivos de referência; aba Testar igual ao chat, com comparação de modelos; biblioteca de modelos de resposta com campos) e, da redatora: "voce deve fazer uma pesquisa /deep-research vendo como o mercado de SAAS e ERPs, alem de sistemas juridicos e sistemas de gestao de tarefa apresentam CONSTRUTORES DE AGENTES DE IA [...] e aí voce junta no prototipo o que mais faltar, pra deixar completo nosso desnenho de hoje. aí teremos uma central de agentes de ia como um produto completo. nao precisa botar no protitpo uma simulaçao de como é hoje."
- **Fronteira:** muda a Central de Agentes de IA inteira (lista, cadastro, teste, chat) e entram 4 abas no topo; não muda a casca (menu lateral, barra do topo, trilha), a aba Personalização nem a aba Playbooks.
- **Forma:** 1 protótipo, sem tela "como é hoje" (pedido da redatora). A casca copiada do develop continua em volta, pela regra 37.
- **Ver:** https://pernalombr4.github.io/prototipos/central-de-agentes-de-ia/ (os estados ficam na barra do protótipo, embaixo). Print: `evidencias/proposta-01-chat-com-minuta.jpg`.

### O que a proposta muda, por demanda

| Demanda | Onde está | Como |
|---|---|---|
| 1. Confirmação | Editor > Ferramentas; chat | Cada ferramenta ligada tem o modo **Pede confirmação** ou **Executa direto**; o padrão é pedir para tudo que não só lê. No chat, o cartão mostra a ação com os valores, e a pessoa confirma, edita ou cancela. Estados: pendente, executando, confirmado, cancelado, erro e lote |
| 2. Modelos | Editor > Essencial; seletor do chat e do Testar | **Modelo padrão** com o nome do modelo, agrupado por empresa; **Modelos permitidos no chat** em seleção múltipla. O seletor mostra só os permitidos e diz "Padrão do agente: <modelo>". Com 1 modelo, vira rótulo fixo com cadeado e a dica "Modelo definido pelo agente". Trocar de agente volta ao padrão dele |
| 3. Arquivos | Editor > Conhecimento; chat | Enviar, listar (nome, tamanho, data, quem enviou, versão), substituir e remover. Medidor do espaço no contexto de cada modelo permitido; arquivo que não cabe avisa e oferece tirar os modelos. No chat, "Lê 2 arquivos de referência", discreto, abre a lista |
| 4. Testar | Editor > Testar | A mesma conversa do chat: várias mensagens, anexo, os modelos permitidos, as ferramentas ligadas e cada chamada visível. "Simular ferramentas que gravam", "Comparar modelos" (até 3 colunas, tempo e créditos, "Usar como padrão"), "Ver rastro" e casos de teste com "Rodar todos" |
| 5. Modelos de resposta | Aba "Modelos de resposta" do topo; Editor > Modelos de resposta; chat | Biblioteca do workspace com código, nome, "quando usar", texto com `{{campos}}`, tabela dos campos (tipo, de onde vem, obrigatório, exemplo) e pré-visualização. O agente vincula os modelos. No chat, a minuta destaca cada campo preenchido; clicar corrige; campo sem valor trava o "Copiar minuta" |

### O que entrou além da demanda (PESQUISA)

- **Criar agente com 3 portas:** descrever em linguagem natural, partir de 1 dos 6 modelos ou começar do zero.
- **Rascunho e versões:** "Salvar rascunho" não muda o chat; "Publicar versão N" põe no ar. A aba Versões restaura uma versão antiga como rascunho.
- **Acesso:** quem usa no chat (todos, cargos, grupos, pessoas) e quem edita (dono e editores). O agente age com as permissões de quem conversa.
- **Desempenho:** conversas, pessoas, créditos, avaliação, confirmações e cancelamentos em 30 dias.
- **Atividade:** toda ação que grava, envia ou cobra, com quem confirmou, o modelo e os créditos.
- **Políticas:** quem cria agentes, modelos liberados, ferramentas bloqueadas, confirmação obrigatória para o que envia, cobra ou muda acessos, domínios de e-mail e limite de créditos.
- **Sugestões na conversa nova:** até 4 frases por agente.
- **Card da central:** modelo, modelos no chat, ferramentas que pedem confirmação, arquivos, dono e conversas em 30 dias; menu com Editar, Testar, Abrir no chat, Duplicar, Desativar e Excluir.

### Decisões de forma

- **O cadastro continua na gaveta da direita.** Essencial, Personalização e Testar ficam onde estão; as abas novas entram entre elas (regra 20). Ficou larga (`max-w-5xl`) e alarga para `max-w-7xl` ao comparar modelos.
- **Ferramentas vira aba própria**, e a Essencial guarda o resumo com o link "Configurar ferramentas": o endereço de quem já procurava ali continua.
- **Agente novo nasce sem nenhuma ferramenta.** Hoje vazio = todas as 51; o mercado inteiro faz o contrário (PESQUISA).
- **O efeito separa "grava" em 5:** grava no workspace, envia para fora, consulta paga, sai do ENSPACE, muda acessos. O risco de cada um é diferente.
- **"Confirmar e não perguntar de novo nesta conversa" só para o que grava.** O que envia, cobra ou muda acessos pergunta sempre (Dust).
- **A consulta paga mostra o custo no cartão**, antes de executar. Ninguém no mercado faz.
- **Modelo de resposta mora na biblioteca do workspace**, e o agente só vincula: o mesmo texto aprovado serve a mais de um agente e muda num lugar só.
- **O editor do modelo de resposta é texto simples com a detecção de `{{ }}`, não o TipTap.** O modelo vai à minuta como texto puro, sem formatação; o TipTap traria negrito e lista que a minuta não usa. Se o produto quiser formatação, troca-se pelo `UEditor` com uma extensão de campo.
- **Listas da biblioteca e da atividade na `EnTable`**, como as listas do produto.
- **O cartão de confirmação é o `UChatTool` variante card**, que o Nuxt UI indica para fluxos de aprovação. A conversa usa o `UChatMessage`.
- **Tipo e status em `USelect`**, não em cartões (memória da redatora: dropdown em vez de cartões).
- **O filtro da central abre em "Todos"**, e não em "Workspace" como hoje: com os do sistema em cartão tracejado, a lista completa mostra a diferença na primeira olhada.

### Jornada

```text
Central ──Criar Novo Agente──> Criar (descrever | modelo | do zero) ──> Editor
   │                                                                   │
   └──card──────────────────────────────────────────────────────────> Editor
                                                                       │
   Essencial · Personalização · Ferramentas · Conhecimento · Modelos de resposta
   · Acesso · Testar (conversa, simular, comparar, rastro, casos) · Versões · Desempenho
                                                                       │
                                     Salvar rascunho │ Publicar versão N
                                                                       ▼
Chat (canto da tela) ──agente──> seletor de modelo (permitidos) ──> mensagem
   ├─ ferramenta que lê: 1 linha
   ├─ ferramenta que grava, envia ou cobra: cartão (Confirmar | Editar | Cancelar)
   └─ modelo de resposta: minuta com campos destacados ──> Copiar minuta
```

### Maquete

- "Gerar rascunho" não chama IA: espera 1,4 s e preenche com o texto do modelo "Respostas a ofícios".
- As conversas são roteiros fixos (`conversa.ts`); a resposta a uma mensagem nova é um texto de exemplo.
- Enviar arquivo de referência sempre gera o PDF grande de exemplo (1.260 páginas), para mostrar o aviso de tamanho.
- Comparar modelos mostra a mesma resposta nas colunas; tempo e créditos são inventados a partir da faixa de custo.
- Os casos de teste dão sempre o mesmo resultado (2 passam, 1 falha).
- Atividade, Desempenho e Playbooks são estáticos. "Exportar CSV", "Baixar", "Transferir", "Comparar com a versão no ar" e "Histórico" não fazem nada.
- Janela de contexto e faixa de custo dos modelos são inventadas (`catalogo.ts`, marcadas INVENTADO).
- O texto da conversa, dos agentes e dos modelos de resposta é dado e fica só em português; a interface troca nos 3 idiomas.
- Recarregar volta tudo ao começo.

### CSS próprio

- `[scrollbar-width:none]` na barra de abas do editor: o `UTabs` com 9 abas transborda e mostrava a barra de rolagem por cima das abas. O `ui` do `UTabs` 4.11.1 não tem slot para a lista; consulta: `get-component-metadata` do `Tabs`.

### Não deu

- **Print das referências da pesquisa.** Por quê: as telas exigem conta paga ou login corporativo; a pesquisa leu a documentação.
- **O `Beni` só aparece no navegador** (`ClientOnly`). Por quê: renderizado no servidor, ele quebra a hidratação da página inteira. O mesmo acontece no protótipo `ia-no-campo-html`, que não é desta pasta.

### Achados de passagem no develop (sem correção aqui)

- Rótulos sem tradução na central: "Agents", "Playbooks", "icon", "active".
- Placeholders sem acento no cadastro.
- Selo do tipo do agente com o valor cru.
- O "Filtro de ferramentas" mostrou "Exibindo 0 opções" no workspace de exploração.

### Crítica e acessibilidade

- Todo botão só com ícone tem `aria-label`; o cartão de confirmação tem `role="group"` com o nome da ação e o estado.
- Cor nunca é o único sinal: o efeito da ferramenta tem ícone e texto; o campo sem valor da minuta mostra o nome do campo entre chaves.
- O contador de regras (255 caracteres) e o resumo dos casos de teste anunciam a mudança (`aria-live`).
- Movimento respeita `prefers-reduced-motion` (`main.css`).
- Sem correção nesta rodada: o seletor de cor do BENI usa o código hexadecimal como nome acessível.
