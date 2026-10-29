<script setup lang="ts">
/**
 * O conteúdo do popover que abre junto do evento (padrão do Google, do Outlook e do ClickUp, visto em tela). Muda
 * por fonte: reunião do Outlook, prazo de tarefa, tarefa rápida, tempo reservado e data de item. Os campos de data e
 * hora são a alternativa de teclado ao arraste e passam pela mesma regra (`aplicar`).
 *
 * Rodada 2: o popover só oferece o que a pessoa pode fazer, e diz o motivo numa linha quando tira algo. Reunião de
 * outra pessoa não muda de horário e ganha a resposta ao convite; evento particular não se liga a item; item só para
 * leitura não muda de data; data com fluxo avisa que o fluxo roda; tarefa de outra pessoa não conclui nem muda de
 * prazo; tarefa de aprovação ou formulário leva ao painel da tarefa.
 */
import type { Lugar } from '~/components/ux/geometriaDoCalendario'
import { fundoCheio, textoDaCor } from '~/components/ux/geometriaDoCalendario'
import type { Textos } from './textos'
import { AGORA, HOJE, diaCurto, diaLongo, duracao, hora, paraMinutos } from './datas'
import { CORES_DO_OUTLOOK, bloco, estado, blocosDa, concluir, diaDe, ehMinha, ehOrganizador, fluxoDoCampo, fonte, item, ligar, minutoDe, organizador, podeConcluir, podeEditarItem, removerBloco, responder, reuniao, situacao, souParticipante, sugestao, tarefa, temSla } from './estado'
import { EU, categoriaPorSlug, pessoaPorId } from './mocks'

const props = defineProps<{ t: Textos, locale: string, chave: string }>()
const emit = defineEmits<{ fechar: [], mover: [chave: string, lugar: Lugar], abrirItem: [id: number, aba: 'item' | 'tarefas' | 'agenda'], abrirTarefa: [id: number] }>()
const toast = useToast()

const tipo = computed(() => props.chave.slice(0, 1))
const id = computed(() => props.chave.slice(2))
const r = computed(() => tipo.value === 'r' ? reuniao(id.value) ?? null : null)
const b = computed(() => tipo.value === 'b' ? bloco(id.value) ?? null : null)
const tf = computed(() => tipo.value === 't' || tipo.value === 'q' ? tarefa(Number(id.value)) ?? null : b.value ? tarefa(b.value.tarefaId) ?? null : null)
const it = computed(() => tipo.value === 'i' ? item(Number(id.value)) : item(r.value?.itemId ?? tf.value?.item))
const sugerido = computed(() => {
  const x = r.value ? sugestao(r.value) : null
  return x && podeEditarItem(x) ? x : null
})
/** O que a pessoa pode mexer neste evento. */
const pode = computed(() => {
  if (r.value) return ehOrganizador(r.value)
  if (tf.value) return ehMinha(tf.value)
  if (tipo.value === 'i' && it.value) return podeEditarItem(it.value)
  return false
})
const fluxo = computed(() => tipo.value === 'i' && it.value ? fluxoDoCampo(it.value) : null)
const minhaResposta = computed(() => r.value?.participantes.find(p => p.email === EU.email)?.resposta)
const respostas = ['sim', 'talvez', 'nao'] as const

const cor = computed(() => {
  if (r.value) return CORES_DO_OUTLOOK[r.value.calendario]
  if (tipo.value === 'i' && it.value) return fonte(it.value.categoria)!.cor
  return tipo.value === 'q' ? 'neutral' : 'primary'
})
const titulo = computed(() => r.value?.titulo ?? tf.value?.name ?? (it.value ? `${it.value.reference} · ${it.value.titulo}` : ''))
const icone = computed(() => r.value ? (r.value.teams ? 'i-lucide-video' : 'i-lucide-users') : b.value ? 'i-lucide-timer' : tipo.value === 't' ? 'i-lucide-flag' : tipo.value === 'q' ? 'i-lucide-clipboard-check' : categoriaPorSlug(it.value!.categoria).icon!)

/** O lugar atual, que os campos editam. Tarefa com SLA não tem: o prazo não se mexe. */
const atual = computed<Lugar | null>(() => {
  if (!pode.value) return null
  if (r.value) return { dia: r.value.dia, inicio: r.value.inicio, fim: r.value.fim }
  if (b.value) return { dia: b.value.dia, inicio: b.value.inicio, fim: b.value.fim }
  if (tf.value) return temSla(tf.value) ? null : { dia: tf.value.due_date ? diaDe(tf.value.due_date) : HOJE, inicio: tf.value.due_date ? minutoDe(tf.value.due_date) : 18 * 60 }
  if (it.value) {
    const f = fonte(it.value.categoria)!
    const ini = f.horaInicio ? it.value.data[f.horaInicio] as number | undefined : undefined
    return { dia: String(it.value.data[f.campo]), inicio: ini, fim: ini === undefined ? undefined : (f.horaFim ? it.value.data[f.horaFim] as number : ini + 60) }
  }
  return null
})

