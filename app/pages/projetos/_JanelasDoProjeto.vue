<script setup lang="ts">
/**
 * PROPOSTA (rodada 5): as 3 janelas que o "+" do projeto abre.
 *
 *  - Nova categoria: nome e ícone; nasce dentro do projeto. Campos e formulário seguem nas
 *    configurações da categoria, como hoje.
 *  - Nova tarefa: a tarefa rápida de hoje, ligada a um item de uma categoria do projeto.
 *  - Novo Workflow: o modal do Spaceflow como está no produto (Nome, Descrição, Ícone, Criar e
 *    Cancelar, "Crie um novo workflow para este workspace."). O que o projeto acrescenta é o bloco
 *    Gatilho, já preenchido com Eventos na Plataforma da categoria escolhida; no produto o workflow
 *    nasce com o gatilho Manual e o gatilho se troca no editor.
 */
import { pessoas } from './mocks'
import type { Gatilho, Prioridade } from './mocks'
import { textosDoProjeto } from './textosDoProjeto'
import { useMarcaDeProposta, useProjetos } from './estado'
import { useMetasEDiscussoes } from './metasEDiscussoes'
import { textosDeMarcosEMedicao } from './textosDeMarcosEMedicao'

const prj = useProjetos()
const r = useTextos(textosDoProjeto)
const toast = useToast()
const { marca } = useMarcaDeProposta()
/** Rodada 9: o campo Marco da nova tarefa. */
const md = useMetasEDiscussoes()
const tmm = useTextos(textosDeMarcosEMedicao)

const ICONES = ['i-lucide-folder', 'i-lucide-receipt', 'i-lucide-file-text', 'i-lucide-hand-coins', 'i-lucide-calendar', 'i-lucide-users-round', 'i-lucide-briefcase', 'i-lucide-truck', 'i-lucide-target', 'i-lucide-workflow', 'i-lucide-zap', 'i-lucide-bell']

function janela(chave: 'novaCategoria' | 'novaTarefa' | 'novoFluxo') {
  return computed({
    get: () => prj.janelas[chave].value !== null,
    set: (v: boolean) => { if (!v) prj.janelas[chave].value = null },
  })
}
const projetoDe = (id: number | null) => prj.projetos.value.find(p => p.id === id) ?? null

/* ---------- Nova categoria ---------- */
const abertaCategoria = janela('novaCategoria')
const projCategoria = computed(() => projetoDe(prj.janelas.novaCategoria.value))
const cat = reactive({ nome: '', icone: 'i-lucide-folder' })
watch(abertaCategoria, (v) => { if (v) Object.assign(cat, { nome: '', icone: 'i-lucide-folder' }) })
function criarCategoria() {
  const p = projCategoria.value!
  const id = prj.criarCategoria(p.id, cat.nome.trim(), cat.icone)
  abertaCategoria.value = false
  toast.add({ title: r.value.novaCategoria.criada(cat.nome.trim()), icon: 'i-lucide-check', color: 'success' })
  prj.abrirCategoria(id)
}

/* ---------- Nova tarefa ---------- */
const abertaTarefa = janela('novaTarefa')
const projTarefa = computed(() => projetoDe(prj.janelas.novaTarefa.value))
const catsTarefa = computed(() => projTarefa.value ? prj.categoriasDe(projTarefa.value.id) : [])
const tar = reactive({ titulo: '', categoria: 0, item: '', responsavel: 1, prazo: '2026-11-30', prioridade: 'media' as Prioridade, marco: 0 })
const opMarcosDaTarefa = computed(() => [
  { value: 0, label: tmm.value.marcos.semMarco },
  ...(projTarefa.value ? md.marcosDo(projTarefa.value.id).filter(m => m.status === 'aberto').map(m => ({ value: m.id, label: m.nome, icon: 'i-lucide-flag' })) : []),
])
const itensDaCategoria = computed(() => {
  const c = catsTarefa.value.find(x => x.id === tar.categoria)
  if (!c) return []
  const prefixo = c.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  return [0, 1, 2, 3].map(n => `${prefixo}${4210 - n * 17}`)
})
watch(abertaTarefa, (v) => {
  if (!v) return
  Object.assign(tar, { titulo: '', categoria: catsTarefa.value[0]?.id ?? 0, item: '', responsavel: prj.eu.value, prazo: '2026-11-30', prioridade: 'media', marco: 0 })
})
watch(() => tar.categoria, () => { tar.item = itensDaCategoria.value[0] ?? '' }, { immediate: true })
const opPessoas = computed(() => pessoas.filter(x => !x.convidado).map(x => ({ value: x.id, label: x.nome })))
const opPrioridade = computed(() => (['alta', 'media', 'baixa'] as Prioridade[]).map(x => ({ value: x, label: r.value.tarefas.prioridade[x] })))
function criarTarefa() {
  prj.criarTarefa({ titulo: tar.titulo.trim(), categoria: tar.categoria, item: tar.item, responsavel: tar.responsavel, prazo: tar.prazo, prioridade: tar.prioridade })
  if (tar.marco) md.definirMarcoDaTarefa(prj.tarefas.value[0]!.id, tar.marco)
  const p = projTarefa.value!
  abertaTarefa.value = false
  toast.add({ title: r.value.novaTarefa.criada(tar.titulo.trim()), icon: 'i-lucide-check', color: 'success' })
  prj.abrirAba(p.id, 'tarefas')
}

