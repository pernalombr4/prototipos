<script setup lang="ts">
/**
 * "Ajustar": campos e formulários de uma categoria, numa camada lateral.
 *
 * Hoje o mesmo campo aparece 3 vezes na árvore (sob Criar, sob Ver e sob
 * Atualizar), longe um do outro. Aqui o campo é uma linha e as 3 ações são
 * colunas. E o padrão é "todos os campos": a lista só aparece para quem
 * escolhe esconder ou travar algum.
 */
import type { TableColumn } from '@nuxt/ui'
import type { Textos } from './textos'
import { type Acao, type AcaoDeCampo, type CategoriaMock, acoes, acoesDeCampo } from './mocks'
import { type EstadoDoCargo, acoesDaCategoria, acoesDoFormulario, temAcesso } from './estado'

const props = defineProps<{
  t: Textos
  categoria: CategoriaMock | null
  estado: EstadoDoCargo
  somenteLeitura: boolean
}>()

const aberto = defineModel<boolean>('open', { default: false })

const aba = ref<'campos' | 'formularios'>('campos')
const busca = ref('')

watch(() => props.categoria?.id, () => {
  aba.value = 'campos'
  busca.value = ''
})

const ec = computed(() => props.categoria ? props.estado.categorias[props.categoria.id] : undefined)
const acoesCat = computed(() => props.categoria ? acoesDaCategoria(props.estado, props.categoria.id) : null)
const comAcesso = computed(() => !!props.categoria && temAcesso(props.estado, props.categoria.id))

/* ------------------------------------------------------------------ *
 * Campos
 * ------------------------------------------------------------------ */

interface LinhaDeCampo {
  name: string
  label: string
  tipo: string
  sistema?: boolean
}

const SISTEMA = ['created_at', 'updated_at']

const linhasDeCampo = computed<LinhaDeCampo[]>(() => {
  if (!props.categoria)
    return []
  const termo = busca.value.trim().toLowerCase()
  const sistema: LinhaDeCampo[] = [
    { name: 'created_at', label: props.t.criadoEm, tipo: props.t.doSistema, sistema: true },
    { name: 'updated_at', label: props.t.atualizadoEm, tipo: props.t.doSistema, sistema: true },
  ]
  const campos = props.categoria.campos.map(f => ({ name: f.name, label: f.label ?? f.name, tipo: props.t.tipos[f.type] ?? f.type }))
  return [...sistema, ...campos].filter(l => !termo || l.label.toLowerCase().includes(termo))
})

const modo = computed({
  get: () => ec.value?.campos ? 'escolher' : 'todos',
  set: (v: string) => {
    if (!ec.value || !props.categoria)
      return
    if (v === 'todos') {
      ec.value.campos = null
      return
    }
    const todos = props.categoria.campos.map(f => f.name)
    ec.value.campos = { criar: [...todos], ver: [...SISTEMA, ...todos], atualizar: [...todos] }
  },
})

const itensDeModo = computed(() => [
  { value: 'todos', label: props.t.modoTodos, description: props.t.modoTodosDesc },
  { value: 'escolher', label: props.t.modoEscolher, description: props.t.modoEscolherDesc },
])

/** "Criado em" e "Atualizado em" só existem em Ver, como no develop. */
const cabeNaAcao = (l: LinhaDeCampo, a: AcaoDeCampo) => !l.sistema || a === 'ver'

function marcadoCampo(l: LinhaDeCampo, a: AcaoDeCampo) {
  return !!ec.value?.campos?.[a].includes(l.name)
}

function definirCampos(nomes: string[], a: AcaoDeCampo, valor: boolean) {
  const c = ec.value?.campos
  if (!c)
    return
  const resto = c[a].filter(n => !nomes.includes(n))
  c[a] = valor ? [...resto, ...nomes] : resto
}

type Valor = boolean | 'indeterminate'

