<script setup lang="ts">
import PainelTrabalho from './_PainelTrabalho.vue'
import PainelConfiguracoes from './_PainelConfiguracoes.vue'
import ModeloTrilha from './_ModeloTrilha.vue'
import EditorDeMenus from './_EditorDeMenus.vue'
import TodasAsCategorias from './_TodasAsCategorias.vue'
import MenuDeHoje from './_MenuDeHoje.vue'
import Conteudo from './_Conteudo.vue'
import {
  categoriasNormais,
  categoriasVolume,
  gruposDeConfiguracao,
  workspace,
  usuaria,
  type NoDoMenu,
  type Categoria,
} from './mocks'
import { useMenuDoWorkspace } from './estado'
import { textos } from './textos'

// O contexto do protótipo vem dos próprios .md desta pasta, como texto.
import briefingMd from './BRIEFING.md?raw'
import pesquisaMd from './PESQUISA.md?raw'
import decisoesMd from './DECISOES.md?raw'

definePageMeta({
  titulo: 'Menu lateral em dois níveis',
  descricao: 'Tirar a administração do caminho do trabalho e dar teto à lista de categorias, sem mudar de endereço.',
  status: 'em-revisao',
  atualizado: '2026-09-17',
  tela: 'Menu lateral do workspace',
})

const t = useTextos(textos)
const toast = useToast()

/** A árvore do menu, a mesma que o editor edita e que as duas barras mostram. */
const menu = useMenuDoWorkspace()

/** Rótulo de um nó: nativo vem do dicionário, do workspace vem do próprio nó. */
function rotuloDoNo(no: NoDoMenu) {
  if (no.rotulo) return no.rotulo
  const mapa: Record<string, string> = {
    inicio: t.value.inicio,
    inbox: t.value.inbox,
    chatIa: t.value.chatIa,
    tarefas: t.value.tarefas,
    agenda: t.value.agenda,
    spaceflows: t.value.spaceflows,
    documentos: t.value.documentos,
    categorias: t.value.categorias,
    // Auditoria reaproveita os rótulos que já existiam nas configurações.
    auditoria: t.value.grupos.auditoria,
    logsAuditoria: t.value.itens['logs-auditoria'],
    logsRequisicao: t.value.itens['logs-requisicao'],
  }
  return mapa[no.chave ?? ''] ?? (no.chave ?? '')
}

/** Todos os itens de seção, achatados, para a busca e para o breadcrumb. */
const itensDeSecao = computed(() =>
  menu.secoes.value.flatMap(s => (s.filhos ?? []).map(f => ({ no: f, secao: s }))),
)

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

/**
 * Ordenação da seção, como no Attio: três critérios automáticos e um manual.
 *
 * `manual` é o `Custom` do Attio: desliga o cálculo e passa a respeitar a ordem
 * que a pessoa arrastou. Quem arrasta com um critério automático ligado cai
 * nele sozinho, senão o arraste seria desfeito no recálculo seguinte.
 */
const ordem = ref<'uso' | 'alfabetica' | 'recentes' | 'manual'>('uso')

const naoFavoritas = computed(() => {
  const lista = categorias.value.filter(c => !c.favorita)

  if (ordem.value === 'manual') {
    const posicao = new Map(menu.ordemCategoriasRascunho.value.map((id, i) => [id, i]))
    // Categoria que nunca foi arrastada vai para o fim, na ordem que já tinha.
    return [...lista].sort((a, b) =>
      (posicao.get(a.id) ?? Number.MAX_SAFE_INTEGER) - (posicao.get(b.id) ?? Number.MAX_SAFE_INTEGER),
    )
  }
  if (ordem.value === 'alfabetica') return [...lista].sort((a, b) => a.name.localeCompare(b.name))
  if (ordem.value === 'recentes') return [...lista].sort((a, b) => b.id - a.id)
  return [...lista].sort((a, b) => b.aberturas - a.aberturas)
})

/**
 * Arrastar uma categoria com critério automático ligado: o critério vira
 * `manual` e a ordem parte do que estava na tela, para nada embaralhar.
 */
function virarOrdemManual() {
  menu.semearOrdemDeCategorias(naoFavoritas.value.map(c => c.id))
  ordem.value = 'manual'
}

