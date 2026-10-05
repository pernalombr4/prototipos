<script setup lang="ts">
/**
 * Configurações › Sistema › Informações Básicas. Cópia do develop: 4 cartões
 * empilhados, cada um com o seu Salvar (é assim hoje; a pesquisa de UX já
 * registrou o problema em S3-F7 e não é deste protótipo resolver).
 *
 * PROPOSTA, só no cartão Módulos, ao lado de Correção Monetária e Comparações
 * (pedido literal do documento: "do mesmo modo como foi feito em correções
 * monetárias, comparador"):
 *  - "Atalhos de comunicação", com canais, telas e texto inicial;
 *  - "E-mail do ENSPACE em todas as telas", com a caixa para e-mail sem item.
 */
import type { Textos } from './textos'
import { caixas, categorias, workspace } from './mocks'
import { CANAIS, type ConfigDeComunicacao, LUGARES, useComunicacao, useMarcaDeProposta } from './estado'

const props = defineProps<{ t: Textos }>()

const { config, cenario, ir } = useComunicacao()
const marca = useMarcaDeProposta()
const toast = useToast()

/** O cartão guarda a edição até o Salvar dele, como os outros cartões da tela. */
const rascunho = ref<ConfigDeComunicacao>(structuredClone(toRaw(config.value)))
watch(config, v => (rascunho.value = structuredClone(toRaw(v))), { deep: true })

const modulos = reactive({ correcao: true, comparacoes: false, juridico: true })

const canais = computed({
  get: () => CANAIS.filter(c => rascunho.value.canais[c]),
  set: (v: string[]) => { for (const c of CANAIS) rascunho.value.canais[c] = v.includes(c) },
})
const lugares = computed({
  get: () => LUGARES.filter(l => rascunho.value.lugares[l]),
  set: (v: string[]) => { for (const l of LUGARES) rascunho.value.lugares[l] = v.includes(l) },
})

const salvando = ref(false)
async function salvarModulos() {
  salvando.value = true
  await new Promise(r => setTimeout(r, 600))
  salvando.value = false
  config.value = structuredClone(toRaw(rascunho.value))
  toast.add({ title: props.t.sistema.modulosSalvos, icon: 'i-lucide-check', color: 'success' })
}

const semCaixa = computed(() => cenario.value === 'sem-caixa')
const comMailBox = categorias.filter(c => c.temMailBox).length
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
        <USwitch
          v-model="rascunho.emailDoEnspace"
          :label="t.sistema.emailDoEnspace"
          :description="t.sistema.emailDoEnspaceDescricao"
          :class="marca"
          :ui="{ root: 'flex-col-reverse items-start gap-2', label: 'font-medium', wrapper: 'ms-0' }"
        />
      </div>

      <!-- PROPOSTA: as opções dos atalhos -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="-translate-y-1 opacity-0"
        leave-active-class="transition duration-150 ease-in"
        leave-to-class="opacity-0"
      >
        <section v-if="rascunho.atalhos" class="mt-6 rounded-lg border border-default bg-elevated/30 p-4" :class="marca">
          <h3 class="text-sm font-semibold text-highlighted">
            {{ t.sistema.atalhos }}
          </h3>
          <div class="mt-3 grid gap-5 lg:grid-cols-2">
            <UFormField :label="t.sistema.canais" :help="t.sistema.canaisAjuda">
              <UCheckboxGroup
                v-model="canais"
                :items="CANAIS.map(c => ({ value: c, label: t.atalho.canal[c] }))"
                orientation="horizontal"
              />
            </UFormField>
            <UFormField :label="t.sistema.ondeAparecem">
              <UCheckboxGroup
                v-model="lugares"
                :items="LUGARES.map(l => ({ value: l, label: t.sistema.lugares[l] }))"
                :ui="{ fieldset: 'grid grid-cols-2 gap-2' }"
              />
            </UFormField>
            <USwitch v-model="rascunho.textoInicial" :label="t.sistema.textoInicial" :description="t.sistema.textoInicialAjuda" />
            <USwitch v-model="rascunho.copiaParaOItem" :label="t.sistema.copiaParaOItem" :description="t.sistema.copiaParaOItemAjuda" />
          </div>
          <UButton
            :label="t.sistema.irParaCategorias"
            trailing-icon="i-lucide-arrow-right"
            color="neutral"
            variant="link"
            class="mt-3 px-0"
            @click="ir('categoria', { vista: 'lista' })"
          />
        </section>
      </Transition>

      <!-- PROPOSTA: as opções do e-mail do ENSPACE -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="-translate-y-1 opacity-0"
        leave-active-class="transition duration-150 ease-in"
        leave-to-class="opacity-0"
      >
        <section v-if="rascunho.emailDoEnspace" class="mt-4 rounded-lg border border-default bg-elevated/30 p-4" :class="marca">
          <h3 class="text-sm font-semibold text-highlighted">
            {{ t.sistema.emailDoEnspace }}
          </h3>
          <div class="mt-3 grid gap-5 lg:grid-cols-2">
            <UFormField :label="t.sistema.caixaSemItem" :help="semCaixa ? undefined : t.sistema.caixaSemItemAjuda">
              <USelect
                v-if="!semCaixa"
                v-model="rascunho.caixaSemItem"
                :items="caixas.map(c => ({ value: c.id, label: `${c.nome} · ${c.email}` }))"
                class="w-full"
              />
              <UAlert
                v-else
                icon="i-lucide-inbox"
                color="warning"
                variant="subtle"
                :title="t.sistema.nenhumaCaixa"
                :description="t.sistema.nenhumaCaixaDica"
              />
            </UFormField>
            <div>
              <p class="text-sm font-medium text-highlighted">
                {{ t.sistema.preRequisito(comMailBox, categorias.length) }}
              </p>
              <ul class="mt-2 flex flex-col gap-1.5 text-sm">
                <li v-for="c in categorias" :key="c.slug" class="flex items-start gap-2">
                  <UIcon
                    :name="c.temMailBox ? 'i-lucide-circle-check' : 'i-lucide-triangle-alert'"
                    class="mt-0.5 size-4 shrink-0"
                    :class="c.temMailBox ? 'text-success' : 'text-warning'"
                  />
                  <span>
                    <span class="text-highlighted">{{ c.name }}</span>
                    <span v-if="!c.temMailBox" class="block text-xs text-muted">{{ t.sistema.semMailBox }}</span>
                  </span>
                </li>
              </ul>
            </div>
          </div>
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
