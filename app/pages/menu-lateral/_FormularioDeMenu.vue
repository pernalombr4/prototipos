<script setup lang="ts">
import {
  gruposDeMembros,
  tiposDeTela,
  paineisQueRecebem,
  type LugarDaSecao,
  type NoDoMenu,
} from './mocks'
import type { TextosDaTela } from './textos'

/**
 * Os dois formulários de criação do menu, na mesma tela em camada.
 *
 * Rodada 4. O que ela pediu:
 * "deixe abrir o form de criação de seção de menu e criação de menus. nesse caso
 *  o user poderia criar no menu grandão e no menu pequeno seções pra ele.
 *  me mostre como vai ser isso. precisa estar escopado tambem"
 *
 * Três decisões:
 *
 * 1. O CAMPO "ONDE A SEÇÃO APARECE" só existe no modelo de trilha, porque só lá
 *    existem dois lugares: a trilha estreita (o "menu pequeno") e o painel da
 *    área (o "menu grandão"). Na barra única existe um lugar só, então perguntar
 *    seria inventar uma decisão que não existe.
 *
 * 2. O ESCOPO É O QUE O PRODUTO JÁ TEM. "Grupos Permitidos" da seção de menu:
 *    nenhum grupo marcado significa que todos enxergam. O item herda o escopo da
 *    seção, e restringir mais é opcional (essa parte é proposta, está marcada).
 *
 * 3. TEM PRÉVIA. "me mostre como vai ser isso" se responde mostrando, e a prévia
 *    muda junto com o nome, o ícone e o lugar escolhido.
 */
const props = defineProps<{
  t: TextosDaTela
  modo: 'secao' | 'item'
  modelo: 'barra' | 'trilha'
  /** Seções que podem receber um item. Só as do workspace: regra R4. */
  secoes: { id: string, rotulo: string, escopo: string[] }[]
}>()

const aberto = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ criado: [no: NoDoMenu & { lugar?: LugarDaSecao, escopo: string[] }] }>()

const nome = ref('')
const icone = ref('folder')
const lugar = ref<LugarDaSecao>('trilha')
const painelAlvo = ref('trabalho')
const escopo = ref<string[]>([])
const secaoAlvo = ref('')
const tipo = ref('consultas')
const caminho = ref('')
const categorias = ref<string[]>([])
const restringirItem = ref(false)
const tentouSalvar = ref(false)

/*
 * `immediate` porque este formulário vive dentro do corpo do editor, que só
 * renderiza quando o editor abre. Vindo do "+ Criar", os dois abrem no mesmo
 * instante e o componente monta com `aberto` já true: sem `immediate` o watch
 * nunca dispara e a seção de destino nasce vazia.
 */
watch(aberto, (v) => {
  if (!v) return
  nome.value = ''
  icone.value = props.modo === 'secao' ? 'folder' : 'file-text'
  lugar.value = 'trilha'
  painelAlvo.value = 'trabalho'
  escopo.value = []
  secaoAlvo.value = props.secoes[0]?.id ?? ''
  tipo.value = 'consultas'
  caminho.value = ''
  categorias.value = []
  restringirItem.value = false
  tentouSalvar.value = false
}, { immediate: true })

const ehSecao = computed(() => props.modo === 'secao')

const tipoEscolhido = computed(() => tiposDeTela.find(x => x.id === tipo.value))
const precisaCaminho = computed(() => tipoEscolhido.value?.exigeCaminho ?? false)
const precisaCategoria = computed(() => tipoEscolhido.value?.exigeCategoria ?? false)

const opcoesDeTipo = computed(() =>
  tiposDeTela.map(x => ({ label: props.t.tipos[x.id] ?? x.id, value: x.id })),
)
const opcoesDePainel = computed(() =>
  paineisQueRecebem.map(p => ({
    label: (props.t as unknown as Record<string, string>)[p.chave] ?? p.id,
    value: p.id,
  })),
)
const opcoesDeSecao = computed(() => props.secoes.map(s => ({ label: s.rotulo, value: s.id })))

const secaoDoItem = computed(() => props.secoes.find(s => s.id === secaoAlvo.value) ?? null)

/** O escopo que vale de verdade: o do item, se ele restringe, senão o da seção. */
const escopoEfetivo = computed(() => {
  if (ehSecao.value) return escopo.value
  if (restringirItem.value) return escopo.value
  return secaoDoItem.value?.escopo ?? []
})