/** Trocar o critério pelo menu: escolher Personalizada parte do que está na tela. */
function trocarOrdem(v: 'uso' | 'alfabetica' | 'recentes' | 'manual') {
  if (v === 'manual') { virarOrdemManual(); return }
  ordem.value = v
}

/**
 * O TETO da seção. Cinco, para a seção inteira mais os favoritos caberem sem
 * rolagem num notebook. O Attio mostra seis listas por padrão; aqui cinco, porque
 * acima da seção ainda existem os favoritos, que o Attio põe em outro lugar.
 * O resto vive na camada "ver todas".
 */
const TETO_DA_SECAO = 5
const recorte = computed(() => naoFavoritas.value.slice(0, TETO_DA_SECAO))

/* ------------------------------------------------------------------
   ANDAIME: o modelo de navegação. No produto só um dos dois existe; os
   dois convivem aqui para a comparação. A pesquisa que sustenta a escolha
   está no PESQUISA.md, secção "Trilha de icones".
------------------------------------------------------------------ */
const modelo = ref<'barra' | 'trilha'>('barra')

/* ---------------------------- navegação ---------------------------- */
const painel = ref<'trabalho' | 'config'>('trabalho')
// O id vem da arvore do menu, e la os destinos nativos tem prefixo.
const destinoAtivo = ref('n-inicio')
const categoriaAtiva = ref<Categoria | null>(null)
/*
 * A regra dela vale tambem para Configuracoes, que e menu de primeiro nivel:
 * abrir cai no primeiro item da lista, e nao numa tela escolhida a dedo.
 */
const itemConfigAtivo = ref(gruposDeConfiguracao[0]?.itens[0]?.id ?? 'visao-geral')
const rotuloConfigAtivo = ref('')

