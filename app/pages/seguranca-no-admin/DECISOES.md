# Segurança no admin: decisões

## Rodada 1 · 2026-10-19

- **Pedido (literal):** "simule o atual menu do admin + as opções que precisamos entregar pro cliente. e coloque na barra de interaçao com o prototipo botoes de atalho pra ver cada um dos pontos." Antes: "PESQUISE PROFUNDAMENTE /deep-research /product-management:synthesize-research".
- **Fronteira:** muda o menu lateral (1 item novo em Logs e 3 grupos novos), a tela Audit e 12 telas novas; não muda nenhum item, rótulo ou ordem do menu de hoje, a barra do topo nem as telas fora dos pedidos.
- **Ver:** https://pernalombr4.github.io/prototipos/seguranca-no-admin/ · atalhos 1 a 10 na barra de baixo · `?tela=tokens` abre direto um ponto.

### Onde cada pedido mora

| # | Pedido | Menu | O que a tela faz |
|---|---|---|---|
| 1 | Audit Log e SIEM | Logs › Audit; Logs › Envio ao SIEM | eventos de login aceito e recusado, leitura, download e exportação; filtro por categoria, workspace e tipo de quem fez (pessoa, conta de serviço, BENI, fluxo); exportar CSV; retenção visível (720 dias, o valor medido hoje) e ajustável; destinos Microsoft Sentinel (6 campos do conector CCF Push), Azure Event Hubs e HTTPS, com Testar conexão antes de Salvar, pausa e erro com reenvio |
| 2 | Tokens | Integrações › Tokens de API | inventário de todos os tokens da organização, resumo clicável (sem validade, expirando, sem uso), revogação em lote; política com validade máxima, proibir sem validade, quem cria, aprovação e aviso antes de expirar; prévia do que o membro vê; ao apertar a política, a tela mostra quantos tokens ficam fora e pergunta o que fazer |
| 3 | Conta de serviço | Integrações › Contas de serviço | conta sem licença, com responsável, acessos por workspace e papel, credencial com validade limitada pela política de tokens; aba "Onde é usada"; troca de segredo com 24 h de sobreposição; segredo mostrado 1 vez |
| 4 | Allowlist HTTP | Integrações › Destinos de saída | modo (permitir todos, só registrar, só a lista), regras ordenadas com curinga, "Todo o resto", rede interna sempre bloqueada, teste de endereço, fluxos afetados antes de salvar, prévia do aviso no editor do fluxo |
| 5 | Prompt injection | Proteção de dados › IA e BENI | ligar e quem usa; busca na web; confirmação antes de acessar endereço externo; a IA segue os Destinos de saída; ler anexos; detectar instrução escondida (3 estados); ações que pedem confirmação; proteções fixas; tentativas detectadas |
| 6 | SCIM e sessões | Identidade › Provisionamento (SCIM); Identidade › Sessões | URL base e token mostrado 1 vez, atributos, grupos do Entra, o que fazer ao desativar, últimas chamadas; o texto diz que o Entra manda mudanças a cada 40 minutos e leva para Sessões, onde "Encerrar todas" e "Encerrar sessões de uma pessoa" são na hora |
| 7 | Contas e workspaces fora | Identidade › Domínios | verificação por TXT; "Bloquear contas e workspaces fora desta organização" e "Entrar sem convite" separados; quem cria workspace; contas do domínio fora da organização com "Trazer para a organização"; selo "Vale assim que salvar. Não depende da entrada em produção." |
| 8 | Exportação e convites | Proteção de dados › Exportação e download; Identidade › Convites | 3 regras (exportar itens, baixar anexos, link público) com modo, cargos e exceção por workspace; prévia "Ver como" com o botão bloqueado e a mensagem; estimativa do que seria barrado; convites só de domínios da lista, com teste de e-mail |
| 9 | HMAC | Integrações › Webhooks | lista com selo Assinado ou Sem assinatura; política "Exigir assinatura em todo webhook" que pergunta o que fazer com os sem segredo; formato Standard Webhooks com exemplo de conferência; segredo oculto até Mostrar, troca com 24 h |
| 10 | Continuidade | Proteção de dados › Continuidade | só leitura: RTO, RPO, nível de redundância contratado entre 3, região de produção e de backup, conta do backup separada, cópia imutável, último backup, histórico, último teste de recuperação, adendo para baixar |

### Decisões

