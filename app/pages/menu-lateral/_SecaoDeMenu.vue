<script setup lang="ts">
/**
 * Seção nomeada e recolhível: a unidade de organização do meio da barra.
 *
 * É o padrão 5 da pesquisa (Notion, ClickUp, Attio, Linear, monday, Airtable) e,
 * no ENSPACE, o conceito já existe em Interface > Menus. Aqui os itens nativos
 * passam a usar a MESMA gramática das seções que o administrador cria: é o que
 * permite montar um menu só, em vez de apendicar o personalizado no fim do nativo.
 *
 * A engrenagem de ordenação aparece no hover do rótulo, como no Attio, para não
 * disputar peso com o nome da seção.
 */
const props = withDefaults(defineProps<{
  rotulo: string
  aberta: boolean
  contador?: number
  /** Selo curto no cabeçalho, como "Em breve" quando a seção inteira ainda virá. */
  selo?: string
  /** Bolinha amarela: esta seção foi mexida e ainda não foi salva. */
  alterado?: boolean
  dicaAlterado?: string
  textoRecolher: string
  textoExpandir: string

  /* ---- arraste (rodada 5) ---- */
  arrastavel?: boolean
  saindo?: boolean
  marca?: 'antes' | 'depois' | 'dentro' | null
  recusando?: boolean
}>(), { marca: null })

const emit = defineEmits<{
  alternar: []
  arrastarInicio: []
  arrastarSobre: [posicao: 'antes' | 'depois' | 'dentro']
  soltar: [posicao: 'antes' | 'depois' | 'dentro']
  arrastarFim: []
  mover: [passo: -1 | 1]
}>()

/**
 * No cabeçalho de seção o terço do meio solta DENTRO, e as bordas soltam antes
 * ou depois. É o que deixa mover um item para dentro de outra seção e reordenar
 * as seções entre si com o mesmo gesto.
 */
function ondeCai(e: DragEvent): 'antes' | 'depois' | 'dentro' {
  const alvo = e.currentTarget as HTMLElement
  const r = alvo.getBoundingClientRect()
  const y = e.clientY - r.top
  if (y < r.height * 0.3) return 'antes'
  if (y > r.height * 0.7) return 'depois'
  return 'dentro'
}

function aoPassar(e: DragEvent) {
  if (!props.arrastavel) return
  e.preventDefault()
  emit('arrastarSobre', ondeCai(e))
}

function aoSoltar(e: DragEvent) {
  if (!props.arrastavel) return
  e.preventDefault()
  emit('soltar', ondeCai(e))
}

function aoTeclar(e: KeyboardEvent) {
  if (!props.arrastavel || !e.altKey) return
  if (e.key === 'ArrowUp') { e.preventDefault(); emit('mover', -1) }
  if (e.key === 'ArrowDown') { e.preventDefault(); emit('mover', 1) }
}
</script>

<template>
  <div
    class="group/secao mt-2 first:mt-0"
    :class="props.saindo ? 'opacity-40' : ''"
  >
    <div
      class="relative flex items-center gap-1 rounded pr-1"
      :class="[
        props.marca === 'dentro' ? (props.recusando ? 'bg-error/10 ring-1 ring-error' : 'bg-primary/10 ring-1 ring-primary') : '',
        props.marca === 'antes' ? 'before:absolute before:inset-x-1 before:-top-px before:z-20 before:h-0.5 before:rounded-full' : '',
        props.marca === 'depois' ? 'after:absolute after:inset-x-1 after:-bottom-px after:z-20 after:h-0.5 after:rounded-full' : '',
        props.marca && props.recusando ? 'before:bg-error after:bg-error' : 'before:bg-primary after:bg-primary',
      ]"
      :draggable="props.arrastavel ? 'true' : undefined"
      @dragstart="emit('arrastarInicio')"
      @dragover="aoPassar"
      @drop="aoSoltar"
      @dragend="emit('arrastarFim')"
      @keydown="aoTeclar"
    >
      <button
        type="button"
        class="flex min-w-0 flex-1 items-center gap-1.5 rounded px-2.5 py-1 text-left text-xs font-semibold uppercase tracking-wider text-toned transition-colors hover:text-highlighted"
        :aria-expanded="props.aberta"
        :aria-label="props.aberta ? props.textoRecolher : props.textoExpandir"
        @click="emit('alternar')"
      >
        <!-- A pega troca com a seta no hover, como na linha. Rodada 11. -->
        <span class="relative flex size-3 shrink-0 items-center justify-center">
          <UIcon
            name="i-lucide-chevron-right"
            class="size-3 transition-transform duration-200"
            :class="[props.aberta ? 'rotate-90' : '', props.arrastavel ? 'group-hover/secao:opacity-0' : '']"
          />
          <UIcon
            v-if="props.arrastavel"
            name="i-lucide-grip-vertical"
            class="absolute size-3.5 opacity-0 transition-opacity group-hover/secao:opacity-100"
            aria-hidden="true"
          />
        </span>
        <!--
          Sem marca visual para "seção do workspace". A primeira versão punha um
          ✦ ao lado do nome, e num produto que tem o BENI o sparkle lê como IA.
          Quem monta a seção sabe que ela é sua; quem usa não precisa saber.
        -->
        <span class="min-w-0 truncate">{{ props.rotulo }}</span>
        <span v-if="props.contador !== undefined" class="shrink-0 text-toned/80 normal-case tracking-normal">
          {{ props.contador }}
        </span>
        <!-- Mexida e não salva, rodada 12. -->
        <span
          v-if="props.alterado"
          class="size-2 shrink-0 rounded-full bg-warning"
          :title="props.dicaAlterado"
          role="img"
          :aria-label="props.dicaAlterado"
        />
        <!--
          O selo da seção inteira. Dito uma vez aqui, ele sai das linhas de
          dentro: três selos "Em breve" empurravam o nome de cada tela para o
          reticente, e "Dashboard de tarefas" e "Dashboard de dados" viravam a
          mesma linha cortada.
        -->
        <UBadge
          v-if="props.selo"
          :label="props.selo"
          size="sm"
          color="neutral"
          variant="subtle"
          class="shrink-0 normal-case tracking-normal"
        />
      </button>

      <!-- Ações da seção: aparecem no hover, como no Attio. -->
      <span class="flex shrink-0 items-center opacity-0 transition-opacity group-hover/secao:opacity-100 focus-within:opacity-100">
        <slot name="acoes" />
      </span>
    </div>

    <div
      v-if="props.aberta"
      class="mt-0.5 space-y-0.5"
    >
      <slot />
    </div>
  </div>
</template>
