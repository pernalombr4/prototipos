<script setup lang="ts">
/**
 * O construtor do painel: painel lateral, com a prévia ao vivo no topo.
 *
 * Hoje (develop, 2026-11-11): modal de 2 abas, 3 sub-abas e um modal sobre o modal
 * para escolher o campo, sem prévia, com o tipo de gráfico antes do dado e o campo
 * do eixo Y no fim do formulário. Aqui: uma coluna só, o dado primeiro (categoria,
 * o que calcular, agrupar, dividir, filtros, período), o gráfico depois, e só os
 * tipos que servem para o dado escolhido.
 *
 * A configuração se lê como frase no topo ("Soma de Valor do contrato em Contratos
 * por Status"), e a frase vira o título quando a pessoa não escreve outro.
 */
import type { SelectItem, SelectMenuItem } from '@nuxt/ui'
import type { Condicao, ConfigDoPainel, Contexto, Funcao, Granularidade, Operador, Ordem, Visualizacao } from './agregacao'
import {
  agregar, campoDe, ehData, ehDimensao, ehMedida, ehMultiplo, granularidadeSugerida, iconeDoTipo, visualizacoesPossiveis,
} from './agregacao'
import type { CampoDoMock } from './mocks'
import { CATEGORIAS, ITENS, MEMBROS, categoriaPorSlug } from './mocks'
import type { Textos } from './textos'
import PainelDoDashboard from './_PainelDoDashboard.vue'

const props = defineProps<{
  t: Textos
  /** O painel em edição; sem ele, é painel novo. */
  painel?: ConfigDoPainel
  /** Base do painel novo (id e categoria). */
  novo: ConfigDoPainel
  contexto: Contexto
  rotuloDoPeriodo: string
}>()

const aberto = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ salvar: [cfg: ConfigDoPainel, novo: boolean] }>()

const rascunho = ref<ConfigDoPainel>(structuredClone(toRaw(props.novo)))
const ehNovo = computed(() => !props.painel)
const salvando = ref(false)

watch(aberto, (a) => {
  if (!a) return
  rascunho.value = structuredClone(toRaw(props.painel ?? props.novo))
  salvando.value = false
})

const categoria = computed(() => categoriaPorSlug.get(rascunho.value.categoria)!)
const campos = computed(() => categoria.value.campos)
const campo = (refId?: string) => campoDe(rascunho.value.categoria, refId)

/* ----------------------------- reações em cadeia ---------------------------- */

/* Trocar de categoria limpa o que era da outra. */
watch(() => rascunho.value.categoria, (slug, antes) => {
  if (!antes || slug === antes) return
  const r = rascunho.value
  r.medida = undefined
  r.agruparPor = undefined
  r.quebrarPor = undefined
  r.condicoes = []
  r.campoDeData = 'created_at'
  if (r.funcao !== 'contagem' && !campos.value.some(ehMedida)) r.funcao = 'contagem'
})

/* O tipo de gráfico segue o dado: fora da lista possível, volta ao sugerido. */
const possiveis = computed(() => visualizacoesPossiveis(rascunho.value))
watch(() => [rascunho.value.agruparPor, rascunho.value.quebrarPor, rascunho.value.categoria, rascunho.value.funcao], () => {
  const r = rascunho.value
  const { possiveis: lista, sugerida } = possiveis.value
  if (!lista.includes(r.visualizacao) || (r.visualizacao === 'numero' && sugerida !== 'numero')) r.visualizacao = sugerida
  const dim = campo(r.agruparPor)
  if (dim && ehData(dim)) r.granularidade = granularidadeSugerida(props.contexto.periodo)
  if (dim && !dim.options && r.ordem === 'natural') r.ordem = 'valorDesc'
  if (r.quebrarPor === r.agruparPor) r.quebrarPor = undefined
})

/* ---------------------------------- opções ---------------------------------- */

const NENHUM = '__nenhum'

