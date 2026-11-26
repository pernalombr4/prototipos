<script setup lang="ts">
/**
 * Rodada 8, revista na 9: o resumo dos marcos abertos do projeto, na Visão geral. O marco é a entrega com
 * data-alvo dentro do projeto (o milestone do GitHub). O progresso é a parte concluída das tarefas do marco.
 * Cada cartão abre o marco na aba Marcos, onde mora o CRUD; "Ver marcos" leva à aba.
 */
import type { Textos } from './textos'
import { useMetasEDiscussoes, type Marco } from './metasEDiscussoes'
import { textosDeMetasEDiscussoes } from './textosDeMetasEDiscussoes'
import { textosDeMarcosEMedicao } from './textosDeMarcosEMedicao'
import { useMarcaDeProposta, useProjetos } from './estado'

const props = defineProps<{ t: Textos, id: number }>()
const prj = useProjetos()
const md = useMetasEDiscussoes()
const tx = useTextos(textosDeMetasEDiscussoes)
const tm = computed(() => tx.value.marcos)
const tmm = useTextos(textosDeMarcosEMedicao)
const idioma = useIdioma()
const { marca } = useMarcaDeProposta()
const HOJE = '2026-11-26'

const marcos = computed(() => md.marcosDo(props.id).filter(m => m.status === 'aberto'))
const data = (d: string) => new Date(`${d}T12:00:00`).toLocaleDateString(idioma.value, { day: '2-digit', month: 'short' })
const feitas = (m: Marco) => md.tarefasDoMarco(m).filter(x => x.status === 'concluida').length
const passou = (m: Marco) => m.dataAlvo < HOJE && md.progressoDoMarco(m) < 100
const cor = (m: Marco) => md.progressoDoMarco(m) === 100 ? 'success' : passou(m) ? 'error' : 'primary'
</script>

<template>
  <section class="rounded-lg border border-default bg-default animate-[entrada_0.25s_ease-out_both]" :class="marca">
    <header class="flex items-center gap-2 border-b border-default px-4 py-3">
      <UIcon name="i-lucide-flag" class="size-4 text-muted" />
      <h2 class="flex-1 text-sm font-semibold text-highlighted">{{ tm.titulo }}</h2>
      <UTooltip :text="tm.dica">
        <UIcon name="i-lucide-info" class="size-4 text-muted" :aria-label="tm.dica" />
      </UTooltip>
      <UButton :label="tmm.marcos.verMarcos" trailing-icon="i-lucide-arrow-right" size="xs" color="neutral" variant="outline" @click="prj.abrirAba(id, 'marcos')" />
    </header>
    <div v-if="!marcos.length" class="flex flex-col items-center gap-2 px-4 py-6 text-center">
      <p class="text-sm text-muted">{{ tm.vazio }}</p>
      <UButton v-if="md.podeEditarMarcos(id)" :label="tmm.marcos.novo" icon="i-lucide-plus" size="xs" color="neutral" variant="outline" @click="prj.abrirAba(id, 'marcos')" />
    </div>
    <ul v-else class="grid gap-px bg-default sm:grid-cols-2 2xl:grid-cols-3">
      <li v-for="(m, i) in marcos" :key="m.id" class="animate-[entrada_0.2s_ease-out_both]" :style="{ animationDelay: `${i * 40}ms` }">
        <button type="button" class="flex w-full flex-col gap-2 rounded-md px-4 py-3 text-left transition-colors hover:bg-elevated/60 focus-visible:outline-2 focus-visible:outline-primary" @click="md.abrirMarco(m)">
          <span class="flex w-full items-center gap-2">
            <span class="min-w-0 flex-1 truncate text-sm font-medium text-highlighted">{{ m.nome }}</span>
            <span class="text-sm font-semibold tabular-nums" :class="`text-${cor(m)}`">{{ md.progressoDoMarco(m) }}%</span>
          </span>
          <UProgress :model-value="md.progressoDoMarco(m)" :color="cor(m)" size="sm" class="w-full" />
          <span class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
            <span class="flex items-center gap-1" :class="passou(m) ? 'text-error' : ''">
              <UIcon :name="passou(m) ? 'i-lucide-calendar-x' : 'i-lucide-calendar'" class="size-3.5" />
              {{ passou(m) ? tm.vencido : tm.ate(data(m.dataAlvo)) }}
            </span>
            <span>{{ tm.tarefas(feitas(m), md.tarefasDoMarco(m).length) }}</span>
            <span v-if="md.metasDoMarco(m.id).length" class="flex min-w-0 items-center gap-1">
              <UIcon name="i-lucide-target" class="size-3.5 shrink-0" />
              <span class="truncate">{{ tm.contribuiPara }} {{ md.metasDoMarco(m.id).map(g => g.nome).join(', ') }}</span>
            </span>
          </span>
        </button>
      </li>
    </ul>
  </section>
</template>
