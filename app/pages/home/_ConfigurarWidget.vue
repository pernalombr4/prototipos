<script setup lang="ts">
/**
 * Configurar um widget, em modal. 2 desenhos, pelo tipo:
 * - Categorias: quais categorias aparecem e em que ordem (rodada 5), com o
 *   mesmo componente do 2º nível do catálogo. Sem escolha, todas as que a
 *   pessoa acessa, na ordem do workspace;
 * - Atalhos: quais atalhos aparecem.
 *
 * Rodada 6: sai o botão "Mostrar todas", que repetia o "Desmarcar todas" da
 * própria lista (sem marcada, o widget mostra todas).
 *
 * Os widgets de visualização salva saíram na rodada 5, a pedido da redatora
 * ("inúteis e pode tirar"), e com eles a escolha de categoria, visualização
 * e título.
 *
 * Lista de marcar em `UCheckbox` (MCP nuxt-ui).
 */
import OrdemDeCategorias from './_OrdemDeCategorias.vue'
import type { Atalho, Categoria } from './mocks'
import { atalhosDisponiveis } from './mocks'
import type { ConfigDoWidget, TipoDeWidget } from './widgets'
import type { Textos } from './textos'

const props = defineProps<{
  t: Textos
  tipo?: TipoDeWidget
  config?: ConfigDoWidget
  /** As categorias que a pessoa acessa, na ordem do workspace. */
  categorias: Categoria[]
  atalhos: Atalho[]
}>()
const aberto = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ salvar: [config: ConfigDoWidget, atalhos?: Atalho[]] }>()

const escolhidas = ref<string[]>([])
const marcados = ref<string[]>([])

watch(aberto, (a) => {
  if (!a) return
  escolhidas.value = [...(props.config?.categorias ?? [])]
  marcados.value = props.atalhos.map(a => a.id)
})

const nomeDoTipo = computed(() => props.tipo ? props.t.widgets[props.tipo].titulo : '')

function alternarAtalho(id: string, marcar: boolean) {
  marcados.value = marcar ? [...marcados.value, id] : marcados.value.filter(x => x !== id)
}

function salvar() {
  if (props.tipo === 'categorias') emit('salvar', { ...props.config, categorias: escolhidas.value })
  else if (props.tipo === 'atalhos') emit('salvar', { ...props.config }, atalhosDisponiveis.filter(a => marcados.value.includes(a.id)))
  aberto.value = false
}
</script>

<template>
  <UModal v-model:open="aberto" :title="t.config.titulo(nomeDoTipo)" :ui="{ footer: 'justify-end' }">
    <template #body>
      <form id="form-config-widget" class="space-y-4" @submit.prevent="salvar">
        <template v-if="tipo === 'categorias'">
          <p class="text-sm text-muted">
            {{ t.config.categoriasAjuda }}
          </p>
          <OrdemDeCategorias v-model="escolhidas" :t="t" :categorias="categorias" />
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
