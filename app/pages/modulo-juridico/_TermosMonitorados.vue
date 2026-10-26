<script setup lang="ts">
/**
 * PROPOSTA: Módulo Jurídico › Termos monitorados (rodada 3). O que o ENSPACE procura nas fontes.
 *
 * - CNPJ, nome e OAB, os 3 termos que o mercado usa (Escavador, Judit, Astrea, Projuris ADV);
 * - nome tem variações e exceções, porque é onde nasce o homônimo; a exceção também nasce na caixa, quando alguém
 *   descarta uma distribuição como "Não é da empresa";
 * - abrangência por UF e o aviso de termo sem ocorrência há mais de 30 dias (a OAB errada que ninguém percebe);
 * - o consumo do contrato fica à vista, porque o serviço de captura de hoje é cobrado por termo.
 *
 * Mudança na lista vale na hora, como a suspensão no Calendário forense.
 */
import type { EnTableColumn } from '@be-enlighten/enspace-sdk-ui/base'
import type { AlvoDoTermo, Termo, TipoDeTermo } from './capturas'
import { TERMOS_CONTRATADOS } from './capturas'
import { HOJE, processos } from './mocks'
import { diferencaEmDias } from './prazos'
import { estado } from './estado'
import type { Textos } from './textos'
import { textosCapturas } from './textos-capturas'
import { dia } from './formato'

const props = defineProps<{ t: Textos }>()
const tc = useTextos(textosCapturas)
const toast = useToast()
const idioma = useIdioma()

const usados = computed(() => estado.termos.filter(x => x.ativo).length)
const cheio = computed(() => usados.value >= TERMOS_CONTRATADOS)

const colunas = computed<EnTableColumn[]>(() => {
  const c = tc.value.termos.colunas
  return [
    { key: 'termo', label: c.termo },
    { key: 'tipo', label: c.tipo },
    { key: 'alvos', label: c.alvos },
    { key: 'variacoes', label: c.variacoes },
    { key: 'abrangencia', label: c.abrangencia },
    { key: 'ultima', label: c.ultima },
    { key: 'ativo', label: c.ativo },
  ]
})

const diasSem = (x: Termo) => diferencaEmDias(x.ultimaOcorrencia, HOJE)

function alternar(x: Termo, v: boolean) {
  if (v && cheio.value) {
    toast.add({ title: tc.value.termos.modal.limite(TERMOS_CONTRATADOS), icon: 'i-lucide-circle-alert', color: 'warning' })
    return
  }
  x.ativo = v
}

/* ---------- adicionar termo ---------- */
const UFS = ['AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR', 'RJ', 'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO']
const ALVOS: AlvoDoTermo[] = ['publicacoes', 'distribuicoes', 'domicilio']
const vazio = () => ({ tipo: 'cnpj' as TipoDeTermo, valor: '', titular: '', variacoes: [] as string[], excecoes: [] as string[], ufs: [] as string[], alvos: ['publicacoes'] as AlvoDoTermo[] })
const novo = ref(vazio())
const modalAberto = ref(false)
const adicionando = ref(false)
const tipos = computed(() => (['cnpj', 'nome', 'oab'] as TipoDeTermo[]).map(v => ({ value: v, label: tc.value.termos.tipos[v] })))
const alvos = computed(() => ALVOS.map(v => ({ value: v, label: tc.value.termos.alvos[v] })))

