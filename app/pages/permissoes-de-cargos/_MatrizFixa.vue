<script setup lang="ts">
/**
 * As permissões que não crescem com o workspace (seção Padrão e aba
 * Configurações), em matriz: uma linha por área, uma coluna por ação.
 *
 * Hoje são 82 caixas em árvore, uma embaixo da outra (15 em Padrão, 67 em
 * Configurações). Aqui viram 24 linhas, e a mesma ação fica sempre na mesma
 * coluna, o que deixa comparar áreas de relance.
 */
import type { TableColumn } from '@nuxt/ui'
import type { Textos } from './textos'
import { type Acao, type GrupoFixo, acoes } from './mocks'
import type { EstadoDoCargo } from './estado'

const props = defineProps<{
  t: Textos
  grupos: GrupoFixo[]
  estado: EstadoDoCargo
  salvo: EstadoDoCargo
  somenteLeitura: boolean
  /** Mostra o título de cada grupo. A seção Padrão tem um só e dispensa. */
  comTitulo?: boolean
}>()

type Valor = boolean | 'indeterminate'

function chavesDaLinha(linha: GrupoFixo['linhas'][number]) {
  return [...linha.acoes.map(a => `${linha.chave}:${a}`), ...(linha.outras ?? []).map(o => `${linha.chave}:${o}`)]
}

function chavesDoGrupo(g: GrupoFixo) {
  return g.linhas.flatMap(chavesDaLinha)
}

function chavesDaColuna(g: GrupoFixo, acao: Acao) {
  return g.linhas.filter(l => l.acoes.includes(acao)).map(l => `${l.chave}:${acao}`)
}

function estadoDe(chaves: string[]): Valor {
  const n = chaves.filter(c => props.estado.fixas.includes(c)).length
  if (!n)
    return false
  return n === chaves.length ? true : 'indeterminate'
}

function definir(chaves: string[], ligar: boolean) {
  const resto = props.estado.fixas.filter(c => !chaves.includes(c))
  props.estado.fixas = ligar ? [...resto, ...chaves] : resto
}

function alternar(chave: string, ligar: boolean) {
  definir([chave], ligar)
}

const marcada = (chave: string) => props.estado.fixas.includes(chave)
const mudou = (chave: string) => marcada(chave) !== props.salvo.fixas.includes(chave)

const colunas = computed<TableColumn<GrupoFixo['linhas'][number]>[]>(() => [
  { accessorKey: 'chave', header: props.t.colunaArea, meta: { class: { th: 'w-[34%]', td: 'w-[34%]' } } },
  ...acoes.map(a => ({ id: a, header: props.t.acoes[a], meta: { class: { th: 'text-center w-[11%]', td: 'text-center w-[11%]' } } })),
  { id: 'outras', header: props.t.colunaOutras },
])
</script>

<template>
  <div class="space-y-6">
    <section v-for="(g, gi) in grupos" :key="g.chave" class="animate-[entrada_.3s_ease-out_both]" :style="{ animationDelay: `${gi * 40}ms` }">
      <header v-if="comTitulo" class="mb-2 flex items-center gap-2">
        <UCheckbox
          :model-value="estadoDe(chavesDoGrupo(g))"
          :disabled="somenteLeitura"
          :aria-label="t.marcarGrupo(t.grupos[g.chave]!)"
          @update:model-value="v => definir(chavesDoGrupo(g), v === true)"
        />
        <h3 class="text-sm font-semibold text-highlighted">{{ t.grupos[g.chave] }}</h3>
        <UBadge
          :label="`${chavesDoGrupo(g).filter(marcada).length}/${chavesDoGrupo(g).length}`"
          :color="chavesDoGrupo(g).some(marcada) ? 'primary' : 'neutral'"
          variant="subtle"
          size="sm"
        />
      </header>

      <UTable
        :data="g.linhas"
        :columns="colunas"
        class="rounded-lg border border-default"
        :ui="{ base: 'w-full min-w-[44rem] table-fixed', th: 'py-2 text-xs', td: 'py-1.5' }"
      >
        <!-- Cabeçalho de ação: a caixa marca a coluna inteira do grupo. -->
        <template v-for="a in acoes" :key="a" #[`${a}-header`]>
          <span class="inline-flex flex-col items-center gap-1">
            <span>{{ t.acoes[a] }}</span>
            <UCheckbox
              v-if="chavesDaColuna(g, a).length"
              :model-value="estadoDe(chavesDaColuna(g, a))"
              :disabled="somenteLeitura"
              :aria-label="`${t.acoes[a]}: ${t.grupos[g.chave]}`"
              @update:model-value="v => definir(chavesDaColuna(g, a), v === true)"
            />
          </span>
        </template>

        <template #chave-cell="{ row }">
          <span class="flex items-center gap-2">
            <UCheckbox
              :model-value="estadoDe(chavesDaLinha(row.original))"
              :disabled="somenteLeitura"
              :aria-label="t.marcarLinha(t.linhas[row.original.chave]!)"
              @update:model-value="v => definir(chavesDaLinha(row.original), v === true)"
            />
            <UIcon :name="row.original.icone" class="size-4 shrink-0 text-muted" />
            <span class="text-sm text-default">{{ t.linhas[row.original.chave] }}</span>
          </span>
        </template>

        <template v-for="a in acoes" :key="a" #[`${a}-cell`]="{ row }">
          <span class="relative inline-flex">
            <UCheckbox
              v-if="row.original.acoes.includes(a)"
              :model-value="marcada(`${row.original.chave}:${a}`)"
              :disabled="somenteLeitura"
              :aria-label="`${t.acoes[a]}: ${t.linhas[row.original.chave]}`"
              @update:model-value="v => alternar(`${row.original.chave}:${a}`, v === true)"
            />
            <span v-else class="text-dimmed" aria-hidden="true">·</span>
            <span
              v-if="mudou(`${row.original.chave}:${a}`)"
              class="absolute -right-2 -top-1 size-1.5 rounded-full bg-warning"
              :title="t.alterada"
            />
          </span>
        </template>

        <template #outras-cell="{ row }">
          <span class="flex flex-wrap gap-3">
            <UCheckbox
              v-for="o in row.original.outras ?? []"
              :key="o"
              :model-value="marcada(`${row.original.chave}:${o}`)"
              :label="t.outras[o]"
              :disabled="somenteLeitura"
              size="sm"
              @update:model-value="v => alternar(`${row.original.chave}:${o}`, v === true)"
            />
          </span>
        </template>
      </UTable>
    </section>
  </div>
</template>
