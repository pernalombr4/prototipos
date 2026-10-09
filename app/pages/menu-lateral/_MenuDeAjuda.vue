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
const props = withDefaults(defineProps<{
  t: TextosDaTela
  /**
   * RODADA 16, "esse menu aí de ajuda tá péssimo. olha o tamanho do ícone
   * frente aos outros onde ele tá posicionado" (Mikaela). Na trilha e na
   * barra recolhida ele era um botão pequeno (ícone de 16 px) entre a lupa e
   * o "+", que têm caixa de 36 px e ícone de 20 px. Agora ele toma a forma de
   * quem está do lado:
   *
   *   `linha`     no rodapé da barra aberta, ao lado de Configurações;
   *   `trilha`    caixa de 36 px, ícone de 20 px, igual à lupa da trilha;
   *   `coluna`    caixa de 40 px, ícone de 20 px, igual à barra recolhida.
   */
  formato?: 'linha' | 'trilha' | 'coluna'
}>(), { formato: 'linha' })

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
      :content="props.formato === 'linha' ? { side: 'top', align: 'end', sideOffset: 6 } : { side: 'right', align: 'end', sideOffset: 10 }"
    >
      <UButton
        v-if="props.formato === 'linha'"
        icon="i-lucide-circle-question-mark"
        color="neutral"
        :variant="aberto ? 'soft' : 'ghost'"
        size="sm"
        :aria-label="props.t.ajuda"
      />
      <button
        v-else
        type="button"
        class="flex shrink-0 items-center justify-center rounded-lg transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
        :class="[
          props.formato === 'trilha' ? 'size-9 text-default' : 'size-10 text-toned hover:text-highlighted',
          aberto ? 'bg-elevated' : 'hover:bg-elevated',
        ]"
        :aria-label="props.t.ajuda"
      >
        <UIcon name="i-lucide-circle-question-mark" class="size-5" />
      </button>
    </UDropdownMenu>
  </div>
</template>
