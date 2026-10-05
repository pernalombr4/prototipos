<script setup lang="ts">
/**
 * Tarefas Rápidas. Cópia do develop: a visualização em quadro (EnKanbanBoard)
 * e a barra de busca. A visualização "Lista" é o EnTable, como a lista de
 * tarefas programadas do develop.
 *
 * PROPOSTA:
 *  - "Avisar responsável" no clique direito do cartão e no painel da tarefa;
 *  - na lista, a coluna "Contato" e a barra de seleção "Avisar responsáveis";
 *  - na tarefa de preencher formulário público, o link para mandar.
 */
import type { ContextMenuItem } from '@nuxt/ui'
import type { EnKanbanCardConfig, EnKanbanColumn, EnTableColumn } from '@be-enlighten/enspace-sdk-ui/base'
import type { Textos } from './textos'
import type { Canal } from './estado'
import { HOJE, type MembroDoProtótipo, type TarefaDoProtótipo, itemPorId, membroPorId, tarefas } from './mocks'
import { useComunicacao, useMarcaDeProposta } from './estado'
import { ICONE_DO_CANAL, useAtalhos } from './atalhos'
import AcoesDeContato from './_AcoesDeContato.vue'
import CompartilharFormulario from './_CompartilharFormulario.vue'

const props = defineProps<{ t: Textos }>()

const { abrirItem, formularios, config } = useComunicacao()
const { canaisEm, motivo, abrir } = useAtalhos()
const marca = useMarcaDeProposta()
const idioma = useIdioma()

const vista = ref<'quadro' | 'lista'>('quadro')
const busca = ref('')

const visiveis = computed(() => {
  const q = busca.value.trim().toLowerCase()
  return tarefas.filter(x => !q || x.name.toLowerCase().includes(q))
})

const formatoPrazo = computed(() => new Intl.DateTimeFormat(idioma.value, { day: '2-digit', month: 'short' }))

/** O texto inicial do aviso: nome da tarefa, prazo e item. */
function textosDoAviso(x: TarefaDoProtótipo, m: MembroDoProtótipo | null) {
  if (!config.value.textoInicial) return { assunto: undefined, mensagem: undefined }
  const prazo = x.due_date ? formatoPrazo.value.format(x.due_date) : null
  return {
    assunto: props.t.tarefas.assuntoDoAviso(x.name, prazo),
    mensagem: props.t.tarefas.mensagemDoAviso(m?.nome.split(' ')[0] ?? '', x.name, prazo),
  }
}

/* ---------- painel da tarefa ---------- */

const aberta = ref<TarefaDoProtótipo | null>(null)
const painel = computed({ get: () => !!aberta.value, set: (v) => { if (!v) aberta.value = null } })
const responsavelDaAberta = computed(() => membroPorId(aberta.value?.assigned_to))
const itemDaAberta = computed(() => itemPorId(aberta.value?.item))
const formularioDaAberta = computed(() => {
  const id = aberta.value?.formulario
  return id ? formularios.value.find(f => f.id === id) ?? null : null
})

/* ---------- quadro ---------- */

const corDoStatus = { pending: 'info', working: 'warning', blocked: 'error', completed: 'success' } as const

const colunasDoQuadro = computed<EnKanbanColumn[]>(() =>
  (['pending', 'working', 'blocked', 'completed'] as const).map(s => ({ value: s, label: props.t.status[s], colorScheme: corDoStatus[s] })))

const cartoes = computed(() => visiveis.value.map((x) => {
  const m = membroPorId(x.assigned_to)
  return {
    id: x.id,
    name: x.name,
    description: x.description ?? '',
    status: x.status,
    priority: x.priority,
    created_at: x.created_at.toISOString(),
    due_date: x.due_date?.toISOString() ?? null,
    responsavel: m ? { id: m.id, fullname: m.nome, email: m.email ?? undefined } : null,
  }
}))

const cartao = computed<EnKanbanCardConfig>(() => ({
  header: 'name',
  content: 'description',
  tags: [{
    refId: 'priority',
    name: props.t.tarefas.prioridade,
    options: (['low', 'normal', 'high', 'urgent'] as const).map(p => ({ value: p, label: props.t.prioridade[p], colorScheme: p === 'urgent' ? 'error' : p === 'high' ? 'warning' : p === 'normal' ? 'success' : 'neutral' })),
  }],
  dueDateField: { refId: 'due_date', name: props.t.tarefas.prazo },
  userField: { refId: 'responsavel', name: props.t.tarefas.responsavel },
}))

