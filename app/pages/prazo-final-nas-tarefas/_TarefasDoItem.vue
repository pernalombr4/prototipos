<script setup lang="ts">
/**
 * O prazo final dentro do item (RF024).
 *
 * A tarefa rápida ligada a um item (`item` e `meta.itemReference` da tarefa)
 * aparece na pasta Tarefas da tela do item. Ali ela mostra as 2 datas e o
 * estado vencido do mesmo jeito que em Tarefas Rápidas: a mesma tabela, as
 * mesmas colunas e o mesmo painel ao clicar.
 *
 * As pastas seguem a cópia do protótipo `agenda` (develop, 29/10/2026). O
 * conteúdo de hoje da pasta Tarefas não foi copiado (DECISOES, rodada 5): o que
 * se avalia é a tarefa rápida com as 2 datas onde ela aparece.
 */
import type { Idioma } from '~/composables/useIdioma'
import type { Textos } from './textos'
import type { TextosR5 } from './textos-r5'
import type { TarefaRapida } from './mocks'
import { itemDaTarefa, itens } from './mocks'
import TabelaDeTarefas from './_TabelaDeTarefas.vue'

const props = defineProps<{ t: Textos, r: TextosR5, idioma: Idioma, tarefas: TarefaRapida[], referencia: string }>()
const emit = defineEmits<{ abrir: [tarefa: TarefaRapida] }>()

const item = computed(() => itens.find(i => i.referencia === props.referencia)!)
const doItem = computed(() => props.tarefas.filter(tr => itemDaTarefa[tr.id] === props.referencia))
const pasta = ref('tarefas')
const pastas = computed(() => [
  { value: 'visaoGeral', label: props.r.pastas.visaoGeral, icon: 'i-lucide-layers' },
  { value: 'comentarios', label: props.r.pastas.comentarios, icon: 'i-lucide-message-circle' },
  { value: 'logs', label: props.r.pastas.logs, icon: 'i-lucide-shield-check' },
  { value: 'tarefas', label: props.r.pastas.tarefas, icon: 'i-lucide-clipboard-check', badge: doItem.value.length },
  { value: 'anexos', label: props.r.pastas.anexos, icon: 'i-lucide-paperclip' },
  { value: 'notas', label: props.r.pastas.notas, icon: 'i-lucide-file-text' },
])
</script>

<template>
  <div class="space-y-4 p-4">
    <div>
      <p class="text-xs text-muted">{{ item.categoria }} · {{ item.referencia }}</p>
      <h1 class="text-lg font-semibold text-highlighted">{{ item.nome }}</h1>
    </div>

    <UTabs v-model="pasta" :items="pastas" variant="link" :content="false" class="w-full" />

    <Transition mode="out-in" enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 translate-y-1" leave-active-class="transition duration-150 ease-in" leave-to-class="opacity-0">
      <section v-if="pasta === 'tarefas'" key="tarefas" class="space-y-2">
        <h2 class="text-xs font-semibold uppercase tracking-wider text-muted">{{ r.tarefasDoItem }}</h2>
        <TabelaDeTarefas v-if="doItem.length" :t="t" :idioma="idioma" :tarefas="doItem" :carregando="false" @abrir="emit('abrir', $event)" />
        <UEmpty v-else icon="i-lucide-clipboard-list" :title="r.semTarefasNoItem" />
      </section>
      <p v-else :key="pasta" class="rounded-lg border border-dashed border-default p-6 text-center text-sm text-muted">{{ r.pastaSemMudanca }}</p>
    </Transition>
  </div>
</template>
