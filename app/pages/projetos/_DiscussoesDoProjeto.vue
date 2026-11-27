<script setup lang="ts">
/**
 * Rodada 8: a aba Discussões do projeto. Proposta inteira, sem tela no develop.
 *
 * O GitHub Discussions dentro do projeto, sobre a tabela `threads` do back (`type: discussion`):
 * - 3 formatos: Discussão, Pergunta (com resposta marcada) e Anúncio (só administrador publica,
 *   todos comentam, fixado no topo);
 * - lista com busca, formato e Abertas ou Fechadas; a discussão abre no painel lateral;
 * - a ponte para o trabalho: "Criar tarefa" a partir de uma mensagem, com o vínculo nos 2 lados;
 * - o Status do projeto continua separado (Visão geral).
 * Por ora só dentro do projeto: o workspace não tem discussões (pedido da redatora).
 */
import type { DropdownMenuItem, SelectItem } from '@nuxt/ui'
import type { Textos } from './textos'
import { iniciais, pessoa } from './mocks'
import { useMarcaDeProposta, useProjetos } from './estado'
import { useMetasEDiscussoes, type Discussao, type FormatoDaDiscussao, type Mensagem, type SobreDaDiscussao } from './metasEDiscussoes'
import { textosDasRelacoes } from './textosDasRelacoes'
import { textosDeMetasEDiscussoes } from './textosDeMetasEDiscussoes'
import { textosDeAcoes } from './textosDeAcoes'

const props = defineProps<{ t: Textos, id: number }>()
const prj = useProjetos()
const md = useMetasEDiscussoes()
const tx = useTextos(textosDeMetasEDiscussoes)
const td = computed(() => tx.value.discussoes)
const idioma = useIdioma()
const toast = useToast()
const { marca } = useMarcaDeProposta()

const ICONE: Record<FormatoDaDiscussao, string> = { discussao: 'i-lucide-messages-square', pergunta: 'i-lucide-circle-help', anuncio: 'i-lucide-megaphone' }
const COR: Record<FormatoDaDiscussao, string> = { discussao: 'bg-info/10 text-info', pergunta: 'bg-warning/10 text-warning', anuncio: 'bg-primary/10 text-primary' }
const nome = (id: number) => id === prj.eu.value ? td.value.voce : pessoa(id)?.nome ?? ''
const quando = (iso: string) => new Date(iso).toLocaleString(idioma.value, { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })

/* ---------- lista ---------- */
const busca = ref('')
const formato = ref<'todos' | FormatoDaDiscussao>('todos')
const situacao = ref<'aberta' | 'fechada'>('aberta')
const opFormato = computed<SelectItem[]>(() => (['todos', 'discussao', 'pergunta', 'anuncio'] as const).map(v => ({ value: v, label: td.value.formatosPlural[v], icon: v === 'todos' ? 'i-lucide-list' : ICONE[v] })))
const todas = computed(() => md.discussoesDo(props.id))
const normalizar = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()
const ultima = (d: Discussao) => d.mensagens[d.mensagens.length - 1]!.em
const lista = computed(() => todas.value
  .filter(d => d.status === situacao.value)
  .filter(d => formato.value === 'todos' || d.formato === formato.value)
  .filter(d => !busca.value.trim() || normalizar(d.titulo + ' ' + d.mensagens.map(m => m.texto).join(' ')).includes(normalizar(busca.value)))
  .sort((a, b) => Number(b.fixada) - Number(a.fixada) || ultima(b).localeCompare(ultima(a))))
const nAbertas = computed(() => todas.value.filter(d => d.status === 'aberta').length)
const nFechadas = computed(() => todas.value.filter(d => d.status === 'fechada').length)
const temFiltro = computed(() => !!busca.value.trim() || formato.value !== 'todos')
function limparFiltros() {
  busca.value = ''
  formato.value = 'todos'
}

