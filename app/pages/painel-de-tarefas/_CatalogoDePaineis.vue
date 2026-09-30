<script setup lang="ts">
/**
 * "Adicionar painel": o catálogo fechado dos painéis de tarefas.
 *
 * Referência: o "Manage cards" da página pessoal do ClickUp (My Tasks), onde
 * ocultar e trazer de volta acontecem no mesmo lugar: o cartão que está na
 * tela mostra "Adicionado", e clicar tira. Busca e grupos na lateral vêm do
 * "+ Card" do dashboard do ClickUp, aqui como títulos de seção.
 *
 * O catálogo não cria painel novo: o conteúdo de cada um é fixo.
 */
import type { IdDoPainel } from './paineis'
import { GRUPOS, PAINEIS } from './paineis'
import type { Textos } from './textos'

const props = defineProps<{
  t: Textos
  naTela: IdDoPainel[]
}>()

const aberto = defineModel<boolean>('open', { required: true })
const emit = defineEmits<{ alternar: [id: IdDoPainel] }>()

const busca = ref('')
watch(aberto, (a) => { if (a) busca.value = '' })

const grupos = computed(() => {
  const q = busca.value.trim().toLocaleLowerCase(props.t.locale)
  return GRUPOS.map(g => ({
    grupo: g,
    paineis: PAINEIS.filter(p => p.grupo === g).filter((p) => {
      if (!q) return true
      const { titulo, descricao } = props.t.paineis[p.id]
      return `${titulo} ${descricao}`.toLocaleLowerCase(props.t.locale).includes(q)
    }),
  })).filter(g => g.paineis.length)
})
</script>

<template>
  <UModal
    v-model:open="aberto"
    :title="t.grade.catalogo.titulo"
    :description="t.grade.catalogo.descricao"
    :ui="{ content: 'max-w-2xl', body: 'space-y-4' }"
  >
    <template #body>
      <UInput
        v-model="busca"
        icon="i-lucide-search"
        :placeholder="t.grade.catalogo.buscar"
        :aria-label="t.grade.catalogo.buscar"
        class="w-full"
        autofocus
      />

      <UEmpty v-if="!grupos.length" icon="i-lucide-search-x" :title="t.grade.catalogo.nenhum" variant="naked" size="sm" />

      <section v-for="g in grupos" :key="g.grupo" class="space-y-1">
        <h3 class="text-xs font-medium uppercase tracking-wide text-muted">
          {{ t.grade.catalogo.grupos[g.grupo] }}
        </h3>
        <ul class="divide-y divide-default rounded-lg border border-default">
          <li v-for="p in g.paineis" :key="p.id" class="flex items-center gap-3 px-3 py-2.5">
            <span class="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 ring ring-inset ring-primary/25">
              <UIcon :name="p.icone" class="size-4 text-primary" />
            </span>
            <span class="min-w-0 flex-1">
              <span class="block truncate text-sm font-medium text-highlighted">{{ t.paineis[p.id].titulo }}</span>
              <span class="block truncate text-xs text-muted">{{ t.paineis[p.id].descricao }}</span>
            </span>
            <UButton
              v-if="naTela.includes(p.id)"
              :label="t.grade.catalogo.adicionado"
              icon="i-lucide-check"
              color="primary"
              variant="soft"
              size="sm"
              :aria-label="t.grade.catalogo.ocultarPainel(t.paineis[p.id].titulo)"
              @click="emit('alternar', p.id)"
            />
            <UButton
              v-else
              :label="t.grade.catalogo.adicionar"
              icon="i-lucide-plus"
              color="neutral"
              variant="outline"
              size="sm"
              :aria-label="t.grade.catalogo.adicionarPainel(t.paineis[p.id].titulo)"
              @click="emit('alternar', p.id)"
            />
          </li>
        </ul>
      </section>
    </template>

    <template #footer>
      <span class="text-sm text-muted">{{ t.grade.catalogo.emTela(naTela.length, PAINEIS.length) }}</span>
    </template>
  </UModal>
</template>
