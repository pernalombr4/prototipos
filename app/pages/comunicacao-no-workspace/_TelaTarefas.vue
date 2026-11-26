<script setup lang="ts">
/**
 * Tarefas Rápidas. Cópia do develop: a visualização em quadro (EnKanbanBoard)
 * e a barra de busca. A visualização "Lista" é o EnTable, como a lista de
 * tarefas programadas do develop.
 *
 * PROPOSTA (Fase 1, só tela):
 *  - "E-mail para o responsável" no clique direito do cartão e no painel;
 *  - na lista, a coluna "Contato" e a barra de seleção "E-mail para os
 *    responsáveis";
 *  - no painel, a aba Mail Box com os e-mails do item da tarefa;
 *  - na tarefa de preencher formulário público, o link para mandar.
 *  - WhatsApp (rodada 10) e SMS (rodada 11) ao lado do e-mail: na coluna
 *    Contato, no lote (fila), no clique direito do cartão e no painel.
 * Fase 3: a Mail Box da tarefa separa "Desta tarefa" e "Do item".
 */
import type { ContextMenuItem } from '@nuxt/ui'
import type { EnKanbanCardConfig, EnKanbanColumn, EnTableColumn } from '@be-enlighten/enspace-sdk-ui/base'
import type { Textos } from './textos'
import { HOJE, type MembroDoProtótipo, TIPOS_COM_LINK, type TarefaDoProtótipo, categoriaPorSlug, itemPorId, membroPorId, tarefas } from './mocks'
import { cliqueDireitoNoCartao, ehTelefoneFixo, numeroDoWhatsApp, useComunicacao, useMarcaDeProposta } from './estado'
import { type PessoaDaFila, useAtalhos, useSms, useWhatsApp } from './atalhos'
import AcoesDeContato from './_AcoesDeContato.vue'
import BotaoWhatsApp from './_BotaoWhatsApp.vue'
import BotaoSms from './_BotaoSms.vue'
import FilaDoWhatsApp from './_FilaDoWhatsApp.vue'
import CompartilharFormulario from './_CompartilharFormulario.vue'
import MailBox from './_MailBox.vue'

const props = defineProps<{ t: Textos }>()

const { abrirItem, formularios, fase, tarefaAberta, emails, registrado } = useComunicacao()
const { ativos, itensDeMenu } = useAtalhos()
const { itemDeMenu: itemDeWhatsApp } = useWhatsApp()
const { itemDeMenu: itemDeSms } = useSms()
const marca = useMarcaDeProposta()
const idioma = useIdioma()

const vista = ref<'quadro' | 'lista'>('quadro')
const busca = ref('')

const visiveis = computed(() => {
  const q = busca.value.trim().toLowerCase()
  return tarefas.filter(x => !q || x.name.toLowerCase().includes(q))
})

const formatoPrazo = computed(() => new Intl.DateTimeFormat(idioma.value, { day: '2-digit', month: 'short' }))

/** O assunto e o texto do e-mail: nome da tarefa, prazo e item. A pessoa edita antes de enviar. */
function textosDoAviso(x: TarefaDoProtótipo, m: MembroDoProtótipo | null) {
  const prazo = x.due_date ? formatoPrazo.value.format(x.due_date) : null
  return {
    assunto: props.t.tarefas.assuntoDoAviso(x.name, prazo),
    corpo: props.t.tarefas.mensagemDoAviso(m?.nome.split(' ')[0] ?? '', x.name, prazo),
  }
}

/** O texto pronto do WhatsApp ao responsável: o mesmo texto do e-mail. */
function textoDoWhatsApp(x: TarefaDoProtótipo, m: MembroDoProtótipo | null) {
  return textosDoAviso(x, m).corpo
}

function tarefaDoVinculo(x: TarefaDoProtótipo) {
  return fase.value >= 3 ? x.id : null
}

/* ---------- painel da tarefa ---------- */

const aberta = ref<TarefaDoProtótipo | null>(null)
/** O clique na barra do topo ou no compositor não fecha o painel: o e-mail sai vinculado ao item da tarefa. */
function manterPainel(e: Event) {
  const alvo = e.target as Element | null
  if (alvo?.closest('[data-slot="navbar"], header, [data-compositor]')) e.preventDefault()
}
const painel = computed({ get: () => !!aberta.value, set: (v) => { if (!v) aberta.value = null } })
const abaDoPainel = ref<'detalhes' | 'mailbox'>('detalhes')
const responsavelDaAberta = computed(() => membroPorId(aberta.value?.assigned_to))
const itemDaAberta = computed(() => itemPorId(aberta.value?.item))
const formularioDaAberta = computed(() => {
  const id = aberta.value?.formulario
  return id ? formularios.value.find(f => f.id === id) ?? null : null
})

