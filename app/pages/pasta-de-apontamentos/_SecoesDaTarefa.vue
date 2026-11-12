<script setup lang="ts">
/**
 * As seções que a aba Tarefa ganha, abaixo de "Detalhes da tarefa". Proposta
 * (rodada 2), tirada do GitHub com a cara do ENSPACE:
 *
 * - Checklist (a task list): linhas curtas com caixa, responsável opcional,
 *   arrastar para reordenar e "Converter em subtarefa"; a linha convertida
 *   marca sozinha quando a subtarefa é concluída.
 * - Subtarefas (o sub-issue): 1 nível, cada uma é uma tarefa inteira; criar na
 *   linha ou vincular uma que já existe. Na subtarefa, a seção não aparece: o
 *   cabeçalho do painel mostra "Parte de".
 * - Dependências (o "blocked by" das issues): Bloqueada por e Bloqueia.
 * - Mencionada em: quem citou esta tarefa com #.
 */
import type { DropdownMenuItem } from '@nuxt/ui'
import type { LinhaDeChecklist, Mencao, Pessoa, TarefaDoItem } from './mocks'
import type { Textos } from './textos'
import { bloqueia, concluida, feitoDaLinha, feitosDaChecklist, filhas, novaLinha, novaTarefa, porId, reabrirTarefa } from './tarefas'

const props = defineProps<{
  t: Textos
  x: TarefaDoItem
  tarefas: TarefaDoItem[]
  pessoas: Pessoa[]
  mencoes: Mencao[]
  quem: number
  somenteLeitura?: boolean
}>()
const emit = defineEmits<{ abrir: [x: TarefaDoItem] }>()

const toast = useToast()
const tr = computed(() => props.t.tarefaRapida)
const pessoa = (id?: number | null) => props.pessoas.find(p => p.id === id)
const iconeDoStatus: Record<string, string> = { pending: 'i-lucide-circle', working: 'i-lucide-circle-dashed', blocked: 'i-lucide-circle-pause', completed: 'i-lucide-circle-check' }
const corDoStatus: Record<string, string> = { pending: 'text-info', working: 'text-warning', blocked: 'text-error', completed: 'text-success' }

/* ---------- checklist ---------- */
const feitos = computed(() => feitosDaChecklist(props.tarefas, props.x))
const novoTexto = ref('')
function adicionarLinha() {
  const texto = novoTexto.value.trim()
  if (!texto) return
  props.x.checklist.push(novaLinha(texto))
  novoTexto.value = ''
}
function alternarLinha(l: LinhaDeChecklist, v: boolean | 'indeterminate') {
  if (l.subtarefa) return
  l.feito = v === true
}
const editandoLinha = ref<string | null>(null)
const textoEmEdicao = ref('')
function editarLinha(l: LinhaDeChecklist) {
  if (props.somenteLeitura || l.subtarefa) return
  editandoLinha.value = l.id
  textoEmEdicao.value = l.texto
}
function salvarLinha(l: LinhaDeChecklist) {
  if (textoEmEdicao.value.trim()) l.texto = textoEmEdicao.value.trim()
  editandoLinha.value = null
}
function excluirLinha(l: LinhaDeChecklist) {
  const i = props.x.checklist.indexOf(l)
  props.x.checklist.splice(i, 1)
  toast.add({ title: tr.value.toasts.itemExcluido, icon: 'i-lucide-trash-2', duration: 4000, actions: [{ label: tr.value.toasts.desfazer, color: 'neutral', variant: 'outline', onClick: () => { props.x.checklist.splice(i, 0, l) } }] })
}
function converterLinha(l: LinhaDeChecklist) {
  const sub = novaTarefa(props.tarefas, props.x, l.texto, { mae: props.x.tarefa.id }, l.responsavel)
  if (l.feito) sub.tarefa.status = 'completed'
  l.subtarefa = sub.tarefa.id
  toast.add({ title: tr.value.toasts.convertida(l.texto), icon: 'i-lucide-git-branch', color: 'success', duration: 3000 })
}
const menuDaLinha = (l: LinhaDeChecklist): DropdownMenuItem[][] => [
  [{ label: tr.value.checklist.converter, icon: 'i-lucide-git-branch', disabled: !!l.subtarefa || !!props.x.mae, onSelect: () => converterLinha(l) }],
  [{ label: tr.value.checklist.excluir, icon: 'i-lucide-trash-2', color: 'error' as const, onSelect: () => excluirLinha(l) }],
]
const opcoesDeResponsavel = (l: LinhaDeChecklist): DropdownMenuItem[] => [
  { label: tr.value.checklist.semResponsavel, icon: 'i-lucide-user-x', onSelect: () => { l.responsavel = undefined } },
  ...props.pessoas.map(p => ({ label: p.nome, avatar: { text: p.iniciais, alt: p.nome }, onSelect: () => { l.responsavel = p.id } })),
]