/* ---------- nova discussão ---------- */
const novaAberta = ref(false)
const nFormato = ref<FormatoDaDiscussao>('discussao')
const nTitulo = ref('')
const nTexto = ref('')
const nAviso = ref<'todos' | 'admins' | 'ninguem'>('todos')
const podeAnunciar = computed(() => md.podeAbrir(props.id, 'anuncio'))
const opNovoFormato = computed(() => (['discussao', 'pergunta', 'anuncio'] as const).map(v => ({ value: v, label: td.value.formatos[v], icon: ICONE[v], dica: td.value.formatoDica[v], disabled: v === 'anuncio' && !podeAnunciar.value })))
const opAviso = computed(() => (['todos', 'admins', 'ninguem'] as const).map(v => ({ value: v, label: td.value.avisos[v] })))
const podePublicar = computed(() => !!nTitulo.value.trim() && !!nTexto.value.trim())
function abrirNova() {
  nFormato.value = 'discussao'
  nTitulo.value = ''
  nTexto.value = ''
  nAviso.value = 'todos'
  nSobre.value = '0'
  novaAberta.value = true
}
const publicando = ref(false)
async function publicar() {
  if (!podePublicar.value) return
  publicando.value = true
  await new Promise(r => setTimeout(r, 350))
  const d = md.criarDiscussao({ projeto: props.id, formato: nFormato.value, titulo: nTitulo.value.trim(), texto: nTexto.value.trim(), sobre: sobreDoValor(nSobre.value) })
  publicando.value = false
  novaAberta.value = false
  situacao.value = 'aberta'
  toast.add({ title: td.value.publicada(d.titulo), icon: ICONE[d.formato], color: 'success' })
  md.discussaoAberta.value = d.id
}

/* ---------- discussão aberta ---------- */
const aberta = computed(() => todas.value.find(d => d.id === md.discussaoAberta.value) ?? null)
const painelAberto = computed({
  get: () => !!aberta.value,
  set: (v: boolean) => { if (!v) md.discussaoAberta.value = null },
})
const moderar = computed(() => !!aberta.value && md.podeModerar(aberta.value))
const podeMarcar = computed(() => !!aberta.value && aberta.value.formato === 'pergunta' && moderar.value)
/** Rodada 12: as ações da discussão servem ao painel e ao menu ⋯ de cada linha da lista. */
const tac = useTextos(textosDeAcoes)
function acoesDe(d: Discussao): DropdownMenuItem[][] {
  if (!md.podeModerar(d)) return []
  const p = prj.projetos.value.find(x => x.id === d.projeto)!
  return [[
    ...(prj.podeAdministrar(p) ? [{ label: d.fixada ? td.value.desafixar : td.value.fixar, icon: d.fixada ? 'i-lucide-pin-off' : 'i-lucide-pin', onSelect: () => { d.fixada = !d.fixada } }] : []),
    {
      label: d.status === 'aberta' ? td.value.fechar : td.value.reabrir,
      icon: d.status === 'aberta' ? 'i-lucide-circle-x' : 'i-lucide-rotate-ccw',
      onSelect: () => {
        d.status = d.status === 'aberta' ? 'fechada' : 'aberta'
        toast.add({ title: d.status === 'fechada' ? td.value.fechadaToast : td.value.reabertaToast, icon: 'i-lucide-check', color: 'neutral' })
      },
    },
  ]]
}
const acoes = computed(() => aberta.value ? acoesDe(aberta.value) : [])
const acoesDaLinha = (d: Discussao): DropdownMenuItem[][] => [
  [
    { label: tac.value.abrir, icon: 'i-lucide-panel-right-open', onSelect: () => { md.discussaoAberta.value = d.id } },
    { label: tac.value.copiarLink, icon: 'i-lucide-link', onSelect: () => toast.add({ title: tac.value.linkCopiado, icon: 'i-lucide-check', color: 'success' }) },
  ],
  ...acoesDe(d),
]
const resposta = ref('')
const enviando = ref(false)
async function enviar() {
  const d = aberta.value
  if (!d || !resposta.value.trim()) return
  enviando.value = true
  await new Promise(r => setTimeout(r, 300))
  md.responder(d, resposta.value.trim())
  resposta.value = ''
  enviando.value = false
  toast.add({ title: td.value.respostaEnviada, icon: 'i-lucide-send', color: 'success' })
}
function alternarResposta(m: Mensagem) {
  const d = aberta.value
  if (!d) return
  d.resposta = d.resposta === m.id ? undefined : m.id
}
/**
 * Rodada 14: a mensagem lista as tarefas criadas a partir dela (B5) e mantém "Criar tarefa", que abre a mesma
 * janela Nova tarefa do projeto, com o texto e o autor da mensagem (B16). A tarefa guarda a origem (B4), então
 * excluir a tarefa tira a ligação da mensagem (B14).
 */
const tr = useTextos(textosDasRelacoes)
function abrirCriarTarefa(m: Mensagem) {
  const d = aberta.value
  if (!d) return
  md.discussaoAberta.value = null
  md.criarTarefaDaMensagem(d, m)
}
function abrirTarefaLigada(id: number) {
  md.discussaoAberta.value = null
  prj.tarefaAberta.value = id
}

