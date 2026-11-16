<script setup lang="ts">
/**
 * PROPOSTA (rodada 2): os manuais de revisão (playbooks) do agente Revisor.
 * Em develop (2026-11-16, evidencias/develop-09 a 11): "Manuais de
 * instruções", cartões em Personalizado e Sistema, formulário com metade dos
 * campos que o servidor guarda.
 *
 * O que muda na lista: busca e filtro por categoria, a categoria e as
 * severidades no cartão, quantas revisões em 30 dias, Ativar e Desativar, e
 * "Duplicar para editar" no manual do sistema (hoje ele abre desabilitado e
 * sem saída). Um nome só: "Manual de revisão".
 */
import type { Textos } from './textos'
import EditorDeManual from './_EditorDeManual.vue'
import type { CategoriaDoManual, Manual } from './mocks'
import { EU } from './mocks'
import { corDaSeveridade, ORDEM_DAS_SEVERIDADES, useManuais } from './estado'

const props = defineProps<{ t: Textos }>()
const manuais = useManuais()
const toast = useToast()
const p = computed(() => props.t.playbooks)

const busca = ref('')
const categoria = ref<CategoriaDoManual | 'todas'>('todas')
const categorias = computed(() => [
  { value: 'todas', label: p.value.todasCategorias },
  ...(['legal_contract', 'nda', 'compliance', 'financial', 'quality', 'policy', 'technical', 'custom'] as const).map(c => ({ value: c, label: p.value.categorias[c] })),
])
const filtrados = computed(() => {
  const b = busca.value.trim().toLowerCase()
  return manuais.value.filter(m => (categoria.value === 'todas' || m.categoria === categoria.value) && (!b || `${m.nome} ${m.descricao}`.toLowerCase().includes(b)))
})
const grupos = computed(() => [
  { chave: 'ws', titulo: p.value.doWorkspace, ajuda: '', lista: filtrados.value.filter(m => !m.sistema) },
  { chave: 'sis', titulo: p.value.doSistema, ajuda: p.value.sistemaAjuda, lista: filtrados.value.filter(m => m.sistema) },
].filter(g => g.lista.length))

const severidades = (m: Manual) => ORDEM_DAS_SEVERIDADES.map(s => ({ s, n: m.regras.filter(r => r.severidade === s).length })).filter(x => x.n)

/* Gaveta do manual */
const aberto = ref(false)
const emEdicao = ref<Manual | null>(null)
function abrir(m: Manual | null) {
  emEdicao.value = m
  aberto.value = true
}
function duplicar(m: Manual) {
  const novo: Manual = JSON.parse(JSON.stringify(m))
  novo.id = `m-${Date.now()}`
  novo.nome = p.value.copia(m.nome)
  novo.sistema = false
  novo.autor = EU
  novo.atualizadoEm = '2026-11-16'
  novo.revisoes30d = 0
  manuais.value.unshift(novo)
  toast.add({ title: p.value.duplicado(m.nome), icon: 'i-lucide-copy', color: 'success' })
  return novo
}
function duplicarEEditar(m: Manual) {
  abrir(duplicar(m))
}
function alternar(m: Manual) {
  m.status = m.status === 'active' ? 'inactive' : 'active'
  toast.add({ title: m.status === 'active' ? p.value.ativado(m.nome) : p.value.desativado(m.nome), icon: 'i-lucide-power', color: 'neutral' })
}
function excluir(m: Manual) {
  manuais.value = manuais.value.filter(x => x.id !== m.id)
  toast.add({ title: p.value.excluido(m.nome), icon: 'i-lucide-trash-2', color: 'neutral' })
}
function salvo(m: Manual) {
  const i = manuais.value.findIndex(x => x.id === m.id)
  if (i >= 0) manuais.value[i] = m
  else manuais.value.unshift(m)
}

const acoes = (m: Manual) => m.sistema
  ? [[
      { label: p.value.acoes.ver, icon: 'i-lucide-eye', onSelect: () => abrir(m) },
      { label: p.value.acoes.duplicarParaEditar, icon: 'i-lucide-copy', onSelect: () => duplicarEEditar(m) },
    ]]
  : [[
      { label: p.value.acoes.editar, icon: 'i-lucide-pencil', onSelect: () => abrir(m) },
      { label: p.value.acoes.duplicar, icon: 'i-lucide-copy', onSelect: () => duplicar(m) },
      { label: m.status === 'active' ? p.value.acoes.desativar : p.value.acoes.ativar, icon: 'i-lucide-power', onSelect: () => alternar(m) },
    ], [
      { label: p.value.acoes.excluir, icon: 'i-lucide-trash-2', color: 'error' as const, onSelect: () => excluir(m) },
    ]]
