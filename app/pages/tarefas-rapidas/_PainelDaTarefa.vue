<script setup lang="ts">
/**
 * O cartão aberto.
 *
 * Hoje o painel mostra sete campos (id, ticket, responsável, data limite,
 * concluída em, criado em, atualizado em) e esconde justamente os que a pessoa
 * usa para decidir: prioridade, pontos, tipo e o formulário que a tarefa pede.
 * Aqui todo campo do payload aparece, separado em três camadas: o que se
 * decide, o que se responde e o que é rastro técnico.
 */
import type { Task } from '@be-enlighten/enspace-sdk-schemas'
import type { CampoDeFormulario } from './mocks'
import { etiquetas as todasEtiquetas, itensRelacionados, pessoas } from './mocks'
import {
  corDaPrioridade, formatarDataHora, iconeDaPrioridade, iconeDoTipo, prazoLegivel,
} from './quadro'
import type { Textos } from './textos'

const props = defineProps<{
  tarefa: Task
  t: Textos
  somenteLeitura?: boolean
}>()

const emit = defineEmits<{
  fechar: []
  salvar: []
  concluir: [respostas: Record<string, unknown>]
  reabrir: []
  atualizar: [campo: keyof Task, valor: unknown]
}>()

const aba = ref<'tarefa' | 'comentarios' | 'logs'>('tarefa')
const tecnicosAbertos = ref(false)

const concluida = computed(() => props.tarefa.status === 'completed')
const responsavel = computed(() => props.tarefa.assigned_to ? pessoas[props.tarefa.assigned_to] : null)
const criador = computed(() => props.tarefa.creator ? pessoas[props.tarefa.creator] : null)
const concluidaPor = computed(() => props.tarefa.completed_by ? pessoas[props.tarefa.completed_by] : null)
const item = computed(() => props.tarefa.item ? itensRelacionados[props.tarefa.item] : null)
const prazo = computed(() => prazoLegivel(props.tarefa, props.t))
const colaboradores = computed(() =>
  (props.tarefa.collaborators ?? []).map(id => pessoas[id]).filter(Boolean))
const tags = computed(() => {
  const ids = Array.isArray(props.tarefa.tag_ids) ? props.tarefa.tag_ids as number[] : []
  return ids.map(id => todasEtiquetas[id]).filter(Boolean)
})

const meta = computed(() => (props.tarefa.meta ?? {}) as Record<string, unknown>)

/** `meta.form` é array quando o formulário foi desenhado no nó do fluxo. */
const camposDoFormulario = computed<CampoDeFormulario[]>(() =>
  Array.isArray(meta.value.form) ? meta.value.form as CampoDeFormulario[] : [])

/** Quando é `crud`, `meta.form` é só a referência do formulário de ação cadastrado. */
const formularioPorReferencia = computed(() =>
  typeof meta.value.form === 'string' ? meta.value.form as string : null)

const resultado = computed(() =>
  (meta.value.form_result ?? null) as Record<string, unknown> | null)

/* ------------------------- o formulário da tarefa ------------------------- */

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

/* ------------------------------- opções ------------------------------- */

const opcoesDeStatus = computed(() =>
  (['pending', 'working', 'blocked', 'completed'] as const).map(s => ({ label: props.t.status[s], value: s })))

const opcoesDePrioridade = computed(() =>
  (['urgent', 'high', 'normal', 'low'] as const).map(p => ({ label: props.t.prioridade[p], value: p })))

/** Rótulo legível para a chave crua que vem no `form_result`. */
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
</script>

