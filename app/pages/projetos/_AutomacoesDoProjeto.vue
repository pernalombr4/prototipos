<script setup lang="ts">
/**
 * PROPOSTA (rodada 3): a aba Automações do projeto.
 *
 * Nenhum motor novo. A página reúne o que as categorias do projeto já têm no produto:
 *   - os fluxos do Spaceflow cujo gatilho escuta uma categoria do projeto (no código, o gatilho
 *     de item escuta 1 categoria: `events::c_items:<slug>::<ação>`);
 *   - os avisos de prazo de cada categoria (`c-type-notifications`).
 * "Novo fluxo" pede a categoria e o gatilho e abre o Spaceflow com os 2 já escolhidos.
 * O gatilho do projeto inteiro (1 fluxo para todas as categorias) fica fora: é peça nova de back-end.
 * Ligar e desligar segue a permissão do Spaceflow; aqui, quem administra o projeto.
 */
import type { EnTableColumn } from '@be-enlighten/enspace-sdk-ui/base'
import type { Textos } from './textos'
import type { AvisoDePrazo, Fluxo, Gatilho } from './mocks'
import { useMarcaDeProposta, useProjetos } from './estado'

const props = defineProps<{ t: Textos, id: number }>()
const prj = useProjetos()
const { marca } = useMarcaDeProposta()
const idioma = useIdioma()
const toast = useToast()

const p = computed(() => prj.projetos.value.find(x => x.id === props.id)!)
const admin = computed(() => prj.podeAdministrar(p.value))
const categorias = computed(() => prj.categoriasDe(props.id))
const fluxos = computed(() => prj.fluxosDoProjeto(props.id))
const avisos = computed(() => prj.avisosDoProjeto(props.id))
const doModelo = computed(() => fluxos.value.filter(f => !f.ativo && f.ultimaExecucao === null).length)
const categoria = (id: number) => prj.categorias.value.find(c => c.id === id)
const formatarData = (d: string) => new Date(`${d}T12:00:00`).toLocaleDateString(idioma.value)
const ICONE_DO_GATILHO: Record<Gatilho, string> = {
  criado: 'i-lucide-file-plus',
  atualizado: 'i-lucide-file-pen-line',
  excluido: 'i-lucide-file-x',
  agendado: 'i-lucide-clock',
}

const colunasFluxos = computed<EnTableColumn[]>(() => [
  { key: 'nome', label: props.t.automacoes.nome },
  { key: 'categoria', label: props.t.automacoes.categoria },
  { key: 'gatilho', label: props.t.automacoes.gatilho },
  { key: 'execucoes30d', label: props.t.automacoes.execucoes },
  { key: 'ultimaExecucao', label: props.t.automacoes.ultima },
  { key: 'ativo', label: props.t.automacoes.ativo },
])
const colunasAvisos = computed<EnTableColumn[]>(() => [
  { key: 'categoria', label: props.t.automacoes.categoria },
  { key: 'campo', label: props.t.automacoes.campoDeData },
  { key: 'diasAntes', label: props.t.automacoes.antecedencia },
  { key: 'quem', label: props.t.automacoes.quemRecebe },
])
const linhasAvisos = computed(() => avisos.value.map((a, i) => ({ ...a, id: i })))

function alternar(f: Fluxo) {
  prj.alternarFluxo(f.id)
  toast.add({ title: f.ativo ? props.t.automacoes.desligado(f.nome) : props.t.automacoes.ligado(f.nome), icon: f.ativo ? 'i-lucide-pause' : 'i-lucide-play', color: f.ativo ? 'neutral' : 'success' })
}
function abrirFluxo(f: Fluxo) {
  toast.add({ title: props.t.automacoes.abreNoSpaceflow(f.nome), icon: 'i-lucide-info', color: 'neutral' })
}
function configurarAvisos() {
  toast.add({ title: props.t.automacoes.configurarAvisosMaquete, icon: 'i-lucide-info', color: 'neutral' })
}

