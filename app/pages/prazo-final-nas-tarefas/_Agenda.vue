<script setup lang="ts">
/**
 * O prazo final na Agenda (RF022, RF023).
 *
 * Só a proposta, sem a casca: a pedido da redatora, nada de reproduzir "como é
 * hoje". A grade de mês e o painel Configuração seguem o que o develop tem
 * (BRIEFING do protótipo `agenda`, 29/10/2026): a tarefa rápida aparece no dia
 * do campo de data escolhido na Configuração.
 *
 * O que muda:
 * - "Prazo final" entra nas opções de Data, e "Data Limite" passa a "Vencimento" (RF018);
 * - a tarefa com prazo final ganha um segundo marcador, com a bandeira, no dia do
 *   prazo final. Ligado por padrão, com a opção "Marcar o prazo final";
 * - prazo final vencido: marcador vermelho cheio. Concluída: riscada.
 */
import type { Idioma } from '~/composables/useIdioma'
import type { Textos } from './textos'
import type { TextosR5 } from './textos-r5'
import type { TarefaRapida } from './mocks'
import { HOJE, concluidaEm } from './mocks'
import { atrasada, criadoEm, prazoFinalVencido, somarDias } from './datas'

const props = defineProps<{ t: Textos, r: TextosR5, idioma: Idioma, tarefas: TarefaRapida[] }>()
const emit = defineEmits<{ abrir: [tarefa: TarefaRapida] }>()
const toast = useToast()

type DataDaAgenda = 'criado' | 'prazo' | 'prazoFinal' | 'concluida'
const dataEscolhida = ref<DataDaAgenda>('prazo')
const marcarPrazoFinal = ref(true)

/* Rascunho da Configuração: só vale depois de Salvar. */
const configAberta = ref(false)
const abaConfig = ref('rapidas')
const rascunhoData = ref<DataDaAgenda>('prazo')
const rascunhoMarcar = ref(true)
const salvando = ref(false)
watch(configAberta, (v) => {
  if (!v) return
  rascunhoData.value = dataEscolhida.value
  rascunhoMarcar.value = marcarPrazoFinal.value
})
function salvar() {
  salvando.value = true
  setTimeout(() => {
    salvando.value = false
    dataEscolhida.value = rascunhoData.value
    marcarPrazoFinal.value = rascunhoMarcar.value
    configAberta.value = false
    toast.add({ title: props.r.configuracaoSalva, color: 'success', icon: 'i-lucide-check' })
  }, 500)
}

const opcoesDeData = computed(() => (['criado', 'prazo', 'prazoFinal', 'concluida'] as const).map(v => ({ label: props.r.opcoesDeData[v], value: v })))
const abasConfig = computed(() => (['tarefas', 'rapidas', 'itens', 'integracoes'] as const).map(v => ({ label: props.r.abasConfig[v], value: v })))

/* Novembro de 2026 começa num domingo: 5 semanas, de 01/11 a 05/12. */
const dias = computed(() => Array.from({ length: 35 }, (_, i) => somarDias('2026-11-01', i)))

interface Evento { chave: string, tarefa: TarefaRapida, tipo: 'tarefa' | 'prazoFinal' }

function dataDaTarefa(tr: TarefaRapida): string | null {
  if (dataEscolhida.value === 'criado') return criadoEm(tr)
  if (dataEscolhida.value === 'prazo') return tr.due_date
  if (dataEscolhida.value === 'prazoFinal') return tr.final_due_date
  return concluidaEm[tr.id] ?? null
}

const porDia = computed(() => {
  const mapa: Record<string, Evento[]> = {}
  const colocar = (dia: string | null, e: Evento) => { if (dia) (mapa[dia] ??= []).push(e) }
  for (const tr of props.tarefas) {
    colocar(dataDaTarefa(tr), { chave: `t-${tr.id}`, tarefa: tr, tipo: dataEscolhida.value === 'prazoFinal' ? 'prazoFinal' : 'tarefa' })
    // Com Data = Prazo final, o marcador repetiria o mesmo dia.
    if (marcarPrazoFinal.value && dataEscolhida.value !== 'prazoFinal' && tr.final_due_date)
      colocar(tr.final_due_date, { chave: `pf-${tr.id}`, tarefa: tr, tipo: 'prazoFinal' })
  }
  // O marcador do prazo final vem primeiro no dia: é o compromisso que não se move.
  for (const lista of Object.values(mapa)) lista.sort((a, b) => (a.tipo === b.tipo ? 0 : a.tipo === 'prazoFinal' ? -1 : 1))
  return mapa
})

const LIMITE = 3
const diaAberto = ref<string | null>(null)

function classeDoEvento(e: Evento) {
  const tr = e.tarefa
  if (tr.status === 'completed') return 'bg-elevated text-muted line-through'
  if (e.tipo === 'prazoFinal') return prazoFinalVencido(tr) ? 'bg-error text-inverted font-medium' : 'bg-error/10 text-error ring-1 ring-inset ring-error/30'
  // Tarefas rápidas na cor neutra, como no protótipo `agenda`: o vermelho fica só para o prazo final.
  return atrasada(tr) ? 'bg-elevated text-highlighted ring-1 ring-inset ring-error/50' : 'bg-elevated text-highlighted ring-1 ring-inset ring-default'
}
function rotuloDoEvento(e: Evento) {
  return e.tipo === 'prazoFinal' && dataEscolhida.value !== 'prazoFinal' ? props.r.marcadorPrazoFinal(e.tarefa.name) : e.tarefa.name
}
const numeroDoDia = (d: string) => Number(d.slice(8))
</script>

