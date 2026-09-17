<script setup lang="ts">
import LinhaDeMenu from './_LinhaDeMenu.vue'
import SecaoDeMenu from './_SecaoDeMenu.vue'
import {
  gruposDeConfiguracao,
  secoesPersonalizadas,
  workspace,
  usuaria,
  type Categoria,
} from './mocks'
import type { TextosDaTela } from './textos'

/**
 * MODELO ALTERNATIVO: trilha de ícones mais painel da área.
 *
 * É o desenho do Jira antigo, do Microsoft Teams, do Slack, do monday e da
 * Global Navigation do ClickUp: uma trilha estreita com as áreas agregadoras e,
 * ao lado, o menu daquela área.
 *
 * Existe aqui para ser COMPARADO com a barra única, não para substituí-la. A
 * pesquisa (PESQUISA.md, secção "Trilha de ícones") mostra que o padrão é real,
 * mas que ele serve produtos com vários modos de trabalho que convivem, e que o
 * proprio Jira saiu dele na navegação nova. O alternador fica na barra de
 * andaime, porque no produto só um dos dois vai existir.
 *
 * As cinco áreas foram escolhidas para dar a versão mais forte da ideia: cada
 * uma tem conteúdo de verdade, nenhuma é um item só fingindo de área.
 */
const props = defineProps<{
  t: TextosDaTela
  favoritas: Categoria[]
  recorte: Categoria[]
  totalDeCategorias: number
  destinoAtivo: string
  categoriaAtivaId: number | null
  itemConfigAtivo: string
  estado: 'normal' | 'vazio' | 'carregando' | 'erro'
  podeConfigurar: boolean
  itensDeCriar: { label: string, icon: string, onSelect: () => void }[][]
}>()

const emit = defineEmits<{
  destino: [id: string]
  categoria: [c: Categoria]
  alternarFixar: [id: number]
  verTodas: []
  busca: []
  item: [id: string, rotulo: string]
  ajuda: []
}>()

type Area = 'trabalho' | 'dados' | 'secoes' | 'config' | 'ajuda'
const area = ref<Area>('trabalho')

const areas = computed(() => {
  const lista: { id: Area, icone: string, rotulo: string, bloqueada?: boolean }[] = [
    { id: 'trabalho', icone: 'i-lucide-house', rotulo: props.t.areaTrabalho },
    { id: 'dados', icone: 'i-lucide-database', rotulo: props.t.areaDados },
    { id: 'secoes', icone: 'i-lucide-layout-grid', rotulo: props.t.areaSecoes },
    { id: 'config', icone: 'i-lucide-settings', rotulo: props.t.configuracoes, bloqueada: !props.podeConfigurar },
    { id: 'ajuda', icone: 'i-lucide-circle-question-mark', rotulo: props.t.ajuda },
  ]
  return lista
})

const tituloDaArea = computed(() => areas.value.find(a => a.id === area.value)?.rotulo ?? '')

/** Um grupo de configuração aberto por vez, igual ao modelo de barra única. */
const grupoAberto = ref('estrutura')
const secaoAberta = ref<Record<string, boolean>>({ favoritos: true, categorias: true })

function irPara(a: Area) {
  if (a === 'config' && !props.podeConfigurar) return
  area.value = a
}
</script>

