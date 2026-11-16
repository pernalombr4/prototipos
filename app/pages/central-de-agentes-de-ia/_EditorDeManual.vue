<script setup lang="ts">
/**
 * PROPOSTA (rodada 2): o formulário do manual de revisão, com os campos que o
 * servidor já guarda e a tela de develop não mostra ou corta.
 *
 * - Categoria visível (hoje sempre grava `custom`); rótulo "Ícone" (hoje "icon").
 * - Instruções em área de texto com contador (hoje campo de 1 linha).
 * - Formato e tom com a explicação de cada opção.
 * - Regras com severidade em selo, ordem (subir e descer), duplicar; categoria
 *   da regra opcional, como na API.
 * - Itens com "Obrigatório", que a API já tem.
 * - Limites iguais aos da API: nome 150, título da regra 200, descrição da
 *   regra 1.000, item 500 (hoje 100, 255 e 100).
 * - Prévia do resultado ao lado, com nota, achados por severidade e checklist.
 * - Manual do sistema abre só para leitura, com "Duplicar para editar".
 *
 * MAQUETE: a prévia é um exemplo fixo montado das regras (as de posição par
 * "falham"); não chama IA.
 */
import type { Textos } from './textos'
import { EU, type Manual, type Severidade } from './mocks'
import { corDaSeveridade, iconeDaSeveridade, ORDEM_DAS_SEVERIDADES } from './estado'

const props = defineProps<{ t: Textos, manual: Manual | null }>()
const aberto = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ salvo: [m: Manual], duplicar: [m: Manual] }>()
const toast = useToast()
const p = computed(() => props.t.playbooks)
const f = computed(() => props.t.playbooks.form)

const LIMITE = { nome: 150, instrucoes: 10000, regraTitulo: 200, regraDescricao: 1000, item: 500, categoria: 100 }

const novo = (): Manual => ({
  id: `m-${Date.now()}`, nome: '', descricao: '', categoria: 'custom', icone: 'i-lucide-file-check', instrucoes: '',
  formato: 'detailed', tom: 'formal', regras: [], checklist: [], sistema: false, status: 'active', autor: EU, atualizadoEm: '2026-11-16', revisoes30d: 0,
})
const m = ref<Manual>(novo())
const tentou = ref(false)
watch(aberto, (v) => {
  if (!v) return
  m.value = props.manual ? JSON.parse(JSON.stringify(props.manual)) : novo()
  tentou.value = false
})
const leitura = computed(() => m.value.sistema)
const ehNovo = computed(() => !props.manual)

/* Opções */
const categorias = computed(() => (['legal_contract', 'nda', 'compliance', 'financial', 'quality', 'policy', 'technical', 'custom'] as const).map(c => ({ value: c, label: p.value.categorias[c] })))
const formatos = computed(() => (['detailed', 'summary', 'checklist', 'scored'] as const).map(x => ({ value: x, label: p.value.formatos[x]!.nome, description: p.value.formatos[x]!.texto })))
const tons = computed(() => (['formal', 'technical', 'advisory', 'conversational'] as const).map(x => ({ value: x, label: p.value.tons[x]!.nome, description: p.value.tons[x]!.texto })))
const severidades = computed(() => ORDEM_DAS_SEVERIDADES.map(s => ({ value: s, label: p.value.severidades[s], icon: iconeDaSeveridade[s] })))
const icones = ['i-lucide-file-check', 'i-lucide-scale', 'i-lucide-lock', 'i-lucide-shield', 'i-lucide-truck', 'i-lucide-shopping-cart', 'i-lucide-receipt', 'i-lucide-landmark', 'i-lucide-badge-check', 'i-lucide-clipboard-check', 'i-lucide-gavel', 'i-lucide-building-2'].map(i => ({ value: i, label: i.replace('i-lucide-', ''), icon: i }))

/* Regras e itens */
const id = () => Math.random().toString(36).slice(2, 8)
function adicionarRegra() {
  m.value.regras.push({ id: id(), titulo: '', descricao: '', severidade: 'medium', categoria: '' })
}
function adicionarItem() {
  m.value.checklist.push({ id: id(), item: '', obrigatorio: true, categoria: '' })
}
function mover<T>(lista: T[], i: number, d: -1 | 1) {
  const j = i + d
  if (j < 0 || j >= lista.length) return
  ;[lista[i], lista[j]] = [lista[j]!, lista[i]!]
}
function duplicarRegra(i: number) {
  const r = m.value.regras[i]!
  m.value.regras.splice(i + 1, 0, { ...r, id: id() })
}

