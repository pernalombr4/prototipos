<script setup lang="ts">
/**
 * O cartão fechado.
 *
 * Três decisões que vêm do que o quadro de hoje faz:
 *  - o título não é capitalizado por CSS e quebra em duas linhas, em vez de
 *    truncar na primeira palavra;
 *  - a data mostrada é o PRAZO, não a data de criação (hoje o cartão mostra
 *    `created_at`, o que faz a tarefa vencida parecer recém-chegada);
 *  - todo campo do cartão é ligável e desligável pela barra, então esta peça
 *    recebe o mapa `campos` e não decide sozinha o que mostrar.
 */
import type { Task } from '@be-enlighten/enspace-sdk-schemas'
import { itensRelacionados, pessoas } from './mocks'
import {
  corDaPrioridade, descricaoEmTexto, estaAtrasada, etiquetasDaTarefa,
  iconeDaPrioridade, iconeDoTipo, prazoLegivel, referenciaCurta,
} from './quadro'
import type { Textos } from './textos'

const props = defineProps<{
  tarefa: Task
  t: Textos
  campos: Record<string, boolean>
  densidade: 'compacto' | 'padrao' | 'completo'
  somenteLeitura?: boolean
  /** Destaca o cartão que está aberto no painel. */
  ativo?: boolean
}>()

const emit = defineEmits<{
  abrir: []
  mover: [status: Task['status']]
  arquivar: []
}>()

const prazo = computed(() => prazoLegivel(props.tarefa, props.t))
const atrasada = computed(() => estaAtrasada(props.tarefa))
const responsavel = computed(() => props.tarefa.assigned_to ? pessoas[props.tarefa.assigned_to] : null)
const item = computed(() => props.tarefa.item ? itensRelacionados[props.tarefa.item] : null)
const tags = computed(() => etiquetasDaTarefa(props.tarefa))
const colaboradores = computed(() =>
  (props.tarefa.collaborators ?? []).map(id => pessoas[id]).filter(Boolean))

const descricao = computed(() => descricaoEmTexto(props.tarefa.description))
const temFormulario = computed(() => props.tarefa.type === 'form' || props.tarefa.type === 'crud')

const mostraDescricao = computed(() =>
  props.campos.descricao && props.densidade !== 'compacto' && !!descricao.value)

const itensDoMenu = computed(() => [[
  { label: props.t.abrirTarefa, icon: 'i-lucide-square-arrow-out-up-right', onSelect: () => emit('abrir') },
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
      <UIcon
        v-if="campos.tipo"
        :name="iconeDoTipo[tarefa.type]"
        class="size-3.5 shrink-0 text-dimmed"
      />
      <span v-if="campos.referencia" class="font-mono text-[11px] leading-none text-muted">
        {{ referenciaCurta(tarefa.reference) }}
      </span>
      <UBadge
        v-if="atrasada"
        :label="prazo.texto"
        color="error"
        variant="subtle"
        size="sm"
        icon="i-lucide-alarm-clock"
        class="ml-auto"
      />
    </div>

    <!-- Título. O alvo de clique é o cartão inteiro, pelo link esticado. -->
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
        <span
          class="block"
          :class="densidade === 'compacto' ? 'line-clamp-1' : 'line-clamp-2'"
        >{{ tarefa.name }}</span>
      </a>
    </h3>

    <p v-if="mostraDescricao" class="mt-1 line-clamp-2 text-xs leading-relaxed text-muted">
      {{ descricao }}
    </p>

    <!-- Registro de origem: é ele que diz de qual chamado a tarefa veio -->
    <div
      v-if="campos.item && item && densidade === 'completo'"
      class="mt-2 flex items-center gap-1.5 text-xs text-muted"
    >
      <UIcon name="i-lucide-link" class="size-3.5 shrink-0 text-dimmed" />
      <span class="font-medium text-toned">{{ item.codigo }}</span>
      <span class="truncate">{{ item.titulo }}</span>
    </div>

    <!-- Etiquetas -->
    <div v-if="campos.etiquetas && tags.length && densidade !== 'compacto'" class="mt-2 flex flex-wrap gap-1">
      <UBadge
        v-for="tag in tags.slice(0, 2)"
        :key="tag!.id"
        :label="tag!.nome"
        :color="tag!.cor"
        variant="soft"
        size="sm"
      />
      <UBadge
        v-if="tags.length > 2"
        :label="t.maisEtiquetas(tags.length - 2)"
        color="neutral"
        variant="soft"
        size="sm"
      />
    </div>

    <!-- Rodapé do cartão: tudo que se lê de relance, numa linha só -->
    <div class="mt-2.5 flex items-center gap-2">
      <UTooltip v-if="campos.prioridade && tarefa.priority !== 'normal'" :text="t.campos.prioridade">
        <UBadge
          :label="t.prioridade[tarefa.priority]"
          :color="corDaPrioridade[tarefa.priority]"
          :icon="iconeDaPrioridade[tarefa.priority]"
          variant="subtle"
          size="sm"
        />
      </UTooltip>

      <UTooltip v-if="campos.prazo && tarefa.due_date && !atrasada" :text="t.campos.prazo">
        <span
          class="flex items-center gap-1 text-xs"
          :class="prazo.cor === 'warning' ? 'font-medium text-warning' : 'text-muted'"
        >
          <UIcon name="i-lucide-calendar" class="size-3.5" />
          {{ prazo.texto }}
        </span>
      </UTooltip>

      <UTooltip v-if="campos.pontos && tarefa.points > 0" :text="t.campos.pontos">
        <span class="flex items-center gap-1 rounded bg-elevated px-1.5 py-0.5 text-xs font-medium text-toned">
          <UIcon name="i-lucide-hash" class="size-3" />{{ tarefa.points }}
        </span>
      </UTooltip>

      <UTooltip v-if="temFormulario && campos.tipo" :text="t.temFormulario">
        <UIcon name="i-lucide-clipboard-pen" class="size-3.5 text-dimmed" />
      </UTooltip>

      <div class="ml-auto flex items-center gap-1">
        <UTooltip
          v-if="campos.colaboradores && colaboradores.length && densidade === 'completo'"
          :text="t.campos.colaboradores"
        >
          <UAvatarGroup size="2xs" :max="2">
            <UAvatar v-for="p in colaboradores" :key="p!.id" :alt="p!.fullname" :text="p!.iniciais" />
          </UAvatarGroup>
        </UTooltip>

        <UTooltip v-if="campos.responsavel" :text="responsavel?.fullname ?? t.semResponsavel">
          <UAvatar
            v-if="responsavel"
            size="2xs"
            :alt="responsavel.fullname"
            :text="responsavel.iniciais"
          />
          <span
            v-else
            class="flex size-5 items-center justify-center rounded-full border border-dashed border-accented text-dimmed"
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
