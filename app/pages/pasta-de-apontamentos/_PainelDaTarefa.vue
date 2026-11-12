<script setup lang="ts">
/**
 * O painel da tarefa, aberto pelo cartão da pasta Tarefas.
 *
 * ⚠️ NADA AQUI É PROPOSTA, salvo a aba Apontamentos. Copiado do develop em
 * 11/11/2026 (cartão da pasta Tarefas do item no workspace de exploração):
 * trilho de ícones à esquerda, abas Tarefa, Item, Comentários e Logs de
 * Auditoria, título, o selo "pending" em inglês (achado no BRIEFING), a
 * Reference, Detalhes da tarefa (Nome, Data limite, Descrição, Responsável,
 * Colaboradores, Prioridade) e o rodapé com Salvar alterações, Guardar
 * progresso e Concluir tarefa.
 *
 * A proposta (rodada 1): a aba Apontamentos, fixa como as outras (a tarefa
 * não tem pastas), entre Comentários e Logs, com o mesmo componente da pasta do
 * item em modo compacto.
 *
 * A proposta (rodada 2): a trilha "Parte de" na subtarefa, as seções
 * Checklist, Subtarefas, Dependências e Mencionada em abaixo de Detalhes, e o
 * Concluir tarefa com motivo (Concluída, Não será feita, Duplicada de) e a
 * opção de concluir junto as subtarefas abertas.
 *
 * A proposta (rodada 5): o campo Pontos em Detalhes. O `points` existe na
 * tarefa (SDK, padrão 0) e o painel do develop não mostra. As seções abaixo de
 * Detalhes seguem o modo do ClickUp (`_SecoesDaTarefa.vue`).
 *
 * A proposta (rodada 6): em Detalhes, o Prazo final ao lado da Data limite (os
 * 2 abrem o mesmo seletor de datas), os Colaboradores ao lado do Responsável e
 * o Registrar tempo ao lado dos Pontos. "Interface nova", na barra de andaime
 * (grupo Formulário), troca a aba Tarefa pela interface nova
 * (`_TarefaInterfaceNova.vue`) e alarga o painel. O resto do painel não muda.
 */
import type { Apontamento, Etiqueta, ItemVinculavel, Mencao, TarefaDoItem } from './mocks'
import type { Lista } from './lista'
import type { Textos } from './textos'
import PastaDeApontamentos from './_PastaDeApontamentos.vue'
import RegistroDeTempo from './_RegistroDeTempo.vue'
import SecoesDaTarefa from './_SecoesDaTarefa.vue'
import SeletorDePrazos from './_SeletorDePrazos.vue'
import TarefaInterfaceNova from './_TarefaInterfaceNova.vue'
import { pendente } from './lista'
import { concluida, concluir, filhas, porId, reabrirTarefa } from './tarefas'

const props = defineProps<{
  t: Textos
  x: TarefaDoItem
  lista: Lista
  quem: number
  estadoDaTela: string
  tarefas: TarefaDoItem[]
  mencoes: Mencao[]
  itens: ItemVinculavel[]
  etiquetas: Etiqueta[]
}>()
const aberto = defineModel<boolean>('open', { required: true })
const aba = defineModel<string>('aba', { default: 'tarefa' })
/** Andaime da rodada 6: a interface nova da aba Tarefa. */
const interfaceNova = defineModel<boolean>('interfaceNova', { default: false })
const tn = computed(() => props.t.tarefaNova)

/* ---------- proposta (rodada 6): prazo final e colaboradores no formulário atual ---------- */
const datasAbertas = reactive({ limite: false, final: false })
const focoLimite = ref<'limite' | 'final'>('limite')
const focoFinal = ref<'limite' | 'final'>('final')
watch(() => datasAbertas.limite, (a) => { if (a) focoLimite.value = 'limite' })
watch(() => datasAbertas.final, (a) => { if (a) focoFinal.value = 'final' })
const colaboradores = computed({
  get: () => props.x.tarefa.collaborators ?? [],
  set: v => { props.x.tarefa.collaborators = v },
})
const opcoesDeColaborador = computed(() => props.lista.pessoas
  .filter(p => p.id !== props.x.tarefa.assigned_to)
  .map(p => ({ label: p.nome, value: p.id, avatar: { text: p.iniciais, alt: p.nome } })))
const listaDeColaboradores = computed(() => colaboradores.value.map(id => props.lista.pessoas.find(p => p.id === id)).filter(p => !!p))
const emit = defineEmits<{ converter: [a: Apontamento], abrir: [x: TarefaDoItem] }>()

