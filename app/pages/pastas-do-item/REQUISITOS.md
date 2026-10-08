# Requisitos: barra de folders do item, modelo Sublinhado

**Objetivo:** a barra de folders do item se lê como abas. A folder aberta se liga ao conteúdo abaixo, as outras ficam discretas, e arrastar uma folder parece arrastar a aba de um navegador.

**Onde vale:** na tela do item (`/workspaces/<ws>/types/<categoria>/<referência>`) e na barra lateral do item, aberta pela lista.

**Referência visual:** protótipo `pastas-do-item`, estilo Sublinhado (`?estilo=sublinhado`), aprovado em 08/10/2026. Prints em `evidencias/proposta-*.png`.

**Convenção:** "deve" é obrigatório. Cada requisito tem um critério de aceite que se confere na tela.

## Resumo

| Grupo | O que muda em relação à preview de 08/10/2026 |
|---|---|
| Aparência (RV) | Folder sem contorno, sombra nem fundo; a aberta ganha um traço na cor de destaque sobre uma linha de base contínua |
| Hover (RH) | Sem fundo: o texto fica mais forte e um traço fraco na cor de destaque aparece |
| Abrir folder (RA) | Abre só no clique, com Enter ou com Espaço; botão direito e arrasto não abrem |
| Arrasto (RD) | A folder segue o mouse, troca de lugar na metade da vizinha e salva sozinha, com Desfazer |
| Menu da folder (RM) | Seta ⌄ visível na aberta, botão direito e clique duplo |
| Criar e excesso (RX) | "+" cria direto; "+N" só aparece quando sobra folder e tem busca |
| Endereço e teclado (RE) | Folder aberta no endereço; teclado reordena |

## Aparência (RV)

| ID | Requisito | Critério de aceite |
|---|---|---|
| RV-01 | A barra deve ter uma linha de base de 1 px, cor `border-default`, de ponta a ponta, incluindo a área do "+" e do "+N". | A linha atravessa a barra inteira, sem interrupção. |
| RV-02 | A linha de base deve ser a borda de cima do conteúdo da folder. | O conteúdo começa logo abaixo da linha. A Visão Geral não tem outra linha horizontal no topo. |
| RV-03 | A folder não deve ter contorno, sombra, fundo nem canto arredondado, aberta ou fechada. | Nenhuma folder parece botão ou ficha em repouso. |
| RV-04 | Cada folder mostra ícone (16 px) e nome em texto de 14 px, com 4 px entre uma folder e outra. | Ícone e nome alinhados na mesma linha. |
| RV-05 | A folder fechada deve ter o texto na cor `text-muted`. | Todas as fechadas têm a mesma cor, mais fraca que a aberta. |
| RV-06 | A folder aberta deve ter texto em negrito (semibold) na cor de destaque e um traço de 2 px, cantos redondos, na cor de destaque, sobre a linha de base. | Só a aberta tem traço forte e texto na cor de destaque. |
| RV-07 | Ao trocar de folder, o traço da nova aberta deve crescer do centro para as pontas em 200 ms. | A troca anima o traço, sem salto. |
| RV-08 | O traço da aberta deve pertencer à própria aba, não a um indicador separado da barra. | Ao arrastar a folder aberta, o traço vai junto (RD-05). |
| RV-09 | A folder pode mostrar um contador depois do nome (exemplo: Comentários 3). | Na fechada, o contador é cinza; na aberta, tem fundo e texto na cor de destaque. |

## Hover (RH)

| ID | Requisito | Critério de aceite |
|---|---|---|
| RH-01 | No hover de uma folder fechada, o texto deve passar para `text-highlighted`. | O texto fica mais forte que o das outras fechadas. |
| RH-02 | No hover de uma folder fechada, um traço de 2 px na cor de destaque a 35 % deve crescer do centro sobre a linha de base, no mesmo lugar do traço da aberta. | O traço é rosa fraco, mais claro que o da aberta. |
| RH-03 | O hover não deve acender fundo atrás da folder. | Nenhuma folder vira bloco ao passar o mouse. |

