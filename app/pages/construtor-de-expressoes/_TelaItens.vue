<script setup lang="ts">
/**
 * Categorias › Orçamentos: a lista de itens e o modal "Novo registro".
 *
 * CÓPIA do develop (15/10/2026, prints develop-04 e develop-05): barra com
 * Itens e Visualizar, busca, "Criado em", "Todo o período", ícones e
 * "Novo registro"; a tabela; o modal com os campos e Cancelar/Criar.
 *
 * O que muda é só o que a expressão salva calcula: a coluna "Total do
 * orçamento" e o campo no modal usam a expressão salva na gaveta, com o motor
 * escolhido no andaime. Assim dá para ver a mesma expressão em 8 itens reais
 * de uma vez, inclusive o item vazio e o de casos difíceis.
 */
import type { EnTableColumn } from '@be-enlighten/enspace-sdk-ui/base'
import type { Textos } from './textos'
import { CAMPOS, CAMPO_VIRTUAL, CENARIOS, HOJE, ITENS, type Valores } from './mocks'
import { useConstrutorDeExpressoes } from './estado'
import { calcularHoje, formatar } from './motor-hoje'
import { calcularProposta } from './motor-proposta'
import { clonar, conferir, ler } from './arvore'
import { camposDaArvore } from './mocks'
import FormularioDeTeste from './_FormularioDeTeste.vue'

const props = defineProps<{ t: Textos }>()

const { modo, salva, formatoSalvo } = useConstrutorDeExpressoes()
const idioma = useIdioma()
const toast = useToast()

const itens = useState<{ reference: string, data: Valores }[]>('ce-itens', () => structuredClone(ITENS))

function valorVirtual(data: Valores): string {
  if (modo.value === 'hoje') return calcularHoje(salva.value, { data }, { hoje: HOJE })
  const r = calcularProposta(salva.value, { data }, HOJE)
  if (r.erro) return props.t.formulario.erros[r.erro] ?? ''
  const f = formatoSalvo.value
  if (f && typeof r.valor === 'number') {
    return formatar(r.valor * (f.tipo === 'percentual' ? 100 : 1), { type: 'number', n_style: f.tipo === 'moeda' ? 'currency' : f.tipo === 'percentual' ? 'percent' : 'decimal', n_currency: f.moeda, n_minimumFractionDigits: f.casas, n_maximumFractionDigits: f.casas })
  }
  if (typeof r.valor === 'boolean') return r.valor ? props.t.formulario.sim : props.t.formulario.nao
  return r.valor == null ? '' : String(r.valor)
}

interface Linha extends Record<string, unknown> { id: string, reference: string, data: Valores }
const linhas = computed<Linha[]>(() => itens.value.map(i => ({ id: i.reference, reference: i.reference, data: i.data })))

const colunas = computed<EnTableColumn[]>(() => [
  { key: 'reference', label: props.t.itens.referencia },
  { key: 'cliente', label: 'Cliente' },
  { key: 'status', label: 'Status' },
  { key: 'quantidade', label: 'Quantidade', align: 'right' },
  { key: 'preco', label: 'Preço unitário', align: 'right' },
  { key: 'virtual', label: CAMPO_VIRTUAL.name },
])

const numero = (v: unknown) => (v === null || v === undefined || v === '' ? '--' : formatar(v, { type: 'number', n_maximumFractionDigits: 2 }))

/* ---------- Novo registro ---------- */

const modal = ref(false)
const novo = ref<Valores>(structuredClone(CENARIOS.vazio))
const criando = ref(false)
const completa = computed(() => !conferir(ler(salva.value, modo.value).expressao, modo.value, camposDaArvore).some(p => p.nivel === 'erro' && p.chave === 'lacunas'))

function abrirNovo() {
  novo.value = structuredClone(CENARIOS.vazio)
  modal.value = true
}

async function criar() {
  criando.value = true
  await new Promise(r => setTimeout(r, 400))
  const reference = `ORC-0${420 + itens.value.length - ITENS.length}`
  itens.value = [{ reference, data: clonar(novo.value) }, ...itens.value]
  criando.value = false
  modal.value = false
  toast.add({ title: props.t.formulario.criado(reference), icon: 'i-lucide-check', color: 'success' })
}
</script>

