<script setup lang="ts">
import { AREAS, ICONE_DO_TIPO, estruturaDoWorkspace, localidades, workspaceAtual, type CasoDeUso, type Complexidade, type Localidade, type TipoExtra } from './mocks'
import type { Textos } from './textos'

/**
 * CRIAR CASO DE USO (rodada 3): "a opção de CRIAR um caso de uso a partir do
 * que ta no workspace naquele momento [...] com opção de salvar só no
 * workspace ou publicar na lojinha (opçao 2 é melhor)." (Mikaela)
 *
 * A porta fica na vista "Deste workspace" da galeria (faixa e estado vazio).
 * A pessoa escolhe o que entra, dá nome, área, complexidade, localidade,
 * descrição e imagens, e escolhe ONDE o caso fica:
 *
 *   Só neste workspace    aparece em "Deste workspace";
 *   Galeria do ENSPACE    aparece para todas as empresas. Antes de publicar,
 *                         o aviso de que fica público e uma confirmação
 *                         marcada à mão.
 *
 * A escolha é um USelect com "?", como os outros modais de configuração
 * (cartões grandes de opção já foram reprovados).
 *
 * O QUE ENTRA (rodada 4): "não é só com categorias e menus [...] é com todas
 * as entidades que o workspace tem (pode botar fluxo, pode botar menu, pode
 * botar muita coisa)". Um grupo por tipo de entidade, com a caixa do grupo
 * (marca e desmarca tudo, e fica parcial quando parte está marcada), a
 * contagem e a busca por nome em todos os tipos.
 */
const props = defineProps<{ t: Textos }>()
const aberta = defineModel<boolean>('open', { required: true })
const emit = defineEmits<{ criado: [caso: CasoDeUso] }>()

const idioma = useIdioma()
const localDoIdioma: Record<string, Localidade['id']> = { 'pt-BR': 'pt-br', 'en': 'en-us', 'es': 'global' }

const nome = ref('')
const area = ref<string>(AREAS[0])
const complexidade = ref<Complexidade>('iniciante')
const locais = ref<Localidade['id'][]>([])
const descricao = ref('')
const imagens = ref<File[]>([])
/** Os ids marcados, de todos os tipos. */
const marcados = ref<string[]>([])
const buscaNoWorkspace = ref('')
const abertos = ref<string[]>([])

interface Grupo { id: string, rotulo: string, icone: string, itens: { id: string, nome: string, icone: string, detalhe?: string }[] }

/** Um grupo por tipo de entidade que o workspace tem. */
const grupos = computed<Grupo[]>(() => [
  {
    id: 'categorias',
    rotulo: props.t.categoriasDoWorkspace,
    icone: 'i-lucide-database',
    itens: estruturaDoWorkspace.categorias.map(c => ({ id: c.id, nome: c.nome, icone: c.icone, detalhe: `${props.t.nCampos(c.campos.length)}, ${props.t.nStatus(c.status.length)}` })),
  },
  {
    id: 'menus',
    rotulo: props.t.menusETelas,
    icone: 'i-lucide-list-tree',
    itens: estruturaDoWorkspace.menus.map(m => ({ id: m.id, nome: m.rotulo, icone: m.icone, detalhe: props.t.nTelas(m.telas.length) })),
  },
  ...estruturaDoWorkspace.outros.map(o => ({
    id: o.tipo,
    rotulo: props.t.tipos[o.tipo].rotulo,
    icone: ICONE_DO_TIPO[o.tipo],
    itens: o.itens.map(i => ({ id: i.id, nome: i.nome, icone: ICONE_DO_TIPO[o.tipo] })),
  })),
])
const todosOsIds = computed(() => grupos.value.flatMap(g => g.itens.map(i => i.id)))

