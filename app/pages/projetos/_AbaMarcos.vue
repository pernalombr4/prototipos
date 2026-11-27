<script setup lang="ts">
/**
 * Rodada 9: a aba Marcos do projeto, com o CRUD do marco. Proposta inteira, sem tela no develop.
 *
 * O marco é a entrega com data-alvo dentro do projeto (o milestone do GitHub). Ele junta tarefas do projeto, e
 * o progresso é a parte concluída delas: ninguém digita porcentagem. A tarefa entra no marco por 3 caminhos:
 * ao criar ou editar o marco, no painel do marco ("Adicionar tarefas") e no campo Marco da tarefa. Cada tarefa
 * fica em 1 marco só. O marco se conclui à mão: as tarefas ainda abertas saem dele e continuam no projeto.
 * Cria, edita, conclui e exclui quem administra o projeto; os outros participantes leem e concluem tarefas.
 */
import type { DropdownMenuItem } from '@nuxt/ui'
import type { Textos } from './textos'
import { iniciais, pessoa, pessoas } from './mocks'
import { useMarcaDeProposta, useProjetos } from './estado'
import { useMetasEDiscussoes, type Marco } from './metasEDiscussoes'
import { textosDeMarcosEMedicao } from './textosDeMarcosEMedicao'
import { textosDoProjeto } from './textosDoProjeto'
import { textosDeAtalhos } from './textosDeAtalhos'
import { textosDeAcoes } from './textosDeAcoes'
import AtalhoDeCriar from './_AtalhoDeCriar.vue'

const props = defineProps<{ t: Textos, id: number }>()
const prj = useProjetos()
const md = useMetasEDiscussoes()
const tx = useTextos(textosDeMarcosEMedicao)
const tm = computed(() => tx.value.marcos)
const rp = useTextos(textosDoProjeto)
const tac = useTextos(textosDeAcoes)
const ta = useTextos(textosDeAtalhos)
const idioma = useIdioma()
const toast = useToast()
const { marca } = useMarcaDeProposta()
const HOJE = '2026-11-26'

const data = (d: string) => new Date(`${d}T12:00:00`).toLocaleDateString(idioma.value, { day: '2-digit', month: 'short', year: 'numeric' })
const podeEditar = computed(() => md.podeEditarMarcos(props.id))
const filtro = ref<'aberto' | 'concluido'>('aberto')
const todos = computed(() => md.marcosDo(props.id))
const lista = computed(() => todos.value.filter(m => m.status === filtro.value))
const contagem = (s: 'aberto' | 'concluido') => todos.value.filter(m => m.status === s).length
const feitas = (m: Marco) => md.tarefasDoMarco(m).filter(x => x.status === 'concluida').length
const passou = (m: Marco) => m.status === 'aberto' && m.dataAlvo < HOJE
const cor = (m: Marco) => md.progressoDoMarco(m) === 100 ? 'success' : passou(m) ? 'error' : 'primary'

/* ---------- o marco aberto ---------- */
const aberto = computed(() => md.marcos.value.find(m => m.id === md.marcoAberto.value && m.projeto === props.id) ?? null)
const painel = computed({
  get: () => !!aberto.value,
  set: (v: boolean) => { if (!v) md.marcoAberto.value = null },
})
/** Rodada 12: as ações do marco servem ao painel e ao menu ⋯ de cada linha da lista. */
function acoesDe(m: Marco): DropdownMenuItem[][] {
  if (!podeEditar.value) return []
  return [
    [
      { label: tm.value.editar, icon: 'i-lucide-pencil', onSelect: () => abrirForm(m) },
      m.status === 'aberto'
        ? { label: tm.value.concluir, icon: 'i-lucide-flag', onSelect: () => { aConcluir.value = m } }
        : { label: tm.value.reabrir, icon: 'i-lucide-rotate-ccw', onSelect: () => { md.reabrirMarco(m); toast.add({ title: tm.value.reaberto(m.nome), icon: 'i-lucide-rotate-ccw', color: 'neutral' }) } },
    ],
    [{ label: tm.value.excluir, icon: 'i-lucide-trash-2', color: 'error', onSelect: () => { aExcluir.value = m } }],
  ]
}
const acoes = computed(() => aberto.value ? acoesDe(aberto.value) : [])
const acoesDaLinha = (m: Marco): DropdownMenuItem[][] => [
  [
    { label: tac.value.abrir, icon: 'i-lucide-panel-right-open', onSelect: () => { md.marcoAberto.value = m.id } },
    { label: tac.value.copiarLink, icon: 'i-lucide-link', onSelect: () => toast.add({ title: tac.value.linkCopiado, icon: 'i-lucide-check', color: 'success' }) },
  ],
  ...acoesDe(m),
]
/** As tarefas do projeto que ainda não estão neste marco, para adicionar. */
const opAdicionar = computed(() => {
  const m = aberto.value
  if (!m) return []
  return prj.tarefasDoProjeto(props.id)
    .filter(x => !m.tarefas.includes(x.id) && x.status !== 'concluida')
    .map(x => ({ value: x.id, label: x.titulo, description: md.marcoDaTarefa(x.id)?.nome }))
})
const paraAdicionar = ref<number[]>([])
watch(paraAdicionar, (ids) => {
  if (!ids.length || !aberto.value) return
  md.ligarTarefas(aberto.value, ids)
  paraAdicionar.value = []
})

