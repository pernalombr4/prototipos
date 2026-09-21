<script setup lang="ts">
/**
 * A quickview da tarefa: o painel lateral que abre ao clicar no cartão.
 *
 * ⚠️ A ESTRUTURA É A DE HOJE. É o componente padrão de painel lateral do
 * ENSPACE, com as mesmas peças nos mesmos lugares:
 *
 *   - painel à direita, altura inteira, canto esquerdo arredondado;
 *   - trilho de ícones na borda esquerda, um por campo, com o valor no hover,
 *     e o botão de expandir no pé do trilho;
 *   - expandido, o trilho vira a coluna de identidade: rótulo "Tarefa", ícone,
 *     título, selo da situação e a lista DETALHES com ícone por campo. Essa
 *     composição é a do produto, e ela é boa: o que mudou foi o acabamento;
 *   - abas no topo: Tarefa, Comentários, Logs de Auditoria;
 *   - corpo em seções com ícone e nome ("Descrição");
 *   - rodapé com guardar e concluir.
 *
 * O que muda são melhorias, listadas no DECISOES.md (rodadas 3 e 5). A maior
 * delas: **os cinco campos do formulário de criação se editam aqui**, que é o
 * que faltava para o painel resolver a tarefa sem mandar a pessoa para o menu
 * do cartão.
 */
import type { Task } from '@be-enlighten/enspace-sdk-schemas'
import type { CampoDeFormulario } from './mocks'
import { etiquetas as todasEtiquetas, hoje, itensRelacionados, pessoas } from './mocks'
import {
  corDaPrioridade, formatarDataHora, iconeDaPrioridade, iconeDoTipo, prazoLegivel,
  referenciaCurta,
} from './quadro'
import type { Textos } from './textos'

const props = defineProps<{
  tarefa: Task
  t: Textos
  somenteLeitura?: boolean
  /** Trilho expandido. O estado mora no pai porque muda a largura do painel. */
  expandido?: boolean
}>()

const emit = defineEmits<{
  fechar: []
  expandir: [valor: boolean]
  salvar: []
  concluir: [respostas: Record<string, unknown>]
  reabrir: []
  copiarReferencia: []
  atualizar: [campo: keyof Task, valor: unknown]
}>()

const aba = ref<'tarefa' | 'comentarios' | 'logs'>('tarefa')
const editandoDescricao = ref(false)
const editandoTitulo = ref(false)
/** Campo que acabou de ser pedido pelo trilho: acende por um instante. */
const campoEmFoco = ref<string | null>(null)

const concluida = computed(() => props.tarefa.status === 'completed')
const podeEditar = computed(() => !props.somenteLeitura && !concluida.value)

const responsavel = computed(() => props.tarefa.assigned_to ? pessoas[props.tarefa.assigned_to] : null)
const concluidaPor = computed(() => props.tarefa.completed_by ? pessoas[props.tarefa.completed_by] : null)
const item = computed(() => props.tarefa.item ? itensRelacionados[props.tarefa.item] : null)
const prazo = computed(() => prazoLegivel(props.tarefa, props.t))
const colaboradores = computed(() =>
  (props.tarefa.collaborators ?? []).map(id => pessoas[id]).filter(Boolean))
const tags = computed(() => {
  const ids = Array.isArray(props.tarefa.tag_ids) ? props.tarefa.tag_ids as number[] : []
  return ids.map(id => todasEtiquetas[id]).filter(Boolean)
})

const corDaSituacao = {
  pending: 'info', working: 'warning', blocked: 'error', completed: 'success',
} as const

/* ------------------------------ edição ------------------------------ */

