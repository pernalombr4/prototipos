<script setup lang="ts">
/**
 * PROPOSTA: o painel Projetos, aberto pelo ícone da trilha.
 *
 *  - o menu é da pessoa: os projetos que ela mostra, na ordem dela (arrastar, ou Alt e as setas);
 *  - cada projeto é uma seção com Visão geral, Tarefas, Automações, as categorias e os painéis dele (_ConteudoDoProjeto); abre e fecha por pessoa;
 *  - a busca acha também os projetos "Fora do seu menu" que ela enxerga;
 *  - no topo da lista, Todos os projetos (o diretório) e Metas, como itens (rodada 9; antes, "Ver todos" no pé);
 *  - o ••• do projeto: Abrir a página, Configurações (administrador), Ocultar do meu menu, Copiar o link.
 *
 * Fonte: seção 1 do relatório "Usabilidade de projetos no ENSPACE" (Notion, Asana, Jira, ClickUp).
 *
 * Rodada 3: o ponto do status ao lado do nome, e o "?" do cabeçalho, que diz quando usar projeto,
 * seção do workspace ou favorito (as 3 camadas convivem; nenhuma sai).
 */
import type { DropdownMenuItem } from '@nuxt/ui'
import type { Textos } from './textos'
import type { Projeto } from './mocks'
import ConteudoDoProjeto from './_ConteudoDoProjeto.vue'
import AdicionarAoProjeto from './_AdicionarAoProjeto.vue'
import { useAdicionarAoProjeto } from './adicionarAoProjeto'
import { useMenuDoProjeto } from './menuDoProjeto'
import { textosDeMarcosEMedicao } from './textosDeMarcosEMedicao'
import { COR_DO_PROJETO, ICONE_DA_VISIBILIDADE, PONTO_DA_SITUACAO, useMarcaDeProposta, useProjetos } from './estado'

const props = defineProps<{ t: Textos }>()
const emit = defineEmits<{ recolher: [] }>()

const prj = useProjetos()
const { noMenu, visiveis, expandidos, tela, estadoDaTela, souDono, janelas } = prj
const toast = useToast()
const { marca } = useMarcaDeProposta()
const tmd = useTextos(textosDeMarcosEMedicao)
/** Rodada 9: Todos os projetos (o diretório, onde o clique na trilha já cai) e Metas, como itens do menu. */
const geraisDoPainel = computed(() => [
  { tipo: 'diretorio' as const, rotulo: tmd.value.menu.geral, icone: 'i-lucide-layout-list', n: visiveis.value.length },
  { tipo: 'metas' as const, rotulo: tmd.value.menu.metas, icone: 'i-lucide-target', n: undefined as number | undefined },
])
const camadas = computed(() => [
  { icone: 'i-lucide-folder-kanban', titulo: props.t.camadas.projeto, texto: props.t.camadas.projetoTexto },
  { icone: 'i-lucide-building', titulo: props.t.camadas.secao, texto: props.t.camadas.secaoTexto },
  { icone: 'i-lucide-star', titulo: props.t.camadas.favorito, texto: props.t.camadas.favoritoTexto },
])

const buscando = ref(false)
const termo = ref('')
const campo = useTemplateRef<{ inputRef?: HTMLInputElement }>('campo')

function abrirBusca() {
  buscando.value = true
  nextTick(() => campo.value?.inputRef?.focus())
}
function fecharBusca() {
  buscando.value = false
  termo.value = ''
}

const normalizar = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()
const bate = (p: Projeto) => normalizar(p.nome).includes(normalizar(termo.value.trim()))

const lista = computed(() => termo.value.trim() ? noMenu.value.filter(bate) : noMenu.value)
const foraDoMenu = computed(() => termo.value.trim()
  ? visiveis.value.filter(p => !noMenu.value.some(m => m.id === p.id) && bate(p))
  : [])

function alternar(id: number) {
  expandidos.value = expandidos.value.includes(id)
    ? expandidos.value.filter(x => x !== id)
    : [...expandidos.value, id]
}

const projetoAtivo = computed(() => {
  const v = tela.value
  if (v.tipo === 'projeto') return v.id
  if (v.tipo === 'categoria') return prj.categorias.value.find(c => c.id === v.id)?.projeto ?? null
  return null
})
const categoriaAtiva = computed(() => tela.value.tipo === 'categoria' ? tela.value.id : null)