## Abrir folder (RA)

| ID | Requisito | Critério de aceite |
|---|---|---|
| RA-01 | A folder deve abrir no clique: botão esquerdo, soltando sem arrastar. | Clicar e soltar sobre a folder abre o conteúdo dela. |
| RA-02 | A folder não deve abrir ao apertar o botão do mouse (mousedown). | Apertar e arrastar uma folder fechada não troca o conteúdo. |
| RA-03 | O botão direito não deve abrir a folder. | Botão direito numa folder fechada abre o menu (RM-02) e a folder aberta continua a mesma, também depois de fechar o menu. |
| RA-04 | Pelo teclado, as setas movem o foco entre as folders e Enter ou Espaço abrem a folder em foco. | Mover o foco com as setas não troca o conteúdo; Enter troca. |

## Arrasto (RD)

| ID | Requisito | Critério de aceite |
|---|---|---|
| RD-01 | O arrasto deve começar depois de 5 px de movimento com o botão apertado. | Um clique com tremida pequena abre a folder em vez de arrastar. |
| RD-02 | A própria folder deve seguir o mouse na horizontal, presa aos limites da barra. Não deve existir cópia translúcida. | A folder sai do lugar junto com o ponteiro. |
| RD-03 | A folder arrastada deve passar por cima das vizinhas, com o fundo da página, sem contorno, sombra, canto arredondado nem elevação. | O texto da vizinha não aparece misturado ao da arrastada. |
| RD-04 | A vizinha deve trocar de lugar quando o centro da folder arrastada passar da metade dela, deslizando em 200 ms. | A vizinha se mexe antes de a arrastada chegar à borda dela. |
| RD-05 | A folder arrastada leva o traço embaixo: o forte, se for a aberta; o fraco (RH-02), se for fechada. | O traço anda junto com a folder. |
| RD-06 | Arrastar não deve abrir a folder, nem o clique que encerra o arrasto. | Arrastar uma fechada e soltar mantém a mesma folder aberta. |
| RD-07 | Soltar no mesmo lugar não deve fazer nada: sem popup, sem aviso, sem gravação. | Arrastar e voltar ao lugar de origem não mostra nada. |
| RD-08 | Soltar em outro lugar deve salvar a ordem sozinho e mostrar o aviso "Ordem das folders salva." com o botão Desfazer, por 4 s. | Desfazer volta a ordem anterior. Não existe popup de confirmação. |
| RD-09 | A seta ⌄ da folder aberta (RM-01) deve continuar visível no arrasto e acompanhar a aba, quando ela é a arrastada e quando é a vizinha que desliza. | A seta nunca some nem fica no lugar antigo. |
| RD-10 | Quando a arrastada é a aberta, a seta ⌄ deve ficar por cima dela. Quando outra folder passa por cima da aberta, a seta deve ficar por baixo da arrastada. | Arrastando a aberta, a seta continua visível. Outra folder passando por cima da aberta cobre a seta. |

## Menu da folder (RM)

| ID | Requisito | Critério de aceite |
|---|---|---|
| RM-01 | A folder aberta deve mostrar uma seta ⌄ depois do nome, que abre o menu com Editar, Ocultar e Excluir. | A seta aparece só na aberta. O espaço dela entra na largura da aba, e a troca de folder anima esse espaço, sem salto das vizinhas. |
| RM-02 | O botão direito em qualquer folder deve abrir o mesmo menu, para aquela folder. | Botão direito numa fechada mostra o menu dela, sem abri-la (RA-03). |
| RM-03 | O clique duplo numa folder deve abrir Editar, com o campo Nome preenchido. | Clique duplo em Notas abre "Editar folder" com "Notas". |
| RM-04 | Em folder do sistema (Visão Geral, Comentários, Logs de Auditoria, Spaceflows, Anexos, Notas), Excluir deve aparecer desabilitado, com a explicação "Folder do sistema. Você pode ocultar." | Não abre modal de recusa. |
| RM-05 | Ocultar deve tirar a folder da barra na hora e mostrar um aviso com Desfazer. | Desfazer devolve a folder ao mesmo lugar. |
| RM-06 | Excluir uma folder do cliente deve pedir confirmação num modal, com o botão de excluir em vermelho. | Cancelar mantém a folder. |

