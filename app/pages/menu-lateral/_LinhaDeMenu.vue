<script setup lang="ts">
/**
 * Uma linha do menu lateral.
 *
 * Contraste: o rótulo usa `text-default`, não `text-muted`. A fricção S3-P2 do
 * enspace-ux-research mediu o menu de hoje em 4,36:1, abaixo do mínimo AA de 4,5:1,
 * em 24 elementos. Se o menu vai ser redesenhado, sai daqui já passando.
 *
 * A estrela é um botão IRMÃO, nunca aninhado: botão dentro de botão é HTML inválido
 * e o teclado não alcança o de dentro.
 */
const props = withDefaults(defineProps<{
  icone: string
  rotulo: string
  ativo?: boolean
  contador?: number
  /** 1 é destino solto, 2 é item dentro de seção. A barra tem só estes dois. */
  nivel?: 1 | 2
  /** Mostra a estrela de favorito no hover e no foco. */
  comEstrela?: boolean
  fixada?: boolean
  rotuloFixar?: string
  rotuloDesafixar?: string
  /** Selo curto à direita, como "Fora do menu". */
  selo?: string
  /** Atraso da entrada em cascata, em milissegundos. */
  atraso?: number
}>(), {
  nivel: 1,
  atraso: 0,
})

const emit = defineEmits<{
  selecionar: []
  alternarEstrela: []
}>()
</script>

<template>
  <div
    class="group relative animate-[entrada_0.22s_ease-out_both]"
    :style="{ animationDelay: `${props.atraso}ms` }"
  >
    <button
      type="button"
      :aria-current="props.ativo ? 'page' : undefined"
      class="flex w-full items-center gap-2.5 rounded-md py-1.5 pr-9 text-sm transition-colors duration-150"
      :class="[
        props.nivel === 2 ? 'pl-8' : 'pl-2.5',
        props.ativo
          ? 'bg-primary/10 font-semibold text-highlighted'
          : 'text-default hover:bg-elevated',
      ]"
      @click="emit('selecionar')"
    >
      <!--
        O item ativo NÃO usa cor de marca no texto: medido em 3,39:1 no tema claro,
        abaixo do mínimo AA de 4,5:1. O estado é dito por fundo, peso da fonte, cor
        do ícone e aria-current, nunca por cor de texto sozinha.
      -->
      <UIcon :name="props.icone" class="size-4 shrink-0" :class="props.ativo ? 'text-primary' : 'text-toned'" />
      <!-- title para o nome que não cabe: "Solicitações de compra e reembolso" corta
           na largura da barra, e sem isto o nome inteiro não existe em lugar nenhum. -->
      <span class="min-w-0 flex-1 truncate text-left" :title="props.rotulo">{{ props.rotulo }}</span>
      <UBadge
        v-if="props.contador"
        :label="String(props.contador)"
        size="sm"
        color="warning"
        variant="subtle"
        class="shrink-0"
      />
      <UBadge
        v-if="props.selo"
        :label="props.selo"
        size="sm"
        color="neutral"
        variant="subtle"
        class="shrink-0"
      />
    </button>

    <!-- Irmão do botão principal, não filho. -->
    <UTooltip
      v-if="props.comEstrela"
      :text="props.fixada ? props.rotuloDesafixar : props.rotuloFixar"
    >
      <button
        type="button"
        class="absolute right-1 top-1/2 z-10 -translate-y-1/2 rounded p-1 transition-all duration-150 hover:bg-accented focus-visible:opacity-100"
        :class="props.fixada
          ? 'text-warning opacity-100'
          : 'text-toned opacity-0 group-hover:opacity-100 focus-visible:opacity-100'"
        :aria-label="props.fixada ? props.rotuloDesafixar : props.rotuloFixar"
        :aria-pressed="props.fixada"
        @click.stop="emit('alternarEstrela')"
      >
        <UIcon
          :name="props.fixada ? 'i-lucide-star' : 'i-lucide-star'"
          class="size-3.5"
          :class="props.fixada ? 'fill-current' : ''"
        />
      </button>
    </UTooltip>
  </div>
</template>
