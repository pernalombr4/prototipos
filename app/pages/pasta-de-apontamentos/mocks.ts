/**
 * Dado do protótipo: fictício, tipado, sem API.
 *
 * A estrutura vem do develop (11/11/2026, workspace de exploração): a barra de
 * pastas do item, o modal "Nova pasta" com nome, tipo, ícone e grupos, a pasta
 * Tarefas em quadro e o painel da tarefa com as abas fixas. Os valores são
 * inventados.
 *
 * Dois cenários provam que o tipo de pasta é universal:
 * - `produto`: a pasta "Retorno de testes" de uma demanda de desenvolvimento;
 * - `juridico`: a pasta "Pendências do contrato" de um contrato.
 *
 * Os prints anexados aos apontamentos de produto são capturas do develop feitas
 * na Fase 2 (estão em `evidencias/`). Os apontamentos que descrevem o que o
 * print mostra são observações reais da exploração; os demais são exemplos.
 */
import type { Item, Task } from '@be-enlighten/enspace-sdk-schemas'
import printVisaoGeral from './evidencias/hoje-item-visao-geral.jpg'
import printTiposDePasta from './evidencias/hoje-nova-pasta-tipos.jpg'
import printPastaTarefas from './evidencias/hoje-pasta-tarefas.jpg'
import printPainelTarefa from './evidencias/hoje-painel-da-tarefa.jpg'
import printComentariosTarefa from './evidencias/hoje-comentarios-da-tarefa.jpg'

/* ------------------------------------------------------------------ */
/* Tipos inventados pelo protótipo                                      */
/* ------------------------------------------------------------------ */

/**
 * Estado do apontamento. Inventado: não existe no `enspace-sdk-schemas`.
 * O significado é fixo; o rótulo de cada estado o admin pode renomear.
 * - pendente: `aberto`, `reaberto` (a vez é de quem resolve);
 * - para conferir: `resolvido` (a vez é de quem confere);
 * - fechado: `conferido`, `descartado`;
 * - `rascunho`: só quem escreveu vê, até enviar o retorno.
 */
export type Estado = 'rascunho' | 'aberto' | 'reaberto' | 'resolvido' | 'conferido' | 'descartado'

/** Mesma escala da prioridade da tarefa (`Task.priority`). */
export type Prioridade = Task['priority']

/** Pessoa do workspace. Inventado a partir de `Member.meta.fname/lname`. */
export interface Pessoa {
  id: number
  nome: string
  iniciais: string
}

export interface Anexo {
  id: string
  tipo: 'imagem' | 'arquivo' | 'link'
  nome: string
  /** Imagem: o endereço do print. Link: a URL. Arquivo: vazio (maquete). */
  url?: string
  /** Rótulo do tamanho, para arquivo. */
  tamanho?: string
}

export interface Resposta {
  id: string
  autor: number
  quando: Date
  texto: string
}

export interface Evento {
  id: string
  quem: number
  quando: Date
  /** Estado anterior e novo. Sem `de`: o apontamento nasceu. */
  de?: Estado
  para: Estado
  rodada: number
  nota?: string
}

export interface Apontamento {
  id: string
  /** Número curto, por pasta, para citar na conversa: #7. */
  numero: number
  titulo: string
  /** HTML do editor (TipTap). */
  corpo: string
  estado: Estado
  prioridade: Prioridade
  responsavel: number
  autor: number
  /** Rodada em que o apontamento nasceu. */
  rodada: number
  /** Quantas vezes voltou do reteste. */
  reaberturas: number
  anexos: Anexo[]
  respostas: Resposta[]
  historico: Evento[]
  criadoEm: Date
  /** Motivo do descarte. */
  motivo?: string
}

/** Uma rodada é um envio de retorno, com veredito e resumo. */
export interface Rodada {
  numero: number
  quem: number
  quando: Date
  veredito: 'correcao' | 'ressalvas' | 'aprovado'
  resumo: string
  /** Pedido de reteste de quem resolve, quando houve. */
  retestePedidoEm?: Date
  retestePedidoPor?: number
}

