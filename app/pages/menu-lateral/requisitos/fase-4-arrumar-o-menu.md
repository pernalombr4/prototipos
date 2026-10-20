# Requisitos: fase 4, arrumar o menu do workspace

**Objetivo:** o menu do workspace se arruma direto na barra, sem modo de edição: arrastar, mover pelo botão direito e
ocultar. O que muda fica num rascunho, com a bolinha amarela, até a pessoa salvar para todos ou só para ela.

**Onde vale:** as linhas e os títulos de seção dos painéis do Início, de Dados e de cada seção na trilha, o menu
flutuante, a trilha e o pé do painel.

**Referência visual:** https://pernalombr4.github.io/prototipos/menu-lateral/, modelo "Trilha e painel". O mapa das 6
fases está em [fases.md](fases.md).

**Convenção:** "deve" é obrigatório. Cada requisito tem um critério de aceite que se confere na tela. Os textos entre
aspas são os da interface em português; os de inglês e espanhol estão no `textos.ts` da pasta do protótipo.

**Fora do escopo:** criar menu, seção ou categoria e o editor de menus (fase 5). As preferências de cada pessoa da
fase 3 não passam pelo rascunho.

## Resumo

| Grupo | O que muda em relação ao menu de hoje | Requisitos |
|---|---|---|
| Arrastar | Hoje o menu só muda em Configurações > Interface > Menus. Passa a mudar na própria barra | RF301 a RF308 |
| Regras de encaixe | A recusa aparece no lugar, com o motivo | RF309 a RF311 |
| Botão direito e "…" | Toda linha e todo título de seção têm um menu de ações | RF312 a RF320 e RF334 |
| Ocultar | Qualquer pessoa tira um item do próprio menu | RF321 a RF323 |
| Rascunho e salvar | Nada muda para ninguém até salvar; salvar para todos ou só para mim | RF324 a RF333 |

## Regras de negócio (RN)

| ID | Regra | Exemplo |
|---|---|---|
| RN301 | Só quem tem licença Owner ou Full pode mudar o menu do workspace para todos. | Membro com licença Basic só tem "Salvar só para mim". |
| RN302 | O menu que cada pessoa vê é o do workspace, ou a versão pessoal da pessoa quando a pessoa salvou só para si. | Ana salvou só para si: Ana vê a versão pessoal, Bruno vê a do workspace. |
| RN303 | Salvar para todos descarta a versão pessoal de quem salvou. | Depois de salvar para todos, Ana deixa de ter versão pessoal. |
| RN304 | Os itens de Integrações e de Configurações têm ordem fixa: item algum entra, sai ou muda de lugar. | Apps, Credenciais e Webhooks ficam nessa ordem em todo workspace. |
| RN305 | Início, Dados e Configurações ficam onde estão na trilha; só as seções mudam de lugar na trilha. | Arrastar Dados para baixo de Comercial é recusado. |
| RN306 | Nome nativo vem do produto: só o que o workspace criou se renomeia. | Comercial se renomeia; Auditoria, não. |
| RN307 | Início e Categorias não se ocultam. | O "…" de Categorias não tem "Ocultar do menu". |
| RN308 | A tabela a seguir define onde cada tipo de linha pode ser solto. Política: Única, a primeira linha que casa decide. | Linha 3: Contratos solto dentro de Comercial é recusado. |

| Linha | O que é solto | Onde | Resultado | Motivo na tela |
|---|---|---|---|---|
| 1 | qualquer | dentro de Integrações, ou um item de Integrações em qualquer lugar | recusado | "Integrações tem ordem fixa, como Configurações: nada entra, sai ou muda de lugar." |
| 2 | qualquer | dentro de um destino nativo | recusado | "Tela nativa não recebe item dentro. Solte dentro de uma seção." |
| 3 | seção ou destino nativo | dentro de uma seção | recusado | "O menu tem dois níveis. Seção não entra dentro de seção." |
| 4 | categoria | fora da seção Categorias | recusado | "Categoria só entra na seção Categorias." |
| 5 | tela | dentro da seção Categorias | recusado | "A seção Categorias só aceita categoria." |
| 6 | Início, Dados ou Configurações | outro lugar da trilha | recusado | "Trabalho, Dados e Configurações ficam onde estão. Só as seções mudam de lugar na trilha." |
| 7 | qualquer outro caso | qualquer outro lugar | aceito | (sem aviso) |

