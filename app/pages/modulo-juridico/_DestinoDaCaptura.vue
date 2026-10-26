<script setup lang="ts">
/**
 * PROPOSTA: Módulo Jurídico › Destino (rodada 3). Para onde vai cada captura tratada e quem a recebe.
 *
 * - o submódulo não cria categoria: usa Processos e Andamentos, que o caso de uso Contencioso instala;
 * - andamento sem data nem prazo pode ir direto, sem passar pela caixa (Projuris ADV, EasyJur);
 * - captura sem processo e distribuição vão para uma fila com dono, nunca para ninguém;
 * - a regra de duplicidade decide qual data conta quando a mesma intimação chega por 2 meios (Tema 1.180 do STJ).
 *
 * Os campos entram no rascunho da página e gravam pelo Salvar do topo, como a aba Geral.
 */
import type { EnTableColumn } from '@be-enlighten/enspace-sdk-ui/base'
import { pessoas } from './mocks'
import type { Textos } from './textos'
import { textosCapturas } from './textos-capturas'

export interface RascunhoDoDestino {
  andamentosDireto: boolean
  atribuicao: { semProcesso: number, trabalhista: number, outras: number }
  duplicidade: 'oficial' | 'maisCedo'
}

defineProps<{ t: Textos }>()
const rascunho = defineModel<RascunhoDoDestino>({ required: true })
const tc = useTextos(textosCapturas)
const idioma = useIdioma()

type Destino = 'intimacao' | 'distribuicao' | 'andamento'
const linhas = computed(() => (['intimacao', 'distribuicao', 'andamento'] as Destino[]).map(d => ({ id: d, ...tc.value.destino.linhas[d] })))
const colunas = computed<EnTableColumn[]>(() => {
  const c = tc.value.destino.colunas
  return [{ key: 'captura', label: c.captura }, { key: 'vaiPara', label: c.vaiPara }, { key: 'revisao', label: c.revisao }]
})
const icone: Record<Destino, string> = { intimacao: 'i-lucide-gavel', distribuicao: 'i-lucide-file-plus-2', andamento: 'i-lucide-list-checks' }

const itensPessoa = computed(() => pessoas.map(p => ({ value: p.id, label: `${p.nome} (${p.papel})`, avatar: { text: p.iniciais } })))
const opcoesDeDuplicidade = computed(() => (['oficial', 'maisCedo'] as const).map(v => ({ value: v, label: tc.value.destino.duplicidadeOpcoes[v] })))
</script>

<template>
  <div class="flex max-w-4xl flex-col gap-6">
    <div class="flex flex-col gap-3">
      <p class="text-sm text-toned">{{ tc.destino.descricao }}</p>
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