/** Configuração da pasta do tipo Apontamentos. Inventado: o back guarda a pasta como JSON livre. */
export interface ConfigDaPasta {
  nome: string
  icone: string
  /** Com conferência, "Resolvido" espera quem confere. Sem, "Resolvido" fecha. */
  exigeConferencia: boolean
  /** Quem confere: quem criou o apontamento ou um grupo. */
  conferente: 'autor' | 'grupo'
  /** Modelo do corpo de cada apontamento novo, em HTML. */
  modelo: string
  /** Responsável que já vem preenchido. */
  responsavelPadrao: number
  /** Impede concluir o item com apontamento pendente (gatilho do Spaceflow). Maquete. */
  travaConclusao: boolean
  /** Rótulos dos estados, editáveis. Vazio: o padrão do idioma. */
  rotulos: Partial<Record<Estado, string>>
}

export interface Cenario {
  id: 'produto' | 'juridico'
  workspace: { name: string, reference: string }
  categoria: { slug: string, name: string, icone: string }
  item: Item
  titulo: string
  config: ConfigDaPasta
  pessoas: Pessoa[]
  /** Quem confere e quem resolve, para o alternador "Você é". */
  conferente: number
  resolvedor: number
  apontamentos: Apontamento[]
  rodadas: Rodada[]
  tarefas: TarefaDoItem[]
  categoriasDoMenu: { nome: string, ativo?: boolean }[]
}

/** Tarefa rápida do item, tipada pelo `Task`, com os apontamentos dela (inventado). */
export interface TarefaDoItem {
  tarefa: Task
  apontamentos: Apontamento[]
  rodadas: Rodada[]
}

/* ------------------------------------------------------------------ */
/* Ajudantes                                                            */
/* ------------------------------------------------------------------ */

const d = (s: string) => new Date(s)
let seq = 0
const uid = (p: string) => `${p}-${++seq}`

function evento(quem: number, quando: string, para: Estado, rodada: number, de?: Estado, nota?: string): Evento {
  return { id: uid('ev'), quem, quando: d(quando), de, para, rodada, nota }
}

function tarefa(id: number, name: string, status: Task['status'], assigned: number, description?: string): Task {
  return {
    id,
    created_at: d('2026-11-05T10:12:00'),
    updated_at: d('2026-11-10T16:40:00'),
    deleted_at: null,
    reference: `5b3C${id}GpGjUYp6hdLVhVfE5pr1VdQ0`,
    name,
    description: description ?? null,
    workspace: 'desenvolvimento',
    type: 'generic',
    status,
    priority: 'normal',
    due_date: d('2026-11-14T18:00:00'),
    points: 0,
    meta: {},
    creator: 1,
    assigned_to: assigned,
    completed_by: null,
    completed_at: null,
    node_execution: null,
    item: 47617,
    notification_task: false,
    archived: false,
    collaborators: [],
    external_task: null,
    permissions: [],
    tag_ids: [],
  }
}

/* ------------------------------------------------------------------ */
/* Cenário 1: produto                                                   */
/* ------------------------------------------------------------------ */

const ANA = 1 // quem testa (PM)
const BRUNO = 2 // dev front
const CAIO = 3 // dev back
const DEBORA = 4 // design

const pessoasProduto: Pessoa[] = [
  { id: ANA, nome: 'Ana Ribeiro', iniciais: 'AR' },
  { id: BRUNO, nome: 'Bruno Tavares', iniciais: 'BT' },
  { id: CAIO, nome: 'Caio Mendes', iniciais: 'CM' },
  { id: DEBORA, nome: 'Débora Lins', iniciais: 'DL' },
]

const MODELO_PRODUTO = '<p><strong>Onde:</strong> </p><p><strong>Problema:</strong> </p><p><strong>Correção sugerida:</strong> </p>'

