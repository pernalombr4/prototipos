# Requisitos: fase 3, personalização

**Objetivo:** cada pessoa arruma a própria navegação: o que fica na trilha, o que aparece no Início, as próprias
seções com menus e submenus, quantos itens cada seção mostra e a largura do painel. Nada disso muda o menu de mais
ninguém.

**Onde vale:** a trilha, o painel do Início, o botão "Mais", a janela "Personalizar" e o cabeçalho de cada painel.

**Referência visual:** https://pernalombr4.github.io/prototipos/menu-lateral/, modelo "Trilha e painel". O mapa das 6
fases está em [fases.md](fases.md).

**Convenção:** "deve" é obrigatório. Cada requisito tem um critério de aceite que se confere na tela. Os textos entre
aspas são os da interface em português; os de inglês e espanhol estão no `textos.ts` da pasta do protótipo.

**Fora do escopo:** mudar o menu do workspace, que todo mundo vê (fase 4): a parte "Nas áreas da trilha" da aba
"Seções e menus" e o "Salvar para todos" são da fase 4. Criar e excluir menu ou categoria são da fase 5.

## Resumo

| Grupo | O que muda em relação ao menu de hoje | Requisitos |
|---|---|---|
| Janela Personalizar | Hoje não existe. Passa a ter 3 abas (Navegação, Início e Seções e menus) e 1 "Salvar" no pé | RF201 a RF209, RF250, RF251 e RF256 |
| Trilha | A pessoa escolhe o que fica na trilha e a ordem | RF210 a RF215 |
| Início | Destinos que a pessoa esconde vão para "⋯ Mais" | RF216 a RF218 |
| Seções pessoais | Hoje não existem. A pessoa cria seções no Início, põe nelas menus e, nos menus, submenus | RF219 a RF228, RF247, RF252 a RF254 e RF257 |
| Quantos itens a seção mostra | "Mostrar na seção" com 5, 10, 15, 30 ou Todos | RF229 a RF232 |
| Filtro do menu | A lupa do cabeçalho filtra o menu; a busca do workspace fica no topo | RF233 a RF239 e RF248 |
| Cabeçalho e pé do Início | Os botões do cabeçalho aparecem no hover; "Personalizar a barra lateral" fica fixo no pé | RF240 a RF241 e RF255 |
| Largura do painel | A borda do painel se arrasta | RF242 a RF245 e RF249 |

## Regras de negócio (RN)

| ID | Regra | Exemplo |
|---|---|---|
| RN201 | Toda preferência desta fase vale só para quem a fez. Fora da janela Personalizar, vale na hora; dentro dela, vale quando a pessoa salva (RF209). | Ana tira Auditoria da trilha e salva; a trilha de Bruno não muda. |
| RN202 | Uma seção pessoal só aparece para a pessoa que a criou. | "Rotina do jurídico", de Ana, não aparece para Bruno. |
| RN203 | Fixar uma área com a trilha cheia (RN001 da fase 1) troca a última área da trilha, que vai para "Mais". | Trilha com 8 ícones: fixar Conhecimento manda Integrações para "Mais". |
| RN204 | O Início não pode sair da trilha nem mudar de posição nela (RN002 da fase 1). | O Início não tem "Tirar da trilha". |
| RN205 | A ordem personalizada das categorias é preferência de cada pessoa, e pessoas de toda licença podem arrastar as categorias. | Membro sem licença Owner ou Full arrasta as próprias categorias. |
| RN206 | O menu tem no máximo 3 níveis: seção, menu e submenu. Submenu não recebe submenu, e o menu que tem submenus não vira submenu. | Políticas internas, com o submenu Base de Conhecimento, não entra em outro menu. |
| RN207 | Só o menu que o workspace criou recebe submenu. Destino nativo, tela nativa, tela de módulo e categoria só ficam numa seção. | Meus relatórios, Logs de auditoria e Dashboard de tarefas não recebem submenu. |
| RN208 | Tirar um menu de uma seção ou de outro menu não exclui o menu: o menu continua existindo e pode voltar. | Contratos sai de "Rotina do jurídico" e volta pelo "+" da seção. |

