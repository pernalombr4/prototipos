<script setup lang="ts">
/**
 * PROPOSTA (rodada 2): o construtor do painel num modal largo, com o formulário à
 * esquerda e a prévia ao vivo à direita.
 *
 * A ordem segue as ferramentas de dados (pesquisa em `PESQUISA.md`, rodada 2):
 * 1. Fonte de dados: a categoria (no Looker Studio, "Data source");
 * 2. Visualização: o tipo vem antes dos campos, como no Power BI, porque define que
 *    lugares existem (o Cartão só tem Valor; a Rosca tem Fatias e Valor);
 * 3. Campos, nos lugares do tipo: Eixo, Valor e Legenda (os "field wells" do Power BI;
 *    no Looker, Dimensão, Métrica e Dimensão de detalhamento);
 * 4. Filtros do painel, no mesmo chip da barra do dashboard;
 * 5. Período;
 * 6. Ordem e limite;
 * 7. Título e descrição (a descrição vira o ícone de ajuda do painel).
 *
 * "Dividir por" da rodada 1 virou "Legenda": o nome antigo lia como divisão.
 */
import type { SelectItem, SelectMenuItem } from '@nuxt/ui'
import type { ConfigDoPainel, Contexto, Funcao, Granularidade, Ordem, Periodo, Visualizacao } from './agregacao'
import {
  TAMANHOS, aceitaLegenda, agregar, cabeNaLegenda, cabeNoEixo, campoDe, ehData, ehDimensao, ehMedida, ehMultiplo, funcoesDa,
  granularidadeSugerida, iconeDoTipo, serieDoCartao,
} from './agregacao'
import type { CampoDoMock } from './mocks'
import { CATEGORIAS, ITENS, categoriaPorSlug } from './mocks'
import type { Textos } from './textos'
import PainelDoDashboard from './_PainelDoDashboard.vue'
import ListaDeFiltros from './_ListaDeFiltros.vue'

const props = defineProps<{
  t: Textos
  /** O painel em edição; sem ele, é painel novo. */
  painel?: ConfigDoPainel
  /** Base do painel novo (id, categoria e, quando vem do BENI, a configuração inteira). */
  novo: ConfigDoPainel
  contexto: Contexto
  rotuloDoPeriodo: string
}>()

const aberto = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ salvar: [cfg: ConfigDoPainel, novo: boolean] }>()

const rascunho = ref<ConfigDoPainel>(structuredClone(toRaw(props.novo)))
const ehNovo = computed(() => !props.painel)
const salvando = ref(false)
const tentou = ref(false)

watch(aberto, (a) => {
  if (!a) return
  rascunho.value = structuredClone(toRaw(props.painel ?? props.novo))
  salvando.value = false
  tentou.value = false
})

const categoria = computed(() => categoriaPorSlug.get(rascunho.value.categoria)!)
const campos = computed(() => categoria.value.campos)
const campo = (refId?: string) => campoDe(rascunho.value.categoria, refId)
const tipo = computed(() => rascunho.value.visualizacao)
const ehCartao = computed(() => tipo.value === 'numero')

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

/* Trocar de tipo mantém o que cabe e limpa o que não cabe. */
watch(tipo, (v) => {
  const r = rascunho.value
  const eixo = campo(r.agruparPor)
  if (eixo && !cabeNoEixo(v, eixo)) r.agruparPor = undefined
  if (!r.agruparPor && v !== 'numero') r.agruparPor = campos.value.find(c => cabeNoEixo(v, c) && !c.sistema)?.refId ?? campos.value.find(c => cabeNoEixo(v, c))?.refId
  if (!aceitaLegenda(v)) r.quebrarPor = undefined
  if (!funcoesDa(v).includes(r.funcao)) r.funcao = 'contagem'
})

