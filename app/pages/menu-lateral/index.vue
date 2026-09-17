<script setup lang="ts">
import PainelTrabalho from './_PainelTrabalho.vue'
import PainelConfiguracoes from './_PainelConfiguracoes.vue'
import TodasAsCategorias from './_TodasAsCategorias.vue'
import MenuDeHoje from './_MenuDeHoje.vue'
import Conteudo from './_Conteudo.vue'
import {
  categoriasNormais,
  categoriasVolume,
  gruposDeConfiguracao,
  secoesPersonalizadas,
  destinosDeTrabalho,
  workspace,
  type Categoria,
} from './mocks'
import { textos } from './textos'

// O contexto do protótipo vem dos próprios .md desta pasta, como texto.
import briefingMd from './BRIEFING.md?raw'
import pesquisaMd from './PESQUISA.md?raw'
import decisoesMd from './DECISOES.md?raw'

definePageMeta({
  titulo: 'Menu lateral em dois níveis',
  descricao: 'Tirar a administração do caminho do trabalho e dar teto à lista de categorias, sem mudar de endereço.',
  status: 'em-revisao',
  atualizado: '2026-09-16',
  tela: 'Menu lateral do workspace',
})

const t = useTextos(textos)
const toast = useToast()

/* ------------------------------------------------------------------
   ANDAIME: o seletor de estados não faz parte da proposta. Existe para
   revisar os seis estados sem back-end.
------------------------------------------------------------------ */
type Estado = 'normal' | 'volume' | 'vazio' | 'carregando' | 'erro' | 'semPermissao'
const estado = ref<Estado>('normal')
const estados: { valor: Estado, rotulo: string }[] = [
  { valor: 'normal', rotulo: '8 categorias' },
  { valor: 'volume', rotulo: '40 categorias' },
  { valor: 'vazio', rotulo: 'Workspace novo' },
  { valor: 'carregando', rotulo: 'Carregando' },
  { valor: 'erro', rotulo: 'Erro' },
  { valor: 'semPermissao', rotulo: 'Sem permissão' },
]

const podeConfigurar = computed(() => estado.value !== 'semPermissao')
const estadoDoPainel = computed(() => {
  if (estado.value === 'volume' || estado.value === 'semPermissao') return 'normal' as const
  return estado.value as 'normal' | 'vazio' | 'carregando' | 'erro'
})

/* ------------------------------ o dado ------------------------------ */
const base = computed<Categoria[]>(() => {
  if (estado.value === 'vazio') return []
  if (estado.value === 'volume') return categoriasVolume
  return categoriasNormais
})

/** Favoritar mexe no array em memória. Recarregar a página volta ao começo. */
const fixadasManualmente = ref<number[]>([])

const categorias = computed<Categoria[]>(() =>
  base.value.map(c => ({
    ...c,
    favorita: fixadasManualmente.value.includes(c.id) ? !c.favorita : c.favorita,
  })),
)

const favoritas = computed(() => categorias.value.filter(c => c.favorita))

/** Ordenação da seção, como no Attio. */
const ordem = ref<'uso' | 'alfabetica' | 'recentes'>('uso')

const naoFavoritas = computed(() => {
  const lista = categorias.value.filter(c => !c.favorita)
  if (ordem.value === 'alfabetica') return [...lista].sort((a, b) => a.name.localeCompare(b.name))
  if (ordem.value === 'recentes') return [...lista].sort((a, b) => b.id - a.id)
  return [...lista].sort((a, b) => b.aberturas - a.aberturas)
})

/**
 * O TETO da seção. Cinco, para a seção inteira mais os favoritos caberem sem
 * rolagem num notebook. O Attio mostra seis listas por padrão; aqui cinco, porque
 * acima da seção ainda existem os favoritos, que o Attio põe em outro lugar.
 * O resto vive na camada "ver todas".
 */
const TETO_DA_SECAO = 5
const recorte = computed(() => naoFavoritas.value.slice(0, TETO_DA_SECAO))

/* ---------------------------- navegação ---------------------------- */
const painel = ref<'trabalho' | 'config'>('trabalho')
const destinoAtivo = ref('inicio')
const categoriaAtiva = ref<Categoria | null>(null)
const itemConfigAtivo = ref('cfg-categorias')
const rotuloConfigAtivo = ref('')

const rotuloDoDestino = computed(() => {
  if (painel.value === 'config') return rotuloConfigAtivo.value || t.value.itens[itemConfigAtivo.value] || ''
  const nativo = destinosDeTrabalho.find(d => d.id === destinoAtivo.value)
  if (nativo) return t.value[nativo.rotulo as 'inicio' | 'spaceflows' | 'tarefas' | 'agenda']
  for (const s of secoesPersonalizadas) {
    const item = s.itens.find(i => i.id === destinoAtivo.value)
    if (item) return item.rotulo
  }
  return ''
})