/* ---------- rodada 14 (B7): de que a discussão trata ---------- */
const nSobre = ref('0')
const opSobre = computed(() => [
  [{ value: '0', label: tr.value.discussao.semSobre, icon: 'i-lucide-circle-dashed' }],
  [
    { type: 'label' as const, label: tr.value.discussao.grupoMarcos },
    ...md.marcosDo(props.id).map(m => ({ value: `m:${m.id}`, label: m.nome, icon: 'i-lucide-flag' })),
  ],
  [
    { type: 'label' as const, label: tr.value.discussao.grupoItens },
    ...prj.categoriasDe(props.id).flatMap(c => prj.itensDaCategoria(c.id).map(ref => ({ value: `i:${c.id}:${ref}`, label: `${ref} · ${c.name}`, icon: c.icon ?? 'i-lucide-folder' }))),
  ],
])
function sobreDoValor(v: string): SobreDaDiscussao | undefined {
  const [tipo, a, b] = v.split(':')
  if (tipo === 'm') return { tipo: 'marco', id: Number(a) }
  if (tipo === 'i') return { tipo: 'item', categoria: Number(a), ref: b! }
  return undefined
}
function rotuloDoSobre(d: Discussao) {
  if (!d.sobre) return ''
  if (d.sobre.tipo === 'item') return tr.value.discussao.sobreItem(d.sobre.ref)
  const id = d.sobre.id
  return tr.value.discussao.sobreMarco(md.marcos.value.find(m => m.id === id)?.nome ?? '')
}
function abrirSobre(d: Discussao) {
  const s = d.sobre
  if (!s) return
  md.discussaoAberta.value = null
  if (s.tipo === 'item') return prj.abrirCategoria(s.categoria)
  const m = md.marcos.value.find(x => x.id === s.id)
  if (m) md.abrirMarco(m)
}
</script>

