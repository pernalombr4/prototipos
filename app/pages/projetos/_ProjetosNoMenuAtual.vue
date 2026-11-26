<script setup lang="ts">
/**
 * PROPOSTA: a seção Projetos no menu lateral de hoje, logo abaixo de Spaceflows.
 *
 * O mesmo comportamento do painel Projetos do menu novo, no formato das seções de hoje (item com seta
 * que abre os filhos, filhos recuados):
 *  - aparece depois do 1º projeto que a pessoa enxerga;
 *  - lista os projetos do menu da pessoa, na ordem dela (arrastar, ou Alt e as setas), cada um com as
 *    categorias e as telas dele;
 *  - o ••• do projeto e da categoria são os mesmos do painel;
 *  - "+" cria projeto (proprietário e Full); "Ver todos os N projetos" leva ao diretório.
 * Sem a busca do painel: no menu de hoje a busca é a do "Buscar...", e o diretório tem a dele.
 */
import type { DropdownMenuItem } from '@nuxt/ui'
import type { Textos } from './textos'
import type { Projeto } from './mocks'
import { COR_DO_PROJETO, ICONE_DA_VISIBILIDADE, PONTO_DA_SITUACAO, useMarcaDeProposta, useProjetos } from './estado'

const props = defineProps<{ t: Textos }>()

const prj = useProjetos()
const { noMenu, visiveis, expandidos, tela, estadoDaTela, souDono, janelas } = prj
const { marca } = useMarcaDeProposta()
const toast = useToast()

const aberto = ref(true)

function alternar(id: number) {
  expandidos.value = expandidos.value.includes(id) ? expandidos.value.filter(x => x !== id) : [...expandidos.value, id]
}

const projetoAtivo = computed(() => tela.value.tipo === 'projeto' ? tela.value.id : null)
const categoriaAtiva = computed(() => tela.value.tipo === 'categoria' ? tela.value.id : null)

function acoesDoProjeto(p: Projeto): DropdownMenuItem[][] {
  return [
    [
      { label: props.t.painel.abrirPagina, icon: 'i-lucide-panel-top', onSelect: () => prj.abrirProjeto(p.id) },
      ...(prj.podeAdministrar(p)
        ? [{ label: props.t.painel.configurar, icon: 'i-lucide-settings', onSelect: () => { janelas.configurar.value = { id: p.id, aba: 'geral' } } }]
        : []),
    ],
    [
      { label: props.t.painel.copiarLink, icon: 'i-lucide-link', onSelect: () => toast.add({ title: props.t.painel.linkCopiado, icon: 'i-lucide-check', color: 'success' }) },
      {
        label: props.t.painel.ocultar,
        icon: 'i-lucide-eye-off',
        onSelect: () => {
          prj.ocultarDoMenu(p.id)
          toast.add({ title: props.t.painel.ocultado(p.nome), icon: 'i-lucide-eye-off', color: 'neutral' })
        },
      },
    ],
  ]
}

function acoesDaCategoria(id: number): DropdownMenuItem[][] {
  return [[{ label: props.t.painel.moverCategoria, icon: 'i-lucide-folder-input', onSelect: () => { janelas.mover.value = id } }]]
}

function telaDeMaquete() {
  toast.add({ title: props.t.casca.conteudoIlustrativo, icon: 'i-lucide-info', color: 'neutral' })
}

/* ---------- reordenar: arrastar, ou Alt e as setas ---------- */
const arrastando = ref<number | null>(null)
const mira = ref<{ id: number, antes: boolean } | null>(null)

function soltar(alvo: number) {
  const de = arrastando.value
  if (de === null || !mira.value || de === alvo) return limparArraste()
  const ids = noMenu.value.map(p => p.id).filter(x => x !== de)
  ids.splice(ids.indexOf(alvo) + (mira.value.antes ? 0 : 1), 0, de)
  prj.reordenar(ids)
  limparArraste()
}
function limparArraste() {
  arrastando.value = null
  mira.value = null
}
function sobre(ev: DragEvent, id: number) {
  const r = (ev.currentTarget as HTMLElement).getBoundingClientRect()
  mira.value = { id, antes: ev.clientY < r.top + r.height / 2 }
}
function teclar(ev: KeyboardEvent, id: number) {
  if (!ev.altKey || (ev.key !== 'ArrowUp' && ev.key !== 'ArrowDown')) return
  ev.preventDefault()
  const ids = noMenu.value.map(p => p.id)
  const i = ids.indexOf(id)
  const j = ev.key === 'ArrowUp' ? i - 1 : i + 1
  if (j < 0 || j >= ids.length) return
  ;[ids[i], ids[j]] = [ids[j]!, ids[i]!]
  prj.reordenar(ids)
  nextTick(() => document.getElementById(`prj-atual-${id}`)?.focus())
}
</script>