const apontamentosProduto: Apontamento[] = [
  {
    id: 'ap-1', numero: 1,
    titulo: 'Chave de tradução aparece no menu lateral',
    corpo: '<p><strong>Onde:</strong> menu lateral, grupo Membro, abaixo de Agenda.</p><p><strong>Problema:</strong> o item mostra o texto <code>menu.member.reports.label</code> em vez do nome do menu.</p><p><strong>Correção sugerida:</strong> mostrar "Meus relatórios" nos 3 idiomas.</p>',
    estado: 'conferido', prioridade: 'normal', responsavel: BRUNO, autor: ANA, rodada: 1, reaberturas: 0,
    anexos: [{ id: 'an-1', tipo: 'imagem', nome: 'menu-chave-de-traducao.jpg', url: printVisaoGeral }],
    respostas: [
      { id: 're-1', autor: BRUNO, quando: d('2026-11-06T11:20:00'), texto: 'Faltava a chave no dicionário de espanhol e de português. Corrigido nos 3.' },
    ],
    historico: [
      evento(ANA, '2026-11-04T17:02:00', 'aberto', 1),
      evento(BRUNO, '2026-11-06T11:20:00', 'resolvido', 1, 'aberto'),
      evento(ANA, '2026-11-10T09:15:00', 'conferido', 2, 'resolvido'),
    ],
    criadoEm: d('2026-11-04T17:02:00'),
  },
  {
    id: 'ap-2', numero: 2,
    titulo: 'Rodapé avisa "Alterações não salvas" sem nenhuma alteração',
    corpo: '<p><strong>Onde:</strong> tela do item, pasta Visão Geral.</p><p><strong>Problema:</strong> ao abrir o item, o rodapé já mostra "Alterações não salvas" e o botão Sair sem salvar, sem que nenhum campo tenha sido tocado.</p><p><strong>Correção sugerida:</strong> mostrar o aviso só depois da primeira alteração em um campo.</p>',
    estado: 'reaberto', prioridade: 'high', responsavel: BRUNO, autor: ANA, rodada: 1, reaberturas: 1,
    anexos: [
      { id: 'an-2', tipo: 'imagem', nome: 'rodape-sem-alteracao.jpg', url: printVisaoGeral },
      { id: 'an-3', tipo: 'link', nome: 'Gravação da tela (1 min 12 s)', url: 'https://exemplo.invalid/gravacao-rodape' },
    ],
    respostas: [
      { id: 're-2', autor: BRUNO, quando: d('2026-11-07T15:02:00'), texto: 'O valor monetário era normalizado ao carregar e marcava o formulário como alterado. Corrigido.' },
      { id: 're-3', autor: ANA, quando: d('2026-11-10T09:31:00'), texto: 'Continua acontecendo em item com campo de Duração vazio. O valor monetário passou.' },
    ],
    historico: [
      evento(ANA, '2026-11-04T17:05:00', 'aberto', 1),
      evento(BRUNO, '2026-11-07T15:02:00', 'resolvido', 1, 'aberto'),
      evento(ANA, '2026-11-10T09:31:00', 'reaberto', 2, 'resolvido', 'Continua acontecendo em item com campo de Duração vazio.'),
    ],
    criadoEm: d('2026-11-04T17:05:00'),
  },
  {
    id: 'ap-3', numero: 3,
    titulo: 'Status da tarefa aparece em inglês no painel',
    corpo: '<p><strong>Onde:</strong> pasta Tarefas, ao abrir uma tarefa rápida.</p><p><strong>Problema:</strong> o selo no canto do painel mostra <code>pending</code> com a interface em português.</p><p><strong>Correção sugerida:</strong> usar o rótulo traduzido do status (Pendente, Pending, Pendiente).</p>',
    estado: 'resolvido', prioridade: 'normal', responsavel: BRUNO, autor: ANA, rodada: 1, reaberturas: 0,
    anexos: [{ id: 'an-4', tipo: 'imagem', nome: 'painel-da-tarefa-pending.jpg', url: printPainelTarefa }],
    respostas: [
      { id: 're-4', autor: BRUNO, quando: d('2026-11-11T10:05:00'), texto: 'Trocado pelo mesmo selo da lista de tarefas.' },
    ],
    historico: [
      evento(ANA, '2026-11-04T17:11:00', 'aberto', 1),
      evento(BRUNO, '2026-11-11T10:05:00', 'resolvido', 2, 'aberto'),
    ],
    criadoEm: d('2026-11-04T17:11:00'),
  },
  {
    id: 'ap-4', numero: 4,
    titulo: 'GET da pasta devolve o tipo com nome antigo',
    corpo: '<p><strong>Onde:</strong> API, <code>GET /ws/types/{slug}/views</code>.</p><p><strong>Problema:</strong> as pastas migradas voltam com <code>folder_type</code> em vez de <code>type</code> em 2 das 9 pastas.</p><p><strong>Correção sugerida:</strong> rodar a migração também nas pastas ocultas.</p><p>A coleção e o ambiente do Postman estão anexados. O ambiente vai sem chave: preencha <code>api_key</code> com a sua.</p>',
    estado: 'resolvido', prioridade: 'urgent', responsavel: CAIO, autor: ANA, rodada: 1, reaberturas: 0,
    anexos: [
      { id: 'an-5', tipo: 'arquivo', nome: 'pastas-do-item.postman_collection.json', tamanho: '14 KB' },
      { id: 'an-6', tipo: 'arquivo', nome: 'develop.postman_environment.json', tamanho: '2 KB' },
    ],
    respostas: [
      { id: 're-5', autor: CAIO, quando: d('2026-11-10T18:44:00'), texto: 'A migração ignorava pastas com hidden=true. Ajustado e rodado de novo no develop.' },
    ],
    historico: [
      evento(ANA, '2026-11-04T17:20:00', 'aberto', 1),
      evento(CAIO, '2026-11-10T18:44:00', 'resolvido', 2, 'aberto'),
    ],
    criadoEm: d('2026-11-04T17:20:00'),
  },
  {
    id: 'ap-5', numero: 5,
    titulo: 'Campo Ícone obrigatório começa em "Sem ícone"',
    corpo: '<p><strong>Onde:</strong> Nova pasta, campo Ícone.</p><p><strong>Problema:</strong> o campo é obrigatório, mas já vem com a opção "Sem ícone", que não é aceita ao criar.</p><p><strong>Correção sugerida:</strong> trazer um ícone padrão pelo tipo de pasta escolhido.</p>',
    estado: 'aberto', prioridade: 'low', responsavel: DEBORA, autor: ANA, rodada: 1, reaberturas: 0,
    anexos: [{ id: 'an-7', tipo: 'imagem', nome: 'nova-pasta-icone.jpg', url: printTiposDePasta }],
    respostas: [],
    historico: [evento(ANA, '2026-11-04T17:26:00', 'aberto', 1)],
    criadoEm: d('2026-11-04T17:26:00'),
  },
  {
    id: 'ap-6', numero: 6,
    titulo: 'Botão Criar da tarefa não responde ao primeiro clique',
    corpo: '<p><strong>Onde:</strong> pasta Tarefas, Nova tarefa.</p><p><strong>Problema:</strong> com o nome preenchido, o primeiro clique em Criar não fez nada; o segundo criou.</p>',
    estado: 'descartado', prioridade: 'normal', responsavel: BRUNO, autor: ANA, rodada: 1, reaberturas: 0,
    motivo: 'Não reproduzimos em 3 navegadores. Se voltar, anexe a gravação.',
    anexos: [{ id: 'an-8', tipo: 'imagem', nome: 'quadro-de-tarefas.jpg', url: printPastaTarefas }],
    respostas: [],
    historico: [
      evento(ANA, '2026-11-04T17:30:00', 'aberto', 1),
      evento(BRUNO, '2026-11-06T09:40:00', 'descartado', 1, 'aberto', 'Não reproduzimos em 3 navegadores. Se voltar, anexe a gravação.'),
    ],
    criadoEm: d('2026-11-04T17:30:00'),
  },
  {
    id: 'ap-7', numero: 7,
    titulo: 'Estado vazio dos comentários com ponto de exclamação',
    corpo: '<p><strong>Onde:</strong> pasta Comentários e aba Comentários da tarefa.</p><p><strong>Problema:</strong> o texto "Nenhum comentário ainda. Seja o primeiro!" foge do tom formal das outras telas.</p><p><strong>Correção sugerida:</strong> "Nenhum comentário. Escreva o primeiro abaixo."</p>',
    estado: 'aberto', prioridade: 'low', responsavel: DEBORA, autor: ANA, rodada: 2, reaberturas: 0,
    anexos: [{ id: 'an-9', tipo: 'imagem', nome: 'comentarios-vazio.jpg', url: printComentariosTarefa }],
    respostas: [],
    historico: [evento(ANA, '2026-11-10T09:40:00', 'aberto', 2)],
    criadoEm: d('2026-11-10T09:40:00'),
  },
  {
    id: 'ap-8', numero: 8,
    titulo: 'Tipo de pasta sem descrição na lista',
    corpo: '<p><strong>Onde:</strong> Nova pasta, campo Tipo de Pasta.</p><p><strong>Problema:</strong> os 14 tipos aparecem só pelo nome. "Repetidor" e "Relacionamento Múltiplo" não dizem o que mostram.</p><p><strong>Correção sugerida:</strong> 1 linha de descrição embaixo de cada tipo.</p>',
    estado: 'aberto', prioridade: 'normal', responsavel: DEBORA, autor: ANA, rodada: 2, reaberturas: 0,
    anexos: [{ id: 'an-10', tipo: 'imagem', nome: 'tipos-de-pasta.jpg', url: printTiposDePasta }],
    respostas: [],
    historico: [evento(ANA, '2026-11-10T09:52:00', 'aberto', 2)],
    criadoEm: d('2026-11-10T09:52:00'),
  },
  {
    id: 'ap-9', numero: 9,
    titulo: 'A pasta aberta não volta depois de recarregar',
    corpo: '<p><strong>Onde:</strong> tela do item, qualquer pasta.</p><p><strong>Problema:</strong> ao recarregar, a tela voltava para a Visão Geral.</p><p><strong>Correção sugerida:</strong> guardar a pasta aberta no endereço.</p>',
    estado: 'conferido', prioridade: 'high', responsavel: BRUNO, autor: ANA, rodada: 1, reaberturas: 0,
    anexos: [],
    respostas: [{ id: 're-6', autor: BRUNO, quando: d('2026-11-05T14:10:00'), texto: 'A pasta vai para ?folder= no endereço.' }],
    historico: [
      evento(ANA, '2026-11-04T17:34:00', 'aberto', 1),
      evento(BRUNO, '2026-11-05T14:10:00', 'resolvido', 1, 'aberto'),
      evento(ANA, '2026-11-10T09:12:00', 'conferido', 2, 'resolvido'),
    ],
    criadoEm: d('2026-11-04T17:34:00'),
  },
  {
    id: 'ap-10', numero: 10,
    titulo: 'Arrastar a pasta para o mesmo lugar abre o aviso de salvar',
    corpo: '<p><strong>Onde:</strong> barra de pastas, arrastar e soltar.</p><p><strong>Problema:</strong> soltar a pasta na posição de origem abria o aviso de salvar a nova ordem.</p><p><strong>Correção sugerida:</strong> não abrir nada quando a ordem não muda.</p>',
    estado: 'conferido', prioridade: 'normal', responsavel: BRUNO, autor: ANA, rodada: 1, reaberturas: 0,
    anexos: [],
    respostas: [],
    historico: [
      evento(ANA, '2026-11-04T17:38:00', 'aberto', 1),
      evento(BRUNO, '2026-11-06T16:00:00', 'resolvido', 1, 'aberto'),
      evento(ANA, '2026-11-10T09:14:00', 'conferido', 2, 'resolvido'),
    ],
    criadoEm: d('2026-11-04T17:38:00'),
  },
  {
    id: 'ap-11', numero: 11,
    titulo: 'Aba ativa sem ligação com o conteúdo abaixo',
    corpo: '<p><strong>Onde:</strong> barra de pastas.</p><p><strong>Problema:</strong> a pasta ativa parece um botão aceso, sem ligação com o conteúdo.</p><p><strong>Correção sugerida:</strong> sublinhado na aba ativa e borda inferior na barra, como no protótipo aprovado.</p>',
    estado: 'conferido', prioridade: 'normal', responsavel: DEBORA, autor: ANA, rodada: 1, reaberturas: 0,
    anexos: [],
    respostas: [],
    historico: [
      evento(ANA, '2026-11-04T17:41:00', 'aberto', 1),
      evento(DEBORA, '2026-11-07T10:30:00', 'resolvido', 1, 'aberto'),
      evento(ANA, '2026-11-10T09:16:00', 'conferido', 2, 'resolvido'),
    ],
    criadoEm: d('2026-11-04T17:41:00'),
  },
  {
    id: 'ap-12', numero: 12,
    titulo: 'Contador de comentários na aba da pasta',
    corpo: '<p><strong>Onde:</strong> barra de pastas, aba Comentários.</p><p><strong>Problema:</strong> não há como saber que o item tem comentário novo sem abrir a pasta.</p><p><strong>Correção sugerida:</strong> número ao lado do nome da aba.</p>',
    estado: 'rascunho', prioridade: 'low', responsavel: BRUNO, autor: ANA, rodada: 3, reaberturas: 0,
    anexos: [],
    respostas: [],
    historico: [evento(ANA, '2026-11-11T08:50:00', 'rascunho', 3)],
    criadoEm: d('2026-11-11T08:50:00'),
  },
]

