<script setup lang="ts">
/**
 * PROPOSTA: as versões com quem, quando e de onde.
 *
 * No develop é um select "Versão 1, Versão 2" em cima da barra do ONLYOFFICE
 * (print develop-12). Aqui cada versão diz o autor, a data, a ORIGEM (modelo,
 * em branco, arquivo enviado, editada no ENSPACE, editada no Word, restaurada)
 * e tem Ver, Baixar e Restaurar. Restaurar não apaga nada: cria uma versão
 * nova com o conteúdo antigo (o "Make Current" do Box, PESQUISA.md).
 *
 * UTimeline, consultado no MCP `nuxt-ui` (get-component-metadata): items com
 * date, title, description, avatar; slots title e description.
 */
import type { TimelineItem } from '@nuxt/ui'
import type { Textos } from './textos'
import { type ItemDoContrato, type OrigemDaVersao, pessoa } from './mocks'
import { dataHora, nomeCurto, useDocumentos } from './estado'

const props = defineProps<{
  item: ItemDoContrato
  t: Textos
  idioma: string
  /** Sem restaurar (alguém está com o documento ou o perfil só lê). */
  somenteLeitura?: boolean
}>()

const emit = defineEmits<{ ver: [numero: number] }>()

const toast = useToast()
const { novaVersao } = useDocumentos()

const doc = computed(() => props.item.data.minuta_do_contrato)

const ICONE: Record<OrigemDaVersao, string> = {
  modelo: 'i-lucide-layout-template',
  branco: 'i-lucide-file-plus',
  envio: 'i-lucide-upload',
  onlyoffice: 'i-lucide-file-pen-line',
  word: 'i-lucide-monitor',
  restauracao: 'i-lucide-rotate-ccw',
}

type ItemDaLinha = TimelineItem & { numero: number, origem: OrigemDaVersao, deVersao?: number, autor: number }

const linhas = computed<ItemDaLinha[]>(() => {
  const v = doc.value?.versoes ?? []
  return [...v].reverse().map(x => ({
    value: x.numero,
    numero: x.numero,
    origem: x.origem,
    deVersao: x.deVersao,
    autor: x.autor,
    date: dataHora(x.em, props.idioma),
    title: props.t.campo.versaoN(x.numero),
    description: nomeCurto(x.autor),
    avatar: { text: pessoa(x.autor).iniciais },
  }))
})

const atual = computed(() => doc.value?.versoes.length ?? 0)

const paraRestaurar = ref<number | null>(null)
const confirmarAberto = computed({
  get: () => paraRestaurar.value !== null,
  set: (v) => { if (!v) paraRestaurar.value = null },
})

function restaurar() {
  if (paraRestaurar.value === null) return
  const de = paraRestaurar.value
  const nova = novaVersao(props.item.id, 'restauracao', de)
  paraRestaurar.value = null
  toast.add({ title: props.t.versoes.restauradaToast(de, nova), icon: 'i-lucide-rotate-ccw', color: 'success' })
}

function baixar(n: number) {
  toast.add({ title: `${props.t.campo.versaoN(n)} · ${doc.value?.name}`, description: props.t.campo.simulacaoBaixar, icon: 'i-lucide-download', color: 'neutral' })
}
</script>

<template>
  <div v-if="doc">
    <p class="mb-4 text-sm text-muted">
      {{ t.versoes.descricao }}
    </p>

    <UTimeline
      :items="linhas"
      :default-value="atual"
      size="xs"
      color="primary"
      :ui="{ wrapper: 'pb-5', title: 'flex items-center gap-2', description: 'w-full' }"
    >
      <template #title="{ item }">
        <span class="text-sm font-medium text-highlighted">{{ (item as ItemDaLinha).title }}</span>
        <UBadge v-if="(item as ItemDaLinha).numero === atual" :label="t.versoes.atual" color="primary" variant="subtle" size="sm" />
      </template>
      <template #description="{ item }">
        <span class="mt-0.5 block text-sm text-toned">{{ (item as ItemDaLinha).description }}</span>
        <span class="mt-1 flex items-center gap-1.5 text-xs text-muted">
          <UIcon :name="ICONE[(item as ItemDaLinha).origem]" class="size-3.5 shrink-0" />
          {{ (item as ItemDaLinha).origem === 'restauracao' && (item as ItemDaLinha).deVersao
            ? t.versoes.restauradaDe((item as ItemDaLinha).deVersao!)
            : t.versoes.origem[(item as ItemDaLinha).origem] }}
        </span>
        <span class="mt-2 flex flex-wrap gap-1">
          <UButton :label="t.versoes.ver" icon="i-lucide-eye" color="neutral" variant="outline" size="xs" @click="emit('ver', (item as ItemDaLinha).numero)" />
          <UButton :label="t.versoes.baixar" icon="i-lucide-download" color="neutral" variant="ghost" size="xs" @click="baixar((item as ItemDaLinha).numero)" />
          <UButton
            v-if="(item as ItemDaLinha).numero !== atual && !somenteLeitura"
            :label="t.versoes.restaurar"
            icon="i-lucide-rotate-ccw"
            color="neutral"
            variant="ghost"
            size="xs"
            @click="paraRestaurar = (item as ItemDaLinha).numero"
          />
        </span>
      </template>
    </UTimeline>

    <UModal
      v-model:open="confirmarAberto"
      :title="paraRestaurar ? t.versoes.restaurarTitulo(paraRestaurar) : ''"
      :description="paraRestaurar ? t.versoes.restaurarDescricao(paraRestaurar, atual + 1) : ''"
      :ui="{ footer: 'justify-end' }"
    >
      <template #footer="{ close }">
        <UButton :label="t.campo.cancelar" color="neutral" variant="outline" @click="close" />
        <UButton :label="t.versoes.restaurarConfirmar" icon="i-lucide-rotate-ccw" @click="restaurar" />
      </template>
    </UModal>
  </div>
</template>
