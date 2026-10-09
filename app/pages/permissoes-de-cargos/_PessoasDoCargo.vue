<script setup lang="ts">
/**
 * "14 pessoas com este cargo": o selo do topo abre esta janela com quem tem o
 * cargo. É quem sente na hora qualquer mudança salva (pedido da rodada 4).
 *
 * Dados do `Member` (`/ws/members` filtrado por `role`): nome, e-mail, tipo de
 * licença e situação, os mesmos que a aba Membros mostra.
 */
import type { Textos } from './textos'
import type { MembroDoCargo } from './mocks'

const props = defineProps<{
  t: Textos
  membros: MembroDoCargo[]
}>()

const toast = useToast()
const busca = ref('')

function normalizar(texto: string) {
  return texto.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

const filtrados = computed(() => {
  const termo = normalizar(busca.value.trim())
  return props.membros.filter(m => !termo || normalizar(`${m.meta.fname} ${m.meta.lname} ${m.email ?? ''}`).includes(termo))
})

const corDaSituacao = (s: MembroDoCargo['status']) =>
  ({ active: 'success', pending: 'warning', inactive: 'neutral', blocked: 'error' } as const)[s]

function abrirGestao() {
  toast.add({ title: props.t.abrirGestao, description: 'Maquete: no produto, abre a aba Membros filtrada por este cargo.', color: 'neutral', icon: 'i-lucide-external-link' })
}
</script>

<template>
  <UModal :title="t.pessoasTitulo(membros.length)" :description="t.pessoasDesc" :ui="{ content: 'sm:max-w-xl' }">
    <UButton
      :label="t.pessoasNoCargo(membros.length)"
      icon="i-lucide-users"
      trailing-icon="i-lucide-chevron-right"
      color="neutral"
      variant="subtle"
      size="sm"
      class="ml-1 transition-transform hover:-translate-y-0.5"
      :aria-label="t.verPessoas"
    />

    <template #body>
      <div class="space-y-3">
        <UInput v-model="busca" icon="i-lucide-search" :placeholder="t.buscarPessoa" class="w-full" :aria-label="t.buscarPessoa" autofocus />
        <ul class="max-h-[50dvh] divide-y divide-default overflow-y-auto rounded-lg border border-default">
          <li
            v-for="(m, i) in filtrados"
            :key="m.id"
            class="flex items-center gap-3 px-3 py-2.5 animate-[entrada_.25s_ease-out_both]"
            :style="{ animationDelay: `${Math.min(i, 10) * 25}ms` }"
          >
            <UAvatar :text="`${m.meta.fname[0]}${m.meta.lname[0]}`" size="sm" :alt="`${m.meta.fname} ${m.meta.lname}`" />
            <span class="min-w-0 flex-1">
              <span class="block truncate text-sm font-medium text-default">{{ m.meta.fname }} {{ m.meta.lname }}</span>
              <span class="block truncate text-xs text-muted">{{ m.email }}</span>
            </span>
            <UBadge :label="t.licencas[m.type]" color="neutral" variant="outline" size="sm" class="shrink-0" />
            <UBadge :label="t.situacoes[m.status]" :color="corDaSituacao(m.status)" variant="subtle" size="sm" class="shrink-0" />
          </li>
          <li v-if="!filtrados.length" class="px-3 py-6 text-center text-sm text-muted">{{ t.nenhumaPessoa }}</li>
        </ul>
      </div>
    </template>

    <template #footer>
      <div class="flex w-full justify-end">
        <UButton :label="t.abrirGestao" icon="i-lucide-external-link" color="neutral" variant="outline" @click="abrirGestao" />
      </div>
    </template>
  </UModal>
</template>