/** `datetime-local` fala string; o mock fala Date. Estes dois traduzem. */
function paraCampoDeData(data: Date | string | null | undefined): string {
  if (!data) return ''
  const d = new Date(data)
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getUTCFullYear()}-${p(d.getUTCMonth() + 1)}-${p(d.getUTCDate())}T${p(d.getUTCHours())}:${p(d.getUTCMinutes())}`
}

function deCampoDeData(valor: string): Date | null {
  return valor ? new Date(`${valor}:00.000Z`) : null
}

const opcoesDePrioridade = computed(() =>
  (['urgent', 'high', 'normal', 'low'] as const).map(p => ({
    label: props.t.prioridade[p],
    value: p,
    icon: iconeDaPrioridade[p],
  })))

const opcoesDeResponsavel = computed(() => [
  { label: props.t.semResponsavel, value: 0 },
  ...Object.values(pessoas).map(p => ({ label: p.fullname, value: p.id })),
])

const tituloEmEdicao = ref('')

function abrirEdicaoDoTitulo() {
  if (!podeEditar.value) return
  tituloEmEdicao.value = props.tarefa.name
  editandoTitulo.value = true
}

function salvarTitulo() {
  editandoTitulo.value = false
  const novo = tituloEmEdicao.value.trim()
  if (novo && novo !== props.tarefa.name) emit('atualizar', 'name', novo)
}

/** Vindo do trilho: abre a coluna e acende o campo pedido. */
function editarPeloTrilho(chave: string) {
  emit('expandir', true)
  campoEmFoco.value = chave
  setTimeout(() => { campoEmFoco.value = null }, 1800)
}

/* ------------------------------------------------------------------ *
 * Os campos. Os cinco do formulário de criação são editáveis aqui.    *
 * ------------------------------------------------------------------ */
interface CampoDoPainel {
  chave: string
  icone: string
  rotulo: string
  valor: string
  detalhe?: string
  alerta?: boolean
  vazio?: boolean
  copiavel?: boolean
  /** Quando existe, a coluna expandida mostra controle no lugar do texto. */
  editavel?: 'responsavel' | 'prioridade' | 'prazo'
}

const campos = computed<CampoDoPainel[]>(() => {
  const t = props.t
  return [
    {
      chave: 'identificador',
      icone: 'i-lucide-hash',
      rotulo: t.campos.identificador,
      valor: `#${props.tarefa.id}`,
    },
    {
      chave: 'referencia',
      icone: 'i-lucide-fingerprint',
      rotulo: t.campos.referencia,
      valor: referenciaCurta(props.tarefa.reference),
      detalhe: props.tarefa.reference,
      copiavel: true,
    },
    {
      chave: 'item',
      icone: 'i-lucide-tag',
      rotulo: t.campos.item,
      valor: item.value ? item.value.codigo : '',
      detalhe: item.value?.titulo,
      vazio: !item.value,
    },
    {
      chave: 'responsavel',
      icone: 'i-lucide-user',
      rotulo: t.campos.responsavel,
      valor: responsavel.value?.fullname ?? '',
      vazio: !responsavel.value,
      editavel: 'responsavel',
    },
    {
      chave: 'prioridade',
      icone: iconeDaPrioridade[props.tarefa.priority],
      rotulo: t.campos.prioridade,
      valor: t.prioridade[props.tarefa.priority],
      alerta: props.tarefa.priority === 'urgent',
      editavel: 'prioridade',
    },
    {
      chave: 'prazo',
      icone: 'i-lucide-calendar-clock',
      rotulo: t.campos.prazo,
      valor: props.tarefa.due_date ? formatarDataHora(props.tarefa.due_date) : '',
      detalhe: props.tarefa.due_date ? prazo.value.texto : undefined,
      alerta: prazo.value.urgente,
      vazio: !props.tarefa.due_date,
      editavel: 'prazo',
    },
    {
      chave: 'pontos',
      icone: 'i-lucide-chart-no-axes-column',
      rotulo: t.campos.pontos,
      valor: props.tarefa.points > 0 ? t.pontos(props.tarefa.points) : '',
      vazio: props.tarefa.points === 0,
    },
    {
      chave: 'tipo',
      icone: iconeDoTipo[props.tarefa.type],
      rotulo: t.campos.tipo,
      valor: t.tipo[props.tarefa.type],
    },
    {
      chave: 'etiquetas',
      icone: 'i-lucide-tags',
      rotulo: t.campos.etiquetas,
      valor: tags.value.map(x => x!.nome).join(', '),
      vazio: !tags.value.length,
    },
    {
      chave: 'colaboradores',
      icone: 'i-lucide-users',
      rotulo: t.campos.colaboradores,
      valor: colaboradores.value.map(x => x!.fullname).join(', '),
      vazio: !colaboradores.value.length,
    },
    {
      chave: 'concluidoEm',
      icone: 'i-lucide-calendar-check',
      rotulo: t.campos.concluidoEm,
      valor: props.tarefa.completed_at ? formatarDataHora(props.tarefa.completed_at) : '',
      detalhe: concluidaPor.value?.fullname,
      vazio: !props.tarefa.completed_at,
    },
    {
      chave: 'criadoEm',
      icone: 'i-lucide-calendar-plus',
      rotulo: t.campos.criadoEm,
      valor: formatarDataHora(props.tarefa.created_at),
    },
    {
      chave: 'atualizadoEm',
      icone: 'i-lucide-history',
      rotulo: t.campos.atualizadoEm,
      valor: formatarDataHora(props.tarefa.updated_at),
    },
  ]
})

