<script setup lang="ts">
/**
 * Editor de documentos: escolher entre ONLYOFFICE e Word, e um campo que diz
 * o que está acontecendo com o documento.
 *
 * A demanda (literal no BRIEFING.md): deixar a pessoa escolher, ao interagir
 * com o campo, se usa o ONLYOFFICE ou o Word; verificar se a limitação "só
 * Word para a web" é real; e melhorar o visual do campo e a jornada do
 * ONLYOFFICE.
 *
 * Uma porta só: a lista de contratos da categoria. Cada contrato mostra um
 * estado do campo (vazio, com documento, aberto no Word por outra pessoa,
 * alguém editando no ENSPACE, PDF). Tudo se percorre por dentro: visão rápida,
 * escolha do editor, editor no ENSPACE, abrir no Word, janela do Word
 * (maquete), versões e a configuração do campo.
 *
 * 100% front-end: o dado vem do `mocks.ts`, o estado mora em memória e
 * recarregar a página zera tudo.
 */
import type { DropdownMenuItem } from '@nuxt/ui'
import type { EnTableColumn } from '@be-enlighten/enspace-sdk-ui/base'
import CascaDeItens from './_CascaDeItens.vue'
import VisaoRapida from './_VisaoRapida.vue'
import EscolhaDeEditor from './_EscolhaDeEditor.vue'
import EditorNoEnspace from './_EditorNoEnspace.vue'
import AbrirNoWord from './_AbrirNoWord.vue'
import JanelaDoWord from './_JanelaDoWord.vue'
import PainelDeVersoes from './_PainelDeVersoes.vue'
import ConfiguracaoDoCampo from './_ConfiguracaoDoCampo.vue'
import Miniatura from './_Miniatura.vue'
import { type Editor, type ItemDoContrato, type StatusDoContrato, EU, campoDoDocumento, categoria, cenarios, workspace } from './mocks'
import { type EstadoDaTela, hora, nomeCurto, useDocumentos } from './estado'
import { textos } from './textos'
import { abrirNoWordDoComputador } from './arquivos'

import briefingMd from './BRIEFING.md?raw'
import decisoesMd from './DECISOES.md?raw'
import pesquisaMd from './PESQUISA.md?raw'

definePageMeta({
  titulo: 'Editor de documentos',
  descricao: 'Abrir o documento do item no ONLYOFFICE ou no Word, e um campo que diz quem editou, qual versão e quem está com ele agora.',
  status: 'em-revisao',
  atualizado: '2026-10-08',
  tela: 'Visão rápida do item, campo Editor de Documentos',
})

const t = useTextos(textos)
const idioma = useIdioma()

const {
  itens, itemAbertoId, estadoDaTela, suplementoInstalado, wordDeVerdade, preferencia, config,
  editorAberto, janelaDoWord, versoesAbertas, itemPorId, reiniciar,
} = useDocumentos()

/* ------------------------------ ANDAIME ------------------------------ */

const estadosPossiveis: EstadoDaTela[] = ['normal', 'carregando', 'erro', 'somenteLeitura']
const configAberta = ref(false)

/* ------------------------------ a lista ------------------------------ */

const busca = ref('')
const filtrados = computed(() => {
  const q = busca.value.trim().toLowerCase()
  if (!q) return itens.value
  return itens.value.filter(i => `${i.reference} ${i.data.contratante} ${i.data.minuta_do_contrato?.name ?? ''}`.toLowerCase().includes(q))
})

type Linha = { id: number, reference: string, status: StatusDoContrato, contratante: string, valor: number, minuta: string, item: ItemDoContrato }
const linhas = computed<Linha[]>(() => filtrados.value.map(i => ({
  id: i.id,
  reference: i.reference,
  status: i.data.status,
  contratante: i.data.contratante,
  valor: i.data.valor,
  minuta: i.data.minuta_do_contrato?.name ?? '',
  item: i,
})))

const colunas = computed<EnTableColumn[]>(() => [
  { key: 'reference', label: t.value.lista.referencia },
  { key: 'status', label: t.value.lista.status },
  { key: 'contratante', label: t.value.lista.contratante },
  { key: 'valor', label: t.value.lista.valor, align: 'right' },
  { key: 'minuta', label: campoDoDocumento.rotulo },
])

const corDoStatus: Record<StatusDoContrato, 'neutral' | 'warning' | 'info' | 'success'> = {
  'rascunho': 'neutral',
  'em-revisao': 'warning',
  'aguardando-assinatura': 'info',
  'assinado': 'success',
}

function moeda(v: number) {
  return new Intl.NumberFormat(idioma.value, { style: 'currency', currency: 'BRL' }).format(v)
}

