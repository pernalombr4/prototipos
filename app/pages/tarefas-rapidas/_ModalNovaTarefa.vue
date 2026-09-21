<script setup lang="ts">
/**
 * Nova tarefa.
 *
 * ⚠️ OS CAMPOS SÃO OS DO PRODUTO, na mesma ordem: Nome (obrigatório), Data
 * limite, Descrição, Responsável e Prioridade. O único acréscimo é a
 * **Estimativa**, pedida na rodada 13: é o campo de tempo que o ClickUp
 * oferece na criação. Tempo REGISTRADO não entra aqui, e isso não é esquecimento
 * meu nem do ClickUp: não existe tempo apontado numa tarefa que ainda não
 * existe. Pontos, tipo e etiquetas continuam fora, porque também não existem na
 * criação de hoje (está no DECISOES.md).
 *
 * O que mudou é o acabamento, no padrão que Linear, ClickUp e Asana usam:
 *
 *  - o nome ocupa a linha inteira, porque é o campo que decide a tarefa;
 *  - o prazo ganha atalhos (hoje, amanhã, semana que vem) ao lado do campo;
 *  - a prioridade vira um seletor segmentado colorido, em vez de quatro
 *    botões de rádio espalhados em duas linhas;
 *  - o responsável mostra avatar e tem o atalho "atribuir a mim";
 *  - a barra da descrição só aparece quando se escreve;
 *  - o rodapé diz em qual raia a tarefa vai nascer.
 */
import type { Task } from '@be-enlighten/enspace-sdk-schemas'
import { pessoas, usuarioAtual } from './mocks'
import { corDaPrioridade, formatarDuracao, iconeDaPrioridade, interpretarDuracao } from './quadro'
import type { Textos } from './textos'

const props = defineProps<{
  t: Textos
  /** Nome da raia onde a tarefa vai nascer, para o rodapé dizer. */
  raia: string
}>()

const emit = defineEmits<{
  criar: [tarefa: {
    name: string
    due_date: Date | null
    description: string | null
    assigned_to: number | null
    priority: Task['priority']
    /** Segundos. Campo novo, que hoje não existe na tarefa do ENSPACE. */
    estimativa: number
  }]
  fechar: []
}>()

const aberto = defineModel<boolean>('open', { required: true })

const nome = ref('')
const prazo = ref('')
const descricao = ref('')
const responsavel = ref<number>(0)
const prioridade = ref<Task['priority']>('normal')
const escrevendoDescricao = ref(false)

/**
 * Estimativa na criação, como no ClickUp: o formulário de criar tarefa oferece
 * o **Time Estimate**, não o tempo registrado. Tempo registrado só existe
 * depois que a tarefa existe, e começa pelo cronômetro ou pelo apontamento.
 */
const estimativa = ref('')
const segundosEstimados = computed(() => interpretarDuracao(estimativa.value))

const prioridades: Task['priority'][] = ['low', 'normal', 'high', 'urgent']

const opcoesDeResponsavel = computed(() => [
  { label: props.t.responsavelPlaceholder, value: 0 },
  ...Object.values(pessoas).map(p => ({ label: p.fullname, value: p.id })),
])

/** Atalhos de prazo: é o que o mercado põe ao lado do campo de data. */
function definirPrazo(dias: number | null) {
  if (dias === null) { prazo.value = ''; return }
  const d = new Date(Date.now() + dias * 86_400_000)
  const p = (n: number) => String(n).padStart(2, '0')
  prazo.value = `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T18:00`
}

function limpar() {
  nome.value = ''
  prazo.value = ''
  descricao.value = ''
  responsavel.value = 0
  prioridade.value = 'normal'
  estimativa.value = ''
  escrevendoDescricao.value = false
}

watch(aberto, (v) => { if (v) limpar() })

function criar() {
  if (!nome.value.trim()) return
  emit('criar', {
    name: nome.value.trim(),
    due_date: prazo.value ? new Date(`${prazo.value}:00.000Z`) : null,
    description: descricao.value.trim() ? `<p>${descricao.value.trim()}</p>` : null,
    assigned_to: responsavel.value || null,
    priority: prioridade.value,
    estimativa: segundosEstimados.value,
  })
}
</script>

