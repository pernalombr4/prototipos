<script setup lang="ts">
import LinhaDeMenu from './_LinhaDeMenu.vue'
import SecaoDeMenu from './_SecaoDeMenu.vue'
import MenuDeAjuda from './_MenuDeAjuda.vue'
import { useMenuDoWorkspace } from './estado'
import { gruposDeConfiguracao, workspace, type NoDoMenu, type Categoria } from './mocks'
import type { TextosDaTela } from './textos'

/**
 * MODELO ALTERNATIVO: trilha de ícones mais painel da área.
 *
 * É o desenho do Jira antigo, do Teams, do Slack, do monday e da Global
 * Navigation do ClickUp. Está aqui para ser COMPARADO com a barra única: a
 * pesquisa mostra que o padrão serve produtos com vários modos de trabalho que
 * convivem, e que o próprio Jira saiu dele na navegação nova.
 *
 * RODADA 5: também lê a árvore do `estado.ts`, então seção criada aparece aqui
 * do mesmo jeito. E o campo `lugar` da seção decide onde ela cai:
 *
 *   `trilha`  vira um ícone próprio na barra estreita, com painel só dela;
 *   `painel`  vira uma seção recolhível dentro do painel que o campo apontar.
 *
 * É o "menu grandão e menu pequeno" da demanda, funcionando.
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
  ajuda: [rotulo: string]
}>()

const menu = useMenuDoWorkspace()
const area = ref('trabalho')

function rotuloDe(no: NoDoMenu) {
  if (no.rotulo) return no.rotulo
  const mapa: Record<string, string> = {
    inicio: props.t.inicio,
    inbox: props.t.inbox,
    chatIa: props.t.chatIa,
    tarefas: props.t.tarefas,
    agenda: props.t.agenda,
    spaceflows: props.t.spaceflows,
    documentos: props.t.documentos,
    categorias: props.t.categorias,
    // Auditoria reaproveita os rótulos que já existiam nas configurações.
    auditoria: props.t.grupos.auditoria,
    logsAuditoria: props.t.itens['logs-auditoria'],
    logsRequisicao: props.t.itens['logs-requisicao'],
  }
  return mapa[no.chave ?? ''] ?? (no.chave ?? '')
}

/**
 * As áreas da trilha: as duas nativas, depois UMA POR SEÇÃO que o administrador
 * mandou para a trilha, e por último administração e ajuda. Não existe balde
 * genérico de "seções": ele agrupava por mecanismo, e ela apontou isso.
 */
const areas = computed(() => [
  { id: 'trabalho', icone: 'i-lucide-house', rotulo: props.t.areaTrabalho, bloqueada: false },
  { id: 'dados', icone: 'i-lucide-database', rotulo: props.t.areaDados, bloqueada: false },
  ...menu.secoesNaTrilha.value.map(s => ({
    id: `sec:${s.id}`,
    icone: s.icone,
    rotulo: rotuloDe(s),
    bloqueada: false,
  })),
  { id: 'config', icone: 'i-lucide-settings', rotulo: props.t.configuracoes, bloqueada: !props.podeConfigurar },
  /*
   * RODADA 9: a Ajuda SAIU daqui. Ela era uma área da trilha, do mesmo tamanho
   * de Trabalho e de Dados, para três links que se usam quando algo trava.
   * Virou ícone na base, junto da lupa e do criar. O BENI, que era o primeiro
   * item dela, virou "Chat de IA" e está nos destinos nativos.
   */
])

/** Seção inteira por vir: o selo sobe para o cabeçalho e as linhas ficam limpas. */
function seloDaSecao(no: NoDoMenu) {
  const filhos = no.filhos ?? []
  if (!filhos.length || !filhos.every(f => f.emBreve)) return undefined
  return props.t.emBreve
}

/** O contador do Inbox vem do estado das notificações e some no zero. */
function contadorDe(no: NoDoMenu) {
  if (no.chave === 'inbox') return menu.naoLidas.value || undefined
  if (no.chave === 'tarefas') return 3
  return undefined
}

