<script setup lang="ts">
/**
 * PROPOSTA: mover uma categoria para outro projeto ou de volta ao workspace.
 * Antes de confirmar, a lista do que muda, com números, e do que não muda (Achado 6:
 * SmartSuite, Linear e Jira mostram o efeito antes do movimento).
 * Linha sem efeito sai da lista (regra 17 de escrita).
 */
import type { Textos } from './textos'
import { useProjetos } from './estado'

const props = defineProps<{ t: Textos }>()
const prj = useProjetos()
const toast = useToast()

const aberto = computed({
  get: () => prj.janelas.mover.value !== null,
  set: (v) => { if (!v) prj.janelas.mover.value = null },
})
const categoria = computed(() => prj.categorias.value.find(c => c.id === prj.janelas.mover.value) ?? null)
const origem = computed(() => categoria.value ? prj.projetoDa(categoria.value) : null)

/** 0 é o workspace (sem projeto). */
const destino = ref<number>(0)
watch(categoria, (c) => {
  if (!c) return
  // Aberto pelas configurações de um projeto: o destino é esse projeto.
  const doConfig = prj.janelas.configurar.value?.id
  destino.value = c.projeto === null
    ? (doConfig ?? prj.ativos.value.find(p => prj.podeAdministrar(p))?.id ?? 0)
    : 0
})

const opcoes = computed(() => [
  ...(categoria.value?.projeto !== null ? [{ value: 0, label: props.t.nome.doWorkspace, icon: 'i-lucide-building' }] : []),
  ...prj.ativos.value
    .filter(p => p.id !== categoria.value?.projeto && prj.podeAdministrar(p))
    .map(p => ({ value: p.id, label: p.nome, icon: p.icone })),
])
const projetoDestino = computed(() => prj.projetos.value.find(p => p.id === destino.value) ?? null)

const ondeAntes = computed(() => origem.value ? props.t.mover.participantesDe(origem.value.nome) : props.t.mover.todosOsMembros)
const ondeDepois = computed(() => projetoDestino.value
  ? (projetoDestino.value.visibilidade === 'aberto' ? props.t.mover.todosOsMembros : props.t.mover.participantesDe(projetoDestino.value.nome))
  : props.t.mover.todosOsMembros)

/** Contas a pagar tem vínculo com Processos; Fornecedores é vinculado por Contas a pagar. */
const temVinculo = computed(() => [2, 4, 7].includes(categoria.value?.id ?? 0))
const restringe = computed(() => ondeDepois.value !== props.t.mover.todosOsMembros)

async function confirmar() {
  const c = categoria.value!
  prj.moverCategoria(c.id, destino.value || null)
  const nomeDestino = projetoDestino.value?.nome ?? props.t.nome.doWorkspace
  prj.janelas.mover.value = null
  toast.add({ title: props.t.mover.movida(c.name, nomeDestino), icon: 'i-lucide-folder-input', color: 'success' })
}
</script>

<template>
  <UModal v-model:open="aberto" :title="categoria ? t.mover.titulo(categoria.name) : ''" :description="t.config.categoriasTexto" :ui="{ content: 'max-w-lg' }">
    <template #body>
      <div v-if="categoria" class="space-y-4">
        <UFormField :label="t.mover.destino">
          <USelect v-model="destino" :items="opcoes" class="w-full" />
        </UFormField>

        <div class="rounded-md border border-default bg-elevated/40 p-3">
          <p class="text-xs font-semibold uppercase tracking-wide text-muted">{{ t.mover.oQueMuda }}</p>
          <ul class="mt-2 space-y-2 text-sm text-default">
            <li class="flex gap-2"><UIcon name="i-lucide-users-round" class="mt-0.5 size-4 shrink-0 text-muted" /><span>{{ t.mover.quemVeAntes(ondeAntes, prj.quantosVeem(origem)) }} {{ t.mover.quemVeDepois(ondeDepois, prj.quantosVeem(projetoDestino)) }}</span></li>
            <li v-if="restringe" class="flex gap-2"><UIcon name="i-lucide-panel-left" class="mt-0.5 size-4 shrink-0 text-muted" /><span>{{ t.mover.menu }}</span></li>
            <li v-if="restringe && temVinculo" class="flex gap-2"><UIcon name="i-lucide-link-2-off" class="mt-0.5 size-4 shrink-0 text-muted" /><span>{{ t.mover.vinculos }}</span></li>
          </ul>
        </div>

        <div class="rounded-md border border-default p-3">
          <p class="text-xs font-semibold uppercase tracking-wide text-muted">{{ t.mover.naoMuda }}</p>
          <p class="mt-2 text-sm text-default">{{ t.mover.naoMudaLista }}</p>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex w-full justify-end gap-2">
        <UButton :label="t.criar.cancelar" color="neutral" variant="ghost" @click="aberto = false" />
        <UButton :label="t.mover.confirmar" icon="i-lucide-folder-input" color="primary" :disabled="!opcoes.length" @click="confirmar" />
      </div>
    </template>
  </UModal>
</template>
