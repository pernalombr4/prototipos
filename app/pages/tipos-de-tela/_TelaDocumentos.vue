<script setup lang="ts">
/**
 * TIPO DE MENU "DOCUMENTOS".
 *
 * Funde o tipo legado Arquivos com a tela nativa escondida "Documents". Hoje
 * a mesma coisa tem 4 nomes (Arquivos, Documentos, Meus Documentos e
 * Documents (Native), C2) e abre vazia sem dizer por quê.
 *
 * O que muda: 1 nome; cada arquivo mostra o item de origem e o fluxo que o
 * gerou; grade ou lista (a grade é o padrão, com o alternador à vista); o
 * estado vazio explica de onde os documentos vêm.
 */
import type { EnTableColumn } from '@be-enlighten/enspace-sdk-ui/base'
import { categorias, documentos, itemPorReferencia, type Documento, type ItemDoPrototipo, type SlugDaCategoria, type TipoDeArquivo } from './mocks'
import { dataCurta, dataEHora, tamanho } from './formatar'
import { useTiposDeTela } from './estado'
import CabecalhoDaTela from './_CabecalhoDaTela.vue'
import EstadoDaTela from './_EstadoDaTela.vue'
import VisaoRapida from './_VisaoRapida.vue'
import type { Textos } from './textos'

const props = defineProps<{ t: Textos }>()
const emit = defineEmits<{ tentarDeNovo: [] }>()

const { cenario } = useTiposDeTela()
const idioma = useIdioma()
const toast = useToast()

const forma = ref<'grade' | 'lista'>('grade')
const busca = ref('')
const tipo = ref<TipoDeArquivo | 'todos'>('todos')
const categoria = ref<SlugDaCategoria | 'todas'>('todas')

const filtrados = computed(() => {
  const q = busca.value.trim().toLowerCase()
  return documentos
    .filter(d => tipo.value === 'todos' || d.tipo === tipo.value)
    .filter(d => categoria.value === 'todas' || d.categoria === categoria.value)
    .filter(d => !q || d.nome.toLowerCase().includes(q) || d.itemRef.toLowerCase().includes(q))
    .sort((a, b) => b.geradoEm.getTime() - a.geradoEm.getTime())
})

const opcoesDeTipo = computed(() => [{ label: props.t.documentos.todosTipos, value: 'todos' }, ...(['pdf', 'docx', 'xlsx'] as TipoDeArquivo[]).map(x => ({ label: props.t.documentos.tipos[x], value: x }))])
const opcoesDeCategoria = computed(() => [{ label: props.t.documentos.todasCategorias, value: 'todas' }, ...categorias.filter(c => c.slug !== 'chamados-ti').map(c => ({ label: c.name, value: c.slug }))])

const icone: Record<TipoDeArquivo, { nome: string, cor: string }> = {
  pdf: { nome: 'i-lucide-file-text', cor: 'bg-error/10 text-error' },
  docx: { nome: 'i-lucide-file-type', cor: 'bg-info/10 text-info' },
  xlsx: { nome: 'i-lucide-file-spreadsheet', cor: 'bg-success/10 text-success' },
}

const baixando = ref<number | null>(null)
async function baixar(d: Documento) {
  baixando.value = d.id
  await new Promise(r => setTimeout(r, 700))
  baixando.value = null
  toast.add({ title: props.t.documentos.baixado(d.nome), icon: 'i-lucide-download', color: 'success' })
}

const previa = ref<Documento | null>(null)
const previaAberta = computed({ get: () => !!previa.value, set: (v) => { if (!v) previa.value = null } })
const itemAberto = ref<ItemDoPrototipo | null>(null)
function abrirItem(referencia: string) {
  itemAberto.value = itemPorReferencia(referencia)
}