const tituloDaArea = computed(() => areas.value.find(a => a.id === area.value)?.rotulo ?? '')

/** Seção inteira por vir, na trilha: o selo vai para o título do painel. */
const seloDaArea = computed(() => (secaoAtual.value ? seloDaSecao(secaoAtual.value) : undefined))

const secaoAtual = computed(() => {
  if (!area.value.startsWith('sec:')) return null
  return menu.secoes.value.find(s => s.id === area.value.slice(4)) ?? null
})

/** As seções que o administrador mandou para dentro de um painel. */
function secoesDoPainel(painel: string) {
  return menu.secoesNoPainel.value.filter(s => (s.painel ?? 'trabalho') === painel)
}

/* O grupo aberto acompanha o item ativo, como na barra unica (rodada 10). */
const grupoDoItem = (id: string) => gruposDeConfiguracao.find(g => g.itens.some(i => i.id === id))?.id ?? 'workspace'
const grupoAberto = ref(grupoDoItem(props.itemConfigAtivo))
watch(() => props.itemConfigAtivo, (id) => { grupoAberto.value = grupoDoItem(id) })
const abertas = ref<Record<string, boolean>>({ favoritos: true, categorias: true })

function aberta(id: string) {
  return abertas.value[id] ?? false
}
function alternar(id: string) {
  abertas.value[id] = !aberta(id)
}

/*
 * AS DUAS REGRAS DE ABERTURA (rodada 10), as mesmas da barra única:
 * clicar num menu de primeiro nível abre a primeira tela dele, e seção com uma
 * tela só vira linha que abre direto. Aqui o "menu de primeiro nível" é o
 * ícone da trilha, então escolher a área já escolhe a primeira tela da área.
 */
function temUmaSo(no: NoDoMenu) {
  return (no.filhos?.length ?? 0) === 1
}

function unicoFilho(no: NoDoMenu) {
  return (no.filhos ?? [])[0]
}

function abrirSecao(no: NoDoMenu) {
  const estavaAberta = aberta(no.id)
  alternar(no.id)
  if (estavaAberta) return
  const primeiro = (no.filhos ?? [])[0]
  if (primeiro) emit('destino', primeiro.id)
}

function abrirFavoritos() {
  const estavaAberta = aberta('favoritos')
  alternar('favoritos')
  if (estavaAberta) return
  const primeira = props.favoritas[0]
  if (primeira) emit('categoria', primeira)
}

function abrirCategorias() {
  const estavaAberta = aberta('categorias')
  alternar('categorias')
  if (estavaAberta) return
  const primeira = props.recorte[0]
  if (primeira) emit('categoria', primeira)
}

/** A primeira tela da área, que é o que trocar de área passa a abrir. */
function abrirPrimeiraDaArea(id: string) {
  if (id === 'trabalho') {
    const d = menu.destinos.value[0]
    if (d) emit('destino', d.id)
    return
  }
  if (id === 'dados') {
    const c = props.favoritas[0] ?? props.recorte[0]
    if (c) emit('categoria', c)
    return
  }
  if (id.startsWith('sec:')) {
    const secao = menu.secoes.value.find(x => x.id === id.slice(4))
    const primeiro = (secao?.filhos ?? [])[0]
    if (primeiro) emit('destino', primeiro.id)
    return
  }
  if (id === 'config') {
    const primeiro = gruposDeConfiguracao[0]?.itens[0]
    if (primeiro) emit('item', primeiro.id, props.t.itens[primeiro.id] ?? primeiro.id)
  }
}

function irPara(a: { id: string, bloqueada: boolean }) {
  if (a.bloqueada) return
  const jaEstava = area.value === a.id
  area.value = a.id
  if (!jaEstava) abrirPrimeiraDaArea(a.id)
}

/*
 * A área escolhida pode deixar de existir: apagar ou mover uma seção para o
 * painel tira o ícone da trilha. Sem isto o painel ficaria vazio e sem título.
 */
