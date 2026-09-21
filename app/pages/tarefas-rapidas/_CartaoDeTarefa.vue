<script setup lang="ts">
/**
 * O cartão fechado.
 *
 * Decisões que vêm do que o quadro de hoje faz:
 *  - o título não é capitalizado por CSS e quebra em duas linhas, em vez de
 *    truncar na primeira palavra;
 *  - a data mostrada é o PRAZO, não a data de criação (hoje o cartão mostra
 *    `created_at`, o que faz a tarefa vencida parecer recém-chegada);
 *  - todo campo do cartão é ligável e desligável pela barra, então esta peça
 *    recebe o mapa `campos` e não decide sozinha o que mostrar.
 *
 * **Tudo no cartão tem tooltip, no formato "Rótulo: valor".** Num cartão
 * denso, cada ícone e cada selo é uma abreviação; sem o nome por extenso ao
 * passar o mouse, a pessoa precisa abrir a tarefa só para conferir o que está
 * vendo. A regra: se está no cartão sem rótulo escrito, tem tooltip.
 *
 * **As três pessoas aparecem separadas**, na mesma ordem sempre: quem criou,
 * quem colabora e quem é responsável, da esquerda para a direita, terminando
 * em quem tem que agir. Criador e colaboradores levam um ícone na frente
 * porque avatar sozinho não diz o papel; o responsável não precisa, porque
 * avatar no canto do cartão é convenção de mercado para "é dessa pessoa".
 */
import type { Task } from '@be-enlighten/enspace-sdk-schemas'
import { itensRelacionados, pessoas } from './mocks'
import {
  corDaPrioridade, descricaoEmTexto, estaAtrasada, etiquetasDaTarefa, formatarCronometro,
  formatarDataHora, formatarDuracao, iconeDaPrioridade, iconeDoTipo, prazoLegivel,
  referenciaCurta, tempoRegistrado,
} from './quadro'
import type { Textos } from './textos'

const props = defineProps<{
  tarefa: Task
  t: Textos
  campos: Record<string, boolean>
  densidade: 'pequeno' | 'medio' | 'grande'
  somenteLeitura?: boolean
  /** Destaca o cartão que está aberto no painel. */
  ativo?: boolean
  /** O cronômetro está rodando nesta tarefa. */
  cronometroAtivo?: boolean
  segundosCorrendo?: number
}>()

const emit = defineEmits<{
  abrir: []
  mover: [status: Task['status']]
  arquivar: []
  cronometrar: []
}>()

const prazo = computed(() => prazoLegivel(props.tarefa, props.t))
const atrasada = computed(() => estaAtrasada(props.tarefa))
const responsavel = computed(() => props.tarefa.assigned_to ? pessoas[props.tarefa.assigned_to] : null)
const criador = computed(() => props.tarefa.creator ? pessoas[props.tarefa.creator] : null)
const item = computed(() => props.tarefa.item ? itensRelacionados[props.tarefa.item] : null)
const tags = computed(() => etiquetasDaTarefa(props.tarefa))
const colaboradores = computed(() =>
  (props.tarefa.collaborators ?? []).map(id => pessoas[id]).filter(Boolean))

const descricao = computed(() => descricaoEmTexto(props.tarefa.description))
const tempo = computed(() => tempoRegistrado(props.tarefa.id))
const temFormulario = computed(() => props.tarefa.type === 'form' || props.tarefa.type === 'crud')

/**
 * Descrição no cartão: o mercado não mostra texto longo em cartão.
 * O Linear não mostra descrição nenhuma; o Trello põe um ícone dizendo que
 * existe uma; o Notion mostra uma prévia cortada. Aqui ela aparece cortada,
 * e **o tamanho do cartão decide quantas linhas, não se aparece**: quem liga
 * o campo vê o campo.
 */
const linhasDaDescricao = computed(() => (
  { pequeno: 'line-clamp-1', medio: 'line-clamp-2', grande: 'line-clamp-4' }
)[props.densidade])

