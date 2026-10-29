<script setup lang="ts">
/**
 * Barra do topo da Agenda: Hoje, setas e período à esquerda; vista, Sem data, Configurar e Novo à direita. "Sem data"
 * só aparece com as tarefas na Agenda e mostra quantas tarefas da pessoa não têm prazo.
 * É o esqueleto do Outlook, do Google e do ClickUp (PESQUISA.md). "Novo" sai do "+" que o BENI cobria e vai para o
 * topo; "Configurar" continua no topo, onde o develop já tem os botões de configuração.
 */
import type { Textos } from './textos'
import { HOJE, inicioDaSemana, rotuloDoPeriodo, somarDias, somarMeses } from './datas'
import { estado, type Vista } from './estado'

const props = defineProps<{ t: Textos, locale: string, pendentes: number, painel: boolean }>()
const emit = defineEmits<{ novo: [el: HTMLElement], configurar: [], painel: [] }>()

const vistas: Vista[] = ['dia', 'semana', 'mes', 'lista']

function andar(n: number) {
  const v = estado.vista
  estado.data = v === 'mes' ? somarMeses(estado.data, n) : somarDias(estado.data, n * (v === 'dia' ? 1 : v === 'semana' ? 7 : 14))
}

const temHoje = computed(() => {
  const d = estado.data
  if (estado.vista === 'dia') return d === HOJE
  if (estado.vista === 'mes') return d.slice(0, 7) === HOJE.slice(0, 7)
  const ini = estado.vista === 'semana' ? inicioDaSemana(d) : d
  return HOJE >= ini && HOJE <= somarDias(ini, estado.vista === 'semana' ? 6 : 13)
})
</script>

<template>
  <header class="flex flex-wrap items-center gap-2 border-b border-default px-4 py-2.5">
    <h1 class="mr-1 text-lg font-semibold text-highlighted">{{ t.casca.itens.agenda }}</h1>
    <UButton :label="t.barra.hoje" color="neutral" variant="outline" size="sm" :disabled="temHoje" @click="estado.data = HOJE" />
    <UFieldGroup size="sm">
      <UButton icon="i-lucide-chevron-left" color="neutral" variant="outline" :aria-label="t.barra.anterior" @click="andar(-1)" />
      <UButton icon="i-lucide-chevron-right" color="neutral" variant="outline" :aria-label="t.barra.proximo" @click="andar(1)" />
    </UFieldGroup>
    <p class="ml-1 text-base font-medium text-highlighted first-letter:uppercase" aria-live="polite">{{ rotuloDoPeriodo(estado.vista, estado.data, props.locale) }}</p>

    <div class="ml-auto flex flex-wrap items-center gap-2">
      <UFieldGroup size="sm" role="group" :aria-label="t.barra.vista">
        <UButton
          v-for="v in vistas"
          :key="v"
          :label="t.vistas[v]"
          :color="estado.vista === v ? 'primary' : 'neutral'"
          :variant="estado.vista === v ? 'subtle' : 'outline'"
          :aria-pressed="estado.vista === v"
          @click="estado.vista = v"
        />
      </UFieldGroup>
      <UChip v-if="estado.tarefasNaAgenda" :text="pendentes" :show="pendentes > 0" color="neutral" size="2xl">
        <UButton
          icon="i-lucide-calendar-off"
          :label="t.barra.paraAgendar"
          color="neutral"
          :variant="painel ? 'subtle' : 'outline'"
          size="sm"
          :aria-pressed="painel"
          @click="emit('painel')"
        />
      </UChip>
      <UButton icon="i-lucide-settings-2" :label="t.barra.configurar" color="neutral" variant="outline" size="sm" @click="emit('configurar')" />
      <UButton icon="i-lucide-plus" :label="t.barra.novo" size="sm" @click="emit('novo', $event.currentTarget as HTMLElement)" />
    </div>
  </header>
</template>
