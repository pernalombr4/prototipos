<script setup lang="ts">
/**
 * Exportações (hoje "Meus Relatórios Emitidos", em `/myReports`).
 *
 * A demanda: a tela onde o relatório extraído fica para baixar só se alcança
 * pelo link de um aviso que some em segundos. A proposta:
 * 1. a tela vira destino nativo no menu lateral, com o estado no próprio item
 *    (gerando, e quantos prontos ainda não foram vistos);
 * 2. o aviso de extração acompanha a geração e termina com "Baixar" e com o
 *    caminho para a tela, na mesma aba;
 * 3. o sino guarda o aviso de pronto, para quem fechou o aviso;
 * 4. a tela passa para a tabela nova, com painel de detalhes e Baixar.
 *
 * A jornada começa em Categorias › Contratos (cópia da tabela nova de itens):
 * Extrair Relatório › Relatório Padrão › formato.
 *
 * Tudo em memória. Recarregar volta ao começo.
 */
import briefingMd from './BRIEFING.md?raw'
import pesquisaMd from './PESQUISA.md?raw'
import decisoesMd from './DECISOES.md?raw'
import CascaDoEnspace from './_CascaDoEnspace.vue'
import type { NotificacaoDoSino } from './_CascaDoEnspace.vue'
import PainelDoRelatorio from './_PainelDoRelatorio.vue'
import TelaDeContratos from './_TelaDeContratos.vue'
import TelaDeExportacoes from './_TelaDeExportacoes.vue'
import type { Formato, PedidoDeRelatorio } from './mocks'
import { AGORA, pedidosIniciais } from './mocks'
import { nomeDaOrigem, nomeDoArquivo, relativo } from './relatorios'
import { textos } from './textos'

definePageMeta({
  titulo: 'Exportações no menu',
  descricao: 'A tela dos relatórios extraídos vira item fixo do menu lateral, na tabela nova, com painel de detalhes e Baixar. O aviso de extração acompanha a geração e termina com o botão de baixar.',
  status: 'em-revisao',
  atualizado: '2026-10-14',
  tela: 'Meus Relatórios (/myReports)',
})

const t = useTextos(textos)
const toast = useToast()
const idioma = useIdioma()

/* ------------------------------------------------------------------ *
 * ANDAIME: estado da tela e nome da tela. Não é proposta.             *
 * ------------------------------------------------------------------ */
type Estado = 'cheio' | 'carregando' | 'vazio' | 'erro'
const estado = ref<Estado>('cheio')
const estados = computed<{ valor: Estado, rotulo: string }[]>(() => [
  { valor: 'cheio', rotulo: 'Cheio' },
  { valor: 'carregando', rotulo: 'Carregando' },
  { valor: 'vazio', rotulo: 'Vazio' },
  { valor: 'erro', rotulo: 'Erro ao carregar' },
])
const nomeEscolhido = ref<'exportacoes' | 'relatorios'>('exportacoes')
const nomeDaTela = computed(() => t.value.nomes[nomeEscolhido.value])

/* ---------- o tempo do protótipo ---------- */

const inicio = Date.now()
/** O "agora" anda a partir do AGORA do mock, para as datas novas casarem com as velhas. */
function agoraSimulado() {
  return new Date(AGORA.getTime() + (Date.now() - inicio))
}

/* ---------- a tela aberta ---------- */

const tela = ref<'exportacoes' | 'contratos'>('exportacoes')
const trilha = computed(() => tela.value === 'exportacoes'
  ? [nomeDaTela.value]
  : [t.value.trilhaCategorias, 'Contratos'])

/* ---------- os pedidos ---------- */

const pedidos = ref<PedidoDeRelatorio[]>(pedidosIniciais())
const abertoId = ref<number | null>(null)
const aberto = computed(() => pedidos.value.find(p => p.id === abertoId.value) ?? null)
const painelAberto = computed({
  get: () => !!aberto.value,
  set: (v) => { if (!v) abertoId.value = null },
})

const gerando = computed(() => pedidos.value.some(p => p.status === 'pending' || p.status === 'processing'))

/** Prontos que ficaram prontos fora da tela. Somem quando a pessoa abre a tela. */
const naoVistos = ref<number[]>([])
const notificacoes = ref<(NotificacaoDoSino & { pedido: number, criado: string })[]>([])
const notificacoesDoSino = computed<NotificacaoDoSino[]>(() => notificacoes.value.map(n => ({
  ...n,
  quando: relativo(n.criado, t.value, agoraSimulado()),
})))

