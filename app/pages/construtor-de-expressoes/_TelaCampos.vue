<script setup lang="ts">
/**
 * Configurações › Dados › Categorias › Orçamentos › Campos, com a gaveta "Campo"
 * aberta no Valor Virtual.
 *
 * CÓPIA do develop (15/10/2026, prints develop-01 a develop-03): o cabeçalho com
 * voltar, o cartão "Campos" com Criar, a tabela e a gaveta com as 5 abas, os 4
 * campos básicos, "Configurações Específicas" e Salvar.
 *
 * PROPOSTA, e só ela: o miolo de "Editor de Expressão" (`_Construtor.vue`) e a
 * seção abaixo do Salvar, que no develop é "Pré-visualização do campo" e aqui é
 * o formulário de teste (`_FormularioDeTeste.vue`).
 */
import type { EnTableColumn } from '@be-enlighten/enspace-sdk-ui/base'
import type { Textos } from './textos'
import { CAMPOS, CAMPO_VIRTUAL, categoria, camposDaArvore } from './mocks'
import { useConstrutorDeExpressoes } from './estado'
import Construtor from './_Construtor.vue'
import FormularioDeTeste from './_FormularioDeTeste.vue'

const props = defineProps<{ t: Textos }>()

const { modo, gaveta, rascunho, formato, valores, salvar } = useConstrutorDeExpressoes()
const idioma = useIdioma()
const toast = useToast()

const ICONE_DO_TIPO: Record<string, string> = {
  inputText: 'i-lucide-type',
  EnlDropdown: 'i-lucide-list',
  EnlNumber: 'i-lucide-hash',
  inputSwitch: 'i-lucide-toggle-left',
  EnlCalendar: 'i-lucide-calendar',
  EnRepeater: 'i-lucide-rows-3',
  virtual: 'i-lucide-code-xml',
}

interface Linha extends Record<string, unknown> {
  id: string
  nome: string
  referencia: string
  rotulo: string
  criado: string
  tipo: string
  icone: string
  ordem: number
  virtual: boolean
}

const linhas = computed<Linha[]>(() => [
  ...CAMPOS.map((c, i) => ({ id: c.refId, nome: c.name, referencia: c.refId, rotulo: c.name, criado: '10/15/26', tipo: c.tipoNaTela, icone: ICONE_DO_TIPO[c.type] ?? 'i-lucide-square', ordem: i, virtual: false })),
  { id: CAMPO_VIRTUAL.refId, nome: CAMPO_VIRTUAL.name, referencia: CAMPO_VIRTUAL.refId, rotulo: CAMPO_VIRTUAL.name, criado: '10/15/26', tipo: CAMPO_VIRTUAL.tipoNaTela, icone: ICONE_DO_TIPO.virtual!, ordem: CAMPOS.length, virtual: true },
])

const colunas = computed<EnTableColumn[]>(() => [
  { key: 'nome', label: props.t.telaCampos.colunas.nome },
  { key: 'referencia', label: props.t.telaCampos.colunas.referencia },
  { key: 'rotulo', label: props.t.telaCampos.colunas.rotulo },
  { key: 'criado', label: props.t.telaCampos.colunas.criado },
  { key: 'tipo', label: props.t.telaCampos.colunas.tipo },
  { key: 'ordem', label: props.t.telaCampos.colunas.ordem },
])

function abrir(l: Linha) {
  if (l.virtual) gaveta.value = true
  else toast.add({ title: props.t.casca.foraDoPrototipo, icon: 'i-lucide-info', color: 'neutral' })
}

/* ---------- gaveta ---------- */

const aba = ref('0')
const construtor = ref<InstanceType<typeof Construtor> | null>(null)
const completa = computed(() => construtor.value?.completa ?? true)
const salvando = ref(false)

async function aoSalvar() {
  if (!completa.value) return
  salvando.value = true
  await new Promise(r => setTimeout(r, 450))
  salvar()
  salvando.value = false
  toast.add({ title: props.t.gaveta.salvo, description: props.t.gaveta.salvoDescricao, icon: 'i-lucide-check', color: 'success' })
}
</script>

