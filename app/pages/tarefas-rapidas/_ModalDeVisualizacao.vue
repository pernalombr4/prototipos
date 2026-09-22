<script setup lang="ts">
/**
 * O formulário da visualização.
 *
 * ⚠️ A CASCA É A DE HOJE, copiada do develop em 22/09/2026, em
 * `/workspaces/teste-ux/tasks/quick` › `+ Visualizar`. As mesmas seções, na
 * mesma ordem, com os mesmos rótulos: identidade (nome, descrição, ícone,
 * tipo), a configuração do kanban, Filtros e Visibilidade, e o rodapé com
 * Cancelar e Salvar. O que está registrado item por item no BRIEFING.
 *
 * **O que muda, e por quê.** A proposta do quadro criou coisas que a
 * configuração de hoje não tem onde guardar (rodada 22 do DECISOES):
 *
 *   1. agrupar por TIPO e por PRAZO, que hoje só aceita situação, responsável
 *      e prioridade;
 *   2. o SENTIDO da ordenação, que hoje não existe;
 *   3. o TAMANHO do cartão;
 *   4. o que o cartão mostra, que aqui é uma lista de peças que se ligam, e
 *      não os cinco slots por posição (cabeçalho, conteúdo, tags, utilizador,
 *      data);
 *   5. as três configurações que são POR RAIA: limite de cartões,
 *      totalizador e ordem própria. Elas não cabem num campo único, então
 *      viraram uma tabela com uma linha por raia.
 *
 * **A decisão que não é minha** está no bloco "Campos personalizados": o
 * construtor por posição continua existindo para o campo que o produto não
 * conhece. Ou isso, ou o construtor de hoje vira só a lista de peças e perde
 * o campo personalizado. Está no DECISOES, esperando a Mikaela.
 */
import type { Textos } from './textos'
import type { ChaveAgrupamento, ChaveOrdenacao } from './quadro'
import { iconeDoTipo, ordenacoes } from './quadro'
import type { Calculo, CampoCalculavel } from './quadro'
import { visualizacoes } from './mocks'

const props = defineProps<{
  t: Textos
  /** Quando vem preenchido, o formulário abre em modo de edição. */
  editando?: string | null
  /** O que está no quadro agora, para a proposta de trazer o estado da barra. */
  doQuadro: {
    agrupamento: ChaveAgrupamento
    ordenacao: ChaveOrdenacao
    ordenacaoDesc: boolean
    densidade: 'pequeno' | 'medio' | 'grande'
    campos: Record<string, boolean>
    raias: { valor: string, rotulo: string }[]
    limites: Record<string, number | null>
    calculos: Record<string, Calculo | undefined>
  }
  camposDoTotalizador: CampoCalculavel[]
}>()

const emit = defineEmits<{ fechar: [], salvar: [] }>()

const aberto = defineModel<boolean>('open', { required: true })

/* ------------------------------ identidade ------------------------------ */
const nome = ref('')
const descricao = ref('')
const icone = ref('')
const tipo = ref<'tabela' | 'kanban'>('kanban')

/* --------------------------- configuração ---------------------------- */
const agrupamento = ref<ChaveAgrupamento>('status')
const ordenacao = ref<ChaveOrdenacao>('due_date')
const desc = ref(false)
const densidade = ref<'pequeno' | 'medio' | 'grande'>('medio')
const campos = ref<Record<string, boolean>>({})
const limites = ref<Record<string, number | null>>({})
const calculos = ref<Record<string, Calculo | undefined>>({})
const ordemPorRaia = ref<Record<string, ChaveOrdenacao | ''>>({})

/** Quem abre o formulário parte do que está no quadro, e não do zero. */
function partirDoQuadro() {
  agrupamento.value = props.doQuadro.agrupamento
  ordenacao.value = props.doQuadro.ordenacao
  desc.value = props.doQuadro.ordenacaoDesc
  densidade.value = props.doQuadro.densidade
  campos.value = { ...props.doQuadro.campos }
  limites.value = { ...props.doQuadro.limites }
  calculos.value = { ...props.doQuadro.calculos }
  ordemPorRaia.value = {}
}

watch(aberto, (v) => {
  if (!v) return
  const atual = props.editando ? visualizacoes.find(x => x.id === props.editando) : null
  nome.value = atual?.nome ?? ''
  descricao.value = ''
  icone.value = atual?.icone ?? ''
  tipo.value = 'kanban'
  partirDoQuadro()
}, { immediate: true })