const quando = computed(() => {
  const l = atual.value
  if (tf.value && (tipo.value === 't' || tipo.value === 'q')) {
    return tf.value.due_date ? props.t.detalhe.vence(props.t.quando(diaLongo(diaDe(tf.value.due_date), props.locale), hora(minutoDe(tf.value.due_date)))) : props.t.situacao['sem-prazo']
  }
  if (!l) return ''
  const dia = diaLongo(l.dia, props.locale)
  if (l.inicio === undefined) return `${dia} · ${props.t.detalhe.diaInteiro}`
  const fim = l.fim ?? l.inicio + 60
  return `${dia} · ${props.t.grade.intervalo(hora(l.inicio), hora(fim))} (${duracao(fim - l.inicio, props.t.detalhe.h, props.t.detalhe.min)})`
})

function mudar(campo: 'dia' | 'inicio' | 'fim', valor: string) {
  const l = atual.value
  if (!l || !valor) return
  const novo: Lugar = { ...l }
  if (campo === 'dia') novo.dia = valor
  else novo[campo] = paraMinutos(valor)
  if (campo === 'inicio' && l.inicio !== undefined && l.fim !== undefined) novo.fim = novo.inicio! + (l.fim - l.inicio)
  if (novo.fim !== undefined && novo.inicio !== undefined && novo.fim <= novo.inicio) return
  emit('mover', props.chave, novo)
}

/* ---------- reunião ---------- */
const todos = ref(false)
const participantes = computed(() => r.value ? (todos.value ? r.value.participantes : r.value.participantes.slice(0, 4)) : [])
const iconeDaResposta = { sim: 'i-lucide-circle-check', nao: 'i-lucide-circle-x', talvez: 'i-lucide-circle-help', pendente: 'i-lucide-circle-dashed' }
const corDaResposta = { sim: 'text-success', nao: 'text-error', talvez: 'text-warning', pendente: 'text-dimmed' }
const opcoesDeItem = computed(() => estado.itens.filter(podeEditarItem).map(i => ({ label: `${i.reference} · ${i.titulo}`, value: i.id, icon: categoriaPorSlug(i.categoria).icon ?? undefined })))

function vincular(itemId: number | null) {
  if (!r.value) return
  const ref = item(itemId)?.reference
  ligar(r.value, itemId)
  toast.add({ title: ref ? props.t.avisos.ligada(ref) : props.t.avisos.desligada, icon: 'i-lucide-link-2', color: 'success' })
}

/* ---------- tarefa ---------- */
const s = computed(() => tf.value ? situacao(tf.value) : null)
const corDaSituacao = { 'concluida': 'success', 'atrasada': 'error', 'hoje': 'warning', 'no-prazo': 'neutral', 'sem-prazo': 'neutral' } as const
function alternarConclusao() {
  if (!tf.value) return
  concluir(tf.value)
  toast.add({ title: tf.value.status === 'completed' ? props.t.avisos.concluida : props.t.avisos.reaberta, icon: 'i-lucide-circle-check', color: 'success' })
}
function reservar() {
  const inicio = Math.max(Math.ceil(AGORA / 60) * 60, 8 * 60)
  emit('mover', props.chave, { dia: HOJE, inicio, fim: inicio + 60 })
}
function tirarBloco() {
  removerBloco(b.value!.id)
  toast.add({ title: props.t.avisos.blocoRemovido, icon: 'i-lucide-timer-off' })
  emit('fechar')
}
</script>

