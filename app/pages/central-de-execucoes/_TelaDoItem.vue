<script setup lang="ts">
/**
 * A tela do item.
 *
 * Hoje (cópia do develop, 24/10/2026): painel da esquerda com o ícone, a referência, a categoria,
 * Identificação (ID), Origem (Status e o campo de quem pediu) e Histórico (Criado em, Atualizado
 * em); abas Visão Geral, Comentários, Logs de Auditoria, Tarefas, Anexos, Emails Automáticos,
 * Mail Box, Notas e Campos; rodapé "Alterações não salvas", "Sair sem salvar" e "Salvar".
 * Nada mostra os fluxos que rodaram no item.
 *
 * PROPOSTA: a aba Fluxos, depois de Tarefas.
 * - a frase do agora: "Parado no fluxo X, que falhou às 10:12";
 * - os números da jornada: fluxos percorridos, execuções, com erro, esperando e o tempo;
 * - "Só este item" ou "Com a cadeia" (os fluxos que rodaram nos itens que os fluxos dele criaram);
 * - a linha do tempo, agrupada por cadeia, com cada passo recuado pelo nível.
 */
import type { ItemDoMock } from './mocks'
import { categorias, responsavelDaTarefa } from './mocks'
import type { Dados, Fase } from './consultas'
import { cadeiasDaJornada, fluxoPorId, grupoDe, itemPorId, jornadaDoItem, situacaoDoItem } from './consultas'
import type { Textos } from './textos'
import StatusDaExecucao from './_StatusDaExecucao.vue'

const props = defineProps<{
  t: Textos
  item: ItemDoMock
  dados: Dados
  fase: Fase
  hoje?: boolean
}>()

const emit = defineEmits<{ abrirExecucao: [number], abrirItem: [number], verJornada: [number] }>()

type Aba = 'visaoGeral' | 'comentarios' | 'logs' | 'tarefas' | 'fluxos' | 'anexos' | 'emails' | 'mailbox' | 'notas' | 'campos'
const aba = ref<Aba>(props.hoje ? 'visaoGeral' : 'fluxos')
watch(() => props.hoje, (h) => { aba.value = h ? 'visaoGeral' : 'fluxos' })
watch(() => props.item.id, () => { if (!props.hoje) aba.value = 'fluxos' })

const categoria = computed(() => categorias[props.item.categoria])
const abas = computed(() => {
  const a = props.t.itemTela.abas
  const lista: { value: Aba, label: string, icon?: string, badge?: string }[] = [
    { value: 'visaoGeral', label: a.visaoGeral },
    { value: 'comentarios', label: a.comentarios },
    { value: 'logs', label: a.logs },
    { value: 'tarefas', label: a.tarefas },
  ]
  if (!props.hoje) lista.push({ value: 'fluxos', label: a.fluxos, icon: 'i-lucide-workflow', badge: problemaAgora.value ? '!' : undefined })
  lista.push({ value: 'anexos', label: a.anexos }, { value: 'emails', label: a.emails }, { value: 'mailbox', label: a.mailbox }, { value: 'notas', label: a.notas }, { value: 'campos', label: a.campos })
  return lista
})

/* ---------- jornada ---------- */
const comCadeia = ref(true)
watch(() => props.fase, (f) => { if (f === 1) comCadeia.value = false; else comCadeia.value = true }, { immediate: true })
const jornada = computed(() => jornadaDoItem(props.item, props.dados.execucoes, props.fase, comCadeia.value))
const situacao = computed(() => situacaoDoItem(jornada.value))
const problemaAgora = computed(() => situacao.value.tipo === 'erro' || situacao.value.tipo === 'parada')
const cadeias = computed(() => cadeiasDaJornada(jornada.value))

