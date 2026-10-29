<script setup lang="ts">
/**
 * A Agenda de um item, em 2 lugares com o mesmo conteúdo: a aba Agenda do painel que abre na própria Agenda
 * (decisão 3) e a pasta Agenda da tela do item (rodada 2). É a volta da ligação: a Agenda leva ao item, e o item
 * mostra e cria a agenda dele.
 *
 *  - Outlook: agendar reunião já ligada (com o contato como participante), ligar uma reunião existente, entrar no
 *    Teams e abrir no Outlook. Sem Outlook conectado, as reuniões ligadas continuam à vista (vêm do retrato guardado
 *    no ENSPACE) e só agendar e ligar pedem a conexão;
 *  - tarefas do item com o prazo e o tempo reservado, que abrem o painel da tarefa;
 *  - as datas do item, cada uma com "Ver na Agenda".
 *
 * Sem permissão de editar o item, agendar e ligar não aparecem: uma linha diz o motivo.

 */
import type { Textos } from './textos'
import { HOJE, diaCurto, diaNumerico, hora } from './datas'
import { blocosDa, diaDe, estado, item, ligar, minutoDe, podeEditarItem, reunioesDo, reunioesParaLigar, situacao, souParticipante, temSla } from './estado'
import { categoriaPorSlug } from './mocks'
import { avisarReuniao } from './avisos'
import AgendarReuniao from './_AgendarReuniao.vue'

const props = defineProps<{ t: Textos, locale: string, itemId: number, naAgenda?: boolean, conectando?: boolean }>()
const emit = defineEmits<{ abrirEvento: [chave: string], abrirTarefa: [id: number], irParaDia: [dia: string], conectar: [], agendarNaGrade: [id: number] }>()
const toast = useToast()

const it = computed(() => item(props.itemId)!)
const cat = computed(() => categoriaPorSlug(it.value.categoria))
const conectado = computed(() => estado.outlook === 'conectado')
const editar = computed(() => podeEditarItem(it.value))
const reunioes = computed(() => reunioesDo(props.itemId))
const grupos = computed(() => [
  { id: 'proximas', titulo: props.t.painel.proximas, lista: reunioes.value.filter(r => r.dia >= HOJE) },
  { id: 'anteriores', titulo: props.t.painel.anteriores, lista: reunioes.value.filter(r => r.dia < HOJE).reverse() },
].filter(g => g.lista.length))
const tarefas = computed(() => estado.tarefas.filter(x => x.item === props.itemId && x.status !== 'completed'))
const datas = computed(() => cat.value.campos.filter(c => c.tipo === 'data' && c.chave !== 'created_at' && it.value.data[c.chave]))

const agendando = ref(false)
const opcoesParaLigar = computed(() => reunioesParaLigar.value.map(r => ({
  label: r.titulo,
  value: r.id,
  suffix: `${diaCurto(r.dia, props.locale)}${r.inicio === undefined ? '' : ` · ${hora(r.inicio)}`}`,
  icon: r.teams ? 'i-lucide-video' : 'i-lucide-users',
})))

