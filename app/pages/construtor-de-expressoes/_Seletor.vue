<script setup lang="ts">
/**
 * PROPOSTA: o seletor que preenche uma lacuna do construtor.
 *
 * Mostra só o que cabe ali: o tipo que a lacuna espera (número, texto, data,
 * condição) e o que o motor do modo aceita naquele lugar. No modo "hoje", uma
 * lacuna dentro de uma conta não oferece data, porque o motor calcula a conta
 * antes da data (medido no develop). Assim o construtor não monta o que o motor
 * erra, em vez de deixar montar e avisar depois.
 */
import type { CommandPaletteGroup, CommandPaletteItem } from '@nuxt/ui'
import type { Textos } from './textos'
import { type CampoDaCategoria, type Contexto, type Modo, type No, type NomeFuncao, type OpConta, type Tipo, FUNCOES, lacuna, novoId } from './arvore'

const props = defineProps<{
  t: Textos
  modo: Modo
  espera: Tipo
  contexto: Contexto
  campos: CampoDaCategoria[]
  passos: string[]
}>()

const emit = defineEmits<{ escolher: [no: No] }>()
const aberto = defineModel<boolean>('aberto', { default: false })

const ICONES: Record<Tipo, string> = {
  numero: 'i-lucide-hash',
  texto: 'i-lucide-type',
  data: 'i-lucide-calendar',
  logico: 'i-lucide-toggle-left',
  lista: 'i-lucide-rows-3',
  qualquer: 'i-lucide-circle-dashed',
}

function aceita(tipo: Tipo) {
  if (props.espera === 'qualquer') return true
  if (props.espera === tipo) return true
  // Na proposta, `juntar` aceita qualquer tipo e devolve texto.
  return false
}

function escolher(no: No) {
  emit('escolher', no)
  aberto.value = false
}

const hoje = computed(() => props.modo === 'hoje')
const naConta = computed(() => hoje.value && props.contexto === 'conta')
const naData = computed(() => hoje.value && props.contexto === 'data')

