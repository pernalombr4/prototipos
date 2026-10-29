# 9. Criar workspace, passo 1

**Objetivo:** a pessoa cria um workspace decidindo 1 coisa por vez: só o nome é obrigatório, o ícone deixa de ser
obrigatório, e o logo da empresa entra por upload.

**Onde vale:** o modal "Criar workspace", aberto pelo botão "Criar workspace" da tela `/workspaces` e pelo botão "Criar
um workspace" da tela sem workspace.

**Protótipo:** https://pernalombr4.github.io/prototipos/tela-de-workspaces. No protótipo, o modal abre pelo botão
"Criar workspace" do cabeçalho.

## Estrutura e passo 1 (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF601 | A criação deve abrir num modal sobre a tela de workspaces, sem mudar a URL. | A URL não muda ao abrir. | Essencial | Obrigatório |
| RF602 | No passo 1, o modal deve mostrar à direita a prévia do workspace, que muda a cada tecla; no celular, a prévia sai. | Digitar o nome atualiza a prévia. | Importante | Obrigatório |
| RF603 | O topo do modal deve mostrar o progresso "1 de 2" ou "2 de 2". | No passo 2, o progresso diz "2 de 2". | Importante | Obrigatório |
| RF605 | O passo 1 deve ter o título "Como esse workspace se chama?". | O passo 1 mostra o título. | Importante | Obrigatório |
| RF606 | O quadrado da identidade e o campo do nome devem ficar na mesma linha, sob o rótulo "Nome", o único obrigatório, com o foco no nome ao abrir. | O `*` de obrigatório aparece só no Nome. | Essencial | Obrigatório |
| RF607 | O nome deve ter de 3 a 50 caracteres; com 1 ou 2, a ajuda vira "Pelo menos 3 caracteres.", em vermelho. | Com "Ju", aparece o aviso vermelho. | Essencial | Obrigatório |
| RF608 | "Descrição" deve ficar à vista, opcional, com até 140 caracteres e contador. | O contador vai de 0/140 a 140/140. | Importante | Obrigatório |
| RF609 | "Referência" deve ficar à vista, opcional, e aceitar só letras minúsculas, números e hífens. | O campo aparece sem clicar em nada. | Essencial | Obrigatório |
| RF610 | Abaixo da Referência, o modal deve mostrar o endereço "enspace.io/{referência}" e o aviso de que a referência e o endereço não mudam depois de criado o workspace, e o nome muda. | Com "Jurídico Aurora", o endereço mostra `enspace.io/juridico-aurora` e muda a cada tecla na Referência. | Essencial | Obrigatório |
| RF611 | A referência deve vir do nome (minúsculas, sem acento, só letras, números e hífen, espaço vira hífen, até 50 caracteres) e acompanhar o nome até a pessoa editar o campo Referência. | Editar a Referência e depois mudar o nome mantém a referência editada. | Essencial | Obrigatório |
| RF612 | O passo 1 deve ter "Cancelar" e "Continuar →", ativo só com 3 caracteres ou mais no nome, sem contar espaços nas pontas. | "  ab  " não libera o "Continuar". | Essencial | Obrigatório |

## Identidade (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF613 | O quadrado da identidade deve abrir uma janela com as 5 cores de identidade, com a sugerida pelo nome marcada (RN901); a cor vale para os 3 modos. | Trocar a cor muda as iniciais, o ícone e a prévia. | Importante | Obrigatório |
| RF614 | A janela deve ter 3 modos: "Iniciais" (padrão), "Ícone" e "Imagem". | A janela abre em Iniciais. | Essencial | Obrigatório |
| RF615 | No modo Iniciais, as iniciais devem contar só palavras com mais de 1 letra: com 1 palavra, as 2 primeiras letras; com mais, a 1ª letra das 2 primeiras palavras; com o nome vazio, "W". | "Jurídico Aurora" vira "JA"; "Financeiro" vira "FI". | Essencial | Obrigatório |
| RF616 | No modo Ícone sem busca, a janela deve mostrar "Mais usados": 48 ícones do que o ENSPACE atende (empresa, pessoas, chamados, jurídico, finanças, operação, tecnologia e saúde). | Os 48 cabem sem rolar. | Importante | Obrigatório |
| RF617 | A busca de ícones deve ser em português, por significado, sem acento. | "balanca" acha a balança. | Desejável | Desejável |
| RF618 | Com busca, a biblioteca de ícones inteira deve aparecer numa grade virtualizada, com "{achados} de {total}" embaixo. | Rolar a biblioteca inteira não trava a tela. | Desejável | Desejável |
| RF619 | Sem ícone escolhido, deve valer o ícone sugerido pelo nome ("jurídico": balança; "rh": pessoas; "logística": caminhão; nos demais nomes, prédio). | "RH Aurora" no modo Ícone mostra o ícone de pessoas. | Importante | Obrigatório |
| RF620 | No modo Imagem, a janela deve aceitar o logo em PNG, JPG ou SVG, por arrastar ou clicar, com "Trocar" e "Remover"; a imagem vale sobre o ícone e as iniciais. | Arrastar um PNG mostra o logo no quadrado e na prévia. | Essencial | Obrigatório |
| RF621 | A tela deve mostrar o ícone escolhido pela figura, sem o id técnico. | Depois de escolher, não aparece texto como `carbon:scales`. | Importante | Obrigatório |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver | Relevância |
|---|---|---|---|
| RI601 | Campo `icon` do `Workspace` | Deve guardar o ícone escolhido ou a URL do logo enviado. | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P601 | Se esta parte sair antes de "10. Criar com caso de uso", o modal tem 1 passo só, com o botão de criar no lugar de "Continuar →" e sem o progresso? | produto | Muda RF603 e RF612 |