const itensDaCategoria = computed<SelectMenuItem[]>(() => CATEGORIAS.map(c => ({
  label: c.name,
  value: c.slug,
  icon: c.icon,
  description: props.t.painel.itens(ITENS.filter(i => i.categoria === c.slug).length),
})))

const FUNCOES: Funcao[] = ['contagem', 'soma', 'media', 'mediana', 'minimo', 'maximo', 'distintos']
const itensDaFuncao = computed<SelectItem[]>(() => FUNCOES.map(f => ({
  label: props.t.funcoes[f],
  value: f,
  description: props.t.ajudaFuncao[f],
  disabled: f !== 'contagem' && f !== 'distintos' && !campos.value.some(ehMedida),
})))

function itemDeCampo(c: CampoDoMock): SelectMenuItem {
  return {
    label: c.name,
    value: c.refId,
    icon: iconeDoTipo(c),
    description: c.type === 'EnlExpressionEditor' ? `${props.t.construtor.virtual}: ${c.expressao}` : undefined,
  }
}

/** Separa os campos da categoria dos do sistema, como o produto lista. */
function comGrupos(lista: CampoDoMock[], mapa: (c: CampoDoMock) => SelectMenuItem): SelectMenuItem[][] {
  const daCategoria = lista.filter(c => !c.sistema).map(mapa)
  const doSistema = lista.filter(c => c.sistema).map(mapa)
  return doSistema.length
    ? [daCategoria, [{ type: 'label', label: props.t.construtor.sistema }, ...doSistema]]
    : [daCategoria]
}

const itensDaMedida = computed(() => {
  const lista = rascunho.value.funcao === 'distintos' ? campos.value.filter(c => ehDimensao(c) || ehMedida(c)) : campos.value.filter(ehMedida)
  return comGrupos(lista, itemDeCampo)
})

const itensDoAgrupar = computed<SelectMenuItem[][]>(() => {
  const dims = comGrupos(campos.value.filter(ehDimensao), itemDeCampo)
  const textos = campos.value.filter(c => !ehDimensao(c) && !ehMedida(c)).map(c => ({ ...itemDeCampo(c), disabled: true, description: props.t.construtor.textoNaoAgrupa }))
  return [[{ label: props.t.construtor.agruparNenhum, value: NENHUM, icon: 'i-lucide-hash' }], ...dims, ...(textos.length ? [textos] : [])]
})

const itensDoQuebrar = computed<SelectMenuItem[][]>(() => [
  [{ label: props.t.construtor.quebrarNenhum, value: NENHUM, icon: 'i-lucide-minus' }],
  ...comGrupos(campos.value.filter(c => ehDimensao(c) && !ehData(c) && c.refId !== rascunho.value.agruparPor), itemDeCampo),
])

const itensDaData = computed(() => comGrupos(campos.value.filter(ehData), itemDeCampo))

const GRANULARIDADES: Granularidade[] = ['dia', 'semana', 'mes', 'trimestre', 'ano']
const itensDaGranularidade = computed<SelectItem[]>(() => GRANULARIDADES.map(g => ({ label: props.t.construtor.granularidades[g], value: g })))

const ICONES: Record<Visualizacao, string> = {
  numero: 'i-lucide-hash',
  barras: 'i-lucide-chart-column',
  barrasHorizontais: 'i-lucide-chart-bar',
  linha: 'i-lucide-chart-line',
  area: 'i-lucide-chart-area',
  rosca: 'i-lucide-chart-pie',
  funil: 'i-lucide-filter',
  tabela: 'i-lucide-table',
}
const itensDaVisualizacao = computed<SelectItem[]>(() => possiveis.value.possiveis.map(v => ({
  label: v === possiveis.value.sugerida && possiveis.value.possiveis.length > 1 ? `${props.t.construtor.visualizacoes[v]} (${props.t.construtor.sugerido})` : props.t.construtor.visualizacoes[v],
  value: v,
  icon: ICONES[v],
  description: props.t.construtor.ajudaVisualizacao[v],
})))