<template>
  <div>
    <!-- 1 raiz só: a aba troca dentro de um <Transition> -->
  <div class="flex flex-col rounded-lg border border-default bg-default" :class="marca">
    <!-- barra: busca, formato, abertas ou fechadas, nova -->
    <div class="flex flex-wrap items-center gap-1.5 border-b border-default px-3 py-2 sm:px-4">
      <UChip :show="!!busca.trim()" color="error" size="sm">
        <UInput v-model="busca" :placeholder="td.buscar" icon="i-lucide-search" size="sm" variant="soft" class="w-56" :aria-label="td.buscar" :ui="{ trailing: 'pe-1' }">
          <template v-if="busca" #trailing>
            <UButton icon="i-lucide-circle-x" color="neutral" variant="link" size="xs" :aria-label="td.limparBusca" @click="busca = ''" />
          </template>
        </UInput>
      </UChip>
      <USelect v-model="formato" :items="opFormato" size="sm" variant="soft" class="w-48" :aria-label="td.formato" />
      <span class="mx-1 h-5 w-px bg-accented" aria-hidden="true" />
      <div class="flex items-center gap-1" role="radiogroup">
        <UButton
          v-for="o in ([{ v: 'aberta', r: td.abertas, n: nAbertas, i: 'i-lucide-circle-dot' }, { v: 'fechada', r: td.fechadas, n: nFechadas, i: 'i-lucide-circle-check' }] as const)"
          :key="o.v"
          :label="`${o.r} ${o.n}`"
          :icon="o.i"
          size="sm"
          :color="situacao === o.v ? 'primary' : 'neutral'"
          :variant="situacao === o.v ? 'subtle' : 'ghost'"
          role="radio"
          :aria-checked="situacao === o.v"
          @click="situacao = o.v"
        />
      </div>
      <UTooltip v-if="temFiltro" :text="td.limparFiltros">
        <UButton icon="i-lucide-filter-x" color="neutral" variant="ghost" size="sm" class="text-error" :aria-label="td.limparFiltros" @click="limparFiltros" />
      </UTooltip>
      <span class="ml-auto text-xs text-muted">{{ td.contagem(lista.length) }}</span>
      <UButton :label="td.nova" icon="i-lucide-plus" size="sm" @click="abrirNova" />
    </div>

    <!-- vazio do projeto -->
    <div v-if="!todas.length" class="flex flex-col items-center gap-3 px-6 py-16 text-center animate-[entrada_0.2s_ease-out_both]">
      <span class="flex size-12 items-center justify-center rounded-xl bg-elevated"><UIcon name="i-lucide-messages-square" class="size-6 text-muted" /></span>
      <p class="text-base font-semibold text-highlighted">{{ td.vazioTitulo }}</p>
      <p class="max-w-md text-sm text-muted">{{ td.vazioTexto }}</p>
      <UButton :label="td.nova" icon="i-lucide-plus" color="neutral" variant="outline" @click="abrirNova" />
    </div>
    <div v-else-if="!lista.length" class="flex flex-col items-center gap-2 px-6 py-12 text-center">
      <p class="text-sm text-muted">{{ td.vazioFiltro }}</p>
      <UButton v-if="temFiltro" :label="td.limparFiltros" icon="i-lucide-filter-x" color="neutral" variant="outline" size="sm" @click="limparFiltros" />
    </div>

    <!-- a lista -->
    <ul v-else class="divide-y divide-default">
      <li v-for="(d, i) in lista" :key="d.id" class="flex items-center pl-2 animate-[entrada_0.2s_ease-out_both]" :style="{ animationDelay: `${i * 30}ms` }">
        <UDropdownMenu :items="acoesDaLinha(d)" :content="{ align: 'start' }">
          <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost" size="xs" :aria-label="tac.de(d.titulo)" />
        </UDropdownMenu>
        <button
          type="button"
          class="group flex min-w-0 flex-1 items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-elevated/60 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
          @click="md.discussaoAberta.value = d.id"
        >
          <span class="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md" :class="COR[d.formato]">
            <UIcon :name="ICONE[d.formato]" class="size-4" />
          </span>
          <span class="min-w-0 flex-1">
            <span class="flex flex-wrap items-center gap-1.5">
              <span class="truncate text-sm font-medium text-highlighted group-hover:underline">{{ d.titulo }}</span>
              <UBadge v-if="d.fixada" :label="td.fixada" icon="i-lucide-pin" color="primary" variant="soft" size="sm" />
              <UBadge v-if="d.formato === 'pergunta'" :label="d.resposta ? td.respondida : td.semResposta" :icon="d.resposta ? 'i-lucide-circle-check' : 'i-lucide-circle-dashed'" :color="d.resposta ? 'success' : 'neutral'" variant="soft" size="sm" />
            </span>
            <span class="mt-0.5 block truncate text-xs text-muted">{{ td.formatos[d.formato] }} · {{ td.por(nome(d.mensagens[0]!.autor), quando(d.mensagens[0]!.em)) }}<template v-if="d.sobre"> · {{ rotuloDoSobre(d) }}</template></span>
          </span>
          <span class="flex shrink-0 items-center gap-3 text-xs text-muted">
            <UAvatarGroup size="2xs" :max="3">
              <UAvatar v-for="a in [...new Set(d.mensagens.map(m => m.autor))]" :key="a" :text="iniciais(pessoa(a)?.nome ?? '')" :alt="pessoa(a)?.nome" />
            </UAvatarGroup>
            <span class="flex items-center gap-1 tabular-nums"><UIcon name="i-lucide-message-circle" class="size-3.5" />{{ d.mensagens.length - 1 }}</span>
          </span>
        </button>
      </li>
    </ul>
  </div>

  <!-- a discussão aberta -->
  <USlideover v-model:open="painelAberto" side="right" :ui="{ content: 'max-w-2xl' }" :title="aberta?.titulo" :description="aberta ? td.formatos[aberta.formato] : ''">
    <template v-if="aberta" #title>
      <span class="flex items-center gap-2">
        <span class="flex size-7 shrink-0 items-center justify-center rounded-md" :class="COR[aberta.formato]">
          <UIcon :name="ICONE[aberta.formato]" class="size-4" />
        </span>
        {{ aberta.titulo }}
      </span>
    </template>
    <template v-if="aberta" #description>
      <span class="flex flex-wrap items-center gap-1.5">
        {{ td.formatos[aberta.formato] }}
        <UBadge v-if="aberta.fixada" :label="td.fixada" icon="i-lucide-pin" color="primary" variant="soft" size="sm" />
        <UBadge v-if="aberta.status === 'fechada'" :label="td.fechada" icon="i-lucide-circle-check" color="neutral" variant="soft" size="sm" />
        <UButton v-if="aberta.sobre" :label="rotuloDoSobre(aberta)" :icon="aberta.sobre.tipo === 'marco' ? 'i-lucide-flag' : 'i-lucide-file-text'" size="xs" color="neutral" variant="outline" :class="marca" @click="abrirSobre(aberta)" />
      </span>
    </template>
    <template v-if="aberta && acoes.length" #actions>
      <UDropdownMenu :items="acoes" :content="{ align: 'end' }">
        <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost" size="sm" :aria-label="td.acoes" />
      </UDropdownMenu>
    </template>
    <template v-if="aberta" #body>
      <ol class="flex flex-col gap-3">
        <li
          v-for="(m, i) in aberta.mensagens"
          :key="m.id"
          class="group/msg rounded-lg border p-3 animate-[entrada_0.2s_ease-out_both]"
          :class="aberta.resposta === m.id ? 'border-success/50 bg-success/5' : i === 0 ? 'border-default bg-elevated/40' : 'border-default'"
        >
          <div class="flex items-center gap-2">
            <UAvatar :text="iniciais(pessoa(m.autor)?.nome ?? '')" :alt="pessoa(m.autor)?.nome" size="xs" />
            <span class="text-sm font-medium text-highlighted">{{ nome(m.autor) }}</span>
            <span class="text-xs text-muted">{{ quando(m.em) }}</span>
            <UBadge v-if="aberta.resposta === m.id" :label="td.resposta" icon="i-lucide-circle-check" color="success" variant="soft" size="sm" />
            <span class="ml-auto flex items-center gap-1 opacity-0 transition-opacity group-hover/msg:opacity-100 focus-within:opacity-100">
              <UButton v-if="podeMarcar && i > 0" :label="aberta.resposta === m.id ? td.desmarcarResposta : td.marcarResposta" icon="i-lucide-circle-check" color="neutral" variant="outline" size="xs" @click="alternarResposta(m)" />
              <UButton :label="td.criarTarefa" icon="i-lucide-square-plus" color="neutral" variant="outline" size="xs" @click="abrirCriarTarefa(m)" />
            </span>
          </div>
          <p class="mt-2 whitespace-pre-line text-sm text-default">{{ m.texto }}</p>
          <div v-if="md.tarefasDaMensagem(m).length" class="mt-2 flex flex-wrap items-center gap-1.5" :class="marca" :aria-label="tr.discussao.tarefasCriadas(md.tarefasDaMensagem(m).length)">
            <UButton v-for="x in md.tarefasDaMensagem(m)" :key="x.id" :label="td.tarefaLigada(x.titulo)" icon="i-lucide-square-check" color="neutral" variant="outline" size="xs" @click="abrirTarefaLigada(x.id)" />
          </div>
        </li>
      </ol>
    </template>
    <template v-if="aberta" #footer>
      <div class="flex w-full flex-col gap-2">
        <UAlert v-if="aberta.status === 'fechada'" :description="td.fechadaAviso" icon="i-lucide-lock" color="neutral" variant="subtle" class="py-2" />
        <template v-else>
          <UTextarea v-model="resposta" :placeholder="td.respostaPlaceholder" :rows="2" autoresize class="w-full" :aria-label="td.respostaPlaceholder" @keydown.ctrl.enter="enviar" />
          <div class="flex justify-end">
            <UButton :label="td.responder" icon="i-lucide-send" size="sm" :loading="enviando" :disabled="!resposta.trim()" @click="enviar" />
          </div>
        </template>
      </div>
    </template>
  </USlideover>

  <!-- nova discussão -->
  <UModal v-model:open="novaAberta" :title="td.nova" :ui="{ footer: 'justify-end gap-2' }">
    <template #body>
      <div class="flex flex-col gap-4">
        <UFormField :label="td.formato" :help="td.formatoDica[nFormato]">
          <USelect v-model="nFormato" :items="opNovoFormato" class="w-full">
            <template #item-label="{ item }">
              <span class="flex flex-col">
                <span>{{ (item as any).label }}</span>
                <span class="text-xs text-muted">{{ (item as any).disabled ? td.soAdminAnuncia : (item as any).dica }}</span>
              </span>
            </template>
          </USelect>
        </UFormField>
        <UFormField :label="td.titulo" required>
          <UInput v-model="nTitulo" :placeholder="td.tituloPlaceholder" class="w-full" autofocus />
        </UFormField>
        <UFormField :label="td.mensagem" required>
          <UTextarea v-model="nTexto" :placeholder="td.mensagemPlaceholder" :rows="4" autoresize class="w-full" />
        </UFormField>
        <UFormField :label="tr.discussao.sobre" :help="tr.discussao.sobreDica" :class="marca">
          <USelectMenu v-model="nSobre" :items="opSobre" value-key="value" class="w-full" :ui="{ content: 'min-w-72' }" />
        </UFormField>
        <UFormField v-if="nFormato === 'anuncio'" :label="td.avisar">
          <USelect v-model="nAviso" :items="opAviso" class="w-full" />
        </UFormField>
        <p v-else class="text-xs text-muted">{{ td.avisarDica }}</p>
      </div>
    </template>
    <template #footer>
      <UButton :label="td.cancelar" color="neutral" variant="outline" @click="novaAberta = false" />
      <UButton :label="td.publicar" icon="i-lucide-send" :loading="publicando" :disabled="!podePublicar" @click="publicar" />
    </template>
  </UModal>
  </div>
</template>
