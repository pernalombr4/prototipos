<script setup lang="ts">
/**
 * IA › Limites de uso. Tela nova, fora dos 10 pedidos: sugestão da redatora na
 * rodada 1 ("IA nao deveria ter uma sessao propria? pra fazer configuraçoes de
 * segurança/limites de uso de ia").
 *
 * Hoje o admin tem o log "AI Usage" (provedor/modelo, custo, tokens), o
 * provedor padrão em Configurações Gerais e os créditos na carteira do
 * workspace. Referências: monday ("AI governance" com permissões por papel),
 * Notion (Notion AI › Model controls e Usage). Limite mensal da organização,
 * limite por workspace e por pessoa, e lista de modelos permitidos.
 */
import type { EnTableColumn } from '@be-enlighten/enspace-sdk-ui/base'
import type { Textos } from './textos'
import Cabecalho from './_Cabecalho.vue'
import Regra from './_Regra.vue'
import { consumoIA, modelosDeIA, nomeDoWorkspace } from './mocks'
import { numero } from './apoio'

const props = defineProps<{ t: Textos, marcarNovo: boolean }>()
const idioma = useIdioma()
const toast = useToast()
const tl = computed(() => props.t.limites)

interface Limites { mensal: number, aoChegar: 'avisar' | 'pausar' | 'admins', alertas: number[], porPessoa: number, modelos: string[], semRetencao: boolean, porWs: Record<string, number | null> }
const salvo = useState<Limites>('sa-ia-limites', () => ({
  mensal: 50_000,
  aoChegar: 'admins',
  alertas: [80, 100],
  porPessoa: 60,
  modelos: ['anthropic/claude-sonnet-4.5', 'anthropic/claude-haiku-4.5', 'openai/gpt-5-mini'],
  semRetencao: true,
  porWs: Object.fromEntries(consumoIA.map(c => [c.workspace, c.limiteProprio])),
}))
const c = reactive<Limites>(structuredClone(toRaw(salvo.value)))
const alterada = computed(() => JSON.stringify(c) !== JSON.stringify(salvo.value))
function salvar() {
  salvo.value = structuredClone(toRaw(c))
  toast.add({ title: tl.value.salvo, icon: 'i-lucide-check', color: 'success' })
}

/* Com "sem retenção", modelo de provedor que retém some da lista. */
const modelosDisponiveis = computed(() => modelosDeIA.filter(m => !c.semRetencao || m.semRetencao).map(m => m.id))
watch(modelosDisponiveis, (d) => { c.modelos = c.modelos.filter(m => d.includes(m)) })

const usado = consumoIA.reduce((s, x) => s + x.usado, 0)
const DIA_DO_MES = 19
const projecao = Math.round(usado / DIA_DO_MES * 31)
const pct = computed(() => Math.min(100, Math.round(usado / c.mensal * 100)))
const corPct = computed(() => pct.value >= 100 ? 'error' : pct.value >= 80 ? 'warning' : 'primary')

const colunas = computed<EnTableColumn[]>(() => [
  { key: 'workspace', label: tl.value.col.workspace },
  { key: 'usado', label: tl.value.col.usado, align: 'right' },
  { key: 'parte', label: tl.value.col.parte },
  { key: 'limite', label: tl.value.col.limite },
])
const linhas = computed(() => consumoIA.map(x => ({ ...x, limite: c.porWs[x.workspace] })) as unknown as Record<string, unknown>[])
function parteDe(row: { workspace: string, usado: number }) {
  const lim = c.porWs[row.workspace] ?? c.mensal
  return Math.min(100, Math.round(row.usado / lim * 100))
}
</script>

