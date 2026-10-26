<script setup lang="ts">
/**
 * PROPOSTA: Módulo Jurídico › Destino (rodada 3). Para onde vai cada captura tratada e quem a recebe.
 *
 * - o submódulo não cria categoria: usa a categoria dos processos escolhida ao ligá-lo;
 * - andamento sem data nem prazo pode ir direto, sem passar pela caixa (Projuris ADV, EasyJur);
 * - captura sem processo e distribuição vão para uma fila com dono, nunca para ninguém;
 * - a regra de duplicidade decide qual data conta quando a mesma intimação chega por 2 meios (Tema 1.180 do STJ).
 *
 * Rodada 4:
 * - a categoria dos processos é a que foi escolhida ao ligar o submódulo, com os campos ligados e travados;
 * - a audiência lida no teor vira item em Audiências e entra na Agenda;
 * - o andamento vai para a aba Andamentos do processo, e não para uma categoria.
 *
 * Os campos entram no rascunho da página e gravam pelo Salvar do topo, como a aba Geral.
 */
import type { EnTableColumn } from '@be-enlighten/enspace-sdk-ui/base'
import { categorias, pessoas } from './mocks'
import { estado } from './estado'
import type { Textos } from './textos'
import { textosCapturas } from './textos-capturas'
import { textosTratamento } from './textos-tratamento'
import { camposExigidos } from './tratamento'

export interface RascunhoDoDestino {
  andamentosDireto: boolean
  atribuicao: { semProcesso: number, trabalhista: number, outras: number }
  duplicidade: 'oficial' | 'maisCedo'
}

defineProps<{ t: Textos }>()
const rascunho = defineModel<RascunhoDoDestino>({ required: true })
const tc = useTextos(textosCapturas)
const tt = useTextos(textosTratamento)
const idioma = useIdioma()

type Destino = 'intimacao' | 'distribuicao' | 'andamento' | 'audiencia'
const linhas = computed(() => [
  ...(['intimacao', 'distribuicao'] as const).map(d => ({ id: d as Destino, ...tc.value.destino.linhas[d] })),
  { id: 'audiencia' as Destino, ...tt.value.destino.audiencia },
  { id: 'andamento' as Destino, ...tc.value.destino.linhas.andamento },
])
const colunas = computed<EnTableColumn[]>(() => {
  const c = tc.value.destino.colunas
  return [{ key: 'captura', label: c.captura }, { key: 'vaiPara', label: c.vaiPara }, { key: 'revisao', label: c.revisao }]
})
const icone: Record<Destino, string> = { intimacao: 'i-lucide-gavel', distribuicao: 'i-lucide-file-plus-2', andamento: 'i-lucide-list-checks', audiencia: 'i-lucide-calendar-clock' }

const ligacao = computed(() => estado.ligacao)
const categoria = computed(() => categorias.find(c => c.id === ligacao.value.categoria)!)

const itensPessoa = computed(() => pessoas.map(p => ({ value: p.id, label: `${p.nome} (${p.papel})`, avatar: { text: p.iniciais } })))
const opcoesDeDuplicidade = computed(() => (['oficial', 'maisCedo'] as const).map(v => ({ value: v, label: tc.value.destino.duplicidadeOpcoes[v] })))
</script>

<template>
  <div class="flex max-w-4xl flex-col gap-6">
    <!-- PROPOSTA (rodada 4): a categoria escolhida ao ligar o submódulo -->
    <section class="flex flex-col gap-3 rounded-lg border border-default p-4">
      <div class="flex flex-wrap items-start justify-between gap-2">
        <div class="min-w-0">
          <p class="text-sm font-medium text-highlighted">{{ tt.destino.categoria.titulo }}</p>
          <p class="text-xs text-muted">{{ tt.destino.categoria.desc }}</p>
        </div>
        <span class="flex items-center gap-2">
          <UBadge :label="categoria.nome" :icon="categoria.icone" color="primary" variant="subtle" />
          <UBadge v-if="ligacao.origem === 'casoDeUso'" :label="tt.destino.categoria.casoDeUso" color="neutral" variant="outline" size="sm" />
        </span>
      </div>
      <ul class="grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
        <li v-for="c in camposExigidos" :key="c.id" class="flex min-w-0 items-center gap-2 text-sm">
          <UTooltip :text="tt.destino.categoria.travado">
            <UIcon name="i-lucide-lock" class="size-3.5 shrink-0 text-muted" />
          </UTooltip>
          <span class="shrink-0 text-muted">{{ tt.ligacao.nomes[c.id] }}</span>
          <UIcon name="i-lucide-arrow-right" class="size-3 shrink-0 text-dimmed" />
          <span class="truncate text-highlighted">{{ ligacao.campos[c.id] ?? '-' }}</span>
          <UBadge v-if="ligacao.criados.includes(c.id)" :label="tt.destino.categoria.criado" color="neutral" variant="subtle" size="sm" />
        </li>
      </ul>
    </section>

    <div class="flex flex-col gap-3">
      <p class="text-sm text-toned">{{ tt.destino.descricao }}</p>
      <EnTable :columns="colunas" :rows="linhas" :locale="idioma">
        <template #cell-captura="{ row }">
          <span class="flex items-center gap-2 text-sm font-medium text-highlighted">
            <UIcon :name="icone[(row as { id: Destino }).id]" class="size-4 text-muted" />{{ (row as { captura: string }).captura }}
          </span>
        </template>
        <template #cell-vaiPara="{ row }">
          <span class="text-sm text-toned">{{ (row as { vaiPara: string }).vaiPara }}</span>
        </template>
        <template #cell-revisao="{ row }">
          <span class="text-sm text-muted">{{ (row as { revisao: string }).revisao }}</span>
        </template>
      </EnTable>
      <USwitch v-model="rascunho.andamentosDireto" :label="tc.destino.andamentosDireto" :description="tc.destino.andamentosDiretoAjuda" />
    </div>

    <USeparator />

    <UFormField :label="tc.destino.atribuicao" :help="tc.destino.atribuicaoAjuda">
      <div class="mt-1 grid gap-3 sm:grid-cols-3">
        <UFormField v-for="k in (['semProcesso', 'trabalhista', 'outras'] as const)" :key="k" :label="tc.destino[k]" size="sm">
          <USelect v-model="rascunho.atribuicao[k]" :items="itensPessoa" class="w-full" />
        </UFormField>
      </div>
    </UFormField>

    <USeparator />

    <UFormField :label="tc.destino.duplicidade" :help="tc.destino.duplicidadeAjuda[rascunho.duplicidade]">
      <USelect v-model="rascunho.duplicidade" :items="opcoesDeDuplicidade" class="w-full max-w-md" />
    </UFormField>
  </div>
</template>