const numerosDaJornada = computed(() => {
  const j = jornada.value
  const inicio = j[0]?.created_at.getTime() ?? 0
  const fim = Math.max(0, ...j.map(e => (e.stopped_at ?? e.created_at).getTime()))
  return [
    { chave: 'fluxos', rotulo: props.t.itemTela.numeros.fluxos, valor: String(new Set(j.map(e => e.workflow)).size) },
    { chave: 'execucoes', rotulo: props.t.itemTela.numeros.execucoes, valor: String(j.length) },
    { chave: 'erro', rotulo: props.t.itemTela.numeros.erro, valor: String(j.filter(e => grupoDe(e) === 'erro' || grupoDe(e) === 'parada').length), alerta: true },
    { chave: 'esperando', rotulo: props.t.itemTela.numeros.esperando, valor: String(j.filter(e => grupoDe(e) === 'esperando').length) },
    { chave: 'tempo', rotulo: props.t.itemTela.numeros.tempo, valor: j.length ? props.t.duracao(fim - inicio) : '' },
  ]
})

const formatoHora = computed(() => new Intl.DateTimeFormat(props.t.locale, { hour: '2-digit', minute: '2-digit' }))
const formatoDia = computed(() => new Intl.DateTimeFormat(props.t.locale, { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }))
const formatoCompleto = computed(() => new Intl.DateTimeFormat(props.t.locale, { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }))

const fraseDoAgora = computed(() => {
  const s = situacao.value
  const a = props.t.itemTela.agora
  const nome = (id: unknown) => fluxoPorId.get(id as number)?.name ?? ''
  if (s.tipo === 'erro') return { icone: 'i-lucide-circle-x', cor: 'error' as const, texto: a.erro(nome(s.e.workflow), formatoHora.value.format(s.e.created_at)), e: s.e }
  if (s.tipo === 'parada') return { icone: 'i-lucide-octagon-x', cor: 'error' as const, texto: a.parada(nome(s.e.workflow), formatoHora.value.format(s.e.created_at)), e: s.e }
  if (s.tipo === 'esperando') return { icone: 'i-lucide-hourglass', cor: 'warning' as const, texto: a.esperando(nome(s.e.workflow), responsavelDaTarefa[s.e.workflow as number] ?? ''), e: s.e }
  if (s.tipo === 'rodando') return { icone: 'i-lucide-loader', cor: 'info' as const, texto: a.rodando(nome(s.e.workflow)), e: s.e }
  if (s.tipo === 'tudoCerto') return { icone: 'i-lucide-circle-check', cor: 'success' as const, texto: a.tudoCerto(formatoHora.value.format(s.fim)) }
  return { icone: 'i-lucide-circle-dashed', cor: 'neutral' as const, texto: a.nenhum }
})

const atualizado = computed(() => new Date(Math.max(props.item.created_at!.getTime(), ...jornada.value.filter(e => e.gravou.some(g => g.item === props.item.id)).map(e => (e.stopped_at ?? e.created_at).getTime()))))
const corDaFrase = { error: 'border-error/40 bg-error/5', warning: 'border-warning/40 bg-warning/5', info: 'border-info/40 bg-info/5', success: 'border-success/40 bg-success/5', neutral: 'border-default bg-elevated/40' } as const
const corDoIcone = { error: 'text-error', warning: 'text-warning', info: 'text-info', success: 'text-success', neutral: 'text-muted' } as const
</script>