function ir(destino: 'exportacoes' | 'contratos') {
  tela.value = destino
  if (destino === 'exportacoes') naoVistos.value = []
  else abertoId.value = null
}

/* ---------- a geração simulada ---------- */

const relogios: ReturnType<typeof setTimeout>[] = []
function depois(ms: number, fn: () => void) {
  relogios.push(setTimeout(fn, ms))
}

function atualizar(id: number, mudanca: (p: PedidoDeRelatorio) => void) {
  const p = pedidos.value.find(x => x.id === id)
  if (p) mudanca(p)
}

/** Fila: um relatório gera por vez, como o back-end de hoje parece fazer. */
function gerar(id: number, opcoes: { comAviso: boolean, registros?: number } = { comAviso: false }) {
  const avisoId = `extracao-${id}`
  const ritmo = 260

  function passo() {
    const p = pedidos.value.find(x => x.id === id)
    if (!p) return
    if (p.status === 'pending') {
      // espera quem está gerando na frente
      if (pedidos.value.some(x => x.status === 'processing' && x.id !== id)) return depois(ritmo, passo)
      p.status = 'processing'
      p.proto.progresso = p.proto.progresso ?? 4
      return depois(ritmo, passo)
    }
    if (p.status !== 'processing') return
    p.proto.progresso = Math.min(100, (p.proto.progresso ?? 0) + 9 + Math.round(Math.random() * 10))
    if (p.proto.progresso < 100) return depois(ritmo, passo)

    const fim = agoraSimulado().toISOString()
    const registros = p.proto.registros ?? opcoes.registros ?? 120 + Math.round(Math.random() * 300)
    p.status = 'complete'
    p.updated_at = fim
    p.proto.registros = registros
    p.proto.progresso = undefined
    p.processed_report = {
      id: 9000 + id,
      name: `default_${id.toString(36)}x7q2.${p.extraction_format}`,
      ext: `.${p.extraction_format}` as '.xlsx',
      mime: '',
      size: Math.round(registros * 0.25 * 10) / 10 + 4,
      url: '#',
      created_at: fim,
    }

    const origem = nomeDaOrigem(p, t.value)
    notificacoes.value.unshift({ id: Date.now() + id, tipo: 'pronto', origem, quando: '', lida: false, pedido: id, criado: fim })
    if (tela.value !== 'exportacoes' && !naoVistos.value.includes(id)) naoVistos.value.push(id)

    if (opcoes.comAviso) {
      toast.update(avisoId, {
        title: t.value.avisos.prontoTitulo,
        description: t.value.avisos.prontoDescricao(origem, t.value.registros(registros)),
        icon: 'i-lucide-circle-check',
        color: 'success',
        duration: 12000,
        progress: true,
        ui: { icon: '' },
        actions: [
          { label: t.value.acoes.baixar, icon: 'i-lucide-download', color: 'primary', size: 'xs', onClick: () => baixar([id]) },
          { label: t.value.avisos.verNaTela(nomeDaTela.value), color: 'neutral', variant: 'outline', size: 'xs', onClick: () => { ir('exportacoes'); abertoId.value = id } },
        ],
      })
    }
  }

  depois(500, passo)
}

function novoPedido(base: Partial<PedidoDeRelatorio> & Pick<PedidoDeRelatorio, 'data' | 'extraction_format' | 'proto' | 'report' | 'filters'>): PedidoDeRelatorio {
  const id = Math.max(...pedidos.value.map(p => p.id), 412) + 1
  const agora = agoraSimulado().toISOString()
  const p: PedidoDeRelatorio = {
    id,
    status: 'pending',
    user: 1108,
    created_at: agora,
    updated_at: agora,
    processed_report: null,
    ...base,
    proto: { ...base.proto, registros: null, baixadoEm: [], erro: undefined, progresso: undefined },
  }
  pedidos.value.unshift(p)
  return p
}