/* Arrastar para reordenar, com a API nativa do navegador. */
const arrastando = ref<number | null>(null)
const sobre = ref<number | null>(null)
function soltar(i: number) {
  const de = arrastando.value
  if (de === null || de === i) return limparArraste()
  const [l] = props.x.checklist.splice(de, 1)
  props.x.checklist.splice(i, 0, l!)
  limparArraste()
}
function limparArraste() {
  arrastando.value = null
  sobre.value = null
}
function moverComTeclado(i: number, d: -1 | 1) {
  const j = i + d
  if (j < 0 || j >= props.x.checklist.length) return
  const [l] = props.x.checklist.splice(i, 1)
  props.x.checklist.splice(j, 0, l!)
}

/* ---------- subtarefas ---------- */
const subs = computed(() => filhas(props.tarefas, props.x))
const concluidas = computed(() => subs.value.filter(s => concluida(s)).length)
const novaSub = ref('')
function adicionarSub() {
  const nome = novaSub.value.trim()
  if (!nome) return
  novaTarefa(props.tarefas, props.x, nome, { mae: props.x.tarefa.id })
  novaSub.value = ''
  toast.add({ title: tr.value.toasts.subtarefaCriada(nome), icon: 'i-lucide-git-branch', color: 'success', duration: 2500 })
}
function alternarSub(s: TarefaDoItem) {
  if (props.somenteLeitura) return
  if (concluida(s)) reabrirTarefa(s)
  else {
    s.tarefa.status = 'completed'
    s.conclusao = { motivo: 'concluida' }
  }
}
const vinculaveis = computed(() => props.tarefas
  .filter(y => y !== props.x && !y.mae && !filhas(props.tarefas, y).length)
  .map(y => ({ label: y.tarefa.name, value: y.tarefa.id })))
/* O seletor volta ao placeholder: a chave nova remonta o campo depois de cada escolha. */
const limpar = ref(0)
function vincular(id: number | undefined) {
  const y = porId(props.tarefas, id)
  if (!y) return
  y.mae = props.x.tarefa.id
  limpar.value++
  toast.add({ title: tr.value.toasts.vinculada(y.tarefa.name), icon: 'i-lucide-link', color: 'success', duration: 2500 })
}
function desvincular(s: TarefaDoItem) {
  s.mae = undefined
  for (const l of props.x.checklist) if (l.subtarefa === s.tarefa.id) l.subtarefa = undefined
  toast.add({ title: tr.value.toasts.desvinculada(s.tarefa.name), icon: 'i-lucide-unlink', duration: 2500 })
}

/* ---------- dependências ---------- */
const bloqueadaPor = computed(() => props.x.bloqueadaPor.map(id => porId(props.tarefas, id)).filter((y): y is TarefaDoItem => !!y))
const bloqueadas = computed(() => bloqueia(props.tarefas, props.x))
/* Fora da lista: ela mesma, as que já bloqueiam e as próprias subtarefas. */
const opcoesDeBloqueio = computed(() => props.tarefas
  .filter(y => y !== props.x && y.mae !== props.x.tarefa.id && !props.x.bloqueadaPor.includes(y.tarefa.id))
  .map(y => ({ label: y.tarefa.name, value: y.tarefa.id })))
function adicionarBloqueio(id: number | undefined) {
  if (!id) return
  props.x.bloqueadaPor.push(id)
  limpar.value++
}
const removerBloqueio = (id: number) => props.x.bloqueadaPor.splice(props.x.bloqueadaPor.indexOf(id), 1)

