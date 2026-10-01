<script setup lang="ts">
/**
 * Gráfico de barras horizontais, ordenado do maior para o menor: o formato de
 * ranking entre muitas categorias com nome longo (pessoas, fluxos, tarefas).
 * Rodada 3: substitui as "barras de progresso" finas, com trilho cinza, que
 * pareciam linhas marcadas e não gráfico.
 *
 * - barra grossa, sem trilho, cantos pouco arredondados: lê-se como barra de
 *   gráfico, não como progresso;
 * - o valor fica na ponta da barra (rótulo direto, sem eixo para consultar);
 * - a barra pode ser empilhada (partes com cor), com a legenda embaixo; a
 *   parte larga o bastante leva o nome dentro, e todas dizem nome e valor no
 *   ponteiro e no leitor de tela;
 * - cada barra é um botão: abre a lista ou desce de nível;
 * - rolagem infinita quando a lista é longa (`UScrollArea` + sentinela).
 *
 * Por que HTML e não o Unovis: o gráfico de barras do Unovis não recebe foco
 * nem Enter, e aqui cada barra é uma ação. Nuxt UI: a barra de uma cor é o
 * `UProgressGroup`, sem trilho e na altura de barra. A empilhada é HTML
 * próprio: o `UProgressGroup` só aceita cor da paleta (o cinza de "Pendente" e
 * os tons das etapas ficam de fora) e não põe texto dentro da parte.
 */
import type { Textos } from './textos'
import Sentinela from './_Sentinela.vue'

export interface ParteDaBarra {
  valor: number
  /** Cor do Nuxt UI (error, warning...) ou cor CSS. */
  cor: string
  rotulo: string
  /** O valor formatado, para o ponteiro e o leitor de tela. */
  texto?: string
  /** Põe o nome dentro da parte, quando ela é larga o bastante. */
  rotuloDentro?: boolean
  /** Classe da cor do nome dentro da parte; o padrão é `text-highlighted`. */
  classeDoTexto?: string
}

export interface BarraDoGrafico {
  chave: string
  rotulo: string
  /** Texto pequeno embaixo do rótulo (o caminho na hierarquia). */
  apoio?: string | null
  avatar?: string
  icone?: string
  valor: number
  /** O valor formatado, na ponta da barra. */
  texto: string
  partes?: ParteDaBarra[]
  cor?: string
  destaque?: boolean
}

const props = withDefaults(defineProps<{
  t: Textos
  barras: BarraDoGrafico[]
  legenda?: { rotulo: string, cor: string }[]
  vazio: string
  /** Largura da coluna do nome. */
  larguraDoRotulo?: string
  lote?: number
}>(), { larguraDoRotulo: '12rem', lote: 12 })

const emit = defineEmits<{ abrir: [chave: string] }>()

const maior = computed(() => Math.max(1, ...props.barras.map(b => b.valor)))

const visiveis = ref(props.lote)
watch(() => props.barras, () => { visiveis.value = props.lote })

