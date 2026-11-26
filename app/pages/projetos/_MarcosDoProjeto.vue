<script setup lang="ts">
/**
 * Rodada 8: os marcos do projeto, na Visão geral. Proposta: o marco é a entrega com data-alvo
 * dentro do projeto (o milestone do GitHub, sem ficar preso a 1 categoria). O progresso é a parte
 * concluída das tarefas do marco. Entra aqui como a base da Meta do workspace: cada marco diz para
 * que meta contribui, e o clique leva à meta.
 */
import type { Textos } from './textos'
import { useMetasEDiscussoes, type Marco } from './metasEDiscussoes'
import { textosDeMetasEDiscussoes } from './textosDeMetasEDiscussoes'
import { useMarcaDeProposta } from './estado'

const props = defineProps<{ t: Textos, id: number }>()
const md = useMetasEDiscussoes()
const tx = useTextos(textosDeMetasEDiscussoes)
const tm = computed(() => tx.value.marcos)
const idioma = useIdioma()
const { marca } = useMarcaDeProposta()
const HOJE = '2026-11-26'

const marcos = computed(() => md.marcosDo(props.id))
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
    </header>
    <p v-if="!marcos.length" class="px-4 py-6 text-center text-sm text-muted">{{ tm.vazio }}</p>
    <ul v-else class="grid gap-px bg-default sm:grid-cols-2 2xl:grid-cols-3">
      <li v-for="(m, i) in marcos" :key="m.id" class="flex flex-col gap-2 px-4 py-3 animate-[entrada_0.2s_ease-out_both]" :style="{ animationDelay: `${i * 40}ms` }">
        <div class="flex items-center gap-2">
          <span class="min-w-0 flex-1 truncate text-sm font-medium text-highlighted">{{ m.nome }}</span>
          <span class="text-sm font-semibold tabular-nums" :class="`text-${cor(m)}`">{{ md.progressoDoMarco(m) }}%</span>
        </div>
        <UProgress :model-value="md.progressoDoMarco(m)" :color="cor(m)" size="sm" />
        <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
          <span class="flex items-center gap-1" :class="passou(m) ? 'text-error' : ''">
            <UIcon :name="passou(m) ? 'i-lucide-calendar-x' : 'i-lucide-calendar'" class="size-3.5" />
            {{ passou(m) ? tm.vencido : tm.ate(data(m.dataAlvo)) }}
          </span>
          <span>{{ tm.tarefas(feitas(m), md.tarefasDoMarco(m).length) }}</span>
        </div>
        <div v-if="md.metasDoMarco(m.id).length" class="flex flex-wrap items-center gap-1.5">
          <span class="text-xs text-muted">{{ tm.contribuiPara }}</span>
          <UButton
            v-for="g in md.metasDoMarco(m.id)"
            :key="g.id"
            :label="g.nome"
            icon="i-lucide-target"
            size="xs"
            color="neutral"
            variant="outline"
            @click="md.abrirMeta(g.id)"
          />
        </div>
      </li>
    </ul>
  </section>
</template>