const mostraDescricao = computed(() => props.campos.descricao && !!descricao.value)

/** Descrição existe mas está desligada: vira ícone, como o Trello faz. */
const soOIconeDaDescricao = computed(() => !props.campos.descricao && !!descricao.value)

/** Descrição muito maior que o corte: o cartão avisa que tem mais. */
const descricaoLonga = computed(() => descricao.value.length > 220)

const linhasDoTitulo = computed(() => (
  { pequeno: 'line-clamp-1', medio: 'line-clamp-2', grande: 'line-clamp-3' }
)[props.densidade])

/** O tooltip de todo mundo tem a mesma forma: "Rótulo: valor". */
function dica(rotulo: string, valor: string) {
  return `${rotulo}: ${valor}`
}

const dicaDoPrazo = computed(() => {
  if (!props.tarefa.due_date) return dica(props.t.campos.prazo, props.t.semPrazo)
  return `${dica(props.t.campos.prazo, formatarDataHora(props.tarefa.due_date))} (${prazo.value.texto})`
})

const dicaDosColaboradores = computed(() =>
  dica(props.t.campos.colaboradores, colaboradores.value.map(p => p!.fullname).join(', ')))

const dicaDasEtiquetasEscondidas = computed(() =>
  dica(props.t.campos.etiquetas, tags.value.slice(2).map(x => x!.nome).join(', ')))

const dicaDoItem = computed(() =>
  item.value ? `${item.value.categoria} ${item.value.codigo}: ${item.value.titulo}` : '')

/** Mostra as pessoas só quando há alguém e o campo está ligado. */
const mostraPessoas = computed(() =>
  (props.campos.responsavel)
  || (props.campos.colaboradores && !!colaboradores.value.length && props.densidade !== 'compacto')
  || (props.campos.criador && !!criador.value && props.densidade !== 'compacto'))

const itensDoMenu = computed(() => [[
  { label: props.t.abrirTarefa, icon: 'i-lucide-square-arrow-out-up-right', onSelect: () => emit('abrir') },
  {
    label: props.cronometroAtivo ? props.t.tempo.parar : props.t.tempo.iniciar,
    icon: props.cronometroAtivo ? 'i-lucide-square' : 'i-lucide-play',
    onSelect: () => emit('cronometrar'),
  },
  { label: props.t.copiarReferencia, icon: 'i-lucide-copy' },
], [
  { label: props.t.status.pending, icon: 'i-lucide-circle-dashed', onSelect: () => emit('mover', 'pending') },
  { label: props.t.status.working, icon: 'i-lucide-circle-dot-dashed', onSelect: () => emit('mover', 'working') },
  { label: props.t.status.blocked, icon: 'i-lucide-circle-pause', onSelect: () => emit('mover', 'blocked') },
  { label: props.t.status.completed, icon: 'i-lucide-circle-check', onSelect: () => emit('mover', 'completed') },
], [
  { label: props.t.arquivadas, icon: 'i-lucide-archive', onSelect: () => emit('arquivar') },
]])
</script>

