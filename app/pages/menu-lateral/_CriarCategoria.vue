<script setup lang="ts">
import { useTrilha } from './trilha'
import { categoriasNormais, type Categoria } from './mocks'
import type { TextosDaTela } from './textos'

/**
 * CRIAR CATEGORIA (rodada 16), pelo "+" do Início: ícone e nome, como a
 * janela de criar seção. A categoria nova entra na lista de Categorias e na
 * busca. O cadastro completo (campos, formulários) continua sendo em
 * Configurações > Estrutura > Categorias, e é maquete aqui.
 */
const props = defineProps<{ t: TextosDaTela }>()

const trilha = useTrilha()
const toast = useToast()

const aberta = computed({
  get: () => trilha.criandoCategoria.value,
  set: (v) => { trilha.criandoCategoria.value = v },
})

const nome = ref('')
const icone = ref('folder')
const escolhendoIcone = ref(false)

watch(aberta, (v) => {
  if (!v) return
  nome.value = ''
  icone.value = 'folder'
})

function criar() {
  const limpo = nome.value.trim()
  if (!limpo) return
  const base = categoriasNormais[0]!
  // Os campos da API vêm do primeiro mock; nome, slug e ícone são os digitados.
  const nova: Categoria = {
    ...base,
    id: Date.now(),
    name: limpo,
    slug: limpo.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, '-'),
    icon: `i-lucide-${icone.value}`,
    description: '',
    favorita: false,
    // Recém-criada é recém-aberta: sobe para o topo de "Mais usadas" e aparece
    // no recorte de cinco, senão quem criou não a veria no menu.
    aberturas: 9999,
  }
  trilha.categoriasCriadas.value = [...trilha.categoriasCriadas.value, nova]
  toast.add({ title: props.t.categoriaCriada(limpo), icon: nova.icon ?? 'i-lucide-folder', color: 'neutral' })
  trilha.criandoCategoria.value = false
}
</script>

<template>
  <UModal v-model:open="aberta" :title="props.t.criarCategoriaTitulo" :ui="{ content: 'max-w-md' }">
    <template #body>
      <form id="form-criar-categoria" class="flex items-center gap-2" @submit.prevent="criar">
        <UPopover v-model:open="escolhendoIcone" :content="{ side: 'bottom', align: 'start' }">
          <UButton :icon="`i-lucide-${icone}`" color="neutral" variant="outline" square :aria-label="props.t.escolherIcone" />
          <template #content>
            <div class="w-80 p-2">
              <UxSeletorDeIcones v-model="icone" :altura="220" @update:model-value="escolhendoIcone = false" />
            </div>
          </template>
        </UPopover>
        <UInput v-model="nome" class="flex-1" :placeholder="props.t.criarCategoriaPlaceholder" :aria-label="props.t.criarCategoriaTitulo" autofocus />
      </form>
    </template>
    <template #footer>
      <UButton type="submit" form="form-criar-categoria" block color="primary" :label="props.t.criarSecaoBotao" :disabled="!nome.trim()" />
    </template>
  </UModal>
</template>
