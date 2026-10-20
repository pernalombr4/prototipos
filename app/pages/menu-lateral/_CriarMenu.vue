<script setup lang="ts">
import RodapeDaJanela from './_RodapeDaJanela.vue'
import { useMenuDoWorkspace } from './estado'
import { useTrilha } from './trilha'
import { rotuloDoNo } from './rotulos'
import { MOLDURA } from './moldura'
import { tiposDeTela, gruposDeMembros, type NoDoMenu } from './mocks'
import type { TextosDaTela } from './textos'

/**
 * CRIAR MENU: o único formulário de menu do protótipo (rodada 20).
 *
 * Nasceu na rodada 16, pelo "+" do Início, com duas portas para as telas:
 * "vincular tela existente" e "criar tela nova". Em 13/10/2026 ela decidiu o
 * contrário, numa conversa paralela (rodada 14P):
 *
 *   "telas nao devem ser apresentadas separadamente de menus. na hora de criar
 *    um menu, seleciona-se o tipo de menu ali. esse 'tipo de menu' é
 *    justamente a tela. aí já se cria uma tela vinculada a um menu
 *    automaticamente."
 *
 * e, perguntada, decidiu que a mesma tela não aparece em dois menus. Então:
 *
 *   - sai "vincular tela existente" (era o reuso que ela recusou);
 *   - sai "criar tela nova" como passo separado: o TIPO DO MENU é a tela;
 *   - fica o que a rodada 16 trouxe: onde o menu mora (Início ou trilha);
 *   - volta o que a rodada 4 pediu e o formulário da rodada 16 tinha perdido:
 *     categorias e caminho quando o tipo pede, quem enxerga, e a prévia.
 *
 * Este é também o formulário do editor ("Novo menu" e o "+" de cada seção):
 * antes o editor abria outro formulário, com outros campos e outra largura.
 *
 * Por baixo, o menu continua sendo o que a árvore entende: no Início ou na
 * trilha, uma seção com UMA tela (que a barra desenha como linha simples desde
 * a rodada 10); dentro de uma seção, uma tela nela.
 */
const props = defineProps<{ t: TextosDaTela }>()

const menu = useMenuDoWorkspace()
const trilha = useTrilha()
const toast = useToast()

const aberta = computed({
  get: () => trilha.criandoMenu.value !== null,
  set: (v) => { if (!v) trilha.criandoMenu.value = null },
})

// Rodada 28: 'menu' é dentro de outro menu, como submenu (o 3º nível).
type Lugar = 'inicio' | 'trilha' | 'secao' | 'menu'

const nome = ref('')
const icone = ref('file-text')
const escolhendoIcone = ref(false)
const tipo = ref('consultas')
const categorias = ref<string[]>([])
const caminho = ref('')
const lugar = ref<Lugar>('inicio')
const secaoAlvo = ref('')
const menuAlvo = ref('')
const escopo = ref<string[]>([])
const tentou = ref(false)

/** As seções da árvore que recebem um menu dentro. */
const secoesQueRecebem = computed(() =>
  // Rodada 26: Integrações tem ordem fixa e não recebe menu novo.
  menu.secoes.value.filter(s => !s.ordemFixa).map(s => ({ label: rotuloDoNo(s, props.t), value: s.id })),
)

/**
 * Os menus que recebem submenu (rodada 28): os que estão dentro de uma seção
 * e ainda não são submenu. Integrações fica de fora (ordem fixa).
 */
const menusQueRecebem = computed(() =>
  menu.secoes.value
    .filter(s => !s.ordemFixa)
    .flatMap(s => (s.filhos ?? []).filter(f => f.tipo === 'tela').map(f => ({ label: `${rotuloDoNo(f, props.t)} (${rotuloDoNo(s, props.t)})`, value: f.id }))),
)

watch(() => trilha.criandoMenu.value, (v) => {
  if (!v) return
  nome.value = ''
  icone.value = 'file-text'
  tipo.value = 'consultas'
  categorias.value = []
  caminho.value = ''
  escopo.value = []
  tentou.value = false
  menuAlvo.value = menusQueRecebem.value[0]?.value ?? ''
  if (v.startsWith('secao:')) {
    lugar.value = 'secao'
    secaoAlvo.value = v.slice(6)
  }
  else if (v.startsWith('menu:')) {
    lugar.value = 'menu'
    menuAlvo.value = v.slice(5)
    secaoAlvo.value = secoesQueRecebem.value[0]?.value ?? ''
  }
  else {
    lugar.value = v as Lugar
    secaoAlvo.value = secoesQueRecebem.value[0]?.value ?? ''
  }
}, { immediate: true })