function menuDaLinha(l: Linha): DropdownMenuItem[] {
  return [
    { label: t.value.lista.verDetalhes, icon: 'i-lucide-eye', onSelect: () => (itemAbertoId.value = l.id) },
    { label: t.value.lista.editar, icon: 'i-lucide-pencil', onSelect: () => (itemAbertoId.value = l.id) },
    { label: t.value.lista.lixeira, icon: 'i-lucide-trash-2', disabled: true },
    { label: t.value.lista.copiarLink, icon: 'i-lucide-link' },
  ]
}

/* ------------------------- abrir o documento ------------------------- */

const escolhaAberta = ref(false)
const escolhaPara = ref<number | null>(null)

const wordAberto = ref(false)
const wordPara = ref<number | null>(null)
const wordEditor = ref<'word-desktop' | 'word-web'>('word-desktop')
const copiaBaixada = ref(false)

const modoLeitura = ref(false)
const versaoEmLeitura = ref<number | null>(null)

const itemDoEditor = computed(() => (editorAberto.value !== null ? itemPorId(editorAberto.value) : null))
const editorSomenteLeitura = computed(() => {
  const d = itemDoEditor.value?.data.minuta_do_contrato
  const outraNoWord = !!d?.sessao && d.sessao.pessoa !== EU.id && d.sessao.editor !== 'onlyoffice'
  return modoLeitura.value || versaoEmLeitura.value !== null || estadoDaTela.value === 'somenteLeitura'
    || !config.value.editar || d?.ext === '.pdf' || outraNoWord
})

function abrir(itemId: number, editor: Editor | null, lembrar = true) {
  if (!editor) {
    escolhaPara.value = itemId
    escolhaAberta.value = true
    return
  }
  // O botão lembra o último editor escolhido pela seta.
  if (lembrar) preferencia.value = editor
  if (editor === 'onlyoffice') {
    modoLeitura.value = false
    versaoEmLeitura.value = null
    editorAberto.value = itemId
    return
  }
  wordPara.value = itemId
  wordEditor.value = editor
  // O Word de verdade abre aqui, dentro do clique: fora dele o navegador recusa.
  lancarWord(itemId, editor)
  wordAberto.value = true
}

const toast = useToast()
function lancarWord(itemId: number, editor: Editor) {
  if (editor !== 'word-desktop' || !wordDeVerdade.value) return
  const it = itemPorId(itemId)
  if (!it || it.data.minuta_do_contrato?.ext === '.pdf') return
  const d = it.data.minuta_do_contrato
  if (d?.sessao && d.sessao.pessoa !== EU.id) return
  if (abrirNoWordDoComputador(it) === 'download') toast.add({ title: t.value.word.baixadoToast, icon: 'i-lucide-download', color: 'info' })
}

function aoEscolher(editor: Editor, lembrar: boolean) {
  if (escolhaPara.value !== null) abrir(escolhaPara.value, editor, lembrar)
}

function ler(itemId: number, versao: number | null = null) {
  const total = itemPorId(itemId)?.data.minuta_do_contrato?.versoes.length ?? 0
  modoLeitura.value = true
  versaoEmLeitura.value = versao === total ? null : versao
  editorAberto.value = itemId
}

function verJanela(copia: boolean) {
  copiaBaixada.value = copia
  janelaDoWord.value = wordPara.value
}

function voltarAoWord(itemId: number) {
  lancarWord(itemId, 'word-desktop')
  // Sem o Word real ligado, voltar ao Word é voltar à simulação.
  if (!wordDeVerdade.value) verSimulacao(itemId)
}

function verSimulacao(itemId: number) {
  copiaBaixada.value = false
  janelaDoWord.value = itemId
}

const versoesAbertasModel = computed({
  get: () => versoesAbertas.value !== null,
  set: (v) => { if (!v) versoesAbertas.value = null },
})
const itemDasVersoes = computed(() => (versoesAbertas.value !== null ? itemPorId(versoesAbertas.value) : null))
</script>

