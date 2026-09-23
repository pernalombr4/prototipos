<script setup lang="ts">
/**
 * O padrão dos campos do ENSPACE, nos três formatos.
 *
 * A demanda: padronizar back-end e front-end de todos os campos, definindo
 * como cada tipo aparece na TABELA (célula), no FORMULÁRIO de criação e na
 * SIDEBAR do item (cru), na tela NOVA de itens. E, ao interagir, dizer qual é
 * o formato de entrada, o de saída e a saída formatada de cada um.
 *
 * Como esta tela responde:
 *
 * - uma categoria de vitrine com um campo de CADA tipo, e a coluna da tabela
 *   nomeada com o tipo, para o padrão ser lido tipo a tipo;
 * - os três formatos vivos na mesma tela: a tabela atrás, o modal de criação
 *   por cima e a sidebar do item à direita;
 * - clicar em qualquer campo, em qualquer formato, abre a ficha com as três
 *   regras e o contrato de back-end, sobre o valor do item que está aberto;
 * - um relatório .xlsx de verdade, para o dev ter a tabela do padrão fora da
 *   tela.
 *
 * 100% front-end: o dado vem do `mocks.ts` desta pasta, a formatação roda no
 * navegador e o .xlsx é montado em memória. Nenhuma chamada de rede.
 */
import CascaDeItens from './_CascaDeItens.vue'
import FichaDoCampo from './_FichaDoCampo.vue'
import ModalNovoItem from './_ModalNovoItem.vue'
import PainelDoItem from './_PainelDoItem.vue'
import TabelaDeItens from './_TabelaDeItens.vue'
import { campoPorTipo, campos, type Campo, type TipoDeCampo } from './campos'
import { celulaDeExportacao, saidaFormatada } from './formatacao'
import { categoria, itens as itensDoMock, opcoes, workspace } from './mocks'
import { baixar, gerarXlsx, type Aba, type Celula } from './relatorio'
import { textos } from './textos'

import briefingMd from './BRIEFING.md?raw'
import decisoesMd from './DECISOES.md?raw'
import pesquisaMd from './PESQUISA.md?raw'

import type { Item } from '@be-enlighten/enspace-sdk-schemas'

definePageMeta({
  titulo: 'Padrão dos campos',
  descricao: 'Como cada tipo de campo aparece na tabela, no formulário e na sidebar, com o contrato de back-end de cada um.',
  status: 'em-revisao',
  atualizado: '2026-09-22',
  tela: 'Tela nova de itens (Lab), categoria com um campo de cada tipo',
})

const t = useTextos(textos)
const idioma = useIdioma()
const toast = useToast()

/* ------------------------------------------------------------------ *
 * ANDAIME: o seletor de estados não faz parte da proposta. Existe     *
 * para percorrer os cinco estados da tela sem mexer no mock.          *
 * ------------------------------------------------------------------ */
type Estado = 'cheio' | 'vazio' | 'carregando' | 'erro' | 'bloqueado'
const estado = ref<Estado>('cheio')
const estadosPossiveis: Estado[] = ['cheio', 'vazio', 'carregando', 'erro', 'bloqueado']

/* ----------------------------- estado da tela ----------------------------- */

const itens = ref<Item[]>([...itensDoMock])

const itensVisiveis = computed(() => (estado.value === 'vazio' ? [] : itens.value))

const modalAberto = ref(false)
const itemAberto = ref<Item | null>(null)
/** A tela dedicada do item, a que o "Editar" do menu abre no develop. */
const telaDoItem = ref<Item | null>(null)

/* ------------------------------------------------------------------ *
 * ANDAIME: as três facetas. Um botão para cada, como o de estados.    *
 *                                                                     *
 * Elas não são navegação do produto: são um atalho para pôr na tela o  *
 * formato que está sendo discutido. No ENSPACE se chega em cada um     *
 * pelos gestos de sempre (clicar na célula, "Novo registro", duplo     *
 * clique na linha), e esses gestos continuam funcionando.             *
 * ------------------------------------------------------------------ */
type Faceta = 'tabela' | 'formulario' | 'naked'
const faceta = ref<Faceta>('tabela')
const facetasPossiveis: Faceta[] = ['tabela', 'formulario', 'naked']

function irPara(f: Faceta) {
  faceta.value = f
  telaDoItem.value = null
  modalAberto.value = f === 'formulario'
  itemAberto.value = f === 'naked' ? (itens.value[0] ?? null) : null
}