/** Começo da jornada: Contratos › Extrair Relatório › Relatório Padrão › formato. */
function extrairDeContratos(formato: Formato) {
  const p = novoPedido({
    data: { unique_key: 'c_items', type: 108, form: 3240, group: 34, _sort: 'created_at:DESC' },
    extraction_format: formato,
    filters: { type: 108, _sort: 'created_at:DESC' },
    report: null,
    proto: {
      visualizacao: 'Itens',
      registros: null,
      colunas: ['Referência', 'Status', 'Contratante', 'Fornecedor', 'Valor do contrato', 'Fim da vigência'],
      filtros: [],
      ordenacao: 'Criado em, do mais novo para o mais antigo',
      baixadoEm: [],
    },
  })
  toast.add({
    id: `extracao-${p.id}`,
    title: t.value.avisos.gerandoTitulo('Contratos'),
    description: t.value.avisos.gerandoDescricao,
    icon: 'i-lucide-loader-circle',
    color: 'info',
    duration: 600000,
    progress: false,
    ui: { icon: 'animate-spin' },
    actions: [
      { label: t.value.avisos.verNaTela(nomeDaTela.value), color: 'neutral', variant: 'outline', size: 'xs', onClick: () => { ir('exportacoes'); abertoId.value = p.id } },
    ],
  })
  gerar(p.id, { comAviso: true, registros: 8 })
}

/* ---------- ações sobre os relatórios ---------- */

function baixar(ids: number[]) {
  const agora = agoraSimulado().toISOString()
  const prontos = pedidos.value.filter(p => ids.includes(p.id) && p.status === 'complete')
  prontos.forEach(p => p.proto.baixadoEm.push(agora))
  naoVistos.value = naoVistos.value.filter(id => !ids.includes(id))
  notificacoes.value.forEach((n) => { if (ids.includes(n.pedido)) n.lida = true })
  if (prontos.length === 1) toast.add({ title: t.value.avisos.download(nomeDoArquivo(prontos[0]!, t.value)), icon: 'i-lucide-download', color: 'primary' })
  else if (prontos.length > 1) toast.add({ title: t.value.avisos.downloadVarios(prontos.length), icon: 'i-lucide-file-archive', color: 'primary' })
}

function excluir(ids: number[]) {
  const removidos = pedidos.value.filter(p => ids.includes(p.id))
  pedidos.value = pedidos.value.filter(p => !ids.includes(p.id))
  if (abertoId.value && ids.includes(abertoId.value)) abertoId.value = null
  toast.add({
    title: t.value.avisos.excluidos(removidos.length),
    icon: 'i-lucide-trash-2',
    color: 'neutral',
    actions: [{
      label: t.value.avisos.desfazer,
      color: 'neutral',
      variant: 'outline',
      size: 'xs',
      onClick: () => {
        pedidos.value = [...pedidos.value, ...removidos].sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at))
      },
    }],
  })
}

function extrairDeNovo(id: number) {
  const base = pedidos.value.find(p => p.id === id)
  if (!base) return
  const p = novoPedido({
    data: { ...base.data },
    extraction_format: base.extraction_format,
    filters: { ...base.filters },
    report: base.report,
    proto: { ...base.proto, colunas: [...base.proto.colunas], filtros: [...base.proto.filtros] },
  })
  toast.add({ title: t.value.avisos.extraindoDeNovo, icon: 'i-lucide-refresh-cw', color: 'info' })
  abertoId.value = p.id
  gerar(p.id, { comAviso: false, registros: base.proto.registros ?? undefined })
}

function abrirOrigem(id: number) {
  const p = pedidos.value.find(x => x.id === id)
  if (!p) return
  if (p.data.unique_key === 'c_items' && p.data.type === 108) {
    ir('contratos')
    return
  }
  toast.add({ title: t.value.avisos.abrindoOrigem(nomeDaOrigem(p, t.value)), icon: 'i-lucide-square-arrow-out-up-right', color: 'neutral' })
}

function copiarLink() {
  toast.add({ title: t.value.avisos.linkCopiado, icon: 'i-lucide-link', color: 'neutral' })
}

function abrir(id: number) {
  abertoId.value = id
}

function abrirNotificacao(id: number) {
  const n = notificacoes.value.find(x => x.id === id)
  if (!n) return
  n.lida = true
  ir('exportacoes')
  abertoId.value = n.pedido
}

function recarregar() {
  estado.value = 'carregando'
  depois(900, () => { estado.value = 'cheio' })
}

/* ---------- ao abrir: os 2 que estão na fila terminam na frente de quem olha ---------- */

onMounted(() => {
  pedidos.value.filter(p => p.status === 'processing' || p.status === 'pending').reverse().forEach(p => gerar(p.id))
})

onBeforeUnmount(() => relogios.forEach(clearTimeout))

/** Reiniciar o protótipo sem recarregar. */
function reiniciar() {
  relogios.forEach(clearTimeout)
  relogios.length = 0
  toast.clear()
  pedidos.value = pedidosIniciais()
  naoVistos.value = []
  notificacoes.value = []
  abertoId.value = null
  tela.value = 'exportacoes'
  estado.value = 'cheio'
  pedidos.value.filter(p => p.status === 'processing' || p.status === 'pending').reverse().forEach(p => gerar(p.id))
}
</script>

