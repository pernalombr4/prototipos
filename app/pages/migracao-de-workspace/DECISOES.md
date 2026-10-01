# Decisões: migração de workspace

## A proposta em 1 parágrafo

O botão Importar Workspace continua no mesmo lugar. Em vez de abrir o seletor de arquivos e importar na hora, ele abre uma camada com 2 passos: **Arquivo e opção** (área de arraste e, assim que o arquivo é lido, as 3 opções do que fazer com o que já existe) e **Revisar** (a comparação em árvore). Nada entra no workspace antes do clique em Importar.

## A jornada

```
Importar Workspace
   │
   ▼
[1 Arquivo e opção] ── não é .json ──► erro no próprio passo
   │ lido: resumo do arquivo (de onde veio, quando, quantas categorias)
   │ workspace com conteúdo: aparecem as 3 opções, cada uma com o efeito
   │   Adicionar só o que falta (padrão) · Somar com o que existe · Substituir tudo
   │ workspace vazio: as opções não aparecem
   ▼
[2 Revisar]
   ├ workspace vazio ou nada em comum ──► lista do que entra
   ├ nada muda ──► "já tem tudo", sem botão Importar
   └ há o que comparar ──► contagem + árvore ("Trocar" volta ao passo 1)
   │ Substituir com algo saindo: digitar o e-mail
   ▼
Importando (pode fechar; avisa no sino) ──► falha: "nada foi alterado" + Tentar de novo
   ▼
Importado ──► Desfazer importação · Ver categorias
```

## Rodada 1 · 2026-10-01

- **Pedido (literal):** "ao clicar pra importar, o usuario precisa ter uma area de arraste e poder dizer a escolha dele: é pra sobrescrever tudo o que ta ali pelo novo modelo, é pra somar ou é pra simplesmente adicionar? e fazer a diff em casos em que for necessario, mostrando pra ele a diff, mas nao em codigo, e sim em estrutura"
- **Mudou:**
  - O clique em Importar Workspace abre a camada de 3 passos. Hoje ele importa direto.
  - Área de arraste (`UFileUpload`) só para `.json`, com erro no próprio passo e resumo do arquivo lido.
  - 3 opções em escada. Cada uma faz o que a anterior faz e mais uma coisa:
    - **Adicionar só o que falta:** entra o que o workspace não tem (categoria, campo, formulário, pasta, lista). Nada que existe muda.
    - **Somar com o que existe:** igual ao anterior, e o que existe recebe as mudanças do arquivo (nome, tipo de campo, opções novas). Nada é apagado.
    - **Substituir tudo:** igual ao anterior, e sai o que não está no arquivo, com os itens cadastrados.
  - Cada opção mostra o efeito antes de ser escolhida ("4 categorias entram · 2 mudam · 1 sai") e, no Substituir, quantos itens cadastrados são apagados.
  - A comparação aparece em árvore: categoria › campos, formulários, pastas; e "Outros componentes" (listas, telas, grupos de permissão, modelos de e-mail, relatórios, modelos de documento, itens de menu). Cada nó tem a marca Entra, Muda, Sai ou Fica como está.
  - A mudança se lê em estrutura: "Nome: Vara → Vara ou tribunal", "Tipo: Texto longo → Texto com formatação", "Opções novas: Curitiba, Porto Alegre". O tipo do campo aparece com nome de gente ("Lista de opções", "Valor em dinheiro"), nunca `EnlDropdown`.
  - Na opção Adicionar, o que tem diferença e não muda aparece apagado com "O arquivo traz outra versão. Nesta opção, a versão daqui fica." A pessoa vê o que deixa de levar.
  - "Mostrar só o que muda" vem ligado: o que fica igual sai da árvore.
  - A comparação só aparece quando é necessária. Workspace vazio pula o passo 2 e mostra a lista do que entra. Arquivo sem nada em comum mostra a lista. Arquivo igual ao workspace diz "já tem tudo" e não oferece Importar.
  - Substituir com algo saindo pede o e-mail de quem confirma, o mesmo padrão da exclusão de categoria no produto.
  - "Baixar uma cópia deste workspace antes de importar" vem marcado.
  - Importação com etapas, que pode ser fechada (o produto já importa em segundo plano); falha diz em que etapa parou e que nada mudou; sucesso oferece Desfazer importação.
  - O aviso "Atenção: serão duplicadas" vira "Nada é duplicado", porque nenhuma das 3 opções duplica.
- **Fronteira:** muda o que o botão Importar abre, o texto do cartão Importar e o aviso abaixo do cartão; não muda a casca, o Exportar, o lugar dos botões nem o título e a descrição da tela.
- **Descartado:**
  - Diff lado a lado (antes | depois). Motivo: dobra a largura e obriga a pessoa a achar a diferença sozinha. A árvore já diz o que mudou.
  - Escolher categoria por categoria dentro da revisão. Motivo: a demanda é "simples"; fica como próxima rodada (nenhuma das 10 referências faz, ver PESQUISA.md).
  - Uma 4ª opção "Adicionar tudo como cópia" (o comportamento de hoje). Motivo: é o que gera a duplicação que a tela avisa.
