<script setup lang="ts">
import { useMenuDoWorkspace, type Atalho } from './estado'
import { chaveDoAtalho, useTrilha } from './trilha'
import { rotuloDoNo } from './rotulos'
import { MOLDURA } from './moldura'
import type { Categoria, NoDoMenu } from './mocks'
import type { TextosDaTela } from './textos'

/**
 * "ADICIONAR EM" (rodada 28): escolher um menu que já existe e pô-lo numa
 * seção, ou dentro de um menu como submenu.
 *
 * "temos: seçoes, menus, submenus. [...] dentro das seçoes colocar menus e
 *  dentro dos menus colocar submenus" e "trave o nivel: nao pode ter um
 *  submenu dentro de outro" (Mikaela, 20/10/2026).
 *
 * Uma janela só, para os 2 escopos da janela Personalizar:
 *  - Meu menu: põe um atalho na seção pessoal, ou um submenu num menu dela.
 *    Vale na hora. Qualquer menu que existe pode entrar, categoria inclusive.
 *  - Menu do workspace: MOVE o menu para a seção ou para dentro do menu, no
 *    rascunho, porque no workspace a mesma tela não mora em 2 lugares (sem
 *    reuso, decisão dela de 13/10). Só aparece o que a regra dos 3 níveis
 *    aceita: quem tem submenus não vira submenu.
 *
 * O pé tem "Criar menu", que é o único jeito de criar: o menu nasce com o
 * tipo de tela que a pessoa escolher.
 */
const props = defineProps<{
  t: TextosDaTela
  categorias: Categoria[]
  podeConfigurar: boolean
}>()

const menu = useMenuDoWorkspace()
const trilha = useTrilha()
const toast = useToast()

const pedido = computed(() => trilha.escolhendoMenu.value)
const aberta = computed({
  get: () => !!pedido.value,
  set: (v) => { if (!v) trilha.escolhendoMenu.value = null },
})

const rotuloDe = (n: NoDoMenu) => rotuloDoNo(n, props.t)

/** Todos os menus (telas) do workspace, com a seção onde moram e o menu-pai, se forem submenus. */
const telas = computed(() => menu.secoes.value.flatMap(s => (s.filhos ?? []).flatMap(f => [
  { no: f, secao: s, pai: null as NoDoMenu | null },
  ...(f.filhos ?? []).map(g => ({ no: g, secao: s, pai: f })),
])))

function fechar() {
  trilha.escolhendoMenu.value = null
}

/* ------------------------------ Meu menu ------------------------------ */

const presentesNoMeu = computed(() => {
  const p = pedido.value
  if (!p?.secaoId) return new Set<string>()
  const s = trilha.pessoal(p.secaoId)
  if (!s) return new Set<string>()
  if (p.menuChave) {
    const pai = s.itens.find(x => chaveDoAtalho(x) === p.menuChave)
    return new Set([p.menuChave, ...(pai?.filhos ?? []).map(chaveDoAtalho)])
  }
  return new Set(s.itens.map(chaveDoAtalho))
})

function escolherNoMeu(a: Atalho) {
  const p = pedido.value
  if (!p?.secaoId) return
  if (p.menuChave) trilha.adicionarSubmenu(p.secaoId, p.menuChave, a)
  else trilha.adicionarAtalho(p.secaoId, a)
  fechar()
}

/* --------------------------- Menu do workspace --------------------------- */

function escolherNoWorkspace(id: string) {
  const p = pedido.value
  if (!p) return
  const r = p.menuId ? menu.adicionarSubmenu(id, p.menuId) : menu.soltar(id, p.secaoId ?? '', 'dentro')
  if (!r.ok) {
    toast.add({ title: props.t.motivos[r.motivo] ?? '', icon: 'i-lucide-ban', color: 'error' })
    return
  }
  fechar()
}

/* ------------------------------ a lista ------------------------------ */

const grupos = computed(() => {
  const p = pedido.value
  if (!p) return []
  const t = props.t

  if (p.escopo === 'meu') {
    const livre = (a: Atalho) => !presentesNoMeu.value.has(chaveDoAtalho(a))
    const menus = [
      ...menu.destinos.value.map(d => ({ a: { tipo: 'destino' as const, id: d.id }, no: d, onde: undefined as string | undefined })),
      ...telas.value.map(x => ({ a: { tipo: 'tela' as const, id: x.no.id }, no: x.no, onde: t.ondeMora(x.pai ? rotuloDe(x.pai) : rotuloDe(x.secao)) })),
    ].filter(x => livre(x.a))
    const cats = props.categorias
      .map(c => ({ a: { tipo: 'categoria' as const, id: String(c.id) }, c }))
      .filter(x => livre(x.a))
    return [
      { id: 'menus', label: t.grupoTelas, items: menus.map(x => ({ label: rotuloDe(x.no), icon: x.no.icone, suffix: x.onde, onSelect: () => escolherNoMeu(x.a) })) },
      { id: 'categorias', label: t.grupoCategorias, items: cats.map(x => ({ label: x.c.name, icon: x.c.icon ?? 'i-lucide-folder', onSelect: () => escolherNoMeu(x.a) })) },
    ].filter(g => g.items.length)
  }

  // workspace: só o que a regra aceita mover para lá, e o que ainda não está lá
  const alvo = p.menuId ?? p.secaoId ?? ''
  const candidatos = telas.value.filter(x =>
    x.no.id !== alvo
    && (p.menuId ? x.pai?.id !== alvo : (x.secao.id !== alvo || !!x.pai))
    && menu.avaliar(x.no.id, alvo, 'dentro').ok,
  )
  return [{
    id: 'menus',
    label: t.grupoTelas,
    items: candidatos.map(x => ({
      label: rotuloDe(x.no),
      icon: x.no.icone,
      suffix: t.ondeMora(x.pai ? rotuloDe(x.pai) : rotuloDe(x.secao)),
      onSelect: () => escolherNoWorkspace(x.no.id),
    })),
  }].filter(g => g.items.length)
})

function criarMenu() {
  const p = pedido.value
  if (!p) return
  trilha.criandoMenu.value = p.escopo === 'workspace'
    ? (p.menuId ? `menu:${p.menuId}` : `secao:${p.secaoId}`)
    : 'inicio'
  fechar()
}
</script>

<template>
  <UModal
    v-model:open="aberta"
    :title="pedido ? props.t.escolherMenuEm(pedido.rotulo) : ''"
    :description="props.t.escolherMenuDica"
    :ui="{ content: MOLDURA.formulario, overlay: MOLDURA.sobreposicao, body: 'p-0 sm:p-0' }"
  >
    <template #body>
      <UCommandPalette :groups="grupos" :placeholder="props.t.buscarTelas" class="h-80">
        <template #empty>
          <p class="px-3 py-6 text-center text-sm text-muted">{{ props.t.nadaParaAdicionar }}</p>
        </template>
      </UCommandPalette>
    </template>
    <template #footer>
      <div class="flex w-full items-center justify-between gap-2">
        <UTooltip :text="props.podeConfigurar ? undefined : props.t.ctxSoQuemConfigura" :disabled="props.podeConfigurar">
          <span>
            <UButton
              :label="props.t.criarMenuTitulo"
              icon="i-lucide-plus"
              size="sm"
              color="neutral"
              variant="outline"
              :disabled="!props.podeConfigurar"
              @click="criarMenu"
            />
          </span>
        </UTooltip>
        <UButton :label="props.t.cancelar" size="sm" color="neutral" variant="ghost" @click="fechar" />
      </div>
    </template>
  </UModal>
</template>