const breadcrumb = computed(() => {
  if (painel.value === 'config') {
    const grupo = gruposDeConfiguracao.find(g => g.itens.some(i => i.id === itemConfigAtivo.value))
    return [workspace.nome, t.value.configuracoes, t.value.grupos[grupo?.id ?? ''] ?? '', rotuloDoDestino.value]
      .filter(Boolean)
  }
  if (categoriaAtiva.value) return [workspace.nome, t.value.categorias, categoriaAtiva.value.name]
  return [workspace.nome, rotuloDoDestino.value]
})

function irParaDestino(id: string) {
  destinoAtivo.value = id
  categoriaAtiva.value = null
}

function abrirCategoria(c: Categoria) {
  categoriaAtiva.value = c
  destinoAtivo.value = ''
}

function alternarFixar(id: number) {
  const c = categorias.value.find(x => x.id === id)
  if (!c) return
  const i = fixadasManualmente.value.indexOf(id)
  if (i >= 0) fixadasManualmente.value.splice(i, 1)
  else fixadasManualmente.value.push(id)

  toast.add({
    title: c.favorita ? t.value.desafixada(c.name) : t.value.fixada(c.name),
    icon: c.favorita ? 'i-lucide-star-off' : 'i-lucide-star',
    color: 'neutral',
  })
}

function abrirConfiguracoes() {
  if (!podeConfigurar.value) return
  painel.value = 'config'
  categoriaAtiva.value = null
  rotuloConfigAtivo.value = t.value.itens[itemConfigAtivo.value] ?? ''
}

function voltarParaTrabalho() {
  painel.value = 'trabalho'
  destinoAtivo.value = 'inicio'
}

function abrirItemDeConfiguracao(id: string, rotulo: string) {
  itemConfigAtivo.value = id
  rotuloConfigAtivo.value = rotulo
}

/** "Configurar categoria" leva para Estrutura > Categorias, já na área certa. */
function configurarCategoriaAtual() {
  painel.value = 'config'
  abrirItemDeConfiguracao('cfg-categorias', t.value.itens['cfg-categorias'] ?? '')
}

/* ------------------------------ camadas ------------------------------ */
const vendoTodas = ref(false)
const vendoHoje = ref(false)
const buscando = ref(false)

/** A paleta busca em tudo: categoria, seção do workspace e configuração. */
const gruposDaBusca = computed(() => [
  {
    id: 'categorias',
    label: t.value.categorias,
    items: categorias.value.map(c => ({
      label: c.name,
      icon: c.icon ?? 'i-lucide-folder',
      suffix: c.description,
      onSelect: () => { abrirCategoria(c); painel.value = 'trabalho' },
    })),
  },
  {
    id: 'destinos',
    label: workspace.nome,
    items: [
      ...destinosDeTrabalho.map(d => ({
        label: t.value[d.rotulo as 'inicio' | 'spaceflows' | 'tarefas' | 'agenda'],
        icon: d.icone,
        onSelect: () => { irParaDestino(d.id); painel.value = 'trabalho' },
      })),
      ...secoesPersonalizadas.flatMap(s => s.itens.map(i => ({
        label: i.rotulo,
        icon: i.icone,
        suffix: s.rotulo,
        onSelect: () => { irParaDestino(i.id); painel.value = 'trabalho' },
      }))),
    ],
  },
  {
    id: 'config',
    label: t.value.configuracoes,
    items: gruposDeConfiguracao.flatMap(g => g.itens.map(i => ({
      label: t.value.itens[i.id] ?? i.id,
      icon: i.icone,
      suffix: t.value.grupos[g.id],
      onSelect: () => {
        if (!podeConfigurar.value) return
        painel.value = 'config'
        abrirItemDeConfiguracao(i.id, t.value.itens[i.id] ?? i.id)
      },
    }))),
  },
])

defineShortcuts({
  meta_k: () => { buscando.value = !buscando.value },
})

function emBreve() {
  toast.add({
    title: 'Maquete',
    description: 'Este caminho não faz parte do que está sendo proposto aqui.',
    icon: 'i-lucide-hammer',
    color: 'neutral',
  })
}
</script>