watch(areas, (lista) => {
  if (!lista.some(a => a.id === area.value)) area.value = 'trabalho'
})
</script>

<template>
  <div class="flex h-full">
    <!-- ==================== A TRILHA ==================== -->
    <div class="flex w-[4.5rem] shrink-0 flex-col items-center gap-1 overflow-y-auto border-r border-default bg-accented/40 py-2">
      <UTooltip :text="workspace.nome" :content="{ side: 'right' }">
        <button
          type="button"
          class="mb-1 flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-inverted transition-transform hover:scale-105"
          :aria-label="props.t.trocarWorkspace"
        >
          {{ workspace.inicial }}
        </button>
      </UTooltip>

      <button
        v-for="a in areas"
        :key="a.id"
        type="button"
        class="flex w-full shrink-0 flex-col items-center gap-0.5 rounded-lg px-1 py-2 transition-colors"
        :class="[
          area === a.id
            ? 'bg-primary/15 text-highlighted'
            : a.bloqueada
              ? 'cursor-not-allowed text-muted'
              : 'text-default hover:bg-elevated',
        ]"
        :aria-current="area === a.id ? 'page' : undefined"
        :disabled="a.bloqueada"
        @click="irPara(a)"
      >
        <UIcon
          :name="a.bloqueada ? 'i-lucide-lock' : a.icone"
          class="size-5"
          :class="area === a.id ? 'text-primary' : ''"
        />
        <span class="w-full truncate text-center text-[10px] font-medium leading-tight">{{ a.rotulo }}</span>
      </button>

      <div class="min-h-2 flex-1" />

      <!--
        RODADA 8: a lupa e o criar voltaram para a base da trilha, a pedido dela.
        Subiram na rodada 7 e desceram aqui: ela viu os dois arranjos e preferiu
        este. É também onde o Slack, o Teams e o monday os põem.
      -->
      <UTooltip :text="props.t.buscarEmTudo" :content="{ side: 'right' }">
        <button
          type="button"
          class="flex size-9 shrink-0 items-center justify-center rounded-lg text-default transition-colors hover:bg-elevated"
          :aria-label="props.t.buscarEmTudo"
          @click="emit('busca')"
        >
          <UIcon name="i-lucide-search" class="size-5" />
        </button>
      </UTooltip>

      <!-- RODADA 9: a Ajuda mora aqui agora, ícone com menu no hover. -->
      <MenuDeAjuda :t="props.t" @escolher="r => emit('ajuda', r)" />

      <UDropdownMenu :items="props.itensDeCriar" :content="{ side: 'right', align: 'end' }">
        <UTooltip :text="props.t.criar" :content="{ side: 'right' }">
          <button
            type="button"
            class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-inverted transition-transform hover:scale-105"
            :aria-label="props.t.criar"
          >
            <UIcon name="i-lucide-plus" class="size-5" />
          </button>
        </UTooltip>
      </UDropdownMenu>
    </div>

    <!-- ==================== O PAINEL DA ÁREA ==================== -->
    <div class="flex min-w-0 flex-1 flex-col">
      <div class="flex h-12 shrink-0 items-center gap-2 border-b border-default px-3">
        <h2 class="min-w-0 truncate text-sm font-bold text-highlighted">{{ tituloDaArea }}</h2>
        <UBadge v-if="seloDaArea" :label="seloDaArea" size="sm" color="neutral" variant="subtle" class="shrink-0" />
        <span class="flex-1" />
      </div>

      <nav class="min-h-0 flex-1 overflow-y-auto px-2 py-2" :aria-label="tituloDaArea">
        <!-- ---------- Trabalho ---------- -->
        <template v-if="area === 'trabalho'">
          <div class="space-y-0.5">
            <LinhaDeMenu
              v-for="(d, i) in menu.destinos.value"
              :key="d.id"
              :icone="d.icone"
              :rotulo="rotuloDe(d)"
              :contador="contadorDe(d)"
              :selo="d.emBreve ? props.t.emBreve : undefined"
              :ativo="props.destinoAtivo === d.id"
              :atraso="i * 25"
              @selecionar="emit('destino', d.id)"
            />
          </div>

          <template v-for="s in secoesDoPainel('trabalho')" :key="s.id">
            <LinhaDeMenu
              v-if="temUmaSo(s)"
              class="mt-2"
              :icone="s.icone"
              :rotulo="rotuloDe(s)"
              :selo="seloDaSecao(s)"
              :ativo="props.destinoAtivo === unicoFilho(s).id"
              @selecionar="emit('destino', unicoFilho(s).id)"
            />
            <SecaoDeMenu
              v-else
              :rotulo="rotuloDe(s)"
              :selo="seloDaSecao(s)"
              :aberta="aberta(s.id)"
              :texto-recolher="props.t.recolherSecao(rotuloDe(s))"
              :texto-expandir="props.t.expandirSecao(rotuloDe(s))"
              @alternar="abrirSecao(s)"
            >
              <LinhaDeMenu
                v-for="(item, i) in (s.filhos ?? [])"
                :key="item.id"
                :icone="item.icone"
                :rotulo="rotuloDe(item)"
                :nivel="2"
                :selo="item.emBreve ? props.t.emBreve : undefined"
                :ativo="props.destinoAtivo === item.id"
                :atraso="i * 25"
                @selecionar="emit('destino', item.id)"
              />
            </SecaoDeMenu>
          </template>
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
              :aberta="aberta('favoritos')"
              :texto-recolher="props.t.recolherSecao(props.t.favoritos)"
              :texto-expandir="props.t.expandirSecao(props.t.favoritos)"
              @alternar="abrirFavoritos()"
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
              :aberta="aberta('categorias')"
              :contador="props.totalDeCategorias || undefined"
              :texto-recolher="props.t.recolherSecao(props.t.categorias)"
              :texto-expandir="props.t.expandirSecao(props.t.categorias)"
              @alternar="abrirCategorias()"
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

            <template v-for="s in secoesDoPainel('dados')" :key="s.id">
              <!-- Uma tela só: linha simples que abre direto, sem seta. -->
              <LinhaDeMenu
                v-if="temUmaSo(s)"
                class="mt-2"
                :icone="s.icone"
                :rotulo="rotuloDe(s)"
                :selo="seloDaSecao(s)"
                :ativo="props.destinoAtivo === unicoFilho(s).id"
                @selecionar="emit('destino', unicoFilho(s).id)"
              />
              <SecaoDeMenu
                v-else
                :rotulo="rotuloDe(s)"
                :selo="seloDaSecao(s)"
                :aberta="aberta(s.id)"
                :texto-recolher="props.t.recolherSecao(rotuloDe(s))"
                :texto-expandir="props.t.expandirSecao(rotuloDe(s))"
                @alternar="abrirSecao(s)"
              >
                <LinhaDeMenu
                  v-for="(item, i) in (s.filhos ?? [])"
                  :key="item.id"
                  :icone="item.icone"
                  :rotulo="rotuloDe(item)"
                  :nivel="2"
                  :selo="item.emBreve ? props.t.emBreve : undefined"
                  :ativo="props.destinoAtivo === item.id"
                  :atraso="i * 25"
                  @selecionar="emit('destino', item.id)"
                />
              </SecaoDeMenu>
            </template>
          </template>
        </template>

        <!-- ---------- Uma seção que foi para a trilha ---------- -->
        <div v-else-if="secaoAtual" class="space-y-0.5">
          <LinhaDeMenu
            v-for="(item, i) in (secaoAtual.filhos ?? [])"
            :key="item.id"
            :icone="item.icone"
            :rotulo="rotuloDe(item)"
            :selo="seloDaArea ? undefined : (item.emBreve ? props.t.emBreve : undefined)"
            :ativo="props.destinoAtivo === item.id"
            :atraso="i * 25"
            @selecionar="emit('destino', item.id)"
          />
        </div>

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

      </nav>
    </div>
  </div>
</template>
