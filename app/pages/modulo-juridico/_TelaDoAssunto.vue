<script setup lang="ts">
/**
 * PROPOSTA (rodada 5): a tela do item da categoria Assuntos, o assunto que agrupa processos.
 *
 * A casca é a mesma tela de item de `_TelaDoProcesso.vue` (cópia do develop, 26/10/2026): painel da esquerda, abas
 * Visão Geral, Comentários, Logs de Auditoria, Tarefas, Anexos, Emails Automáticos, Mail Box, Notas e Campos, e o
 * rodapé. Nada da casca é proposta.
 *
 * O que muda: a Visão Geral mostra os campos de assunto (`matter.*`) e a relação inversa de "Assunto principal", os
 * processos que apontam para este assunto, com a soma do valor da causa e do estimado e o próximo prazo. É o que o ELM
 * americano chama de matter guarda-chuva. No contencioso de massa brasileiro o processo continua sendo o item; o
 * assunto é opcional e só aparece para quem agrupa.
 */
import type { EnTableColumn } from '@be-enlighten/enspace-sdk-ui/base'
import type { Processo, Risco } from './mocks'
import { assuntoPorId, categorias, pessoaPorId, processos, tribunais } from './mocks'
import { calcularPrazo, estado, processosDoAssunto } from './estado'
import type { Textos } from './textos'
import { dia, dinheiro } from './formato'
import { textosAssuntos } from './textos-assuntos'

const props = defineProps<{ t: Textos, assunto: number }>()
const emit = defineEmits<{ abrirProcesso: [number] }>()
const ta = useTextos(textosAssuntos)
const idioma = useIdioma()
const toast = useToast()

const a = computed(() => assuntoPorId.get(props.assunto)!)
const categoria = categorias.find(c => c.id === 'assuntos')!

type Aba = 'visaoGeral' | 'comentarios' | 'logs' | 'tarefas' | 'anexos' | 'emails' | 'mailbox' | 'notas' | 'campos'
const aba = ref<Aba>('visaoGeral')
const abas = computed(() => {
  const x = props.t.processo.abas
  return (['visaoGeral', 'comentarios', 'logs', 'tarefas', 'anexos', 'emails', 'mailbox', 'notas', 'campos'] as Aba[]).map(v => ({ value: v, label: x[v] }))
})

/* ---------- campos de assunto ---------- */
const dados = computed(() => {
  const c = ta.value.assunto.campos
  const d = a.value.data
  return [
    { rotulo: c.tipo, valor: d.tipo },
    { rotulo: c.area, valor: d.area },
    { rotulo: c.responsavel, valor: pessoaPorId.get(d.responsavel)?.nome ?? '' },
    { rotulo: c.areaDaEmpresa, valor: d.areaDaEmpresa },
    { rotulo: c.entidade, valor: d.entidade },
    { rotulo: c.centroDeCusto, valor: d.centroDeCusto },
    { rotulo: c.abertura, valor: dia(d.abertura, props.t.locale) },
  ]
})

/* ---------- a relação inversa: os processos deste assunto ---------- */
const filhos = computed(() => processosDoAssunto(props.assunto))

function proximo(p: Processo) {
  return estado.prazos
    .filter(x => x.processo === p.id && x.status !== 'completed')
    .map(x => calcularPrazo(x).fatal)
    .sort()[0]
}

const resumo = computed(() => ({
  valorDaCausa: filhos.value.reduce((s, p) => s + p.data.valorDaCausa, 0),
  estimado: filhos.value.reduce((s, p) => s + estado.riscos[p.id]!.estimado, 0),
  proximoPrazo: filhos.value.map(proximo).filter(Boolean).sort()[0],
}))

const colunas = computed<EnTableColumn[]>(() => {
  const c = props.t.processo.campos
  return [
    { key: 'reference', label: 'ID' },
    { key: 'titulo', label: props.t.provisao.colunas.processo },
    { key: 'fase', label: c.fase },
    { key: 'risco', label: c.risco },
    { key: 'prazo', label: c.proximoPrazo },
  ]
})
const corDoRisco: Record<Risco, 'error' | 'warning' | 'neutral'> = { provavel: 'error', possivel: 'warning', remota: 'neutral' }

/* ---------- adicionar e tirar ---------- */
const semAssunto = computed(() => processos
  .filter(p => !estado.assuntoPrincipal[p.id])
  .map(p => ({ label: p.titulo, value: p.id, description: `${p.reference} · ${p.data.numeroCnj}` })))