const itensDaOrdem = computed<SelectItem[]>(() => {
  const ordens: Ordem[] = campo(rascunho.value.agruparPor)?.options ? ['natural', 'valorDesc', 'valorAsc', 'rotulo'] : ['valorDesc', 'valorAsc', 'rotulo']
  return ordens.map(o => ({ label: props.t.construtor.ordens[o], value: o }))
})

const itensDoLimite = computed<SelectItem[]>(() => [5, 8, 10, 15, 20].map(n => ({ label: props.t.construtor.limites(n), value: n })).concat([{ label: props.t.construtor.semLimite, value: 0 }]))

/* v-model dos seletores com "nenhum" */
const agruparPor = computed({
  get: () => rascunho.value.agruparPor ?? NENHUM,
  set: (v: string) => { rascunho.value.agruparPor = v === NENHUM ? undefined : v },
})
const quebrarPor = computed({
  get: () => rascunho.value.quebrarPor ?? NENHUM,
  set: (v: string) => { rascunho.value.quebrarPor = v === NENHUM ? undefined : v },
})

const dim = computed(() => campo(rascunho.value.agruparPor))
const quebra = computed(() => campo(rascunho.value.quebrarPor))
const avisoDoAgrupar = computed(() => {
  const d = dim.value
  if (!d) return ''
  if (ehMultiplo(d)) return props.t.construtor.multiploAviso
  if (d.relacao) return props.t.construtor.relacaoAviso(categoriaPorSlug.get(d.relacao)?.name ?? '')
  return ''
})

/* -------------------------------- condições -------------------------------- */

const camposFiltraveis = computed(() => comGrupos(campos.value.filter(c => (ehDimensao(c) && !ehData(c)) || ehMedida(c)), itemDeCampo))

function operadoresDe(c?: CampoDoMock): SelectItem[] {
  const ops: Operador[] = c && ehMedida(c) ? ['igual', 'diferente', 'maior', 'menor', 'preenchido', 'vazio'] : ['igual', 'diferente', 'preenchido', 'vazio']
  return ops.map(o => ({ label: props.t.construtor.operadores[o], value: o }))
}

function valoresDe(c?: CampoDoMock): SelectMenuItem[] {
  if (!c) return []
  if (c.type === 'inputSwitch') return [{ label: props.t.rotulos.sim, value: 'true' }, { label: props.t.rotulos.nao, value: 'false' }]
  if (c.refId === 'user') return MEMBROS.map(m => ({ label: m, value: m }))
  if (c.relacao) {
    const destino = categoriaPorSlug.get(c.relacao)!
    return ITENS.filter(i => i.categoria === c.relacao).map(i => ({ label: String(i.data[destino.display] ?? i.reference), value: String(i.id) }))
  }
  return (c.options ?? []).map(o => ({ label: o.label, value: o.value }))
}

function novaCondicao() {
  const primeiro = campos.value.find(c => ehDimensao(c) && !ehData(c) && !c.sistema)
  rascunho.value.condicoes.push({ campo: primeiro?.refId ?? '', operador: 'igual', valor: valoresDe(primeiro)[0]?.value as string | undefined })
}

function trocarCampoDaCondicao(c: Condicao, refId: string) {
  c.campo = refId
  c.operador = 'igual'
  c.valor = valoresDe(campo(refId))[0]?.value as string | undefined
}

/* ---------------------------------- prévia --------------------------------- */

const frase = computed(() => props.t.frase(
  rascunho.value.funcao,
  categoria.value.name,
  rascunho.value.funcao === 'contagem' ? undefined : campo(rascunho.value.medida)?.name,
  rascunho.value.visualizacao === 'numero' ? undefined : dim.value?.name,
  rascunho.value.visualizacao === 'numero' ? undefined : quebra.value?.name,
))

const faltaMedida = computed(() => rascunho.value.funcao !== 'contagem' && !rascunho.value.medida)