function ligarExistente(id: string) {
  const r = estado.reunioes.find(x => x.id === id)
  if (!r) return
  ligar(r, props.itemId)
  toast.add({ title: props.t.avisos.ligada(it.value.reference), icon: 'i-lucide-link-2', color: 'success' })
}
function criado(c: Parameters<typeof avisarReuniao>[2]) {
  agendando.value = false
  avisarReuniao(toast, props.t, c, props.itemId)
}
const corDaSituacao = { 'concluida': 'success', 'atrasada': 'error', 'hoje': 'warning', 'no-prazo': 'neutral', 'sem-prazo': 'neutral' } as const
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- O que a pessoa pode fazer aqui -->
    <UAlert
      v-if="!conectado"
      color="neutral"
      variant="subtle"
      icon="i-lucide-calendar-off"
      :title="t.agendaItem.semOutlookTitulo"
      :description="t.agendaItem.semOutlookTexto"
      :actions="[{ label: t.lateral.conectar, color: 'neutral', variant: 'outline', size: 'xs', loading: conectando, onClick: () => emit('conectar') }]"
    />
    <p v-else-if="!editar" class="flex gap-2 rounded-md bg-elevated p-2.5 text-xs text-toned">
      <UIcon name="i-lucide-eye" class="mt-0.5 size-3.5 shrink-0 text-muted" />{{ t.agendaItem.leitura }}
    </p>
    <template v-else>
      <div v-if="!agendando" class="flex flex-wrap items-center gap-2">
        <UButton :label="t.painel.agendar" icon="i-lucide-calendar-plus" size="sm" @click="agendando = true" />
        <USelectMenu
          v-if="opcoesParaLigar.length"
          :model-value="undefined"
          :items="opcoesParaLigar"
          value-key="value"
          size="sm"
          icon="i-lucide-link-2"
          :placeholder="t.agendaItem.ligarExistente"
          :search-input="{ placeholder: t.agendaItem.buscarReuniao }"
          :content="{ align: 'start' }"
          :ui="{ content: 'min-w-80' }"
          class="min-w-52 flex-1"
          @update:model-value="ligarExistente(String($event))"
        />
      </div>
      <AgendarReuniao
        v-else
        :t="t"
        :item-id="itemId"
        :titulo="it.titulo"
        :na-agenda="naAgenda"
        @criado="criado"
        @cancelar="agendando = false"
        @na-grade="agendando = false; emit('agendarNaGrade', itemId)"
      />
      <p class="-mt-2 flex gap-1.5 text-xs text-muted"><UIcon name="i-lucide-info" class="mt-0.5 size-3.5 shrink-0" />{{ t.agendaItem.retrato }}</p>
    </template>

    <!-- Reuniões ligadas -->
    <section v-for="g in grupos" :key="g.id" class="flex flex-col gap-1.5">
      <p class="text-xs font-medium uppercase tracking-wide text-muted">{{ g.titulo }}</p>
      <div
        v-for="r in g.lista"
        :key="r.id"
        class="flex items-center gap-3 rounded-md border border-default p-2.5 transition-colors hover:bg-elevated"
        :class="g.id === 'anteriores' && 'opacity-70'"
      >
        <button type="button" class="flex min-w-0 flex-1 items-center gap-3 text-left" @click="emit('abrirEvento', `r:${r.id}`)">
          <span class="flex w-12 shrink-0 flex-col items-center rounded-md bg-info/10 py-1 text-info">
            <span class="text-[10px] uppercase">{{ diaCurto(r.dia, locale).split(',')[0] }}</span>
            <span class="text-base font-semibold leading-none">{{ Number(r.dia.slice(8)) }}</span>
          </span>
          <span class="min-w-0 flex-1">
            <span class="block truncate text-sm font-medium text-highlighted">{{ r.titulo }}</span>
            <span class="flex items-center gap-1.5 text-xs text-muted">
              <UIcon :name="r.teams ? 'i-lucide-video' : 'i-lucide-map-pin'" class="size-3" />
              {{ r.inicio === undefined ? t.detalhe.diaInteiro : t.grade.intervalo(hora(r.inicio), hora(r.fim ?? r.inicio + 60)) }}
              · {{ t.detalhe.participantes(r.participantes.length) }}
            </span>
          </span>
        </button>
        <UButton v-if="g.id === 'proximas' && r.teams && conectado && souParticipante(r)" :label="t.detalhe.entrar" icon="i-lucide-video" color="info" variant="soft" size="xs" />
      </div>
    </section>
    <UEmpty v-if="!reunioes.length" icon="i-lucide-calendar-x" :title="t.painel.semReunioes" :description="t.painel.semReunioesTexto" variant="naked" size="sm" />

    <!-- Tarefas do item -->
    <section v-if="tarefas.length" class="flex flex-col gap-1.5">
      <p class="text-xs font-medium uppercase tracking-wide text-muted">{{ t.agendaItem.tarefas }}</p>
      <button
        v-for="x in tarefas"
        :key="x.id"
        type="button"
        class="flex items-center gap-2 rounded-md border border-default p-2.5 text-left transition-colors hover:bg-elevated"
        @click="emit('abrirTarefa', x.id)"
      >
        <UIcon :name="x.origem === 'fluxo' ? 'i-lucide-flag' : 'i-lucide-clipboard-check'" class="size-4 shrink-0" :class="x.origem === 'fluxo' ? 'text-primary' : 'text-muted'" />
        <span class="min-w-0 flex-1">
          <span class="block truncate text-sm text-highlighted">{{ x.name }}</span>
          <span class="flex flex-wrap items-center gap-x-1.5 text-xs text-muted">
            <UIcon v-if="temSla(x)" name="i-lucide-lock" class="size-3" />
            <span v-if="x.due_date" class="first-letter:uppercase">{{ t.quando(diaCurto(diaDe(x.due_date), locale), hora(minutoDe(x.due_date))) }}</span>
            <span v-if="temSla(x)">· {{ t.agendaItem.blocos(blocosDa(x.id).length) }}</span>
          </span>
        </span>
        <UBadge :label="t.situacao[situacao(x)]" :color="corDaSituacao[situacao(x)]" variant="soft" size="sm" />
      </button>
    </section>

    <!-- Datas do item -->
    <section v-if="datas.length" class="flex flex-col gap-1.5">
      <p class="text-xs font-medium uppercase tracking-wide text-muted">{{ t.painel.datas }}</p>
      <p v-for="c in datas" :key="c.chave" class="flex items-center gap-2 rounded-md bg-elevated py-1 pl-2.5 pr-1 text-sm">
        <span class="flex-1 text-toned">{{ c.rotulo }}</span>
        <span class="tabular-nums text-highlighted">{{ diaNumerico(String(it.data[c.chave]), locale) }}</span>
        <UTooltip :text="t.agendaItem.verNaAgenda">
          <UButton icon="i-lucide-calendar-search" color="neutral" variant="ghost" size="xs" :aria-label="`${t.agendaItem.verNaAgenda}: ${c.rotulo}`" @click="emit('irParaDia', String(it.data[c.chave]))" />
        </UTooltip>
      </p>
    </section>
  </div>
</template>
