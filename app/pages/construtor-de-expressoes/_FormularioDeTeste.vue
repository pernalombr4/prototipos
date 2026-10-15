<script setup lang="ts">
/**
 * PROPOSTA: o formulário de teste. Substitui a "Pré-visualização do campo",
 * que no develop mostra o Valor Virtual sozinho e "[object Object]" (print
 * develop-01). Aqui o campo calcula no meio dos campos que ele usa, como no
 * Novo registro: preencheu Quantidade, o Total muda.
 *
 * O cálculo é o de verdade:
 *   - modo hoje: o motor do develop portado (`motor-hoje.ts`). Recalcula só
 *     quando muda um campo que o develop enxerga na expressão (`camposQueDisparam`);
 *   - modo proposta: `motor-proposta.ts`, que recalcula com qualquer campo usado.
 * O mesmo componente é o modal "Novo registro" da lista de Orçamentos.
 */
import type { Textos } from './textos'
import { type Formato, type Modo, clonar } from './arvore'
import { type CampoMock, CAMPO_VIRTUAL, CENARIOS, HOJE, type Valores } from './mocks'
import { calcularHoje, camposQueDisparam, formatar } from './motor-hoje'
import { calcularProposta } from './motor-proposta'

const props = defineProps<{
  t: Textos
  modo: Modo
  expressao: string
  formato: Formato | null
  campos: CampoMock[]
  completa: boolean
  /** Na gaveta, mostra os cenários e destaca os campos usados. */
  comAndaime?: boolean
}>()

const valores = defineModel<Valores>({ required: true })

/* ---------- quais campos disparam o cálculo ---------- */

const disparam = computed<string[]>(() => {
  if (props.modo === 'hoje') {
    return [...new Set(camposQueDisparam(props.expressao)
      .filter(r => r.startsWith('data.'))
      .map(r => r.slice(5).split('.')[0]!.replace(/\[\*\]$/, '')))]
  }
  return [...new Set([...props.expressao.matchAll(/data\.(\w+)/g)].map(m => m[1]!))]
})

const nomesQueDisparam = computed(() => disparam.value.map(r => props.campos.find(c => c.refId === r)?.name ?? r))

/* ---------- o cálculo ---------- */

interface Resultado { exibido: string, gravado: string, erro: string | null }

function calcular(): Resultado {
  if (!props.expressao.trim()) return { exibido: '', gravado: '', erro: null }
  const contexto = { data: clonar(valores.value) }
  if (props.modo === 'hoje') {
    return {
      exibido: calcularHoje(props.expressao, contexto, { hoje: HOJE }),
      gravado: calcularHoje(props.expressao, contexto, { hoje: HOJE, returnRaw: true }),
      erro: null,
    }
  }
  const r = calcularProposta(props.expressao, contexto, HOJE)
  if (r.erro) return { exibido: '', gravado: '', erro: r.erro }
  const bruto = r.valor === null || r.valor === undefined ? '' : typeof r.valor === 'boolean' ? (r.valor ? props.t.formulario.sim : props.t.formulario.nao) : String(r.valor)
  const f = props.formato
  let exibido = bruto
  if (f && bruto !== '') {
    exibido = f.tipo === 'data'
      ? formatar(bruto, { type: 'date', d_style: f.estiloData ?? 'short' })
      : formatar(Number(r.valor) * (f.tipo === 'percentual' ? 100 : 1), {
          type: 'number',
          n_style: f.tipo === 'moeda' ? 'currency' : f.tipo === 'percentual' ? 'percent' : 'decimal',
          n_currency: f.moeda ?? 'BRL',
          n_minimumFractionDigits: f.casas,
          n_maximumFractionDigits: f.casas,
        })
  }
  else if (typeof r.valor === 'number') {
    exibido = formatar(r.valor, { type: 'number', n_maximumFractionDigits: 4 })
  }
  return { exibido, gravado: bruto, erro: null }
}

const resultado = ref<Resultado>(calcular())
const pulso = ref(0)

function recalcular() {
  const novo = calcular()
  if (novo.exibido !== resultado.value.exibido || novo.erro !== resultado.value.erro) pulso.value++
  resultado.value = novo
}

// Como o develop: só os campos que a expressão "enxerga" disparam o cálculo.
watch(() => JSON.stringify(disparam.value.map(r => valores.value[r])), recalcular)
watch(() => [props.expressao, props.modo, props.formato], recalcular, { deep: true })

/* ---------- os campos ---------- */

