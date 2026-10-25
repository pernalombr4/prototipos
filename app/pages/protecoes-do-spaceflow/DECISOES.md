# Decisões: Proteções do Spaceflow

## A proposta em 1 parágrafo

Uma aba **Proteções** no editor do fluxo, depois de Execuções, só de configuração. O topo fica fixo com "Salvar".
As regras ficam em grupos (Volume de disparos, Execuções ao mesmo tempo, Disparos repetidos, Repetição sem fim, Tempo
e erros, Custo de IA e Avisos), uma por linha: rótulo e 1 frase à esquerda, controle à direita, com unidade de tempo
escolhida pela pessoa (rodada 2). O que passa do limite espera na fila por padrão; ignorar e reter são escolhas explícitas.
Salvar não cria versão do fluxo: vale a partir da próxima execução. A aba Execuções ganha 4 status (Na fila, Ignorada,
Retida, Interrompida) com o motivo escrito, filtro por status e a decisão em lote das retidas.

## A jornada

```mermaid
flowchart LR
    A["Editor do fluxo"] --> B["Aba Proteções"]
    B -->|"Ver no editor"| D["Canvas com o nó do ciclo destacado"]
    E["Disparo chega"] --> F{"Proteção"}
    F -->|"dentro do limite"| G["Execução roda"]
    F -->|"passou do limite"| H["Na fila / Ignorada / Retida"]
    F -->|"cadeia ou tempo máximo"| I["Interrompida"]
    F -->|"N erros seguidos"| J["Fluxo pausado: faixa em todas as abas"]
    J -->|"Retomar fluxo"| G
    H -->|"Liberar"| G
```

## Rodada 1 · 2026-10-24

- **Pedido (literal):** "pode prototipar tudo, mas coloque uma aba de "mvp" com somente o essencial."
- **Mudou:**
  - pasta nova `protecoes-do-spaceflow`, com a casca copiada do `no-de-atraso` e conferida no develop;
  - aba Proteções com as 7 seções (versão Completa) e com 5 seções e valores fixos (versão MVP), trocadas no andaime;
  - aba Execuções com os 4 status novos, motivo, "Esperando tarefa", filtro por status e liberar ou descartar retidas;
  - faixa "Fluxo pausado pela proteção" em todas as abas, com "Retomar fluxo" e "Ver erros";
  - aviso de ciclo no card do nó que pode disparar o próprio fluxo, ligado a "Ver no editor".
- **Fronteira:** muda a aba Proteções (nova), o que a aba Execuções mostra e o rodapé do card do nó que fecha um
  ciclo; não muda a casca, o canvas, as abas Versões, Comentários e Logs, nem o modal dos nós.
- **O que o MVP tem:** Volume (execuções por minuto; o excesso espera na fila), Execuções ao mesmo tempo (limite; a
  nova espera a vez; a espera por pessoa não conta), Repetição sem fim (ignorar mudanças feitas por fluxos e parar a
  cadeia), Tempo e erros (pausar depois de N erros; os disparos guardados rodam ao retomar) e Avisos (avisar o dono).
  Status novos no MVP: Na fila e Interrompida. Fica para depois: limite por dia, janela de horário, ignorar e reter,
  vaga por item, prazo na fila, Timer sobreposto, Disparos repetidos, aviso de ciclo no desenho, tempo máximo, Custo
  de IA, destinatários e frequência dos avisos.
- **Decisões que estavam em aberto** (ela validou sem responder; segui a recomendação):
  - as Proteções ficam fora das versões e valem ao salvar, com registro em Logs;
  - fluxo novo nasce com os valores recomendados; fluxo que já existia ganha ligadas só a Repetição sem fim e os
    Avisos (cenário "Fluxo que já existia"), para não mudar o comportamento de um fluxo em uso;
  - o nome da aba é "Proteções", como ela escreveu. Em inglês ficou "Safeguards", porque "Protections" soa estranho
    como rótulo de aba.