const resultado = computed(() => agregar(
  faltaMedida.value ? { ...rascunho.value, funcao: 'contagem' } : rascunho.value,
  props.contexto,
))

/* Toda mudança passa por um instante de carregamento: é o que o back vai custar. */
const calculando = ref(false)
let espera: ReturnType<typeof setTimeout> | undefined
watch(() => JSON.stringify(rascunho.value), () => {
  calculando.value = true
  clearTimeout(espera)
  espera = setTimeout(() => { calculando.value = false }, 280)
})

/* ---------------------------------- salvar --------------------------------- */

const TAMANHOS: Record<Visualizacao, [number, number]> = {
  numero: [3, 2], barras: [6, 5], barrasHorizontais: [6, 6], linha: [6, 5], area: [6, 5], rosca: [4, 5], funil: [4, 5], tabela: [6, 4],
}

function salvar() {
  if (faltaMedida.value) return
  salvando.value = true
  const cfg = structuredClone(toRaw(rascunho.value))
  const antes = props.painel?.visualizacao
  if (ehNovo.value || (antes === 'numero') !== (cfg.visualizacao === 'numero')) [cfg.w, cfg.h] = TAMANHOS[cfg.visualizacao]
  setTimeout(() => {
    emit('salvar', cfg, ehNovo.value)
    aberto.value = false
  }, 450)
}
</script>

