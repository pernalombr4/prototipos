<script setup lang="ts">
/**
 * O link do campo HTML. PROPOSTA.
 *
 * Um campo só, como no Notion e na Tiptap: colar um endereço ou digitar o
 * nome de um item do workspace. A lista embaixo mostra o link digitado e os
 * itens que batem com a busca; setas escolhem, Enter aplica, Esc fecha.
 * Com o cursor num link, abre já preenchido, com Abrir, Copiar e Remover.
 *
 * Sem trecho selecionado, o link entra com o nome do item (ou o endereço)
 * como texto. O endereço é normalizado: "enspace.io" vira "https://enspace.io"
 * e e-mail vira "mailto:" (regra que veio de padrao-dos-campos).
 *
 * Por que não o `kind: 'link'` do Nuxt UI: o handler dele chama o `prompt()`
 * do navegador, em inglês e fora do tema.
 */
import type { Editor } from '@tiptap/core'
import type { Textos } from './textos'
import { itensParaLink } from './mocks'

const props = withDefaults(defineProps<{
  t: Textos
  editor: Editor
  portal?: boolean
  tamanho?: 'xs' | 'sm'
}>(), { portal: true, tamanho: 'sm' })

const aberto = defineModel<boolean>('open', { default: false })
const toast = useToast()

const busca = ref('')
const destaque = ref(0)
const hrefAtual = ref('')

const versao = ref(0)
const avancar = () => { versao.value++ }
onMounted(() => props.editor.on('transaction', avancar))
onBeforeUnmount(() => props.editor.off('transaction', avancar))
const ehLink = () => { void versao.value; return props.editor.isActive('link') }

function normalizar(valor: string): string {
  const limpo = valor.trim()
  if (!limpo) return ''
  if (/^(https?:|mailto:|tel:|\/)/i.test(limpo)) return limpo
  if (limpo.includes('@') && !limpo.includes('/')) return `mailto:${limpo}`
  return `https://${limpo}`
}
const pareceEndereco = (s: string) => /^(https?:\/\/|www\.)|^[^\s]+\.[a-z]{2,}(\/|$)|@/i.test(s.trim())

const enderecoDoItem = (ref: string) => `/workspaces/enspace-releases/items/${ref}`

interface Opcao { tipo: 'url' | 'item', rotulo: string, detalhe: string, href: string, icone: string }

const opcoes = computed<Opcao[]>(() => {
  const q = busca.value.trim()
  const lista: Opcao[] = []
  if (q && pareceEndereco(q)) lista.push({ tipo: 'url', rotulo: normalizar(q), detalhe: props.t.link.colar, href: normalizar(q), icone: 'i-lucide-globe' })
  const termo = q.toLowerCase()
  // Endereço colado não busca item; nome digitado busca no título e na categoria.
  const itens = pareceEndereco(q)
    ? []
    : itensParaLink.filter(i => !termo || i.titulo.toLowerCase().includes(termo) || i.categoria.toLowerCase().includes(termo)).slice(0, 5)
  for (const i of itens) lista.push({ tipo: 'item', rotulo: i.titulo, detalhe: i.categoria, href: enderecoDoItem(i.ref), icone: 'i-lucide-file-text' })
  return lista
})
watch(busca, () => { destaque.value = 0 })

/* Ao abrir: estica a seleção para o link inteiro e preenche o campo. */
watch(aberto, (v) => {
  if (!v) return
  if (props.editor.isActive('link')) {
    props.editor.chain().extendMarkRange('link').run()
    hrefAtual.value = (props.editor.getAttributes('link').href as string) ?? ''
  }
  else {
    hrefAtual.value = ''
  }
  busca.value = hrefAtual.value
  destaque.value = 0
})

