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
import { textosDaTarefa } from './textosDaTarefa'
import { textosDeAtalhos } from './textosDeAtalhos'
import AtalhoDeCriar from './_AtalhoDeCriar.vue'
import { textosDasRelacoes } from './textosDasRelacoes'
import { useOpcoesDePessoas } from './pessoasDoProjeto'

const prj = useProjetos()
const r = useTextos(textosDoProjeto)
const toast = useToast()
const { marca } = useMarcaDeProposta()
/** Rodada 9: o campo Marco da nova tarefa. */
const md = useMetasEDiscussoes()
const tmm = useTextos(textosDeMarcosEMedicao)
const tt = useTextos(textosDaTarefa)

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
/** Rodada 10: o item é opcional no produto; categoria 0 é "Sem item" e a tarefa fica no projeto. */
const itensDaCategoria = computed(() => tar.categoria ? prj.itensDaCategoria(tar.categoria) : [])
/**
 * Rodada 14: a tarefa guarda o projeto, e o item pode ser de uma categoria do workspace (B8). O responsável sai de
 * quem entra no projeto (B11). A janela abre já preenchida pelo "Criar tarefa" do item (B3) e da mensagem da
 * discussão (B16), que é o mesmo formulário de tarefa do resto do projeto.
 */
const tr = useTextos(textosDasRelacoes)
const pes = useOpcoesDePessoas()
const opCategoriasDaTarefa = computed(() => [
  ...catsTarefa.value.map(c => ({ value: c.id, label: c.name, icon: c.icon })),
  ...prj.categoriasDoWorkspace.value.map(c => ({ value: c.id, label: c.name, icon: c.icon, description: tr.value.tarefa.itensDoWorkspace })),
  { value: 0, label: tt.value.novaTarefaSemItem, icon: 'i-lucide-circle-dashed' },
])
const origemDaTarefa = ref<{ discussao: number, mensagem: number } | undefined>()
let preenchendo = false
watch(abertaTarefa, (v) => {
  if (!v) {
    prj.preenchimento.value = null
    return
  }
  const pre = prj.preenchimento.value ?? {}
  preenchendo = true
  Object.assign(tar, {
    titulo: pre.titulo ?? '',
    categoria: pre.categoria ?? (pre.origem ? 0 : catsTarefa.value[0]?.id ?? 0),
    item: pre.item ?? '',
    responsavel: pre.responsavel && projTarefa.value && prj.pessoasDoProjeto(projTarefa.value.id).some(a => a.id === pre.responsavel) ? pre.responsavel : prj.eu.value,
    prazo: '2026-11-30',
    prioridade: 'media',
    marco: 0,
  })
  origemDaTarefa.value = pre.origem
  nextTick(() => { preenchendo = false })
})
watch(() => tar.categoria, () => { if (!preenchendo) tar.item = itensDaCategoria.value[0] ?? '' }, { immediate: true })
const opPessoas = computed(() => projTarefa.value ? pes.opcoes(projTarefa.value.id) : [])
const opPrioridade = computed(() => (['urgente', 'alta', 'media', 'baixa'] as Prioridade[]).map(x => ({ value: x, label: r.value.tarefas.prioridade[x] })))
/**
 * Rodada 11: os seletores Categoria e Marco da nova tarefa têm o atalho de criar no pé (`_AtalhoDeCriar.vue`).
 * A categoria nasce no projeto, sem campos; o marco, só para quem administra o projeto, com a data limite da
 * tarefa como data-alvo. O novo já fica escolhido.
 */