interface Linha extends Record<string, unknown> {
  id: number
  nome: string
  item: string
  fluxo: string
  gerado: string
  tamanho: string
  d: Documento
}
const linhas = computed<Linha[]>(() => filtrados.value.map(d => ({
  id: d.id,
  nome: d.nome,
  item: d.itemRef,
  fluxo: d.fluxo,
  gerado: dataEHora(d.geradoEm, idioma.value),
  tamanho: tamanho(d.tamanhoKb, idioma.value),
  d,
})))
const colunas = computed<EnTableColumn[]>(() => {
  const c = props.t.documentos.colunas
  return [
    { key: 'nome', label: c.nome },
    { key: 'item', label: c.item },
    { key: 'fluxo', label: c.fluxo },
    { key: 'gerado', label: c.gerado },
    { key: 'tamanho', label: c.tamanho, align: 'right' },
  ]
})
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <CabecalhoDaTela
      icone="i-lucide-files"
      :titulo="t.documentos.titulo"
      :descricao="t.documentos.descricao"
      :substitui="['Arquivos', 'tela nativa escondida Documents (Native)']"
      onde="Tipo de menu, criado em Interface > Menus. Pede categorias e recorte."
    />

    <EstadoDaTela :t="t" :cenario="cenario" forma="cartoes" @tentar-de-novo="emit('tentarDeNovo')">
      <template #vazio>
        <UEmpty icon="i-lucide-files" :title="t.documentos.vazioTitulo" :description="t.documentos.vazioTexto" :actions="[{ label: t.documentos.vazioAcao, icon: 'i-lucide-workflow', color: 'neutral', variant: 'outline' }]" />
      </template>

      <div class="flex flex-wrap items-center gap-3 border-b border-default px-6 py-3">
        <UTabs
          v-model="forma"
          :items="[{ value: 'grade', label: t.documentos.grade, icon: 'i-lucide-layout-grid' }, { value: 'lista', label: t.documentos.lista, icon: 'i-lucide-list' }]"
          :content="false"
          size="sm"
          variant="pill"
          color="neutral"
        />
        <USelect v-model="tipo" :items="opcoesDeTipo" size="sm" icon="i-lucide-file" class="w-44" :aria-label="t.documentos.tipo" />
        <USelect v-model="categoria" :items="opcoesDeCategoria" size="sm" icon="i-lucide-layout-grid" class="w-52" :aria-label="t.documentos.categoria" />
        <UInput v-model="busca" icon="i-lucide-search" :placeholder="t.comum.buscar" size="sm" class="ml-auto w-56" :aria-label="t.comum.buscar" />
      </div>

      <div class="min-h-0 flex-1 overflow-auto p-6 pb-24">
        <p class="mb-3 text-xs text-muted">{{ t.comum.itens(filtrados.length) }}</p>

        <TransitionGroup
          v-if="forma === 'grade'"
          tag="ul"
          class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
          appear
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 translate-y-2"
        >
          <li
            v-for="(d, i) in filtrados"
            :key="d.id"
            class="group relative flex flex-col gap-3 rounded-lg border border-default bg-default p-4 transition hover:-translate-y-0.5 hover:border-accented hover:shadow-sm"
            :style="{ transitionDelay: `${Math.min(i, 12) * 25}ms` }"
          >
            <div class="flex items-start gap-3">
              <span class="flex size-10 shrink-0 items-center justify-center rounded-md" :class="icone[d.tipo].cor">
                <UIcon :name="icone[d.tipo].nome" class="size-5" />
              </span>
              <span class="min-w-0 flex-1">
                <!-- O cartão inteiro abre a prévia (stretched link, regra 25) -->
                <button type="button" class="block w-full truncate text-left text-sm font-medium text-highlighted after:absolute after:inset-0 after:rounded-lg focus-visible:outline-none" :title="d.nome" @click="previa = d">
                  {{ d.nome }}
                </button>
                <span class="block text-xs text-muted">{{ t.documentos.geradoPor(d.fluxo) }}</span>
              </span>
            </div>
            <div class="flex items-center gap-2 text-xs text-muted">
              <button type="button" class="relative z-10 rounded focus-visible:outline-2 focus-visible:outline-primary" :aria-label="`${t.documentos.origem}: ${d.itemRef}`" @click="abrirItem(d.itemRef)">
                <UBadge color="info" variant="subtle" size="sm" class="font-mono text-[11px] transition hover:bg-info/20">{{ d.itemRef }}</UBadge>
              </button>
              <span class="ml-auto tabular-nums">{{ dataCurta(d.geradoEm, idioma) }}</span>
              <span class="tabular-nums">{{ tamanho(d.tamanhoKb, idioma) }}</span>
              <UButton icon="i-lucide-download" color="neutral" variant="ghost" size="xs" class="relative z-10" :loading="baixando === d.id" :aria-label="`${t.documentos.baixar}: ${d.nome}`" @click="baixar(d)" />
            </div>
          </li>
        </TransitionGroup>

        <div v-else class="animate-[entrada_.25s_ease-out]">
          <EnTable :columns="colunas" :rows="linhas" :locale="idioma" @row-click="(r) => (previa = (r as Linha).d)">
            <template #cell-nome="{ row }">
              <span class="flex items-center gap-2">
                <span class="flex size-7 shrink-0 items-center justify-center rounded" :class="icone[(row as Linha).d.tipo].cor">
                  <UIcon :name="icone[(row as Linha).d.tipo].nome" class="size-4" />
                </span>
                <span class="max-w-72 truncate text-sm text-highlighted">{{ (row as Linha).nome }}</span>
              </span>
            </template>
            <template #cell-item="{ row }">
              <UButton color="info" variant="soft" size="xs" class="font-mono text-[11px]" :label="(row as Linha).item" @click.stop="abrirItem((row as Linha).item)" />
            </template>
            <template #actions="{ row }">
              <UButton icon="i-lucide-download" color="neutral" variant="ghost" size="xs" :loading="baixando === (row as Linha).id" :aria-label="t.documentos.baixar" @click.stop="baixar((row as Linha).d)" />
            </template>
          </EnTable>
        </div>
      </div>
    </EstadoDaTela>

    <!-- Prévia: maquete de página, com o item de origem e o download -->
    <UModal v-model:open="previaAberta" :title="previa?.nome ?? ''" :description="previa ? t.documentos.geradoPor(previa.fluxo) : ''" :ui="{ content: 'max-w-2xl' }">
      <template #body>
        <div v-if="previa" class="space-y-3">
          <div class="mx-auto aspect-[1/1.3] w-full max-w-sm space-y-3 rounded-md border border-default bg-default p-8 shadow-sm" aria-hidden="true">
            <div class="h-3 w-1/2 rounded bg-accented" />
            <div class="h-2 w-1/3 rounded bg-accented/70" />
            <div class="pt-4" />
            <div v-for="n in 9" :key="n" class="h-2 rounded bg-accented/60" :style="{ width: `${70 + ((n * 37) % 30)}%` }" />
            <div class="pt-6" />
            <div class="h-2 w-2/5 rounded bg-accented/60" />
          </div>
          <p class="text-center text-xs text-muted">{{ t.documentos.previaPagina(1, 3) }}</p>
        </div>
      </template>
      <template #footer>
        <div v-if="previa" class="flex w-full flex-wrap items-center gap-2">
          <UButton :label="`${t.documentos.origem}: ${previa.itemRef}`" icon="i-lucide-link" color="neutral" variant="outline" size="sm" @click="abrirItem(previa.itemRef)" />
          <UButton :label="t.documentos.baixar" icon="i-lucide-download" color="primary" size="sm" class="ml-auto" :loading="baixando === previa.id" @click="baixar(previa)" />
        </div>
      </template>
    </UModal>

    <VisaoRapida :t="t" :item="itemAberto" @fechar="itemAberto = null" />
  </div>
</template>
