<script setup lang="ts">
/**
 * O prazo final no Painel de tarefas (RF026 a RF031).
 *
 * O painel subiu no develop em 11/11/2026 (`/workspaces/<ws>/tasks/dashboard`):
 * 6 números (Abertas agora, Concluídas, Criadas, Vencidas, No prazo, Tempo médio
 * de conclusão), Entrada e saída, Abertas por status, Saúde dos prazos,
 * Prioridade, Pontos, Origem e execução, Atividade, Carga por responsável e as
 * listas Vencidas e Vencem em breve.
 *
 * Aqui só as lâminas novas e as que mudam, na moldura do develop. As outras
 * seguem como estão e não foram reproduzidas, a pedido da redatora.
 *
 * Regra (RN007): o que o painel já conta pelo vencimento continua contando pelo
 * vencimento. O prazo final ganha lâminas próprias ou um seletor; nunca troca o
 * número de uma lâmina que já existe.
 */
import type { Idioma } from '~/composables/useIdioma'
import type { Textos } from './textos'
import type { TextosR5 } from './textos-r5'
import type { TarefaRapida } from './mocks'
import { HOJE, concluidaEm, historicoDeConcluidas, membros } from './mocks'
import { atrasada, diasEntre, prazoFinalEm7Dias, prazoFinalVencido, vencimentoEm7Dias } from './datas'
import Lamina from './_Lamina.vue'

const props = defineProps<{ t: Textos, r: TextosR5, idioma: Idioma, tarefas: TarefaRapida[] }>()
const emit = defineEmits<{ abrir: [tarefa: TarefaRapida] }>()

const p = computed(() => props.r.painel)
const tipo = ref<'rapidas' | 'agendadas'>('rapidas')
const tipos = computed(() => (['rapidas', 'agendadas'] as const).map(v => ({ label: p.value.tipos[v], value: v })))
const periodo = ref(0)

const abertas = computed(() => props.tarefas.filter(t => t.status !== 'completed'))
const pfVencidas = computed(() => abertas.value.filter(prazoFinalVencido).sort((a, b) => a.final_due_date!.localeCompare(b.final_due_date!)))
const pfEm7 = computed(() => abertas.value.filter(prazoFinalEm7Dias).sort((a, b) => a.final_due_date!.localeCompare(b.final_due_date!)))
const pct = (n: number, total: number) => total ? Math.round((n / total) * 100) : 0

/* Concluídas no período: as da lista e o histórico. */
const concluidas = computed(() => [
  ...historicoDeConcluidas,
  ...props.tarefas.filter(t => t.status === 'completed' && concluidaEm[t.id]).map(t => ({ prazo: t.due_date, prazoFinal: t.final_due_date, concluida: concluidaEm[t.id]!, responsavel: t.assigned_to ?? 0 })),
])
const comPf = computed(() => concluidas.value.filter(c => c.prazoFinal))
const dentroDoPf = computed(() => comPf.value.filter(c => c.concluida <= c.prazoFinal!))
const comPrazo = computed(() => concluidas.value.filter(c => c.prazo))
const noPrazo = computed(() => comPrazo.value.filter(c => c.concluida <= c.prazo!))

/* Saúde dos prazos: o seletor troca a data que define a faixa. */
const dataDaSaude = ref<'prazo' | 'prazoFinal'>('prazoFinal')
const seletorDaSaude = computed(() => (['prazo', 'prazoFinal'] as const).map(v => ({ label: p.value.seletorDeData[v], value: v })))
const faixas = computed(() => {
  const a = abertas.value
  if (dataDaSaude.value === 'prazo') {
    const f = p.value.faixasPrazo
    const venc = a.filter(atrasada).length
    const em7 = a.filter(vencimentoEm7Dias).length
    const sem = a.filter(t => !t.due_date).length
    return [
      { chave: 'v', rotulo: f.vencidas, n: venc, cor: 'bg-error' },
      { chave: 'e', rotulo: f.em7, n: em7, cor: 'bg-warning' },
      { chave: 'n', rotulo: f.noPrazo, n: a.length - venc - em7 - sem, cor: 'bg-success' },
      { chave: 's', rotulo: f.sem, n: sem, cor: 'bg-neutral-400' },
    ]
  }
  const f = p.value.faixasPrazoFinal
  const venc = pfVencidas.value.length
  const em7 = pfEm7.value.length
  const sem = a.filter(t => !t.final_due_date).length
  return [
    { chave: 'v', rotulo: f.vencidas, n: venc, cor: 'bg-error' },
    { chave: 'e', rotulo: f.em7, n: em7, cor: 'bg-warning' },
    { chave: 'n', rotulo: f.noPrazo, n: a.length - venc - em7 - sem, cor: 'bg-success' },
    { chave: 's', rotulo: f.sem, n: sem, cor: 'bg-neutral-400' },
  ]
})
const ladoDireito = computed(() => dataDaSaude.value === 'prazo'
  ? { pct: pct(noPrazo.value.length, comPrazo.value.length), rotulo: p.value.concluidasNoPrazo, n: noPrazo.value.length, m: comPrazo.value.length }
  : { pct: pct(dentroDoPf.value.length, comPf.value.length), rotulo: p.value.concluidasNoPf, n: dentroDoPf.value.length, m: comPf.value.length })

