<script setup lang="ts">
/**
 * O Spaceflow, com o nó Tarefa aberto: onde se define se a tarefa que o nó cria aparece na Agenda (pedido da redatora
 * em 24/11/2026, "deve ser possível definir na geração da tarefa se ela aparece na agenda ou não automaticamente").
 *
 * ⚠️ A CASCA NÃO É PROPOSTA:
 *  - menu lateral, barra do topo e trilha: `../no-de-atraso/_CascaDasConfiguracoes.vue`, copiada do develop em
 *    14/10/2026 e conferida em 15/10/2026 (a mesma que o protótipo `spaceflow` importa);
 *  - abas do editor, trilho, canvas, cards, zoom e botão da paleta: o desenho de `../no-de-atraso/_EditorDoSpaceflow.vue`,
 *    com os nós deste fluxo (Start, Tarefa, End);
 *  - o modal do nó: a moldura do develop (ENTRADA à esquerda, SAÍDA à direita, rodapé com Modificado, Cancelar e Salvar
 *    e fechar) e as seções do bloco de tarefa na ordem do develop, do inventário de 15/10/2026 do `spaceflow/BRIEFING.md`
 *    (Definição da Tarefa, Tempo de conclusão, Classificação, Permissões e Responsabilidade, Habilitar Tarefa Externa).
 *    As seções de hoje ficam recolhidas: não estão em discussão.
 *
 * O que é proposta: a seção "Agenda", depois de "Tempo de conclusão" (é o prazo que põe a tarefa na grade), com 1
 * opção, "Mostrar a tarefa na Agenda", ligada por padrão. Desligada, a tarefa que o nó cria fica só em Tarefas: a
 * Agenda não mostra o prazo dela nem a oferece no painel Sem data. Vale para as tarefas criadas daqui em diante.
 * Campo novo no nó (inventado, não existe no `WorkflowNode`): `show_in_calendar: boolean`, gravado na tarefa criada.
 */
import type { Textos } from './textos'
import CascaDasConfiguracoes from '../no-de-atraso/_CascaDasConfiguracoes.vue'
import { textos as textosDoAtraso } from '../no-de-atraso/textos'
import { textosDoSpaceflow } from './textos-spaceflow'
import { workspace } from './mocks'

defineProps<{ t: Textos }>()
const toast = useToast()
const tc = useTextos(textosDoAtraso)
const s = useTextos(textosDoSpaceflow)

/* ---------- o nó salvo e o rascunho do modal ---------- */
const salvo = reactive({ nome: '', tarefa: '', conteudo: '', naAgenda: true })
watch(s, (x) => {
  Object.assign(salvo, { nome: x.no.nome, tarefa: x.nomeDaTarefaExemplo, conteudo: x.conteudoExemplo })
}, { immediate: true })
const rascunho = reactive({ ...salvo })
const aberto = ref(true)
const salvando = ref(false)
const confirmarDescarte = ref(false)
const abertas = ref<string[]>(['definicao', 'agenda'])
watch(aberto, (a) => {
  if (!a) return
  Object.assign(rascunho, salvo)
  confirmarDescarte.value = false
})
const modificado = computed(() => rascunho.nome !== salvo.nome || rascunho.tarefa !== salvo.tarefa || rascunho.naAgenda !== salvo.naAgenda)

function alternar(id: string) {
  abertas.value = abertas.value.includes(id) ? abertas.value.filter(x => x !== id) : [...abertas.value, id]
}
function fechar() {
  if (modificado.value && !confirmarDescarte.value) {
    confirmarDescarte.value = true
    return
  }
  aberto.value = false
}
function salvar() {
  salvando.value = true
  setTimeout(() => {
    salvando.value = false
    Object.assign(salvo, rascunho)
    aberto.value = false
    toast.add({ title: salvo.naAgenda ? s.value.salvoNaAgenda : s.value.salvoForaDaAgenda, icon: salvo.naAgenda ? 'i-lucide-calendar-check' : 'i-lucide-calendar-off', color: 'success' })
  }, 500)
}

/** As seções do bloco de tarefa, na ordem do develop; "agenda" é a única nova. */
const secoes = computed(() => [
  { id: 'definicao', titulo: s.value.secoes.definicao, icone: 'i-lucide-file-text' },
  { id: 'tempo', titulo: s.value.secoes.tempo, icone: 'i-lucide-clock' },
  { id: 'agenda', titulo: s.value.secoes.agenda, icone: 'i-lucide-calendar-days', nova: true },
  { id: 'classificacao', titulo: s.value.secoes.classificacao, icone: 'i-lucide-star' },
  { id: 'permissoes', titulo: s.value.secoes.permissoes, icone: 'i-lucide-shield' },
  { id: 'externa', titulo: s.value.secoes.externa, icone: 'i-lucide-external-link' },
])

