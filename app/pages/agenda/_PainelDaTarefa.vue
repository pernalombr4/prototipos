<script setup lang="ts">
/**
 * O painel lateral da tarefa. A Agenda abre o mesmo painel da tela de Tarefas.
 *
 * ⚠️ A CASCA NÃO É PROPOSTA. Copiada olhando o develop em 29/10/2026 (Tarefas › Agendadas, workspace de exploração):
 * à esquerda, o trilho de ícones com dica (painel, ID, Tarefa, Referência do item, Nome do Fluxo, Etapa do Fluxo,
 * Status); no alto, as abas Tarefa, Item, Histórico e Comentários; na aba Tarefa, "Detalhes da Tarefa" (Criado em,
 * Vencimento em, Compartilhado com) e "Concluir Etapa" na largura toda; na aba Item, "Detalhes do Item" com "Acessar
 * Item", o ícone de ocultar, Referência, Criado em, Categoria e Formulário. O painel que a Agenda abre hoje é outro
 * (abas Tarefa, Item, Histórico, visto em 28/10): a proposta usa 1 painel só, achado no BRIEFING.
 *
 * O que é proposta (rodada 2):
 *  - aba Agenda, depois de Comentários: o prazo (trancado quando vem do SLA, editável quando não vem), o tempo
 *    reservado com "Reservar tempo" e a opção de ocupar o horário no Outlook, as reuniões do item e "Agendar reunião
 *    sobre a tarefa";
 *  - a ação da aba Tarefa segue a permissão: só o responsável conclui; a tarefa de aprovação tem Aprovar e Reprovar;
 *    a de formulário pede o campo antes do "Concluir Etapa". No develop, o botão desligado "Você não é o responsável
 *    pela tarefa" aparece até para o responsável (achado no BRIEFING); aqui, quem não pode não vê o botão, e uma linha
 *    diz por quê.
 */
import type { Lugar } from '~/components/ux/geometriaDoCalendario'
import type { Textos } from './textos'
import { HOJE, diaCurto, diaLongo, diaNumerico, hora, paraMinutos, somarDias } from './datas'
import { blocosDa, conflitos, diaDe, ehMinha, estado, item, minutoDe, removerBloco, reservar, reunioesDo, tarefa, temSla } from './estado'
import { categoriaPorSlug, pessoaPorId } from './mocks'
import { avisarReuniao } from './avisos'
import AgendarReuniao from './_AgendarReuniao.vue'
import CumprirTarefa from './_CumprirTarefa.vue'

type Aba = 'tarefa' | 'item' | 'historico' | 'comentarios' | 'agenda'
const props = defineProps<{ t: Textos, locale: string, tarefaId: number | null }>()
const aba = defineModel<Aba>('aba', { default: 'tarefa' })
const aberto = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ mover: [chave: string, lugar: Lugar], acessar: [id: number], irParaDia: [dia: string], abrirEvento: [chave: string] }>()
const toast = useToast()

const tf = computed(() => tarefa(props.tarefaId ?? 0) ?? null)
const it = computed(() => item(tf.value?.item))
const cat = computed(() => it.value ? categoriaPorSlug(it.value.categoria) : null)
const minha = computed(() => !!tf.value && ehMinha(tf.value))
const sla = computed(() => !!tf.value && temSla(tf.value))
const chave = computed(() => tf.value ? `${tf.value.origem === 'fluxo' ? 't' : 'q'}:${tf.value.id}` : '')
const responsavel = computed(() => pessoaPorId(tf.value?.assigned_to))
const feita = computed(() => tf.value?.status === 'completed')

const abas = computed(() => (['tarefa', 'item', 'historico', 'comentarios', 'agenda'] as const).map(v => ({
  label: props.t.tarefa.abas[v],
  value: v,
  icon: v === 'agenda' ? 'i-lucide-calendar-days' : undefined,
})))

/** O trilho de ícones do develop: cada ícone mostra o valor na dica. */
const trilho = computed(() => {
  const x = tf.value
  if (!x) return []
  const r = props.t.tarefa.trilho
  return [
    { icone: 'i-lucide-hash', dica: `${r.id}: ${x.reference}` },
    { icone: 'i-lucide-square-check-big', dica: `${r.nome}: ${x.name}` },
    { icone: 'i-lucide-tag', dica: `${r.referencia}: ${it.value?.reference ?? '--'}` },
    { icone: 'i-lucide-workflow', dica: `${r.fluxo}: ${cat.value && x.origem === 'fluxo' ? props.t.tarefa.fluxoDe(cat.value.name) : '--'}` },
    { icone: 'i-lucide-layers', dica: `${r.etapa}: ${x.origem === 'fluxo' ? x.name : '--'}` },
    { icone: 'i-lucide-circle-dot', dica: `${r.status}: ${props.t.tarefa.status[x.status] ?? x.status}` },
  ]
})

