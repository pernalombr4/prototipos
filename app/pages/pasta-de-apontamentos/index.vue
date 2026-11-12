<script setup lang="ts">
/**
 * Pasta de apontamentos: um tipo novo de pasta do item e uma aba nova da tarefa.
 *
 * Uma porta: a tela do item. A pasta Apontamentos tem nome fixo, igual nos 2
 * cenários (rodada 3); a pasta Tarefas abre o painel da tarefa, que ganha a aba
 * Apontamentos. O botão de nova pasta abre o modal com o tipo novo, e o Editar
 * da pasta abre a configuração dela.
 *
 * Rodada 2: duas visualizações no andaime. Item (a tela do item, com a pasta
 * de apontamentos e a Visão Geral com o contador da lista de tarefas) e Tarefa
 * rápida (a página Tarefas › Rápidas, com checklist, subtarefas, dependências
 * e conclusão com motivo no painel). A citação com # vale nas duas.
 *
 * Rodada 4: na visualização Item, o andaime alterna Tela cheia e Painel
 * lateral. No painel, o fundo é a listagem da categoria e o item abre à
 * direita como no develop (gaveta redimensionável, 700 px de partida, de 400 a
 * 1400), com a mesma tela do item dentro. Serve para julgar se a pasta de
 * apontamentos cabe no espaço estreito.
 *
 * Andaime: visualização, cenário (produto ou jurídico, para provar que o tipo
 * é universal), quem você é (quem confere ou quem resolve) e o estado da tela.
 */
import type { Apontamento, Cenario, TarefaDoItem } from './mocks'
import type { Lista } from './lista'
import type { PastaDaBarra } from './_BarraDePastas.vue'
import type { Citavel } from './citacao'
import { CHAVE_CITACAO } from './citacao'
import { textos } from './textos'
import { cenarios, pastasDoSistema } from './mocks'
import { copia, pendente, responder } from './lista'
import type { Aviso } from './avisos'
import { avisos, avisosDe, marcarLidas } from './avisos'
import CascaDoWorkspace from './_CascaDoWorkspace.vue'
import PainelDoItem from './_PainelDoItem.vue'
import BarraDePastas from './_BarraDePastas.vue'
import PastaDeApontamentos from './_PastaDeApontamentos.vue'
import PastaTarefas from './_PastaTarefas.vue'
import PainelDaTarefa from './_PainelDaTarefa.vue'
import ModalNovaPasta from './_ModalNovaPasta.vue'
import VisaoGeralDoItem from './_VisaoGeralDoItem.vue'
import ListaDaCategoria from './_ListaDaCategoria.vue'

import briefingMd from './BRIEFING.md?raw'
import pesquisaMd from './PESQUISA.md?raw'
import decisoesMd from './DECISOES.md?raw'

definePageMeta({
  titulo: 'Pasta de apontamentos',
  descricao: 'Um tipo novo de pasta do item e uma aba nova da tarefa: a lista de pontos a ajustar, com rodadas de reteste e conferência. Na tarefa rápida, checklist, subtarefas, dependências e conclusão com motivo.',
  status: 'em-revisao',
  atualizado: '2026-11-12',
  tela: 'Tela do item e Tarefas › Rápidas',
})

const t = useTextos(textos)
const toast = useToast()
const route = useRoute()
const router = useRouter()

/* ---------- andaime, no endereço ---------- */
type IdCenario = Cenario['id']
type Vista = 'item' | 'tarefa'
type Abertura = 'tela' | 'painel'
type Papel = 'conferente' | 'resolvedor'
type EstadoDaTela = 'cheio' | 'vazio' | 'carregando' | 'semPermissao'