function normaliza(texto: string) {
  return texto.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

/** Com busca, só os grupos que têm o termo, já abertos. */
const gruposVisiveis = computed(() => {
  const termo = normaliza(buscaNoWorkspace.value.trim())
  if (!termo) return grupos.value
  return grupos.value
    .map(g => ({ ...g, itens: g.itens.filter(i => normaliza(i.nome).includes(termo)) }))
    .filter(g => g.itens.length)
})
const estaAberto = (id: string) => !!buscaNoWorkspace.value.trim() || abertos.value.includes(id)

function marcadosNo(g: Grupo) {
  return g.itens.filter(i => marcados.value.includes(i.id)).length
}
function estadoDoGrupo(g: Grupo): boolean | 'indeterminate' {
  const n = marcadosNo(g)
  return n === 0 ? false : n === g.itens.length ? true : 'indeterminate'
}
function alternarGrupo(g: Grupo) {
  const ids = g.itens.map(i => i.id)
  marcados.value = estadoDoGrupo(g) === true
    ? marcados.value.filter(x => !ids.includes(x))
    : [...new Set([...marcados.value, ...ids])]
}
const onde = ref<'workspace' | 'galeria'>('workspace')
const confirmado = ref(false)
const tentou = ref(false)
const salvando = ref(false)

watch(aberta, (v) => {
  if (!v) return
  nome.value = ''
  area.value = AREAS[0]
  complexidade.value = 'iniciante'
  locais.value = [localDoIdioma[idioma.value] ?? 'pt-br']
  descricao.value = ''
  imagens.value = []
  // Tudo o que o workspace tem já vem marcado: a pessoa tira o que não entra.
  marcados.value = [...todosOsIds.value]
  buscaNoWorkspace.value = ''
  abertos.value = ['categorias']
  onde.value = 'workspace'
  confirmado.value = false
  tentou.value = false
})
watch(onde, () => { confirmado.value = false })

function alternar(lista: string[], id: string) {
  return lista.includes(id) ? lista.filter(x => x !== id) : [...lista, id]
}

const erroNome = computed(() => tentou.value && !nome.value.trim() ? props.t.nomeObrigatorio : undefined)
const erroItens = computed(() => tentou.value && !marcados.value.length ? props.t.escolhaUmItem : undefined)
const erroConfirmacao = computed(() => tentou.value && onde.value === 'galeria' && !confirmado.value ? props.t.confirmoObrigatorio : undefined)

const opcoesDeOnde = computed(() => (['workspace', 'galeria'] as const).map(v => ({
  value: v,
  label: props.t.ondeOpcoes[v].label,
  description: props.t.ondeOpcoes[v].description,
  icon: v === 'galeria' ? 'i-lucide-globe' : 'i-lucide-building-2',
})))

async function criar() {
  tentou.value = true
  if (erroNome.value || erroItens.value || erroConfirmacao.value) return
  salvando.value = true
  await new Promise(r => setTimeout(r, 900))
  salvando.value = false
  const cats = estruturaDoWorkspace.categorias.filter(c => marcados.value.includes(c.id))
  const mns = estruturaDoWorkspace.menus.filter(m => marcados.value.includes(m.id))
  const extras: Partial<Record<TipoExtra, string[]>> = {}
  for (const o of estruturaDoWorkspace.outros) {
    const nomes = o.itens.filter(i => marcados.value.includes(i.id)).map(i => i.nome)
    if (nomes.length) extras[o.tipo] = nomes
  }
  emit('criado', {
    id: `cu-${Date.now().toString(36)}`,
    nome: nome.value.trim(),
    icone: mns[0]?.icone ?? cats[0]?.icone ?? 'i-lucide-package',
    area: area.value,
    complexidade: complexidade.value,
    descricao: descricao.value.trim(),
    localidades: locais.value.length ? locais.value : ['global'],
    criadoEm: new Date().toISOString().slice(0, 10),
    usos: 0,
    menus: mns.map(({ id: _, ...m }) => m),
    categorias: cats.map(c => ({ nome: c.nome, icone: c.icone, campos: c.campos })),
    status: [...new Set(cats.flatMap(c => c.status))],
    origem: 'workspace',
    publicado: onde.value === 'galeria',
    autor: workspaceAtual.nome,
    imagens: imagens.value.map(f => ({ nome: f.name, url: URL.createObjectURL(f) })),
    extras,
  })
  aberta.value = false
}
</script>

<template>
  <UModal
    v-model:open="aberta"
    :title="props.t.criarCaso"
    :description="props.t.criarCasoDescricao"
    :dismissible="!salvando"
    :ui="{ content: 'sm:max-w-2xl' }"
  >
    <template #body>
      <form id="form-criar-caso" class="space-y-5" novalidate @submit.prevent="criar">
        <UFormField :label="props.t.nomeDoCaso" required :error="erroNome">
          <UInput v-model="nome" class="w-full" autofocus />
        </UFormField>

        <div class="grid gap-3 sm:grid-cols-3">
          <UFormField :label="props.t.areaDoCaso">
            <USelect v-model="area" :items="[...AREAS]" class="w-full" />
          </UFormField>
          <UFormField :label="props.t.complexidade">
            <USelect
              v-model="complexidade"
              :items="(['iniciante', 'intermediario', 'avancado'] as const).map(c => ({ label: props.t.complexidades[c], value: c }))"
              class="w-full"
            />
          </UFormField>
          <UFormField :label="props.t.localidade">
            <USelectMenu
              v-model="locais"
              :items="localidades.map(l => ({ label: props.t.localidades[l], value: l }))"
              value-key="value"
              multiple
              :search-input="false"
              class="w-full"
            />
          </UFormField>
        </div>

        <UFormField :label="props.t.descricaoCampo">
          <UTextarea v-model="descricao" :rows="2" autoresize class="w-full" />
        </UFormField>

        <UFormField :label="props.t.imagensDoCaso" :help="props.t.imagensDica">
          <UFileUpload
            v-model="imagens"
            multiple
            accept="image/*"
            icon="i-lucide-image"
            :label="props.t.imagensArraste"
            :description="props.t.imagensFormatos"
            layout="grid"
            class="w-full"
            :ui="{ base: 'min-h-24' }"
          />
        </UFormField>

        <!-- O que entra: cada tipo de entidade do workspace, tudo marcado de início. -->
        <UFormField :label="props.t.oQueEntraCampo" :help="props.t.oQueEntraDica" required :error="erroItens">
          <div class="overflow-hidden rounded-lg border border-default">
            <div class="flex items-center gap-2 border-b border-default bg-elevated/40 px-3 py-2">
              <UInput v-model="buscaNoWorkspace" icon="i-lucide-search" size="sm" :placeholder="props.t.buscarNoWorkspace" :aria-label="props.t.buscarNoWorkspace" class="min-w-0 flex-1" />
              <span class="shrink-0 text-xs text-muted" aria-live="polite">{{ props.t.selecionados(marcados.length, todosOsIds.length) }}</span>
            </div>
            <div class="max-h-80 divide-y divide-default overflow-y-auto">
              <div v-for="g in gruposVisiveis" :key="g.id">
                <div class="flex items-center gap-2.5 px-3 py-2">
                  <UCheckbox :model-value="estadoDoGrupo(g)" :aria-label="props.t.marcarGrupo(g.rotulo)" @update:model-value="alternarGrupo(g)" />
                  <button
                    type="button"
                    class="flex min-w-0 flex-1 items-center gap-2 rounded text-left focus-visible:outline-2 focus-visible:outline-primary"
                    :aria-expanded="estaAberto(g.id)"
                    @click="abertos = abertos.includes(g.id) ? abertos.filter(x => x !== g.id) : [...abertos, g.id]"
                  >
                    <UIcon :name="g.icone" class="size-4 shrink-0 text-toned" />
                    <span class="truncate text-sm font-medium text-highlighted">{{ g.rotulo }}</span>
                    <span class="shrink-0 text-xs text-muted">{{ marcadosNo(g) }}/{{ g.itens.length }}</span>
                    <UIcon name="i-lucide-chevron-right" class="ml-auto size-4 shrink-0 text-toned transition-transform duration-200" :class="estaAberto(g.id) ? 'rotate-90' : ''" />
                  </button>
                </div>
                <div v-if="estaAberto(g.id)" class="grid animate-[entrada_0.15s_ease-out_both] gap-2 pb-3 pl-9 pr-3 sm:grid-cols-2">
                  <UCheckbox
                    v-for="i in g.itens"
                    :key="i.id"
                    :model-value="marcados.includes(i.id)"
                    :description="i.detalhe"
                    @update:model-value="marcados = alternar(marcados, i.id)"
                  >
                    <template #label>
                      <span class="inline-flex items-center gap-2"><UIcon :name="i.icone" class="size-4 shrink-0 text-toned" />{{ i.nome }}</span>
                    </template>
                  </UCheckbox>
                </div>
              </div>
              <p v-if="!gruposVisiveis.length" class="px-3 py-6 text-center text-sm text-muted">{{ props.t.nadaNaBusca }}</p>
            </div>
          </div>
        </UFormField>

        <!-- Onde fica: a opção 2 do pedido. -->
        <UFormField required>
          <template #label>
            <span class="inline-flex items-center gap-1">
              {{ props.t.ondeFica }}
              <UTooltip :text="props.t.ondeFicaDica" :ui="{ content: 'max-w-72 h-auto whitespace-normal py-1.5' }">
                <UIcon name="i-lucide-circle-help" class="size-3.5 text-muted" tabindex="0" :aria-label="props.t.ondeFicaDica" />
              </UTooltip>
            </span>
          </template>
          <USelect v-model="onde" :items="opcoesDeOnde" class="w-full" :ui="{ content: 'min-w-80' }" />
        </UFormField>

        <div v-if="onde === 'galeria'" class="animate-[entrada_0.2s_ease-out_both] space-y-3">
          <UAlert color="warning" variant="subtle" icon="i-lucide-globe" :title="props.t.avisoPublicoTitulo" :description="props.t.avisoPublicoTexto" />
          <UFormField :error="erroConfirmacao">
            <UCheckbox v-model="confirmado" :label="props.t.confirmoPublico" />
          </UFormField>
        </div>
      </form>
    </template>

    <template #footer>
      <div class="flex w-full justify-end gap-2">
        <UButton :label="props.t.cancelar" color="neutral" variant="outline" :disabled="salvando" @click="aberta = false" />
        <UButton
          type="submit"
          form="form-criar-caso"
          :label="onde === 'galeria' ? props.t.publicarNaGaleria : props.t.salvarNoWorkspace"
          :icon="onde === 'galeria' ? 'i-lucide-globe' : 'i-lucide-package-plus'"
          color="primary"
          :loading="salvando"
        />
      </div>
    </template>
  </UModal>
</template>
