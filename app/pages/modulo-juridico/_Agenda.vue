<script setup lang="ts">
/**
 * Membro › Agenda. A tela de hoje, com os eventos que ela já mostra (datas de item e reuniões).
 *
 * PROPOSTA, só no conteúdo: com o módulo ligado, os prazos entram na Agenda como toda tarefa com data, em 2 dias
 * (interno e fatal). Clicar num prazo abre o mesmo painel da tela de Prazos. Clicar num evento comum continua
 * abrindo o modal "Evento" de hoje, que fica fora do escopo.
 */
import { eventosDoWorkspace } from './mocks'
import { eventosDosPrazos, prazoDoEvento } from './agenda'
import type { Textos } from './textos'
import type { Evento } from './_Calendario.vue'
import Calendario from './_Calendario.vue'
import PainelDoPrazo from './_PainelDoPrazo.vue'

const props = defineProps<{ t: Textos, moduloLigado: boolean }>()
const emit = defineEmits<{ abrirProcesso: [number] }>()
const toast = useToast()

const eventos = computed<Evento[]>(() => [
  ...eventosDoWorkspace.map(e => ({ id: e.id, dia: e.dia, hora: e.hora, titulo: e.titulo, tom: 'neutro' as const })),
  ...(props.moduloLigado ? eventosDosPrazos(props.t) : []),
])

const prazoAberto = ref<number | undefined>()
function abrir(e: Evento) {
  const id = prazoDoEvento(e)
  if (id !== undefined) return (prazoAberto.value = id)
  toast.add({ title: props.t.geral.foraDoEscopo, description: props.t.geral.foraDoEscopoDesc, icon: 'i-lucide-construction', color: 'neutral' })
}
</script>

<template>
  <div class="min-h-0 flex-1 overflow-y-auto p-4">
    <p v-if="moduloLigado" class="mb-3 flex items-center gap-1.5 text-xs text-muted">
      <UIcon name="i-lucide-info" class="size-3.5" />
      {{ t.agenda.legenda }}
    </p>
    <Calendario :t="t" :eventos="eventos" @abrir="abrir" />
    <PainelDoPrazo v-model:prazo="prazoAberto" :t="t" @abrir-processo="(id) => emit('abrirProcesso', id)" />
  </div>
</template>
