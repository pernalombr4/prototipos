# 1. Pedir ao BENI e aceitar a proposta

**Objetivo:** quem escreve no campo abre a caixa do BENI pelo botão "IA", pede o que precisa sobre o trecho ou o
cursor, vê a proposta dentro do texto e decide se aceita. Nada grava antes do "Aceitar".

**Onde vale:** o campo Editor de texto HTML: a barra fixa, a barra da seleção, a caixa do BENI e a proposta no texto.

**Protótipo:** https://pernalombr4.github.io/prototipos/ia-no-campo-html/, campo "Parecer do jurídico".

## Regras de negócio (RN)

| ID | Regra | Exemplo | Relevância |
|---|---|---|---|
| RN004 | O conteúdo do campo só muda quando a pessoa aceita a proposta. | Descartar, fechar a caixa ou recarregar a tela deixam o campo como estava. | Obrigatório |

## Entradas da IA (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF001 | A barra fixa do campo deve ter o botão "IA" na 1ª posição, com a dica "Escrever com o BENI" e o atalho Ctrl J. | O botão aparece antes de desfazer, em cada campo Editor de texto HTML da tela. | Essencial | Obrigatório |
| RF002 | Quando a pessoa clica em "IA" na barra fixa, o sistema deve abrir a caixa do BENI logo abaixo do trecho selecionado ou da linha do cursor. | Exemplo: cursor no fim do 1º parágrafo do "Parecer do jurídico"; a caixa abre logo abaixo dele. | Essencial | Obrigatório |
| RF004 | Quando a pessoa seleciona texto no campo, o sistema deve mostrar a barra da seleção com o botão "IA" na 1ª posição. | Selecionar 1 frase mostra a barra flutuante com "IA" à esquerda. | Essencial | Obrigatório |

## Caixa do BENI (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF008 | A caixa deve abrir com o foco no campo de pedido livre, com o placeholder "Peça ao BENI ou escolha uma ação..." (sem seleção) ou "Peça ao BENI o que fazer com o trecho..." (com seleção). | Abrir a caixa e digitar escreve direto no campo de pedido. | Essencial | Obrigatório |
| RF009 | Quando a pessoa digita no campo de pedido, a caixa deve mostrar o texto digitado como 1º item, com o rótulo "Seu pedido", e filtrar as ações pelo texto. | Exemplo: "resum" mostra "Seu pedido" e as ações de resumir; Enter envia o pedido livre. | Essencial | Obrigatório |
| RF011 | Com texto selecionado, a caixa deve mostrar o grupo "Editar o trecho", nesta ordem: "Revisar ortografia e gramática", "Melhorar a escrita", "Encurtar", "Expandir", "Simplificar", "Explicar", "Transformar em lista", "Mudar o tom ›", "Traduzir ›" e "Resumir". | Selecionar 1 frase e abrir a caixa mostra as 10 ações na ordem. | Essencial | Obrigatório |
| RF012 | Os submenus "Mudar o tom" (8 tons) e "Traduzir" (6 idiomas) devem abrir dentro da própria caixa, com o botão de voltar. | Tons: Formal, Profissional, Amigável, Direto, Confiante, Empático, Didático, Persuasivo. Idiomas: Português, Inglês, Espanhol, Francês, Alemão, Italiano. | Importante | Obrigatório |
| RF019 | O rodapé da caixa deve ter o aviso "O BENI pode errar. Confira antes de aceitar." na dica do ícone de informação, e "Esc fecha". | Passar o mouse no ícone mostra o aviso. | Desejável | Desejável |
| RF020 | Quando a pessoa tecla Esc ou clica fora da caixa, o sistema deve fechar a caixa e devolver o foco ao trecho de onde a caixa abriu. | Esc fecha a caixa, e a seleção anterior continua no campo. | Essencial | Obrigatório |

