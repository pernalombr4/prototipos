<script setup lang="ts">
/**
 * A Agenda de um item ou de uma tarefa: o mesmo componente nos 3 lugares (correção da redatora em 24/11/2026, "a
 * agenda da tarefa e do item devem ser exatamente o mesmo componente"):
 *  - a aba Agenda do painel do item, que abre na própria Agenda (decisão 3);
 *  - a pasta Agenda da tela do item (rodada 2);
 *  - a aba Agenda do painel da tarefa.
 *
 * A ordem é a mesma nos 2 alvos:
 *  1. o que a pessoa pode fazer: agendar reunião já ligada, ligar uma reunião existente e a ação própria do alvo
 *     (no item, "Nova tarefa rápida"; na tarefa com SLA, "Reservar tempo"). Sem Outlook, as reuniões ligadas continuam
 *     à vista (vêm do retrato guardado no ENSPACE) e só agendar e ligar pedem a conexão. Sem permissão, uma linha diz
 *     o motivo;
 *  2. as reuniões ligadas, em Próximas e Anteriores, cada uma com quem ligou. No item entram também as das tarefas dele
 *     ("Pela tarefa X"); a cancelada fica riscada; a particular de quem não convidou a pessoa aparece sem o título;
 *  3. no item, as tarefas dele com o prazo e o tempo reservado; na tarefa, o tempo reservado;
 *  4. as datas, cada uma com "Ver na Agenda": no item, os campos de data; na tarefa, o prazo, editável por quem
 *     responde por ela quando não vem do SLA.
 *
 * O que muda entre os 2 é só a lógica: de onde vêm as reuniões, quem pode editar e qual é a ação própria.
 */
import type { Lugar } from '~/components/ux/geometriaDoCalendario'
import type { Textos } from './textos'
import { HOJE, diaCurto, diaNumerico, hora, paraMinutos, somarDias } from './datas'
import { type ReuniaoLigada, blocosDa, colaboro, conflitos, desligar, diaDe, ehMinha, estado, item, ligar, meuBloco, minutoDe, participo, podeEditarItem, removerBloco, reservar, reunioesDoAlvo, reunioesParaLigar, situacao, souParticipante, tarefa, temSla, tituloOculto } from './estado'
import { type Alvo, EU, categoriaPorSlug, pessoaPorId } from './mocks'
import { avisarReuniao } from './avisos'
import AgendarReuniao from './_AgendarReuniao.vue'

const props = defineProps<{ t: Textos, locale: string, alvo: Alvo, naAgenda?: boolean, conectando?: boolean }>()
const emit = defineEmits<{
  abrirEvento: [chave: string]
  abrirTarefa: [id: number]
  irParaDia: [dia: string]
  conectar: []
  agendarNaGrade: [id: number]
  novaTarefa: [id: number]
  mover: [chave: string, lugar: Lugar]
}>()
const toast = useToast()

/* ---------- o alvo: a única parte que difere ---------- */
const ehItem = computed(() => props.alvo.tipo === 'item')
const tf = computed(() => ehItem.value ? null : tarefa(props.alvo.id) ?? null)
const it = computed(() => ehItem.value ? item(props.alvo.id) ?? null : item(tf.value?.item) ?? null)
const referencia = computed(() => ehItem.value ? it.value?.reference ?? '' : tf.value?.reference ?? '')
const feita = computed(() => tf.value?.status === 'completed')
const sla = computed(() => !!tf.value && temSla(tf.value))
const responsavel = computed(() => pessoaPorId(tf.value?.assigned_to))
/** Item: quem pode editar o item. Tarefa: o responsável e os colaboradores, enquanto ela está aberta. */
const editar = computed(() => ehItem.value ? !!it.value && podeEditarItem(it.value) : !!tf.value && participo(tf.value) && !feita.value)
const leitura = computed(() => {
  if (editar.value) return ''
  if (ehItem.value) return props.t.agendaItem.leitura
  return feita.value ? props.t.agendaTarefa.concluida : props.t.agendaTarefa.leitura(responsavel.value?.nome ?? '--')
})
const textos = computed(() => ehItem.value
  ? { semOutlook: props.t.agendaItem.semOutlookTexto, retrato: props.t.agendaItem.retrato, vazio: props.t.painel.semReunioes, vazioTexto: props.t.painel.semReunioesTexto, datas: props.t.painel.datas }
  : { semOutlook: props.t.agendaTarefa.semOutlookTexto, retrato: props.t.agendaTarefa.retrato, vazio: props.t.agendaTarefa.semReunioes, vazioTexto: props.t.agendaTarefa.semReunioesTexto, datas: props.t.agendaTarefa.datas })

