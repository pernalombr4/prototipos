# Requisitos: tela de workspaces, parte 1, escolher e entrar

**Objetivo:** a pessoa entende que esta tela só escolhe onde entrar e entra no workspace dela em 1 clique, pela busca,
pelo card ou pela lista, e não confunde "Criar workspace" com abrir chamado. Esta parte usa só o que a API já tem.

**Onde vale:** a tela `/workspaces`, primeira depois do login.

**Referência visual:** https://pernalombr4.github.io/prototipos/tela-de-workspaces, aprovado em 14/10/2026 e
revisado até 20/10/2026.

**Convenção:** "deve" é obrigatório. Cada requisito tem um critério de aceite que se confere na tela. Os textos
entre aspas são os da interface em português; os de inglês e espanhol estão no `textos.ts` da pasta do protótipo.
{chaves} são valores variáveis.

**Relevância:** Obrigatório, o dev faz. Desejável, o dev faz; se achar melhor não fazer, conversa com produtos antes.
Opcional, o dev pode não fazer quando o esforço é grande para o ganho.

**Épico:** [epico.md](epico.md). As regras comuns (RN901 a RN904) e os requisitos da tela inteira (RNF901 a RNF904,
RS901 a RS905) estão lá.

**Fora do escopo:** a barra do topo (ENSPACE, Suporte, avatar); o menu "⋯" (parte 2); as abas "Favoritos" e
"Recentes", a estrela, o último acesso e o bloco do topo (parte 3); o workspace padrão (parte 4); os ocultos (parte
5); agrupar e etiquetas (parte 6); o modal "Criar workspace" (partes 7 e 8).

## Resumo

| Grupo | O que muda em relação ao develop de 16/09/2026 | Requisitos |
|---|---|---|
| Cabeçalho | A tela ganha título e explicação; hoje não tem `h1`. "Criar workspace" fica no topo, sem cor cheia | RF001 a RF005 |
| Busca | Atalho de teclado, busca sem acento; os resultados sobem para logo abaixo do campo | RF006 a RF015 |
| Convite pendente | Hoje é um card apagado, sem ação visível. Passa a ter aviso no topo e card com Aceitar e Recusar | RF016 a RF021 |
| Barra da lista | Aba "Todos" com contagem, Ordenar e o alternador cards ou lista | RF022 a RF026 |
| Card | O card inteiro vira o alvo de Entrar; some o "Sem descrição" | RF027 a RF035 |
| Visualização em lista | Alternativa ao card, com o `EnTable` do produto | RS001, RF036 a RF041 |
| Estados | Carregando, nenhum workspace e erro | RF042 a RF044 |
| Dados | O que a tela lê da API, que já existe | RI001 a RI003 |

## Cabeçalho (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF001 | O cabeçalho deve saudar a pessoa pelo primeiro nome: "Olá, {primeiro nome}". | Com o usuário "Mariana Duarte", aparece "Olá, Mariana". | Importante | Obrigatório |
| RF002 | A tela deve ter o título `h1` "Escolha um workspace para entrar". | O leitor de tela anuncia o título como cabeçalho de nível 1. | Essencial | Obrigatório |
| RF003 | Abaixo do título, a tela deve mostrar a explicação "Workspace é o espaço da sua empresa no ENSPACE. É **dentro** de um deles que o seu trabalho acontece.", com "dentro" em negrito. | O texto aparece inteiro, com só "dentro" em negrito. | Essencial | Obrigatório |
| RF004 | O botão "Criar workspace" deve ficar no canto superior direito, como hoje, com borda, cor neutra e ícone `+`. | O botão "Criar workspace" não tem cor cheia. | Essencial | Obrigatório |
| RF005 | O botão "Criar workspace" deve ter o tooltip "Cria um workspace vazio, só com você dentro." | Passar o mouse no botão mostra o tooltip. | Desejável | Desejável |

