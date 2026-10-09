<script setup lang="ts">
import { useTrilha } from './trilha'
import type { TextosDaTela } from './textos'

/**
 * CRIAR SEÇÃO (rodada 15), a janela do ClickUp: um botão de ícone e um campo
 * de nome, e um botão só, que acende quando há nome. A seção nova entra no
 * TOPO do Início.
 *
 * A mesma janela renomeia: o "…" da seção do ClickUp edita ícone e nome
 * dentro do próprio popover, mas campo de texto dentro de menu briga com a
 * busca por letra do menu (digitar "c" pula para "Criar seção"). Aqui fica a
 * janela, e isso está no DECISOES.md.
 */
const props = defineProps<{ t: TextosDaTela }>()

const trilha = useTrilha()
const toast = useToast()

const aberta = computed({
  get: () => trilha.criandoSecao.value !== null,
  set: (v) => { if (!v) trilha.criandoSecao.value = null },
})
const editando = computed(() => {
  const id = trilha.criandoSecao.value
  return id && id !== 'nova' ? trilha.pessoal(id) : undefined
})

const nome = ref('')
/** Nome do ícone sem o prefixo, como o seletor guarda. */
const icone = ref('layers')
const escolhendoIcone = ref(false)

watch(() => trilha.criandoSecao.value, () => {
  nome.value = editando.value?.rotulo ?? ''
  icone.value = editando.value?.icone.replace('i-lucide-', '') ?? 'layers'
})

function confirmar() {
  if (!nome.value.trim()) return
  const nomeDoIcone = `i-lucide-${icone.value}`
  if (editando.value) {
    trilha.renomearSecao(editando.value.id, nome.value, nomeDoIcone)
  }
  else {
    trilha.criarSecao(nome.value, nomeDoIcone)
    toast.add({ title: props.t.secaoCriada(nome.value.trim()), icon: nomeDoIcone, color: 'neutral' })
  }
  trilha.criandoSecao.value = null
}
</script>

<template>
  <UModal
    v-model:open="aberta"
    :title="editando ? props.t.renomearSecaoTitulo : props.t.criarSecaoTitulo"
    :ui="{ content: 'max-w-md' }"
  >
    <template #body>
      <form id="form-criar-secao" class="flex items-center gap-2" @submit.prevent="confirmar">
        <UPopover v-model:open="escolhendoIcone" :content="{ side: 'bottom', align: 'start' }">
          <UButton
            :icon="`i-lucide-${icone}`"
            color="neutral"
            variant="outline"
            square
            :aria-label="props.t.escolherIcone"
          />
          <template #content>
            <div class="w-80 p-2">
              <UxSeletorDeIcones v-model="icone" :altura="220" @update:model-value="escolhendoIcone = false" />
            </div>
          </template>
        </UPopover>
        <UInput
          v-model="nome"
          class="flex-1"
          :placeholder="props.t.criarSecaoPlaceholder"
          :aria-label="props.t.criarSecaoTitulo"
          autofocus
        />
      </form>
    </template>
    <template #footer>
      <UButton
        type="submit"
        form="form-criar-secao"
        block
        color="primary"
        :label="editando ? props.t.salvarSecao : props.t.criarSecaoBotao"
        :disabled="!nome.trim()"
      />
    </template>
  </UModal>
</template>