const conectado = computed(() => estado.outlook === 'conectado')
const reunioes = computed(() => reunioesDoAlvo(props.alvo))
const grupos = computed(() => [
  { id: 'proximas', titulo: props.t.painel.proximas, lista: reunioes.value.filter(x => x.r.dia >= HOJE) },
  { id: 'anteriores', titulo: props.t.painel.anteriores, lista: reunioes.value.filter(x => x.r.dia < HOJE).reverse() },
].filter(g => g.lista.length))

/* ---------- 1. ações ---------- */
const modo = ref<'botoes' | 'reuniao' | 'reserva'>('botoes')
watch(() => `${props.alvo.tipo}:${props.alvo.id}`, () => (modo.value = 'botoes'))
const opcoesParaLigar = computed(() => reunioesParaLigar(props.alvo).map(r => ({
  label: r.titulo,
  value: r.id,
  suffix: `${r.serie ? `${props.t.modelo.serie} · ` : ''}${diaCurto(r.dia, props.locale)}${r.inicio === undefined ? '' : ` · ${hora(r.inicio)}`}`,
  icon: r.serie ? 'i-lucide-repeat' : r.teams ? 'i-lucide-video' : 'i-lucide-users',
})))
function ligarExistente(id: string) {
  const r = estado.reunioes.find(x => x.id === id)
  if (!r) return
  ligar(r, { tipo: props.alvo.tipo, id: props.alvo.id })
  toast.add({ title: props.t.avisos.ligada(referencia.value), icon: 'i-lucide-link-2', color: 'success' })
}
function desligarDoAlvo(x: ReuniaoLigada) {
  desligar(x.v)
  toast.add({ title: props.t.avisos.desligada, icon: 'i-lucide-unlink', color: 'success' })
}
function criado(c: Parameters<typeof avisarReuniao>[2]) {
  modo.value = 'botoes'
  avisarReuniao(toast, props.t, c)
}
const tituloDaReuniao = computed(() => tf.value ? props.t.agendaTarefa.sobre(tf.value.name) : it.value?.titulo ?? '')

/* Reservar tempo, na tarefa com SLA */
const reserva = reactive({ dia: HOJE, inicio: '14:00', fim: '15:00', outlook: true })
const ocupado = computed(() => conflitos(reserva.dia, paraMinutos(reserva.inicio), paraMinutos(reserva.fim)))
function abrirReserva() {
  const prazo = tf.value?.due_date ? diaDe(tf.value.due_date) : HOJE
  Object.assign(reserva, { dia: prazo > HOJE ? somarDias(prazo, -1) : HOJE, outlook: conectado.value })
  modo.value = 'reserva'
}
function confirmarReserva() {
  if (!tf.value || paraMinutos(reserva.fim) <= paraMinutos(reserva.inicio)) return
  reservar(tf.value.id, reserva.dia, paraMinutos(reserva.inicio), paraMinutos(reserva.fim), reserva.outlook && conectado.value)
  modo.value = 'botoes'
  toast.add({ title: props.t.avisos.reservado, description: tf.value.due_date ? props.t.detalhe.prazoNaoMuda(props.t.quando(diaCurto(diaDe(tf.value.due_date), props.locale), hora(minutoDe(tf.value.due_date)))) : undefined, icon: 'i-lucide-timer', color: 'success' })
}