## Janela Personalizar (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF201 | A janela "Personalizar" deve ter as abas "Navegação", "Início" e "Seções e menus". | A janela abre na aba de quem a chamou: o botão direito da trilha abre em Navegação. | Essencial |
| RF202 | A aba Navegação deve listar todas as áreas com uma caixa de marcar cada: marcada fica na trilha, desmarcada fica em "Mais". | Desmarcar Auditoria tira o ícone da trilha na hora. | Essencial |
| RF203 | Na aba Navegação, o Início deve aparecer marcado e travado, com a dica "O Início fica sempre na trilha. Clicar nele abre a página inicial e este menu." (RN204). | A caixa do Início não desmarca. | Essencial |
| RF204 | Na aba Navegação, as áreas marcadas devem se reordenar arrastando pela alça e por Alt com as setas. | Arrastar Comercial para cima de Análise troca a ordem na trilha na hora. | Importante |
| RF205 | A aba Navegação deve ter "Aparência", com "Somente ícones" e "Ícones e rótulos". | "Somente ícones" tira o nome de baixo dos ícones e põe o nome no `aria-label` de cada um. | Importante |
| RF206 | A aba Início deve listar os destinos nativos com uma caixa de marcar cada e reordenar arrastando e por Alt com as setas. | Desmarcar Documentos tira a linha do Início e a põe em "⋯ Mais". | Essencial |
| RF207 | A aba "Seções e menus" deve listar, em "No Início", as seções do Início, com os menus e os submenus de cada seção pessoal, e reordenar as seções arrastando e por Alt com as setas. | "Rotina do jurídico" mostra Políticas internas e, embaixo, Base de Conhecimento. | Importante |
| RF208 | A aba "Seções e menus" deve listar as seções ocultas em "Seções ocultas", com o botão que mostra de novo, e ter "Criar seção". | Mostrar Favoritos devolve a seção ao Início. | Importante |
| RF209 | Na janela, a mudança feita em cada uma das 3 abas deve ficar pendente até "Salvar" (RN201). | Desmarcar Auditoria e clicar em "Descartar": Auditoria volta à trilha. | Essencial |
| RF256 | O pé da janela deve mostrar "Alterações não salvas" (ou "Nada para salvar ainda."), "Descartar" e "Salvar". | Sem mudança, o pé diz "Nada para salvar ainda." e os 2 botões ficam desligados. | Essencial |
| RF250 | Na aba "Seções e menus", a linha de cada seção do Início deve mostrar no hover "Excluir seção" (só na seção pessoal) e "Ocultar seção", nessa ordem, à esquerda do "+", que fica à vista sem o hover. | Passar o mouse em "Rotina do jurídico" mostra a lixeira, o olho riscado e o "+", da esquerda para a direita. | Importante |
| RF251 | Na aba "Seções e menus", cada menu de seção pessoal deve ter o "⋯" com "Mover para cima", "Mover para baixo", "Adicionar submenu" (RN207) e "Tirar da seção"; cada submenu, com mover e "Tirar do menu". | O "⋯" de Logs de auditoria não tem "Adicionar submenu"; o de Políticas internas tem. | Importante |

## Trilha (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF210 | Na grade de "Mais", cada área deve mostrar no hover o alfinete "Fixar na trilha". | Fixar Conhecimento põe o ícone na trilha. | Essencial |
| RF211 | Quando fixar troca uma área (RN203), o sistema deve avisar quem entrou e quem saiu. | Aviso: "Conhecimento entrou na trilha no lugar de Integrações, que foi para Mais." | Importante |
| RF212 | A grade de "Mais" deve terminar com o botão "Personalizar navegação". | O botão abre a janela na aba Navegação. | Importante |
| RF213 | O botão direito num ícone da trilha deve abrir o menu com estes grupos, nesta ordem: "Abrir em nova aba"; "Copiar link"; "Mover para cima", "Mover para baixo" e "Tirar da trilha"; "Ocultar do menu"; "Personalizar navegação" e "Recolher menu". | Botão direito em Comercial mostra os 5 grupos. | Essencial |
| RF214 | No menu do botão direito, o Início deve mostrar só "Abrir em nova aba", "Copiar link", "Personalizar navegação" e "Recolher menu" (RN204). | Botão direito no Início não tem mover nem tirar. | Essencial |
| RF215 | No menu do botão direito, "Ocultar do menu" só deve aparecer em área que é seção; Dados e Configurações não se ocultam. | Botão direito em Configurações não tem "Ocultar do menu". | Importante |

## Início (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF216 | Quando a pessoa esconde algum destino nativo, o Início deve mostrar a linha "⋯ Mais" depois dos destinos. | Com Documentos escondido, "⋯ Mais" aparece. | Essencial |
| RF217 | "⋯ Mais" deve abrir ao lado a lista dos destinos escondidos, cada um com o alfinete que o devolve ao Início, e "Personalizar" no pé. | Fixar Documentos devolve a linha ao Início. | Essencial |
| RF218 | A largura da lista de "⋯ Mais" deve seguir a regra de largura do menu flutuante (RF018 e RF019 da fase 1). | A lista com Documentos e Todas as categorias abre com cerca de 207 px. | Desejável |