<template>
  <div class="flex h-full">
    <!-- ==================== A TRILHA ==================== -->
    <div class="flex w-[4.5rem] shrink-0 flex-col items-center gap-1 border-r border-default bg-accented/40 py-2">
      <UTooltip :text="workspace.nome" :content="{ side: 'right' }">
        <button
          type="button"
          class="mb-1 flex size-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-inverted transition-transform hover:scale-105"
          :aria-label="props.t.trocarWorkspace"
        >
          {{ workspace.inicial }}
        </button>
      </UTooltip>

      <button
        v-for="a in areas"
        :key="a.id"
        type="button"
        class="flex w-full flex-col items-center gap-0.5 rounded-lg px-1 py-2 transition-colors"
        :class="[
          area === a.id
            ? 'bg-primary/15 text-highlighted'
            : a.bloqueada
              ? 'cursor-not-allowed text-muted'
              : 'text-default hover:bg-elevated',
        ]"
        :aria-current="area === a.id ? 'page' : undefined"
        :disabled="a.bloqueada"
        @click="irPara(a.id)"
      >
        <UIcon
          :name="a.bloqueada ? 'i-lucide-lock' : a.icone"
          class="size-5"
          :class="area === a.id ? 'text-primary' : ''"
        />
        <span class="w-full truncate text-center text-[10px] font-medium leading-tight">{{ a.rotulo }}</span>
      </button>

      <div class="flex-1" />

      <UTooltip :text="props.t.buscar" :content="{ side: 'right' }">
        <button
          type="button"
          class="flex size-9 items-center justify-center rounded-lg text-default transition-colors hover:bg-elevated"
          :aria-label="props.t.buscar"
          @click="emit('busca')"
        >
          <UIcon name="i-lucide-search" class="size-5" />
        </button>
      </UTooltip>

      <UDropdownMenu :items="props.itensDeCriar" :content="{ side: 'right', align: 'end' }">
        <UTooltip :text="props.t.criar" :content="{ side: 'right' }">
          <button
            type="button"
            class="flex size-9 items-center justify-center rounded-lg bg-primary text-inverted transition-transform hover:scale-105"
            :aria-label="props.t.criar"
          >
            <UIcon name="i-lucide-plus" class="size-5" />
          </button>
        </UTooltip>
      </UDropdownMenu>

      <UAvatar :alt="usuaria.nome" size="sm" class="mt-1" />
    </div>

    <!-- ==================== O PAINEL DA ÁREA ==================== -->
    <div class="flex min-w-0 flex-1 flex-col">
      <div class="flex h-12 shrink-0 items-center gap-2 border-b border-default px-3">
        <h2 class="min-w-0 flex-1 truncate text-sm font-bold text-highlighted">{{ tituloDaArea }}</h2>
      </div>

      <nav class="min-h-0 flex-1 overflow-y-auto px-2 py-2" :aria-label="tituloDaArea">
        <!-- ---------- Trabalho ---------- -->
        <template v-if="area === 'trabalho'">
          <div class="space-y-0.5">
            <LinhaDeMenu
              icone="i-lucide-house"
              :rotulo="props.t.inicio"
              :ativo="props.destinoAtivo === 'inicio'"
              :atraso="0"
              @selecionar="emit('destino', 'inicio')"
            />
            <LinhaDeMenu
              icone="i-lucide-square-check-big"
              :rotulo="props.t.tarefas"
              :contador="3"
              :ativo="props.destinoAtivo === 'tarefas'"
              :atraso="25"
              @selecionar="emit('destino', 'tarefas')"
            />
            <LinhaDeMenu
              icone="i-lucide-calendar-days"
              :rotulo="props.t.agenda"
              :ativo="props.destinoAtivo === 'agenda'"
              :atraso="50"
              @selecionar="emit('destino', 'agenda')"
            />
            <LinhaDeMenu
              icone="i-lucide-workflow"
              :rotulo="props.t.spaceflows"
              :ativo="props.destinoAtivo === 'spaceflows'"
              :atraso="75"
              @selecionar="emit('destino', 'spaceflows')"
            />
          </div>
        </template>

        <!-- ---------- Dados ---------- -->
        <template v-else-if="area === 'dados'">
          <div v-if="props.estado === 'carregando'" class="space-y-2">
            <USkeleton v-for="n in 6" :key="n" class="h-7" />
          </div>

          <div v-else-if="props.estado === 'vazio'" class="rounded-lg border border-dashed border-default p-3">
            <p class="text-sm font-medium text-highlighted">{{ props.t.vazioTitulo }}</p>
            <p class="mt-1 text-xs leading-relaxed text-muted">{{ props.t.vazioDescricao }}</p>
          </div>

          <template v-else>
            <SecaoDeMenu
              v-if="props.favoritas.length"
              :rotulo="props.t.favoritos"
              :aberta="secaoAberta.favoritos"
              :texto-recolher="props.t.recolherSecao(props.t.favoritos)"
              :texto-expandir="props.t.expandirSecao(props.t.favoritos)"
              @alternar="secaoAberta.favoritos = !secaoAberta.favoritos"
            >
              <LinhaDeMenu
                v-for="(c, i) in props.favoritas"
                :key="c.id"
                :icone="c.icon ?? 'i-lucide-folder'"
                :rotulo="c.name"
                :nivel="2"
                com-estrela
                :fixada="true"
                :rotulo-fixar="props.t.fixar"
                :rotulo-desafixar="props.t.desafixar"
                :ativo="props.categoriaAtivaId === c.id"
                :atraso="i * 25"
                @selecionar="emit('categoria', c)"
                @alternar-estrela="emit('alternarFixar', c.id)"
              />
            </SecaoDeMenu>

            <SecaoDeMenu
              :rotulo="props.t.categorias"
              :aberta="secaoAberta.categorias"
              :contador="props.totalDeCategorias || undefined"
              :texto-recolher="props.t.recolherSecao(props.t.categorias)"
              :texto-expandir="props.t.expandirSecao(props.t.categorias)"
              @alternar="secaoAberta.categorias = !secaoAberta.categorias"
            >
              <LinhaDeMenu
                v-for="(c, i) in props.recorte"
                :key="c.id"
                :icone="c.icon ?? 'i-lucide-folder'"
                :rotulo="c.name"
                :nivel="2"
                com-estrela
                :fixada="c.favorita"
                :rotulo-fixar="props.t.fixar"
                :rotulo-desafixar="props.t.desafixar"
                :ativo="props.categoriaAtivaId === c.id"
                :atraso="80 + i * 25"
                @selecionar="emit('categoria', c)"
                @alternar-estrela="emit('alternarFixar', c.id)"
              />
              <button
                type="button"
                class="mt-0.5 flex w-full items-center gap-2.5 rounded-md py-1.5 pl-8 pr-2.5 text-sm font-medium text-highlighted transition-colors hover:bg-primary/10"
                @click="emit('verTodas')"
              >
                <UIcon name="i-lucide-layout-grid" class="size-4 shrink-0 text-primary" />
                <span class="min-w-0 flex-1 truncate text-left">{{ props.t.verTodas(props.totalDeCategorias) }}</span>
              </button>
            </SecaoDeMenu>
          </template>
        </template>

        <!-- ---------- Seções do workspace ---------- -->
        <template v-else-if="area === 'secoes'">
          <SecaoDeMenu
            v-for="s in secoesPersonalizadas"
            :key="s.id"
            :rotulo="s.rotulo"
            :aberta="true"
            :texto-recolher="props.t.recolherSecao(s.rotulo)"
            :texto-expandir="props.t.expandirSecao(s.rotulo)"
            @alternar="() => {}"
          >
            <LinhaDeMenu
              v-for="(item, i) in s.itens"
              :key="item.id"
              :icone="item.icone"
              :rotulo="item.rotulo"
              :nivel="2"
              :ativo="props.destinoAtivo === item.id"
              :atraso="i * 25"
              @selecionar="emit('destino', item.id)"
            />
          </SecaoDeMenu>
        </template>

        <!-- ---------- Configurações ---------- -->
        <template v-else-if="area === 'config'">
          <SecaoDeMenu
            v-for="g in gruposDeConfiguracao"
            :key="g.id"
            :rotulo="props.t.grupos[g.id] ?? g.id"
            :aberta="grupoAberto === g.id"
            :texto-recolher="props.t.recolherSecao(props.t.grupos[g.id] ?? g.id)"
            :texto-expandir="props.t.expandirSecao(props.t.grupos[g.id] ?? g.id)"
            @alternar="grupoAberto = grupoAberto === g.id ? '' : g.id"
          >
            <LinhaDeMenu
              v-for="(item, i) in g.itens"
              :key="item.id"
              :icone="item.icone"
              :rotulo="props.t.itens[item.id] ?? item.id"
              :nivel="2"
              :ativo="props.itemConfigAtivo === item.id"
              :atraso="i * 22"
              @selecionar="emit('item', item.id, props.t.itens[item.id] ?? item.id)"
            />
          </SecaoDeMenu>
        </template>

        <!-- ---------- Ajuda ---------- -->
        <template v-else>
          <div class="space-y-0.5">
            <LinhaDeMenu
              icone="i-lucide-bot"
              :rotulo="props.t.falarComBeni"
              :atraso="0"
              @selecionar="emit('ajuda')"
            />
            <LinhaDeMenu
              icone="i-lucide-rocket"
              :rotulo="props.t.releases"
              :atraso="25"
              @selecionar="emit('ajuda')"
            />
            <LinhaDeMenu
              icone="i-lucide-book-open"
              :rotulo="props.t.documentacao"
              :atraso="50"
              @selecionar="emit('ajuda')"
            />
          </div>
        </template>
      </nav>
    </div>
  </div>
</template>
