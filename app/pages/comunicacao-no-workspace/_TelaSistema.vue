<script setup lang="ts">
/**
 * Configurações › Sistema › Informações Básicas. Cópia do develop: 4 cartões
 * empilhados, cada um com o seu Salvar (é assim hoje; a pesquisa de UX já
 * registrou o problema em S3-F7 e não é deste protótipo resolver).
 *
 * Sem proposta desde a rodada 7: o e-mail não é módulo. Ele vem sempre ligado,
 * e o que se configura dele fica dentro da central E-mails (pedido da
 * redatora: "a configuração do módulo não deve ocorrer na tela de sistema").
 */
import type { Textos } from './textos'
import { workspace } from './mocks'

const props = defineProps<{ t: Textos }>()

const toast = useToast()

const modulos = reactive({ correcao: true, comparacoes: false, juridico: true })

const salvando = ref(false)
async function salvarModulos() {
  salvando.value = true
  await new Promise(r => setTimeout(r, 600))
  salvando.value = false
  toast.add({ title: props.t.sistema.modulosSalvos, icon: 'i-lucide-check', color: 'success' })
}

</script>

<template>
  <div class="mx-auto max-w-6xl px-6 py-6">
    <h1 class="text-3xl font-semibold text-highlighted">
      {{ t.sistema.titulo }}
    </h1>
    <p class="mt-1 text-sm text-toned">
      {{ workspace.name }}
    </p>

    <!-- Abas (cópia) -->
    <div class="mt-5 flex gap-6 border-b border-default text-sm">
      <span class="border-b-2 border-primary pb-2 font-medium text-primary">{{ t.sistema.abas.basicas }}</span>
      <span v-for="a in ['calendario', 'notificacoes', 'dicionarios', 'cobranca'] as const" :key="a" class="pb-2 text-toned">{{ t.sistema.abas[a] }}</span>
    </div>

    <!-- Informações Básicas (cópia, sem interação) -->
    <UCard class="mt-4">
      <template #header>
        <h2 class="font-semibold text-highlighted">
          {{ t.sistema.abas.basicas }}
        </h2>
      </template>
      <div class="grid gap-4 sm:grid-cols-2">
        <UFormField :label="t.sistema.nome">
          <UInput :model-value="workspace.name" class="w-full" />
        </UFormField>
        <UFormField :label="t.sistema.referencia">
          <UInput :model-value="workspace.reference" disabled class="w-full" />
        </UFormField>
      </div>
      <div class="mt-4 flex justify-end">
        <UButton :label="t.sistema.salvar" />
      </div>
    </UCard>

    <!-- Configurações Adicionais (cópia, recolhida) -->
    <UCard class="mt-4">
      <template #header>
        <h2 class="font-semibold text-highlighted">
          {{ t.sistema.adicionais }}
        </h2>
      </template>
      <div class="grid gap-3 text-sm text-highlighted">
        <USwitch v-for="(o, i) in t.sistema.opcoesAdicionais" :key="i" :label="o" :model-value="false" />
      </div>
      <div class="mt-4 flex justify-end">
        <UButton :label="t.sistema.salvar" />
      </div>
    </UCard>

    <!-- Módulos (cópia, sem proposta desde a rodada 7) -->
    <UCard class="mt-4">
      <template #header>
        <h2 class="font-semibold text-highlighted">
          {{ t.sistema.modulos }}
        </h2>
      </template>

      <div class="grid gap-x-10 gap-y-6 sm:grid-cols-2">
        <USwitch v-model="modulos.correcao" :label="t.sistema.correcaoMonetaria" :ui="{ root: 'flex-col-reverse items-start gap-2', label: 'font-medium' }" />
        <USwitch v-model="modulos.comparacoes" :label="t.sistema.comparacoes" :ui="{ root: 'flex-col-reverse items-start gap-2', label: 'font-medium' }" />
        <USwitch v-model="modulos.juridico" :label="t.sistema.juridico" :ui="{ root: 'flex-col-reverse items-start gap-2', label: 'font-medium' }" />
      </div>

      <div class="mt-6 flex justify-end">
        <UButton :label="t.sistema.salvar" :loading="salvando" @click="salvarModulos" />
      </div>
    </UCard>

    <!-- Zona de Perigo (cópia) -->
    <UCard class="mt-4">
      <template #header>
        <h2 class="flex items-center gap-2 font-semibold text-highlighted">
          <UIcon name="i-lucide-triangle-alert" class="size-5" />{{ t.sistema.zonaDePerigo }}
        </h2>
      </template>
      <UAlert color="error" variant="subtle" icon="i-lucide-trash-2" :title="t.sistema.excluirWorkspace" :description="t.sistema.excluirWorkspaceDica" />
    </UCard>
  </div>
</template>