## Busca (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF006 | A busca deve ficar abaixo da explicação, em tamanho grande, com largura máxima de 28rem e o placeholder "Buscar entre seus {n} workspaces", em que {n} é o número da aba "Todos". | Com 17 na aba "Todos", o placeholder diz "Buscar entre seus 17 workspaces". | Essencial | Obrigatório |
| RF007 | Com menos de 2 workspaces, e nos estados Carregando e Erro, a tela deve esconder a busca. | No estado "Nenhum workspace", não há campo de busca. | Importante | Obrigatório |
| RF008 | Com texto no campo, o fim do campo deve mostrar um botão de limpar com o nome acessível "Limpar busca". | Digitar uma letra mostra o botão de limpar. | Importante | Obrigatório |
| RF009 | Com o campo vazio, o fim do campo deve mostrar a tecla `/`. | Apagar o texto troca o botão de limpar pela tecla `/`. | Desejável | Desejável |
| RF010 | Com a página em cada posição de rolagem, as teclas `/` e `Ctrl+K` (`⌘K` no Mac) devem pôr o foco na busca e rolar a página até o topo. | Com a página rolada até o fim, `/` leva ao topo com o cursor no campo. | Desejável | Desejável |
| RF011 | Na busca, Enter deve entrar no primeiro resultado que não seja convite. | Buscar "vertice" e apertar Enter entra em Vértice Log. | Desejável | Desejável |
| RF012 | Na busca, Esc deve limpar o texto. | Apertar Esc esvazia o campo e a lista volta inteira. | Desejável | Desejável |
| RF013 | Com texto no campo, a dica "Enter entra no primeiro resultado. Esc limpa a busca." deve aparecer abaixo do campo. | Digitar uma letra mostra a dica. | Desejável | Desejável |
| RF014 | A busca deve ignorar acento e maiúscula e procurar em nome, `reference` e descrição. | "saude" acha "Aurora Saúde Homologação". | Essencial | Obrigatório |
| RF015 | Sem resultado, a tela deve mostrar "Nenhum workspace com "{termo}"" e "Confira o nome. Se ainda não achar, peça acesso a quem administra o ENSPACE na sua empresa." | Buscar "xyz" mostra as 2 frases. | Essencial | Obrigatório |

## Convite pendente (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF016 | Cada convite pendente deve aparecer no topo como aviso na cor secundária, com ícone de envelope aberto, os textos "{quem} convidou você para {workspace}" e "Aceite para entrar neste workspace." e os botões "Aceitar convite" (cor cheia) e "Recusar". | O convite de Lumen Contábil mostra "Rodrigo Petrone convidou você para Lumen Contábil". | Essencial | Obrigatório |
| RF017 | O convite deve aparecer também como card na lista, com borda tracejada, o selo "Convite pendente", "{quem} convidou você" e o rodapé "Aceite para entrar", "Aceitar" e "Recusar". | O card fica na lista com o aviso no topo. | Essencial | Obrigatório |
| RF018 | O card de convite deve responder só aos botões "Aceitar" e "Recusar", sem estrela e sem "⋯". | Clicar no corpo do card de convite não faz nada. | Essencial | Obrigatório |
| RF019 | "Aceitar" deve transformar o convite em card comum e mostrar o toast "Convite de {nome} aceito". | Depois de aceitar, o card ganha "Entrar →", e clicar nele entra no workspace. | Essencial | Obrigatório |
| RF020 | "Recusar" deve tirar o workspace da tela e mostrar o toast "Convite de {nome} recusado". | O aviso e o card somem; a aba "Todos" conta 1 a menos. | Essencial | Obrigatório |
| RF021 | Enquanto houver texto na busca, os avisos de convite do topo devem sumir. | Digitar "rh" esconde o aviso de Lumen Contábil. | Importante | Obrigatório |

