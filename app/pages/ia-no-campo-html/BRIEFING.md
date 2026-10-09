# IA no campo HTML

## A demanda, como ela veio

Pedido de 08/10/2026:

> voce precisa fazer um prototipo do seguinte no campo html do enspace:
>
> * permitir uso de ia durante escrita de texto no campo html por comando com "/"
> * colocar botão pra utilizar IA na barra de ferramentas do campo html
>
> se ja souber como esse campo é por outros prototipos, nao precisa acessar o enspace. se precisar acessar, aguarde minha liberaçao pq dns ta fora no momento

## A tela em jogo

O campo **Editor de texto HTML** no formulário do item: tela do item, folder Visão Geral. O protótipo usa um item da categoria Contratos com 2 campos HTML:

- **Parecer do jurídico**, preenchido (2 parágrafos, com erros de digitação de propósito);
- **Observações internas**, vazio.

## O que seria sucesso

Quem escreve no campo HTML pede ajuda à BENI sem sair do campo, pelo "/" ou pelo botão da barra, vê a proposta antes de ela entrar no texto e decide se aceita.

## O que a pesquisa de UX já dizia

Procurei no `enspace-ux-research` (`temas/README.md`, as auditorias dos 6 temas e o `UX_REPORT.md`) por "html", "editor de texto", "BENI", "IA" e "inteligência". **Não havia nada sobre o campo HTML nem sobre IA na escrita.**

## Por que a Fase 2 não foi no develop

Ela liberou não acessar o ENSPACE se o campo já fosse conhecido, e o DNS estava fora. O campo foi medido no develop em setembro, no protótipo `padrao-dos-campos` (BRIEFING, seção 6.2). Esta rodada usa aquela medição.

## O que o campo faz hoje

Medido em `padrao-dos-campos` (formulário de criação com 29 campos, uma coluna):

| Peça | Como é |
|---|---|
| Controle | editor de blocos, 268 px de altura com o rótulo |
| Barra fixa, nesta ordem | desfazer, refazer, título, negrito, itálico, sublinhado, tachado, código, emoji, alinhamento, mais |
| Placeholder | `Escreva ou digite "/" para acessar os comandos...` |
| Menu "/" | existe (o placeholder o anuncia) |
| IA | nenhuma no campo. A IA do produto (BENI) fica em Configurações › Agentes de IA e no "Perguntar à BENI" da documentação |

**O que não foi medido:** os itens do menu "/" de hoje. O protótipo monta os grupos Texto, Listas e Inserir com os blocos que a barra já oferece. **Conferir no develop** quando o DNS voltar.

## A casca da tela, item por item

Cópia de `pastas-do-item` (`_CascaDoItem.vue` e `_PainelDoItem.vue`), que copiou a preview em 08/10/2026:

- menu lateral do `enspace-releases`: Buscar (Ctrl K); Membro, com Categorias aberto e Contratos ativo; Configurações, com Agentes de IA; Ajuda;
- barra do topo: voltar, avançar, recarregar, início, trilha (workspace › Categorias › categoria › referência), Ctrl B, estrela, BR, tema, Suporte, sino 99+, avatar;
- painel do item: ícone, referência, categoria, Identificação, Origem, Histórico e o botão de recolher;
- barra de folders no estilo de hoje (chips), com a Visão Geral ativa;
- rodapé com Salvar.

## Achados fora da demanda

- **Alinhamento e emoji precisam de extensão própria** no editor (TextAlign e Emoji do TipTap). O protótipo não as tem: o alinhamento é maquete e o emoji insere o caractere direto.
