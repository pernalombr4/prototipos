<script setup lang="ts">
/**
 * PROPOSTA (rodada 5): a linha de filtros abaixo da barra de ferramentas, no desenho do Notion.
 *
 * - os 2 filtros automáticos ("Só itens meus", "Só itens dos meus grupos") como etiqueta com X;
 * - 1 chip por filtro simples (`_ChipDeFiltro`); todos valem juntos;
 * - o chip "N regras" abre o filtro avançado (`_ConstrutorDeRegras`), que vale junto com os simples;
 * - "+ Filtro" lista os campos com busca e, no fim, "Filtro avançado".
 *
 * Tudo vira rascunho da visualização: a barra flutuante oferece salvar para todos ou como nova.
 */
import type { FiltroDeCampo, GrupoDeRegras, Visualizacao } from './mocks'
import type { Textos } from './textos'
import { CAMPOS, ICONE_DO_TIPO, clonar } from './mocks'
import { campoLivre, contarRegras, regraNova, useDescricaoDeFiltro } from './filtros'
import ChipDeFiltro from './_ChipDeFiltro.vue'
import ConstrutorDeRegras from './_ConstrutorDeRegras.vue'

type Filtros = Visualizacao['filters']

const props = defineProps<{ t: Textos, idioma: string }>()
const filtros = defineModel<Filtros>({ required: true })

const { valorCurto } = useDescricaoDeFiltro(toRef(props, 't'), toRef(props, 'idioma'))

const simples = computed(() => filtros.value.field_filters ?? [])
const rapidos = computed(() => filtros.value.quick_filters ?? [])
const avancado = computed(() => filtros.value.avancado)

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
  maisAberto.value = false
  const i = simples.value.findIndex(f => f.field === path)
  if (i < 0) mudar({ field_filters: [...simples.value, regraNova(path)] })
  await nextTick()
  chipAberto.value = i < 0 ? simples.value.length - 1 : i
}

/* ---------- filtro avançado ---------- */

const avancadoAberto = ref(false)

async function abrirAvancado() {
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
const busca = ref('')
const camposVisiveis = computed(() => {
  const q = busca.value.trim().toLowerCase()
  return CAMPOS.filter(c => !q || c.label.toLowerCase().includes(q))
})
watch(maisAberto, (v) => { if (!v) busca.value = '' })

function tirarRapido(filtro: string) {
  mudar({ quick_filters: rapidos.value.filter(q => q.filter !== filtro) })
}

defineExpose({ filtrarPor, abrirMais: async () => { await nextTick(); maisAberto.value = true } })
</script>

<template>
  <div class="flex flex-wrap items-center gap-1.5 border-b border-default bg-elevated/40 px-4 py-1.5">
    <UIcon name="i-lucide-filter" class="size-3.5 text-muted" />

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

    <UPopover v-model:open="maisAberto" :content="{ align: 'start', sideOffset: 6 }">
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
        </div>
      </template>
    </UPopover>
  </div>
</template>
