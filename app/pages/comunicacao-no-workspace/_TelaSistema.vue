<script setup lang="ts">
/**
 * Configurações › Sistema › Informações Básicas. Cópia do develop: 4 cartões
 * empilhados, cada um com o seu Salvar (é assim hoje; a pesquisa de UX já
 * registrou o problema em S3-F7 e não é deste protótipo resolver).
 *
 * PROPOSTA, só no cartão Módulos, ao lado de Correção Monetária e Comparações
 * (pedido literal do documento: "do mesmo modo como foi feito em correções
 * monetárias, comparador"): a chave "Atalhos de comunicação". Ela liga o
 * atalho de e-mail em todas as telas. Onde aparece e por qual canal não se
 * configura: o canal é só e-mail e as telas são sempre as mesmas (pedido da
 * redatora na rodada 6). O contato de cada categoria se escolhe na categoria.
 */
import type { Textos } from './textos'
import { workspace } from './mocks'
import { type ConfigDeComunicacao, useComunicacao, useMarcaDeProposta } from './estado'

const props = defineProps<{ t: Textos }>()

const { config, fase, ir } = useComunicacao()
const marca = useMarcaDeProposta()
const toast = useToast()

/** O cartão guarda a edição até o Salvar dele, como os outros cartões da tela. */
const rascunho = ref<ConfigDeComunicacao>(structuredClone(toRaw(config.value)))
watch(config, v => (rascunho.value = structuredClone(toRaw(v))), { deep: true })

const modulos = reactive({ correcao: true, comparacoes: false, juridico: true })

const salvando = ref(false)
async function salvarModulos() {
  salvando.value = true
  await new Promise(r => setTimeout(r, 600))
  salvando.value = false
  config.value = structuredClone(toRaw(rascunho.value))
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

    <!-- Módulos -->
    <UCard class="mt-4">
      <template #header>
        <h2 class="font-semibold text-highlighted">
          {{ t.sistema.modulos }}
        </h2>
      </template>

      <div class="grid gap-x-10 gap-y-6 sm:grid-cols-2">
        <!-- Os 3 de hoje -->
        <USwitch v-model="modulos.correcao" :label="t.sistema.correcaoMonetaria" :ui="{ root: 'flex-col-reverse items-start gap-2', label: 'font-medium' }" />
        <USwitch v-model="modulos.comparacoes" :label="t.sistema.comparacoes" :ui="{ root: 'flex-col-reverse items-start gap-2', label: 'font-medium' }" />
        <USwitch v-model="modulos.juridico" :label="t.sistema.juridico" :ui="{ root: 'flex-col-reverse items-start gap-2', label: 'font-medium' }" />

        <!-- PROPOSTA -->
        <USwitch
          v-model="rascunho.atalhos"
          :label="t.sistema.atalhos"
          :description="t.sistema.atalhosDescricao"
          :class="marca"
          :ui="{ root: 'flex-col-reverse items-start gap-2', label: 'font-medium', wrapper: 'ms-0' }"
        />
      </div>

      <!-- PROPOSTA: o que a chave liga -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="-translate-y-1 opacity-0"
        leave-active-class="transition duration-150 ease-in"
        leave-to-class="opacity-0"
      >
        <section v-if="rascunho.atalhos" class="mt-6 rounded-lg border border-default bg-elevated/30 p-4" :class="marca">
          <h3 class="text-sm font-semibold text-highlighted">
            {{ t.sistema.oQueLiga }}
          </h3>
          <ul class="mt-2 grid gap-1.5 text-sm text-default sm:grid-cols-2">
            <li v-for="(l, i) in t.sistema.lugaresDoAtalho" :key="i" class="flex items-start gap-2">
              <UIcon name="i-lucide-circle-check" class="mt-0.5 size-4 shrink-0 text-success" />{{ l }}
            </li>
          </ul>
          <p class="mt-3 text-sm text-muted">
            {{ fase >= 2 ? t.sistema.contatoNaCategoria : t.sistema.contatoPelosCampos }}
          </p>
          <UButton
            v-if="fase >= 2"
            :label="t.sistema.irParaCategorias"
            trailing-icon="i-lucide-arrow-right"
            color="neutral"
            variant="link"
            class="mt-1 px-0"
            @click="ir('categoria', { vista: 'atalhos' })"
          />
        </section>
      </Transition>

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