## Barra da lista (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF022 | A barra deve ter as abas à esquerda e, à direita, Ordenar e o alternador de visualização. As partes 5 e 6 acrescentam "Visibilidade" e "Agrupar" na mesma barra. | Ordenar e o alternador ficam na mesma linha das abas no desktop. | Essencial | Obrigatório |
| RF023 | Em tela de 375px de largura, a barra deve empilhar e quebrar linha. | A 375px de largura, cada botão da barra fica dentro da tela. | Importante | Obrigatório |
| RF024 | A aba "Todos ({n})" deve contar os workspaces da pessoa, com os convites e sem os ocultos (RN903), sem o filtro da busca. | A contagem bate com os cards que a aba mostra sem busca. | Essencial | Obrigatório |
| RF025 | Ordenar deve ser um menu suspenso com ícone de setas, com o rótulo "Ordenar: {critério curto}", borda no critério padrão e fundo nos outros. O menu tem o título "Ordenar por" e os critérios da tabela abaixo, em blocos. | Escolher "Criados por último" faz o botão dizer "Ordenar: Mais novos". | Essencial | Obrigatório |
| RF026 | O alternador deve ter 2 botões de ícone, "Ver em cards" (padrão) e "Ver em lista", com o ativo na cor primária suave. | A tela abre em cards. | Importante | Obrigatório |

**Critérios de ordenação desta parte (RF025).** A parte 3 acrescenta o bloco de acesso (RF207).

| Opção no menu | No botão | Regra |
|---|---|---|
| Criados por último | Mais novos | `created_at` mais recente primeiro |
| Criados primeiro | Mais antigos | `created_at` mais antigo primeiro |
| Nome, de A a Z | Nome | ordem alfabética (pt-BR) |

## Card (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF027 | A grade deve ter 3 colunas no desktop, 2 no tablet e 1 no celular, com 16px entre os cards. | A 375px, os cards ficam um embaixo do outro. | Importante | Obrigatório |
| RF028 | O card inteiro deve ser o alvo de Entrar: o nome é um link estendido sobre o card, e os controles do card (estrela e "⋯", das partes 2 e 3) ficam acima do link. | Clicar no card entra; clique do meio abre em nova aba; Tab para no card 1 vez, com anel de foco. | Essencial | Obrigatório |
| RF029 | O topo do card deve ter, à esquerda, o ícone num quadrado de 40px na cor de identidade e, à direita, o selo da licença, seguido da estrela (parte 3) e do "⋯" (parte 2), na mesma linha. | O ícone e o selo ficam na mesma linha. | Importante | Obrigatório |
| RF030 | O quadrado do ícone deve usar a cor de identidade da `reference` (RN901), com fundo a 10% e ícone no tom 600 (400 no tema escuro; `space` no tom 300). | O mesmo workspace tem a mesma cor em cada visita; nenhuma cor é vermelho, verde de sucesso ou amarelo de alerta. | Importante | Obrigatório |
| RF031 | O selo da licença deve ser suave: "Proprietário" em primária, "Full" em secundária, "Membro" e "Leitor" em neutro. | Cada licença tem a cor da regra. | Importante | Obrigatório |
| RF032 | O corpo do card deve ter altura mínima de 64px, nome em até 2 linhas e descrição em até 2 linhas; sem descrição, a linha da descrição fica de fora. | Um workspace sem descrição não mostra "Sem descrição". | Importante | Obrigatório |
| RF033 | À direita do rodapé, o card deve mostrar "Entrar →" em cinza. | Cada card que não é convite mostra "Entrar →". | Essencial | Obrigatório |
| RF034 | Ao clicar no card, "Entrar →" deve virar "Entrando…" com um ícone girando. | Clicar no card mostra o carregamento antes de entrar. | Importante | Obrigatório |
| RF035 | No hover e no foco, o card deve subir 4px, ganhar sombra e borda primária, com "Entrar →" em cor primária e a seta andando 4px. | O foco por teclado produz o efeito do hover. | Desejável | Desejável |