function aplicar(op?: Opcao) {
  const escolhida = op ?? opcoes.value[destaque.value]
  const href = escolhida?.href ?? normalizar(busca.value)
  if (!href) return
  const { empty } = props.editor.state.selection
  const cadeia = props.editor.chain().focus()
  if (empty && !props.editor.isActive('link')) {
    const texto = escolhida?.tipo === 'item' ? escolhida.rotulo : href.replace(/^mailto:/, '')
    cadeia.insertContent({ type: 'text', text: texto, marks: [{ type: 'link', attrs: { href } }] }).insertContent(' ')
  }
  else {
    cadeia.extendMarkRange('link').setLink({ href })
  }
  cadeia.run()
  aberto.value = false
}

function remover() {
  props.editor.chain().focus().extendMarkRange('link').unsetLink().run()
  aberto.value = false
}

async function copiar() {
  try { await navigator.clipboard.writeText(hrefAtual.value) }
  catch { /* sem permissão de área de transferência: o aviso sai igual */ }
  toast.add({ title: props.t.link.copiado, icon: 'i-lucide-check', color: 'success', duration: 2000 })
}

function teclar(e: KeyboardEvent) {
  if (e.key === 'ArrowDown') { e.preventDefault(); destaque.value = Math.min(destaque.value + 1, opcoes.value.length - 1) }
  else if (e.key === 'ArrowUp') { e.preventDefault(); destaque.value = Math.max(destaque.value - 1, 0) }
  else if (e.key === 'Enter') { e.preventDefault(); aplicar() }
}
</script>

<template>
  <UPopover v-model:open="aberto" :portal="portal" :content="{ align: 'start', sideOffset: 6 }">
    <UTooltip :text="t.editor.link" :kbds="['ctrl', 'k']">
      <UButton
        icon="i-lucide-link"
        color="neutral"
        variant="ghost"
        :size="tamanho"
        :active="ehLink()"
        active-color="primary"
        active-variant="soft"
        :aria-label="t.editor.link"
      />
    </UTooltip>

    <template #content>
      <div class="w-80 p-1.5">
        <UInput
          v-model="busca"
          :placeholder="t.link.placeholder"
          icon="i-lucide-link"
          size="sm"
          class="w-full"
          autofocus
          @keydown="teclar"
        />

        <ul v-if="opcoes.length" class="mt-1.5 flex flex-col" role="listbox" :aria-label="t.link.itens">
          <li v-for="(op, i) in opcoes" :key="op.href">
            <p v-if="op.tipo === 'item' && (i === 0 || opcoes[i - 1]!.tipo === 'url')" class="px-2 pb-0.5 pt-1 text-[11px] font-medium text-dimmed">
              {{ t.link.itens }}
            </p>
            <button
              type="button"
              role="option"
              :aria-selected="i === destaque"
              class="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors"
              :class="i === destaque ? 'bg-elevated text-highlighted' : 'text-default hover:bg-elevated/60'"
              @mouseenter="destaque = i"
              @click="aplicar(op)"
            >
              <UIcon :name="op.icone" class="size-4 shrink-0 text-muted" />
              <span class="min-w-0 flex-1 truncate">{{ op.rotulo }}</span>
              <span class="shrink-0 text-xs text-dimmed">{{ op.detalhe }}</span>
              <UKbd v-if="i === destaque" value="enter" size="sm" />
            </button>
          </li>
        </ul>
        <p v-else-if="busca.trim()" class="px-2 py-2 text-xs text-muted">{{ t.link.semResultado }}</p>

        <div v-if="hrefAtual" class="mt-1.5 flex items-center gap-1 border-t border-default px-1 pt-1.5">
          <UButton :label="t.link.abrir" icon="i-lucide-external-link" color="neutral" variant="ghost" size="xs" :to="hrefAtual" target="_blank" />
          <UButton :label="t.link.copiar" icon="i-lucide-copy" color="neutral" variant="ghost" size="xs" @click="copiar" />
          <UButton :label="t.link.remover" icon="i-lucide-unlink" color="error" variant="ghost" size="xs" class="ms-auto" @click="remover" />
        </div>
      </div>
    </template>
  </UPopover>
</template>