<template>
  <div class="flex flex-col">
    <!-- Barra de visualizações (cópia) -->
    <div class="flex items-center gap-2 border-b border-default px-4 py-2">
      <UButton label="Itens" icon="i-lucide-table" size="xs" color="primary" variant="soft" />
      <UButton label="Visualizar" icon="i-lucide-plus" size="xs" color="neutral" variant="ghost" />
    </div>

    <!-- Busca e ações (cópia) -->
    <div class="flex flex-wrap items-center gap-2 border-b border-default px-4 py-2">
      <UInput :placeholder="t.itens.buscar" icon="i-lucide-search" size="sm" variant="none" class="w-56" />
      <UButton :label="t.itens.criadoEm" icon="i-lucide-calendar" size="xs" color="neutral" variant="ghost" />
      <UButton :label="t.itens.todoPeriodo" icon="i-lucide-arrow-up-down" size="xs" color="neutral" variant="ghost" />
      <span class="ml-auto flex items-center gap-1">
        <UButton icon="i-lucide-file-down" size="xs" color="neutral" variant="ghost" aria-label="Exportar" />
        <UButton icon="i-lucide-columns-2" size="xs" color="neutral" variant="ghost" aria-label="Colunas" />
        <UButton icon="i-lucide-list-filter" size="xs" color="neutral" variant="ghost" aria-label="Filtros" />
        <UButton icon="i-lucide-settings" size="xs" color="neutral" variant="ghost" aria-label="Configurar" />
        <UButton :label="t.itens.novoRegistro" icon="i-lucide-plus" size="xs" color="primary" variant="outline" class="transition-transform hover:-translate-y-0.5" @click="abrirNovo" />
      </span>
    </div>

    <div class="p-4">
      <EnTable :columns="colunas" :rows="linhas" :locale="idioma">
        <template #cell-reference="{ row }">
          <span class="font-mono text-xs text-highlighted">{{ (row as Linha).reference }}</span>
        </template>
        <template #cell-cliente="{ row }">
          <span class="block max-w-56 truncate text-sm text-toned">{{ (row as Linha).data.cliente || '--' }}</span>
        </template>
        <template #cell-status="{ row }">
          <span class="text-sm text-toned">{{ (row as Linha).data.status || '--' }}</span>
        </template>
        <template #cell-quantidade="{ row }">
          <span class="text-sm tabular-nums text-toned">{{ numero((row as Linha).data.quantidade) }}</span>
        </template>
        <template #cell-preco="{ row }">
          <span class="text-sm tabular-nums text-toned">{{ numero((row as Linha).data.preco_unitario) }}</span>
        </template>
        <template #cell-virtual="{ row }">
          <span
            class="block max-w-72 truncate text-sm tabular-nums"
            :class="/Expression Processing Error|NaN|Infinity/.test(valorVirtual((row as Linha).data)) ? 'text-error' : 'text-highlighted'"
          >{{ valorVirtual((row as Linha).data) || '--' }}</span>
        </template>
        <template #actions>
          <UButton icon="i-lucide-chevron-down" color="neutral" variant="soft" size="xs" :aria-label="t.itens.acoes" />
        </template>
      </EnTable>
      <p class="mt-3 text-xs text-muted">{{ t.itens.mostrando(linhas.length) }}</p>
    </div>

    <!-- Novo registro (cópia do modal; o campo calcula com a expressão salva) -->
    <UModal v-model:open="modal" :title="t.formulario.titulo" :ui="{ content: 'sm:max-w-2xl' }">
      <template #body>
        <FormularioDeTeste
          v-model="novo"
          :t="t"
          :modo="modo"
          :expressao="salva"
          :formato="formatoSalvo"
          :campos="CAMPOS"
          :completa="completa"
        />
      </template>
      <template #footer>
        <div class="flex w-full justify-end gap-2">
          <UButton :label="t.formulario.cancelar" color="primary" variant="link" @click="modal = false" />
          <UButton :label="t.formulario.criar" color="primary" :loading="criando" @click="criar" />
        </div>
      </template>
    </UModal>
  </div>
</template>
