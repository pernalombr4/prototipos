<script setup lang="ts">
/**
 * A tela do item da categoria Processos (caso de uso Contencioso).
 *
 * Hoje (cópia do develop, 26/10/2026, a mesma de `central-de-execucoes/_TelaDoItem.vue`): painel da esquerda com o
 * ícone, a referência, a categoria, Identificação, Origem e Histórico; abas Visão Geral, Comentários, Logs de
 * Auditoria, Tarefas, Anexos, Emails Automáticos, Mail Box, Notas e Campos; rodapé "Alterações não salvas",
 * "Sair sem salvar" e "Salvar".
 *
 * A Visão Geral mostra os campos que o caso de uso cria. Sem o módulo, "Próximo prazo" é uma data que alguém digita
 * e o risco é um campo que perde o valor anterior ao salvar.
 *
 * PROPOSTA, só com o módulo ligado:
 * - "Próximo prazo" vira o prazo calculado, com o ato;
 * - as abas Prazos, Intimações e Risco e provisão, depois de Tarefas;
 * - a mudança de risco avisa que entra na data-base em aberto.
 */
import type { Risco } from './mocks'
import { categorias, pessoaPorId, processoPorId, regraPorId, tribunais } from './mocks'
import { calcularPrazo, estado, processoDaCaptura, provisionado } from './estado'
import type { Textos } from './textos'
import { dia, dinheiro } from './formato'
import MemoriaDoCalculo from './_MemoriaDoCalculo.vue'
import { LIBERADO } from './submodulos'
import { textosCapturas } from './textos-capturas'

const props = defineProps<{ t: Textos, processo: number, moduloLigado: boolean }>()
const emit = defineEmits<{ ir: ['intimacoes' | 'prazos' | 'provisao'] }>()

const p = computed(() => processoPorId.get(props.processo)!)
const categoria = categorias.find(c => c.id === 'processos')!
const tribunal = computed(() => tribunais[p.value.data.tribunal])

type Aba = 'visaoGeral' | 'comentarios' | 'logs' | 'tarefas' | 'prazos' | 'intimacoes' | 'provisao' | 'anexos' | 'emails' | 'mailbox' | 'notas' | 'campos'
const aba = ref<Aba>('visaoGeral')
watch(() => props.moduloLigado, (l) => { if (!l && ['prazos', 'intimacoes', 'provisao'].includes(aba.value)) aba.value = 'visaoGeral' })
watch(() => props.processo, () => { aba.value = 'visaoGeral' })

/* ---------- o que o módulo traz para este processo ---------- */
const prazos = computed(() => estado.prazos
  .filter(x => x.processo === props.processo)
  .map(x => ({ x, c: calcularPrazo(x) }))
  .sort((a, b) => (a.c.fatal < b.c.fatal ? -1 : 1)))
const proximo = computed(() => prazos.value.find(x => x.x.status !== 'completed'))
// Rodada 3: a aba mostra toda captura do processo (intimação, citação e andamento), também as vinculadas à mão.
const intimacoes = computed(() => estado.intimacoes.filter(i => processoDaCaptura(i)?.id === p.value.id))
const tc = useTextos(textosCapturas)
const aRevisar = computed(() => intimacoes.value.filter(i => i.status === 'revisar').length)

const abas = computed(() => {
  const a = props.t.processo.abas
  const lista: { value: Aba, label: string, icon?: string, badge?: string }[] = [
    { value: 'visaoGeral', label: a.visaoGeral },
    { value: 'comentarios', label: a.comentarios },
    { value: 'logs', label: a.logs },
    { value: 'tarefas', label: a.tarefas },
  ]
  if (props.moduloLigado) {
    const abertos = prazos.value.filter(x => x.x.status !== 'completed').length
    const revisar = intimacoes.value.filter(i => i.status === 'revisar').length
    lista.push(
      { value: 'prazos', label: a.prazos, icon: 'i-lucide-alarm-clock', badge: abertos ? String(abertos) : undefined },
      { value: 'intimacoes', label: a.intimacoes, icon: 'i-lucide-inbox', badge: revisar ? String(revisar) : undefined },
    )
    if (LIBERADO.provisao) lista.push({ value: 'provisao', label: a.provisao, icon: 'i-lucide-landmark' })
  }
  lista.push({ value: 'anexos', label: a.anexos }, { value: 'emails', label: a.emails }, { value: 'mailbox', label: a.mailbox }, { value: 'notas', label: a.notas }, { value: 'campos', label: a.campos })
  return lista
})