const rodadasProduto: Rodada[] = [
  {
    numero: 1, quem: ANA, quando: d('2026-11-04T17:45:00'), veredito: 'correcao',
    resumo: 'Testei a barra de pastas na tela do item e na barra lateral, nos 3 idiomas e nos 2 temas. 9 apontamentos; o bloqueante é o da API (#4).',
    retestePedidoEm: d('2026-11-07T18:00:00'), retestePedidoPor: BRUNO,
  },
  {
    numero: 2, quem: ANA, quando: d('2026-11-10T10:00:00'), veredito: 'correcao',
    resumo: 'Reteste: 4 conferidos, 1 reaberto (#2) e 2 novos de texto. O #3 e o #4 continuam sem correção.',
  },
]

const tarefasProduto: TarefaDoItem[] = [
  {
    tarefa: tarefa(901, 'Ajustar textos da tela do item', 'working', BRUNO, 'Rótulos, estados vazios e traduções que o teste apontou.'),
    apontamentos: [
      {
        id: 'tap-1', numero: 1,
        titulo: 'Botão "Guardar progresso" sem tradução em espanhol',
        corpo: '<p><strong>Onde:</strong> painel da tarefa, rodapé.</p><p><strong>Problema:</strong> com a interface em espanhol, o botão continua em português.</p>',
        estado: 'aberto', prioridade: 'normal', responsavel: BRUNO, autor: ANA, rodada: 1, reaberturas: 0,
        anexos: [{ id: 'tan-1', tipo: 'imagem', nome: 'rodape-da-tarefa.jpg', url: printPainelTarefa }],
        respostas: [],
        historico: [evento(ANA, '2026-11-10T11:00:00', 'aberto', 1)],
        criadoEm: d('2026-11-10T11:00:00'),
      },
      {
        id: 'tap-2', numero: 2,
        titulo: 'Placeholder do comentário corta em telas estreitas',
        corpo: '<p><strong>Onde:</strong> aba Comentários da tarefa.</p><p><strong>Problema:</strong> "(@ para mencionar, Ctrl+Enter para enviar)" é cortado abaixo de 1280 px.</p>',
        estado: 'resolvido', prioridade: 'low', responsavel: BRUNO, autor: ANA, rodada: 1, reaberturas: 0,
        anexos: [],
        respostas: [{ id: 'tre-1', autor: BRUNO, quando: d('2026-11-11T09:30:00'), texto: 'Encurtado para "Escreva um comentário...". A dica foi para o tooltip.' }],
        historico: [
          evento(ANA, '2026-11-10T11:04:00', 'aberto', 1),
          evento(BRUNO, '2026-11-11T09:30:00', 'resolvido', 1, 'aberto'),
        ],
        criadoEm: d('2026-11-10T11:04:00'),
      },
    ],
    rodadas: [{ numero: 1, quem: ANA, quando: d('2026-11-10T11:10:00'), veredito: 'correcao', resumo: '2 ajustes de texto da tarefa.' }],
  },
  {
    tarefa: tarefa(902, 'Revisar a migração das pastas ocultas', 'pending', CAIO),
    apontamentos: [],
    rodadas: [],
  },
  {
    tarefa: tarefa(903, 'Atualizar a documentação da tela do item', 'completed', DEBORA),
    apontamentos: [],
    rodadas: [],
  },
]