watch(() => rascunho.value.agruparPor, () => {
  const r = rascunho.value
  const eixo = campo(r.agruparPor)
  if (eixo && ehData(eixo)) r.granularidade = granularidadeSugerida(props.contexto.periodo)
  if (eixo && !eixo.options && r.ordem === 'natural') r.ordem = 'valorDesc'
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

const TIPOS: Visualizacao[] = ['numero', 'barras', 'barrasHorizontais', 'linha', 'area', 'rosca', 'funil', 'tabela']
const ICONES: Record<Visualizacao, string> = {
  numero: 'i-lucide-square-asterisk',
  barras: 'i-lucide-chart-column',
  barrasHorizontais: 'i-lucide-chart-bar',
  linha: 'i-lucide-chart-line',
  area: 'i-lucide-chart-area',
  rosca: 'i-lucide-chart-pie',
  funil: 'i-lucide-filter',
  tabela: 'i-lucide-table',
}
/** O tipo sem campo que caiba no eixo fica desligado, com o motivo no "?". */
const itensDoTipo = computed(() => TIPOS.map((v) => {
  const semCampo = v !== 'numero' && !campos.value.some(c => cabeNoEixo(v, c))
  return {
    label: props.t.construtor.visualizacoes[v],
    value: v,
    icon: ICONES[v],
    ajuda: semCampo ? props.t.construtor.tipoSemCampo(props.t.construtor.eixos[v]) : props.t.construtor.ajudaVisualizacao[v],
    disabled: semCampo,
  }
}))

const itensDaFuncao = computed<SelectItem[]>(() => funcoesDa(tipo.value).map(f => ({
  label: props.t.funcoes[f],
  value: f,
  ajuda: props.t.ajudaFuncao[f],
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
function comGrupos(lista: CampoDoMock[]): SelectMenuItem[][] {
  const daCategoria = lista.filter(c => !c.sistema).map(itemDeCampo)
  const doSistema = lista.filter(c => c.sistema).map(itemDeCampo)
  return doSistema.length
    ? [daCategoria, [{ type: 'label', label: props.t.construtor.sistema }, ...doSistema]]
    : [daCategoria]
}

const itensDaMedida = computed(() => comGrupos(rascunho.value.funcao === 'distintos'
  ? campos.value.filter(c => ehDimensao(c) || ehMedida(c))
  : campos.value.filter(ehMedida)))

const itensDoEixo = computed(() => comGrupos(campos.value.filter(c => cabeNoEixo(tipo.value, c))))

const itensDaLegenda = computed<SelectMenuItem[][]>(() => [
  [{ label: props.t.construtor.legendaNenhuma, value: NENHUM, icon: 'i-lucide-minus' }],
  ...comGrupos(campos.value.filter(c => cabeNaLegenda(c) && c.refId !== rascunho.value.agruparPor)),
])

const itensDaData = computed(() => comGrupos(campos.value.filter(ehData)))

const GRANULARIDADES: Granularidade[] = ['dia', 'semana', 'mes', 'trimestre', 'ano']
const itensDaGranularidade = computed<SelectItem[]>(() => GRANULARIDADES.map(g => ({ label: props.t.construtor.granularidades[g], value: g })))

const itensDoPeriodo = computed(() => [
  { label: props.t.construtor.periodoDashboard, value: 'dashboard', ajuda: props.t.construtor.periodoDashboardAjuda(props.rotuloDoPeriodo) },
  { label: props.t.construtor.periodoTodo, value: 'todo', ajuda: props.t.construtor.periodoTodoAjuda },
])

const itensDaOrdem = computed<SelectItem[]>(() => {
  const ordens: Ordem[] = campo(rascunho.value.agruparPor)?.options ? ['natural', 'valorDesc', 'valorAsc', 'rotulo'] : ['valorDesc', 'valorAsc', 'rotulo']
  return ordens.map(o => ({ label: props.t.construtor.ordens[o], value: o }))
})

const itensDoLimite = computed<SelectItem[]>(() => [5, 8, 10, 15, 20].map(n => ({ label: props.t.construtor.limites(n), value: n })).concat([{ label: props.t.construtor.semLimite, value: 0 }]))

const quebrarPor = computed({
  get: () => rascunho.value.quebrarPor ?? NENHUM,
  set: (v: string) => { rascunho.value.quebrarPor = v === NENHUM ? undefined : v },
})

const eixo = computed(() => campo(rascunho.value.agruparPor))
const legenda = computed(() => campo(rascunho.value.quebrarPor))
const ajudaDoEixo = computed(() => {
  const d = eixo.value
  if (d && ehMultiplo(d)) return props.t.construtor.multiploAviso
  if (d?.relacao) return props.t.construtor.relacaoAviso(categoriaPorSlug.get(d.relacao)?.name ?? '')
  return props.t.construtor.ajudaDoEixo[tipo.value]
})
const temOrdem = computed(() => !!eixo.value && !ehData(eixo.value) && tipo.value !== 'funil')

/* ---------------------------------- prévia --------------------------------- */

const frase = computed(() => props.t.frase(
  rascunho.value.funcao,
  categoria.value.name,
  rascunho.value.funcao === 'contagem' ? undefined : campo(rascunho.value.medida)?.name,
  ehCartao.value ? undefined : eixo.value?.name,
  ehCartao.value ? undefined : legenda.value?.name,
))

const faltaMedida = computed(() => rascunho.value.funcao !== 'contagem' && !rascunho.value.medida)
const faltaEixo = computed(() => !ehCartao.value && !rascunho.value.agruparPor)
const pronto = computed(() => !faltaMedida.value && !faltaEixo.value)

const cfgDaPrevia = computed<ConfigDoPainel>(() => faltaMedida.value ? { ...rascunho.value, funcao: 'contagem' } : rascunho.value)
const resultado = computed(() => agregar(cfgDaPrevia.value, props.contexto))
const serie = computed(() => ehCartao.value ? serieDoCartao(cfgDaPrevia.value, props.contexto) : undefined)

/* Toda mudança passa por um instante de carregamento: é o que o back vai custar. */
const calculando = ref(false)
let espera: ReturnType<typeof setTimeout> | undefined
watch(() => JSON.stringify(rascunho.value), () => {
  calculando.value = true
  clearTimeout(espera)
  espera = setTimeout(() => { calculando.value = false }, 280)
})

/* ---------------------------------- salvar --------------------------------- */

function salvar() {
  tentou.value = true
  if (!pronto.value) return
  salvando.value = true
  const cfg = structuredClone(toRaw(rascunho.value))
  if (ehNovo.value || props.painel?.visualizacao !== cfg.visualizacao) {
    [cfg.w, cfg.h] = TAMANHOS[cfg.visualizacao]
    if (ehNovo.value) { cfg.x = undefined; cfg.y = undefined }
  }
  setTimeout(() => {
    emit('salvar', cfg, ehNovo.value)
    aberto.value = false
  }, 450)
}

const periodoDoContexto = computed<Periodo>(() => props.contexto.periodo)

/** O número de cada seção: a de ordem só aparece em alguns tipos, e a contagem acompanha. */
type ChaveDoPasso = keyof Textos['construtor']['passos']
const passosVisiveis = computed<ChaveDoPasso[]>(() => ['fonte', 'visualizacao', 'campos', 'filtros', 'periodo', ...((temOrdem.value || tipo.value === 'barras') ? ['ordem' as const] : []), 'titulo'])
const passo = (k: ChaveDoPasso) => `${passosVisiveis.value.indexOf(k) + 1}. ${props.t.construtor.passos[k]}`
</script>

<template>
  <UModal
    v-model:open="aberto"
    :title="ehNovo ? t.construtor.tituloNovo : t.construtor.tituloEditar"
    :description="t.construtor.descricao"
    :close="{ 'aria-label': t.construtor.cancelar }"
    :ui="{ content: 'sm:max-w-6xl', body: 'p-0 sm:p-0' }"
  >
    <template #body>
      <div class="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        <!-- ─────────────── Prévia (à direita; no celular, em cima) ─────────────── -->
        <section
          class="border-b border-default bg-muted px-4 py-4 sm:px-6 lg:order-last lg:border-b-0 lg:border-l"
          :aria-label="t.construtor.previa"
        >
          <div class="lg:sticky lg:top-0">
            <p class="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted">
              <UIcon name="i-lucide-eye" class="size-3.5" />
              {{ t.construtor.previa }}
            </p>
            <div :class="ehCartao ? 'h-40 max-w-xs' : 'h-[340px]'">
              <PainelDoDashboard
                v-if="!faltaEixo"
                :t="t"
                :cfg="cfgDaPrevia"
                :resultado="resultado"
                :serie="serie"
                :estado="calculando ? 'carregando' : 'pronto'"
                previa
                :rotulo-do-periodo="rotuloDoPeriodo"
              />
              <div v-else class="flex h-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-accented p-6 text-center">
                <UIcon :name="ICONES[tipo]" class="size-8 text-dimmed" />
                <p class="text-sm text-muted">{{ t.construtor.previaSemEixo(t.construtor.eixos[tipo]) }}</p>
              </div>
            </div>
            <p class="mt-3 text-sm text-toned">{{ frase }}</p>
            <p v-if="!ehCartao && resultado.multiplo" class="mt-1 text-xs text-muted">{{ t.painel.multiplo }}</p>
          </div>
        </section>

        <!-- ─────────────── Formulário (à esquerda) ─────────────── -->
        <div class="space-y-6 px-4 py-5 sm:px-6 lg:max-h-[72vh] lg:overflow-y-auto">
          <!-- 1. Fonte de dados -->
          <section class="space-y-3">
            <h3 class="text-sm font-semibold text-highlighted">{{ passo('fonte') }}</h3>
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
          </section>

          <!-- 2. Visualização -->
          <section class="space-y-3">
            <h3 class="text-sm font-semibold text-highlighted">{{ passo('visualizacao') }}</h3>
            <UFormField :label="t.construtor.visualizacao">
              <USelect
                v-model="rascunho.visualizacao"
                :items="itensDoTipo"
                value-key="value"
                :icon="ICONES[tipo]"
                class="w-full"
                :ui="{ content: 'min-w-72' }"
              >
                <template #item-trailing="{ item }">
                  <UTooltip :text="(item as any).ajuda" :content="{ side: 'right' }">
                    <UIcon name="i-lucide-circle-help" class="size-4 text-dimmed" :aria-label="(item as any).ajuda" />
                  </UTooltip>
                </template>
              </USelect>
            </UFormField>
          </section>

          <!-- 3. Campos, nos lugares que o tipo tem -->
          <section class="space-y-3">
            <h3 class="text-sm font-semibold text-highlighted">{{ passo('campos') }}</h3>

            <UFormField
              v-if="!ehCartao"
              :label="t.construtor.eixos[tipo]"
              required
              :help="ajudaDoEixo"
              :error="tentou && faltaEixo ? t.construtor.eixoErro : undefined"
            >
              <USelectMenu
                v-model="rascunho.agruparPor"
                :items="itensDoEixo"
                value-key="value"
                :icon="eixo ? iconeDoTipo(eixo) : ICONES[tipo]"
                :placeholder="t.construtor.escolhaCampo"
                :search-input="{ placeholder: t.construtor.buscarCampo }"
                class="w-full"
              />
            </UFormField>
            <UFormField v-if="eixo && ehData(eixo)" :label="t.construtor.granularidade">
              <USelect v-model="rascunho.granularidade" :items="itensDaGranularidade" value-key="value" class="w-full sm:w-56" />
            </UFormField>

            <div class="grid gap-3 sm:grid-cols-2">
              <UFormField :label="t.construtor.valor" :help="ehCartao ? t.construtor.valorAjudaCartao : undefined">
                <USelect v-model="rascunho.funcao" :items="itensDaFuncao" value-key="value" class="w-full" :ui="{ content: 'min-w-64' }">
                  <template #item-trailing="{ item }">
                    <UTooltip :text="(item as any).ajuda" :content="{ side: 'right' }">
                      <UIcon name="i-lucide-circle-help" class="size-4 text-dimmed" :aria-label="(item as any).ajuda" />
                    </UTooltip>
                  </template>
                </USelect>
              </UFormField>
              <UFormField
                v-if="rascunho.funcao !== 'contagem'"
                :label="t.construtor.campoDoValor"
                required
                :error="tentou && faltaMedida ? (itensDaMedida.flat().length ? t.construtor.medidaErro : t.construtor.medidaVazia) : undefined"
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

            <UFormField
              v-if="aceitaLegenda(tipo) && eixo"
              :label="tipo === 'tabela' ? t.construtor.colunas : t.construtor.legenda"
              :help="legenda && ehMultiplo(legenda) ? t.construtor.multiploAviso : (tipo === 'tabela' ? t.construtor.colunasAjuda : t.construtor.legendaAjuda)"
            >
              <USelectMenu
                v-model="quebrarPor"
                :items="itensDaLegenda"
                value-key="value"
                :icon="legenda ? iconeDoTipo(legenda) : 'i-lucide-minus'"
                :search-input="{ placeholder: t.construtor.buscarCampo }"
                class="w-full"
              />
            </UFormField>
          </section>

          <!-- 4. Filtros do painel -->
          <section class="space-y-2">
            <div>
              <h3 class="text-sm font-semibold text-highlighted">{{ passo('filtros') }}</h3>
              <p class="mt-0.5 text-xs text-muted">{{ t.construtor.filtrosAjuda }}</p>
            </div>
            <div class="flex flex-wrap items-center gap-1.5">
              <ListaDeFiltros v-model="rascunho.condicoes" :t="t" :categorias="[rascunho.categoria]" variante="outline" />
            </div>
          </section>

          <!-- 5. Período -->
          <section class="space-y-3">
            <h3 class="text-sm font-semibold text-highlighted">{{ passo('periodo') }}</h3>
            <div class="grid gap-3 sm:grid-cols-2">
              <UFormField :label="t.construtor.periodo">
                <USelect v-model="rascunho.periodo" :items="itensDoPeriodo" value-key="value" class="w-full" :ui="{ content: 'min-w-64' }">
                  <template #item-trailing="{ item }">
                    <UTooltip :text="(item as any).ajuda" :content="{ side: 'right' }">
                      <UIcon name="i-lucide-circle-help" class="size-4 text-dimmed" :aria-label="(item as any).ajuda" />
                    </UTooltip>
                  </template>
                </USelect>
              </UFormField>
              <UFormField v-if="rascunho.periodo === 'dashboard'" :label="t.construtor.campoDeData" :help="t.construtor.campoDeDataAjuda">
                <USelectMenu v-model="rascunho.campoDeData" :items="itensDaData" value-key="value" icon="i-lucide-calendar" class="w-full" />
              </UFormField>
            </div>
          </section>

          <!-- 6. Ordem e limite -->
          <section v-if="temOrdem || tipo === 'barras'" class="space-y-3">
            <h3 class="text-sm font-semibold text-highlighted">{{ passo('ordem') }}</h3>
            <div v-if="temOrdem" class="grid gap-3 sm:grid-cols-2">
              <UFormField :label="t.construtor.ordem">
                <USelect v-model="rascunho.ordem" :items="itensDaOrdem" value-key="value" class="w-full" />
              </UFormField>
              <UFormField :label="t.construtor.limite" :help="t.construtor.limiteAjuda">
                <USelect v-model="rascunho.limite" :items="itensDoLimite" value-key="value" class="w-full" />
              </UFormField>
            </div>
            <USwitch v-if="tipo === 'barras'" v-model="rascunho.mostrarValores" :label="t.construtor.mostrarValores" />
          </section>

          <!-- 7. Título e descrição -->
          <section class="space-y-3">
            <h3 class="text-sm font-semibold text-highlighted">{{ passo('titulo') }}</h3>
            <UFormField :label="t.construtor.titulo" :help="t.construtor.tituloAjuda">
              <UInput v-model="rascunho.titulo" :placeholder="frase" class="w-full" />
            </UFormField>
            <UFormField :label="t.construtor.descricaoDoPainel" :help="t.construtor.descricaoAjuda">
              <UTextarea v-model="rascunho.descricao" :rows="2" autoresize :maxrows="5" :placeholder="t.construtor.descricaoPlaceholder" class="w-full" />
            </UFormField>
          </section>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex w-full items-center justify-end gap-2">
        <p v-if="tentou && !pronto" class="mr-auto text-sm text-error">{{ t.construtor.faltaAlgo }}</p>
        <UButton :label="t.construtor.cancelar" color="neutral" variant="ghost" @click="aberto = false" />
        <UButton
          :label="ehNovo ? t.construtor.adicionar : t.construtor.salvar"
          :icon="ehNovo ? 'i-lucide-plus' : 'i-lucide-check'"
          :loading="salvando"
          @click="salvar"
        />
      </div>
    </template>
  </UModal>
</template>