const resumoDoEscopo = computed(() => {
  const n = escopoEfetivo.value.length
  if (n === 0) return props.t.escopoTodos
  if (n === 1) return gruposDeMembros.find(g => g.id === escopoEfetivo.value[0])?.nome ?? ''
  return props.t.escopoResumo(n)
})

const erroDeNome = computed(() => tentouSalvar.value && !nome.value.trim() ? props.t.faltaNome : undefined)
const erroDeCaminho = computed(() =>
  tentouSalvar.value && !ehSecao.value && precisaCaminho.value && !caminho.value.trim()
    ? props.t.faltaCaminho
    : undefined,
)

function alternarGrupo(id: string) {
  const i = escopo.value.indexOf(id)
  if (i >= 0) escopo.value.splice(i, 1)
  else escopo.value.push(id)
}

function salvar() {
  tentouSalvar.value = true
  if (erroDeNome.value || erroDeCaminho.value) return

  emit('criado', {
    id: `novo-${Date.now()}`,
    tipo: ehSecao.value ? 'secao' : 'tela',
    rotulo: nome.value.trim(),
    icone: `i-lucide-${icone.value}`,
    tipoDeTela: ehSecao.value ? undefined : tipo.value,
    categoriasLigadas: categorias.value.length || undefined,
    filhos: ehSecao.value ? [] : undefined,
    lugar: ehSecao.value && props.modelo === 'trilha' ? lugar.value : undefined,
    escopo: escopoEfetivo.value,
  })
  aberto.value = false
}
</script>