const adicionar = useAdicionarAoProjeto()
/** Rodada 13: Ocultar do menu, com Salvar para mim ou Salvar para todos para quem administra. */
const menuDoProjeto = useMenuDoProjeto()

function acoesDoProjeto(p: Projeto): DropdownMenuItem[][] {
  return [
    ...adicionar.grupoDoMenu(p),
    [
      { label: props.t.painel.abrirPagina, icon: 'i-lucide-panel-top', onSelect: () => prj.abrirProjeto(p.id) },
      ...(prj.podeAdministrar(p)
        ? [{ label: props.t.painel.configurar, icon: 'i-lucide-settings', onSelect: () => { janelas.configurar.value = { id: p.id, aba: 'geral' } } }]
        : []),
    ],
    [
      { label: props.t.painel.copiarLink, icon: 'i-lucide-link', onSelect: () => toast.add({ title: props.t.painel.linkCopiado, icon: 'i-lucide-check', color: 'success' }) },
      ...menuDoProjeto.itens(p),
    ],
  ]
}



/* ---------- reordenar: arrastar, ou Alt e as setas ---------- */
const arrastando = ref<number | null>(null)
const mira = ref<{ id: number, antes: boolean } | null>(null)

function soltar(alvo: number) {
  const de = arrastando.value
  if (de === null || !mira.value || de === alvo) return limparArraste()
  const ids = noMenu.value.map(p => p.id).filter(x => x !== de)
  const pos = ids.indexOf(alvo) + (mira.value.antes ? 0 : 1)
  ids.splice(pos, 0, de)
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
  nextTick(() => document.getElementById(`prj-linha-${id}`)?.focus())
}
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <!-- cabeçalho: o mesmo do painel da trilha, com a busca e o "+" do projeto -->
    <div v-if="buscando" class="flex h-12 shrink-0 items-center border-b border-default px-2">
      <UInput
        ref="campo"
        v-model="termo"
        icon="i-lucide-search"
        size="sm"
        class="w-full animate-[entrada_0.15s_ease-out_both]"
        :placeholder="t.painel.buscar"
        :aria-label="t.painel.buscar"
        @keydown.esc="fecharBusca"
      >
        <template #trailing>
          <UButton icon="i-lucide-x" size="xs" color="neutral" variant="link" :aria-label="t.painel.fecharBusca" @click="fecharBusca" />
        </template>
      </UInput>
    </div>
    <div v-else class="flex h-12 shrink-0 items-center gap-0.5 border-b border-default pl-3 pr-1.5">
      <h2 class="min-w-0 flex-1 truncate text-sm font-bold text-highlighted">{{ t.nome.plural }}</h2>
      <UPopover :content="{ side: 'right', align: 'start' }">
        <UButton icon="i-lucide-circle-help" size="xs" color="neutral" variant="ghost" :class="marca" :aria-label="t.camadas.pergunta" />
        <template #content>
          <div class="w-80 space-y-3 p-3">
            <p class="text-sm font-semibold text-highlighted">{{ t.camadas.pergunta }}</p>
            <div v-for="c in camadas" :key="c.titulo" class="flex gap-2.5">
              <span class="flex size-7 shrink-0 items-center justify-center rounded-md bg-elevated"><UIcon :name="c.icone" class="size-4 text-toned" /></span>
              <p class="min-w-0 text-sm">
                <span class="block font-medium text-highlighted">{{ c.titulo }}</span>
                <span class="block text-muted">{{ c.texto }}</span>
              </p>
            </div>
          </div>
        </template>
      </UPopover>
      <UTooltip :text="t.painel.buscar">
        <UButton icon="i-lucide-search" size="xs" color="neutral" variant="ghost" :aria-label="t.painel.buscar" @click="abrirBusca" />
      </UTooltip>
      <UTooltip :text="t.casca.recolherMenu">
        <UButton icon="i-lucide-chevrons-left" size="xs" color="neutral" variant="ghost" :aria-label="t.casca.recolherMenu" @click="emit('recolher')" />
      </UTooltip>
      <UTooltip v-if="souDono" :text="t.painel.criar">
        <UButton icon="i-lucide-plus" size="xs" color="neutral" variant="ghost" :aria-label="t.painel.criar" @click="janelas.criar.value = true" />
      </UTooltip>
    </div>

    <!-- carregando -->
    <div v-if="estadoDaTela === 'carregando'" class="space-y-2 p-3" role="status" :aria-label="t.painel.carregando">
      <div v-for="n in 5" :key="n" class="flex items-center gap-2">
        <USkeleton class="size-6 rounded-md" />
        <USkeleton class="h-4 flex-1" :style="{ maxWidth: `${60 + (n * 23) % 35}%` }" />
      </div>
    </div>

    <!-- erro -->
    <div v-else-if="estadoDaTela === 'erro'" class="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
      <UIcon name="i-lucide-cloud-off" class="size-8 text-muted" />
      <p class="text-sm text-default">{{ t.painel.erroTitulo }}</p>
      <UButton :label="t.painel.erroAcao" icon="i-lucide-rotate-cw" size="sm" color="neutral" variant="outline" @click="estadoDaTela = 'normal'" />
    </div>

    <template v-else>
      <div class="min-h-0 flex-1 overflow-y-auto px-2 py-2">
        <!-- nenhum projeto no menu da pessoa -->
        <div v-if="!noMenu.length && !termo" class="flex flex-col items-center gap-3 px-4 py-10 text-center animate-[entrada_0.2s_ease-out_both]">
          <span class="flex size-10 items-center justify-center rounded-lg bg-elevated"><UIcon name="i-lucide-folder-kanban" class="size-5 text-muted" /></span>
          <p class="text-sm font-semibold text-highlighted">{{ t.painel.vazioTitulo }}</p>
          <p class="text-xs text-muted">{{ t.painel.vazioTexto }}</p>
          <UButton :label="t.painel.vazioAcao" icon="i-lucide-list" size="sm" color="neutral" variant="outline" @click="tela = { tipo: 'diretorio' }" />
        </div>

        <!-- Rodada 9: as entradas gerais, no formato das linhas dos projetos (o pé "Ver todos" saiu) -->
        <ul v-if="!termo && visiveis.length" class="mb-1.5 space-y-0.5 border-b border-default pb-1.5">
          <li v-for="g in geraisDoPainel" :key="g.tipo">
            <button
              type="button"
              class="flex w-full items-center gap-2 rounded-md py-1.5 pl-7 pr-1 text-left transition-colors focus-visible:outline-2 focus-visible:outline-primary"
              :class="[tela.tipo === g.tipo ? 'bg-primary/10' : 'hover:bg-elevated', g.tipo === 'metas' ? marca : '']"
              :aria-current="tela.tipo === g.tipo ? 'page' : undefined"
              @click="tela = { tipo: g.tipo }"
            >
              <span class="flex size-6 shrink-0 items-center justify-center rounded-md bg-elevated text-toned"><UIcon :name="g.icone" class="size-3.5" /></span>
              <span class="min-w-0 flex-1 truncate text-sm font-semibold" :class="tela.tipo === g.tipo ? 'text-primary' : 'text-highlighted'">{{ g.rotulo }}</span>
              <span v-if="g.n !== undefined" class="pr-1 text-xs tabular-nums text-muted">{{ g.n }}</span>
            </button>
          </li>
        </ul>

        <ul class="space-y-0.5">
          <li
            v-for="(p, i) in lista"
            :key="p.id"
            class="relative animate-[entrada_0.2s_ease-out_both]"
            :style="{ animationDelay: `${i * 30}ms` }"
            :class="[
              arrastando === p.id ? 'opacity-40' : '',
              mira?.id === p.id && mira.antes ? 'before:absolute before:inset-x-1 before:-top-0.5 before:h-0.5 before:rounded-full before:bg-primary' : '',
              mira?.id === p.id && !mira.antes ? 'after:absolute after:inset-x-1 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-primary' : '',
            ]"
            @dragover.prevent="sobre($event, p.id)"
            @drop.prevent="soltar(p.id)"
          >
            <!-- a linha do projeto -->
            <div
              class="group flex items-center gap-1 rounded-md pr-1 transition-colors hover:bg-elevated"
              :class="projetoAtivo === p.id && tela.tipo === 'projeto' ? 'bg-primary/10' : ''"
              :draggable="!termo"
              @dragstart="arrastando = p.id"
              @dragend="limparArraste"
            >
              <UButton
                :icon="expandidos.includes(p.id) ? 'i-lucide-chevron-down' : 'i-lucide-chevron-right'"
                size="xs"
                color="neutral"
                variant="link"
                class="text-muted"
                :aria-label="p.nome"
                :aria-expanded="expandidos.includes(p.id)"
                @click="alternar(p.id)"
              />
              <button
                :id="`prj-linha-${p.id}`"
                type="button"
                class="flex min-w-0 flex-1 items-center gap-2 rounded py-1.5 text-left focus-visible:outline-2 focus-visible:outline-primary"
                :aria-current="projetoAtivo === p.id && tela.tipo === 'projeto' ? 'page' : undefined"
                :aria-keyshortcuts="'Alt+ArrowUp Alt+ArrowDown'"
                :title="t.painel.arrastar"
                @click="prj.abrirProjeto(p.id)"
                @keydown="teclar($event, p.id)"
              >
                <span class="flex size-6 shrink-0 items-center justify-center rounded-md" :class="COR_DO_PROJETO[p.cor]">
                  <UIcon :name="p.icone" class="size-3.5" />
                </span>
                <span class="min-w-0 flex-1 truncate text-sm font-semibold text-highlighted">{{ p.nome }}</span>
                <UTooltip v-if="prj.statusAtual(p)" :text="t.situacao[prj.statusAtual(p)!.situacao]">
                  <span class="size-2 shrink-0 rounded-full" :class="[PONTO_DA_SITUACAO[prj.statusAtual(p)!.situacao], marca]" role="img" :aria-label="t.situacao[prj.statusAtual(p)!.situacao]" />
                </UTooltip>
                <UTooltip v-if="p.visibilidade !== 'aberto'" :text="t.visibilidade[p.visibilidade]">
                  <UIcon :name="ICONE_DA_VISIBILIDADE[p.visibilidade]" class="size-3.5 shrink-0 text-muted" :aria-label="t.visibilidade[p.visibilidade]" />
                </UTooltip>
              </button>
              <span class="hidden shrink-0 items-center group-hover:flex group-focus-within:flex has-[[aria-expanded=true]]:flex">
                <AdicionarAoProjeto :p="p" />
              <UDropdownMenu :items="acoesDoProjeto(p)" :content="{ align: 'start' }" :ui="{ content: 'w-60' }">
                <UButton
                  icon="i-lucide-ellipsis"
                  size="xs"
                  color="neutral"
                  variant="ghost"
                  
                  :aria-label="t.painel.acoesDoProjeto(p.nome)"
                />
              </UDropdownMenu>
              </span>
            </div>

            <!-- a árvore do projeto -->
            <ConteudoDoProjeto v-if="expandidos.includes(p.id)" :t="t" :p="p" variante="painel" />
          </li>
        </ul>

        <!-- busca: o que a pessoa enxerga e não está no menu dela -->
        <template v-if="foraDoMenu.length">
          <p class="mt-3 px-2 pb-1 text-xs font-medium text-muted">{{ t.painel.foraDoMenu }}</p>
          <ul class="space-y-0.5">
            <li v-for="p in foraDoMenu" :key="p.id">
              <button type="button" class="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-elevated focus-visible:outline-2 focus-visible:outline-primary" @click="prj.abrirProjeto(p.id)">
                <span class="flex size-6 shrink-0 items-center justify-center rounded-md" :class="COR_DO_PROJETO[p.cor]">
                  <UIcon :name="p.icone" class="size-3.5" />
                </span>
                <span class="min-w-0 flex-1 truncate text-sm text-default">{{ p.nome }}</span>
                <UIcon v-if="p.visibilidade !== 'aberto'" :name="ICONE_DA_VISIBILIDADE[p.visibilidade]" class="size-3.5 shrink-0 text-muted" :aria-label="t.visibilidade[p.visibilidade]" />
              </button>
            </li>
          </ul>
        </template>
        <p v-if="termo.trim() && !lista.length && !foraDoMenu.length" class="px-2 py-6 text-center text-sm text-muted">
          {{ t.painel.semResultado(termo.trim()) }}
        </p>
      </div>

    </template>
  </div>
</template>