## Seções pessoais (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF219 | "Criar seção" deve abrir uma janela com ícone e nome; a seção criada entra no topo das seções do Início (RN202). | Criar "Rotina do jurídico": a seção aparece acima de Favoritos. | Essencial |
| RF220 | No hover, o título de uma seção pessoal deve mostrar os botões "…" e "+". | Passar o mouse em "Rotina do jurídico" mostra os 2 botões. | Importante |
| RF221 | O "+" da seção pessoal deve abrir a janela "Adicionar em <nome da seção>", que busca os menus e as categorias do workspace que ainda não estão na seção e põe o escolhido nela. | Buscar "contratos" e escolher: Contratos entra na seção e sai da lista. | Essencial |
| RF222 | Seção pessoal vazia deve mostrar a linha "Adicionar à seção", que abre a janela de RF221. | Seção nova mostra a linha até receber o primeiro menu. | Importante |
| RF223 | O menu de uma seção pessoal deve receber submenus pela ação "Adicionar submenu", que abre a janela de RF221 para aquele menu (RN206 e RN207). | Políticas internas recebe Base de Conhecimento; Logs de auditoria não tem a ação. | Essencial |
| RF224 | O "…" da seção pessoal deve ter renomear, adicionar, "Ordenar seção" (personalizada, alfabética, adicionadas por último), "Criar seção", "Reordenar seções" e excluir. | Ordenar "alfabética" reordena os itens da seção na hora. | Importante |
| RF225 | Renomear uma seção pessoal deve abrir a janela de criar seção, preenchida. | Renomear "Rotina do jurídico" abre a janela com o nome atual. | Importante |
| RF226 | As seções do Início devem se reordenar arrastando pelo título e por Alt com as setas no título. | Arrastar Favoritos acima de "Rotina do jurídico" troca a ordem. | Importante |
| RF227 | Os itens de uma seção pessoal devem se reordenar arrastando. | Arrastar Contratos acima de Auditoria dentro da seção. | Importante |
| RF247 | Arrastar um item de uma seção pessoal para outra seção pessoal deve mover o item para a outra seção. | Arrastar Contratos de "Rotina do jurídico" para outra seção pessoal. | Importante |
| RF228 | As categorias devem se reordenar arrastando; o primeiro arraste troca a ordem para "Personalizada" e avisa (RN205). | Em "Mais usadas", arrastar Clientes muda a ordem para "Personalizada". | Importante |
| RF252 | Os submenus devem aparecer embaixo do menu, num terceiro recuo. | Políticas internas mostra Base de Conhecimento embaixo, com recuo maior. | Essencial |
| RF257 | O menu com submenus deve abrir e fechar pela seta. | A seta de Políticas internas esconde e mostra Base de Conhecimento. | Importante |
| RF253 | "Tirar da seção" e "Tirar do menu" devem tirar o atalho e avisar "<nome> saiu da seção. Ele continua existindo e pode voltar pelo "+"." ou "<nome> saiu do menu. Ele continua existindo e pode voltar.", com "Desfazer" (RN208). | Tirar Contratos e clicar em "Desfazer": Contratos volta ao mesmo lugar. | Essencial |
| RF254 | Os submenus de um menu da seção pessoal devem se reordenar arrastando e por Alt com as setas, e a ordem nova vale só para a pessoa. | Reordenar os submenus de Políticas internas não muda o menu de Bruno. | Importante |

## Quantos itens a seção mostra (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF229 | O "…" e o botão direito de toda seção devem ter "Mostrar na seção", com 5, 10, 15, 30 e Todos. | Escolher 5 numa seção com 8 itens mostra 5. | Importante |
| RF230 | O padrão deve ser 5 em Categorias e Todos nas outras seções. | Conta nova: Categorias mostra 5; Comercial mostra todos. | Importante |
| RF231 | Seção cortada deve terminar com "Mais N", que abre o resto ali mesmo, e depois "Mostrar menos", que volta. | Seção com 8 e limite 5: "Mais 3". | Importante |
| RF232 | Enquanto a pessoa filtra o menu (RF233), as seções devem mostrar todos os resultados, sem o corte de "Mostrar na seção". | Filtrar com o limite 5 ligado mostra os 8 resultados. | Importante |

## Filtro do menu (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF233 | A lupa do cabeçalho do painel deve abrir o campo "Filtrar o menu" no lugar do título, com o foco dentro. | Clicar na lupa não abre a busca do workspace. | Essencial |
| RF234 | Esc ou o "x" do campo deve fechar o filtro e limpar o termo. | Esc devolve o título e o menu inteiro. | Essencial |
| RF235 | O filtro deve procurar também no que não está à vista: itens de "⋯ Mais", seções recolhidas e ocultas, todas as categorias e os submenus das seções pessoais. | Filtrar "fornec" acha Fornecedores, que estava fora das 5 categorias. | Essencial |
| RF236 | Filtrando, as seções com resultado devem abrir e as seções sem resultado devem sumir. | Filtrar "logs" abre Auditoria e esconde Comercial. | Importante |
| RF248 | Filtrando, as linhas não devem mostrar a alça de arraste. | Durante o filtro, linha alguma mostra a alça. | Importante |
| RF237 | Se o filtro não acha nada, o painel deve dizer "Nada no menu com esse nome" e ter o botão "Buscar "termo" no workspace", que abre a busca do workspace já com o termo. | Filtrar "xyz" e clicar no botão abre a busca do topo com "xyz". | Importante |
| RF238 | O cabeçalho do Início deve ter o filtro por tipo, com "Categorias" e "Com pendências" (Inbox e Tarefas com número). Marcados juntos, valem como "ou". | Marcar "Com pendências" deixa no Início só Inbox e Tarefas. | Desejável |
| RF239 | O painel de Configurações deve ter o filtro de RF233, procurando nos itens dos 6 grupos e abrindo os grupos com resultado. | Filtrar "e-mail" abre o grupo E-mails. | Importante |

