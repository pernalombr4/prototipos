<script setup lang="ts">
/**
 * O conteúdo do popover que abre junto do evento (padrão do Google, do Outlook e do ClickUp, visto em tela). Muda
 * por fonte: reunião do Outlook, prazo de tarefa, tarefa rápida, tempo reservado e data de item. Os campos de data e
 * hora são a alternativa de teclado ao arraste e passam pela mesma regra (`aplicar`).
 *
 * Rodada 2: o popover só oferece o que a pessoa pode fazer, e diz o motivo numa linha quando tira algo. Reunião de
 * outra pessoa não muda de horário e ganha a resposta ao convite; evento particular não se liga a item; item só para
 * leitura não muda de data; data com fluxo avisa que o fluxo roda; tarefa de outra pessoa não conclui nem muda de
 * prazo.
 *
 * Pedido da redatora em 29/10/2026: "Cumprir tarefa" abre o modal da tarefa sobre a grade, com a ação de cada tipo
 * (concluir, aprovar ou reprovar, preencher o formulário); "Ir para a tarefa" continua, para a tarefa inteira.
 *
 * Modelagem da rodada 2: "Ligado a" lista itens e tarefas, com quem ligou e quando, e conta o que a pessoa não vê; a
 * recorrente liga a série ou só esta; a reunião de outro fuso mostra a hora de lá; o evento de vários dias mostra o
 * período; o horário oferecido tem Aceitar e Recusar; a tarefa rápida troca de item aqui.
 */
import type { Lugar } from '~/components/ux/geometriaDoCalendario'
import { fundoCheio, textoDaCor } from '~/components/ux/geometriaDoCalendario'
import type { Textos } from './textos'
import type { Vinculo } from './mocks'
import { AGORA, HOJE, diaCurto, diaLongo, diaNumerico, duracao, hora, paraMinutos } from './datas'
import { aceitarBloco, bloco, blocosDa, colaboro, concluir, corDoCalendario, desligar, diaDe, ehMinha, ehOrganizador, estado, fluxoDoCampo, fonteDoEvento, item, lerChave, ligacoesDa, ligar, meuBloco, minutoDe, mudarFim, noFuso, nomeDoFuso, organizador, participo, podeEditarItem, quemSugere, recusarSugestao, removerBloco, responder, reuniao, rotuloDoCampo, situacao, souParticipante, sugestao, tarefa, temSla, tituloOculto } from './estado'
import { EU, categoriaPorSlug, pessoaPorId } from './mocks'

const props = defineProps<{ t: Textos, locale: string, chave: string }>()
const emit = defineEmits<{ fechar: [], mover: [chave: string, lugar: Lugar], abrirItem: [id: number, aba: 'item' | 'tarefas' | 'agenda'], abrirTarefa: [id: number], cumprir: [id: number] }>()
const toast = useToast()

const partes = computed(() => lerChave(props.chave))
const tipo = computed(() => partes.value.tipo)
const id = computed(() => partes.value.id)
const r = computed(() => tipo.value === 'r' ? reuniao(id.value) ?? null : null)
const b = computed(() => tipo.value === 'b' ? bloco(id.value) ?? null : null)
const tf = computed(() => tipo.value === 't' || tipo.value === 'q' ? tarefa(Number(id.value)) ?? null : b.value ? tarefa(b.value.tarefaId) ?? null : null)
const it = computed(() => tipo.value === 'i' ? item(Number(id.value)) : item(tf.value?.item))
/** A fonte do evento de item: uma categoria tem várias, uma por campo de data. */
const f = computed(() => tipo.value === 'i' && it.value ? fonteDoEvento(it.value, partes.value.campo) ?? null : null)
const fimDoItem = computed(() => f.value?.campoFim && it.value ? it.value.data[f.value.campoFim] as string | undefined : undefined)

