<script setup lang="ts">
/**
 * Pedido 4: Integrações › Destinos de saída. Tela nova.
 *
 * Hoje o nó de Requisição HTTP do Spaceflow chama qualquer endereço. Referências:
 * Power Platform (lista ordenada Allow/Deny com curinga e regra final fixa),
 * n8n (checagem na execução, inclusive de redirecionamento e DNS, e bloqueio de
 * rede interna). O que ninguém faz e entra aqui: o teste de endereço, o modo
 * "Só registrar" e a lista de fluxos afetados antes de salvar.
 *
 * A avaliação funciona de verdade sobre o mock (apoio.ts › avaliar).
 */
import type { EnTableColumn } from '@be-enlighten/enspace-sdk-ui/base'
import type { Textos } from './textos'
import type { Tela } from './_CascaDoAdmin.vue'
import Cabecalho from './_Cabecalho.vue'
import { chamadasHttp, nomeDoWorkspace } from './mocks'
import type { RegraDeDestino } from './mocks'
import { avaliar, normalizarUrl, numero } from './apoio'
import type { Avaliacao, ModoDeDestino } from './apoio'
import { useDestinos } from './estado'

const props = defineProps<{ t: Textos, marcarNovo: boolean }>()
const emit = defineEmits<{ navegar: [tela: Tela] }>()
const idioma = useIdioma()
const toast = useToast()
const td = computed(() => props.t.destinos)

const salvo = useDestinos()
const modo = ref<ModoDeDestino>(salvo.value.modo)
const regras = ref<RegraDeDestino[]>(structuredClone(toRaw(salvo.value.regras)))
const alterada = computed(() => modo.value !== salvo.value.modo || JSON.stringify(regras.value) !== JSON.stringify(salvo.value.regras))

const itensModo = computed(() => (['todos', 'registrar', 'lista'] as const).map(v => ({ label: td.value.modos[v], description: td.value.modosAjuda[v], value: v })))