/* ---------- mencionada em ---------- */
const minhasMencoes = computed(() => props.mencoes.filter(m => m.alvo === `tarefa-${props.x.tarefa.id}`))
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- CHECKLIST -->
    <section class="flex flex-col gap-3 rounded-lg border border-default p-4" :aria-label="tr.checklist.titulo">
      <header class="flex items-center gap-2">
        <span class="flex size-6 items-center justify-center rounded bg-elevated"><UIcon name="i-lucide-square-check" class="size-3.5" /></span>
        <h3 class="text-sm font-medium text-highlighted">{{ tr.checklist.titulo }}</h3>
        <span v-if="x.checklist.length" class="text-xs tabular-nums" :class="feitos === x.checklist.length ? 'text-success' : 'text-muted'">{{ tr.checklist.contagem(feitos, x.checklist.length) }}</span>
        <UTooltip :text="tr.checklist.diferenca">
          <UIcon name="i-lucide-circle-help" class="ml-auto size-4 text-dimmed" />
        </UTooltip>
      </header>

      <p v-if="!x.checklist.length" class="text-sm text-dimmed">{{ tr.checklist.vazio }}</p>
      <TransitionGroup v-else tag="ul" class="-mx-2 flex flex-col" move-class="transition-transform duration-200 ease-out">
        <li
          v-for="(l, i) in x.checklist"
          :key="l.id"
          class="group/linha flex items-center gap-2 rounded-md px-2 py-1 transition-colors"
          :class="[sobre === i && arrastando !== i ? 'bg-primary/10' : 'hover:bg-elevated/60', arrastando === i ? 'opacity-50' : '']"
          :draggable="!somenteLeitura && editandoLinha !== l.id"
          @dragstart="arrastando = i"
          @dragover.prevent="sobre = i"
          @drop.prevent="soltar(i)"
          @dragend="limparArraste"
        >
          <button
            v-if="!somenteLeitura"
            type="button"
            class="flex cursor-grab text-dimmed opacity-0 transition-opacity focus-visible:opacity-100 group-hover/linha:opacity-100"
            :aria-label="tr.checklist.arrastar"
            @keydown.up.prevent="moverComTeclado(i, -1)"
            @keydown.down.prevent="moverComTeclado(i, 1)"
          >
            <UIcon name="i-lucide-grip-vertical" class="size-4" />
          </button>

          <UTooltip :text="l.subtarefa ? tr.checklist.ligada(porId(tarefas, l.subtarefa)?.tarefa.name ?? '') : undefined" :disabled="!l.subtarefa">
            <UCheckbox
              :model-value="feitoDaLinha(tarefas, l)"
              :disabled="somenteLeitura || !!l.subtarefa"
              :aria-label="l.texto"
              @update:model-value="(v: boolean | 'indeterminate') => alternarLinha(l, v)"
            />
          </UTooltip>

          <UInput
            v-if="editandoLinha === l.id"
            v-model="textoEmEdicao"
            size="xs"
            class="flex-1"
            autofocus
            :aria-label="tr.checklist.editar"
            @keydown.enter.prevent="salvarLinha(l)"
            @keydown.esc="editandoLinha = null"
            @blur="salvarLinha(l)"
          />
          <button
            v-else
            type="button"
            class="min-w-0 flex-1 truncate text-left text-sm"
            :class="feitoDaLinha(tarefas, l) ? 'text-muted line-through decoration-dimmed' : 'text-default'"
            :aria-label="tr.checklist.editar"
            @click="editarLinha(l)"
          >{{ l.texto }}</button>

          <!-- A linha que virou subtarefa -->
          <UButton
            v-if="l.subtarefa && porId(tarefas, l.subtarefa)"
            :label="tr.subtarefas.titulo.slice(0, -1)"
            icon="i-lucide-git-branch"
            color="neutral"
            variant="soft"
            size="xs"
            class="shrink-0"
            :aria-label="porId(tarefas, l.subtarefa)!.tarefa.name"
            @click="emit('abrir', porId(tarefas, l.subtarefa)!)"
          />

          <UDropdownMenu :items="opcoesDeResponsavel(l)" :disabled="somenteLeitura" :content="{ align: 'end' }">
            <UButton
              v-if="pessoa(l.responsavel)"
              color="neutral"
              variant="ghost"
              size="xs"
              class="shrink-0 rounded-full p-0"
              :aria-label="`${tr.checklist.responsavel}: ${pessoa(l.responsavel)!.nome}`"
            >
              <UAvatar :text="pessoa(l.responsavel)!.iniciais" :alt="pessoa(l.responsavel)!.nome" size="2xs" />
            </UButton>
            <UButton
              v-else
              icon="i-lucide-user-plus"
              color="neutral"
              variant="ghost"
              size="xs"
              class="shrink-0 opacity-0 transition-opacity focus-visible:opacity-100 group-hover/linha:opacity-100"
              :aria-label="tr.checklist.responsavel"
            />
          </UDropdownMenu>
          <UDropdownMenu v-if="!somenteLeitura" :items="menuDaLinha(l)" :content="{ align: 'end' }">
            <UButton icon="i-lucide-ellipsis" color="neutral" variant="ghost" size="xs" class="shrink-0 opacity-0 transition-opacity focus-visible:opacity-100 group-hover/linha:opacity-100" :aria-label="tr.checklist.maisAcoes" />
          </UDropdownMenu>
        </li>
      </TransitionGroup>

      <UInput
        v-if="!somenteLeitura"
        v-model="novoTexto"
        icon="i-lucide-plus"
        :placeholder="tr.checklist.placeholder"
        size="sm"
        variant="subtle"
        :aria-label="tr.checklist.adicionar"
        @keydown.enter.prevent="adicionarLinha"
      />
    </section>

    <!-- SUBTAREFAS (só na tarefa-mãe: 1 nível) -->
    <section v-if="!x.mae" class="flex flex-col gap-3 rounded-lg border border-default p-4" :aria-label="tr.subtarefas.titulo">
      <header class="flex items-center gap-2">
        <span class="flex size-6 items-center justify-center rounded bg-elevated"><UIcon name="i-lucide-git-branch" class="size-3.5" /></span>
        <h3 class="text-sm font-medium text-highlighted">{{ tr.subtarefas.titulo }}</h3>
        <span v-if="subs.length" class="text-xs tabular-nums" :class="concluidas === subs.length ? 'text-success' : 'text-muted'">{{ tr.subtarefas.contagem(concluidas, subs.length) }}</span>
      </header>

      <p v-if="!subs.length" class="text-sm text-dimmed">{{ tr.subtarefas.vazio }}</p>
      <ul v-else class="-mx-2 flex flex-col">
        <li v-for="s in subs" :key="s.tarefa.id" class="group/sub flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-elevated/60 [animation:entrada_.25s_ease-out_both]">
          <UTooltip :text="t.tarefas.colunas[s.tarefa.status]">
            <button
              type="button"
              class="flex shrink-0 rounded-full transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-primary"
              :aria-label="t.tarefas.colunas[s.tarefa.status]"
              :aria-pressed="concluida(s)"
              @click="alternarSub(s)"
            >
              <UIcon :name="iconeDoStatus[s.tarefa.status]" class="size-4" :class="corDoStatus[s.tarefa.status]" />
            </button>
          </UTooltip>
          <button type="button" class="min-w-0 flex-1 truncate text-left text-sm hover:underline" :class="concluida(s) ? 'text-muted line-through' : 'text-highlighted'" @click="emit('abrir', s)">
            {{ s.tarefa.name }}
          </button>
          <span v-if="s.tarefa.due_date" class="shrink-0 text-xs text-muted">{{ t.data(s.tarefa.due_date) }}</span>
          <UAvatar v-if="pessoa(s.tarefa.assigned_to)" :text="pessoa(s.tarefa.assigned_to)!.iniciais" :alt="pessoa(s.tarefa.assigned_to)!.nome" size="2xs" class="shrink-0" />
          <UTooltip v-if="!somenteLeitura" :text="tr.subtarefas.desvincular">
            <UButton icon="i-lucide-unlink" color="neutral" variant="ghost" size="xs" class="shrink-0 opacity-0 transition-opacity focus-visible:opacity-100 group-hover/sub:opacity-100" :aria-label="tr.subtarefas.desvincular" @click="desvincular(s)" />
          </UTooltip>
        </li>
      </ul>

      <div v-if="!somenteLeitura" class="flex flex-wrap items-center gap-2">
        <UInput
          v-model="novaSub"
          icon="i-lucide-plus"
          :placeholder="tr.subtarefas.placeholder"
          size="sm"
          variant="subtle"
          class="min-w-48 flex-1"
          :aria-label="tr.subtarefas.adicionar"
          @keydown.enter.prevent="adicionarSub"
        />
        <!-- Sem v-model: a escolha age e o campo volta ao placeholder -->
        <USelectMenu
          :key="`vincular-${limpar}`"
          :model-value="undefined"
          :items="vinculaveis"
          value-key="value"
          :placeholder="tr.subtarefas.vincular"
          :search-input="{ placeholder: tr.subtarefas.vincularPlaceholder }"
          icon="i-lucide-link"
          size="sm"
          class="w-56"
          :ui="{ content: 'min-w-72' }"
          @update:model-value="vincular"
        />
      </div>
    </section>

    <!-- DEPENDÊNCIAS -->
    <section class="flex flex-col gap-3 rounded-lg border border-default p-4" :aria-label="tr.dependencias.titulo">
      <header class="flex items-center gap-2">
        <span class="flex size-6 items-center justify-center rounded bg-elevated"><UIcon name="i-lucide-lock" class="size-3.5" /></span>
        <h3 class="text-sm font-medium text-highlighted">{{ tr.dependencias.titulo }}</h3>
      </header>
      <UAlert
        v-if="bloqueadaPor.some(y => !concluida(y))"
        :description="tr.dependencias.aviso(bloqueadaPor.find(y => !concluida(y))!.tarefa.name)"
        icon="i-lucide-lock"
        color="error"
        variant="subtle"
        orientation="horizontal"
        class="py-2"
      />
      <dl class="grid gap-3 text-sm sm:grid-cols-[8rem_1fr]">
        <dt class="pt-1 text-xs font-medium text-muted">{{ tr.dependencias.bloqueadaPor }}</dt>
        <dd class="flex flex-wrap items-center gap-1.5">
          <span v-for="y in bloqueadaPor" :key="y.tarefa.id" class="inline-flex items-center gap-1 rounded-md border border-default py-0.5 pl-1.5 pr-0.5 text-xs">
            <UIcon :name="iconeDoStatus[y.tarefa.status]" class="size-3.5" :class="corDoStatus[y.tarefa.status]" />
            <button type="button" class="max-w-56 truncate hover:underline" :class="concluida(y) ? 'text-muted line-through' : 'text-highlighted'" @click="emit('abrir', y)">{{ y.tarefa.name }}</button>
            <UButton v-if="!somenteLeitura" icon="i-lucide-x" color="neutral" variant="ghost" size="xs" class="p-0.5" :aria-label="tr.dependencias.remover(y.tarefa.name)" @click="removerBloqueio(y.tarefa.id)" />
          </span>
          <span v-if="!bloqueadaPor.length && somenteLeitura" class="text-xs text-dimmed">{{ tr.dependencias.nenhuma }}</span>
          <USelectMenu
            v-if="!somenteLeitura"
            :key="`bloqueio-${limpar}`"
            :model-value="undefined"
            :items="opcoesDeBloqueio"
            value-key="value"
            :placeholder="tr.dependencias.adicionar"
            :search-input="{ placeholder: tr.dependencias.escolher }"
            icon="i-lucide-plus"
            size="xs"
            variant="ghost"
            class="w-32"
            :ui="{ content: 'min-w-72' }"
            @update:model-value="adicionarBloqueio"
          />
        </dd>
        <dt class="pt-1 text-xs font-medium text-muted">{{ tr.dependencias.bloqueia }}</dt>
        <dd class="flex flex-wrap items-center gap-1.5">
          <span v-if="!bloqueadas.length" class="pt-1 text-xs text-dimmed">{{ tr.dependencias.nenhuma }}</span>
          <button
            v-for="y in bloqueadas"
            :key="y.tarefa.id"
            type="button"
            class="inline-flex max-w-64 items-center gap-1 rounded-md border border-default px-1.5 py-0.5 text-xs text-highlighted transition-colors hover:bg-elevated"
            @click="emit('abrir', y)"
          >
            <UIcon :name="iconeDoStatus[y.tarefa.status]" class="size-3.5 shrink-0" :class="corDoStatus[y.tarefa.status]" />
            <span class="truncate">{{ y.tarefa.name }}</span>
          </button>
        </dd>
      </dl>
    </section>

    <!-- MENCIONADA EM -->
    <section v-if="minhasMencoes.length" class="flex flex-col gap-2 rounded-lg border border-default p-4" :aria-label="tr.mencionadaEm.titulo">
      <header class="flex items-center gap-2">
        <span class="flex size-6 items-center justify-center rounded bg-elevated"><UIcon name="i-lucide-hash" class="size-3.5" /></span>
        <h3 class="text-sm font-medium text-highlighted">{{ tr.mencionadaEm.titulo }}</h3>
      </header>
      <ul class="flex flex-col gap-1.5">
        <li v-for="(m, i) in minhasMencoes" :key="i" class="flex items-center gap-2 text-sm">
          <UIcon name="i-lucide-list-checks" class="size-4 shrink-0 text-primary" />
          <span class="font-medium text-highlighted">{{ t.novaPasta.tipos.apontamentos }} {{ m.onde }}</span>
          <span class="text-xs text-muted">{{ tr.mencionadaEm.linha(pessoa(m.quem)?.nome ?? '', t.dataHora(m.quando)) }}</span>
        </li>
      </ul>
    </section>
  </div>
</template>
