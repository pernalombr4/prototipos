<script setup lang="ts">
/**
 * PROPOSTA (rodada 5): a linha de filtros abaixo da barra de ferramentas, no desenho do Notion.
 *
 * - os 2 filtros automáticos ("Só itens meus", "Só itens dos meus grupos") como etiqueta com X;
 * - 1 chip por filtro simples (`_ChipDeFiltro`); todos valem juntos;
 * - o chip "N regras" abre o filtro avançado (`_ConstrutorDeRegras`), que vale junto com os simples;
 * - "+ Filtro" lista os campos com busca e, no fim, "Filtro avançado" e "Filtro rápido";
 * - rodada 8: os filtros rápidos que a pessoa cria são botões no começo da linha, que ligam e desligam.
 *   Ligar não é alteração da visualização; criar, editar e excluir o botão é.
 * - rodada 8: os botões que não cabem vão para um "+N" no fim do grupo, como as pílulas da barra; o ligado fica
 *   sempre na linha. Os chips dos filtros aplicados nunca se escondem: quebram para a linha de baixo.
 *
 * Tudo vira rascunho da visualização: a barra flutuante oferece salvar para todos ou como nova.
 */
import type { FiltroDeCampo, FiltroRapido, GrupoDeRegras, Visualizacao } from './mocks'
import type { Textos } from './textos'
import { CAMPOS, ICONE_DO_SUGERIDO, ICONE_DO_TIPO, campoPorPath, clonar, idDoSugerido, sugeridosComoBotao } from './mocks'
import type { Sugerido } from './mocks'
import { campoLivre, contarRegras, regraNova, useDescricaoDeFiltro } from './filtros'
import ChipDeFiltro from './_ChipDeFiltro.vue'
import ConstrutorDeRegras from './_ConstrutorDeRegras.vue'
import EditorDeFiltroRapido from './_EditorDeFiltroRapido.vue'

type Filtros = Visualizacao['filters']

const props = defineProps<{ t: Textos, idioma: string }>()
const filtros = defineModel<Filtros>({ required: true })
/** Os filtros rápidos ligados agora. Não entram na visualização: valem até sair da tela. */
const ligados = defineModel<string[]>('ligados', { default: () => [] })
const toast = useToast()

const { valorCurto, descreverGrupo } = useDescricaoDeFiltro(toRef(props, 't'), toRef(props, 'idioma'))

const simples = computed(() => filtros.value.field_filters ?? [])
const rapidos = computed(() => filtros.value.quick_filters ?? [])
const avancado = computed(() => filtros.value.avancado)
const botoes = computed(() => filtros.value.rapidos ?? [])
/* Rodada 8: os nativos são botões em toda visualização, por padrão; o que a visualização aplica sempre é chip fixo, como hoje. */
const fixos = computed(() => rapidos.value.filter(q => q.required))
const sugeridos = computed<Sugerido[]>(() => sugeridosComoBotao(filtros.value))

const mudar = (parte: Partial<Filtros>) => { filtros.value = { ...clonar(filtros.value), ...parte } }

/* ---------- filtros simples ---------- */

const chipAberto = ref<number | null>(null)

function trocarSimples(i: number, r: FiltroDeCampo) {
  mudar({ field_filters: simples.value.map((x, j) => j === i ? r : x) })
}
function excluirSimples(i: number) {
  mudar({ field_filters: simples.value.filter((_, j) => j !== i) })
}

/** "Filtrar" no menu da coluna e o campo escolhido no "+ Filtro": abre o chip do campo, ou cria. */
async function filtrarPor(path: string) {
  indoParaChip = maisAberto.value
  maisAberto.value = false
  const i = simples.value.findIndex(f => f.field === path)
  if (i < 0) mudar({ field_filters: [...simples.value, regraNova(path)] })
  await nextTick()
  chipAberto.value = i < 0 ? simples.value.length - 1 : i
}

/* ---------- filtro avançado ---------- */

const avancadoAberto = ref(false)

async function abrirAvancado() {
  indoParaChip = maisAberto.value
  maisAberto.value = false
  if (!avancado.value) {
    const usados = simples.value.map(f => f.field)
    mudar({ avancado: { conector: 'and', regras: [regraNova(campoLivre(usados).path)] } })
  }
  await nextTick()
  avancadoAberto.value = true
}

