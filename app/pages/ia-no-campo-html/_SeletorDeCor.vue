<script setup lang="ts">
/**
 * O botão "A" de cor, copiado do Notion atual (evidencias/ref-notion-cores.png):
 * um botão só, com "Usadas recentemente", "Cor do texto" (10 "A") e "Cor de
 * fundo" (10 quadrados). A 1ª de cada grade é a Padrão e tira a cor.
 * Ctrl Shift H repete a última (o campo cuida do atalho).
 *
 * `portal` desligado na barra flutuante: o conteúdo precisa ficar dentro da
 * bolha, senão o editor perde o foco e a bolha some com o popover aberto.
 */
import type { Editor } from '@tiptap/core'
import type { Textos } from './textos'
import type { Cor, CorUsada, Uso } from './paleta'
import { cores } from './paleta'

const props = withDefaults(defineProps<{
  t: Textos
  editor: Editor
  portal?: boolean
}>(), { portal: true })

const recentes = useState<CorUsada[]>('cores-recentes', () => [])

function aplicar(uso: Uso, cor: Cor) {
  const cadeia = props.editor.chain().focus()
  if (uso === 'texto') {
    if (cor.texto) cadeia.setColor(cor.texto)
    else cadeia.unsetColor()
  }
  else {
    if (cor.fundo) cadeia.setBackgroundColor(cor.fundo)
    else cadeia.unsetBackgroundColor()
  }
  cadeia.run()
  if (cor.nome !== 'padrao') {
    recentes.value = [{ uso, cor }, ...recentes.value.filter(r => !(r.uso === uso && r.cor.nome === cor.nome))].slice(0, 5)
  }
}

/* O editor não é reativo: cada transação avança um contador que o template lê. */
const versao = ref(0)
const avancar = () => { versao.value++ }
onMounted(() => props.editor.on('transaction', avancar))
onBeforeUnmount(() => props.editor.off('transaction', avancar))

/* A cor em uso no trecho, para marcar o quadrado certo e pintar o "A" do botão. */
function corAtual(uso: Uso) {
  void versao.value
  const attrs = props.editor.getAttributes('textStyle') as { color?: string, backgroundColor?: string }
  const valor = uso === 'texto' ? attrs.color : attrs.backgroundColor
  return cores.find(c => (uso === 'texto' ? c.texto : c.fundo) === (valor ?? null)) ?? cores[0]!
}

const nome = (c: Cor) => props.t.cores.nomes[c.nome]!
</script>

<template>
  <UPopover :portal="portal" :content="{ align: 'start', sideOffset: 6 }">
    <UTooltip :text="t.editor.cor" :kbds="['ctrl', 'shift', 'h']">
      <UButton color="neutral" variant="ghost" size="sm" class="gap-0.5 px-1.5" :aria-label="t.editor.cor">
        <span
          class="flex size-5 items-center justify-center rounded text-[13px] font-semibold leading-none ring-1 ring-default"
          :style="{ color: corAtual('texto').texto ?? undefined, background: corAtual('fundo').fundo ?? undefined }"
        >A</span>
        <UIcon name="i-lucide-chevron-down" class="size-3 text-muted" />
      </UButton>
    </UTooltip>

    <template #content>
      <div class="w-52 p-2.5" @mousedown.prevent>
        <template v-if="recentes.length">
          <p class="mb-1.5 text-xs font-medium text-muted">{{ t.cores.recentes }}</p>
          <div class="mb-3 flex gap-1.5">
            <UTooltip v-for="r in recentes" :key="r.uso + r.cor.nome" :text="r.uso === 'texto' ? t.cores.corDoTexto(nome(r.cor)) : t.cores.corDoFundo(nome(r.cor))">
              <button
                type="button"
                class="flex size-7 items-center justify-center rounded-md text-sm font-semibold ring-1 ring-default transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-primary"
                :style="r.uso === 'texto' ? { color: r.cor.texto ?? undefined } : { background: r.cor.fundo ?? undefined }"
                :aria-label="r.uso === 'texto' ? t.cores.corDoTexto(nome(r.cor)) : t.cores.corDoFundo(nome(r.cor))"
                @click="aplicar(r.uso, r.cor)"
              >
                <template v-if="r.uso === 'texto'">A</template>
              </button>
            </UTooltip>
          </div>
        </template>

        <p class="mb-1.5 text-xs font-medium text-muted">{{ t.cores.texto }}</p>
        <div class="mb-3 grid grid-cols-5 gap-1.5">
          <UTooltip v-for="c in cores" :key="'t' + c.nome" :text="c.nome === 'padrao' ? nome(c) : t.cores.corDoTexto(nome(c))">
            <button
              type="button"
              class="flex size-7 items-center justify-center rounded-md text-sm font-semibold ring-1 transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-primary"
              :class="corAtual('texto').nome === c.nome ? 'ring-2 ring-highlighted' : 'ring-default'"
              :style="{ color: c.texto ?? undefined }"
              :aria-label="c.nome === 'padrao' ? nome(c) : t.cores.corDoTexto(nome(c))"
              :aria-pressed="corAtual('texto').nome === c.nome"
              @click="aplicar('texto', c)"
            >A</button>
          </UTooltip>
        </div>

        <p class="mb-1.5 text-xs font-medium text-muted">{{ t.cores.fundo }}</p>
        <div class="grid grid-cols-5 gap-1.5">
          <UTooltip v-for="c in cores" :key="'f' + c.nome" :text="c.nome === 'padrao' ? nome(c) : t.cores.corDoFundo(nome(c))">
            <button
              type="button"
              class="size-7 rounded-md ring-1 transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-primary"
              :class="corAtual('fundo').nome === c.nome ? 'ring-2 ring-highlighted' : 'ring-default'"
              :style="{ background: c.fundo ?? undefined }"
              :aria-label="c.nome === 'padrao' ? nome(c) : t.cores.corDoFundo(nome(c))"
              :aria-pressed="corAtual('fundo').nome === c.nome"
              @click="aplicar('fundo', c)"
            />
          </UTooltip>
        </div>
      </div>
    </template>
  </UPopover>
</template>