function daQuery<T extends string>(chave: string, validos: readonly T[], padrao: T) {
  return computed<T>({
    get: () => (validos.includes(route.query[chave] as T) ? route.query[chave] : padrao) as T,
    set: v => router.replace({ query: { ...route.query, [chave]: v } }),
  })
}
const vista = daQuery<Vista>('vista', ['item', 'tarefa'], 'item')
const abertura = daQuery<Abertura>('abertura', ['tela', 'painel'], 'tela')
const cenarioId = daQuery<IdCenario>('cenario', ['produto', 'juridico'], 'produto')
const papel = daQuery<Papel>('papel', ['conferente', 'resolvedor'], 'conferente')
const estadoDaTela = daQuery<EstadoDaTela>('estado', ['cheio', 'vazio', 'carregando', 'semPermissao'], 'cheio')

/* ---------- dado em memória, um por cenário ---------- */
/** Pasta de outro tipo criada pelo modal: fora do escopo, só aparece na barra. */
interface PastaExtra { id: string, nome: string, icone: string }
interface Dados { c: Cenario, vazia: Lista, extras: PastaExtra[] }

function montar(id: IdCenario): Dados {
  const c = structuredClone(toRaw(cenarios[id]))
  return { c, vazia: { apontamentos: [], rodadas: [], config: c.config, pessoas: c.pessoas }, extras: [] }
}
const dados = reactive<Record<IdCenario, Dados>>({ produto: montar('produto'), juridico: montar('juridico') })
const d = computed(() => dados[cenarioId.value])
const c = computed(() => d.value.c)
const quem = computed(() => papel.value === 'conferente' ? c.value.conferente : c.value.resolvedor)

const listaPrincipal = computed<Lista>(() => estadoDaTela.value === 'vazio'
  ? d.value.vazia
  : { apontamentos: c.value.apontamentos, rodadas: c.value.rodadas, config: c.value.config, pessoas: c.value.pessoas })

/* ---------- pastas ---------- */
const ID_PRINCIPAL = 'apontamentos'
const pendentesDe = (l: Lista) => l.apontamentos.filter(a => pendente(a.estado)).length
const pastas = computed<PastaDaBarra[]>(() => [
  ...pastasDoSistema.map(p => ({ id: p.id, nome: t.value.pastas.nomes[p.id]!, icone: p.icone })),
  { id: ID_PRINCIPAL, nome: t.value.novaPasta.tipos.apontamentos!, icone: c.value.config.icone, pendentes: pendentesDe(listaPrincipal.value) },
  ...d.value.extras.map(e => ({ id: e.id, nome: e.nome, icone: e.icone })),
])
const ativa = computed<string>({
  get: () => pastas.value.some(p => p.id === route.query.folder) ? String(route.query.folder) : ID_PRINCIPAL,
  set: id => router.replace({ query: { ...route.query, folder: id } }),
})
const listaDaPasta = computed<Lista | null>(() => ativa.value === ID_PRINCIPAL ? listaPrincipal.value : null)
const nomeDaAtiva = computed(() => pastas.value.find(p => p.id === ativa.value)?.nome ?? '')

const painelRecolhido = ref(true)
const modalNova = ref(false)
/** Editar da pasta Apontamentos: o mesmo modal, com a configuração preenchida. */
const editandoPasta = ref(false)
function criarPasta(p: { nome: string, icone: string }) {
  const id = `pasta-${Date.now()}`
  d.value.extras.push({ id, ...p })
  ativa.value = id
  toast.add({ title: t.value.toasts.pastaCriada(p.nome), icon: 'i-lucide-folder-plus', color: 'success', duration: 3000 })
}
function editarPasta(id: string) {
  if (id === ID_PRINCIPAL) editandoPasta.value = true
}
function salvarPasta(config: Lista['config']) {
  Object.assign(c.value.config, config)
  toast.add({ title: t.value.toasts.pastaSalva(t.value.novaPasta.tipos.apontamentos!), icon: 'i-lucide-check', color: 'success', duration: 3000 })
}