// O menu volta a "Adicionar processo" depois de cada escolha.
const escolhido = ref<number>()
watch(escolhido, (id) => {
  if (!id) return
  adicionar(id)
  nextTick(() => { escolhido.value = undefined })
})

function adicionar(id: number) {
  estado.assuntoPrincipal[id] = props.assunto
  toast.add({ title: ta.value.assunto.toastAdicionado(processos.find(p => p.id === id)!.reference, a.value.titulo), icon: 'i-lucide-briefcase', color: 'success' })
}

function tirar(p: Processo) {
  estado.assuntoPrincipal[p.id] = undefined
  toast.add({ title: ta.value.assunto.toastTirado(p.reference), icon: 'i-lucide-unlink', color: 'neutral' })
}

const formatoCompleto = computed(() => new Intl.DateTimeFormat(props.t.locale, { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }))
</script>

<template>
  <div class="flex min-h-0 flex-1">
    <!-- Painel da esquerda (cópia do develop) -->
    <aside class="hidden w-64 shrink-0 flex-col gap-5 overflow-y-auto border-r border-default p-4 md:flex">
      <div class="flex flex-col items-start gap-2">
        <span class="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <UIcon :name="categoria.icone" class="size-6" />
        </span>
        <p class="text-base font-semibold text-highlighted">{{ a.reference }}</p>
        <p class="text-sm text-toned">{{ a.titulo }}</p>
        <UBadge :label="categoria.nome" color="neutral" variant="outline" size="sm" />
      </div>
      <dl class="flex flex-col gap-4 text-sm">
        <div>
          <dt class="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted">{{ t.processo.painel.identificacao }}</dt>
          <dd class="flex justify-between gap-2"><span class="text-muted">{{ t.processo.painel.id }}</span><span class="font-mono text-xs text-toned">{{ a.id }}</span></dd>
        </div>
        <div>
          <dt class="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted">{{ t.processo.painel.origem }}</dt>
          <dd class="flex justify-between gap-2"><span class="text-muted">{{ t.processo.painel.status }}</span><UBadge :label="t.processo.painel.ativo" color="success" variant="subtle" size="sm" /></dd>
          <dd class="mt-1.5 flex justify-between gap-2"><span class="text-muted">{{ t.processo.painel.solicitante }}</span><span class="truncate text-toned">{{ pessoaPorId.get(a.data.responsavel)?.nome }}</span></dd>
        </div>
        <div>
          <dt class="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted">{{ t.processo.painel.historico }}</dt>
          <dd class="flex justify-between gap-2"><span class="text-muted">{{ t.processo.painel.criado }}</span><span class="text-toned">{{ formatoCompleto.format(a.created_at as Date) }}</span></dd>
          <dd class="mt-1.5 flex justify-between gap-2"><span class="text-muted">{{ t.processo.painel.atualizado }}</span><span class="text-toned">{{ formatoCompleto.format(new Date(2026, 9, 23, 16, 12)) }}</span></dd>
        </div>
      </dl>
    </aside>

    <div class="flex min-w-0 flex-1 flex-col">
      <UTabs v-model="aba" :items="abas" :content="false" variant="link" size="sm" :ui="{ root: 'items-start', list: 'w-max', trigger: 'flex-none' }" class="overflow-x-auto border-b border-default px-4" />

      <div class="min-h-0 flex-1 overflow-y-auto">
        <Transition mode="out-in" enter-active-class="transition-opacity duration-150" enter-from-class="opacity-0" leave-active-class="transition-opacity duration-100" leave-to-class="opacity-0">
          <div v-if="aba === 'visaoGeral'" key="visaoGeral" class="mx-auto flex max-w-5xl flex-col gap-5 p-5">
            <section class="rounded-lg border border-default p-4">
              <h2 class="mb-3 text-sm font-semibold text-highlighted">{{ ta.assunto.dados }}</h2>
              <dl class="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
                <div v-for="d in dados" :key="d.rotulo" class="min-w-0">
                  <dt class="text-xs text-muted">{{ d.rotulo }}</dt>
                  <dd class="truncate text-highlighted">{{ d.valor }}</dd>
                </div>
              </dl>
            </section>

            <!-- PROPOSTA: a relação inversa de "Assunto principal" -->
            <section class="flex flex-col gap-3 rounded-lg border border-default p-4">
              <div class="flex flex-wrap items-start gap-3">
                <div class="min-w-0 flex-1">
                  <h2 class="text-sm font-semibold text-highlighted">{{ ta.assunto.processos }}</h2>
                  <p class="text-xs text-muted">{{ ta.assunto.processosAjuda }}</p>
                </div>
                <USelectMenu
                  v-model="escolhido"
                  :items="semAssunto"
                  value-key="value"
                  :placeholder="ta.assunto.adicionar"
                  :search-input="{ placeholder: ta.assunto.buscar }"
                  icon="i-lucide-plus"
                  size="sm"
                  class="w-56"
                  :ui="{ content: 'min-w-96' }"
                />
              </div>

              <div v-if="filhos.length" class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div class="rounded-md border border-default px-3 py-2">
                  <p class="text-xs text-muted">{{ ta.lista.colunas.processos }}</p>
                  <p class="text-lg font-semibold tabular-nums text-highlighted">{{ ta.assunto.resumo.processos(filhos.length) }}</p>
                </div>
                <div class="rounded-md border border-default px-3 py-2">
                  <p class="text-xs text-muted">{{ ta.assunto.resumo.valorDaCausa }}</p>
                  <p class="text-lg font-semibold tabular-nums text-highlighted">{{ dinheiro(resumo.valorDaCausa, t.locale) }}</p>
                </div>
                <div class="rounded-md border border-default px-3 py-2">
                  <p class="text-xs text-muted">{{ ta.assunto.resumo.estimado }}</p>
                  <p class="text-lg font-semibold tabular-nums text-highlighted">{{ dinheiro(resumo.estimado, t.locale) }}</p>
                </div>
                <div class="rounded-md border border-default px-3 py-2">
                  <p class="text-xs text-muted">{{ ta.assunto.resumo.proximoPrazo }}</p>
                  <p class="flex items-center gap-1.5 text-lg font-semibold tabular-nums text-highlighted">
                    <template v-if="resumo.proximoPrazo">
                      <UIcon name="i-lucide-calculator" class="size-4 text-primary" />{{ dia(resumo.proximoPrazo, t.locale) }}
                    </template>
                    <span v-else class="text-dimmed">-</span>
                  </p>
                </div>
              </div>

              <UEmpty v-if="!filhos.length" icon="i-lucide-briefcase" :title="ta.assunto.vazio" :description="ta.assunto.vazioDesc" variant="naked" class="py-8" />
              <div v-else class="overflow-hidden rounded-md border border-default">
                <EnTable
                  :columns="colunas"
                  :rows="filhos"
                  :pagination="{ page: 1, pageCount: 1, total: filhos.length }"
                  :locale="idioma"
                  class="[&_tbody_tr]:cursor-pointer [&_thead_th:nth-child(2)]:w-2/5"
                  @row-click="(r) => emit('abrirProcesso', (r as Processo).id)"
                >
                  <template #cell-reference="{ row }">
                    <UBadge color="info" variant="subtle" size="sm" class="font-mono text-[11px]">{{ (row as Processo).reference }}</UBadge>
                  </template>
                  <template #cell-titulo="{ row }">
                    <span class="block max-w-80 truncate text-sm text-highlighted" :title="(row as Processo).titulo">{{ (row as Processo).titulo }}</span>
                    <span class="block whitespace-nowrap text-xs text-muted">{{ tribunais[(row as Processo).data.tribunal].sigla }} · <span class="font-mono text-[11px]">{{ (row as Processo).data.numeroCnj }}</span></span>
                  </template>
                  <template #cell-fase="{ row }">
                    <span class="text-sm text-toned">{{ (row as Processo).data.fase }}</span>
                  </template>
                  <template #cell-risco="{ row }">
                    <UBadge :label="t.riscos[estado.riscos[(row as Processo).id]!.risco]" :color="corDoRisco[estado.riscos[(row as Processo).id]!.risco]" variant="subtle" size="sm" />
                  </template>
                  <template #cell-prazo="{ row }">
                    <span v-if="proximo(row as Processo)" class="flex items-center gap-1.5 text-sm tabular-nums text-highlighted">
                      <UIcon name="i-lucide-calculator" class="size-3.5 text-primary" />{{ dia(proximo(row as Processo)!, t.locale) }}
                    </span>
                    <span v-else class="text-sm text-dimmed">-</span>
                  </template>
                  <template #actions="{ row }">
                    <UDropdownMenu
                      :items="[[
                        { label: t.lista.verDetalhes, icon: 'i-lucide-eye', onSelect: () => emit('abrirProcesso', (row as Processo).id) },
                        { label: ta.assunto.tirar, icon: 'i-lucide-unlink', onSelect: () => tirar(row as Processo) },
                      ]]"
                      :content="{ align: 'start' }"
                    >
                      <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost" size="xs" :aria-label="t.lista.acoes" @click.stop />
                    </UDropdownMenu>
                  </template>
                </EnTable>
              </div>
            </section>
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