## Arrastar (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF301 | Ao passar o mouse numa linha ou num título de seção do menu do workspace, o sistema deve mostrar a alça de arraste no lugar do ícone, sem mover o texto. | O rótulo não anda quando a alça aparece. | Essencial |
| RF302 | Arrastar uma linha pela metade de cima ou de baixo de outra deve soltá-la antes ou depois dela. | Arrastar Clientes abaixo de Chamados troca a ordem. | Essencial |
| RF303 | Arrastar uma linha para o terço do meio de um título de seção deve pô-la dentro da seção, como último item; as bordas do título soltam antes ou depois da seção. | Soltar Painel de vendas no meio de Análise põe a tela dentro de Análise. | Essencial |
| RF304 | Arrastar um título de seção deve mover a seção inteira. | Arrastar Comercial acima de Análise move as 3 telas juntas. | Essencial |
| RF305 | Enquanto a linha está no ar, o sistema deve mostrar a marca do lugar onde a linha vai cair. | A linha de 2 px aparece entre as linhas de destino. | Importante |
| RF306 | Alt com a seta para cima ou para baixo, numa linha ou num título com foco, deve mover 1 lugar entre os vizinhos. | Alt+↓ em Logs de auditoria a põe depois de Logs de requisição. | Essencial |
| RF307 | As telas de um menu posto numa seção pessoal (o terceiro recuo) devem se reordenar como as telas da seção do workspace, e a ordem nova vale para o menu do workspace. | Reordenar Logs de requisição dentro de "Rotina do jurídico" muda a ordem também no painel de Auditoria. | Importante |
| RF308 | Só deve haver alça de arraste e mover no menu do workspace para quem tem licença Owner ou Full (RN301). | Estado sem permissão: nenhuma linha do menu do workspace mostra a alça; as categorias continuam arrastáveis (RN205 da fase 3). | Essencial |

## Regras de encaixe (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF309 | Enquanto a linha está sobre um lugar recusado pela RN308, o destino deve ficar vermelho. | Arrastar Contratos sobre Comercial pinta Comercial de vermelho. | Essencial |
| RF310 | Se a pessoa solta num lugar recusado pela RN308, o sistema deve deixar a linha onde estava e mostrar o motivo da tabela num aviso. | Soltar Logs de auditoria em Integrações: o aviso da linha 1 aparece e o item continua em Auditoria. | Essencial |
| RF311 | As linhas de Integrações e de Configurações não devem mostrar alça de arraste nem aceitar soltura (RN304). | Passar o mouse em Credenciais não mostra alça. | Essencial |

## Botão direito e "…" (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF312 | O botão direito numa linha do menu deve abrir o menu de ações da linha. | Botão direito em Contratos abre o menu. | Essencial |
| RF334 | O botão "…" que aparece no hover da linha deve abrir o menu de ações de RF312, com os itens de RF313. | O "…" e o botão direito mostram os itens de RF313. | Essencial |
| RF313 | O menu de ações de uma linha deve ter 3 blocos, nesta ordem: ir ("Abrir", "Abrir em nova aba", "Copiar link"); arrumar ("Mover para cima", "Mover para baixo", "Mover para"); mexer ("Renomear", "Ocultar do menu"). | Botão direito em Painel de vendas mostra os 3 blocos. | Essencial |
| RF314 | "Mover para" deve listar só as seções que aceitam a linha pela RN308 e, para quem está dentro de uma seção, "Primeiro nível do menu". | Em Painel de vendas, a lista não tem Categorias nem Integrações. | Importante |
| RF315 | "Renomear" só deve aparecer no que o workspace criou (RN306) e abrir uma janela curta com o nome. | Botão direito em Auditoria não tem "Renomear". | Importante |
| RF316 | Numa linha de Integrações, o menu de ações não deve ter "Mover para cima", "Mover para baixo" nem "Mover para" (RN304). | Botão direito em Credenciais: "Abrir", "Abrir em nova aba", "Copiar link" e "Ocultar do menu". | Essencial |
| RF317 | O menu de ações de um título de seção deve ter recolher ou expandir, "Copiar link", "Nova tela nesta seção", mover, "Mostrar na seção" e o bloco mexer. | Botão direito no título Comercial mostra os itens. | Importante |
| RF318 | O título de Integrações não deve ter "Nova tela nesta seção" (RN304). | Botão direito no título Integrações não tem o item. | Importante |
| RF319 | Item que a pessoa não pode usar pela RN301 deve aparecer desligado, com a explicação "Só quem configura o workspace". | Estado sem permissão: "Mover para cima" aparece desligado, com a explicação. | Importante |
| RF320 | Shift+F10 numa linha com foco deve abrir o menu de ações de RF312. | Pelo teclado, Shift+F10 em Contratos abre o menu. | Importante |

## Ocultar (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF321 | "Ocultar do menu" deve tirar a linha da barra, mantê-la na busca e avisar "<nome> saiu do menu." (RN307). | Ocultar Políticas internas: a linha some, e a busca do topo ainda acha. | Essencial |
| RF322 | Com algum item oculto, o pé do painel deve mostrar "N itens ocultos", que lista os ocultos e devolve cada um ao menu. | Com 1 oculto, o pé diz "1 item oculto". | Essencial |
| RF323 | Ocultar deve entrar no rascunho como o arraste (RF324). | Ocultar acende a bolinha e o cartão de salvar. | Essencial |