const tarefaDoMenu = ref<TarefaDoProtótipo | null>(null)

function avisos(x: TarefaDoProtótipo): ContextMenuItem[] {
  const canais = canaisEm('tarefas')
  const m = membroPorId(x.assigned_to)
  if (!canais.length) return []
  const textos = textosDoAviso(x, m)
  return [{
    label: m ? props.t.tarefas.avisar(m.nome) : props.t.tarefas.avisarSemResponsavel,
    icon: 'i-lucide-bell-ring',
    disabled: !m,
    class: marca.value,
    children: canais.map(c => ({
      label: props.t.atalho.canal[c],
      icon: ICONE_DO_CANAL[c],
      description: motivo(c, m) ?? (c === 'email' ? m?.email ?? undefined : m?.telefone ?? undefined),
      disabled: !!motivo(c, m),
      onSelect: () => abrir(c, m, { item: itemPorId(x.item), ...textos }),
    })),
  }]
}

const menuDoCartao = computed<ContextMenuItem[][]>(() => {
  const x = tarefaDoMenu.value
  if (!x) return []
  return [
    [{ type: 'label', label: x.name }],
    [{ label: props.t.tarefas.abrir, icon: 'i-lucide-panel-right-open', onSelect: () => (aberta.value = x) }],
    avisos(x),
  ].filter(g => g.length)
})

/* ---------- lista ---------- */

interface Linha extends Record<string, unknown> {
  id: number
  tarefa: TarefaDoProtótipo
  responsavel: MembroDoProtótipo | null
}

const linhas = computed<Linha[]>(() => visiveis.value.map(x => ({ id: x.id, tarefa: x, responsavel: membroPorId(x.assigned_to) })))
const selecionadas = ref<Linha[]>([])

const colunas = computed<EnTableColumn[]>(() => [
  { key: 'id', label: 'ID' },
  { key: 'nome', label: props.t.tarefas.nome },
  { key: 'prazo', label: props.t.tarefas.prazo },
  { key: 'status', label: props.t.tarefas.status },
  { key: 'responsavel', label: props.t.tarefas.responsavel },
  ...(canaisEm('tarefas').length ? [{ key: 'contato', label: props.t.tarefas.contato }] : []),
])

/** Os responsáveis das tarefas selecionadas, sem repetir. */
const responsaveis = computed(() => {
  const vistos = new Map<number, MembroDoProtótipo>()
  for (const l of selecionadas.value) if (l.responsavel) vistos.set(l.responsavel.id, l.responsavel)
  return [...vistos.values()]
})
const semResponsavel = computed(() => selecionadas.value.filter(l => !l.responsavel).length)

/**
 * WhatsApp e SMS em lote: o wa.me abre 1 número por vez, e o navegador
 * bloqueia várias abas de uma vez. Vira uma fila, como o "Call next lead" do
 * Close e o discador do Apollo: "Conversa 1 de 4", Abrir, Próxima. Quem não
 * tem telefone aparece antes, fora da fila.
 */
const lote = ref<Canal | null>(null)
const indiceDoLote = ref(0)
const abertoNaFila = ref(false)
const naFila = computed(() => responsaveis.value.filter(m => !motivo(lote.value ?? 'whatsapp', m)))
const foraDaFila = computed(() => responsaveis.value.filter(m => motivo(lote.value ?? 'whatsapp', m)))
const atualNaFila = computed(() => naFila.value[indiceDoLote.value] ?? null)

function abrirAtual() {
  const m = atualNaFila.value
  if (!m || !lote.value) return
  const tarefa = selecionadas.value.find(l => l.responsavel?.id === m.id)!.tarefa
  abrir(lote.value, m, textosDoAviso(tarefa, m))
  abertoNaFila.value = true
}

function proxima() {
  indiceDoLote.value++
  abertoNaFila.value = false
}

function avisarEmLote(c: Canal) {
  if (c === 'email') {
    abrir('email', null, { varios: responsaveis.value, assunto: config.value.textoInicial ? props.t.tarefas.assuntoDoLote(selecionadas.value.length) : undefined })
    return
  }
  indiceDoLote.value = 0
  abertoNaFila.value = false
  lote.value = c
}

const loteAberto = computed({ get: () => !!lote.value, set: (v) => { if (!v) lote.value = null } })
</script>

