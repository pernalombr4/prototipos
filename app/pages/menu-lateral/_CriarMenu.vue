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

type Lugar = 'inicio' | 'trilha' | 'secao'

const nome = ref('')
const icone = ref('file-text')
const escolhendoIcone = ref(false)
const tipo = ref('consultas')
const categorias = ref<string[]>([])
const caminho = ref('')
const lugar = ref<Lugar>('inicio')
const secaoAlvo = ref('')
const escopo = ref<string[]>([])
const tentou = ref(false)

/** As seções da árvore que recebem um menu dentro. */
const secoesQueRecebem = computed(() =>
  menu.secoes.value.map(s => ({ label: rotuloDoNo(s, props.t), value: s.id })),
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
  if (v.startsWith('secao:')) {
    lugar.value = 'secao'
    secaoAlvo.value = v.slice(6)
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

const erroDeNome = computed(() => tentou.value && !nome.value.trim() ? props.t.faltaNome : undefined)
const erroDeCaminho = computed(() => tentou.value && pedeCaminho.value && !caminho.value.trim() ? props.t.faltaCaminho : undefined)

const lugares = computed(() => [
  { v: 'inicio' as const, r: props.t.noInicio, i: 'i-lucide-house' },
  { v: 'trilha' as const, r: props.t.naTrilhaRotulo, i: 'i-lucide-panel-left' },
  { v: 'secao' as const, r: props.t.dentroDeSecao, i: 'i-lucide-rows-3' },
])

function alternarGrupo(id: string) {
  const i = escopo.value.indexOf(id)
  if (i >= 0) escopo.value.splice(i, 1)
  else escopo.value.push(id)
}

const resumoDoEscopo = computed(() =>
  escopo.value.length ? props.t.escopoResumo(escopo.value.length) : props.t.escopoTodos,
)

function criar() {
  tentou.value = true
  if (erroDeNome.value || erroDeCaminho.value) return

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
      <form id="form-criar-menu" class="space-y-4" @submit.prevent="criar">
        <!-- ícone e nome -->
        <UFormField :label="props.t.campoNome" :description="props.t.campoNomeDica" :error="erroDeNome">
          <div class="flex items-center gap-2">
            <UPopover v-model:open="escolhendoIcone" :content="{ side: 'bottom', align: 'start' }">
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

        <!-- o tipo É a tela -->
        <UFormField :label="props.t.tipoDeMenu" :description="props.t.tipoDeMenuDica">
          <USelect v-model="tipo" :items="opcoesDeTipo" class="w-full" />
        </UFormField>

        <UFormField v-if="pedeCategoria" :label="props.t.campoCategorias">
          <USelectMenu
            v-model="categorias"
            multiple
            :items="['Contratos', 'Clientes', 'Chamados', 'Fornecedores']"
            class="w-full"
          />
          <p v-if="!categorias.length" class="mt-1 flex items-center gap-1.5 text-xs text-warning">
            <UIcon name="i-lucide-triangle-alert" class="size-3.5 shrink-0" />
            {{ props.t.exigeCategoria }}
          </p>
        </UFormField>

        <UFormField
          v-if="pedeCaminho"
          :label="props.t.campoCaminho"
          :description="props.t.campoCaminhoDica"
          :error="erroDeCaminho"
        >
          <UInput v-model="caminho" class="w-full" placeholder="/relatorios/mensal" />
        </UFormField>

        <!-- onde mora -->
        <UFormField :label="props.t.ondeFica">
          <div class="flex flex-wrap gap-2">
            <UButton
              v-for="op in lugares"
              :key="op.v"
              :label="op.r"
              :icon="op.i"
              size="sm"
              :color="lugar === op.v ? 'primary' : 'neutral'"
              :variant="lugar === op.v ? 'soft' : 'outline'"
              :aria-pressed="lugar === op.v"
              :disabled="op.v === 'secao' && !secoesQueRecebem.length"
              @click="lugar = op.v"
            />
          </div>
          <USelect
            v-if="lugar === 'secao'"
            v-model="secaoAlvo"
            :items="secoesQueRecebem"
            class="mt-2 w-full"
            :aria-label="props.t.campoSecao"
          />
        </UFormField>

        <!-- quem enxerga: os Grupos Permitidos do produto (rodada 4) -->
        <UFormField :label="props.t.campoEscopo" :description="props.t.escopoDica">
          <div class="flex flex-wrap gap-1.5">
            <UButton
              v-for="g in gruposDeMembros"
              :key="g.id"
              size="xs"
              :color="escopo.includes(g.id) ? 'primary' : 'neutral'"
              :variant="escopo.includes(g.id) ? 'soft' : 'outline'"
              :aria-pressed="escopo.includes(g.id)"
              @click="alternarGrupo(g.id)"
            >
              {{ g.nome }}
              <span class="text-muted">{{ g.pessoas }}</span>
            </UButton>
          </div>
        </UFormField>

        <!-- a prévia: a linha no menu e, embaixo, o que abre -->
        <div class="rounded-lg border border-default bg-elevated/40 p-3">
          <p class="mb-2 text-xs font-semibold uppercase tracking-wider text-toned">{{ props.t.comoFica }}</p>
          <div class="flex items-center gap-2.5 rounded-md py-1.5 pl-2.5 pr-2.5 text-sm text-default">
            <UIcon :name="`i-lucide-${icone}`" class="size-4 shrink-0 text-toned" />
            <span class="min-w-0 flex-1 truncate">{{ nome || props.t.campoNome }}</span>
          </div>
          <p class="mt-1 flex items-center gap-1.5 pl-2.5 text-xs text-muted">
            <UIcon name="i-lucide-corner-down-right" class="size-3.5 shrink-0" />
            {{ props.t.tipos[tipo] ?? tipo }}
          </p>
          <p class="mt-1 flex items-center gap-1.5 pl-2.5 text-xs text-muted">
            <UIcon name="i-lucide-eye" class="size-3.5 shrink-0" />
            {{ resumoDoEscopo }}
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
