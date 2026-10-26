<script setup lang="ts">
/**
 * PROPOSTA: criar e editar uma operação. Não existe hoje.
 *
 * A operação é nome, descrição, responsável e uma regra lógica (`operacoes.ts`): as categorias, os
 * 2 critérios (gatilho e gravação) e as exceções "Sempre incluir" e "Nunca incluir". A prévia ao
 * lado da regra mostra, a cada mudança, quais fluxos entram e por quê, os que se ligam à operação
 * e ficaram fora, e os que saíram por exceção. É ela que mostra como as peças se relacionam antes
 * de salvar.
 */
import type { CategoriaId, Fluxo } from './mocks'
import { categorias, pessoas } from './mocks'
import type { Dados } from './consultas'
import { textoDoEvento } from './consultas'
import type { MotivoNaOperacao, Operacao } from './operacoes'
import { ligacoesInternas, ligadosForaDaOperacao, motivosDoFluxo, novoIdDeOperacao, operacaoPorId, operacoes, regraVazia } from './operacoes'
import type { Textos } from './textos'

const props = defineProps<{ t: Textos, dados: Dados, operacaoId: string | null }>()
const aberto = defineModel<boolean>('open', { required: true })
const emit = defineEmits<{ salvo: [string] }>()

const toast = useToast()

const novaOperacao = (): Operacao => ({ id: '', nome: '', descricao: '', dono: pessoas[0]!, regra: regraVazia() })
const rascunho = ref<Operacao>(novaOperacao())
const tentouSalvar = ref(false)
const salvando = ref(false)
const editando = computed(() => !!props.operacaoId)

/* Cada abertura parte da operação salva (ou de uma nova). Cancelar descarta o rascunho. */
watch(aberto, (a) => {
  if (!a) return
  const op = operacaoPorId(props.operacaoId ?? undefined)
  rascunho.value = op
    ? { ...op, regra: { ...op.regra, categorias: [...op.regra.categorias], incluir: [...op.regra.incluir], excluir: [...op.regra.excluir] } }
    : novaOperacao()
  tentouSalvar.value = false
}, { immediate: true })

/* ---------- opções ---------- */
const opcoesDeCategoria = computed(() => (Object.keys(categorias) as CategoriaId[]).map(c => ({ label: categorias[c].nome, value: c, icon: categorias[c].icone })))
const opcoesDeFluxo = computed(() => props.dados.fluxos.map(f => ({ label: f.name, value: f.id })))
const opcoesDePessoa = pessoas.map(p => ({ label: p, value: p }))
const criterios = computed(() => [
  { value: 'gatilho', ...props.t.gestao.editor.criterios.gatilho },
  { value: 'gravacao', ...props.t.gestao.editor.criterios.gravacao },
])
const criteriosEscolhidos = computed({
  get: () => [rascunho.value.regra.peloGatilho && 'gatilho', rascunho.value.regra.pelaGravacao && 'gravacao'].filter(Boolean) as string[],
  set: (v: string[]) => { rascunho.value.regra.peloGatilho = v.includes('gatilho'); rascunho.value.regra.pelaGravacao = v.includes('gravacao') },
})

/* ---------- prévia ---------- */
const dentro = computed(() => props.dados.fluxos
  .map(f => ({ f, motivos: motivosDoFluxo(f, rascunho.value.regra) }))
  .filter(x => x.motivos.length))
const fora = computed(() => ligadosForaDaOperacao(rascunho.value.regra, props.dados.fluxos))
const porExcecao = computed(() => rascunho.value.regra.excluir.map(id => props.dados.fluxos.find(f => f.id === id)).filter((f): f is Fluxo => !!f))
/* As categorias da regra que algum fluxo de dentro escuta ou grava. */
const categoriasTocadas = computed(() => {
  const s = new Set<CategoriaId>()
  for (const { f } of dentro.value) {
    if (f.gatilho.tipo === 'events') s.add(f.gatilho.categoria)
    for (const g of f.grava) s.add(g.categoria)
  }
  return rascunho.value.regra.categorias.filter(c => s.has(c)).length
})
const ligacoes = computed(() => ligacoesInternas(dentro.value.map(x => x.f)))

function textoDoMotivo(m: MotivoNaOperacao) {
  const e = props.t.gestao.editor.motivo
  return m.tipo === 'incluido' ? e.incluido : e[m.tipo](textoDoEvento(m.evento, props.t))
}
const outrasOperacoes = (f: Fluxo) => operacoes.value
  .filter(o => o.id !== rascunho.value.id && motivosDoFluxo(f, o.regra).length)
  .map(o => o.nome)

