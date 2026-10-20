<script setup lang="ts">
import { AREAS, estruturaDoWorkspace, localidades, workspaceAtual, type CasoDeUso, type Complexidade, type Localidade } from './mocks'
import type { Textos } from './textos'

/**
 * CRIAR CASO DE USO (rodada 3): "a opção de CRIAR um caso de uso a partir do
 * que ta no workspace naquele momento [...] com opção de salvar só no
 * workspace ou publicar na lojinha (opçao 2 é melhor)." (Mikaela)
 *
 * A porta fica na vista "Deste workspace" da galeria (faixa e estado vazio).
 * A pessoa escolhe o que entra (categorias com campos e status, menus com
 * telas), dá nome, área, complexidade, localidade, descrição e imagens, e
 * escolhe ONDE o caso fica:
 *
 *   Só neste workspace    aparece em "Deste workspace";
 *   Galeria do ENSPACE    aparece para todas as empresas. Antes de publicar,
 *                         o aviso de que fica público e uma confirmação
 *                         marcada à mão.
 *
 * A escolha é um USelect com "?", como os outros modais de configuração
 * (cartões grandes de opção já foram reprovados).
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
const categorias = ref<string[]>([])
const menus = ref<string[]>([])
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
  categorias.value = estruturaDoWorkspace.categorias.map(c => c.id)
  menus.value = estruturaDoWorkspace.menus.map(m => m.id)
  onde.value = 'workspace'
  confirmado.value = false
  tentou.value = false
})
watch(onde, () => { confirmado.value = false })

function alternar(lista: string[], id: string) {
  return lista.includes(id) ? lista.filter(x => x !== id) : [...lista, id]
}

const erroNome = computed(() => tentou.value && !nome.value.trim() ? props.t.nomeObrigatorio : undefined)
const erroItens = computed(() => tentou.value && !categorias.value.length && !menus.value.length ? props.t.escolhaUmItem : undefined)
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
  const cats = estruturaDoWorkspace.categorias.filter(c => categorias.value.includes(c.id))
  const mns = estruturaDoWorkspace.menus.filter(m => menus.value.includes(m.id))
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

        <!-- O que entra: tudo marcado de início. -->
        <UFormField :label="props.t.oQueEntraCampo" :help="props.t.oQueEntraDica" required :error="erroItens">
          <div class="grid gap-3 rounded-lg border border-default p-3 sm:grid-cols-2">
            <fieldset>
              <legend class="mb-2 text-xs font-semibold text-toned">{{ props.t.categoriasDoWorkspace }}</legend>
              <div class="space-y-2">
                <UCheckbox
                  v-for="c in estruturaDoWorkspace.categorias"
                  :key="c.id"
                  :model-value="categorias.includes(c.id)"
                  :description="`${props.t.nCampos(c.campos.length)}, ${props.t.nStatus(c.status.length)}`"
                  @update:model-value="categorias = alternar(categorias, c.id)"
                >
                  <template #label>
                    <span class="inline-flex items-center gap-2"><UIcon :name="c.icone" class="size-4 text-toned" />{{ c.nome }}</span>
                  </template>
                </UCheckbox>
              </div>
            </fieldset>
            <fieldset>
              <legend class="mb-2 text-xs font-semibold text-toned">{{ props.t.menusDoWorkspace }}</legend>
              <div class="space-y-2">
                <UCheckbox
                  v-for="m in estruturaDoWorkspace.menus"
                  :key="m.id"
                  :model-value="menus.includes(m.id)"
                  :description="props.t.nTelas(m.telas.length)"
                  @update:model-value="menus = alternar(menus, m.id)"
                >
                  <template #label>
                    <span class="inline-flex items-center gap-2"><UIcon :name="m.icone" class="size-4 text-toned" />{{ m.rotulo }}</span>
                  </template>
                </UCheckbox>
              </div>
            </fieldset>
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