/**
 * Rodada 11: o pé dos 2 seletores de tarefa do marco (no painel e na janela do marco) tem o atalho
 * "Criar tarefa" (`_AtalhoDeCriar.vue`). Cria a tarefa rápida sem item, no projeto, com o nome da busca,
 * a pessoa como responsável e a data-alvo do marco como data limite, e a põe no marco.
 */
const buscaPainel = ref('')
const buscaForm = ref('')
function criarPeloSeletor(onde: 'painel' | 'form', titulo: string) {
  const prazo = onde === 'painel' && aberto.value ? aberto.value.dataAlvo : fData.value
  const id = prj.criarTarefa({ titulo, categoria: null, item: null, projeto: props.id, responsavel: prj.eu.value, prazo, prioridade: 'media' })
  if (onde === 'painel' && aberto.value) md.ligarTarefas(aberto.value, [id])
  else fTarefas.value = [...fTarefas.value, id]
  toast.add({ title: ta.value.tarefa.criada(titulo), icon: 'i-lucide-square-check', color: 'success' })
  if (onde === 'painel') buscaPainel.value = ''
  else buscaForm.value = ''
}

/* ---------- criar e editar ---------- */
const form = ref(false)
const fId = ref<number | undefined>()
const fNome = ref('')
const fDescricao = ref('')
const fResp = ref<number>(prj.eu.value)
const fData = ref('2026-12-15')
const fTarefas = ref<number[]>([])
const opPessoas = computed(() => pessoas.filter(p => !p.convidado).map(p => ({ value: p.id, label: p.nome })))
const opTarefas = computed(() => prj.tarefasDoProjeto(props.id).map(x => {
  const outro = md.marcoDaTarefa(x.id)
  return { value: x.id, label: x.titulo, description: outro && outro.id !== fId.value ? outro.nome : undefined }
}))
function abrirForm(m?: Marco) {
  fId.value = m?.id
  fNome.value = m?.nome ?? ''
  fDescricao.value = m?.descricao ?? ''
  fResp.value = m?.responsavel ?? prj.eu.value
  fData.value = m?.dataAlvo ?? '2026-12-15'
  fTarefas.value = m ? [...m.tarefas] : []
  form.value = true
}
function salvar() {
  if (!fNome.value.trim()) return
  const novo = !fId.value
  const m = md.salvarMarco({ id: fId.value, projeto: props.id, nome: fNome.value.trim(), descricao: fDescricao.value.trim(), responsavel: fResp.value, dataAlvo: fData.value, tarefas: fTarefas.value })
  form.value = false
  filtro.value = m.status
  md.marcoAberto.value = m.id
  toast.add({ title: novo ? tm.value.criado(m.nome) : tm.value.salvo(m.nome), icon: 'i-lucide-flag', color: 'success' })
}

/* ---------- concluir e excluir ---------- */
const aConcluir = ref<Marco | null>(null)
const aExcluir = ref<Marco | null>(null)
const abertasDoConcluir = computed(() => aConcluir.value ? md.tarefasDoMarco(aConcluir.value).filter(x => x.status !== 'concluida').length : 0)
function concluir() {
  const m = aConcluir.value!
  md.concluirMarco(m)
  aConcluir.value = null
  toast.add({ title: tm.value.concluido(m.nome), icon: 'i-lucide-flag', color: 'success' })
}
function excluir() {
  const m = aExcluir.value!
  md.excluirMarco(m)
  aExcluir.value = null
  toast.add({ title: tm.value.excluido(m.nome), icon: 'i-lucide-trash-2', color: 'neutral' })
}

const COR_DO_STATUS = { aberta: 'neutral', andamento: 'info', bloqueada: 'warning', concluida: 'success' } as const
</script>