const tirar = (id: number) => {
  const r = rascunho.value.regra
  r.incluir = r.incluir.filter(x => x !== id)
  if (!r.excluir.includes(id)) r.excluir = [...r.excluir, id]
}
const incluir = (id: number) => {
  const r = rascunho.value.regra
  r.excluir = r.excluir.filter(x => x !== id)
  if (!r.incluir.includes(id)) r.incluir = [...r.incluir, id]
}
const desfazer = (id: number) => { rascunho.value.regra.excluir = rascunho.value.regra.excluir.filter(x => x !== id) }

/* ---------- salvar ---------- */
const erroNoNome = computed(() => {
  if (!tentouSalvar.value) return undefined
  const nome = rascunho.value.nome.trim()
  if (!nome) return props.t.gestao.editor.nomeObrigatorio
  if (operacoes.value.some(o => o.id !== rascunho.value.id && o.nome.trim().toLowerCase() === nome.toLowerCase())) return props.t.gestao.editor.nomeRepetido
  return undefined
})
const semFluxos = computed(() => tentouSalvar.value && !dentro.value.length)

async function salvar() {
  tentouSalvar.value = true
  if (erroNoNome.value || !dentro.value.length) return
  salvando.value = true
  await new Promise(r => setTimeout(r, 600))
  const op: Operacao = { ...rascunho.value, nome: rascunho.value.nome.trim(), descricao: rascunho.value.descricao.trim() }
  if (editando.value) operacoes.value = operacoes.value.map(o => (o.id === op.id ? op : o))
  else {
    op.id = novoIdDeOperacao()
    operacoes.value = [...operacoes.value, op]
  }
  salvando.value = false
  toast.add({
    title: editando.value ? props.t.gestao.editor.salva : props.t.gestao.editor.criada,
    description: props.t.gestao.editor.salvaDesc(dentro.value.length),
    icon: 'i-lucide-circle-check',
    color: 'success',
  })
  aberto.value = false
  emit('salvo', op.id)
}
</script>

