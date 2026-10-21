<script setup lang="ts">
/**
 * A visualização rápida do item, aberta pelo clique na linha (Lista de itens,
 * Painel, Documentos). Hoje as telas do menu legado não abrem o quick view
 * (BUG9F1D5B7E); no tipo novo, todas abrem a mesma gaveta.
 */
import { categoriaPorSlug, gruposDe, membroPorId, type ItemDoPrototipo } from './mocks'
import { dataCurta, moeda } from './formatar'
import type { Textos } from './textos'

const props = defineProps<{ t: Textos, item: ItemDoPrototipo | null }>()
const emit = defineEmits<{ fechar: [] }>()

const idioma = useIdioma()
const toast = useToast()

const aberta = computed({
  get: () => !!props.item,
  set: (v) => { if (!v) emit('fechar') },
})

const ultimo = ref<ItemDoPrototipo | null>(props.item)
watch(() => props.item, (i) => { if (i) ultimo.value = i })

const corDoStatus = { novo: 'info', em_andamento: 'primary', aguardando: 'warning', concluido: 'success', cancelado: 'neutral' } as const

const linhas = computed(() => {
  const i = ultimo.value
  if (!i) return []
  const criador = membroPorId(i.user)
  return [
    { rotulo: props.t.lista.colunas.categoria, valor: categoriaPorSlug(i.categoria).name },
    { rotulo: props.t.lista.colunas.responsavel, valor: membroPorId(i.responsavel)?.nome ?? props.t.comum.ninguem },
    { rotulo: props.t.lista.colunas.valor, valor: i.valor === null ? props.t.comum.semValor : moeda(i.valor, idioma.value) },
    { rotulo: props.t.lista.criadoPor, valor: criador?.nome ?? '' },
    { rotulo: props.t.lista.criadoEm, valor: dataCurta(i.created_at, idioma.value) },
    { rotulo: props.t.lista.grupos, valor: criador ? gruposDe(criador.id).map(g => g.nome).join(', ') : '' },
  ]
})
</script>

<template>
  <USlideover v-model:open="aberta" :title="ultimo?.titulo ?? ''" :description="ultimo?.reference">
    <template #body>
      <div v-if="ultimo" class="space-y-5">
        <UBadge :label="t.status[ultimo.situacao]" :color="corDoStatus[ultimo.situacao]" variant="subtle" />
        <dl class="grid grid-cols-[9rem_1fr] gap-x-4 gap-y-3 text-sm">
          <template v-for="l in linhas" :key="l.rotulo">
            <dt class="text-muted">{{ l.rotulo }}</dt>
            <dd class="text-highlighted">{{ l.valor || '-' }}</dd>
          </template>
        </dl>
      </div>
    </template>
    <template #footer>
      <div class="flex w-full justify-end gap-2">
        <UButton :label="t.comum.fechar" color="neutral" variant="ghost" @click="aberta = false" />
        <UButton :label="t.comum.abrirItem" icon="i-lucide-arrow-up-right" color="primary" variant="soft" @click="toast.add({ title: `${ultimo?.reference} · ${t.comum.abrirItem}`, description: 'Maquete: a tela dedicada do item não faz parte deste protótipo.', icon: 'i-lucide-info', color: 'neutral' })" />
      </div>
    </template>
  </USlideover>
</template>