## Criar e excesso (RX)

| ID | Requisito | Critério de aceite |
|---|---|---|
| RX-01 | O botão "+" na ponta direita deve abrir direto o modal "Nova folder", com o campo Nome. | Criar uma folder leva 1 clique até o modal, sem menu intermediário. |
| RX-02 | A folder criada entra no fim da fila, já aberta, com o aviso de criação. | A nova folder aparece com o traço forte. |
| RX-03 | O botão "+N ⌄" deve aparecer só quando houver folder que não cabe, com N igual ao número de escondidas. | Com todas visíveis, o botão não existe. |
| RX-04 | O "+N" deve abrir uma lista com busca ("Pesquisar folder..."), o contador de cada folder e "⋯" na linha em foco, com o menu da folder (RM-01). | Digitar filtra a lista; sem resultado, aparece "Nenhuma folder encontrada." |
| RX-05 | Escolher uma folder na lista deve trazê-la para a barra e abri-la. | A escolhida aparece na barra com o traço forte. |
| RX-06 | A folder aberta deve estar sempre na barra; se não couber, ocupa o lugar da última que cabia. | A aberta nunca fica só dentro do "+N". |
| RX-07 | O cálculo de quantas cabem deve considerar a largura real de cada folder e reservar o espaço da seta ⌄ e dos botões da ponta. | Redimensionar a janela ou abrir na barra lateral recalcula sem cortar folder pela metade. |

## Endereço e teclado (RE)

| ID | Requisito | Critério de aceite |
|---|---|---|
| RE-01 | A folder aberta deve ir para o endereço da página (exemplo: `?folder=anexos`). | Recarregar mantém a folder; o link leva direto a ela. |
| RE-02 | Ctrl + Shift + seta para a esquerda ou direita deve mover a folder aberta 1 posição, com o mesmo salvamento de RD-08. | A ordem muda pelo teclado. |
| RE-03 | Toda mudança de posição deve ser anunciada ao leitor de tela (exemplo: "Notas movida para a posição 2."). | O anúncio sai numa região `aria-live`. |
| RE-04 | A barra deve manter `role="tablist"` e `role="tab"`, com foco visível. | O anel de foco aparece ao navegar pelo teclado. |

## Como o protótipo monta, para referência

- Barra: `UTabs` do Nuxt UI, `variant="link"`, ativação manual (`activation-mode="manual"`), aparência só pela prop `ui` com tokens.
- Traço da aberta e do hover: pseudo-elemento `after` do próprio gatilho, no lugar do indicador do `UTabs` (por causa de RV-08).
- Abrir no clique: a barra segura o mousedown dos gatilhos e abre a folder no `click`.
- Arrasto: eventos de ponteiro sobre os gatilhos. No produto, o `useSortable` (`@vueuse/integrations` com `sortablejs`) serve, desde que cumpra RD-01 a RD-10.
- Menus: `UContextMenu` (botão direito), `UDropdownMenu` (seta ⌄ e "⋯"), `UPopover` com `UCommandPalette` ("+N"), `UModal` (Nova, Editar, Excluir) e `useToast` (avisos com Desfazer).

## Fora destes requisitos

- **Escopo da ordem:** se a ordem salva vale para a pessoa ou para todos da categoria. O aviso de RD-08 não diz; o time de produto decide.
- **Reexibir folder oculta:** o protótipo só tem o Desfazer; falta definir onde a folder oculta volta.
- **O que acontece com os campos de uma folder excluída:** o protótipo diz que voltam para a Visão Geral, mas isso não foi conferido no produto.
- **Rótulo:** a tela diz "folder" em português ("Nova folder"); o termo em português é "pasta".