/** A reunião se liga a itens e a tarefas; o item que a pessoa não pode ver entra só na contagem. */
const ligacoes = computed(() => r.value ? ligacoesDa(r.value) : { vinculos: [], semAcesso: 0 })
const sugerido = computed(() => r.value ? sugestao(r.value) : null)
const naSerie = ref<'serie' | 'esta'>('serie')
/** O que a pessoa pode mexer neste evento. */
const pode = computed(() => {
  if (r.value) return ehOrganizador(r.value)
  if (b.value) return meuBloco(b.value)
  if (tf.value) return ehMinha(tf.value)
  if (tipo.value === 'i' && it.value) return podeEditarItem(it.value)
  return false
})
const fluxo = computed(() => it.value && f.value ? fluxoDoCampo(it.value, f.value.campo) : null)
const minhaResposta = computed(() => r.value?.participantes.find(p => p.email === EU.email)?.resposta)
const respostas = ['sim', 'talvez', 'nao'] as const

const cor = computed(() => {
  if (r.value) return corDoCalendario(r.value.calendario)
  if (f.value) return f.value.cor
  return tipo.value === 'q' ? 'neutral' : 'primary'
})
const titulo = computed(() => r.value ? (tituloOculto(r.value) ? props.t.modelo.particular : r.value.titulo) : tf.value?.name ?? (it.value ? `${it.value.reference} · ${it.value.titulo}` : ''))
const icone = computed(() => r.value ? (r.value.teams ? 'i-lucide-video' : 'i-lucide-users') : b.value ? (b.value.oferecidoA ? 'i-lucide-user-plus' : 'i-lucide-timer') : tipo.value === 't' ? 'i-lucide-flag' : tipo.value === 'q' ? 'i-lucide-clipboard-check' : categoriaPorSlug(it.value!.categoria).icon!)

/** O lugar atual, que os campos editam. Tarefa com SLA não tem: o prazo não se mexe. */
const atual = computed<Lugar | null>(() => {
  if (!pode.value) return null
  if (r.value) return r.value.diaFim ? null : { dia: r.value.dia, inicio: r.value.inicio, fim: r.value.fim }
  if (b.value) return { dia: b.value.dia, inicio: b.value.inicio, fim: b.value.fim }
  if (tf.value) return temSla(tf.value) ? null : { dia: tf.value.due_date ? diaDe(tf.value.due_date) : HOJE, inicio: tf.value.due_date ? minutoDe(tf.value.due_date) : 18 * 60 }
  if (it.value && f.value) {
    const ini = f.value.horaInicio && !fimDoItem.value ? it.value.data[f.value.horaInicio] as number | undefined : undefined
    return { dia: String(it.value.data[f.value.campo]), inicio: ini, fim: ini === undefined ? undefined : (f.value.horaFim ? it.value.data[f.value.horaFim] as number : ini + 60) }
  }
  return null
})