<template>
  <div class="flex w-[22rem] max-w-[calc(100vw-2rem)] flex-col gap-3 p-4" role="dialog" :aria-label="titulo">
    <!-- Cabeçalho -->
    <div class="flex items-start gap-2.5">
      <span class="mt-1 flex size-6 shrink-0 items-center justify-center rounded-md" :class="[fundoCheio[cor], textoDaCor[cor]]">
        <UIcon :name="icone" class="size-3.5" />
      </span>
      <div class="min-w-0 flex-1">
        <p class="text-sm font-semibold text-highlighted" :class="s === 'concluida' && 'line-through'">{{ titulo }}</p>
        <p class="mt-0.5 text-xs text-muted first-letter:uppercase">{{ quando }}</p>
      </div>
      <UButton icon="i-lucide-x" color="neutral" variant="ghost" size="xs" :aria-label="t.detalhe.fechar" @click="emit('fechar')" />
    </div>

    <!-- Situação da tarefa -->
    <div v-if="tf && (tipo === 't' || tipo === 'q')" class="flex flex-wrap items-center gap-2">
      <UBadge :label="t.situacao[s!]" :color="corDaSituacao[s!]" variant="soft" size="sm" />
      <span v-if="pessoaPorId(tf.assigned_to)" class="flex items-center gap-1.5 text-xs text-muted">
        <UAvatar :text="pessoaPorId(tf.assigned_to)!.iniciais" size="3xs" />{{ pessoaPorId(tf.assigned_to)!.nome }}
      </span>
    </div>

    <!-- O que a pessoa não pode fazer nesta tarefa, e por quê -->
    <template v-if="tf">
      <p v-if="!ehMinha(tf)" class="flex gap-2 rounded-md bg-elevated p-2.5 text-xs text-toned">
        <UIcon name="i-lucide-user-round" class="mt-0.5 size-3.5 shrink-0 text-muted" />{{ t.regras.tarefaDeOutro(pessoaPorId(tf.assigned_to)?.nome ?? '--') }}
      </p>
      <p v-else-if="tf.acao && tf.status !== 'completed'" class="flex gap-2 rounded-md bg-elevated p-2.5 text-xs text-toned">
        <UIcon :name="tf.acao === 'aprovar' ? 'i-lucide-stamp' : 'i-lucide-clipboard-list'" class="mt-0.5 size-3.5 shrink-0 text-muted" />{{ tf.acao === 'aprovar' ? t.regras.pedeAprovacao : t.regras.pedeFormulario }}
      </p>
    </template>

    <!-- Tarefa com SLA: o prazo fica; o que se agenda é o tempo para fazer -->
    <template v-if="tipo === 't' && tf && temSla(tf)">
      <p class="flex gap-2 rounded-md bg-elevated p-2.5 text-xs text-toned">
        <UIcon name="i-lucide-lock" class="mt-0.5 size-3.5 shrink-0 text-muted" />{{ t.detalhe.prazoDoSla }}
      </p>
      <div class="flex flex-col gap-1">
        <p class="text-xs font-medium text-toned">{{ t.detalhe.tempoReservado }}</p>
        <p v-for="x in blocosDa(tf.id)" :key="x.id" class="flex items-center gap-1.5 text-xs text-muted">
          <UIcon name="i-lucide-timer" class="size-3.5 text-primary" />
          <span class="first-letter:uppercase">{{ diaCurto(x.dia, locale) }}</span> · {{ t.grade.intervalo(hora(x.inicio), hora(x.fim)) }}
        </p>
        <p v-if="!blocosDa(tf.id).length" class="text-xs text-muted">{{ t.detalhe.nenhumTempo }}</p>
      </div>
    </template>

    <!-- Tempo reservado -->
    <p v-if="b && tf" class="flex gap-2 rounded-md bg-elevated p-2.5 text-xs text-toned">
      <UIcon name="i-lucide-timer" class="mt-0.5 size-3.5 shrink-0 text-primary" />
      <span>{{ t.detalhe.blocoDe }}. {{ tf.due_date ? t.detalhe.prazoNaoMuda(t.quando(diaCurto(diaDe(tf.due_date), locale), hora(minutoDe(tf.due_date)))) : '' }} {{ b.outlook ? t.regras.ocupadoNoOutlook : '' }}</span>
    </p>

    <!-- Reunião -->
    <template v-if="r">
      <span class="flex flex-wrap items-center gap-2">
        <UButton v-if="r.teams" :label="t.detalhe.entrar" icon="i-lucide-video" color="info" size="sm" />
        <UButton :label="t.regras.abrirNoOutlook" icon="i-lucide-external-link" color="neutral" variant="outline" size="sm" />
      </span>
      <p v-if="!r.teams && r.local" class="flex items-center gap-1.5 text-xs text-toned"><UIcon name="i-lucide-map-pin" class="size-3.5 text-muted" />{{ r.local }}</p>

      <!-- Reunião de outra pessoa: o horário não muda por aqui; a resposta ao convite, sim -->
      <template v-if="!ehOrganizador(r)">
        <p class="flex gap-2 rounded-md bg-elevated p-2.5 text-xs text-toned">
          <UIcon name="i-lucide-lock" class="mt-0.5 size-3.5 shrink-0 text-muted" />{{ t.regras.organizadaPor(organizador(r)) }}
        </p>
        <div v-if="souParticipante(r)" class="flex items-center gap-2">
          <span class="text-xs font-medium text-toned">{{ t.regras.suaResposta }}</span>
          <UFieldGroup size="xs">
            <UButton
              v-for="x in respostas"
              :key="x"
              :label="t.detalhe.respostas[x]"
              :color="minhaResposta === x ? 'primary' : 'neutral'"
              :variant="minhaResposta === x ? 'solid' : 'outline'"
              :aria-pressed="minhaResposta === x"
              @click="responder(r, x)"
            />
          </UFieldGroup>
        </div>
      </template>
      <p class="flex items-center gap-1.5 text-xs text-muted">
        <span class="size-2 rounded-full" :class="r.calendario === 'meu' ? 'bg-info' : 'bg-inverted/40'" />
        {{ t.lateral.calendariosDoOutlook[r.calendario] }}
      </p>
      <div class="flex flex-col gap-1.5">
        <p class="text-xs font-medium text-toned">{{ t.detalhe.participantes(r.participantes.length) }}</p>
        <ul class="flex flex-col gap-1">
          <li v-for="p in participantes" :key="p.email" class="flex items-center gap-2 text-xs">
            <UAvatar :text="p.nome.split(' ').map(x => x[0]).slice(0, 2).join('')" :alt="p.nome" size="2xs" />
            <span class="min-w-0 flex-1 truncate text-highlighted">{{ p.nome }}</span>
            <UTooltip :text="t.detalhe.respostas[p.resposta]">
              <UIcon :name="iconeDaResposta[p.resposta]" class="size-3.5" :class="corDaResposta[p.resposta]" :aria-label="t.detalhe.respostas[p.resposta]" />
            </UTooltip>
          </li>
        </ul>
        <UButton v-if="r.participantes.length > 4 && !todos" :label="t.detalhe.verMais(r.participantes.length - 4)" color="neutral" variant="link" size="xs" class="self-start px-0" @click="todos = true" />
      </div>

      <!-- Evento particular: não se liga a item -->
      <p v-if="r.particular" class="flex gap-2 border-t border-default pt-3 text-xs text-toned">
        <UIcon name="i-lucide-lock" class="mt-0.5 size-3.5 shrink-0 text-muted" />{{ t.regras.particular }}
      </p>

      <!-- Ligado a -->
      <div v-else class="flex flex-col gap-1.5 border-t border-default pt-3">
        <p class="text-xs font-medium text-toned">{{ t.detalhe.ligadoA }}</p>
        <div v-if="it" class="flex items-center gap-2 rounded-md border border-default p-2">
          <UIcon :name="categoriaPorSlug(it.categoria).icon!" class="size-4 shrink-0 text-muted" />
          <span class="min-w-0 flex-1">
            <span class="block text-xs font-medium text-highlighted">{{ it.reference }}</span>
            <span class="block truncate text-xs text-muted">{{ it.titulo }}</span>
          </span>
          <UButton :label="t.detalhe.abrirItem" color="neutral" variant="outline" size="xs" @click="emit('abrirItem', it.id, 'agenda')" />
          <UButton v-if="podeEditarItem(it)" icon="i-lucide-unlink" color="neutral" variant="ghost" size="xs" :aria-label="t.detalhe.desligar" @click="vincular(null)" />
        </div>
        <div v-else-if="sugerido" class="flex flex-col gap-2 rounded-md border border-info/40 bg-info/10 p-2.5">
          <p class="flex items-center gap-1.5 text-xs text-info"><UIcon name="i-lucide-sparkles" class="size-3.5" />{{ t.detalhe.sugestao(r.participantes.find(p => p.email.endsWith(sugerido!.dominio!))!.email) }}</p>
          <p class="text-xs text-highlighted"><b>{{ sugerido.reference }}</b> · {{ sugerido.titulo }}</p>
          <span class="flex gap-2">
            <UButton :label="t.detalhe.ligar" icon="i-lucide-link-2" color="info" size="xs" @click="vincular(sugerido.id)" />
            <UButton :label="t.detalhe.naoEEste" color="neutral" variant="outline" size="xs" @click="r.sugestaoRecusada = true" />
          </span>
        </div>
        <USelectMenu
          v-else
          :model-value="undefined"
          :items="opcoesDeItem"
          value-key="value"
          size="sm"
          icon="i-lucide-link-2"
          :placeholder="t.detalhe.ligarA"
          :search-input="{ placeholder: t.detalhe.buscarItem }"
          @update:model-value="vincular($event as number)"
        />
        <p v-if="!it" class="text-xs text-muted">{{ t.regras.retrato }}</p>
      </div>
    </template>

    <!-- Item (fonte de categoria) -->
    <p v-if="tipo === 'i' && it" class="flex items-center gap-1.5 text-xs text-muted">
      <UIcon name="i-lucide-calendar" class="size-3.5" />
      {{ categoriaPorSlug(it.categoria).name }} · {{ categoriaPorSlug(it.categoria).campos.find(c => c.chave === fonte(it!.categoria)!.campo)?.rotulo }}
    </p>
    <p v-if="tipo === 'i' && it && !podeEditarItem(it)" class="flex gap-2 rounded-md bg-elevated p-2.5 text-xs text-toned">
      <UIcon name="i-lucide-eye" class="mt-0.5 size-3.5 shrink-0 text-muted" />{{ t.regras.somenteLeitura }}
    </p>
    <p v-else-if="fluxo" class="flex gap-2 rounded-md border border-warning/40 bg-warning/10 p-2.5 text-xs text-highlighted">
      <UIcon name="i-lucide-zap" class="mt-0.5 size-3.5 shrink-0 text-warning" />{{ t.regras.fluxoNoCampo(categoriaPorSlug(it!.categoria).campos.find(c => c.chave === fluxo!.campo)!.rotulo, fluxo.nome) }}
    </p>

    <!-- Campos de data e hora: a alternativa de teclado ao arraste -->
    <div v-if="atual" class="grid gap-2" :class="atual.inicio === undefined ? 'grid-cols-1' : atual.fim === undefined ? 'grid-cols-2' : 'grid-cols-3'">
      <UFormField :label="tipo === 'q' || tipo === 't' ? t.detalhe.prazo : t.detalhe.data" size="xs">
        <UInput type="date" :model-value="atual.dia" size="sm" class="w-full" @change="mudar('dia', ($event.target as HTMLInputElement).value)" />
      </UFormField>
      <UFormField v-if="atual.inicio !== undefined" :label="atual.fim === undefined ? t.detalhe.hora : t.detalhe.inicio" size="xs">
        <UInput type="time" :model-value="hora(atual.inicio)" step="900" size="sm" class="w-full" @change="mudar('inicio', ($event.target as HTMLInputElement).value)" />
      </UFormField>
      <UFormField v-if="atual.fim !== undefined" :label="t.detalhe.fim" size="xs">
        <UInput type="time" :model-value="hora(atual.fim)" step="900" size="sm" class="w-full" @change="mudar('fim', ($event.target as HTMLInputElement).value)" />
      </UFormField>
    </div>

    <!-- Ações -->
    <div v-if="tf || (tipo === 'i' && it)" class="flex flex-wrap gap-2 border-t border-default pt-3">
      <template v-if="tf">
        <UButton v-if="podeConcluir(tf)" :label="tf.status === 'completed' ? t.detalhe.reabrir : t.detalhe.concluir" :icon="tf.status === 'completed' ? 'i-lucide-rotate-ccw' : 'i-lucide-check'" :color="tf.status === 'completed' ? 'neutral' : 'success'" variant="outline" size="xs" @click="alternarConclusao" />
        <UButton v-if="tipo === 't' && temSla(tf) && ehMinha(tf) && tf.status !== 'completed'" :label="t.detalhe.reservarTempo" icon="i-lucide-timer" color="neutral" variant="outline" size="xs" @click="reservar" />
        <UButton v-if="b && ehMinha(tf)" :label="t.detalhe.removerBloco" icon="i-lucide-timer-off" color="neutral" variant="outline" size="xs" @click="tirarBloco" />
        <UButton
          :label="t.detalhe.abrirTarefa"
          icon="i-lucide-arrow-up-right"
          :color="ehMinha(tf) && tf.acao && tf.status !== 'completed' ? 'primary' : 'neutral'"
          :variant="ehMinha(tf) && tf.acao && tf.status !== 'completed' ? 'solid' : 'outline'"
          size="xs"
          @click="emit('abrirTarefa', tf.id)"
        />
      </template>
      <UButton v-else-if="tipo === 'i' && it" :label="t.detalhe.abrirItem" icon="i-lucide-arrow-up-right" color="neutral" variant="outline" size="xs" @click="emit('abrirItem', it.id, 'item')" />
    </div>
  </div>
</template>