<template>
  <div>
    <Cabecalho :titulo="tl.titulo" :intro="tl.intro" :novo="marcarNovo" :rotulo-novo="t.casca.novo">
      <template #acoes>
        <span v-if="alterada" class="text-xs text-warning">{{ t.comum.pendentes(1) }}</span>
        <UButton :label="t.comum.descartar" size="sm" color="neutral" variant="ghost" :disabled="!alterada" @click="Object.assign(c, structuredClone(toRaw(salvo)))" />
        <UButton :label="t.comum.salvar" size="sm" :disabled="!alterada" @click="salvar" />
      </template>
    </Cabecalho>

    <div class="space-y-4 p-6">
      <!-- Consumo do mês -->
      <section class="animate-[entrada_.3s_ease-out_both] rounded-lg border border-default bg-default p-4">
        <div class="flex flex-wrap items-end gap-3">
          <div>
            <p class="text-xs font-semibold uppercase tracking-wider text-muted">{{ tl.mes }}</p>
            <p class="mt-1 text-2xl font-semibold text-highlighted">{{ tl.usados(numero(usado, idioma), numero(c.mensal, idioma)) }}</p>
          </div>
          <UBadge :label="`${pct}%`" :color="corPct" variant="soft" class="mb-1" />
        </div>
        <UProgress :model-value="pct" :color="corPct" size="sm" class="mt-3" />
        <p class="mt-2 text-xs" :class="projecao > c.mensal ? 'text-warning' : 'text-muted'">{{ tl.projecao(numero(projecao, idioma)) }}</p>
      </section>

      <div class="grid gap-4 lg:grid-cols-3">
        <Regra :titulo="tl.limiteOrg" icone="i-lucide-gauge" :descricao="tl.limiteOrgAjuda" :alterada="c.mensal !== salvo.mensal">
          <div class="flex items-center gap-2">
            <UInputNumber v-model="c.mensal" :min="1000" :step="5000" class="w-40" :aria-label="tl.limiteOrg" />
            <span class="text-sm text-muted">{{ tl.creditos }}</span>
          </div>
        </Regra>
        <Regra :titulo="tl.aoChegar" icone="i-lucide-octagon-pause" :alterada="c.aoChegar !== salvo.aoChegar">
          <USelect v-model="c.aoChegar" :items="(['avisar', 'admins', 'pausar'] as const).map(v => ({ label: tl.aoChegarOpcoes[v], value: v }))" class="w-full" :aria-label="tl.aoChegar" />
          <UFormField :label="tl.alertas">
            <UCheckboxGroup v-model="c.alertas" :items="[50, 80, 100].map(v => ({ label: `${v}%`, value: v }))" orientation="horizontal" />
          </UFormField>
        </Regra>
        <Regra :titulo="tl.porPessoa" icone="i-lucide-user-round" :descricao="tl.porPessoaAjuda" :alterada="c.porPessoa !== salvo.porPessoa">
          <div class="flex items-center gap-2">
            <UInputNumber v-model="c.porPessoa" :min="0" :step="10" class="w-32" :aria-label="tl.porPessoa" />
            <span class="text-sm text-muted">{{ tl.pedidosDia }}</span>
          </div>
        </Regra>
      </div>

      <Regra :titulo="tl.modelos" icone="i-lucide-cpu" :descricao="tl.modelosAjuda" :alterada="JSON.stringify(c.modelos) !== JSON.stringify(salvo.modelos) || c.semRetencao !== salvo.semRetencao">
        <div class="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
          <USelectMenu v-model="c.modelos" :items="modelosDisponiveis" multiple class="w-full" :ui="{ base: 'font-mono text-xs' }" :aria-label="tl.modelos" />
          <USwitch v-model="c.semRetencao" :label="tl.retencao" :description="tl.retencaoAjuda" />
        </div>
      </Regra>

      <section class="space-y-2">
        <h3 class="text-sm font-semibold text-highlighted">{{ tl.porWorkspace }}</h3>
        <EnTable :columns="colunas" :rows="linhas" :locale="idioma">
          <template #cell-workspace="{ row }"><span class="text-sm text-highlighted">{{ nomeDoWorkspace((row as any).workspace) }}</span></template>
          <template #cell-usado="{ row }"><span class="font-mono text-xs text-toned">{{ numero((row as any).usado, idioma) }}</span></template>
          <template #cell-parte="{ row }">
            <div class="flex w-40 items-center gap-2">
              <UProgress :model-value="parteDe(row as any)" :color="parteDe(row as any) >= 90 ? 'warning' : 'primary'" size="xs" class="flex-1" />
              <span class="w-9 text-right font-mono text-xs text-muted">{{ parteDe(row as any) }}%</span>
            </div>
          </template>
          <template #cell-limite="{ row }">
            <div class="flex items-center gap-2">
              <UInputNumber
                :model-value="c.porWs[(row as any).workspace] ?? undefined"
                :placeholder="tl.semProprio"
                :min="0"
                :step="1000"
                size="xs"
                class="w-40"
                :aria-label="`${tl.col.limite}: ${nomeDoWorkspace((row as any).workspace)}`"
                @update:model-value="(v: number | null | undefined) => { c.porWs[(row as any).workspace] = v ?? null }"
              />
            </div>
          </template>
        </EnTable>
      </section>
    </div>
  </div>
</template>