/* Carga por responsável */
const modoCarga = ref<'abertas' | 'concluidas'>('abertas')
const carga = computed(() => {
  const linhas = membros.map((m) => {
    if (modoCarga.value === 'abertas') {
      const dele = abertas.value.filter(t => t.assigned_to === m.id)
      const pfV = dele.filter(prazoFinalVencido).length
      const atr = dele.filter(t => atrasada(t) && !prazoFinalVencido(t)).length
      return { membro: m, total: dele.length, partes: [
        { chave: 'pfV', n: pfV, cor: 'bg-error', rotulo: p.value.segmentos.pfVencido },
        { chave: 'atr', n: atr, cor: 'bg-error/40', rotulo: p.value.segmentos.atrasada },
        { chave: 'ok', n: dele.length - pfV - atr, cor: 'bg-info', rotulo: p.value.segmentos.emDia },
      ] }
    }
    const dele = concluidas.value.filter(c => c.responsavel === m.id)
    const dentro = dele.filter(c => c.prazoFinal && c.concluida <= c.prazoFinal).length
    const depois = dele.filter(c => c.prazoFinal && c.concluida > c.prazoFinal).length
    return { membro: m, total: dele.length, partes: [
      { chave: 'dentro', n: dentro, cor: 'bg-success', rotulo: p.value.concluidasNoPf },
      { chave: 'depois', n: depois, cor: 'bg-error', rotulo: p.value.faixasPrazoFinal.vencidas },
      { chave: 'sem', n: dele.length - dentro - depois, cor: 'bg-neutral-400', rotulo: p.value.faixasPrazoFinal.sem },
    ] }
  })
  return linhas.sort((a, b) => (b.partes[0]!.n - a.partes[0]!.n) || (b.total - a.total))
})
const maiorCarga = computed(() => Math.max(1, ...carga.value.map(l => l.total)))
const legendaCarga = computed(() => carga.value[0]?.partes ?? [])

const nomeDe = (id: number | null) => membros.find(m => m.id === id)?.nome ?? props.t.semResponsavel
const iniciais = (nome: string) => nome.split(' ').map(x => x[0]).slice(0, 2).join('')
</script>