<template>
  <div class="space-y-3 p-4">
    <div class="flex flex-wrap items-center gap-2">
      <h1 class="text-lg font-semibold text-highlighted">{{ r.agenda }}</h1>
      <span class="ml-2 text-sm text-toned">{{ r.mes }}</span>
      <div class="ml-2 flex">
        <UButton icon="i-lucide-chevron-left" color="neutral" variant="ghost" size="sm" disabled :aria-label="r.mes" />
        <UButton icon="i-lucide-chevron-right" color="neutral" variant="ghost" size="sm" disabled :aria-label="r.mes" />
      </div>
      <!-- Legenda: o que separa as 2 datas na grade -->
      <ul class="ml-auto flex flex-wrap items-center gap-3 text-xs text-toned">
        <li class="flex items-center gap-1"><span class="size-2.5 rounded-sm bg-elevated ring-1 ring-default" aria-hidden="true" /><UIcon name="i-lucide-calendar" class="size-3.5" aria-hidden="true" />{{ r.legendaPrazo }}</li>
        <li class="flex items-center gap-1"><span class="size-2.5 rounded-sm bg-error/20 ring-1 ring-error/40" aria-hidden="true" /><UIcon name="i-lucide-flag" class="size-3.5" aria-hidden="true" />{{ r.legendaPrazoFinal }}</li>
        <li class="flex items-center gap-1"><span class="size-2.5 rounded-sm bg-error" aria-hidden="true" />{{ r.legendaVencido }}</li>
      </ul>
      <UButton :label="r.configurar" icon="i-lucide-settings-2" color="neutral" variant="outline" size="sm" @click="configAberta = true" />
    </div>

    <div class="overflow-hidden rounded-xl border border-default">
      <div class="grid grid-cols-7 border-b border-default bg-elevated/60">
        <div v-for="d in r.diasDaSemana" :key="d" class="px-2 py-1.5 text-xs font-semibold text-muted">{{ d }}</div>
      </div>
      <div class="grid grid-cols-7">
        <div
          v-for="dia in dias"
          :key="dia"
          class="min-h-28 border-b border-r border-default p-1.5 [&:nth-child(7n)]:border-r-0"
          :class="dia.slice(5, 7) !== '11' ? 'bg-elevated/40' : ''"
        >
          <div class="mb-1 flex items-center">
            <span
              class="grid size-6 place-items-center rounded-full text-xs"
              :class="dia === HOJE ? 'bg-primary font-semibold text-inverted' : dia.slice(5, 7) !== '11' ? 'text-dimmed' : 'text-toned'"
              :aria-label="dia === HOJE ? r.hoje : undefined"
            >{{ numeroDoDia(dia) }}</span>
          </div>
          <ul class="space-y-1">
            <li
              v-for="(e, i) in (porDia[dia] ?? []).slice(0, diaAberto === dia ? undefined : LIMITE)"
              :key="e.chave"
              class="[animation:entrada_.3s_ease-out_both]"
              :style="{ animationDelay: `${i * 30}ms` }"
            >
              <button
                type="button"
                class="flex w-full items-center gap-1 truncate rounded px-1.5 py-0.5 text-left text-[11px] transition hover:brightness-95 focus-visible:outline-2 focus-visible:outline-primary"
                :class="classeDoEvento(e)"
                :aria-label="r.abrirEvento(e.tarefa.name)"
                @click="emit('abrir', e.tarefa)"
              >
                <UIcon :name="e.tipo === 'prazoFinal' ? 'i-lucide-flag' : 'i-lucide-calendar'" class="size-3 shrink-0" aria-hidden="true" />
                <span class="truncate">{{ rotuloDoEvento(e) }}</span>
              </button>
            </li>
          </ul>
          <UButton
            v-if="(porDia[dia]?.length ?? 0) > LIMITE && diaAberto !== dia"
            :label="r.maisEventos(porDia[dia]!.length - LIMITE)"
            color="neutral"
            variant="link"
            size="xs"
            class="px-1"
            @click="diaAberto = dia"
          />
        </div>
      </div>
    </div>

    <USlideover v-model:open="configAberta" :title="r.configuracao" :description="r.configuracaoDescricao">
      <template #body>
        <UTabs v-model="abaConfig" :items="abasConfig" variant="link" :content="false" class="mb-4 w-full" />
        <div v-if="abaConfig === 'rapidas'" class="space-y-5">
          <USwitch :model-value="true" :label="r.ativo" disabled />
          <UFormField :label="r.dataDaTarefa" :description="r.dataDaTarefaInstrucao">
            <USelect v-model="rascunhoData" :items="opcoesDeData" class="w-full" />
          </UFormField>
          <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 -translate-y-1" leave-active-class="transition duration-150 ease-in" leave-to-class="opacity-0">
            <USwitch v-if="rascunhoData !== 'prazoFinal'" v-model="rascunhoMarcar" :label="r.mostrarPrazoFinal" :description="r.mostrarPrazoFinalAjuda" />
          </Transition>
        </div>
        <p v-else class="rounded-lg border border-dashed border-default p-6 text-center text-sm text-muted">{{ r.pastaSemMudanca }}</p>
      </template>
      <template #footer>
        <div class="flex w-full justify-end gap-2">
          <UButton :label="t.criacao.cancelar" color="neutral" variant="outline" @click="configAberta = false" />
          <UButton :label="r.salvar" :loading="salvando" @click="salvar" />
        </div>
      </template>
    </USlideover>
  </div>
</template>