/* ---------- Novo Workflow ---------- */
const abertoFluxo = janela('novoFluxo')
const projFluxo = computed(() => projetoDe(prj.janelas.novoFluxo.value))
const catsFluxo = computed(() => projFluxo.value ? prj.categoriasDe(projFluxo.value.id) : [])
const flx = reactive({ nome: '', descricao: '', icone: 'i-lucide-workflow', categoria: 0, gatilho: 'criado' as Gatilho })
watch(abertoFluxo, (v) => {
  if (v) Object.assign(flx, { nome: '', descricao: '', icone: 'i-lucide-workflow', categoria: catsFluxo.value[0]?.id ?? 0, gatilho: 'criado' })
})
const opAcoes = computed(() => (['criado', 'atualizado', 'excluido'] as Gatilho[]).map(x => ({ value: x, label: r.value.workflows.acoes[x as 'criado'] })))
function criarFluxo() {
  const p = projFluxo.value!
  prj.criarFluxo({ nome: flx.nome.trim(), descricao: flx.descricao.trim(), icone: flx.icone, categoria: flx.categoria, gatilho: flx.gatilho })
  abertoFluxo.value = false
  toast.add({ title: r.value.workflows.criado(flx.nome.trim()), icon: 'i-lucide-workflow', color: 'success' })
  prj.abrirAba(p.id, 'automacoes')
}
</script>

