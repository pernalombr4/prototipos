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
import { campoPorTipo, campos, type TipoDeCampo } from './campos'
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
}

function navegar(passo: number) {
  const i = indiceDoItem.value - 1 + passo
  if (i >= 0 && i < itens.value.length) itemAberto.value = itens.value[i]!
}

function criarItem(dados: Record<string, unknown>) {
  const agora = new Date()
  itens.value = [
    {
      id: 47700 + itens.value.length,
      reference: `VITR${Math.random().toString(16).slice(2, 12).toUpperCase()}`,
      created_at: agora,
      updated_at: agora,
      deleted_at: null,
      status: 'active',
      data: dados,
    } as Item,
    ...itens.value,
  ]
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
  const abaDaSaida: Aba = {
    nome: idioma.value === 'en' ? 'Item output' : idioma.value === 'es' ? 'Salida de items' : 'Saida dos itens',
    larguras: [34, ...campos.map(c => Math.min(48, Math.round(c.largura / 7)))],
    linhas: [
      [t.value.referencia, ...campos.map(c => t.value.campos[c.tipo].rotulo)] as Celula[],
      ...itens.value.map(item => [
        item.reference,
        ...campos.map(c =>
          celulaDeExportacao(c, (item.data as Record<string, unknown>)?.[c.refId], idioma.value, opcoes as never),
        ),
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
        {{ t.dicaDeUso }}
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

        <div class="flex min-h-0 flex-1">
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
              @novo-item="modalAberto = true"
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