function estadoDaColunaDeCampo(a: AcaoDeCampo): Valor {
  const alvo = linhasDeCampo.value.filter(l => cabeNaAcao(l, a))
  const n = alvo.filter(l => marcadoCampo(l, a)).length
  if (!n)
    return false
  return n === alvo.length ? true : 'indeterminate'
}

const colunasDeCampo = computed<TableColumn<LinhaDeCampo>[]>(() => [
  { accessorKey: 'label', header: props.t.colunaCampo },
  ...acoesDeCampo.map(a => ({ id: a, header: props.t.acoes[a], meta: { class: { th: 'text-center w-24', td: 'text-center w-24' } } })),
])

/* ------------------------------------------------------------------ *
 * Formulários
 * ------------------------------------------------------------------ */

function segue(idForm: number) {
  return !ec.value?.formularios[idForm]
}

function alternarSegue(idForm: number, seguir: boolean) {
  if (!ec.value || !props.categoria)
    return
  ec.value.formularios[idForm] = seguir ? null : { ...acoesDaCategoria(props.estado, props.categoria.id) }
}

function definirForm(idForm: number, a: Acao, valor: boolean) {
  const f = ec.value?.formularios[idForm]
  if (f)
    f[a] = valor
}

const colunasDeForm = computed<TableColumn<{ id: number, nome: string }>[]>(() => [
  { accessorKey: 'nome', header: props.t.colunaFormulario },
  { id: 'segue', header: props.t.colunaSegue, meta: { class: { th: 'w-36', td: 'w-36' } } },
  ...acoes.map(a => ({ id: a, header: props.t.acoes[a], meta: { class: { th: 'text-center w-20', td: 'text-center w-20' } } })),
])

const itensDeAba = computed(() => [
  { label: props.t.abaCampos, value: 'campos', icon: 'i-lucide-text-cursor-input', badge: props.categoria?.campos.length },
  { label: props.t.abaFormularios, value: 'formularios', icon: 'i-lucide-file-text', badge: props.categoria?.formularios.length },
])
</script>