/* ---------- campos ---------- */
const c = computed(() => props.t.processo.campos)
const dados = computed(() => [
  { rotulo: c.value.numeroCnj, valor: p.value.data.numeroCnj, mono: true },
  { rotulo: c.value.tribunal, valor: `${tribunal.value.sigla} · ${tribunal.value.nome}` },
  { rotulo: c.value.orgao, valor: p.value.data.orgao },
  { rotulo: c.value.rito, valor: props.t.ritos[p.value.data.rito] },
  { rotulo: c.value.area, valor: p.value.data.area },
  { rotulo: c.value.polo, valor: p.value.data.polo },
  { rotulo: c.value.parteContraria, valor: p.value.data.parteContraria },
  { rotulo: c.value.valorDaCausa, valor: dinheiro(p.value.data.valorDaCausa, props.t.locale) },
  { rotulo: c.value.responsavel, valor: pessoaPorId.get(p.value.data.responsavel)?.nome ?? '' },
  { rotulo: c.value.escritorio, valor: p.value.data.escritorio },
  { rotulo: c.value.fase, valor: p.value.data.fase },
])

const risco = computed(() => estado.riscos[props.processo]!)
const opcoesDeRisco = computed(() => (['provavel', 'possivel', 'remota'] as Risco[]).map(r => ({ value: r, label: props.t.riscos[r] })))
const corDoRisco: Record<Risco, 'error' | 'warning' | 'neutral'> = { provavel: 'error', possivel: 'warning', remota: 'neutral' }

/* ---------- histórico por data-base ---------- */
const porDataBase = computed(() => {
  const linhas = estado.datasBase.map(b => ({ dia: b.dia, fechada: true, ...b.fotos.find(f => f.processo === props.processo)!, motivo: b.motivos?.[props.processo] ?? '' }))
  linhas.push({ dia: estado.dataBaseAberta, fechada: false, processo: props.processo, ...risco.value, motivo: estado.motivos[props.processo] ?? '' })
  return linhas.reverse()
})

const formatoCompleto = computed(() => new Intl.DateTimeFormat(props.t.locale, { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }))
const corDaIntimacao = { revisar: 'warning', confirmada: 'success', descartada: 'neutral' } as const
</script>