</script>

<template>
  <div class="space-y-5">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 class="text-xl font-semibold text-highlighted">{{ p.titulo }}</h1>
        <p class="mt-0.5 max-w-3xl text-sm text-muted">{{ p.subtitulo }}</p>
      </div>
      <UButton :label="p.novo" icon="i-lucide-plus" @click="abrir(null)" />
    </div>

    <div class="flex flex-wrap gap-2">
      <UInput v-model="busca" :placeholder="p.buscar" icon="i-lucide-search" class="w-full max-w-xs" />
      <USelect v-model="categoria" :items="categorias" value-key="value" class="w-56" icon="i-lucide-tag" />
    </div>

    <p v-if="!grupos.length" class="rounded-lg bg-elevated/50 px-4 py-10 text-center text-sm text-muted">{{ p.nenhum }}</p>

    <section v-for="g in grupos" :key="g.chave" class="space-y-3">
      <div>
        <h2 class="text-sm font-semibold text-highlighted">{{ g.titulo }} <span class="font-normal text-muted">({{ g.lista.length }})</span></h2>
        <p v-if="g.ajuda" class="text-xs text-muted">{{ g.ajuda }}</p>
      </div>
      <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <article
          v-for="(m, i) in g.lista"
          :key="m.id"
          class="relative flex flex-col rounded-lg border bg-default p-4 transition hover:border-accented hover:shadow-sm animate-[entrada_300ms_ease-out_both]"
          :class="[m.sistema ? 'border-dashed border-accented' : 'border-default', m.status === 'inactive' ? 'opacity-70' : '']"
          :style="{ animationDelay: `${i * 40}ms` }"
        >
          <div class="flex items-start gap-3">
            <span class="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary"><UIcon :name="m.icone" class="size-4.5" /></span>
            <div class="min-w-0 flex-1">
              <h3 class="text-sm font-semibold text-highlighted">
                <a href="#" class="after:absolute after:inset-0 after:rounded-lg focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-primary" @click.prevent="abrir(m)">{{ m.nome }}</a>
              </h3>
              <p class="mt-0.5 line-clamp-2 text-xs text-muted">{{ m.descricao }}</p>
            </div>
            <UDropdownMenu :items="acoes(m)" :content="{ align: 'end' }">
              <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost" size="sm" class="relative z-10" :aria-label="`${p.acoes.abrir}: ${m.nome}`" />
            </UDropdownMenu>
          </div>

          <div class="mt-3 flex flex-wrap gap-1.5">
            <UBadge :label="p.categorias[m.categoria]" color="neutral" variant="soft" size="sm" icon="i-lucide-tag" />
            <UBadge :label="p.formatos[m.formato]!.nome" color="neutral" variant="outline" size="sm" />
            <UBadge :label="p.tons[m.tom]!.nome" color="neutral" variant="outline" size="sm" />
            <UBadge v-if="m.status === 'inactive'" :label="p.inativo" color="neutral" variant="solid" size="sm" />
          </div>

          <div class="mt-3 mb-3 flex flex-wrap items-center gap-1">
            <span class="mr-1 text-xs text-toned">{{ p.regras(m.regras.length) }}:</span>
            <UBadge v-for="x in severidades(m)" :key="x.s" :label="`${x.n} ${p.severidades[x.s]}`" :color="corDaSeveridade[x.s]" variant="subtle" size="xs" />
          </div>

          <p class="mt-auto flex flex-wrap gap-x-3 border-t border-default pt-3 text-xs text-muted">
            <span class="flex items-center gap-1"><UIcon name="i-lucide-list-checks" class="size-3.5" />{{ p.itens(m.checklist.length) }}</span>
            <span class="flex items-center gap-1"><UIcon name="i-lucide-file-search" class="size-3.5" />{{ p.revisoes(m.revisoes30d) }}</span>
          </p>
        </article>
      </div>
    </section>

    <EditorDeManual v-model:open="aberto" :t="t" :manual="emEdicao" @salvo="salvo" @duplicar="duplicarEEditar" />
  </div>
</template>