function abrirModal() {
  novo.value = vazio()
  modalAberto.value = true
}
async function adicionar() {
  adicionando.value = true
  await new Promise(r => setTimeout(r, 600))
  const n = novo.value
  estado.termos.push({
    id: Math.max(0, ...estado.termos.map(x => x.id)) + 1,
    tipo: n.tipo,
    valor: n.valor.trim(),
    titular: n.titular.trim(),
    variacoes: n.tipo === 'nome' ? n.variacoes : [],
    excecoes: n.tipo === 'nome' ? n.excecoes : [],
    ufs: n.ufs,
    alvos: n.alvos,
    ativo: true,
    ultimaOcorrencia: HOJE,
  })
  adicionando.value = false
  modalAberto.value = false
  toast.add({ title: tc.value.termos.modal.toast, icon: 'i-lucide-scan-search', color: 'success' })
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <p class="max-w-4xl text-sm text-toned">{{ tc.termos.descricao }}</p>

    <div class="flex flex-wrap items-center gap-4">
      <div class="flex min-w-64 flex-1 flex-col gap-1.5">
        <p class="text-sm font-medium tabular-nums text-highlighted">{{ tc.termos.contrato(usados, TERMOS_CONTRATADOS) }}</p>
        <UProgress :model-value="usados" :max="TERMOS_CONTRATADOS" size="sm" :color="cheio ? 'warning' : 'primary'" class="max-w-sm" />
      </div>
      <UTooltip :text="tc.termos.modal.limite(TERMOS_CONTRATADOS)" :disabled="!cheio">
        <UButton :label="tc.termos.adicionar" icon="i-lucide-plus" color="neutral" variant="outline" :disabled="cheio" @click="abrirModal" />
      </UTooltip>
    </div>

    <EnTable :columns="colunas" :rows="estado.termos" :locale="idioma">
      <template #cell-termo="{ row }">
        <span class="flex flex-col py-1" :class="!(row as Termo).ativo && 'opacity-50'">
          <span class="text-sm font-medium text-highlighted">{{ (row as Termo).valor }}</span>
          <span class="text-xs text-muted">{{ (row as Termo).titular }}</span>
        </span>
      </template>
      <template #cell-tipo="{ row }">
        <UBadge :label="tc.termos.tipos[(row as Termo).tipo]" color="neutral" variant="outline" size="sm" />
      </template>
      <template #cell-alvos="{ row }">
        <span class="flex flex-wrap gap-1">
          <UBadge v-for="a in (row as Termo).alvos" :key="a" :label="tc.termos.alvos[a]" color="neutral" variant="subtle" size="sm" />
        </span>
      </template>
      <template #cell-variacoes="{ row }">
        <UTooltip
          v-if="(row as Termo).variacoes.length || (row as Termo).excecoes.length"
          :text="[...(row as Termo).variacoes, ...(row as Termo).excecoes.map(e => `− ${e}`)].join(' · ')"
        >
          <span class="flex flex-col text-sm text-toned underline decoration-dotted underline-offset-2">
            <span v-if="(row as Termo).variacoes.length">{{ tc.termos.variacoes((row as Termo).variacoes.length) }}</span>
            <span v-if="(row as Termo).excecoes.length">{{ tc.termos.excecoes((row as Termo).excecoes.length) }}</span>
          </span>
        </UTooltip>
        <span v-else class="text-sm text-dimmed">{{ tc.termos.nenhuma }}</span>
      </template>
      <template #cell-abrangencia="{ row }">
        <span class="text-sm text-toned">{{ (row as Termo).ufs.length ? (row as Termo).ufs.join(', ') : tc.termos.todos }}</span>
      </template>
      <template #cell-ultima="{ row }">
        <span class="flex flex-col gap-1">
          <span class="text-sm tabular-nums text-toned">{{ dia((row as Termo).ultimaOcorrencia, t.locale) }}</span>
          <UTooltip v-if="(row as Termo).ativo && diasSem(row as Termo) > 30" :text="tc.termos.semOcorrenciaAjuda">
            <UBadge :label="tc.termos.semOcorrencia(diasSem(row as Termo))" icon="i-lucide-triangle-alert" color="warning" variant="outline" size="sm" class="self-start" />
          </UTooltip>
        </span>
      </template>
      <template #cell-ativo="{ row }">
        <USwitch :model-value="(row as Termo).ativo" :aria-label="tc.termos.colunas.ativo" @update:model-value="(v: boolean) => alternar(row as Termo, v)" />
      </template>
    </EnTable>

    <p class="flex items-start gap-2 text-xs text-muted">
      <UIcon name="i-lucide-list-checks" class="mt-0.5 size-3.5 shrink-0" />{{ tc.termos.andamentos(processos.length) }}
    </p>

    <!-- Adicionar termo -->
    <UModal v-model:open="modalAberto" :title="tc.termos.modal.titulo">
      <template #body>
        <div class="flex flex-col gap-4">
          <div class="grid gap-3 sm:grid-cols-3">
            <UFormField :label="tc.termos.modal.tipo">
              <USelect v-model="novo.tipo" :items="tipos" class="w-full" />
            </UFormField>
            <UFormField :label="tc.termos.modal.valor" required class="sm:col-span-2">
              <UInput v-model="novo.valor" :placeholder="tc.termos.modal.valorPh[novo.tipo]" class="w-full" />
            </UFormField>
          </div>
          <UFormField :label="tc.termos.modal.titular">
            <UInput v-model="novo.titular" class="w-full" />
          </UFormField>
          <template v-if="novo.tipo === 'nome'">
            <UFormField :label="tc.termos.modal.variacoes" :help="tc.termos.modal.variacoesAjuda">
              <UInputTags v-model="novo.variacoes" class="w-full" />
            </UFormField>
            <UFormField :label="tc.termos.modal.excecoes" :help="tc.termos.modal.excecoesAjuda">
              <UInputTags v-model="novo.excecoes" class="w-full" />
            </UFormField>
          </template>
          <UFormField :label="tc.termos.modal.ufs">
            <USelectMenu v-model="novo.ufs" :items="UFS" multiple :placeholder="tc.termos.modal.ufsPh" class="w-full" />
          </UFormField>
          <UFormField :label="tc.termos.modal.alvos">
            <UCheckboxGroup v-model="novo.alvos" :items="alvos" orientation="horizontal" />
          </UFormField>
        </div>
      </template>
      <template #footer>
        <div class="flex w-full justify-end gap-2">
          <UButton :label="t.geral.cancelar" color="neutral" variant="ghost" @click="modalAberto = false" />
          <UButton :label="tc.termos.modal.confirmar" icon="i-lucide-plus" :loading="adicionando" :disabled="!novo.valor.trim() || !novo.alvos.length" @click="adicionar" />
        </div>
      </template>
    </UModal>
  </div>
</template>