/** O "Novo e-mail" do topo sabe qual tarefa está aberta. */
watch(aberta, (x) => {
  tarefaAberta.value = x?.id ?? null
  if (!x) abaDoPainel.value = 'detalhes'
})
onBeforeUnmount(() => (tarefaAberta.value = null))

/** E-mails não lidos que a aba Mail Box vai mostrar (o item da tarefa ou, na Fase 3, a tarefa). */
const naoLidosDaAberta = computed(() => {
  const x = aberta.value
  if (!x) return 0
  return emails.value.filter(registrado).filter(e => e.direcao === 'recebido' && !e.lido && (e.itemId === x.item || (fase.value >= 3 && e.tarefaId === x.id))).length
})
const temMailBox = computed(() => !!itemDaAberta.value || fase.value >= 3)

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
  if (!ativos.value) return []
  const m = membroPorId(x.assigned_to)
  return [{
    label: m ? props.t.tarefas.emailPara(m.nome) : props.t.tarefas.semResponsavel,
    icon: 'i-lucide-mail',
    disabled: !m,
    class: marca.value,
    children: m ? itensDeMenu(m, { item: itemPorId(x.item), ...textosDoAviso(x, m), origem: 'tarefa', tarefaId: tarefaDoVinculo(x) }) as ContextMenuItem[] : [],
  }, m
    ? { ...itemDeWhatsApp(m, { texto: textoDoWhatsApp(x, m) }, props.t.whatsapp.para(m.nome)), class: marca.value } as ContextMenuItem
    : { label: props.t.whatsapp.rotulo, icon: 'i-simple-icons-whatsapp', description: props.t.tarefas.semResponsavel, disabled: true, class: marca.value }, m
    ? { ...itemDeSms(m, { texto: textoDoWhatsApp(x, m) }, props.t.sms.para(m.nome)), class: marca.value } as ContextMenuItem
    : { label: props.t.sms.rotulo, icon: 'i-lucide-message-square-text', description: props.t.tarefas.semResponsavel, disabled: true, class: marca.value }]
}