/** Classe escrita por extenso: o Tailwind só gera a classe que aparece inteira no código. */
const FUNDO: Record<string, string> = {
  primary: 'bg-primary', secondary: 'bg-secondary', success: 'bg-success', info: 'bg-info',
  warning: 'bg-warning', error: 'bg-error', neutral: 'bg-inverted',
}
function itens(b: BarraDoGrafico) {
  return [{ value: b.valor, color: b.cor ?? 'primary', label: b.rotulo }]
}
function classeDaCor(cor: string) {
  return FUNDO[cor] ?? ''
}
const largura = (b: BarraDoGrafico) => `max(0.25rem, calc(${(b.valor / maior.value) * 100}% - 4.5rem))`
const partesVisiveis = (b: BarraDoGrafico) => (b.partes ?? []).filter(p => p.valor > 0)
function rotuloAcessivel(b: BarraDoGrafico) {
  const partes = partesVisiveis(b)
  if (!partes.length) return `${b.rotulo}: ${b.texto}`
  return `${b.rotulo}: ${b.texto}. ${partes.map(p => `${p.rotulo} ${p.texto ?? p.valor}`).join(', ')}`
}
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <UScrollArea data-rolagem class="min-h-0 flex-1 px-4 pb-2" :ui="{ viewport: 'gap-1' }">
      <UEmpty v-if="!barras.length" icon="i-lucide-chart-bar" :title="vazio" variant="naked" size="sm" />
      <button
        v-for="b in barras.slice(0, visiveis)"
        :key="b.chave"
        type="button"
        class="-mx-2 grid w-[calc(100%+1rem)] items-center gap-3 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-elevated focus-visible:outline-2 focus-visible:outline-primary"
        :style="{ gridTemplateColumns: `minmax(0, ${larguraDoRotulo}) 1fr` }"
        :aria-label="rotuloAcessivel(b)"
        @click="emit('abrir', b.chave)"
      >
        <span class="flex min-w-0 items-center gap-2 text-sm">
          <UAvatar v-if="b.avatar" :text="b.avatar" size="2xs" />
          <span v-else-if="b.icone" class="flex size-5 shrink-0 items-center justify-center rounded-full bg-elevated">
            <UIcon :name="b.icone" class="size-3 text-muted" />
          </span>
          <span class="min-w-0">
            <span class="block truncate" :class="b.destaque ? 'font-medium text-highlighted' : 'text-toned'">{{ b.rotulo }}</span>
            <span v-if="b.apoio" class="block truncate text-xs text-muted">{{ b.apoio }}</span>
          </span>
        </span>
        <!-- A barra e o valor na ponta. -->
        <span class="flex min-w-0 items-center gap-2">
          <!-- Empilhada: uma parte por grupo, com o nome dentro quando cabe. -->
          <span
            v-if="partesVisiveis(b).length"
            class="flex h-5 shrink-0 gap-px overflow-hidden rounded-sm transition-[width] duration-300"
            :style="{ width: largura(b) }"
          >
            <span
              v-for="(p, k) in partesVisiveis(b)"
              :key="k"
              class="flex h-full min-w-0 basis-0 items-center overflow-hidden px-1.5"
              :class="[classeDaCor(p.cor), p.classeDoTexto ?? 'text-highlighted']"
              :style="{ flexGrow: p.valor, backgroundColor: classeDaCor(p.cor) ? undefined : p.cor }"
              :title="`${p.rotulo}: ${p.texto ?? p.valor}`"
            >
              <span v-if="p.rotuloDentro && p.valor / maior >= 0.16" class="truncate text-[11px] font-medium leading-none">{{ p.rotulo }}</span>
            </span>
          </span>
          <!-- Uma cor fora da paleta do Nuxt UI (o cinza de "Pendente"): barra simples. -->
          <span
            v-else-if="b.cor && !classeDaCor(b.cor)"
            class="block h-5 shrink-0 rounded-sm transition-[width] duration-300"
            :style="{ width: largura(b), backgroundColor: b.cor }"
          />
          <UProgressGroup
            v-else
            :items="itens(b)"
            :max="b.valor || 1"
            size="2xl"
            :ui="{ list: 'hidden', base: 'rounded-sm bg-transparent' }"
            class="shrink-0 transition-[width] duration-300"
            :style="{ width: largura(b) }"
          />
          <span class="shrink-0 text-sm font-semibold tabular-nums text-highlighted">{{ b.texto }}</span>
        </span>
      </button>
      <Sentinela v-if="barras.length > lote" :t="t" :tem-mais="visiveis < barras.length" :total="barras.length" @mais="visiveis += lote" />
    </UScrollArea>
    <ul v-if="legenda?.length" class="flex flex-wrap gap-x-4 gap-y-1 border-t border-default px-4 py-2 text-xs text-muted">
      <li v-for="item in legenda" :key="item.rotulo" class="flex items-center gap-1.5">
        <span class="size-2 rounded-sm" :class="classeDaCor(item.cor)" :style="classeDaCor(item.cor) ? undefined : { backgroundColor: item.cor }" />
        {{ item.rotulo }}
      </li>
    </ul>
  </div>
</template>