<template>
  <UModal v-model:open="aberto" :title="t.novaTarefa" :ui="{ content: 'max-w-2xl' }">
    <template #body>
      <div class="space-y-5">
        <!-- Nome: a linha inteira, porque é o campo que decide a tarefa -->
        <div>
          <label for="nova-nome" class="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-highlighted">
            <UIcon name="i-lucide-type" class="size-4 text-muted" />
            {{ t.campos.nome }}
            <span class="text-xs font-normal text-error">({{ t.campoObrigatorio }})</span>
          </label>
          <UInput
            id="nova-nome"
            v-model="nome"
            :placeholder="t.nomePlaceholder"
            size="lg"
            class="w-full"
            autofocus
          />
        </div>

        <!-- Data limite, com os atalhos ao lado -->
        <div>
          <label for="nova-prazo" class="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-highlighted">
            <UIcon name="i-lucide-calendar-clock" class="size-4 text-muted" />
            {{ t.campos.prazo }}
          </label>
          <div class="flex flex-wrap items-center gap-2">
            <UInput
              id="nova-prazo"
              v-model="prazo"
              type="datetime-local"
              size="md"
              class="w-56"
            />
            <div class="flex flex-wrap gap-1">
              <UButton :label="t.prazoHoje" size="xs" color="neutral" variant="outline" @click="definirPrazo(0)" />
              <UButton :label="t.prazoAmanha" size="xs" color="neutral" variant="outline" @click="definirPrazo(1)" />
              <UButton :label="t.prazoProximaSemana" size="xs" color="neutral" variant="outline" @click="definirPrazo(7)" />
              <UButton
                v-if="prazo"
                :label="t.tirarPrazo"
                size="xs"
                color="neutral"
                variant="ghost"
                icon="i-lucide-x"
                @click="definirPrazo(null)"
              />
            </div>
          </div>
        </div>

        <!-- Descrição -->
        <div>
          <label class="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-highlighted">
            <UIcon name="i-lucide-file-text" class="size-4 text-muted" />
            {{ t.campos.descricao }}
          </label>
          <div class="rounded-lg border border-default transition-colors focus-within:border-accented">
            <div
              v-if="escrevendoDescricao"
              class="flex items-center gap-0.5 border-b border-default px-2 py-1"
              style="animation: entrada .2s ease-out both"
            >
              <UButton
                v-for="f in ['i-lucide-bold', 'i-lucide-italic', 'i-lucide-list', 'i-lucide-link', 'i-lucide-code']"
                :key="f"
                :icon="f"
                color="neutral"
                variant="ghost"
                size="xs"
                :aria-label="t.campos.descricao"
              />
            </div>
            <UTextarea
              v-model="descricao"
              :placeholder="t.descricaoPlaceholder"
              :rows="3"
              autoresize
              variant="none"
              class="w-full"
              @focus="escrevendoDescricao = true"
            />
          </div>
        </div>

        <!-- Estimativa: o campo de tempo que o ClickUp oferece na criação -->
        <div>
          <label for="nova-estimativa" class="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-highlighted">
            <UIcon name="i-lucide-hourglass" class="size-4 text-muted" />
            {{ t.campos.estimativa }}
          </label>
          <div class="flex flex-wrap items-center gap-2">
            <UInput
              id="nova-estimativa"
              v-model="estimativa"
              :placeholder="t.tempo.duracaoAjuda"
              size="md"
              class="w-56"
            />
            <div class="flex flex-wrap gap-1">
              <UButton
                v-for="atalho in ['30m', '1h', '2h', '4h', '8h']"
                :key="atalho"
                :label="atalho"
                size="xs"
                color="neutral"
                :variant="estimativa === atalho ? 'soft' : 'outline'"
                @click="estimativa = atalho"
              />
            </div>
            <span v-if="segundosEstimados" class="text-xs text-success">
              {{ formatarDuracao(segundosEstimados) }}
            </span>
          </div>
        </div>

        <!-- Responsável e Prioridade, lado a lado -->
        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <label for="nova-responsavel" class="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-highlighted">
              <UIcon name="i-lucide-user" class="size-4 text-muted" />
              {{ t.campos.responsavel }}
            </label>
            <USelect
              id="nova-responsavel"
              v-model="responsavel"
              :items="opcoesDeResponsavel"
              value-key="value"
              size="md"
              class="w-full"
            />
            <UButton
              v-if="responsavel !== usuarioAtual.id"
              :label="t.atribuirAMim"
              icon="i-lucide-user-check"
              size="xs"
              color="neutral"
              variant="link"
              class="mt-1 -ms-1.5"
              @click="responsavel = usuarioAtual.id"
            />
          </div>

          <div>
            <span class="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-highlighted">
              <UIcon name="i-lucide-flag" class="size-4 text-muted" />
              {{ t.campos.prioridade }}
            </span>
            <div class="flex gap-1" role="radiogroup" :aria-label="t.campos.prioridade">
              <UButton
                v-for="p in prioridades"
                :key="p"
                :label="t.prioridade[p]"
                :icon="iconeDaPrioridade[p]"
                size="xs"
                class="flex-1 justify-center"
                role="radio"
                :aria-checked="prioridade === p"
                :color="prioridade === p ? corDaPrioridade[p] : 'neutral'"
                :variant="prioridade === p ? 'subtle' : 'outline'"
                @click="prioridade = p"
              />
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex w-full items-center gap-2">
        <p class="flex items-center gap-1.5 text-xs text-muted">
          <UIcon name="i-lucide-corner-down-right" class="size-3.5" />
          {{ t.criarEmRaia(raia) }}
        </p>
        <div class="ml-auto flex gap-2">
          <UButton :label="t.cancelar" color="neutral" variant="ghost" @click="emit('fechar')" />
          <UButton
            :label="t.novaTarefa"
            icon="i-lucide-plus"
            color="primary"
            :disabled="!nome.trim()"
            @click="criar"
          />
        </div>
      </div>
    </template>
  </UModal>
</template>