/* ---------- tarefas ---------- */
const tarefaAberta = ref<TarefaDoItem | null>(null)
const abaDaTarefa = ref('apontamentos')
const painelAberto = computed({
  get: () => !!tarefaAberta.value,
  set: (v) => { if (!v) tarefaAberta.value = null },
})
function abrirTarefa(x: TarefaDoItem, aba?: string) {
  abaDaTarefa.value = aba ?? (vista.value === 'tarefa' || !x.apontamentos.length ? 'tarefa' : 'apontamentos')
  tarefaAberta.value = x
}
/** De uma tarefa para outra (subtarefa, mãe, bloqueio): fica na aba Tarefa. */
const trocarDeTarefa = (x: TarefaDoItem) => abrirTarefa(x, 'tarefa')
/** A aba da tarefa não tem configuração de pasta: usa o padrão do tipo. */
const listaDaTarefa = computed<Lista | null>(() => {
  const x = tarefaAberta.value
  if (!x) return null
  return {
    apontamentos: estadoDaTela.value === 'vazio' ? [] : x.apontamentos,
    rodadas: estadoDaTela.value === 'vazio' ? [] : x.rodadas,
    pessoas: c.value.pessoas,
    config: {
      nome: t.value.painelTarefa.abas.apontamentos!,
      icone: 'i-lucide-list-checks',
      exigeConferencia: true,
      conferente: 'autor',
      responsavelPadrao: x.tarefa.assigned_to ?? c.value.resolvedor,
      travaConclusao: false,
      rotulos: {},
    },
  }
})

/** Converter em tarefa: uma saída, não o caminho padrão. O apontamento fica e aponta para a tarefa. */
function converter(a: Apontamento) {
  const base = c.value.tarefas[0]!.tarefa
  const nova: TarefaDoItem = {
    tarefa: { ...copia(base), id: 990 + c.value.tarefas.length, name: a.titulo, description: null, status: 'pending', assigned_to: a.responsaveis[0] ?? null, priority: a.prioridade },
    apontamentos: [],
    rodadas: [],
    checklist: [],
    bloqueadaPor: [],
  }
  c.value.tarefas.push(nova)
  responder(a, quem.value, `${t.value.apontamento.converterEmTarefa}: ${a.titulo}`)
  toast.add({
    title: t.value.toasts.convertido(a.numero),
    icon: 'i-lucide-clipboard-plus',
    color: 'success',
    duration: 5000,
    actions: [{ label: t.value.pastas.nomes.tarefas, color: 'neutral', variant: 'outline', onClick: () => { tarefaAberta.value = null; ativa.value = 'tarefas' } }],
  })
}

/* ---------- citação com # ---------- */
provide(CHAVE_CITACAO, {
  citaveis: computed<Citavel[]>(() => [
    ...c.value.tarefas.map(x => ({ chave: `tarefa-${x.tarefa.id}`, rotulo: x.tarefa.name, tipo: 'tarefa' as const, detalhe: t.value.tarefas.colunas[x.tarefa.status] })),
    { chave: 'item', rotulo: c.value.item.reference, tipo: 'item' as const, detalhe: c.value.categoria.slug },
    ...c.value.apontamentos.map(a => ({ chave: `ap-${a.numero}`, rotulo: `${a.numero} ${a.titulo}`, tipo: 'apontamento' as const, detalhe: t.value.estados[a.estado] })),
  ]),
  registrar: (alvo, onde, quem) => { c.value.mencoes.push({ alvo, onde, quem, quando: new Date() }) },
  abrir: (chave) => {
    const x = c.value.tarefas.find(y => `tarefa-${y.tarefa.id}` === chave)
    if (x) return abrirTarefa(x, 'tarefa')
    if (chave === 'item') {
      tarefaAberta.value = null
      vista.value = 'item'
      ativa.value = 'visao-geral'
      if (abertura.value === 'painel') abrirGaveta()
      return
    }
    const n = chave.startsWith('ap-') ? chave.slice(3) : ''
    if (n) abrirNaPasta(n)
  },
})

/** Abre a pasta de Apontamentos do item, com o apontamento escolhido quando há. */
function abrirNaPasta(numero?: string) {
  tarefaAberta.value = null
  router.replace({ query: { ...route.query, vista: 'item', folder: ID_PRINCIPAL, [`${ID_PRINCIPAL}-ap`]: numero } })
  if (abertura.value === 'painel') abrirGaveta()
}