const menuDoCartao = computed<ContextMenuItem[][]>(() => {
  const x = tarefaDoMenu.value
  if (!x) return []
  // Cópia do menu que o cartão já tem no develop (código da develop lido em 25/11/2026): Editar,
  // Duplicar, Mover para, Arquivar, Enviar para Lixeira e Copiar Link Externo. A proposta soma
  // "Abrir a Mail Box" e o e-mail ao responsável.
  return [
    [{ type: 'label', label: x.name }],
    [
      { label: props.t.itens.editar, icon: 'i-lucide-pencil', onSelect: () => (aberta.value = x) },
      { label: props.t.itens.duplicar, icon: 'i-lucide-copy' },
      { label: props.t.itens.moverPara, icon: 'i-lucide-move-right', children: colunasDoQuadro.value.map(c => ({ label: c.label })) },
      { label: props.t.itens.arquivar, icon: 'i-lucide-archive' },
      { label: props.t.itens.enviarParaLixeira, icon: 'i-lucide-trash-2' },
      { label: props.t.itens.copiarLinkExterno, icon: 'i-lucide-link', disabled: true },
    ],
    ...(x.item || fase.value >= 3 ? [[{ label: props.t.tarefas.abrirMailBox, icon: 'i-lucide-inbox', class: marca.value, onSelect: () => { aberta.value = x; abaDoPainel.value = 'mailbox' } }]] : []),
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
  ...(ativos.value ? [{ key: 'contato', label: props.t.tarefas.contato }] : []),
])

/** Os responsáveis das tarefas selecionadas, sem repetir. */
const responsaveis = computed(() => {
  const vistos = new Map<number, MembroDoProtótipo>()
  for (const l of selecionadas.value) if (l.responsavel) vistos.set(l.responsavel.id, l.responsavel)
  return [...vistos.values()]
})
const semResponsavel = computed(() => selecionadas.value.filter(l => !l.responsavel).length)

/** Quantos responsáveis têm telefone válido: é o número do botão. */
const comTelefone = computed(() => responsaveis.value.filter(m => numeroDoWhatsApp(m.telefone)).length)
/** Quantos têm celular (o fixo não recebe SMS): é o número do botão de SMS. */
const comCelular = computed(() => responsaveis.value.filter(m => numeroDoWhatsApp(m.telefone) && !ehTelefoneFixo(m.telefone)).length)

/** WhatsApp ou SMS em lote: a fila, 1 conversa por responsável, com o texto da tarefa dele. */
const filaAberta = ref(false)
const canalDaFila = ref<'whatsapp' | 'sms'>('whatsapp')
function abrirFila(canal: 'whatsapp' | 'sms') {
  if (!(canal === 'sms' ? comCelular.value : comTelefone.value)) return
  canalDaFila.value = canal
  filaAberta.value = true
}
const pessoasDaFila = computed<PessoaDaFila[]>(() => responsaveis.value.map((m) => {
  const tarefa = selecionadas.value.find(l => l.responsavel?.id === m.id)!.tarefa
  return { id: m.id, nome: m.nome, telefone: m.telefone, texto: textoDoWhatsApp(tarefa, m) }
}))
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
      <p v-if="ativos" class="mb-3 flex items-center gap-1.5 text-xs text-muted" :class="marca">
        <UIcon name="i-lucide-mouse-pointer-click" class="size-3.5" />
        {{ t.tarefas.dicaDoQuadro }}
      </p>
      <ClientOnly>
        <UContextMenu :items="menuDoCartao" :ui="{ content: 'w-72' }">
          <div>
            <div @contextmenu.capture="(ev: MouseEvent) => cliqueDireitoNoCartao(ev, texto => tarefas.find(x => texto.includes(x.name)) ?? undefined, x => (tarefaDoMenu = x))">
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
            />
            </div>
          </div>
        </UContextMenu>
      </ClientOnly>
    </div>

    <!-- Lista -->
    <div v-else class="animate-[entrada_.25s_ease-out]">
      <!-- PROPOSTA: barra de seleção com o e-mail em lote -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="-translate-y-1 opacity-0"
        leave-active-class="transition duration-150 ease-in"
        leave-to-class="-translate-y-1 opacity-0"
      >
        <div
          v-if="selecionadas.length && ativos"
          class="mx-4 mt-3 flex flex-wrap items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2"
          :class="marca"
        >
          <span class="text-sm font-semibold text-primary">{{ t.tarefas.selecionadas(selecionadas.length) }}</span>
          <AcoesDeContato
            :t="t"
            :destino="null"
            :varios="responsaveis"
            :assunto="t.tarefas.assuntoDoLote(selecionadas.length)"
            :rotulo="t.tarefas.emailParaResponsaveis(responsaveis.length)"
            tamanho="xs"
            origem="tarefa"
          />
          <!-- Indisponível com aria-disabled: continua no Tab, com o motivo na dica e no nome. -->
          <UTooltip :text="comTelefone ? t.whatsapp.filaDescricao : t.whatsapp.ninguem">
            <UButton
              icon="i-simple-icons-whatsapp"
              :label="t.whatsapp.paraResponsaveis(comTelefone)"
              color="neutral"
              variant="outline"
              size="xs"
              :aria-disabled="comTelefone ? undefined : 'true'"
              :aria-label="comTelefone ? undefined : `${t.whatsapp.paraResponsaveis(0)}: ${t.whatsapp.ninguem}`"
              :class="comTelefone ? '' : 'cursor-not-allowed opacity-50'"
              @click="abrirFila('whatsapp')"
            />
          </UTooltip>
          <UTooltip :text="comCelular ? t.sms.filaDescricao : t.sms.ninguem">
            <UButton
              icon="i-lucide-message-square-text"
              :label="t.sms.paraResponsaveis(comCelular)"
              color="neutral"
              variant="outline"
              size="xs"
              :aria-disabled="comCelular ? undefined : 'true'"
              :aria-label="comCelular ? undefined : `${t.sms.paraResponsaveis(0)}: ${t.sms.ninguem}`"
              :class="comCelular ? '' : 'cursor-not-allowed opacity-50'"
              @click="abrirFila('sms')"
            />
          </UTooltip>
          <span class="basis-full text-xs text-muted">
            {{ semResponsavel ? `${t.tarefas.ajudaDoLote} ${t.tarefas.foraDoLote(semResponsavel)}` : t.tarefas.ajudaDoLote }}
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
          <div class="flex items-center" :class="marca" @click.stop>
            <AcoesDeContato
              :t="t"
              :destino="(row as Linha).responsavel"
              :item="itemPorId((row as Linha).tarefa.item)"
              variante="icone"
              tamanho="xs"
              origem="tarefa"
              :tarefa-id="tarefaDoVinculo((row as Linha).tarefa)"
              :rotulo="(row as Linha).responsavel ? t.tarefas.emailPara((row as Linha).responsavel!.nome) : undefined"
              v-bind="textosDoAviso((row as Linha).tarefa, (row as Linha).responsavel)"
            />
            <BotaoWhatsApp
              :t="t"
              :destino="(row as Linha).responsavel"
              :texto="textoDoWhatsApp((row as Linha).tarefa, (row as Linha).responsavel)"
              variante="icone"
              tamanho="xs"
              :rotulo="(row as Linha).responsavel ? t.whatsapp.para((row as Linha).responsavel!.nome) : undefined"
            />
            <BotaoSms
              :t="t"
              :destino="(row as Linha).responsavel"
              :texto="textoDoWhatsApp((row as Linha).tarefa, (row as Linha).responsavel)"
              variante="icone"
              tamanho="xs"
              :rotulo="(row as Linha).responsavel ? t.sms.para((row as Linha).responsavel!.nome) : undefined"
            />
          </div>
        </template>
      </EnTable>
    </div>

    <!-- Painel da tarefa -->
    <!-- Sem modal: com o painel aberto, a barra do topo ("Novo e-mail") e o compositor continuam clicáveis (RF006, RF124). -->
    <USlideover
      v-model:open="painel"
      :title="aberta?.name"
      :description="aberta ? `T-${aberta.id}` : ''"
      :modal="false"
      :content="{ onInteractOutside: manterPainel }"
      :ui="{ content: 'sm:max-w-2xl' }"
    >
      <template #body>
        <div v-if="aberta" class="flex flex-col gap-4">
          <!-- PROPOSTA: a aba Mail Box ao lado dos detalhes -->
          <UTabs
            v-model="abaDoPainel"
            :items="[
              { value: 'detalhes', label: t.tarefas.detalhes, icon: 'i-lucide-info' },
              { value: 'mailbox', label: t.item.abas.mailbox, icon: 'i-lucide-inbox', badge: naoLidosDaAberta || undefined, class: marca },
            ]"
            :content="false"
            variant="link"
            size="sm"
          />

          <template v-if="abaDoPainel === 'detalhes'">
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

            <!-- PROPOSTA: e-mail para o responsável -->
            <section v-if="ativos" :class="marca">
              <h3 class="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
                {{ t.tarefas.responsavel }}
              </h3>
              <div v-if="responsavelDaAberta" class="flex flex-wrap items-center gap-2">
                <AcoesDeContato
                  :t="t"
                  :destino="responsavelDaAberta"
                  :item="itemDaAberta"
                  origem="tarefa"
                  :tarefa-id="tarefaDoVinculo(aberta)"
                  :rotulo="t.tarefas.emailPara(responsavelDaAberta.nome)"
                  v-bind="textosDoAviso(aberta, responsavelDaAberta)"
                />
                <BotaoWhatsApp
                  :t="t"
                  :destino="responsavelDaAberta"
                  :texto="textoDoWhatsApp(aberta, responsavelDaAberta)"
                  :rotulo="t.whatsapp.para(responsavelDaAberta.nome)"
                />
                <BotaoSms
                  :t="t"
                  :destino="responsavelDaAberta"
                  :texto="textoDoWhatsApp(aberta, responsavelDaAberta)"
                  :rotulo="t.sms.para(responsavelDaAberta.nome)"
                />
              </div>
              <p v-else class="text-sm text-muted">
                {{ t.tarefas.semResponsavelDica }}
              </p>
            </section>

            <!--
              PROPOSTA: tarefa de formulário público. O link público responde o
              formulário fora desta tarefa: cria um item novo na categoria do
              formulário e não conclui a tarefa. Por isso só Criação e Geral, e a
              linha que diz isso.
            -->
            <div v-if="formularioDaAberta && formularioDaAberta.visibilidade === 'publico' && TIPOS_COM_LINK.includes(formularioDaAberta.tipo)">
              <CompartilharFormulario :t="t" :formulario="formularioDaAberta" compacto />
              <p class="mt-1.5 flex items-start gap-1.5 text-xs text-muted" :class="marca">
                <UIcon name="i-lucide-info" class="mt-0.5 size-3.5 shrink-0" />{{ t.tarefas.respostaCriaItem(categoriaPorSlug(formularioDaAberta.categoria).name) }}
              </p>
            </div>
          </template>

          <!-- Mail Box do item da tarefa (Fase 1) ou da tarefa (Fase 3) -->
          <div v-else class="animate-[entrada_.2s_ease-out]">
            <MailBox v-if="temMailBox" :t="t" :item-id="aberta.item" :tarefa="aberta" compacta />
            <UEmpty v-else icon="i-lucide-inbox" :title="t.tarefas.semItemTitulo" :description="t.tarefas.semItemDescricao" variant="naked" size="sm" />
          </div>
        </div>
      </template>
    </USlideover>

    <!-- PROPOSTA: WhatsApp e SMS em lote viram fila (o wa.me e o sms: abrem 1 número por vez) -->
    <FilaDoWhatsApp v-model:open="filaAberta" :t="t" :pessoas="pessoasDaFila" :canal="canalDaFila" />
  </div>
</template>