async function levarParaAvancado(i: number) {
  const regra = simples.value[i]!
  const atual = avancado.value ?? { conector: 'and' as const, regras: [] }
  mudar({ field_filters: simples.value.filter((_, j) => j !== i), avancado: { ...atual, regras: [...atual.regras, regra] } })
  await nextTick()
  avancadoAberto.value = true
}

/* O filtro avançado que ficou sem regra some ao fechar. */
watch(avancadoAberto, (aberto) => {
  if (!aberto && avancado.value && !avancado.value.regras.length) mudar({ avancado: undefined })
})

/* ---------- "+ Filtro" ---------- */

const maisAberto = ref(false)
/* Escolher um campo abre o chip dele: o foco não volta para o "+ Filtro", senão o chip recém-aberto fecharia. */
let indoParaChip = false
function aoDevolverFocoMais(e: Event) {
  if (!indoParaChip) return
  indoParaChip = false
  e.preventDefault()
}
const busca = ref('')
const camposVisiveis = computed(() => {
  const q = busca.value.trim().toLowerCase()
  return CAMPOS.filter(c => !q || c.label.toLowerCase().includes(q))
})
watch(maisAberto, (v) => { if (!v) busca.value = '' })

function tirarRapido(filtro: string) {
  mudar({ quick_filters: rapidos.value.filter(q => q.filter !== filtro) })
}

/* ---------- filtros rápidos (rodada 8) ---------- */

function alternar(id: string) {
  ligados.value = ligados.value.includes(id) ? ligados.value.filter(x => x !== id) : [...ligados.value, id]
}

const editor = reactive({ aberto: false, editando: false, inicial: null as FiltroRapido | null, doChip: null as number | null })
const nomesUsados = computed(() => botoes.value.filter(b => b.id !== editor.inicial?.id).map(b => b.nome))

function abrirEditor(inicial: FiltroRapido, editando: boolean, doChip: number | null = null) {
  Object.assign(editor, { inicial, editando, doChip })
  editor.aberto = true
}
function novoRapido() {
  maisAberto.value = false
  abrirEditor({ id: '', nome: '', regras: { conector: 'and', regras: [regraNova(campoLivre([]).path)] } }, false)
}
/* O chip vira botão: o nome sugerido é o texto do chip, e o botão nasce ligado, com o mesmo resultado. */
function rapidoDoChip(i: number) {
  const r = simples.value[i]!
  const nome = `${campoPorPath(r.field)?.label ?? r.field}: ${valorCurto(r)}`.slice(0, 40)
  abrirEditor({ id: '', nome, regras: { conector: 'and', regras: [clonar(r)] } }, false, i)
}

function salvarRapido(f: FiltroRapido) {
  if (editor.editando) {
    mudar({ rapidos: botoes.value.map(b => b.id === f.id ? f : b) })
    toast.add({ title: props.t.rapido.alterado(f.nome), icon: 'i-lucide-zap' })
    return
  }
  const campos = editor.doChip === null ? simples.value : simples.value.filter((_, j) => j !== editor.doChip)
  mudar({ rapidos: [...botoes.value, f], field_filters: campos })
  ligados.value = [...ligados.value, f.id]
  toast.add({ title: props.t.rapido.criado(f.nome), description: props.t.rapido.criadoAjuda, icon: 'i-lucide-zap' })
}
function excluirRapido() {
  const f = editor.inicial
  if (!f) return
  mudar({ rapidos: botoes.value.filter(b => b.id !== f.id) })
  ligados.value = ligados.value.filter(x => x !== f.id)
  toast.add({ title: props.t.rapido.excluido(f.nome), icon: 'i-lucide-trash-2' })
}

const menuDoBotao = (b: FiltroRapido) => [[
  { label: props.t.rapido.editar, icon: 'i-lucide-pencil', onSelect: () => abrirEditor(clonar(b), true) },
], [
  { label: props.t.rapido.excluir, icon: 'i-lucide-trash-2', color: 'error' as const, onSelect: () => { editor.inicial = b; excluirRapido() } },
]]

/* ---------- quantos filtros rápidos cabem (rodada 8) ----------
 * Mesma regra da barra de visualizações: mede cada botão numa cópia escondida e mostra os que cabem, na ordem.
 * O grupo fica com o espaço que os chips e o "+ Filtro" deixam: os botões cedem lugar antes, e os chips só quebram
 * de linha quando nem o "+N" com os botões ligados cabe. */

