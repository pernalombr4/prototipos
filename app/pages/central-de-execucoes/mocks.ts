/**
 * O dado do protótipo "Central de execuções do Spaceflow". Fictício, tipado pelo SDK, sem API.
 *
 * Estrutura tirada do develop em 24/10/2026 (workspace de exploração, fluxo 524) e do
 * `enspace-sdk-schemas`: o fluxo é um `Workflow`, a execução é um `WorkflowExecution`, o item é
 * um `Item`. O que a proposta acrescenta vai marcado com PROPOSTA:
 * - `Fluxo.dono`: hoje o fluxo tem criador, não dono. A operação mora em `operacoes.ts`;
 * - `Execucao.input.workflow_timeline.lineage`: o campo existe e vem vazio na execução manual.
 *   Aqui ele leva os ids das execuções que causaram esta, da origem para a mais próxima
 *   (formato proposto, pergunta P1 do relatório);
 * - `Execucao.raiz`: o item de origem da cadeia (o contrato), herdado ao longo dela;
 * - `Execucao.gravou`: os itens que a execução criou ou editou (pergunta P4);
 * - `ItemDoMock.criado_por_execucao`: a execução que criou o item (pergunta P4);
 * - 4 status que o schema não tem (`queued`, `skipped`, `held`, `stopped`), os mesmos do
 *   protótipo `protecoes-do-spaceflow`.
 *
 * Os dados nascem de uma simulação de 15 dias: pessoas criam itens, o evento de cada item dispara
 * os fluxos que o escutam, e o que cada fluxo grava dispara os seguintes. É assim que a cadeia do
 * mock tem a mesma forma da cadeia real. A semente é fixa: recarregar dá os mesmos dados.
 *
 * Empresas, pessoas, itens e números são inventados. Nomes de fluxo, categoria e item são dado do
 * workspace: não se traduzem.
 */
import type { Item, Workflow, WorkflowExecution } from '@be-enlighten/enspace-sdk-schemas'

/** O "agora" do protótipo. Fixo, para os horários não mudarem. */
export const AGORA = new Date(2026, 9, 24, 16, 40)

export const workspace = { nome: 'Grupo Aurora', slug: 'grupo-aurora' }

const MIN = 60_000
const HORA = 60 * MIN
const DIA = 24 * HORA
const AGORA_MS = AGORA.getTime()
export const DIAS_SIMULADOS = 15

/* ------------------------------------------------------------------ *
 * Categorias                                              *
 * ------------------------------------------------------------------ */

export type CategoriaId =
  | 'contratos' | 'andamentos' | 'documentos' | 'aditivos' | 'pagamentos'
  | 'pedidos' | 'cotacoes' | 'notas'
  | 'chamados' | 'interacoes'
  | 'admissoes' | 'docPessoais' | 'acessos'

export interface Categoria {
  id: CategoriaId
  /** Como aparece no menu. */
  nome: string
  singular: string
  genero: 'm' | 'f'
  prefixo: string
  icone: string
}

export const categorias: Record<CategoriaId, Categoria> = {
  contratos: { id: 'contratos', nome: 'Contratos', singular: 'Contrato', genero: 'm', prefixo: 'CTR', icone: 'i-lucide-file-signature' },
  andamentos: { id: 'andamentos', nome: 'Andamentos', singular: 'Andamento', genero: 'm', prefixo: 'AND', icone: 'i-lucide-list-checks' },
  documentos: { id: 'documentos', nome: 'Documentos', singular: 'Documento', genero: 'm', prefixo: 'DOC', icone: 'i-lucide-file-text' },
  aditivos: { id: 'aditivos', nome: 'Aditivos', singular: 'Aditivo', genero: 'm', prefixo: 'ADT', icone: 'i-lucide-file-plus' },
  pagamentos: { id: 'pagamentos', nome: 'Pagamentos', singular: 'Pagamento', genero: 'm', prefixo: 'PAG', icone: 'i-lucide-banknote' },
  pedidos: { id: 'pedidos', nome: 'Pedidos de compra', singular: 'Pedido de compra', genero: 'm', prefixo: 'PED', icone: 'i-lucide-shopping-cart' },
  cotacoes: { id: 'cotacoes', nome: 'Cotações', singular: 'Cotação', genero: 'f', prefixo: 'COT', icone: 'i-lucide-scale' },
  notas: { id: 'notas', nome: 'Notas fiscais', singular: 'Nota fiscal', genero: 'f', prefixo: 'NF', icone: 'i-lucide-receipt' },
  chamados: { id: 'chamados', nome: 'Chamados', singular: 'Chamado', genero: 'm', prefixo: 'CHA', icone: 'i-lucide-headset' },
  interacoes: { id: 'interacoes', nome: 'Interações', singular: 'Interação', genero: 'f', prefixo: 'INT', icone: 'i-lucide-messages-square' },
  admissoes: { id: 'admissoes', nome: 'Admissões', singular: 'Admissão', genero: 'f', prefixo: 'ADM', icone: 'i-lucide-user-plus' },
  docPessoais: { id: 'docPessoais', nome: 'Documentos pessoais', singular: 'Documento pessoal', genero: 'm', prefixo: 'DPS', icone: 'i-lucide-id-card' },
  acessos: { id: 'acessos', nome: 'Acessos', singular: 'Acesso', genero: 'm', prefixo: 'ACE', icone: 'i-lucide-key-round' },
}

export const pessoas = ['Ana Souza', 'Bruno Lima', 'Carla Mendes', 'Diego Rocha', 'Elisa Prado', 'Fábio Nunes', 'Gabriela Torres']

/* ------------------------------------------------------------------ *
 * Os fluxos                                                           *
 * ------------------------------------------------------------------ */

export type Acao = 'create' | 'update' | 'delete'
export interface Evento { categoria: CategoriaId, acao: Acao }

/** O gatilho, como o nó Início grava: `type` e, no evento, `scope` (categoria) e `action`. */
export type Gatilho =
  | { tipo: 'events', categoria: CategoriaId, acao: Acao }
  | { tipo: 'cron', rotulo: string }
  | { tipo: 'webhook' }
  | { tipo: 'mailbox' }
  | { tipo: 'manual' }

type TipoDeNo = NonNullable<WorkflowExecution['nodes']>[number]['type']
export type CausaId = 'credencial' | 'tempo' | 'ia' | 'email' | 'permissao'
export type Espera = 'tarefa' | 'atraso'

/** O que a configuração diz que o fluxo grava. Com `condicao`, só grava quando ela bate. */
export interface Gravado extends Evento { condicao?: string }