<template>
  <article
    class="group relative rounded-lg border bg-default p-3 transition-all duration-200
           hover:-translate-y-0.5 hover:border-accented hover:shadow-md focus-within:ring-2 focus-within:ring-primary/40"
    :class="[
      ativo ? 'border-primary ring-1 ring-primary/40' : 'border-default',
      atrasada && !ativo ? 'border-l-2 border-l-error' : '',
      somenteLeitura ? '' : 'cursor-grab active:cursor-grabbing',
    ]"
  >
    <!-- Linha de identificação: tipo, referência e o aviso que não pode esperar o clique -->
    <div v-if="campos.referencia || campos.tipo || atrasada" class="mb-1.5 flex items-center gap-1.5">
      <UTooltip v-if="campos.tipo" :text="dica(t.campos.tipo, t.tipo[tarefa.type])">
        <UIcon :name="iconeDoTipo[tarefa.type]" class="size-3.5 shrink-0 text-muted" />
      </UTooltip>

      <UTooltip v-if="campos.referencia" :text="dica(t.campos.referencia, tarefa.reference)">
        <span class="font-mono text-[11px] leading-none text-muted">
          {{ referenciaCurta(tarefa.reference) }}
        </span>
      </UTooltip>

      <UTooltip v-if="atrasada" :text="dicaDoPrazo" class="ml-auto">
        <UBadge
          :label="prazo.texto"
          color="error"
          variant="subtle"
          size="sm"
          icon="i-lucide-alarm-clock"
        />
      </UTooltip>
    </div>

    <!--
      O corte do título vai no <span>, não no <h3>. `line-clamp` liga
      `overflow: hidden`, e isso recorta o `after:inset-0` do link esticado:
      o cartão deixa de ser clicável fora das duas linhas do título.
    -->
    <h3 class="text-sm font-medium leading-snug text-highlighted">
      <a
        :href="`#${tarefa.reference}`"
        class="outline-none after:absolute after:inset-0 after:rounded-lg"
        @click.prevent="emit('abrir')"
      >
        <span class="block break-words" :class="linhasDoTitulo">{{ tarefa.name }}</span>
      </a>
    </h3>

    <!--
      A descrição corta sempre, em qualquer tamanho de cartão: cartão que
      cresce com o texto quebra a leitura da raia inteira. `break-words`
      porque descrição de spaceflow costuma trazer URL sem espaço.
    -->
    <p
      v-if="mostraDescricao"
      class="mt-1 break-words text-xs leading-relaxed text-muted"
      :class="linhasDaDescricao"
    >
      {{ descricao }}
    </p>

    <!-- Registro de origem: é ele que diz de qual chamado a tarefa veio -->
    <UTooltip v-if="campos.item && item" :text="dicaDoItem">
      <div class="mt-2 flex items-center gap-1.5 text-xs text-muted">
        <UIcon name="i-lucide-link" class="size-3.5 shrink-0 text-muted" />
        <span class="shrink-0 whitespace-nowrap font-medium text-toned">{{ item.codigo }}</span>
        <span class="truncate">{{ item.titulo }}</span>
      </div>
    </UTooltip>

    <!-- Etiquetas -->
    <div v-if="campos.etiquetas && tags.length" class="mt-2 flex flex-wrap gap-1">
      <UTooltip
        v-for="tag in tags.slice(0, 2)"
        :key="tag!.id"
        :text="dica(t.campos.etiquetas, tag!.nome)"
      >
        <UBadge :label="tag!.nome" :color="tag!.cor" variant="soft" size="sm" />
      </UTooltip>
      <UTooltip v-if="tags.length > 2" :text="dicaDasEtiquetasEscondidas">
        <UBadge :label="t.maisEtiquetas(tags.length - 2)" color="neutral" variant="soft" size="sm" />
      </UTooltip>
    </div>

    <!-- Rodapé do cartão: tudo que se lê de relance, numa linha só -->
    <div class="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1.5">
      <UTooltip
        v-if="campos.prioridade && tarefa.priority !== 'normal'"
        :text="dica(t.campos.prioridade, t.prioridade[tarefa.priority])"
      >
        <UBadge
          :label="t.prioridade[tarefa.priority]"
          :color="corDaPrioridade[tarefa.priority]"
          :icon="iconeDaPrioridade[tarefa.priority]"
          variant="subtle"
          size="sm"
        />
      </UTooltip>

      <UTooltip v-if="campos.prazo && tarefa.due_date && !atrasada" :text="dicaDoPrazo">
        <span
          class="flex items-center gap-1 text-xs"
          :class="prazo.cor === 'warning' ? 'font-medium text-warning' : 'text-muted'"
        >
          <UIcon name="i-lucide-calendar" class="size-3.5" />
          {{ prazo.texto }}
        </span>
      </UTooltip>

      <UTooltip v-if="campos.pontos && tarefa.points > 0" :text="dica(t.campos.pontos, t.pontos(tarefa.points))">
        <span class="flex items-center gap-1 rounded bg-elevated px-1.5 py-0.5 text-xs font-medium text-toned">
          <UIcon name="i-lucide-hash" class="size-3" />{{ tarefa.points }}
        </span>
      </UTooltip>

      <UTooltip v-if="temFormulario && campos.tipo" :text="t.temFormulario">
        <UIcon name="i-lucide-clipboard-pen" class="size-3.5 text-muted" />
      </UTooltip>

      <!--
        Tempo: o total apontado, e o cronômetro correndo quando é esta a
        tarefa que está contando. **Começar o cronômetro fica no menu ⋮**, não
        num botão solto: o cartão já tem selo, prazo, pontos e avatares na
        mesma linha, e mais um botão colorido ali vira ruído.
      -->
      <UTooltip
        v-if="campos.tempo && (tempo || cronometroAtivo)"
        :text="dica(t.campos.tempoRegistrado, formatarDuracao(tempo))"
      >
        <span
          class="flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-medium tabular-nums"
          :class="cronometroAtivo ? 'bg-error/10 text-error' : 'bg-elevated text-toned'"
        >
          <UIcon :name="cronometroAtivo ? 'i-lucide-circle-dot' : 'i-lucide-timer'" class="size-3" />
          {{ cronometroAtivo ? formatarCronometro(segundosCorrendo ?? 0) : formatarDuracao(tempo) }}
        </span>
      </UTooltip>

      <!-- Descrição desligada ou cortada: o ícone diz que existe mais texto -->
      <UTooltip v-if="soOIconeDaDescricao || (mostraDescricao && descricaoLonga)" :text="t.temDescricao">
        <UIcon name="i-lucide-align-left" class="size-3.5 text-muted" />
      </UTooltip>

      <!-- As três pessoas, sempre nesta ordem: criou, colabora, responde -->
      <div v-if="mostraPessoas" class="ml-auto flex shrink-0 items-center gap-2">
        <UTooltip
          v-if="campos.criador && criador && densidade !== 'pequeno'"
          :text="dica(t.campos.criadoPor, criador.fullname)"
        >
          <span class="flex items-center gap-1">
            <UIcon name="i-lucide-pen-line" class="size-3 shrink-0 text-muted" />
            <UAvatar size="2xs" :alt="criador.fullname" :text="criador.iniciais" />
          </span>
        </UTooltip>

        <UTooltip
          v-if="campos.colaboradores && colaboradores.length && densidade !== 'pequeno'"
          :text="dicaDosColaboradores"
        >
          <span class="flex items-center gap-1">
            <UIcon name="i-lucide-users" class="size-3 shrink-0 text-muted" />
            <UAvatarGroup size="2xs" :max="2">
              <UAvatar v-for="p in colaboradores" :key="p!.id" :alt="p!.fullname" :text="p!.iniciais" />
            </UAvatarGroup>
          </span>
        </UTooltip>

        <UTooltip
          v-if="campos.responsavel"
          :text="dica(t.campos.responsavel, responsavel?.fullname ?? t.semResponsavel)"
        >
          <UAvatar
            v-if="responsavel"
            size="xs"
            :alt="responsavel.fullname"
            :text="responsavel.iniciais"
          />
          <span
            v-else
            class="flex size-5 items-center justify-center rounded-full border border-dashed border-accented text-muted"
          >
            <UIcon name="i-lucide-user" class="size-3" />
          </span>
        </UTooltip>
      </div>
    </div>

    <!-- Ações secundárias: botão de verdade, acima do link esticado -->
    <UDropdownMenu v-if="!somenteLeitura" :items="itensDoMenu" :content="{ align: 'end' }">
      <UButton
        icon="i-lucide-ellipsis-vertical"
        color="neutral"
        variant="ghost"
        size="xs"
        :aria-label="t.acoesDaTarefa"
        class="absolute right-1.5 top-1.5 z-10 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
        @click.stop
      />
    </UDropdownMenu>
  </article>
</template>