## Visualização em lista (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF036 | A lista deve ter as colunas "Workspace", "Descrição", "Licença" e a de ações, sem título. As partes 3 e 6 acrescentam "Último acesso" e "Etiquetas". | A lista mostra as 4 colunas, nessa ordem. | Importante | Obrigatório |
| RF037 | A coluna Workspace deve ter o ícone em 32px, o nome com reticências na 1ª linha e, na 2ª linha, só o selo "Convite pendente", com largura mínima de 11rem. | Um nome longo termina em reticências. | Importante | Obrigatório |
| RF038 | A coluna Descrição deve mostrar a descrição; sem descrição, "{n} pessoas"; no convite, "{quem} convidou você". | Nenhuma célula da coluna fica vazia. | Importante | Obrigatório |
| RF039 | A coluna de ações deve mostrar "Aceitar" e "Recusar" na linha de convite, sem botão "Entrar" nas outras linhas. | A linha comum não tem botão "Entrar". | Importante | Obrigatório |
| RF040 | Clicar numa linha que não é convite deve entrar no workspace. | Clicar na linha de Vértice Log entra; clicar na linha de convite não entra. | Essencial | Obrigatório |
| RF041 | Enquanto entra, a linha deve mostrar um ícone girando na coluna de ações. | Clicar na linha mostra o ícone antes de entrar. | Importante | Obrigatório |

## Estados (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF042 | No carregamento, a tela deve mostrar um esqueleto com 6 cards de 144px na grade. | O esqueleto tem o formato do card. | Importante | Obrigatório |
| RF043 | Sem workspace, a tela deve mostrar o ícone de porta fechada, "Você ainda não faz parte de nenhum workspace", "Quem administra o ENSPACE na sua empresa precisa convidar você. Se recebeu um convite por e-mail, abra o link que veio nele." e o botão de cor cheia "Criar um workspace". | Aqui "Criar um workspace" tem cor cheia porque é a única saída. | Essencial | Obrigatório |
| RF044 | Se a lista não carregar, a tela deve mostrar o aviso vermelho com ícone de alerta, "Não foi possível carregar seus workspaces", "A conexão falhou. Seus workspaces continuam lá. É só tentar de novo." e o botão "Tentar de novo", que recarrega a lista. | "Tentar de novo" mostra o carregamento e recarrega. | Essencial | Obrigatório |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver | Relevância |
|---|---|---|---|
| RI001 | Listagem dos workspaces da pessoa (rota de hoje) | Deve devolver de cada `Workspace`: `id`, `name`, `reference`, `description`, `icon`, `members_count` e `created_at`. | Obrigatório |
| RI002 | Licença da pessoa em cada workspace | Deve vir do `type` do membro: `owner` (Proprietário), `full` (Full), `standard` (Membro) e `viewer` (Leitor), e não do papel (`role`). | Obrigatório |
| RI003 | Convite pendente | Deve trazer o nome de quem convidou. | Obrigatório |

## Não funcionais e restrições (RNF, RS)

| ID | Requisito | Como medir ou conferir | Prioridade | Relevância |
|---|---|---|---|---|
| RS001 | A visualização em lista deve usar o `EnTable` do `@be-enlighten/enspace-sdk-ui`. Imposta por: spec dos protótipos, Parte 2. | A lista é um `EnTable`. | Importante | Obrigatório |

## Em aberto

| ID | Pergunta ou suposição | A quem perguntar ou o que confirma | O que muda conforme a resposta |
|---|---|---|---|
| P001 | Se a parte 1 sair antes da parte 3, a tela com 1 workspace só mostra o card sozinho, sem busca e sem barra? O estado "Seu workspace" (RF218) usa o bloco do topo, que é da parte 3. | produto (P901) | Ganha 1 requisito para o estado "Só um workspace" nesta parte |
| P002 | Se a parte 1 sair antes da parte 3, qual é a ordem padrão: "Criados por último" ou "Nome, de A a Z"? O padrão do protótipo, "Acessados por último", é da parte 3. | produto (P901) | Muda o critério padrão de RF025 |
| P003 | Se a parte 1 sair antes da parte 3, a barra mostra a aba "Todos" sozinha ou esconde as abas? | produto (P901) | Muda RF022 e RF024 |
| P004 | A API de hoje já traz o nome de quem convidou (RI003)? | dev do back-end | Se não traz, RI003 é obra nova nesta parte |
