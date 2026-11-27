# 1. Submenu e rascunho

**Objetivo:** o menu do workspace ganha o 3º nível (seção > menu > submenu). Toda mudança no menu do workspace vai
para um rascunho, que só muda o menu dos outros depois de "Salvar para todos".

**Onde vale:** o menu do workspace no painel, no menu flutuante e na barra recolhida.

**Protótipo:** https://pernalombr4.github.io/prototipos/menu-lateral/, cenário "Em uso", seção Comercial.

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN001 | O menu que cada pessoa vê é o do workspace, ou a versão pessoal quando a pessoa salvou só para si. | Ana salvou só para si: Ana vê a versão pessoal, Bruno vê a do workspace. | Obrigatório |
| RN002 | Publicar o rascunho no menu do workspace descarta a versão pessoal de quem salvou. | Depois de Ana publicar, Ana deixa de ter versão pessoal. | Obrigatório |
| RN003 | Tirar um menu de uma seção ou de outro menu não exclui o menu: o menu sobe 1 nível. | Tirar Metas do trimestre de Painel de vendas devolve o menu a Comercial. | Obrigatório |
| RN004 | Cada menu e cada submenu só aparece para quem está num dos grupos permitidos dele; sem grupo, aparece para cada membro do workspace. | Submenu restrito ao grupo Jurídico não aparece para quem está fora do grupo. | Obrigatório |

## Submenu (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF001 | O sistema deve guardar e mostrar o menu do workspace em 3 níveis: seção, menu e submenu (RN902). | Comercial mostra Painel de vendas e, embaixo, Metas do trimestre, no painel, no menu flutuante e no editor. | Essencial | Obrigatório |
| RF002 | Os submenus devem aparecer embaixo do menu, num terceiro recuo. | Metas do trimestre aparece recuada embaixo de Painel de vendas. | Essencial | Obrigatório |
| RF003 | O menu de ações de um menu do workspace dentro de uma seção deve ter "Adicionar submenu" só quando o workspace criou o menu (RN903); a ação abre a janela "Adicionar em <nome>", com os menus que podem entrar ali. | Painel de vendas tem a ação; Tarefas > Painel e Logs de auditoria, não. | Essencial | Obrigatório |
| RF004 | Escolher um menu em "Adicionar em <nome>" deve movê-lo para dentro do menu, no rascunho (RN905). | Escolher Minhas requisições em Triagem de propostas: o menu vira submenu, com a bolinha amarela. | Essencial | Obrigatório |
| RF005 | "Tirar do menu" deve devolver o submenu à seção, logo depois do menu de onde saiu (RN003). | Tirar Metas do trimestre: a linha volta para Comercial, depois de Painel de vendas. | Essencial | Obrigatório |
| RF006 | O sistema deve mostrar cada menu e submenu só para quem cumpre a RN004. | Membro fora do grupo Jurídico não vê o submenu restrito, e quem está no grupo vê. | Essencial | Obrigatório |

## Rascunho e salvar (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF011 | Cada mudança no menu do workspace deve ir para o rascunho; o menu dos outros só muda depois de salvar. | Antes de salvar, o menu de Bruno não muda. | Essencial | Obrigatório |
| RF012 | Na primeira mudança de cada rascunho, o sistema deve mostrar o aviso "Alterações não salvas", com "Arraste o quanto quiser. Nada muda para ninguém até você salvar." | O aviso aparece 1 vez; a segunda mudança não repete. | Importante | Desejável |
| RF013 | A linha ou o título mexido deve mostrar a bolinha amarela, com o rótulo "Mexido, ainda não salvo". | Mover 1 linha deixa 1 bolinha, só na linha movida. | Essencial | Obrigatório |
| RF014 | Com o rascunho aberto, o painel deve mostrar o cartão flutuante "Alterações não salvas", com "Salvar para todos", "Salvar só para mim" e "Descartar". | O cartão aparece no pé do painel, e a lista ganha espaço embaixo para não ficar coberta. | Essencial | Obrigatório |
| RF015 | "Salvar para todos" só deve aparecer para quem cumpre a RN901. | Membro com licença Basic: o cartão mostra "Salvar só para mim" e "Descartar". | Essencial | Obrigatório |
| RF016 | "Salvar para todos" deve publicar o rascunho no menu do workspace, descartar a versão pessoal de quem salvou (RN002) e avisar "Menu salvo para todo o workspace." | Depois de salvar, o cartão e as bolinhas somem, e Bruno vê o menu novo ao recarregar. | Essencial | Obrigatório |
| RF017 | "Salvar só para mim" deve gravar o rascunho como a versão pessoal da pessoa (RN001) e avisar "Menu salvo só para você." | Depois de salvar, o menu de Bruno continua o do workspace. | Essencial | Obrigatório |
| RF018 | Com a versão pessoal ativa, o painel deve mostrar, logo abaixo da lista, "Este menu é só seu." e o botão "Voltar ao do workspace", que apaga a versão pessoal. | "Voltar ao do workspace" devolve a ordem publicada, e o aviso some. | Essencial | Obrigatório |
| RF019 | "Descartar" deve devolver o menu ao estado de antes do rascunho e apagar as bolinhas. | Mover 2 linhas e descartar: a ordem volta. | Essencial | Obrigatório |
| RF020 | Com a barra recolhida e o rascunho aberto, a trilha deve mostrar o ícone de salvar com a bolinha amarela, que abre o painel. | Recolher com o rascunho aberto: o ícone aparece na trilha. | Importante | Desejável |

## Na janela Personalizar (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF021 | Com o épico Personalizar o meu menu no ar, a aba "Seções e menus" da janela "Personalizar" deve listar também, em "Nas áreas da trilha", as seções do workspace com os menus e os submenus; Integrações aparece com cadeado, e "+", "Adicionar menu" e o "⋯" de cada menu só aparecem para quem cumpre a RN901. | Membro com licença Basic: as seções das áreas aparecem sem "+" e sem "⋯". | Importante | Desejável |
| RF022 | Com o épico Personalizar o meu menu no ar, o "Salvar" do pé da janela deve perguntar "Salvar para todos" ou "Salvar só para mim"; quem não cumpre a RN901 tem só "Salvar só para mim". | Membro com licença Basic: o pé mostra "Salvar só para mim". | Importante | Desejável |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver | Relevância |
|---|---|---|---|
| RI001 | Ler o menu do workspace | Deve devolver a árvore publicada, em 3 níveis, já filtrada pelos grupos de cada seção, menu e submenu (RN004), e a versão pessoal da pessoa, se existir. Rota <a definir>. | Obrigatório |
| RI002 | Salvar para todos | Deve receber a árvore do rascunho e recusar quem não cumpre a RN901. Rota <a definir>. | Obrigatório |
| RI003 | Salvar só para mim e voltar ao do workspace | Deve gravar e apagar a versão pessoal da pessoa. Rota <a definir>. | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P001 | O rascunho fica guardado no servidor (sobrevive ao recarregar e passa para outro navegador) ou só no navegador até salvar? | produto | RI002 ganha a rota de rascunho. |
| P002 | No modelo da trilha, para onde vai o menu tirado da seção com "Tirar da seção"? No protótipo, o menu sai da seção e não aparece em outro lugar. | produto | Um RF com o destino do menu. |
