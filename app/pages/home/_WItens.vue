<script setup lang="ts">
/**
 * Os 4 widgets NOVOS de itens (rodada 6), para o grupo "Itens e categorias"
 * ter mais que o atalho das categorias. Todos leem o que o item já guarda:
 * - Meus itens: os que têm a pessoa no campo responsável;
 * - Itens criados recentemente: os 8 mais novos, pela data de criação;
 * - Prazos de itens: um campo de data da categoria (vencimento, vigência)
 *   de hoje aos próximos 30 dias;
 * - Itens por categoria: barras horizontais, 1 por categoria.
 *
 * Rodada 7: o item não tem "em aberto" no ENSPACE (a redatora: "nem existe
 * esse conceito de aberto"). Nenhum widget filtra ou conta por isso; a etapa
 * do fluxo continua na linha, como o produto mostra.
 *
 * Só as categorias que a pessoa acessa entram (`itens` já chega filtrado).
 * Cada linha é um alvo só (regra 25) e abre o item.
 *
 * Componentes: `UScrollArea`, `UIcon`, `UBadge`, `UAvatar` (MCP nuxt-ui).
 */
import type { Item } from './mocks'
import { AGORA, DIA, EU, categoria, pessoa } from './mocks'
import { HOJE, dataCurta, dinheiro } from './formatar'
import type { Textos } from './textos'

const props = defineProps<{
  t: Textos
  tipo: 'meusItens' | 'ultimosItens' | 'prazosDeItens' | 'itensPorCategoria'
  itens: Item[]
  /** Itens que a pessoa acabou de criar: entram com destaque. */
  recemCriados: number[]
}>()
const emit = defineEmits<{ abrir: [destino: string] }>()


const lista = computed(() => {
  if (props.tipo === 'meusItens') return props.itens.filter(i => i.responsavel === EU.id).sort((a, b) => b.criadoEm - a.criadoEm)
  if (props.tipo === 'ultimosItens') return [...props.itens].sort((a, b) => b.criadoEm - a.criadoEm).slice(0, 8)
  if (props.tipo === 'prazosDeItens') return props.itens.filter(i => i.prazo && i.prazo >= HOJE && i.prazo < AGORA.getTime() + 30 * DIA).sort((a, b) => a.prazo! - b.prazo!)
  return []
})

const vazio = computed(() => ({ meusItens: props.t.itensW.vazioMeus, ultimosItens: props.t.itensW.vazio, prazosDeItens: props.t.itensW.vazioPrazos, itensPorCategoria: props.t.itensW.vazio })[props.tipo])

const barras = computed(() => {
  const r = new Map<string, number>()
  for (const i of props.itens) r.set(i.categoria, (r.get(i.categoria) ?? 0) + 1)
  const linhas = [...r.entries()].map(([slug, n]) => ({ c: categoria(slug)!, n })).filter(x => x.c).sort((a, b) => b.n - a.n)
  const max = Math.max(1, ...linhas.map(x => x.n))
  return linhas.map(x => ({ ...x, pct: Math.round(x.n / max * 100) }))
})

const COR: Record<string, string> = { primary: 'bg-primary', info: 'bg-info', success: 'bg-success', warning: 'bg-warning', error: 'bg-error', neutral: 'bg-inverted/40' }

function lateral(i: Item) {
  if (props.tipo === 'prazosDeItens' && i.prazo) {
    const venceu = i.prazo < AGORA.getTime()
    return { texto: venceu ? props.t.itensW.venceu(dataCurta(i.prazo, props.t)) : props.t.itensW.venceEm(dataCurta(i.prazo, props.t)), classe: venceu ? 'text-error-700 dark:text-error-300' : i.prazo < AGORA.getTime() + 7 * DIA ? 'text-warning-700 dark:text-warning-300' : 'text-muted' }
  }
  if (props.tipo === 'ultimosItens') return { texto: dataCurta(i.criadoEm, props.t), classe: 'text-muted' }
  return { texto: i.valor ? dinheiro(i.valor, props.t) : '', classe: 'text-muted' }
}
</script>