/* ---------- novo fluxo ---------- */
const novo = ref(false)
const catDoNovo = ref<number | undefined>(undefined)
const gatilhoDoNovo = ref<Gatilho>('criado')
const opcoesDeCategoria = computed(() => categorias.value.map(c => ({ value: c.id, label: c.name, icon: c.icon ?? 'i-lucide-folder' })))
const opcoesDeGatilho = computed(() => (['criado', 'atualizado', 'excluido', 'agendado'] as const).map(g => ({ value: g, label: props.t.automacoes.gatilhoDe[g], icon: ICONE_DO_GATILHO[g] })))
function abrirNovo() {
  catDoNovo.value = categorias.value[0]?.id
  gatilhoDoNovo.value = 'criado'
  novo.value = true
}
function continuar() {
  const c = categoria(catDoNovo.value ?? -1)
  if (!c) return
  novo.value = false
  toast.add({ title: props.t.automacoes.abrindo(props.t.automacoes.gatilhoDe[gatilhoDoNovo.value], c.name), icon: 'i-lucide-workflow', color: 'neutral' })
}
</script>

<template>
  <div class="space-y-4">
    <!-- fluxos -->
    <section class="overflow-hidden rounded-lg border border-default bg-default animate-[entrada_0.25s_ease-out_both]" :class="marca">
      <header class="flex flex-wrap items-center gap-2 border-b border-default px-4 py-3">
        <div class="min-w-0 flex-1">
          <h2 class="text-sm font-semibold text-highlighted">{{ t.automacoes.fluxos }}</h2>
          <p class="text-xs text-muted">{{ t.automacoes.fluxosDica }}</p>
        </div>
        <UButton v-if="admin && categorias.length" :label="t.automacoes.novoFluxo" icon="i-lucide-plus" size="sm" color="neutral" variant="outline" @click="abrirNovo" />
      </header>

      <UAlert
        v-if="doModelo"
        :description="t.automacoes.desligadosDoModelo(doModelo)"
        icon="i-lucide-info"
        color="info"
        variant="subtle"
        class="rounded-none border-b border-default"
      />

      <EnTable
        v-if="fluxos.length"
        :columns="colunasFluxos"
        :rows="fluxos"
        :pagination="{ page: 1, pageCount: 1, total: fluxos.length }"
        :empty-state="{ icon: 'i-lucide-workflow', title: t.automacoes.semFluxosTitulo, description: '' }"
        :locale="idioma"
      >
        <template #cell-nome="{ row }">
          <UButton
            :label="(row as Fluxo).nome"
            trailing-icon="i-lucide-arrow-up-right"
            color="neutral"
            variant="link"
            size="sm"
            class="min-w-56 max-w-80 px-0 text-left font-medium text-highlighted"
            :ui="{ label: 'whitespace-normal overflow-visible' }"
            :aria-label="t.automacoes.abrirNoSpaceflow"
            @click.stop="abrirFluxo(row as Fluxo)"
          />
        </template>
        <template #cell-categoria="{ row }">
          <span class="flex items-center gap-1.5 text-sm text-toned">
            <UIcon :name="categoria((row as Fluxo).categoria)?.icon ?? 'i-lucide-folder'" class="size-3.5 shrink-0 text-muted" />
            <span class="max-w-44 truncate">{{ categoria((row as Fluxo).categoria)?.name }}</span>
          </span>
        </template>
        <template #cell-gatilho="{ row }">
          <span class="flex items-center gap-1.5 text-sm text-muted">
            <UIcon :name="ICONE_DO_GATILHO[(row as Fluxo).gatilho]" class="size-3.5 shrink-0" />{{ t.automacoes.gatilhoDe[(row as Fluxo).gatilho] }}
          </span>
        </template>
        <template #cell-execucoes30d="{ row }">
          <span class="text-sm tabular-nums text-toned">{{ (row as Fluxo).execucoes30d.toLocaleString(idioma) }}</span>
        </template>
        <template #cell-ultimaExecucao="{ row }">
          <span class="text-sm text-muted">{{ (row as Fluxo).ultimaExecucao ? formatarData((row as Fluxo).ultimaExecucao!) : t.automacoes.nunca }}</span>
        </template>
        <template #cell-ativo="{ row }">
          <USwitch
            :model-value="(row as Fluxo).ativo"
            :disabled="!admin"
            size="sm"
            :aria-label="t.automacoes.ligarDesligar((row as Fluxo).nome)"
            @update:model-value="alternar(row as Fluxo)"
            @click.stop
          />
        </template>
      </EnTable>
      <div v-else class="flex flex-col items-center gap-2 px-6 py-10 text-center">
        <UIcon name="i-lucide-workflow" class="size-7 text-muted" />
        <p class="text-sm font-semibold text-highlighted">{{ t.automacoes.semFluxosTitulo }}</p>
        <p class="max-w-sm text-sm text-muted">{{ t.automacoes.semFluxosTexto }}</p>
      </div>
    </section>

    <!-- avisos de prazo -->
    <section class="overflow-hidden rounded-lg border border-default bg-default animate-[entrada_0.25s_ease-out_both]" style="animation-delay: 60ms" :class="marca">
      <header class="flex flex-wrap items-center gap-2 border-b border-default px-4 py-3">
        <div class="min-w-0 flex-1">
          <h2 class="text-sm font-semibold text-highlighted">{{ t.automacoes.avisos }}</h2>
          <p class="text-xs text-muted">{{ t.automacoes.avisosDica }}</p>
        </div>
        <UButton v-if="admin && categorias.length" :label="t.automacoes.configurarAvisos" icon="i-lucide-bell-ring" size="sm" color="neutral" variant="outline" @click="configurarAvisos" />
      </header>
      <EnTable
        v-if="linhasAvisos.length"
        :columns="colunasAvisos"
        :rows="linhasAvisos"
        :pagination="{ page: 1, pageCount: 1, total: linhasAvisos.length }"
        :empty-state="{ icon: 'i-lucide-bell-off', title: t.automacoes.semAvisos, description: '' }"
        :locale="idioma"
      >
        <template #cell-categoria="{ row }">
          <span class="flex items-center gap-1.5 text-sm text-toned">
            <UIcon :name="categoria((row as AvisoDePrazo).categoria)?.icon ?? 'i-lucide-folder'" class="size-3.5 shrink-0 text-muted" />
            <span class="max-w-44 truncate">{{ categoria((row as AvisoDePrazo).categoria)?.name }}</span>
          </span>
        </template>
        <template #cell-diasAntes="{ row }">
          <span class="text-sm text-muted">{{ t.automacoes.dias((row as AvisoDePrazo).diasAntes) }}</span>
        </template>
      </EnTable>
      <p v-else class="px-4 py-8 text-center text-sm text-muted">{{ t.automacoes.semAvisos }}</p>
    </section>

    <UModal v-model:open="novo" :title="t.automacoes.janelaTitulo" :description="t.automacoes.janelaDescricao">
      <template #body>
        <div class="space-y-4">
          <UFormField :label="t.automacoes.categoria" required>
            <USelect v-model="catDoNovo" :items="opcoesDeCategoria" class="w-full" />
          </UFormField>
          <UFormField :label="t.automacoes.gatilho" required>
            <USelect v-model="gatilhoDoNovo" :items="opcoesDeGatilho" class="w-full" :icon="ICONE_DO_GATILHO[gatilhoDoNovo]" />
          </UFormField>
        </div>
      </template>
      <template #footer>
        <div class="flex w-full justify-end gap-2">
          <UButton :label="t.automacoes.cancelar" color="neutral" variant="ghost" @click="novo = false" />
          <UButton :label="t.automacoes.abrirNoSpaceflow" icon="i-lucide-arrow-up-right" color="primary" :disabled="!catDoNovo" @click="continuar" />
        </div>
      </template>
    </UModal>
  </div>
</template>
