<script setup lang="ts">
/**
 * PROPOSTA: o uso do agente nos últimos 30 dias, para o dono decidir o que
 * mudar (PESQUISA: Notion Insights, monday, ClickUp Credits, HubSpot).
 * Números do mocks.ts; a divisão por modelo e por ferramenta é inventada a
 * partir deles.
 */
import type { Textos } from './textos'
import type { Agente } from './mocks'
import { modeloPorId } from './catalogo'
import { useTela } from './estado'

const props = defineProps<{ t: Textos, a: Agente }>()
const tela = useTela()
const d = computed(() => props.t.desempenho)
const u = computed(() => props.a.uso)
const fmt = (n: number) => n.toLocaleString('pt-BR')

const avaliacao = computed(() => {
  const total = u.value.positivas + u.value.negativas
  return total ? Math.round((u.value.positivas / total) * 100) : 0
})

const cartoes = computed(() => [
  { rotulo: d.value.conversas, valor: fmt(u.value.conversas), icone: 'i-lucide-messages-square' },
  { rotulo: d.value.pessoas, valor: fmt(u.value.pessoas), icone: 'i-lucide-users' },
  { rotulo: d.value.creditos, valor: fmt(u.value.creditos), icone: 'i-lucide-coins' },
  { rotulo: d.value.avaliacao, valor: d.value.pct(avaliacao.value), icone: 'i-lucide-thumbs-up' },
  { rotulo: d.value.confirmacoes, valor: fmt(u.value.confirmacoes), icone: 'i-lucide-hand' },
  { rotulo: d.value.canceladas, valor: fmt(u.value.canceladas), icone: 'i-lucide-circle-slash' },
])

/* Divisão fictícia: o padrão leva a maior parte. */
const porModelo = computed(() => {
  const ids = props.a.modelosPermitidos
  const pesos = ids.map(id => id === props.a.model ? 6 : 1)
  const soma = pesos.reduce((s, x) => s + x, 0)
  return ids.map((id, i) => ({ nome: modeloPorId(id)?.name ?? id, pct: Math.round((pesos[i]! / soma) * 100) }))
})
const porFerramenta = computed(() => Object.keys(props.a.ferramentas).slice(0, 5).map((s, i) => ({ nome: props.t.ferramentas.nomes[s] ?? s, pct: [72, 41, 23, 12, 6][i]! })))

function verAtividade() {
  tela.value.editorAberto = false
  tela.value.aba = 'atividade'
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-2">
      <h3 class="text-base font-semibold text-highlighted">{{ d.titulo }}</h3>
      <UButton :label="d.verAtividade" trailing-icon="i-lucide-arrow-right" color="neutral" variant="outline" size="sm" @click="verAtividade" />
    </div>

    <p v-if="!u.conversas" class="rounded-lg bg-elevated/50 px-4 py-8 text-center text-sm text-muted">{{ d.semDados }}</p>

    <template v-else>
      <dl class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <div v-for="(c, i) in cartoes" :key="c.rotulo" class="rounded-lg border border-default p-3 animate-[entrada_300ms_ease-out_both]" :style="{ animationDelay: `${i * 40}ms` }">
          <dt class="flex items-center gap-1.5 text-xs text-muted"><UIcon :name="c.icone" class="size-3.5" />{{ c.rotulo }}</dt>
          <dd class="mt-1 text-xl font-semibold tabular-nums text-highlighted">{{ c.valor }}</dd>
        </div>
      </dl>

      <div class="grid gap-6 md:grid-cols-2">
        <section>
          <h4 class="mb-3 text-sm font-medium text-highlighted">{{ d.porModelo }}</h4>
          <ul class="space-y-3">
            <li v-for="m in porModelo" :key="m.nome">
              <div class="mb-1 flex justify-between text-xs"><span>{{ m.nome }}</span><span class="tabular-nums text-muted">{{ d.pct(m.pct) }}</span></div>
              <UProgress :model-value="m.pct" size="sm" />
            </li>
          </ul>
        </section>
        <section v-if="porFerramenta.length">
          <h4 class="mb-3 text-sm font-medium text-highlighted">{{ d.ferramentasMaisUsadas }}</h4>
          <ul class="space-y-3">
            <li v-for="f in porFerramenta" :key="f.nome">
              <div class="mb-1 flex justify-between text-xs"><span>{{ f.nome }}</span><span class="tabular-nums text-muted">{{ d.pct(f.pct) }}</span></div>
              <UProgress :model-value="f.pct" color="neutral" size="sm" />
            </li>
          </ul>
        </section>
      </div>
    </template>
  </div>
</template>