/* ------------------------- o formulário da tarefa ------------------------- */

const meta = computed(() => (props.tarefa.meta ?? {}) as Record<string, unknown>)

const camposDoFormulario = computed<CampoDeFormulario[]>(() =>
  Array.isArray(meta.value.form) ? meta.value.form as CampoDeFormulario[] : [])

const formularioPorReferencia = computed(() =>
  typeof meta.value.form === 'string' ? meta.value.form as string : null)

const resultado = computed(() =>
  (meta.value.form_result ?? null) as Record<string, unknown> | null)

const respostas = reactive<Record<string, unknown>>({})

/** A condicional do payload aponta para outro campo com `%nome_do_campo%`. */
function campoVisivel(campo: CampoDeFormulario): boolean {
  const ors = campo.conditionals?.or ?? []
  if (!ors.length) return true
  return ors.some((c) => {
    const alvo = c.ref.replaceAll('%', '')
    const valor = respostas[alvo]
    return c.op === '==' ? valor === c.value : valor !== c.value
  })
}

const camposVisiveis = computed(() => camposDoFormulario.value.filter(campoVisivel))

const podeConcluir = computed(() =>
  camposVisiveis.value.every(c => !c.validation?.includes('required') || !!respostas[c.refId]))

function rotuloDaResposta(chave: string): string {
  const campo = camposDoFormulario.value.find(c => c.refId === chave)
  if (campo) return campo.label
  return chave.replaceAll('_rel', '').replaceAll('_', ' ')
}

function valorDaResposta(valor: unknown): string {
  if (valor && typeof valor === 'object' && 'display' in (valor as Record<string, unknown>)) {
    return String((valor as Record<string, unknown>).display)
  }
  const campo = camposDoFormulario.value.find(c => c.options?.some(o => o.value === valor))
  const opcao = campo?.options?.find(o => o.value === valor)
  return opcao?.label ?? String(valor)
}

/* --------------------------------- histórico --------------------------------- */

const historico = computed(() => {
  const criador = props.tarefa.creator ? pessoas[props.tarefa.creator] : null
  const linhas: { chave: string, pessoa: typeof criador, acao: string, frase: string, data: Date }[] = []
  if (criador) {
    linhas.push({
      chave: 'criou',
      pessoa: criador,
      acao: props.t.logCriou,
      frase: props.t.logCriouFrase(criador.fullname),
      data: new Date(props.tarefa.created_at),
    })
  }
  if (props.tarefa.completed_at && concluidaPor.value) {
    linhas.push({
      chave: 'concluiu',
      pessoa: concluidaPor.value,
      acao: props.t.logConcluiu,
      frase: props.t.logConcluiuFrase(concluidaPor.value.fullname),
      data: new Date(props.tarefa.completed_at),
    })
  }
  return linhas.reverse()
})

function tempoRelativo(data: Date): string {
  const horas = Math.max(0, Math.round((hoje.getTime() - data.getTime()) / 3_600_000))
  // Acima de um dia, hora deixa de dizer alguma coisa: "há 101 horas" não se lê.
  return horas < 24 ? props.t.haHoras(horas) : props.t.haDias(Math.round(horas / 24))
}