- **Por que assim:**
  - o excesso vai para a fila por padrão: é o padrão das 21 plataformas pesquisadas, e perder disparo sem aviso é o
    pior resultado (Power Automate);
  - rótulo pelo efeito ("Execuções ao mesmo tempo", "O que passar do limite"), não pelo termo técnico (concorrência,
    throttling): é o caminho do Make e do Zapier para usuário de negócio;
  - a espera por pessoa não ocupa vaga: no Spaceflow, Formulário, Aprovação e Tarefa seguram a execução por dias. Se
    contasse, 10 pedidos parados travariam o fluxo;
  - "Mudanças feitas por fluxos não disparam este fluxo" nasce ligado em fluxo novo: a documentação do ENSPACE admite
    o autodisparo, e o único jeito de evitar hoje é montar a condicional com `changes` à mão;
  - o teto de IA mostra a média e a maior execução ao lado do campo, porque "en-credits" sozinho não diz nada a quem
    configura (achado S3-F5 da pesquisa de UX);
  - escolhas com várias opções usam `USelect` com descrição por opção, não cartões (preferência registrada dela).
- **Descartado:**
  - aba "Regras de execução". Motivo: ela escreveu "Proteções";
  - presets ("Padrão", "Alto volume", "Uma de cada vez"). Motivo: escondem o que cada regra faz; o botão "Restaurar
    recomendadas" cobre o caso de voltar ao seguro;
  - retentativa automática por fluxo. Motivo: no mercado ela mora no nó, e o Spaceflow já tem retentativa manual de nó
    (`NodeExecutionsRetry`). Fica para uma demanda do modal dos nós.
- **Não deu:**
  - print das referências. Por quê: pesquisa documental; as telas de configuração de Make, Zapier, Power Automate e
    HubSpot pedem conta paga;
  - medir o limite que a plataforma já aplica hoje. Por quê: não está na documentação nem visível na tela; fica como
    pergunta no documento de requisitos;
  - prints do protótipo pelo `localhost`. Por quê: o Chrome não alcança o servidor local nesta máquina; os prints
    saíram do site publicado.
- **Maquete:**
  - salvar espera 900 ms e devolve sucesso (ou erro no cenário "Erro ao salvar"); nada persiste no reload;
  - os números do resumo e a lista de execuções vêm do `mocks.ts`; liberar, descartar e retomar mexem na lista em
    memória;
  - a análise de ciclo não lê o fluxo: o ciclo existe nos gatilhos Ações de Itens e E-mail recebido, que são os 2 casos
    que a documentação descreve;
  - o índice lateral, o canvas e as abas Versões, Comentários e Logs são estáticos.
- **Crítica e acessibilidade:**
  - corrigido: "Ver erros" e "Ver no editor" estavam em amarelo sobre amarelo; passaram a contorno neutro, e "Retomar
    fluxo" passou à cor primária;
  - corrigido: o valor fixo do MVP usava cadeado, que se confunde com "sem permissão"; passou ao ícone de informação;
  - corrigido: o índice lateral não acompanhava a rolagem e cortava o nome longo sem dica; agora acompanha, marca
    `aria-current` e mostra o nome inteiro no `title`;
  - corrigido: trocar de aba com alteração não salva descartava a alteração sem aviso; agora a alteração e a barra de
    salvar continuam ao voltar (RF085);
  - sem correção: a coluna de ações da aba Execuções fica no fim da linha, porque o `EnTable` põe o slot `#actions`
    na ponta direita; no develop ela é a primeira coluna. Decisão do front na implementação;
  - sem correção: no celular, a barra de abas do editor passa da largura da tela. É casca: o editor do develop não é
    pensado para celular;
  - o status da execução nunca depende só da cor: cada um tem ícone e o motivo escrito embaixo;
  - toda regra tem rótulo visível ligado à chave; os campos numéricos têm `aria-label` e a mensagem de erro com
    `role="alert"`.
- **CSS próprio:** nenhum (`<style>`, `:deep()` e `!important` não aparecem nos arquivos da pasta).
- **Ver:** https://pernalombr4.github.io/prototipos/protecoes-do-spaceflow/ · prints em `evidencias/`:
  - `proposta-01-aba-protecoes.jpg`: a aba Completa com o resumo das 24 horas;
  - `proposta-02-ciclo-encontrado.jpg` e `proposta-03-ciclo-resolvido-e-salvar.jpg`: o ciclo antes e depois de ligar a
    regra, com a barra de salvar;
  - `proposta-04-canvas-aviso-de-ciclo.jpg`: o aviso no card "Marcar para revisão";
  - `proposta-05-execucoes-status-novos.jpg` e `proposta-06-retidas.jpg`: os status novos e a decisão das retidas;
  - `proposta-07-fluxo-pausado.jpg`: a faixa do fluxo pausado;
  - `proposta-08-mvp.jpg`: o MVP;
  - `proposta-09-escuro-espanhol.png`: tema escuro em espanhol. Capturado sem os 20 px da direita: o detector de
    ponteiro lia a barra de rolagem clara do tema escuro como seta.