const ferramentas = [
  [
    { kind: 'undo', icon: 'i-lucide-undo-2' },
    { kind: 'redo', icon: 'i-lucide-redo-2' },
  ],
  [
    { kind: 'mark', mark: 'bold', icon: 'i-lucide-bold' },
    { kind: 'mark', mark: 'italic', icon: 'i-lucide-italic' },
    { kind: 'mark', mark: 'underline', icon: 'i-lucide-underline' },
    { kind: 'mark', mark: 'strike', icon: 'i-lucide-strikethrough' },
    { kind: 'mark', mark: 'code', icon: 'i-lucide-code' },
  ],
] as const

/* ---------- o canvas (cópia do develop) ---------- */
const nos = computed(() => [
  { id: 'start', icone: 'i-lucide-arrow-right-to-line', x: 40, cheio: true },
  { id: 'tarefa', icone: 'i-lucide-clipboard-check', x: 380 },
  { id: 'end', icone: 'i-lucide-circle-dot', x: 720 },
])
const LARGURA = 280
const Y = 120
</script>

<template>
  <CascaDasConfiguracoes :t="tc" :workspace="workspace.name" :slug="workspace.reference" :fluxo-id="s.fluxo.id">
    <div class="flex min-h-0 flex-1 flex-col pb-(--altura-do-andaime)">
      <!-- Abas do editor (cópia do develop) -->
      <div class="flex h-11 shrink-0 items-center gap-1 border-b border-default px-3">
        <UButton icon="i-lucide-file" color="neutral" variant="outline" size="xs" class="mr-2 rounded-full" :aria-label="tc.editor.detalhes" />
        <UButton icon="i-lucide-git-fork" :label="tc.editor.abas.editor" color="primary" variant="ghost" size="xs" />
        <UButton icon="i-lucide-play" :label="tc.editor.abas.execucoes" color="neutral" variant="ghost" size="xs" />
        <UButton icon="i-lucide-history" :label="tc.editor.abas.versoes" color="neutral" variant="ghost" size="xs" />
        <UButton icon="i-lucide-message-circle" :label="tc.editor.abas.comentarios" color="neutral" variant="ghost" size="xs" />
        <UButton icon="i-lucide-scroll-text" :label="tc.editor.abas.logs" color="neutral" variant="ghost" size="xs" />
        <span class="ml-auto flex items-center gap-1 border-l border-default pl-3 text-xs text-muted">
          <UButton icon="i-lucide-chevron-left" color="neutral" variant="ghost" size="xs" aria-label="1/3" />
          1/3
          <UButton icon="i-lucide-chevron-right" color="neutral" variant="ghost" size="xs" aria-label="1/3" />
        </span>
      </div>

      <div class="flex min-h-0 flex-1">
        <!-- Trilho da esquerda -->
        <div class="flex w-12 shrink-0 flex-col items-center gap-3 border-r border-default pt-3">
          <UIcon name="i-lucide-tag" class="size-4 text-muted" />
          <UIcon name="i-lucide-zap" class="size-4 text-muted" />
          <UIcon name="i-lucide-calendar-plus" class="size-4 text-muted" />
        </div>

        <!-- Canvas -->
        <div class="relative min-w-0 flex-1 overflow-hidden bg-default bg-[linear-gradient(to_right,var(--ui-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--ui-border)_1px,transparent_1px)] bg-size-[40px_40px]">
          <UButton icon="i-lucide-save" color="neutral" variant="ghost" size="sm" class="absolute right-3 top-3 z-10" :aria-label="tc.editor.salvar" />

          <div class="absolute left-0 top-0 origin-top-left scale-90" style="width: 1100px; height: 420px">
            <svg class="pointer-events-none absolute inset-0 size-full" aria-hidden="true">
              <line v-for="i in 2" :key="i" :x1="nos[i - 1]!.x + LARGURA" :x2="nos[i]!.x" :y1="Y + 54" :y2="Y + 54" class="stroke-(--ui-border-accented)" stroke-width="2" />
            </svg>
            <component
              :is="no.id === 'tarefa' ? 'button' : 'div'"
              v-for="(no, i) in nos"
              :key="no.id"
              :type="no.id === 'tarefa' ? 'button' : undefined"
              class="absolute flex min-h-31 flex-col rounded-xl border border-default bg-default px-4 pb-3 pt-4 text-left shadow-sm transition-[box-shadow,transform] duration-200"
              :class="no.id === 'tarefa' && 'cursor-pointer hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-primary'"
              :style="{ left: `${no.x}px`, top: `${Y}px`, width: `${LARGURA}px`, animation: `entrada .36s ease-out ${i * 70}ms backwards` }"
              :aria-label="no.id === 'tarefa' ? s.no.abrir(salvo.nome) : undefined"
              @click="no.id === 'tarefa' && (aberto = true)"
            >
              <span v-if="no.id !== 'start'" class="absolute -left-2 top-[46px] size-4 rounded-full bg-primary/70" />
              <span v-if="no.id !== 'end'" class="absolute -right-2 top-[46px] size-4 rounded-full bg-primary/70" />
              <span class="flex items-start gap-3">
                <span class="flex size-10 shrink-0 items-center justify-center rounded-lg" :class="no.cheio ? 'bg-primary text-inverted' : 'bg-elevated text-primary'">
                  <UIcon :name="no.icone" class="size-5" />
                </span>
                <span class="min-w-0">
                  <span class="block text-base font-semibold text-highlighted">{{ no.id === 'tarefa' ? salvo.nome : tc.nos[no.id as 'start' | 'end'].titulo }}</span>
                  <span class="mt-0.5 block text-sm leading-snug text-muted">
                    <template v-if="no.id === 'start'">
                      {{ tc.nos.start.quandoUmItemFor }} <strong class="text-highlighted underline">{{ tc.nos.start.criado }}</strong>
                      {{ tc.nos.start.naCategoria }} <strong class="text-highlighted underline">{{ s.fluxo.categoria }}</strong>
                    </template>
                    <span v-else class="line-clamp-2">{{ no.id === 'tarefa' ? s.no.descricao : tc.nos.end.descricao }}</span>
                  </span>
                </span>
              </span>
              <span class="mt-auto flex items-center gap-2 pt-3 text-xs font-medium tracking-wide">
                <span class="size-2 rounded-full bg-success" />
                <span class="text-muted">{{ tc.nos.ok }}</span>
              </span>
            </component>
          </div>

          <div class="absolute bottom-4 left-3 flex flex-col overflow-hidden rounded-md border border-default bg-default shadow-sm">
            <UButton icon="i-lucide-plus" color="neutral" variant="ghost" size="xs" :aria-label="tc.editor.zoomMais" />
            <UButton icon="i-lucide-minus" color="neutral" variant="ghost" size="xs" :aria-label="tc.editor.zoomMenos" />
            <UButton icon="i-lucide-scan" color="neutral" variant="ghost" size="xs" :aria-label="tc.editor.ajustar" />
            <UButton icon="i-lucide-network" color="neutral" variant="ghost" size="xs" :aria-label="tc.editor.organizar" />
          </div>
          <UTooltip :text="tc.editor.adicionarNo">
            <UButton icon="i-lucide-blocks" color="primary" size="lg" class="absolute right-4 top-1/2 -translate-y-1/2 rounded-full" :aria-label="tc.editor.adicionarNo" />
          </UTooltip>
        </div>
      </div>
    </div>
  </CascaDasConfiguracoes>

  <!-- O modal do nó Tarefa: moldura do develop; a seção Agenda é a proposta -->
  <UModal v-model:open="aberto" :dismissible="!modificado" :ui="{ content: 'max-w-none w-auto bg-transparent shadow-none ring-0 divide-y-0 overflow-visible' }">
    <template #content>
      <div class="flex items-center">
        <div class="relative z-10 flex max-h-[min(84dvh,780px)] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-xl border border-default bg-default shadow-xl sm:w-[560px]">
          <div class="flex items-center gap-2 border-b border-default px-5 py-4">
            <UIcon name="i-lucide-clipboard-check" class="size-4 text-muted" />
            <h2 class="flex-1 text-base font-semibold text-highlighted">{{ s.no.tipo }}</h2>
            <UButton icon="i-lucide-x" color="neutral" variant="ghost" size="sm" :aria-label="tc.hoje.fechar" @click="fechar" />
          </div>

          <div class="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-5">
            <UFormField :label="tc.hoje.nomeDoNo">
              <template #hint>
                <UTooltip :text="tc.hoje.ajudaNome"><UIcon name="i-lucide-circle-help" class="size-4 text-muted" /></UTooltip>
              </template>
              <UInput v-model="rascunho.nome" class="w-full" />
            </UFormField>

            <section v-for="sec in secoes" :key="sec.id" class="rounded-lg" :class="sec.nova && 'border border-primary/40 bg-primary/5 px-3 py-2 ring-2 ring-primary/15'">
              <button type="button" class="flex w-full items-center gap-2 py-2 text-left" :aria-expanded="abertas.includes(sec.id)" @click="alternar(sec.id)">
                <UIcon :name="sec.icone" class="size-4 text-toned" />
                <span class="flex-1 text-sm font-semibold text-highlighted">{{ sec.titulo }}</span>
                <UBadge v-if="sec.nova" :label="s.novo" color="primary" variant="subtle" size="sm" />
                <UIcon name="i-lucide-chevron-down" class="size-4 text-muted transition-transform duration-200" :class="abertas.includes(sec.id) && 'rotate-180'" />
              </button>

              <div v-if="abertas.includes(sec.id)" class="animate-[entrada_.2s_ease-out_both] space-y-4 pb-2 pt-1">
                <template v-if="sec.id === 'definicao'">
                  <UFormField :label="s.nomeDaTarefa" required>
                    <UInput v-model="rascunho.tarefa" class="w-full" />
                  </UFormField>
                  <UFormField :label="s.conteudoDaTarefa" required>
                    <ClientOnly>
                      <div class="rounded-md border border-accented bg-default focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/15">
                        <UEditor v-slot="{ editor }" v-model="rascunho.conteudo" content-type="html" :placeholder="s.conteudoPlaceholder" :ui="{ base: 'min-h-24 px-3 py-2 text-sm *:my-1.5 focus:outline-none' }">
                          <div class="border-b border-default px-1 py-0.5">
                            <UEditorToolbar :editor="editor" :items="ferramentas as any" size="xs" />
                          </div>
                        </UEditor>
                      </div>
                      <template #fallback><USkeleton class="h-32 w-full" /></template>
                    </ClientOnly>
                  </UFormField>
                </template>

                <template v-else-if="sec.id === 'agenda'">
                  <USwitch v-model="rascunho.naAgenda" :label="s.mostrar" :description="rascunho.naAgenda ? s.ligado : s.desligado">
                    <template #label>
                      <span class="flex items-center gap-1.5">
                        {{ s.mostrar }}
                        <UTooltip :text="s.ajuda" :ui="{ content: 'h-auto max-w-72 py-1.5', text: 'whitespace-normal' }">
                          <UIcon name="i-lucide-circle-help" class="size-4 text-muted" :aria-label="s.ajuda" />
                        </UTooltip>
                      </span>
                    </template>
                  </USwitch>
                  <p v-if="rascunho.naAgenda" class="flex gap-1.5 text-xs text-muted">
                    <UIcon name="i-lucide-info" class="mt-0.5 size-3.5 shrink-0" />{{ s.pessoaDecide }}
                  </p>
                </template>

                <p v-else class="rounded-md border border-dashed border-default p-3 text-center text-xs text-muted">{{ s.semMudanca }}</p>
              </div>
            </section>
          </div>

          <div class="flex items-center gap-2 border-t border-default px-5 py-3">
            <span v-if="modificado" class="flex items-center gap-1.5 text-xs text-warning"><span class="size-1.5 rounded-full bg-warning" />{{ tc.hoje.modificado }}</span>
            <span class="flex-1" />
            <template v-if="confirmarDescarte">
              <span class="text-xs text-toned">{{ s.descartar }}</span>
              <UButton :label="s.confirmar" color="error" size="xs" @click="confirmarDescarte = false; aberto = false" />
              <UButton :label="tc.hoje.cancelar" color="neutral" variant="ghost" size="xs" @click="confirmarDescarte = false" />
            </template>
            <template v-else>
              <UButton :label="tc.hoje.cancelar" color="neutral" variant="outline" @click="fechar" />
              <UButton :label="tc.hoje.salvarEFechar" icon="i-lucide-check" :loading="salvando" @click="salvar" />
            </template>
          </div>
        </div>

        <!-- ENTRADA e SAÍDA, como no develop -->
        <div class="order-first -mr-2 hidden h-64 w-12 items-center justify-center rounded-l-xl border border-r-0 border-default bg-default/80 sm:flex">
          <span class="flex rotate-180 items-center gap-2 text-xs font-semibold tracking-[0.2em] text-primary [writing-mode:vertical-rl]">{{ tc.hoje.entrada }}</span>
        </div>
        <div class="-ml-2 hidden h-64 w-12 items-center justify-center rounded-r-xl border border-l-0 border-default bg-default/80 sm:flex">
          <span class="flex rotate-180 items-center gap-2 text-xs font-semibold tracking-[0.2em] text-success [writing-mode:vertical-rl]">{{ tc.hoje.saida }}</span>
        </div>
      </div>
    </template>
  </UModal>
</template>