<template>
  <div class="flex min-h-0 flex-1">
    <!-- Painel da esquerda (cópia do develop) -->
    <aside class="hidden w-64 shrink-0 flex-col gap-5 overflow-y-auto border-r border-default p-4 md:flex">
      <div class="flex flex-col items-start gap-2">
        <span class="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <UIcon :name="categoria.icone" class="size-6" />
        </span>
        <p class="text-base font-semibold text-highlighted">{{ item.reference }}</p>
        <p class="text-sm text-toned">{{ item.titulo }}</p>
        <UBadge :label="categoria.nome" color="neutral" variant="outline" size="sm" />
      </div>
      <dl class="flex flex-col gap-4 text-sm">
        <div>
          <dt class="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted">{{ t.itemTela.painel.identificacao }}</dt>
          <dd class="flex justify-between gap-2"><span class="text-muted">{{ t.itemTela.painel.id }}</span><span class="font-mono text-xs text-toned">{{ item.id }}</span></dd>
        </div>
        <div>
          <dt class="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted">{{ t.itemTela.painel.origem }}</dt>
          <dd class="flex justify-between gap-2"><span class="text-muted">{{ t.itemTela.painel.status }}</span><UBadge :label="t.itemTela.painel.ativo" color="success" variant="subtle" size="sm" /></dd>
          <dd class="mt-1.5 flex justify-between gap-2">
            <span class="text-muted">{{ t.itemTela.painel.solicitante }}</span>
            <span class="truncate text-toned">{{ item.criado_por_pessoa ?? (item.criado_por_execucao ? fluxoPorId.get(dados.execucoes.find(e => e.id === item.criado_por_execucao)?.workflow as number)?.name : '') }}</span>
          </dd>
        </div>
        <div>
          <dt class="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted">{{ t.itemTela.painel.historico }}</dt>
          <dd class="flex justify-between gap-2"><span class="text-muted">{{ t.itemTela.painel.criado }}</span><span class="text-toned">{{ formatoCompleto.format(item.created_at!) }}</span></dd>
          <dd class="mt-1.5 flex justify-between gap-2"><span class="text-muted">{{ t.itemTela.painel.atualizado }}</span><span class="text-toned">{{ formatoCompleto.format(atualizado) }}</span></dd>
        </div>
      </dl>
    </aside>

    <div class="flex min-w-0 flex-1 flex-col">
      <UTabs v-model="aba" :items="abas" :content="false" variant="link" size="sm" class="overflow-x-auto border-b border-default px-4" />

      <div class="min-h-0 flex-1 overflow-y-auto">
        <Transition mode="out-in" enter-active-class="transition-opacity duration-150" enter-from-class="opacity-0" leave-active-class="transition-opacity duration-100" leave-to-class="opacity-0">
          <!-- PROPOSTA: a aba Fluxos -->
          <div v-if="aba === 'fluxos'" key="fluxos" class="mx-auto flex max-w-5xl flex-col gap-4 p-5">
            <!-- O agora -->
            <div class="flex flex-wrap items-center gap-3 rounded-lg border p-4" :class="corDaFrase[fraseDoAgora.cor]">
              <UIcon :name="fraseDoAgora.icone" class="size-5 shrink-0" :class="[corDoIcone[fraseDoAgora.cor], fraseDoAgora.cor === 'info' && 'animate-spin [animation-duration:2.4s] motion-reduce:animate-none']" />
              <div class="min-w-0 flex-1">
                <p class="text-xs font-medium text-muted">{{ t.itemTela.agora.rotulo }}</p>
                <p class="text-sm font-medium text-highlighted">{{ fraseDoAgora.texto }}</p>
              </div>
              <UButton v-if="fraseDoAgora.e" :label="t.mapa.abrirExecucao" icon="i-lucide-arrow-up-right" size="xs" color="neutral" variant="outline" @click="emit('abrirExecucao', fraseDoAgora.e!.id)" />
              <UButton v-if="jornada.length" :label="t.busca.verJornada" icon="i-lucide-map" size="xs" color="neutral" variant="ghost" @click="emit('verJornada', item.id)" />
            </div>

            <!-- Os números -->
            <dl class="grid grid-cols-2 gap-3 sm:grid-cols-5">
              <div v-for="(n, i) in numerosDaJornada" :key="n.chave" class="animate-[entrada_.3s_ease-out_both] rounded-lg border border-default p-3" :style="{ animationDelay: `${i * 40}ms` }">
                <dt class="text-xs text-muted">{{ n.rotulo }}</dt>
                <dd class="mt-0.5 text-xl font-semibold tabular-nums" :class="n.alerta && n.valor !== '0' ? 'text-error' : 'text-highlighted'">{{ n.valor }}</dd>
              </div>
            </dl>

            <!-- Escopo -->
            <div v-if="fase === 2" class="flex flex-wrap items-center gap-3">
              <div class="inline-flex rounded-md border border-default p-0.5" role="radiogroup">
                <UButton
                  v-for="op in [{ v: false, l: t.itemTela.escopo.esteItem }, { v: true, l: t.itemTela.escopo.comCadeia }]"
                  :key="String(op.v)"
                  :label="op.l"
                  size="xs"
                  :color="comCadeia === op.v ? 'primary' : 'neutral'"
                  :variant="comCadeia === op.v ? 'soft' : 'ghost'"
                  role="radio"
                  :aria-checked="comCadeia === op.v"
                  @click="comCadeia = op.v"
                />
              </div>
              <p class="min-w-0 flex-1 text-xs text-muted">{{ t.itemTela.escopoAjuda }}</p>
            </div>
            <p v-else class="flex items-center gap-1.5 text-xs text-muted">
              <UIcon name="i-lucide-info" class="size-3.5" />{{ t.busca.soDireto }}
            </p>

            <!-- A linha do tempo, por cadeia -->
            <UEmpty v-if="!jornada.length" icon="i-lucide-workflow" :title="t.itemTela.vazio" :description="t.itemTela.vazioDesc" variant="naked" class="py-10" />
            <section v-for="(c, ci) in cadeias" v-else :key="c.origem" class="animate-[entrada_.3s_ease-out_both] overflow-hidden rounded-lg border border-default" :style="{ animationDelay: `${ci * 60}ms` }">
              <header class="flex flex-wrap items-center gap-2 border-b border-default bg-elevated/40 px-4 py-2 text-xs text-muted">
                <UIcon name="i-lucide-git-fork" class="size-3.5" />
                <span class="font-medium text-toned">{{ t.itemTela.cadeiaIniciada(formatoDia.format(c.inicio)) }}</span>
                <span>· {{ t.itemTela.execucoesNaCadeia(c.passos.length) }}</span>
              </header>
              <ol>
                <li
                  v-for="e in c.passos"
                  :key="e.id"
                  class="grid grid-cols-[3.5rem_minmax(0,1fr)_auto] items-center gap-3 border-b border-default px-4 py-2 transition-colors last:border-b-0 hover:bg-elevated/40"
                >
                  <span class="text-xs tabular-nums text-muted">{{ formatoHora.format(e.created_at) }}</span>
                  <span class="flex min-w-0 items-start gap-2" :style="{ paddingLeft: `${fase === 2 ? Math.min(e.input.workflow_timeline.lineage.length - Math.min(...c.passos.map(x => x.input.workflow_timeline.lineage.length)), 8) * 14 : 0}px` }">
                    <UIcon :name="e.input.workflow_timeline.lineage.length && fase === 2 ? 'i-lucide-corner-down-right' : 'i-lucide-circle-dot'" class="mt-0.5 size-3.5 shrink-0 text-dimmed" />
                    <span class="min-w-0">
                      <span class="block truncate text-sm text-highlighted">{{ fluxoPorId.get(e.workflow as number)?.name }}</span>
                      <span class="block truncate text-xs text-muted">
                        <template v-if="e.item === item.id">{{ t.nesteItem }}</template>
                        <button v-else-if="e.item" type="button" class="underline-offset-2 hover:text-highlighted hover:underline" @click="emit('abrirItem', e.item!)">
                          {{ t.noItem(categorias[itemPorId.get(e.item)!.categoria], itemPorId.get(e.item)!.reference ?? '') }}
                        </button>
                      </span>
                    </span>
                  </span>
                  <span class="flex items-center gap-2">
                    <StatusDaExecucao :e="e" :t="t" />
                    <UButton icon="i-lucide-arrow-up-right" size="xs" color="neutral" variant="ghost" :aria-label="t.itemTela.abrir" @click="emit('abrirExecucao', e.id)" />
                  </span>
                </li>
              </ol>
            </section>
          </div>

          <div v-else key="fora" class="flex items-center justify-center p-12">
            <UEmpty icon="i-lucide-construction" :title="t.detalhe.foraDoEscopo" :description="t.itemTela.foraDoEscopo" variant="naked" />
          </div>
        </Transition>
      </div>

      <!-- Rodapé (cópia do develop) -->
      <div class="flex shrink-0 items-center justify-end gap-2 border-t border-default px-4 py-2">
        <span class="mr-auto text-xs text-dimmed">{{ t.itemTela.rodape.naoSalvas }}</span>
        <UButton :label="t.itemTela.rodape.sair" size="xs" color="neutral" variant="outline" disabled />
        <UButton :label="t.itemTela.rodape.salvar" size="xs" disabled />
      </div>
    </div>
  </div>
</template>