/* ---------- notificações do sino (rodada 4) ---------- */
const nomeDaPessoa = (id: number) => c.value.pessoas.find(p => p.id === id)
const meusAvisos = computed(() => avisosDe(quem.value).map((a) => {
  const autor = nomeDaPessoa(a.quem)
  const nome = autor?.nome ?? ''
  return {
    id: a.id,
    lida: a.lida,
    iniciais: autor?.iniciais ?? '',
    quando: t.value.dataHora(a.quando),
    texto: a.tipo === 'retorno' ? t.value.avisos.retorno(nome, a.qtd ?? 0, a.rodada ?? 1) : t.value.avisos[a.tipo](nome, a.numero ?? 0, a.titulo ?? ''),
  }
}))
function abrirAviso(id: string) {
  const a: Aviso | undefined = avisos.find(x => x.id === id)
  if (!a) return
  a.lida = true
  if (!a.apontamento) return abrirNaPasta()
  if (c.value.apontamentos.some(x => x.id === a.apontamento)) return abrirNaPasta(String(a.numero))
  const x = c.value.tarefas.find(y => y.apontamentos.some(z => z.id === a.apontamento))
  if (x) abrirTarefa(x, 'apontamentos')
}

/* ---------- casca ---------- */
const trilha = computed(() => vista.value === 'tarefa'
  ? [c.value.workspace.name, t.value.casca.itens.tarefas!, t.value.tarefaRapida.pagina.rapidas]
  : abertura.value === 'painel'
    ? [c.value.workspace.name, t.value.casca.categorias, c.value.categoria.slug]
    : [c.value.workspace.name, t.value.casca.categorias, c.value.categoria.slug, c.value.item.reference])

/* ---------- item no painel lateral (cópia da gaveta da listagem do develop) ---------- */
const itemNoPainel = computed(() => vista.value === 'item' && abertura.value === 'painel')
const gavetaAberta = ref(true)
const larguraDaGaveta = ref(700)
const limitar = (w: number) => Math.round(Math.min(Math.max(w, 400), Math.min(1400, window.innerWidth - 80)))
function abrirGaveta() {
  gavetaAberta.value = true
  painelRecolhido.value = false
}
watch(abertura, (a) => {
  if (a === 'painel') abrirGaveta()
  else painelRecolhido.value = true
})
function redimensionar(e: MouseEvent) {
  e.preventDefault()
  const mover = (ev: MouseEvent) => { larguraDaGaveta.value = limitar(window.innerWidth - ev.clientX) }
  const soltar = () => {
    window.removeEventListener('mousemove', mover)
    window.removeEventListener('mouseup', soltar)
  }
  window.addEventListener('mousemove', mover)
  window.addEventListener('mouseup', soltar)
}
function teclaDaGaveta(e: KeyboardEvent) {
  if (!itemNoPainel.value || !gavetaAberta.value) return
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    e.preventDefault()
    larguraDaGaveta.value = limitar(larguraDaGaveta.value + (e.key === 'ArrowLeft' ? 40 : -40))
  }
}
function escDaGaveta(e: KeyboardEvent) {
  if (e.key !== 'Escape' || !itemNoPainel.value || !gavetaAberta.value) return
  /* Com modal, painel da tarefa ou menu aberto por cima, o Esc é deles. */
  if (document.querySelector('[role="dialog"][data-state="open"], [role="menu"], [role="listbox"]')) return
  gavetaAberta.value = false
}
onMounted(() => {
  larguraDaGaveta.value = limitar(larguraDaGaveta.value)
  if (itemNoPainel.value) painelRecolhido.value = false
  window.addEventListener('keydown', escDaGaveta)
})
onBeforeUnmount(() => window.removeEventListener('keydown', escDaGaveta))