/**
 * Agrupar por: as três de hoje mais TIPO e PRAZO. A do produto só tem as três
 * primeiras, e é por isso que ver o quadro por prazo exige criar outra tela.
 */
const agrupamentos = computed<{ value: ChaveAgrupamento, label: string, novo?: boolean }[]>(() => [
  { value: 'status', label: props.t.campos.status },
  { value: 'assigned_to', label: props.t.campos.responsavel },
  { value: 'priority', label: props.t.campos.prioridade },
  { value: 'type', label: props.t.campos.tipo, novo: true },
  { value: 'due_date', label: props.t.campos.prazo, novo: true },
])

const opcoesDeOrdem = computed(() =>
  ordenacoes.map(o => ({ value: o.valor, label: props.t.campos[o.rotulo] })))

const opcoesDeOrdemDaRaia = computed(() => [
  { value: '', label: props.t.vis.comoNoQuadro },
  ...opcoesDeOrdem.value,
])

/**
 * As peças do cartão, com o ícone que cada uma tem na tela. É a mesma lista
 * que a barra do quadro liga e desliga, e é de propósito: o formulário define
 * o começo, a barra ajusta depois.
 */
const pecas = computed(() => [
  { chave: 'tipo', icone: iconeDoTipo.form, rotulo: props.t.campos.tipo },
  { chave: 'referencia', icone: 'i-lucide-fingerprint', rotulo: props.t.campos.referencia },
  { chave: 'descricao', icone: 'i-lucide-align-left', rotulo: props.t.campos.descricao },
  { chave: 'item', icone: 'i-lucide-link', rotulo: props.t.campos.item },
  { chave: 'etiquetas', icone: 'i-lucide-tags', rotulo: props.t.campos.etiquetas },
  { chave: 'prioridade', icone: 'i-lucide-flag', rotulo: props.t.campos.prioridade },
  { chave: 'prazo', icone: 'i-lucide-calendar-clock', rotulo: props.t.campos.prazo },
  { chave: 'pontos', icone: 'i-lucide-chart-no-axes-column', rotulo: props.t.campos.pontos },
  { chave: 'tempo', icone: 'i-lucide-timer', rotulo: props.t.campos.tempoRegistrado },
  { chave: 'criador', icone: 'i-lucide-pen-line', rotulo: props.t.campos.criadoPor },
  { chave: 'colaboradores', icone: 'i-lucide-users', rotulo: props.t.campos.colaboradores },
  { chave: 'responsavel', icone: 'i-lucide-user', rotulo: props.t.campos.responsavel },
])

const tamanhos = computed(() => [
  { value: 'pequeno' as const, label: props.t.densidades.pequeno },
  { value: 'medio' as const, label: props.t.densidades.medio },
  { value: 'grande' as const, label: props.t.densidades.grande },
])

/** As raias saem do agrupamento escolhido, então a tabela muda com ele. */
const raias = computed(() => props.doQuadro.raias)

const opcoesDoTotalizador = computed(() => [
  { value: '', label: props.t.calculos.nenhum },
  { value: 'contagem', label: props.t.calculos.contagem },
  ...props.camposDoTotalizador.map(c => ({ value: c.chave, label: c.rotulo })),
])

function totalDaRaia(valor: string) {
  const c = calculos.value[valor]
  if (!c) return ''
  return c.operacao === 'preenchidos' && c.campo === 'contagem' ? 'contagem' : c.campo
}

function definirTotal(valor: string, campo: string) {
  if (!campo) { calculos.value = { ...calculos.value, [valor]: undefined }; return }
  const operacao = campo === 'contagem' ? 'preenchidos' : 'soma'
  calculos.value = { ...calculos.value, [valor]: { campo, operacao } as Calculo }
}

function aplicarTotalATodas(campo: string) {
  const novo: Record<string, Calculo | undefined> = {}
  for (const r of raias.value) {
    novo[r.valor] = campo
      ? { campo, operacao: campo === 'contagem' ? 'preenchidos' : 'soma' } as Calculo
      : undefined
  }
  calculos.value = novo
}

const titulo = computed(() => props.editando ? props.t.vis.tituloEditar : props.t.vis.tituloNova)
</script>

