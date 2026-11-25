# 4. Atalho na lista e no quadro de itens

**Objetivo:** da lista e do quadro de itens, a pessoa escreve ao contato de um item sem abrir o item, e a lista mostra
quem é o contato de cada linha.

**Depende de:** 1. Compositor e Novo e-mail na barra do topo.

**Onde vale:** a lista de itens da categoria (menu da linha e coluna Contato) e o quadro de itens (clique direito no
cartão).

**Protótipo:** https://pernalombr4.github.io/prototipos/comunicacao-no-workspace/. Em Contratos, abra o menu da linha
de CTR-00231; na visão "Por etapa", clique com o botão direito num cartão.

## Lista de itens (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF301 | O menu da linha deve ganhar o submenu "E-mail", depois das ações de hoje, com 1 grupo por contato do item (RN907). | O menu de CTR-00231 mantém "Ver Detalhes", "Editar", "Enviar para Lixeira" e "Copiar Link" e ganha "E-mail" com os grupos "E-mail do contato", "E-mail do financeiro" e "Requisitante". | Essencial | Obrigatório |
| RF302 | Cada grupo deve ter como título o rótulo do contato, com o nome quando há, e os 2 caminhos do atalho para esse contato, com o item vinculado (RN909, RN910, RN911, RN912). | "Escrever pelo ENSPACE" traz a descrição "O e-mail fica na Mail Box de CTR-00231"; "Abrir no meu app de e-mail" traz a do endereço do item em cópia. | Essencial | Obrigatório |
| RF303 | No item sem contato, o submenu "E-mail" deve mostrar "Sem contato", indisponível (RN913). | Um item sem campo de e-mail preenchido mostra "Sem contato" cinza. | Importante | Obrigatório |
| RF304 | A lista deve ter a coluna "Contato", com o nome e o e-mail do 1º contato do item (RN908). | A linha de CTR-00231 mostra o e-mail de "E-mail do contato". | Importante | Obrigatório |
| RF305 | No item sem contato, a coluna "Contato" deve mostrar "Sem contato". | A linha do item sem e-mail mostra "Sem contato". | Importante | Obrigatório |

## Quadro de itens (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF311 | O menu do clique direito no cartão do quadro deve ganhar o título "<referência> · <nome do item>" e, depois das ações que já tem ("Ver Detalhes", "Editar", "Mover para", "Enviar para Lixeira", "Copiar Link"), o submenu "E-mail" da lista. | Clique direito no cartão de CTR-00231 mostra "CTR-00231 · Contrato de manutenção predial", as ações de hoje e "E-mail". | Essencial | Obrigatório |
| RF312 | O quadro deve mostrar a dica "Clique com o botão direito num cartão para enviar e-mail ao contato.". | A dica aparece acima das colunas do quadro. | Importante | Obrigatório |

## Restrições (RS)

| ID | Requisito | Como medir ou conferir | Prioridade | Relevância |
|---|---|---|---|---|
| RS301 | O atalho do quadro entra no menu do clique direito que o cartão já tem; o cartão não ganha botão. O botão no cartão é o documento "Botão de e-mail no cartão do quadro". | O cartão não ganha botão; o clique direito traz as ações de hoje e o submenu. | Essencial | Obrigatório |