/** Na visualização Tarefa rápida, o painel abre na tarefa que tem checklist e subtarefas. */
function abrirTarefaDaVista() {
  if (vista.value !== 'tarefa') return
  const x = c.value.tarefas.find(y => !y.mae && y.checklist.length) ?? c.value.tarefas[0]
  if (x) abrirTarefa(x, 'tarefa')
}
watch(vista, (v) => {
  tarefaAberta.value = null
  if (v === 'tarefa') nextTick(abrirTarefaDaVista)
})
/* Depois da hidratação, para o painel abrir já com a página pronta. */
onNuxtReady(abrirTarefaDaVista)

const opcoesDePapel = computed(() => (['conferente', 'resolvedor'] as const).map(p => ({
  value: p,
  label: t.value.andaime.papeis[p],
  nome: c.value.pessoas.find(x => x.id === (p === 'conferente' ? c.value.conferente : c.value.resolvedor))?.nome,
})))

/* Ao trocar de cenário, a pasta e o detalhe abertos ficam para trás. */
watch(cenarioId, () => {
  tarefaAberta.value = null
  router.replace({ query: { vista: vista.value, abertura: abertura.value, cenario: cenarioId.value, papel: papel.value, estado: estadoDaTela.value } })
  nextTick(abrirTarefaDaVista)
})
</script>

