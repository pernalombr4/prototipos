# Requisitos: tela de workspaces, parte 7, criar workspace (passo 1)

**Objetivo:** a pessoa cria um workspace decidindo 1 coisa por vez: só o nome é obrigatório, o ícone deixa de ser
obrigatório, e o logo da empresa entra por upload.

**Onde vale:** o modal "Criar workspace", aberto pelo botão "Criar workspace" da tela `/workspaces` (RF004) e pelo
botão "Criar um workspace" do estado sem workspace (RF043).

**Referência visual:** https://pernalombr4.github.io/prototipos/tela-de-workspaces, aprovado em 14/10/2026 e
revisado até 20/10/2026. No protótipo, o modal abre pelo botão "Criar workspace" do cabeçalho.

**Convenção:** "deve" é obrigatório. Cada requisito tem um critério de aceite que se confere na tela. Os textos
entre aspas são os da interface em português; os de inglês e espanhol estão no `textos.ts` da pasta do protótipo.
{chaves} são valores variáveis.

**Relevância:** Obrigatório, o dev faz. Desejável, o dev faz; se achar melhor não fazer, conversa com produtos antes.
Opcional, o dev pode não fazer quando o esforço é grande para o ganho.

**Épico:** [epico.md](epico.md). Não depende de outra parte; segue a RN901.

**Fora do escopo:** o passo 2, a Central de casos de uso (parte 8).

## Resumo

| Grupo | O que muda em relação ao develop de 16/09/2026 | Requisitos |
|---|---|---|
| Estrutura e passo 1 | 1 decisão por vez; só o nome é obrigatório; descrição e referência à vista | RF601 a RF612 |
| Identidade | O ícone deixa de ser obrigatório; iniciais por padrão, ícone com busca e logo por upload | RF613 a RF621 |
| Dados | O campo `icon` guarda o ícone ou o logo | RI601 |

## Estrutura e passo 1 (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF601 | A criação deve abrir num modal sobre a tela de workspaces, sem mudar a URL. | A URL não muda ao abrir. | Essencial | Obrigatório |
| RF602 | No passo 1, o modal deve ter 56rem de largura e a prévia ao vivo à direita, com 20rem; em tela estreita, a prévia sai. | Digitar o nome atualiza a prévia; a 375px, a prévia não aparece. | Importante | Obrigatório |
| RF603 | O topo do modal deve ter 2 barras de progresso na cor primária e "1 de 2" ou "2 de 2". | No passo 2, as 2 barras estão preenchidas. | Importante | Obrigatório |
| RF604 | A troca de passo deve deslizar para o lado. | "Continuar →" desliza o passo 2 para dentro. | Desejável | Opcional |
| RF605 | O passo 1 deve ter o título "Como esse workspace se chama?" e o texto "É o nome que a sua equipe vai procurar na lista. Pode ser alterado depois." | O passo 1 mostra o título e o texto. | Importante | Obrigatório |
| RF606 | A identidade e o nome devem ficar na mesma linha, sob o rótulo "Nome" com o `*` vermelho de obrigatório: o quadrado clicável de 44px (lápis no hover) e o campo grande do nome, com foco ao abrir e o placeholder "Jurídico Aurora, Vértice Log, RH…". | O `*` vermelho aparece só no Nome. | Essencial | Obrigatório |
| RF607 | O nome deve ter a ajuda "De 3 a 50 caracteres."; com 1 ou 2 caracteres, a ajuda vira "Pelo menos 3 caracteres." em vermelho. | Com "Ju", aparece o aviso vermelho. | Essencial | Obrigatório |
| RF608 | "Descrição" deve ficar à vista, sem `*`, com a ajuda "Uma frase dizendo para que serve. {n}/140", o placeholder "Ex.: Chamados, RH e jurídico do Grupo Aurora" e no máximo 140 caracteres. | O campo aparece sem clicar em nada; o contador vai de 0/140 a 140/140. | Importante | Obrigatório |
| RF609 | "Referência" deve ficar à vista, sem `*`, em fonte monoespaçada, com o placeholder "grupo-aurora" e a ajuda "Gerada a partir do nome. Aceita apenas letras minúsculas, números e hífens." | O campo aparece sem clicar em nada. | Essencial | Obrigatório |
| RF610 | Logo abaixo da Referência, o modal deve mostrar um callout informativo suave, com ícone de cadeado, "Endereço do workspace: enspace.io/{referência}" e "Após a criação do workspace, a referência e o endereço não podem ser alterados. O nome pode ser alterado a qualquer momento." | Com "Jurídico Aurora", o callout mostra `enspace.io/juridico-aurora` e muda a cada tecla na Referência. | Essencial | Obrigatório |
| RF611 | A referência deve vir do nome (minúsculas, sem acento, só letras, números, espaço e hífen, espaços viram hífen, até 50 caracteres) e acompanhar o nome até a pessoa editar o campo Referência. | Editar a Referência e depois mudar o nome mantém a referência editada. | Essencial | Obrigatório |
| RF612 | O passo 1 deve ter "Cancelar" e "Continuar →", ativo só com 3 caracteres ou mais no nome, sem contar espaços nas pontas. | "  ab  " não libera o "Continuar". | Essencial | Obrigatório |