<template>
  <div class="flex flex-col">
    <!-- Abas de visualização (cópia) -->
    <div class="flex items-center gap-1 border-b border-default px-3 py-2">
      <UButton icon="i-lucide-clipboard-check" :label="t.tarefas.titulo" size="sm" :color="vista === 'quadro' ? 'primary' : 'neutral'" :variant="vista === 'quadro' ? 'soft' : 'ghost'" @click="vista = 'quadro'" />
      <UButton icon="i-lucide-list" :label="t.tarefas.lista" size="sm" :color="vista === 'lista' ? 'primary' : 'neutral'" :variant="vista === 'lista' ? 'soft' : 'ghost'" @click="vista = 'lista'" />
      <USeparator orientation="vertical" class="mx-1 h-5" />
      <UButton icon="i-lucide-plus" :label="t.itens.visualizar" size="sm" color="neutral" variant="ghost" />
    </div>

    <!-- Barra (cópia) -->
    <div class="flex flex-wrap items-center gap-3 border-b border-default px-4 py-2.5">
      <UInput v-model="busca" icon="i-lucide-search" :placeholder="t.tarefas.pesquisar" variant="none" size="sm" class="w-56" />
      <span class="flex items-center gap-1.5 text-sm text-muted"><UIcon name="i-lucide-calendar" class="size-4" />{{ t.itens.criadoEm }}</span>
      <span class="flex items-center gap-1.5 text-sm text-muted"><UIcon name="i-lucide-arrow-down-up" class="size-4" />{{ t.itens.todoPeriodo }}</span>
      <div class="ml-auto flex items-center gap-1">
        <UButton icon="i-lucide-file-down" color="neutral" variant="ghost" size="sm" :aria-label="t.itens.exportar" />
        <UButton icon="i-lucide-columns-2" color="neutral" variant="ghost" size="sm" :aria-label="t.itens.colunas" />
        <UButton icon="i-lucide-archive" color="neutral" variant="ghost" size="sm" :aria-label="t.tarefas.arquivadas" />
        <UButton icon="i-lucide-trash-2" color="neutral" variant="ghost" size="sm" :aria-label="t.tarefas.lixeira" />
        <UButton icon="i-lucide-plus" :label="t.tarefas.nova" color="primary" variant="soft" size="sm" class="ml-1" />
      </div>
    </div>
    <p class="border-b border-default px-4 py-2 text-sm text-highlighted">
      {{ t.tarefas.filtrosRapidos }}
    </p>

    <!-- Quadro -->
    <div v-if="vista === 'quadro'" class="animate-[entrada_.25s_ease-out] p-4">
      <p v-if="canaisEm('tarefas').length" class="mb-3 flex items-center gap-1.5 text-xs text-muted" :class="marca">
        <UIcon name="i-lucide-mouse-pointer-click" class="size-3.5" />
        {{ t.tarefas.dicaDoQuadro }}
      </p>
      <ClientOnly>
        <UContextMenu :items="menuDoCartao" :ui="{ content: 'w-64' }">
          <div>
            <EnKanbanBoard
              :data="cartoes"
              :card-map="cartao"
              :columns="colunasDoQuadro"
              group-by="status"
              primary-key="id"
              done-status="completed"
              :stagger-column-ms="60"
              :locale="idioma"
              @card-click="(c) => (aberta = tarefas.find(x => x.id === Number((c as { id: number }).id)) ?? null)"
              @context-mouse="({ data }) => (tarefaDoMenu = tarefas.find(x => x.id === Number((data as { id: number }).id)) ?? null)"
            />
          </div>
        </UContextMenu>
      </ClientOnly>
    </div>

    <!-- Lista -->
    <div v-else class="animate-[entrada_.25s_ease-out]">
      <!-- PROPOSTA: barra de seleção com o aviso em lote -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="-translate-y-1 opacity-0"
        leave-active-class="transition duration-150 ease-in"
        leave-to-class="-translate-y-1 opacity-0"
      >
        <div
          v-if="selecionadas.length && canaisEm('tarefas').length"
          class="mx-4 mt-3 flex flex-wrap items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2"
          :class="marca"
        >
          <span class="text-sm font-semibold text-primary">{{ t.tarefas.selecionadas(selecionadas.length) }}</span>
          <span class="text-sm text-muted">{{ t.tarefas.avisarResponsaveisPor }}</span>
          <UButton
            v-for="c in canaisEm('tarefas')"
            :key="c"
            :icon="ICONE_DO_CANAL[c]"
            :label="t.atalho.canal[c]"
            color="neutral"
            variant="outline"
            size="xs"
            :disabled="!responsaveis.length"
            @click="avisarEmLote(c)"
          />
          <span class="basis-full text-xs text-muted">
            {{ t.tarefas.ajudaDoLote }}<template v-if="semResponsavel"> {{ t.tarefas.foraDoLote(semResponsavel) }}</template>
          </span>
        </div>
      </Transition>

      <EnTable
        v-model:selected="selecionadas"
        :columns="colunas"
        :rows="linhas"
        selectable
        :locale="idioma"
        @row-click="(r) => (aberta = (r as Linha).tarefa)"
      >
        <template #cell-id="{ row }">
          <span class="text-sm text-muted">T-{{ (row as Linha).id }}</span>
        </template>
        <template #cell-nome="{ row }">
          <span class="block max-w-96 truncate text-sm font-medium text-highlighted">{{ (row as Linha).tarefa.name }}</span>
        </template>
        <template #cell-prazo="{ row }">
          <span v-if="(row as Linha).tarefa.due_date" class="text-sm" :class="(row as Linha).tarefa.due_date! < HOJE && (row as Linha).tarefa.status !== 'completed' ? 'text-error' : 'text-toned'">
            {{ formatoPrazo.format((row as Linha).tarefa.due_date!) }}
          </span>
          <span v-else class="text-sm text-dimmed">-</span>
        </template>
        <template #cell-status="{ row }">
          <UBadge :label="t.status[(row as Linha).tarefa.status]" :color="corDoStatus[(row as Linha).tarefa.status]" variant="subtle" size="sm" />
        </template>
        <template #cell-responsavel="{ row }">
          <span v-if="(row as Linha).responsavel" class="flex items-center gap-2">
            <UAvatar :text="(row as Linha).responsavel!.nome.split(' ').map(p => p[0]).join('')" size="2xs" />
            <span class="truncate text-sm">{{ (row as Linha).responsavel!.nome }}</span>
          </span>
          <span v-else class="text-sm text-dimmed">{{ t.tarefas.semResponsavel }}</span>
        </template>
        <template #cell-contato="{ row }">
          <div :class="marca" @click.stop>
            <AcoesDeContato
              :t="t"
              :destino="(row as Linha).responsavel"
              :item="itemPorId((row as Linha).tarefa.item)"
              lugar="tarefas"
              variante="icones"
              tamanho="xs"
              origem="tarefa"
              v-bind="textosDoAviso((row as Linha).tarefa, (row as Linha).responsavel)"
            />
          </div>
        </template>
      </EnTable>
    </div>

    <!-- Painel da tarefa -->
    <USlideover v-model:open="painel" :title="aberta?.name" :description="aberta ? `T-${aberta.id}` : ''" :ui="{ content: 'max-w-lg' }">
      <template #body>
        <div v-if="aberta" class="flex flex-col gap-5">
          <dl class="grid grid-cols-[8rem_1fr] gap-x-4 gap-y-3 text-sm">
            <dt class="text-muted">
              {{ t.tarefas.status }}
            </dt>
            <dd><UBadge :label="t.status[aberta.status]" :color="corDoStatus[aberta.status]" variant="subtle" size="sm" /></dd>
            <dt class="text-muted">
              {{ t.tarefas.prioridade }}
            </dt>
            <dd class="text-highlighted">
              {{ t.prioridade[aberta.priority] }}
            </dd>
            <dt class="text-muted">
              {{ t.tarefas.prazo }}
            </dt>
            <dd class="text-highlighted">
              {{ aberta.due_date ? formatoPrazo.format(aberta.due_date) : '-' }}
            </dd>
            <dt class="text-muted">
              {{ t.tarefas.responsavel }}
            </dt>
            <dd class="text-highlighted">
              {{ responsavelDaAberta?.nome ?? t.tarefas.semResponsavel }}
            </dd>
            <dt class="text-muted">
              {{ t.tarefas.item }}
            </dt>
            <dd>
              <UButton
                v-if="itemDaAberta"
                :label="`${itemDaAberta.reference} · ${itemDaAberta.titulo}`"
                color="neutral"
                variant="link"
                size="sm"
                class="p-0"
                @click="abrirItem(itemDaAberta.id); aberta = null"
              />
              <span v-else class="text-dimmed">-</span>
            </dd>
          </dl>
          <p v-if="aberta.description" class="rounded-md bg-elevated/60 p-3 text-sm text-toned">
            {{ aberta.description }}
          </p>

          <!-- PROPOSTA: avisar o responsável -->
          <section v-if="canaisEm('tarefas').length" :class="marca">
            <h3 class="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
              {{ responsavelDaAberta ? t.tarefas.avisar(responsavelDaAberta.nome) : t.tarefas.avisarSemResponsavel }}
            </h3>
            <AcoesDeContato
              v-if="responsavelDaAberta"
              :t="t"
              :destino="responsavelDaAberta"
              :item="itemDaAberta"
              lugar="tarefas"
              origem="tarefa"
              v-bind="textosDoAviso(aberta, responsavelDaAberta)"
            />
            <p v-else class="text-sm text-muted">
              {{ t.tarefas.semResponsavelDica }}
            </p>
            <p v-if="responsavelDaAberta && !responsavelDaAberta.telefone" class="mt-2 text-xs text-muted">
              {{ t.tarefas.membroSemTelefone }}
            </p>
          </section>

          <!-- PROPOSTA: tarefa de formulário público -->
          <CompartilharFormulario
            v-if="formularioDaAberta?.visibilidade === 'publico' && config.atalhos && config.lugares.formularios"
            :t="t"
            :formulario="formularioDaAberta"
            compacto
          />
        </div>
      </template>
    </USlideover>

    <!-- WhatsApp e SMS em lote: uma fila -->
    <UModal v-model:open="loteAberto" :title="lote ? t.tarefas.loteTitulo(t.atalho.canal[lote]) : ''" :description="t.tarefas.loteDescricao">
      <template #body>
        <div v-if="lote" class="flex flex-col gap-4">
          <UAlert
            v-if="foraDaFila.length"
            icon="i-lucide-user-x"
            color="warning"
            variant="subtle"
            :description="t.tarefas.foraSemTelefone(foraDaFila.map(m => m.nome).join(', '))"
          />

          <template v-if="atualNaFila">
            <div class="flex items-center justify-between text-sm">
              <span class="font-medium text-highlighted">{{ t.tarefas.loteProgresso(indiceDoLote + 1, naFila.length) }}</span>
            </div>
            <UProgress :model-value="indiceDoLote + (abertoNaFila ? 1 : 0)" :max="naFila.length" size="sm" />
            <Transition mode="out-in" enter-active-class="transition duration-200 ease-out" enter-from-class="translate-x-2 opacity-0">
              <div :key="atualNaFila.id" class="flex items-center gap-3 rounded-lg border border-default p-3">
                <UAvatar :text="atualNaFila.nome.split(' ').map(p => p[0]).join('')" size="md" />
                <span class="min-w-0 flex-1">
                  <span class="block truncate text-sm font-medium text-highlighted">{{ atualNaFila.nome }}</span>
                  <span class="block truncate text-xs text-muted">{{ atualNaFila.telefone }}</span>
                </span>
                <UButton
                  :icon="abertoNaFila ? 'i-lucide-check' : ICONE_DO_CANAL[lote]"
                  :label="abertoNaFila ? t.tarefas.aberta : t.tarefas.abrirConversa"
                  :color="abertoNaFila ? 'success' : 'primary'"
                  :variant="abertoNaFila ? 'soft' : 'solid'"
                  size="sm"
                  @click="abrirAtual"
                />
              </div>
            </Transition>
            <div class="flex justify-end">
              <UButton
                v-if="indiceDoLote < naFila.length - 1"
                :label="t.tarefas.proxima"
                trailing-icon="i-lucide-arrow-right"
                color="neutral"
                :variant="abertoNaFila ? 'solid' : 'outline'"
                @click="proxima"
              />
              <span v-else class="flex items-center gap-3">
                <span v-if="abertoNaFila" class="text-sm text-success">{{ t.tarefas.loteConcluido }}</span>
                <UButton :label="t.tarefas.fechar" color="neutral" :variant="abertoNaFila ? 'solid' : 'outline'" @click="loteAberto = false" />
              </span>
            </div>
          </template>
          <UEmpty v-else variant="naked" icon="i-lucide-phone-off" :title="t.atalho.semTelefone" size="sm" />
        </div>
      </template>
    </UModal>
  </div>
</template>