const grupos = computed<CommandPaletteGroup<CommandPaletteItem>[]>(() => {
  const t = props.t
  const g: CommandPaletteGroup<CommandPaletteItem>[] = []
  const it = (chave: string, icon: string, no: () => No): CommandPaletteItem => ({
    label: t.seletor.itens[chave]![0],
    description: t.seletor.itens[chave]![1] || undefined,
    icon,
    onSelect: () => escolher(no()),
  })

  // Campos
  const campos = props.campos
    .filter(c => aceita(c.tipo))
    .filter(c => !(naConta.value && (c.tipo === 'data' || c.tipo === 'lista')))
    .filter(c => !(c.tipo === 'lista' && props.modo === 'hoje'))
    .filter(c => !(c.tipo === 'lista' && props.espera !== 'lista'))
    .map<CommandPaletteItem>(c => ({
      label: c.nome,
      suffix: `data.${c.ref}`,
      icon: ICONES[c.tipo],
      onSelect: () => escolher({
        id: novoId(),
        k: 'campo',
        ref: c.ref,
        ...(c.tipo === 'numero' ? { seVazio: '0' } : c.tipo === 'logico' ? { seVazio: 'false' } : {}),
      } as No),
    }))
  if (campos.length) g.push({ id: 'campos', label: t.seletor.grupos.campos, items: campos })

  if (props.modo === 'proposta' && props.passos.length && !naData.value)
    g.push({ id: 'passos', label: t.seletor.grupos.passos, items: props.passos.map(p => ({ label: p, icon: 'i-lucide-variable', onSelect: () => escolher({ id: novoId(), k: 'campo', ref: p, passo: true }) })) })

  // Valor fixo
  const valores: CommandPaletteItem[] = []
  if (aceita('numero')) valores.push(it('numero', 'i-lucide-hash', () => ({ id: novoId(), k: 'numero', valor: null })))
  if (aceita('texto') && !naData.value) valores.push(it('texto', 'i-lucide-quote', () => ({ id: novoId(), k: 'texto', valor: '' })))
  if (aceita('logico') && !naData.value) valores.push(it('logico', 'i-lucide-toggle-left', () => ({ id: novoId(), k: 'logico', valor: true })))
  if (aceita('data') && (!hoje.value || props.contexto !== 'conta')) valores.push(it('hoje', 'i-lucide-calendar-check', () => ({ id: novoId(), k: 'hoje' })))
  if (valores.length) g.push({ id: 'valor', label: t.seletor.grupos.valor, items: valores })

  if (naData.value) return g

  // Contas
  if (aceita('numero')) {
    g.push({
      id: 'contas',
      label: t.seletor.grupos.contas,
      items: (['+', '-', '*', '/', '^', '%'] as OpConta[]).map(op => ({
        label: t.seletor.contas[op]![0],
        description: t.seletor.contas[op]![1],
        icon: { '+': 'i-lucide-plus', '-': 'i-lucide-minus', '*': 'i-lucide-x', '/': 'i-lucide-divide', '^': 'i-lucide-superscript', '%': 'i-lucide-percent' }[op],
        onSelect: () => escolher({ id: novoId(), k: 'conta', op, a: lacuna('numero'), b: lacuna('numero') }),
      })),
    })
  }

  // Funções
  const funcoes = (Object.entries(FUNCOES) as [NomeFuncao, typeof FUNCOES[NomeFuncao]][])
    .filter(([, d]) => d.modos.includes(props.modo) && aceita(d.retorno))
    .map<CommandPaletteItem>(([nome, d]) => ({
      label: t.blocos.funcoes[nome],
      icon: 'i-lucide-function-square',
      onSelect: () => escolher({
        id: novoId(),
        k: 'funcao',
        nome,
        args: d.args.map((a, i) => nome === 'arredondar' && i === 1 ? { id: novoId(), k: 'numero', valor: 2 } as No : lacuna(a.tipo)),
      }),
    }))
  if (funcoes.length) g.push({ id: 'funcoes', label: t.seletor.grupos.funcoes, items: funcoes })

  // Condição
  g.push({
    id: 'condicao',
    label: t.seletor.grupos.condicao,
    items: [it('se', 'i-lucide-split', () => ({ id: novoId(), k: 'se', cond: lacuna('logico'), entao: lacuna(props.espera), senao: lacuna(props.espera) }))],
  })

  if (aceita('logico')) {
    g.push({
      id: 'comparacao',
      label: t.seletor.grupos.comparacao,
      items: [
        it('compara', 'i-lucide-equal', () => ({ id: novoId(), k: 'compara', op: '==', a: lacuna('qualquer'), b: lacuna('qualquer') })),
        it('e', 'i-lucide-ampersand', () => ({ id: novoId(), k: 'logica', op: 'and', a: lacuna('logico'), b: lacuna('logico') })),
        it('ou', 'i-lucide-git-merge', () => ({ id: novoId(), k: 'logica', op: 'or', a: lacuna('logico'), b: lacuna('logico') })),
        it('nao', 'i-lucide-circle-slash', () => ({ id: novoId(), k: 'nao', a: lacuna('logico') })),
      ],
    })
  }

  // Datas: no modo hoje, só como peça solta.
  if (!naConta.value) {
    const datas: CommandPaletteItem[] = []
    const base = () => lacuna('data')
    if (aceita('data')) {
      datas.push(it('dataSomar', 'i-lucide-calendar-plus', () => ({ id: novoId(), k: 'data', acao: 'somar', base: base(), qtd: { id: novoId(), k: 'numero', valor: 30 }, unidade: 'day' })))
      datas.push(it('dataSubtrair', 'i-lucide-calendar-minus', () => ({ id: novoId(), k: 'data', acao: 'subtrair', base: base(), qtd: { id: novoId(), k: 'numero', valor: 1 }, unidade: 'day' })))
    }
    if (aceita('numero')) datas.push(it('dataDiferenca', 'i-lucide-calendar-range', () => ({ id: novoId(), k: 'data', acao: 'diferenca', base: base(), outra: base(), unidade: 'day' })))
    if (aceita('texto')) datas.push(it('dataFormatar', 'i-lucide-calendar-days', () => ({ id: novoId(), k: 'data', acao: 'formatar', base: base(), padrao: 'DD/MM/YYYY' })))
    if (datas.length) g.push({ id: 'datas', label: t.seletor.grupos.datas, items: datas })
  }

  // Listas
  const listas = props.campos.filter(c => c.tipo === 'lista')
  if (listas.length) {
    const primeira = listas[0]!
    const colNum = primeira.colunas?.find(c => c.tipo === 'numero')?.ref ?? ''
    const itens: CommandPaletteItem[] = []
    if (aceita('numero')) {
      itens.push(it('listaSomar', 'i-lucide-sigma', () => ({ id: novoId(), k: 'lista', ag: 'somar', lista: primeira.ref, coluna: colNum })))
      if (props.modo === 'proposta') {
        itens.push(it('listaContar', 'i-lucide-list-ordered', () => ({ id: novoId(), k: 'lista', ag: 'contar', lista: primeira.ref, coluna: '' })))
        itens.push(it('listaMedia', 'i-lucide-chart-no-axes-column', () => ({ id: novoId(), k: 'lista', ag: 'media', lista: primeira.ref, coluna: colNum })))
        itens.push(it('listaMaior', 'i-lucide-arrow-up-to-line', () => ({ id: novoId(), k: 'lista', ag: 'maior', lista: primeira.ref, coluna: colNum })))
        itens.push(it('listaMenor', 'i-lucide-arrow-down-to-line', () => ({ id: novoId(), k: 'lista', ag: 'menor', lista: primeira.ref, coluna: colNum })))
      }
    }
    if (aceita('texto') && (props.contexto === 'topo' || props.modo === 'proposta'))
      itens.push(it('cada', 'i-lucide-repeat', () => ({ id: novoId(), k: 'cada', lista: primeira.ref, corpo: `{{${colNum}}}`, separador: ', ' })))
    if (itens.length) g.push({ id: 'listas', label: t.seletor.grupos.listas, items: itens })
  }

  return g
})
</script>

<template>
  <UPopover v-model:open="aberto" :content="{ align: 'start', side: 'bottom', sideOffset: 6, collisionPadding: 12 }" :ui="{ content: 'w-80 max-w-[calc(100vw-2rem)]' }">
    <slot />
    <template #content>
      <UCommandPalette
        :groups="grupos"
        :placeholder="t.seletor.buscar"
        :ui="{ content: 'max-h-64' }"
        class="h-auto"
        :fuse="{ resultLimit: 40 }"
      >
        <template #empty>
          <p class="px-3 py-4 text-center text-sm text-muted">{{ t.seletor.vazio }}</p>
        </template>
      </UCommandPalette>
      <p v-if="naConta" class="flex items-start gap-1.5 border-t border-default px-3 py-2 text-xs text-muted">
        <UIcon name="i-lucide-info" class="mt-0.5 size-3.5 shrink-0" />
        {{ t.seletor.datasForaDaConta }}
      </p>
    </template>
  </UPopover>
</template>