<template>
  <div class="flex h-dvh flex-col">
    <!-- ══════════════════════════ A TELA ══════════════════════════════════ -->
    <div class="min-h-0 flex-1">
      <CascaDeItens :t="t" :workspace="workspace.nome" :slug="workspace.slug" :categoria="categoria.nome">
        <!-- abas Itens e + Visualizar (cópia) -->
        <div class="flex shrink-0 items-center gap-1 border-b border-default px-3 py-1.5">
          <UButton icon="i-lucide-table-2" :label="t.lista.abaItens" color="primary" variant="soft" size="sm" />
          <UButton icon="i-lucide-plus" :label="t.lista.abaVisualizar" color="neutral" variant="ghost" size="sm" />
        </div>

        <!-- barra da tabela (cópia) -->
        <div class="flex shrink-0 flex-wrap items-center gap-2 px-3 py-2">
          <UInput v-model="busca" icon="i-lucide-search" :placeholder="t.lista.pesquisar" variant="ghost" size="sm" class="w-56" />
          <UButton icon="i-lucide-calendar" :label="t.lista.criadoEm" color="neutral" variant="ghost" size="sm" />
          <UButton icon="i-lucide-arrow-up-down" :label="t.lista.todoPeriodo" color="neutral" variant="ghost" size="sm" />
          <span class="ml-auto flex items-center gap-1 pr-10">
            <UButton icon="i-lucide-file-down" color="neutral" variant="ghost" size="sm" aria-label="Exportar" />
            <UButton icon="i-lucide-columns-3" color="neutral" variant="ghost" size="sm" aria-label="Colunas" />
            <UButton icon="i-lucide-sliders-horizontal" color="neutral" variant="ghost" size="sm" aria-label="Filtros" />
            <UButton icon="i-lucide-plus" :label="t.lista.novoRegistro" color="primary" variant="soft" size="sm" />
          </span>
        </div>

        <div class="min-h-0 flex-1 overflow-auto px-3 pb-3">
          <EnTable
            :columns="colunas"
            :rows="linhas"
            selectable
            :pagination="{ page: 1, pageCount: 1, total: linhas.length }"
            :empty-state="{ icon: 'i-lucide-search-x', title: t.lista.nadaEncontrado }"
            :locale="idioma"
            @row-click="(r) => (itemAbertoId = (r as Linha).id)"
          >
            <template #cell-reference="{ row }">
              <UBadge color="info" variant="subtle" size="sm" class="font-mono text-[11px]">{{ (row as Linha).reference }}</UBadge>
            </template>
            <template #cell-status="{ row }">
              <UBadge :label="t.statusDoContrato[(row as Linha).status]" :color="corDoStatus[(row as Linha).status]" variant="subtle" size="sm" />
            </template>
            <template #cell-contratante="{ row }">
              <span class="block max-w-64 truncate text-sm text-highlighted" :title="(row as Linha).contratante">{{ (row as Linha).contratante }}</span>
            </template>
            <template #cell-valor="{ row }">
              <span class="text-sm tabular-nums text-toned">{{ moeda((row as Linha).valor) }}</span>
            </template>
            <!-- PROPOSTA: a célula do campo diz o estado do documento -->
            <template #cell-minuta="{ row }">
              <span v-if="!(row as Linha).item.data.minuta_do_contrato" class="text-sm text-dimmed">{{ t.lista.semDocumento }}</span>
              <span v-else class="flex max-w-80 items-center gap-2">
                <Miniatura :ext="(row as Linha).item.data.minuta_do_contrato!.ext ?? '.docx'" tamanho="sm" />
                <span class="min-w-0 truncate text-sm text-toned" :title="(row as Linha).minuta">{{ (row as Linha).minuta }}</span>
                <UTooltip
                  v-if="(row as Linha).item.data.minuta_do_contrato!.sessao"
                  :text="(row as Linha).item.data.minuta_do_contrato!.sessao!.editor === 'onlyoffice'
                    ? t.campo.editandoAgoraNoEnspace(nomeCurto((row as Linha).item.data.minuta_do_contrato!.sessao!.pessoa))
                    : (row as Linha).item.data.minuta_do_contrato!.sessao!.pessoa === EU.id
                      ? t.word.reservado
                      : t.campo.abertoPorOutraNoWord(nomeCurto((row as Linha).item.data.minuta_do_contrato!.sessao!.pessoa), hora((row as Linha).item.data.minuta_do_contrato!.sessao!.desde, idioma))"
                >
                  <UIcon
                    :name="(row as Linha).item.data.minuta_do_contrato!.sessao!.editor === 'onlyoffice' ? 'i-lucide-users' : 'i-lucide-lock-keyhole'"
                    class="size-3.5 shrink-0"
                    :class="(row as Linha).item.data.minuta_do_contrato!.sessao!.editor === 'onlyoffice' ? 'text-success' : (row as Linha).item.data.minuta_do_contrato!.sessao!.pessoa === EU.id ? 'text-primary' : 'text-warning'"
                  />
                </UTooltip>
                <span class="shrink-0 text-xs text-dimmed">v{{ (row as Linha).item.data.minuta_do_contrato!.versoes.length }}</span>
              </span>
            </template>
            <template #actions="{ row }">
              <UDropdownMenu :items="menuDaLinha(row as Linha)" :content="{ align: 'start' }">
                <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost" size="xs" :aria-label="t.lista.acoes" @click.stop />
              </UDropdownMenu>
            </template>
          </EnTable>
        </div>
      </CascaDeItens>
    </div>

    <!-- ════════════ ANDAIME (não é produto), na parte de baixo ════════════ -->
    <div class="flex shrink-0 flex-wrap items-center gap-3 border-t border-default bg-elevated/60 px-3 py-2">
      <span class="text-xs font-semibold uppercase tracking-wider text-muted">{{ t.andaime.titulo }}</span>

      <span class="flex items-center gap-2">
        <span class="text-xs font-semibold uppercase tracking-wider text-toned">{{ t.andaime.estado }}</span>
        <div class="flex rounded-md border border-default p-0.5">
          <UButton
            v-for="e in estadosPossiveis"
            :key="e"
            :label="t.andaime.estados[e]"
            size="xs"
            :color="estadoDaTela === e ? 'primary' : 'neutral'"
            :variant="estadoDaTela === e ? 'soft' : 'ghost'"
            @click="estadoDaTela = e"
          />
        </div>
      </span>

      <span class="flex items-center gap-2">
        <span class="text-xs font-semibold uppercase tracking-wider text-toned">{{ t.andaime.cenario }}</span>
        <div class="flex flex-wrap rounded-md border border-default p-0.5">
          <UButton
            v-for="c in cenarios"
            :key="c.chave"
            :label="t.andaime.cenarios[c.chave]"
            size="xs"
            :color="itemAbertoId === c.itemId ? 'primary' : 'neutral'"
            :variant="itemAbertoId === c.itemId ? 'soft' : 'ghost'"
            @click="itemAbertoId = c.itemId"
          />
        </div>
      </span>

      <USwitch v-model="wordDeVerdade" :label="t.andaime.wordDeVerdade" size="sm" :ui="{ label: 'text-xs uppercase tracking-wider text-toned' }" />
      <USwitch v-model="suplementoInstalado" :label="t.andaime.suplemento" size="sm" :ui="{ label: 'text-xs uppercase tracking-wider text-toned' }" />

      <UButton icon="i-lucide-settings-2" :label="t.andaime.configuracao" color="neutral" variant="outline" size="xs" @click="configAberta = true" />
      <UButton icon="i-lucide-rotate-ccw" :label="t.andaime.reiniciar" color="neutral" variant="ghost" size="xs" @click="reiniciar" />

      <ControlesDePrototipo />

      <span class="ml-auto flex items-center gap-2">
        <span class="flex items-center gap-1.5 text-xs text-muted">
          <UIcon name="i-lucide-mouse-pointer-click" class="size-3.5" />
          {{ t.andaime.dica }}
        </span>
        <PainelDeContexto :briefing="briefingMd" :pesquisa="pesquisaMd" :decisoes="decisoesMd" repositorio="https://github.com/pernalombr4/prototipos/tree/main/app/pages/editor-de-documentos" />
      </span>
    </div>

    <!-- ══════════════════════════ CAMADAS ═════════════════════════════════ -->
    <VisaoRapida
      :t="t"
      :idioma="idioma"
      @abrir="abrir"
      @ler="(id: number) => ler(id)"
      @versoes="(id: number) => (versoesAbertas = id)"
      @voltar-ao-word="voltarAoWord"
      @simulacao="verSimulacao"
    />

    <EscolhaDeEditor v-model:open="escolhaAberta" :t="t" @escolher="aoEscolher" />

    <EditorNoEnspace
      :t="t"
      :idioma="idioma"
      :categoria="categoria.nome"
      :rotulo-do-campo="campoDoDocumento.rotulo"
      :somente-leitura="editorSomenteLeitura"
      :versao="versaoEmLeitura"
      @trocar-para-word="itemDoEditor ? abrir(itemDoEditor.id, 'word-desktop') : (wordPara !== null && abrir(wordPara, 'word-desktop'))"
    />

    <AbrirNoWord
      v-model:open="wordAberto"
      :t="t"
      :item-id="wordPara"
      :editor="wordEditor"
      @ver-janela="verJanela"
      @editar-junto="wordPara !== null && abrir(wordPara, 'onlyoffice')"
    />

    <JanelaDoWord :t="t" :idioma="idioma" :workspace="workspace.nome" :rotulo-do-campo="campoDoDocumento.rotulo" :copia-baixada="copiaBaixada" />

    <USlideover v-model:open="versoesAbertasModel" side="right" :title="t.versoes.titulo" :description="itemDasVersoes?.data.minuta_do_contrato?.name" :ui="{ content: 'max-w-md' }">
      <template #body>
        <PainelDeVersoes
          v-if="itemDasVersoes"
          :item="itemDasVersoes"
          :t="t"
          :idioma="idioma"
          :somente-leitura="estadoDaTela === 'somenteLeitura' || !!itemDasVersoes.data.minuta_do_contrato?.sessao"
          @ver="(n: number) => { const id = itemDasVersoes!.id; versoesAbertas = null; ler(id, n) }"
        />
      </template>
    </USlideover>

    <ConfiguracaoDoCampo v-model:open="configAberta" :t="t" :idioma="idioma" />
  </div>
</template>