## Identidade (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF613 | O quadrado deve abrir uma janela de 22rem com "Cor" primeiro: 5 amostras redondas (fúcsia, ciano, roxo, verde-azulado e `space`), com a sugerida pelo nome (RN901) marcada, e a cor vale para os 3 modos. | Trocar a cor muda as iniciais, o ícone e a prévia. | Importante | Obrigatório |
| RF614 | A janela deve ter 3 modos num seletor: "Iniciais" (padrão), "Ícone" e "Imagem". | A janela abre em Iniciais. | Essencial | Obrigatório |
| RF615 | No modo Iniciais, as iniciais devem contar só palavras com mais de 1 letra: com 1 palavra, as 2 primeiras letras; com mais, a 1ª letra das 2 primeiras palavras; com o nome vazio, "W". Os textos são "As iniciais do nome, na cor escolhida." e "É o que a maioria dos workspaces usa. Não precisa escolher nada." | "Jurídico Aurora" vira "JA"; "Financeiro" vira "FI". | Essencial | Obrigatório |
| RF616 | No modo Ícone sem busca, a janela deve mostrar "Mais usados": 48 ícones em 8 colunas, do que o ENSPACE atende (empresa, pessoas, chamados, jurídico, finanças, operação, tecnologia e saúde). | Os 48 cabem sem rolar. | Importante | Obrigatório |
| RF617 | A busca de ícones deve ser em português, por significado, sem acento, com o placeholder "Buscar em {total} ícones: balança, caminhão…" e um x para limpar. | "balanca" acha a balança. | Desejável | Desejável |
| RF618 | Com busca, a biblioteca de ícones deve aparecer inteira numa grade virtualizada (264px de altura, células de 44px), com "{achados} de {total}" embaixo e volta ao topo a cada busca. Sem resultado: "Nada para "{termo}"" e "Tente outra palavra, ou envie o logo da empresa na aba Imagem." | Rolar a biblioteca inteira não trava a tela. | Desejável | Desejável |
| RF619 | Sem ícone escolhido, deve valer o ícone sugerido pelo nome ("jurídico": balança; "rh": pessoas; "logística": caminhão; nos demais nomes, prédio). O escolhido fica com borda e fundo primários, e cada ícone tem tooltip com o nome. | "RH Aurora" no modo Ícone mostra o ícone de pessoas. | Importante | Obrigatório |
| RF620 | No modo Imagem, a janela deve mostrar a área tracejada "Arraste o logo aqui" e "ou clique para escolher · PNG, JPG ou SVG", que aceita arrastar e clicar, só com imagem. Com imagem: miniatura, nome do arquivo, "Trocar" e "Remover". A imagem tem prioridade sobre o ícone e as iniciais. | Arrastar um PNG mostra o logo no quadrado e na prévia. | Essencial | Obrigatório |
| RF621 | A tela deve mostrar o ícone escolhido pela figura, sem o id técnico. | Depois de escolher, não aparece texto como `carbon:scales`. | Importante | Obrigatório |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver | Relevância |
|---|---|---|---|
| RI601 | Campo `icon` do `Workspace` | Deve guardar o ícone escolhido ou a URL do logo enviado. | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P601 | Se a parte 7 sair antes da parte 8, o modal tem 1 passo só, com o botão de criar no lugar de "Continuar →" e sem as barras de progresso? | produto (P901) | Muda RF603, RF604 e RF612 nesta parte |