<template>
  <USlideover
    v-model:open="aberto"
    :title="ehNovo ? t.construtor.tituloNovo : t.construtor.tituloEditar"
    :description="t.construtor.descricao"
    :close="{ 'aria-label': t.construtor.cancelar }"
    :ui="{ content: 'sm:max-w-xl', body: 'p-0 sm:p-0' }"
  >
    <template #body>
      <!-- Prévia: o mesmo componente da grade, com o dado de verdade do recorte. -->
      <section class="sticky top-0 z-10 border-b border-default bg-muted px-4 py-4 sm:px-6" :aria-label="t.construtor.previa">
        <p class="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted">
          <UIcon name="i-lucide-eye" class="size-3.5" />
          {{ t.construtor.previa }}
        </p>
        <div class="min-h-[330px]">
          <PainelDoDashboard
            :t="t"
            :cfg="faltaMedida ? { ...rascunho, funcao: 'contagem' } : rascunho"
            :resultado="resultado"
            :estado="calculando ? 'carregando' : 'pronto'"
            previa
            :rotulo-do-periodo="rotuloDoPeriodo"
          />
        </div>
      </section>

      <div class="space-y-7 px-4 py-5 sm:px-6">
        <!-- ─────────────── Dados ─────────────── -->
        <section class="space-y-4">
          <div>
            <h3 class="text-sm font-semibold text-highlighted">{{ t.construtor.secaoDados }}</h3>
            <p class="mt-1 text-sm text-toned">{{ frase }}</p>
          </div>

          <UFormField :label="t.construtor.categoria" required>
            <USelectMenu
              v-model="rascunho.categoria"
              :items="itensDaCategoria"
              value-key="value"
              :icon="categoria.icon"
              :search-input="{ placeholder: t.construtor.buscarCategoria }"
              class="w-full"
            />
          </UFormField>

          <div class="grid gap-3 sm:grid-cols-2">
            <UFormField :label="t.construtor.calcular">
              <USelect v-model="rascunho.funcao" :items="itensDaFuncao" value-key="value" class="w-full" :ui="{ content: 'min-w-72' }" />
            </UFormField>
            <UFormField
              v-if="rascunho.funcao !== 'contagem'"
              :label="t.construtor.campoDaMedida"
              required
              :error="faltaMedida ? (itensDaMedida.flat().length ? t.construtor.medidaErro : t.construtor.medidaVazia) : undefined"
            >
              <USelectMenu
                v-model="rascunho.medida"
                :items="itensDaMedida"
                value-key="value"
                :placeholder="t.construtor.medidaPlaceholder"
                :search-input="{ placeholder: t.construtor.buscarCampo }"
                :icon="campo(rascunho.medida) ? iconeDoTipo(campo(rascunho.medida)!) : undefined"
                class="w-full"
                :ui="{ content: 'min-w-72' }"
              />
            </UFormField>
          </div>

          <UFormField :label="t.construtor.agruparPor" :help="avisoDoAgrupar || t.construtor.agruparAjuda">
            <USelectMenu
              v-model="agruparPor"
              :items="itensDoAgrupar"
              value-key="value"
              :icon="dim ? iconeDoTipo(dim) : 'i-lucide-hash'"
              :search-input="{ placeholder: t.construtor.buscarCampo }"
              class="w-full"
            />
          </UFormField>

          <UFormField v-if="dim && ehData(dim)" :label="t.construtor.granularidade">
            <USelect v-model="rascunho.granularidade" :items="itensDaGranularidade" value-key="value" class="w-full sm:w-56" />
          </UFormField>

          <UFormField
            v-if="dim && rascunho.visualizacao !== 'numero'"
            :label="t.construtor.quebrarPor"
            :help="quebra && ehMultiplo(quebra) ? t.construtor.multiploAviso : t.construtor.quebrarAjuda"
          >
            <USelectMenu
              v-model="quebrarPor"
              :items="itensDoQuebrar"
              value-key="value"
              :icon="quebra ? iconeDoTipo(quebra) : 'i-lucide-minus'"
              :search-input="{ placeholder: t.construtor.buscarCampo }"
              class="w-full"
            />
          </UFormField>

          <!-- Filtros do painel -->
          <div class="space-y-2">
            <div class="flex items-center justify-between gap-2">
              <p class="text-sm font-medium text-default">{{ t.construtor.condicoes }}</p>
              <USelect
                v-if="rascunho.condicoes.length > 1"
                v-model="rascunho.juncao"
                :items="[{ label: t.construtor.juncao.e, value: 'e' }, { label: t.construtor.juncao.ou, value: 'ou' }]"
                value-key="value"
                size="xs"
                class="w-48"
              />
            </div>
            <p v-if="!rascunho.condicoes.length" class="text-sm text-muted">{{ t.construtor.condicoesVazio }}</p>
            <TransitionGroup tag="ul" name="lista" class="space-y-2">
              <li
                v-for="(c, i) in rascunho.condicoes"
                :key="i"
                class="grid grid-cols-[1fr_auto] gap-2 rounded-lg border border-default p-2 sm:grid-cols-[1fr_9rem_1fr_auto]"
              >
                <USelectMenu
                  :model-value="c.campo"
                  :items="camposFiltraveis"
                  value-key="value"
                  :search-input="{ placeholder: t.construtor.buscarCampo }"
                  size="sm"
                  class="min-w-0"
                  @update:model-value="(v: string) => trocarCampoDaCondicao(c, v)"
                />
                <UButton
                  icon="i-lucide-x"
                  color="neutral"
                  variant="ghost"
                  size="sm"
                  class="sm:order-last"
                  :aria-label="t.construtor.removerCondicao"
                  @click="rascunho.condicoes.splice(i, 1)"
                />
                <USelect v-model="c.operador" :items="operadoresDe(campo(c.campo))" value-key="value" size="sm" class="min-w-0" />
                <template v-if="c.operador !== 'preenchido' && c.operador !== 'vazio'">
                  <UInput
                    v-if="campo(c.campo) && ehMedida(campo(c.campo)!)"
                    v-model="c.valor"
                    type="number"
                    size="sm"
                    :placeholder="t.construtor.valorPlaceholder"
                    class="min-w-0"
                  />
                  <USelectMenu
                    v-else
                    v-model="c.valor"
                    :items="valoresDe(campo(c.campo))"
                    value-key="value"
                    size="sm"
                    :search-input="{ placeholder: t.filtros.buscarValor }"
                    :placeholder="t.construtor.valorPlaceholder"
                    class="min-w-0"
                  />
                </template>
                <span v-else class="hidden sm:block" />
              </li>
            </TransitionGroup>
            <UButton :label="t.construtor.adicionarCondicao" icon="i-lucide-plus" color="neutral" variant="outline" size="sm" @click="novaCondicao" />
          </div>

          <!-- Período -->
          <UFormField :label="t.construtor.periodo">
            <URadioGroup
              v-model="rascunho.periodo"
              :items="[
                { label: t.construtor.periodoDashboard, value: 'dashboard', description: rotuloDoPeriodo },
                { label: t.construtor.periodoTodo, value: 'todo', description: t.construtor.periodoTodoAjuda },
              ]"
              value-key="value"
            />
          </UFormField>
          <UFormField v-if="rascunho.periodo === 'dashboard'" :label="t.construtor.campoDeData">
            <USelectMenu
              v-model="rascunho.campoDeData"
              :items="itensDaData"
              value-key="value"
              icon="i-lucide-calendar"
              class="w-full sm:w-72"
            />
          </UFormField>
        </section>

        <USeparator />

        <!-- ─────────────── Visualização ─────────────── -->
        <section class="space-y-4">
          <h3 class="text-sm font-semibold text-highlighted">{{ t.construtor.secaoVisualizacao }}</h3>

          <UFormField :label="t.construtor.visualizacao" :help="possiveis.possiveis.length > 1 ? t.construtor.visualizacaoAjuda : t.construtor.soNumero">
            <USelect
              v-model="rascunho.visualizacao"
              :items="itensDaVisualizacao"
              value-key="value"
              :icon="ICONES[rascunho.visualizacao]"
              class="w-full"
              :disabled="possiveis.possiveis.length === 1"
              :ui="{ content: 'min-w-80' }"
            />
          </UFormField>

          <div v-if="dim && rascunho.visualizacao !== 'numero'" class="grid gap-3 sm:grid-cols-2">
            <UFormField v-if="!ehData(dim)" :label="t.construtor.ordem">
              <USelect v-model="rascunho.ordem" :items="itensDaOrdem" value-key="value" class="w-full" />
            </UFormField>
            <UFormField v-if="!ehData(dim) && rascunho.visualizacao !== 'funil'" :label="t.construtor.limite" :help="t.construtor.limiteAjuda">
              <USelect v-model="rascunho.limite" :items="itensDoLimite" value-key="value" class="w-full" />
            </UFormField>
          </div>

          <USwitch
            v-if="rascunho.visualizacao === 'barras'"
            v-model="rascunho.mostrarValores"
            :label="t.construtor.mostrarValores"
          />
        </section>

        <USeparator />

        <!-- ─────────────── Identificação ─────────────── -->
        <section class="space-y-4">
          <h3 class="text-sm font-semibold text-highlighted">{{ t.construtor.secaoIdentificacao }}</h3>
          <UFormField :label="t.construtor.titulo" :help="t.construtor.tituloAjuda">
            <UInput v-model="rascunho.titulo" :placeholder="frase" class="w-full" />
          </UFormField>
        </section>
      </div>
    </template>

    <template #footer>
      <div class="flex w-full justify-end gap-2">
        <UButton :label="t.construtor.cancelar" color="neutral" variant="ghost" @click="aberto = false" />
        <UButton
          :label="ehNovo ? t.construtor.adicionar : t.construtor.salvar"
          :icon="ehNovo ? 'i-lucide-plus' : 'i-lucide-check'"
          :loading="salvando"
          :disabled="faltaMedida"
          @click="salvar"
        />
      </div>
    </template>
  </USlideover>
</template>

<style scoped>
/* Entrada e saída das condições. Motivo no DECISOES.md: o TransitionGroup do Vue
   pede as classes de transição, que nenhum componente do Nuxt UI fornece. */
.lista-enter-active,
.lista-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.lista-enter-from,
.lista-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
@media (prefers-reduced-motion: reduce) {
  .lista-enter-active,
  .lista-leave-active {
    transition: none;
  }
}
</style>