const comentario = ref('')

const abas = computed(() => [
  { chave: 'tarefa' as const, rotulo: props.t.abaTarefa, icone: 'i-lucide-layers' },
  { chave: 'comentarios' as const, rotulo: props.t.abaComentarios, icone: 'i-lucide-message-circle' },
  { chave: 'logs' as const, rotulo: props.t.abaLogs, icone: 'i-lucide-shield-check' },
])
</script>

<template>
  <div class="flex h-full">
    <!-- ─────────── Trilho de campos, na borda esquerda (como hoje) ─────────── -->
    <div
      v-if="!expandido"
      class="flex w-12 shrink-0 flex-col items-center border-r border-default py-3"
    >
      <div class="flex min-h-0 flex-1 flex-col items-center gap-0.5 overflow-y-auto">
        <UPopover
          v-for="campo in campos"
          :key="campo.chave"
          mode="hover"
          :open-delay="120"
          :content="{ side: 'left', align: 'start' }"
        >
          <button
            type="button"
            class="flex size-8 items-center justify-center rounded-md transition-colors hover:bg-elevated"
            :class="campo.vazio ? 'text-dimmed' : campo.alerta ? 'text-error' : 'text-toned'"
            :aria-label="`${campo.rotulo}: ${campo.valor || '-'}`"
          >
            <UIcon :name="campo.icone" class="size-4" />
          </button>

          <template #content>
            <div class="max-w-72 px-3 py-2">
              <p class="flex items-center gap-1.5 text-xs text-muted">
                <UIcon :name="campo.icone" class="size-3.5" />
                {{ campo.rotulo }}
              </p>
              <p
                class="mt-0.5 break-words text-sm font-medium"
                :class="campo.alerta ? 'text-error' : 'text-highlighted'"
              >
                {{ campo.valor || '-' }}
              </p>
              <p v-if="campo.detalhe" class="mt-0.5 break-all text-xs text-muted">
                {{ campo.detalhe }}
              </p>
              <div class="-ms-1.5 mt-1 flex gap-1">
                <UButton
                  v-if="campo.copiavel"
                  :label="t.copiarReferencia"
                  icon="i-lucide-copy"
                  size="xs"
                  color="neutral"
                  variant="ghost"
                  @click="emit('copiarReferencia')"
                />
                <UButton
                  v-if="campo.editavel && podeEditar"
                  :label="t.editarCampo"
                  icon="i-lucide-pencil"
                  size="xs"
                  color="primary"
                  variant="ghost"
                  @click="editarPeloTrilho(campo.chave)"
                />
              </div>
            </div>
          </template>
        </UPopover>
      </div>

      <UButton
        icon="i-lucide-chevrons-right"
        color="neutral"
        variant="soft"
        size="xs"
        class="mt-2"
        :aria-label="t.expandir"
        @click="emit('expandir', true)"
      />
    </div>

    <!-- ─────────── Coluna de identidade e detalhes (trilho expandido) ─────────── -->
    <div
      v-else
      class="flex w-72 shrink-0 flex-col border-r border-default"
      style="animation: entrada .25s ease-out both"
    >
      <!-- A identidade da tarefa, como o produto monta: ícone, título, selo -->
      <div class="border-b border-default px-4 pb-4 pt-4">
        <p class="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
          {{ t.abaTarefa }}
        </p>

        <div
          class="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary"
        >
          <UIcon :name="iconeDoTipo[tarefa.type]" class="size-6" />
        </div>

        <div v-if="editandoTitulo" class="mt-3">
          <UInput
            v-model="tituloEmEdicao"
            size="sm"
            class="w-full"
            autofocus
            @blur="salvarTitulo"
            @keydown.enter="salvarTitulo"
            @keydown.esc="editandoTitulo = false"
          />
        </div>
        <button
          v-else
          type="button"
          class="group mt-3 block w-full rounded-md px-1 py-0.5 text-center text-base font-semibold leading-snug text-highlighted transition-colors"
          :class="podeEditar ? 'hover:bg-elevated' : 'cursor-default'"
          :aria-label="podeEditar ? t.editarTitulo : undefined"
          @click="abrirEdicaoDoTitulo"
        >
          {{ tarefa.name }}
          <UIcon
            v-if="podeEditar"
            name="i-lucide-pencil"
            class="ml-1 inline size-3 align-middle text-dimmed opacity-0 transition-opacity group-hover:opacity-100"
          />
        </button>

        <p class="mt-1 text-center font-mono text-xs text-muted">
          {{ referenciaCurta(tarefa.reference) }}
        </p>

        <div class="mt-3 flex flex-wrap justify-center gap-1.5">
          <UBadge
            :label="t.status[tarefa.status]"
            :color="corDaSituacao[tarefa.status]"
            variant="subtle"
            size="sm"
          />
          <UBadge
            v-if="tarefa.priority !== 'normal'"
            :label="t.prioridade[tarefa.priority]"
            :color="corDaPrioridade[tarefa.priority]"
            :icon="iconeDaPrioridade[tarefa.priority]"
            variant="subtle"
            size="sm"
          />
          <UBadge
            v-if="tarefa.notification_task"
            :label="t.campos.notificacao"
            icon="i-lucide-bell"
            color="neutral"
            variant="subtle"
            size="sm"
          />
        </div>
      </div>

      <p class="px-4 pb-1 pt-3 text-xs font-semibold uppercase tracking-wide text-muted">
        {{ t.detalhes }}
      </p>

      <dl class="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 pb-2">
        <div
          v-for="campo in campos"
          :key="campo.chave"
          class="rounded-md transition-shadow"
          :class="campoEmFoco === campo.chave ? 'ring-2 ring-primary/50' : ''"
        >
          <dt class="flex items-center gap-1.5 text-xs text-muted">
            <UIcon :name="campo.icone" class="size-3.5" />
            {{ campo.rotulo }}
          </dt>

          <!-- Os três campos de escolha viram controle, não texto -->
          <dd v-if="campo.editavel === 'responsavel' && podeEditar" class="mt-1">
            <USelect
              :model-value="tarefa.assigned_to ?? 0"
              :items="opcoesDeResponsavel"
              value-key="value"
              size="sm"
              class="w-full"
              @update:model-value="(v) => emit('atualizar', 'assigned_to', v === 0 ? null : v)"
            />
          </dd>
          <dd v-else-if="campo.editavel === 'prioridade' && podeEditar" class="mt-1">
            <USelect
              :model-value="tarefa.priority"
              :items="opcoesDePrioridade"
              value-key="value"
              size="sm"
              class="w-full"
              :icon="iconeDaPrioridade[tarefa.priority]"
              @update:model-value="(v) => emit('atualizar', 'priority', v)"
            />
          </dd>
          <dd v-else-if="campo.editavel === 'prazo' && podeEditar" class="mt-1">
            <UInput
              type="datetime-local"
              :model-value="paraCampoDeData(tarefa.due_date)"
              size="sm"
              class="w-full"
              @update:model-value="(v) => emit('atualizar', 'due_date', deCampoDeData(String(v)))"
            />
            <p v-if="campo.detalhe" class="mt-0.5 text-xs" :class="campo.alerta ? 'text-error' : 'text-muted'">
              {{ campo.detalhe }}
            </p>
          </dd>

          <dd
            v-else
            class="mt-0.5 break-words text-sm"
            :class="campo.vazio ? 'text-dimmed' : campo.alerta ? 'font-medium text-error' : 'text-highlighted'"
          >
            {{ campo.valor || '-' }}
            <span v-if="campo.detalhe && campo.chave !== 'referencia'" class="block text-xs text-muted">
              {{ campo.detalhe }}
            </span>
          </dd>
        </div>
      </dl>

      <UButton
        icon="i-lucide-chevrons-left"
        :label="t.recolher"
        color="neutral"
        variant="ghost"
        size="xs"
        class="m-2 justify-start"
        @click="emit('expandir', false)"
      />
    </div>

    <!-- ─────────────────────── Conteúdo ─────────────────────── -->
    <div class="flex min-w-0 flex-1 flex-col">
      <!-- Abas, no topo, como hoje -->
      <div class="flex shrink-0 items-center gap-1 border-b border-default px-3">
        <button
          v-for="a in abas"
          :key="a.chave"
          type="button"
          class="flex items-center gap-1.5 border-b-2 px-2.5 py-2.5 text-sm transition-colors"
          :class="aba === a.chave
            ? 'border-primary font-medium text-highlighted'
            : 'border-transparent text-muted hover:text-toned'"
          :aria-current="aba === a.chave ? 'page' : undefined"
          @click="aba = a.chave"
        >
          <UIcon :name="a.icone" class="size-4" />
          {{ a.rotulo }}
        </button>

        <!-- Fechar: hoje o painel só sai no Esc ou clicando fora -->
        <UButton
          icon="i-lucide-x"
          color="neutral"
          variant="ghost"
          size="xs"
          class="ml-auto"
          :aria-label="t.fechar"
          @click="emit('fechar')"
        />
      </div>

      <div class="min-h-0 flex-1 overflow-y-auto">
        <template v-if="aba === 'tarefa'">
          <!--
            Cabeçalho só no estado recolhido: expandido, a identidade mora na
            coluna da esquerda, e repetir o título aqui era o defeito de hoje.
          -->
          <header v-if="!expandido" class="px-5 pb-3 pt-4">
            <div class="flex items-start gap-3">
              <div v-if="editandoTitulo" class="min-w-0 flex-1">
                <UInput
                  v-model="tituloEmEdicao"
                  size="md"
                  class="w-full"
                  autofocus
                  @blur="salvarTitulo"
                  @keydown.enter="salvarTitulo"
                  @keydown.esc="editandoTitulo = false"
                />
              </div>
              <button
                v-else
                type="button"
                class="group min-w-0 flex-1 rounded-md px-1 py-0.5 text-left text-lg font-semibold leading-snug text-highlighted transition-colors"
                :class="podeEditar ? 'hover:bg-elevated' : 'cursor-default'"
                :aria-label="podeEditar ? t.editarTitulo : undefined"
                @click="abrirEdicaoDoTitulo"
              >
                {{ tarefa.name }}
                <UIcon
                  v-if="podeEditar"
                  name="i-lucide-pencil"
                  class="ml-1 inline size-3.5 align-middle text-dimmed opacity-0 transition-opacity group-hover:opacity-100"
                />
              </button>

              <UBadge
                :label="t.status[tarefa.status]"
                :color="corDaSituacao[tarefa.status]"
                variant="subtle"
                size="sm"
                class="mt-1.5 shrink-0"
              />
            </div>

            <dl class="mt-2 space-y-1">
              <div class="flex items-center gap-2 text-sm">
                <dt class="flex items-center gap-1.5 text-muted">
                  <UIcon name="i-lucide-calendar-clock" class="size-3.5" />
                  {{ t.campos.prazo }}
                </dt>
                <dd :class="prazo.urgente ? 'font-medium text-error' : 'text-toned'">
                  {{ tarefa.due_date ? formatarDataHora(tarefa.due_date) : t.semPrazo }}
                  <span v-if="tarefa.due_date && prazo.urgente">({{ prazo.texto }})</span>
                </dd>
                <UButton
                  v-if="podeEditar"
                  icon="i-lucide-pencil"
                  color="neutral"
                  variant="ghost"
                  size="xs"
                  :aria-label="t.editarCampo"
                  @click="editarPeloTrilho('prazo')"
                />
              </div>
              <div class="flex items-center gap-2 text-sm">
                <dt class="flex items-center gap-1.5 text-muted">
                  <UIcon name="i-lucide-fingerprint" class="size-3.5" />
                  {{ t.campos.referencia }}
                </dt>
                <dd class="flex items-center gap-1 font-mono text-toned">
                  {{ referenciaCurta(tarefa.reference) }}
                  <UButton
                    icon="i-lucide-copy"
                    color="neutral"
                    variant="ghost"
                    size="xs"
                    :aria-label="t.copiarReferencia"
                    @click="emit('copiarReferencia')"
                  />
                </dd>
              </div>
            </dl>
          </header>

          <!-- Seção Descrição, com ícone e nome, como hoje -->
          <section class="px-5 pb-4" :class="expandido ? 'pt-4' : ''">
            <h3 class="mb-2 flex items-center gap-1.5 text-sm font-medium text-highlighted">
              <UIcon name="i-lucide-file-text" class="size-4 text-muted" />
              {{ t.campos.descricao }}
            </h3>

            <div
              class="rounded-lg border border-default transition-colors focus-within:border-accented hover:border-accented"
              @click="podeEditar && (editandoDescricao = true)"
            >
              <div
                v-if="editandoDescricao && podeEditar"
                class="flex items-center gap-0.5 border-b border-default px-2 py-1"
                style="animation: entrada .2s ease-out both"
              >
                <UButton
                  v-for="f in ['i-lucide-undo-2', 'i-lucide-redo-2', 'i-lucide-bold', 'i-lucide-italic', 'i-lucide-underline', 'i-lucide-strikethrough', 'i-lucide-code', 'i-lucide-list', 'i-lucide-link']"
                  :key="f"
                  :icon="f"
                  color="neutral"
                  variant="ghost"
                  size="xs"
                  :aria-label="t.campos.descricao"
                />
              </div>
              <div v-if="tarefa.description" class="markdown px-3 py-2 text-sm" v-html="tarefa.description" />
              <p v-else class="px-3 py-2 text-sm text-muted">{{ t.semDescricao }}</p>
            </div>
          </section>

          <!-- Formulário da tarefa -->
          <section v-if="camposDoFormulario.length && !concluida" class="px-5 pb-4">
            <h3 class="mb-2 flex items-center gap-1.5 text-sm font-medium text-highlighted">
              <UIcon name="i-lucide-clipboard-list" class="size-4 text-muted" />
              {{ t.formulario }}
            </h3>
            <div class="space-y-4 rounded-lg border border-default p-4">
              <div v-for="campo in camposVisiveis" :key="campo.refId">
                <label class="mb-1 block text-sm font-medium text-highlighted">
                  {{ campo.label }}
                  <span v-if="campo.validation?.includes('required')" class="text-xs font-normal text-error">
                    ({{ t.obrigatorio }})
                  </span>
                </label>
                <USelect
                  v-if="campo.type === 'EnlDropdown'"
                  :model-value="respostas[campo.refId]"
                  :items="campo.options ?? []"
                  value-key="value"
                  :placeholder="t.selecione"
                  :disabled="somenteLeitura"
                  size="sm"
                  class="w-full"
                  @update:model-value="(v) => respostas[campo.refId] = v"
                />
                <UInput
                  v-else-if="campo.type === 'EnlNumber'"
                  type="number"
                  :model-value="(respostas[campo.refId] as number)"
                  :placeholder="campo.cFormat?.n_style === 'currency' ? '0,00' : '0'"
                  :disabled="somenteLeitura"
                  size="sm"
                  class="w-full"
                  @update:model-value="(v) => respostas[campo.refId] = Number(v)"
                >
                  <template v-if="campo.cFormat?.n_style === 'currency'" #leading>
                    <span class="text-xs text-muted">R$</span>
                  </template>
                </UInput>
                <UTextarea
                  v-else
                  :model-value="(respostas[campo.refId] as string) ?? ''"
                  :placeholder="t.escreva"
                  :rows="3"
                  :disabled="somenteLeitura"
                  size="sm"
                  class="w-full"
                  @update:model-value="(v) => respostas[campo.refId] = v"
                />
              </div>
            </div>
          </section>

          <section v-else-if="formularioPorReferencia && !concluida" class="px-5 pb-4">
            <h3 class="mb-2 flex items-center gap-1.5 text-sm font-medium text-highlighted">
              <UIcon name="i-lucide-square-pen" class="size-4 text-muted" />
              {{ t.formulario }}
            </h3>
            <div class="flex items-center gap-3 rounded-lg border border-dashed border-default p-4">
              <p class="flex-1 text-sm text-muted">{{ t.tipo.crud }}</p>
              <UButton :label="t.abrirTarefa" size="xs" color="primary" variant="soft" />
            </div>
          </section>

          <!-- O que foi respondido, quando a tarefa já fechou -->
          <section v-if="concluida && resultado" class="px-5 pb-4">
            <h3 class="mb-2 flex items-center gap-1.5 text-sm font-medium text-highlighted">
              <UIcon name="i-lucide-clipboard-check" class="size-4 text-muted" />
              {{ t.resultado }}
            </h3>
            <dl class="divide-y divide-default rounded-lg border border-default">
              <div v-for="(valor, chave) in resultado" :key="chave" class="px-4 py-2.5">
                <dt class="text-xs text-muted first-letter:uppercase">{{ rotuloDaResposta(String(chave)) }}</dt>
                <dd class="mt-0.5 text-sm font-medium text-highlighted">{{ valorDaResposta(valor) }}</dd>
              </div>
            </dl>
          </section>
        </template>

        <UEmpty
          v-else-if="aba === 'comentarios'"
          icon="i-lucide-message-circle"
          :title="t.comentariosVazios"
          class="py-12"
        />

        <!-- Histórico: a mesma linha do tempo do develop -->
        <div v-else class="px-5 py-4">
          <div v-if="!historico.length" class="py-8">
            <UEmpty icon="i-lucide-shield-check" :title="t.logsVazios" />
          </div>
          <ol v-else class="space-y-4">
            <li v-for="linha in historico" :key="linha.chave" class="flex gap-3">
              <span class="mt-1.5 size-2 shrink-0 rounded-full bg-success" />
              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-1.5">
                  <UAvatar size="2xs" :text="linha.pessoa!.iniciais" :alt="linha.pessoa!.fullname" />
                  <UBadge :label="linha.acao" color="success" variant="subtle" size="sm" />
                </div>
                <p class="mt-1 text-sm text-highlighted">{{ linha.frase }}</p>
              </div>
              <div class="shrink-0 text-right">
                <p class="text-xs text-muted">{{ formatarDataHora(linha.data) }}</p>
                <p class="text-xs text-muted">{{ tempoRelativo(linha.data) }}</p>
              </div>
            </li>
          </ol>
        </div>
      </div>

      <!-- Na aba de comentários o rodapé é o compositor, como no produto -->
      <footer
        v-if="aba === 'comentarios'"
        class="flex shrink-0 items-end gap-2 border-t border-default px-5 py-3"
      >
        <UTextarea
          v-model="comentario"
          :placeholder="t.comentarioPlaceholder"
          :rows="2"
          autoresize
          :disabled="somenteLeitura"
          size="sm"
          class="flex-1"
        />
        <UButton
          icon="i-lucide-send"
          color="primary"
          variant="ghost"
          size="sm"
          :disabled="somenteLeitura || !comentario.trim()"
          :aria-label="t.enviarComentario"
        />
      </footer>

      <!-- Rodapé com as duas ações, como hoje -->
      <footer v-else class="flex shrink-0 items-center gap-2 border-t border-default px-5 py-3">
        <p v-if="concluida" class="flex-1 text-sm text-muted">{{ t.tarefaConcluida }}</p>
        <p v-else-if="camposVisiveis.length && !podeConcluir" class="flex-1 text-xs text-muted">
          {{ t.faltaResponder }}
        </p>
        <span v-else class="flex-1" />

        <UButton
          v-if="!concluida"
          :label="t.salvarRascunho"
          color="neutral"
          variant="outline"
          size="sm"
          :disabled="somenteLeitura"
          @click="emit('salvar')"
        />
        <UButton
          v-if="concluida"
          :label="t.reabrirTarefa"
          color="neutral"
          variant="outline"
          size="sm"
          :disabled="somenteLeitura"
          @click="emit('reabrir')"
        />
        <UButton
          v-else
          :label="t.concluirTarefa"
          color="primary"
          size="sm"
          icon="i-lucide-check"
          :disabled="somenteLeitura || !podeConcluir"
          @click="emit('concluir', { ...respostas })"
        />
      </footer>
    </div>
  </div>
</template>