const toast = useToast()
const pendentes = computed(() => props.lista.apontamentos.filter(a => pendente(a.estado)).length)

const abas = computed(() => [
  { value: 'tarefa', label: props.t.painelTarefa.abas.tarefa, icon: 'i-lucide-layers' },
  { value: 'item', label: props.t.painelTarefa.abas.item, icon: 'i-lucide-file-text' },
  { value: 'comentarios', label: props.t.painelTarefa.abas.comentarios, icon: 'i-lucide-message-circle' },
  { value: 'apontamentos', label: props.t.painelTarefa.abas.apontamentos, icon: 'i-lucide-list-checks', badge: pendentes.value || undefined },
  { value: 'logs', label: props.t.painelTarefa.abas.logs, icon: 'i-lucide-shield-check' },
])

const trilho = ['i-lucide-calculator', 'i-lucide-hash', 'i-lucide-tag', 'i-lucide-user', 'i-lucide-calendar-clock', 'i-lucide-calendar-check', 'i-lucide-calendar-plus', 'i-lucide-calendar-sync']

const prioridades = ['low', 'normal', 'high', 'urgent'] as const
const corDaPrioridade: Record<string, string> = { low: 'text-info bg-info/10', normal: 'text-info bg-info/10', high: 'text-warning bg-warning/10', urgent: 'text-error bg-error/10' }
const pessoa = computed(() => props.lista.pessoas.find(p => p.id === props.x.tarefa.assigned_to))

function aviso(titulo: string) {
  toast.add({ title: titulo, icon: 'i-lucide-check', color: 'success', duration: 2000 })
}

/* ---------- proposta: subtarefa e conclusão ---------- */
const tr = computed(() => props.t.tarefaRapida)
const somenteLeitura = computed(() => props.estadoDaTela === 'semPermissao')
const mae = computed(() => porId(props.tarefas, props.x.mae))
const abertas = computed(() => filhas(props.tarefas, props.x).filter(s => !concluida(s)))

const modalConcluir = ref(false)
const motivo = ref<'concluida' | 'naoSeraFeita' | 'duplicada'>('concluida')
const duplicadaDe = ref<number | undefined>()
const nota = ref('')
const concluirAbertas = ref(true)
const opcoesDeMotivo = computed(() => (['concluida', 'naoSeraFeita', 'duplicada'] as const).map(m => ({
  value: m,
  label: tr.value.conclusao.motivos[m]!,
  description: tr.value.conclusao.descricoes[m]!,
})))
const outrasTarefas = computed(() => props.tarefas.filter(y => y !== props.x).map(y => ({ label: y.tarefa.name, value: y.tarefa.id })))
const podeConcluir = computed(() => motivo.value !== 'duplicada' || !!duplicadaDe.value)
function abrirConclusao() {
  motivo.value = 'concluida'
  duplicadaDe.value = undefined
  nota.value = ''
  concluirAbertas.value = true
  modalConcluir.value = true
}
function confirmarConclusao() {
  if (!podeConcluir.value) return
  if (concluirAbertas.value) for (const s of abertas.value) concluir(s, props.quem, { motivo: 'concluida' })
  concluir(props.x, props.quem, { motivo: motivo.value, duplicadaDe: motivo.value === 'duplicada' ? duplicadaDe.value : undefined, nota: nota.value.trim() || undefined })
  modalConcluir.value = false
  toast.add({ title: tr.value.conclusao.toast(props.x.tarefa.name), icon: 'i-lucide-circle-check', color: 'success', duration: 3000 })
}
const linhaDaConclusao = computed(() => {
  const c = props.x.conclusao
  if (!c || !concluida(props.x)) return ''
  if (c.motivo === 'duplicada') return tr.value.conclusao.duplicadaDe(porId(props.tarefas, c.duplicadaDe)?.tarefa.name ?? '')
  return tr.value.conclusao.concluidaComo(tr.value.conclusao.motivos[c.motivo]!)
})
</script>