- **Para confirmar com a Mikaela:**
  - "Somar" e "simplesmente adicionar" foram lidos como "atualiza o que existe" e "só entra o que falta". Se "adicionar" quis dizer "entra tudo como novo, mesmo repetido", a opção é outra.
  - A chave que reconhece "a mesma coisa": o protótipo usa `slug` na categoria, `refId` no campo e o nome no formulário e na pasta. O arquivo também tem `migration_hash`. Quem decide é o back-end.
  - Desfazer importação e "nada foi alterado" na falha pressupõem importação tudo ou nada no back-end. Hoje não sei se é assim.
- **Maquete:**
  - Qualquer `.json` arrastado vira o arquivo de exemplo. O protótipo não lê o conteúdo.
  - O botão tracejado "Protótipo: usar arquivo de exemplo" é andaime.
  - Exportar só mostra o aviso; não baixa nada. A cópia de antes da importação também não baixa.
  - "Ver categorias" fecha a camada. Desfazer só troca a mensagem.
  - O logo EN é texto.
  - Andaime: cenário do workspace (com conteúdo, vazio, já igual ao arquivo) e final da importação (termina bem, falha no meio).
- **Não deu:**
  - Print das referências: a pesquisa foi feita por leitura de documentação, sem navegador, porque o Chrome estava em uso na exploração do develop.
  - Print do "Substituir tudo" com a confirmação, da importação em andamento e do fim: a aba do navegador ficou oculta e a captura passou a esgotar o tempo. Os estados funcionam; faltam só os prints.
  - `design:design-critique`, `design:accessibility-review` e `design:ux-copy` não rodaram nesta rodada: o pedido era um protótipo simples. A autocrítica abaixo é minha, sem as skills.
- **Crítica e acessibilidade:**
  - As marcas Entra, Muda e Sai usam cor e também ícone (+, lápis, −) e texto. Não dependem só da cor.
  - O nó removido usa risco no texto, além da marca "Sai".
  - O campo de e-mail tem `aria-label`; o botão Substituir fica desabilitado até o e-mail conferir.
  - A contagem do topo soma categorias e outros componentes, sem os campos. Com o filtro desligado, a árvore mostra mais coisas que a contagem. Ficou assim para a contagem falar do que a pessoa reconhece.
  - CSS próprio: nenhum. As mudanças de aparência são pela prop `ui` do `UTree`, `URadioGroup`, `UStepper` e `UModal`, consultadas no MCP `nuxt-ui` (`get-component-metadata` de FileUpload, RadioGroup, Tree e Stepper) e no tema gerado em `.nuxt/ui/`.
- **Ver:** `http://localhost:3000/migracao-de-workspace` · `evidencias/proposta-1-tela.jpg`, `proposta-2-arraste.jpg`, `proposta-2b-arquivo-lido.jpg`, `proposta-3-o-que-fazer.jpg`, `proposta-4-revisar-somar.jpg`

## Rodada 2 · 2026-10-01
- **Pedido (literal):** "nao precisa de uma jornada de 3 steps. pode se só 2. coloca o arquivo e seleciona o que fazer, depois tem a revisão. faz sentido? ou acha que sua ideia é melhor?"
- **Mudou:**
  - Os passos "Arquivo" e "O que fazer" viraram 1 só: "Arquivo e opção".
  - As 3 opções aparecem embaixo do arquivo, com entrada suave, assim que ele é lido. Antes disso não aparecem, porque o efeito de cada uma ("4 categorias entram · 1 sai") é calculado sobre o arquivo.
  - Com o workspace vazio, o passo se chama só "Arquivo" e as opções não aparecem.
  - "Trocar", na revisão, volta ao passo 1, onde estão as opções.
  - Os rótulos da árvore "Outros componentes" saíam centralizados. Agora alinham à esquerda (`text-start` na prop `ui` do `UTree`).
- **Fronteira:** muda a divisão dos passos da camada; não muda o conteúdo de cada um, a tela de Casos de Uso nem a casca.
- **Descartado:** a versão de 3 passos. Motivo: o passo "O que fazer" só existia para mostrar o efeito depois do arquivo lido, e isso cabe no mesmo passo. A pessoa ganha 1 clique a menos.
- **Maquete:** a mesma da rodada 1.
- **Ver:** `http://localhost:3000/migracao-de-workspace` · `evidencias/proposta-r2-1-arquivo-e-opcao.jpg`, `proposta-r2-2-revisar-substituir.jpg`, `proposta-r2-3-confirmar-substituir.jpg`, `proposta-r2-4-importando.jpg`, `proposta-r2-5-importado.jpg`