<template>
  <div v-if="visiveis.length" class="animate-[entrada_0.2s_ease-out_both]" :class="marca">
    <!-- o item da seção, no formato de Categorias e Tarefas -->
    <div class="group flex items-center text-toned transition-colors hover:bg-elevated">
      <button
        type="button"
        class="flex min-w-0 flex-1 items-center gap-2.5 py-2 pl-4 text-left focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
        :aria-expanded="aberto"
        @click="aberto = !aberto"
      >
        <UIcon name="i-lucide-folder-kanban" class="size-4 shrink-0" />
        <span class="flex-1 truncate text-sm">{{ t.menuAtual.itens.projetos }}</span>
      </button>
      <UTooltip v-if="souDono" :text="t.menuAtual.criarProjeto">
        <UButton
          icon="i-lucide-plus"
          size="xs"
          color="neutral"
          variant="ghost"
          class="opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
          :aria-label="t.menuAtual.criarProjeto"
          @click="janelas.criar.value = true"
        />
      </UTooltip>
      <button type="button" class="py-2 pl-1 pr-4 text-muted" :aria-label="t.menuAtual.itens.projetos" :aria-expanded="aberto" @click="aberto = !aberto">
        <UIcon :name="aberto ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'" class="size-4" />
      </button>
    </div>

    <template v-if="aberto">
      <!-- carregando -->
      <div v-if="estadoDaTela === 'carregando'" class="space-y-2 py-2 pl-10 pr-4" role="status" :aria-label="t.painel.carregando">
        <div v-for="n in 4" :key="n" class="flex items-center gap-2">
          <USkeleton class="size-4 rounded" />
          <USkeleton class="h-3.5 flex-1" :style="{ maxWidth: `${55 + (n * 23) % 35}%` }" />
        </div>
      </div>

      <!-- erro -->
      <div v-else-if="estadoDaTela === 'erro'" class="py-2 pl-10 pr-4">
        <p class="flex items-center gap-1.5 text-xs text-default"><UIcon name="i-lucide-cloud-off" class="size-3.5 shrink-0 text-muted" />{{ t.painel.erroTitulo }}</p>
        <UButton :label="t.painel.erroAcao" icon="i-lucide-rotate-cw" size="xs" color="neutral" variant="outline" class="mt-1.5" @click="estadoDaTela = 'normal'" />
      </div>

      <template v-else>
        <p v-if="!noMenu.length" class="py-2 pl-10 pr-4 text-xs text-muted">{{ t.painel.vazioTitulo }}</p>

        <ul>
          <li
            v-for="(p, i) in noMenu"
            :key="p.id"
            class="relative animate-[entrada_0.2s_ease-out_both]"
            :style="{ animationDelay: `${i * 30}ms` }"
            :class="[
              arrastando === p.id ? 'opacity-40' : '',
              mira?.id === p.id && mira.antes ? 'before:absolute before:inset-x-4 before:-top-px before:h-0.5 before:rounded-full before:bg-primary' : '',
              mira?.id === p.id && !mira.antes ? 'after:absolute after:inset-x-4 after:-bottom-px after:h-0.5 after:rounded-full after:bg-primary' : '',
            ]"
            @dragover.prevent="sobre($event, p.id)"
            @drop.prevent="soltar(p.id)"
          >
            <div
              class="group/prj flex items-center pr-2 transition-colors"
              :class="projetoAtivo === p.id ? 'bg-primary/10 text-primary' : 'text-toned hover:bg-elevated'"
              draggable="true"
              @dragstart="arrastando = p.id"
              @dragend="limparArraste"
            >
              <UButton
                :icon="expandidos.includes(p.id) ? 'i-lucide-chevron-down' : 'i-lucide-chevron-right'"
                size="xs"
                color="neutral"
                variant="link"
                class="ml-5 text-muted"
                :aria-label="p.nome"
                :aria-expanded="expandidos.includes(p.id)"
                @click="alternar(p.id)"
              />
              <button
                :id="`prj-atual-${p.id}`"
                type="button"
                class="flex min-w-0 flex-1 items-center gap-2 py-2 text-left focus-visible:outline-2 focus-visible:outline-primary"
                :aria-current="projetoAtivo === p.id ? 'page' : undefined"
                :aria-keyshortcuts="'Alt+ArrowUp Alt+ArrowDown'"
                :title="t.painel.arrastar"
                @click="prj.abrirProjeto(p.id)"
                @keydown="teclar($event, p.id)"
              >
                <span class="flex size-5 shrink-0 items-center justify-center rounded" :class="COR_DO_PROJETO[p.cor]">
                  <UIcon :name="p.icone" class="size-3" />
                </span>
                <span class="min-w-0 flex-1 truncate text-sm" :class="projetoAtivo === p.id ? 'font-medium' : ''">{{ p.nome }}</span>
                <UTooltip v-if="prj.statusAtual(p)" :text="t.situacao[prj.statusAtual(p)!.situacao]">
                  <span class="size-2 shrink-0 rounded-full" :class="PONTO_DA_SITUACAO[prj.statusAtual(p)!.situacao]" role="img" :aria-label="t.situacao[prj.statusAtual(p)!.situacao]" />
                </UTooltip>
                <UTooltip v-if="p.visibilidade !== 'aberto'" :text="t.visibilidade[p.visibilidade]">
                  <UIcon :name="ICONE_DA_VISIBILIDADE[p.visibilidade]" class="size-3.5 shrink-0 text-muted" :aria-label="t.visibilidade[p.visibilidade]" />
                </UTooltip>
              </button>
              <UDropdownMenu :items="acoesDoProjeto(p)" :content="{ align: 'start' }" :ui="{ content: 'w-60' }">
                <UButton
                  icon="i-lucide-ellipsis"
                  size="xs"
                  color="neutral"
                  variant="ghost"
                  class="opacity-0 transition-opacity group-hover/prj:opacity-100 focus-visible:opacity-100 data-[state=open]:opacity-100"
                  :aria-label="t.painel.acoesDoProjeto(p.nome)"
                />
              </UDropdownMenu>
            </div>

            <ul v-if="expandidos.includes(p.id)" class="animate-[entrada_0.15s_ease-out_both]">
              <li
                v-for="c in prj.categoriasDe(p.id)"
                :key="c.id"
                class="group/cat flex items-center pr-2 transition-colors"
                :class="categoriaAtiva === c.id ? 'bg-primary/10 text-primary' : 'text-toned hover:bg-elevated'"
              >
                <button
                  type="button"
                  class="flex min-w-0 flex-1 items-center gap-2.5 py-2 pl-[4.25rem] text-left focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
                  :aria-current="categoriaAtiva === c.id ? 'page' : undefined"
                  @click="prj.abrirCategoria(c.id)"
                >
                  <UIcon :name="c.icon ?? 'i-lucide-folder'" class="size-4 shrink-0" />
                  <span class="truncate text-sm" :class="categoriaAtiva === c.id ? 'font-medium' : ''">{{ c.name }}</span>
                </button>
                <UDropdownMenu v-if="prj.podeAdministrar(p)" :items="acoesDaCategoria(c.id)" :content="{ align: 'start' }">
                  <UButton
                    icon="i-lucide-ellipsis"
                    size="xs"
                    color="neutral"
                    variant="ghost"
                    class="opacity-0 transition-opacity group-hover/cat:opacity-100 focus-visible:opacity-100 data-[state=open]:opacity-100"
                    :aria-label="t.painel.acoesDaCategoria(c.name)"
                  />
                </UDropdownMenu>
              </li>
              <li v-for="s in p.telas" :key="s.nome">
                <button type="button" class="flex w-full items-center gap-2.5 py-2 pl-[4.25rem] pr-4 text-left text-toned transition-colors hover:bg-elevated focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary" @click="telaDeMaquete">
                  <UIcon :name="s.icone" class="size-4 shrink-0" />
                  <span class="truncate text-sm">{{ s.nome }}</span>
                </button>
              </li>
              <li v-if="!prj.categoriasDe(p.id).length" class="py-2 pl-[4.25rem] pr-4">
                <p class="text-xs text-muted">{{ t.painel.semCategoria }}</p>
                <UButton
                  v-if="prj.podeAdministrar(p)"
                  :label="t.painel.adicionarCategoria"
                  icon="i-lucide-plus"
                  size="xs"
                  color="neutral"
                  variant="outline"
                  class="mt-1.5"
                  @click="janelas.configurar.value = { id: p.id, aba: 'categorias' }"
                />
              </li>
            </ul>
          </li>
        </ul>

        <!-- o pé da seção: o diretório -->
        <button
          type="button"
          class="flex w-full items-center gap-2.5 py-2 pl-10 pr-4 text-left transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
          :class="tela.tipo === 'diretorio' ? 'bg-primary/10 font-medium text-primary' : 'text-muted hover:bg-elevated hover:text-default'"
          :aria-current="tela.tipo === 'diretorio' ? 'page' : undefined"
          @click="tela = { tipo: 'diretorio' }"
        >
          <UIcon name="i-lucide-list" class="size-4 shrink-0" />
          <span class="truncate text-sm">{{ t.painel.verTodos(visiveis.length) }}</span>
        </button>
      </template>
    </template>
  </div>
</template>