type ItemRapido = { id: string, nome: string, sistema: Sugerido | null, botao: FiltroRapido | null }
const todosRapidos = computed<ItemRapido[]>(() => [
  ...sugeridos.value.map(f => ({ id: idDoSugerido(f), nome: props.t.rapido.sugerido[f].nome, sistema: f, botao: null })),
  ...botoes.value.map(b => ({ id: b.id, nome: b.nome, sistema: null, botao: b })),
])

const linha = ref<HTMLElement>()
const medidas = ref<HTMLElement>()
const larguraDaLinha = ref(0)
const larguraDoResto = ref(0)
const larguraDe = ref<Record<string, number>>({})
const VAO = 6
/** O "+N" e o separador. */
const RESERVA_RAPIDOS = 64

function medirRapidos() {
  if (!linha.value || !medidas.value) return
  const estilo = getComputedStyle(linha.value)
  larguraDaLinha.value = linha.value.clientWidth - parseFloat(estilo.paddingLeft) - parseFloat(estilo.paddingRight)
  larguraDoResto.value = [...linha.value.children]
    .filter(el => el instanceof HTMLElement && !el.hasAttribute('data-rapidos') && !el.hasAttribute('data-medidas'))
    .reduce((soma, el) => soma + (el as HTMLElement).offsetWidth + VAO, 0)
  const novas: Record<string, number> = {}
  medidas.value.querySelectorAll<HTMLElement>('[data-medida]').forEach((el) => { novas[el.dataset.medida!] = el.offsetWidth })
  larguraDe.value = novas
}

let observador: ResizeObserver | undefined
onMounted(() => {
  observador = new ResizeObserver(() => medirRapidos())
  if (linha.value) observador.observe(linha.value)
  // A cópia muda de largura quando a fonte termina de carregar ou o idioma troca.
  if (medidas.value) observador.observe(medidas.value)
  nextTick(medirRapidos)
})
onBeforeUnmount(() => observador?.disconnect())
watch(() => [props.t, filtros.value, ligados.value], () => nextTick(medirRapidos), { deep: true })

const rapidosVisiveis = computed<Set<string>>(() => {
  const itens = todosRapidos.value
  const w = (r: ItemRapido) => (larguraDe.value[r.id] ?? 110) + VAO
  if (!larguraDaLinha.value) return new Set(itens.map(r => r.id))
  const espaco = larguraDaLinha.value - larguraDoResto.value
  const total = itens.reduce((s, r) => s + w(r), 0)
  if (total <= espaco) return new Set(itens.map(r => r.id))
  const limite = espaco - RESERVA_RAPIDOS
  const cabem: ItemRapido[] = []
  let soma = 0
  for (const r of itens) {
    if (soma + w(r) > limite) break
    cabem.push(r)
    soma += w(r)
  }
  // O ligado nunca vai para o "+N": entra no lugar do último desligado que cabia.
  for (const r of itens.filter(x => ligados.value.includes(x.id) && !cabem.includes(x))) {
    while (soma + w(r) > limite) {
      const i = cabem.map(x => ligados.value.includes(x.id)).lastIndexOf(false)
      if (i < 0) break
      soma -= w(cabem[i]!)
      cabem.splice(i, 1)
    }
    cabem.push(r)
    soma += w(r)
  }
  return new Set(cabem.map(r => r.id))
})
const sugeridosVisiveis = computed(() => sugeridos.value.filter(f => rapidosVisiveis.value.has(idDoSugerido(f))))
const botoesVisiveis = computed(() => botoes.value.filter(b => rapidosVisiveis.value.has(b.id)))
const rapidosEscondidos = computed(() => todosRapidos.value.filter(r => !rapidosVisiveis.value.has(r.id)))
const maisRapidosAberto = ref(false)

defineExpose({ filtrarPor, abrirMais: async () => { await nextTick(); maisAberto.value = true } })
</script>

