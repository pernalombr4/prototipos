# Evidência de usabilidade para a barra de visualizações salvas e o construtor de visualização

Pesquisa feita em 2026-10-23, só com fonte aberta na web. Legenda dos rótulos:
- **[estudo]**: teste com usuários, com método e número declarados;
- **[diretriz NN/g]**: recomendação da Nielsen Norman Group baseada na pesquisa dela, sem número no artigo;
- **[norma]**: WCAG 2.2 ou WAI-ARIA APG, do W3C;
- **[design system]**: regra de design system de empresa; é convenção, não pesquisa;
- **[opinião]**: texto de autor sem dado;
- **não confirmado**: o que não achei em fonte primária.

## Abas: quando funcionam, quando falham, quantas antes do estouro, rolagem ou menu "Mais"

### Takeaway
A NN/g recomenda poucas abas, rótulo de 1 a 2 palavras e uma linha só; quando as abas estouram e viram carrossel, as escondidas perdem descoberta e o custo de interação sobe. Navegação escondida (menu fechado) teve uso e descoberta bem menores que a visível no estudo de 179 pessoas da NN/g; nenhuma fonte dá um número máximo de abas.

### Cited Findings
- [diretriz NN/g] "The fewer tabs, the better"; o artigo não fixa um máximo. Autor Evan Sunwall, 2024-08-02, revisado em 2026-09-02; atualiza o artigo de Jakob Nielsen de 2007 — [NN/g, Tabs, Used Right](https://www.nngroup.com/articles/tabs-used-right/)
- [diretriz NN/g] Quando as abas não cabem, "the tab bar often becomes a carousel": as abas escondidas ficam menos descobríveis e o custo de interação sobe. A rolagem de abas aparece só como recurso opcional — [NN/g, Tabs, Used Right](https://www.nngroup.com/articles/tabs-used-right/)
- [diretriz NN/g] Rótulo de aba com 1 a 2 palavras; rótulo longo "is a sign that the choices are too complicated for tabs". O artigo não trata de truncar rótulo — [NN/g, Tabs, Used Right](https://www.nngroup.com/articles/tabs-used-right/)
- [diretriz NN/g] Uma linha de abas só: empilhar linhas torna ambíguo o indicador de seleção e quebra a memória espacial — [NN/g, Tabs, Used Right](https://www.nngroup.com/articles/tabs-used-right/)
- [diretriz NN/g] Abas falham quando a pessoa precisa comparar o conteúdo entre elas, quando o agrupamento não é claro e quando o conteúdo das abas não padrão é crítico para a tarefa; não misturar aba de conteúdo com aba de navegação no mesmo controle — [NN/g, Tabs, Used Right](https://www.nngroup.com/articles/tabs-used-right/)
- [estudo] Navegação escondida no desktop: usada em 27% dos casos, contra 48% da visível e 50% da combinada (parte visível, parte num menu). No celular: 57% escondida contra 86% combinada. 179 participantes, 6 sites, teste remoto; Pernice e Budiu, 2016-06-26 — [NN/g, Hamburger Menus and Hidden Navigation Hurt UX Metrics](https://www.nngroup.com/articles/hamburger-menus/)
- [estudo] A navegação escondida reduziu a descoberta de conteúdo em mais de 20% nos 2 dispositivos; no desktop, a tarefa levou pelo menos 39% mais tempo; dificuldade média 2,6 (escondida) contra 2,3 (combinada) e 2,1 (visível) numa escala de 1 a 7 — [NN/g, Hamburger Menus and Hidden Navigation Hurt UX Metrics](https://www.nngroup.com/articles/hamburger-menus/)
- [estudo] No celular, os 2 sites de melhor desempenho usavam navegação combinada em posição saliente no topo; o pior tinha um ícone de menu pequeno ao lado do logo — [NN/g, Find Navigation on Mobile](https://www.nngroup.com/articles/find-navigation-mobile-even-hamburger/)
- [diretriz NN/g, 2014, clássico] No desktop, as pessoas não adotaram a rolagem horizontal e esperam conteúdo extra abaixo, não ao lado; setas laterais são ignoradas e setas que só aparecem no hover escondem o conteúdo. Recomenda alvo visível, avanço por clique e teclado e indicar quanto falta. Sem dado quantitativo (1 heatmap e observações) — [NN/g, Beware Horizontal Scrolling](https://www.nngroup.com/articles/horizontal-scrolling/)
- [design system] Menu de transbordo é para ação secundária ou rara; não colocar ação crítica nele nem contar com ele para descoberta — [American Express Design System, Menu](https://designinternet-qaeusw1green.americanexpress.com/components/actions/menu/usage)
- [norma] Teclado da lista de abas: Tab entra na aba ativa e sai para o painel; setas esquerda e direita andam entre as abas, com volta ao início; Home e End opcionais. Ativação automática no foco só quando o painel aparece sem atraso perceptível; senão, ativação manual com Espaço ou Enter. Delete opcional fecha a aba focada quando a aba é excluível. Shift+F10 abre o menu da aba quando ela tem um (`aria-haspopup`) — [WAI-ARIA APG, Tabs Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)

### Inferences
- Na barra de visualizações, as visualizações que caem no transbordo são as que menos gente vai achar; a ordem (fixar, mais usadas, a atual sempre visível) decide o que é descoberto. É extrapolação do estudo de navegação global para uma barra de visualizações.
- Entre carrossel de abas e menu "Mais", a evidência pesa contra o carrossel no desktop (rolagem horizontal ignorada); o menu "Mais" com rótulo e contagem tem cheiro de informação melhor. Nenhuma fonte comparou os 2 diretamente.
- Cada visualização trocada recarrega a tabela: pela APG, isso pede ativação manual no teclado, se a troca tiver atraso perceptível.

### Gaps
- Número de abas a partir do qual a descoberta cai: nenhuma fonte primária dá (não confirmado).
- Comparação medida entre abas rolantes e menu "Mais": não achei estudo.
- Material Design 3 (abas fixas e roláveis): a página não carregou no leitor; não confirmado.

## Truncamento de rótulo: reticências, tooltip como único acesso, mínimo de caracteres

### Takeaway
Não achei artigo da NN/g ou do Baymard sobre truncar rótulo. Os design systems convergem: deixar pelo menos 4 caracteres visíveis, preferir quebrar linha a truncar, não truncar navegação nem rótulo, e não depender só de tooltip, que some no toque e não guarda informação essencial.

### Cited Findings
- [diretriz NN/g] "Don't use tooltips for information that is vital to task completion"; a tooltip depende do hover e não existe no toque; precisa funcionar com foco de teclado. Alita Kendrick, 2019-01-27 — [NN/g, Tooltip Guidelines](https://www.nngroup.com/articles/tooltip-guidelines/)
- [design system] Mínimo de 4 caracteres visíveis num texto truncado; preferir quebrar linha; evitar truncar item de navegação, título, rótulo, mensagem de erro e aviso; texto truncado é especialmente inacessível no toque, onde não há tooltip de hover — [Maersk Design System, Truncation](https://designsystem.maersk.com/content/truncation/)
- [design system] Não deixar menos de 4 caracteres; truncar no fim ou no meio, conforme a parte que diferencia os itens; não truncar cabeçalho de coluna; se o texto é link, a reticência faz parte do link — [PatternFly, Truncation](https://v4-archive.patternfly.org/v4/ux-writing/truncation)
- [design system] Quebrar linha é o padrão; reticência só quando a altura uniforme do componente é essencial — [Wikimedia Codex, Content overflow](https://doc.wikimedia.org/codex/main/style-guide/content-overflow.html)
- [diretriz NN/g] Rótulo longo de aba sinaliza escolhas complexas demais para abas — [NN/g, Tabs, Used Right](https://www.nngroup.com/articles/tabs-used-right/)

### Inferences
- Nome de visualização truncado com tooltip como única leitura falha no toque e no leitor de tela, a menos que o nome inteiro esteja no `aria-label` ou no menu "Mais". O menu "Mais" pode mostrar o nome inteiro.
- Visualizações com o mesmo começo ("Contratos 2025 SP", "Contratos 2025 RJ") pedem truncar no meio ou largura maior: a parte que diferencia fica no fim.

### Gaps
- Artigo da NN/g ou do Baymard sobre truncamento com reticências: não achei (não confirmado que exista).
- WCAG 1.4.13 (conteúdo no hover ou foco) não foi lido nesta rodada.
- Número mínimo de caracteres com base em teste: os 4 caracteres são convenção de design system, sem estudo citado.

## Visualizações salvas: descoberta e reuso, alterações não salvas, desfazer ou confirmar, salvar sozinho ou salvar explícito

### Takeaway
Não achei estudo publicado sobre como as pessoas descobrem e reusam visualizações ou buscas salvas. A evidência que existe é sobre o padrão em volta: confirmação só para o que é grave e irreversível, desfazer sempre que der, saída clara e aviso antes de perder trabalho, e status de salvamento visível.

### Cited Findings
- [diretriz NN/g] Confirmação só para ação de consequência séria, sobretudo irreversível; confirmação rotineira treina a pessoa a clicar "Sim" sem ler. Desfazer é a proteção melhor quando dá. Botões com o resultado ("Excluir arquivo", "Manter arquivo") em vez de "Sim" e "Não"; nomear o item e a consequência. Jakob Nielsen, 2018-02-18, revisado em 2026-08-07 — [NN/g, Confirmation Dialogs](https://www.nngroup.com/articles/confirmation-dialog/)
- [diretriz NN/g] "Support undo and redo"; "give users a visible option to undo an action on the UI"; desfazer contextual (snackbar) fica na tela o tempo de agir; avisar antes de sair de formulário e dar chance de cancelar. Maria Rosala, 2020-11-29 — [NN/g, User Control and Freedom](https://www.nngroup.com/articles/user-control-and-freedom/)
- [design system] Grafana: salvar sozinho o que afeta outras pessoas (padrão da organização, painel); botão Salvar sempre visível, mesmo desabilitado; separar "Aplicar" (prévia) de "Salvar" (definitivo) e avisar quando algo foi aplicado e não salvo — [Grafana Saga, Save pattern](https://grafana.com/developers/saga/patterns/save/)
- [opinião] Status de salvamento invisível e aviso vago, descartado por reflexo, são os erros mais comuns; recomenda "Salvando…/Salvo" visível — [SaaS UI, Autosave and save states](https://www.saasui.design/blog/saas-autosave-save-states-ux-patterns)
- [relato de usuário] Lista única e compartilhada de buscas salvas dificulta achar as próprias; pedem padrão por pessoa, dono, compartilhamento e pastas — [IBM Ideas, CPDIDEAS-I-2908](https://ibm-data-and-ai.ideas.ibm.com/ideas/CPDIDEAS-I-2908)
- [relato de usuário] Visualizações salvas com menos filtros que a busca fazem a pessoa refazer a busca todo dia — [Front Community](https://community.front.com/beta-inbox-ux-updates-76/option-to-save-a-search-as-a-view-3554)
- [doc de produto] Lista longa de buscas salvas ganhou filtro por nome, paginação e pastas — [Embase, release notes julho de 2023](https://supportcontent.elsevier.com/RightNow%20Next%20Gen/Embase/Embase%20release%20notes%20-%20July%202023.pdf)

### Inferences
- Excluir visualização compartilhada é grave e afeta outras pessoas: pede confirmação nomeada ou, melhor, desfazer. Renomear, reordenar e trocar filtro pedem desfazer, não confirmação.
- Mudar filtro numa visualização compartilhada sem gravar para todos se apoia no par "Aplicar × Salvar" do Grafana: estado alterado marcado na aba, com "Salvar" e "Descartar" à vista.
- A visualização salva precisa guardar o estado inteiro (filtros, colunas, ordem), senão as pessoas param de usar (relato do Front).

### Gaps
- Estudo com usuários sobre descoberta e reuso de visualizações ou buscas salvas: não achei.
- Artigo da NN/g sobre salvar sozinho × salvar explícito em ferramenta colaborativa: não achei.
- Taxa de uso de visualização salva em ferramenta de tabela (Airtable, Notion, monday): não confirmado.

## Modal, painel lateral ou edição no lugar para configurar; divulgação progressiva; assistente ou formulário único; prévia imediata

### Takeaway
A NN/g reserva o modal para aviso grave, dado indispensável e fluxo complexo em etapas, e o desaconselha quando a decisão precisa de informação que o modal cobre. Divulgação progressiva em até 2 níveis, assistente só para tarefa rara de novato, e prévia em tempo real, que ajuda a aprender fazendo.

### Cited Findings
- [diretriz NN/g] Modal para aviso importante, erro crítico, dado indispensável para continuar e fluxo complexo dividido em etapas. "Avoid modal dialogs for complex decision making that requires additional sources of information unavailable in the modal." Diálogo não modal quando a pessoa precisa alternar entre tarefas. Therese Fessenden, 2017-04-23 — [NN/g, Modal & Nonmodal Dialogs](https://www.nngroup.com/articles/modal-nonmodal-dialog/)
- [diretriz NN/g, 2006, clássico] Divulgação progressiva: o que a maioria usa na primeira tela e o avançado sob demanda; no máximo 2 níveis; caminho para o secundário visível e com rótulo claro. A divulgação em etapas (assistente) falha quando as etapas dependem uma da outra e a pessoa vai e volta — [NN/g, Progressive Disclosure](https://www.nngroup.com/articles/progressive-disclosure/)
- [diretriz NN/g] Assistente para novato e tarefa ocasional; formulário para uso frequente, especialista e quando é preciso comparar campos. Contras do assistente: mais cliques, comparar entre etapas fica difícil, bloqueia o resto do app num modal. Reusar as escolhas anteriores como padrão. Raluca Budiu, 2017-06-25 — [NN/g, Wizards](https://www.nngroup.com/articles/wizards/)
- [diretriz NN/g] Em aplicação complexa, prévia em tempo real ajuda a conferir se a ação bate com a intenção ("learning by doing"); caminhos flexíveis em vez de lineares; mostrar opção só quando ela vale (divulgação em etapas). Kate Kaplan, 2020-11-08 — [NN/g, Complex Application Design](https://www.nngroup.com/articles/complex-application-design/)
- [diretriz NN/g] Manipulação direta: ações físicas, incrementais e reversíveis, com o efeito visível na hora; desvantagem para pessoa com deficiência visual ou motora. Sherugar e Budiu, 2016-08-21, revisado em 2024-10-14 — [NN/g, Direct Manipulation](https://www.nngroup.com/articles/direct-manipulation/)

### Inferences
- O construtor de visualização decide olhando a tabela (que coluna, que filtro): um modal que cobre a tabela cai no caso que a NN/g desaconselha. Painel lateral não modal com a tabela atualizando ao lado junta prévia imediata e consulta. Nenhum estudo comparou os 2 para este caso.
- Criar visualização é tarefa frequente para quem usa a tabela todo dia: formulário único (ou painel) serve melhor que assistente.

### Gaps
- Estudo comparando modal, painel lateral e edição no lugar para configurar tabela: não achei.
- Artigo da NN/g sobre painel lateral (drawer) não foi lido nesta rodada.

## Arrastar e soltar para reordenar: sinalização, retorno, indicador de destino, acessibilidade

### Takeaway
A NN/g pede alça de arrastar, cursor de mover, item pego destacado, vizinhos abrindo espaço em cerca de 100 ms e alternativa por teclado. A WCAG 2.2 (2.5.7, nível AA) exige que todo arrastar tenha alternativa com 1 ponteiro sem arrastar; suporte só por teclado não cumpre.

### Cited Findings
- [diretriz NN/g] Alça de arrastar como sinal (ícone "not nearly as universal as designers may think"); cursor de mover padrão no hover; item pego diferente dos vizinhos (contorno, sombra, deslocamento); vizinhos saem do caminho em cerca de 100 ms quando o centro do item cruza a borda do outro; zona de soltar com magnetismo e destaque. Page Laubheimer, 2020-02-23 — [NN/g, Drag and Drop](https://www.nngroup.com/articles/drag-drop/)
- [diretriz NN/g] Acessibilidade: alça alcançável por Tab, Espaço para pegar, setas para posicionar; o leitor de tela recebe as ações, o estado (pego ou não) e a posição. No toque, trocar arrastar por menu quando erra menos — [NN/g, Drag and Drop](https://www.nngroup.com/articles/drag-drop/)
- [norma] WCAG 2.2, critério 2.5.7 (AA): "All functionality that uses a dragging movement for operation can be achieved by a single pointer without dragging", salvo quando arrastar é essencial. Exemplo para reordenar lista: selecionar o item e usar botões de subir e descer. "achieving keyboard equivalence for a dragging operation does not automatically meet this success criterion" — [W3C, Understanding SC 2.5.7](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html)
- [design system] Salesforce: arrastar acessível se apoia em região viva (live region) que anuncia identidade, operação e estado: item pego, posição, teclas (setas, Espaço, Esc) e posição final — [Salesforce UX, 4 Major Patterns for Accessible Drag and Drop](https://medium.com/salesforce-ux/4-major-patterns-for-accessible-drag-and-drop-1d43f64ebf09)
- [opinião técnica] A biblioteca Dragon Drop usa região viva porque não há atributo ARIA adequado; `aria-grabbed` e `aria-dropeffect` estão obsoletos — [Smashing Magazine, Dragon Drop](https://shop.smashingmagazine.com/2018/01/dragon-drop-accessible-list-reordering/); [sorta11y README](https://cdn.jsdelivr.net/npm/sorta11y@0.1.0-alpha.1/README.md)

### Inferences
- Reordenar abas de visualização ou colunas no construtor pede, além do arrastar: botões ou itens de menu "Mover para a esquerda/direita" (ou "subir/descer"), teclado e anúncio por região viva. Sem o comando de 1 ponteiro, a tela não passa no nível AA.

### Gaps
- Número de sucesso de reordenar por arrastar × por menu em tabela de dados: não achei estudo.

## Menu de contexto (clique direito) e clique duplo para renomear: descoberta

### Takeaway
A NN/g (2025) diz que menu de contexto tem pouco cheiro de informação, que ação essencial não fica escondida nele e que o gatilho precisa estar visível (kebab ou "meatball"), perto do conteúdo e com rótulo. Clique duplo para renomear não tem estudo da NN/g; a evidência achada é fraca e aponta que o gesto é escondido.

### Cited Findings
- [diretriz NN/g] 10 diretrizes: menu só para ação secundária; gatilho perto do conteúdo, visível e sem depender de hover; rótulo no gatilho; 1 ou 2 ações ficam à mostra em vez de num menu; teclado e leitor de tela. Menus foram "missed entirely" quando o ícone estava longe, pequeno ou com pouco contraste. Kate Kaplan, 2025-11-28 — [NN/g, Contextual Menus Guidelines](https://www.nngroup.com/articles/contextual-menus-guidelines/)
- [diretriz NN/g] Na pesquisa da autora, kebab e "meatball" foram entendidos como "mais opções", mas as pessoas não sabiam o que havia dentro — [NN/g, Contextual Menus Guidelines](https://www.nngroup.com/articles/contextual-menus-guidelines/)
- [design system] Ação não fica só no menu de contexto; botão de ícone que abre o menu melhora muito a descoberta — [SAP Design System, Contextual menus](https://www.sap.com/design-system/btp/components/extensions/contextual-menus/usage)
- [norma] Na lista de abas, o menu da aba abre com Shift+F10 e a aba declara `aria-haspopup` — [WAI-ARIA APG, Tabs Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)
- [opinião, 2005, clássico] "Without being told, nobody can know double-click is possible" — [Coding Horror, Double-Click Must Die](https://blog.codinghorror.com/double-click-must-die/)
- [estudo, pequeno] Cerca de 10% dos participantes do Baymard, em geral com 50 anos ou mais, dão clique duplo em link e botão por hábito — [Baymard, Users Double-Click Online](https://baymard.com/blog/users-double-click-online)

### Inferences
- Renomear, duplicar e excluir visualização só por clique direito ou clique duplo ficam escondidos: precisam de um gatilho visível na aba (kebab no hover e no foco, sempre visível na aba ativa) ou de itens no menu da visualização. Clique duplo serve de atalho, não de caminho único.
- Quem dá clique duplo por hábito pode entrar no modo renomear sem querer; o Esc precisa cancelar.

### Gaps
- Estudo da NN/g sobre clique duplo para renomear: não achei (não confirmado).
- Taxa de descoberta do clique direito em aplicação web: não achei número.

## Tipo técnico e nome interno de campo para a pessoa usuária

### Takeaway
A heurística 2 da NN/g pede a língua da pessoa, sem jargão, sigla ou termo do sistema; nome interno e tipo técnico de campo (como "relation", "numberField" ou o identificador da API) violam a heurística quando aparecem para quem não é técnico.

### Cited Findings
- [diretriz NN/g] "speak the users' language"; evitar jargão e termo técnico; "Never assume that users will understand an abbreviation or acronym at first read"; exemplo do Global Entry, com siglas internas que confundem o próximo passo. Anna Kaley, 2018-07-01 — [NN/g, Match Between System and Real World](https://www.nngroup.com/articles/match-system-real-world/)

### Inferences
- No construtor, mostrar o rótulo do campo como a pessoa o vê na tela do item; tipo técnico só como ícone ou texto secundário, se ajudar a escolher (por exemplo, para distinguir 2 campos de mesmo nome).

### Gaps
- Estudo que meça o efeito de mostrar tipo de campo num seletor de colunas: não achei.

## Estado vazio e padrão sensato no fluxo de criar visualização (criar a partir da atual)

### Takeaway
A NN/g pede estado vazio que diga o que aconteceu, ensine o recurso e leve direto à ação; para assistente, reusar a escolha anterior como padrão. Não achei estudo específico sobre "salvar a visualização atual como nova".

### Cited Findings
- [diretriz NN/g] Estado vazio: comunicar o status do sistema ("Totally empty states cause confusion"), dar pista de aprendizado no lugar ("Star your favorites to list them here") e caminho direto para a tarefa (botão "Criar", link "Saiba mais"). Kate Kaplan, 2021-09-19 — [NN/g, Empty State Interface Design](https://www.nngroup.com/articles/empty-state-interface-design/)
- [diretriz NN/g] Reusar as seleções anteriores como padrão e escolher padrão sensato no primeiro uso — [NN/g, Wizards](https://www.nngroup.com/articles/wizards/)
- [doc de produto] Buscas salvas gravam a palavra-chave e todos os filtros escolhidos, ou seja, o estado atual da tela — [SAE Mobilus, Saving a Search](https://saemobilus.sae.org/help/search-history-saving)

### Inferences
- "Nova visualização" partindo da tabela como está (filtros, colunas, ordem) aplica o padrão de reusar a escolha anterior; começar do zero obriga a refazer o que já está na tela. É inferência; nenhuma fonte testou os 2.
- O estado vazio da barra (nenhuma visualização salva além da padrão) pode ensinar o recurso com 1 frase e o botão de criar.

### Gaps
- Estudo comparando "criar a partir da atual" e "criar em branco": não achei.