const rotuloDoDestino = computed(() => {
  if (painel.value === 'config') return rotuloConfigAtivo.value || t.value.itens[itemConfigAtivo.value] || ''
  const nativo = menu.destinos.value.find(d => d.id === destinoAtivo.value)
  if (nativo) return rotuloDoNo(nativo)
  const emSecao = itensDeSecao.value.find(x => x.no.id === destinoAtivo.value)
  if (emSecao) return rotuloDoNo(emSecao.no)
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
  const primeiro = gruposDeConfiguracao[0]?.itens[0]
  if (primeiro) {
    abrirItemDeConfiguracao(primeiro.id, t.value.itens[primeiro.id] ?? primeiro.id)
    return
  }
  painel.value = 'config'
  categoriaAtiva.value = null
}

function voltarParaTrabalho() {
  painel.value = 'trabalho'
  // O id vem da arvore, onde o destino nativo tem prefixo: com 'inicio' a
  // volta deixava o menu inteiro sem linha ativa.
  destinoAtivo.value = menu.destinos.value[0]?.id ?? 'n-inicio'
}

function abrirItemDeConfiguracao(id: string, rotulo: string) {
  itemConfigAtivo.value = id
  rotuloConfigAtivo.value = rotulo
  // No modelo de trilha a configuracao vive dentro do painel da area, e sem
  // isto o clique num item de configuracao nao mudava o miolo: a barra
  // marcava o item e a direita continuava na tela anterior.
  painel.value = 'config'
  categoriaAtiva.value = null
  // Interface > Menus abre o editor do menu, que é onde o administrador
  // reordena, reagrupa e escolhe o tipo de cada tela.
  if (id === 'menus') abrirEditor(null)
}

/** "Configurar categoria" leva para Estrutura > Categorias, já na área certa. */
function configurarCategoriaAtual() {
  painel.value = 'config'
  abrirItemDeConfiguracao('cfg-categorias', t.value.itens['cfg-categorias'] ?? '')
}

/**
 * O botão "+". Existe nos dois modelos e abre o mesmo menu: é o padrão do
 * Notion, do Asana, do monday e do Jira novo, onde "Create" fica na barra de
 * cima. Cada opção é maquete e diz isso no toast.
 */
const itensDeCriar = computed(() => [[
  { label: t.value.criarItem, icon: 'i-lucide-file-plus', onSelect: () => avisarMaquete(t.value.criarItem) },
  { label: t.value.criarTarefa, icon: 'i-lucide-square-check-big', onSelect: () => avisarMaquete(t.value.criarTarefa) },
], [
  { label: t.value.criarCategoria, icon: 'i-lucide-folder-plus', onSelect: () => avisarMaquete(t.value.criarCategoria) },
], [
  // Estes dois abrem o editor de menus com o formulário certo já aberto: criar
  // seção sem ver o menu em volta é decidir no escuro.
  { label: t.value.criarSecao, icon: 'i-lucide-menu', onSelect: () => abrirEditor('secao') },
  { label: t.value.formItemTitulo, icon: 'i-lucide-file-plus', onSelect: () => abrirEditor('item') },
]])

function abrirEditor(form: 'secao' | 'item' | null) {
  formInicial.value = form
  editando.value = true
}

function avisarMaquete(oQue: string) {
  toast.add({
    title: t.value.criarAberto(oQue.toLowerCase()),
    icon: 'i-lucide-hammer',
    color: 'neutral',
  })
}

/* ------------------------------ camadas ------------------------------ */
const vendoTodas = ref(false)
const editando = ref(false)
const formInicial = ref<'secao' | 'item' | null>(null)
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
      ...menu.destinos.value.map(d => ({
        label: rotuloDoNo(d),
        icon: d.icone,
        onSelect: () => { irParaDestino(d.id); painel.value = 'trabalho' },
      })),
      ...itensDeSecao.value.map(({ no, secao }) => ({
        label: rotuloDoNo(no),
        icon: no.icone,
        suffix: rotuloDoNo(secao),
        onSelect: () => { irParaDestino(no.id); painel.value = 'trabalho' },
      })),
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

/** O menu de ajuda é maquete: os três caminhos saem do produto para fora dele. */
function avisarAjuda(rotulo: string) {
  toast.add({
    title: t.value.criarAberto(rotulo.toLowerCase()),
    icon: 'i-lucide-hammer',
    color: 'neutral',
  })
}

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
         A BARRA DE CIMA. A busca global subiu para cá na rodada 3, que é
         onde o Jira novo, o Airtable e o HubSpot a põem: atravessa a tela
         inteira e não disputa altura com a navegação. O filtro do menu
         continua dentro da barra lateral, porque é outra função.
    ============================================================ -->
    <header class="flex h-12 shrink-0 items-center gap-2 border-b border-default bg-default px-3">
      <UButton color="neutral" variant="ghost" class="shrink-0" :aria-label="t.trocarWorkspace">
        <span class="flex size-6 shrink-0 items-center justify-center rounded-md bg-primary text-xs font-bold text-inverted">
          {{ workspace.inicial }}
        </span>
        <span class="hidden truncate text-sm font-semibold text-highlighted sm:inline">{{ workspace.nome }}</span>
        <UIcon name="i-lucide-chevrons-up-down" class="size-4 shrink-0 text-muted" />
      </UButton>

      <!--
        RODADA 7: o perfil fica AQUI, na esquerda de cima, e em lugar nenhum
        mais. Ele estava também no pé da barra lateral e no pé da trilha: três
        lugares para a mesma pessoa, gastando altura que a navegação precisava.
        Um lugar só, ao lado do workspace, e o canto superior esquerdo vira a
        zona de identidade: onde eu estou e quem eu sou.
      -->
      <UTooltip :text="usuaria.nome">
        <UAvatar :alt="usuaria.nome" size="xs" class="shrink-0" />
      </UTooltip>

      <div class="flex min-w-0 flex-1 justify-center">
        <UButton
          color="neutral"
          variant="outline"
          class="w-full max-w-md justify-start"
          @click="buscando = true"
        >
          <UIcon name="i-lucide-search" class="size-4 shrink-0 text-muted" />
          <span class="min-w-0 flex-1 truncate text-left text-sm font-normal text-muted">{{ t.buscarEmTudo }}</span>
          <UKbd value="ctrl" size="sm" />
          <UKbd value="K" size="sm" />
        </UButton>
      </div>

      <UDropdownMenu :items="itensDeCriar" :content="{ align: 'end' }">
        <UButton icon="i-lucide-plus" color="primary" :label="t.criar" class="shrink-0" />
      </UDropdownMenu>
    </header>

    <!-- ============================================================
         O QUADRO DO PRODUTO: barra lateral mais conteúdo.
         A barra tem dois painéis que se substituem, nunca se somam.
    ============================================================ -->
    <!--
      A barra de andaime tem 76px (duas fileiras), e a folga aqui era de 52px:
      os ultimos 24px da barra lateral ficavam ATRAS dela, e quem pagava era o
      rodape, onde moram Configuracoes e o icone de ajuda. Rodada 9.
    -->
    <div class="flex min-h-0 flex-1 gap-0 pb-20">
      <div class="flex min-h-0 w-full overflow-hidden border-t border-default bg-default">
        <!-- barra lateral -->
        <aside
          class="relative hidden shrink-0 border-r border-default bg-elevated/40 md:block"
          :class="modelo === 'trilha' ? 'w-[19rem]' : 'w-[17.5rem]'"
          :aria-label="t.configuracoes"
        >
          <!-- MODELO ALTERNATIVO: trilha de icones mais painel da area. -->
          <ModeloTrilha
            v-if="modelo === 'trilha'"
            :t="t"
            :favoritas="favoritas"
            :recorte="recorte"
            :total-de-categorias="categorias.length"
            :destino-ativo="destinoAtivo"
            :categoria-ativa-id="categoriaAtiva?.id ?? null"
            :item-config-ativo="itemConfigAtivo"
            :estado="estadoDoPainel"
            :pode-configurar="podeConfigurar"
            :itens-de-criar="itensDeCriar"
            @destino="irParaDestino"
            @categoria="abrirCategoria"
            @alternar-fixar="alternarFixar"
            @ver-todas="vendoTodas = true"
            @busca="buscando = true"
            @item="abrirItemDeConfiguracao"
            @ajuda="avisarAjuda"
          />
          <template v-else>
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
              :todas="categorias"
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
              @ajuda="avisarAjuda"
              @ordem="trocarOrdem"
              @virar-manual="virarOrdemManual"
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
          </template>
        </aside>

        <!-- conteúdo -->
        <Conteudo
          :t="t"
          :destino="destinoAtivo"
          :rotulo-do-destino="rotuloDoDestino"
          :categoria="categoriaAtiva"
          :breadcrumb="breadcrumb"
          :item-config="painel === 'config' ? itemConfigAtivo : undefined"
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

    <EditorDeMenus
      v-model:open="editando"
      :t="t"
      :modelo="modelo"
      :abrir-formulario="formInicial"
    />

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

        <span class="ml-2 mr-0.5 text-xs font-semibold uppercase tracking-wider text-muted">
          {{ t.modoRotulo }}
        </span>
        <UButton
          :label="t.modoNativo"
          size="xs"
          class="transition-transform hover:-translate-y-0.5"
          :color="menu.modoDoMenu.value === 'nativo' ? 'primary' : 'neutral'"
          :variant="menu.modoDoMenu.value === 'nativo' ? 'solid' : 'subtle'"
          @click="menu.soNativo()"
        />
        <UButton
          :label="t.modoCompleto"
          size="xs"
          class="transition-transform hover:-translate-y-0.5"
          :color="menu.modoDoMenu.value === 'completo' ? 'primary' : 'neutral'"
          :variant="menu.modoDoMenu.value === 'completo' ? 'solid' : 'subtle'"
          @click="menu.comTudo()"
        />

        <span class="ml-2 mr-0.5 text-xs font-semibold uppercase tracking-wider text-muted">
          {{ t.modeloRotulo }}
        </span>
        <UButton
          v-for="m in [{ v: 'barra', r: t.modeloBarra }, { v: 'trilha', r: t.modeloTrilha }]"
          :key="m.v"
          :label="m.r"
          size="xs"
          class="transition-transform hover:-translate-y-0.5"
          :color="modelo === m.v ? 'primary' : 'neutral'"
          :variant="modelo === m.v ? 'solid' : 'subtle'"
          @click="modelo = m.v as 'barra' | 'trilha'"
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