<template>
  <div class="space-y-5 p-4 lg:p-6">
    <!-- Cabeçalho, como no develop -->
    <div class="flex flex-wrap items-start gap-3">
      <div>
        <h1 class="text-xl font-semibold text-highlighted">{{ p.titulo }}</h1>
        <p class="text-xs text-muted">{{ p.periodo }}</p>
      </div>
      <div class="ml-auto flex flex-wrap items-center gap-2">
        <USelect v-model="tipo" :items="tipos" class="w-48" :aria-label="p.titulo" />
        <div class="flex rounded-lg border border-default p-0.5" role="group">
          <UButton
            v-for="(rotulo, i) in p.periodos"
            :key="rotulo"
            :label="rotulo"
            size="sm"
            color="neutral"
            :variant="periodo === i ? 'soft' : 'ghost'"
            :aria-pressed="periodo === i"
            @click="periodo = i"
          />
        </div>
      </div>
    </div>
    <UButton :label="p.filtro" icon="i-lucide-filter" color="neutral" variant="ghost" size="sm" class="-mt-2" />

    <Transition mode="out-in" enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 translate-y-1" leave-active-class="transition duration-150 ease-in" leave-to-class="opacity-0">
      <UEmpty v-if="tipo === 'agendadas'" key="agendadas" icon="i-lucide-flag-off" :title="p.soRapidas" :description="p.soRapidasDescricao" class="mt-10" />

      <div v-else key="rapidas" class="space-y-6 pt-2">
        <!-- Números: entram depois de "No prazo" na linha do develop -->
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          <Lamina :titulo="p.pfVencido" :calculo="p.pfVencidoCalculo" :rotulo-calculo="p.comoCalculamos" cor="error" marca="nova" icone="i-lucide-flag">
            <p class="text-3xl font-semibold tabular-nums text-highlighted">{{ pfVencidas.length }}</p>
            <p class="mt-1 text-xs text-muted">{{ p.pfVencidoApoio(pct(pfVencidas.length, abertas.length), pfEm7.length) }}</p>
            <div class="mt-auto pt-4">
              <div class="h-1.5 overflow-hidden rounded-full bg-error/15">
                <div class="h-full rounded-full bg-error transition-[width] duration-500" :style="{ width: `${pct(pfVencidas.length, abertas.length)}%` }" />
              </div>
            </div>
          </Lamina>
          <Lamina :titulo="p.dentroDoPf" :calculo="p.dentroDoPfCalculo" :rotulo-calculo="p.comoCalculamos" cor="info" marca="nova" icone="i-lucide-flag-triangle-right">
            <template v-if="comPf.length">
              <p class="text-3xl font-semibold tabular-nums text-highlighted">{{ pct(dentroDoPf.length, comPf.length) }}%</p>
              <p class="mt-1 text-xs text-muted">{{ p.dentroDoPfApoio(dentroDoPf.length, comPf.length) }}</p>
            </template>
            <template v-else>
              <p class="text-3xl font-semibold text-highlighted">-</p>
              <p class="mt-1 text-xs text-muted">{{ p.semConcluidasComPf }}</p>
            </template>
          </Lamina>
          <p class="hidden items-center rounded-2xl border border-dashed border-default p-4 text-xs text-muted lg:col-span-4 lg:flex">
            Andaime: os 6 números do develop seguem na mesma linha, sem mudança. Os 2 números do prazo final entram depois de "No prazo" e a linha passa a quebrar em 2.
          </p>
        </div>

        <div class="grid gap-4 lg:grid-cols-12">
          <!-- Saúde dos prazos ganha o seletor Vencimento | Prazo final -->
          <Lamina class="lg:col-span-7" :titulo="p.saude" :apoio="p.saudeApoio" :calculo="p.saudeCalculo" :rotulo-calculo="p.comoCalculamos" cor="error" marca="muda">
            <template #acoes>
              <div class="flex rounded-lg border border-default p-0.5" role="group" :aria-label="p.saude">
                <UButton
                  v-for="op in seletorDaSaude"
                  :key="op.value"
                  :label="op.label"
                  :icon="op.value === 'prazoFinal' ? 'i-lucide-flag' : 'i-lucide-calendar'"
                  size="xs"
                  color="neutral"
                  :variant="dataDaSaude === op.value ? 'soft' : 'ghost'"
                  :aria-pressed="dataDaSaude === op.value"
                  @click="dataDaSaude = op.value"
                />
              </div>
            </template>
            <div class="grid flex-1 gap-4 sm:grid-cols-[1fr_auto]">
              <div class="flex flex-col justify-center">
                <div class="flex h-3 overflow-hidden rounded-full bg-elevated">
                  <div v-for="f in faixas" :key="f.chave" :class="f.cor" class="h-full transition-[width] duration-500" :style="{ width: `${pct(f.n, abertas.length)}%` }" />
                </div>
                <dl class="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div v-for="f in faixas" :key="f.chave">
                    <dt class="flex items-center gap-1.5 text-xs text-toned"><span class="size-2 rounded-full" :class="f.cor" aria-hidden="true" />{{ f.rotulo }}</dt>
                    <dd class="text-lg font-semibold tabular-nums text-highlighted">{{ f.n }}</dd>
                    <dd class="text-[11px] text-muted">{{ pct(f.n, abertas.length) }}%</dd>
                  </div>
                </dl>
              </div>
              <div class="flex flex-col items-center justify-center border-default text-center sm:border-l sm:pl-6">
                <p class="text-3xl font-semibold tabular-nums text-highlighted">{{ ladoDireito.pct }}%</p>
                <p class="mt-2 text-xs font-medium text-highlighted">{{ ladoDireito.rotulo }}</p>
                <p class="text-[11px] text-muted">{{ p.nDeM(ladoDireito.n, ladoDireito.m) }}</p>
              </div>
            </div>
          </Lamina>

          <!-- Carga por responsável ganha o segmento do prazo final vencido -->
          <Lamina class="lg:col-span-5" :titulo="p.carga" :apoio="p.cargaApoio" :calculo="p.cargaCalculo" :rotulo-calculo="p.comoCalculamos" cor="primary" marca="muda">
            <template #acoes>
              <div class="flex rounded-lg border border-default p-0.5" role="group" :aria-label="p.carga">
                <UButton
                  v-for="m in (['abertas', 'concluidas'] as const)"
                  :key="m"
                  :label="m === 'abertas' ? p.abertas : p.concluidas"
                  size="xs"
                  color="neutral"
                  :variant="modoCarga === m ? 'soft' : 'ghost'"
                  :aria-pressed="modoCarga === m"
                  @click="modoCarga = m"
                />
              </div>
            </template>
            <ul class="space-y-2.5">
              <li v-for="l in carga" :key="l.membro.id" class="flex items-center gap-2">
                <UAvatar :text="iniciais(l.membro.nome)" size="xs" />
                <span class="w-28 truncate text-xs text-toned">{{ l.membro.nome }}</span>
                <div class="flex h-2.5 flex-1 overflow-hidden rounded-full bg-elevated">
                  <UTooltip v-for="s in l.partes" :key="s.chave" :text="`${s.rotulo}: ${s.n}`" :disabled="!s.n">
                    <div :class="s.cor" class="h-full transition-[width] duration-500" :style="{ width: `${(s.n / maiorCarga) * 100}%` }" />
                  </UTooltip>
                </div>
                <span class="w-5 text-right text-xs font-semibold tabular-nums text-highlighted">{{ l.total }}</span>
              </li>
            </ul>
            <ul class="mt-auto flex flex-wrap gap-x-3 gap-y-1 border-t border-default pt-3 text-[11px] text-toned">
              <li v-for="s in legendaCarga" :key="s.chave" class="flex items-center gap-1"><span class="size-2 rounded-full" :class="s.cor" aria-hidden="true" />{{ s.rotulo }}</li>
            </ul>
          </Lamina>
        </div>

        <!-- As 2 listas novas, ao lado das listas Vencidas e Vencem em breve do develop -->
        <div class="grid gap-4 lg:grid-cols-2">
          <Lamina :titulo="p.listaPfVencido" :calculo="p.listaPfVencidoCalculo" :rotulo-calculo="p.comoCalculamos" cor="error" marca="nova">
            <template #acoes><UBadge :label="String(pfVencidas.length)" color="error" variant="subtle" size="sm" /></template>
            <ul v-if="pfVencidas.length" class="divide-y divide-default">
              <li v-for="tr in pfVencidas" :key="tr.id">
                <button type="button" class="flex w-full items-center gap-3 rounded-md px-1 py-2 text-left transition hover:bg-elevated focus-visible:outline-2 focus-visible:outline-primary" @click="emit('abrir', tr)">
                  <span class="min-w-0 flex-1">
                    <span class="block truncate text-sm text-highlighted">{{ tr.name }}</span>
                    <span class="block text-xs text-muted">{{ nomeDe(tr.assigned_to) }} · {{ t.prioridades[tr.priority] }}</span>
                  </span>
                  <UBadge :label="p.vencidoHa(diasEntre(tr.final_due_date!, HOJE))" color="error" variant="solid" size="sm" icon="i-lucide-flag" />
                </button>
              </li>
            </ul>
            <p v-else class="py-8 text-center text-sm text-muted">{{ p.nadaPorAqui }}</p>
          </Lamina>
          <Lamina :titulo="p.listaPfEm7" :calculo="p.listaPfEm7Calculo" :rotulo-calculo="p.comoCalculamos" cor="warning" marca="nova">
            <template #acoes><UBadge :label="String(pfEm7.length)" color="warning" variant="subtle" size="sm" /></template>
            <ul v-if="pfEm7.length" class="divide-y divide-default">
              <li v-for="tr in pfEm7" :key="tr.id">
                <button type="button" class="flex w-full items-center gap-3 rounded-md px-1 py-2 text-left transition hover:bg-elevated focus-visible:outline-2 focus-visible:outline-primary" @click="emit('abrir', tr)">
                  <span class="min-w-0 flex-1">
                    <span class="block truncate text-sm text-highlighted">{{ tr.name }}</span>
                    <span class="block text-xs text-muted">{{ nomeDe(tr.assigned_to) }} · {{ t.prioridades[tr.priority] }}</span>
                  </span>
                  <UBadge v-if="atrasada(tr)" :label="t.atrasada" color="error" variant="subtle" size="sm" icon="i-lucide-alarm-clock" />
                  <UBadge :label="p.venceEm(diasEntre(HOJE, tr.final_due_date!))" color="warning" variant="subtle" size="sm" icon="i-lucide-flag" />
                </button>
              </li>
            </ul>
            <p v-else class="py-8 text-center text-sm text-muted">{{ p.nadaPorAqui }}</p>
          </Lamina>
        </div>
      </div>
    </Transition>
  </div>
</template>