/** O que o fluxo grava. Vem dos nós de criar e editar item (`crud`) da definição do fluxo. */
interface Gravacao extends Evento {
  /** Em qual item: um novo, o mesmo do gatilho ou o item "pai" (relação). */
  alvo: 'novo' | 'mesmo' | 'pai'
  quantos?: number
  /** A condição do nó, quando ele não grava sempre. */
  quando?: (item: ItemDoMock, ctx: Contexto) => boolean
  /** O rótulo da condição, como no canvas. Com ela, a ligação no mapa é "possível". */
  condicao?: string
  /** O campo que decide a categoria, quando o nó não tem categoria fixa. O mapa não sabe qual é. */
  porVariavel?: string
  /** O que muda no item gravado, para a simulação seguir. */
  efeito?: (alvo: ItemDoMock, ctx: Contexto) => void
  titulo?: (pai: ItemDoMock, k: number) => string
}

export interface Fluxo extends Pick<Workflow, 'id' | 'name' | 'description' | 'status' | 'version' | 'reference' | 'created_at'> {
  /** PROPOSTA: hoje o fluxo tem criador, não dono. */
  dono: string
  gatilho: Gatilho
  /** Os nós do fluxo, na ordem do caminho principal (rótulos como no canvas). */
  nos: { tipo: TipoDeNo, rotulo: string }[]
  /** Ligações configuradas: o que os nós de criar e editar gravam. Base do mapa. */
  grava: Gravado[]
  /** O nó que grava numa categoria definida por um campo: a configuração não diz qual. */
  gravaPorVariavel?: { no: string, campo: string }
  /** Pausa até uma pessoa concluir uma tarefa, ou por tempo. */
  espera?: Espera
  /** Quem não tem permissão neste fluxo, no cenário "Acesso parcial". */
  restrito?: boolean
}

interface DefinicaoDoFluxo extends Fluxo {
  gravacoes: Gravacao[]
  /** Quando o fluxo de fato age; fora disso ele roda e termina sem gravar nada. */
  atua?: (item: ItemDoMock | undefined, ctx: Contexto) => boolean
  falha?: { taxa: number, desdeHoras?: number, causa: CausaId, no: number }
  /** O que acontece depois (resposta por webhook que chega horas mais tarde). */
  depois?: (exec: Execucao, item: ItemDoMock | undefined, fim: number) => void
}

/* ------------------------------------------------------------------ *
 * Itens e execuções                                                   *
 * ------------------------------------------------------------------ */

export interface ItemDoMock extends Pick<Item, 'id' | 'reference' | 'created_at'> {
  categoria: CategoriaId
  /** O valor do campo de título da categoria. */
  titulo: string
  /** O campo de relação com o item principal (o contrato do andamento, o pedido da cotação). */
  pai?: number
  /** PROPOSTA (P4): a execução que criou o item, quando foi um fluxo. */
  criado_por_execucao?: number
  criado_por_pessoa?: string
  /** Estado interno da simulação. Não aparece na tela. */
  _fase?: string
  _marcas?: Set<string>
}

export type StatusDaExecucao = WorkflowExecution['status'] | 'queued' | 'skipped' | 'held' | 'stopped'
export type MotivoDaParada = 'cadeia' | 'limitePorMinuto'

export type Disparo =
  | { tipo: 'evento', evento: Evento, pessoa?: string, porExecucao?: number }
  | { tipo: 'manual', pessoa: string }
  | { tipo: 'agendamento', rotulo: string }
  | { tipo: 'webhook' }
  | { tipo: 'email' }

export interface Execucao extends Omit<WorkflowExecution, 'status' | 'input' | 'output' | 'nodes' | 'edges'> {
  status: StatusDaExecucao
  input: {
    triggered_by: { nome: string } | null
    /** PROPOSTA (P1): as execuções que causaram esta, da origem para a mais próxima. */
    workflow_timeline: { lineage: number[] }
  }
  output: Record<string, unknown> | null
  /** Derivado do nó Início e do `triggered_by`. */
  disparo: Disparo
  /** PROPOSTA: o item de origem da cadeia. */
  raiz: number | undefined
  /** PROPOSTA (P4): o que a execução gravou. */
  gravou: { item: number, acao: Acao }[]
  esperando?: Espera
  causa?: CausaId
  motivo?: MotivoDaParada
  /** Quantos nós rodaram, e em qual parou (erro). */
  nos_executados: number
  no_com_erro?: number
  duracao_ms: number
  /** Para a simulação forçar o caso de exemplo. */
  _forcas?: Record<number, 'ok' | 'erro' | 'espera' | 'repetir'>
}

interface Contexto { exec: Execucao, raiz: ItemDoMock | undefined, forcas?: Execucao['_forcas'] }

/* ------------------------------------------------------------------ *
 * Sorteio com semente fixa                                            *
 * ------------------------------------------------------------------ */