<template>
  <USlideover
    v-model:open="aberto"
    :title="editando ? t.gestao.editor.tituloEditar : t.gestao.editor.tituloNova"
    :description="t.gestao.editor.descricao"
    :ui="{ content: 'sm:max-w-4xl', body: 'p-0 sm:p-0' }"
  >
    <template #body>
      <div class="grid min-h-full lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <!-- A operação e a regra -->
        <div class="flex flex-col gap-6 p-4 sm:p-6">
          <section class="flex flex-col gap-4">
            <h3 class="text-sm font-semibold text-highlighted">{{ t.gestao.editor.sobre }}</h3>
            <UFormField :label="t.gestao.editor.nome" required :error="erroNoNome" name="nome">
              <UInput v-model="rascunho.nome" :placeholder="t.gestao.editor.nomePlaceholder" class="w-full" autofocus />
            </UFormField>
            <UFormField :label="t.gestao.editor.descricaoCampo" name="descricao">
              <UTextarea v-model="rascunho.descricao" :placeholder="t.gestao.editor.descricaoPlaceholder" :rows="2" autoresize class="w-full" />
            </UFormField>
            <UFormField :label="t.gestao.editor.dono" :help="t.gestao.editor.donoAjuda" name="dono">
              <USelect v-model="rascunho.dono" :items="opcoesDePessoa" icon="i-lucide-user-round" class="w-full" />
            </UFormField>
          </section>

          <USeparator />

          <section class="flex flex-col gap-4">
            <h3 class="text-sm font-semibold text-highlighted">{{ t.gestao.editor.secaoRegra }}</h3>
            <UFormField :label="t.gestao.editor.categorias" :help="t.gestao.editor.categoriasAjuda" name="categorias">
              <USelectMenu
                v-model="rascunho.regra.categorias"
                :items="opcoesDeCategoria"
                value-key="value"
                multiple
                :placeholder="t.gestao.editor.categoriasPlaceholder"
                icon="i-lucide-shapes"
                class="w-full"
              />
            </UFormField>
            <UCheckboxGroup v-model="criteriosEscolhidos" :items="criterios" :legend="t.gestao.editor.entraQuando" />
            <UFormField :label="t.gestao.editor.incluir" :help="t.gestao.editor.incluirAjuda" name="incluir">
              <USelectMenu v-model="rascunho.regra.incluir" :items="opcoesDeFluxo" value-key="value" multiple :placeholder="t.gestao.editor.escolherFluxos" icon="i-lucide-plus-circle" class="w-full" />
            </UFormField>
            <UFormField :label="t.gestao.editor.excluir" :help="t.gestao.editor.excluirAjuda" name="excluir">
              <USelectMenu v-model="rascunho.regra.excluir" :items="opcoesDeFluxo" value-key="value" multiple :placeholder="t.gestao.editor.escolherFluxos" icon="i-lucide-minus-circle" class="w-full" />
            </UFormField>
          </section>
        </div>

        <!-- Prévia: o que a regra alcança, ao vivo -->
        <aside class="flex flex-col gap-4 border-t border-default bg-elevated/40 p-4 sm:p-6 lg:border-l lg:border-t-0" :aria-label="t.gestao.editor.previa">
          <div>
            <p class="text-xs font-semibold uppercase tracking-wider text-muted">{{ t.gestao.editor.previa }}</p>
            <p v-if="dentro.length" class="mt-1 text-sm text-toned" aria-live="polite">{{ t.gestao.editor.resumo(dentro.length, categoriasTocadas, ligacoes) }}</p>
          </div>

          <div v-if="!dentro.length" class="rounded-md border border-dashed border-accented p-4 text-center">
            <p class="text-sm text-highlighted">{{ t.gestao.editor.nenhum }}</p>
            <p class="text-xs text-muted">{{ t.gestao.editor.nenhumAjuda }}</p>
          </div>
          <section v-else>
            <h4 class="mb-2 text-sm font-medium text-highlighted">{{ t.gestao.editor.entram(dentro.length) }}</h4>
            <ul class="flex flex-col divide-y divide-default overflow-hidden rounded-md border border-default bg-default">
              <li v-for="{ f, motivos } in dentro" :key="f.id" class="flex items-start gap-2 px-3 py-2">
                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm text-highlighted">{{ f.name }}</p>
                  <p class="mt-0.5 flex flex-wrap gap-1">
                    <UBadge v-for="(m, k) in motivos" :key="k" :label="textoDoMotivo(m)" :icon="m.tipo === 'gatilho' ? 'i-lucide-zap' : m.tipo === 'grava' ? 'i-lucide-pencil-line' : 'i-lucide-hand'" color="neutral" variant="subtle" size="sm" />
                  </p>
                  <p v-if="outrasOperacoes(f).length" class="mt-1 text-xs text-muted">{{ t.gestao.editor.tambemEm(outrasOperacoes(f).join(', ')) }}</p>
                </div>
                <UButton :label="t.gestao.editor.tirar" icon="i-lucide-minus" size="xs" color="neutral" variant="ghost" :aria-label="t.gestao.editor.tirarRotulo(f.name)" @click="tirar(f.id)" />
              </li>
            </ul>
          </section>

          <section v-if="fora.length">
            <h4 class="text-sm font-medium text-highlighted">{{ t.gestao.editor.ligados(fora.length) }}</h4>
            <p class="mb-2 text-xs text-muted">{{ t.gestao.editor.ligadosAjuda }}</p>
            <ul class="flex flex-col divide-y divide-default overflow-hidden rounded-md border border-warning/40 bg-default">
              <li v-for="l in fora" :key="l.fluxo.id" class="flex items-start gap-2 px-3 py-2">
                <UIcon name="i-lucide-link" class="mt-0.5 size-4 shrink-0 text-warning" />
                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm text-highlighted">{{ l.fluxo.name }}</p>
                  <p class="text-xs text-muted">{{ t.gestao.editor[l.sentido](textoDoEvento(l.evento, t), l.vizinho.name) }}</p>
                </div>
                <UButton :label="t.gestao.editor.incluirFluxo" icon="i-lucide-plus" size="xs" color="neutral" variant="outline" :aria-label="t.gestao.editor.incluirRotulo(l.fluxo.name)" @click="incluir(l.fluxo.id)" />
              </li>
            </ul>
          </section>

          <section v-if="porExcecao.length">
            <h4 class="mb-2 text-sm font-medium text-highlighted">{{ t.gestao.editor.excecoes(porExcecao.length) }}</h4>
            <ul class="flex flex-col divide-y divide-default overflow-hidden rounded-md border border-default bg-default">
              <li v-for="f in porExcecao" :key="f.id" class="flex items-center gap-2 px-3 py-2">
                <UIcon name="i-lucide-minus-circle" class="size-4 shrink-0 text-muted" />
                <p class="min-w-0 flex-1 truncate text-sm text-toned">{{ f.name }}</p>
                <UButton :label="t.gestao.editor.desfazer" icon="i-lucide-undo-2" size="xs" color="neutral" variant="ghost" @click="desfazer(f.id)" />
              </li>
            </ul>
          </section>
        </aside>
      </div>
    </template>

    <template #footer>
      <div class="flex w-full flex-wrap items-center justify-end gap-2">
        <p v-if="semFluxos" role="alert" class="mr-auto flex items-center gap-1.5 text-sm text-error">
          <UIcon name="i-lucide-circle-alert" class="size-4 shrink-0" />{{ t.gestao.editor.semFluxos }}
        </p>
        <UButton :label="t.gestao.editor.cancelar" color="neutral" variant="ghost" @click="aberto = false" />
        <UButton :label="editando ? t.gestao.editor.salvar : t.gestao.editor.criar" :icon="editando ? 'i-lucide-check' : 'i-lucide-plus'" :loading="salvando" @click="salvar" />
      </div>
    </template>
  </USlideover>
</template>