const opcoesDeTipo = computed(() => tiposDeTela.map(x => ({ label: props.t.tipos[x.id] ?? x.id, value: x.id })))
const tipoEscolhido = computed(() => tiposDeTela.find(x => x.id === tipo.value))
const pedeCategoria = computed(() => !!tipoEscolhido.value?.exigeCategoria)
const pedeCaminho = computed(() => !!tipoEscolhido.value?.exigeCaminho)

const erroDeNome = computed(() => tentou.value && !nome.value.trim() ? props.t.faltaNomeMenu : undefined)
const erroDeCategoria = computed(() => tentou.value && pedeCategoria.value && !categorias.value.length ? props.t.faltaCategoria : undefined)
const erroDeCaminho = computed(() => tentou.value && pedeCaminho.value && !caminho.value.trim() ? props.t.faltaCaminho : undefined)

/*
 * Rodada 29: "esse form ta ruim, baugnçado visualmente". Os 4 botões de
 * lugar quebravam em 2 linhas e os grupos eram 5 chips soltos: viraram
 * listas de seleção, como os outros formulários do protótipo.
 */
const lugares = computed(() => [
  { value: 'inicio', label: props.t.noInicio, icon: 'i-lucide-house' },
  { value: 'trilha', label: props.t.naTrilhaRotulo, icon: 'i-lucide-panel-left' },
  { value: 'secao', label: props.t.dentroDeSecao, icon: 'i-lucide-rows-3', disabled: !secoesQueRecebem.value.length },
  { value: 'menu', label: props.t.dentroDeMenu, icon: 'i-lucide-list-tree', disabled: !menusQueRecebem.value.length },
])

const opcoesDeGrupo = computed(() => gruposDeMembros.map(g => ({ value: g.id, label: g.nome, suffix: String(g.pessoas) })))

const resumoDoEscopo = computed(() =>
  escopo.value.length ? props.t.escopoResumo(escopo.value.length) : props.t.escopoTodos,
)

function criar() {
  tentou.value = true
  if (erroDeNome.value || erroDeCaminho.value || erroDeCategoria.value) return

  const base = Date.now().toString(36)
  const tela: NoDoMenu = {
    id: `t-${base}`,
    tipo: 'tela',
    origem: 'workspace',
    rotulo: nome.value.trim(),
    icone: `i-lucide-${icone.value}`,
    tipoDeTela: tipo.value,
    categoriasLigadas: categorias.value.length || undefined,
    escopo: [...escopo.value],
  }

  if (lugar.value === 'secao' && secaoAlvo.value) {
    menu.adicionarItem(tela, secaoAlvo.value)
  }
  else if (lugar.value === 'menu' && menuAlvo.value) {
    // Nasce na seção do menu e entra nele como submenu, pela regra dos 3 níveis.
    const secao = menu.localizar(menu.rascunho.value, menuAlvo.value)?.pai
    if (secao) menu.adicionarItem(tela, secao.id)
    menu.adicionarSubmenu(tela.id, menuAlvo.value)
  }
  else {
    const id = `s-${base}`
    menu.adicionarSecao({
      id,
      tipo: 'secao',
      origem: 'workspace',
      rotulo: tela.rotulo,
      icone: tela.icone,
      lugar: lugar.value === 'trilha' ? 'trilha' : 'painel',
      painel: 'trabalho',
      escopo: [...escopo.value],
      filhos: [tela],
    })
    // No Início, como seção criada, entra no topo (rodada 15).
    if (lugar.value === 'inicio') {
      menu.aplicarPrefs((p) => { p.ordemDasSecoes = [id, ...p.ordemDasSecoes] })
    }
  }

  toast.add({ title: props.t.menuCriado(tela.rotulo!), icon: tela.icone, color: 'neutral' })
  trilha.criandoMenu.value = null
}
</script>

