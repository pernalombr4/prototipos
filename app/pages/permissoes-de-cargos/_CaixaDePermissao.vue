<script setup lang="ts">
/**
 * A caixa de uma permissão, com os estados que a pesquisa visual mostrou:
 *
 * - herdada do nível de cima: tom claro da cor primária (Twenty);
 * - diferente do nível de cima: cor cheia e seta de desfazer ao lado (Twenty);
 * - parcial, quando vale só para parte dos campos: traço (Directus, Strapi);
 * - travada, quando outra ação exige esta: marcada, desabilitada, com cadeado;
 *   o motivo abre num popover no hover e no clique do cadeado ou da caixa, e o
 *   clique fixa o popover até clicar fora ou apertar Esc (rodada 6, Appsmith, ClickUp);
 * - regra de itens: ícone à esquerda quando a ação vale só para os itens que
 *   a pessoa criou ou em que é responsável (ClickUp, HubSpot, Pipefy).
 *
 * Layout em linha com 3 vagas de largura fixa (pessoa, caixa, desfazer ou
 * cadeado), para a caixa ficar sempre no mesmo lugar da coluna.
 */
const props = defineProps<{
  valor: boolean | 'indeterminate'
  rotulo: string
  herdada?: boolean
  difere?: boolean
  /** Texto do motivo quando outra ação exige esta. */
  travadaPor?: string | null
  dica?: string
  desabilitada?: boolean
  rotuloDesfazer?: string
  /** Ícone e dica da regra de itens (criador, responsável ou os 2). */
  regra?: { icone: string, dica: string } | null
}>()

const emit = defineEmits<{ alterar: [valor: boolean], desfazer: [] }>()

// A caixa travada não abre dica: o motivo mora no popover do cadeado.
const textoDaDica = computed(() => props.travadaPor ? '' : props.dica ?? '')

// "Exigido por Atualizar. Desmarque Atualizar para tirar Ver." vira título e texto.
const motivo = computed(() => {
  const texto = props.travadaPor ?? ''
  const i = texto.indexOf('. ')
  return i < 0 ? { titulo: texto, texto: '' } : { titulo: texto.slice(0, i + 1), texto: texto.slice(i + 2) }
})

// Popover do cadeado: abre no hover e no clique; o clique fixa até clicar fora ou Esc.
const aberto = ref(false)
const fixado = ref(false)
let fechar: ReturnType<typeof setTimeout> | undefined
function entrar() {
  if (!props.travadaPor)
    return
  clearTimeout(fechar)
  aberto.value = true
}
function sair() {
  if (fixado.value)
    return
  clearTimeout(fechar)
  fechar = setTimeout(() => { aberto.value = false }, 150)
}
function clicar() {
  if (!props.travadaPor)
    return
  clearTimeout(fechar)
  aberto.value = true
  fixado.value = true
}
function aoMudar(v: boolean) {
  aberto.value = v
  if (!v)
    fixado.value = false
}
onBeforeUnmount(() => clearTimeout(fechar))
const clara = computed(() => props.herdada && !props.difere && props.valor !== 'indeterminate')
</script>

<template>
  <span class="inline-flex items-center gap-0.5 align-middle">
    <!-- Vaga 1: regra de itens -->
    <span class="flex w-4 justify-center">
      <UTooltip v-if="regra" :text="regra.dica">
        <UIcon :name="regra.icone" class="size-3.5 text-info" :aria-label="regra.dica" role="img" />
      </UTooltip>
    </span>

    <!-- Vaga 2: a caixa -->
    <UTooltip :text="textoDaDica" :disabled="!textoDaDica">
      <span class="inline-flex" @mouseenter="entrar" @mouseleave="sair" @click="clicar">
        <UCheckbox
          :model-value="valor"
          :ui="clara ? { indicator: 'bg-primary/40' } : undefined"
          :disabled="desabilitada || !!travadaPor"
          :aria-label="rotulo"
          class="inline-flex transition-transform active:scale-90"
          @update:model-value="v => emit('alterar', v === true)"
        />
      </span>
    </UTooltip>

    <!-- Vaga 3: cadeado (travada) ou desfazer (diferente do nível de cima) -->
    <span class="flex w-5 justify-center">
      <!-- A caixa travada fica desabilitada: o motivo mora no popover do cadeado. -->
      <UPopover
        v-if="travadaPor"
        :open="aberto"
        :content="{ side: 'top', sideOffset: 6, collisionPadding: 8 }"
        arrow
        :ui="{ content: 'w-64 p-3' }"
        @update:open="aoMudar"
      >
        <template #anchor>
          <button
            type="button"
            class="flex cursor-pointer items-center rounded-sm p-0.5 transition-colors focus-visible:outline-2 focus-visible:outline-primary"
            :class="aberto ? 'text-highlighted' : 'text-muted hover:text-highlighted'"
            :aria-label="travadaPor"
            :aria-expanded="aberto"
            aria-haspopup="dialog"
            @mouseenter="entrar"
            @mouseleave="sair"
            @click="clicar"
          >
            <UIcon name="i-lucide-lock" class="size-3" />
          </button>
        </template>
        <template #content>
          <div class="flex gap-2.5" role="note" @mouseenter="entrar" @mouseleave="sair">
            <span class="flex size-6 shrink-0 items-center justify-center rounded-md bg-elevated text-muted">
              <UIcon name="i-lucide-lock" class="size-3.5" />
            </span>
            <span class="min-w-0 space-y-0.5">
              <span class="block text-sm font-semibold text-highlighted">{{ motivo.titulo }}</span>
              <span v-if="motivo.texto" class="block text-xs text-muted">{{ motivo.texto }}</span>
            </span>
          </div>
        </template>
      </UPopover>
      <UTooltip v-else-if="difere && rotuloDesfazer && !desabilitada" :text="rotuloDesfazer">
        <UButton
          icon="i-lucide-undo-2"
          size="xs"
          variant="link"
          color="warning"
          class="p-0.5"
          :aria-label="rotuloDesfazer"
          @click="emit('desfazer')"
        />
      </UTooltip>
    </span>
  </span>
</template>