- **O admin do cliente é o ENSPACE Admin de hoje com escopo da organização.** O chip "Horizonte Bioenergia · Ambiente dedicado · 6 workspaces" no topo diz isso. Os itens internos (Financeiro, Infraestrutura, Product) ficam no menu porque o pedido foi simular o menu atual; quem decide o que o cliente vê é o produto.
- **Grupos por tema, não por pedido:** Identidade, Integrações e Proteção de dados, como Notion, Atlassian e GitHub agrupam. O "Envio ao SIEM" entra em Logs, ao lado do Audit, que já existe.
- **O cartão de Configurações Gerais é o padrão das telas novas** (`_Regra.vue`). A chave técnica (`max_file_size_mb`) sai: o admin do cliente não precisa dela.
- **3 estados nos controles de bloqueio** (Desligado, Só registrar, Bloquear), em `_Modo.vue`, para a exportação e a detecção de instrução escondida. A allowlist usa o mesmo conceito no modo da tela.
- **Efeito antes de salvar** em tokens, destinos e exportação: é o que nenhum concorrente faz, e é o que deixa o cliente apertar a regra sem derrubar integração.
- **A IA segue a mesma lista de destinos do nó HTTP.** Motivo: o caso Rovo (2026), em que desligar a busca na web não fechou a ferramenta que abria URL.
- **"*.empresa.com" vale também para "empresa.com"**, como as allowlists de mercado.
- **Retenção do Audit: 720 dias como padrão**, porque é o valor medido hoje no develop ("Expira em" da gaveta). Opções 1, 2 e 5 anos; acima de 2, contrato.
- **A tela Audit muda as colunas:** Action, Model e Reference viram Evento (rótulo e código) e Alvo, porque login e exportação não têm modelo. ID, User, Workspace, IP e Date ficam.
- **Continuidade é só leitura.** O compromisso é contratual; a tela mostra o que está contratado e o estado do backup. Números ilustrativos, com aviso visível quando "Marcar o que é novo" está ligado.
- **Nome do cliente fora do repositório.** O repositório é público: a organização do protótipo é a fictícia "Horizonte Bioenergia".

### Decisões que são de engenharia, não de tela

O protótipo mostra a tela; estas 4 coisas precisam existir por trás para a tela não mentir:

1. **Allowlist conferida na execução**, depois de montar a URL com os valores do item, no redirecionamento e na resolução DNS (como o n8n). Conferir só ao salvar o fluxo deixa passar URL com variável.
2. **`active=false` do SCIM encerra todas as sessões e revoga os tokens da pessoa.** Sem isso, "revogação imediata" não se sustenta.
3. **Detector de instrução escondida.** Sem ele, o painel "Tentativas detectadas" não vai para o produto.
4. **Eventos novos no Audit Log:** `auth.login`, `auth.login_failed`, `item.viewed`, `file.downloaded`, `export.*`, `ai.injection_blocked`, `http.blocked`. A tela de hoje só grava Create e Update.

### Maquete

- Tudo em memória; recarregar volta ao começo. "Reiniciar" na barra de baixo faz o mesmo sem recarregar.
- Testar conexão, verificar domínio, exportar CSV e baixar adendo só esperam e mostram o resultado de sucesso.
- O evento de teste, os segredos e os IDs são inventados.
- "Período", "Colunas", "Ver no registro de auditoria" e os itens do menu de hoje (Home, Users e outros) não abrem tela: mostram que estão fora do escopo.
- A estimativa de exportações barradas usa um cargo inventado para algumas pessoas do mock.

### Crítica e acessibilidade

Feitas pelas skills `design:design-critique` e `design:accessibility-review` sobre os prints publicados; os achados estão na entrada abaixo.

### Não deu

- **Print das referências:** as telas de admin dos 19 produtos ficam atrás de plano Enterprise e de login. A pesquisa leu a documentação oficial; não há `ref-*.png`.
- **Prints do develop com dado de pessoa** (Audit, Request, Users, Workspaces): não foram commitados, porque mostram e-mails reais. Ficaram os 2 de Configurações Gerais, com o nome da redatora borrado.
- **Verificação no Chrome:** a extensão não tem acesso ao `localhost` nesta máquina ("Chrome blocked the extension from accessing this page"). A conferência local foi no navegador do app, que não precisa de SSO para o protótipo; o develop foi explorado no Chrome, como manda a regra 2. Os prints da entrega são da versão publicada.
- **Diagrama de jornada:** não há jornada de mais de 2 telas em sequência; cada pedido é uma tela com atalho próprio.