<template>
  <UModal
    v-model:open="aberto"
    :title="ehSecao ? props.t.formSecaoTitulo : props.t.formItemTitulo"
    :description="ehSecao ? props.t.formSecaoDescricao : props.t.formItemDescricao"
    :ui="{ content: 'max-w-2xl' }"
  >
    <template #body>
      <div class="space-y-4">
        <!-- ---------------- nome e ícone ---------------- -->
        <div class="flex items-start gap-3">
          <UFormField :label="props.t.campoIcone" class="shrink-0">
            <UPopover>
              <UButton color="neutral" variant="outline" square size="lg" :aria-label="props.t.campoIcone">
                <UIcon :name="`i-lucide-${icone}`" class="size-5" />
              </UButton>
              <template #content>
                <div class="w-80 p-2">
                  <UxSeletorDeIcones v-model="icone" :altura="220" />
                </div>
              </template>
            </UPopover>
          </UFormField>

          <UFormField
            :label="props.t.campoNome"
            :description="props.t.campoNomeDica"
            :error="erroDeNome"
            class="min-w-0 flex-1"
          >
            <UInput v-model="nome" class="w-full" autofocus />
          </UFormField>
        </div>

        <!-- ---------------- só seção: onde ela aparece ---------------- -->
        <UFormField
          v-if="ehSecao && props.modelo === 'trilha'"
          :label="props.t.campoOnde"
          :description="props.t.campoOndeDica"
        >
          <div class="grid gap-2 sm:grid-cols-2">
            <button
              v-for="opcao in [
                { v: 'trilha', r: props.t.ondeTrilha, d: props.t.ondeTrilhaDica, i: 'i-lucide-panel-left' },
                { v: 'painel', r: props.t.ondePainel, d: props.t.ondePainelDica, i: 'i-lucide-rows-3' },
              ]"
              :key="opcao.v"
              type="button"
              class="rounded-lg border p-3 text-left transition-colors"
              :class="lugar === opcao.v ? 'border-primary bg-primary/5' : 'border-default hover:bg-elevated'"
              :aria-pressed="lugar === opcao.v"
              @click="lugar = opcao.v as LugarDaSecao"
            >
              <span class="flex items-center gap-2">
                <UIcon :name="opcao.i" class="size-4 shrink-0" :class="lugar === opcao.v ? 'text-primary' : 'text-toned'" />
                <span class="text-sm font-medium text-highlighted">{{ opcao.r }}</span>
              </span>
              <span class="mt-1 block text-xs leading-relaxed text-muted">{{ opcao.d }}</span>
            </button>
          </div>
        </UFormField>

        <UFormField
          v-if="ehSecao && props.modelo === 'trilha' && lugar === 'painel'"
          :label="props.t.campoPainel"
        >
          <USelect v-model="painelAlvo" :items="opcoesDePainel" class="w-full sm:w-64" />
        </UFormField>

        <!-- ---------------- só item: tipo, caminho, categorias, seção ---------------- -->
        <template v-if="!ehSecao">
          <div class="grid gap-3 sm:grid-cols-2">
            <UFormField :label="props.t.tipoDeTela">
              <USelect v-model="tipo" :items="opcoesDeTipo" class="w-full" />
            </UFormField>

            <UFormField :label="props.t.campoSecao">
              <USelect v-model="secaoAlvo" :items="opcoesDeSecao" class="w-full" />
            </UFormField>
          </div>

          <UFormField
            v-if="precisaCaminho"
            :label="props.t.campoCaminho"
            :description="props.t.campoCaminhoDica"
            :error="erroDeCaminho"
          >
            <UInput v-model="caminho" class="w-full" placeholder="/relatorios/mensal" />
          </UFormField>

          <UFormField v-if="precisaCategoria" :label="props.t.campoCategorias">
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
        </template>

        <!-- ---------------- o escopo ---------------- -->
        <UFormField :label="props.t.campoEscopo" :description="props.t.escopoDica">
          <p v-if="!ehSecao && !restringirItem" class="mb-2 text-sm text-muted">
            {{ props.t.escopoHerdado(secaoDoItem?.rotulo ?? '') }}
          </p>

          <UCheckbox
            v-if="!ehSecao"
            v-model="restringirItem"
            :label="props.t.escopoRestringir"
            class="mb-2"
          />

          <div v-if="ehSecao || restringirItem" class="flex flex-wrap gap-2">
            <button
              v-for="g in gruposDeMembros"
              :key="g.id"
              type="button"
              class="rounded-full border px-3 py-1 text-sm transition-colors"
              :class="escopo.includes(g.id)
                ? 'border-primary bg-primary/10 font-medium text-highlighted'
                : 'border-default text-default hover:bg-elevated'"
              :aria-pressed="escopo.includes(g.id)"
              @click="alternarGrupo(g.id)"
            >
              {{ g.nome }}
              <span class="text-xs text-muted">{{ g.pessoas }}</span>
            </button>
          </div>
        </UFormField>

        <!-- ---------------- a prévia ---------------- -->
        <div class="rounded-lg border border-default bg-elevated/40 p-3">
          <p class="mb-2 text-xs font-semibold uppercase tracking-wider text-toned">
            {{ ehSecao && props.modelo === 'trilha' && lugar === 'trilha' ? props.t.preverNaTrilha : props.t.preverNoPainel }}
          </p>

          <!-- prévia na trilha: ícone com rótulo curto -->
          <div v-if="ehSecao && props.modelo === 'trilha' && lugar === 'trilha'" class="flex w-[4.5rem] flex-col items-center gap-0.5 rounded-lg bg-primary/15 px-1 py-2">
            <UIcon :name="`i-lucide-${icone}`" class="size-5 text-primary" />
            <span class="w-full truncate text-center text-[10px] font-medium leading-tight text-highlighted">
              {{ nome || props.t.campoNome }}
            </span>
          </div>

          <!-- prévia no painel: cabeçalho de seção mais um item -->
          <div v-else class="w-64 space-y-0.5">
            <div class="flex items-center gap-1.5 px-2 py-1 text-xs font-semibold uppercase tracking-wider text-toned">
              <UIcon name="i-lucide-chevron-down" class="size-3 shrink-0" />
              <span class="min-w-0 truncate">{{ ehSecao ? (nome || props.t.campoNome) : (secaoDoItem?.rotulo ?? '') }}</span>
            </div>
            <div class="flex items-center gap-2.5 rounded-md py-1.5 pl-8 pr-2.5 text-sm text-default">
              <UIcon :name="`i-lucide-${icone}`" class="size-4 shrink-0 text-toned" />
              <span class="min-w-0 flex-1 truncate">{{ ehSecao ? props.t.adicionarItem : (nome || props.t.campoNome) }}</span>
            </div>
          </div>

          <p class="mt-2 flex items-center gap-1.5 text-xs text-muted">
            <UIcon name="i-lucide-eye" class="size-3.5 shrink-0" />
            {{ resumoDoEscopo }}
          </p>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex w-full justify-end gap-2">
        <UButton :label="props.t.cancelar" color="neutral" variant="ghost" @click="aberto = false" />
        <UButton :label="props.t.salvar" color="primary" @click="salvar" />
      </div>
    </template>
  </UModal>
</template>