<template>
  <div class="flex h-full flex-col">
    <!-- Cabeçalho: identidade e situação, no mesmo lugar -->
    <header class="border-b border-default px-5 pb-3 pt-4">
      <div class="mb-2 flex items-center gap-2">
        <UIcon :name="iconeDoTipo[tarefa.type]" class="size-4 text-dimmed" />
        <span class="text-xs font-medium text-muted">{{ t.tipo[tarefa.type] }}</span>
        <UTooltip :text="tarefa.reference">
          <button
            type="button"
            class="font-mono text-xs text-muted transition-colors hover:text-highlighted"
            @click="emit('atualizar', 'reference', tarefa.reference)"
          >
            {{ tarefa.reference.slice(0, 8) }}
          </button>
        </UTooltip>

        <UBadge
          v-if="tarefa.notification_task"
          :label="t.campos.notificacao"
          icon="i-lucide-bell"
          color="neutral"
          variant="subtle"
          size="sm"
        />

        <UButton
          icon="i-lucide-x"
          color="neutral"
          variant="ghost"
          size="sm"
          class="ml-auto"
          :aria-label="t.fechar"
          @click="emit('fechar')"
        />
      </div>

      <h2 class="text-lg font-semibold leading-snug text-highlighted">{{ tarefa.name }}</h2>

      <div class="mt-3 flex flex-wrap items-center gap-2">
        <USelect
          :model-value="tarefa.status"
          :items="opcoesDeStatus"
          value-key="value"
          size="sm"
          :disabled="somenteLeitura"
          class="w-40"
          @update:model-value="(v) => emit('atualizar', 'status', v)"
        />
        <USelect
          :model-value="tarefa.priority"
          :items="opcoesDePrioridade"
          value-key="value"
          size="sm"
          :disabled="somenteLeitura"
          class="w-36"
          :icon="iconeDaPrioridade[tarefa.priority]"
          @update:model-value="(v) => emit('atualizar', 'priority', v)"
        />
        <UBadge
          v-if="tarefa.priority !== 'normal'"
          :label="t.prioridade[tarefa.priority]"
          :color="corDaPrioridade[tarefa.priority]"
          variant="subtle"
          size="sm"
        />
      </div>
    </header>

    <div class="flex gap-1 border-b border-default px-4">
      <UButton
        v-for="a in ([['tarefa', t.abaTarefa], ['comentarios', t.abaComentarios], ['logs', t.abaLogs]] as const)"
        :key="a[0]"
        :label="a[1]"
        size="sm"
        color="neutral"
        variant="ghost"
        class="rounded-none border-b-2"
        :class="aba === a[0] ? 'border-primary text-highlighted' : 'border-transparent text-muted'"
        @click="aba = a[0]"
      />
    </div>

    <div class="flex-1 overflow-y-auto px-5 py-4">
      <template v-if="aba === 'tarefa'">
        <!-- Camada 1: o que se decide -->
        <dl class="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3">
          <div>
            <dt class="text-xs text-muted">{{ t.campos.responsavel }}</dt>
            <dd class="mt-0.5 flex items-center gap-1.5 text-sm text-highlighted">
              <UAvatar v-if="responsavel" size="2xs" :text="responsavel.iniciais" :alt="responsavel.fullname" />
              {{ responsavel?.fullname ?? t.semResponsavel }}
            </dd>
          </div>
          <div>
            <dt class="text-xs text-muted">{{ t.campos.prazo }}</dt>
            <dd
              class="mt-0.5 text-sm"
              :class="prazo.cor === 'error' ? 'font-medium text-error' : prazo.cor === 'warning' ? 'font-medium text-warning' : 'text-highlighted'"
            >
              {{ tarefa.due_date ? formatarDataHora(tarefa.due_date) : t.semPrazo }}
              <span v-if="prazo.urgente" class="block text-xs">{{ prazo.texto }}</span>
            </dd>
          </div>
          <div>
            <dt class="text-xs text-muted">{{ t.campos.pontos }}</dt>
            <dd class="mt-0.5 text-sm text-highlighted">
              {{ tarefa.points > 0 ? t.pontos(tarefa.points) : '0' }}
            </dd>
          </div>
          <div>
            <dt class="text-xs text-muted">{{ t.campos.criadoPor }}</dt>
            <dd class="mt-0.5 text-sm text-highlighted">{{ criador?.fullname ?? '' }}</dd>
          </div>
          <div>
            <dt class="text-xs text-muted">{{ t.campos.criadoEm }}</dt>
            <dd class="mt-0.5 text-sm text-highlighted">{{ formatarDataHora(tarefa.created_at) }}</dd>
          </div>
          <div v-if="concluida">
            <dt class="text-xs text-muted">{{ t.campos.concluidoEm }}</dt>
            <dd class="mt-0.5 text-sm text-highlighted">
              {{ formatarDataHora(tarefa.completed_at) }}
              <span v-if="concluidaPor" class="block text-xs text-muted">{{ concluidaPor.fullname }}</span>
            </dd>
          </div>
          <div v-if="colaboradores.length">
            <dt class="text-xs text-muted">{{ t.campos.colaboradores }}</dt>
            <dd class="mt-0.5">
              <UAvatarGroup size="2xs" :max="4">
                <UAvatar v-for="p in colaboradores" :key="p!.id" :text="p!.iniciais" :alt="p!.fullname" />
              </UAvatarGroup>
            </dd>
          </div>
          <div v-if="tags.length">
            <dt class="text-xs text-muted">{{ t.campos.etiquetas }}</dt>
            <dd class="mt-0.5 flex flex-wrap gap-1">
              <UBadge v-for="tag in tags" :key="tag!.id" :label="tag!.nome" :color="tag!.cor" variant="soft" size="sm" />
            </dd>
          </div>
        </dl>

        <!-- O registro de origem, que hoje aparece como "Ticket: -" -->
        <div v-if="item" class="mt-4 flex items-center gap-3 rounded-lg border border-default bg-elevated/40 p-3">
          <UIcon name="i-lucide-link" class="size-4 shrink-0 text-dimmed" />
          <div class="min-w-0 flex-1">
            <p class="text-xs text-muted">{{ item.categoria }}</p>
            <p class="truncate text-sm font-medium text-highlighted">
              {{ item.codigo }} {{ item.titulo }}
            </p>
          </div>
          <UButton :label="t.verChamado" size="xs" color="neutral" variant="outline" trailing-icon="i-lucide-arrow-up-right" />
        </div>

        <!-- Descrição -->
        <section class="mt-5">
          <h3 class="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">{{ t.campos.descricao }}</h3>
          <div v-if="tarefa.description" class="markdown text-sm" v-html="tarefa.description" />
          <p v-else class="text-sm text-muted">{{ t.semDescricao }}</p>
        </section>

        <!-- Camada 2: o que se responde -->
        <section v-if="camposDoFormulario.length && !concluida" class="mt-6">
          <h3 class="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">{{ t.formulario }}</h3>
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
                @update:model-value="(v) => respostas[campo.refId] = v"
              />
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

        <section v-else-if="formularioPorReferencia && !concluida" class="mt-6">
          <h3 class="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">{{ t.formulario }}</h3>
          <div class="flex items-center gap-3 rounded-lg border border-dashed border-default p-4">
            <UIcon name="i-lucide-square-pen" class="size-4 text-dimmed" />
            <p class="flex-1 text-sm text-muted">{{ t.tipo.crud }}</p>
            <UButton :label="t.abrirTarefa" size="xs" color="primary" variant="soft" />
          </div>
        </section>

        <section v-else-if="!concluida" class="mt-6">
          <p class="rounded-lg border border-dashed border-default p-4 text-sm text-muted">
            {{ t.semFormulario }}
          </p>
        </section>

        <!-- O que foi respondido, quando a tarefa já fechou -->
        <section v-if="concluida && resultado" class="mt-6">
          <h3 class="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">{{ t.resultado }}</h3>
          <dl class="divide-y divide-default rounded-lg border border-default">
            <div v-for="(valor, chave) in resultado" :key="chave" class="flex gap-4 px-4 py-2.5">
              <dt class="w-1/2 text-sm text-muted first-letter:uppercase">{{ rotuloDaResposta(String(chave)) }}</dt>
              <dd class="w-1/2 text-sm font-medium text-highlighted">{{ valorDaResposta(valor) }}</dd>
            </div>
          </dl>
        </section>

        <!-- Camada 3: rastro técnico, recolhido -->
        <section class="mt-6">
          <UButton
            :label="t.dadosTecnicos"
            :icon="tecnicosAbertos ? 'i-lucide-chevron-down' : 'i-lucide-chevron-right'"
            color="neutral"
            variant="ghost"
            size="xs"
            @click="tecnicosAbertos = !tecnicosAbertos"
          />
          <dl
            v-if="tecnicosAbertos"
            class="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 rounded-lg border border-default p-4 text-xs"
            style="animation: entrada .25s ease-out both"
          >
            <div><dt class="text-muted">{{ t.campos.identificador }}</dt><dd class="font-mono text-toned">#{{ tarefa.id }}</dd></div>
            <div><dt class="text-muted">{{ t.campos.referencia }}</dt><dd class="break-all font-mono text-toned">{{ tarefa.reference }}</dd></div>
            <div><dt class="text-muted">{{ t.campos.workspace }}</dt><dd class="text-toned">{{ tarefa.workspace }}</dd></div>
            <div><dt class="text-muted">{{ t.campos.atualizadoEm }}</dt><dd class="text-toned">{{ formatarDataHora(tarefa.updated_at) }}</dd></div>
            <div v-if="tarefa.node_execution"><dt class="text-muted">{{ t.campos.origem }}</dt><dd class="font-mono text-toned">{{ tarefa.node_execution }}</dd></div>
            <div v-if="tarefa.item"><dt class="text-muted">{{ t.campos.item }}</dt><dd class="font-mono text-toned">{{ tarefa.item }}</dd></div>
            <div><dt class="text-muted">{{ t.campos.arquivada }}</dt><dd class="text-toned">{{ tarefa.archived ? 'sim' : 'não' }}</dd></div>
            <div v-if="tarefa.permissions?.length"><dt class="text-muted">{{ t.campos.permissoes }}</dt><dd class="text-toned">{{ tarefa.permissions.join(', ') }}</dd></div>
            <div><dt class="text-muted">{{ t.campos.linkExterno }}</dt><dd class="text-toned">{{ tarefa.external_task ?? '' }}</dd></div>
          </dl>
        </section>
      </template>

      <UEmpty
        v-else-if="aba === 'comentarios'"
        icon="i-lucide-message-circle"
        :title="t.comentariosVazios"
      />
      <UEmpty
        v-else
        icon="i-lucide-history"
        :title="t.logsVazios"
      />
    </div>

    <!-- Rodapé: a ação que fecha a tarefa -->
    <footer class="flex items-center gap-2 border-t border-default px-5 py-3">
      <p v-if="concluida" class="flex-1 text-sm text-muted">{{ t.tarefaConcluida }}</p>
      <template v-else>
        <span v-if="camposVisiveis.length && !podeConcluir" class="flex-1 text-xs text-muted">
          {{ t.faltaResponder }}
        </span>
        <span v-else class="flex-1" />
        <UButton
          :label="t.salvarRascunho"
          color="neutral"
          variant="outline"
          size="sm"
          :disabled="somenteLeitura"
          @click="emit('salvar')"
        />
      </template>
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
</template>