/* Validação */
const faltando = computed(() => !m.value.nome.trim() || !m.value.descricao.trim() || !m.value.instrucoes.trim() || m.value.regras.some(r => !r.titulo.trim() || !r.descricao.trim()))
const erro = (v: string) => (tentou.value && !v.trim() ? ' ' : undefined)
function salvar() {
  tentou.value = true
  if (faltando.value) {
    toast.add({ title: f.value.obrigatorios, icon: 'i-lucide-circle-alert', color: 'error' })
    return
  }
  m.value.atualizadoEm = '2026-11-16'
  emit('salvo', JSON.parse(JSON.stringify(m.value)))
  toast.add({ title: ehNovo.value ? f.value.criado(m.value.nome) : f.value.salvo(m.value.nome), icon: 'i-lucide-check', color: 'success' })
  aberto.value = false
}

/* Prévia: as regras de posição par "falham"; o último item opcional "falta". */
const PESO: Record<Severidade, number> = { critical: 25, high: 15, medium: 8, low: 3, info: 0 }
const achados = computed(() => m.value.regras.filter((_, i) => i % 2 === 1))
const contagem = computed(() => ORDEM_DAS_SEVERIDADES.map(s => ({ s, n: achados.value.filter(r => r.severidade === s).length })).filter(x => x.n))
const itensDaPrevia = computed(() => m.value.checklist.map((c, i) => ({ ...c, atende: c.obrigatorio || i !== m.value.checklist.length - 1 })))
const nota = computed(() => Math.max(0, 100 - achados.value.reduce((s, r) => s + PESO[r.severidade], 0) - itensDaPrevia.value.filter(x => !x.atende && x.obrigatorio).length * 10))
const corDaNota = computed(() => (nota.value >= 80 ? 'text-success' : nota.value >= 60 ? 'text-warning' : 'text-error'))
</script>