<template>
  <div class="flex h-dvh flex-col bg-elevated/30">
    <!-- ============================================================
         O QUADRO DO PRODUTO: barra lateral mais conteúdo.
         A barra tem dois painéis que se substituem, nunca se somam.
    ============================================================ -->
    <div class="flex min-h-0 flex-1 gap-0 pb-[3.25rem]">
      <div class="flex min-h-0 w-full overflow-hidden border-t border-default bg-default">
        <!-- barra lateral -->
        <aside
          class="relative hidden w-[17.5rem] shrink-0 border-r border-default bg-elevated/40 md:block"
          :aria-label="t.configuracoes"
        >
          <!--
            A troca de painel usa a animação `entrada` do main.css, a mesma do
            resto do repositório, em vez de um <Transition>. Keyframe não depende
            de transitionend para se limpar, então o painel nunca fica preso em
            opacity 0, e o prefers-reduced-motion do main.css continua valendo.
          -->
          <PainelTrabalho
              v-if="painel === 'trabalho'"
              key="trabalho"
              class="animate-[entrada_0.2s_ease-out_both]"
              :t="t"
              :favoritas="favoritas"
              :recorte="recorte"
              :total-de-categorias="categorias.length"
              :destino-ativo="destinoAtivo"
              :categoria-ativa-id="categoriaAtiva?.id ?? null"
              :estado="estadoDoPainel"
              :pode-configurar="podeConfigurar"
              :ordem="ordem"
              @destino="irParaDestino"
              @categoria="abrirCategoria"
              @alternar-fixar="alternarFixar"
              @ver-todas="vendoTodas = true"
              @configuracoes="abrirConfiguracoes"
              @busca="buscando = true"
              @criar="emBreve"
              @ajuda="emBreve"
              @ordem="v => ordem = v"
            />
          <PainelConfiguracoes
            v-else
            key="config"
            class="animate-[entrada_0.2s_ease-out_both]"
            :t="t"
            :item-ativo="itemConfigAtivo"
            @voltar="voltarParaTrabalho"
            @item="abrirItemDeConfiguracao"
          />
        </aside>

        <!-- conteúdo -->
        <Conteudo
          :t="t"
          :destino="destinoAtivo"
          :rotulo-do-destino="rotuloDoDestino"
          :categoria="categoriaAtiva"
          :breadcrumb="breadcrumb"
          @configurar-categoria="configurarCategoriaAtual"
        />
      </div>
    </div>

    <!-- aviso de tela estreita: a barra some, como no produto -->
    <p class="px-4 pb-24 text-center text-sm text-muted md:hidden">
      {{ t.conteudoIlustrativo }}
    </p>

    <!-- ===================== camadas ===================== -->
    <TodasAsCategorias
      v-model:open="vendoTodas"
      :categorias="categorias"
      :t="t"
      @alternar-fixar="alternarFixar"
      @abrir="abrirCategoria"
    />

    <MenuDeHoje v-model:open="vendoHoje" :t="t" />

    <UModal v-model:open="buscando" :ui="{ content: 'max-w-xl' }">
      <template #content>
        <UCommandPalette
          :groups="gruposDaBusca"
          :placeholder="t.buscarDica"
          :close="{ onClick: () => buscando = false }"
          class="h-80"
          @update:model-value="buscando = false"
        />
      </template>
    </UModal>

    <!-- ============== ANDAIME, não faz parte da proposta ============== -->
    <div class="fixed inset-x-0 bottom-0 z-40 border-t border-default bg-elevated/95 backdrop-blur">
      <div class="flex flex-wrap items-center gap-1.5 px-4 py-1.5">
        <span class="mr-0.5 text-xs font-semibold uppercase tracking-wider text-muted">
          Estado
        </span>
        <UButton
          v-for="e in estados"
          :key="e.valor"
          :label="e.rotulo"
          size="xs"
          class="transition-transform hover:-translate-y-0.5"
          :color="estado === e.valor ? 'primary' : 'neutral'"
          :variant="estado === e.valor ? 'solid' : 'subtle'"
          @click="estado = e.valor"
        />

        <UButton
          :label="vendoHoje ? t.compararFechar : t.compararAbrir"
          icon="i-lucide-columns-2"
          size="xs"
          color="neutral"
          variant="subtle"
          class="transition-transform hover:-translate-y-0.5"
          @click="vendoHoje = !vendoHoje"
        />

        <ControlesDePrototipo class="ml-auto" />

        <span class="flex flex-wrap items-center gap-1.5">
          <PainelDeContexto
            :briefing="briefingMd"
            :pesquisa="pesquisaMd"
            :decisoes="decisoesMd"
            repositorio="https://github.com/pernalombr4/prototipos/tree/main/app/pages/menu-lateral"
          />
        </span>
      </div>
    </div>
  </div>
</template>