const itemProduto: Item = {
  id: 47617,
  created_at: d('2026-10-28T14:20:11'),
  updated_at: d('2026-11-11T08:50:42'),
  deleted_at: null,
  reference: 'USE7F2A91C04B8E4D3A9F21C6B0D4E8A',
  request_email: 'produto@empresa-ficticia.example',
  status: 'active',
} as Item

/* ------------------------------------------------------------------ */
/* Cenário 2: jurídico                                                  */
/* ------------------------------------------------------------------ */

const HELENA = 11 // advogada que confere
const RAFAEL = 12 // comercial, resolve com o cliente
const LUCAS = 13 // financeiro

const pessoasJuridico: Pessoa[] = [
  { id: HELENA, nome: 'Helena Prado', iniciais: 'HP' },
  { id: RAFAEL, nome: 'Rafael Couto', iniciais: 'RC' },
  { id: LUCAS, nome: 'Lucas Freire', iniciais: 'LF' },
]

const MODELO_JURIDICO = '<p><strong>Cláusula:</strong> </p><p><strong>Como está:</strong> </p><p><strong>Como deve ficar:</strong> </p>'

const apontamentosJuridico: Apontamento[] = [
  {
    id: 'jap-1', numero: 1,
    titulo: 'Multa por rescisão acima do teto da política',
    corpo: '<p><strong>Cláusula:</strong> 12.3.</p><p><strong>Como está:</strong> multa de 30% sobre o saldo do contrato.</p><p><strong>Como deve ficar:</strong> no máximo 10%, conforme a política comercial vigente.</p>',
    estado: 'resolvido', prioridade: 'high', responsavel: RAFAEL, autor: HELENA, rodada: 1, reaberturas: 0,
    anexos: [{ id: 'jan-1', tipo: 'arquivo', nome: 'minuta-v3-com-marcacoes.docx', tamanho: '186 KB' }],
    respostas: [{ id: 'jre-1', autor: RAFAEL, quando: d('2026-11-09T16:20:00'), texto: 'O cliente aceitou 10%. Minuta v4 anexada.' }],
    historico: [
      evento(HELENA, '2026-11-06T10:00:00', 'aberto', 1),
      evento(RAFAEL, '2026-11-09T16:20:00', 'resolvido', 1, 'aberto'),
    ],
    criadoEm: d('2026-11-06T10:00:00'),
  },
  {
    id: 'jap-2', numero: 2,
    titulo: 'Vigência diverge da proposta comercial',
    corpo: '<p><strong>Cláusula:</strong> 3.1.</p><p><strong>Como está:</strong> 24 meses.</p><p><strong>Como deve ficar:</strong> 12 meses com renovação automática, como na proposta aprovada.</p>',
    estado: 'aberto', prioridade: 'high', responsavel: RAFAEL, autor: HELENA, rodada: 1, reaberturas: 0,
    anexos: [{ id: 'jan-2', tipo: 'arquivo', nome: 'proposta-comercial-aprovada.pdf', tamanho: '412 KB' }],
    respostas: [],
    historico: [evento(HELENA, '2026-11-06T10:06:00', 'aberto', 1)],
    criadoEm: d('2026-11-06T10:06:00'),
  },
  {
    id: 'jap-3', numero: 3,
    titulo: 'Incluir cláusula de tratamento de dados pessoais',
    corpo: '<p><strong>Cláusula:</strong> nova, depois da 14.</p><p><strong>Como está:</strong> o contrato não trata dos dados pessoais que a contratada acessa.</p><p><strong>Como deve ficar:</strong> cláusula padrão de operador de dados, modelo jurídico 2026.</p>',
    estado: 'conferido', prioridade: 'urgent', responsavel: RAFAEL, autor: HELENA, rodada: 1, reaberturas: 0,
    anexos: [],
    respostas: [],
    historico: [
      evento(HELENA, '2026-11-06T10:12:00', 'aberto', 1),
      evento(RAFAEL, '2026-11-08T11:00:00', 'resolvido', 1, 'aberto'),
      evento(HELENA, '2026-11-10T15:30:00', 'conferido', 1, 'resolvido'),
    ],
    criadoEm: d('2026-11-06T10:12:00'),
  },
  {
    id: 'jap-4', numero: 4,
    titulo: 'Índice de reajuste sem data-base',
    corpo: '<p><strong>Cláusula:</strong> 8.2.</p><p><strong>Como está:</strong> reajuste anual pelo IPCA.</p><p><strong>Como deve ficar:</strong> reajuste anual pelo IPCA, com data-base no mês da assinatura.</p>',
    estado: 'aberto', prioridade: 'normal', responsavel: LUCAS, autor: HELENA, rodada: 1, reaberturas: 0,
    anexos: [],
    respostas: [],
    historico: [evento(HELENA, '2026-11-06T10:20:00', 'aberto', 1)],
    criadoEm: d('2026-11-06T10:20:00'),
  },
  {
    id: 'jap-5', numero: 5,
    titulo: 'Anexo II sem rubrica do representante',
    corpo: '<p><strong>Cláusula:</strong> Anexo II, escopo dos serviços.</p><p><strong>Como está:</strong> as páginas 2 a 4 estão sem rubrica.</p><p><strong>Como deve ficar:</strong> todas as páginas rubricadas na versão final.</p>',
    estado: 'aberto', prioridade: 'low', responsavel: RAFAEL, autor: HELENA, rodada: 1, reaberturas: 0,
    anexos: [],
    respostas: [],
    historico: [evento(HELENA, '2026-11-06T10:25:00', 'aberto', 1)],
    criadoEm: d('2026-11-06T10:25:00'),
  },
]