const dataHora = (d: Date | null) => d ? `${diaNumerico(diaDe(d), props.locale)}, ${hora(minutoDe(d))}:00` : '--'

watch(() => props.tarefaId, () => { reserva.aberta = false; agendando.value = false })

/* ---------- agenda: prazo, tempo reservado e reuniões ---------- */
function mudarPrazo(campo: 'dia' | 'hora', v: string) {
  if (!tf.value || !v) return
  const d = tf.value.due_date
  emit('mover', chave.value, { dia: campo === 'dia' ? v : (d ? diaDe(d) : HOJE), inicio: campo === 'hora' ? paraMinutos(v) : (d ? minutoDe(d) : 18 * 60) })
}

const reserva = reactive({ aberta: false, dia: HOJE, inicio: '14:00', fim: '15:00', outlook: true })
const ocupado = computed(() => conflitos(reserva.dia, paraMinutos(reserva.inicio), paraMinutos(reserva.fim)))
function abrirReserva() {
  const prazo = tf.value?.due_date ? diaDe(tf.value.due_date) : HOJE
  Object.assign(reserva, { aberta: true, dia: prazo > HOJE ? somarDias(prazo, -1) : HOJE })
}
function confirmarReserva() {
  if (!tf.value || paraMinutos(reserva.fim) <= paraMinutos(reserva.inicio)) return
  reservar(tf.value.id, reserva.dia, paraMinutos(reserva.inicio), paraMinutos(reserva.fim), reserva.outlook)
  reserva.aberta = false
  toast.add({ title: props.t.avisos.reservado, description: tf.value.due_date ? props.t.detalhe.prazoNaoMuda(props.t.quando(diaCurto(diaDe(tf.value.due_date), props.locale), hora(minutoDe(tf.value.due_date)))) : undefined, icon: 'i-lucide-timer', color: 'success' })
}

const agendando = ref(false)
const reunioes = computed(() => it.value ? reunioesDo(it.value.id).filter(r => r.dia >= HOJE) : [])
function criado(c: Parameters<typeof avisarReuniao>[2]) {
  agendando.value = false
  avisarReuniao(toast, props.t, c, it.value?.id ?? null)
}

/* ---------- histórico (recorte) ---------- */
const historico = computed(() => {
  if (!tf.value) return []
  const x = tf.value
  return [
    feita.value && x.completed_at ? { icone: 'i-lucide-circle-check', texto: props.t.tarefa.concluidaPor(pessoaPorId(x.completed_by)?.nome ?? '--', dataHora(x.completed_at)) } : null,
    { icone: 'i-lucide-user-round', texto: props.t.tarefa.atribuida(responsavel.value?.nome ?? '--') },
    { icone: 'i-lucide-plus', texto: props.t.tarefa.criada(pessoaPorId(x.creator)?.nome ?? '--', dataHora(x.created_at)) },
  ].filter(Boolean) as { icone: string, texto: string }[]
})
const rotulo = 'text-sm font-semibold text-highlighted'
</script>

