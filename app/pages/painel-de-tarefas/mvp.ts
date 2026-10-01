/**
 * ANDAIME DE PROTÓTIPO: o recorte do MVP, ligado pelo botão "MVP" da barra
 * de baixo (pedido da redatora na rodada 3). Não é proposta de tela: mostra
 * como o painel sairia na primeira entrega. O texto é do andaime, como os
 * botões de estado, e fica só em português.
 *
 * O critério, pelo viés de produto:
 * - o trabalho principal do gestor: "quando abro a semana, quero ver o que
 *   venceu ou está para vencer, e com quem, para cobrar antes de virar
 *   problema"; o segundo: "saber se a equipe entrega no prazo e se a fila
 *   cresce";
 * - fica o que serve a esses 2 trabalhos com 1 rota de agregação no back;
 * - sai o que repete outro painel, o que é diagnóstico (fase 2) e o que pede
 *   leitura nova no back ou preferência por membro.
 */
import type { ItemDaGrade } from '~/components/ux/UxGradeDePaineis.vue'
import type { IdDoPainel } from './paineis'

/**
 * 8 painéis, arranjo fixo. Os 4 números seguem o `HomeStats` do template (4
 * por linha). O tempo médio de duração entra por decisão da redatora (rodada
 * 3: "o MVP precisa ter o tempo médio de duração por fluxo, por etapa e por
 * tarefa").
 */
export const LAYOUT_MVP: ItemDaGrade[] = [
  { id: 'vencidas', w: 3, h: 3 },
  { id: 'aVencer', w: 3, h: 3 },
  { id: 'noPrazo', w: 3, h: 3 },
  { id: 'tempo', w: 3, h: 3 },
  { id: 'serie', w: 8, h: 7 },
  { id: 'contagemStatus', w: 4, h: 7 },
  { id: 'responsaveis', w: 12, h: 7 },
  { id: 'tempos', w: 12, h: 8 },
]

export const PAINEIS_MVP = LAYOUT_MVP.map(x => x.id as IdDoPainel)

export interface ItemDoRecorte {
  oQue: string
  porque: string
}

export const RECORTE = {
  resumo: '8 painéis fixos, 2 filtros e a lista com quickview ao clicar. Fica o tempo médio de duração por fluxo, etapa e tarefa. Sai a personalização e sai o que repete outro painel.',
  trabalho: 'Quando abro a semana, quero ver o que venceu ou está para vencer, e com quem, para cobrar antes de virar problema. Em segundo lugar: saber se a equipe entrega no prazo e se a fila cresce.',
  fica: [
    { oQue: 'Tempo médio de duração, por fluxo, por etapa e por tarefa', porque: 'Decisão da redatora: o MVP precisa dizer onde o tempo vai. A barra do fluxo se divide nas etapas, com a mais lenta em amarelo, e a da tarefa em espera e execução. Pede 2 leituras além da agregação (ver "No back").' },
    { oQue: 'Vencidas, A vencer, Concluídas no prazo e Tempo médio de conclusão', porque: 'Os 4 números respondem o que está atrasado, o que vai atrasar, se a equipe entrega no prazo e quanto demora. 4 por linha, como o template do Nuxt UI.' },
    { oQue: 'Criadas e concluídas', porque: 'É a "contagem por período" da demanda e responde se a fila cresce. A granularidade segue o período sozinha.' },
    { oQue: 'Tarefas por responsável, em gráfico', porque: 'É o "com quem" do trabalho principal: a fila de cada pessoa, grupo e "Todo mundo", com o filtro Pendente, Em andamento, Vencida e Concluída. Abre em Vencida. A tabela abre como detalhe.' },
    { oQue: 'Tarefas por status', porque: 'Pendente, em andamento, bloqueada e concluída: o status virtual que a demanda pede, num só vocabulário.' },
    { oQue: 'Filtros de período e responsável', porque: 'São os 2 recortes que mudam a conversa do gestor com a equipe.' },
    { oQue: 'Lista ao clicar num número, com a quickview: busca, tabela, paginação e "Abrir em Agendadas/Rápidas"', porque: 'É onde o gestor age. A quickview é componente nativo do admin, já pronto: resume o painel clicado sem custo de construção.' },
    { oQue: '"Como calculamos"', porque: 'Custa um texto por painel e dá confiança no número: diz de onde vem cada conta.' },
  ] as ItemDoRecorte[],
  sai: [
    { oQue: 'Arrastar, redimensionar e o botão Painéis', porque: 'Com 8 painéis, arrumar a tela não muda decisão nenhuma. Pede componente de grade no SDK e preferência por membro no back. Entra quando o catálogo crescer.' },
    { oQue: 'SLA', porque: 'Repete os números (vencidas, a vencer, no prazo) com outro desenho.' },
    { oQue: 'Tarefas por prioridade', porque: 'Só a tarefa rápida e a do Spaceflow têm prioridade; a tarefa de etapa grava "0" e fica de fora. Em develop, 145 de 161 tarefas são normais: o painel diria "quase tudo é normal". Entra quando a tarefa de etapa ganhar prioridade.' },
    { oQue: 'Próximas a vencer', porque: 'O número "A vencer" abre a mesma lista, em ordem de prazo.' },
    { oQue: 'Números Abertas e Concluídas', porque: 'O total aparece no gráfico e na tabela de responsáveis.' },
    { oQue: 'Filtros de origem e de categoria', porque: 'Recorte fino. O responsável já separa as filas; entram com a fase 2.' },
    { oQue: 'Seletor de semana, mês e ano, "Colunas" e "Exportar"', porque: 'Opções que dobram a tela sem mudar a decisão do gestor.' },
  ] as ItemDoRecorte[],
  back: 'O MVP pede 1 rota de agregação sobre /ws/tasks e /c-flow-item-tasks (contagem por situação do prazo, por status, por responsável e por semana ou mês, mais a média de conclusão, com os filtros de período e responsável) e 2 leituras para o tempo de duração: /c-flow-items com o stages_log (fluxo da categoria e etapa) e /workflows/executions (Spaceflow). Nada de preferência por membro.',
  risco: 'A suposição mais arriscada: o gestor quer ver o workspace inteiro. Hoje cada pessoa vê só as próprias tarefas (cartões da Início). O teste mais barato: mostrar o MVP a 5 gestores de clientes e ver se o primeiro clique é em Vencidas e se termina em "Abrir em Agendadas". Em produção, contar qual painel recebe clique.',
  fase2: 'Sinal para a fase 2: gestor pedindo recorte por origem ou categoria (entram os 2 filtros) ou pedindo para esconder painel (entra a personalização).',
}
