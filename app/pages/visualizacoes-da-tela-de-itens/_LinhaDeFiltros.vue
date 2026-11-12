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
 *
 * Tudo vira rascunho da visualização: a barra flutuante oferece salvar para todos ou como nova.
 */
import type { FiltroDeCampo, FiltroRapido, GrupoDeRegras, Visualizacao } from './mocks'
import type { Textos } from './textos'
import { CAMPOS, ICONE_DO_TIPO, campoPorPath, clonar } from './mocks'
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

defineExpose({ filtrarPor, abrirMais: async () => { await nextTick(); maisAberto.value = true } })
</script>

<template>
  <div class="flex flex-wrap items-center gap-1.5 border-b border-default bg-elevated/40 px-4 py-1.5">
    <UIcon name="i-lucide-filter" class="size-3.5 text-muted" />

    <!-- PROPOSTA (rodada 8): os filtros rápidos da visualização, botões que ligam e desligam -->
    <template v-if="botoes.length">
      <div role="group" :aria-label="t.rapido.grupo" class="flex flex-wrap items-center gap-1.5">
        <UContextMenu v-for="b in botoes" :key="b.id" :items="menuDoBotao(b)">
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
      </div>
      <span class="mx-0.5 h-4 w-px bg-accented" aria-hidden="true" />
    </template>

    <UBadge
      v-for="q in rapidos"
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