<template>
  <div>
    <CascaDoEnspace
      :t="t"
      :workspace="t.workspace"
      slug="operacoes"
      :nome-da-tela="nomeDaTela"
      :ativo="tela"
      :trilha="trilha"
      :gerando="gerando"
      :prontos-nao-vistos="naoVistos.length"
      :notificacoes="notificacoesDoSino"
      @navegar="ir"
      @abrir-notificacao="abrirNotificacao"
      @marcar-lidas="notificacoes.forEach(n => (n.lida = true))"
    >
      <Transition
        mode="out-in"
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 translate-y-1"
        leave-active-class="transition duration-100"
        leave-to-class="opacity-0"
      >
        <TelaDeExportacoes
          v-if="tela === 'exportacoes'"
          :t="t"
          :nome-da-tela="nomeDaTela"
          :pedidos="estado === 'vazio' ? [] : pedidos"
          :estado="estado"
          :aberto="abertoId"
          @abrir="abrir"
          @baixar="baixar"
          @excluir="excluir"
          @extrair-de-novo="extrairDeNovo"
          @tentar-de-novo="extrairDeNovo"
          @abrir-origem="abrirOrigem"
          @copiar-link="copiarLink"
          @recarregar="recarregar"
        />
        <TelaDeContratos v-else :t="t" @extrair="extrairDeContratos" />
      </Transition>
    </CascaDoEnspace>

    <!-- O painel de detalhes, sobre a tabela -->
    <USlideover v-model:open="painelAberto" :overlay="false" :ui="{ content: 'max-w-[28rem]' }">
      <template #content>
        <PainelDoRelatorio
          v-if="aberto"
          :t="t"
          :pedido="aberto"
          @fechar="abertoId = null"
          @baixar="(id) => baixar([id])"
          @extrair-de-novo="extrairDeNovo"
          @tentar-de-novo="extrairDeNovo"
          @abrir-origem="abrirOrigem"
          @copiar-link="copiarLink"
          @excluir="(id) => excluir([id])"
        />
      </template>
    </USlideover>

    <!-- ANDAIME DE PROTÓTIPO, não faz parte da proposta -->
    <div class="fixed inset-x-0 bottom-0 z-40 border-t border-default bg-elevated/95 backdrop-blur">
      <div class="flex flex-wrap items-center gap-2 px-4 py-3">
        <span class="mr-1 text-xs font-semibold uppercase tracking-wider text-muted">Protótipo · estado</span>
        <UButton
          v-for="e in estados"
          :key="e.valor"
          :label="e.rotulo"
          size="xs"
          class="transition-transform hover:-translate-y-0.5"
          :color="estado === e.valor ? 'primary' : 'neutral'"
          :variant="estado === e.valor ? 'solid' : 'subtle'"
          @click="estado = e.valor; ir('exportacoes')"
        />

        <USeparator orientation="vertical" class="mx-1 h-5" />
        <span class="text-xs font-semibold uppercase tracking-wider text-muted">Nome</span>
        <UButton
          v-for="n in (['exportacoes', 'relatorios'] as const)"
          :key="n"
          :label="t.nomes[n]"
          size="xs"
          :color="nomeEscolhido === n ? 'primary' : 'neutral'"
          :variant="nomeEscolhido === n ? 'solid' : 'subtle'"
          @click="nomeEscolhido = n"
        />

        <USeparator orientation="vertical" class="mx-1 h-5" />
        <UButton
          label="Percorrer a jornada"
          icon="i-lucide-route"
          size="xs"
          color="neutral"
          variant="outline"
          class="transition-transform hover:-translate-y-0.5"
          @click="ir('contratos')"
        />
        <UButton label="Reiniciar" icon="i-lucide-rotate-ccw" size="xs" color="neutral" variant="ghost" @click="reiniciar" />

        <ControlesDePrototipo class="ml-auto" />

        <span class="flex flex-wrap items-center gap-2">
          <span class="text-xs font-semibold uppercase tracking-wider text-muted">Por trás</span>
          <PainelDeContexto
            :briefing="briefingMd"
            :pesquisa="pesquisaMd"
            :decisoes="decisoesMd"
            repositorio="https://github.com/pernalombr4/prototipos/tree/main/app/pages/meus-relatorios"
          />
        </span>
      </div>
    </div>
  </div>
</template>