function cenario(nome: keyof typeof CENARIOS) {
  valores.value = structuredClone(CENARIOS[nome])
}

function mudar(ref: string, v: unknown) {
  valores.value = { ...valores.value, [ref]: v }
}

function mudarLinha(lista: string, i: number, col: string, v: unknown) {
  const linhas = [...(valores.value[lista] ?? [])]
  linhas[i] = { ...linhas[i], [col]: v }
  mudar(lista, linhas)
}

function adicionarLinha(campo: CampoMock) {
  const vazia = Object.fromEntries((campo.colunas ?? []).map(c => [c.refId, c.tipo === 'numero' ? null : '']))
  mudar(campo.refId, [...(valores.value[campo.refId] ?? []), vazia])
}

function removerLinha(lista: string, i: number) {
  mudar(lista, (valores.value[lista] ?? []).filter((_: unknown, j: number) => j !== i))
}

const usado = (ref: string) => props.comAndaime && disparam.value.includes(ref)

const valorDoVirtual = computed(() => {
  if (!props.completa) return props.t.formulario.incompleta
  if (resultado.value.erro) return props.t.formulario.erros[resultado.value.erro] ?? props.t.formulario.erros.outro
  return resultado.value.exibido
})

const virtualComProblema = computed(() => !props.completa || !!resultado.value.erro
  || /Expression Processing Error|NaN|\[object Object\]|Infinity/.test(resultado.value.exibido))
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- Cenários (andaime da gaveta) -->
    <div v-if="comAndaime" class="flex flex-wrap items-center gap-1.5">
      <span class="text-xs text-muted">{{ t.formulario.cenario }}</span>
      <UTooltip v-for="(_, nome) in CENARIOS" :key="nome" :text="t.formulario.cenariosAjuda[nome] || t.formulario.cenarios[nome]">
        <UButton :label="t.formulario.cenarios[nome]" size="xs" color="neutral" variant="outline" class="transition-transform hover:-translate-y-0.5" @click="cenario(nome)" />
      </UTooltip>
    </div>

    <div class="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
      <template v-for="campo in campos" :key="campo.refId">
        <!-- Lista (repetidor): linha inteira -->
        <UFormField
          v-if="campo.tipo === 'lista'"
          :label="campo.name"
          class="sm:col-span-2"
          :ui="{ container: 'mt-1.5' }"
        >
          <template v-if="usado(campo.refId)" #hint>
            <UBadge :label="t.formulario.usado" icon="i-lucide-link" color="primary" variant="soft" size="sm" />
          </template>
          <div class="overflow-x-auto rounded-lg border border-default" :class="usado(campo.refId) ? 'ring-1 ring-primary/40' : ''">
            <table class="w-full min-w-[30rem] text-sm">
              <thead class="bg-elevated/60 text-xs text-muted">
                <tr>
                  <th v-for="col in campo.colunas" :key="col.refId" class="px-2 py-1.5 text-left font-medium">{{ col.name }}</th>
                  <th class="w-8" />
                </tr>
              </thead>
              <TransitionGroup tag="tbody" enter-active-class="transition duration-200" enter-from-class="opacity-0" leave-active-class="transition duration-150" leave-to-class="opacity-0">
                <tr v-for="(linha, i) in valores[campo.refId] ?? []" :key="i" class="border-t border-default">
                  <td v-for="col in campo.colunas" :key="col.refId" class="px-1.5 py-1">
                    <UInputNumber
                      v-if="col.tipo === 'numero'"
                      :model-value="linha[col.refId] ?? undefined"
                      locale="pt-BR"
                      :step-snapping="false"
                      :format-options="{ maximumFractionDigits: 2 }"
                      size="xs"
                      :increment="false"
                      :decrement="false"
                      class="w-full"
                      @update:model-value="(v) => mudarLinha(campo.refId, i, col.refId, v ?? null)"
                    />
                    <USelect v-else-if="col.opcoes" :model-value="linha[col.refId] || undefined" :items="col.opcoes" size="xs" class="w-full" @update:model-value="(v) => mudarLinha(campo.refId, i, col.refId, v)" />
                    <UInput v-else-if="col.tipo === 'data'" type="date" :model-value="linha[col.refId]" size="xs" class="w-full" @update:model-value="(v) => mudarLinha(campo.refId, i, col.refId, v)" />
                    <UInput v-else :model-value="linha[col.refId]" size="xs" class="w-full" @update:model-value="(v) => mudarLinha(campo.refId, i, col.refId, v)" />
                  </td>
                  <td class="px-1">
                    <UButton icon="i-lucide-trash-2" size="xs" color="neutral" variant="ghost" :aria-label="t.formulario.removerLinha" @click="removerLinha(campo.refId, i)" />
                  </td>
                </tr>
              </TransitionGroup>
            </table>
            <div class="border-t border-default px-2 py-1.5">
              <UButton :label="t.formulario.adicionarLinha" icon="i-lucide-plus" size="xs" color="neutral" variant="ghost" @click="adicionarLinha(campo)" />
            </div>
          </div>
        </UFormField>

        <UFormField v-else :label="campo.name" :ui="{ container: 'mt-1.5' }">
          <template v-if="usado(campo.refId)" #hint>
            <UBadge :label="t.formulario.usado" icon="i-lucide-link" color="primary" variant="soft" size="sm" />
          </template>
          <UInputNumber
            v-if="campo.tipo === 'numero'"
            :model-value="valores[campo.refId] ?? undefined"
            locale="pt-BR"
            :step-snapping="false"
            :format-options="{ maximumFractionDigits: 4 }"
            :increment="false"
            :decrement="false"
            class="w-full"
            :highlight="usado(campo.refId)"
            @update:model-value="(v) => mudar(campo.refId, v ?? null)"
          />
          <USelect
            v-else-if="campo.opcoes"
            :model-value="valores[campo.refId] || undefined"
            :items="campo.opcoes"
            class="w-full"
            :highlight="usado(campo.refId)"
            @update:model-value="(v) => mudar(campo.refId, v)"
          />
          <USwitch
            v-else-if="campo.tipo === 'logico'"
            :model-value="!!valores[campo.refId]"
            :label="valores[campo.refId] ? t.formulario.sim : t.formulario.nao"
            @update:model-value="(v) => mudar(campo.refId, v)"
          />
          <UInput
            v-else-if="campo.tipo === 'data'"
            type="date"
            :model-value="valores[campo.refId]"
            class="w-full"
            :highlight="usado(campo.refId)"
            @update:model-value="(v) => mudar(campo.refId, v)"
          />
          <UInput
            v-else
            :model-value="valores[campo.refId]"
            class="w-full"
            :highlight="usado(campo.refId)"
            @update:model-value="(v) => mudar(campo.refId, v)"
          />
        </UFormField>
      </template>

      <!-- O Valor Virtual, calculando -->
      <UFormField :label="CAMPO_VIRTUAL.name" class="sm:col-span-2" :ui="{ container: 'mt-1.5' }">
        <div
          :key="pulso"
          class="flex min-h-9 items-center gap-2 rounded-md border px-3 py-2 text-sm animate-[pulso_600ms_ease-out]"
          :class="virtualComProblema ? 'border-error/50 bg-error/5 text-error' : 'border-default bg-elevated/60 text-highlighted'"
          role="status"
          aria-live="polite"
        >
          <UIcon :name="virtualComProblema ? 'i-lucide-circle-alert' : 'i-lucide-sigma'" class="size-4 shrink-0" :class="virtualComProblema ? '' : 'text-primary'" />
          <!-- Texto puro, como o input do develop: entidade de HTML do Handlebars aparece como está. -->
          <span class="min-w-0 flex-1 break-words font-medium tabular-nums">{{ valorDoVirtual }}</span>
        </div>
        <template #help>
          <span class="flex flex-col gap-0.5">
            <span v-if="modo === 'hoje' && completa && resultado.gravado !== resultado.exibido && resultado.gravado" class="font-mono text-[11px]">{{ t.formulario.gravado(resultado.gravado) }}</span>
            <span>{{ nomesQueDisparam.length ? t.formulario.recalculaQuando(nomesQueDisparam.join(', ')) : t.formulario.naoRecalcula }}</span>
          </span>
        </template>
      </UFormField>
    </div>
  </div>
</template>

<style scoped>
/* Pulso curto no campo calculado a cada resultado novo. Não há utilitário do Nuxt UI para isso; registrado no DECISOES. */
@keyframes pulso {
  0% { box-shadow: 0 0 0 0 color-mix(in oklab, var(--ui-primary) 35%, transparent); }
  100% { box-shadow: 0 0 0 6px transparent; }
}
@media (prefers-reduced-motion: reduce) {
  .animate-\[pulso_600ms_ease-out\] { animation: none; }
}
</style>