<template>
  <USlideover
    v-model:open="aberto"
    :title="categoria?.name"
    :description="t.detalheDesc"
    :ui="{ content: 'sm:max-w-3xl', body: 'space-y-4' }"
  >
    <template #body>
      <template v-if="categoria && ec && acoesCat">
        <UTabs v-model="aba" :items="itensDeAba" :content="false" variant="link" />

        <UAlert
          v-if="!comAcesso"
          icon="i-lucide-lock"
          color="neutral"
          variant="subtle"
          :description="t.semAcesso"
        />

        <!-- CAMPOS -->
        <div v-else-if="aba === 'campos'" class="space-y-4 animate-[entrada_.25s_ease-out_both]">
          <URadioGroup
            v-model="modo"
            :items="itensDeModo"
            variant="card"
            orientation="horizontal"
            :disabled="somenteLeitura"
            :ui="{ fieldset: 'grid grid-cols-1 gap-2 sm:grid-cols-2', item: 'transition-colors' }"
          />

          <p v-if="modo === 'todos'" class="flex items-start gap-2 rounded-md bg-elevated px-3 py-2 text-sm text-muted">
            <UIcon name="i-lucide-check-check" class="mt-0.5 size-4 shrink-0 text-primary" />
            {{ t.todosResumo(categoria.campos.length) }}
          </p>

          <template v-else>
            <UInput v-model="busca" icon="i-lucide-search" :placeholder="t.buscarCampo" class="w-full sm:w-64" :aria-label="t.buscarCampo" />
            <UTable
              :data="linhasDeCampo"
              :columns="colunasDeCampo"
              sticky
              class="max-h-[52dvh] rounded-lg border border-default"
              :ui="{ base: 'w-full table-fixed', th: 'py-2 text-xs bg-default', td: 'py-1.5' }"
            >
              <template v-for="a in acoesDeCampo" :key="a" #[`${a}-header`]>
                <UTooltip :text="acoesCat[a] ? '' : t.acaoBloqueada(t.acoes[a])" :disabled="acoesCat[a]">
                  <span class="inline-flex flex-col items-center gap-1">
                    <span class="inline-flex items-center gap-1">
                      <UIcon v-if="!acoesCat[a]" name="i-lucide-lock" class="size-3 text-dimmed" />
                      {{ t.acoes[a] }}
                    </span>
                    <UCheckbox
                      :model-value="acoesCat[a] ? estadoDaColunaDeCampo(a) : false"
                      :disabled="somenteLeitura || !acoesCat[a]"
                      :aria-label="`${t.acoes[a]}: ${t.abaCampos}`"
                      @update:model-value="v => definirCampos(linhasDeCampo.filter(l => cabeNaAcao(l, a)).map(l => l.name), a, v === true)"
                    />
                  </span>
                </UTooltip>
              </template>

              <template #label-cell="{ row }">
                <span class="flex min-w-0 flex-col">
                  <span class="truncate text-sm text-default">{{ row.original.label }}</span>
                  <span class="truncate text-xs text-dimmed">{{ row.original.tipo }}</span>
                </span>
              </template>

              <template v-for="a in acoesDeCampo" :key="a" #[`${a}-cell`]="{ row }">
                <UCheckbox
                  v-if="cabeNaAcao(row.original, a)"
                  :model-value="acoesCat[a] && marcadoCampo(row.original, a)"
                  :disabled="somenteLeitura || !acoesCat[a]"
                  :aria-label="`${t.acoes[a]}: ${row.original.label}`"
                  class="inline-flex"
                  @update:model-value="v => definirCampos([row.original.name], a, v === true)"
                />
                <span v-else class="text-dimmed" aria-hidden="true">·</span>
              </template>

              <template #empty>
                <p class="py-6 text-center text-sm text-muted">{{ t.vazioCampo }}</p>
              </template>
            </UTable>
          </template>
        </div>

        <!-- FORMULÁRIOS -->
        <div v-else class="space-y-3 animate-[entrada_.25s_ease-out_both]">
          <p class="text-sm text-muted">{{ t.formsDesc }}</p>
          <UTable
            :data="categoria.formularios"
            :columns="colunasDeForm"
            class="rounded-lg border border-default"
            :ui="{ base: 'w-full min-w-[40rem] table-fixed', th: 'py-2 text-xs', td: 'py-2' }"
          >
            <template #nome-cell="{ row }">
              <span class="flex items-center gap-2">
                <span class="text-sm text-default">{{ row.original.nome }}</span>
                <UBadge v-if="!segue(row.original.id)" :label="t.regraPropria" color="info" variant="subtle" size="sm" />
              </span>
            </template>
            <template #segue-cell="{ row }">
              <USwitch
                :model-value="segue(row.original.id)"
                :disabled="somenteLeitura"
                size="sm"
                :aria-label="`${t.colunaSegue}: ${row.original.nome}`"
                @update:model-value="v => alternarSegue(row.original.id, v)"
              />
            </template>
            <template v-for="a in acoes" :key="a" #[`${a}-cell`]="{ row }">
              <UCheckbox
                :model-value="acoesDoFormulario(estado, categoria.id, row.original.id)[a]"
                :color="segue(row.original.id) ? 'neutral' : 'primary'"
                :disabled="somenteLeitura || segue(row.original.id)"
                :aria-label="`${t.acoes[a]}: ${row.original.nome}`"
                class="inline-flex"
                @update:model-value="v => definirForm(row.original.id, a, v === true)"
              />
            </template>
          </UTable>
        </div>
      </template>
    </template>

    <template #footer>
      <div class="flex w-full justify-end">
        <UButton :label="t.concluir" @click="aberto = false" />
      </div>
    </template>
  </USlideover>
</template>