<template>
  <div class="flex min-h-0 flex-1">
    <!-- Painel da esquerda (cópia do develop) -->
    <aside class="hidden w-64 shrink-0 flex-col gap-5 overflow-y-auto border-r border-default p-4 md:flex">
      <div class="flex flex-col items-start gap-2">
        <span class="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <UIcon :name="categoria.icone" class="size-6" />
        </span>
        <p class="text-base font-semibold text-highlighted">{{ p.reference }}</p>
        <p class="text-sm text-toned">{{ p.titulo }}</p>
        <UBadge :label="categoria.nome" color="neutral" variant="outline" size="sm" />
      </div>
      <dl class="flex flex-col gap-4 text-sm">
        <div>
          <dt class="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted">{{ t.processo.painel.identificacao }}</dt>
          <dd class="flex justify-between gap-2"><span class="text-muted">{{ t.processo.painel.id }}</span><span class="font-mono text-xs text-toned">{{ p.id }}</span></dd>
        </div>
        <div>
          <dt class="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted">{{ t.processo.painel.origem }}</dt>
          <dd class="flex justify-between gap-2"><span class="text-muted">{{ t.processo.painel.status }}</span><UBadge :label="t.processo.painel.ativo" color="success" variant="subtle" size="sm" /></dd>
          <dd class="mt-1.5 flex justify-between gap-2"><span class="text-muted">{{ t.processo.painel.solicitante }}</span><span class="truncate text-toned">{{ pessoaPorId.get(p.data.responsavel)?.nome }}</span></dd>
        </div>
        <div>
          <dt class="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted">{{ t.processo.painel.historico }}</dt>
          <dd class="flex justify-between gap-2"><span class="text-muted">{{ t.processo.painel.criado }}</span><span class="text-toned">{{ formatoCompleto.format(p.created_at as Date) }}</span></dd>
          <dd class="mt-1.5 flex justify-between gap-2"><span class="text-muted">{{ t.processo.painel.atualizado }}</span><span class="text-toned">{{ formatoCompleto.format(new Date(2026, 9, 23, 16, 12)) }}</span></dd>
        </div>
      </dl>
    </aside>

    <div class="flex min-w-0 flex-1 flex-col">
      <UTabs v-model="aba" :items="abas" :content="false" variant="link" size="sm" :ui="{ root: 'items-start', list: 'w-max', trigger: 'flex-none' }" class="overflow-x-auto border-b border-default px-4" />

      <div class="min-h-0 flex-1 overflow-y-auto">
        <Transition mode="out-in" enter-active-class="transition-opacity duration-150" enter-from-class="opacity-0" leave-active-class="transition-opacity duration-100" leave-to-class="opacity-0">
          <!-- Visão Geral: os campos do caso de uso -->
          <div v-if="aba === 'visaoGeral'" key="visaoGeral" class="mx-auto flex max-w-5xl flex-col gap-5 p-5">
            <section class="rounded-lg border border-default p-4">
              <h2 class="mb-3 text-sm font-semibold text-highlighted">{{ t.processo.secoes.dados }}</h2>
              <dl class="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
                <div v-for="d in dados" :key="d.rotulo" class="min-w-0">
                  <dt class="text-xs text-muted">{{ d.rotulo }}</dt>
                  <dd class="truncate text-highlighted" :class="d.mono && 'font-mono text-xs'">{{ d.valor }}</dd>
                </div>
              </dl>
            </section>

            <div class="grid gap-5 lg:grid-cols-2">
              <!-- Prazo -->
              <section class="flex flex-col gap-3 rounded-lg border border-default p-4">
                <h2 class="text-sm font-semibold text-highlighted">{{ t.processo.secoes.prazo }}</h2>
                <UFormField :label="c.proximoPrazo">
                  <!-- Sem o módulo: a data digitada -->
                  <template v-if="!moduloLigado">
                    <UInput :model-value="p.data.proximoPrazoDigitado ? dia(p.data.proximoPrazoDigitado, t.locale) : ''" icon="i-lucide-calendar" class="w-48" />
                    <p class="mt-1.5 flex items-start gap-1.5 text-xs text-warning">
                      <UIcon name="i-lucide-triangle-alert" class="mt-px size-3.5 shrink-0" />{{ t.processo.digitado }}
                    </p>
                  </template>
                  <!-- PROPOSTA: com o módulo, o prazo calculado -->
                  <template v-else-if="proximo">
                    <div class="flex flex-wrap items-center gap-2">
                      <UBadge :label="dia(proximo.c.fatal, t.locale)" icon="i-lucide-flag" color="error" variant="subtle" size="lg" class="tabular-nums" />
                      <span class="text-xs text-muted">{{ t.prazos.colunas.interno }}: {{ dia(proximo.c.interno, t.locale) }}</span>
                    </div>
                    <p class="mt-1.5 flex items-start gap-1.5 text-xs text-toned">
                      <UIcon name="i-lucide-calculator" class="mt-px size-3.5 shrink-0 text-primary" />{{ t.processo.calculado(regraPorId.get(proximo.x.entrada.regra)!.ato) }}
                    </p>
                    <UButton :label="t.processo.abas.prazos" icon="i-lucide-arrow-right" trailing size="xs" color="neutral" variant="outline" class="mt-2" @click="aba = 'prazos'" />
                  </template>
                  <template v-else>
                    <p class="text-sm text-muted">{{ t.processo.semPrazo }}</p>
                    <UButton
                      v-if="moduloLigado && aRevisar"
                      :label="t.intimacoes.filtros.revisar"
                      icon="i-lucide-inbox"
                      size="xs"
                      color="neutral"
                      variant="outline"
                      class="mt-2"
                      @click="aba = 'intimacoes'"
                    >
                      <template #trailing>
                        <UBadge :label="String(aRevisar)" color="primary" variant="soft" size="sm" />
                      </template>
                    </UButton>
                  </template>
                </UFormField>
              </section>

              <!-- Risco -->
              <section class="flex flex-col gap-3 rounded-lg border border-default p-4">
                <h2 class="text-sm font-semibold text-highlighted">{{ t.processo.secoes.risco }}</h2>
                <div class="flex flex-wrap gap-3">
                  <UFormField :label="c.risco">
                    <USelect v-model="risco.risco" :items="opcoesDeRisco" class="w-40" />
                  </UFormField>
                  <UFormField :label="c.estimado">
                    <UInputNumber v-model="risco.estimado" :min="0" :step="1000" :format-options="{ style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }" :locale="t.locale" class="w-48" />
                  </UFormField>
                </div>
                <p v-if="!moduloLigado" class="flex items-start gap-1.5 text-xs text-muted">
                  <UIcon name="i-lucide-info" class="mt-px size-3.5 shrink-0" />{{ t.processo.riscoDoCasoDeUso }}
                </p>
                <p v-else-if="LIBERADO.provisao" class="flex items-start gap-1.5 text-xs text-toned">
                  <UIcon name="i-lucide-landmark" class="mt-px size-3.5 shrink-0 text-primary" />{{ t.processo.riscoComModulo(dia(estado.dataBaseAberta, t.locale)) }}
                </p>
              </section>
            </div>
          </div>

          <!-- PROPOSTA: a aba Prazos -->
          <div v-else-if="aba === 'prazos'" key="prazos" class="mx-auto flex max-w-4xl flex-col gap-3 p-5">
            <UEmpty v-if="!prazos.length" icon="i-lucide-alarm-clock" :title="t.processo.prazosVazio" variant="naked" class="py-10" />
            <details
              v-for="({ x, c: calc }, i) in prazos"
              :key="x.id"
              :open="i === 0 && x.status !== 'completed'"
              class="group animate-[entrada_.3s_ease-out_both] rounded-lg border border-default"
              :style="{ animationDelay: `${i * 50}ms` }"
            >
              <summary class="flex cursor-pointer list-none flex-wrap items-center gap-3 px-4 py-3 transition-colors hover:bg-elevated/40">
                <UIcon name="i-lucide-chevron-right" class="size-4 text-muted transition-transform group-open:rotate-90" />
                <span class="min-w-0 flex-1">
                  <span class="block text-sm font-medium text-highlighted">{{ regraPorId.get(x.entrada.regra)?.ato }}</span>
                  <span class="block text-xs text-muted">{{ x.reference }} · {{ pessoaPorId.get(x.assigned_to as number)?.nome }}</span>
                </span>
                <UBadge v-if="x.status === 'completed'" :label="t.prazos.grupos.cumpridos" color="success" variant="subtle" size="sm" />
                <UBadge v-if="x.historico.length" :label="t.prazos.recalculado" icon="i-lucide-history" color="warning" variant="outline" size="sm" />
                <span class="text-right text-xs text-muted">
                  {{ t.prazos.colunas.fatal }} <span class="font-semibold tabular-nums text-highlighted">{{ dia(calc.fatal, t.locale) }}</span>
                  <span class="block">{{ t.prazos.colunas.interno }} <span class="tabular-nums text-toned">{{ dia(calc.interno, t.locale) }}</span></span>
                </span>
              </summary>
              <div class="border-t border-default px-4 py-3">
                <MemoriaDoCalculo :t="t" :calculo="calc" :regra="regraPorId.get(x.entrada.regra)!" :tribunal="tribunal" compacto />
              </div>
            </details>
            <UButton :label="t.casca.itens.prazos" icon="i-lucide-arrow-up-right" color="neutral" variant="ghost" size="sm" class="self-start" @click="emit('ir', 'prazos')" />
          </div>

          <!-- PROPOSTA: a aba Intimações -->
          <div v-else-if="aba === 'intimacoes'" key="intimacoes" class="mx-auto flex max-w-4xl flex-col gap-3 p-5">
            <UEmpty v-if="!intimacoes.length" icon="i-lucide-inbox" :title="tc.processo.vazio" variant="naked" class="py-10" />
            <article
              v-for="(i, n) in intimacoes"
              :key="i.id"
              class="animate-[entrada_.3s_ease-out_both] rounded-lg border border-default p-4"
              :style="{ animationDelay: `${n * 50}ms` }"
            >
              <div class="mb-2 flex flex-wrap items-center gap-2">
                <UBadge :label="tc.caixa.canais[i.meio]" color="neutral" variant="outline" size="sm" />
                <UBadge :label="tc.caixa.tipos[i.tipo]" color="neutral" variant="subtle" size="sm" />
                <UBadge :label="t.intimacoes.filtros[i.status]" :color="corDaIntimacao[i.status]" variant="subtle" size="sm" />
                <span class="ml-auto text-xs tabular-nums text-muted">{{ i.tipo === 'andamento' ? tc.caixa.painel.dataDoMovimento : i.meio === 'djen' ? t.intimacoes.disponibilizada : t.intimacoes.enviada }} {{ dia(i.dia, t.locale) }}</span>
              </div>
              <p class="line-clamp-2 text-sm text-toned">{{ (i.meio === 'domicilio' || i.meio === 'portal') && !i.ciencia ? t.intimacoes.teorFechado : i.teor }}</p>
            </article>
            <UButton :label="t.casca.itens.intimacoes" icon="i-lucide-arrow-up-right" color="neutral" variant="ghost" size="sm" class="self-start" @click="emit('ir', 'intimacoes')" />
          </div>

          <!-- PROPOSTA: a aba Risco e provisão -->
          <div v-else-if="aba === 'provisao'" key="provisao" class="mx-auto flex max-w-4xl flex-col gap-3 p-5">
            <h2 class="text-sm font-semibold text-highlighted">{{ t.processo.porDataBase }}</h2>
            <div class="overflow-hidden rounded-lg border border-default">
              <table class="w-full text-sm">
                <thead class="bg-elevated/40 text-left text-xs text-muted">
                  <tr>
                    <th class="px-4 py-2 font-medium">{{ t.provisao.dataBase }}</th>
                    <th class="px-4 py-2 font-medium">{{ t.provisao.colunas.risco }}</th>
                    <th class="px-4 py-2 text-right font-medium">{{ t.provisao.colunas.estimado }}</th>
                    <th class="px-4 py-2 text-right font-medium">{{ t.provisao.colunas.provisionado }}</th>
                    <th class="px-4 py-2 font-medium">{{ t.provisao.colunas.motivo }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="l in porDataBase" :key="l.dia" class="border-t border-default">
                    <td class="px-4 py-2">
                      <span class="tabular-nums text-highlighted">{{ dia(l.dia, t.locale) }}</span>
                      <UBadge v-if="!l.fechada" :label="t.processo.agora" color="primary" variant="subtle" size="sm" class="ml-1.5" />
                      <UIcon v-else name="i-lucide-lock" class="ml-1.5 size-3 text-dimmed" />
                    </td>
                    <td class="px-4 py-2"><UBadge :label="t.riscos[l.risco]" :color="corDoRisco[l.risco]" variant="subtle" size="sm" /></td>
                    <td class="px-4 py-2 text-right tabular-nums text-toned">{{ dinheiro(l.estimado, t.locale) }}</td>
                    <td class="px-4 py-2 text-right tabular-nums text-highlighted">{{ dinheiro(provisionado(l.risco, l.estimado), t.locale) }}</td>
                    <td class="px-4 py-2 text-xs text-toned">{{ l.motivo }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <UButton :label="t.casca.itens.provisao" icon="i-lucide-arrow-up-right" color="neutral" variant="ghost" size="sm" class="self-start" @click="emit('ir', 'provisao')" />
          </div>

          <div v-else key="fora" class="flex items-center justify-center p-12">
            <UEmpty icon="i-lucide-construction" :title="t.geral.foraDoEscopo" :description="t.geral.foraDoEscopoDesc" variant="naked" />
          </div>
        </Transition>
      </div>

      <!-- Rodapé (cópia do develop) -->
      <div class="flex shrink-0 items-center justify-end gap-2 border-t border-default px-4 py-2">
        <span class="mr-auto text-xs text-dimmed">{{ t.processo.rodape.naoSalvas }}</span>
        <UButton :label="t.processo.rodape.sair" size="xs" color="neutral" variant="outline" disabled />
        <UButton :label="t.processo.rodape.salvar" size="xs" disabled />
      </div>
    </div>
  </div>
</template>