<template>
  <UModal
    v-model:open="aberto"
    :title="titulo"
    :ui="{ content: 'max-w-3xl', body: 'max-h-[70vh] overflow-y-auto' }"
  >
    <template #body>
      <div class="space-y-5">
        <!-- ─────────── Identidade: igual ao produto ─────────── -->
        <div class="space-y-4 rounded-lg border border-default p-4">
          <div>
            <label for="vis-nome" class="text-sm font-medium text-highlighted">
              {{ t.vis.nome }} <span class="text-error">*</span>
            </label>
            <p class="mb-1.5 text-xs text-muted">{{ t.vis.nomeAjuda }}</p>
            <UInput id="vis-nome" v-model="nome" :placeholder="t.vis.nomePlaceholder" class="w-full" />
          </div>

          <div>
            <label for="vis-desc" class="mb-1.5 block text-sm font-medium text-highlighted">
              {{ t.vis.descricao }}
            </label>
            <UTextarea
              id="vis-desc"
              v-model="descricao"
              :placeholder="t.vis.descricaoPlaceholder"
              :rows="2"
              class="w-full"
            />
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <label for="vis-icone" class="mb-1.5 block text-sm font-medium text-highlighted">
                {{ t.vis.icone }} <span class="text-error">*</span>
              </label>
              <USelect
                id="vis-icone"
                v-model="icone"
                :items="[
                  { value: 'i-lucide-layout-dashboard', label: 'Quadro' },
                  { value: 'i-lucide-user', label: t.campos.responsavel },
                  { value: 'i-lucide-package', label: 'Produto' },
                  { value: 'i-lucide-code', label: 'Dev' },
                ]"
                value-key="value"
                :placeholder="t.vis.iconePlaceholder"
                :icon="icone || undefined"
                class="w-full"
              />
            </div>

            <div>
              <span class="mb-1.5 block text-sm font-medium text-highlighted">
                {{ t.vis.tipo }} <span class="text-error">*</span>
              </span>
              <div class="flex gap-2" role="radiogroup" :aria-label="t.vis.tipo">
                <UButton
                  :label="t.vis.tabela"
                  icon="i-lucide-table"
                  size="sm"
                  class="flex-1 justify-center"
                  role="radio"
                  :aria-checked="tipo === 'tabela'"
                  :color="tipo === 'tabela' ? 'primary' : 'neutral'"
                  :variant="tipo === 'tabela' ? 'subtle' : 'outline'"
                  @click="tipo = 'tabela'"
                />
                <UButton
                  :label="t.vis.kanban"
                  icon="i-lucide-columns-3"
                  size="sm"
                  class="flex-1 justify-center"
                  role="radio"
                  :aria-checked="tipo === 'kanban'"
                  :color="tipo === 'kanban' ? 'primary' : 'neutral'"
                  :variant="tipo === 'kanban' ? 'subtle' : 'outline'"
                  @click="tipo = 'kanban'"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- ─────────── O kanban ─────────── -->
        <div v-if="tipo === 'kanban'" class="space-y-4 rounded-lg border border-default p-4">
          <p class="text-sm text-muted">{{ t.vis.cartoesAjuda }}</p>

          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <label for="vis-agrupar" class="text-sm font-medium text-highlighted">{{ t.vis.agruparPor }}</label>
              <p class="mb-1.5 text-xs text-muted">{{ t.vis.agruparAjuda }}</p>
              <USelect
                id="vis-agrupar"
                v-model="agrupamento"
                :items="agrupamentos"
                value-key="value"
                :placeholder="t.vis.agruparPlaceholder"
                class="w-full"
              />
            </div>

            <div>
              <label for="vis-ordenar" class="mb-1.5 block text-sm font-medium text-highlighted">
                {{ t.vis.ordenarPor }}
              </label>
              <div class="flex gap-2">
                <USelect
                  id="vis-ordenar"
                  v-model="ordenacao"
                  :items="opcoesDeOrdem"
                  value-key="value"
                  class="flex-1"
                />
                <!-- O sentido não existe na configuração de hoje -->
                <UButton
                  :label="desc ? t.decrescente : t.crescente"
                  :icon="desc ? 'i-lucide-arrow-down-wide-narrow' : 'i-lucide-arrow-up-narrow-wide'"
                  color="neutral"
                  variant="outline"
                  :aria-label="t.vis.sentido"
                  @click="desc = !desc"
                />
              </div>
            </div>
          </div>

          <!-- O cartão: peças que se ligam, no lugar dos cinco slots -->
          <div class="rounded-lg border border-default">
            <div class="flex flex-wrap items-center gap-3 border-b border-default px-3 py-2">
              <h3 class="text-sm font-medium text-highlighted">{{ t.vis.oCartao }}</h3>
              <div class="ml-auto flex items-center gap-2">
                <span class="text-xs text-muted">{{ t.vis.tamanho }}</span>
                <UButton
                  v-for="d in tamanhos"
                  :key="d.value"
                  :label="d.label"
                  size="xs"
                  :color="densidade === d.value ? 'primary' : 'neutral'"
                  :variant="densidade === d.value ? 'subtle' : 'ghost'"
                  @click="densidade = d.value"
                />
              </div>
            </div>

            <div class="px-3 py-3">
              <p class="mb-2 text-xs leading-relaxed text-muted">{{ t.vis.pecasAjuda }}</p>
              <div class="grid gap-x-4 gap-y-2 sm:grid-cols-2">
                <label
                  v-for="peca in pecas"
                  :key="peca.chave"
                  class="flex cursor-pointer items-center gap-2 rounded-md px-1.5 py-1 transition-colors hover:bg-elevated"
                >
                  <USwitch
                    :model-value="campos[peca.chave] ?? false"
                    size="xs"
                    @update:model-value="(v) => campos = { ...campos, [peca.chave]: v }"
                  />
                  <UIcon :name="peca.icone" class="size-4 shrink-0 text-muted" />
                  <span class="text-sm text-toned">{{ peca.rotulo }}</span>
                </label>
              </div>
            </div>

            <!-- O construtor por posição do produto, para o que o produto não conhece -->
            <div class="border-t border-default px-3 py-3">
              <h4 class="text-xs font-semibold uppercase tracking-wide text-muted">
                {{ t.vis.personalizados }}
              </h4>
              <p class="mb-2 mt-0.5 text-xs text-muted">{{ t.vis.personalizadosAjuda }}</p>
              <div class="space-y-1 rounded-md border border-dashed border-default p-2">
                <p
                  v-for="slot in [t.vis.definirCabecalho, t.vis.definirConteudo, t.vis.definirTags, t.vis.definirUtilizador, t.vis.definirData]"
                  :key="slot"
                  class="rounded px-2 py-1 text-sm italic text-dimmed transition-colors hover:bg-elevated"
                >
                  {{ slot }}
                </p>
              </div>
            </div>
          </div>

          <!-- As raias: o que é de cada uma, e não do quadro -->
          <div class="rounded-lg border border-default">
            <div class="border-b border-default px-3 py-2">
              <h3 class="text-sm font-medium text-highlighted">{{ t.vis.raias }}</h3>
              <p class="mt-0.5 text-xs leading-relaxed text-muted">{{ t.vis.raiasAjuda }}</p>
            </div>

            <div v-if="!raias.length" class="px-3 py-4 text-sm text-muted">
              {{ t.vis.escolhaAgrupamento }}
            </div>

            <table v-else class="w-full text-sm">
              <thead>
                <tr class="border-b border-default text-left text-xs uppercase tracking-wide text-muted">
                  <th class="px-3 py-1.5 font-medium">{{ t.vis.raiaColuna }}</th>
                  <th class="px-3 py-1.5 font-medium">{{ t.vis.limiteColuna }}</th>
                  <th class="px-3 py-1.5 font-medium">{{ t.vis.totalColuna }}</th>
                  <th class="px-3 py-1.5 font-medium">{{ t.vis.ordemColuna }}</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-default">
                <tr v-for="raia in raias" :key="raia.valor">
                  <td class="px-3 py-1.5 text-toned">{{ raia.rotulo }}</td>
                  <td class="px-3 py-1.5">
                    <UInput
                      type="number"
                      :model-value="limites[raia.valor] ?? undefined"
                      :placeholder="t.vis.semLimite"
                      size="xs"
                      class="w-24"
                      @update:model-value="(v) => limites = { ...limites, [raia.valor]: v ? Number(v) : null }"
                    />
                  </td>
                  <td class="px-3 py-1.5">
                    <USelect
                      :model-value="totalDaRaia(raia.valor)"
                      :items="opcoesDoTotalizador"
                      value-key="value"
                      size="xs"
                      class="w-44"
                      @update:model-value="(v) => definirTotal(raia.valor, String(v))"
                    />
                  </td>
                  <td class="px-3 py-1.5">
                    <USelect
                      :model-value="ordemPorRaia[raia.valor] ?? ''"
                      :items="opcoesDeOrdemDaRaia"
                      value-key="value"
                      size="xs"
                      class="w-40"
                      @update:model-value="(v) => ordemPorRaia = { ...ordemPorRaia, [raia.valor]: v as ChaveOrdenacao | '' }"
                    />
                  </td>
                </tr>
              </tbody>
            </table>

            <div v-if="raias.length" class="flex items-center gap-2 border-t border-default px-3 py-2">
              <span class="text-xs text-muted">{{ t.vis.aplicarATodas }}</span>
              <USelect
                :items="opcoesDoTotalizador"
                value-key="value"
                size="xs"
                class="w-44"
                :placeholder="t.calculadora"
                @update:model-value="(v) => aplicarTotalATodas(String(v))"
              />
            </div>
          </div>

          <!-- O que a pessoa já mexeu no quadro -->
          <UAlert
            icon="i-lucide-arrow-down-to-line"
            color="primary"
            variant="subtle"
            :title="t.vis.daBarra"
            :description="t.vis.daBarraAjuda"
            :actions="[{ label: t.vis.trazerDaBarra, color: 'primary', variant: 'soft', onClick: partirDoQuadro }]"
          />
        </div>

        <!-- ─────────── Filtros: igual ao produto ─────────── -->
        <div class="rounded-lg border border-default">
          <h3 class="flex items-center gap-2 border-b border-default px-3 py-2 text-sm font-medium text-highlighted">
            <UIcon name="i-lucide-filter" class="size-4 text-muted" />
            {{ t.vis.filtros }}
          </h3>
          <div class="space-y-3 p-3">
            <div>
              <p class="mb-1.5 text-sm text-toned">{{ t.vis.filtrosAutomaticos }}</p>
              <div class="flex justify-center rounded-md border border-dashed border-default py-3">
                <UButton :label="t.vis.adicionar" icon="i-lucide-plus" size="xs" color="neutral" variant="soft" />
              </div>
            </div>
            <div>
              <p class="mb-1.5 text-sm text-toned">{{ t.vis.filtrosPersonalizados }}</p>
              <div class="flex justify-center rounded-md border border-dashed border-default py-3">
                <UButton :label="t.vis.adicionar" icon="i-lucide-plus" size="xs" color="neutral" variant="soft" />
              </div>
            </div>
          </div>
        </div>

        <!-- ─────────── Visibilidade: igual ao produto ─────────── -->
        <div class="rounded-lg border border-default">
          <h3 class="flex items-center gap-2 border-b border-default px-3 py-2 text-sm font-medium text-highlighted">
            <UIcon name="i-lucide-eye" class="size-4 text-muted" />
            {{ t.vis.visibilidade }}
          </h3>
          <div class="space-y-3 p-3">
            <p class="text-sm text-muted">{{ t.vis.visibilidadeAjuda }}</p>
            <div class="grid gap-4 sm:grid-cols-2">
              <div>
                <label for="vis-grupos" class="text-sm font-medium text-highlighted">{{ t.vis.grupos }}</label>
                <p class="mb-1.5 text-xs text-muted">{{ t.vis.gruposAjuda }}</p>
                <USelect id="vis-grupos" :items="[]" :placeholder="t.selecione" size="sm" class="w-full" />
              </div>
              <div>
                <label for="vis-funcoes" class="text-sm font-medium text-highlighted">{{ t.vis.funcoes }}</label>
                <p class="mb-1.5 text-xs text-muted">{{ t.vis.funcoesAjuda }}</p>
                <USelect id="vis-funcoes" :items="[]" :placeholder="t.selecione" size="sm" class="w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex w-full justify-end gap-2">
        <UButton :label="t.cancelar" color="neutral" variant="ghost" @click="emit('fechar')" />
        <UButton
          :label="editando ? t.vis.salvarEdicao : t.vis.salvar"
          color="primary"
          :disabled="!nome.trim()"
          @click="emit('salvar')"
        />
      </div>
    </template>
  </UModal>
</template>
