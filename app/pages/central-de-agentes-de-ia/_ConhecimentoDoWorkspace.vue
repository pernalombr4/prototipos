<script setup lang="ts">
/**
 * PROPOSTA (rodada 2): o conhecimento do workspace, que todos os agentes
 * consultam. Aba do topo, ao lado de Agentes. Cada agente desliga o uso no
 * próprio cadastro (Editor > Conhecimento).
 *
 * Não é a "Knowledge Base" do menu do membro, que em develop é a busca de
 * perguntas e respostas (evidencias/develop-12-knowledge-base.jpg).
 */
import type { Textos } from './textos'
import TabelaDeDocumentos from './_TabelaDeDocumentos.vue'
import NovoDocumento from './_NovoDocumento.vue'
import { EU, type ArquivoDeReferencia } from './mocks'
import { useAgentes, useArquivos } from './estado'

const props = defineProps<{ t: Textos }>()
const arquivos = useArquivos()
const agentes = useAgentes()
const toast = useToast()
const k = computed(() => props.t.conhecimento)
const w = computed(() => props.t.conhecimentoDoWorkspace)

const busca = ref('')
const doWorkspace = computed(() => arquivos.value.filter(d => d.escopo === 'workspace'))
const filtrados = computed(() => {
  const b = busca.value.trim().toLowerCase()
  return b ? doWorkspace.value.filter(d => d.nome.toLowerCase().includes(b)) : doWorkspace.value
})
const tokens = computed(() => doWorkspace.value.reduce((s, d) => s + d.tokens, 0))
const usam = computed(() => agentes.value.filter(a => a.source === 'workspace' && a.usarDoWorkspace).length)

const exemplo: ArquivoDeReferencia = {
  id: 'w9', nome: 'Código de conduta.pdf', tipo: 'pdf', escopo: 'workspace', fixado: false, tamanho: 220, paginas: 18, tokens: 14, enviadoEm: '2026-11-16', enviadoPor: EU, versao: 1,
}
function criado(d: ArquivoDeReferencia) {
  arquivos.value.push(d)
}
function remover(id: string) {
  const d = arquivos.value.find(x => x.id === id)!
  arquivos.value = arquivos.value.filter(x => x.id !== id)
  toast.add({ title: k.value.removido(d.nome), icon: 'i-lucide-trash-2', color: 'neutral' })
}
</script>

<template>
  <div class="space-y-5">
    <div>
      <h2 class="text-lg font-semibold text-highlighted">{{ w.titulo }}</h2>
      <p class="mt-0.5 max-w-3xl text-sm text-muted">{{ w.texto }}</p>
      <p class="mt-2 flex flex-wrap gap-x-3 text-xs text-dimmed">
        <span>{{ k.total(doWorkspace.length, tokens) }}</span>
        <span>{{ w.usadoPor(usam) }}</span>
      </p>
    </div>

    <NovoDocumento :t="t" escopo="workspace" :exemplo="exemplo" @criado="criado" />

    <template v-if="doWorkspace.length">
      <UInput v-model="busca" :placeholder="w.buscar" icon="i-lucide-search" class="w-full max-w-sm" />
      <TabelaDeDocumentos v-if="filtrados.length" :t="t" :docs="filtrados" @remover="remover" />
      <p v-else class="rounded-lg bg-elevated/50 px-4 py-6 text-center text-sm text-muted">{{ w.nenhum }}</p>
    </template>
    <p v-else class="rounded-lg bg-elevated/50 px-4 py-10 text-center text-sm text-muted">{{ w.vazio }}</p>

    <div class="space-y-1 text-xs text-muted">
      <p class="flex items-start gap-1.5"><UIcon name="i-lucide-book-open" class="mt-0.5 size-3.5 shrink-0" />{{ w.leitura }}</p>
      <p class="flex items-start gap-1.5"><UIcon name="i-lucide-pin" class="mt-0.5 size-3.5 shrink-0" />{{ k.fixadoAjuda }}</p>
    </div>
  </div>
</template>
