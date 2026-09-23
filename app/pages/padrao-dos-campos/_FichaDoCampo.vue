<script setup lang="ts">
/**
 * A ficha do campo: o que este protótipo tem que nenhuma tela do produto tem.
 *
 * Clicar em qualquer campo, em qualquer um dos três formatos, abre esta ficha.
 * Ela responde três perguntas de uma vez:
 *
 * 1. como o tipo se desenha na célula, no formulário e no cru, com o desenho
 *    ao lado da regra escrita, renderizado sobre o valor do item que está
 *    aberto. Não é figura: é o mesmo componente que a tabela usa;
 * 2. qual é o contrato de back-end: o formato de entrada, o de saída e a saída
 *    formatada, com o valor real do item nos três estágios;
 * 3. quais chaves de `cFormat` e de `config` mexem naquele tipo, que é o que o
 *    dev precisa ler para implementar o formatador.
 *
 * ⚠️ Isto é andaime de protótipo, não é produto. A ficha existe para a
 * discussão do padrão. Ela não vai para a tela do ENSPACE.
 */
import type { Item } from '@be-enlighten/enspace-sdk-schemas'
import type { Campo } from './campos'
import type { Textos } from './textos'
import ValorDoCampo from './_ValorDoCampo.vue'
import EntradaDoCampo from './_EntradaDoCampo.vue'
import { localeDe, saidaCrua, saidaFormatada } from './formatacao'
import { opcoes as todasAsOpcoes } from './mocks'

const props = defineProps<{
  aberta: boolean
  campo: Campo | null
  /** O valor do item que estava aberto quando a ficha foi chamada. */
  valor: unknown
  /** A lista inteira, para o total da coluna do campo de moeda. */
  itens?: Item[]
  t: Textos
  idioma: string
}>()

const emit = defineEmits<{ 'update:aberta': [boolean] }>()

/**
 * O TOTAL DA COLUNA DE MOEDA, por moeda.
 *
 * Aqui mora a resposta ao custo de guardar a moeda no VALOR em vez de no campo,
 * que é como o ClickUp e o Notion fazem. Guardando no valor, a coluna pode ter
 * real e dólar na mesma tela, e somar os dois daria um número que não existe.
 *
 * A regra, decidida na rodada 9: **moedas diferentes nunca somam juntas**. Ou a
 * coluna inteira tem uma moeda só e sai um total, ou saem subtotais por moeda.
 * Nunca um número mudo.
 */
const totaisPorMoeda = computed(() => {
  if (props.campo?.tipo !== 'EnCurrency') return []
  const soma = new Map<string, number>()
  for (const item of props.itens ?? []) {
    const v = (item.data as Record<string, unknown>)?.[props.campo.refId] as
      { currency?: string, value?: number } | null
    if (!v?.currency) continue
    soma.set(v.currency, (soma.get(v.currency) ?? 0) + (v.value ?? 0))
  }
  return [...soma].map(([moeda, valor]) => ({
    moeda,
    texto: new Intl.NumberFormat(props.campo?.localeDoCampo ?? localeDe(props.idioma), {
      style: 'currency',
      currency: moeda,
      maximumFractionDigits: 2,
    }).format(valor),
  }))
})

const aberta = computed({
  get: () => props.aberta,
  set: v => emit('update:aberta', v),
})

const regra = computed(() => (props.campo ? props.t.campos[props.campo.tipo] : null))

const formatada = computed(() =>
  props.campo ? saidaFormatada(props.campo, props.valor, props.idioma, todasAsOpcoes as never) : '',
)

/** Uma cópia, porque a prévia do formulário é editável e não deve sujar o item. */
const previa = ref<unknown>(null)
watch(() => [props.campo, props.valor], () => { previa.value = props.valor }, { immediate: true })

const blocos = computed(() => {
  if (!props.campo || !regra.value) return []
  return [
    {
      chave: 'celula' as const,
      titulo: props.t.formatoCelula,
      onde: props.t.ondeApareceCelula,
      icone: 'i-lucide-table-2',
      texto: regra.value.celula,
    },
    {
      chave: 'formulario' as const,
      titulo: props.t.formatoFormulario,
      onde: props.t.ondeApareceFormulario,
      icone: 'i-lucide-square-pen',
      texto: regra.value.formulario,
    },
    {
      chave: 'cru' as const,
      titulo: props.t.formatoCru,
      onde: props.t.ondeApareceCru,
      icone: 'i-lucide-panel-right',
      texto: regra.value.cru,
    },
  ]
})
</script>

