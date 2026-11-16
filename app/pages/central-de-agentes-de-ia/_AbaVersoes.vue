<script setup lang="ts">
/**
 * PROPOSTA: as versões do agente. Cada "Publicar" cria uma; o chat usa
 * sempre a que está no ar. Restaurar copia a versão antiga para o rascunho,
 * sem tirar a atual do ar (PESQUISA: Salesforce, Copilot Studio, Notion).
 */
import type { Textos } from './textos'
import { pessoaPorId, type Agente } from './mocks'
import { formatarData } from './estado'

const props = defineProps<{ t: Textos, a: Agente }>()
const toast = useToast()
const idioma = useIdioma()
const v = computed(() => props.t.versoes)

const noAr = computed(() => props.a.versoes.find(x => x.publicadaEm)?.numero)

function restaurar(n: number) {
  if (!props.a.versoes[0]?.publicadaEm) props.a.versoes[0]!.resumo = `${props.t.versoes.restaurar}: ${n}`
  else props.a.versoes.unshift({ numero: props.a.versoes[0]!.numero + 1, publicadaEm: null, por: props.a.dono, resumo: `${props.t.versoes.restaurar}: ${n}` })
  props.a.rascunhoPendente = true
  toast.add({ title: v.value.restaurada(n), icon: 'i-lucide-history', color: 'neutral' })
}

const itens = computed(() => props.a.versoes.map(x => ({
  value: x.numero,
  title: v.value.versao(x.numero),
  date: x.publicadaEm ? v.value.publicada(formatarData(x.publicadaEm, idioma.value), pessoaPorId(x.por).nome) : v.value.emEdicao(pessoaPorId(x.por).nome),
  description: x.resumo,
  icon: !x.publicadaEm ? 'i-lucide-pencil-line' : x.numero === noAr.value ? 'i-lucide-radio' : 'i-lucide-check',
  versao: x,
})))
</script>

<template>
  <div class="space-y-4">
    <div>
      <h3 class="text-base font-semibold text-highlighted">{{ v.titulo }}</h3>
      <p class="mt-0.5 text-sm text-muted">{{ v.texto }}</p>
    </div>

    <UTimeline :items="itens" :default-value="noAr" color="primary" size="sm" class="max-w-3xl">
      <template #title="{ item }">
        <span class="flex flex-wrap items-center gap-2">
          <span class="font-medium text-highlighted">{{ item.title }}</span>
          <UBadge v-if="!item.versao.publicadaEm" :label="v.rascunho" color="warning" variant="soft" size="sm" />
          <UBadge v-else-if="item.value === noAr" :label="v.noAr" color="success" variant="soft" size="sm" />
        </span>
      </template>
      <template #description="{ item }">
        <p class="text-sm text-default">{{ item.description }}</p>
        <div v-if="item.versao.publicadaEm && item.value !== noAr" class="mt-1.5 flex gap-2">
          <UButton :label="v.restaurar" icon="i-lucide-history" color="neutral" variant="outline" size="xs" @click="restaurar(item.value)" />
          <UButton :label="v.comparar" icon="i-lucide-git-compare" color="neutral" variant="ghost" size="xs" />
        </div>
      </template>
    </UTimeline>
  </div>
</template>