<template>
  <USlideover v-model:open="aberto" :title="ehNovo ? f.tituloNovo : m.nome" :description="leitura ? f.sistemaAviso : undefined" :ui="{ content: 'max-w-6xl' }">
    <template #body>
      <UAlert
        v-if="leitura"
        class="mb-5"
        color="info"
        variant="subtle"
        icon="i-lucide-lock"
        :title="f.sistemaAviso"
        :actions="[{ label: p.acoes.duplicarParaEditar, icon: 'i-lucide-copy', color: 'info', variant: 'outline', onClick: () => { aberto = false; emit('duplicar', manual!) } }]"
      />

      <div class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <fieldset :disabled="leitura" class="min-w-0 space-y-8">
          <!-- Identificação -->
          <section class="space-y-4">
            <h3 class="text-sm font-semibold text-highlighted">{{ f.identificacao }}</h3>
            <div class="grid gap-4 sm:grid-cols-[minmax(0,1fr)_12rem]">
              <UFormField :label="f.nome" required :error="erro(m.nome)" :help="f.contador(m.nome.length, LIMITE.nome)">
                <UInput v-model="m.nome" :maxlength="LIMITE.nome" :placeholder="f.nomePlaceholder" class="w-full" />
              </UFormField>
              <UFormField :label="f.icone">
                <USelect v-model="m.icone" :items="icones" value-key="value" :icon="m.icone" class="w-full" />
              </UFormField>
            </div>
            <UFormField :label="f.descricao" required :error="erro(m.descricao)">
              <UTextarea v-model="m.descricao" :rows="2" autoresize :placeholder="f.descricaoPlaceholder" class="w-full" />
            </UFormField>
            <div class="grid gap-4 sm:grid-cols-2">
              <UFormField :label="f.categoria" :help="f.categoriaAjuda">
                <USelect v-model="m.categoria" :items="categorias" value-key="value" class="w-full" icon="i-lucide-tag" />
              </UFormField>
              <UFormField :label="f.ativo" :help="f.ativoAjuda">
                <USwitch :model-value="m.status === 'active'" :label="m.status === 'active' ? f.ativo : p.inativo" @update:model-value="m.status = $event ? 'active' : 'inactive'" />
              </UFormField>
            </div>
          </section>

          <USeparator />

          <!-- Como revisar -->
          <section class="space-y-4">
            <h3 class="text-sm font-semibold text-highlighted">{{ f.comoRevisar }}</h3>
            <UFormField :label="f.instrucoes" required :error="erro(m.instrucoes)" :help="f.contador(m.instrucoes.length, LIMITE.instrucoes)">
              <UTextarea v-model="m.instrucoes" :maxlength="LIMITE.instrucoes" :rows="4" autoresize :maxrows="12" :placeholder="f.instrucoesPlaceholder" class="w-full" />
            </UFormField>
            <div class="grid gap-4 sm:grid-cols-2">
              <UFormField :label="f.formato">
                <USelect v-model="m.formato" :items="formatos" value-key="value" class="w-full" />
              </UFormField>
              <UFormField :label="f.tom">
                <USelect v-model="m.tom" :items="tons" value-key="value" class="w-full" />
              </UFormField>
            </div>
          </section>

          <USeparator />

          <!-- Regras -->
          <section class="space-y-3">
            <div>
              <h3 class="text-sm font-semibold text-highlighted">{{ f.regrasTitulo }} <span class="font-normal text-muted">({{ m.regras.length }})</span></h3>
              <p class="text-xs text-muted">{{ f.regrasAjuda }}</p>
            </div>
            <p v-if="!m.regras.length" class="rounded-lg bg-elevated/50 px-4 py-5 text-center text-sm text-muted">{{ f.semRegras }}</p>
            <TransitionGroup tag="ol" class="space-y-3" move-class="transition duration-200" enter-active-class="transition duration-200" enter-from-class="opacity-0 -translate-y-1" leave-active-class="transition duration-150" leave-to-class="opacity-0">
              <li v-for="(r, i) in m.regras" :key="r.id" class="rounded-lg border border-default p-3">
                <div class="mb-3 flex items-center gap-2">
                  <span class="text-xs font-semibold text-toned">{{ f.regra(i + 1) }}</span>
                  <UBadge :label="p.severidades[r.severidade]" :icon="iconeDaSeveridade[r.severidade]" :color="corDaSeveridade[r.severidade]" variant="subtle" size="sm" />
                  <div v-if="!leitura" class="ml-auto flex items-center">
                    <UTooltip :text="f.subir"><UButton icon="i-lucide-arrow-up" color="neutral" variant="ghost" size="xs" :disabled="i === 0" :aria-label="`${f.subir}: ${f.regra(i + 1)}`" @click="mover(m.regras, i, -1)" /></UTooltip>
                    <UTooltip :text="f.descer"><UButton icon="i-lucide-arrow-down" color="neutral" variant="ghost" size="xs" :disabled="i === m.regras.length - 1" :aria-label="`${f.descer}: ${f.regra(i + 1)}`" @click="mover(m.regras, i, 1)" /></UTooltip>
                    <UTooltip :text="f.duplicar"><UButton icon="i-lucide-copy" color="neutral" variant="ghost" size="xs" :aria-label="`${f.duplicar}: ${f.regra(i + 1)}`" @click="duplicarRegra(i)" /></UTooltip>
                    <UTooltip :text="f.remover"><UButton icon="i-lucide-trash-2" color="error" variant="ghost" size="xs" :aria-label="`${f.remover}: ${f.regra(i + 1)}`" @click="m.regras.splice(i, 1)" /></UTooltip>
                  </div>
                </div>
                <div class="grid gap-3 sm:grid-cols-[minmax(0,1fr)_10rem]">
                  <UFormField :label="f.regraTitulo" required :error="erro(r.titulo)">
                    <UInput v-model="r.titulo" :maxlength="LIMITE.regraTitulo" :placeholder="f.regraTituloPlaceholder" class="w-full" />
                  </UFormField>
                  <UFormField :label="f.severidade">
                    <USelect v-model="r.severidade" :items="severidades" value-key="value" :icon="iconeDaSeveridade[r.severidade]" class="w-full" />
                  </UFormField>
                </div>
                <UFormField :label="f.regraDescricao" required :error="erro(r.descricao)" :help="f.contador(r.descricao.length, LIMITE.regraDescricao)" class="mt-3">
                  <UTextarea v-model="r.descricao" :maxlength="LIMITE.regraDescricao" :rows="2" autoresize :placeholder="f.regraDescricaoPlaceholder" class="w-full" />
                </UFormField>
                <UFormField :label="f.categoriaDaRegra" :hint="f.opcional" class="mt-3 max-w-xs">
                  <UInput v-model="r.categoria" :maxlength="LIMITE.categoria" :placeholder="f.categoriaPlaceholder" class="w-full" />
                </UFormField>
              </li>
            </TransitionGroup>
            <UButton v-if="!leitura" :label="f.adicionarRegra" icon="i-lucide-plus" color="neutral" variant="outline" @click="adicionarRegra" />
          </section>

          <USeparator />

          <!-- Itens de verificação -->
          <section class="space-y-3">
            <div>
              <h3 class="text-sm font-semibold text-highlighted">{{ f.checklistTitulo }} <span class="font-normal text-muted">({{ m.checklist.length }})</span></h3>
              <p class="text-xs text-muted">{{ f.checklistAjuda }}</p>
            </div>
            <p v-if="!m.checklist.length" class="rounded-lg bg-elevated/50 px-4 py-5 text-center text-sm text-muted">{{ f.semItens }}</p>
            <TransitionGroup tag="ol" class="space-y-2" move-class="transition duration-200" enter-active-class="transition duration-200" enter-from-class="opacity-0" leave-active-class="transition duration-150" leave-to-class="opacity-0">
              <li v-for="(c, i) in m.checklist" :key="c.id" class="flex flex-wrap items-center gap-2 rounded-lg border border-default p-2">
                <UInput v-model="c.item" :maxlength="LIMITE.item" :placeholder="f.itemPlaceholder" :aria-label="f.item(i + 1)" class="min-w-48 flex-1" />
                <USwitch v-model="c.obrigatorio" :label="f.obrigatorio" size="sm" />
                <div v-if="!leitura" class="flex items-center">
                  <UButton icon="i-lucide-arrow-up" color="neutral" variant="ghost" size="xs" :disabled="i === 0" :aria-label="`${f.subir}: ${f.item(i + 1)}`" @click="mover(m.checklist, i, -1)" />
                  <UButton icon="i-lucide-arrow-down" color="neutral" variant="ghost" size="xs" :disabled="i === m.checklist.length - 1" :aria-label="`${f.descer}: ${f.item(i + 1)}`" @click="mover(m.checklist, i, 1)" />
                  <UButton icon="i-lucide-trash-2" color="error" variant="ghost" size="xs" :aria-label="`${f.remover}: ${f.item(i + 1)}`" @click="m.checklist.splice(i, 1)" />
                </div>
              </li>
            </TransitionGroup>
            <UButton v-if="!leitura" :label="f.adicionarItem" icon="i-lucide-plus" color="neutral" variant="outline" @click="adicionarItem" />
          </section>
        </fieldset>

        <!-- Prévia do resultado -->
        <aside class="lg:sticky lg:top-0 lg:self-start">
          <div class="rounded-lg border border-default bg-elevated/30 p-4">
            <p class="text-sm font-semibold text-highlighted">{{ f.previa }}</p>
            <p class="mb-4 text-xs text-muted">{{ f.previaAjuda }}</p>

            <div v-if="m.formato === 'scored'" class="mb-4 flex items-baseline gap-2">
              <span class="text-4xl font-semibold tabular-nums" :class="corDaNota">{{ nota }}</span>
              <span class="text-xs text-muted">/ 100 · {{ f.nota }}</span>
            </div>
            <p v-if="m.formato === 'summary'" class="mb-4 text-sm text-default">{{ f.resumoExemplo }}</p>

            <p class="mb-2 text-xs font-medium text-toned">{{ f.achados(achados.length) }}</p>
            <div v-if="contagem.length" class="mb-3 flex flex-wrap gap-1">
              <UBadge v-for="x in contagem" :key="x.s" :label="`${x.n} ${p.severidades[x.s]}`" :icon="iconeDaSeveridade[x.s]" :color="corDaSeveridade[x.s]" variant="subtle" size="xs" />
            </div>
            <ul class="mb-4 space-y-2">
              <li v-for="r in achados.slice(0, 4)" :key="r.id" class="rounded-md bg-default p-2 text-xs ring ring-default">
                <p class="flex items-center gap-1.5 font-medium text-highlighted">
                  <UIcon :name="iconeDaSeveridade[r.severidade]" class="size-3.5 shrink-0" :class="`text-${corDaSeveridade[r.severidade] === 'neutral' ? 'muted' : corDaSeveridade[r.severidade]}`" />{{ r.titulo || f.regraTitulo }}
                </p>
                <p v-if="m.formato === 'detailed'" class="mt-1 text-muted">{{ f.sugestao }}</p>
              </li>
            </ul>

            <ul v-if="itensDaPrevia.length" class="space-y-1.5 border-t border-default pt-3">
              <li v-for="c in itensDaPrevia" :key="c.id" class="flex items-start gap-1.5 text-xs">
                <UIcon :name="c.atende ? 'i-lucide-circle-check' : 'i-lucide-circle-x'" class="mt-0.5 size-3.5 shrink-0" :class="c.atende ? 'text-success' : 'text-error'" />
                <span class="min-w-0 flex-1 text-default">{{ c.item || f.itemPlaceholder }}</span>
                <span class="shrink-0" :class="c.atende ? 'text-success' : 'text-error'">{{ c.atende ? f.atende : f.naoAtende }}</span>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </template>
    <template #footer>
      <div class="flex w-full justify-end gap-2">
        <UButton :label="leitura ? f.fechar : f.cancelar" color="neutral" variant="outline" @click="aberto = false" />
        <UButton v-if="!leitura" :label="ehNovo ? f.criar : f.salvar" icon="i-lucide-save" @click="salvar" />
      </div>
    </template>
  </USlideover>
</template>