<template>
  <div>
    <CascaDoWorkspace
      :t="t"
      :trilha="trilha"
      :workspace="c.workspace"
      :categorias-do-menu="c.categoriasDoMenu"
      :ativo="vista === 'tarefa' ? 'tarefasRapidas' : 'categorias'"
      :avisos="meusAvisos"
      @abrir-aviso="abrirAviso"
      @marcar-lidas="marcarLidas(quem)"
    >
      <!-- Visualização Tarefa rápida: a página Tarefas › Rápidas -->
      <div v-if="vista === 'tarefa'" class="h-[calc(100dvh-4rem-3.25rem)] min-h-0 bg-default">
        <PastaTarefas
          :key="`${cenarioId}-pagina`"
          :t="t"
          :tarefas="c.tarefas"
          :lista="{ pessoas: c.pessoas }"
          variante="pagina"
          @abrir="abrirTarefa"
        />
      </div>

      <div v-else class="relative h-[calc(100dvh-4rem-3.25rem)] min-h-0">
        <!-- Item em painel lateral: o fundo é a listagem da categoria (cópia) -->
        <ListaDaCategoria v-if="itemNoPainel" :t="t" :c="c" :aberto="gavetaAberta" @abrir="abrirGaveta" />
        <Transition enter-active-class="transition-opacity duration-200" enter-from-class="opacity-0" leave-active-class="transition-opacity duration-150" leave-to-class="opacity-0">
          <div v-if="itemNoPainel && gavetaAberta" class="fixed inset-x-0 top-0 bottom-[3.25rem] z-30 bg-default/60" aria-hidden="true" @click="gavetaAberta = false" />
        </Transition>

        <!-- A tela do item: inteira, ou dentro da gaveta da direita -->
        <Transition enter-active-class="transition-transform duration-200 ease-out" enter-from-class="translate-x-full" leave-active-class="transition-transform duration-150 ease-in" leave-to-class="translate-x-full">
        <div
          v-show="!itemNoPainel || gavetaAberta"
          :role="itemNoPainel ? 'dialog' : undefined"
          :aria-label="itemNoPainel ? c.item.reference : undefined"
          class="flex min-h-0"
          :class="itemNoPainel ? 'fixed right-0 top-0 bottom-[3.25rem] z-30 border-l border-default bg-muted pl-4 shadow-xl' : 'h-full'"
          :style="itemNoPainel ? { width: `${larguraDaGaveta}px` } : undefined"
        >
        <!-- Alça de largura, como no develop -->
        <div
          v-if="itemNoPainel"
          role="separator"
          aria-orientation="vertical"
          tabindex="0"
          :aria-label="t.categoria.redimensionar"
          :aria-valuenow="larguraDaGaveta"
          aria-valuemin="400"
          aria-valuemax="1400"
          class="group absolute inset-y-0 left-0 z-10 w-1 cursor-ew-resize transition-colors hover:bg-primary focus-visible:bg-primary focus-visible:outline-none"
          @mousedown="redimensionar"
          @keydown="teclaDaGaveta"
        >
          <span class="absolute inset-y-0 left-0 w-4 -translate-x-1.5" />
          <span class="absolute left-0 top-1/2 h-12 w-1 -translate-y-1/2 rounded-full bg-accented transition-colors group-hover:bg-primary" />
        </div>
        <PainelDoItem v-model:recolhido="painelRecolhido" :t="t" :item="c.item" :categoria="c.categoria" />
        <section class="flex min-w-0 flex-1 flex-col bg-default">
          <BarraDePastas v-model:ativa="ativa" :t="t" :pastas="pastas" @nova="modalNova = true" @editar="editarPasta" />

          <div class="min-h-0 flex-1">
            <Transition
              mode="out-in"
              enter-active-class="transition duration-150 ease-out"
              enter-from-class="opacity-0 translate-y-1"
              leave-active-class="transition duration-75 ease-in"
              leave-to-class="opacity-0"
            >
              <PastaDeApontamentos
                v-if="listaDaPasta"
                :key="`${cenarioId}-${ativa}-${estadoDaTela}`"
                :t="t"
                :lista="listaDaPasta"
                :quem="quem"
                :estado-da-tela="estadoDaTela"
                :chave="ativa"
                @converter="converter"
              />
              <PastaTarefas
                v-else-if="ativa === 'tarefas'"
                :key="`${cenarioId}-tarefas`"
                :t="t"
                :tarefas="c.tarefas"
                :lista="{ pessoas: c.pessoas }"
                @abrir="abrirTarefa"
              />
              <div v-else :key="ativa" class="flex h-full flex-col">
                <div v-if="ativa === 'visao-geral'" class="min-h-0 flex-1 overflow-y-auto">
                  <VisaoGeralDoItem :t="t" :campos="c.camposDaVisaoGeral" />
                </div>
                <div v-else class="flex flex-1 items-center justify-center p-8 text-center">
                  <p class="max-w-sm text-sm text-muted">{{ t.pastas.foraDoEscopo(nomeDaAtiva) }}</p>
                </div>
                <!-- Rodapé da Visão Geral, copiado: o aviso aparece sem nenhuma alteração (achado) -->
                <footer v-if="ativa === 'visao-geral'" class="flex items-center gap-3 border-t border-default px-5 py-2.5">
                  <span class="flex items-center gap-1.5 text-xs text-muted"><span class="size-1.5 rounded-full bg-warning" />{{ t.pastas.alteracoesNaoSalvas }}</span>
                  <UButton :label="t.pastas.sairSemSalvar" icon="i-lucide-undo-2" color="neutral" variant="ghost" size="sm" class="ml-auto" />
                  <UButton :label="t.pastas.salvar" icon="i-lucide-save" size="sm" />
                </footer>
              </div>
            </Transition>
          </div>
        </section>
        </div>
        </Transition>
      </div>
    </CascaDoWorkspace>

    <PainelDaTarefa
      v-if="tarefaAberta && listaDaTarefa"
      v-model:open="painelAberto"
      v-model:aba="abaDaTarefa"
      :t="t"
      :x="tarefaAberta"
      :lista="listaDaTarefa"
      :quem="quem"
      :estado-da-tela="estadoDaTela"
      :tarefas="c.tarefas"
      :mencoes="c.mencoes"
      @converter="converter"
      @abrir="trocarDeTarefa"
    />

    <ModalNovaPasta v-model:open="modalNova" :t="t" :pessoas="c.pessoas" :responsavel-padrao="c.resolvedor" ja-existe @criar="criarPasta" />
    <ModalNovaPasta v-model:open="editandoPasta" :t="t" :pessoas="c.pessoas" :responsavel-padrao="c.resolvedor" :editando="c.config" @salvar="salvarPasta" />

    <!-- ANDAIME DE PROTÓTIPO, não faz parte da proposta -->
    <div class="fixed inset-x-0 bottom-0 z-40 border-t border-default bg-elevated/95 backdrop-blur">
      <div class="flex flex-wrap items-center gap-2 px-4 py-2.5">
        <span class="text-xs font-semibold uppercase tracking-wider text-muted">{{ t.tarefaRapida.andaime.vista }}</span>
        <UFieldGroup size="xs">
          <UButton
            v-for="v in (['item', 'tarefa'] as const)"
            :key="v"
            :label="t.tarefaRapida.andaime.vistas[v]"
            :icon="v === 'item' ? 'i-lucide-file-text' : 'i-lucide-clipboard-check'"
            :color="vista === v ? 'primary' : 'neutral'"
            :variant="vista === v ? 'solid' : 'outline'"
            @click="vista = v"
          />
        </UFieldGroup>

        <template v-if="vista === 'item'">
          <span class="mx-1 h-5 w-px bg-accented" aria-hidden="true" />
          <span class="text-xs font-semibold uppercase tracking-wider text-muted">{{ t.tarefaRapida.andaime.abertura }}</span>
          <UFieldGroup size="xs">
            <UButton
              v-for="a in (['tela', 'painel'] as const)"
              :key="a"
              :label="t.tarefaRapida.andaime.aberturas[a]"
              :icon="a === 'tela' ? 'i-lucide-maximize-2' : 'i-lucide-panel-right'"
              :color="abertura === a ? 'primary' : 'neutral'"
              :variant="abertura === a ? 'solid' : 'outline'"
              @click="abertura = a"
            />
          </UFieldGroup>
        </template>

        <span class="mx-1 h-5 w-px bg-accented" aria-hidden="true" />
        <span class="text-xs font-semibold uppercase tracking-wider text-muted">{{ t.andaime.cenario }}</span>
        <UFieldGroup size="xs">
          <UButton
            v-for="id in (['produto', 'juridico'] as const)"
            :key="id"
            :label="t.andaime.cenarios[id]"
            :color="cenarioId === id ? 'primary' : 'neutral'"
            :variant="cenarioId === id ? 'solid' : 'outline'"
            @click="cenarioId = id"
          />
        </UFieldGroup>

        <span class="mx-1 h-5 w-px bg-accented" aria-hidden="true" />
        <span class="text-xs font-semibold uppercase tracking-wider text-muted">{{ t.andaime.voceE }}</span>
        <UFieldGroup size="xs">
          <UTooltip v-for="p in opcoesDePapel" :key="p.value" :text="p.nome">
            <UButton
              :label="p.label"
              :color="papel === p.value ? 'primary' : 'neutral'"
              :variant="papel === p.value ? 'solid' : 'outline'"
              @click="papel = p.value"
            />
          </UTooltip>
        </UFieldGroup>

        <span class="mx-1 h-5 w-px bg-accented" aria-hidden="true" />
        <span class="text-xs font-semibold uppercase tracking-wider text-muted">{{ t.andaime.estado }}</span>
        <UFieldGroup size="xs">
          <UButton
            v-for="e in (['cheio', 'vazio', 'carregando', 'semPermissao'] as const)"
            :key="e"
            :label="t.andaime.estados[e]"
            :color="estadoDaTela === e ? 'primary' : 'neutral'"
            :variant="estadoDaTela === e ? 'solid' : 'outline'"
            @click="estadoDaTela = e"
          />
        </UFieldGroup>

        <ControlesDePrototipo class="ml-auto" />

        <span class="flex flex-wrap items-center gap-2">
          <span class="text-xs font-semibold uppercase tracking-wider text-muted">{{ t.andaime.porTras }}</span>
          <PainelDeContexto
            :briefing="briefingMd"
            :pesquisa="pesquisaMd"
            :decisoes="decisoesMd"
            repositorio="https://github.com/pernalombr4/prototipos/tree/main/app/pages/pasta-de-apontamentos"
          />
        </span>
      </div>
    </div>
  </div>
</template>
