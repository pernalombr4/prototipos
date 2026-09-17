<script setup lang="ts">
import type { TextosDaTela } from './textos'

/**
 * AJUDA: ícone na base, menu ao passar o mouse.
 *
 * Rodada 9, pedido dela: "ajuda em vez de ser um menu grande, deve ser um ícone
 * de ajuda na base que com hover abre um dropdown com as opções de suporte,
 * novidades, documentação".
 *
 * Por que isto está certo: Ajuda não é destino de trabalho. Ninguém abre o
 * ENSPACE para ir à Ajuda; vai-se lá quando algo travou. Um menu de primeiro
 * nível gastava uma linha inteira da barra, todos os dias, por um caminho que
 * se usa raramente. É o que o Notion, o monday e o Linear fazem: ícone de "?"
 * no canto de baixo, e o conteúdo dentro dele.
 *
 * O BENI saiu daqui. Ele era o primeiro item desta lista e virou "Chat de IA",
 * menu de primeiro nível, também por pedido dela. Ferramenta de trabalho não se
 * guarda no balcão de suporte.
 *
 * ACESSIBILIDADE. Hover sozinho reprova na WCAG 2.1.1: sem mouse o menu não
 * existiria. Então este é um `UDropdownMenu` de verdade, com botão, papel de
 * menu, setas e Esc, e o hover é um ATALHO por cima disso: quem passa o mouse
 * abre sem clicar, quem usa teclado abre com Enter, e os dois chegam ao mesmo
 * menu. O `portal false` mantém o conteúdo dentro deste bloco, senão o
 * `pointerleave` dispararia ao atravessar do ícone para o menu e ele fecharia
 * na cara da pessoa.
 */
const props = defineProps<{ t: TextosDaTela }>()

const emit = defineEmits<{ escolher: [rotulo: string] }>()

const aberto = ref(false)
let relogio: ReturnType<typeof setTimeout> | undefined

function entrar() {
  if (relogio) clearTimeout(relogio)
  aberto.value = true
}

/** Carência curta: atravessar do ícone até o menu não pode fechar o menu. */
function sair() {
  if (relogio) clearTimeout(relogio)
  relogio = setTimeout(() => { aberto.value = false }, 150)
}

onBeforeUnmount(() => { if (relogio) clearTimeout(relogio) })

const itens = computed(() => [[
  { label: props.t.suporte, icon: 'i-lucide-life-buoy', onSelect: () => emit('escolher', props.t.suporte) },
  { label: props.t.releases, icon: 'i-lucide-rocket', onSelect: () => emit('escolher', props.t.releases) },
  { label: props.t.documentacao, icon: 'i-lucide-book-open', onSelect: () => emit('escolher', props.t.documentacao) },
]])
</script>

<template>
  <div class="relative shrink-0" @pointerenter="entrar" @pointerleave="sair">
    <UDropdownMenu
      v-model:open="aberto"
      :items="itens"
      :portal="false"
      :content="{ side: 'top', align: 'end', sideOffset: 6 }"
    >
      <UButton
        icon="i-lucide-circle-question-mark"
        color="neutral"
        :variant="aberto ? 'soft' : 'ghost'"
        size="sm"
        :aria-label="props.t.ajuda"
      />
    </UDropdownMenu>
  </div>
</template>