<template>
  <USlideover v-model:open="aberta" side="right" :ui="{ content: 'max-w-xl' }">
    <template #header>
      <div v-if="campo && regra" class="flex min-w-0 flex-1 items-start gap-2.5">
        <span class="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
          <UIcon :name="campo.icone" class="size-4.5" />
        </span>
        <div class="min-w-0 flex-1">
          <p class="truncate text-base font-semibold text-highlighted">{{ regra.rotulo }}</p>
          <p class="truncate font-mono text-xs text-muted">{{ campo.tipo }}</p>
        </div>
        <UButton
          icon="i-lucide-x"
          color="neutral"
          variant="ghost"
          size="sm"
          :aria-label="t.fichaFechar"
          @click="aberta = false"
        />
      </div>
    </template>

    <template #body>
      <div v-if="campo && regra" class="space-y-5">
        <p class="text-sm text-toned">{{ regra.descricao }}</p>

        <!-- A identidade do tipo -->
        <div class="flex flex-wrap items-center gap-1.5">
          <UBadge color="neutral" variant="subtle" size="sm">
            {{ t.familia }}: {{ t.familias[campo.familia] }}
          </UBadge>
          <UBadge
            :color="campo.disponibilidade === 'ativo' ? 'success' : campo.disponibilidade === 'proposto' ? 'info' : 'warning'"
            variant="subtle"
            size="sm"
          >
            {{ campo.disponibilidade === 'ativo'
              ? t.tipoAtivo
              : campo.disponibilidade === 'proposto' ? t.tipoProposto : t.tipoLegado }}
          </UBadge>
          <UBadge color="neutral" variant="outline" size="sm">
            {{ t.alinhamento }}:
            {{ campo.alinhamento === 'fim' ? t.alinhamentoFim : t.alinhamentoInicio }}
          </UBadge>
          <UBadge color="neutral" variant="outline" size="sm">
            {{ t.larguraMinima }}: {{ campo.largura }}px
          </UBadge>
        </div>

        <!--
          O total da coluna, só no campo de moeda. Ver o comentário do
          `totaisPorMoeda`: moedas diferentes nunca somam juntas.
        -->
        <div v-if="totaisPorMoeda.length" class="rounded-lg border border-default p-3">
          <p class="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-highlighted">
            <UIcon name="i-lucide-sigma" class="size-4 shrink-0 text-muted" />
            {{ t.totalDaColuna }}
          </p>
          <div class="flex flex-wrap gap-1.5">
            <UBadge
              v-for="total in totaisPorMoeda"
              :key="total.moeda"
              color="neutral"
              variant="subtle"
              size="sm"
              class="tabular-nums"
            >
              {{ total.texto }}
            </UBadge>
          </div>
          <p class="mt-1.5 text-xs text-muted">{{ t.totalPorMoeda }}</p>
        </div>

        <!--
          O que faz salvar. É a pergunta que ela fez sobre todos os campos, e
          a resposta muda por tipo: por isso ela mora no catálogo, e não num
          texto genérico de tela.
        -->
        <p class="flex items-center gap-1.5 text-xs text-muted">
          <UIcon
            :name="campo.comoSalva === 'naoSeAplica' ? 'i-lucide-lock' : 'i-lucide-save'"
            class="size-3.5 shrink-0"
          />
          <span>
            <span class="font-medium text-toned">{{ t.comoSalva }}:</span>
            {{ t.comoSalvaTextos[campo.comoSalva] }}
          </span>
        </p>

        <UAlert
          v-if="campo.disponibilidade === 'legado'"
          color="warning"
          variant="subtle"
          icon="i-lucide-triangle-alert"
          :description="t.tipoLegadoAviso"
        />
        <UAlert
          v-else-if="campo.disponibilidade === 'proposto'"
          color="info"
          variant="subtle"
          icon="i-lucide-lightbulb"
          :description="t.tipoPropostoAviso"
        />

        <!-- ──────── as configurações que o tipo tem no develop ─────────── -->
        <div class="rounded-lg border border-default">
          <div class="flex items-center gap-2 border-b border-default bg-elevated/40 px-3 py-2">
            <UIcon name="i-lucide-sliders-horizontal" class="size-4 shrink-0 text-muted" />
            <span class="text-sm font-semibold text-highlighted">{{ t.configuracoesDoTipo }}</span>
            <span class="text-xs text-muted">{{ t.configuracoesOnde }}</span>
          </div>
          <div class="p-3">
            <div v-if="campo.configuracoes.length" class="flex flex-wrap gap-1">
              <UBadge
                v-for="c in campo.configuracoes"
                :key="c"
                color="neutral"
                variant="subtle"
                size="sm"
              >
                {{ c }}
              </UBadge>
            </div>
            <p v-else class="text-sm text-muted">{{ t.semConfiguracaoPropria }}</p>
          </div>
        </div>

        <!-- ─────────────── os três formatos, regra e desenho ─────────────── -->
        <div v-for="bloco in blocos" :key="bloco.chave" class="rounded-lg border border-default">
          <div class="flex items-center gap-2 border-b border-default bg-elevated/40 px-3 py-2">
            <UIcon :name="bloco.icone" class="size-4 shrink-0 text-muted" />
            <span class="text-sm font-semibold text-highlighted">{{ bloco.titulo }}</span>
            <span class="text-xs text-muted">{{ bloco.onde }}</span>
          </div>
          <p class="px-3 pt-2.5 text-sm text-toned">{{ bloco.texto }}</p>

          <!-- O desenho, feito pelo mesmo componente que a tela usa -->
          <div class="m-3 rounded-md border border-dashed border-default bg-elevated/20 p-2.5">
            <ValorDoCampo
              v-if="bloco.chave !== 'formulario'"
              :campo="campo"
              :valor="valor"
              :formato="bloco.chave"
              :t="t"
              :idioma="idioma"
            />
            <EntradaDoCampo
              v-else
              v-model="previa"
              :campo="campo"
              :t="t"
              :idioma="idioma"
            />
          </div>
        </div>

        <!-- ───────────────────── o contrato de back-end ──────────────────── -->
        <div class="rounded-lg border border-default">
          <div class="flex items-center gap-2 border-b border-default bg-elevated/40 px-3 py-2">
            <UIcon name="i-lucide-database" class="size-4 shrink-0 text-muted" />
            <span class="text-sm font-semibold text-highlighted">{{ t.backend }}</span>
          </div>

          <dl class="divide-y divide-default">
            <div class="px-3 py-2.5">
              <dt class="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-dimmed">
                <UIcon name="i-lucide-arrow-down-to-line" class="size-3" />
                {{ t.formatoDeEntrada }}
              </dt>
              <dd class="mt-1 whitespace-pre-wrap break-words font-mono text-xs text-highlighted">
                {{ campo.backend.entrada }}
              </dd>
            </div>

            <div class="px-3 py-2.5">
              <dt class="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-dimmed">
                <UIcon name="i-lucide-arrow-up-from-line" class="size-3" />
                {{ t.formatoDeSaida }}
              </dt>
              <dd class="mt-1 whitespace-pre-wrap break-words font-mono text-xs text-highlighted">
                {{ campo.backend.saida }}
              </dd>
              <!-- E o valor deste item, do jeito que a API devolveria -->
              <dd class="mt-1.5 overflow-x-auto rounded bg-elevated/60 p-2">
                <pre class="whitespace-pre-wrap break-words font-mono text-[11px] leading-snug text-muted">{{ saidaCrua(valor) }}</pre>
              </dd>
            </div>

            <div class="px-3 py-2.5">
              <dt class="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-dimmed">
                <UIcon name="i-lucide-sparkles" class="size-3" />
                {{ t.saidaFormatada }}
              </dt>
              <dd class="mt-1 whitespace-pre-wrap break-words font-mono text-xs text-highlighted">
                {{ campo.backend.formatada }}
              </dd>
              <dd class="mt-1.5 rounded bg-primary/5 p-2 text-sm text-highlighted">
                {{ formatada || t.vazio }}
              </dd>
            </div>

            <div class="px-3 py-2.5">
              <dt class="text-[10px] font-semibold uppercase tracking-wide text-dimmed">
                {{ t.chavesDeFormato }}
              </dt>
              <dd class="mt-1 flex flex-wrap gap-1">
                <UBadge
                  v-for="k in campo.backend.cFormat"
                  :key="k"
                  color="neutral"
                  variant="subtle"
                  size="sm"
                  class="font-mono text-[11px]"
                >
                  {{ k }}
                </UBadge>
                <span v-if="!campo.backend.cFormat.length" class="text-sm text-dimmed">{{ t.nenhumaChave }}</span>
              </dd>
            </div>

            <div class="px-3 py-2.5">
              <dt class="text-[10px] font-semibold uppercase tracking-wide text-dimmed">
                {{ t.chavesDeConfig }}
              </dt>
              <dd class="mt-1 flex flex-wrap gap-1">
                <UBadge
                  v-for="k in campo.backend.config"
                  :key="k"
                  color="neutral"
                  variant="subtle"
                  size="sm"
                  class="font-mono text-[11px]"
                >
                  {{ k }}
                </UBadge>
                <span v-if="!campo.backend.config.length" class="text-sm text-dimmed">{{ t.nenhumaChave }}</span>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <UEmpty
        v-else
        icon="i-lucide-mouse-pointer-click"
        :title="t.fichaTitulo"
        :description="t.fichaVazia"
      />
    </template>
  </USlideover>
</template>
