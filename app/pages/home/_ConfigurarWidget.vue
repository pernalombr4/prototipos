<script setup lang="ts">
/**
 * Configurar um widget, em modal. 3 desenhos, pelo tipo:
 * - Itens e Número de uma visualização: categoria, visualização salva e
 *   título. A lista de visualizações é a das abas da categoria (`TypeView`);
 * - Categorias: quais categorias aparecem. Sem escolha, todas as que a
 *   pessoa acessa;
 * - Atalhos: quais atalhos aparecem.
 *
 * Escolha em `USelect`, como no resto do ENSPACE (memória da redatora:
 * dropdown no lugar de cartões). Lista de marcar em `UCheckbox`.
 */
import type { SelectItem } from '@nuxt/ui'
import type { Atalho, Categoria } from './mocks'
import { atalhosDisponiveis, visualizacoes } from './mocks'
import type { ConfigDoWidget, TipoDeWidget } from './widgets'
import type { Textos } from './textos'

const props = defineProps<{
  t: Textos
  tipo?: TipoDeWidget
  config?: ConfigDoWidget
  categorias: Categoria[]
  atalhos: Atalho[]
}>()
const aberto = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ salvar: [config: ConfigDoWidget, atalhos?: Atalho[]] }>()

const categoria = ref('')
const vis = ref('')
const titulo = ref('')
const escolhidas = ref<string[]>([])
const marcados = ref<string[]>([])

watch(aberto, (a) => {
  if (!a) return
  const v = visualizacoes.find(x => x.id === props.config?.visualizacao)
  categoria.value = v?.categoria ?? props.categorias[0]?.slug ?? ''
  vis.value = v?.id ?? ''
  titulo.value = props.config?.titulo ?? ''
  escolhidas.value = [...(props.config?.categorias ?? [])]
  marcados.value = props.atalhos.map(a => a.id)
})

const opcoesDeCategoria = computed<SelectItem[]>(() => props.categorias.map(c => ({ label: c.name, value: c.slug, icon: c.icon })))
const opcoesDeVisualizacao = computed<SelectItem[]>(() => visualizacoes.filter(v => v.categoria === categoria.value).map(v => ({ label: v.nome, value: v.id })))

watch(categoria, (c) => {
  if (!visualizacoes.some(v => v.id === vis.value && v.categoria === c)) vis.value = visualizacoes.find(v => v.categoria === c)?.id ?? ''
})

const nomeDoTipo = computed(() => props.tipo ? props.t.widgets[props.tipo].titulo : '')
const ehVisualizacao = computed(() => props.tipo === 'visualizacao' || props.tipo === 'numero')
const placeholderDoTitulo = computed(() => visualizacoes.find(v => v.id === vis.value)?.nome ?? '')

function alternarCategoria(slug: string, marcar: boolean) {
  escolhidas.value = marcar ? [...escolhidas.value, slug] : escolhidas.value.filter(x => x !== slug)
}
function alternarAtalho(id: string, marcar: boolean) {
  marcados.value = marcar ? [...marcados.value, id] : marcados.value.filter(x => x !== id)
}

function salvar() {
  if (ehVisualizacao.value) emit('salvar', { ...props.config, visualizacao: vis.value, titulo: titulo.value.trim() || undefined })
  else if (props.tipo === 'categorias') emit('salvar', { ...props.config, categorias: escolhidas.value })
  else if (props.tipo === 'atalhos') emit('salvar', { ...props.config }, atalhosDisponiveis.filter(a => marcados.value.includes(a.id)))
  aberto.value = false
}
</script>

<template>
  <UModal v-model:open="aberto" :title="t.config.titulo(nomeDoTipo)" :ui="{ footer: 'justify-end' }">
    <template #body>
      <form id="form-config-widget" class="space-y-4" @submit.prevent="salvar">
        <template v-if="ehVisualizacao">
          <UFormField :label="t.config.categoria">
            <USelect v-model="categoria" :items="opcoesDeCategoria" class="w-full" />
          </UFormField>
          <UFormField :label="t.config.visualizacao">
            <USelect v-model="vis" :items="opcoesDeVisualizacao" class="w-full" />
          </UFormField>
          <UFormField :label="t.config.tituloDoWidget" :help="t.config.tituloAjuda">
            <UInput v-model="titulo" :placeholder="placeholderDoTitulo" class="w-full" />
          </UFormField>
        </template>

        <template v-else-if="tipo === 'categorias'">
          <p class="text-sm text-muted">
            {{ t.config.categoriasAjuda }}
          </p>
          <ul class="grid gap-1 sm:grid-cols-2">
            <li v-for="c in categorias.filter(x => x.acesso)" :key="c.slug">
              <UCheckbox
                :model-value="escolhidas.includes(c.slug)"
                :label="c.name"
                class="rounded-md px-2 py-1.5 hover:bg-elevated"
                @update:model-value="(v) => alternarCategoria(c.slug, v === true)"
              />
            </li>
          </ul>
          <!-- Sempre visível (desativado sem escolha): aparecer e sumir fazia o modal pular sob o clique. -->
          <UButton :disabled="!escolhidas.length" :label="t.config.todas" icon="i-lucide-rotate-ccw" color="neutral" variant="outline" size="xs" @click="escolhidas = []" />
        </template>

        <ul v-else-if="tipo === 'atalhos'" class="grid gap-1 sm:grid-cols-2">
          <li v-for="a in atalhosDisponiveis" :key="a.id">
            <UCheckbox
              :model-value="marcados.includes(a.id)"
              :label="a.nome"
              :description="`${t.atalhos.tipos[a.tipo]} · ${a.onde}`"
              class="rounded-md px-2 py-1.5 hover:bg-elevated"
              @update:model-value="(v) => alternarAtalho(a.id, v === true)"
            />
          </li>
        </ul>
      </form>
    </template>
    <template #footer>
      <UButton :label="t.config.cancelar" color="neutral" variant="outline" @click="aberto = false" />
      <UButton type="submit" form="form-config-widget" :label="t.config.salvar" icon="i-lucide-check" />
    </template>
  </UModal>
</template>