<template>
  <UModal
    v-model:open="aberta"
    :title="props.t.criarMenuTitulo"
    :description="props.t.criarMenuDescricao"
    :ui="{ content: MOLDURA.formulario, overlay: MOLDURA.sobreposicao }"
  >
    <template #body>
      <form id="form-criar-menu" class="space-y-5" @submit.prevent="criar">
        <!-- 1. o que é: ícone, nome e o tipo, que é a tela -->
        <UFormField :label="props.t.campoNome" :error="erroDeNome" required>
          <div class="flex items-center gap-2">
            <UPopover v-model:open="escolhendoIcone" :content="{ side: 'bottom', align: 'start' }" :ui="{ content: MOLDURA.dentroDoFormulario }">
              <UButton :icon="`i-lucide-${icone}`" color="neutral" variant="outline" square :aria-label="props.t.escolherIcone" />
              <template #content>
                <div class="w-80 p-2">
                  <UxSeletorDeIcones v-model="icone" :altura="220" @update:model-value="escolhendoIcone = false" />
                </div>
              </template>
            </UPopover>
            <UInput v-model="nome" class="flex-1" :placeholder="props.t.criarMenuPlaceholder" :aria-label="props.t.campoNome" autofocus />
          </div>
        </UFormField>

        <UFormField :label="props.t.tipoDeMenu" :help="props.t.tipoDeMenuDica">
          <USelect :ui="{ content: MOLDURA.dentroDoFormulario }" v-model="tipo" :items="opcoesDeTipo" class="w-full" />
        </UFormField>

        <UFormField v-if="pedeCategoria" :label="props.t.campoCategorias" :help="erroDeCategoria ? undefined : props.t.exigeCategoria" :error="erroDeCategoria" required>
          <USelectMenu :ui="{ content: MOLDURA.dentroDoFormulario }"
            v-model="categorias"
            multiple
            :items="['Contratos', 'Clientes', 'Chamados', 'Fornecedores']"
            :placeholder="props.t.escolherCategorias"
            class="w-full"
          />
        </UFormField>

        <UFormField
          v-if="pedeCaminho"
          :label="props.t.campoCaminho"
          :help="props.t.campoCaminhoDica"
          :error="erroDeCaminho"
          required
        >
          <UInput v-model="caminho" class="w-full" placeholder="/relatorios/mensal" />
        </UFormField>

        <USeparator />

        <!-- 2. onde ele fica e quem enxerga -->
        <div class="grid gap-4 sm:grid-cols-2">
          <UFormField :label="props.t.ondeFica">
            <USelect :ui="{ content: MOLDURA.dentroDoFormulario }" v-model="lugar" :items="lugares" class="w-full" />
          </UFormField>
          <UFormField :label="props.t.campoEscopo">
            <USelectMenu :ui="{ content: MOLDURA.dentroDoFormulario }"
              v-model="escopo"
              multiple
              value-key="value"
              :items="opcoesDeGrupo"
              :placeholder="props.t.escopoTodos"
              icon="i-lucide-users-round"
              class="w-full"
            />
          </UFormField>
        </div>

        <UFormField v-if="lugar === 'secao'" :label="props.t.campoSecao">
          <USelect :ui="{ content: MOLDURA.dentroDoFormulario }" v-model="secaoAlvo" :items="secoesQueRecebem" class="w-full" />
        </UFormField>
        <UFormField v-if="lugar === 'menu'" :label="props.t.campoMenuPai">
          <USelect :ui="{ content: MOLDURA.dentroDoFormulario }" v-model="menuAlvo" :items="menusQueRecebem" class="w-full" />
        </UFormField>

        <!-- 3. a prévia: a linha como fica no menu, e o que ela abre -->
        <div class="rounded-lg border border-dashed border-default p-3">
          <p class="mb-2 text-xs font-semibold uppercase tracking-wider text-toned">{{ props.t.comoFica }}</p>
          <div class="flex items-center gap-2.5 rounded-md bg-elevated/60 px-2.5 py-1.5 text-sm text-default">
            <UIcon :name="`i-lucide-${icone}`" class="size-4 shrink-0 text-toned" />
            <span class="min-w-0 flex-1 truncate" :class="nome ? '' : 'text-muted'">{{ nome || props.t.campoNome }}</span>
          </div>
          <p class="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 px-1 text-xs text-muted">
            <span class="flex items-center gap-1.5">
              <UIcon name="i-lucide-corner-down-right" class="size-3.5 shrink-0" />
              {{ props.t.tipos[tipo] ?? tipo }}
            </span>
            <span class="flex items-center gap-1.5">
              <UIcon name="i-lucide-eye" class="size-3.5 shrink-0" />
              {{ resumoDoEscopo }}
            </span>
          </p>
        </div>
      </form>
    </template>

    <template #footer>
      <RodapeDaJanela
        :cancelar="props.t.cancelar"
        :acao="props.t.criarMenuBotao"
        :contexto="props.t.criarMenuContexto"
        form="form-criar-menu"
        @cancelar="aberta = false"
      />
    </template>
  </UModal>
</template>