<template>
  <!-- Nova categoria -->
  <UModal v-model:open="abertaCategoria" :title="r.novaCategoria.titulo" :description="projCategoria ? r.novaCategoria.descricao(projCategoria.nome) : ''" :ui="{ content: 'max-w-md' }">
    <template #body>
      <form id="form-nova-categoria" class="space-y-4" @submit.prevent="cat.nome.trim() && criarCategoria()">
        <UFormField :label="r.novaCategoria.nome" required>
          <UInput v-model="cat.nome" :placeholder="r.novaCategoria.nomePh" class="w-full" autofocus />
        </UFormField>
        <UFormField :label="r.novaCategoria.icone">
          <div class="flex flex-wrap gap-1.5" role="radiogroup" :aria-label="r.novaCategoria.icone">
            <UButton
              v-for="i in ICONES"
              :key="i"
              :icon="i"
              size="sm"
              :color="cat.icone === i ? 'primary' : 'neutral'"
              :variant="cat.icone === i ? 'soft' : 'ghost'"
              role="radio"
              :aria-checked="cat.icone === i"
              :aria-label="i.replace('i-lucide-', '')"
              @click="cat.icone = i"
            />
          </div>
        </UFormField>
      </form>
    </template>
    <template #footer>
      <div class="flex w-full justify-end gap-2">
        <UButton :label="r.novaCategoria.cancelar" color="neutral" variant="ghost" @click="abertaCategoria = false" />
        <UButton type="submit" form="form-nova-categoria" :label="r.novaCategoria.criar" icon="i-lucide-folder-plus" :disabled="!cat.nome.trim()" />
      </div>
    </template>
  </UModal>

  <!-- Nova tarefa -->
  <UModal v-model:open="abertaTarefa" :title="r.novaTarefa.titulo" :description="r.novaTarefa.descricao" :ui="{ content: 'max-w-lg' }">
    <template #body>
      <form id="form-nova-tarefa" class="grid gap-4 sm:grid-cols-2" @submit.prevent="tar.titulo.trim() && tar.categoria && criarTarefa()">
        <UFormField :label="r.novaTarefa.tituloCampo" required class="sm:col-span-2">
          <UInput v-model="tar.titulo" :placeholder="r.novaTarefa.tituloPh" class="w-full" autofocus />
        </UFormField>
        <UFormField :label="r.novaTarefa.categoria" required>
          <USelect v-model="tar.categoria" :items="catsTarefa.map(c => ({ value: c.id, label: c.name, icon: c.icon }))" class="w-full" />
        </UFormField>
        <UFormField :label="r.novaTarefa.item" required>
          <USelect v-model="tar.item" :items="itensDaCategoria" class="w-full" />
        </UFormField>
        <UFormField :label="r.novaTarefa.responsavel">
          <USelect v-model="tar.responsavel" :items="opPessoas" class="w-full" />
        </UFormField>
        <UFormField :label="r.novaTarefa.prazo">
          <UInput v-model="tar.prazo" type="date" class="w-full" />
        </UFormField>
        <UFormField :label="r.novaTarefa.prioridade">
          <USelect v-model="tar.prioridade" :items="opPrioridade" class="w-full" />
        </UFormField>
        <UFormField :label="tmm.marcos.colMarco" :class="marca">
          <USelect v-model="tar.marco" :items="opMarcosDaTarefa" class="w-full" />
        </UFormField>
      </form>
    </template>
    <template #footer>
      <div class="flex w-full justify-end gap-2">
        <UButton :label="r.novaTarefa.cancelar" color="neutral" variant="ghost" @click="abertaTarefa = false" />
        <UButton type="submit" form="form-nova-tarefa" :label="r.novaTarefa.criar" icon="i-lucide-square-check" :disabled="!tar.titulo.trim() || !tar.categoria" />
      </div>
    </template>
  </UModal>

  <!-- Novo Workflow: o modal do Spaceflow -->
  <UModal v-model:open="abertoFluxo" :title="r.workflows.janelaTitulo" :description="r.workflows.janelaDescricao" :ui="{ content: 'max-w-lg' }">
    <template #body>
      <form id="form-novo-fluxo" class="space-y-4" @submit.prevent="flx.nome.trim() && flx.categoria && criarFluxo()">
        <UFormField :label="r.workflows.nome" required>
          <UInput v-model="flx.nome" :placeholder="r.workflows.nomePh" class="w-full" autofocus />
        </UFormField>
        <UFormField :label="r.workflows.descricao">
          <UTextarea v-model="flx.descricao" :placeholder="r.workflows.descricaoPh" :rows="2" class="w-full" />
        </UFormField>
        <UFormField :label="r.workflows.icone">
          <div class="flex flex-wrap gap-1.5" role="radiogroup" :aria-label="r.workflows.icone">
            <UButton
              v-for="i in ICONES"
              :key="i"
              :icon="i"
              size="sm"
              :color="flx.icone === i ? 'primary' : 'neutral'"
              :variant="flx.icone === i ? 'soft' : 'ghost'"
              role="radio"
              :aria-checked="flx.icone === i"
              :aria-label="i.replace('i-lucide-', '')"
              @click="flx.icone = i"
            />
          </div>
        </UFormField>

        <!-- o que o projeto acrescenta ao modal de hoje -->
        <fieldset class="rounded-md border border-default p-3" :class="marca">
          <legend class="px-1 text-xs font-semibold uppercase tracking-wide text-muted">{{ r.workflows.gatilho }}</legend>
          <p class="mb-3 text-xs text-muted">{{ r.workflows.gatilhoDica }}</p>
          <div class="grid gap-3 sm:grid-cols-2">
            <UFormField :label="r.workflows.entidade">
              <USelect v-model="flx.categoria" :items="catsFluxo.map(c => ({ value: c.id, label: `(${r.menu.itens}) ${c.name}`, icon: c.icon }))" class="w-full" />
            </UFormField>
            <UFormField :label="r.workflows.quando">
              <USelect v-model="flx.gatilho" :items="opAcoes" class="w-full" />
            </UFormField>
          </div>
        </fieldset>
      </form>
    </template>
    <template #footer>
      <div class="flex w-full justify-end gap-2">
        <UButton :label="r.workflows.cancelar" color="neutral" variant="ghost" @click="abertoFluxo = false" />
        <UButton type="submit" form="form-novo-fluxo" :label="r.workflows.criar" icon="i-lucide-plus" :disabled="!flx.nome.trim() || !flx.categoria" />
      </div>
    </template>
  </UModal>
</template>
