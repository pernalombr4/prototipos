<script setup lang="ts">
/**
 * PROPOSTA (rodada 4): Módulo Jurídico › Eventos. O que o submódulo Capturas entrega ao Spaceflow.
 *
 * O submódulo para no processo cadastrado e no prazo confirmado. O que vem depois (pedir subsídios à área, designar o
 * escritório externo e o preposto, avisar a controladoria) muda de empresa para empresa e é configuração do caso de
 * uso Contencioso. Para isso funcionar, cada passo do submódulo vira um evento que o Spaceflow usa como gatilho.
 *
 * Os fluxos da tabela são do workspace. "Criar fluxo no Spaceflow" é maquete: o Spaceflow fica fora do protótipo.
 */
import type { EnTableColumn } from '@be-enlighten/enspace-sdk-ui/base'
import { processoPorId } from './mocks'
import { estado } from './estado'
import type { Textos } from './textos'
import { textosTratamento } from './textos-tratamento'
import type { EventoId } from './tratamento'
import { eventosDoSubmodulo, fluxoPorId, fluxos } from './tratamento'
import { diaHoraCurto } from './formato'

const props = defineProps<{ t: Textos }>()
const tt = useTextos(textosTratamento)
const idioma = useIdioma()
const toast = useToast()

const linhas = computed(() => eventosDoSubmodulo.map(e => ({ ...e, fluxos: fluxos.filter(f => f.evento === e.id) })))
const colunas = computed<EnTableColumn[]>(() => {
  const c = tt.value.eventos.colunas
  return [{ key: 'evento', label: c.evento }, { key: 'quando', label: c.quando }, { key: 'dados', label: c.dados }, { key: 'fluxos', label: c.fluxos }, { key: 'acoes', label: '' }]
})
type Linha = (typeof linhas.value)[number]

function criar(e: EventoId) {
  toast.add({ title: tt.value.eventos.nomes[e], description: tt.value.eventos.criarToast, icon: 'i-lucide-workflow', color: 'neutral' })
}

const ultimos = computed(() => estado.disparos.slice(0, 6))
</script>

<template>
  <div class="flex flex-col gap-6">
    <p class="max-w-4xl text-sm text-toned">{{ tt.eventos.descricao }}</p>

    <EnTable :columns="colunas" :rows="linhas" :locale="idioma">
      <template #cell-evento="{ row }">
        <span class="flex items-center gap-2 text-sm font-medium text-highlighted">
          <UIcon :name="(row as Linha).icone" class="size-4 shrink-0 text-primary" />{{ tt.eventos.nomes[(row as Linha).id] }}
        </span>
      </template>
      <template #cell-quando="{ row }">
        <span class="block max-w-xs whitespace-normal text-sm text-toned">{{ tt.eventos.quando[(row as Linha).id] }}</span>
      </template>
      <template #cell-dados="{ row }">
        <span class="flex max-w-56 flex-wrap gap-1">
          <code v-for="d in (row as Linha).dados" :key="d" class="rounded bg-elevated px-1.5 py-0.5 font-mono text-[11px] text-toned">{{ d }}</code>
        </span>
      </template>
      <template #cell-fluxos="{ row }">
        <span v-if="(row as Linha).fluxos.length" class="flex flex-col gap-1">
          <span v-for="f in (row as Linha).fluxos" :key="f.id" class="flex flex-wrap items-center gap-1.5">
            <UBadge :label="f.nome" icon="i-lucide-workflow" color="neutral" variant="subtle" size="sm" />
            <span v-if="f.filtro" class="text-xs text-muted">{{ tt.eventos.filtro(tt.andamento.movimentos[f.filtro]) }}</span>
          </span>
        </span>
        <span v-else class="text-sm text-dimmed">{{ tt.eventos.nenhum }}</span>
      </template>
      <template #cell-acoes="{ row }">
        <UButton :label="tt.eventos.criar" icon="i-lucide-plus" size="xs" color="neutral" variant="outline" @click="criar((row as Linha).id)" />
      </template>
    </EnTable>

    <section class="flex max-w-4xl flex-col gap-2">
      <h2 class="text-sm font-semibold text-highlighted">{{ tt.eventos.ultimos }}</h2>
      <p v-if="!ultimos.length" class="text-sm text-muted">{{ tt.eventos.semDisparos }}</p>
      <TransitionGroup
        v-else
        tag="ul"
        class="flex flex-col divide-y divide-default overflow-hidden rounded-lg border border-default"
        enter-active-class="transition-[opacity,transform] duration-300"
        enter-from-class="opacity-0 -translate-y-1"
      >
        <li v-for="d in ultimos" :key="d.id" class="flex flex-wrap items-center gap-x-3 gap-y-1 px-3 py-2 text-sm">
          <span class="w-28 shrink-0 text-xs tabular-nums text-muted">{{ diaHoraCurto(d.quando, props.t.locale) }}</span>
          <span class="font-medium text-highlighted">{{ tt.eventos.nomes[d.evento] }}</span>
          <span v-if="d.processo" class="text-xs text-muted">{{ processoPorId.get(d.processo)?.reference }}</span>
          <span class="ml-auto text-xs" :class="d.fluxos.length ? 'text-toned' : 'text-dimmed'">
            {{ d.fluxos.length ? tt.eventos.disparou(d.fluxos.map(f => fluxoPorId.get(f)?.nome).join(', ')) : tt.eventos.nenhumFluxo }}
          </span>
        </li>
      </TransitionGroup>
    </section>
  </div>
</template>