/* ---------- 3. tarefas do item, ou tempo reservado da tarefa ---------- */
const tarefas = computed(() => ehItem.value ? estado.tarefas.filter(x => x.item === props.alvo.id && x.status !== 'completed') : [])
const blocos = computed(() => tf.value && sla.value ? blocosDa(tf.value.id).filter(meuBloco) : [])

/* ---------- 4. datas ---------- */
const datasDoItem = computed(() => {
  if (!ehItem.value || !it.value) return []
  const i = it.value
  return categoriaPorSlug(i.categoria).campos.filter(c => c.tipo === 'data' && c.chave !== 'created_at' && i.data[c.chave])
})
/** O prazo se edita aqui quando é de quem responde pela tarefa e não vem do SLA. */
const prazoEditavel = computed(() => !!tf.value && ehMinha(tf.value) && !sla.value && !feita.value)
const chaveDaTarefa = computed(() => tf.value ? `${tf.value.origem === 'fluxo' ? 't' : 'q'}:${tf.value.id}` : '')
function mudarPrazo(campo: 'dia' | 'hora', v: string) {
  if (!tf.value || !v) return
  const d = tf.value.due_date
  emit('mover', chaveDaTarefa.value, { dia: campo === 'dia' ? v : (d ? diaDe(d) : HOJE), inicio: campo === 'hora' ? paraMinutos(v) : (d ? minutoDe(d) : 18 * 60) })
}