<template>
  <div v-if="tipo === 'itensPorCategoria'" class="flex min-h-0 flex-1 flex-col px-4 pb-3">
    <ul v-if="barras.length" class="space-y-2.5">
      <li v-for="(b, i) in barras" :key="b.c.slug">
        <button type="button" class="group/barra block w-full text-left focus-visible:outline-2 focus-visible:outline-primary" @click="emit('abrir', b.c.name)">
          <span class="mb-1 flex items-center gap-2 text-sm">
            <UIcon :name="b.c.icon ?? 'i-lucide-folder'" class="size-3.5 shrink-0 text-muted" />
            <span class="min-w-0 flex-1 truncate text-toned group-hover/barra:text-highlighted">{{ b.c.name }}</span>
            <span class="shrink-0 text-xs font-medium tabular-nums text-highlighted">{{ b.n }}</span>
          </span>
          <span class="block h-2 overflow-hidden rounded-full bg-elevated">
            <span
              class="block h-full origin-left animate-[home-crescer-x_0.5s_ease-out_both] rounded-full motion-reduce:animate-none"
              :class="COR[b.c.color ?? 'neutral'] ?? COR.neutral"
              :style="{ width: `${b.pct}%`, animationDelay: `${i * 60}ms` }"
            />
          </span>
        </button>
      </li>
    </ul>
    <p v-else class="flex flex-1 items-center justify-center text-center text-sm text-muted">
      {{ vazio }}
    </p>
  </div>

  <UScrollArea v-else class="min-h-0 flex-1">
    <ul v-if="lista.length" class="px-2 pb-2">
      <li v-for="(i, n) in lista" :key="i.id" class="animate-[entrada_0.3s_ease-out_both] motion-reduce:animate-none" :style="{ animationDelay: `${n * 30}ms` }">
        <button
          type="button"
          class="group/linha flex w-full items-center gap-3 rounded-md px-2 py-2 text-left transition-colors hover:bg-elevated focus-visible:outline-2 focus-visible:outline-primary"
          :class="recemCriados.includes(i.id) ? 'bg-primary/5' : ''"
          @click="emit('abrir', i.titulo)"
        >
          <UIcon :name="categoria(i.categoria)?.icon ?? 'i-lucide-file-text'" class="size-4 shrink-0 text-muted group-hover/linha:text-primary" />
          <span class="min-w-0 flex-1">
            <span class="flex items-center gap-1.5">
              <span class="truncate text-sm text-highlighted" :title="i.titulo">{{ i.titulo }}</span>
              <UBadge v-if="i.urgente" :label="t.beniChat.campos.urgente" color="error" variant="subtle" size="sm" class="shrink-0" />
            </span>
            <span class="block truncate text-xs text-muted">{{ categoria(i.categoria)?.name }} · {{ i.reference }} · {{ i.etapa }}</span>
          </span>
          <UAvatar v-if="tipo !== 'meusItens'" size="2xs" :text="pessoa(i.responsavel)?.iniciais" :alt="pessoa(i.responsavel)?.nome" class="shrink-0" />
          <span v-if="lateral(i).texto" class="shrink-0 text-xs tabular-nums" :class="lateral(i).classe">{{ lateral(i).texto }}</span>
        </button>
      </li>
    </ul>
    <p v-else class="px-4 py-8 text-center text-sm text-muted">
      {{ vazio }}
    </p>
  </UScrollArea>
</template>

<style>
/* A barra cresce da esquerda ao entrar. Sem prop no Nuxt UI para isso. Fora do scoped: o Vue renomeia keyframe de bloco scoped, e a classe do Tailwind não acharia. */
@keyframes home-crescer-x { from { transform: scaleX(0); } to { transform: scaleX(1); } }
</style>