<template>
  <div class="px-6 py-5">
    <!-- Cabeçalho (cópia) -->
    <div class="mb-5 flex items-center gap-3">
      <UButton icon="i-lucide-arrow-left" color="primary" variant="ghost" :aria-label="t.casca.voltar" />
      <h1 class="text-2xl font-bold text-highlighted">{{ categoria.name }}</h1>
    </div>

    <!-- Cartão "Campos" (cópia) -->
    <div class="mb-4 flex flex-col gap-3 rounded-xl border border-default bg-default p-3">
      <div class="flex items-center gap-2">
        <span class="flex size-8 items-center justify-center rounded-md bg-primary/80 text-white">
          <UIcon name="i-lucide-panels-top-left" class="size-4" />
        </span>
        <span class="text-sm font-semibold text-highlighted">{{ t.casca.campos }}</span>
        <UButton :label="t.telaCampos.criar" trailing-icon="i-lucide-plus" size="xs" color="success" variant="soft" />
        <span class="ml-auto flex gap-1">
          <UButton icon="i-lucide-file-down" color="neutral" variant="ghost" size="xs" aria-label="Importar" />
          <UButton icon="i-lucide-settings-2" color="neutral" variant="ghost" size="xs" aria-label="Configurar" />
        </span>
      </div>
      <div class="flex items-center gap-1 border-t border-default pt-2">
        <UButton icon="i-lucide-search" color="neutral" variant="soft" size="xs" aria-label="Buscar" />
        <UButton icon="i-lucide-filter" color="neutral" variant="soft" size="xs" aria-label="Filtrar" />
        <span class="ml-auto flex gap-1">
          <UButton icon="i-lucide-refresh-cw" color="neutral" variant="soft" size="xs" aria-label="Recarregar" />
          <UButton label="ID" trailing-icon="i-lucide-arrow-down" color="neutral" variant="soft" size="xs" />
        </span>
      </div>
    </div>

    <EnTable :columns="colunas" :rows="linhas" :locale="idioma">
      <template #cell-nome="{ row }">
        <button type="button" class="text-left text-sm text-highlighted hover:text-primary hover:underline" @click="abrir(row as Linha)">
          {{ (row as Linha).nome }}
        </button>
      </template>
      <template #cell-tipo="{ row }">
        <UBadge :label="(row as Linha).tipo" :icon="(row as Linha).icone" :color="(row as Linha).virtual ? 'primary' : 'error'" variant="subtle" size="sm" />
      </template>
      <template #actions="{ row }">
        <UButton icon="i-lucide-chevron-down" color="neutral" variant="soft" size="xs" :aria-label="t.telaCampos.abrir" @click="abrir(row as Linha)" />
      </template>
    </EnTable>

    <!-- A gaveta "Campo" -->
    <USlideover
      v-model:open="gaveta"
      :title="t.gaveta.titulo"
      side="right"
      :modal="false"
      :dismissible="false"
      :ui="{ content: 'w-full sm:max-w-none sm:w-[max(48vw,46rem)]', body: 'p-0 sm:p-0 pb-20' }"
    >
      <template #body>
        <div class="flex flex-col">
          <!-- Abas (cópia) -->
          <UTabs
            v-model="aba"
            :items="t.gaveta.abas.map((label, i) => ({ label, value: String(i) }))"
            :content="false"
            variant="link"
            size="sm"
            class="sticky top-0 z-10 border-b border-default bg-default px-4"
          />

          <div v-if="aba !== '0'" class="p-6 text-sm text-muted">{{ t.gaveta.abaForaDoPrototipo }}</div>

          <div v-else class="flex flex-col gap-5 p-4">
            <!-- Os 4 campos básicos (cópia) -->
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <UFormField :label="t.gaveta.nomeDoCampo" :help="t.gaveta.nomeAjuda" size="sm">
                <UInput :model-value="CAMPO_VIRTUAL.name" class="w-full" />
              </UFormField>
              <UFormField :label="t.gaveta.referencia" size="sm">
                <UInput :model-value="CAMPO_VIRTUAL.refId" class="w-full" disabled />
                <template #help>
                  <span class="flex items-center gap-1 text-warning"><UIcon name="i-lucide-triangle-alert" class="size-3.5" />{{ t.gaveta.referenciaAjuda }}</span>
                </template>
              </UFormField>
              <UFormField :label="t.gaveta.rotulo" :help="t.gaveta.rotuloAjuda" size="sm">
                <UInput :model-value="CAMPO_VIRTUAL.name" class="w-full" />
              </UFormField>
              <UFormField :label="t.gaveta.tipo" size="sm">
                <USelect :model-value="CAMPO_VIRTUAL.tipoNaTela" :items="[CAMPO_VIRTUAL.tipoNaTela]" icon="i-lucide-code-xml" class="w-full" disabled />
              </UFormField>
            </div>

            <!-- Configurações Específicas › Editor de Expressão -->
            <section class="flex flex-col gap-3">
              <h3 class="text-sm font-semibold text-highlighted">{{ t.gaveta.configuracoesEspecificas }}</h3>
              <div class="rounded-xl border border-default p-4">
                <p class="mb-3 text-sm font-medium text-highlighted">{{ t.gaveta.editorDeExpressao }}</p>
                <Construtor
                  ref="construtor"
                  v-model="rascunho"
                  v-model:formato="formato"
                  :t="t"
                  :modo="modo"
                  :campos="camposDaArvore"
                />
              </div>
            </section>

            <!-- Salvar (cópia: verde, linha inteira) -->
            <UTooltip :text="t.gaveta.naoSalva" :disabled="completa">
              <UButton
                :label="t.gaveta.salvar"
                color="success"
                block
                :loading="salvando"
                :disabled="!completa"
                @click="aoSalvar"
              />
            </UTooltip>

            <!-- Testar no formulário: no lugar da "Pré-visualização do campo" -->
            <section class="flex flex-col gap-3 rounded-xl border border-default p-4">
              <div>
                <h3 class="text-base font-semibold text-highlighted">{{ t.gaveta.testar }}</h3>
                <p class="text-xs text-muted">{{ t.gaveta.testarDescricao }}</p>
              </div>
              <FormularioDeTeste
                v-model="valores"
                :t="t"
                :modo="modo"
                :expressao="rascunho"
                :formato="formato"
                :campos="CAMPOS"
                :completa="completa"
                com-andaime
              />
            </section>
          </div>
        </div>
      </template>
    </USlideover>
  </div>
</template>
