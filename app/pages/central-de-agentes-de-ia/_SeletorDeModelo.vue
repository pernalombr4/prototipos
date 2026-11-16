<script setup lang="ts">
/**
 * O seletor de modelo do chat e da aba Testar (demanda 2).
 *
 * Igual ao de hoje na forma: "Padrão" primeiro, depois os modelos agrupados por
 * empresa em ordem alfabética, com os ícones de capacidade. A PROPOSTA:
 * - só os modelos permitidos pelo agente aparecem;
 * - "Padrão" diz qual modelo é ("Padrão do agente: Claude Sonnet 5.5");
 * - com 1 modelo permitido, o seletor vira um rótulo fixo com cadeado.
 */
import type { Textos } from './textos'
import { modeloPorId, nomeDoProvedor, iconeDoProvedor, provedoresEmOrdem } from './catalogo'

const props = withDefaults(defineProps<{
  t: Textos
  permitidos: string[]
  padrao: string
  /** modelos em que os arquivos de referência não cabem */
  naoCabe?: string[]
  /** sem o "Padrão": a escolha é sempre um modelo nomeado */
  semPadrao?: boolean
  size?: 'xs' | 'sm' | 'md'
}>(), { naoCabe: () => [], semPadrao: false, size: 'xs' })

/** null = padrão do agente */
const escolhido = defineModel<string | null>({ default: null })

const PADRAO = '__padrao'
const nome = (id: string) => modeloPorId(id)?.name ?? id

const fixo = computed(() => props.permitidos.length <= 1)

const itens = computed(() => {
  const grupos: any[][] = []
  if (!props.semPadrao) {
    grupos.push([{ value: PADRAO, label: props.t.seletorDeModelo.padraoDoAgente(nome(props.padrao)), icon: 'i-lucide-sparkles' }])
  }
  for (const p of provedoresEmOrdem) {
    const doProvedor = props.permitidos.map(modeloPorId).filter(m => m?.provider === p)
    if (!doProvedor.length) continue
    grupos.push([
      { type: 'label', label: nomeDoProvedor[p] },
      ...doProvedor.map(m => ({
        value: m!.id,
        label: m!.name,
        icon: iconeDoProvedor[p],
        modelo: m,
        disabled: props.naoCabe.includes(m!.id),
      })),
    ])
  }
  return grupos
})

const valor = computed({
  get: () => escolhido.value ?? PADRAO,
  set: (v: string) => { escolhido.value = v === PADRAO ? null : v },
})

const rotulo = computed(() => escolhido.value ? nome(escolhido.value) : props.t.seletorDeModelo.padraoCurto)
const iconeAtual = computed(() => {
  const m = escolhido.value ? modeloPorId(escolhido.value) : null
  return m ? iconeDoProvedor[m.provider] : 'i-lucide-sparkles'
})

const cs = computed(() => props.t.seletorDeModelo.capacidades)
</script>

<template>
  <UTooltip v-if="fixo" :text="t.seletorDeModelo.fixo">
    <span
      class="inline-flex items-center gap-1.5 rounded-md bg-elevated px-2 py-1 text-xs text-muted"
      :aria-label="`${t.seletorDeModelo.fixo}: ${nome(permitidos[0] ?? padrao)}`"
    >
      <UIcon :name="iconeDoProvedor[modeloPorId(permitidos[0] ?? padrao)!.provider]" class="size-3.5" />
      <span class="font-medium text-default">{{ nome(permitidos[0] ?? padrao) }}</span>
      <UIcon name="i-lucide-lock" class="size-3" />
    </span>
  </UTooltip>

  <USelectMenu
    v-else
    v-model="valor"
    :items="itens"
    value-key="value"
    :size="size"
    variant="ghost"
    :search-input="permitidos.length > 6 ? { placeholder: t.seletorDeModelo.buscar } : false"
    :content="{ align: 'start', side: 'top' }"
    :ui="{ content: 'min-w-72' }"
    :aria-label="t.seletorDeModelo.alterar"
  >
    <template #default>
      <span class="flex items-center gap-1.5">
        <UIcon :name="iconeAtual" class="size-3.5 shrink-0" />
        <span class="truncate">{{ rotulo }}</span>
      </span>
    </template>
    <template #item-trailing="{ item }">
      <span v-if="(item as any).disabled" class="text-xs text-error">{{ t.seletorDeModelo.naoCabe }}</span>
      <span v-else-if="(item as any).modelo" class="flex items-center gap-1 text-dimmed">
        <UTooltip v-if="(item as any).modelo.vision" :text="cs.visao"><UIcon name="i-lucide-eye" class="size-3.5" /></UTooltip>
        <UTooltip v-if="(item as any).modelo.fileInput" :text="cs.arquivo"><UIcon name="i-lucide-paperclip" class="size-3.5" /></UTooltip>
        <UTooltip v-if="(item as any).modelo.toolUse" :text="cs.ferramentas"><UIcon name="i-lucide-wrench" class="size-3.5" /></UTooltip>
        <UTooltip v-if="(item as any).modelo.reasoning" :text="cs.raciocinio"><UIcon name="i-lucide-brain" class="size-3.5" /></UTooltip>
      </span>
    </template>
  </USelectMenu>
</template>
