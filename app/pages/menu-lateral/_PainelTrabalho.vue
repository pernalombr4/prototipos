<script setup lang="ts">
import LinhaDeMenu from './_LinhaDeMenu.vue'
import SecaoDeMenu from './_SecaoDeMenu.vue'
import { secoesPersonalizadas, type Categoria } from './mocks'
import type { TextosDaTela } from './textos'

/**
 * O painel de trabalho: o menu do dia a dia.
 *
 * Dois níveis e nada mais. Nível 1 é destino solto ou nome de seção; nível 2 é item
 * dentro de seção. O terceiro nível de hoje (formulário dentro de categoria) virou
 * aba na tela da categoria.
 *
 * A ordem dos destinos nativos é a MESMA de hoje. Regra 16: o peso pode mudar,
 * o endereço não.
 *
 * RODADA 3, três mudanças:
 * 1. a busca global saiu daqui e subiu para a barra de cima. O que ficou no topo
 *    da barra é o FILTRO DO MENU, que é outra coisa: um filtra o que está no
 *    menu, o outro busca conteúdo. ClickUp ("Search your Home Sidebar") e Slack
 *    (filtro com correspondência aproximada) mantêm os dois separados assim;
 * 2. entraram as quatro telas nativas que estão por vir, com selo "Em breve";
 * 3. Dashboard de tarefas, Dashboard de dados e Meus relatórios entraram numa
 *    seção `Análise` recolhida, em vez de virarem três destinos soltos. É
 *    premissa minha, e está registrada no DECISOES.md.
 */
const props = defineProps<{
  t: TextosDaTela
  favoritas: Categoria[]
  recorte: Categoria[]
  /** Todas, para o filtro procurar além do recorte de cinco. */
  todas: Categoria[]
  totalDeCategorias: number
  destinoAtivo: string
  categoriaAtivaId: number | null
  estado: 'normal' | 'vazio' | 'carregando' | 'erro'
  podeConfigurar: boolean
  ordem: 'uso' | 'alfabetica' | 'recentes'
}>()

const emit = defineEmits<{
  destino: [id: string]
  categoria: [c: Categoria]
  alternarFixar: [id: number]
  verTodas: []
  configuracoes: []
  criar: []
  ordem: [valor: 'uso' | 'alfabetica' | 'recentes']
  ajuda: []
}>()

/** Estado de aberto/fechado por seção. */
const abertas = ref<Record<string, boolean>>({
  favoritos: true,
  categorias: true,
  analise: false,
  ...Object.fromEntries(secoesPersonalizadas.map(s => [s.id, false])),
})

function alternar(id: string) {
  abertas.value[id] = !abertas.value[id]
}

const opcoesDeOrdem = computed(() => [[
  { label: props.t.ordemMaisUsadas, icon: 'i-lucide-flame', onSelect: () => emit('ordem', 'uso') },
  { label: props.t.ordemAlfabetica, icon: 'i-lucide-arrow-down-a-z', onSelect: () => emit('ordem', 'alfabetica') },
  { label: props.t.ordemRecentes, icon: 'i-lucide-clock', onSelect: () => emit('ordem', 'recentes') },
]])

/* ---------------------------------------------------------------
   O FILTRO DO MENU. Filtra o que está NO menu, em memória, na hora.
   Com filtro ativo a seção de categorias procura em TODAS, e não só no
   recorte de cinco: senão o filtro mentiria sobre o que existe.
--------------------------------------------------------------- */
const filtro = ref('')
const filtrando = computed(() => filtro.value.trim().length > 0)

function casa(texto: string) {
  return texto.toLowerCase().includes(filtro.value.trim().toLowerCase())
}

const destinos = computed(() => [
  { id: 'inicio', rotulo: props.t.inicio, icone: 'i-lucide-house', contador: undefined as number | undefined, emBreve: false },
  { id: 'tarefas', rotulo: props.t.tarefas, icone: 'i-lucide-square-check-big', contador: 3, emBreve: false },
  { id: 'agenda', rotulo: props.t.agenda, icone: 'i-lucide-calendar-days', contador: undefined, emBreve: false },
  { id: 'spaceflows', rotulo: props.t.spaceflows, icone: 'i-lucide-workflow', contador: undefined, emBreve: false },
  { id: 'documentos', rotulo: props.t.documentos, icone: 'i-lucide-folder-open', contador: undefined, emBreve: true },
])

const analise = computed(() => [
  { id: 'painel-tarefas', rotulo: props.t.painelTarefas, icone: 'i-lucide-chart-column' },
  { id: 'painel-dados', rotulo: props.t.painelDados, icone: 'i-lucide-chart-pie' },
  { id: 'meus-relatorios', rotulo: props.t.meusRelatorios, icone: 'i-lucide-file-chart-column' },
])

const destinosVisiveis = computed(() => filtrando.value ? destinos.value.filter(d => casa(d.rotulo)) : destinos.value)
const analiseVisivel = computed(() => filtrando.value ? analise.value.filter(a => casa(a.rotulo)) : analise.value)
const favoritasVisiveis = computed(() => filtrando.value ? props.favoritas.filter(c => casa(c.name)) : props.favoritas)