/* Fechar o modal ou o painel pelo X volta a faceta para a tabela. */
watch(modalAberto, (v) => { if (!v && faceta.value === 'formulario') faceta.value = 'tabela' })
watch(itemAberto, (v) => { if (!v && faceta.value === 'naked') faceta.value = 'tabela' })

const fichaAberta = ref(false)
const tipoNaFicha = ref<TipoDeCampo | null>(null)
/** O item de onde a ficha tira o valor de exemplo. */
const itemDaFicha = ref<Item | null>(null)

const campoNaFicha = computed(() => (tipoNaFicha.value ? campoPorTipo[tipoNaFicha.value] : null))

const valorNaFicha = computed(() => {
  if (!campoNaFicha.value) return null
  const alvo = itemDaFicha.value ?? itemAberto.value ?? itens.value[0]
  return (alvo?.data as Record<string, unknown>)?.[campoNaFicha.value.refId] ?? null
})

const indiceDoItem = computed(() =>
  itemAberto.value ? itens.value.findIndex(i => i.id === itemAberto.value?.id) + 1 : 0,
)

function inspecionar(tipo: string, item?: Item) {
  tipoNaFicha.value = tipo as TipoDeCampo
  itemDaFicha.value = item ?? itemAberto.value ?? itens.value[0] ?? null
  fichaAberta.value = true
}

function abrirItem(item: Item) {
  itemAberto.value = item
  telaDoItem.value = null
  faceta.value = 'naked'
}

/** O "Editar" do menu de contexto, que no develop vai para a tela do item. */
function abrirTelaDoItem(item: Item) {
  telaDoItem.value = item
  itemAberto.value = null
  faceta.value = 'naked'
}

/** Editar na célula mexe no item em memória, e a tabela reflete na hora. */
function editarValor(item: Item, refId: string, valor: unknown) {
  itens.value = itens.value.map(i =>
    i.id === item.id
      ? { ...i, data: { ...(i.data as Record<string, unknown>), [refId]: valor }, updated_at: new Date() }
      : i,
  )
  if (itemAberto.value?.id === item.id) itemAberto.value = itens.value.find(i => i.id === item.id) ?? null
  if (telaDoItem.value?.id === item.id) telaDoItem.value = itens.value.find(i => i.id === item.id) ?? null
}

function navegar(passo: number) {
  const i = indiceDoItem.value - 1 + passo
  if (i >= 0 && i < itens.value.length) itemAberto.value = itens.value[i]!
}

/**
 * Nasce um item. `posicao` vem da linha de criação da grade: o item entra
 * exatamente onde o rascunho estava, que é o que o "+" do vão promete. Sem
 * posição (o modal de criação), ele entra no topo.
 */
/**
 * Quem pode configurar o campo.
 *
 * As ações de opção dentro da célula (renomear, reordenar) são de quem
 * configura o campo, não de quem preenche. O interruptor está no andaime para
 * a diferença ficar visível: é ela que decide se o "⋯" aparece na lista.
 */
const podeConfigurar = ref(true)

/**
 * Comentário feito a partir de um campo. Ele vai para a conversa do ITEM,
 * citando o campo, em vez de abrir uma caixa de entrada por célula. Decidido
 * na rodada 9, ver o DECISOES.md.
 */
function comentarNoCampo(item: Item, campo: Campo, texto: string) {
  const rotulo = t.value.campos[campo.tipo].rotulo
  const mensagem = {
    author: 'Mikaela Jardim',
    at: new Date().toISOString(),
    text: `sobre ${rotulo}: ${texto}`,
  }
  itens.value = itens.value.map((i) => {
    if (i.id !== item.id) return i
    const dados = { ...(i.data as Record<string, unknown>) }
    dados.chat = [...((dados.chat as unknown[]) ?? []), mensagem]
    return { ...i, data: dados, updated_at: new Date() }
  })
  toast.add({ title: t.value.comentarioEnviado, icon: 'i-lucide-message-circle', color: 'success' })
}

function criarItem(dados: Record<string, unknown>, posicao?: number) {
  const agora = new Date()
  const novo = {
    id: 47700 + itens.value.length,
    reference: `VITR${Math.random().toString(16).slice(2, 12).toUpperCase()}`,
    created_at: agora,
    updated_at: agora,
    deleted_at: null,
    status: 'active',
    data: dados,
  } as Item
  const lista = [...itens.value]
  lista.splice(posicao ?? 0, 0, novo)
  itens.value = lista
  toast.add({ title: t.value.salvo, icon: 'i-lucide-check', color: 'success' })
}