## Rodada 2 · 2026-10-24
- **Pedido (literal):** "pense em ux. nesse setido o painel ta passando uma sensaçao de bagunça. nao ta legal. poe exemplo no print, mta informaçao junta / no print 2 ta feio e muito pequeno... revise pontos do genero, vendo ux. / lembre-se de usar somente /nuxt-ui / print 3: o tempo nao necessariamente vai ser em hora. pode ser minuto, segundo.... tem que deixar o user definir a unidade tambem. / teto por execuçao de ia... nao faz sentido oferecermos as informaçoes de quanto gastou mais etc. tem alguns dados aí que nem conseguimos dar. tem que simplificar um pouco a ideia em pontos similares a esse tambem. / alem disso, os cartoes de dados que voce colocou no topo nao funcionam bem tambem. eles sao informaçao de execuçao, nao de proteçao. pode tirar daí. aí é só configuraçao. / e falta botao de salvar."
- **Mudou:**
  - cada regra virou uma linha no padrão de página de configurações do Nuxt UI: rótulo e 1 frase à esquerda, controle à direita (`UFormField` horizontal dentro de `UPageCard`, uma divisória por linha). Os campos da regra ficam ao lado da chave e só aparecem com ela ligada;
  - as frases de ajuda encolheram para 1 linha, e as linhas "Recomendado: 60 por minuto" saíram (o "Restaurar recomendadas" cobre o caso);
  - os botões de mais e menos dos números saíram; o número é um campo curto;
  - todo tempo tem unidade escolhida pela pessoa (segundos, minutos, horas, dias), num `UFieldGroup` de número e unidade (`_CampoDeDuracao.vue`);
  - o limite de volume ganhou o período segundo, minuto, hora ou dia, e o limite por dia separado saiu;
  - "Limitar disparos por item" com as 2 opções de rádio virou o menu "Disparar de novo pelo mesmo item" (Sempre, Depois que a anterior terminar, Nunca);
  - Custo de IA ficou só com o teto por execução, o teto por dia e o que fazer no teto. A média, a maior execução e o gasto do dia saíram;
  - Avisos: "O que gera aviso" virou um menu de escolha múltipla; o evento "fila passou de N" saiu;
  - os números das últimas 24 horas e o selo "Agiu N vezes hoje" saíram da aba: são dado de execução;
  - "Salvar" ficou fixo no topo da aba, sempre à vista e desabilitado sem alteração, com o estado ao lado ("Tudo salvo", "N alterações não salvas") e "Descartar" só com alteração. A barra de salvar do rodapé saiu;
  - no MVP, o que não se escolhe aparece como selo com o valor fixo ("Espera na fila", "A nova espera a vez", "Ficam guardados").
- **Fronteira:** muda só a aba Proteções; a aba Execuções, o canvas e a faixa de fluxo pausado ficam como na rodada 1.
- **Descartado:** manter o resumo das 24 horas em outro lugar da aba. Motivo: ela pediu a aba só de configuração; o que a proteção segurou já aparece na aba Execuções, com o filtro por status.
- **Maquete:** igual à rodada 1.
- **Crítica e acessibilidade:**
  - o rótulo de cada linha aponta para a chave da regra (`for`), e o número e a unidade têm `id` e `aria-label` próprios, sem id repetido;
  - o estado "N alterações não salvas" usa texto neutro com o ponto em amarelo: o texto em amarelo não passava de 4,5:1 no claro;
  - no celular, a frase do topo some para o "Salvar" caber sem ocupar meia tela;
  - CSS próprio: nenhum.
- **Ver:** https://pernalombr4.github.io/prototipos/protecoes-do-spaceflow/ · prints em `evidencias/r2-*.jpg`.
