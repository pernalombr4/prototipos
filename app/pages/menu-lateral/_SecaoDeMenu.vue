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
  textoRecolher: string
  textoExpandir: string
}>(), {})

const emit = defineEmits<{ alternar: [] }>()
</script>

<template>
  <div class="group/secao mt-2 first:mt-0">
    <div class="flex items-center gap-1 pr-1">
      <button
        type="button"
        class="flex min-w-0 flex-1 items-center gap-1.5 rounded px-2.5 py-1 text-left text-xs font-semibold uppercase tracking-wider text-toned transition-colors hover:text-highlighted"
        :aria-expanded="props.aberta"
        :aria-label="props.aberta ? props.textoRecolher : props.textoExpandir"
        @click="emit('alternar')"
      >
        <UIcon
          name="i-lucide-chevron-right"
          class="size-3 shrink-0 transition-transform duration-200"
          :class="props.aberta ? 'rotate-90' : ''"
        />
        <!--
          Sem marca visual para "seção do workspace". A primeira versão punha um
          ✦ ao lado do nome, e num produto que tem o BENI o sparkle lê como IA.
          Quem monta a seção sabe que ela é sua; quem usa não precisa saber.
        -->
        <span class="min-w-0 truncate">{{ props.rotulo }}</span>
        <span v-if="props.contador !== undefined" class="shrink-0 text-toned/80 normal-case tracking-normal">
          {{ props.contador }}
        </span>
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