<template>
  <USlideover
    v-model:open="aberto"
    side="right"
    :title="x.tarefa.name"
    :ui="{ content: interfaceNova && aba === 'tarefa' ? 'max-w-[50rem] w-full transition-[max-width] duration-200' : 'max-w-[42rem] w-full transition-[max-width] duration-200', header: 'hidden', body: 'p-0 sm:p-0 flex min-h-0', footer: 'justify-end gap-2 border-t border-default' }"
  >
    <template #body>
      <!-- Trilho de ícones, copiado -->
      <div class="hidden w-14 shrink-0 flex-col items-center gap-5 border-r border-default py-3 sm:flex" aria-hidden="true">
        <UIcon v-for="(i, n) in trilho" :key="n" :name="i" class="size-4 text-toned" />
      </div>

      <div class="flex min-w-0 flex-1 flex-col">
        <UTabs
          v-model="aba"
          :items="abas"
          :content="false"
          variant="link"
          size="sm"
          class="border-b border-default"
          :ui="{ list: 'border-0 px-3 overflow-x-auto', trigger: 'shrink-0' }"
        >
          <template #trailing="{ item }">
            <UBadge v-if="item.badge" :label="String(item.badge)" size="sm" :color="aba === item.value ? 'primary' : 'neutral'" variant="soft" class="tabular-nums" />
          </template>
        </UTabs>

        <header v-if="!(interfaceNova && aba === 'tarefa')" class="flex items-start gap-3 px-4 pt-3">
          <div class="min-w-0 flex-1">
            <!-- Proposta: a trilha da subtarefa -->
            <nav v-if="mae" class="mb-1 flex items-center gap-1 text-xs text-muted" :aria-label="tr.subtarefas.parteDe">
              <UIcon name="i-lucide-git-branch" class="size-3.5 shrink-0" />
              <span>{{ tr.subtarefas.parteDe }}</span>
              <UButton
                :label="mae.tarefa.name"
                color="neutral"
                variant="link"
                size="xs"
                class="min-w-0 truncate p-0 font-medium"
                :aria-label="tr.subtarefas.abrirMae(mae.tarefa.name)"
                @click="emit('abrir', mae)"
              />
            </nav>
            <h2 class="truncate text-lg font-semibold text-highlighted">{{ x.tarefa.name }}</h2>
            <p class="mt-0.5 flex items-center gap-1.5 text-xs text-muted">
              <UIcon name="i-lucide-id-card" class="size-3.5" />
              <span class="font-medium text-toned">{{ t.painelTarefa.referencia }}</span>
              <span class="truncate font-mono">{{ x.tarefa.reference }}</span>
            </p>
            <p v-if="linhaDaConclusao" class="mt-1 flex items-center gap-1.5 text-xs font-medium" :class="x.conclusao?.motivo === 'concluida' ? 'text-success' : 'text-muted'">
              <UIcon :name="x.conclusao?.motivo === 'concluida' ? 'i-lucide-circle-check' : x.conclusao?.motivo === 'duplicada' ? 'i-lucide-copy' : 'i-lucide-circle-slash'" class="size-3.5" />
              {{ linhaDaConclusao }}
            </p>
          </div>
          <!-- "pending" em inglês: está assim no develop -->
          <UBadge :label="x.tarefa.status" color="neutral" variant="outline" size="sm" />
          <UButton icon="i-lucide-x" color="neutral" variant="ghost" size="sm" :aria-label="t.painelTarefa.fechar" @click="aberto = false" />
        </header>

        <div class="relative min-h-0 flex-1">
          <UButton v-if="interfaceNova && aba === 'tarefa'" icon="i-lucide-x" color="neutral" variant="ghost" size="sm" class="absolute right-3 top-2.5 z-20" :aria-label="t.painelTarefa.fechar" @click="aberto = false" />
          <Transition mode="out-in" enter-active-class="transition duration-150 ease-out" enter-from-class="opacity-0 translate-y-1" leave-active-class="transition duration-75" leave-to-class="opacity-0">
            <!-- A proposta -->
            <PastaDeApontamentos
              v-if="aba === 'apontamentos'"
              key="apontamentos"
              :t="t"
              :lista="lista"
              :quem="quem"
              :estado-da-tela="estadoDaTela"
              :chave="`tarefa-${x.tarefa.id}`"
              compacto
              class="pt-1"
              @converter="(a: Apontamento) => emit('converter', a)"
            />

            <!-- A proposta (rodada 6): a interface nova -->
            <TarefaInterfaceNova
              v-else-if="aba === 'tarefa' && interfaceNova"
              key="tarefa-nova"
              :t="t"
              :x="x"
              :tarefas="tarefas"
              :pessoas="lista.pessoas"
              :mencoes="mencoes"
              :itens="itens"
              :etiquetas="etiquetas"
              :quem="quem"
              :estado-da-tela="estadoDaTela"
              :somente-leitura="somenteLeitura"
              @abrir="(y: TarefaDoItem) => emit('abrir', y)"
              @concluir="abrirConclusao"
              @reabrir="reabrirTarefa(x)"
            />

            <!-- Tarefa, copiada -->
            <div v-else-if="aba === 'tarefa'" key="tarefa" class="h-full overflow-y-auto px-4 py-4">
              <p class="mb-3 flex items-center gap-2 text-sm font-medium text-highlighted">
                <span class="flex size-6 items-center justify-center rounded bg-elevated"><UIcon name="i-lucide-file-text" class="size-3.5" /></span>
                {{ t.painelTarefa.detalhes }}
              </p>
              <div class="flex flex-col gap-4 rounded-lg border border-default p-4">
                <UFormField :label="t.painelTarefa.nome"><UInput :model-value="x.tarefa.name" class="w-full" /></UFormField>
                <!-- Proposta (rodada 6): o Prazo final ao lado da Data limite, com o mesmo seletor -->
                <div class="grid gap-3 sm:grid-cols-2">
                  <UFormField :label="t.painelTarefa.dataLimite">
                    <UPopover v-model:open="datasAbertas.limite" :content="{ align: 'start', side: 'bottom', sideOffset: 6, collisionPadding: 12 }">
                      <UInput :model-value="x.tarefa.due_date ? t.dataHora(new Date(x.tarefa.due_date)) : ''" readonly trailing-icon="i-lucide-calendar" class="w-full" :ui="{ base: 'cursor-pointer' }" />
                      <template #content>
                        <SeletorDePrazos v-model:foco="focoLimite" :t="t" :x="x" :somente-leitura="somenteLeitura" />
                      </template>
                    </UPopover>
                  </UFormField>
                  <UFormField :label="tn.campos.prazoFinal">
                    <UPopover v-model:open="datasAbertas.final" :content="{ align: 'start', side: 'bottom', sideOffset: 6, collisionPadding: 12 }">
                      <UInput :model-value="x.prazoFinal ? t.dataHora(new Date(x.prazoFinal)) : ''" readonly :placeholder="tn.prazos.semData" trailing-icon="i-lucide-flag" class="w-full" :ui="{ base: 'cursor-pointer' }" />
                      <template #content>
                        <SeletorDePrazos v-model:foco="focoFinal" :t="t" :x="x" :somente-leitura="somenteLeitura" />
                      </template>
                    </UPopover>
                  </UFormField>
                </div>
                <UFormField :label="t.painelTarefa.descricao">
                  <div class="min-h-24 rounded-md border border-accented px-3 py-2 text-sm text-default">{{ x.tarefa.description || t.tarefas.semDescricao }}</div>
                </UFormField>
                <div class="grid gap-3 sm:grid-cols-2">
                  <UFormField :label="t.painelTarefa.responsavel">
                    <UInput :model-value="pessoa?.nome" :avatar="pessoa ? { text: pessoa.iniciais, alt: pessoa.nome } : undefined" trailing-icon="i-lucide-chevron-down" class="w-full" />
                  </UFormField>
                  <!-- Proposta (rodada 6): Colaboradores, vários, ao lado do Responsável (1 só) -->
                  <UFormField :label="tn.campos.colaboradores">
                    <template #hint>
                      <UTooltip :text="tn.pessoas.ajudaColaboradores" :content="{ side: 'top' }">
                        <UIcon name="i-lucide-circle-help" class="size-3.5 text-dimmed" :aria-label="tn.pessoas.ajudaColaboradores" />
                      </UTooltip>
                    </template>
                    <USelectMenu v-model="colaboradores" :items="opcoesDeColaborador" value-key="value" multiple :search-input="{ placeholder: tn.pessoas.buscar }" :disabled="somenteLeitura" class="w-full" :ui="{ content: 'min-w-64' }">
                      <template #default>
                        <span v-if="!listaDeColaboradores.length" class="text-dimmed">{{ tn.vazio }}</span>
                        <span v-else class="flex min-w-0 items-center gap-1.5">
                          <UAvatarGroup size="2xs" :max="3">
                            <UAvatar v-for="p in listaDeColaboradores" :key="p!.id" :text="p!.iniciais" :alt="p!.nome" />
                          </UAvatarGroup>
                          <span class="truncate">{{ listaDeColaboradores.map(p => p!.nome.split(' ')[0]).join(', ') }}</span>
                        </span>
                      </template>
                    </USelectMenu>
                  </UFormField>
                </div>
                <div class="grid gap-3 sm:grid-cols-2">
                  <!-- Proposta (rodada 5): o campo Pontos -->
                  <UFormField :label="tr.pontos.rotulo">
                    <template #hint>
                      <UTooltip :text="tr.pontos.ajuda" :content="{ side: 'top' }">
                        <UIcon name="i-lucide-circle-help" class="size-3.5 text-dimmed" :aria-label="tr.pontos.ajuda" />
                      </UTooltip>
                    </template>
                    <UInputNumber v-model="x.tarefa.points" :min="0" :disabled="somenteLeitura" placeholder="0" class="w-full" />
                  </UFormField>
                  <!-- Proposta (rodada 6): Registrar tempo -->
                  <UFormField :label="tn.campos.tempo">
                    <RegistroDeTempo :t="t" :x="x" :tarefas="tarefas" :pessoas="lista.pessoas" :quem="quem" :somente-leitura="somenteLeitura" modo="atual" />
                  </UFormField>
                </div>
                <UFormField :label="t.painelTarefa.prioridade">
                  <div class="flex flex-wrap gap-x-8 gap-y-2">
                    <label v-for="p in prioridades" :key="p" class="flex items-center gap-2 text-xs">
                      <span class="flex size-4 items-center justify-center rounded-full ring-1 ring-accented">
                        <span v-if="x.tarefa.priority === p" class="size-2 rounded-full bg-primary" />
                      </span>
                      <span class="rounded px-1.5 py-0.5" :class="corDaPrioridade[p]">{{ t.prioridades[p] }}</span>
                    </label>
                  </div>
                </UFormField>
              </div>

              <!-- Proposta: as seções novas -->
              <SecoesDaTarefa
                :key="`${x.tarefa.id}-${estadoDaTela}`"
                :t="t"
                :x="x"
                :itens="itens"
                :tarefas="tarefas"
                :pessoas="lista.pessoas"
                :mencoes="mencoes"
                :quem="quem"
                :somente-leitura="somenteLeitura"
                class="mt-4"
                @abrir="(y: TarefaDoItem) => emit('abrir', y)"
              />
            </div>

            <!-- Fora do escopo -->
            <div v-else :key="aba" class="flex h-full items-center justify-center p-8 text-center">
              <p class="max-w-xs text-sm text-muted">{{ t.painelTarefa.foraDoEscopo(abas.find(a => a.value === aba)?.label ?? '') }}</p>
            </div>
          </Transition>
        </div>
      </div>
    </template>

    <template #footer>
      <UButton :label="t.painelTarefa.salvarAlteracoes" color="neutral" variant="outline" size="sm" @click="aviso(t.painelTarefa.salvarAlteracoes)" />
      <UButton :label="t.painelTarefa.guardarProgresso" color="neutral" variant="outline" size="sm" @click="aviso(t.painelTarefa.guardarProgresso)" />
      <UButton v-if="concluida(x)" :label="t.apontamento.reabrir" icon="i-lucide-rotate-ccw" color="neutral" variant="outline" size="sm" :disabled="somenteLeitura" @click="reabrirTarefa(x)" />
      <UButton v-else :label="t.painelTarefa.concluir" size="sm" :disabled="somenteLeitura" @click="abrirConclusao" />
    </template>
  </USlideover>

  <!-- Proposta: concluir com motivo -->
  <UModal v-model:open="modalConcluir" :title="tr.conclusao.titulo" :description="x.tarefa.name" :ui="{ footer: 'justify-end gap-2' }">
    <template #body>
      <div class="flex flex-col gap-4">
        <URadioGroup v-model="motivo" :legend="tr.conclusao.motivo" :items="opcoesDeMotivo" variant="table" />
        <USelectMenu
          v-if="motivo === 'duplicada'"
          v-model="duplicadaDe"
          :items="outrasTarefas"
          value-key="value"
          :placeholder="tr.conclusao.escolhaTarefa"
          icon="i-lucide-copy"
          class="w-full"
        />
        <UFormField :label="tr.conclusao.nota">
          <UTextarea v-model="nota" :rows="2" autoresize class="w-full" />
        </UFormField>
        <div v-if="abertas.length" class="flex flex-col gap-2 rounded-md bg-elevated/60 p-3">
          <p class="flex items-center gap-1.5 text-xs text-muted"><UIcon name="i-lucide-git-branch" class="size-3.5" />{{ tr.conclusao.abertas(abertas.length) }}</p>
          <UCheckbox v-model="concluirAbertas" :label="tr.conclusao.concluirAbertas(abertas.length)" />
        </div>
      </div>
    </template>
    <template #footer>
      <UButton :label="tr.conclusao.cancelar" color="neutral" variant="outline" @click="modalConcluir = false" />
      <UButton :label="tr.conclusao.confirmar" icon="i-lucide-check" :disabled="!podeConcluir" @click="confirmarConclusao" />
    </template>
  </UModal>
</template>