## Rascunho e salvar (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF324 | Toda mudança desta fase deve ir para o rascunho; o menu dos outros só muda depois de salvar. | Antes de salvar, o menu de Bruno não muda. | Essencial |
| RF325 | Na primeira mudança de cada rascunho, o sistema deve mostrar o aviso "Alterações não salvas", com "Arraste o quanto quiser. Nada muda para ninguém até você salvar." | O aviso aparece 1 vez; o segundo arraste não repete. | Importante |
| RF326 | A linha ou o título mexido deve mostrar a bolinha amarela, com o rótulo "Mexido, ainda não salvo". | Mover 1 linha deixa 1 bolinha, só na linha movida. | Essencial |
| RF327 | Com o rascunho aberto, o painel deve mostrar o cartão flutuante "Alterações não salvas", com "Salvar para todos", "Salvar só para mim" e "Descartar". | O cartão aparece no pé do painel e a lista ganha espaço embaixo para não ficar coberta. | Essencial |
| RF328 | "Salvar para todos" só deve aparecer para quem tem licença Owner ou Full (RN301). | Estado sem permissão: o cartão mostra "Salvar só para mim" e "Descartar". | Essencial |
| RF329 | "Salvar para todos" deve publicar o rascunho no menu do workspace, descartar a versão pessoal de quem salvou (RN303) e avisar "Menu salvo para todo o workspace." | Depois de salvar, o cartão e as bolinhas somem. | Essencial |
| RF330 | "Salvar só para mim" deve gravar o rascunho como a versão pessoal da pessoa (RN302) e avisar "Menu salvo só para você." | Depois de salvar, o menu de Bruno continua o do workspace. | Essencial |
| RF331 | Com a versão pessoal ativa, o pé do painel deve mostrar "Este menu é só seu." e o botão "Voltar ao do workspace", que apaga a versão pessoal. | Voltar ao do workspace devolve a ordem publicada, e o aviso some. | Essencial |
| RF332 | "Descartar" deve devolver o menu ao estado de antes do rascunho e apagar as bolinhas. | Mover 2 linhas e Descartar: a ordem volta. | Essencial |
| RF333 | Com a barra recolhida e o rascunho aberto, a trilha deve mostrar o ícone de salvar com a bolinha amarela, que abre o painel. | Recolher com o rascunho aberto: o ícone aparece na trilha. | Importante |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver |
|---|---|---|
| RI301 | Ler o menu do workspace e a versão pessoal da pessoa | Deve devolver a árvore publicada e, se existir, a versão pessoal. Rota <a definir>. |
| RI302 | Salvar para todos | Deve receber a árvore do rascunho e recusar quem não cumpre a RN301. Rota <a definir>. |
| RI303 | Salvar só para mim e voltar ao do workspace | Deve gravar e apagar a versão pessoal da pessoa. Rota <a definir>. |

## Não funcionais, restrições e transição (RNF, RS, RT)

| ID | Requisito | Como medir ou conferir | Prioridade |
|---|---|---|---|
| RNF301 | Todo arraste desta fase deve ter caminho de teclado: Alt com as setas e "Mover para" no menu de ações. | Repetir cada arraste só com o teclado. | Essencial |
| RNF302 | A bolinha amarela não deve ser o único sinal de mudança (WCAG 2.2, critério 1.4.1): o cartão "Alterações não salvas" e o rótulo da bolinha dizem que há mudança. | Em tons de cinza, o cartão continua dizendo que há mudança. | Importante |
| RT301 | Até o fim da fase 6, o menu novo só deve aparecer em develop (RT001 da fase 1). | Em produção, o menu de hoje continua igual. | Essencial |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P301 | O motivo da linha 6 da RN308 ainda diz "Trabalho", nome antigo do Início. O texto passa a "Início, Dados e Configurações ficam onde estão..."? | produto | O texto do aviso. |
| P302 | A linha 3 da RN308 recusa também destino nativo dentro de seção, com o texto de seção. Ganha texto próprio? | produto | Um motivo novo na tabela. |
| P303 | Quem salvou para todos fica registrado em algum lugar (log de auditoria)? | produto | Um RI de registro na Auditoria. |
| P304 | Se 2 administradores salvam para todos ao mesmo tempo, qual rascunho vale? | dev | Um RF de conflito ao salvar. |
| P305 | A ordem personalizada das categorias é só da pessoa ou o administrador pode fixar uma ordem para todos? | produto | RN205 da fase 3 ganha a exceção. |
| P306 | O arraste não é anunciado ao leitor de tela; o aviso só diz quando a soltura falha. Precisa anunciar o sucesso? | acessibilidade | Um RNF de anúncio (WCAG 4.1.3). |