const ta = useTextos(textosDeAtalhos)
const buscaCategoriaDaTarefa = ref('')
const buscaMarcoDaTarefa = ref('')
const podeMarcoNaTarefa = computed(() => !!projTarefa.value && md.podeEditarMarcos(projTarefa.value.id))
function criarCategoriaNaTarefa(nome: string) {
  tar.categoria = prj.criarCategoria(projTarefa.value!.id, nome, 'i-lucide-folder')
  toast.add({ title: ta.value.categoria.criada(nome), icon: 'i-lucide-folder-plus', color: 'success' })
  buscaCategoriaDaTarefa.value = ''
}
function criarMarcoNaTarefa(nome: string) {
  tar.marco = md.criarMarcoRapido(projTarefa.value!.id, nome, tar.prazo).id
  toast.add({ title: ta.value.marco.criado(nome), icon: 'i-lucide-flag', color: 'success' })
  buscaMarcoDaTarefa.value = ''
}
function criarTarefa() {
  const p = projTarefa.value!
  const veioDeFora = !!prj.preenchimento.value
  pes.garantir(p.id, tar.responsavel)
  const id = prj.criarTarefa({
    titulo: tar.titulo.trim(),
    categoria: tar.categoria || null,
    item: tar.categoria ? tar.item : null,
    projeto: p.id,
    responsavel: tar.responsavel,
    prazo: tar.prazo,
    prioridade: tar.prioridade,
    ...(origemDaTarefa.value ? { origem: origemDaTarefa.value } : {}),
  })
  if (tar.marco) md.definirMarcoDaTarefa(id, tar.marco)
  abertaTarefa.value = false
  toast.add({ title: r.value.novaTarefa.criada(tar.titulo.trim()), icon: 'i-lucide-check', color: 'success' })
  // aberta pelo item ou pela discussão, a pessoa continua onde estava
  if (!veioDeFora) prj.abrirAba(p.id, 'tarefas')
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
      <form id="form-nova-tarefa" class="grid gap-4 sm:grid-cols-2" @submit.prevent="tar.titulo.trim() && criarTarefa()">
        <UFormField :label="r.novaTarefa.tituloCampo" required class="sm:col-span-2">
          <UInput v-model="tar.titulo" :placeholder="r.novaTarefa.tituloPh" class="w-full" autofocus />
        </UFormField>
        <UFormField :label="r.novaTarefa.categoria" :help="tar.categoria ? undefined : tt.novaTarefaSemItemDica" :class="tar.categoria ? '' : marca">
          <USelectMenu v-model="tar.categoria" v-model:search-term="buscaCategoriaDaTarefa" :items="opCategoriasDaTarefa" value-key="value" class="w-full" :ui="{ content: 'min-w-72' }">
            <template #content-bottom>
              <AtalhoDeCriar :termo="buscaCategoriaDaTarefa" :rotulo="ta.categoria.rotulo" :com="ta.categoria.com" :dica="ta.categoria.dica" @criar="criarCategoriaNaTarefa" />
            </template>
          </USelectMenu>
        </UFormField>
        <UFormField v-if="tar.categoria" :label="r.novaTarefa.item" required>
          <USelect v-model="tar.item" :items="itensDaCategoria" class="w-full" />
        </UFormField>
        <UFormField :label="r.novaTarefa.responsavel" :class="marca">
          <USelectMenu v-model="tar.responsavel" :items="opPessoas" value-key="value" class="w-full" :ui="{ content: 'min-w-64' }" />
        </UFormField>
        <p v-if="origemDaTarefa" class="flex items-center gap-1.5 text-xs text-muted sm:col-span-2" :class="marca">
          <UIcon name="i-lucide-messages-square" class="size-3.5 shrink-0" />{{ tr.tarefa.criadaNaDiscussao }}: {{ md.discussoes.value.find(d => d.id === origemDaTarefa!.discussao)?.titulo }}
        </p>
        <UFormField :label="r.novaTarefa.prazo">
          <UInput v-model="tar.prazo" type="date" class="w-full" />
        </UFormField>
        <UFormField :label="r.novaTarefa.prioridade">
          <USelect v-model="tar.prioridade" :items="opPrioridade" class="w-full" />
        </UFormField>
        <UFormField :label="tmm.marcos.colMarco" :class="marca">
          <USelectMenu v-model="tar.marco" v-model:search-term="buscaMarcoDaTarefa" :items="opMarcosDaTarefa" value-key="value" class="w-full" :ui="{ content: 'min-w-72' }">
            <template v-if="podeMarcoNaTarefa" #content-bottom>
              <AtalhoDeCriar :termo="buscaMarcoDaTarefa" :rotulo="ta.marco.rotulo" :com="ta.marco.com" :dica="ta.marco.dica" @criar="criarMarcoNaTarefa" />
            </template>
          </USelectMenu>
        </UFormField>
      </form>
    </template>
    <template #footer>
      <div class="flex w-full justify-end gap-2">
        <UButton :label="r.novaTarefa.cancelar" color="neutral" variant="ghost" @click="abertaTarefa = false" />
        <UButton type="submit" form="form-nova-tarefa" :label="r.novaTarefa.criar" icon="i-lucide-square-check" :disabled="!tar.titulo.trim()" />
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