<template>
  <div>
    <div class="flex flex-col gap-3" :class="marca">
      <!-- como o marco avança: a regra fica à vista, sem precisar adivinhar -->
      <UAlert
        :title="tm.comoAvanca"
        :description="tm.comoAvancaTexto"
        icon="i-lucide-info"
        color="neutral"
        variant="subtle"
      />

      <div class="flex flex-col rounded-lg border border-default bg-default">
        <div class="flex flex-wrap items-center gap-2 border-b border-default px-3 py-2">
          <div class="flex items-center gap-1">
            <UButton
              v-for="s in (['aberto', 'concluido'] as const)"
              :key="s"
              :label="`${s === 'aberto' ? tm.abertos : tm.concluidos} ${contagem(s)}`"
              :icon="s === 'aberto' ? 'i-lucide-flag' : 'i-lucide-circle-check'"
              size="sm"
              :color="filtro === s ? 'primary' : 'neutral'"
              :variant="filtro === s ? 'soft' : 'ghost'"
              @click="filtro = s"
            />
          </div>
          <span class="ml-auto text-xs text-muted">{{ tm.contagem(lista.length) }}</span>
          <UTooltip :text="podeEditar ? '' : tm.soAdmin" :disabled="podeEditar">
            <UButton :label="tm.novo" icon="i-lucide-plus" size="sm" :disabled="!podeEditar" @click="abrirForm()" />
          </UTooltip>
        </div>

        <div v-if="!lista.length" class="flex flex-col items-center gap-2 px-6 py-10 text-center">
          <span class="flex size-10 items-center justify-center rounded-lg bg-elevated"><UIcon name="i-lucide-flag" class="size-5 text-muted" /></span>
          <template v-if="filtro === 'aberto'">
            <p class="text-sm font-semibold text-highlighted">{{ tm.vazioTitulo }}</p>
            <p class="max-w-md text-sm text-muted">{{ tm.vazioTexto }}</p>
            <UButton v-if="podeEditar" :label="tm.novo" icon="i-lucide-plus" size="sm" color="neutral" variant="outline" class="mt-1" @click="abrirForm()" />
          </template>
          <p v-else class="text-sm text-muted">{{ tm.vazioConcluidos }}</p>
        </div>

        <ul v-else class="divide-y divide-default">
          <li v-for="(m, i) in lista" :key="m.id" class="flex items-center pl-2 animate-[entrada_0.2s_ease-out_both]" :style="{ animationDelay: `${i * 30}ms` }">
            <UDropdownMenu :items="acoesDaLinha(m)" :content="{ align: 'start' }">
              <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost" size="xs" :aria-label="tac.de(m.nome)" />
            </UDropdownMenu>
            <button
              type="button"
              class="grid min-w-0 flex-1 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 py-3 pl-2 pr-4 text-left transition-colors hover:bg-elevated/60 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary sm:grid-cols-[auto_minmax(0,1fr)_10rem_9rem_12rem]"
              @click="md.marcoAberto.value = m.id"
            >
              <UIcon :name="m.status === 'concluido' ? 'i-lucide-circle-check' : 'i-lucide-flag'" class="size-4" :class="m.status === 'concluido' ? 'text-success' : 'text-muted'" />
              <span class="min-w-0">
                <span class="flex items-center gap-2">
                  <span class="truncate text-sm font-medium text-highlighted">{{ m.nome }}</span>
                  <UBadge v-if="m.status === 'concluido'" :label="tm.statusConcluido" color="success" variant="soft" size="sm" />
                </span>
                <span class="block truncate text-xs text-muted">{{ m.descricao }}</span>
              </span>
              <span class="hidden items-center gap-2 sm:flex">
                <UAvatar :text="iniciais(pessoa(m.responsavel)?.nome ?? '')" :alt="pessoa(m.responsavel)?.nome" size="2xs" />
                <span class="truncate text-sm text-toned">{{ pessoa(m.responsavel)?.nome }}</span>
              </span>
              <span class="hidden items-center gap-1 text-sm sm:flex" :class="passou(m) ? 'text-error' : 'text-toned'">
                <UIcon :name="passou(m) ? 'i-lucide-calendar-x' : 'i-lucide-calendar'" class="size-3.5" />{{ data(m.dataAlvo) }}
              </span>
              <span class="flex items-center gap-2">
                <UProgress :model-value="md.progressoDoMarco(m)" :color="cor(m)" size="sm" class="w-20 sm:flex-1" />
                <span class="w-9 text-right text-xs tabular-nums text-toned">{{ md.progressoDoMarco(m) }}%</span>
              </span>
            </button>
          </li>
        </ul>
      </div>
    </div>

    <!-- o marco aberto -->
    <USlideover v-model:open="painel" side="right" :ui="{ content: 'max-w-xl' }" :title="aberto?.nome" :description="aberto?.descricao">
      <template v-if="aberto" #title>
        <span class="flex items-center gap-2">
          <UIcon :name="aberto.status === 'concluido' ? 'i-lucide-circle-check' : 'i-lucide-flag'" class="size-5 shrink-0" :class="aberto.status === 'concluido' ? 'text-success' : 'text-primary'" />
          {{ aberto.nome }}
        </span>
      </template>
      <template v-if="aberto && acoes.length" #actions>
        <UDropdownMenu :items="acoes" :content="{ align: 'end' }">
          <UButton icon="i-lucide-ellipsis" color="neutral" variant="ghost" size="sm" :aria-label="tm.acoes" />
        </UDropdownMenu>
      </template>
      <template v-if="aberto" #body>
        <div class="flex flex-col gap-5">
          <div class="flex flex-col gap-1.5 rounded-lg border border-default p-3">
            <div class="flex items-center gap-2">
              <span class="text-2xl font-semibold tabular-nums text-highlighted">{{ md.progressoDoMarco(aberto) }}%</span>
              <UBadge v-if="aberto.status === 'concluido'" class="ml-auto" :label="tm.statusConcluido" icon="i-lucide-circle-check" color="success" variant="soft" />
            </div>
            <UProgress :model-value="md.progressoDoMarco(aberto)" :color="cor(aberto)" />
            <p class="text-xs text-muted">
              {{ aberto.status === 'concluido' ? tm.progressoConcluido : tm.progresso(feitas(aberto), md.tarefasDoMarco(aberto).length) }}
            </p>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div class="rounded-lg border border-default p-3">
              <p class="text-xs text-muted">{{ tm.dataAlvo }}</p>
              <p class="mt-0.5 text-sm font-medium" :class="passou(aberto) ? 'text-error' : 'text-highlighted'">{{ data(aberto.dataAlvo) }}</p>
            </div>
            <div class="rounded-lg border border-default p-3">
              <p class="text-xs text-muted">{{ tm.responsavel }}</p>
              <p class="mt-0.5 flex items-center gap-2 text-sm font-medium text-highlighted">
                <UAvatar :text="iniciais(pessoa(aberto.responsavel)?.nome ?? '')" size="2xs" />{{ pessoa(aberto.responsavel)?.nome }}
              </p>
            </div>
          </div>

          <section class="flex flex-col gap-2">
            <header class="flex items-center gap-2">
              <h3 class="flex-1 text-sm font-semibold text-highlighted">{{ tm.tarefas }}</h3>
              <USelectMenu
                v-if="podeEditar && aberto.status === 'aberto'"
                v-model="paraAdicionar"
                v-model:search-term="buscaPainel"
                :items="opAdicionar"
                value-key="value"
                multiple
                size="xs"
                class="w-48"
                :ui="{ content: 'seletor-painel min-w-72' }"
                :placeholder="tm.adicionarTarefas"
              >
                <template #default>{{ tm.adicionarTarefas }}</template>
                <template #content-bottom>
                  <AtalhoDeCriar :termo="buscaPainel" :rotulo="ta.tarefa.rotulo" :com="ta.tarefa.com" :dica="ta.tarefa.dica" @criar="(t: string) => criarPeloSeletor('painel', t)" />
                </template>
              </USelectMenu>
            </header>
            <p v-if="!md.tarefasDoMarco(aberto).length" class="rounded-lg border border-dashed border-default px-3 py-4 text-center text-xs text-muted">{{ tm.semTarefas }}</p>
            <ul v-else class="flex flex-col divide-y divide-default rounded-lg border border-default">
              <li v-for="x in md.tarefasDoMarco(aberto)" :key="x.id" class="group flex items-center gap-2 px-2 py-1.5">
                <UTooltip :text="x.status === 'concluida' ? tm.reabrirTarefa : tm.concluirTarefa">
                  <UButton
                    :icon="x.status === 'concluida' ? 'i-lucide-circle-check' : 'i-lucide-circle'"
                    size="xs"
                    :color="x.status === 'concluida' ? 'success' : 'neutral'"
                    variant="ghost"
                    :aria-label="x.status === 'concluida' ? tm.reabrirTarefa : tm.concluirTarefa"
                    @click="prj.concluirTarefa(x.id)"
                  />
                </UTooltip>
                <span class="min-w-0 flex-1 cursor-pointer" role="button" tabindex="0" @click="prj.tarefaAberta.value = x.id" @keydown.enter="prj.tarefaAberta.value = x.id">
                  <span class="block truncate text-sm hover:underline" :class="x.status === 'concluida' ? 'text-muted line-through' : 'text-highlighted'">{{ x.titulo }}</span>
                  <span class="block truncate text-xs text-muted">{{ pessoa(x.responsavel)?.nome }} · {{ data(x.prazo) }}</span>
                </span>
                <UBadge :label="rp.tarefas.status[x.status]" :color="COR_DO_STATUS[x.status]" variant="subtle" size="sm" />
                <UTooltip v-if="podeEditar && aberto.status === 'aberto'" :text="tm.tirar">
                  <UButton icon="i-lucide-x" size="xs" color="neutral" variant="ghost" class="opacity-0 group-hover:opacity-100 focus-visible:opacity-100" :aria-label="tm.tirar" @click="md.tirarTarefa(aberto, x.id)" />
                </UTooltip>
              </li>
            </ul>
          </section>

          <section class="flex flex-col gap-2">
            <h3 class="text-sm font-semibold text-highlighted">{{ tm.contaPara }}</h3>
            <p v-if="!md.metasDoMarco(aberto.id).length" class="text-xs text-muted">{{ tm.naoConta }}</p>
            <div v-else class="flex flex-wrap gap-1.5">
              <UButton
                v-for="g in md.metasDoMarco(aberto.id)"
                :key="g.id"
                :label="g.nome"
                icon="i-lucide-target"
                size="xs"
                color="neutral"
                variant="outline"
                @click="painel = false; md.abrirMeta(g.id)"
              />
            </div>
          </section>
        </div>
      </template>
    </USlideover>

    <!-- criar e editar -->
    <UModal v-model:open="form" :title="fId ? tm.editar : tm.novo" :ui="{ footer: 'justify-end gap-2' }">
      <template #body>
        <form id="form-marco" class="flex flex-col gap-4" @submit.prevent="salvar">
          <UFormField :label="tm.nome" required>
            <UInput v-model="fNome" :placeholder="tm.nomePlaceholder" class="w-full" autofocus />
          </UFormField>
          <UFormField :label="tm.descricao">
            <UTextarea v-model="fDescricao" :rows="2" autoresize class="w-full" />
          </UFormField>
          <div class="grid gap-4 sm:grid-cols-2">
            <UFormField :label="tm.responsavel">
              <USelect v-model="fResp" :items="opPessoas" class="w-full" />
            </UFormField>
            <UFormField :label="tm.dataAlvo">
              <UInput v-model="fData" type="date" class="w-full" />
            </UFormField>
          </div>
          <UFormField :label="tm.tarefas" :help="tm.tarefasDica">
            <USelectMenu
              v-model="fTarefas"
              v-model:search-term="buscaForm"
              :items="opTarefas"
              value-key="value"
              multiple
              class="w-full"
              :ui="{ content: 'seletor-form' }"
              :placeholder="tm.tarefasPlaceholder"
            >
              <template #content-bottom>
                <AtalhoDeCriar :termo="buscaForm" :rotulo="ta.tarefa.rotulo" :com="ta.tarefa.com" :dica="ta.tarefa.dica" @criar="(t: string) => criarPeloSeletor('form', t)" />
              </template>
            </USelectMenu>
          </UFormField>
        </form>
      </template>
      <template #footer>
        <UButton :label="tm.cancelar" color="neutral" variant="outline" @click="form = false" />
        <UButton type="submit" form="form-marco" :label="fId ? tm.salvar : tm.criar" icon="i-lucide-flag" :disabled="!fNome.trim()" />
      </template>
    </UModal>

    <!-- concluir -->
    <UModal :open="!!aConcluir" :title="tm.concluirTitulo" :description="tm.concluirTexto(abertasDoConcluir)" :ui="{ footer: 'justify-end gap-2' }" @update:open="(v: boolean) => { if (!v) aConcluir = null }">
      <template #footer>
        <UButton :label="tm.cancelar" color="neutral" variant="outline" @click="aConcluir = null" />
        <UButton :label="tm.concluir" icon="i-lucide-flag" color="success" @click="concluir" />
      </template>
    </UModal>

    <!-- excluir -->
    <UModal :open="!!aExcluir" :title="tm.excluirTitulo" :description="tm.excluirTexto" :ui="{ footer: 'justify-end gap-2' }" @update:open="(v: boolean) => { if (!v) aExcluir = null }">
      <template #footer>
        <UButton :label="tm.cancelar" color="neutral" variant="outline" @click="aExcluir = null" />
        <UButton :label="tm.excluir" icon="i-lucide-trash-2" color="error" @click="excluir" />
      </template>
    </UModal>
  </div>
</template>