/* ---------- regras ---------- */
function mover(i: number, d: -1 | 1) {
  const j = i + d
  if (j < 0 || j >= regras.value.length) return
  const r = regras.value
  ;[r[i], r[j]] = [r[j]!, r[i]!]
}
const novoPadrao = ref('')
const novaAcao = ref<'permitir' | 'bloquear'>('permitir')
const novaNota = ref('')
const erroPadrao = ref(false)
function adicionar() {
  const p = novoPadrao.value.trim()
  erroPadrao.value = !p || (p.includes('://') && !/^https?:\/\//i.test(p)) || /\s/.test(p)
  if (erroPadrao.value) return
  regras.value.push({ id: `r${Date.now()}`, padrao: p, acao: novaAcao.value, nota: novaNota.value.trim() })
  novoPadrao.value = ''
  novaNota.value = ''
}

/* ---------- teste ---------- */
const teste = ref('https://webhook.site/7f2c')
function descrever(a: Avaliacao) {
  const r = td.value.resultado
  if (a.resultado === 'invalida') return r.invalida
  if (a.resultado === 'interna') return r.interna
  const porque = modo.value === 'todos' ? r.peloModo : a.regra === null ? r.peloResto : r.pelaRegra(a.regra + 1, regras.value[a.regra]!.padrao)
  return r[a.resultado](porque)
}
const resultadoTeste = computed(() => teste.value.trim() ? avaliar(teste.value, regras.value, modo.value) : null)
const corDoResultado = { permitido: 'success', bloqueado: 'error', registrado: 'warning', interna: 'error', invalida: 'neutral' } as const
const iconeDoResultado = { permitido: 'i-lucide-circle-check', bloqueado: 'i-lucide-ban', registrado: 'i-lucide-scroll-text', interna: 'i-lucide-ban', invalida: 'i-lucide-circle-help' } as const

/* ---------- impacto ---------- */
const impacto = computed(() => chamadasHttp.map(c => ({ ...c, a: avaliar(c.url, regras.value, modo.value) })))
const param = computed(() => impacto.value.filter(c => c.a.resultado === 'bloqueado' || c.a.resultado === 'interna').length)
const registram = computed(() => impacto.value.filter(c => c.a.resultado === 'registrado').length)
const exemploBloqueado = computed(() => impacto.value.find(c => c.a.resultado === 'bloqueado' || c.a.resultado === 'registrado'))

function salvar() {
  salvo.value = { modo: modo.value, regras: structuredClone(toRaw(regras.value)) }
  toast.add({ title: td.value.salvo, icon: 'i-lucide-check', color: 'success' })
}
function descartar() {
  modo.value = salvo.value.modo
  regras.value = structuredClone(toRaw(salvo.value.regras))
}
const colunasImpacto = computed<EnTableColumn[]>(() => [
  { key: 'fluxo', label: td.value.col2.fluxo },
  { key: 'url', label: td.value.col2.url },
  { key: 'chamadas30d', label: td.value.col2.chamadas, align: 'right' },
  { key: 'a', label: td.value.col2.resultado },
])
const temVariavel = (u: string) => /\{\{/.test(u)
const host = (u: string) => normalizarUrl(u)?.host ?? u
</script>

<template>
  <div>
    <Cabecalho :titulo="td.titulo" :intro="td.intro" :novo="marcarNovo" :rotulo-novo="t.casca.novo">
      <template #acoes>
        <Transition enter-active-class="transition duration-200" enter-from-class="opacity-0">
          <span v-if="alterada" class="text-xs text-warning">{{ t.comum.pendentes(1) }}</span>
        </Transition>
        <UButton :label="t.comum.descartar" size="sm" color="neutral" variant="ghost" :disabled="!alterada" @click="descartar" />
        <UButton :label="t.comum.salvar" size="sm" :disabled="!alterada" @click="salvar" />
      </template>
    </Cabecalho>

    <div class="grid gap-4 p-6 2xl:grid-cols-[minmax(0,1fr)_26rem]">
      <div class="space-y-4">
        <!-- Modo -->
        <section class="rounded-lg border border-default bg-default p-4">
          <h3 class="mb-3 text-sm font-semibold text-highlighted">{{ td.modo }}</h3>
          <URadioGroup v-model="modo" :items="itensModo" :ui="{ fieldset: 'gap-3' }" />
        </section>

        <!-- Regras -->
        <section class="rounded-lg border border-default bg-default" :class="modo === 'todos' ? 'opacity-60' : ''">
          <header class="border-b border-default px-4 py-3">
            <h3 class="text-sm font-semibold text-highlighted">{{ td.regras }}</h3>
            <p class="text-xs text-muted">{{ td.regrasAjuda }}</p>
          </header>
          <ol class="divide-y divide-default">
            <TransitionGroup move-class="transition duration-300" enter-active-class="transition duration-200" enter-from-class="opacity-0 -translate-y-1" leave-active-class="transition duration-150 absolute" leave-to-class="opacity-0">
              <li v-for="(r, i) in regras" :key="r.id" class="flex flex-wrap items-center gap-2 bg-default px-4 py-2" :class="resultadoTeste && 'regra' in resultadoTeste && resultadoTeste.regra === i ? 'bg-primary/5' : ''">
                <span class="w-5 font-mono text-xs text-muted">{{ i + 1 }}</span>
                <code class="min-w-0 flex-1 truncate font-mono text-sm text-highlighted">{{ r.padrao }}</code>
                <span class="hidden w-40 truncate text-xs text-muted md:block">{{ r.nota }}</span>
                <USelect v-model="r.acao" :items="(['permitir', 'bloquear'] as const).map(a => ({ label: td.acoes[a], value: a }))" size="xs" class="w-28" :color="r.acao === 'bloquear' ? 'error' : 'success'" variant="soft" />
                <UButton icon="i-lucide-arrow-up" size="xs" color="neutral" variant="ghost" :aria-label="td.subir" :disabled="i === 0" @click="mover(i, -1)" />
                <UButton icon="i-lucide-arrow-down" size="xs" color="neutral" variant="ghost" :aria-label="td.descer" :disabled="i === regras.length - 1" @click="mover(i, 1)" />
                <UButton icon="i-lucide-trash-2" size="xs" color="neutral" variant="ghost" :aria-label="td.remover" @click="regras.splice(i, 1)" />
              </li>
            </TransitionGroup>
            <li class="flex items-center gap-2 bg-elevated/50 px-4 py-2" :class="resultadoTeste && 'regra' in resultadoTeste && resultadoTeste.regra === null && modo !== 'todos' ? 'bg-primary/5' : ''">
              <span class="w-5 font-mono text-xs text-muted">*</span>
              <span class="flex-1 text-sm font-medium text-toned">{{ td.restoNome }}</span>
              <UBadge :label="td.restoAjuda[modo]" :color="modo === 'todos' ? 'success' : modo === 'registrar' ? 'warning' : 'error'" variant="soft" size="sm" />
            </li>
            <li class="flex items-center gap-2 bg-elevated/50 px-4 py-2">
              <UIcon name="i-lucide-lock" class="size-4 text-muted" />
              <span class="flex-1 text-sm text-toned">{{ td.interna }} <span class="font-mono text-[10px] text-dimmed">10.0.0.0/8 · 172.16.0.0/12 · 192.168.0.0/16 · 127.0.0.1 · 169.254.169.254</span></span>
              <UBadge :label="td.internaAjuda" color="neutral" variant="outline" size="sm" />
            </li>
          </ol>
          <form class="flex flex-wrap items-start gap-2 border-t border-default px-4 py-3" @submit.prevent="adicionar">
            <UFormField :error="erroPadrao ? td.padraoInvalido : undefined" class="min-w-64 flex-1">
              <UInput v-model="novoPadrao" :placeholder="td.novoPadrao" size="sm" class="w-full" :ui="{ base: 'font-mono text-xs' }" @update:model-value="erroPadrao = false" />
            </UFormField>
            <UInput v-model="novaNota" :placeholder="td.novaNota" size="sm" class="w-44" />
            <USelect v-model="novaAcao" :items="(['permitir', 'bloquear'] as const).map(a => ({ label: td.acoes[a], value: a }))" size="sm" class="w-32" />
            <UButton type="submit" :label="t.comum.adicionar" icon="i-lucide-plus" size="sm" color="neutral" variant="outline" />
          </form>
        </section>

        <!-- Impacto -->
        <section class="rounded-lg border border-default bg-default">
          <header class="flex flex-wrap items-center gap-2 border-b border-default px-4 py-3">
            <div>
              <h3 class="text-sm font-semibold text-highlighted">{{ td.impacto }}</h3>
              <p class="text-xs text-muted">{{ td.impactoAjuda }}</p>
            </div>
            <Transition mode="out-in" enter-active-class="transition duration-200" enter-from-class="opacity-0 scale-95">
              <UBadge :key="`${param}-${registram}`" :label="td.impactoResumo(param, registram)" :color="param ? 'error' : registram ? 'warning' : 'success'" variant="soft" class="ml-auto" />
            </Transition>
          </header>
          <div class="p-3">
            <EnTable :columns="colunasImpacto" :rows="(impacto as unknown as Record<string, unknown>[])" :locale="idioma">
              <template #cell-fluxo="{ row }">
                <p class="font-medium text-highlighted">{{ (row as any).fluxo }}</p>
                <p class="text-xs text-muted">{{ nomeDoWorkspace((row as any).workspace) }} · {{ (row as any).no }}</p>
              </template>
              <template #cell-url="{ row }">
                <code class="block max-w-72 truncate font-mono text-xs text-toned">{{ (row as any).url }}</code>
                <p v-if="temVariavel((row as any).url)" class="text-[10px] text-info">{{ td.variavel }}</p>
              </template>
              <template #cell-chamadas30d="{ row }">
                <span class="font-mono text-xs text-toned">{{ numero((row as any).chamadas30d, idioma) }}</span>
              </template>
              <template #cell-a="{ row }">
                <Transition mode="out-in" enter-active-class="transition duration-200" enter-from-class="opacity-0 -translate-y-1">
                  <UBadge :key="(row as any).a.resultado" :label="td.resultados[(row as any).a.resultado as Avaliacao['resultado']]" :color="corDoResultado[(row as any).a.resultado as Avaliacao['resultado']]" :icon="iconeDoResultado[(row as any).a.resultado as Avaliacao['resultado']]" variant="soft" size="sm" />
                </Transition>
              </template>
            </EnTable>
          </div>
        </section>
      </div>

      <aside class="space-y-4">
        <!-- Testar endereço -->
        <section class="rounded-lg border border-default bg-default p-4">
          <h3 class="mb-2 text-sm font-semibold text-highlighted">{{ td.testar }}</h3>
          <UInput v-model="teste" :placeholder="td.testarPh" icon="i-lucide-link" class="w-full" :ui="{ base: 'font-mono text-xs' }" />
          <Transition mode="out-in" enter-active-class="transition duration-200" enter-from-class="opacity-0 translate-y-1">
            <UAlert
              v-if="resultadoTeste"
              :key="descrever(resultadoTeste)"
              class="mt-3"
              :color="corDoResultado[resultadoTeste.resultado]"
              :icon="iconeDoResultado[resultadoTeste.resultado]"
              variant="soft"
              :description="descrever(resultadoTeste)"
            />
          </Transition>
        </section>

        <!-- Como o autor do fluxo vê -->
        <section v-if="exemploBloqueado && modo === 'lista'" class="rounded-lg border border-dashed border-accented bg-elevated/50 p-4 animate-[entrada_.25s_ease-out]">
          <p class="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">{{ td.editorTitulo }}</p>
          <div class="rounded-lg border-2 border-error/60 bg-default p-3 shadow-sm">
            <div class="flex items-center gap-2">
              <span class="flex size-8 items-center justify-center rounded-md bg-info/10"><UIcon name="i-lucide-globe" class="size-4 text-info" /></span>
              <div class="min-w-0">
                <p class="text-sm font-semibold text-highlighted">{{ exemploBloqueado.no }}</p>
                <p class="truncate font-mono text-[11px] text-muted">{{ td.editorNo }} · POST {{ host(exemploBloqueado.url) }}</p>
              </div>
            </div>
            <p class="mt-2 flex items-start gap-1.5 rounded-md bg-error/10 p-2 text-xs text-error">
              <UIcon name="i-lucide-ban" class="mt-0.5 size-3.5 shrink-0" />
              {{ td.editorAviso('regra' in exemploBloqueado.a && exemploBloqueado.a.regra !== null ? `${exemploBloqueado.a.regra + 1}` : td.restoNome) }}
            </p>
          </div>
        </section>

        <UAlert
          icon="i-lucide-sparkles"
          color="neutral"
          variant="subtle"
          :description="t.ia.destinosAjuda"
          :actions="[{ label: t.casca.itens.ia, variant: 'outline', size: 'xs', trailingIcon: 'i-lucide-arrow-right', onClick: () => emit('navegar', 'ia') }]"
        />
      </aside>
    </div>
  </div>
</template>