## Proposta no texto (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF024 | Enquanto o BENI gera a resposta, o sistema deve escrever a proposta no campo palavra por palavra, com o botão "Parar". | O texto aparece aos poucos; "Parar" interrompe e mostra "Resposta interrompida.". | Importante | Obrigatório |
| RF025 | Numa ação que substitui o trecho, o sistema deve mostrar o trecho original riscado e o texto novo realçado no lugar, sem gravar no campo (RN004). | Exemplo: "Encurtar" na 1ª frase mostra a frase riscada e a curta realçada logo depois. | Essencial | Obrigatório |
| RF026 | Numa ação que acrescenta texto ("Explicar", "Resumir", "Continuar escrevendo", "Rascunhar com os dados do item"), o sistema deve mostrar o texto novo realçado abaixo do trecho, sem riscar o original. | "Explicar" na 1ª frase mostra a explicação realçada abaixo dela. | Essencial | Obrigatório |
| RF027 | Enquanto a proposta está aberta, o campo deve ficar só leitura. | Digitar no campo com a proposta aberta não muda o texto. | Essencial | Obrigatório |
| RF028 | A barra da proposta deve ter "Aceitar" (Enter), "Descartar" (Esc), "Tentar de novo", "Inserir abaixo" (nas ações que substituem), 👍, 👎 e o campo "Peça um ajuste: mais curto, em lista...". | Cada botão aparece na barra embaixo da proposta. | Essencial | Obrigatório |
| RF029 | Quando a pessoa aceita, o sistema deve gravar a proposta no campo e realçar o texto que entrou por 1,4 s. | Aceitar troca o trecho e o texto novo pisca realçado. | Essencial | Obrigatório |
| RF030 | Quando a pessoa descarta, o sistema deve tirar a proposta e devolver o campo como estava. | Descartar deixa o campo idêntico ao de antes do pedido. | Essencial | Obrigatório |
| RF031 | Quando a pessoa escreve um ajuste e envia, o sistema deve gerar uma proposta nova a partir da anterior. | Exemplo: "em lista" transforma o rascunho em tópicos. | Importante | Obrigatório |
| RF032 | Depois de aceitar, o Ctrl Z do editor deve desfazer a proposta aceita. | Aceitar e teclar Ctrl Z devolve o texto original. | Essencial | Obrigatório |
| RF036 | Se o BENI não responde, o sistema deve mostrar "Sem resposta." e "Nada mudou no campo. Tente de novo em instantes.", com "Tentar de novo" e "Descartar". | No estado "Responde com erro" do protótipo, o pedido mostra a mensagem, e o campo não muda. | Essencial | Obrigatório |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver | Relevância |
|---|---|---|---|
| RI001 | Geração da resposta do BENI (rota <a definir>) | Deve receber a ação (ou o pedido livre), o parâmetro (tom ou idioma) e o texto do trecho ou do campo. | Obrigatório |
| RI006 | Resposta da geração | Deve devolver o texto em HTML em partes, à medida que o modelo gera. | Obrigatório |

## Não funcionais e restrições (RNF, RS)

| ID | Requisito | Como medir ou conferir | Prioridade | Relevância |
|---|---|---|---|---|
| RNF002 | A proposta pronta deve ser anunciada ao leitor de tela com "Proposta pronta. Enter aceita, Esc descarta." numa região `aria-live`. | Com o leitor de tela, gerar uma proposta lê a frase. | Importante | Obrigatório |
| RNF003 | A caixa do BENI deve ter `role="dialog"` com o nome "Caixa do BENI". | Inspecionar a caixa mostra o papel e o nome. | Importante | Obrigatório |
| RS002 | A proposta dentro do texto deve ser feita no TipTap do campo, sem gravar no documento até o Aceitar. Imposta por: a redatora, em 09/10/2026 ("no campo html nós usamos o tiptap"). | No protótipo, `proposta.ts` mostra a proposta por decorações do ProseMirror. | Essencial | Obrigatório |