const rodadasJuridico: Rodada[] = [
  {
    numero: 1, quem: HELENA, quando: d('2026-11-06T10:30:00'), veredito: 'correcao',
    resumo: 'Minuta v3 revisada. 5 pendências; a da multa (#1) e a de dados pessoais (#3) impedem a assinatura.',
  },
]

const itemJuridico: Item = {
  id: 52210,
  created_at: d('2026-11-03T09:00:00'),
  updated_at: d('2026-11-10T15:30:00'),
  deleted_at: null,
  reference: 'CON4B19E2A77C3F4E0B8D52A1C9E07F6',
  request_email: 'contratos@empresa-ficticia.example',
  status: 'active',
} as Item

/* ------------------------------------------------------------------ */
/* Os cenários                                                          */
/* ------------------------------------------------------------------ */

export const cenarios: Record<Cenario['id'], Cenario> = {
  produto: {
    id: 'produto',
    workspace: { name: 'Desenvolvimento', reference: 'desenvolvimento' },
    categoria: { slug: 'demandas', name: 'Demandas', icone: 'i-lucide-lightbulb' },
    item: itemProduto,
    titulo: 'Pastas do item com cara de aba',
    config: {
      nome: 'Retorno de testes',
      icone: 'i-lucide-list-checks',
      exigeConferencia: true,
      conferente: 'autor',
      modelo: MODELO_PRODUTO,
      responsavelPadrao: BRUNO,
      travaConclusao: true,
      rotulos: { resolvido: 'Corrigido' },
    },
    pessoas: pessoasProduto,
    conferente: ANA,
    resolvedor: BRUNO,
    apontamentos: apontamentosProduto,
    rodadas: rodadasProduto,
    tarefas: tarefasProduto,
    categoriasDoMenu: [{ nome: 'Demandas', ativo: true }, { nome: 'Bugs' }, { nome: 'Releases' }],
  },
  juridico: {
    id: 'juridico',
    workspace: { name: 'Jurídico Consultivo', reference: 'juridico-consultivo' },
    categoria: { slug: 'contratos', name: 'Contratos', icone: 'i-lucide-file-signature' },
    item: itemJuridico,
    titulo: 'Prestação de serviços de manutenção',
    config: {
      nome: 'Pendências do contrato',
      icone: 'i-lucide-scale',
      exigeConferencia: true,
      conferente: 'autor',
      modelo: MODELO_JURIDICO,
      responsavelPadrao: RAFAEL,
      travaConclusao: true,
      rotulos: { resolvido: 'Ajustado' },
    },
    pessoas: pessoasJuridico,
    conferente: HELENA,
    resolvedor: RAFAEL,
    apontamentos: apontamentosJuridico,
    rodadas: rodadasJuridico,
    tarefas: [
      { tarefa: { ...tarefa(911, 'Colher assinaturas', 'pending', RAFAEL), workspace: 'juridico-consultivo', item: 52210 }, apontamentos: [], rodadas: [] },
    ],
    categoriasDoMenu: [{ nome: 'Contratos', ativo: true }, { nome: 'Procurações' }, { nome: 'Processos' }],
  },
}

/** As 6 pastas que o item já tem no develop, na ordem da tela. A de Apontamentos entra depois delas. */
export const pastasDoSistema = [
  { id: 'visao-geral', icone: 'i-lucide-layers' },
  { id: 'comentarios', icone: 'i-lucide-message-circle' },
  { id: 'logs', icone: 'i-lucide-shield-check' },
  { id: 'tarefas', icone: 'i-lucide-clipboard-check' },
  { id: 'anexos', icone: 'i-lucide-paperclip' },
  { id: 'notas', icone: 'i-lucide-file-text' },
] as const

/** Os 14 tipos que o modal "Nova pasta" lista hoje, na ordem da tela, mais o novo. */
export const tiposDePasta = [
  'apontamentos', 'tarefas', 'fluxos', 'integracoes', 'anexos', 'emailsAutomaticos', 'mailBox', 'notas',
  'avaliacao', 'campos', 'documento', 'formulario', 'telaCustomizada', 'relacionamentoMultiplo', 'repetidor',
] as const
export type TipoDePasta = typeof tiposDePasta[number]