const categoriasVisiveis = computed(() => {
  if (!filtrando.value) return props.recorte
  return props.todas.filter(c => !c.favorita && casa(c.name))
})

const secoesVisiveis = computed(() => {
  if (!filtrando.value) return secoesPersonalizadas.map(s => ({ ...s, aberta: abertas.value[s.id] ?? false }))
  return secoesPersonalizadas
    .map(s => ({ ...s, itens: s.itens.filter(i => casa(i.rotulo)), aberta: true }))
    .filter(s => s.itens.length > 0 || casa(s.rotulo))
})

const nadaNoFiltro = computed(() =>
  filtrando.value
  && !destinosVisiveis.value.length
  && !analiseVisivel.value.length
  && !favoritasVisiveis.value.length
  && !categoriasVisiveis.value.length
  && !secoesVisiveis.value.length,
)
</script>

<template>
  <div class="flex h-full flex-col">
    <!-- ============ topo: o FILTRO do menu, não a busca global ============ -->
    <div class="shrink-0 px-2 pb-1 pt-1.5">
      <UInput
        v-model="filtro"
        icon="i-lucide-filter"
        size="sm"
        class="w-full"
        :placeholder="props.t.filtroDoMenu"
        :aria-label="props.t.filtroDoMenu"
      >
        <template v-if="filtro" #trailing>
          <UButton
            icon="i-lucide-x"
            size="xs"
            color="neutral"
            variant="link"
            :aria-label="props.t.todasFechar"
            @click="filtro = ''"
          />
        </template>
      </UInput>
    </div>

    <!-- ============ navegação ============ -->
    <nav class="min-h-0 flex-1 overflow-y-auto px-2" :aria-label="props.t.inicio">
      <div v-if="props.estado === 'carregando'" class="space-y-2 pt-1">
        <USkeleton v-for="n in 7" :key="n" class="h-7" :class="n % 3 === 0 ? 'w-3/4' : 'w-full'" />
      </div>

      <div v-else-if="props.estado === 'erro'" class="pt-2">
        <UAlert
          icon="i-lucide-unplug"
          color="error"
          variant="subtle"
          :title="props.t.erroTitulo"
          :description="props.t.erroDescricao"
          :actions="[{ label: props.t.erroAcao, color: 'neutral', variant: 'outline' }]"
          :ui="{ title: 'text-sm', description: 'text-xs' }"
        />
      </div>

      <template v-else>
        <UEmpty
          v-if="nadaNoFiltro"
          icon="i-lucide-search-x"
          :title="props.t.filtroSemResultado"
          :description="props.t.todasNenhumaDica"
          class="animate-[entrada_0.25s_ease-out_both]"
        />

        <!-- destinos soltos, na ordem de hoje -->
        <div v-if="destinosVisiveis.length" class="space-y-0.5">
          <LinhaDeMenu
            v-for="(d, i) in destinosVisiveis"
            :key="d.id"
            :icone="d.icone"
            :rotulo="d.rotulo"
            :contador="d.contador"
            :selo="d.emBreve ? props.t.emBreve : undefined"
            :ativo="props.destinoAtivo === d.id"
            :atraso="i * 25"
            @selecionar="emit('destino', d.id)"
          />
        </div>

        <!-- Favoritos: nasce do uso, some quando esvazia. Padrão 4. -->
        <SecaoDeMenu
          v-if="favoritasVisiveis.length"
          :rotulo="props.t.favoritos"
          :aberta="filtrando || abertas.favoritos"
          :texto-recolher="props.t.recolherSecao(props.t.favoritos)"
          :texto-expandir="props.t.expandirSecao(props.t.favoritos)"
          @alternar="alternar('favoritos')"
        >
          <LinhaDeMenu
            v-for="(c, i) in favoritasVisiveis"
            :key="c.id"
            :icone="c.icon ?? 'i-lucide-folder'"
            :rotulo="c.name"
            :nivel="2"
            com-estrela
            :fixada="true"
            :rotulo-fixar="props.t.fixar"
            :rotulo-desafixar="props.t.desafixar"
            :ativo="props.categoriaAtivaId === c.id"
            :atraso="100 + i * 25"
            @selecionar="emit('categoria', c)"
            @alternar-estrela="emit('alternarFixar', c.id)"
          />
        </SecaoDeMenu>

        <!-- Categorias: a seção que cresce. Recorte mais "ver todas". Padrão 3. -->
        <SecaoDeMenu
          v-if="!filtrando || categoriasVisiveis.length"
          :rotulo="props.t.categorias"
          :aberta="filtrando || abertas.categorias"
          :contador="props.totalDeCategorias || undefined"
          :texto-recolher="props.t.recolherSecao(props.t.categorias)"
          :texto-expandir="props.t.expandirSecao(props.t.categorias)"
          @alternar="alternar('categorias')"
        >
          <template #acoes>
            <UDropdownMenu :items="opcoesDeOrdem">
              <UButton
                icon="i-lucide-settings-2"
                size="xs"
                color="neutral"
                variant="ghost"
                :aria-label="props.t.ordenarPor"
              />
            </UDropdownMenu>
          </template>

          <template v-if="props.estado === 'vazio' && !filtrando">
            <!--
              Estado vazio que ENSINA. A fricção S1-F4 diz que a categoria criada
              some porque "Menu automático" nasce desligado.
            -->
            <div class="mx-1 mt-1 rounded-lg border border-dashed border-default p-3">
              <p class="text-sm font-medium text-highlighted">{{ props.t.vazioTitulo }}</p>
              <p class="mt-1 text-xs leading-relaxed text-muted">{{ props.t.vazioDescricao }}</p>
              <UButton
                :label="props.t.vazioAcao"
                icon="i-lucide-plus"
                size="xs"
                color="primary"
                variant="soft"
                class="mt-2"
                @click="emit('criar')"
              />
            </div>
          </template>

          <template v-else>
            <LinhaDeMenu
              v-for="(c, i) in categoriasVisiveis"
              :key="c.id"
              :icone="c.icon ?? 'i-lucide-folder'"
              :rotulo="c.name"
              :nivel="2"
              com-estrela
              :fixada="c.favorita"
              :rotulo-fixar="props.t.fixar"
              :rotulo-desafixar="props.t.desafixar"
              :ativo="props.categoriaAtivaId === c.id"
              :atraso="180 + i * 25"
              @selecionar="emit('categoria', c)"
              @alternar-estrela="emit('alternarFixar', c.id)"
            />

            <button
              v-if="!filtrando"
              type="button"
              class="mt-0.5 flex w-full items-center gap-2.5 rounded-md py-1.5 pl-8 pr-2.5 text-sm font-medium text-highlighted transition-colors hover:bg-primary/10"
              @click="emit('verTodas')"
            >
              <!-- Ícone na cor de marca, texto não: `text-primary` em 14px não passa
                   em AA no tema claro (medido em 3,39:1). -->
              <UIcon name="i-lucide-layout-grid" class="size-4 shrink-0 text-primary" />
              <span class="min-w-0 flex-1 truncate text-left">
                {{ props.t.verTodas(props.totalDeCategorias) }}
              </span>
            </button>
          </template>
        </SecaoDeMenu>

        <!-- Análise: as telas novas de painel e de relatório. -->
        <SecaoDeMenu
          v-if="analiseVisivel.length"
          :rotulo="props.t.secaoAnalise"
          :aberta="filtrando || abertas.analise"
          :texto-recolher="props.t.recolherSecao(props.t.secaoAnalise)"
          :texto-expandir="props.t.expandirSecao(props.t.secaoAnalise)"
          @alternar="alternar('analise')"
        >
          <LinhaDeMenu
            v-for="(a, i) in analiseVisivel"
            :key="a.id"
            :icone="a.icone"
            :rotulo="a.rotulo"
            :nivel="2"
            :selo="props.t.emBreve"
            :ativo="props.destinoAtivo === a.id"
            :atraso="i * 25"
            @selecionar="emit('destino', a.id)"
          />
        </SecaoDeMenu>

        <!-- Seções do workspace: mesma gramática das nativas. -->
        <SecaoDeMenu
          v-for="s in secoesVisiveis"
          :key="s.id"
          :rotulo="s.rotulo"
          :aberta="s.aberta"
          :texto-recolher="props.t.recolherSecao(s.rotulo)"
          :texto-expandir="props.t.expandirSecao(s.rotulo)"
          @alternar="alternar(s.id)"
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
    </nav>

    <!-- ============ rodapé: configurações, ajuda, pessoa ============ -->
    <div class="shrink-0 border-t border-default p-2">
      <div class="space-y-0.5">
        <UTooltip :text="props.podeConfigurar ? props.t.configuracoesDica : props.t.semPermissaoTitulo">
          <button
            type="button"
            class="flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors"
            :class="props.podeConfigurar
              ? 'text-default hover:bg-elevated'
              : 'cursor-not-allowed text-muted'"
            :disabled="!props.podeConfigurar"
            @click="emit('configuracoes')"
          >
            <UIcon name="i-lucide-settings" class="size-4 shrink-0 text-toned" />
            <span class="min-w-0 flex-1 truncate text-left">{{ props.t.configuracoes }}</span>
            <UIcon
              :name="props.podeConfigurar ? 'i-lucide-chevron-right' : 'i-lucide-lock'"
              class="size-3.5 shrink-0 text-muted"
            />
          </button>
        </UTooltip>

        <button
          type="button"
          class="flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm text-default transition-colors hover:bg-elevated"
          @click="emit('ajuda')"
        >
          <UIcon name="i-lucide-circle-question-mark" class="size-4 shrink-0 text-toned" />
          <span class="min-w-0 flex-1 truncate text-left">{{ props.t.ajuda }}</span>
        </button>
      </div>

      <!--
        O bloco da pessoa saiu daqui na rodada 3: com o avatar na barra de cima,
        repetir nome e cargo no rodapé era só altura gasta duas vezes.
      -->
    </div>
  </div>
</template>