<template>
  <USlideover v-model:open="aberto" :title="tf ? `${tf.reference} - ${tf.name}` : ''" :ui="{ content: 'max-w-lg' }">
    <template #content>
      <div v-if="tf" class="flex h-full min-h-0">
        <!-- Trilho de ícones (cópia) -->
        <nav class="flex w-12 shrink-0 flex-col items-center gap-1 border-r border-default py-3" :aria-label="t.tarefa.trilho.painel">
          <UIcon name="i-lucide-panel-right" class="mb-2 size-5 text-primary" />
          <UTooltip v-for="r in trilho" :key="r.icone" :text="r.dica" :content="{ side: 'right' }">
            <span class="flex size-8 items-center justify-center rounded-md text-toned transition-colors hover:bg-elevated hover:text-highlighted" role="img" :aria-label="r.dica">
              <UIcon :name="r.icone" class="size-4" />
            </span>
          </UTooltip>
        </nav>

        <div class="flex min-w-0 flex-1 flex-col">
          <header class="flex items-start gap-2 px-4 pt-4">
            <h2 class="min-w-0 flex-1 text-base font-semibold text-highlighted">{{ tf.reference }} - {{ tf.name }}</h2>
            <UButton icon="i-lucide-x" color="neutral" variant="ghost" size="sm" :aria-label="t.criacao.cancelar" @click="aberto = false" />
          </header>
          <UTabs v-model="aba" :items="abas" :content="false" variant="link" size="sm" class="w-full px-2" />

          <div class="min-h-0 flex-1 overflow-y-auto p-4">
            <!-- Tarefa (cópia do develop, com a ação pela permissão) -->
            <div v-if="aba === 'tarefa'" class="flex flex-col gap-4">
              <p class="flex items-center justify-between" :class="rotulo">
                {{ t.tarefa.detalhesDaTarefa }}
                <UButton icon="i-lucide-refresh-cw" color="neutral" variant="ghost" size="xs" :aria-label="t.tarefa.atualizar" />
              </p>
              <dl class="flex flex-col gap-2.5 text-sm">
                <div class="flex gap-2"><dt class="text-muted">{{ t.tarefa.criadoEm }}:</dt><dd class="text-highlighted">{{ dataHora(tf.created_at) }}</dd></div>
                <div class="flex items-center gap-2">
                  <dt class="text-muted">{{ t.tarefa.vencimentoEm }}:</dt>
                  <dd class="flex items-center gap-1.5 text-highlighted">{{ dataHora(tf.due_date) }}<UIcon v-if="sla" name="i-lucide-lock" class="size-3.5 text-muted" /></dd>
                </div>
                <div class="flex gap-2"><dt class="text-muted">{{ t.tarefa.compartilhadoCom }}:</dt><dd class="text-highlighted">{{ t.tarefa.ninguem }}</dd></div>
                <div class="flex gap-2"><dt class="text-muted">{{ t.tarefa.responsavel }}:</dt><dd class="break-all text-highlighted">{{ responsavel?.email }}</dd></div>
              </dl>

              <CumprirTarefa :t="t" :tarefa-id="tf.id" class="border-t border-default pt-4" />
            </div>

            <!-- Item (cópia do develop) -->
            <div v-else-if="aba === 'item'" class="flex flex-col gap-4">
              <p :class="rotulo">{{ t.tarefa.detalhesDoItem }}</p>
              <template v-if="it">
                <span class="flex items-center gap-2">
                  <UButton :label="t.tarefa.acessarItem" icon="i-lucide-arrow-up-right" size="sm" @click="emit('acessar', it.id)" />
                  <UButton icon="i-lucide-eye-off" color="neutral" variant="ghost" size="sm" :aria-label="t.tarefa.ocultar" />
                </span>
                <dl class="flex flex-col gap-2.5 text-sm">
                  <div class="flex gap-2"><dt class="text-muted">{{ t.tarefa.referencia }}:</dt><dd class="break-all text-highlighted">{{ it.reference }}</dd></div>
                  <div class="flex gap-2"><dt class="text-muted">{{ t.tarefa.criadoEm }}:</dt><dd class="font-mono text-xs leading-5 text-highlighted">{{ t.tarefa.criadoPor(diaNumerico(String(it.data.created_at), locale), pessoaPorId(it.responsavel)?.nome ?? '--') }}</dd></div>
                  <div class="flex gap-2"><dt class="text-muted">{{ t.tarefa.categoria }}:</dt><dd class="text-highlighted">{{ cat?.name }}</dd></div>
                  <div class="flex gap-2"><dt class="text-muted">{{ t.tarefa.formulario }}:</dt><dd class="text-highlighted">{{ cat?.name }}</dd></div>
                </dl>
              </template>
              <p v-else class="py-6 text-center text-sm text-muted">{{ t.tarefa.semItem }}</p>
            </div>

            <!-- Histórico (recorte) -->
            <ol v-else-if="aba === 'historico'" class="flex flex-col gap-3">
              <li v-for="(h, i) in historico" :key="i" class="flex items-start gap-2 text-sm text-toned">
                <UIcon :name="h.icone" class="mt-0.5 size-4 shrink-0 text-muted" />{{ h.texto }}
              </li>
            </ol>

            <UEmpty v-else-if="aba === 'comentarios'" icon="i-lucide-message-circle" :title="t.tarefa.semComentarios" :description="t.telaItem.foraDaProposta" variant="naked" size="sm" class="mt-8" />

            <!-- Agenda (proposta) -->
            <div v-else class="flex flex-col gap-5">
              <section class="flex flex-col gap-2">
                <p class="text-xs font-medium uppercase tracking-wide text-muted">{{ t.agendaTarefa.prazo }}</p>
                <div v-if="minha && !sla && !feita" class="grid grid-cols-[1fr_7rem] gap-2">
                  <UInput type="date" :model-value="tf.due_date ? diaDe(tf.due_date) : ''" size="sm" :aria-label="t.detalhe.prazo" @change="mudarPrazo('dia', ($event.target as HTMLInputElement).value)" />
                  <UInput type="time" step="900" :model-value="tf.due_date ? hora(minutoDe(tf.due_date)) : ''" size="sm" :aria-label="t.detalhe.hora" @change="mudarPrazo('hora', ($event.target as HTMLInputElement).value)" />
                </div>
                <p v-else class="text-sm text-highlighted first-letter:uppercase">{{ tf.due_date ? t.quando(diaLongo(diaDe(tf.due_date), locale), hora(minutoDe(tf.due_date))) : t.situacao['sem-prazo'] }}</p>
                <p v-if="sla" class="flex gap-2 rounded-md bg-elevated p-2.5 text-xs text-toned"><UIcon name="i-lucide-lock" class="mt-0.5 size-3.5 shrink-0 text-muted" />{{ t.tarefa.prazoDoSla }}</p>
                <p v-if="!minha" class="flex gap-2 text-xs text-muted"><UIcon name="i-lucide-user-round" class="mt-0.5 size-3.5 shrink-0" />{{ t.regras.tarefaDeOutro(responsavel?.nome ?? '--') }}</p>
                <UButton v-if="tf.due_date" :label="t.agendaTarefa.verNaAgenda" icon="i-lucide-calendar-search" color="neutral" variant="outline" size="xs" class="self-start" @click="emit('irParaDia', diaDe(tf.due_date))" />
              </section>

              <section v-if="sla" class="flex flex-col gap-2">
                <p class="text-xs font-medium uppercase tracking-wide text-muted">{{ t.agendaTarefa.tempo }}</p>
                <p class="text-xs text-muted">{{ t.agendaTarefa.tempoTexto }}</p>
                <div v-for="b in blocosDa(tf.id)" :key="b.id" class="flex items-center gap-2 rounded-md border border-dashed border-primary/50 p-2 text-sm">
                  <UIcon name="i-lucide-timer" class="size-4 shrink-0 text-primary" />
                  <span class="min-w-0 flex-1">
                    <span class="block text-highlighted first-letter:uppercase">{{ diaCurto(b.dia, locale) }} · {{ t.grade.intervalo(hora(b.inicio), hora(b.fim)) }}</span>
                    <span v-if="b.outlook" class="block text-xs text-muted">{{ t.regras.ocupadoNoOutlook }}</span>
                  </span>
                  <UButton v-if="minha" icon="i-lucide-trash-2" color="neutral" variant="ghost" size="xs" :aria-label="t.detalhe.removerBloco" @click="removerBloco(b.id)" />
                </div>

                <template v-if="minha && !feita">
                  <UButton v-if="!reserva.aberta" :label="t.agendaTarefa.reservar" icon="i-lucide-timer" color="neutral" variant="outline" size="sm" class="self-start" @click="abrirReserva" />
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
                    <USwitch v-if="estado.outlook === 'conectado'" v-model="reserva.outlook" :label="t.agendaTarefa.noOutlook" :description="t.agendaTarefa.noOutlookTexto" size="sm" />
                    <div class="flex justify-end gap-2 border-t border-default pt-3">
                      <UButton :label="t.agendaTarefa.cancelar" color="neutral" variant="ghost" size="sm" @click="reserva.aberta = false" />
                      <UButton type="submit" :label="t.agendaTarefa.confirmar" icon="i-lucide-timer" size="sm" :disabled="paraMinutos(reserva.fim) <= paraMinutos(reserva.inicio)" />
                    </div>
                  </form>
                </template>
              </section>

              <section v-if="it" class="flex flex-col gap-2">
                <p class="text-xs font-medium uppercase tracking-wide text-muted">{{ t.agendaTarefa.reunioes(it.reference) }}</p>
                <button
                  v-for="r in reunioes"
                  :key="r.id"
                  type="button"
                  class="flex items-center gap-2 rounded-md border border-default p-2 text-left text-sm transition-colors hover:bg-elevated"
                  @click="emit('abrirEvento', `r:${r.id}`)"
                >
                  <UIcon :name="r.teams ? 'i-lucide-video' : 'i-lucide-users'" class="size-4 shrink-0 text-info" />
                  <span class="min-w-0 flex-1 truncate text-highlighted">{{ r.titulo }}</span>
                  <span class="shrink-0 text-xs text-muted first-letter:uppercase">{{ diaCurto(r.dia, locale) }}</span>
                </button>
                <p v-if="!reunioes.length" class="text-xs text-muted">{{ t.painel.semReunioes }}.</p>
              </section>

              <template v-if="estado.outlook === 'conectado' && minha">
                <UButton v-if="!agendando" :label="t.agendaTarefa.agendar" icon="i-lucide-calendar-plus" size="sm" class="self-start" @click="agendando = true" />
                <AgendarReuniao v-else :t="t" :item-id="it?.id ?? null" :titulo="t.agendaTarefa.sobre(tf.name)" @criado="criado" @cancelar="agendando = false" />
              </template>
            </div>
          </div>
        </div>
      </div>
    </template>
  </USlideover>
</template>
