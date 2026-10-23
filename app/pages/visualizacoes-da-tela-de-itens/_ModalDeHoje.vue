<script setup lang="ts">
/**
 * CÓPIA, não é proposta: o modal "Nova Visualização" da branch do PR 2936
 * (tela nova de itens, workspace teste-ux, 23/10/2026), com os textos como
 * estão lá. Serve para comparar com a proposta no mesmo protótipo.
 *
 * Copiado: nome, descrição, ícone obrigatório, tipo; a lista de campos com o
 * tipo técnico ao lado ("inputText", "EnlCalendar"); colunas selecionadas
 * com alça; Filtros, Visibilidade e Ordenação recolhidos; o filtro automático
 * num segundo modal com "isOwner" e "inGroups" e o botão verde. Ao duplicar,
 * o nome ganha "(copy)" e a coluna Referência aparece como "reference".
 *
 * Maquete: o filtro por campo personalizado abre o submodal, mas não grava;
 * a alça das colunas não arrasta (na branch não testamos o arrasto).
 */
import type { Visualizacao } from './mocks'
import type { Textos } from './textos'
import { CAMPOS, FUNCOES, GRUPOS, TIPO_TECNICO, campoPorPath } from './mocks'

const props = defineProps<{
  t: Textos
  inicial: Visualizacao | null
  modo: 'nova' | 'duplicar' | 'configurar'
}>()
const aberto = defineModel<boolean>('open', { required: true })
const emit = defineEmits<{ salvar: [v: Partial<Visualizacao>] }>()

const nome = ref('')
const descricao = ref('')
const icone = ref<string | undefined>()
const tipo = ref<'table' | 'kanban'>('table')
const colunas = ref<string[]>([])
const rapidos = ref<string[]>([])
const ordenarPor = ref<string | undefined>()
const ordem = ref<'asc' | 'desc'>('desc')
const grupos = ref<number[]>([])
const funcoes = ref<number[]>([])

watch(aberto, (a) => {
  if (!a) return
  const v = props.inicial
  nome.value = v ? (props.modo === 'duplicar' ? `${v.name} (copy)` : v.name ?? '') : ''
  descricao.value = v?.description ?? ''
  icone.value = undefined
  tipo.value = v?.model_type ?? 'table'
  colunas.value = v ? (v.config.columns ?? []).map(c => c.path) : []
  rapidos.value = (v?.filters.quick_filters ?? []).map(q => q.filter)
  ordenarPor.value = v?.config.sorts?.[0]?.field
  ordem.value = v?.config.sorts?.[0]?.direction ?? 'desc'
  grupos.value = v?.module_groups ?? []
  funcoes.value = v?.roles ?? []
})

/** Na cópia de hoje, o duplicado mostra a chave da coluna Referência no lugar do rótulo. */
const rotuloDaColuna = (path: string) => props.modo === 'duplicar' && path === 'reference' ? 'reference' : campoPorPath(path)!.label

function alternar(path: string) {
  colunas.value = colunas.value.includes(path) ? colunas.value.filter(p => p !== path) : [...colunas.value, path]
}

const submodal = ref<'automatico' | 'campo' | null>(null)
const automatico = ref<string | undefined>()
const obrigatorio = ref(false)

function salvarAutomatico() {
  if (automatico.value && !rapidos.value.includes(automatico.value)) rapidos.value = [...rapidos.value, automatico.value]
  submodal.value = null
  automatico.value = undefined
}

const tentou = ref(false)
function salvar() {
  tentou.value = true
  if (!nome.value.trim()) return
  emit('salvar', {
    name: nome.value.trim(),
    description: descricao.value || null,
    model_type: tipo.value,
    config: {
      hide: false,
      columns: colunas.value.map(path => ({ path, label: campoPorPath(path)!.label })),
      sorts: ordenarPor.value ? [{ field: ordenarPor.value, direction: ordem.value }] : [],
      groupBy: tipo.value === 'kanban' ? 'status' : undefined,
    },
    filters: { quick_filters: rapidos.value.map(filter => ({ filter, required: true })) },
    module_groups: grupos.value.length ? grupos.value : null,
    roles: funcoes.value.length ? funcoes.value : null,
  })
  aberto.value = false
  tentou.value = false
}

const secoes = computed(() => [
  { label: props.t.hoje.filtros, icon: 'i-lucide-filter', slot: 'filtros' as const },
  { label: props.t.hoje.visibilidade, icon: 'i-lucide-eye', slot: 'visibilidade' as const },
  { label: props.t.hoje.ordenacao, icon: 'i-lucide-arrow-up-down', slot: 'ordenacao' as const },
])
</script>