const quemLigou = (x: ReuniaoLigada) => props.t.modelo.ligadaPor(x.v.por === EU.id ? EU.nome : pessoaPorId(x.v.por)?.nome ?? '--', diaNumerico(x.v.em, props.locale))
/** A reunião que não está na Agenda da pessoa (de outro calendário ou cancelada) não abre na grade. */
const naGrade = (x: ReuniaoLigada) => !!x.r.calendario && !x.r.cancelada
const corDaSituacao = { 'concluida': 'success', 'atrasada': 'error', 'hoje': 'warning', 'no-prazo': 'neutral', 'sem-prazo': 'neutral' } as const
const secao = 'text-xs font-medium uppercase tracking-wide text-muted'
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- 1. O que a pessoa pode fazer aqui -->
    <UAlert
      v-if="!conectado"
      color="neutral"
      variant="subtle"
      icon="i-lucide-calendar-off"
      :title="t.agendaItem.semOutlookTitulo"
      :description="textos.semOutlook"
      :actions="[{ label: t.lateral.conectar, color: 'neutral', variant: 'outline', size: 'xs', loading: conectando, onClick: () => emit('conectar') }]"
    />
    <p v-if="leitura" class="flex gap-2 rounded-md bg-elevated p-2.5 text-xs text-toned">
      <UIcon :name="tf && !feita ? 'i-lucide-user-round' : 'i-lucide-eye'" class="mt-0.5 size-3.5 shrink-0 text-muted" />{{ leitura }}
    </p>
    <template v-else>
      <div v-if="modo === 'botoes'" class="flex flex-wrap items-center gap-2">
        <UButton v-if="conectado" :label="t.painel.agendar" icon="i-lucide-calendar-plus" size="sm" @click="modo = 'reuniao'" />
        <UButton v-if="ehItem" :label="t.modelo.novaTarefa" icon="i-lucide-clipboard-plus" color="neutral" variant="outline" size="sm" @click="emit('novaTarefa', alvo.id)" />
        <UButton v-if="sla" :label="t.agendaTarefa.reservar" icon="i-lucide-timer" color="neutral" variant="outline" size="sm" @click="abrirReserva" />
        <USelectMenu
          v-if="conectado && opcoesParaLigar.length"
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
        v-else-if="modo === 'reuniao'"
        :t="t"
        :item-id="ehItem ? alvo.id : null"
        :tarefa-id="tf?.id"
        :contato-do-item="tf ? it?.id ?? null : undefined"
        :titulo="tituloDaReuniao"
        :na-agenda="naAgenda && ehItem"
        @criado="criado"
        @cancelar="modo = 'botoes'"
        @na-grade="modo = 'botoes'; emit('agendarNaGrade', alvo.id)"
      />
      <form v-else class="flex animate-[entrada_.25s_ease-out_both] flex-col gap-3 rounded-lg border border-default p-3" :aria-label="t.agendaTarefa.reservar" @submit.prevent="confirmarReserva">
        <div class="grid grid-cols-[1fr_6rem_6rem] gap-2">
          <UFormField :label="t.reuniaoForm.dia" size="xs"><UInput v-model="reserva.dia" type="date" size="sm" class="w-full" /></UFormField>
          <UFormField :label="t.detalhe.inicio" size="xs"><UInput v-model="reserva.inicio" type="time" step="900" size="sm" class="w-full" /></UFormField>
          <UFormField :label="t.detalhe.fim" size="xs"><UInput v-model="reserva.fim" type="time" step="900" size="sm" class="w-full" /></UFormField>
        </div>
        <p class="flex items-start gap-1.5 text-xs" :class="ocupado.length ? 'text-warning' : 'text-muted'">
          <UIcon :name="ocupado.length ? 'i-lucide-calendar-x' : 'i-lucide-calendar-check'" class="mt-0.5 size-3.5 shrink-0" />
          {{ ocupado.length ? t.agendaTarefa.conflito(ocupado.join(', ')) : t.agendaTarefa.livre }}
        </p>
        <USwitch v-if="conectado" v-model="reserva.outlook" :label="t.agendaTarefa.noOutlook" :description="t.agendaTarefa.noOutlookTexto" size="sm" />
        <div class="flex justify-end gap-2 border-t border-default pt-3">
          <UButton :label="t.agendaTarefa.cancelar" color="neutral" variant="ghost" size="sm" @click="modo = 'botoes'" />
          <UButton type="submit" :label="t.agendaTarefa.confirmar" icon="i-lucide-timer" size="sm" :disabled="paraMinutos(reserva.fim) <= paraMinutos(reserva.inicio)" />
        </div>
      </form>
      <p v-if="tf && colaboro(tf)" class="-mt-2 flex gap-1.5 text-xs text-muted"><UIcon name="i-lucide-users" class="mt-0.5 size-3.5 shrink-0" />{{ t.modelo.colabora(responsavel?.nome ?? '--') }}</p>
      <p class="-mt-2 flex gap-1.5 text-xs text-muted"><UIcon name="i-lucide-info" class="mt-0.5 size-3.5 shrink-0" />{{ textos.retrato }}</p>
    </template>

    <!-- 2. Reuniões ligadas -->
    <section v-for="g in grupos" :key="g.id" class="flex flex-col gap-1.5">
      <p :class="secao">{{ g.titulo }}</p>
      <div
        v-for="x in g.lista"
        :key="x.r.uid"
        class="flex items-center gap-3 rounded-md border border-default p-2.5 transition-colors"
        :class="[g.id === 'anteriores' && 'opacity-70', naGrade(x) && 'hover:bg-elevated']"
      >
        <component :is="naGrade(x) ? 'button' : 'div'" :type="naGrade(x) ? 'button' : undefined" class="flex min-w-0 flex-1 items-center gap-3 text-left" @click="naGrade(x) && emit('abrirEvento', `r:${x.r.id}`)">
          <span class="flex w-12 shrink-0 flex-col items-center rounded-md py-1" :class="x.r.cancelada ? 'bg-elevated text-muted' : 'bg-info/10 text-info'">
            <span class="text-[10px] uppercase">{{ diaCurto(x.r.dia, locale).split(',')[0] }}</span>
            <span class="text-base font-semibold leading-none">{{ Number(x.r.dia.slice(8)) }}</span>
          </span>
          <span class="min-w-0 flex-1">
            <span class="flex items-center gap-1.5">
              <UIcon v-if="tituloOculto(x.r)" name="i-lucide-lock" class="size-3.5 shrink-0 text-muted" />
              <span class="truncate text-sm font-medium" :class="x.r.cancelada ? 'text-muted line-through' : 'text-highlighted'">{{ tituloOculto(x.r) ? t.modelo.particular : x.r.titulo }}</span>
              <UBadge v-if="x.r.cancelada" :label="t.modelo.cancelada" color="neutral" variant="subtle" size="xs" />
              <UIcon v-if="x.v.serie" name="i-lucide-repeat" class="size-3 shrink-0 text-muted" :aria-label="t.modelo.serie" />
            </span>
            <span class="flex items-center gap-1.5 text-xs text-muted">
              <UIcon :name="x.r.teams ? 'i-lucide-video' : 'i-lucide-map-pin'" class="size-3" />
              {{ x.r.inicio === undefined ? t.detalhe.diaInteiro : t.grade.intervalo(hora(x.r.inicio), hora(x.r.fim ?? x.r.inicio + 60)) }}
              <template v-if="!tituloOculto(x.r)">· {{ t.detalhe.participantes(x.r.participantes.length) }}</template>
            </span>
            <span v-if="x.pela" class="flex items-center gap-1 text-xs text-primary"><UIcon name="i-lucide-flag" class="size-3" />{{ t.modelo.pelaTarefa(x.pela.name) }}</span>
            <span class="block text-[11px] text-dimmed">{{ quemLigou(x) }}</span>
          </span>
        </component>
        <UButton v-if="g.id === 'proximas' && x.r.teams && conectado && souParticipante(x.r) && !x.r.cancelada" :label="t.detalhe.entrar" icon="i-lucide-video" color="info" variant="soft" size="xs" />
        <UTooltip v-if="editar && !x.pela" :text="ehItem ? t.modelo.desligarDoItem : t.agendaTarefa.desligar">
          <UButton icon="i-lucide-unlink" color="neutral" variant="ghost" size="xs" :aria-label="`${ehItem ? t.modelo.desligarDoItem : t.agendaTarefa.desligar}: ${tituloOculto(x.r) ? t.modelo.particular : x.r.titulo}`" @click="desligarDoAlvo(x)" />
        </UTooltip>
      </div>
    </section>
    <UEmpty v-if="!reunioes.length" icon="i-lucide-calendar-x" :title="textos.vazio" :description="textos.vazioTexto" variant="naked" size="sm" />

    <!-- 3a. Tarefas do item -->
    <section v-if="tarefas.length" class="flex flex-col gap-1.5">
      <p :class="secao">{{ t.agendaItem.tarefas }}</p>
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
            <span v-if="temSla(x)">· {{ t.agendaItem.blocos(blocosDa(x.id).filter(meuBloco).length) }}</span>
          </span>
        </span>
        <UBadge :label="t.situacao[situacao(x)]" :color="corDaSituacao[situacao(x)]" variant="soft" size="sm" />
      </button>
    </section>

    <!-- 3b. Tempo reservado da tarefa com SLA -->
    <section v-if="sla" class="flex flex-col gap-1.5">
      <p :class="secao">{{ t.agendaTarefa.tempo }}</p>
      <div v-for="b in blocos" :key="b.id" class="flex items-center gap-3 rounded-md border border-dashed border-primary/50 p-2.5">
        <span class="flex w-12 shrink-0 flex-col items-center rounded-md bg-primary/10 py-1 text-primary">
          <span class="text-[10px] uppercase">{{ diaCurto(b.dia, locale).split(',')[0] }}</span>
          <span class="text-base font-semibold leading-none">{{ Number(b.dia.slice(8)) }}</span>
        </span>
        <span class="min-w-0 flex-1">
          <span class="block text-sm font-medium text-highlighted">{{ t.grade.intervalo(hora(b.inicio), hora(b.fim)) }}</span>
          <span class="flex items-center gap-1.5 text-xs text-muted"><UIcon name="i-lucide-timer" class="size-3" />{{ b.outlook ? t.regras.ocupadoNoOutlook : t.agendaTarefa.soNoEnspace }}</span>
        </span>
        <UTooltip v-if="editar" :text="t.detalhe.removerBloco">
          <UButton icon="i-lucide-trash-2" color="neutral" variant="ghost" size="xs" :aria-label="t.detalhe.removerBloco" @click="removerBloco(b.id)" />
        </UTooltip>
      </div>
      <p v-if="!blocos.length" class="text-xs text-muted">{{ t.agendaTarefa.tempoTexto }}</p>
    </section>

    <!-- 4. Datas -->
    <section v-if="datasDoItem.length || tf" class="flex flex-col gap-1.5">
      <p :class="secao">{{ textos.datas }}</p>
      <p v-for="c in datasDoItem" :key="c.chave" class="flex items-center gap-2 rounded-md bg-elevated py-1 pl-2.5 pr-1 text-sm">
        <span class="flex-1 text-toned">{{ c.rotulo }}</span>
        <span class="tabular-nums text-highlighted">{{ diaNumerico(String(it!.data[c.chave]), locale) }}</span>
        <UTooltip :text="t.agendaItem.verNaAgenda">
          <UButton icon="i-lucide-calendar-search" color="neutral" variant="ghost" size="xs" :aria-label="`${t.agendaItem.verNaAgenda}: ${c.rotulo}`" @click="emit('irParaDia', String(it!.data[c.chave]))" />
        </UTooltip>
      </p>
      <template v-if="tf">
        <div class="flex items-center gap-2 rounded-md bg-elevated py-1 pl-2.5 pr-1 text-sm">
          <span class="flex flex-1 items-center gap-1.5 text-toned">
            {{ t.agendaTarefa.prazo }}
            <UTooltip v-if="sla" :text="t.tarefa.prazoDoSla"><UIcon name="i-lucide-lock" class="size-3.5 text-muted" :aria-label="t.tarefa.prazoDoSla" /></UTooltip>
          </span>
          <template v-if="prazoEditavel">
            <UInput type="date" :model-value="tf.due_date ? diaDe(tf.due_date) : ''" size="xs" class="w-36" :aria-label="t.detalhe.prazo" @change="mudarPrazo('dia', ($event.target as HTMLInputElement).value)" />
            <UInput type="time" step="900" :model-value="tf.due_date ? hora(minutoDe(tf.due_date)) : ''" size="xs" class="w-24" :aria-label="t.detalhe.hora" @change="mudarPrazo('hora', ($event.target as HTMLInputElement).value)" />
          </template>
          <span v-else class="tabular-nums text-highlighted">{{ tf.due_date ? `${diaNumerico(diaDe(tf.due_date), locale)}, ${hora(minutoDe(tf.due_date))}` : t.situacao['sem-prazo'] }}</span>
          <UTooltip v-if="tf.due_date" :text="t.agendaItem.verNaAgenda">
            <UButton icon="i-lucide-calendar-search" color="neutral" variant="ghost" size="xs" :aria-label="`${t.agendaItem.verNaAgenda}: ${t.agendaTarefa.prazo}`" @click="emit('irParaDia', diaDe(tf.due_date))" />
          </UTooltip>
          <span v-else class="size-7 shrink-0" aria-hidden="true" />
        </div>
        <p v-if="!tf.due_date && !feita" class="flex gap-1.5 text-xs text-muted">
          <UIcon name="i-lucide-calendar-plus" class="mt-0.5 size-3.5 shrink-0" />{{ prazoEditavel ? t.agendaTarefa.semPrazoEditavel : t.agendaTarefa.semPrazo }}
        </p>
      </template>
    </section>
  </div>
</template>