## Cabeçalho e pé do Início (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF240 | Em repouso, o cabeçalho do Início deve mostrar só o título e o "+". | Sem o mouse no painel, só aparecem "Início" e "+". | Importante |
| RF241 | Com o mouse no painel ou o foco do teclado nos botões, o cabeçalho deve mostrar a lupa, o filtro por tipo e "Recolher menu"; o botão ligado fica à vista. | Com o filtro por tipo ligado, o botão continua visível sem o mouse. | Importante |
| RF255 | "Personalizar a barra lateral" deve ficar fixo no pé do painel do Início, fora da rolagem, em texto cinza, sem contorno, com uma linha fina em cima; o cartão "Alterações não salvas" abre acima dele. | Rolar o Início até o fim: o botão continua no pé, no mesmo lugar. | Importante |

## Largura do painel (RF)

| ID | Requisito | Critério de aceite | Prioridade |
|---|---|---|---|
| RF242 | A borda direita do painel deve se arrastar entre 264 px e 480 px de largura da barra, contando os 72 px da trilha. | Arrastar até o fim para em 480 px. | Importante |
| RF243 | Arrastar a borda abaixo de 210 px deve esmaecer o painel e pintar a borda de amarelo. | Em 200 px, o painel fica esmaecido. | Importante |
| RF249 | Soltar a borda abaixo de 210 px deve recolher a barra; expandir depois volta à largura de antes do gesto. | Soltar em 200 px recolhe; expandir volta a 304 px. | Importante |
| RF244 | Duplo clique na borda deve voltar à largura padrão de 304 px. | Duplo clique depois de arrastar: 304 px. | Desejável |
| RF245 | A borda deve ser um `separator` com foco: as setas mudam 16 px, Home vai ao mínimo, End vai ao máximo, e a seta para a esquerda no mínimo recolhe. | Pelo teclado, a borda faz tudo o que o mouse faz. | Importante |
| RF246 (removido) | | | |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver |
|---|---|---|
| RI201 | Preferências de navegação da pessoa | Deve guardar e devolver: áreas na trilha e a ordem, aparência, destinos escondidos e a ordem do Início, seções pessoais com os itens, seções ocultas, limite de cada seção, ordem das categorias e largura do painel. Rota <a definir>. |

## Não funcionais, restrições e transição (RNF, RS, RT)

| ID | Requisito | Como medir ou conferir | Prioridade |
|---|---|---|---|
| RNF201 | Todo arraste desta fase deve ter caminho de teclado: Alt com as setas ou "Mover" num menu. | Repetir cada arraste só com o teclado. | Essencial |
| RT201 | Até o fim da fase 6, o menu novo só deve aparecer em develop (RT001 da fase 1). | Em produção, o menu de hoje continua igual. | Essencial |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P201 | O filtro por tipo tinha a opção "Telas", que perdeu o sentido: no menu novo, o menu é a tela. **O dev propõe** um terceiro tipo que tenha lógica no menu novo, ou a confirmação de que bastam "Categorias" e "Com pendências". | dev, com aprovação de produto | RF238 ganha ou não a terceira opção. |
| P202 | "Seção" quer dizer 2 coisas: a seção pessoal do Início (esta fase) e a seção de menu do workspace (fases 4 e 5). Os 2 nomes ficam iguais? | produto | Os textos de "Criar seção" das 2 fases. |
| P203 | As preferências desta fase (largura do painel inclusive) continuam depois de recarregar e seguem a pessoa em todos os aparelhos, ou ficam no navegador? No protótipo, nada sobrevive ao recarregar. | produto | RI201 grava no servidor ou no navegador. |
| P204 | Respondida na rodada 28 do protótipo: o pé da janela "Adicionar em" tem "Criar menu", que abre o formulário da fase 5 (RF408). | | |
| S201 | Suposição: Integrações pode ir para "Mais" e voltar, como as outras áreas; a ordem fixa da fase 4 vale só para o que tem dentro dela. | produto | RF202 trava Integrações na trilha. |