<template>
  <UModal v-model:open="aberto" :ui="{ content: 'sm:max-w-xl', body: 'space-y-4' }">
    <template #title>
      <span class="flex items-center gap-2"><UIcon name="i-lucide-table" class="size-5 text-primary" />{{ t.hoje.tituloModal }}</span>
    </template>
    <template #body>
      <div class="space-y-4 rounded-lg border border-default p-4">
        <UFormField :label="t.hoje.nome" :description="t.hoje.nomeAjuda" required :error="tentou && !nome.trim() ? t.hoje.obrigatorio : undefined">
          <UInput v-model="nome" :placeholder="t.hoje.nomePlaceholder" class="w-full" />
        </UFormField>
        <UFormField :label="t.hoje.descricao">
          <UTextarea v-model="descricao" :placeholder="t.hoje.descricaoPlaceholder" class="w-full" />
        </UFormField>
        <div class="grid grid-cols-2 gap-4">
          <UFormField :label="t.hoje.icone" required>
            <USelect v-model="icone" :items="['i-lucide-table', 'i-lucide-list', 'i-lucide-star']" :placeholder="t.hoje.iconePlaceholder" icon="i-lucide-table" class="w-full" />
          </UFormField>
          <UFormField :label="t.hoje.tipo" required>
            <UFieldGroup class="w-full">
              <UButton :label="t.criar.tabela" icon="i-lucide-table" :variant="tipo === 'table' ? 'soft' : 'outline'" :color="tipo === 'table' ? 'primary' : 'neutral'" class="flex-1" @click="tipo = 'table'" />
              <UButton :label="t.criar.kanban" icon="i-lucide-layout-grid" :variant="tipo === 'kanban' ? 'soft' : 'outline'" :color="tipo === 'kanban' ? 'primary' : 'neutral'" class="flex-1" @click="tipo = 'kanban'" />
            </UFieldGroup>
          </UFormField>
        </div>
      </div>

      <div class="space-y-3 rounded-lg border border-default p-4">
        <p class="text-sm text-toned">{{ t.hoje.colunasAjuda }}</p>
        <div class="grid grid-cols-2 gap-3">
          <div class="rounded-md border border-default">
            <div class="flex items-center justify-between border-b border-default px-3 py-2 text-xs font-semibold uppercase text-muted">
              {{ t.hoje.disponiveis }}
              <button type="button" class="normal-case text-primary" @click="colunas = CAMPOS.map(c => c.path)">{{ t.hoje.selecionarTodos }}</button>
            </div>
            <ul class="max-h-48 overflow-y-auto p-1">
              <li v-for="c in CAMPOS" :key="c.path">
                <button type="button" class="flex w-full items-center gap-2 rounded px-2 py-1 text-left text-sm hover:bg-elevated" :class="colunas.includes(c.path) ? 'font-medium text-primary' : 'text-default'" @click="alternar(c.path)">
                  <UIcon :name="colunas.includes(c.path) ? 'i-lucide-circle-check' : 'i-lucide-circle-plus'" class="size-4 shrink-0" />
                  <span class="flex-1 truncate">{{ c.label }}</span>
                  <span class="text-xs text-muted">{{ TIPO_TECNICO[c.tipo] }}</span>
                </button>
              </li>
            </ul>
          </div>
          <div class="rounded-md border border-default">
            <div class="flex items-center justify-between border-b border-default px-3 py-2 text-xs font-semibold uppercase text-muted">
              {{ t.hoje.selecionadas(colunas.length) }}
              <button v-if="colunas.length" type="button" class="normal-case text-error" @click="colunas = []">{{ t.hoje.limparTodos }}</button>
            </div>
            <ul v-if="colunas.length" class="max-h-48 overflow-y-auto p-1">
              <li v-for="p in colunas" :key="p" class="flex items-center gap-2 px-2 py-1 text-sm">
                <UIcon name="i-lucide-equal" class="size-4 text-muted" />
                <span class="flex-1 truncate">{{ rotuloDaColuna(p) }}</span>
                <span class="text-xs text-muted">{{ TIPO_TECNICO[campoPorPath(p)!.tipo] }}</span>
              </li>
            </ul>
            <div v-else class="flex flex-col items-center gap-1 px-3 py-6 text-center">
              <UIcon name="i-lucide-columns-3" class="size-5 text-muted" />
              <p class="text-sm text-toned">{{ t.hoje.nenhumaColuna }}</p>
              <p class="text-xs text-muted">{{ t.hoje.cliqueParaAdicionar }}</p>
            </div>
          </div>
        </div>
      </div>

      <UAccordion :items="secoes" type="multiple" class="rounded-lg border border-default px-4">
        <template #filtros>
          <div class="space-y-3 pb-4">
            <p class="text-sm font-medium">{{ t.hoje.automaticos }}</p>
            <div class="flex flex-wrap items-center justify-center gap-2 rounded-md bg-elevated/50 py-5">
              <UBadge v-for="r in rapidos" :key="r" :label="r" color="neutral" variant="outline" />
              <UButton :label="t.hoje.adicionar" size="xs" variant="soft" @click="submodal = 'automatico'" />
            </div>
            <p class="text-sm font-medium">{{ t.hoje.porCampos }}</p>
            <div class="flex justify-center rounded-md bg-elevated/50 py-5">
              <UButton :label="t.hoje.adicionar" size="xs" variant="soft" @click="submodal = 'campo'" />
            </div>
          </div>
        </template>
        <template #visibilidade>
          <div class="space-y-3 pb-4">
            <p class="text-sm text-toned">{{ t.hoje.visibilidadeAjuda }}</p>
            <UFormField :label="t.hoje.grupos" :description="t.hoje.gruposAjuda">
              <USelectMenu v-model="grupos" multiple value-key="value" :items="GRUPOS.map(g => ({ label: g.nome, value: g.id }))" :placeholder="t.hoje.selecionarGrupos" class="w-full" />
            </UFormField>
            <UFormField :label="t.hoje.funcoes" :description="t.hoje.funcoesAjuda">
              <USelectMenu v-model="funcoes" multiple value-key="value" :items="FUNCOES.map(f => ({ label: f.nome, value: f.id }))" :placeholder="t.hoje.selecionarFuncoes" class="w-full" />
            </UFormField>
          </div>
        </template>
        <template #ordenacao>
          <div class="space-y-3 pb-4">
            <p class="text-sm text-toned">{{ t.hoje.ordenacaoAjuda }}</p>
            <UFormField :label="t.hoje.campo">
              <USelect v-model="ordenarPor" :items="CAMPOS.map(c => ({ label: c.label, value: c.path }))" placeholder="--" class="w-full" />
            </UFormField>
            <UFormField :label="t.hoje.ordem">
              <USelect v-model="ordem" :items="[{ label: t.painel.crescente, value: 'asc' }, { label: t.painel.decrescente, value: 'desc' }]" class="w-full" />
            </UFormField>
          </div>
        </template>
      </UAccordion>
    </template>
    <template #footer>
      <div class="flex w-full justify-end gap-2">
        <UButton :label="t.comum.cancelar" color="neutral" variant="link" @click="aberto = false" />
        <UButton :label="t.hoje.salvar" @click="salvar" />
      </div>
    </template>
  </UModal>

  <!-- Submodal do filtro: título vazio, aba "Definição", botão verde, como na branch -->
  <UModal :open="submodal !== null" :title="submodal === 'campo' ? t.hoje.adicionarFiltro : ' '" :ui="{ content: 'sm:max-w-lg' }" @update:open="(v: boolean) => { if (!v) submodal = null }">
    <template #body>
      <div class="space-y-4">
        <p class="border-b border-default pb-2 text-sm text-primary">{{ t.hoje.definicao }}</p>
        <template v-if="submodal === 'automatico'">
          <UFormField :label="t.hoje.filtro" required>
            <USelect v-model="automatico" :items="['isOwner', 'inGroups']" :placeholder="t.hoje.porFavor" class="w-full" />
          </UFormField>
          <UFormField :label="t.hoje.obrigatorioCampo"><USwitch v-model="obrigatorio" /></UFormField>
        </template>
        <template v-else>
          <UFormField :label="t.hoje.campo"><USelect :items="CAMPOS.map(c => c.label)" placeholder="--" class="w-full" /></UFormField>
          <UFormField :label="t.hoje.operacao"><USelect :items="['eq', 'neq', 'contains']" :placeholder="t.hoje.porFavor" class="w-full" /></UFormField>
          <UFormField :label="t.hoje.valor"><UInput class="w-full" /></UFormField>
        </template>
        <UButton :label="t.hoje.salvar" color="success" block @click="submodal === 'automatico' ? salvarAutomatico() : (submodal = null)" />
      </div>
    </template>
  </UModal>
</template>