function salvarItem(dados: Record<string, unknown>) {
  if (!itemAberto.value) return
  itens.value = itens.value.map(i =>
    i.id === itemAberto.value?.id ? { ...i, data: dados, updated_at: new Date() } : i,
  )
  toast.add({ title: t.value.salvo, icon: 'i-lucide-check', color: 'success' })
}

/* ------------------------- o relatório em .xlsx --------------------------- */

const gerando = ref(false)

async function baixarRelatorio() {
  gerando.value = true
  /*
   * Uma folga para o botão pintar o carregamento antes de o navegador travar
   * no encode. Com 33 tipos isso é rápido, mas o estado importa.
   *
   * `setTimeout` e não `requestAnimationFrame`: o rAF não dispara em aba de
   * fundo, e o botão ficava preso em "Gerando" quando a aba não estava à
   * frente. Foi assim que descobri, testando por fora.
   */
  await new Promise(r => setTimeout(r, 0))

  const exemplo = itens.value[0]
  const dadosDoExemplo = (exemplo?.data as Record<string, unknown>) ?? {}

  const abaDoPadrao: Aba = {
    nome: idioma.value === 'en' ? 'Field standard' : idioma.value === 'es' ? 'Estandar de campos' : 'Padrao dos campos',
    larguras: [18, 26, 14, 16, 52, 52, 52, 46, 52, 52, 40, 40, 12, 12, 40],
    linhas: [
      t.value.colunasDoRelatorio,
      ...campos.map((c) => {
        const regra = t.value.campos[c.tipo]
        return [
          c.tipo,
          regra.rotulo,
          t.value.familias[c.familia] ?? c.familia,
          c.disponibilidade === 'ativo'
            ? t.value.tipoAtivo
            : c.disponibilidade === 'proposto' ? t.value.tipoProposto : t.value.tipoLegado,
          regra.celula,
          regra.formulario,
          regra.cru,
          c.backend.entrada,
          c.backend.saida,
          c.backend.formatada,
          c.backend.cFormat.join('; '),
          c.backend.config.join('; '),
          c.alinhamento === 'fim' ? t.value.alinhamentoFim : t.value.alinhamentoInicio,
          String(c.largura),
          saidaFormatada(c, dadosDoExemplo[c.refId], idioma.value, opcoes as never),
        ]
      }),
    ],
  }

  /*
   * A aba da saída usa CÉLULA TIPADA: número vai como número, data vai como
   * serial de data e arquivo vai como hyperlink. É a regra da seção de
   * exportação do documento do time de produtos, e ela está certa: texto em
   * coluna de valor mata a soma no Excel.
   */
  /*
   * A moeda ganha uma coluna própria com o código ISO ao lado do valor. É a
   * "dica de estrutura" do documento do time de produtos, e ela está certa:
   * quando a moeda varia por linha, não existe uma máscara só que sirva para
   * todas. Número puro numa coluna, código ISO na outra, e a soma continua
   * funcionando.
   */
  const colunasDaSaida = campos.flatMap(c =>
    c.tipo === 'EnCurrency'
      ? [{ campo: c, iso: false }, { campo: c, iso: true }]
      : [{ campo: c, iso: false }],
  )

  const abaDaSaida: Aba = {
    nome: idioma.value === 'en' ? 'Item output' : idioma.value === 'es' ? 'Salida de items' : 'Saida dos itens',
    larguras: [34, ...colunasDaSaida.map(c => (c.iso ? 10 : Math.min(48, Math.round(c.campo.largura / 7))))],
    linhas: [
      [
        t.value.referencia,
        ...colunasDaSaida.map(c =>
          c.iso ? `${t.value.campos[c.campo.tipo].rotulo} (ISO)` : t.value.campos[c.campo.tipo].rotulo,
        ),
      ] as Celula[],
      ...itens.value.map(item => [
        item.reference,
        ...colunasDaSaida.map((c): Celula => {
          const bruto = (item.data as Record<string, unknown>)?.[c.campo.refId]
          if (!c.iso) return celulaDeExportacao(c.campo, bruto, idioma.value, opcoes as never)
          return (bruto as { currency?: string } | null)?.currency ?? ''
        }),
      ] as Celula[]),
    ],
  }

  baixar(gerarXlsx([abaDoPadrao, abaDaSaida], idioma.value), `${t.value.relatorioNome}.xlsx`)
  gerando.value = false
  toast.add({ title: t.value.relatorioPronto, icon: 'i-lucide-file-down', color: 'success' })
}

