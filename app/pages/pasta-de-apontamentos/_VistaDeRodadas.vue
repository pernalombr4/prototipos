<script setup lang="ts">
/**
 * A vista Rodadas da pasta de Apontamentos. Proposta (rodada 2).
 *
 * Uma rodada por bloco, da mais nova para a mais antiga, como a lista de
 * revisões de um PR no GitHub: veredito, resumo, quem enviou e quando, o pedido
 * de reteste e o que a rodada fez (apontados, reabertos, resolvidos,
 * conferidos e descartados). Quem confere vê também a rodada em preparação.
 * Clicar num apontamento abre o detalhe dele na vista Lista.
 */
import type { Apontamento } from './mocks'
import type { Lista, Secao } from './lista'
import type { Textos } from './textos'
import { pessoa, proximaRodada, rotuloDoEstado, secoesDaRodada, temPreparo, visualDoEstado } from './lista'

const props = defineProps<{ t: Textos, lista: Lista, quem: number }>()
const emit = defineEmits<{ abrir: [a: Apontamento] }>()

const ORDEM: Secao[] = ['novos', 'reabertos', 'resolvidos', 'conferidos', 'descartados']
const corDaSecao: Record<Secao, string> = { novos: 'text-highlighted', reabertos: 'text-error', resolvidos: 'text-info', conferidos: 'text-success', descartados: 'text-muted' }
const corDoVeredito = (v: string) => v === 'aprovado' ? 'success' : v === 'ressalvas' ? 'warning' : 'error'
const nomeDe = (id: number) => pessoa(props.lista, id)?.nome ?? ''
const rotulo = (a: Apontamento) => rotuloDoEstado(props.lista.config, a.estado, props.t.estados, props.t.locale)
/** A pasta que renomeia Resolvido ("Corrigido", "Ajustado") renomeia também a seção. */
const nomeDaSecao = (s: Secao) => s === 'resolvidos' && props.t.locale === 'pt-BR' && props.lista.config.rotulos.resolvido
  ? `${props.lista.config.rotulos.resolvido}s`
  : props.t.fluxo.secoes[s]

const preparo = computed(() => temPreparo(props.lista, props.quem) ? proximaRodada(props.lista) : null)

const blocos = computed(() => {
  const enviados = [...props.lista.rodadas].reverse().map(r => ({ numero: r.numero, rodada: r, secoes: secoesDaRodada(props.lista, r.numero, props.quem) }))
  const p = preparo.value
  return p ? [{ numero: p, rodada: null, secoes: secoesDaRodada(props.lista, p, props.quem) }, ...enviados] : enviados
})

/* A rodada mais nova vem aberta; as outras, recolhidas. */
const abertas = ref(new Set<number>(blocos.value.slice(0, 2).map(b => b.numero)))
function alternar(n: number) {
  const s = new Set(abertas.value)
  if (s.has(n)) s.delete(n)
  else s.add(n)
  abertas.value = s
}
</script>

<template>
  <div class="min-h-0 flex-1 overflow-y-auto px-5 py-4">
    <UEmpty
      v-if="!blocos.length"
      icon="i-lucide-history"
      :title="t.fluxo.semRodadasTitulo"
      :description="t.fluxo.semRodadasTexto"
      variant="naked"
      class="mx-auto max-w-md py-10"
    />

    <ol v-else class="relative mx-auto flex max-w-3xl flex-col gap-4 before:absolute before:inset-y-2 before:left-[1.05rem] before:w-px before:bg-accented">
      <li
        v-for="(b, i) in blocos"
        :key="b.numero"
        class="relative flex gap-4 [animation:entrada_.3s_ease-out_both]"
        :style="{ animationDelay: `${i * 50}ms` }"
      >
        <!-- O marcador da rodada -->
        <span
          class="relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full font-mono text-xs font-semibold ring-4 ring-default"
          :class="b.rodada ? 'bg-inverted text-inverted' : 'border border-dashed border-primary bg-primary/10 text-primary'"
        >R{{ b.numero }}</span>

        <section
          class="min-w-0 flex-1 rounded-lg border bg-default"
          :class="b.rodada ? 'border-default' : 'border-dashed border-primary/50'"
        >
          <header>
            <button
              type="button"
              class="flex w-full flex-wrap items-center gap-x-3 gap-y-1 rounded-t-lg px-4 py-3 text-left transition-colors hover:bg-elevated/50 focus-visible:outline-2 focus-visible:outline-primary"
              :aria-expanded="abertas.has(b.numero)"
              @click="alternar(b.numero)"
            >
              <span class="font-semibold text-highlighted">{{ b.rodada ? t.lista.rodada(b.numero) : t.fluxo.emPreparo(b.numero) }}</span>
              <UBadge v-if="b.rodada" :label="t.lista.vereditos[b.rodada.veredito]" :color="corDoVeredito(b.rodada.veredito)" variant="soft" size="sm" />
              <span v-if="b.rodada" class="text-xs text-muted">{{ t.lista.enviadaPor(nomeDe(b.rodada.quem), t.dataHora(b.rodada.quando)) }}</span>
              <span v-else class="text-xs text-muted">{{ t.fluxo.emPreparoTexto }}</span>
              <span class="ml-auto flex items-center gap-3 text-xs text-muted">
                <template v-for="s in ORDEM" :key="s">
                  <span v-if="b.secoes[s].length" class="tabular-nums">{{ nomeDaSecao(s) }} <span class="font-medium" :class="corDaSecao[s]">{{ b.secoes[s].length }}</span></span>
                </template>
                <UIcon name="i-lucide-chevron-down" class="size-4 transition-transform duration-200" :class="abertas.has(b.numero) ? 'rotate-180' : ''" />
              </span>
            </button>
          </header>

          <div v-show="abertas.has(b.numero)" class="flex flex-col gap-4 border-t border-default px-4 py-3">
            <p v-if="b.rodada?.resumo" class="text-sm text-default">{{ b.rodada.resumo }}</p>
            <p v-if="b.rodada?.retestePedidoEm && b.rodada.retestePedidoPor" class="flex items-center gap-1.5 text-xs text-info">
              <UIcon name="i-lucide-repeat" class="size-3.5" />{{ t.lista.retestePedido(nomeDe(b.rodada.retestePedidoPor), t.dataHora(b.rodada.retestePedidoEm)) }}
            </p>

            <p v-if="ORDEM.every(s => !b.secoes[s].length)" class="text-sm text-dimmed">{{ t.fluxo.nadaNaRodada }}</p>

            <div v-for="s in ORDEM" v-show="b.secoes[s].length" :key="s" class="flex flex-col gap-1">
              <h4 class="text-xs font-semibold uppercase tracking-wider" :class="corDaSecao[s]">{{ nomeDaSecao(s) }} · {{ b.secoes[s].length }}</h4>
              <ul class="flex flex-col">
                <li v-for="a in b.secoes[s]" :key="a.id">
                  <button
                    type="button"
                    class="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-elevated focus-visible:outline-2 focus-visible:outline-primary"
                    :aria-label="t.fluxo.abrir(a.numero)"
                    @click="emit('abrir', a)"
                  >
                    <span class="shrink-0 font-mono text-xs text-dimmed">#{{ a.numero }}</span>
                    <span class="min-w-0 flex-1 truncate text-highlighted">{{ a.titulo }}</span>
                    <UBadge :label="rotulo(a)" :icon="visualDoEstado[a.estado].icone" :color="visualDoEstado[a.estado].cor" :variant="visualDoEstado[a.estado].variante" size="sm" class="shrink-0" />
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </li>
    </ol>
  </div>
</template>