<template>
  <div ref="linha" class="relative flex flex-wrap items-center gap-1.5 border-b border-default bg-elevated/40 px-4 py-1.5">
    <UIcon name="i-lucide-filter" class="size-3.5 text-muted" />

    <!-- PROPOSTA (rodada 8): os filtros rápidos da visualização, botões que ligam e desligam -->
    <template v-if="botoes.length || sugeridos.length">
      <div role="group" :aria-label="t.rapido.grupo" class="flex items-center gap-1.5" data-rapidos>
        <UTooltip v-for="f in sugeridosVisiveis" :key="f" :delay-duration="400" :content="{ side: 'bottom' }">
          <UButton
            :label="t.rapido.sugerido[f].nome"
            :icon="ligados.includes(idDoSugerido(f)) ? 'i-lucide-check' : ICONE_DO_SUGERIDO[f]"
            :color="ligados.includes(idDoSugerido(f)) ? 'primary' : 'neutral'"
            :variant="ligados.includes(idDoSugerido(f)) ? 'soft' : 'outline'"
            size="xs"
            :aria-pressed="ligados.includes(idDoSugerido(f))"
            class="transition-colors"
            @click="alternar(idDoSugerido(f))"
          />
          <template #content>
            <div class="max-w-72 space-y-0.5 py-0.5">
              <p class="font-medium text-highlighted">{{ t.rapido.sugerido[f].ajuda }}</p>
              <p class="text-muted">{{ t.rapido.dicaSistema }}</p>
            </div>
          </template>
        </UTooltip>
        <UContextMenu v-for="b in botoesVisiveis" :key="b.id" :items="menuDoBotao(b)">
          <UTooltip :delay-duration="400" :content="{ side: 'bottom' }">
            <UButton
              :label="b.nome"
              :icon="ligados.includes(b.id) ? 'i-lucide-check' : 'i-lucide-zap'"
              :color="ligados.includes(b.id) ? 'primary' : 'neutral'"
              :variant="ligados.includes(b.id) ? 'soft' : 'outline'"
              size="xs"
              :aria-pressed="ligados.includes(b.id)"
              class="transition-colors"
              @click="alternar(b.id)"
            />
            <template #content>
              <div class="max-w-72 space-y-0.5 py-0.5">
                <p class="font-medium text-highlighted">{{ descreverGrupo(b.regras) }}</p>
                <p class="text-muted">{{ t.rapido.dicaAcao }}</p>
              </div>
            </template>
          </UTooltip>
        </UContextMenu>

        <!-- Rodada 8: os que não cabem. Todos aqui estão desligados; ligar leva o botão para a linha. -->
        <UPopover v-if="rapidosEscondidos.length" v-model:open="maisRapidosAberto" :content="{ align: 'start', sideOffset: 6 }">
          <UButton
            :label="`+${rapidosEscondidos.length}`"
            trailing-icon="i-lucide-chevron-down"
            color="neutral"
            variant="outline"
            size="xs"
            :aria-label="t.rapido.maisN(rapidosEscondidos.length)"
          />
          <template #content>
            <div class="w-64 p-1">
              <p class="px-2 pb-1 pt-1.5 text-xs text-muted">{{ t.rapido.maisAjuda }}</p>
              <div v-for="r in rapidosEscondidos" :key="r.id" class="flex items-center">
                <UButton
                  :label="r.nome"
                  :icon="r.sistema ? ICONE_DO_SUGERIDO[r.sistema] : 'i-lucide-zap'"
                  color="neutral"
                  variant="ghost"
                  size="sm"
                  block
                  class="min-w-0 flex-1 justify-start"
                  @click="alternar(r.id)"
                />
                <UButton
                  v-if="r.botao"
                  icon="i-lucide-pencil"
                  color="neutral"
                  variant="ghost"
                  size="sm"
                  :aria-label="t.rapido.editarNome(r.nome)"
                  @click="maisRapidosAberto = false; abrirEditor(clonar(r.botao), true)"
                />
              </div>
              <USeparator class="my-1" />
              <UButton :label="t.rapido.novo" icon="i-lucide-plus" color="neutral" variant="ghost" size="sm" block class="justify-start" @click="maisRapidosAberto = false; novoRapido()" />
            </div>
          </template>
        </UPopover>
      </div>
      <span class="mx-0.5 h-4 w-px bg-accented" aria-hidden="true" data-rapidos />
    </template>

    <UBadge
      v-for="q in fixos"
      :key="q.filter"
      :label="q.filter === 'isOwner' ? t.resumo.meus : t.resumo.meusGrupos"
      color="neutral"
      variant="soft"
      size="md"
      class="gap-1 rounded-full pr-1"
    >
      <template #trailing>
        <UButton icon="i-lucide-x" color="neutral" variant="link" size="xs" class="p-0" :aria-label="t.linha.tirar(q.filter === 'isOwner' ? t.resumo.meus : t.resumo.meusGrupos)" @click="tirarRapido(q.filter)" />
      </template>
    </UBadge>

    <ChipDeFiltro
      v-for="(r, i) in simples"
      :key="`${r.field}-${i}`"
      :model-value="r"
      :open="chipAberto === i"
      :t="t"
      :valor-curto="valorCurto(r)"
      @update:model-value="(x: FiltroDeCampo) => trocarSimples(i, x)"
      @update:open="(v: boolean) => (chipAberto = v ? i : null)"
      @excluir="excluirSimples(i)"
      @levar="levarParaAvancado(i)"
      @rapido="rapidoDoChip(i)"
    />

    <UPopover v-if="avancado" v-model:open="avancadoAberto" :content="{ align: 'start', sideOffset: 6 }">
      <UButton
        :label="t.filtro.regras(contarRegras(avancado))"
        icon="i-lucide-list-filter"
        trailing-icon="i-lucide-chevron-down"
        color="primary"
        variant="soft"
        size="xs"
        class="rounded-full"
      />
      <template #content>
        <div class="w-[46rem] max-w-[calc(100vw-2rem)] p-2">
          <ConstrutorDeRegras
            :model-value="avancado"
            :t="t"
            @update:model-value="(g: GrupoDeRegras) => mudar({ avancado: g })"
          />
          <USeparator class="my-1.5" />
          <UButton :label="t.filtro.excluirAvancado" icon="i-lucide-trash-2" color="neutral" variant="ghost" size="sm" @click="avancadoAberto = false; mudar({ avancado: undefined })" />
        </div>
      </template>
    </UPopover>

    <UPopover v-model:open="maisAberto" :content="{ align: 'start', sideOffset: 6, onCloseAutoFocus: aoDevolverFocoMais }">
      <UButton :label="t.linha.filtro" icon="i-lucide-plus" color="neutral" variant="ghost" size="xs" />
      <template #content>
        <div class="w-60 p-1">
          <UInput v-model="busca" :placeholder="t.filtro.buscarCampo" icon="i-lucide-search" size="sm" variant="none" class="w-full" autofocus />
          <USeparator class="my-1" />
          <div class="max-h-72 overflow-y-auto">
            <UButton
              v-for="c in camposVisiveis"
              :key="c.path"
              :label="c.label"
              :icon="ICONE_DO_TIPO[c.tipo]"
              color="neutral"
              variant="ghost"
              size="sm"
              block
              class="justify-start"
              @click="filtrarPor(c.path)"
            />
            <p v-if="!camposVisiveis.length" class="px-2 py-1.5 text-sm text-muted">{{ t.filtro.semCampo }}</p>
          </div>
          <USeparator class="my-1" />
          <UButton color="neutral" variant="ghost" size="sm" block class="justify-start" icon="i-lucide-list-filter" @click="abrirAvancado">
            <span class="flex-1 text-left">{{ t.filtro.avancado }}</span>
            <span v-if="avancado" class="text-xs text-muted">{{ t.filtro.regras(contarRegras(avancado)) }}</span>
          </UButton>
          <UButton :label="t.rapido.noMais" color="neutral" variant="ghost" size="sm" block class="justify-start" icon="i-lucide-zap" @click="novoRapido" />
        </div>
      </template>
    </UPopover>

    <!-- Cópia escondida dos filtros rápidos, só para medir a largura de cada um. -->
    <div ref="medidas" data-medidas aria-hidden="true" class="pointer-events-none invisible absolute left-0 top-0 flex gap-1.5">
      <UButton v-for="r in todosRapidos" :key="r.id" :data-medida="r.id" :label="r.nome" icon="i-lucide-zap" color="neutral" variant="outline" size="xs" tabindex="-1" />
    </div>

    <EditorDeFiltroRapido
      v-model:open="editor.aberto"
      :t="t"
      :inicial="editor.inicial"
      :editando="editor.editando"
      :nomes-usados="nomesUsados"
      @salvar="salvarRapido"
      @excluir="excluirRapido"
    />
  </div>
</template>