/* Esc fecha a ficha, depois o painel. No develop de hoje o modal não fecha
   com Esc, e isso está registrado como achado no BRIEFING.md. */
onMounted(() => {
  const aoTeclar = (e: KeyboardEvent) => {
    if (e.key !== 'Escape') return
    if (fichaAberta.value) fichaAberta.value = false
    else if (itemAberto.value) itemAberto.value = null
  }
  window.addEventListener('keydown', aoTeclar)
  onUnmounted(() => window.removeEventListener('keydown', aoTeclar))
})
</script>

<template>
  <div class="flex h-dvh flex-col">
    <!-- ══════════════════════ ANDAIME (não é produto) ══════════════════════ -->
    <div class="flex shrink-0 flex-wrap items-center gap-3 border-b border-default bg-elevated/60 px-3 py-2">
      <span class="text-xs font-semibold uppercase tracking-wider text-muted">
        {{ t.andaimeTitulo }}
      </span>

      <span class="flex items-center gap-2">
        <span class="text-xs font-semibold uppercase tracking-wider text-toned">{{ t.faceta }}</span>
        <div class="flex rounded-md border border-default p-0.5">
          <UButton
            v-for="f in facetasPossiveis"
            :key="f"
            :label="t.facetas[f]"
            :icon="f === 'tabela' ? 'i-lucide-table-2' : f === 'formulario' ? 'i-lucide-square-pen' : 'i-lucide-panel-right'"
            size="xs"
            :color="faceta === f ? 'primary' : 'neutral'"
            :variant="faceta === f ? 'soft' : 'ghost'"
            @click="irPara(f)"
          />
        </div>
      </span>

      <span class="flex items-center gap-2">
        <span class="text-xs font-semibold uppercase tracking-wider text-toned">{{ t.estado }}</span>
        <div class="flex rounded-md border border-default p-0.5">
          <UButton
            v-for="e in estadosPossiveis"
            :key="e"
            :label="t.estados[e]"
            size="xs"
            :color="estado === e ? 'primary' : 'neutral'"
            :variant="estado === e ? 'soft' : 'ghost'"
            @click="estado = e"
          />
        </div>
      </span>

      <!--
        O interruptor de permissão. Ele existe no andaime porque a diferença
        entre PREENCHER o campo e CONFIGURAR o campo é uma decisão de produto,
        e ela precisa estar visível: com ele desligado, o "⋯" das opções some
        da célula e sobra só escolher.
      -->
      <USwitch
        v-model="podeConfigurar"
        :label="t.podeConfigurar"
        size="sm"
        :ui="{ label: 'text-xs uppercase tracking-wider text-toned' }"
      />

      <UButton
        icon="i-lucide-file-spreadsheet"
        :label="gerando ? t.gerandoRelatorio : t.baixarRelatorio"
        :loading="gerando"
        color="neutral"
        variant="outline"
        size="xs"
        @click="baixarRelatorio"
      />

      <ControlesDePrototipo />

      <span class="ml-auto hidden items-center gap-1.5 text-xs text-muted xl:flex">
        <UIcon name="i-lucide-mouse-pointer-click" class="size-3.5" />
        {{ t.facetaDica[faceta] }}
      </span>
    </div>

    <!-- ══════════════════════════ A TELA ══════════════════════════════════ -->
    <div class="min-h-0 flex-1">
      <CascaDeItens
        :t="t"
        :workspace="workspace.nome"
        :slug="workspace.slug"
        :categoria="categoria.nome"
      >
        <!-- As abas "Itens" e "+ Visualizar", como o develop mostra -->
        <div class="flex shrink-0 items-center gap-1 border-b border-default px-3 py-1.5">
          <UButton
            icon="i-lucide-table-2"
            :label="t.abaItens"
            color="primary"
            variant="soft"
            size="sm"
          />
          <UButton
            icon="i-lucide-plus"
            :label="t.abaVisualizar"
            color="neutral"
            variant="ghost"
            size="sm"
          />
        </div>

        <!--
          A tela dedicada do item, que o "Editar" do menu abre. É a MESMA
          estrutura da visão rápida, em página inteira: cru na coluna da
          esquerda, formulário na parte de dentro. Medido no develop em
          22/09/2026, em /types/<slug>/<REFERENCE>.
        -->
        <div v-if="telaDoItem" class="flex min-h-0 flex-1 flex-col">
          <div class="flex shrink-0 items-center gap-2 border-b border-default px-3 py-1.5">
            <UButton
              icon="i-lucide-arrow-left"
              :label="t.voltarParaLista"
              color="neutral"
              variant="ghost"
              size="sm"
              @click="telaDoItem = null; faceta = 'tabela'"
            />
            <UBadge color="neutral" variant="subtle" size="sm">{{ t.telaDedicada }}</UBadge>
          </div>
          <PainelDoItem
            :item="telaDoItem"
            :campos="campos"
            :categoria="categoria.nome"
            :t="t"
            :idioma="idioma"
            :indice="itens.findIndex(i => i.id === telaDoItem?.id) + 1"
            :total="itens.length"
            :campo-selecionado="tipoNaFicha"
            em-pagina-inteira
            @fechar="telaDoItem = null; faceta = 'tabela'"
            @navegar="(p: number) => { const i = itens.findIndex(x => x.id === telaDoItem?.id) + p; if (i >= 0 && i < itens.length) telaDoItem = itens[i]! }"
            @inspecionar="inspecionar"
            @editar-valor="(refId: string, valor: unknown) => telaDoItem && editarValor(telaDoItem, refId, valor)"
            @salvar="(d: Record<string, unknown>) => { if (telaDoItem) { itens = itens.map(i => i.id === telaDoItem?.id ? { ...i, data: d, updated_at: new Date() } : i); toast.add({ title: t.salvo, icon: 'i-lucide-check', color: 'success' }) } }"
          />
        </div>

        <div v-else class="flex min-h-0 flex-1">
          <div class="flex min-w-0 flex-1 flex-col">
            <!-- erro e sem permissão substituem a tabela inteira -->
            <UEmpty
              v-if="estado === 'erro'"
              icon="i-lucide-cloud-alert"
              :title="t.erroTitulo"
              :description="t.erroTexto"
              class="m-auto"
            >
              <template #actions>
                <UButton
                  icon="i-lucide-rotate-cw"
                  :label="t.erroAcao"
                  color="neutral"
                  variant="outline"
                  size="sm"
                  @click="estado = 'cheio'"
                />
              </template>
            </UEmpty>

            <UEmpty
              v-else-if="estado === 'bloqueado'"
              icon="i-lucide-lock"
              :title="t.semPermissaoTitulo"
              :description="t.semPermissaoTexto"
              class="m-auto"
            />

            <TabelaDeItens
              v-else
              :campos="campos"
              :itens="itensVisiveis"
              :t="t"
              :idioma="idioma"
              :total="estado === 'vazio' ? 0 : categoria.totalDeItens"
              :carregando="estado === 'carregando'"
              :campo-selecionado="tipoNaFicha"
              @inspecionar="inspecionar"
              @abrir-item="abrirItem"
              @abrir-tela-do-item="abrirTelaDoItem"
              @editar-valor="editarValor"
              @novo-item="irPara('formulario')"
              :pode-configurar="podeConfigurar"
              @criar-na-linha="criarItem"
              @comentar-no-campo="comentarNoCampo"
            />
          </div>

          <PainelDoItem
            v-if="itemAberto"
            :item="itemAberto"
            :campos="campos"
            :categoria="categoria.nome"
            :t="t"
            :idioma="idioma"
            :indice="indiceDoItem"
            :total="itens.length"
            :campo-selecionado="tipoNaFicha"
            @fechar="itemAberto = null"
            @navegar="navegar"
            @inspecionar="inspecionar"
            @editar-valor="(refId: string, valor: unknown) => itemAberto && editarValor(itemAberto, refId, valor)"
            @salvar="salvarItem"
          />
        </div>
      </CascaDeItens>
    </div>

    <ModalNovoItem
      v-model:aberto="modalAberto"
      :campos="campos"
      :t="t"
      :idioma="idioma"
      @criar="criarItem"
      @inspecionar="inspecionar"
    />

    <FichaDoCampo
      v-model:aberta="fichaAberta"
      :campo="campoNaFicha"
      :valor="valorNaFicha"
      :itens="itens"
      :t="t"
      :idioma="idioma"
    />

    <PainelDeContexto
      :briefing="briefingMd"
      :pesquisa="pesquisaMd"
      :decisoes="decisoesMd"
      repositorio="https://github.com/pernalombr4/prototipos/tree/main/app/pages/padrao-dos-campos"
    />
  </div>
</template>