const quando = computed(() => {
  const l = atual.value
  if (tf.value && (tipo.value === 't' || tipo.value === 'q')) {
    return tf.value.due_date ? props.t.detalhe.vence(props.t.quando(diaLongo(diaDe(tf.value.due_date), props.locale), hora(minutoDe(tf.value.due_date)))) : props.t.situacao['sem-prazo']
  }
  // O evento de vários dias: o período, de dia inteiro.
  const periodo = r.value?.diaFim ? [r.value.dia, r.value.diaFim] : fimDoItem.value ? [String(it.value!.data[f.value!.campo]), fimDoItem.value] : null
  if (periodo) return `${props.t.modelo.periodo(diaLongo(periodo[0]!, props.locale), diaLongo(periodo[1]!, props.locale))} · ${props.t.detalhe.diaInteiro}`
  const x = l ?? (r.value ? { dia: r.value.dia, inicio: r.value.inicio, fim: r.value.fim } : null)
  if (!x) return ''
  const dia = diaLongo(x.dia, props.locale)
  if (x.inicio === undefined) return `${dia} · ${props.t.detalhe.diaInteiro}`
  const fim = x.fim ?? x.inicio + 60
  return `${dia} · ${props.t.grade.intervalo(hora(x.inicio), hora(fim))} (${duracao(fim - x.inicio, props.t.detalhe.h, props.t.detalhe.min)})`
})
/** A reunião organizada em outro fuso: a hora de lá, ao lado da de Brasília. */
const outroFuso = computed(() => {
  const x = r.value
  if (!x?.fuso || x.inicio === undefined) return null
  return props.t.modelo.fuso(props.t.grade.intervalo(noFuso(x, x.inicio, props.locale), noFuso(x, x.fim ?? x.inicio + 60, props.locale)), nomeDoFuso(x, props.locale))
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
function mudarAte(valor: string) {
  if (it.value && valor && mudarFim(it.value, f.value?.campo, valor)) toast.add({ title: props.t.avisos.item(rotuloDoCampo(it.value.categoria, f.value!.campoFim!)!, it.value.reference, diaCurto(valor, props.locale)), icon: 'i-lucide-calendar-check' })
}

/* ---------- reunião ---------- */
const todos = ref(false)
const participantes = computed(() => r.value ? (todos.value ? r.value.participantes : r.value.participantes.slice(0, 4)) : [])
const iconeDaResposta = { sim: 'i-lucide-circle-check', nao: 'i-lucide-circle-x', talvez: 'i-lucide-circle-help', pendente: 'i-lucide-circle-dashed' }
const corDaResposta = { sim: 'text-success', nao: 'text-error', talvez: 'text-warning', pendente: 'text-dimmed' }
const opcoesDeItem = computed(() => {
  const ligados = ligacoes.value.vinculos.filter(v => v.alvo.tipo === 'item').map(v => v.alvo.id)
  return estado.itens.filter(i => podeEditarItem(i) && !ligados.includes(i.id)).map(i => ({ label: `${i.reference} · ${i.titulo}`, value: i.id, icon: categoriaPorSlug(i.categoria).icon ?? undefined }))
})
/** Pode desligar quem pode editar o alvo: o item editável, a tarefa de que participa. */
const podeDesligar = (v: Vinculo) => v.alvo.tipo === 'item' ? podeEditarItem(item(v.alvo.id)!) : participo(tarefa(v.alvo.id)!)
const quemLigou = (v: Vinculo) => props.t.modelo.ligadaPor(v.por === EU.id ? EU.nome : pessoaPorId(v.por)?.nome ?? '--', diaNumerico(v.em, props.locale))

function vincular(itemId: number, origem: Vinculo['origem'] = 'manual') {
  if (!r.value) return
  ligar(r.value, { tipo: 'item', id: itemId }, origem, naSerie.value === 'serie')
  toast.add({ title: props.t.avisos.ligada(item(itemId)!.reference), icon: 'i-lucide-link-2', color: 'success' })
}
function desvincular(v: Vinculo) {
  desligar(v)
  toast.add({ title: props.t.avisos.desligada, icon: 'i-lucide-unlink', color: 'success' })
}

/* ---------- tarefa ---------- */
const s = computed(() => tf.value ? situacao(tf.value) : null)
const corDaSituacao = { 'concluida': 'success', 'atrasada': 'error', 'hoje': 'warning', 'no-prazo': 'neutral', 'sem-prazo': 'neutral' } as const
function alternarConclusao() {
  if (!tf.value) return
  const liberados = concluir(tf.value)
  toast.add({ title: tf.value.status === 'completed' ? props.t.avisos.concluida : props.t.avisos.reaberta, description: liberados ? props.t.modelo.liberados(liberados) : undefined, icon: 'i-lucide-circle-check', color: 'success' })
}
function reservar() {
  const inicio = Math.max(Math.ceil(AGORA / 60) * 60, 8 * 60)
  emit('mover', props.chave, { dia: HOJE, inicio, fim: inicio + 60 })
}
function tirarBloco() {
  const externo = !!b.value!.eventoExterno
  removerBloco(b.value!.id)
  toast.add({ title: props.t.avisos.blocoRemovido, description: externo ? props.t.modelo.saiDoOutlook : undefined, icon: 'i-lucide-timer-off' })
  emit('fechar')
}
function aceitar() {
  aceitarBloco(b.value!.id)
  toast.add({ title: props.t.modelo.aceito, icon: 'i-lucide-check', color: 'success' })
}
function recusar() {
  removerBloco(b.value!.id)
  toast.add({ title: props.t.modelo.recusado, icon: 'i-lucide-x' })
  emit('fechar')
}
/** A tarefa rápida troca de item aqui (a do fluxo pertence ao item do fluxo). */
const opcoesDoItemDaTarefa = computed(() => [
  { label: props.t.modelo.semItem, value: 0 },
  ...estado.itens.filter(podeEditarItem).map(i => ({ label: `${i.reference} · ${i.titulo}`, value: i.id, icon: categoriaPorSlug(i.categoria).icon ?? undefined })),
])
function trocarItem(v: number) {
  if (!tf.value) return
  tf.value.item = v || null
  toast.add({ title: v ? props.t.modelo.itemTrocado(item(v)!.reference) : props.t.modelo.itemTirado, icon: 'i-lucide-link-2', color: 'success' })
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
        <p v-if="outroFuso" class="mt-0.5 flex items-center gap-1 text-xs text-muted"><UIcon name="i-lucide-globe" class="size-3" />{{ outroFuso }}</p>
      </div>
      <UButton icon="i-lucide-x" color="neutral" variant="ghost" size="xs" :aria-label="t.detalhe.fechar" @click="emit('fechar')" />
    </div>

    <!-- Situação da tarefa -->
    <div v-if="tf && (tipo === 't' || tipo === 'q')" class="flex flex-wrap items-center gap-2">
      <UBadge :label="t.situacao[s!]" :color="corDaSituacao[s!]" variant="soft" size="sm" />
      <span v-if="pessoaPorId(tf.assigned_to)" class="flex items-center gap-1.5 text-xs text-muted">
        <UAvatar :text="pessoaPorId(tf.assigned_to)!.iniciais" size="3xs" />{{ pessoaPorId(tf.assigned_to)!.nome }}
      </span>
      <UAvatarGroup v-if="tf.collaborators?.length" size="3xs" :max="3">
        <UTooltip v-for="c in tf.collaborators" :key="c" :text="`${t.modelo.colaboradores}: ${pessoaPorId(c)?.nome}`">
          <UAvatar :text="pessoaPorId(c)?.iniciais" :alt="pessoaPorId(c)?.nome" />
        </UTooltip>
      </UAvatarGroup>
    </div>

    <!-- Horário oferecido: a tarefa mudou de responsável -->
    <div v-if="b && b.oferecidoA === EU.id" class="flex flex-col gap-2 rounded-md border border-primary/40 bg-primary/10 p-2.5">
      <p class="flex items-center gap-1.5 text-xs font-medium text-highlighted"><UIcon name="i-lucide-user-plus" class="size-3.5 text-primary" />{{ t.modelo.oferecido(pessoaPorId(b.dono)?.nome ?? '--') }}</p>
      <p class="text-xs text-toned">{{ t.modelo.oferecidoTexto }}</p>
      <span class="flex gap-2">
        <UButton :label="t.modelo.aceitar" icon="i-lucide-check" size="xs" @click="aceitar" />
        <UButton :label="t.modelo.recusar" color="neutral" variant="outline" size="xs" @click="recusar" />
      </span>
    </div>
    <p v-else-if="b && b.oferecidoA" class="flex gap-2 rounded-md bg-elevated p-2.5 text-xs text-toned">
      <UIcon name="i-lucide-hourglass" class="mt-0.5 size-3.5 shrink-0 text-muted" />{{ t.modelo.aguardando(pessoaPorId(b.oferecidoA)?.nome ?? '--') }}
    </p>

    <!-- O que a pessoa não pode fazer nesta tarefa, e por quê -->
    <template v-if="tf && !(b && b.oferecidoA)">
      <p v-if="colaboro(tf)" class="flex gap-2 rounded-md bg-elevated p-2.5 text-xs text-toned">
        <UIcon name="i-lucide-users" class="mt-0.5 size-3.5 shrink-0 text-muted" />{{ t.modelo.colabora(pessoaPorId(tf.assigned_to)?.nome ?? '--') }}
      </p>
      <p v-else-if="!ehMinha(tf)" class="flex gap-2 rounded-md bg-elevated p-2.5 text-xs text-toned">
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
        <p v-for="x in blocosDa(tf.id).filter(meuBloco)" :key="x.id" class="flex items-center gap-1.5 text-xs text-muted">
          <UIcon name="i-lucide-timer" class="size-3.5 text-primary" />
          <span class="first-letter:uppercase">{{ diaCurto(x.dia, locale) }}</span> · {{ t.grade.intervalo(hora(x.inicio), hora(x.fim)) }}
        </p>
        <p v-if="!blocosDa(tf.id).some(meuBloco)" class="text-xs text-muted">{{ t.detalhe.nenhumTempo }}</p>
      </div>
    </template>

    <!-- Tempo reservado -->
    <p v-if="b && tf && !b.oferecidoA" class="flex gap-2 rounded-md bg-elevated p-2.5 text-xs text-toned">
      <UIcon name="i-lucide-timer" class="mt-0.5 size-3.5 shrink-0 text-primary" />
      <span>{{ t.detalhe.blocoDe }}. {{ tf.due_date ? t.detalhe.prazoNaoMuda(t.quando(diaCurto(diaDe(tf.due_date), locale), hora(minutoDe(tf.due_date)))) : '' }} {{ b.outlook ? t.regras.ocupadoNoOutlook : '' }}</span>
    </p>

    <!-- Tarefa rápida: o item dela -->
    <UFormField v-if="tipo === 'q' && tf && ehMinha(tf) && tf.status !== 'completed'" :label="t.modelo.itemDaTarefa" size="xs">
      <USelectMenu
        :model-value="tf.item ?? 0"
        :items="opcoesDoItemDaTarefa"
        value-key="value"
        size="sm"
        icon="i-lucide-link-2"
        class="w-full"
        :search-input="{ placeholder: t.detalhe.buscarItem }"
        @update:model-value="trocarItem($event as number)"
      />
    </UFormField>

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
      <p v-if="r.calendario" class="flex items-center gap-1.5 text-xs text-muted">
        <span class="size-2 rounded-full" :class="r.calendario === 'meu' ? 'bg-info' : 'bg-inverted/40'" />
        {{ t.lateral.calendariosDoOutlook[r.calendario] }}
        <UBadge v-if="r.serie" :label="t.modelo.daSerie" icon="i-lucide-repeat" color="neutral" variant="subtle" size="xs" class="ml-1" />
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
      <p v-if="r.particular && !ligacoes.vinculos.length" class="flex gap-2 border-t border-default pt-3 text-xs text-toned">
        <UIcon name="i-lucide-lock" class="mt-0.5 size-3.5 shrink-0 text-muted" />{{ t.regras.particular }}
      </p>

      <!-- Ligado a: itens e tarefas, de quem ligou -->
      <div v-else class="flex flex-col gap-1.5 border-t border-default pt-3">
        <p class="text-xs font-medium text-toned">{{ t.detalhe.ligadoA }}</p>
        <div v-for="v in ligacoes.vinculos" :key="v.id" class="flex animate-[entrada_.2s_ease-out_both] items-center gap-2 rounded-md border border-default p-2">
          <template v-if="v.alvo.tipo === 'tarefa'">
            <UIcon name="i-lucide-flag" class="size-4 shrink-0 text-primary" />
            <span class="min-w-0 flex-1">
              <span class="block text-xs font-medium text-highlighted">{{ t.modelo.tarefa }} {{ tarefa(v.alvo.id)!.reference }}</span>
              <span class="block truncate text-xs text-muted">{{ tarefa(v.alvo.id)!.name }}</span>
              <span class="block text-[11px] text-dimmed">{{ quemLigou(v) }}</span>
            </span>
            <UButton :label="t.detalhe.abrirTarefa" color="neutral" variant="outline" size="xs" @click="emit('abrirTarefa', v.alvo.id)" />
          </template>
          <template v-else>
            <UIcon :name="categoriaPorSlug(item(v.alvo.id)!.categoria).icon!" class="size-4 shrink-0 text-muted" />
            <span class="min-w-0 flex-1">
              <span class="flex items-center gap-1 text-xs font-medium text-highlighted">{{ item(v.alvo.id)!.reference }}<UIcon v-if="v.serie" name="i-lucide-repeat" class="size-3 text-muted" :aria-label="t.modelo.serie" /></span>
              <span class="block truncate text-xs text-muted">{{ item(v.alvo.id)!.titulo }}</span>
              <span class="block text-[11px] text-dimmed">{{ quemLigou(v) }}</span>
            </span>
            <UButton :label="t.detalhe.abrirItem" color="neutral" variant="outline" size="xs" @click="emit('abrirItem', v.alvo.id, 'agenda')" />
          </template>
          <UButton v-if="podeDesligar(v)" icon="i-lucide-unlink" color="neutral" variant="ghost" size="xs" :aria-label="`${t.detalhe.desligar}: ${v.alvo.tipo === 'item' ? item(v.alvo.id)!.reference : tarefa(v.alvo.id)!.name}`" @click="desvincular(v)" />
        </div>
        <UTooltip v-if="ligacoes.semAcesso" :text="t.modelo.semAcessoTexto">
          <p class="flex items-center gap-1.5 self-start text-xs text-muted" tabindex="0"><UIcon name="i-lucide-eye-off" class="size-3.5" />{{ t.modelo.semAcesso(ligacoes.semAcesso) }}</p>
        </UTooltip>
        <p v-if="r.particular" class="flex gap-2 text-xs text-toned"><UIcon name="i-lucide-lock" class="mt-0.5 size-3.5 shrink-0 text-muted" />{{ t.modelo.particularTexto }}</p>

        <template v-if="!r.particular">
          <div v-if="sugerido" class="flex flex-col gap-2 rounded-md border border-info/40 bg-info/10 p-2.5">
            <p class="flex items-center gap-1.5 text-xs text-info"><UIcon name="i-lucide-sparkles" class="size-3.5" />{{ t.detalhe.sugestao(quemSugere(r, sugerido)) }}</p>
            <p class="text-xs text-highlighted"><b>{{ sugerido.reference }}</b> · {{ sugerido.titulo }}</p>
            <span class="flex gap-2">
              <UButton :label="t.detalhe.ligar" icon="i-lucide-link-2" color="info" size="xs" @click="vincular(sugerido.id, 'sugestao')" />
              <UButton :label="t.detalhe.naoEEste" color="neutral" variant="outline" size="xs" @click="recusarSugestao(r, sugerido.id)" />
            </span>
          </div>
          <!-- A recorrente: a série inteira (o padrão) ou só esta ocorrência -->
          <div v-if="r.serie && opcoesDeItem.length" class="flex items-center gap-2 text-xs">
            <span class="text-toned">{{ t.modelo.ligarNaSerie }}</span>
            <UFieldGroup size="xs">
              <UButton :label="t.modelo.serie" :color="naSerie === 'serie' ? 'primary' : 'neutral'" :variant="naSerie === 'serie' ? 'solid' : 'outline'" :aria-pressed="naSerie === 'serie'" @click="naSerie = 'serie'" />
              <UButton :label="t.modelo.soEsta" :color="naSerie === 'esta' ? 'primary' : 'neutral'" :variant="naSerie === 'esta' ? 'solid' : 'outline'" :aria-pressed="naSerie === 'esta'" @click="naSerie = 'esta'" />
            </UFieldGroup>
          </div>
          <USelectMenu
            v-if="opcoesDeItem.length"
            :model-value="undefined"
            :items="opcoesDeItem"
            value-key="value"
            size="sm"
            icon="i-lucide-link-2"
            :placeholder="ligacoes.vinculos.length ? t.detalhe.ligarOutro : t.detalhe.ligarA"
            :search-input="{ placeholder: t.detalhe.buscarItem }"
            @update:model-value="vincular($event as number)"
          />
          <p v-if="!ligacoes.vinculos.length" class="text-xs text-muted">{{ t.regras.retrato }}</p>
        </template>
      </div>
    </template>

    <!-- Item (fonte de categoria) -->
    <p v-if="tipo === 'i' && it && f" class="flex items-center gap-1.5 text-xs text-muted">
      <UIcon name="i-lucide-calendar" class="size-3.5" />
      {{ categoriaPorSlug(it.categoria).name }} · {{ rotuloDoCampo(it.categoria, f.campo) }}<template v-if="f.campoFim && fimDoItem"> · {{ rotuloDoCampo(it.categoria, f.campoFim) }}</template>
    </p>
    <p v-if="tipo === 'i' && it && !podeEditarItem(it)" class="flex gap-2 rounded-md bg-elevated p-2.5 text-xs text-toned">
      <UIcon name="i-lucide-eye" class="mt-0.5 size-3.5 shrink-0 text-muted" />{{ t.regras.somenteLeitura }}
    </p>
    <p v-else-if="fluxo" class="flex gap-2 rounded-md border border-warning/40 bg-warning/10 p-2.5 text-xs text-highlighted">
      <UIcon name="i-lucide-zap" class="mt-0.5 size-3.5 shrink-0 text-warning" />{{ t.regras.fluxoNoCampo(rotuloDoCampo(it!.categoria, fluxo.campo)!, fluxo.nome) }}
    </p>

    <!-- Campos de data e hora: a alternativa de teclado ao arraste -->
    <div v-if="atual" class="grid gap-2" :class="fimDoItem || (atual.inicio !== undefined && atual.fim === undefined) ? 'grid-cols-2' : atual.inicio === undefined ? 'grid-cols-1' : 'grid-cols-3'">
      <UFormField :label="tipo === 'q' || tipo === 't' ? t.detalhe.prazo : t.detalhe.data" size="xs">
        <UInput type="date" :model-value="atual.dia" size="sm" class="w-full" @change="mudar('dia', ($event.target as HTMLInputElement).value)" />
      </UFormField>
      <UFormField v-if="fimDoItem" :label="t.modelo.ate" size="xs">
        <UInput type="date" :model-value="fimDoItem" :min="atual.dia" size="sm" class="w-full" @change="mudarAte(($event.target as HTMLInputElement).value)" />
      </UFormField>
      <UFormField v-if="atual.inicio !== undefined" :label="atual.fim === undefined ? t.detalhe.hora : t.detalhe.inicio" size="xs">
        <UInput type="time" :model-value="hora(atual.inicio)" step="900" size="sm" class="w-full" @change="mudar('inicio', ($event.target as HTMLInputElement).value)" />
      </UFormField>
      <UFormField v-if="atual.fim !== undefined" :label="t.detalhe.fim" size="xs">
        <UInput type="time" :model-value="hora(atual.fim)" step="900" size="sm" class="w-full" @change="mudar('fim', ($event.target as HTMLInputElement).value)" />
      </UFormField>
    </div>

    <!-- Ações -->
    <div v-if="(tf && !(b && b.oferecidoA)) || (tipo === 'i' && it)" class="flex flex-wrap gap-2 border-t border-default pt-3">
      <template v-if="tf">
        <UButton v-if="ehMinha(tf) && tf.status !== 'completed'" :label="t.detalhe.cumprir" icon="i-lucide-check" size="xs" @click="emit('cumprir', tf.id)" />
        <UButton v-else-if="ehMinha(tf)" :label="t.detalhe.reabrir" icon="i-lucide-rotate-ccw" color="neutral" variant="outline" size="xs" @click="alternarConclusao" />
        <UButton v-if="tipo === 't' && temSla(tf) && participo(tf) && tf.status !== 'completed'" :label="t.detalhe.reservarTempo" icon="i-lucide-timer" color="neutral" variant="outline" size="xs" @click="reservar" />
        <UButton v-if="b && meuBloco(b)" :label="t.detalhe.removerBloco" icon="i-lucide-timer-off" color="neutral" variant="outline" size="xs" @click="tirarBloco" />
        <UButton
          :label="t.detalhe.abrirTarefa"
          icon="i-lucide-arrow-up-right"
          color="neutral"
          variant="outline"
          size="xs"
          @click="emit('abrirTarefa', tf.id)"
        />
      </template>
      <UButton v-else-if="tipo === 'i' && it" :label="t.detalhe.abrirItem" icon="i-lucide-arrow-up-right" color="neutral" variant="outline" size="xs" @click="emit('abrirItem', it.id, 'item')" />
    </div>
  </div>
</template>
