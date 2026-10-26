<script setup lang="ts">
/**
 * PROPOSTA: o painel do prazo, à direita, como o painel da tarefa em Tarefas. Abre igual na lista de Prazos, na
 * visualização Calendário e na Agenda.
 *
 * O prazo é a tarefa que já existe. O painel mostra o que o módulo acrescenta: a memória do cálculo e o histórico
 * de recálculo.
 */
import { pessoaPorId, processoPorId, regraPorId, tribunais } from './mocks'
import { calcularPrazo, cumprir, estado } from './estado'
import type { Textos } from './textos'
import { dataHora, dia } from './formato'
import MemoriaDoCalculo from './_MemoriaDoCalculo.vue'

const props = defineProps<{ t: Textos }>()
const id = defineModel<number | undefined>('prazo')
const emit = defineEmits<{ abrirProcesso: [number] }>()
const toast = useToast()

const aberto = computed(() => estado.prazos.find(p => p.id === id.value))
const calculo = computed(() => (aberto.value ? calcularPrazo(aberto.value) : undefined))
const visivel = computed({ get: () => id.value !== undefined, set: (v) => { if (!v) id.value = undefined } })

function alternar() {
  const p = aberto.value
  if (!p) return
  cumprir(p)
  if (p.status === 'completed') toast.add({ title: props.t.prazos.cumpridoToast, icon: 'i-lucide-circle-check', color: 'success' })
}
function irAoProcesso() {
  const p = aberto.value
  if (!p) return
  id.value = undefined
  emit('abrirProcesso', p.processo)
}
</script>

<template>
  <USlideover
    v-model:open="visivel"
    :title="aberto ? `${regraPorId.get(aberto.entrada.regra)?.ato} · ${processoPorId.get(aberto.processo)?.reference}` : ''"
    :description="aberto ? processoPorId.get(aberto.processo)?.titulo : ''"
  >
    <template #body>
      <div v-if="aberto && calculo" class="flex flex-col gap-5">
        <MemoriaDoCalculo
          :t="t"
          :calculo="calculo"
          :regra="regraPorId.get(aberto.entrada.regra)!"
          :tribunal="tribunais[processoPorId.get(aberto.processo)!.data.tribunal]"
        />

        <div>
          <p class="mb-2 text-xs font-medium text-muted">{{ t.prazos.historico }}</p>
          <ol class="flex flex-col gap-2 text-sm">
            <li v-for="(h, i) in aberto.historico" :key="i" class="animate-[entrada_.3s_ease-out_both] rounded-md border border-warning/40 bg-warning/5 p-3">
              <p class="font-medium text-highlighted">{{ t.prazos.mudou(dia(h.fatalAntes, t.locale), dia(h.fatalDepois, t.locale)) }}</p>
              <p class="text-xs text-toned">{{ h.motivo }}</p>
              <p class="text-xs text-muted">{{ h.por }} · {{ dataHora(h.quando, t.locale) }}</p>
            </li>
            <li class="rounded-md border border-default p-3 text-xs text-toned">
              {{ t.prazos.confirmado(pessoaPorId.get(aberto.confirmadoPor)?.nome ?? '', dataHora(aberto.confirmadoEm, t.locale)) }}
              <span v-if="!aberto.intimacao" class="block text-muted">{{ t.prazos.origem }}: {{ t.prazos.semIntimacao }}</span>
            </li>
          </ol>
        </div>
      </div>
    </template>
    <template #footer>
      <div v-if="aberto" class="flex w-full justify-end gap-2">
        <UButton :label="t.prazos.abrirProcesso" icon="i-lucide-arrow-up-right" color="neutral" variant="outline" @click="irAoProcesso" />
        <UButton :label="aberto.status === 'completed' ? t.prazos.reabrir : t.prazos.cumprir" :icon="aberto.status === 'completed' ? 'i-lucide-rotate-ccw' : 'i-lucide-check'" @click="alternar" />
      </div>
    </template>
  </USlideover>
</template>