function mulberry32(semente: number) {
  let a = semente
  return () => {
    a |= 0
    a = (a + 0x6D2B79F5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const rnd = mulberry32(20261024)
const entre = (a: number, b: number) => a + rnd() * (b - a)
const sorteia = <T>(lista: T[]) => lista[Math.floor(rnd() * lista.length)]!
const LETRAS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
const referenciaAleatoria = () => Array.from({ length: 18 }, () => LETRAS[Math.floor(rnd() * LETRAS.length)]).join('')

const empresas = ['Alfa Engenharia', 'Brisa Logística', 'Cedro Alimentos', 'Delta Saúde', 'Estrela Têxtil', 'Faro Tecnologia', 'Gaia Energia', 'Horizonte Seguros', 'Ipê Construções', 'Jade Cosméticos', 'Lumen Educação', 'Monte Verde Agro']
const tiposDeContrato = ['Prestação de serviços', 'Fornecimento', 'Locação de equipamentos', 'Licença de software', 'Consultoria']
const pedidosDeCompra = ['Notebooks para o Comercial', 'Cadeiras para a sede', 'Licenças de design', 'Uniformes da operação', 'Material de escritório', 'Servidor de arquivos', 'Treinamento de líderes']
const assuntos = ['Segunda via de boleto', 'Erro ao acessar o portal', 'Alteração de endereço de entrega', 'Dúvida sobre a fatura de outubro', 'Cancelamento de pedido', 'Pedido entregue com avaria', 'Troca de titularidade']
const nomesDeAdmissao = ['Lucas Andrade', 'Marina Couto', 'Otávio Reis', 'Paula Siqueira', 'Renan Duarte', 'Sofia Bastos', 'Tales Moura', 'Vitória Leme']

/* ------------------------------------------------------------------ *
 * Os 38 fluxos, nas 4 áreas do workspace                              *
 * ------------------------------------------------------------------ */

const marca = (i: ItemDoMock, m: string) => { (i._marcas ??= new Set()).add(m) }
const tem = (i: ItemDoMock | undefined, m: string) => !!i?._marcas?.has(m)

let itens: ItemDoMock[] = []
const porId = new Map<number, ItemDoMock>()
const filhos = (pai: ItemDoMock, cat: CategoriaId) => itens.filter(i => i.pai === pai.id && i.categoria === cat)
const paiDe = (i: ItemDoMock) => (i.pai ? porId.get(i.pai) : undefined)

function definicao(f: Omit<DefinicaoDoFluxo, 'grava' | 'status' | 'version' | 'reference' | 'created_at' | 'description'> & { description: string, version?: string }): DefinicaoDoFluxo {
  return {
    ...f,
    status: 'active',
    version: f.version ?? '1.0.0',
    reference: `wf-${f.id}`,
    created_at: new Date(2026, 6, 1 + (f.id % 60)),
    grava: f.gravacoes.filter(g => !g.porVariavel).map(({ categoria, acao, condicao }) => (condicao ? { categoria, acao, condicao } : { categoria, acao })),
    gravaPorVariavel: f.gravacoes.filter(g => g.porVariavel).map(g => ({ no: f.nos.find(n => n.tipo === 'crud' && n.rotulo.startsWith('Criar item'))?.rotulo ?? '', campo: g.porVariavel! }))[0],
  }
}

const definicoes: DefinicaoDoFluxo[] = [
  /* ---------------- Gestão de contratos (14) ---------------- */
  definicao({
    id: 512, name: 'Registrar andamento inicial', dono: 'Ana Souza',
    description: 'Cria o primeiro andamento de todo contrato novo.',
    gatilho: { tipo: 'events', categoria: 'contratos', acao: 'create' },
    nos: [{ tipo: 'crud', rotulo: 'Criar andamento' }],
    gravacoes: [{ categoria: 'andamentos', acao: 'create', alvo: 'novo', titulo: p => `Andamento inicial do ${p.reference}` }],
  }),
  definicao({
    id: 513, name: 'Classificar andamento', dono: 'Ana Souza',
    description: 'Define o tipo e o prazo do andamento.',
    gatilho: { tipo: 'events', categoria: 'andamentos', acao: 'create' },
    nos: [{ tipo: 'conditionals', rotulo: 'Tipo do contrato' }, { tipo: 'crud', rotulo: 'Atualizar andamento' }],
    gravacoes: [{ categoria: 'andamentos', acao: 'update', alvo: 'mesmo' }],
  }),
  definicao({
    id: 514, name: 'Notificar responsável do andamento', dono: 'Bruno Lima',
    description: 'Avisa o responsável e registra a última movimentação no contrato.',
    gatilho: { tipo: 'events', categoria: 'andamentos', acao: 'update' },
    nos: [{ tipo: 'email', rotulo: 'Avisar responsável' }, { tipo: 'crud', rotulo: 'Atualizar contrato' }],
    gravacoes: [{
      categoria: 'contratos', acao: 'update', alvo: 'pai',
      quando: i => !tem(i, 'notificado'),
      condicao: 'Contrato ainda sem aviso?',
      efeito: (_c, ctx) => { if (ctx.exec.item) marca(porId.get(ctx.exec.item)!, 'notificado') },
    }],
  }),
  definicao({
    id: 515, name: 'Recalcular prazo do andamento', dono: 'Bruno Lima',
    description: 'Recalcula o prazo quando o andamento muda.',
    gatilho: { tipo: 'events', categoria: 'andamentos', acao: 'update' },
    nos: [{ tipo: 'conditionals', rotulo: 'Prazo mudou?' }, { tipo: 'crud', rotulo: 'Atualizar prazo' }],
    gravacoes: [{ categoria: 'andamentos', acao: 'update', alvo: 'mesmo', condicao: 'Prazo mudou?', quando: (_i, ctx) => ctx.forcas?.[515] === 'repetir' || rnd() < 0.04 }],
  }),
  definicao({
    id: 516, name: 'Atualizar situação do contrato', dono: 'Ana Souza',
    description: 'Move o contrato de fase e pede a minuta quando ele é novo.',
    gatilho: { tipo: 'events', categoria: 'contratos', acao: 'update' },
    nos: [{ tipo: 'conditionals', rotulo: 'Fase do contrato' }, { tipo: 'crud', rotulo: 'Criar documento' }],
    atua: i => i?._fase === 'novo',
    gravacoes: [{
      categoria: 'documentos', acao: 'create', alvo: 'novo', titulo: p => `Minuta do ${p.reference}`,
      efeito: (_d, ctx) => { if (ctx.exec.item) porId.get(ctx.exec.item)!._fase = 'minuta' },
    }],
  }),
  definicao({
    id: 517, name: 'Gerar minuta', dono: 'Gabriela Torres', espera: 'tarefa',
    description: 'Escreve a minuta com IA e pede a revisão do jurídico.',
    gatilho: { tipo: 'events', categoria: 'documentos', acao: 'create' },
    nos: [{ tipo: 'ai_generate', rotulo: 'Escrever minuta' }, { tipo: 'task', rotulo: 'Revisar minuta' }, { tipo: 'crud', rotulo: 'Marcar como revisada' }],
    gravacoes: [{ categoria: 'documentos', acao: 'update', alvo: 'mesmo' }],
  }),
  definicao({
    id: 518, name: 'Enviar para assinatura', dono: 'Gabriela Torres',
    description: 'Envia a minuta revisada ao assinador digital.',
    gatilho: { tipo: 'events', categoria: 'documentos', acao: 'update' },
    nos: [{ tipo: 'http', rotulo: 'Enviar ao assinador' }, { tipo: 'email', rotulo: 'Avisar signatários' }],
    gravacoes: [],
    falha: { taxa: 0.8, desdeHoras: 52, causa: 'credencial', no: 0 },
    depois: (_e, doc, fim) => {
      const contrato = doc && paiDe(doc)
      if (!contrato || rnd() > 0.8) return
      contrato._fase = 'assinatura'
      agendados.push(() => rodar(fluxo(519), fim + entre(2, 20) * HORA, { tipo: 'webhook' }, contrato))
    },
  }),
  definicao({
    id: 519, name: 'Registrar assinatura', dono: 'Gabriela Torres',
    description: 'Recebe o aviso do assinador e marca o contrato como assinado.',
    gatilho: { tipo: 'webhook' },
    nos: [{ tipo: 'crud', rotulo: 'Marcar contrato assinado' }],
    gravacoes: [{ categoria: 'contratos', acao: 'update', alvo: 'mesmo', efeito: c => { c._fase = 'assinado' } }],
  }),
  definicao({
    id: 524, name: 'Aviso de vencimento de contrato', dono: 'Ana Souza',
    description: 'Todo dia, avisa os contratos que vencem em 30 dias.',
    gatilho: { tipo: 'cron', rotulo: '08:00' },
    nos: [{ tipo: 'crud', rotulo: 'Buscar contratos' }, { tipo: 'email', rotulo: 'Avisar gestores' }],
    gravacoes: [],
  }),
  definicao({
    id: 520, name: 'Renovação automática', dono: 'Ana Souza',
    description: 'Todo dia, cria o aditivo dos contratos com renovação automática.',
    gatilho: { tipo: 'cron', rotulo: '08:05' },
    nos: [{ tipo: 'crud', rotulo: 'Buscar contratos' }, { tipo: 'crud', rotulo: 'Criar item' }],
    atua: i => !!i,
    gravacoes: [{ categoria: 'aditivos', acao: 'create', alvo: 'novo', porVariavel: 'Tipo de renovação', titulo: p => `Aditivo de renovação do ${p.reference}` }],
  }),
  definicao({
    id: 521, name: 'Aprovar aditivo', dono: 'Fábio Nunes', espera: 'tarefa',
    description: 'Pede a aprovação do gestor e atualiza o contrato.',
    gatilho: { tipo: 'events', categoria: 'aditivos', acao: 'create' },
    nos: [{ tipo: 'approval', rotulo: 'Aprovação do gestor' }, { tipo: 'crud', rotulo: 'Atualizar contrato' }],
    gravacoes: [{ categoria: 'contratos', acao: 'update', alvo: 'pai' }],
  }),
  definicao({
    id: 522, name: 'Programar pagamentos', dono: 'Fábio Nunes',
    description: 'Cria as parcelas quando o contrato é assinado.',
    gatilho: { tipo: 'events', categoria: 'contratos', acao: 'update' },
    nos: [{ tipo: 'conditionals', rotulo: 'Contrato assinado?' }, { tipo: 'crud', rotulo: 'Criar parcelas' }],
    atua: i => i?._fase === 'assinado' && !tem(i, 'pagamentos'),
    gravacoes: [{
      categoria: 'pagamentos', acao: 'create', alvo: 'novo', quantos: 3, condicao: 'Contrato assinado?', titulo: (p, k) => `Parcela ${k} do ${p.reference}`,
      efeito: (_p, ctx) => { if (ctx.exec.item) marca(porId.get(ctx.exec.item)!, 'pagamentos') },
    }],
  }),
  definicao({
    id: 523, name: 'Conferir pagamento', dono: 'Fábio Nunes',
    description: 'Lê o boleto com IA e confere o valor com o contrato.',
    gatilho: { tipo: 'events', categoria: 'pagamentos', acao: 'create' },
    nos: [{ tipo: 'ai_extract', rotulo: 'Ler boleto' }, { tipo: 'crud', rotulo: 'Atualizar parcela' }],
    gravacoes: [{ categoria: 'pagamentos', acao: 'update', alvo: 'mesmo' }],
    falha: { taxa: 0.08, causa: 'ia', no: 0 },
  }),
  definicao({
    id: 525, name: 'Encerrar contrato', dono: 'Ana Souza',
    description: 'Encerra o contrato a pedido do gestor.',
    gatilho: { tipo: 'manual' },
    nos: [{ tipo: 'form', rotulo: 'Motivo do encerramento' }, { tipo: 'crud', rotulo: 'Encerrar contrato' }],
    gravacoes: [{ categoria: 'contratos', acao: 'update', alvo: 'mesmo', efeito: c => { c._fase = 'encerrado' } }],
  }),

  /* ---------------- Compras (9) ---------------- */
  definicao({
    id: 530, name: 'Abrir cotações do pedido', dono: 'Diego Rocha',
    description: 'Cria 3 cotações para todo pedido de compra novo.',
    gatilho: { tipo: 'events', categoria: 'pedidos', acao: 'create' },
    nos: [{ tipo: 'crud', rotulo: 'Criar cotações' }],
    gravacoes: [{ categoria: 'cotacoes', acao: 'create', alvo: 'novo', quantos: 3, titulo: (p, k) => `Cotação ${k} do ${p.reference}` }],
  }),
  definicao({
    id: 531, name: 'Pedir preço ao fornecedor', dono: 'Diego Rocha',
    description: 'Envia a cotação ao portal do fornecedor.',
    gatilho: { tipo: 'events', categoria: 'cotacoes', acao: 'create' },
    nos: [{ tipo: 'http', rotulo: 'Enviar ao portal' }, { tipo: 'email', rotulo: 'Avisar fornecedor' }],
    gravacoes: [],
    falha: { taxa: 0.1, causa: 'tempo', no: 0 },
    depois: (_e, cot, fim) => {
      if (!cot || rnd() > 0.85) return
      agendados.push(() => rodar(fluxo(532), fim + entre(1, 30) * HORA, { tipo: 'webhook' }, cot))
    },
  }),
  definicao({
    id: 532, name: 'Receber resposta do fornecedor', dono: 'Diego Rocha',
    description: 'Grava o preço que o fornecedor respondeu pelo portal.',
    gatilho: { tipo: 'webhook' },
    nos: [{ tipo: 'crud', rotulo: 'Gravar preço' }],
    gravacoes: [{ categoria: 'cotacoes', acao: 'update', alvo: 'mesmo', efeito: c => marca(c, 'respondida') }],
  }),
  definicao({
    id: 533, name: 'Comparar cotações', dono: 'Diego Rocha',
    description: 'Quando as 3 cotações chegam, escolhe a melhor e manda para aprovação.',
    gatilho: { tipo: 'events', categoria: 'cotacoes', acao: 'update' },
    nos: [{ tipo: 'conditionals', rotulo: 'Todas responderam?' }, { tipo: 'ai_generate', rotulo: 'Resumo da comparação' }, { tipo: 'crud', rotulo: 'Atualizar pedido' }],
    atua: i => { const p = i && paiDe(i); return !!p && !tem(p, 'comparado') && filhos(p, 'cotacoes').every(c => tem(c, 'respondida')) },
    gravacoes: [{ categoria: 'pedidos', acao: 'update', alvo: 'pai', efeito: p => { marca(p, 'comparado'); p._fase = 'aprovacao' } }],
  }),
  definicao({
    id: 534, name: 'Aprovar compra', dono: 'Fábio Nunes', espera: 'tarefa',
    description: 'Pede a aprovação do gestor da área.',
    gatilho: { tipo: 'events', categoria: 'pedidos', acao: 'update' },
    nos: [{ tipo: 'approval', rotulo: 'Aprovação do gestor' }, { tipo: 'crud', rotulo: 'Marcar como aprovado' }],
    atua: i => i?._fase === 'aprovacao',
    gravacoes: [{ categoria: 'pedidos', acao: 'update', alvo: 'mesmo', efeito: p => { p._fase = 'aprovado' } }],
  }),
  definicao({
    id: 535, name: 'Emitir pedido ao fornecedor', dono: 'Diego Rocha',
    description: 'Envia o pedido aprovado ao fornecedor escolhido.',
    gatilho: { tipo: 'events', categoria: 'pedidos', acao: 'update' },
    nos: [{ tipo: 'conditionals', rotulo: 'Aprovado?' }, { tipo: 'email', rotulo: 'Enviar pedido' }],
    atua: i => (i?._fase === 'aprovado' && !tem(i, 'emitido') ? (marca(i, 'emitido'), true) : false),
    gravacoes: [],
  }),
  definicao({
    id: 536, name: 'Lançar nota fiscal', dono: 'Diego Rocha',
    description: 'Cria a nota fiscal a partir do e-mail do fornecedor.',
    gatilho: { tipo: 'mailbox' },
    nos: [{ tipo: 'ai_extract', rotulo: 'Ler anexo' }, { tipo: 'crud', rotulo: 'Criar nota fiscal' }],
    gravacoes: [{ categoria: 'notas', acao: 'create', alvo: 'novo', titulo: () => `NF ${Math.floor(entre(10000, 99999))} ${sorteia(empresas)}` }],
  }),
  definicao({
    id: 537, name: 'Conferir nota com o pedido', dono: 'Diego Rocha',
    description: 'Confere a nota com o pedido aprovado e fecha a compra.',
    gatilho: { tipo: 'events', categoria: 'notas', acao: 'create' },
    nos: [{ tipo: 'ai_extract', rotulo: 'Comparar valores' }, { tipo: 'crud', rotulo: 'Fechar pedido' }],
    gravacoes: [{ categoria: 'pedidos', acao: 'update', alvo: 'pai', condicao: 'Nota tem pedido vinculado?', quando: i => !!i.pai }],
    falha: { taxa: 0.1, causa: 'ia', no: 0 },
  }),
  definicao({
    id: 538, name: 'Relatório semanal de compras', dono: 'Diego Rocha',
    description: 'Toda segunda, envia o resumo das compras da semana.',
    gatilho: { tipo: 'cron', rotulo: 'segunda, 07:00' },
    nos: [{ tipo: 'crud', rotulo: 'Buscar pedidos' }, { tipo: 'email', rotulo: 'Enviar resumo' }],
    gravacoes: [],
  }),

  /* ---------------- Atendimento ao cliente (8) ---------------- */
  definicao({
    id: 540, name: 'Abrir chamado pelo e-mail', dono: 'Carla Mendes',
    description: 'Cria um chamado para cada e-mail que chega no suporte.',
    gatilho: { tipo: 'mailbox' },
    nos: [{ tipo: 'crud', rotulo: 'Criar chamado' }],
    gravacoes: [{ categoria: 'chamados', acao: 'create', alvo: 'novo', titulo: () => sorteia(assuntos) }],
  }),
  definicao({
    id: 541, name: 'Classificar chamado com IA', dono: 'Carla Mendes',
    description: 'Lê o chamado, define a área e a prioridade.',
    gatilho: { tipo: 'events', categoria: 'chamados', acao: 'create' },
    nos: [{ tipo: 'ai_router', rotulo: 'Escolher área' }, { tipo: 'crud', rotulo: 'Atualizar chamado' }],
    gravacoes: [{ categoria: 'chamados', acao: 'update', alvo: 'mesmo', efeito: c => { c._fase = 'classificado' } }],
    falha: { taxa: 0.03, causa: 'ia', no: 0 },
  }),
  definicao({
    id: 542, name: 'Atribuir responsável', dono: 'Carla Mendes', espera: 'tarefa',
    description: 'Cria a tarefa de atendimento para a área escolhida.',
    gatilho: { tipo: 'events', categoria: 'chamados', acao: 'update' },
    nos: [{ tipo: 'task', rotulo: 'Atender chamado' }, { tipo: 'crud', rotulo: 'Registrar resposta' }],
    atua: i => i?._fase === 'classificado',
    gravacoes: [{
      categoria: 'interacoes', acao: 'create', alvo: 'novo', titulo: p => `Resposta ao ${p.reference}`,
      efeito: (_x, ctx) => { if (ctx.exec.item) porId.get(ctx.exec.item)!._fase = 'atendido' },
    }],
  }),
  definicao({
    id: 543, name: 'Responder cliente', dono: 'Carla Mendes',
    description: 'Envia a resposta da interação ao cliente.',
    gatilho: { tipo: 'events', categoria: 'interacoes', acao: 'create' },
    nos: [{ tipo: 'email', rotulo: 'Enviar resposta' }],
    gravacoes: [],
    falha: { taxa: 0.05, causa: 'email', no: 0 },
  }),
  definicao({
    id: 544, name: 'Escalar chamado parado', dono: 'Carla Mendes',
    description: 'A cada 4 horas, escala os chamados sem resposta há mais de 1 dia.',
    gatilho: { tipo: 'cron', rotulo: 'a cada 4 horas' },
    nos: [{ tipo: 'crud', rotulo: 'Buscar chamados' }, { tipo: 'crud', rotulo: 'Escalar chamado' }],
    gravacoes: [{ categoria: 'chamados', acao: 'update', alvo: 'mesmo' }],
  }),
  definicao({
    id: 545, name: 'Registrar interação do cliente', dono: 'Carla Mendes',
    description: 'Grava a mensagem que o cliente mandou pelo chat.',
    gatilho: { tipo: 'webhook' },
    nos: [{ tipo: 'crud', rotulo: 'Criar interação' }],
    gravacoes: [{ categoria: 'interacoes', acao: 'create', alvo: 'novo', titulo: p => `Mensagem no ${p.reference}` }],
  }),
  definicao({
    id: 546, name: 'Encerrar chamado', dono: 'Carla Mendes',
    description: 'Encerra o chamado resolvido.',
    gatilho: { tipo: 'manual' },
    nos: [{ tipo: 'form', rotulo: 'Solução aplicada' }, { tipo: 'crud', rotulo: 'Encerrar chamado' }],
    gravacoes: [{ categoria: 'chamados', acao: 'update', alvo: 'mesmo', efeito: c => { c._fase = 'encerrado' } }],
  }),
  definicao({
    id: 547, name: 'Enviar pesquisa de satisfação', dono: 'Carla Mendes',
    description: 'Envia a pesquisa quando o chamado é encerrado.',
    gatilho: { tipo: 'events', categoria: 'chamados', acao: 'update' },
    nos: [{ tipo: 'conditionals', rotulo: 'Encerrado?' }, { tipo: 'email', rotulo: 'Enviar pesquisa' }],
    atua: i => (i?._fase === 'encerrado' && !tem(i, 'pesquisa') ? (marca(i, 'pesquisa'), true) : false),
    gravacoes: [],
  }),

  /* ---------------- Admissão de pessoas (7) ---------------- */
  definicao({
    id: 550, name: 'Iniciar admissão', dono: 'Elisa Prado', restrito: true,
    description: 'Cria a lista de documentos da pessoa admitida.',
    gatilho: { tipo: 'events', categoria: 'admissoes', acao: 'create' },
    nos: [{ tipo: 'crud', rotulo: 'Criar documentos' }],
    gravacoes: [{ categoria: 'docPessoais', acao: 'create', alvo: 'novo', quantos: 4, titulo: (p, k) => `${['RG', 'CPF', 'Comprovante de residência', 'Carteira de trabalho'][k - 1]} (${p.titulo.replace('Admissão de ', '')})` }],
  }),
  definicao({
    id: 551, name: 'Validar documento com IA', dono: 'Elisa Prado', restrito: true,
    description: 'Lê o documento enviado e confere os dados.',
    gatilho: { tipo: 'events', categoria: 'docPessoais', acao: 'create' },
    nos: [{ tipo: 'ai_extract', rotulo: 'Ler documento' }, { tipo: 'crud', rotulo: 'Marcar como válido' }],
    gravacoes: [{ categoria: 'docPessoais', acao: 'update', alvo: 'mesmo', efeito: d => marca(d, 'valido') }],
    falha: { taxa: 0.06, causa: 'ia', no: 0 },
  }),
  definicao({
    id: 552, name: 'Conferir documentos da admissão', dono: 'Elisa Prado', restrito: true,
    description: 'Quando todos os documentos são válidos, libera a criação dos acessos.',
    gatilho: { tipo: 'events', categoria: 'docPessoais', acao: 'update' },
    nos: [{ tipo: 'conditionals', rotulo: 'Todos válidos?' }, { tipo: 'crud', rotulo: 'Atualizar admissão' }],
    atua: i => { const a = i && paiDe(i); return !!a && !tem(a, 'conferida') && filhos(a, 'docPessoais').every(d => tem(d, 'valido')) },
    gravacoes: [{ categoria: 'admissoes', acao: 'update', alvo: 'pai', efeito: a => { marca(a, 'conferida'); a._fase = 'documentos' } }],
  }),
  definicao({
    id: 553, name: 'Criar acessos', dono: 'Elisa Prado', restrito: true,
    description: 'Cria os pedidos de e-mail e de acesso aos sistemas.',
    gatilho: { tipo: 'events', categoria: 'admissoes', acao: 'update' },
    nos: [{ tipo: 'crud', rotulo: 'Criar acessos' }],
    atua: i => i?._fase === 'documentos',
    gravacoes: [{ categoria: 'acessos', acao: 'create', alvo: 'novo', quantos: 2, titulo: (_p, k) => (k === 1 ? 'E-mail corporativo' : 'Sistema financeiro') }],
  }),
  definicao({
    id: 554, name: 'Solicitar acesso ao sistema', dono: 'Elisa Prado', restrito: true,
    description: 'Pede o acesso ao sistema de identidade.',
    gatilho: { tipo: 'events', categoria: 'acessos', acao: 'create' },
    nos: [{ tipo: 'http', rotulo: 'Pedir acesso' }, { tipo: 'crud', rotulo: 'Atualizar admissão' }],
    gravacoes: [{
      categoria: 'admissoes', acao: 'update', alvo: 'pai', condicao: 'Todos os acessos liberados?',
      quando: (i) => { marca(i, 'liberado'); const a = paiDe(i); return !!a && filhos(a, 'acessos').every(x => tem(x, 'liberado')) },
      efeito: a => { a._fase = 'pronta' },
    }],
    falha: { taxa: 0.5, desdeHoras: 96, causa: 'permissao', no: 0 },
  }),
  definicao({
    id: 555, name: 'Boas-vindas ao novo colaborador', dono: 'Elisa Prado', restrito: true,
    description: 'Envia as boas-vindas com os acessos prontos.',
    gatilho: { tipo: 'events', categoria: 'admissoes', acao: 'update' },
    nos: [{ tipo: 'conditionals', rotulo: 'Acessos prontos?' }, { tipo: 'email', rotulo: 'Enviar boas-vindas' }],
    atua: i => (i?._fase === 'pronta' && !tem(i, 'boasVindas') ? (marca(i, 'boasVindas'), true) : false),
    gravacoes: [],
  }),
  definicao({
    id: 556, name: 'Lembrete de documentos pendentes', dono: 'Elisa Prado', restrito: true,
    description: 'Todo dia, lembra quem ainda não enviou os documentos.',
    gatilho: { tipo: 'cron', rotulo: '09:00' },
    nos: [{ tipo: 'crud', rotulo: 'Buscar pendências' }, { tipo: 'email', rotulo: 'Enviar lembrete' }],
    gravacoes: [],
  }),
]

const porFluxo = new Map(definicoes.map(f => [f.id, f]))
const fluxo = (id: number) => porFluxo.get(id)!

/** Os 38 fluxos, sem o que só a simulação usa. Os restritos ficam por último (cenário "Acesso parcial"). */
export const fluxos: Fluxo[] = definicoes.map(({ gravacoes: _g, atua: _a, falha: _f, depois: _d, ...f }) => f)

/* ------------------------------------------------------------------ *
 * A simulação                                                         *
 * ------------------------------------------------------------------ */

let execucoes: Execucao[] = []
let proximaExecucao = 148_210
let proximoItem = 61_000
const sequencia: Partial<Record<CategoriaId, number>> = {}
const agendados: (() => void)[] = []

function criarItem(categoria: CategoriaId, quando: number, titulo: string, pai?: ItemDoMock, porExecucao?: number, pessoa?: string, numero?: number): ItemDoMock {
  const n = numero ?? (sequencia[categoria] = (sequencia[categoria] ?? (categoria === 'contratos' ? 60 : 400)) + 1)
  const item: ItemDoMock = {
    id: proximoItem++,
    reference: `${categorias[categoria].prefixo}-2026-${String(n).padStart(4, '0')}`,
    created_at: new Date(quando),
    categoria,
    titulo,
    pai: pai?.id,
    criado_por_execucao: porExecucao,
    criado_por_pessoa: pessoa,
    _fase: 'novo',
  }
  itens.push(item)
  porId.set(item.id, item)
  return item
}

/** O item de origem: o próprio item, ou a raiz da execução que o criou (P4). */
function raizDoItem(item: ItemDoMock | undefined): ItemDoMock | undefined {
  if (!item) return undefined
  const criador = item.criado_por_execucao ? execucoes.find(e => e.id === item.criado_por_execucao) : undefined
  return criador?.raiz ? porId.get(criador.raiz) : item
}

function disparar(evento: Evento, item: ItemDoMock, quando: number, causa?: Execucao, pessoa?: string) {
  for (const f of definicoes) {
    if (f.gatilho.tipo !== 'events' || f.gatilho.categoria !== evento.categoria || f.gatilho.acao !== evento.acao) continue
    rodar(f, quando + entre(0.5, 4) * 1000, { tipo: 'evento', evento, pessoa, porExecucao: causa?.id }, item, causa)
  }
}

function duracaoBase(f: DefinicaoDoFluxo) {
  let ms = entre(250, 900) * f.nos.length
  if (f.nos.some(n => n.tipo.startsWith('ai_'))) ms += entre(3000, 11000)
  if (f.nos.some(n => n.tipo === 'http')) ms += entre(600, 2400)
  return Math.round(ms)
}

function rodar(f: DefinicaoDoFluxo, inicio: number, disparo: Disparo, item?: ItemDoMock, causa?: Execucao, forcas?: Execucao['_forcas']) {
  if (inicio > AGORA_MS) return
  const lineage = causa ? [...causa.input.workflow_timeline.lineage, causa.id] : []
  const raiz = causa?.raiz ? porId.get(causa.raiz) : raizDoItem(item)
  const herdadas = forcas ?? causa?._forcas
  const pessoa = disparo.tipo === 'manual' ? disparo.pessoa : disparo.tipo === 'evento' ? disparo.pessoa : undefined

  const exec: Execucao = {
    id: proximaExecucao++,
    created_at: new Date(inicio),
    updated_at: new Date(inicio),
    reference: referenciaAleatoria(),
    title: item ? `${f.name} · ${item.reference}` : `${f.name} · ${new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }).format(inicio)}`,
    workspace: workspace.slug,
    workflow: f.id,
    parent: null, // o nó Iniciar Fluxo preenche; os fluxos daqui se ligam por evento de item
    version: f.version,
    status: 'completed',
    stopped_at: null,
    item: item?.id ?? null,
    input: { triggered_by: pessoa ? { nome: pessoa } : null, workflow_timeline: { lineage } },
    output: null,
    disparo,
    raiz: raiz?.id,
    gravou: [],
    nos_executados: f.nos.length + 2,
    duracao_ms: duracaoBase(f),
    _forcas: herdadas,
  }
  execucoes.push(exec)

  // Repetição sem fim: a proteção do protótipo de proteções corta no 10º disparo encadeado.
  if (lineage.length >= 10) {
    Object.assign(exec, { status: 'stopped', motivo: 'cadeia', nos_executados: 1, duracao_ms: 40 })
    return
  }

  const forca = herdadas?.[f.id]
  const idade = AGORA_MS - inicio
  const atua = f.atua ? f.atua(item, { exec, raiz, forcas: herdadas }) : true

  if (!atua) {
    // roda, confere a condição e termina sem gravar
    exec.nos_executados = 2
    exec.duracao_ms = Math.round(entre(150, 500))
  }
  else if (forca === 'erro' || (forca === undefined && f.falha && (!f.falha.desdeHoras || idade < f.falha.desdeHoras * HORA) && rnd() < f.falha.taxa)) {
    exec.status = 'error'
    exec.causa = f.falha?.causa ?? 'tempo'
    exec.no_com_erro = f.falha?.no ?? 0
    exec.nos_executados = 1 + (exec.no_com_erro + 1)
  }
  else if (f.id === 541 && idade < 4 * MIN) {
    exec.status = 'queued'
    exec.motivo = 'limitePorMinuto'
    exec.nos_executados = 0
  }
  else if (f.espera) {
    const janela = f.espera === 'tarefa' ? 30 * HORA : 6 * HORA
    const espera = forca === 'espera' || (forca === undefined && idade < janela && rnd() < 0.6)
    if (espera || idade < 20 * MIN) {
      exec.status = 'working'
      exec.esperando = f.espera
      exec.nos_executados = 2
    }
    else {
      exec.duracao_ms = forca === 'ok' ? Math.round(3.2 * HORA) : Math.round(entre(0.5, Math.min(26, idade / HORA)) * HORA)
    }
  }
  else if (idade < 90_000) {
    exec.status = 'working'
    exec.nos_executados = 1
  }

  if (exec.status !== 'completed') return
  const fim = inicio + exec.duracao_ms
  exec.stopped_at = new Date(fim)
  exec.updated_at = new Date(fim)
  if (!atua) return

  const ctx: Contexto = { exec, raiz, forcas: herdadas }
  for (const g of f.gravacoes) {
    if (item && g.quando && !g.quando(item, ctx)) continue
    const alvos: ItemDoMock[] = []
    if (g.alvo === 'novo') {
      const pai = item ?? raiz
      for (let k = 1; k <= (g.quantos ?? 1); k++) {
        alvos.push(criarItem(g.categoria, fim, g.titulo ? g.titulo(pai!, k) : categorias[g.categoria].singular, pai, exec.id))
      }
    }
    else if (g.alvo === 'mesmo' && item) alvos.push(item)
    else if (g.alvo === 'pai' && item) { const p = paiDe(item); if (p) alvos.push(p) }
    for (const alvo of alvos) {
      g.efeito?.(alvo, ctx)
      exec.gravou.push({ item: alvo.id, acao: g.acao })
      disparar({ categoria: g.categoria, acao: g.acao }, alvo, fim + entre(1, 6) * 1000, exec)
    }
  }
  f.depois?.(exec, item, fim)
}

function diaDaSimulacao(d: number) {
  const base = new Date(AGORA)
  base.setHours(0, 0, 0, 0)
  return base.getTime() - (DIAS_SIMULADOS - 1 - d) * DIA
}
const horarioComercial = (d: number) => diaDaSimulacao(d) + entre(8.3, 18.2) * HORA

function simular() {
  itens = []
  execucoes = []
  porId.clear()

  for (let d = 0; d < DIAS_SIMULADOS; d++) {
    // Gestão de contratos: 3 contratos por dia, em média
    for (let k = 0; k < 3; k++) {
      if (rnd() < 0.15) continue
      const pessoa = sorteia(pessoas.slice(0, 5))
      const quando = horarioComercial(d)
      if (quando > AGORA_MS) continue
      const c = criarItem('contratos', quando, `${sorteia(tiposDeContrato)} · ${sorteia(empresas)}`, undefined, undefined, pessoa)
      disparar({ categoria: 'contratos', acao: 'create' }, c, quando, undefined, pessoa)
    }
    // Compras: 1 a 2 pedidos por dia
    for (let k = 0; k < 2; k++) {
      if (rnd() < 0.35) continue
      const pessoa = sorteia(pessoas)
      const quando = horarioComercial(d)
      if (quando > AGORA_MS) continue
      const p = criarItem('pedidos', quando, sorteia(pedidosDeCompra), undefined, undefined, pessoa)
      disparar({ categoria: 'pedidos', acao: 'create' }, p, quando, undefined, pessoa)
    }
    // Atendimento: e-mails que chegam o dia todo
    for (let k = 0; k < 6; k++) rodar(fluxo(540), diaDaSimulacao(d) + entre(7, 21) * HORA, { tipo: 'email' })
    // Admissão: uma a cada 2 dias
    if (d % 2 === 0) {
      const pessoa = 'Elisa Prado'
      const quando = horarioComercial(d)
      if (quando > AGORA_MS) continue
      const a = criarItem('admissoes', quando, `Admissão de ${nomesDeAdmissao[(d / 2) % nomesDeAdmissao.length]}`, undefined, undefined, pessoa)
      disparar({ categoria: 'admissoes', acao: 'create' }, a, quando, undefined, pessoa)
    }
    // Agendamentos
    rodar(fluxo(524), diaDaSimulacao(d) + 8 * HORA, { tipo: 'agendamento', rotulo: '08:00' })
    rodar(fluxo(556), diaDaSimulacao(d) + 9 * HORA, { tipo: 'agendamento', rotulo: '09:00' })
    const assinados = itens.filter(i => i.categoria === 'contratos' && i._fase === 'assinado')
    const renovar = rnd() < 0.5 && assinados.length ? sorteia(assinados) : undefined
    rodar(fluxo(520), diaDaSimulacao(d) + 8 * HORA + 5 * MIN, { tipo: 'agendamento', rotulo: '08:05' }, renovar)
    if (new Date(diaDaSimulacao(d)).getDay() === 1) rodar(fluxo(538), diaDaSimulacao(d) + 7 * HORA, { tipo: 'agendamento', rotulo: 'segunda, 07:00' })
    for (let h = 0; h < 24; h += 4) {
      const parados = itens.filter(i => i.categoria === 'chamados' && i._fase === 'atendido' && i.created_at.getTime() < diaDaSimulacao(d) + h * HORA - DIA)
      rodar(fluxo(544), diaDaSimulacao(d) + h * HORA, { tipo: 'agendamento', rotulo: 'a cada 4 horas' }, parados.length && rnd() < 0.4 ? sorteia(parados) : undefined)
    }
    // Chat dos clientes, encerramentos manuais e notas que chegam por e-mail
    const abertos = itens.filter(i => i.categoria === 'chamados' && i._fase === 'atendido')
    for (const c of abertos) {
      if (rnd() < 0.25) rodar(fluxo(545), horarioComercial(d), { tipo: 'webhook' }, c)
      if (rnd() < 0.45) rodar(fluxo(546), horarioComercial(d), { tipo: 'manual', pessoa: sorteia(['Carla Mendes', 'Bruno Lima']) }, c)
    }
    const aprovados = itens.filter(i => i.categoria === 'pedidos' && i._fase === 'aprovado' && !tem(i, 'nota'))
    for (const p of aprovados) {
      if (rnd() > 0.5) continue
      marca(p, 'nota')
      // o e-mail do fornecedor traz o número do pedido: a nota nasce ligada a ele
      agendados.push(() => rodar(fluxo(536), horarioComercial(d) + DIA, { tipo: 'email' }, p))
    }
    if (d === 9 || d === 12) {
      const assinado = itens.find(i => i.categoria === 'contratos' && i._fase === 'assinado')
      if (assinado) rodar(fluxo(525), horarioComercial(d), { tipo: 'manual', pessoa: 'Ana Souza' }, assinado)
    }
    // o que chega mais tarde (webhooks, notas)
    while (agendados.length) agendados.shift()!()
  }

  /* --- Os 3 contratos de exemplo do protótipo, com o desfecho fixo --- */
  const hoje = diaDaSimulacao(DIAS_SIMULADOS - 1)
  const exemplo = (numero: number, titulo: string, pessoa: string, hora: number, forcas: Execucao['_forcas']) => {
    const quando = hoje + hora * HORA
    const c = criarItem('contratos', quando, titulo, undefined, undefined, pessoa, numero)
    for (const f of definicoes) {
      if (f.gatilho.tipo === 'events' && f.gatilho.categoria === 'contratos' && f.gatilho.acao === 'create') {
        rodar(f, quando + 3000, { tipo: 'evento', evento: { categoria: 'contratos', acao: 'create' }, pessoa }, c, undefined, forcas)
      }
    }
    while (agendados.length) agendados.shift()!()
    return c
  }
  exemplo(142, 'Prestação de serviços · Alfa Engenharia', 'Ana Souza', 9.2, { 517: 'ok', 518: 'erro', 515: 'ok' })
  exemplo(139, 'Licença de software · Faro Tecnologia', 'Bruno Lima', 10.5, { 515: 'repetir' })
  exemplo(144, 'Fornecimento · Cedro Alimentos', 'Carla Mendes', 13.1, { 517: 'espera' })
  // 3 e-mails que acabaram de chegar: a classificação com IA espera na fila do limite por minuto
  for (const s of [150, 95, 40]) rodar(fluxo(540), AGORA_MS - s * 1000, { tipo: 'email' })

  execucoes.sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
  // Execuções que não foram encadeadas por evento de item (agendamento, webhook, e-mail) começam cadeias novas.
  return { itens: [...itens], execucoes: [...execucoes] }
}

const simulado = simular()

export const todosOsItens: ItemDoMock[] = simulado.itens
export const todasAsExecucoes: Execucao[] = simulado.execucoes

/** Os 3 itens de exemplo que o andaime oferece. */
export const exemplos = {
  falha: todosOsItens.find(i => i.reference === 'CTR-2026-0142')!,
  repeticao: todosOsItens.find(i => i.reference === 'CTR-2026-0139')!,
  espera: todosOsItens.find(i => i.reference === 'CTR-2026-0144')!,
}

/** Quem está aprovando a tarefa parada, para a frase da jornada. */
export const responsavelDaTarefa: Record<number, string> = { 517: 'Gabriela Torres', 521: 'Fábio Nunes', 534: 'Fábio Nunes', 542: 'Bruno Lima' }
