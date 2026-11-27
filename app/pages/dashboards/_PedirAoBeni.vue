<script setup lang="ts">
/**
 * PROPOSTA (rodada 2): "Pedir ao BENI" no dashboard que acabou de nascer, sem painéis.
 *
 * Aqui o BENI não propõe nada sozinho: a pessoa escreve o que quer ver ("contratos por
 * unidade, soma do valor") e escolhe a categoria. Ele devolve até 3 painéis, com o
 * motivo, para adicionar ou não. Nome de campo citado no pedido vira o eixo.
 */
import type { ConfigDoPainel } from './agregacao'
import { campoDe } from './agregacao'
import type { Proposta } from './beni'
import { proporDoPedido } from './beni'
import { CATEGORIAS, categoriaPorSlug, itensDa } from './mocks'
import type { Textos } from './textos'
import AvatarDoBeni from './_AvatarDoBeni.vue'

const props = defineProps<{ t: Textos, categoriaInicial?: string }>()
const aberto = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ adicionar: [paineis: ConfigDoPainel[]] }>()

const categoria = ref(CATEGORIAS[0]!.slug)
const pedido = ref('')
const pensando = ref(false)
const propostas = ref<Proposta[]>([])
const tentou = ref(false)

watch(aberto, (a) => {
  if (!a) return
  categoria.value = props.categoriaInicial ?? CATEGORIAS[0]!.slug
  pedido.value = ''
  propostas.value = []
  pensando.value = false
  tentou.value = false
})

/* Mudou o pedido ou a categoria: as sugestões antigas saem e o botão volta a "Sugerir". */
watch([pedido, categoria], () => { propostas.value = [] })

const itensDaCategoria = computed(() => CATEGORIAS.map(c => ({ label: c.name, value: c.slug, icon: c.icon, description: props.t.painel.itens(itensDa(c.slug).length) })))

function sugerir() {
  tentou.value = true
  if (!pedido.value.trim()) return
  pensando.value = true
  propostas.value = []
  setTimeout(() => {
    propostas.value = proporDoPedido(pedido.value, categoria.value)
    pensando.value = false
  }, 900)
}

const ICONES: Record<string, string> = {
  numero: 'i-lucide-square-asterisk', barras: 'i-lucide-chart-column', barrasHorizontais: 'i-lucide-chart-bar',
  linha: 'i-lucide-chart-line', area: 'i-lucide-chart-area', rosca: 'i-lucide-chart-pie', funil: 'i-lucide-filter', tabela: 'i-lucide-table',
}
function tituloDa(p: Proposta) {
  const cfg = p.cfg
  return props.t.frase(cfg.funcao, categoriaPorSlug.get(cfg.categoria)!.name, campoDe(cfg.categoria, cfg.medida)?.name, cfg.visualizacao === 'numero' ? undefined : campoDe(cfg.categoria, cfg.agruparPor)?.name)
}
function motivoDa(p: Proposta) {
  const nome = p.motivo.campo ? campoDe(p.motivo.categoria, p.motivo.campo)?.name ?? '' : ''
  return props.t.beni.motivos[p.motivo.tipo](nome, categoriaPorSlug.get(p.motivo.categoria)!.name)
}
const aceitas = computed(() => propostas.value.filter(p => p.aceita))

function adicionar() {
  // Cartões primeiro, como no painel de tarefas.
  const ordem = [...aceitas.value].sort((a, b) => Number(b.cfg.visualizacao === 'numero') - Number(a.cfg.visualizacao === 'numero'))
  emit('adicionar', ordem.map(p => p.cfg))
  aberto.value = false
}
</script>

<template>
  <UModal
    v-model:open="aberto"
    :title="t.pedir.titulo"
    :description="t.pedir.descricao"
    :close="{ 'aria-label': t.beni.cancelar }"
    :ui="{ content: 'sm:max-w-xl' }"
  >
    <template #body>
      <form class="space-y-4" @submit.prevent="sugerir">
        <UFormField :label="t.construtor.categoria" required>
          <USelectMenu v-model="categoria" :items="itensDaCategoria" value-key="value" :icon="categoriaPorSlug.get(categoria)?.icon" class="w-full" />
        </UFormField>
        <UFormField :label="t.pedir.pedido" required :error="tentou && !pedido.trim() ? t.pedir.pedidoErro : undefined">
          <UTextarea v-model="pedido" :rows="2" autoresize autofocus :placeholder="t.pedir.placeholder" class="w-full" @keydown.enter.exact.prevent="sugerir" />
        </UFormField>
      </form>

      <div v-if="pensando" class="mt-4 flex items-center gap-3">
        <AvatarDoBeni tamanho="sm" estado="working" />
        <p class="text-sm text-muted">{{ t.pedir.pensando }}</p>
      </div>
      <div v-else-if="propostas.length" class="mt-4 space-y-2">
        <p class="text-xs font-medium text-muted">{{ t.pedir.sugestoes }}</p>
        <ul class="divide-y divide-default rounded-lg border border-default">
          <li v-for="(p, i) in propostas" :key="i">
            <label class="flex cursor-pointer items-start gap-3 px-3 py-2.5 transition-colors hover:bg-elevated/60">
              <UCheckbox v-model="p.aceita" class="mt-0.5" />
              <UIcon :name="ICONES[p.cfg.visualizacao]" class="mt-0.5 size-4 shrink-0 text-primary" />
              <span class="min-w-0 flex-1">
                <span class="block text-sm font-medium text-highlighted">{{ tituloDa(p) }}</span>
                <span class="block text-xs text-muted">{{ t.construtor.visualizacoes[p.cfg.visualizacao] }} · {{ motivoDa(p) }}</span>
              </span>
            </label>
          </li>
        </ul>
      </div>
    </template>

    <template #footer>
      <div class="flex w-full justify-end gap-2">
        <UButton :label="t.beni.cancelar" color="neutral" variant="ghost" @click="aberto = false" />
        <UButton
          v-if="!propostas.length"
          :label="t.pedir.sugerir"
          icon="i-lucide-sparkles"
          :loading="pensando"
          @click="sugerir"
        />
        <UButton v-else :label="t.pedir.adicionar(aceitas.length)" icon="i-lucide-plus" :disabled="!aceitas.length" @click="adicionar" />
      </div>
    </template>
  </UModal>
</template>
